"use client";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CreateOrderModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 text-black z-50 flex justify-center items-start overflow-y-auto py-10">
        <div className="bg-white w-[900px] rounded-lg shadow-xl overflow-hidden">
          
          {/* Header */}
          <div className="bg-[#2F3E4E] text-white px-6 py-4 text-sm font-semibold">
            CREATE ORDER
          </div>

          {/* Body */}
          <div className="p-6 space-y-6 text-sm">

            {/* Top Section */}
            <div className="grid grid-cols-3 gap-4">
              <Input label="Address" placeholder="Street address" />
              <Input label="City" placeholder="City" />
              <Input label="Invoice No." placeholder="INV-001" />

              <Input label="Phone" placeholder="Phone number" />
              <Input label="Email" placeholder="Email" />
              <Input label="Date" placeholder="mm/dd/yyyy" />

              <div className="col-span-3">
                <Select label="Site/Project" />
              </div>
            </div>

            {/* Vendor / Ship To */}
            <div className="grid grid-cols-2 gap-6">
              {/* Vendor */}
              <div>
                <SectionTitle title="VENDOR INFORMATION" />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Vendor Name" />
                  <div />
                  <Input label="Address" />
                  <Input label="Shipping address" />
                  <Input label="Contact" />
                  <Input label="Email" />
                </div>
              </div>

              {/* Ship To */}
              <div>
                <SectionTitle title="SHIP TO" />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Buyer Name" />
                  <div />
                  <Input label="Address" />
                  <Input label="Shipping address" />
                  <Input label="Contact" />
                  <Input label="Email" />
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <Input label="Ordered Date" placeholder="mm/dd/yyyy" />
              <Input label="Expected Delivery Date" placeholder="mm/dd/yyyy" />
            </div>

            {/* Order Items */}
            <div>
              <SectionTitle title="ORDER ITEMS" />

              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-2">S.No</th>
                      <th className="px-2 py-2">Item</th>
                      <th className="px-2 py-2">Description</th>
                      <th className="px-2 py-2">Unit</th>
                      <th className="px-2 py-2">Unit Cost</th>
                      <th className="px-2 py-2">Total Cost</th>
                      <th className="px-2 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="px-2 py-2">1</td>
                      <td className="px-2 py-2"><SmallInput /></td>
                      <td className="px-2 py-2"><SmallInput /></td>
                      <td className="px-2 py-2"><SmallInput /></td>
                      <td className="px-2 py-2"><SmallInput /></td>
                      <td className="px-2 py-2"><SmallInput /></td>
                      <td className="px-2 py-2 text-center">🗑</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <button className="mt-2 text-xs text-[#2F3E4E]">
                + Add Item
              </button>
            </div>

            {/* Comments & Total */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block mb-1">Purchase Order Comments</label>
                <textarea
                  className="w-full bg-gray-100 rounded-md p-2 h-24"
                  placeholder="Additional comments..."
                />
              </div>

              <div className="text-xs space-y-2">
                <div className="flex justify-between">
                  <span>Sub-total:</span>
                  <span>50.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Sales Tax (10%):</span>
                  <span>50.00</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>TOTAL:</span>
                  <span>50.00</span>
                </div>
              </div>
            </div>

            {/* Approval */}
            <div>
              <label className="block mb-1">Signature By</label>
              <div className="border rounded-md p-2 text-xs text-gray-500">
                Upload digital signature...
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t">
            <button
              onClick={onClose}
              className="px-5 py-2 border rounded-md text-sm"
            >
              Cancel
            </button>
            <button className="px-5 py-2 bg-[#2F3E4E] text-white rounded-md text-sm">
              Create Order
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- Reusable Components ---------- */

function Input({ label, placeholder = "" }: any) {
  return (
    <div>
      <label className="block mb-1">{label}</label>
      <input
        placeholder={placeholder}
        className="w-full bg-gray-100 rounded-md px-3 py-2"
      />
    </div>
  );
}

function Select({ label }: any) {
  return (
    <div>
      <label className="block mb-1">{label}</label>
      <select className="w-full bg-gray-100 rounded-md px-3 py-2">
        <option>Select project</option>
      </select>
    </div>
  );
}

function SectionTitle({ title }: any) {
  return (
    <div className="text-xs font-semibold text-gray-600 mb-2">
      {title}
    </div>
  );
}

function SmallInput() {
  return (
    <input className="w-full bg-gray-100 rounded px-2 py-1 text-xs" />
  );
}