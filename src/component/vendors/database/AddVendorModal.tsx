"use client";

import { useRef, useState, useEffect } from "react";
import { Upload, X, FileText, Image, File, Camera, UserCircle2 } from "lucide-react";

/* ─────────────────────────────────────────
   LocalStorage helpers — 1-week expiry
───────────────────────────────────────── */

const VENDOR_DRAFT_KEY  = "add_vendor_draft";
const ONE_WEEK_MS       = 7 * 24 * 60 * 60 * 1000;

/** Safe set — swallows QuotaExceededError silently */
function lsSet(key: string, value: any) {
  try {
    localStorage.setItem(key, JSON.stringify({ value, expiry: Date.now() + ONE_WEEK_MS }));
  } catch (e) {
    // Quota exceeded — clear stale keys and retry once
    try {
      for (const k of Object.keys(localStorage)) {
        try {
          const raw = localStorage.getItem(k);
          if (!raw) continue;
          const parsed = JSON.parse(raw);
          if (parsed?.expiry && Date.now() > parsed.expiry) localStorage.removeItem(k);
        } catch { /* ignore malformed items */ }
      }
      localStorage.setItem(key, JSON.stringify({ value, expiry: Date.now() + ONE_WEEK_MS }));
    } catch { /* still no space — skip silently */ }
  }
}

function lsGet(key: string) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() > parsed.expiry) { localStorage.removeItem(key); return null; }
    return parsed.value;
  } catch { return null; }
}

function lsDel(key: string) {
  localStorage.removeItem(key);
}

/**
 * Compress a photo to max 400×400 JPEG@82% via an offscreen canvas.
 * Returns a Promise so callers can await the compressed data URL.
 */
function compressPhoto(dataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    try {
      const img = new window.Image();
      img.onload = () => {
        const MAX = 400;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const w = Math.round(img.width  * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width  = w;
        canvas.height = h;
        canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = () => resolve(dataUrl); // fallback: use original
      img.src = dataUrl;
    } catch {
      resolve(dataUrl);
    }
  });
}

/* ─────────────────────────────────────────
   Industry options
───────────────────────────────────────── */

// const INDUSTRY_OPTIONS = [
//   "Agriculture & Farming", "Automotive", "Construction & Real Estate",
//   "Education & Training", "Electronics & Technology", "Energy & Utilities",
//   "Food & Beverages", "Healthcare & Pharmaceuticals", "Hospitality & Tourism",
//   "IT & Software Services", "Logistics & Transportation", "Manufacturing",
//   "Media & Entertainment", "Mining & Metals", "Retail & E-Commerce",
//   "Telecommunications", "Textile & Apparel", "Financial Services",
//   "Legal & Consulting", "Other",
// ];

/* ─────────────────────────────────────────
   Form shape
───────────────────────────────────────── */

const emptyForm = {
  profilePhoto: "",          // base64 data URL
  vendorName: "",
  vendorType: "",
  registrationNumber: "",

  companyAddress: "",
  city: "",
  state: "",
  pinCode: "",
  country: "",
  // industryType: "",
  // industryDescription: "",
  contactPersonName: "",
  phone: "",
  alternatePhone: "",
  email: "",
  gstNumber: "",
  panNumber: "",
  accountHolderName: "",
  bankName: "",
  accountNumber: "",
  ifscCode: "",
  upiId: "",
};

export type VendorFormData = typeof emptyForm;

/* ─────────────────────────────────────────
   File helpers
───────────────────────────────────────── */

function FileIcon({ file }: { file: File }) {
  if (file.type.startsWith("image/")) return <Image className="w-4 h-4 text-blue-400 shrink-0" />;
  if (file.type === "application/pdf")  return <FileText className="w-4 h-4 text-red-400 shrink-0" />;
  return <File className="w-4 h-4 text-gray-400 shrink-0" />;
}

function formatBytes(b: number) {
  if (b < 1024)    return b + " B";
  if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
  return (b / 1048576).toFixed(1) + " MB";
}

/* ─────────────────────────────────────────
   Modal
───────────────────────────────────────── */

export type VendorDoc = {
  name: string;
  type: string;
  size: number;
  data: string; // base64 data URL
};

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (form: VendorFormData, documents: VendorDoc[]) => void;
}

export default function AddVendorModal({ open, onClose, onSave }: Props) {
  const [form, setForm]           = useState<VendorFormData>(emptyForm);
  const [documents, setDocuments] = useState<File[]>([]);
  const [dragOver, setDragOver]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef              = useRef<HTMLInputElement>(null);
  const photoInputRef             = useRef<HTMLInputElement>(null);

  /* Restore draft on open (photo is stored compressed inside the draft) */
  useEffect(() => {
    if (open) {
      const saved = lsGet(VENDOR_DRAFT_KEY);
      if (saved) setForm(saved);
    }
  }, [open]);

  /* Auto-save draft — photo is already compressed so safe to include */
  useEffect(() => {
    if (open) lsSet(VENDOR_DRAFT_KEY, form);
  }, [form, open]);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  /* ── Profile photo ── */
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const compressed = await compressPhoto(reader.result as string);
      setForm((p) => ({ ...p, profilePhoto: compressed }));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const removePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setForm((p) => ({ ...p, profilePhoto: "" }));
  };

  /* ── Documents ── */
  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const fresh = Array.from(list).filter(
      (f) => !documents.find((d) => d.name === f.name && d.size === f.size)
    );
    setDocuments((p) => [...p, ...fresh]);
  };

  const removeFile = (i: number) =>
    setDocuments((p) => p.filter((_, idx) => idx !== i));

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const readFile = (file: File): Promise<VendorDoc> =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload  = () => resolve({ name: file.name, type: file.type, size: file.size, data: reader.result as string });
          reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
          reader.readAsDataURL(file);
        });

      const vendorDocs = await Promise.all(documents.map(readFile));
      onSave(form, vendorDocs);
      lsDel(VENDOR_DRAFT_KEY);
      setForm(emptyForm);
      setDocuments([]);
      onClose();
    } catch (err) {
      console.error("Document read error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    lsDel(VENDOR_DRAFT_KEY);
    setForm(emptyForm);
    setDocuments([]);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl flex flex-col max-h-[90vh]">

        {/* ── Header ── */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Add New Vendor</h2>
            <p className="text-xs text-gray-400 mt-0.5">Draft auto-saved · expires in 1 week</p>
          </div>
          <button onClick={handleCancel} className="p-1 text-gray-400 hover:text-gray-700 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-7">

          {/* ── Profile Photo ── */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Vendor / Contact Photo</h4>
            <div className="flex items-center gap-5">

              {/* Avatar circle */}
              <div className="relative shrink-0">
                <div
                  onClick={() => photoInputRef.current?.click()}
                  className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 overflow-hidden cursor-pointer
                             flex items-center justify-center bg-gray-50 hover:border-gray-400 transition group"
                >
                  {form.profilePhoto ? (
                    <img
                      src={form.profilePhoto}
                      alt="vendor"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCircle2 className="w-10 h-10 text-gray-300 group-hover:text-gray-400 transition" />
                  )}
                </div>

                {/* Camera badge */}
                <button
                  onClick={() => photoInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center
                             shadow hover:bg-gray-700 transition"
                >
                  <Camera className="w-3 h-3 text-white" />
                </button>

                {/* Remove badge */}
                {form.profilePhoto && (
                  <button
                    onClick={removePhoto}
                    className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center
                               shadow hover:bg-red-600 transition"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                )}

                <input
                  ref={photoInputRef}
                  type="file"
                  hidden
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handlePhotoChange}
                />
              </div>

              {/* Help text */}
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {form.profilePhoto ? "Photo uploaded" : "Upload a photo"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  PNG, JPG or WEBP · Recommended 400×400 px
                </p>
                <button
                  onClick={() => photoInputRef.current?.click()}
                  className="mt-2 text-xs font-medium text-gray-800 underline underline-offset-2 hover:text-gray-600"
                >
                  {form.profilePhoto ? "Change photo" : "Choose file"}
                </button>
              </div>
            </div>
          </div>

          {/* Vendor Details */}
          <Section title="Vendor Details">
            <Input label="Vendor Company Name *" name="vendorName"          value={form.vendorName}          onChange={handleChange} />
            <Input label="Vendor Type"            name="vendorType"          value={form.vendorType}          onChange={handleChange} placeholder="e.g. Supplier, Contractor" />
            <Input label="Registration / Licence" name="registrationNumber" value={form.registrationNumber} onChange={handleChange} />
                      </Section>

          {/* Company Address */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Company Address</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Street Address</label>
                <input
                  name="companyAddress"
                  value={form.companyAddress}
                  onChange={handleChange}
                  placeholder="Building, Street, Area"
                  className="w-full h-9 rounded-lg bg-gray-100 px-3 text-sm outline-none focus:ring-2 focus:ring-gray-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="City"             name="city"    value={form.city}    onChange={handleChange} placeholder="e.g. Mumbai" />
                <Input label="State / Province" name="state"   value={form.state}   onChange={handleChange} placeholder="e.g. Maharashtra" />
                <Input label="PIN / ZIP Code"   name="pinCode" value={form.pinCode} onChange={handleChange} placeholder="e.g. 400001" />
                <Input label="Country"          name="country" value={form.country} onChange={handleChange} placeholder="e.g. India" />
              </div>
            </div>
          </div>

          {/* Industry */}
         
          {/* Contact */}
          <Section title="Contact Information">
            <Input label="Contact Person Name" name="contactPersonName" value={form.contactPersonName} onChange={handleChange} />
            <Input label="Email *"             name="email"             value={form.email}             onChange={handleChange} type="email" />
            <Input label="Phone *"             name="phone"             value={form.phone}             onChange={handleChange} type="tel" />
            <Input label="Alternate Phone"     name="alternatePhone"    value={form.alternatePhone}    onChange={handleChange} type="tel" />
          </Section>

          {/* Tax */}
          <Section title="Tax & Compliance">
            <Input label="GST Number" name="gstNumber" value={form.gstNumber} onChange={handleChange} placeholder="22AAAAA0000A1Z5" />
            <Input label="PAN Number" name="panNumber" value={form.panNumber} onChange={handleChange} placeholder="ABCDE1234F" />
          </Section>

          {/* Banking */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Banking Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Account Holder Name" name="accountHolderName" value={form.accountHolderName} onChange={handleChange} />
              <Input label="Bank Name"            name="bankName"          value={form.bankName}          onChange={handleChange} placeholder="e.g. HDFC Bank" />
              <Input label="Account Number"       name="accountNumber"     value={form.accountNumber}     onChange={handleChange} />
              <Input label="IFSC Code"            name="ifscCode"          value={form.ifscCode}          onChange={handleChange} placeholder="e.g. HDFC0001234" />
              <Input label="UPI ID"               name="upiId"             value={form.upiId}             onChange={handleChange} placeholder="e.g. vendor@upi" />
            </div>
          </div>

          {/* Documents */}
          <div>
            <h4 className="text-sm font-semibold mb-1">Documents</h4>
            <p className="text-xs text-gray-400 mb-3">
              Upload contracts, certificates, licences, or any relevant files. Multiple files supported.
            </p>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl py-7 flex flex-col items-center justify-center cursor-pointer transition select-none
                ${dragOver ? "border-gray-500 bg-gray-50" : "border-gray-300 bg-white hover:bg-gray-50"}`}
            >
              <Upload className="w-6 h-6 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-800">Click to upload</span> or drag &amp; drop
              </p>
              <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX, PNG, JPG, XLSX — up to 50 MB each</p>
              <input
                ref={fileInputRef}
                type="file"
                hidden
                multiple
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.gif,.xlsx,.csv"
                onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
              />
            </div>

            {documents.length > 0 && (
              <ul className="mt-3 space-y-2">
                {documents.map((file, i) => (
                  <li key={i} className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                    <FileIcon file={file} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                      <p className="text-[11px] text-gray-400">{formatBytes(file.size)}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                      className="text-gray-400 hover:text-red-500 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <p className="text-xs text-gray-400">
            {documents.length > 0
              ? `${documents.length} document${documents.length > 1 ? "s" : ""} attached`
              : "No documents attached"}
          </p>
          <div className="flex gap-3">
            <button onClick={handleCancel} className="px-5 py-2 text-sm border rounded-lg text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-5 py-2 text-sm font-medium rounded-lg bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Saving…
                </>
              ) : "Create Vendor"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Reusable components
───────────────────────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-sm font-semibold mb-3">{title}</h4>
      <div className="grid grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Input({
  label, name, value, onChange, placeholder, type = "text",
}: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <input
        name={name} value={value} onChange={onChange}
        placeholder={placeholder} type={type}
        className="w-full h-9 rounded-lg bg-gray-100 px-3 text-sm outline-none focus:ring-2 focus:ring-gray-300"
      />
    </div>
  );
}