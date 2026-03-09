"use client";

interface SystemModalProps {
  open: boolean;
  title: string;
  message: string;
  type?: "info" | "confirm";
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function SystemModal({
  open,
  title,
  message,
  type = "info",
  confirmText = "Aceptar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
}: SystemModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="border-b border-gray-200 px-6 py-5">
          <h3 className="text-xl font-bold text-[#0A1F44]">{title}</h3>
        </div>

        <div className="px-6 py-5">
          <p className="leading-7 text-[#0A1F44]/80">{message}</p>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
          {type === "confirm" && (
            <button
              onClick={onCancel}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-200"
            >
              {cancelText}
            </button>
          )}

          <button
            onClick={onConfirm}
            className="rounded-lg bg-[#0A1F44] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#102b5f]"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}