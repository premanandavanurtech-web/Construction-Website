"use client";

import { useState, useEffect } from "react";
import {
  X, UserCircle2, Globe, Phone, Mail, MapPin, Building2,
  CreditCard, Landmark, FileText, BadgeCheck, Hash,
  Download, ExternalLink, Clock, PlusCircle,
  ChevronDown, ChevronUp, IndianRupee, CalendarDays, History,
} from "lucide-react";
import type { VendorDoc } from "./AddVendorModal";

// ── Types ─────────────────────────────────────────────────────────────────────

export type Vendor = {
  id: string;
  profilePhoto: string;
  name: string;
  email: string;
  type: string;
  city: string;
  contactName: string;
  phone: string;
  gst: string;
  pan: string;
  bank: string;
  ifsc: string;
  acct: string;
  upi: string;
  documents: VendorDoc[];
  documentsCount: number;
  status: "Active" | "Inactive" | "In Progress";
  savedAt: number;
};

export type PaymentEntry = {
  id: string;
  amount: number;       // how much paid this time
  paidSoFar: number;    // running total after this payment
  balance: number;      // remaining after this payment
  date: string;         // date of this payment
  nextDueDate: string;  // next installment due
  note: string;
  paidAt: number;
};

type RawOrder = {
  id: string;
  invoiceNo?: string;
  vendorName?: string;
  orderedDate?: string;
  expectedDelivery?: string;
  total?: number;
  paymentStatus?: string;
  status?: string;
  paymentHistory?: PaymentEntry[];
};

type PORow = {
  poId: string;
  invoiceNo: string;
  totalAmount: number;
  paid: number;
  unpaid: number;
  dueDate: string;
  paymentStatus: "Pending" | "Paid" | "Partial";
  paymentHistory: PaymentEntry[];
};

interface Props {
  vendor: Vendor | null;
  onClose: () => void;
}

// ── localStorage ──────────────────────────────────────────────────────────────

function loadVendorPOs(vendorName: string): PORow[] {
  try {
    const raw = localStorage.getItem("purchase_orders_list");
    if (!raw) return [];
    const orders: RawOrder[] = JSON.parse(raw);
    return orders
      .filter((o) => (o.vendorName ?? "").toLowerCase().trim() === vendorName.toLowerCase().trim())
      .map((o) => {
        const total   = Number(o.total) || 0;
        const history = Array.isArray(o.paymentHistory) ? o.paymentHistory : [];
        const paid    = history.reduce((s, p) => s + Number(p.amount), 0);
        const unpaid  = Math.max(0, total - paid);
        return {
          poId:          o.id,
          invoiceNo:     o.invoiceNo ?? "",
          totalAmount:   total,
          paid,
          unpaid,
          dueDate:       o.expectedDelivery || o.orderedDate || "",
          paymentStatus: unpaid <= 0 ? "Paid" : paid > 0 ? "Partial" : "Pending",
          paymentHistory: history,
        };
      });
  } catch { return []; }
}

function addPaymentEntry(poId: string, amount: number, nextDueDate: string, note: string) {
  try {
    const raw = localStorage.getItem("purchase_orders_list");
    if (!raw) return;
    const orders: RawOrder[] = JSON.parse(raw);
    const updated = orders.map((o) => {
      if (o.id !== poId) return o;
      const total   = Number(o.total) || 0;
      const history = Array.isArray(o.paymentHistory) ? o.paymentHistory : [];
      const prevPaid = history.reduce((s, p) => s + Number(p.amount), 0);
      const newPaid  = prevPaid + amount;
      const entry: PaymentEntry = {
        id:          `pay_${Date.now()}`,
        amount,
        paidSoFar:   newPaid,
        balance:     Math.max(0, total - newPaid),
        date:        new Date().toISOString().split("T")[0],
        nextDueDate,
        note,
        paidAt:      Date.now(),
      };
      const newHistory = [...history, entry];
      const newStatus  = newPaid >= total ? "Paid" : newPaid > 0 ? "Partial" : "Pending";
      return { ...o, paymentHistory: newHistory, paymentStatus: newStatus };
    });
    localStorage.setItem("purchase_orders_list", JSON.stringify(updated));
  } catch {}
}

// ── Formatters ────────────────────────────────────────────────────────────────

function fmtTs(ts: number) {
  return new Date(ts).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
function fmtD(d: string) {
  if (!d) return "—";
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? d : dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
function fmtINR(n: number) {
  return "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}
function expiresIn(savedAt: number) {
  return Math.max(0, Math.ceil((7 * 86_400_000 - (Date.now() - savedAt)) / 86_400_000));
}
function isOverdue(d: string) { return d ? new Date(d) < new Date() : false; }
function fmtBytes(b: number) {
  if (b < 1024) return b + " B";
  if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
  return (b / 1048576).toFixed(1) + " MB";
}

// ── Add Payment Modal ─────────────────────────────────────────────────────────

function AddPaymentModal({ po, onClose, onSaved }: { po: PORow; onClose: () => void; onSaved: () => void }) {
  const [amount, setAmount]   = useState("");
  const [dueDate, setDueDate] = useState("");
  const [note, setNote]       = useState("");
  const [error, setError]     = useState("");

  // Live preview
  const amtNum    = parseFloat(amount) || 0;
  const newPaid   = po.paid + amtNum;
  const newUnpaid = Math.max(0, po.totalAmount - newPaid);

  const submit = () => {
    if (!amtNum || amtNum <= 0)           { setError("Enter a valid amount"); return; }
    if (amtNum > po.unpaid + 0.01)        { setError(`Max payable is ${fmtINR(po.unpaid)}`); return; }
    if (!dueDate)                         { setError("Select the next due date"); return; }
    addPaymentEntry(po.poId, amtNum, dueDate, note.trim());
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-base font-bold text-gray-800">Add Payments</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">

          {/* Row 1: Invoice + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Invoice</label>
              <div className="px-3 py-2.5 bg-gray-100 rounded-lg text-sm text-gray-700 font-medium">
                {po.invoiceNo || po.poId}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
              <div className={`px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between ${
                po.paymentStatus === "Paid" ? "bg-green-50 text-green-700"
                : po.paymentStatus === "Partial" ? "bg-blue-50 text-blue-700"
                : "bg-yellow-50 text-yellow-700"
              }`}>
                {po.paymentStatus}
                <ChevronDown className="w-4 h-4 opacity-50" />
              </div>
            </div>
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name</label>
            <div className="px-3 py-2.5 bg-gray-100 rounded-lg text-sm text-gray-700">
              {/* filled from vendor context via poId — passed in */}
              {po.poId}
            </div>
          </div>

          {/* Row: Paid + Balance — LIVE PREVIEW */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Paid</label>
              <div className={`px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${amtNum > 0 ? "bg-green-50 text-green-700 border border-green-200" : "bg-gray-100 text-gray-700"}`}>
                {fmtINR(amtNum > 0 ? newPaid : po.paid)}
                {amtNum > 0 && (
                  <span className="text-[11px] font-normal text-green-500 ml-1">(+{fmtINR(amtNum)})</span>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Balance</label>
              <div className={`px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${amtNum > 0 ? "bg-red-50 text-red-600 border border-red-100" : "bg-gray-100 text-gray-700"}`}>
                {fmtINR(amtNum > 0 ? newUnpaid : po.unpaid)}
                {amtNum > 0 && newUnpaid < po.unpaid && (
                  <span className="text-[11px] font-normal text-red-400 ml-1">(-{fmtINR(amtNum)})</span>
                )}
              </div>
            </div>
          </div>

          {/* Total */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Total</label>
            <div className="px-3 py-2.5 bg-gray-100 rounded-lg text-sm font-bold text-gray-800">
              {fmtINR(po.totalAmount)}
            </div>
          </div>

          {/* Amount to pay NOW */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Amount to Pay <span className="text-red-500">*</span>
              <span className="text-xs text-gray-400 font-normal ml-2">Remaining: {fmtINR(po.unpaid)}</span>
            </label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                autoFocus
                type="number"
                min="1"
                max={po.unpaid}
                placeholder={`e.g. ${Math.round(po.unpaid / 2)}`}
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setError(""); }}
                className="w-full pl-9 pr-3 py-2.5 bg-gray-100 rounded-lg text-sm border-2 border-transparent focus:border-slate-600 focus:outline-none focus:bg-white transition"
              />
            </div>
            {/* Quick % buttons */}
            <div className="grid grid-cols-4 gap-1.5 mt-2">
              {[25, 50, 75, 100].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => { setAmount(((po.unpaid * pct) / 100).toFixed(0)); setError(""); }}
                  className="py-1.5 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-slate-700 hover:text-white text-gray-500 transition"
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Due Date <span className="text-red-500">*</span>
              <span className="text-xs text-gray-400 font-normal ml-2">next payment due</span>
            </label>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => { setDueDate(e.target.value); setError(""); }}
                className="w-full pl-9 pr-3 py-2.5 bg-gray-100 rounded-lg text-sm border-2 border-transparent focus:border-slate-600 focus:outline-none focus:bg-white transition"
              />
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Note <span className="text-gray-400 font-normal text-xs">(optional)</span></label>
            <input
              type="text"
              placeholder="e.g. Cheque #1234, NEFT, Advance..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-100 rounded-lg text-sm border-2 border-transparent focus:border-slate-600 focus:outline-none focus:bg-white transition"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-xs px-3 py-2 rounded-lg font-medium">
              ⚠ {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="flex-1 py-2.5 bg-slate-700 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Payment History Panel ─────────────────────────────────────────────────────

function PaymentHistory({ history, total }: { history: PaymentEntry[]; total: number }) {
  return (
    <div className="mt-3 rounded-xl border border-gray-100 overflow-hidden">
      <div className="bg-gray-50 px-3 py-2 flex items-center gap-2 border-b border-gray-100">
        <History className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Payment History</span>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-5 px-3 py-1.5 bg-gray-50 border-b border-gray-100 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
        <span>#</span>
        <span>Paid</span>
        <span>Total Paid</span>
        <span>Balance</span>
        <span>Next Due</span>
      </div>

      <div className="divide-y divide-gray-50 bg-white">
        {history.map((entry, i) => (
          <div key={entry.id} className="grid grid-cols-5 items-center px-3 py-2.5 hover:bg-gray-50/50 transition-colors">
            {/* # */}
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                <span className="text-[9px] font-bold text-white">{i + 1}</span>
              </div>
            </div>

            {/* Amount paid this time */}
            <div>
              <p className="text-xs font-bold text-green-600">+{fmtINR(entry.amount)}</p>
              <p className="text-[10px] text-gray-400">{fmtD(entry.date)}</p>
            </div>

            {/* Running total paid */}
            <div>
              <p className="text-xs font-semibold text-gray-700">{fmtINR(entry.paidSoFar)}</p>
              <p className="text-[10px] text-gray-400">of {fmtINR(total)}</p>
            </div>

            {/* Balance remaining */}
            <div>
              <p className={`text-xs font-semibold ${entry.balance <= 0 ? "text-green-600" : "text-red-500"}`}>
                {entry.balance <= 0 ? "✓ Cleared" : fmtINR(entry.balance)}
              </p>
              {entry.note && <p className="text-[10px] text-gray-400 truncate">{entry.note}</p>}
            </div>

            {/* Next due */}
            <div className="flex items-center gap-1">
              <CalendarDays className="w-3 h-3 text-blue-400 shrink-0" />
              <span className={`text-[10px] font-semibold ${isOverdue(entry.nextDueDate) && entry.balance > 0 ? "text-red-500" : "text-blue-600"}`}>
                {fmtD(entry.nextDueDate)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PO Card ───────────────────────────────────────────────────────────────────

function POCard({ po, onAddPayment }: { po: PORow; onAddPayment: (po: PORow) => void }) {
  const [showHistory, setShowHistory] = useState(false);

  const lastEntry  = po.paymentHistory[po.paymentHistory.length - 1];
  const nextDue    = lastEntry?.nextDueDate || po.dueDate;
  const isFullPaid = po.paymentStatus === "Paid";
  const overdue    = !isFullPaid && isOverdue(nextDue);
  const progress   = po.totalAmount > 0 ? Math.min(100, (po.paid / po.totalAmount) * 100) : 0;

  const statusColors: Record<string, string> = {
    Paid:    "bg-green-100 text-green-700 border-green-200",
    Partial: "bg-blue-100 text-blue-700 border-blue-200",
    Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Overdue: "bg-red-100 text-red-700 border-red-200",
  };
  const displayStatus = overdue ? "Overdue" : po.paymentStatus;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100">
        <div
          className={`h-full transition-all duration-500 ${isFullPaid ? "bg-green-500" : progress > 0 ? "bg-blue-500" : "bg-gray-200"}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-4">

          {/* Left info */}
          <div className="flex-1 min-w-0">
            {/* PO ID + Invoice + Status */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">{po.poId}</span>
              {po.invoiceNo && <span className="text-xs text-gray-400">{po.invoiceNo}</span>}
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColors[displayStatus]}`}>
                {displayStatus}
              </span>
            </div>

            {/* Payment amounts — the core tracker */}
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="bg-gray-50 rounded-lg px-3 py-2">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Total</p>
                <p className="text-sm font-bold text-gray-800 mt-0.5">{fmtINR(po.totalAmount)}</p>
              </div>
              <div className="bg-green-50 rounded-lg px-3 py-2">
                <p className="text-[10px] text-green-500 uppercase tracking-wide font-semibold">Paid</p>
                <p className="text-sm font-bold text-green-700 mt-0.5">{fmtINR(po.paid)}</p>
              </div>
              <div className={`rounded-lg px-3 py-2 ${po.unpaid > 0 ? "bg-red-50" : "bg-gray-50"}`}>
                <p className={`text-[10px] uppercase tracking-wide font-semibold ${po.unpaid > 0 ? "text-red-400" : "text-gray-400"}`}>Unpaid</p>
                <p className={`text-sm font-bold mt-0.5 ${po.unpaid > 0 ? "text-red-600" : "text-gray-300"}`}>{fmtINR(po.unpaid)}</p>
              </div>
            </div>

            {/* % progress text */}
            <p className="text-[11px] text-gray-400 mt-2">
              {progress.toFixed(0)}% paid
              {!isFullPaid && nextDue && (
                <>
                  {" · "}
                  <span className={overdue ? "text-red-500 font-semibold" : "text-gray-500"}>
                    {overdue ? "⚠ Overdue · was due " : "Next due: "}
                    {fmtD(nextDue)}
                  </span>
                </>
              )}
              {isFullPaid && <span className="text-green-600 font-semibold"> · ✓ Fully cleared</span>}
            </p>
          </div>

          {/* Right actions */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            {!isFullPaid && (
              <button
                onClick={() => onAddPayment(po)}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-700 text-white text-xs font-bold rounded-xl hover:bg-slate-800 active:scale-95 transition shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Add Money
              </button>
            )}
            {po.paymentHistory.length > 0 && (
              <button
                onClick={() => setShowHistory((v) => !v)}
                className="flex items-center gap-1 text-xs font-medium text-blue-500 hover:text-blue-700 transition"
              >
                <History className="w-3.5 h-3.5" />
                {po.paymentHistory.length} payment{po.paymentHistory.length !== 1 ? "s" : ""}
                {showHistory ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            )}
          </div>
        </div>

        {/* History */}
        {showHistory && po.paymentHistory.length > 0 && (
          <PaymentHistory history={po.paymentHistory} total={po.totalAmount} />
        )}
      </div>
    </div>
  );
}

// ── Purchase Orders Section ───────────────────────────────────────────────────

function PurchaseOrdersSection({ vendorName }: { vendorName: string }) {
  const [rows, setRows]         = useState<PORow[]>([]);
  const [payingPO, setPayingPO] = useState<PORow | null>(null);

  const reload = () => setRows(loadVendorPOs(vendorName));
  useEffect(() => { reload(); }, [vendorName]);

  return (
    <>
      {payingPO && (
        <AddPaymentModal
          po={payingPO}
          onClose={() => setPayingPO(null)}
          onSaved={() => { reload(); setPayingPO(null); }}
        />
      )}

      <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Purchase Orders {rows.length > 0 && <span className="normal-case font-normal ml-1">({rows.length})</span>}
          </h3>
          {rows.length > 0 && (
            <div className="flex items-center gap-3 text-xs">
              <span className="text-gray-400">Total <span className="font-bold text-gray-700">{fmtINR(rows.reduce((s, r) => s + r.totalAmount, 0))}</span></span>
              <span className="text-green-600 font-bold">{fmtINR(rows.reduce((s, r) => s + r.paid, 0))} paid</span>
              {rows.reduce((s, r) => s + r.unpaid, 0) > 0 && (
                <span className="text-red-500 font-bold">{fmtINR(rows.reduce((s, r) => s + r.unpaid, 0))} due</span>
              )}
            </div>
          )}
        </div>

        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white border border-dashed border-gray-200 rounded-xl px-4 py-8 text-center">
            <FileText className="w-8 h-8 text-gray-200 mb-2" />
            <p className="text-sm text-gray-400">No purchase orders for this vendor</p>
            <p className="text-xs text-gray-300 mt-1">Orders created in the Purchase Orders section will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {rows.map((po) => (
              <POCard key={po.poId} po={po} onAddPayment={setPayingPO} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ── Shared sub-components ─────────────────────────────────────────────────────

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number | undefined | null }) {
  const display = value && String(value).trim() ? String(value) : "—";
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-[11px] text-gray-400 uppercase tracking-wide">{label}</p>
        <p className={`text-sm font-medium mt-0.5 break-all ${display === "—" ? "text-gray-300" : "text-gray-800"}`}>{display}</p>
      </div>
    </div>
  );
}
function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}
function StatCell({ label, value, badge }: { label: string; value: string; badge?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-3 px-2 text-center">
      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      {badge ? <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${badge}`}>{value}</span>
             : <p className="text-sm font-semibold text-gray-800">{value}</p>}
    </div>
  );
}
function DocCard({ doc }: { doc: VendorDoc }) {
  const isImg = doc.type.startsWith("image/"), isPdf = doc.type === "application/pdf";
  const open  = () => { const w = window.open(); if (w) { w.document.write(isImg ? `<html><body style="margin:0;background:#111;display:flex;align-items:center;justify-content:center;min-height:100vh"><img src="${doc.data}" style="max-width:100%;max-height:100vh"/></body></html>` : `<html><body style="margin:0;height:100vh"><iframe src="${doc.data}" style="width:100%;height:100%;border:none"/></body></html>`); w.document.close(); } };
  const dl    = () => { const a = document.createElement("a"); a.href = doc.data; a.download = doc.name; a.click(); };
  return (
    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-2.5 py-2 hover:border-gray-300 transition">
      <div className="w-8 h-8 rounded-lg bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
        {isImg ? <img src={doc.data} alt={doc.name} className="w-full h-full object-cover" /> : <FileText className={`w-4 h-4 ${isPdf ? "text-red-400" : "text-gray-400"}`} />}
      </div>
      <div className="flex-1 min-w-0"><p className="text-xs font-medium text-gray-800 truncate">{doc.name}</p><p className="text-[10px] text-gray-400">{fmtBytes(doc.size)}</p></div>
      <div className="flex gap-1 shrink-0">
        <button onClick={open} className="w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"><ExternalLink className="w-3 h-3" /></button>
        <button onClick={dl}   className="w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"><Download className="w-3 h-3" /></button>
      </div>
    </div>
  );
}

// ── Main Modal ────────────────────────────────────────────────────────────────

export default function VendorDetailModal({ vendor, onClose }: Props) {
  if (!vendor) return null;
  const days     = expiresIn(vendor.savedAt);
  const expBadge = days <= 1 ? "bg-red-50 text-red-600" : days <= 3 ? "bg-yellow-50 text-yellow-600" : "bg-gray-100 text-gray-500";
  const initials = vendor.name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">

        <div className="flex items-center justify-between px-6 py-3 border-b bg-white shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-400">{vendor.id}</span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${vendor.status === "Active" ? "bg-green-100 text-green-700" : vendor.status === "In Progress" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-500"}`}>{vendor.status}</span>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700 transition rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-700 px-6 pt-8 pb-16">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
            <div className="relative flex items-end gap-5">
              <div className="shrink-0">
                {vendor.profilePhoto ? <img src={vendor.profilePhoto} alt={vendor.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-white/30 shadow-xl" />
                  : <div className="w-20 h-20 rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center shadow-xl">{initials ? <span className="text-2xl font-bold text-white">{initials}</span> : <UserCircle2 className="w-10 h-10 text-white/60" />}</div>}
              </div>
              <div className="pb-1">
                <h2 className="text-xl font-bold text-white leading-tight">{vendor.name || "Unnamed Vendor"}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  {vendor.type && <span className="text-[11px] bg-white/15 text-white/90 px-2.5 py-0.5 rounded-full">{vendor.type}</span>}
                  {vendor.city && <span className="text-[11px] text-white/60 flex items-center gap-1"><MapPin className="w-3 h-3" />{vendor.city}</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="mx-6 -mt-8 relative z-10 mb-5">
            <div className="bg-white rounded-xl border border-gray-200 shadow-md grid grid-cols-3 divide-x divide-gray-100">
              <StatCell label="Added on" value={fmtTs(vendor.savedAt)} />
              <StatCell label="Expires in" value={`${days} day${days !== 1 ? "s" : ""}`} badge={expBadge} />
              <StatCell label="Documents" value={vendor.documentsCount > 0 ? `${vendor.documentsCount} file${vendor.documentsCount !== 1 ? "s" : ""}` : "None"} />
            </div>
          </div>

          <div className="px-6 pb-6 space-y-4">
            <SectionCard title="Contact Information">
              <DetailRow icon={<Mail className="w-3.5 h-3.5 text-gray-500"/>}     label="Email"          value={vendor.email} />
              <DetailRow icon={<Phone className="w-3.5 h-3.5 text-gray-500"/>}    label="Phone"          value={vendor.phone} />
              <DetailRow icon={<Phone className="w-3.5 h-3.5 text-gray-500"/>}    label="Contact Person" value={vendor.contactName} />
              <DetailRow icon={<Globe className="w-3.5 h-3.5 text-gray-500"/>}    label="Location"       value={vendor.city} />
            </SectionCard>
            <SectionCard title="Company Details">
              <DetailRow icon={<Building2 className="w-3.5 h-3.5 text-gray-500"/>} label="Vendor Type" value={vendor.type} />
              <DetailRow icon={<Hash className="w-3.5 h-3.5 text-gray-500"/>}      label="Vendor ID"   value={vendor.id} />
            </SectionCard>
            <SectionCard title="Tax & Compliance">
              <DetailRow icon={<BadgeCheck className="w-3.5 h-3.5 text-gray-500"/>} label="GST Number" value={vendor.gst} />
              <DetailRow icon={<CreditCard className="w-3.5 h-3.5 text-gray-500"/>} label="PAN Number" value={vendor.pan} />
            </SectionCard>
            <SectionCard title="Banking Information">
              <DetailRow icon={<Landmark className="w-3.5 h-3.5 text-gray-500"/>}  label="Bank Name"       value={vendor.bank} />
              <DetailRow icon={<Hash className="w-3.5 h-3.5 text-gray-500"/>}       label="Account Number" value={vendor.acct} />
              <DetailRow icon={<BadgeCheck className="w-3.5 h-3.5 text-gray-500"/>} label="IFSC Code"      value={vendor.ifsc} />
              <DetailRow icon={<CreditCard className="w-3.5 h-3.5 text-gray-500"/>} label="UPI ID"         value={vendor.upi} />
            </SectionCard>

            <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                Documents {vendor.documents?.length > 0 && <span className="normal-case font-normal text-gray-400">({vendor.documents.length})</span>}
              </h3>
              {(!vendor.documents || vendor.documents.length === 0)
                ? <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-lg px-4 py-3"><FileText className="w-5 h-5 text-gray-300 shrink-0" /><p className="text-sm text-gray-400">No documents attached</p></div>
                : <div className="grid grid-cols-2 gap-2">{vendor.documents.map((doc, i) => <DocCard key={i} doc={doc} />)}</div>}
            </div>

            <PurchaseOrdersSection vendorName={vendor.name} />
          </div>
        </div>

        <div className="px-6 py-3 border-t bg-white shrink-0 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 text-sm font-medium rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition">Close</button>
        </div>
      </div>
    </div>
  );
}