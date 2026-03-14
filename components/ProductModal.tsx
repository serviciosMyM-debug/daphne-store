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

function proxiedImage(url?: string) {
  if (!url) return "/placeholder-product.jpg";
  return `/api/image?url=${encodeURIComponent(url)}`;
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
    return product.image ? [product.image] : ["/placeholder-product.jpg"];
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
      const firstAvailable = product.variants.find((variant) => variant.stock > 0);

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
    } else {
      setSelectedSize("");
    }

    if (availableColors.length > 0) {
      setSelectedColor(availableColors[0]);
    } else {
      setSelectedColor("");
    }
  }, [product, sizeEntries, availableColors]);

  if (!mounted || !product) return null;

  const hasSizes = sizeEntries.length > 0;
  const hasColors = availableColors.length > 0;

  const getVariantStock = (size: string, color: string) => {
    if (!product.variants || product.variants.length === 0) {
      return product.stock;
    }

    const variant = product.variants.find(
      (v) => v.size === size && v.color === color
    );

    return variant ? variant.stock : 0;
  };

  const isSizeAvailable = (size: string) => {
    if (!product.variants || product.variants.length === 0) return true;
    return availableColors.some((color) => getVariantStock(size, color) > 0);
  };

  const isColorAvailable = (color: string) => {
    if (!product.variants || product.variants.length === 0) return true;
    return sizeEntries.some(([size]) => getVariantStock(size, color) > 0);
  };

  const selectedVariantStock =
    selectedSize && selectedColor
      ? getVariantStock(selectedSize, selectedColor)
      : 0;

  const handlePrev = () => {
    setCurrentImage((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImage((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  const handleSelectColor = (color: string) => {
    setSelectedColor(color);

    if (product.variants && product.variants.length > 0) {
      const availableVariantForColor = product.variants.find(
        (variant) => variant.color === color && variant.stock > 0
      );

      if (availableVariantForColor && getVariantStock(selectedSize, color) <= 0) {
        setSelectedSize(availableVariantForColor.size);
      }
    }
  };

  const handleSelectSize = (size: string) => {
    setSelectedSize(size);

    if (product.variants && product.variants.length > 0) {
      const availableVariantForSize = product.variants.find(
        (variant) => variant.size === size && variant.stock > 0
      );

      if (availableVariantForSize && getVariantStock(size, selectedColor) <= 0) {
        setSelectedColor(availableVariantForSize.color);
      }
    }
  };

  const handleAddToCart = () => {
    if (hasSizes && !selectedSize) {
      setInfoModalOpen(true);
      return;
    }

    if (hasColors && !selectedColor) {
      setInfoModalOpen(true);
      return;
    }

    if (product.variants && product.variants.length > 0 && selectedVariantStock <= 0) {
      setInfoModalOpen(true);
      return;
    }

    addToCart(product, selectedSize || undefined, selectedColor || undefined);
    onClose();
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

                <div className="bg-[#F5F1E8]">
                  <div className="relative">
                    <img
                      src={proxiedImage(gallery[currentImage])}
                      alt={`${product.name} ${currentImage + 1}`}
                      className="h-[420px] w-full object-cover sm:h-[520px] lg:h-[760px]"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-product.jpg";
                      }}
                    />

                    {gallery.length > 1 && (
                      <>
                        <button
                          onClick={handlePrev}
                          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 text-[#0A1F44] shadow hover:bg-white"
                        >
                          <ChevronLeft size={22} />
                        </button>

                        <button
                          onClick={handleNext}
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 text-[#0A1F44] shadow hover:bg-white"
                        >
                          <ChevronRight size={22} />
                        </button>
                      </>
                    )}
                  </div>

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
                            src={proxiedImage(img)}
                            alt={`${product.name} miniatura ${index + 1}`}
                            className="h-20 w-16 object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder-product.jpg";
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

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

                  {hasColors && (
                    <div className="mb-6">
                      <h3 className="mb-3 text-lg font-semibold text-[#0A1F44]">
                        Seleccionar color
                      </h3>

                      <div className="flex flex-wrap gap-3">
                        {availableColors.map((color) => {
                          const disabled = !isColorAvailable(color);

                          return (
                            <button
                              key={color}
                              onClick={() => !disabled && handleSelectColor(color)}
                              disabled={disabled}
                              className={`border px-4 py-2 text-sm font-bold transition ${
                                disabled
                                  ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                                  : selectedColor === color
                                  ? "border-[#C9A227] bg-[#C9A227] text-[#0A1F44]"
                                  : "border-[#0A1F44] text-[#0A1F44] hover:bg-[#0A1F44] hover:text-[#F5F1E8]"
                              }`}
                            >
                              {color}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {hasSizes && (
                    <>
                      <div className="mb-6">
                        <h3 className="mb-3 text-lg font-semibold text-[#0A1F44]">
                          Seleccionar talle
                        </h3>

                        <div className="flex flex-wrap gap-3">
                          {sizeEntries.map(([size]) => {
                            const disabled = !isSizeAvailable(size);

                            return (
                              <button
                                key={size}
                                onClick={() => !disabled && handleSelectSize(size)}
                                disabled={disabled}
                                className={`min-w-[52px] border px-4 py-2 text-sm font-bold transition ${
                                  disabled
                                    ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                                    : selectedSize === size
                                    ? "border-[#C9A227] bg-[#C9A227] text-[#0A1F44]"
                                    : "border-[#0A1F44] text-[#0A1F44] hover:bg-[#0A1F44] hover:text-[#F5F1E8]"
                                }`}
                              >
                                {size}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mb-8">
                        <h3 className="mb-4 text-xl font-semibold text-[#0A1F44]">
                          Tabla de talles
                        </h3>

                        <div className="overflow-hidden rounded border border-[#C9A227]/30">
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

                  {selectedSize && selectedColor && (
                    <p className="mb-6 text-sm font-semibold text-[#0A1F44]/70">
                      Stock disponible para esta variante: {selectedVariantStock}
                    </p>
                  )}

                  <button
                    onClick={handleAddToCart}
                    disabled={
                      product.status === "AGOTADO" ||
                      ((product.variants?.length || 0) > 0 && selectedVariantStock <= 0)
                    }
                    className={`w-full py-4 text-sm font-bold uppercase tracking-[0.2em] transition ${
                      product.status === "AGOTADO" ||
                      ((product.variants?.length || 0) > 0 && selectedVariantStock <= 0)
                        ? "cursor-not-allowed bg-gray-200 text-gray-400"
                        : "bg-[#0A1F44] text-[#F5F1E8] hover:bg-[#C9A227] hover:text-[#0A1F44]"
                    }`}
                  >
                    {product.status === "AGOTADO"
                      ? "Sin stock"
                      : (product.variants?.length || 0) > 0 && selectedVariantStock <= 0
                      ? "Variante sin stock"
                      : "Agregar al carrito"}
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
        message="Antes de agregar esta prenda al carrito, elegí un talle y color con stock disponible."
        type="info"
        confirmText="Entendido"
        onConfirm={() => setInfoModalOpen(false)}
        onCancel={() => setInfoModalOpen(false)}
      />
    </>
  );

  return createPortal(modalContent, document.body);
}