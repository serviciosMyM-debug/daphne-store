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
    "/products/IMG_2305.JPG",
    "/products/IMG_2312.JPG",
    "/products/IMG_2298.JPG",
  ]);

  await updateProductImages("sastrero-dries-lino", [
    "/products/IMG_2258.JPG",
    "/products/IMG_2231.jpg",
    "/products/IMG_2284.JPG",
    "/products/IMG_2298.JPG",
  ]);

  await updateProductImages("camisa-crop-henry", [
    "/products/IMG_2353.JPG",
    "/products/IMG_2371.JPG",
    "/products/IMG_2357.JPG",
  ]);

  await updateProductImages("camisa-crop-dion", [
    "/products/IMG_2325.JPG",
    "/products/IMG_2273.JPG",
    "/products/IMG_2323.JPG",
  ]);

  await updateProductImages("chaleco-daze", [
    "/products/IMG_2200.JPG",
    "/products/IMG_2207.JPG",
    "/products/IMG_2224.JPG",
    "/products/IMG_2379.JPG",
    "/products/IMG_2400.JPG",
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