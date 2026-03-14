"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Product, useStore } from "../context/StoreContext";
import SystemModal from "./SystemModal";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { addToCart } = useStore();
  const [mounted, setMounted] = useState(false);

  const sizeEntries = useMemo(
    () => (product?.sizeChart ? Object.entries(product.sizeChart) : []),
    [product]
  );

  const gallery = useMemo(() => {
    if (!product) return [];

    if (product.images && product.images.length > 0) {
      return product.images.slice(0, 5);
    }

    return product.image ? [product.image] : ["/daphne-logo.png"];
  }, [product]);

  const availableColors = useMemo(() => product?.colors || [], [product]);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!product) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [product]);

  useEffect(() => {
    setCurrentImage(0);

    if (product?.variants && product.variants.length > 0) {
      const firstAvailable = product.variants.find((v) => v.stock > 0);

      if (firstAvailable) {
        setSelectedSize(firstAvailable.size);
        setSelectedColor(firstAvailable.color);
      } else {
        setSelectedSize("");
        setSelectedColor("");
      }

      return;
    }

    if (sizeEntries.length > 0) {
      setSelectedSize(sizeEntries[0][0]);
    }

    if (availableColors.length > 0) {
      setSelectedColor(availableColors[0]);
    }
  }, [product, sizeEntries, availableColors]);

  if (!mounted || !product) return null;

  const hasSizes = sizeEntries.length > 0;
  const hasColors = availableColors.length > 0;

  const handlePrev = () => {
    setCurrentImage((prev) =>
      prev === 0 ? gallery.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentImage((prev) =>
      prev === gallery.length - 1 ? 0 : prev + 1
    );
  };

  const modalContent = (
    <>
      <div className="fixed inset-0 z-[99999]">
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="relative h-screen w-screen overflow-y-auto">
          <div className="min-h-screen px-4 py-6 md:px-6 md:py-10">
            <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="relative grid lg:grid-cols-2">

                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 z-30 rounded-full bg-white p-2 text-[#0A1F44] shadow hover:bg-gray-100"
                >
                  <X size={20} />
                </button>

                {/* GALERÍA */}
                <div className="bg-[#F5F1E8]">
                  <div className="relative">
                    <img
                      src={gallery[currentImage] || "/daphne-logo.png"}
                      alt={`${product.name} ${currentImage + 1}`}
                      className="h-[420px] w-full object-cover sm:h-[520px] lg:h-[760px]"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/daphne-logo.png";
                      }}
                    />

                    {gallery.length > 1 && (
                      <>
                        <button
                          onClick={handlePrev}
                          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 text-[#0A1F44] shadow"
                        >
                          <ChevronLeft size={22} />
                        </button>

                        <button
                          onClick={handleNext}
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 text-[#0A1F44] shadow"
                        >
                          <ChevronRight size={22} />
                        </button>
                      </>
                    )}
                  </div>

                  {/* MINIATURAS */}
                  {gallery.length > 1 && (
                    <div className="flex flex-wrap gap-3 p-4">
                      {gallery.map((img, index) => (
                        <button
                          key={`${img}-${index}`}
                          onClick={() => setCurrentImage(index)}
                          className={`overflow-hidden rounded border-2 ${
                            currentImage === index
                              ? "border-[#C9A227]"
                              : "border-transparent"
                          }`}
                        >
                          <img
                            src={img}
                            alt={`${product.name} miniatura`}
                            className="h-20 w-16 object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/daphne-logo.png";
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* INFO PRODUCTO */}
                <div className="p-6 md:p-8 lg:p-10">
                  <p className="mb-2 text-sm uppercase tracking-[0.3em] text-[#C9A227]">
                    {product.category}
                  </p>

                  <h2 className="mb-4 text-3xl font-bold text-[#0A1F44] md:text-4xl">
                    {product.name}
                  </h2>

                  <p className="mb-4 text-2xl font-semibold text-[#C9A227]">
                    ${product.price.toLocaleString()}
                  </p>

                  <span className="rounded bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    {product.status}
                  </span>

                  <p className="mt-6 leading-7 text-[#0A1F44]/80">
                    {product.description}
                  </p>

                  <button
                    onClick={() => {
                      addToCart(product);
                      onClose();
                    }}
                    className="mt-8 w-full bg-[#0A1F44] py-4 text-sm font-bold uppercase tracking-[0.2em] text-[#F5F1E8] hover:bg-[#C9A227] hover:text-[#0A1F44]"
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SystemModal
        open={infoModalOpen}
        title="Variante no disponible"
        message="Elegí un talle y color con stock disponible."
        type="info"
        confirmText="Entendido"
        onConfirm={() => setInfoModalOpen(false)}
        onCancel={() => setInfoModalOpen(false)}
      />
    </>
  );

  return createPortal(modalContent, document.body);
}