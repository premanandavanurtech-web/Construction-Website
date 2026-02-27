"use client";

import { useState } from "react";

type Project = {
  id: string;
  name: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  projects?: Project[];
};

export default function CreateOrderModal({ open, onClose, projects = [] }: Props) {
  const [selectedProject, setSelectedProject] = useState("");
  const [items, setItems] = useState([{ id: 1 }]);

  if (!open) return null;

  const addItem = () => setItems((prev) => [...prev, { id: Date.now() }]);
  const removeItem = (id: number) => setItems((prev) => prev.filter((i) => i.id !== id));

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-0 text-black z-50 flex justify-center items-start overflow-y-auto py-10">
        <div className="bg-white w-[900px] rounded-lg shadow-xl overflow-hidden">
          <div className="bg-[#2F3E4E] text-white px-6 py-4 text-sm font-semibold">CREATE ORDER</div>
          <div className="p-6 space-y-6 text-sm">
            <div className="grid grid-cols-3 gap-4">
              <Input label="Address" placeholder="Street address" />
              <Input label="City" placeholder="City" />
              <Input label="Invoice No." placeholder="INV-001" />
              <Input label="Phone" placeholder="Phone number" />
              <Input label="Email" placeholder="Email" />
              <Input label="Date" placeholder="mm/dd/yyyy" />

              <div className="col-span-3">
                <label className="block mb-1 text-sm font-medium text-gray-700">Site / Project</label>
                <div className="relative">
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full appearance-none bg-gray-100 rounded-md px-3 py-2 pr-10 text-sm text-gray-700 border border-transparent focus:border-[#2F3E4E] focus:outline-none cursor-pointer"
                  >
                    <option value="">— Select a project —</option>
                    {projects.length === 0 ? (
                      <option disabled>No projects created yet</option>
                    ) : (
                      projects.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))
                    )}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {selectedProject && (
                  <div className="mt-2 inline-flex items-center gap-2 bg-[#2F3E4E]/10 text-[#2F3E4E] text-xs font-medium px-3 py-1.5 rounded-full">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                    </svg>
                    {projects.find((p) => p.id === selectedProject)?.name}
                    <button onClick={() => setSelectedProject("")} className="ml-1 text-[#2F3E4E]/60 hover:text-[#2F3E4E]">✕</button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <SectionTitle title="VENDOR INFORMATION" />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Vendor Name" /><div />
                  <Input label="Address" /><Input label="Shipping address" />
                  <Input label="Contact" /><Input label="Email" />
                </div>
              </div>
              <div>
                <SectionTitle title="SHIP TO" />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Buyer Name" /><div />
                  <Input label="Address" /><Input label="Shipping address" />
                  <Input label="Contact" /><Input label="Email" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="Ordered Date" placeholder="mm/dd/yyyy" />
              <Input label="Expected Delivery Date" placeholder="mm/dd/yyyy" />
            </div>

            <div>
              <SectionTitle title="ORDER ITEMS" />
              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      {["S.No","Item","Description","Unit","Unit Cost","Total Cost",""].map((h) => (
                        <th key={h} className="px-2 py-2 text-left font-semibold text-gray-600">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((row, idx) => (
                      <tr key={row.id} className="border-t">
                        <td className="px-2 py-2 text-gray-500">{idx + 1}</td>
                        <td className="px-2 py-2"><SmallInput /></td>
                        <td className="px-2 py-2"><SmallInput /></td>
                        <td className="px-2 py-2"><SmallInput /></td>
                        <td className="px-2 py-2"><SmallInput /></td>
                        <td className="px-2 py-2"><SmallInput /></td>
                        <td className="px-2 py-2 text-center">
                          <button onClick={() => removeItem(row.id)} className="text-red-400 hover:text-red-600">🗑</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button onClick={addItem} className="mt-2 text-xs text-[#2F3E4E] hover:underline">+ Add Item</button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block mb-1">Purchase Order Comments</label>
                <textarea className="w-full bg-gray-100 rounded-md p-2 h-24" placeholder="Additional comments..." />
              </div>
              <div className="text-xs space-y-2">
                <div className="flex justify-between"><span>Sub-total:</span><span>50.00</span></div>
                <div className="flex justify-between"><span>Sales Tax (10%):</span><span>50.00</span></div>
                <div className="flex justify-between font-semibold"><span>TOTAL:</span><span>50.00</span></div>
              </div>
            </div>

            <div>
              <label className="block mb-1">Signature By</label>
              <div className="border rounded-md p-2 text-xs text-gray-500">Upload digital signature...</div>
            </div>
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 border-t">
            <button onClick={onClose} className="px-5 py-2 border rounded-md text-sm">Cancel</button>
            <button className="px-5 py-2 bg-[#2F3E4E] text-white rounded-md text-sm">Create Order</button>
          </div>
        </div>
      </div>
    </>
  );
}

function Input({ label, placeholder = "" }: any) {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>
      <input placeholder={placeholder} className="w-full bg-gray-100 rounded-md px-3 py-2 text-sm border border-transparent focus:border-[#2F3E4E] focus:outline-none" />
    </div>
  );
}

function SectionTitle({ title }: any) {
  return <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">{title}</div>;
}

function SmallInput() {
  return <input className="w-full bg-gray-100 rounded px-2 py-1 text-xs border border-transparent focus:border-[#2F3E4E] focus:outline-none" />;
}