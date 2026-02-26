"use client";

import { X, UserCircle2, Globe, Phone, Mail, MapPin, Building2, Briefcase, CreditCard, Landmark, FileText, BadgeCheck, Hash, Download, ExternalLink } from "lucide-react";
import type { VendorDoc } from "./AddVendorModal";

/* ─────────────────────────────────────────
   Type — must match VendorDatabase's Vendor
───────────────────────────────────────── */

export type Vendor = {
  id: string;
  profilePhoto: string;
  name: string;
  email: string;
  type: string;
  industry: string;
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
  status: "Active" | "Inactive";
  savedAt: number;
};

interface Props {
  vendor: Vendor | null;
  onClose: () => void;
}

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function expiresIn(savedAt: number) {
  const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  const days = Math.max(0, Math.ceil((ONE_WEEK_MS - (Date.now() - savedAt)) / 86_400_000));
  return days;
}

/* ─────────────────────────────────────────
   Sub-components
───────────────────────────────────────── */

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number | undefined | null;
}) {
  const display = value && String(value).trim() ? String(value) : "—";
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-gray-400 uppercase tracking-wide">{label}</p>
        <p className={`text-sm font-medium mt-0.5 break-all ${display === "—" ? "text-gray-300" : "text-gray-800"}`}>
          {display}
        </p>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

/* ─────────────────────────────────────────
   DocCard — preview + download per file
───────────────────────────────────────── */

function formatBytes(b: number) {
  if (b < 1024) return b + " B";
  if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
  return (b / 1048576).toFixed(1) + " MB";
}

function DocCard({ doc }: { doc: VendorDoc }) {
  const isImage = doc.type.startsWith("image/");
  const isPdf   = doc.type === "application/pdf";

  const handleOpen = () => {
    const win = window.open();
    if (win) {
      win.document.write(
        isImage
          ? `<html><body style="margin:0;background:#111;display:flex;align-items:center;justify-content:center;min-height:100vh"><img src="${doc.data}" style="max-width:100%;max-height:100vh;object-fit:contain"/></body></html>`
          : `<html><body style="margin:0;height:100vh"><iframe src="${doc.data}" style="width:100%;height:100%;border:none"/></body></html>`
      );
      win.document.close();
    }
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = doc.data;
    a.download = doc.name;
    a.click();
  };

  return (
    <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-3 py-2.5 hover:border-gray-300 transition">
      {/* Thumbnail or icon */}
      <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
        {isImage ? (
          <img src={doc.data} alt={doc.name} className="w-full h-full object-cover" />
        ) : isPdf ? (
          <FileText className="w-5 h-5 text-red-400" />
        ) : (
          <FileText className="w-5 h-5 text-gray-400" />
        )}
      </div>

      {/* Name + size */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{doc.name}</p>
        <p className="text-[11px] text-gray-400">{formatBytes(doc.size)}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-1 shrink-0">
        <button
          onClick={handleOpen}
          title="View"
          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleDownload}
          title="Download"
          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Modal
───────────────────────────────────────── */

export default function VendorDetailModal({ vendor, onClose }: Props) {
  if (!vendor) return null;

  const days   = expiresIn(vendor.savedAt);
  const expBadge =
    days <= 1 ? "bg-red-50 text-red-600"
    : days <= 3 ? "bg-yellow-50 text-yellow-600"
    : "bg-gray-100 text-gray-500";

  const initials = vendor.name
    .split(" ").slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">

        {/* ── Top bar ── */}
        <div className="flex items-center justify-between px-6 py-3 border-b bg-white shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-400">{vendor.id}</span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
              vendor.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
            }`}>
              {vendor.status}
            </span>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700 transition rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto">

          {/* Hero / Profile strip */}
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-700 px-6 pt-8 pb-16">
            {/* Subtle grid texture */}
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "24px 24px" }}
            />

            <div className="relative flex items-end gap-5">
              {/* Avatar */}
              <div className="shrink-0">
                {vendor.profilePhoto ? (
                  <img
                    src={vendor.profilePhoto}
                    alt={vendor.name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-white/30 shadow-xl"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center shadow-xl">
                    {initials ? (
                      <span className="text-2xl font-bold text-white">{initials}</span>
                    ) : (
                      <UserCircle2 className="w-10 h-10 text-white/60" />
                    )}
                  </div>
                )}
              </div>

              {/* Name block */}
              <div className="pb-1">
                <h2 className="text-xl font-bold text-white leading-tight">{vendor.name || "Unnamed Vendor"}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  {vendor.type && (
                    <span className="text-[11px] bg-white/15 text-white/90 px-2.5 py-0.5 rounded-full">
                      {vendor.type}
                    </span>
                  )}
                  {vendor.industry && (
                    <span className="text-[11px] bg-white/15 text-white/90 px-2.5 py-0.5 rounded-full">
                      {vendor.industry}
                    </span>
                  )}
                  {vendor.city && (
                    <span className="text-[11px] text-white/60 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />{vendor.city}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick-stat strip — overlaps hero */}
          <div className="mx-6 -mt-8 relative z-10 mb-5">
            <div className="bg-white rounded-xl border border-gray-200 shadow-md grid grid-cols-3 divide-x divide-gray-100">
              <StatCell label="Added on" value={formatDate(vendor.savedAt)} />
              <StatCell
                label="Expires in"
                value={`${days} day${days !== 1 ? "s" : ""}`}
                badge={expBadge}
              />
              <StatCell
                label="Documents"
                value={vendor.documentsCount > 0 ? `${vendor.documentsCount} file${vendor.documentsCount > 1 ? "s" : ""}` : "None"}
              />
            </div>
          </div>

          {/* Sections */}
          <div className="px-6 pb-6 space-y-4">

            {/* Contact */}
            <SectionCard title="Contact Information">
              <DetailRow icon={<Mail className="w-3.5 h-3.5 text-gray-500" />}     label="Email"          value={vendor.email} />
              <DetailRow icon={<Phone className="w-3.5 h-3.5 text-gray-500" />}    label="Phone"          value={vendor.phone} />
              <DetailRow icon={<Phone className="w-3.5 h-3.5 text-gray-500" />}    label="Contact Person" value={vendor.contactName} />
              <DetailRow icon={<Globe className="w-3.5 h-3.5 text-gray-500" />}    label="Location"       value={vendor.city} />
            </SectionCard>

            {/* Company */}
            <SectionCard title="Company Details">
              <DetailRow icon={<Building2 className="w-3.5 h-3.5 text-gray-500" />}  label="Vendor Type"  value={vendor.type} />
              <DetailRow icon={<Briefcase className="w-3.5 h-3.5 text-gray-500" />}  label="Industry"     value={vendor.industry} />
              <DetailRow icon={<Hash className="w-3.5 h-3.5 text-gray-500" />}       label="Vendor ID"    value={vendor.id} />
            </SectionCard>

            {/* Tax */}
            <SectionCard title="Tax & Compliance">
              <DetailRow icon={<BadgeCheck className="w-3.5 h-3.5 text-gray-500" />} label="GST Number" value={vendor.gst} />
              <DetailRow icon={<CreditCard className="w-3.5 h-3.5 text-gray-500" />} label="PAN Number" value={vendor.pan} />
            </SectionCard>

            {/* Banking */}
            <SectionCard title="Banking Information">
              <DetailRow icon={<Landmark className="w-3.5 h-3.5 text-gray-500" />}   label="Bank Name"       value={vendor.bank} />
              <DetailRow icon={<Hash className="w-3.5 h-3.5 text-gray-500" />}        label="Account Number"  value={vendor.acct} />
              <DetailRow icon={<BadgeCheck className="w-3.5 h-3.5 text-gray-500" />}  label="IFSC Code"       value={vendor.ifsc} />
              <DetailRow icon={<CreditCard className="w-3.5 h-3.5 text-gray-500" />}  label="UPI ID"          value={vendor.upi} />
            </SectionCard>

            {/* Documents */}
            <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Documents</h3>
              {(!vendor.documents || vendor.documents.length === 0) ? (
                <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-lg px-4 py-3">
                  <FileText className="w-5 h-5 text-gray-300 shrink-0" />
                  <p className="text-sm text-gray-400">No documents attached</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {vendor.documents.map((doc, i) => (
                    <DocCard key={i} doc={doc} />
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-3 border-t bg-white shrink-0 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Stat cell
───────────────────────────────────────── */

function StatCell({
  label,
  value,
  badge,
}: {
  label: string;
  value: string;
  badge?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-3 px-2 text-center">
      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      {badge ? (
        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${badge}`}>{value}</span>
      ) : (
        <p className="text-sm font-semibold text-gray-800">{value}</p>
      )}
    </div>
  );
}