"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useStore } from "../context/StoreContext";

export default function Navbar() {
  const {
    cart,
    cartTotal,
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
    products,
  } = useStore();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  const suggestions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    return products
      .filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      )
      .slice(0, 6);
  }, [products, searchQuery]);

  const handleSuggestionClick = () => {
    setSearchOpen(false);
    const section = document.getElementById("catalogo");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-[#0A1F44]/95 backdrop-blur-md py-3 shadow-lg" : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <div className="hidden md:flex space-x-8 text-[#F5F1E8] text-sm tracking-[0.2em] uppercase">
          <a href="#inicio" className="hover:text-[#C9A227] transition-colors">Inicio</a>
          <a href="#destacados" className="hover:text-[#C9A227] transition-colors">Destacados</a>
          <a href="#catalogo" className="hover:text-[#C9A227] transition-colors">Productos</a>
          <a href="#contacto" className="hover:text-[#C9A227] transition-colors">Contacto</a>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2">
          <Link href="/" className="block">
            <img
              src="/daphne-logo.png"
              alt="Daphné"
              className="h-14 w-auto object-contain md:h-16"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </Link>
        </div>

        <div className="flex items-center gap-4 text-[#F5F1E8]">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="hover:text-[#C9A227] transition-colors"
            aria-label="Buscar"
          >
            <Search size={22} />
          </button>

          <span className="hidden sm:inline text-sm font-bold tracking-wide text-[#F5F1E8]">
            ${cartTotal.toLocaleString()}
          </span>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative hover:text-[#C9A227] transition-colors"
            aria-label="Abrir carrito"
          >
            <ShoppingBag size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#C9A227] text-[10px] font-bold text-[#0A1F44]">
                {cartCount}
              </span>
            )}
          </button>

          <Link href="/admin" className="hidden md:block text-xs text-[#F5F1E8]/80 hover:text-[#C9A227]">
            Admin
          </Link>

          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="mx-auto mt-4 max-w-7xl px-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full rounded-xl border border-white/20 bg-white px-4 py-3 text-[#0A1F44] outline-none"
            />

            {searchQuery.trim() && (
              <div className="mt-2 overflow-hidden rounded-2xl bg-white shadow-2xl">
                {suggestions.length > 0 ? (
                  <div className="divide-y">
                    {suggestions.map((product) => (
                      <button
                        key={product.id}
                        onClick={handleSuggestionClick}
                        className="flex w-full items-center gap-4 px-4 py-3 text-left transition hover:bg-[#F5F1E8]"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-14 w-14 rounded-md object-cover"
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-[#0A1F44]">{product.name}</div>
                          <div className="text-xs uppercase tracking-wide text-[#0A1F44]/60">
                            {product.category}
                          </div>
                        </div>
                        <div className="font-semibold text-[#C9A227]">
                          ${product.price.toLocaleString()}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-4 text-sm text-[#0A1F44]/70">
                    No encontramos productos para esa búsqueda.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {mobileMenuOpen && (
        <div className="mt-4 bg-[#0A1F44] px-6 py-5 text-[#F5F1E8] md:hidden">
          <div className="mb-4 text-sm font-bold">
            Total carrito: ${cartTotal.toLocaleString()}
          </div>

          <div className="flex flex-col gap-4 uppercase tracking-wider text-sm">
            <a href="#inicio" onClick={() => setMobileMenuOpen(false)}>Inicio</a>
            <a href="#destacados" onClick={() => setMobileMenuOpen(false)}>Destacados</a>
            <a href="#catalogo" onClick={() => setMobileMenuOpen(false)}>Productos</a>
            <a href="#contacto" onClick={() => setMobileMenuOpen(false)}>Contacto</a>
          </div>
        </div>
      )}
    </nav>
  );
}