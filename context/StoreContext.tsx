"use client";

import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  description: string;
  status: "EN STOCK" | "AGOTADO";
  sizeChart?: { [key: string]: string };
  featured?: boolean;
}

export interface CartItem extends Product {
  qty: number;
  selectedSize?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: CartItem[];
  total: number;
  status:
    | "Pendiente"
    | "Confirmado"
    | "En preparación"
    | "Enviado"
    | "Entregado"
    | "Cancelado";
  date: string;
  stockRestored?: boolean;
}

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  isCartOpen: boolean;
  searchQuery: string;
  customerName: string;
  setCustomerName: (name: string) => void;
  addToCart: (product: Product, selectedSize?: string) => void;
  removeFromCart: (id: number, selectedSize?: string) => void;
  updateQty: (id: number, delta: number, selectedSize?: string) => void;
  cartTotal: number;
  checkoutWhatsApp: () => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: number, updated: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  cancelOrder: (id: string) => void;
  deleteOrder: (id: string) => void;
  deleteCanceledOrders: () => void;
  setIsCartOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
}

const initialProducts: Product[] = [
  {
    id: 1,
    name: "CAMISA DE LINO NAVY",
    price: 12000,
    category: "Camisas",
    stock: 10,
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800",
    description: "Lino 100% importado, corte slim fit.",
    status: "EN STOCK",
    featured: true,
    sizeChart: { S: "50cm / 70cm", M: "53cm / 72cm", L: "56cm / 75cm" },
  },
  {
    id: 2,
    name: "PANTALÓN TROUSER CREMA",
    price: 18500,
    category: "Pantalones",
    stock: 5,
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800",
    description: "Tela fluida con caída perfecta.",
    status: "EN STOCK",
    featured: true,
    sizeChart: { S: "40cm", M: "42cm", L: "44cm" },
  },
  {
    id: 3,
    name: "BLAZER ESTRUCTURADO",
    price: 35000,
    category: "Abrigos",
    stock: 0,
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800",
    description: "Elegancia atemporal para el trabajo.",
    status: "AGOTADO",
    featured: false,
    sizeChart: { S: "90cm", M: "94cm", L: "98cm" },
  },
  {
    id: 4,
    name: "VESTIDO DE NOCHE",
    price: 28000,
    category: "Vestidos",
    stock: 3,
    image:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800",
    description: "Seda natural con detalles dorados.",
    status: "EN STOCK",
    featured: true,
    sizeChart: { S: "85cm", M: "88cm", L: "91cm" },
  },
  {
    id: 5,
    name: "REMERA BÁSICA PREMIUM",
    price: 9500,
    category: "Remeras",
    stock: 12,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
    description: "Algodón suave de alta calidad para uso diario.",
    status: "EN STOCK",
    featured: true,
    sizeChart: { S: "48cm / 68cm", M: "51cm / 70cm", L: "54cm / 73cm" },
  },
  {
    id: 6,
    name: "CAMISA OXFORD BLANCA",
    price: 14500,
    category: "Camisas",
    stock: 9,
    image:
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&q=80&w=800",
    description: "Clásica, elegante y versátil para cualquier ocasión.",
    status: "EN STOCK",
    featured: false,
    sizeChart: { S: "50cm / 71cm", M: "53cm / 73cm", L: "56cm / 76cm" },
  },
  {
    id: 7,
    name: "POLLERA SATINADA",
    price: 17000,
    category: "Polleras",
    stock: 6,
    image:
      "https://images.unsplash.com/photo-1583496661160-fb5886a13d27?auto=format&fit=crop&q=80&w=800",
    description: "Caída elegante y textura premium.",
    status: "EN STOCK",
    featured: true,
    sizeChart: { S: "36", M: "38", L: "40" },
  },
  {
    id: 8,
    name: "SACO LARGO NUDE",
    price: 32000,
    category: "Abrigos",
    stock: 4,
    image:
      "https://images.unsplash.com/photo-1548624313-0396c75d5d4a?auto=format&fit=crop&q=80&w=800",
    description: "Ideal para un look sofisticado y moderno.",
    status: "EN STOCK",
    featured: false,
    sizeChart: { S: "90cm", M: "95cm", L: "100cm" },
  },
  {
    id: 9,
    name: "JEAN RECTO CLÁSICO",
    price: 19000,
    category: "Pantalones",
    stock: 11,
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800",
    description: "Jean de corte recto con excelente calce.",
    status: "EN STOCK",
    featured: false,
    sizeChart: { "38": "38", "40": "40", "42": "42" },
  },
  {
    id: 10,
    name: "TOP MORLEY FIT",
    price: 8900,
    category: "Tops",
    stock: 14,
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800",
    description: "Diseño simple, moderno y cómodo.",
    status: "EN STOCK",
    featured: false,
    sizeChart: { S: "S", M: "M", L: "L" },
  },
  {
    id: 11,
    name: "BUZO OVERSIZE CREMA",
    price: 21000,
    category: "Buzos",
    stock: 8,
    image:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800",
    description: "Buzo amplio, cálido y con estilo urbano premium.",
    status: "EN STOCK",
    featured: true,
    sizeChart: { S: "Ancho 58cm", M: "Ancho 61cm", L: "Ancho 64cm" },
  },
  {
    id: 12,
    name: "CAMISA RAYADA MODERN",
    price: 15800,
    category: "Camisas",
    stock: 7,
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800",
    description: "Estampa sutil y corte moderno.",
    status: "EN STOCK",
    featured: false,
    sizeChart: { S: "49cm / 70cm", M: "52cm / 72cm", L: "55cm / 75cm" },
  },
  {
    id: 13,
    name: "VESTIDO MIDI ELEGANCE",
    price: 26500,
    category: "Vestidos",
    stock: 6,
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=800",
    description: "Vestido midi con terminaciones delicadas.",
    status: "EN STOCK",
    featured: true,
    sizeChart: { S: "84cm", M: "88cm", L: "92cm" },
  },
  {
    id: 14,
    name: "CHALECO TEJIDO SOFT",
    price: 16000,
    category: "Tejidos",
    stock: 10,
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
    description: "Textura suave y look versátil.",
    status: "EN STOCK",
    featured: false,
    sizeChart: { S: "S", M: "M", L: "L" },
  },
  {
    id: 15,
    name: "PANTALÓN SASTRERO BLACK",
    price: 22500,
    category: "Pantalones",
    stock: 5,
    image:
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&q=80&w=800",
    description: "Corte elegante ideal para oficina y eventos.",
    status: "EN STOCK",
    featured: true,
    sizeChart: { "38": "38", "40": "40", "42": "42" },
  },
  {
    id: 16,
    name: "REMERA RIB PREMIUM",
    price: 9900,
    category: "Remeras",
    stock: 16,
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800",
    description: "Remera ajustada con textura rib.",
    status: "EN STOCK",
    featured: false,
    sizeChart: { S: "S", M: "M", L: "L" },
  },
  {
    id: 17,
    name: "CAMPERA BOMBER URBAN",
    price: 34000,
    category: "Abrigos",
    stock: 4,
    image:
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&q=80&w=800",
    description: "Diseño urbano con terminación premium.",
    status: "EN STOCK",
    featured: false,
    sizeChart: { S: "S", M: "M", L: "L" },
  },
  {
    id: 18,
    name: "BLUSA SATÉN GOLD",
    price: 17500,
    category: "Blusas",
    stock: 9,
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800",
    description: "Brillo sutil y presencia elegante.",
    status: "EN STOCK",
    featured: true,
    sizeChart: { S: "S", M: "M", L: "L" },
  },
  {
    id: 19,
    name: "MONO LARGO NOIR",
    price: 31000,
    category: "Monos",
    stock: 3,
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=800",
    description: "Una prenda sofisticada para ocasiones especiales.",
    status: "EN STOCK",
    featured: false,
    sizeChart: { S: "S", M: "M", L: "L" },
  },
  {
    id: 20,
    name: "SHORT DE LINO NATURAL",
    price: 13200,
    category: "Shorts",
    stock: 10,
    image:
      "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&q=80&w=800",
    description: "Liviano y fresco para temporada cálida.",
    status: "EN STOCK",
    featured: false,
    sizeChart: { S: "S", M: "M", L: "L" },
  },
  {
    id: 21,
    name: "SWEATER CUELLO V",
    price: 19800,
    category: "Tejidos",
    stock: 8,
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=800",
    description: "Tejido liviano con terminación delicada.",
    status: "EN STOCK",
    featured: false,
    sizeChart: { S: "S", M: "M", L: "L" },
  },
  {
    id: 22,
    name: "CAMISA DENIM LIGHT",
    price: 16900,
    category: "Camisas",
    stock: 7,
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800",
    description: "Camisa denim suave de tono claro.",
    status: "EN STOCK",
    featured: false,
    sizeChart: { S: "50cm / 70cm", M: "53cm / 72cm", L: "56cm / 75cm" },
  },
  {
    id: 23,
    name: "VESTIDO CAMISERO IVORY",
    price: 24200,
    category: "Vestidos",
    stock: 5,
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=800",
    description: "Minimalista, fresco y delicado.",
    status: "EN STOCK",
    featured: true,
    sizeChart: { S: "S", M: "M", L: "L" },
  },
  {
    id: 24,
    name: "PANTALÓN WIDE LEG",
    price: 23000,
    category: "Pantalones",
    stock: 6,
    image:
      "https://images.unsplash.com/photo-1506629905607-c512398df1f9?auto=format&fit=crop&q=80&w=800",
    description: "Caída amplia y elegante.",
    status: "EN STOCK",
    featured: false,
    sizeChart: { "38": "38", "40": "40", "42": "42" },
  },
];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [customerName, setCustomerName] = useState("");

useEffect(() => {
  const savedProducts = localStorage.getItem("products");
  if (savedProducts) {
    try {
      const parsedProducts = JSON.parse(savedProducts) as Product[];

      if (parsedProducts.length >= initialProducts.length) {
        setProducts(parsedProducts);
      } else {
        localStorage.setItem("products", JSON.stringify(initialProducts));
        setProducts(initialProducts);
      }
    } catch {
      localStorage.removeItem("products");
      setProducts(initialProducts);
    }
  } else {
    setProducts(initialProducts);
  }

  const savedOrders = localStorage.getItem("orders");
  if (savedOrders) {
    try {
      setOrders(JSON.parse(savedOrders) as Order[]);
    } catch {
      localStorage.removeItem("orders");
    }
  }
}, []);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const addToCart = (product: Product, selectedSize?: string) => {
    if (product.stock <= 0 || product.status === "AGOTADO") return;

    setCart((prev) => {
      const existing = prev.find(
        (item) => item.id === product.id && item.selectedSize === selectedSize
      );

      const currentQtyForThisProduct = prev
        .filter((item) => item.id === product.id)
        .reduce((acc, item) => acc + item.qty, 0);

      if (currentQtyForThisProduct >= product.stock) return prev;

      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.selectedSize === selectedSize
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [...prev, { ...product, qty: 1, selectedSize }];
    });
  };

  const removeFromCart = (id: number, selectedSize?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.id === id && item.selectedSize === selectedSize)
      )
    );
  };

  const updateQty = (id: number, delta: number, selectedSize?: string) => {
    setCart((prev) => {
      const product = products.find((p) => p.id === id);
      if (!product) return prev;

      const totalQtyForThisProduct = prev
        .filter((item) => item.id === id)
        .reduce((acc, item) => acc + item.qty, 0);

      return prev
        .map((item) => {
          if (!(item.id === id && item.selectedSize === selectedSize)) return item;

          const newQty = item.qty + delta;
          if (newQty <= 0) return null;

          const otherSizesQty = totalQtyForThisProduct - item.qty;
          if (otherSizesQty + newQty > product.stock) return item;

          return { ...item, qty: newQty };
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const cartTotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.qty, 0),
    [cart]
  );

  const checkoutWhatsApp = () => {
    if (cart.length === 0) return;
    if (!customerName.trim()) return;

    let message = `Hola, mi nombre es ${customerName.trim()} y quiero consultar por esta compra:\n\n`;
    cart.forEach((item) => {
      const sizeText = item.selectedSize ? ` - Talle ${item.selectedSize}` : "";
      message += `- ${item.name}${sizeText} (x${item.qty}): $${(
        item.price * item.qty
      ).toLocaleString()}\n`;
    });
    message += `\n*Total: $${cartTotal.toLocaleString()}*`;

    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      customerName: customerName.trim(),
      customerEmail: "",
      customerPhone: "5493476552545",
      items: cart,
      total: cartTotal,
      status: "Pendiente",
      date: new Date().toLocaleString("es-AR"),
      stockRestored: false,
    };

    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        const matchingCartItems = cart.filter((item) => item.id === product.id);
        if (matchingCartItems.length === 0) return product;

        const qtyToDiscount = matchingCartItems.reduce((acc, item) => acc + item.qty, 0);
        const newStock = Math.max(product.stock - qtyToDiscount, 0);

        return {
          ...product,
          stock: newStock,
          status: newStock > 0 ? "EN STOCK" : "AGOTADO",
        };
      })
    );

    setOrders((prev) => [newOrder, ...prev]);

    window.open(
      `https://wa.me/5493416230111?text=${encodeURIComponent(message)}`,
      "_blank"
    );

    setCart([]);
    setCustomerName("");
    setIsCartOpen(false);
  };

  const addProduct = (product: Product) => {
    const normalizedProduct: Product = {
      ...product,
      id: Date.now(),
      price: Number(product.price),
      stock: Number(product.stock),
      status: Number(product.stock) > 0 ? "EN STOCK" : "AGOTADO",
    };

    setProducts((prev) => [...prev, normalizedProduct]);
  };

  const updateProduct = (id: number, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;

        const nextStock = Number(updated.stock ?? p.stock);
        const nextPrice = Number(updated.price ?? p.price);

        const merged: Product = {
          ...p,
          ...updated,
          stock: nextStock,
          price: nextPrice,
          status: nextStock > 0 ? "EN STOCK" : "AGOTADO",
        };

        return merged;
      })
    );

    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id !== id) return item;

          const nextStock = Number(updated.stock ?? item.stock);
          const nextPrice = Number(updated.price ?? item.price);

          const updatedItem: CartItem = {
            ...item,
            ...updated,
            stock: nextStock,
            price: nextPrice,
            status: nextStock > 0 ? "EN STOCK" : "AGOTADO",
            qty: item.qty > nextStock ? nextStock : item.qty,
          };

          return updatedItem.qty > 0 ? updatedItem : null;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const deleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const updateOrderStatus = (id: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  };

  const cancelOrder = (id: string) => {
    const orderToCancel = orders.find((o) => o.id === id);
    if (!orderToCancel) return;

    if (!orderToCancel.stockRestored) {
      setProducts((prevProducts) =>
        prevProducts.map((product) => {
          const matchingItems = orderToCancel.items.filter((item) => item.id === product.id);
          if (matchingItems.length === 0) return product;

          const qtyToRestore = matchingItems.reduce((acc, item) => acc + item.qty, 0);
          const restoredStock = product.stock + qtyToRestore;

          return {
            ...product,
            stock: restoredStock,
            status: restoredStock > 0 ? "EN STOCK" : "AGOTADO",
          };
        })
      );
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? { ...o, status: "Cancelado", stockRestored: true }
          : o
      )
    );
  };

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  const deleteCanceledOrders = () => {
    setOrders((prev) => prev.filter((o) => o.status !== "Cancelado"));
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        orders,
        isCartOpen,
        searchQuery,
        customerName,
        setCustomerName,
        addToCart,
        removeFromCart,
        updateQty,
        cartTotal,
        checkoutWhatsApp,
        addProduct,
        updateProduct,
        deleteProduct,
        addOrder,
        updateOrderStatus,
        cancelOrder,
        deleteOrder,
        deleteCanceledOrders,
        setIsCartOpen,
        setSearchQuery,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return context;
};