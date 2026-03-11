"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

export interface ProductVariant {
  color: string;
  size: string;
  stock: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  images?: string[];
  colors?: string[];
  variants?: ProductVariant[];
  description: string;
  status: "EN STOCK" | "AGOTADO";
  sizeChart?: { [key: string]: string };
  featured?: boolean;
}

export interface CartItem extends Product {
  qty: number;
  selectedSize?: string;
  selectedColor?: string;
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
  addToCart: (product: Product, selectedSize?: string, selectedColor?: string) => void;
  removeFromCart: (id: number, selectedSize?: string, selectedColor?: string) => void;
  updateQty: (
    id: number,
    delta: number,
    selectedSize?: string,
    selectedColor?: string
  ) => void;
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
    stock: 6,
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800",
    ],
    colors: ["Azul", "Blanco"],
    variants: [
      { color: "Azul", size: "S", stock: 2 },
      { color: "Azul", size: "M", stock: 1 },
      { color: "Azul", size: "L", stock: 1 },
      { color: "Blanco", size: "S", stock: 1 },
      { color: "Blanco", size: "M", stock: 1 },
      { color: "Blanco", size: "L", stock: 0 },
    ],
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
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800",
    ],
    colors: ["Crema"],
    variants: [
      { color: "Crema", size: "S", stock: 2 },
      { color: "Crema", size: "M", stock: 2 },
      { color: "Crema", size: "L", stock: 1 },
    ],
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
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800",
    ],
    colors: ["Negro"],
    variants: [
      { color: "Negro", size: "S", stock: 0 },
      { color: "Negro", size: "M", stock: 0 },
      { color: "Negro", size: "L", stock: 0 },
    ],
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
    images: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800",
    ],
    colors: ["Negro"],
    variants: [
      { color: "Negro", size: "S", stock: 1 },
      { color: "Negro", size: "M", stock: 1 },
      { color: "Negro", size: "L", stock: 1 },
    ],
    description: "Seda natural con detalles dorados.",
    status: "EN STOCK",
    featured: true,
    sizeChart: { S: "85cm", M: "88cm", L: "91cm" },
  },
];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const normalizeProduct = (product: Product): Product => {
  const images =
    product.images && product.images.length > 0
      ? product.images.slice(0, 5)
      : product.image
      ? [product.image]
      : [];

  const variants = (product.variants || []).map((variant) => ({
    color: variant.color?.trim() || "",
    size: variant.size?.trim() || "",
    stock: Number(variant.stock) || 0,
  }));

  const totalStock =
    variants.length > 0
      ? variants.reduce((acc, variant) => acc + variant.stock, 0)
      : Number(product.stock) || 0;

  return {
    ...product,
    price: Number(product.price) || 0,
    stock: totalStock,
    image: images[0] || product.image || "",
    images,
    colors:
      variants.length > 0
        ? Array.from(new Set(variants.map((v) => v.color).filter(Boolean)))
        : product.colors || [],
    variants,
    status: totalStock > 0 ? "EN STOCK" : "AGOTADO",
  };
};

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts.map(normalizeProduct));
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
        const normalizedProducts = parsedProducts.map(normalizeProduct);

        if (normalizedProducts.length > 0) {
          setProducts(normalizedProducts);
        } else {
          const initialNormalized = initialProducts.map(normalizeProduct);
          localStorage.setItem("products", JSON.stringify(initialNormalized));
          setProducts(initialNormalized);
        }
      } catch {
        localStorage.removeItem("products");
        setProducts(initialProducts.map(normalizeProduct));
      }
    } else {
      setProducts(initialProducts.map(normalizeProduct));
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

  const getVariantStock = (product: Product, size?: string, color?: string) => {
    if (!product.variants || product.variants.length === 0) {
      return product.stock;
    }

    const variant = product.variants.find(
      (v) => v.size === (size || "") && v.color === (color || "")
    );

    return variant ? variant.stock : 0;
  };

  const addToCart = (product: Product, selectedSize?: string, selectedColor?: string) => {
    if (product.status === "AGOTADO") return;

    const variantStock = getVariantStock(product, selectedSize, selectedColor);
    if (variantStock <= 0) return;

    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          item.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
      );

      const currentQtyForThisVariant = prev
        .filter(
          (item) =>
            item.id === product.id &&
            item.selectedSize === selectedSize &&
            item.selectedColor === selectedColor
        )
        .reduce((acc, item) => acc + item.qty, 0);

      if (currentQtyForThisVariant >= variantStock) return prev;

      if (existing) {
        return prev.map((item) =>
          item.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [...prev, { ...product, qty: 1, selectedSize, selectedColor }];
    });
  };

  const removeFromCart = (id: number, selectedSize?: string, selectedColor?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.id === id &&
            item.selectedSize === selectedSize &&
            item.selectedColor === selectedColor
          )
      )
    );
  };

  const updateQty = (
    id: number,
    delta: number,
    selectedSize?: string,
    selectedColor?: string
  ) => {
    setCart((prev) => {
      const product = products.find((p) => p.id === id);
      if (!product) return prev;

      const variantStock = getVariantStock(product, selectedSize, selectedColor);

      return prev
        .map((item) => {
          if (
            !(
              item.id === id &&
              item.selectedSize === selectedSize &&
              item.selectedColor === selectedColor
            )
          ) {
            return item;
          }

          const newQty = item.qty + delta;
          if (newQty <= 0) return null;
          if (newQty > variantStock) return item;

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
      const colorText = item.selectedColor ? ` - Color ${item.selectedColor}` : "";
      message += `- ${item.name}${sizeText}${colorText} (x${item.qty}): $${(
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

        if (product.variants && product.variants.length > 0) {
          const updatedVariants = product.variants.map((variant) => {
            const matchingVariantItems = matchingCartItems.filter(
              (item) =>
                item.selectedSize === variant.size &&
                item.selectedColor === variant.color
            );

            if (matchingVariantItems.length === 0) return variant;

            const qtyToDiscount = matchingVariantItems.reduce(
              (acc, item) => acc + item.qty,
              0
            );

            return {
              ...variant,
              stock: Math.max(variant.stock - qtyToDiscount, 0),
            };
          });

          const totalStock = updatedVariants.reduce((acc, v) => acc + v.stock, 0);

          return normalizeProduct({
            ...product,
            variants: updatedVariants,
            stock: totalStock,
          });
        }

        const qtyToDiscount = matchingCartItems.reduce((acc, item) => acc + item.qty, 0);
        const newStock = Math.max(product.stock - qtyToDiscount, 0);

        return normalizeProduct({
          ...product,
          stock: newStock,
        });
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
    const normalizedProduct = normalizeProduct({
      ...product,
      id: Date.now(),
    });

    setProducts((prev) => [...prev, normalizedProduct]);
  };

  const updateProduct = (id: number, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        return normalizeProduct({
          ...p,
          ...updated,
          id: p.id,
        });
      })
    );

    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id !== id) return item;

          const merged = normalizeProduct({
            ...item,
            ...updated,
            id: item.id,
          });

          const variantStock = merged.variants?.length
            ? getVariantStock(merged, item.selectedSize, item.selectedColor)
            : merged.stock;

          const nextQty = Math.min(item.qty, variantStock);

          if (nextQty <= 0) return null;

          return {
            ...merged,
            qty: nextQty,
            selectedSize: item.selectedSize,
            selectedColor: item.selectedColor,
          };
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

          if (product.variants && product.variants.length > 0) {
            const restoredVariants = product.variants.map((variant) => {
              const matchingVariantItems = matchingItems.filter(
                (item) =>
                  item.selectedSize === variant.size &&
                  item.selectedColor === variant.color
              );

              if (matchingVariantItems.length === 0) return variant;

              const qtyToRestore = matchingVariantItems.reduce(
                (acc, item) => acc + item.qty,
                0
              );

              return {
                ...variant,
                stock: variant.stock + qtyToRestore,
              };
            });

            const totalStock = restoredVariants.reduce((acc, v) => acc + v.stock, 0);

            return normalizeProduct({
              ...product,
              variants: restoredVariants,
              stock: totalStock,
            });
          }

          const qtyToRestore = matchingItems.reduce((acc, item) => acc + item.qty, 0);
          const restoredStock = product.stock + qtyToRestore;

          return normalizeProduct({
            ...product,
            stock: restoredStock,
          });
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