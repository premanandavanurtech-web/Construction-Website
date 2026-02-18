import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    itemName: string;
    quantity: string;
    requestedBy: string;
  }) => void;
};

export default function TransferRequestModal({
  open,
  onClose,
  onSubmit,
}: Props) {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [requestedBy, setRequestedBy] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-[400px] space-y-4">
        <h2 className="text-lg font-semibold">Create Transfer</h2>

        <input
          placeholder="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />

        <input
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <input
          placeholder="Requested By"
          value={requestedBy}
          onChange={(e) => setRequestedBy(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose}>Cancel</button>
          <button
          
            onClick={() =>
              onSubmit({
                quantity, // ✅ Quantity → quantity
                itemName, // ✅ Item Name → material
                requestedBy, // ✅ Requested By → site
              })
            }

            
          >
            Add Stock
          </button>
        </div>
      </div>
    </div>
  );
}
