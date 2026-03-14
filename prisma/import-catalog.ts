import { PrismaClient, ProductStatus } from "@prisma/client";

const prisma = new PrismaClient();

const sizeChart = {
  S: "50cm ancho / 70cm largo",
  M: "53cm ancho / 72cm largo",
  L: "56cm ancho / 75cm largo",
};

type CatalogProduct = {
  name: string;
  slug: string;
  price: number;
  category: string;
  description: string;
  featured: boolean;
  images: string[];
  variants: {
    color: string;
    size: string;
    stock: number;
  }[];
};

const catalog: CatalogProduct[] = [
  {
    name: "STRAPLESS BAKER",
    slug: "strapless-baker",
    price: 16200,
    category: "TOP",
    description:
      "Top strapless de diseño minimalista que realza la silueta con un calce cómodo y elegante. Una prenda versátil ideal para combinar con pantalones de lino, sastretos o jeans para un look moderno y sofisticado.",
    featured: true,
    images: [
      "https://raw.githubusercontent.com/serviciosMyM-debug/daphne-store/refs/heads/main/Daphn%C3%A9%20indumentaria/IMG_2305.JPG.jpeg",
      "https://raw.githubusercontent.com/serviciosMyM-debug/daphne-store/refs/heads/main/Daphn%C3%A9%20indumentaria/IMG_2312.JPG.jpeg",
      "https://raw.githubusercontent.com/serviciosMyM-debug/daphne-store/refs/heads/main/Daphn%C3%A9%20indumentaria/IMG_2298.JPG.jpeg",
    ],
    variants: [
      { color: "Blanco", size: "S", stock: 2 },
      { color: "Blanco", size: "M", stock: 2 },
      { color: "Blanco", size: "L", stock: 2 },
      { color: "Negro", size: "S", stock: 2 },
      { color: "Negro", size: "M", stock: 2 },
      { color: "Negro", size: "L", stock: 2 },
    ],
  },
  {
    name: "SASTRERO DRIES LINO",
    slug: "sastrero-dries-lino",
    price: 29990,
    category: "Pantalones",
    description:
      "Pantalón de lino de tiro alto y pierna amplia que brinda comodidad y elegancia. Su tono natural lo convierte en una pieza esencial para looks frescos y atemporales.",
    featured: true,
    images: [
      "https://raw.githubusercontent.com/serviciosMyM-debug/daphne-store/refs/heads/main/Daphn%C3%A9%20indumentaria/IMG_2258.JPG.jpeg",
      "https://raw.githubusercontent.com/serviciosMyM-debug/daphne-store/refs/heads/main/Daphn%C3%A9%20indumentaria/IMG_2231.jpg.jpeg",
      "https://raw.githubusercontent.com/serviciosMyM-debug/daphne-store/refs/heads/main/Daphn%C3%A9%20indumentaria/IMG_2284.JPG.jpeg",
      "https://raw.githubusercontent.com/serviciosMyM-debug/daphne-store/refs/heads/main/Daphn%C3%A9%20indumentaria/IMG_2290.JPG.jpeg",
    ],
    variants: [
      { color: "Beige", size: "S", stock: 2 },
      { color: "Beige", size: "M", stock: 2 },
      { color: "Beige", size: "L", stock: 2 },
      { color: "Negro", size: "S", stock: 2 },
      { color: "Negro", size: "M", stock: 2 },
      { color: "Negro", size: "L", stock: 2 },
    ],
  },
  {
    name: "CAMISA CROP HENRY",
    slug: "camisa-crop-henry",
    price: 21800,
    category: "Camisas",
    description:
      "Camisa cropped de corte relajado que combina lo clásico con un estilo contemporáneo. Ideal para usar abierta o cerrada, creando looks versátiles y modernos.",
    featured: false,
    images: [
      "https://raw.githubusercontent.com/serviciosMyM-debug/daphne-store/refs/heads/main/Daphn%C3%A9%20indumentaria/IMG_2353.JPG.jpeg",
      "https://raw.githubusercontent.com/serviciosMyM-debug/daphne-store/refs/heads/main/Daphn%C3%A9%20indumentaria/IMG_2371.JPG.jpeg",
      "https://raw.githubusercontent.com/serviciosMyM-debug/daphne-store/refs/heads/main/Daphn%C3%A9%20indumentaria/IMG_2357.JPG.jpeg",
    ],
    variants: [
      { color: "Blanco", size: "S", stock: 2 },
      { color: "Blanco", size: "M", stock: 2 },
      { color: "Blanco", size: "L", stock: 2 },
    ],
  },
  {
    name: "CAMISA CROP DION",
    slug: "camisa-crop-dion",
    price: 21800,
    category: "Camisas",
    description:
      "Camisa cropped con delicadas rayas verticales que aportan un estilo natural y elegante. Perfecta para combinar con prendas de lino o pantalones de corte amplio para un look fresco y moderno.",
    featured: false,
    images: [
      "https://raw.githubusercontent.com/serviciosMyM-debug/daphne-store/refs/heads/main/Daphn%C3%A9%20indumentaria/IMG_2325.JPG.jpeg",
      "https://raw.githubusercontent.com/serviciosMyM-debug/daphne-store/refs/heads/main/Daphn%C3%A9%20indumentaria/IMG_2273.JPG.jpeg",
      "https://raw.githubusercontent.com/serviciosMyM-debug/daphne-store/refs/heads/main/Daphn%C3%A9%20indumentaria/IMG_2323.JPG.jpeg",
    ],
    variants: [
      { color: "Beige", size: "S", stock: 2 },
      { color: "Beige", size: "M", stock: 2 },
      { color: "Beige", size: "L", stock: 2 },
    ],
  },
  {
    name: "CHALECO DAZE",
    slug: "chaleco-daze",
    price: 19990,
    category: "Chalecos",
    description:
      "Chaleco halter con botones frontales y escote en V que aporta un estilo elegante y femenino. Perfecto para elevar cualquier outfit, combinando sofisticación y frescura en una sola prenda.",
    featured: false,
    images: [
      "https://raw.githubusercontent.com/serviciosMyM-debug/daphne-store/refs/heads/main/Daphn%C3%A9%20indumentaria/IMG_2200.JPG.jpeg",
      "https://raw.githubusercontent.com/serviciosMyM-debug/daphne-store/refs/heads/main/Daphn%C3%A9%20indumentaria/IMG_2207.JPG.jpeg",
      "https://raw.githubusercontent.com/serviciosMyM-debug/daphne-store/refs/heads/main/Daphn%C3%A9%20indumentaria/IMG_2224.JPG.jpeg",
      "https://raw.githubusercontent.com/serviciosMyM-debug/daphne-store/refs/heads/main/Daphn%C3%A9%20indumentaria/IMG_2379.JPG.jpeg",
      "https://raw.githubusercontent.com/serviciosMyM-debug/daphne-store/refs/heads/main/Daphn%C3%A9%20indumentaria/IMG_2400.JPG.jpeg",
    ],
    variants: [
      { color: "Negro", size: "S", stock: 2 },
      { color: "Negro", size: "M", stock: 2 },
      { color: "Negro", size: "L", stock: 2 },
      { color: "Blanco", size: "S", stock: 2 },
      { color: "Blanco", size: "M", stock: 2 },
      { color: "Blanco", size: "L", stock: 2 },
    ],
  },
];

async function upsertProduct(product: CatalogProduct) {
  const totalStock = product.variants.reduce((acc, variant) => acc + variant.stock, 0);

  const existing = await prisma.product.findUnique({
    where: { slug: product.slug },
  });

  if (existing) {
    await prisma.product.update({
      where: { slug: product.slug },
      data: {
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description,
        featured: product.featured,
        status: totalStock > 0 ? ProductStatus.EN_STOCK : ProductStatus.AGOTADO,
        sizeChart,
        images: {
          deleteMany: {},
          create: product.images.map((url, index) => ({
            url,
            position: index,
          })),
        },
        variants: {
          deleteMany: {},
          create: product.variants.map((variant) => ({
            color: variant.color,
            size: variant.size,
            stock: variant.stock,
          })),
        },
      },
    });

    console.log(`Actualizado: ${product.name}`);
    return;
  }

  await prisma.product.create({
    data: {
      name: product.name,
      slug: product.slug,
      price: product.price,
      category: product.category,
      description: product.description,
      featured: product.featured,
      status: totalStock > 0 ? ProductStatus.EN_STOCK : ProductStatus.AGOTADO,
      sizeChart,
      images: {
        create: product.images.map((url, index) => ({
          url,
          position: index,
        })),
      },
      variants: {
        create: product.variants.map((variant) => ({
          color: variant.color,
          size: variant.size,
          stock: variant.stock,
        })),
      },
    },
  });

  console.log(`Creado: ${product.name}`);
}

async function main() {
  for (const product of catalog) {
    await upsertProduct(product);
  }

  console.log("Catálogo importado correctamente.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Error importando catálogo:", error);
    await prisma.$disconnect();
    process.exit(1);
  });