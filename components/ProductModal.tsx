"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { Product, useStore } from "../context/StoreContext";
import SystemModal from "./SystemModal";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { addToCart } = useStore();

  const sizeEntries = useMemo(
    () => (product?.sizeChart ? Object.entries(product.sizeChart) : []),
    [product]
  );

  const [selectedSize, setSelectedSize] = useState("");
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  useEffect(() => {
    if (sizeEntries.length > 0) {
      setSelectedSize(sizeEntries[0][0]);
    } else {
      setSelectedSize("");
    }
  }, [product, sizeEntries]);

  if (!product) return null;

  const hasSizes = sizeEntries.length > 0;

  const handleAddToCart = () => {
    if (hasSizes && !selectedSize) {
      setInfoModalOpen(true);
      return;
    }

    addToCart(product, selectedSize || undefined);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-4">
        <div className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto bg-white shadow-2xl">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 text-[#0A1F44] shadow hover:bg-gray-100"
          >
            <X size={20} />
          </button>

          <div className="grid md:grid-cols-2">
            <div className="bg-[#F5F1E8]">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="p-8 md:p-10">
              <p className="mb-2 text-sm uppercase tracking-[0.3em] text-[#C9A227]">
                {product.category}
              </p>

              <h2 className="mb-4 text-3xl font-bold text-[#0A1F44]">
                {product.name}
              </h2>

              <p className="mb-4 text-lg font-semibold text-[#C9A227]">
                ${product.price.toLocaleString()}
              </p>

              <div className="mb-6">
                <span
                  className={`rounded px-3 py-1 text-xs font-bold ${
                    product.status === "EN STOCK"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {product.status}
                </span>
              </div>

              <p className="mb-8 leading-7 text-[#0A1F44]/80">
                {product.description}
              </p>

              {hasSizes && (
                <>
                  <div className="mb-6">
                    <h3 className="mb-3 text-lg font-semibold text-[#0A1F44]">
                      Seleccionar talle
                    </h3>

                    <div className="flex flex-wrap gap-3">
                      {sizeEntries.map(([size]) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-[52px] border px-4 py-2 text-sm font-bold transition ${
                            selectedSize === size
                              ? "border-[#C9A227] bg-[#C9A227] text-[#0A1F44]"
                              : "border-[#0A1F44] text-[#0A1F44] hover:bg-[#0A1F44] hover:text-[#F5F1E8]"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="mb-4 text-xl font-semibold text-[#0A1F44]">
                      Tabla de talles
                    </h3>

                    <div className="overflow-hidden border border-[#C9A227]/30">
                      <table className="min-w-full border-collapse">
                        <thead className="bg-[#F5F1E8]">
                          <tr>
                            <th className="border-b px-4 py-3 text-left text-sm font-bold text-[#0A1F44]">
                              Talle
                            </th>
                            <th className="border-b px-4 py-3 text-left text-sm font-bold text-[#0A1F44]">
                              Medidas
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {sizeEntries.map(([size, measure]) => (
                            <tr key={size}>
                              <td className="border-b px-4 py-3 font-semibold text-[#0A1F44]">
                                {size}
                              </td>
                              <td className="border-b px-4 py-3 text-[#0A1F44]/80">
                                {measure}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              <button
                onClick={handleAddToCart}
                disabled={product.status === "AGOTADO"}
                className={`w-full py-4 text-sm font-bold uppercase tracking-[0.2em] transition ${
                  product.status === "AGOTADO"
                    ? "cursor-not-allowed bg-gray-200 text-gray-400"
                    : "bg-[#0A1F44] text-[#F5F1E8] hover:bg-[#C9A227] hover:text-[#0A1F44]"
                }`}
              >
                {product.status === "AGOTADO" ? "Sin stock" : "Agregar al carrito"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <SystemModal
        open={infoModalOpen}
        title="Seleccioná un talle"
        message="Antes de agregar esta prenda al carrito, elegí un talle disponible."
        type="info"
        confirmText="Entendido"
        onConfirm={() => setInfoModalOpen(false)}
        onCancel={() => setInfoModalOpen(false)}
      />
    </>
  );
}