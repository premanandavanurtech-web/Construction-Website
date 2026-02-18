"use client";

type Props = {
  open: boolean;
  onClose: () => void;
  data: {
    itemName: string;
    quantity: string;
    requestedBy: string;
    sourceLocation: string;
    destinationLocation: string;
    createdAt: number;
  } | null;
};

export default function TransferDetailsModal({
  open,
  onClose,
  data,
}: Props) {
  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Transfer Request Details
        </h3>

        <div className="space-y-2 text-sm text-gray-700">
          <p><b>Item Name:</b> {data.itemName}</p>
          <p><b>Quantity:</b> {data.quantity}</p>
          <p><b>Requested By:</b> {data.requestedBy}</p>
          <p><b>Source Location:</b> {data.sourceLocation}</p>
          <p><b>Destination Location:</b> {data.destinationLocation}</p>
          <p>
            <b>Requested On:</b>{" "}
            {new Date(data.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#344960] text-white text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
