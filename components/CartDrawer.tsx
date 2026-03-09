"use client";

import { Trash2, X } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { useState } from "react";
import SystemModal from "./SystemModal";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQty,
    cartTotal,
    checkoutWhatsApp,
    customerName,
    setCustomerName,
  } = useStore();

  const [infoModalOpen, setInfoModalOpen] = useState(false);

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    if (!customerName.trim()) {
      setInfoModalOpen(true);
      return;
    }
    checkoutWhatsApp();
  };

  return (
    <>
      <div className="fixed inset-0 z-[60] flex justify-end">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsCartOpen(false)}
        />
        <div className="relative flex h-full w-full max-w-md flex-col bg-[#F5F1E8] shadow-2xl">
          <div className="flex items-center justify-between bg-[#0A1F44] p-6 text-[#F5F1E8]">
            <h2 className="text-2xl">Tu bolsa</h2>
            <button onClick={() => setIsCartOpen(false)}>
              <X />
            </button>
          </div>

          <div className="border-b bg-white p-4">
            <label className="mb-2 block text-sm font-semibold text-[#0A1F44]">
              Nombre y apellido
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Ej: María González"
              className="w-full rounded-lg border px-4 py-3 outline-none"
            />
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <p className="mt-10 text-center text-gray-500">Tu carrito está vacío.</p>
            ) : (
              cart.map((item, index) => (
                <div key={`${item.id}-${item.selectedSize || "sin-talle"}-${index}`} className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-24 w-20 object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-bold uppercase text-[#0A1F44]">
                      {item.name}
                    </h4>

                    {item.selectedSize && (
                      <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#0A1F44]/70">
                        Talle: {item.selectedSize}
                      </p>
                    )}

                    <p className="text-[#C9A227]">${item.price.toLocaleString()}</p>

                    <div className="mt-3 flex items-center gap-3">
                      <button
                        onClick={() => updateQty(item.id, -1, item.selectedSize)}
                        className="rounded border px-2 py-1"
                      >
                        -
                      </button>
                      <span className="min-w-6 text-center font-semibold">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, 1, item.selectedSize)}
                        className="rounded border px-2 py-1"
                      >
                        +
                      </button>

                      <button
                        onClick={() => removeFromCart(item.id, item.selectedSize)}
                        className="ml-auto text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t bg-white p-6">
            <div className="mb-4 flex items-center justify-between text-xl font-semibold text-[#0A1F44]">
              <span>Total</span>
              <span>${cartTotal.toLocaleString()}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full bg-green-600 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Finalizar compra por WhatsApp
            </button>
          </div>
        </div>
      </div>

      <SystemModal
        open={infoModalOpen}
        title="Falta tu nombre"
        message="Antes de finalizar la compra, completá tu nombre y apellido."
        type="info"
        confirmText="Entendido"
        onConfirm={() => setInfoModalOpen(false)}
        onCancel={() => setInfoModalOpen(false)}
      />
    </>
  );
}