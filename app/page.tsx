"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import CartDrawer from "../components/CartDrawer";
import WhatsAppButton from "../components/WhatsAppButton";
import { useStore } from "../context/StoreContext";

export default function Home() {
  const { products, searchQuery } = useStore();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const heroProgress = Math.min(scrollY / 320, 1);

  const logoStyle = useMemo(() => {
    const scale = 1 - heroProgress * 0.62;
    const translateY = -(heroProgress * 140);
    const opacity = 1 - heroProgress * 0.12;

    return {
      transform: `translateY(${translateY}px) scale(${scale})`,
      opacity,
    };
  }, [heroProgress]);

  const taglineStyle = useMemo(() => {
    const scale = 1 - heroProgress * 0.25;
    const translateY = -(heroProgress * 120);
    const opacity = 1 - heroProgress * 1.3;

    return {
      transform: `translateY(${translateY}px) scale(${scale})`,
      opacity: opacity < 0 ? 0 : opacity,
    };
  }, [heroProgress]);

  const filteredProducts = products.filter((product) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    return (
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  });

  const featuredProducts = filteredProducts.filter((p) => p.featured).slice(0, 8);

  return (
    <main className="relative">
      <Navbar />
      <CartDrawer />
      <WhatsAppButton />

      <section
        id="inicio"
        className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0A1F44] px-6 pt-24 text-center text-[#F5F1E8]"
      >
        <div className="absolute inset-0 bg-[#0A1F44]" />

        <img
          src="https://raw.githubusercontent.com/serviciosMyM-debug/daphne-store/refs/heads/main/Daphne%20indumentaria/Torre%20Eiffiel.png"
          alt="Torre Eiffel"
          className="pointer-events-none fixed right-[-2%] top-0 z-0 h-screen w-auto max-w-none opacity-[0.80] mix-blend-multiply md:right-[1%]"
        />

        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#52688f]/35 via-[#27406d]/22 to-[#0A1F44]/70" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-b from-[#0A1F44]/18 via-transparent to-[#0A1F44]/82" />

        <div className="relative z-10 flex max-w-5xl flex-col items-center justify-center">
          <img
            src="/daphne-logo.png"
            alt="Daphné"
            className="h-auto w-[320px] max-w-full object-contain transition-transform duration-150 ease-out md:w-[520px] lg:w-[700px]"
            style={{
              ...logoStyle,
              filter: "brightness(0) invert(1)",
              transformOrigin: "center center",
            }}
          />

          <div
  className="mt-8 flex flex-col items-center transition-transform duration-150 ease-out"
  style={taglineStyle}
>
  <h2 className="signature-font text-center text-5xl leading-tight text-[#F5F1E8] md:text-6xl lg:text-7xl">
    Tu outfit es una extensión de ti
  </h2>

  <p className="mt-3 text-center text-sm font-semibold uppercase tracking-[0.28em] text-[#F5F1E8] md:text-base">
    Reflejando identidad, estilo y presencia
  </p>
</div>
        </div>
      </section>

      <section id="destacados" className="relative z-20 bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#C9A227]">
              Destacados
            </p>

            <h2 className="text-4xl text-[#0A1F44]">
              Productos destacados
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section id="catalogo" className="relative z-20 bg-[#F5F1E8] px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#C9A227]">
              Catálogo
            </p>

            <h2 className="text-4xl text-[#0A1F44]">
              Nuestros productos
            </h2>

            {searchQuery && (
              <p className="mt-3 text-sm text-[#0A1F44]/70">
                Resultados para: <strong>{searchQuery}</strong>
              </p>
            )}
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="mt-10 text-center text-[#0A1F44]/70">
              No encontramos productos para esa búsqueda.
            </div>
          )}
        </div>
      </section>

      <section id="contacto" className="relative z-20 bg-white px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#C9A227]">
              Contacto
            </p>

            <h2 className="mb-4 text-4xl text-[#0A1F44]">
              Estamos para ayudarte
            </h2>

            <p className="mb-6 text-[#0A1F44]/80">
              Consultanos por prendas, talles, disponibilidad o compras por mayor.
            </p>

            <div className="space-y-2 text-[#0A1F44]">
              <p><strong>Teléfono:</strong> +54 9 341 6230111</p>
              <p><strong>Email:</strong> info@daphne.com.ar</p>
              <p><strong>WhatsApp:</strong> disponible de lunes a sábados</p>
            </div>
          </div>

          <div id="envios" className="border border-[#C9A227]/30 bg-[#F5F1E8] p-8">
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#C9A227]">
              Envíos
            </p>

            <h3 className="mb-4 text-3xl text-[#0A1F44]">
              Información de entrega
            </h3>

            <ul className="space-y-3 text-[#0A1F44]/80">
              <li>Envíos a todo el país.</li>
              <li>Entrega estimada entre 3 y 7 días hábiles.</li>
              <li>Posibilidad de retiro en punto de entrega.</li>
              <li>Seguimiento de pedido por WhatsApp.</li>
            </ul>
          </div>
        </div>
      </section>

      <footer className="relative z-20 border-t border-[#C9A227]/20 bg-[#0A1F44] px-6 py-5">
  <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-3">

    <a
      href="https://serviciosmym.com.ar"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 transition-opacity hover:opacity-80"
    >
      <img
        src="/serviciosmym-logo.png"
        alt="ServiciosMyM"
        className="h-7 w-auto object-contain drop-shadow-[0_0_6px_rgba(255,255,255,0.6)] transition-all duration-300 hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]"
      />

      <span className="text-xs tracking-[0.08em] text-[#F5F1E8]/80">
        Hecho por <span className="font-semibold text-[#C9A227]">ServiciosMyM</span>
      </span>
    </a>

    <span className="text-xs text-[#F5F1E8]/50">
      Todos los derechos reservados.
    </span>

  </div>
</footer>
    </main>
  );
}
