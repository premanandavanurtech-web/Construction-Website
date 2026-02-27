"use client";

type Props = {
  open: boolean;
  title?: string;
  message?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteConfirmModal({
  open,
  title = "Delete User",
  message = "Are you sure you want to delete this user? This action cannot be undone.",
  onCancel,
  onConfirm,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-red-600">
          {title}
        </h3>

        <p className="mt-2 text-sm text-zinc-600">
          {message}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 h-9 text-sm border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 h-9 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}