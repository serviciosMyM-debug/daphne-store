"use client";

import { useMemo, useState, useEffect } from "react";
import SystemModal from "../../components/SystemModal";
import { Product, useStore, Order } from "../../context/StoreContext";

type ModalConfig = {
  open: boolean;
  title: string;
  message: string;
  type: "info" | "confirm";
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
};

const emptyForm: Omit<Product, "id"> = {
  name: "",
  price: 0,
  category: "",
  stock: 0,
  image: "",
  description: "",
  status: "AGOTADO",
  sizeChart: {},
  featured: false,
};

export default function AdminPage() {
  const {
    products,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    cancelOrder,
    deleteOrder,
    deleteCanceledOrders,
  } = useStore();

  const [productSearch, setProductSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [form, setForm] = useState<Omit<Product, "id">>(emptyForm);

  const [modal, setModal] = useState<ModalConfig>({
    open: false,
    title: "",
    message: "",
    type: "info",
    confirmText: "Aceptar",
    cancelText: "Cancelar",
    onConfirm: () => {},
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeModal = () => {
    setModal((prev) => ({ ...prev, open: false }));
  };

  const showInfo = (title: string, message: string) => {
    setModal({
      open: true,
      title,
      message,
      type: "info",
      confirmText: "Entendido",
      cancelText: "Cerrar",
      onConfirm: closeModal,
    });
  };

  const showConfirm = (
    title: string,
    message: string,
    onConfirmAction: () => void,
    confirmText = "Confirmar",
    cancelText = "Volver"
  ) => {
    setModal({
      open: true,
      title,
      message,
      type: "confirm",
      confirmText,
      cancelText,
      onConfirm: () => {
        onConfirmAction();
        closeModal();
      },
    });
  };

  const totalStock = useMemo(
    () => products.reduce((acc, p) => acc + p.stock, 0),
    [products]
  );

  const totalValue = useMemo(
    () => products.reduce((acc, p) => acc + p.price * p.stock, 0),
    [products]
  );

  const canceledCount = useMemo(
    () => orders.filter((o) => o.status === "Cancelado").length,
    [orders]
  );

  const pendingCount = useMemo(
    () => orders.filter((o) => o.status === "Pendiente").length,
    [orders]
  );

  const lowStockProducts = useMemo(
    () => products.filter((p) => p.stock > 0 && p.stock <= 3),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const q = productSearch.trim().toLowerCase();
    if (!q) return products;

    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [products, productSearch]);

  const orderBadgeClass = (status: Order["status"]) => {
    switch (status) {
      case "Pendiente":
        return "bg-yellow-100 text-yellow-700";
      case "Confirmado":
        return "bg-blue-100 text-blue-700";
      case "En preparación":
        return "bg-purple-100 text-purple-700";
      case "Enviado":
        return "bg-cyan-100 text-cyan-700";
      case "Entregado":
        return "bg-green-100 text-green-700";
      case "Cancelado":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const salesByMonth = useMemo(() => {
    const monthNames = ["Oct", "Nov", "Dic", "Ene", "Feb", "Mar"];
    const values = [0, 0, 0, 0, 0, 0];

    orders.forEach((order, index) => {
      const bucket = index % 6;
      if (order.status !== "Cancelado") {
        values[bucket] += order.total;
      }
    });

    return monthNames.map((label, i) => ({
      label,
      value: values[i],
    }));
  }, [orders]);

  const bestSellingProducts = useMemo(() => {
    const map = new Map<string, number>();

    orders.forEach((order) => {
      if (order.status === "Cancelado") return;
      order.items.forEach((item) => {
        map.set(item.name, (map.get(item.name) || 0) + item.qty);
      });
    });

    return Array.from(map.entries())
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }, [orders]);

  const topProductName =
    bestSellingProducts.length > 0 ? bestSellingProducts[0].name : "Sin datos";

  const maxSales = Math.max(...salesByMonth.map((m) => m.value), 1);
  const maxBestSelling = Math.max(...bestSellingProducts.map((p) => p.qty), 1);

  const todayRevenue = useMemo(() => {
    const today = new Date().toLocaleDateString("es-AR");
    return orders
      .filter(
        (o) =>
          o.status !== "Cancelado" &&
          new Date(o.date).toLocaleDateString("es-AR") === today
      )
      .reduce((acc, o) => acc + o.total, 0);
  }, [orders]);

  const monthRevenue = useMemo(() => {
    return orders
      .filter((o) => o.status !== "Cancelado")
      .reduce((acc, o) => acc + o.total, 0);
  }, [orders]);

  const customerCount = useMemo(() => {
    const names = new Set(
      orders
        .map((o) => o.customerName?.trim())
        .filter((name) => !!name && name.length > 0)
    );
    return names.size;
  }, [orders]);

  const handleQuickStockChange = (product: Product, delta: number) => {
    const newStock = Math.max(product.stock + delta, 0);
    updateProduct(product.id, { stock: newStock });
    showInfo("Stock actualizado", `El stock de ${product.name} quedó en ${newStock}.`);
  };

  const openAddProduct = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowProductForm(true);
  };

  const openEditProduct = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image: product.image,
      description: product.description,
      status: product.status,
      sizeChart: product.sizeChart || {},
      featured: !!product.featured,
    });
    setShowProductForm(true);
  };

  const saveProduct = () => {
    if (!form.name.trim()) {
      showInfo("Falta el nombre", "El producto debe tener un nombre.");
      return;
    }

    if (!form.category.trim()) {
      showInfo("Falta la categoría", "Indicá la categoría del producto.");
      return;
    }

    if (!form.image.trim()) {
      showInfo("Falta la imagen", "Cargá una URL de imagen para el producto.");
      return;
    }

    const productData: Omit<Product, "id"> = {
      ...form,
      name: form.name.trim().toUpperCase(),
      category: form.category.trim(),
      image: form.image.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      status: Number(form.stock) > 0 ? "EN STOCK" : "AGOTADO",
      featured: !!form.featured,
    };

    if (editingId !== null) {
      updateProduct(editingId, productData);
      showInfo("Producto actualizado", "Los cambios se guardaron correctamente.");
    } else {
      addProduct({
        id: 0,
        ...productData,
      });
      showInfo("Producto agregado", "El producto se agregó correctamente.");
    }

    setShowProductForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <>
      <main className="min-h-screen bg-[#F5F1E8]">
        <nav
          className={`sticky top-0 z-40 transition-all duration-300 ${
            scrolled
              ? "border-b border-[#C9A227]/20 bg-[#0A1F44]/95 py-3 shadow-lg backdrop-blur-md"
              : "border-b border-[#C9A227]/20 bg-[#0A1F44] py-4"
          }`}
        >
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#C9A227]">
                Panel administrativo
              </p>
              <h1 className="text-2xl font-bold text-white">Control general</h1>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.16em]">
              <a href="#graficas" className="rounded-full border border-white/15 px-4 py-2 text-white transition hover:border-[#C9A227] hover:text-[#C9A227]">
                Gráficas
              </a>
              <a href="#stock-bajo" className="rounded-full border border-white/15 px-4 py-2 text-white transition hover:border-[#C9A227] hover:text-[#C9A227]">
                Stock bajo
              </a>
              <a href="#listado-productos" className="rounded-full border border-white/15 px-4 py-2 text-white transition hover:border-[#C9A227] hover:text-[#C9A227]">
                Productos
              </a>
              <a href="#pedidos" className="rounded-full border border-white/15 px-4 py-2 text-white transition hover:border-[#C9A227] hover:text-[#C9A227]">
                Pedidos
              </a>
            </div>
          </div>
        </nav>

        <div className="mx-auto max-w-7xl px-6 py-8">
          <section id="graficas" className="scroll-mt-28">
            <div className="mb-8 grid gap-6 md:grid-cols-4 xl:grid-cols-4">
              <MetricCard title="Ventas totales" value={`$ ${totalValue.toLocaleString()}`} subtitle="Facturación acumulada" />
              <MetricCard title="Pedidos" value={String(orders.length)} subtitle="Cantidad total" />
              <MetricCard title="Clientes" value={String(customerCount)} subtitle="Base registrada" />
              <MetricCard title="Pendientes" value={String(pendingCount)} subtitle="Requieren atención" />
              <MetricCard title="Hoy" value={`$ ${todayRevenue.toLocaleString()}`} subtitle="Ingreso del día" />
              <MetricCard title="Mes" value={`$ ${monthRevenue.toLocaleString()}`} subtitle="Ingreso mensual" />
              <MetricCard title="Más vendido" value={topProductName.toUpperCase()} subtitle="Producto destacado" />
              <MetricCard title="Stock bajo" value={String(lowStockProducts.length)} subtitle="Productos a reponer" />
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
              <div className="rounded-[2rem] border border-[#C9A227]/20 bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-2xl font-bold text-[#0A1F44]">Ingresos del mes</h2>

                <div className="flex h-[320px] items-end gap-4 rounded-2xl bg-[#F5F1E8] p-5">
                  {salesByMonth.map((month) => (
                    <div key={month.label} className="flex flex-1 flex-col items-center justify-end gap-3">
                      <div
                        className="w-full rounded-t-3xl bg-[#D9D1B8] transition-all"
                        style={{
                          height: `${Math.max((month.value / maxSales) * 220, 12)}px`,
                        }}
                      />
                      <span className="text-sm font-semibold text-[#0A1F44]">{month.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-[#C9A227]/20 bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-2xl font-bold text-[#0A1F44]">Productos más vendidos</h2>

                <div className="flex h-[320px] items-end gap-4 rounded-2xl bg-[#F5F1E8] p-5">
                  {(bestSellingProducts.length > 0
                    ? bestSellingProducts
                    : [
                        { name: "Sin datos", qty: 1 },
                        { name: "Sin datos", qty: 1 },
                        { name: "Sin datos", qty: 1 },
                      ]
                  ).map((item, index) => (
                    <div key={`${item.name}-${index}`} className="flex flex-1 flex-col items-center justify-end gap-3">
                      <div
                        className="w-full rounded-t-xl bg-[#0A1F44]"
                        style={{
                          height: `${Math.max((item.qty / maxBestSelling) * 220, 40)}px`,
                        }}
                      />
                      <span className="line-clamp-2 text-center text-sm font-semibold uppercase text-[#0A1F44]">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="stock-bajo" className="scroll-mt-28 pt-12">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.28em] text-[#C9A227]">Panel administrativo</p>
              <h2 className="text-4xl font-bold text-[#0A1F44]">Stock bajo</h2>
            </div>

            {lowStockProducts.length === 0 ? (
              <div className="rounded-[2rem] border border-[#C9A227]/20 bg-white p-6 text-[#0A1F44]/70 shadow-sm">
                No hay productos con stock bajo en este momento.
              </div>
            ) : (
              <div className="space-y-5">
                {lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="rounded-[2rem] border border-[#C9A227]/20 bg-white p-6 shadow-sm"
                  >
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <span className="rounded-full border border-[#D1A521] px-4 py-1 text-sm font-bold text-[#D1A521]">
                        Stock bajo
                      </span>
                      <span className="text-xl text-[#D1A521]">⚠</span>
                    </div>

                    <h3 className="mb-2 text-3xl font-bold uppercase text-[#0A1F44]">
                      {product.name}
                    </h3>

                    <p className="text-lg text-[#0A1F44]/75">
                      Quedan <strong>{product.stock}</strong> unidades disponibles.
                    </p>
                    <p className="mt-1 text-lg text-[#0A1F44]/75">
                      Categoría: {product.category}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section id="listado-productos" className="scroll-mt-28 pt-12">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#C9A227]">Catálogo</p>
                <h2 className="text-4xl font-bold text-[#0A1F44]">Listado de productos</h2>
              </div>

              <div className="flex w-full max-w-2xl flex-col gap-3 md:flex-row md:items-end">
                <div className="flex-1">
                  <label className="mb-2 block text-sm font-semibold text-[#0A1F44]">
                    Buscar prenda
                  </label>
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Buscar por nombre, categoría o detalle..."
                    className="w-full rounded-xl border border-[#C9A227]/25 bg-white px-4 py-3 outline-none"
                  />
                </div>

                <button
                  onClick={openAddProduct}
                  className="rounded-xl bg-[#0A1F44] px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#102b5f]"
                >
                  Agregar producto
                </button>
              </div>
            </div>

            {showProductForm && (
              <div className="mb-6 rounded-[2rem] border border-[#C9A227]/20 bg-white p-6 shadow-sm">
                <h3 className="mb-5 text-2xl font-bold text-[#0A1F44]">
                  {editingId !== null ? "Editar producto" : "Agregar producto"}
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Nombre del producto"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value.toUpperCase() })}
                    className="rounded border px-4 py-3"
                  />

                  <input
                    type="text"
                    placeholder="Categoría"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="rounded border px-4 py-3"
                  />

                  <input
                    type="number"
                    placeholder="Precio"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="rounded border px-4 py-3"
                  />

                  <input
                    type="number"
                    placeholder="Stock"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                    className="rounded border px-4 py-3"
                  />

                  <input
                    type="text"
                    placeholder="URL de la imagen"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="rounded border px-4 py-3 md:col-span-2"
                  />

                  <textarea
                    placeholder="Descripción"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="min-h-[120px] rounded border px-4 py-3 md:col-span-2"
                  />

                  <label className="flex items-center gap-3 text-sm font-semibold text-[#0A1F44] md:col-span-2">
                    <input
                      type="checkbox"
                      checked={!!form.featured}
                      onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    />
                    Marcar como producto destacado
                  </label>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    onClick={saveProduct}
                    className="rounded-lg bg-[#0A1F44] px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#102b5f]"
                  >
                    {editingId !== null ? "Guardar cambios" : "Agregar producto"}
                  </button>

                  <button
                    onClick={() => {
                      setShowProductForm(false);
                      setEditingId(null);
                      setForm(emptyForm);
                    }}
                    className="rounded-lg bg-gray-200 px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-gray-700 transition hover:bg-gray-300"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            <div className="rounded-[2rem] border border-[#C9A227]/20 bg-white p-6 shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="py-3 pr-4">Producto</th>
                      <th className="py-3 pr-4">Categoría</th>
                      <th className="py-3 pr-4">Precio</th>
                      <th className="py-3 pr-4">Stock</th>
                      <th className="py-3 pr-4">Estado</th>
                      <th className="py-3 pr-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="border-b">
                        <td className="py-3 pr-4 font-semibold text-[#0A1F44]">{p.name}</td>
                        <td className="py-3 pr-4">{p.category}</td>
                        <td className="py-3 pr-4">${p.price.toLocaleString()}</td>
                        <td className="py-3 pr-4">{p.stock}</td>
                        <td className="py-3 pr-4">
                          <span
                            className={`rounded px-2 py-1 text-xs font-bold ${
                              p.status === "EN STOCK"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleQuickStockChange(p, 1)}
                              className="rounded bg-green-600 px-3 py-2 text-xs font-bold text-white hover:bg-green-700"
                            >
                              + Stock
                            </button>
                            <button
                              onClick={() => openEditProduct(p)}
                              className="rounded bg-[#C9A227] px-3 py-2 text-xs font-bold text-[#0A1F44] hover:opacity-90"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() =>
                                showConfirm(
                                  "Eliminar producto",
                                  `¿Querés eliminar el producto ${p.name}? Esta acción no se puede deshacer.`,
                                  () => deleteProduct(p.id),
                                  "Eliminar",
                                  "Volver"
                                )
                              }
                              className="rounded bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredProducts.length === 0 && (
                  <div className="py-8 text-center text-[#0A1F44]/70">
                    No encontramos productos para esa búsqueda.
                  </div>
                )}
              </div>
            </div>
          </section>

          <section id="pedidos" className="scroll-mt-28 pt-12">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#C9A227]">Gestión comercial</p>
                <h2 className="text-4xl font-bold text-[#0A1F44]">Pedidos</h2>
              </div>

              {canceledCount > 0 && (
                <button
                  onClick={() =>
                    showConfirm(
                      "Limpiar cancelados",
                      "¿Querés eliminar todos los pedidos cancelados del listado?",
                      () => deleteCanceledOrders(),
                      "Limpiar",
                      "Volver"
                    )
                  }
                  className="rounded bg-red-700 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white hover:bg-red-800"
                >
                  Limpiar cancelados
                </button>
              )}
            </div>

            {orders.length === 0 ? (
              <div className="rounded-[2rem] border border-[#C9A227]/20 bg-white p-6 text-[#0A1F44]/70 shadow-sm">
                Todavía no hay pedidos cargados.
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-[2rem] border border-[#C9A227]/20 bg-white p-6 shadow-sm"
                  >
                    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm text-gray-500">ID: {order.id}</p>
                        <h3 className="text-2xl font-bold text-[#0A1F44]">{order.customerName}</h3>
                        <p className="text-sm text-gray-500">{order.date}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`rounded px-3 py-1 text-xs font-bold ${orderBadgeClass(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>

                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(order.id, e.target.value as Order["status"])
                          }
                          className="rounded border px-3 py-2 text-sm"
                          disabled={order.status === "Cancelado"}
                        >
                          <option value="Pendiente">Pendiente</option>
                          <option value="Confirmado">Confirmado</option>
                          <option value="En preparación">En preparación</option>
                          <option value="Enviado">Enviado</option>
                          <option value="Entregado">Entregado</option>
                          <option value="Cancelado">Cancelado</option>
                        </select>

                        {order.status !== "Cancelado" ? (
                          <button
                            onClick={() =>
                              showConfirm(
                                "Cancelar pedido",
                                "¿Querés cancelar este pedido y devolver stock una sola vez?",
                                () => cancelOrder(order.id),
                                "Cancelar pedido",
                                "Volver"
                              )
                            }
                            className="rounded bg-orange-500 px-3 py-2 text-xs font-bold text-white hover:bg-orange-600"
                          >
                            Cancelar pedido
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              showConfirm(
                                "Eliminar cancelado",
                                "¿Querés eliminar este pedido cancelado del listado?",
                                () => deleteOrder(order.id),
                                "Eliminar",
                                "Volver"
                              )
                            }
                            className="rounded bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700"
                          >
                            Eliminar cancelado
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse">
                        <thead>
                          <tr className="border-b text-left">
                            <th className="py-2 pr-4">Producto</th>
                            <th className="py-2 pr-4">Talle</th>
                            <th className="py-2 pr-4">Cantidad</th>
                            <th className="py-2 pr-4">Precio</th>
                            <th className="py-2 pr-4">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item, idx) => (
                            <tr key={`${order.id}-${item.id}-${idx}`} className="border-b">
                              <td className="py-2 pr-4">{item.name}</td>
                              <td className="py-2 pr-4">{item.selectedSize || "-"}</td>
                              <td className="py-2 pr-4">{item.qty}</td>
                              <td className="py-2 pr-4">${item.price.toLocaleString()}</td>
                              <td className="py-2 pr-4">
                                ${(item.price * item.qty).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div className="text-sm text-gray-500">
                        {order.status === "Cancelado" && order.stockRestored
                          ? "Stock devuelto correctamente."
                          : "Pedido activo."}
                      </div>

                      <div className="text-lg font-bold text-[#0A1F44]">
                        Total: ${order.total.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <SystemModal
        open={modal.open}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        confirmText={modal.confirmText}
        cancelText={modal.cancelText}
        onConfirm={modal.onConfirm}
        onCancel={closeModal}
      />
    </>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-[2rem] border border-[#C9A227]/20 bg-white p-6 shadow-sm">
      <p className="text-xs uppercase tracking-[0.28em] text-[#C9A227]">{title}</p>
      <div className="mt-4 text-4xl font-black uppercase leading-none text-[#0A1F44]">
        {value}
      </div>
      <p className="mt-3 text-lg text-[#0A1F44]/65">{subtitle}</p>
    </div>
  );
}