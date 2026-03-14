"use client";

import { useState } from "react";
import { Product } from "../context/StoreContext";
import ProductModal from "./ProductModal";

export default function ProductCard({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);

  const mainImage =
    product.images?.[0] || product.image || "/daphne-logo.png";

  return (
    <>
      <div className="group overflow-hidden border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <button onClick={() => setOpen(true)} className="block w-full text-left">
          <div className="relative aspect-[3/4] overflow-hidden bg-[#F5F1E8]">
            <img
              src={mainImage}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/daphne-logo.png";
              }}
            />

            {product.status === "AGOTADO" && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#0A1F44]/65">
                <span className="border border-[#F5F1E8] px-4 py-2 text-sm font-semibold tracking-widest text-[#F5F1E8]">
                  AGOTADO
                </span>
              </div>
            )}
          </div>
        </button>

        <div className="p-6 text-center">
          <h3 className="mb-3 text-lg font-black uppercase tracking-[0.06em] text-[#0A1F44]">
            {product.name}
          </h3>

          <p className="mb-5 text-2xl font-bold text-[#C9A227]">
            ${product.price.toLocaleString()}
          </p>

          <button
            onClick={() => setOpen(true)}
            className="w-full border border-[#0A1F44] py-3 text-xs font-bold uppercase tracking-[0.18em] text-[#0A1F44] transition hover:bg-[#0A1F44] hover:text-[#F5F1E8]"
          >
            Ver detalle
          </button>
        </div>
      </div>

      <ProductModal
        product={open ? product : null}
        onClose={() => setOpen(false)}
      />
    </>
  );
}