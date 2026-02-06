"use client";

import React from "react";
import { X } from "lucide-react";

/* 🔹 Helper Field component */
const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <label className="text-xs font-medium text-gray-600">
      {label}
    </label>
    {children}
  </div>
);

type PurchaseOrder = {
  vendorName: string;
  category: string;
  itemDescription: string;
  quantity: string;
  unitPrice: string;
  deliveryDate: string;
  paymentTerms: string;
};

type Props = {
  onClose: () => void;
};

const CreatePurchaseOrderModal = ({ onClose }: Props) => {
  const [order, setOrder] = React.useState<PurchaseOrder>({
    vendorName: "",
    category: "",
    itemDescription: "",
    quantity: "",
    unitPrice: "",
    deliveryDate: "",
    paymentTerms: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setOrder((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const existingOrders = JSON.parse(
      localStorage.getItem("purchaseOrders") || "[]"
    );

    localStorage.setItem(
      "purchaseOrders",
      JSON.stringify([...existingOrders, order])
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-[420px] rounded-2xl p-6 relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-semibold text-gray-900 mb-5">
          Create Purchase Order
        </h2>

        <form onSubmit={handleSubmit} className="space-y-2 text-black">

          <Field label="Vendor Name">
            <input
              name="vendorName"
              value={order.vendorName}
              onChange={handleChange}
              className="w-full h-9 px-3 rounded-md bg-[#e6e6e6] text-sm outline-none"
            />
          </Field>

          <Field label="Category">
            <input
              name="category"
              value={order.category}
              onChange={handleChange}
              className="w-full h-9 px-3 rounded-md bg-[#e6e6e6] text-sm outline-none"
            />
          </Field>

          <Field label="Item Description">
            <input
              name="itemDescription"
              value={order.itemDescription}
              onChange={handleChange}
              className="w-full h-9 px-3 rounded-md bg-[#e6e6e6] text-sm outline-none"
            />
          </Field>

          <Field label="Quantity">
            <input
              type="number"
              name="quantity"
              value={order.quantity}
              onChange={handleChange}
              className="w-full h-9 px-3 rounded-md bg-[#e6e6e6] text-sm outline-none"
            />
          </Field>

          <Field label="Unit & Unit Price">
            <input
              name="unitPrice"
              value={order.unitPrice}
              onChange={handleChange}
              className="w-full h-9 px-3 rounded-md bg-[#e6e6e6] text-sm outline-none"
            />
          </Field>

          <Field label="Delivery Date">
            <input
              type="date"
              name="deliveryDate"
              value={order.deliveryDate}
              onChange={handleChange}
              className="w-full h-9 px-3 rounded-md bg-[#e6e6e6] text-sm outline-none"
            />
          </Field>

          <Field label="Payment Terms">
            <input
              name="paymentTerms"
              value={order.paymentTerms}
              onChange={handleChange}
              className="w-full h-9 px-3 rounded-md bg-[#e6e6e6] text-sm outline-none"
            />
          </Field>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full h-9 border rounded-md text-xs text-gray-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full h-9 rounded-md bg-slate-800 text-white text-xs"
            >
              Create Order
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreatePurchaseOrderModal;