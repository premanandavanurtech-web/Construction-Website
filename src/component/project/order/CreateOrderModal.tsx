"use client";

import { useState, useEffect, useCallback } from "react";
import { loadOrders, SavedOrder, saveOrders } from "../../vendors/onboading/PurchaseOrdersTracking";


type Project = { id: string; name: string };

type VendorRow = {
  id: string;
  name: string;
  type: string;
  status: string;
  email?: string;
  phone?: string;
  city?: string;
  contactName?: string;
  gst?: string;
  pan?: string;
  bank?: string;
};

function loadApprovedVendors(): VendorRow[] {
  try {
    const raw = localStorage.getItem("vendor_list_main");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Handle both {value: [...]} and plain array formats
    const list: VendorRow[] = Array.isArray(parsed) ? parsed : (parsed.value ?? []);
    return list.filter((v) => v.status === "Active");
  } catch { return []; }
}

type OrderItem = {
  id: number;
  item: string;
  description: string;
  unit: string;
  unitCost: string;
  totalCost: string;
};

type OrderForm = {
  address: string;
  city: string;
  invoiceNo: string;
  phone: string;
  email: string;
  date: string;
  selectedProject: string;
  vendorName: string;
  vendorAddress: string;
  vendorShipping: string;
  vendorContact: string;
  vendorEmail: string;
  buyerName: string;
  buyerAddress: string;
  buyerShipping: string;
  buyerContact: string;
  buyerEmail: string;
  orderedDate: string;
  expectedDelivery: string;
  items: OrderItem[];
  comments: string;
  taxRate: string;
  signature: string;
};

const DRAFT_KEY = "create_order_draft";
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const defaultForm: OrderForm = {
  address: "", city: "", invoiceNo: "", phone: "", email: "", date: "",
  selectedProject: "",
  vendorName: "", vendorAddress: "", vendorShipping: "", vendorContact: "", vendorEmail: "",
  buyerName: "", buyerAddress: "", buyerShipping: "", buyerContact: "", buyerEmail: "",
  orderedDate: "", expectedDelivery: "",
  items: [{ id: 1, item: "", description: "", unit: "", unitCost: "", totalCost: "" }],
  comments: "", taxRate: "10", signature: "",
};

function loadDraft(): OrderForm | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.savedAt > ONE_WEEK_MS) {
      localStorage.removeItem(DRAFT_KEY);
      return null;
    }
    return parsed.data as OrderForm;
  } catch { return null; }
}

function saveDraft(data: OrderForm) {
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ savedAt: Date.now(), data })); } catch {}
}

function clearDraft() {
  try { localStorage.removeItem(DRAFT_KEY); } catch {}
}

function expiresInDays(): number | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Math.max(0, Math.ceil((ONE_WEEK_MS - (Date.now() - parsed.savedAt)) / 86_400_000));
  } catch { return null; }
}

function generatePOId(): string {
  const orders = loadOrders();
  const num = orders.length + 1;
  return `PO${String(num).padStart(3, "0")}`;
}

type Props = {
  open: boolean;
  onClose: () => void;
  projects?: Project[];
  editOrder?: SavedOrder | null;
};

export default function CreateOrderModal({ open, onClose, projects = [], editOrder }: Props) {
  const [form, setForm] = useState<OrderForm>(defaultForm);
  const [approvedVendors, setApprovedVendors] = useState<VendorRow[]>([]);
  const [hasDraft, setHasDraft] = useState(false);
  const [draftDays, setDraftDays] = useState<number | null>(null);
  const [savedToast, setSavedToast] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof OrderForm, string>>>({});

  useEffect(() => {
    if (!open) return;
    setApprovedVendors(loadApprovedVendors());
    if (editOrder) {
      // Populate form with existing order data
      setForm({
        address: editOrder.address,
        city: editOrder.city,
        invoiceNo: editOrder.invoiceNo,
        phone: editOrder.phone,
        email: editOrder.vendorEmail,
        date: editOrder.date,
        selectedProject: editOrder.selectedProject,
        vendorName: editOrder.vendorName,
        vendorAddress: editOrder.vendorAddress,
        vendorShipping: editOrder.vendorShipping,
        vendorContact: editOrder.vendorContact,
        vendorEmail: editOrder.vendorEmail,
        buyerName: editOrder.buyerName,
        buyerAddress: editOrder.buyerAddress,
        buyerShipping: editOrder.buyerShipping,
        buyerContact: editOrder.buyerContact,
        buyerEmail: editOrder.buyerEmail,
        orderedDate: editOrder.orderedDate,
        expectedDelivery: editOrder.expectedDelivery,
        items: editOrder.items,
        comments: editOrder.comments,
        taxRate: editOrder.taxRate,
        signature: editOrder.signature,
      });
      setHasDraft(false);
    } else {
      const draft = loadDraft();
      if (draft) {
        setForm(draft);
        setHasDraft(true);
        setDraftDays(expiresInDays());
      }
    }
  }, [open, editOrder]);

  // Auto-save draft (only for new orders, not edits)
  useEffect(() => {
    if (!open || editOrder) return;
    const timer = setTimeout(() => saveDraft(form), 500);
    return () => clearTimeout(timer);
  }, [form, open, editOrder]);

  const set = useCallback((field: keyof OrderForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const addItem = () =>
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { id: Date.now(), item: "", description: "", unit: "", unitCost: "", totalCost: "" }],
    }));

  const removeItem = (id: number) =>
    setForm((prev) => ({ ...prev, items: prev.items.filter((i) => i.id !== id) }));

  const updateItem = (id: number, field: keyof OrderItem, value: string) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((row) => {
        if (row.id !== id) return row;
        const updated = { ...row, [field]: value };
        if (field === "unitCost" || field === "unit") {
          const qty = parseFloat(field === "unit" ? value : updated.unit) || 0;
          const cost = parseFloat(field === "unitCost" ? value : updated.unitCost) || 0;
          updated.totalCost = qty && cost ? (qty * cost).toFixed(2) : updated.totalCost;
        }
        return updated;
      }),
    }));
  };

  const subtotal = form.items.reduce((s, r) => s + (parseFloat(r.totalCost) || 0), 0);
  const taxAmt = subtotal * ((parseFloat(form.taxRate) || 0) / 100);
  const total = subtotal + taxAmt;

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof OrderForm, string>> = {};
    if (!form.vendorName.trim()) newErrors.vendorName = "Vendor name is required";
    if (!form.invoiceNo.trim()) newErrors.invoiceNo = "Invoice number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const orders = loadOrders();

    if (editOrder) {
      // Update existing order
      const updated = orders.map((o) =>
        o.id === editOrder.id
          ? {
              ...o,
              address: form.address,
              city: form.city,
              invoiceNo: form.invoiceNo,
              phone: form.phone,
              date: form.date,
              selectedProject: form.selectedProject,
              vendorName: form.vendorName,
              vendorAddress: form.vendorAddress,
              vendorShipping: form.vendorShipping,
              vendorContact: form.vendorContact,
              vendorEmail: form.vendorEmail,
              buyerName: form.buyerName,
              buyerAddress: form.buyerAddress,
              buyerShipping: form.buyerShipping,
              buyerContact: form.buyerContact,
              buyerEmail: form.buyerEmail,
              orderedDate: form.orderedDate,
              expectedDelivery: form.expectedDelivery,
              items: form.items,
              comments: form.comments,
              taxRate: form.taxRate,
              signature: form.signature,
              subtotal,
              total,
            }
          : o
      );
      saveOrders(updated);
    } else {
      // Create new order
      const newOrder: SavedOrder = {
        id: generatePOId(),
        invoiceNo: form.invoiceNo,
        vendorName: form.vendorName,
        vendorEmail: form.vendorEmail,
        address: form.address,
        city: form.city,
        phone: form.phone,
        date: form.date,
        orderedDate: form.orderedDate,
        expectedDelivery: form.expectedDelivery,
        selectedProject: form.selectedProject,
        comments: form.comments,
        total,
        subtotal,
        taxRate: form.taxRate,
        items: form.items,
        vendorAddress: form.vendorAddress,
        vendorShipping: form.vendorShipping,
        vendorContact: form.vendorContact,
        buyerName: form.buyerName,
        buyerAddress: form.buyerAddress,
        buyerShipping: form.buyerShipping,
        buyerContact: form.buyerContact,
        buyerEmail: form.buyerEmail,
        signature: form.signature,
        status: "Active",
        paymentStatus: "Pending",
        createdAt: Date.now(),
      };
      saveOrders([...orders, newOrder]);
      clearDraft();
    }

    setForm(defaultForm);
    setHasDraft(false);
    onClose();
  };

  const handleSaveManually = () => {
    saveDraft(form);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
    setHasDraft(true);
    setDraftDays(7);
  };

  const handleClearDraft = () => {
    clearDraft();
    setForm(defaultForm);
    setHasDraft(false);
    setDraftDays(null);
  };

  if (!open) return null;

  const isEdit = !!editOrder;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-0 text-black z-50 flex justify-center items-start overflow-y-auto py-10">
        <div className="bg-white w-[900px] rounded-lg shadow-xl overflow-hidden">

          {/* Header */}
          <div className="bg-[#2F3E4E] text-white px-6 py-4 flex items-center justify-between">
            <span className="text-sm font-semibold">{isEdit ? "EDIT ORDER" : "CREATE ORDER"}</span>
            <div className="flex items-center gap-3">
              {!isEdit && hasDraft && draftDays !== null && (
                <span className="text-[11px] bg-white/15 text-white/80 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  Draft saved · expires in {draftDays}d
                </span>
              )}
              {savedToast && (
                <span className="text-[11px] bg-green-500/30 text-green-200 px-2.5 py-1 rounded-full">✓ Saved</span>
              )}
              {!isEdit && hasDraft && (
                <button onClick={handleClearDraft} className="text-[11px] text-white/50 hover:text-white/90 transition underline">
                  Clear draft
                </button>
              )}
            </div>
          </div>

          <div className="p-6 space-y-6 text-sm">

            {/* Basic Info */}
            <div className="grid grid-cols-3 gap-4">
              <Input label="Address" placeholder="Street address" value={form.address} onChange={(v) => set("address", v)} />
              <Input label="City" placeholder="City" value={form.city} onChange={(v) => set("city", v)} />
              <Input label="Invoice No." placeholder="INV-001" value={form.invoiceNo} onChange={(v) => set("invoiceNo", v)} error={errors.invoiceNo} required />
              <Input label="Phone" placeholder="Phone number" value={form.phone} onChange={(v) => set("phone", v)} />
              <Input label="Email" placeholder="Email" value={form.email} onChange={(v) => set("email", v)} />
              <Input label="Date" value={form.date} onChange={(v) => set("date", v)} type="date" />

              <div className="col-span-3">
                <label className="block mb-1 text-sm font-medium text-gray-700">Site / Project</label>
                <div className="relative">
                  <select
                    value={form.selectedProject}
                    onChange={(e) => set("selectedProject", e.target.value)}
                    className="w-full appearance-none bg-gray-100 rounded-md px-3 py-2 pr-10 text-sm text-gray-700 border border-transparent focus:border-[#2F3E4E] focus:outline-none cursor-pointer"
                  >
                    <option value="">— Select a project —</option>
                    {projects.length === 0
                      ? <option disabled>No projects created yet</option>
                      : projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)
                    }
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {form.selectedProject && (
                  <div className="mt-2 inline-flex items-center gap-2 bg-[#2F3E4E]/10 text-[#2F3E4E] text-xs font-medium px-3 py-1.5 rounded-full">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                    </svg>
                    {projects.find((p) => p.id === form.selectedProject)?.name}
                    <button onClick={() => set("selectedProject", "")} className="ml-1 text-[#2F3E4E]/60 hover:text-[#2F3E4E]">✕</button>
                  </div>
                )}
              </div>
            </div>

            {/* Vendor + Ship To */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <SectionTitle title="VENDOR INFORMATION" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    {/* ── Approved Vendor Dropdown ── */}
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Vendor Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={form.vendorName}
                        onChange={(e) => {
                          const selected = approvedVendors.find((v) => v.name === e.target.value);
                          if (selected) {
                            setForm((prev) => ({
                              ...prev,
                              vendorName:    selected.name,
                              vendorEmail:   selected.email    ?? prev.vendorEmail,
                              vendorContact: selected.contactName ?? prev.vendorContact,
                              vendorAddress: selected.city     ?? prev.vendorAddress,
                              phone:         selected.phone    ?? prev.phone,
                            }));
                          } else {
                            set("vendorName", e.target.value);
                          }
                          setErrors((prev) => ({ ...prev, vendorName: undefined }));
                        }}
                        className={`w-full appearance-none bg-gray-100 rounded-md px-3 py-2 pr-10 text-sm text-gray-700 border focus:outline-none focus:border-[#2F3E4E] cursor-pointer ${
                          errors.vendorName ? "border-red-400 bg-red-50" : "border-transparent"
                        }`}
                      >
                        <option value="">— Select approved vendor —</option>
                        {approvedVendors.length === 0 ? (
                          <option disabled>No approved vendors yet</option>
                        ) : (
                          approvedVendors.map((v) => (
                            <option key={v.id} value={v.name}>{v.name}</option>
                          ))
                        )}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {errors.vendorName && <p className="text-red-500 text-[11px] mt-0.5">{errors.vendorName}</p>}
                    {approvedVendors.length === 0 && (
                      <p className="text-[11px] text-amber-600 mt-1">⚠ No approved vendors. Approve vendors in the Vendor Onboarding section first.</p>
                    )}
                    {/* Selected vendor chip */}
                    {form.vendorName && (
                      <div className="mt-2 inline-flex items-center gap-2 bg-[#2F3E4E]/10 text-[#2F3E4E] text-xs font-medium px-3 py-1.5 rounded-full">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                        </svg>
                        {form.vendorName}
                        <button onClick={() => set("vendorName", "")} className="ml-1 text-[#2F3E4E]/60 hover:text-[#2F3E4E]">✕</button>
                      </div>
                    )}
                  </div>
                  <Input label="Address" value={form.vendorAddress} onChange={(v) => set("vendorAddress", v)} />
                  <Input label="Shipping Address" value={form.vendorShipping} onChange={(v) => set("vendorShipping", v)} />
                  <Input label="Contact" value={form.vendorContact} onChange={(v) => set("vendorContact", v)} />
                  <Input label="Email" value={form.vendorEmail} onChange={(v) => set("vendorEmail", v)} />
                </div>
              </div>
              <div>
                <SectionTitle title="SHIP TO" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <Input label="Buyer Name" value={form.buyerName} onChange={(v) => set("buyerName", v)} />
                  </div>
                  <Input label="Address" value={form.buyerAddress} onChange={(v) => set("buyerAddress", v)} />
                  <Input label="Shipping Address" value={form.buyerShipping} onChange={(v) => set("buyerShipping", v)} />
                  <Input label="Contact" value={form.buyerContact} onChange={(v) => set("buyerContact", v)} />
                  <Input label="Email" value={form.buyerEmail} onChange={(v) => set("buyerEmail", v)} />
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <Input label="Ordered Date" type="date" value={form.orderedDate} onChange={(v) => set("orderedDate", v)} />
              <Input label="Expected Delivery Date" type="date" value={form.expectedDelivery} onChange={(v) => set("expectedDelivery", v)} />
            </div>

            {/* Items */}
            <div>
              <SectionTitle title="ORDER ITEMS" />
              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      {["S.No", "Item", "Description", "Qty", "Unit Cost (₹)", "Total Cost (₹)", ""].map((h) => (
                        <th key={h} className="px-2 py-2 text-left font-semibold text-gray-600">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {form.items.map((row, idx) => (
                      <tr key={row.id} className="border-t">
                        <td className="px-2 py-2 text-gray-500 w-8">{idx + 1}</td>
                        <td className="px-2 py-2"><SmallInput value={row.item} onChange={(v) => updateItem(row.id, "item", v)} /></td>
                        <td className="px-2 py-2"><SmallInput value={row.description} onChange={(v) => updateItem(row.id, "description", v)} /></td>
                        <td className="px-2 py-2 w-16"><SmallInput value={row.unit} onChange={(v) => updateItem(row.id, "unit", v)} type="number" /></td>
                        <td className="px-2 py-2 w-28"><SmallInput value={row.unitCost} onChange={(v) => updateItem(row.id, "unitCost", v)} type="number" /></td>
                        <td className="px-2 py-2 w-28"><SmallInput value={row.totalCost} onChange={(v) => updateItem(row.id, "totalCost", v)} type="number" /></td>
                        <td className="px-2 py-2 text-center w-8">
                          <button
                            onClick={() => removeItem(row.id)}
                            disabled={form.items.length === 1}
                            className="text-red-400 hover:text-red-600 disabled:opacity-30"
                          >🗑</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button onClick={addItem} className="mt-2 text-xs text-[#2F3E4E] hover:underline">+ Add Item</button>
            </div>

            {/* Comments + Totals */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Purchase Order Comments</label>
                <textarea
                  className="w-full bg-gray-100 rounded-md p-2 h-24 text-sm border border-transparent focus:border-[#2F3E4E] focus:outline-none resize-none"
                  placeholder="Additional comments..."
                  value={form.comments}
                  onChange={(e) => set("comments", e.target.value)}
                />
              </div>
              <div className="text-sm space-y-2 pt-1">
                <div className="flex justify-between text-gray-600">
                  <span>Sub-total:</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span className="flex items-center gap-1">
                    Sales Tax (
                    <input
                      type="number"
                      value={form.taxRate}
                      onChange={(e) => set("taxRate", e.target.value)}
                      className="w-10 bg-gray-100 rounded px-1 text-center text-xs border border-transparent focus:border-[#2F3E4E] focus:outline-none"
                    />
                    %):
                  </span>
                  <span className="font-medium">₹{taxAmt.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-800 border-t pt-2">
                  <span>TOTAL:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Signature */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Signature By</label>
              <input
                className="w-full bg-gray-100 rounded-md px-3 py-2 text-sm border border-transparent focus:border-[#2F3E4E] focus:outline-none"
                placeholder="Enter signatory name..."
                value={form.signature}
                onChange={(e) => set("signature", e.target.value)}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center gap-3 px-6 py-4 border-t bg-gray-50">
            {!isEdit ? (
              <button
                onClick={handleSaveManually}
                className="px-4 py-2 text-sm text-[#2F3E4E] border border-[#2F3E4E]/30 rounded-md hover:bg-[#2F3E4E]/5 transition"
              >
                💾 Save Draft
              </button>
            ) : <div />}
            <div className="flex gap-3">
              <button onClick={onClose} className="px-5 py-2 border rounded-md text-sm hover:bg-gray-100 transition">Cancel</button>
              <button
                onClick={handleSubmit}
                className="px-5 py-2 bg-[#2F3E4E] text-white rounded-md text-sm hover:bg-[#3d5166] transition"
              >
                {isEdit ? "Update Order" : "Create Order"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function Input({ label, placeholder = "", value, onChange, type = "text", error, required }: {
  label: string; placeholder?: string; value: string;
  onChange: (v: string) => void; type?: string; error?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium text-gray-700">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-gray-100 rounded-md px-3 py-2 text-sm border focus:outline-none focus:border-[#2F3E4E] ${
          error ? "border-red-400 bg-red-50" : "border-transparent"
        }`}
      />
      {error && <p className="text-red-500 text-[11px] mt-0.5">{error}</p>}
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">{title}</div>;
}

function SmallInput({ value, onChange, type = "text" }: {
  value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-gray-100 rounded px-2 py-1 text-xs border border-transparent focus:border-[#2F3E4E] focus:outline-none"
    />
  );
}