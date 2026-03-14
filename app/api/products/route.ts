import { NextResponse } from "next/server";
import { ProductStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { mapDbProductToStoreProduct } from "@/lib/store-mappers";

type IncomingVariant = {
  color: string;
  size: string;
  stock: number;
};

type IncomingProductPayload = {
  name: string;
  price: number;
  category: string;
  description: string;
  images?: string[];
  variants?: IncomingVariant[];
  sizeChart?: Record<string, string>;
  featured?: boolean;
};

function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function validatePayload(payload: IncomingProductPayload) {
  if (!payload.name?.trim()) {
    return "El producto debe tener un nombre.";
  }

  if (!payload.category?.trim()) {
    return "El producto debe tener una categoría.";
  }

  if (!payload.description?.trim()) {
    return "El producto debe tener una descripción.";
  }

  const images = (payload.images || []).map((img) => img.trim()).filter(Boolean);
  if (images.length === 0) {
    return "Debés cargar al menos una imagen.";
  }

  const variants = (payload.variants || [])
    .map((variant) => ({
      color: variant.color?.trim() || "",
      size: variant.size?.trim().toUpperCase() || "",
      stock: Number(variant.stock) || 0,
    }))
    .filter((variant) => variant.color && variant.size);

  if (variants.length === 0) {
    return "Debés cargar al menos una variante con color, talle y stock.";
  }

  return null;
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        images: {
          orderBy: { position: "asc" },
        },
        variants: {
          orderBy: [{ color: "asc" }, { size: "asc" }],
        },
      },
    });

    const mapped = products.map((product, index) =>
      mapDbProductToStoreProduct(product, index)
    );

    return NextResponse.json(mapped);
  } catch (error) {
    console.error("Error loading products:", error);
    return NextResponse.json(
      { error: "No se pudieron cargar los productos." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as IncomingProductPayload;

    const validationError = validatePayload(payload);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const name = payload.name.trim().toUpperCase();
    const category = payload.category.trim();
    const description = payload.description.trim();
    const price = Number(payload.price) || 0;
    const featured = !!payload.featured;

    const images = (payload.images || [])
      .map((img) => img.trim())
      .filter(Boolean)
      .slice(0, 5);

    const variants = (payload.variants || [])
      .map((variant) => ({
        color: variant.color.trim(),
        size: variant.size.trim().toUpperCase(),
        stock: Number(variant.stock) || 0,
      }))
      .filter((variant) => variant.color && variant.size);

    const totalStock = variants.reduce((acc, variant) => acc + variant.stock, 0);
    const status = totalStock > 0 ? ProductStatus.EN_STOCK : ProductStatus.AGOTADO;

    const baseSlug = slugify(name);
    let slug = baseSlug;
    let count = 1;

    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${count}`;
      count += 1;
    }

    const created = await prisma.product.create({
      data: {
        name,
        slug,
        price,
        category,
        description,
        featured,
        status,
        sizeChart: payload.sizeChart || undefined,
        images: {
          create: images.map((url, index) => ({
            url,
            position: index,
          })),
        },
        variants: {
          create: variants,
        },
      },
      include: {
        images: {
          orderBy: { position: "asc" },
        },
        variants: {
          orderBy: [{ color: "asc" }, { size: "asc" }],
        },
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "No se pudo crear el producto." },
      { status: 500 }
    );
  }
}