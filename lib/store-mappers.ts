import { ProductStatus } from "@prisma/client";

export interface StoreProductVariant {
  color: string;
  size: string;
  stock: number;
}

export interface StoreProduct {
  id: number;
  dbId: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  images: string[];
  colors: string[];
  variants: StoreProductVariant[];
  description: string;
  status: "EN STOCK" | "AGOTADO";
  sizeChart?: { [key: string]: string };
  featured?: boolean;
}

type ProductFromDb = {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  status: ProductStatus;
  featured: boolean;
  sizeChart: unknown;
  images: { url: string; position: number }[];
  variants: { color: string; size: string; stock: number }[];
};

export function mapDbProductToStoreProduct(
  product: ProductFromDb,
  index: number
): StoreProduct {
  const images = [...product.images]
    .sort((a, b) => a.position - b.position)
    .map((img) => img.url)
    .slice(0, 5);

  const variants = product.variants.map((variant) => ({
    color: variant.color,
    size: variant.size,
    stock: variant.stock,
  }));

  const totalStock = variants.reduce((acc, variant) => acc + variant.stock, 0);

  const colors = Array.from(new Set(variants.map((variant) => variant.color)));

  return {
    id: index + 1,
    dbId: product.id,
    name: product.name,
    price: product.price,
    category: product.category,
    stock: totalStock,
    image: images[0] || "",
    images,
    colors,
    variants,
    description: product.description,
    status: totalStock > 0 ? "EN STOCK" : "AGOTADO",
    featured: product.featured,
    sizeChart:
      product.sizeChart && typeof product.sizeChart === "object"
        ? (product.sizeChart as { [key: string]: string })
        : undefined,
  };
}