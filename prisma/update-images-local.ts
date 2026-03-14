import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateProductImages(slug: string, urls: string[]) {
  await prisma.product.update({
    where: { slug },
    data: {
      images: {
        deleteMany: {},
        create: urls.map((url, index) => ({
          url,
          position: index,
        })),
      },
    },
  });

  console.log(`Imágenes actualizadas: ${slug}`);
}

async function main() {
  await updateProductImages("strapless-baker", [
    "/products/IMG-2305-JPG.jpeg",
    "/products/IMG-2312-JPG.jpeg",
    "/products/IMG-2298-JPG.jpeg",
  ]);

  await updateProductImages("sastrero-dries-lino", [
    "/products/IMG-2258-JPG.jpeg",
    "/products/IMG-2231-jpg.jpeg",
    "/products/IMG-2284-JPG.jpeg",
    "/products/IMG-2298-JPG.jpeg",
  ]);

  await updateProductImages("camisa-crop-henry", [
    "/products/IMG-2353-JPG.jpeg",
    "/products/IMG-2371-JPG.jpeg",
    "/products/IMG-2357-JPG.jpeg",
  ]);

  await updateProductImages("camisa-crop-dion", [
    "/products/IMG-2325-JPG.jpeg",
    "/products/IMG-2273-JPG.jpeg",
    "/products/IMG-2323-JPG.jpeg",
  ]);

  await updateProductImages("chaleco-daze", [
    "/products/IMG-2200-JPG.jpeg",
    "/products/IMG-2207-JPG.jpeg",
    "/products/IMG-2224-JPG.jpeg",
    "/products/IMG-2379-JPG.jpeg",
    "/products/IMG-2400-JPG.jpeg",
  ]);

  console.log("Todas las imágenes fueron actualizadas.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Error actualizando imágenes:", error);
    await prisma.$disconnect();
    process.exit(1);
  });