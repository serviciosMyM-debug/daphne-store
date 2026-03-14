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
    "https://i.ibb.co/4ZTPLRxZ/IMG-2305-JPG.jpg",
    "https://i.ibb.co/TBp1thJ/IMG-2312-JPG.jpg",
    "https://i.ibb.co/HTjX2CjS/IMG-2298-JPG.jpg",
  ]);

  await updateProductImages("sastrero-dries-lino", [
    "https://i.ibb.co/jk9HTrmM/IMG-2258-JPG.jpg",
    "https://i.ibb.co/BKf4RbV/IMG-2231-jpg.jpg",
    "https://i.ibb.co/YFh3NMW/IMG-2284-JPG.jpg",
    "https://i.ibb.co/jTjX2CjS/IMG-2298-JPG.jpg",
  ]);

  await updateProductImages("camisa-crop-henry", [
    "https://i.ibb.co/HtdFsm3q/IMG-2353-JPG.jpg",
    "https://i.ibb.co/kX0xpNPs/IMG-2371-JPG.jpg",
    "https://i.ibb.co/XQXR0Wz/IMG-2357-JPG.jpg",
  ]);

  await updateProductImages("camisa-crop-dion", [
    "https://i.ibb.co/6dTLtRr/IMG-2325-JPG.jpg",
    "https://i.ibb.co/7thMMgD7/IMG-2273-JPG.jpg",
    "https://i.ibb.co/pj6f4bvQ/IMG-2323-JPG.jpg",
  ]);

  await updateProductImages("chaleco-daze", [
    "https://i.ibb.co/4RPn6D6/IMG-2200-JPG.jpg",
    "https://i.ibb.co/h3espBL/IMG-2207-JPG.jpg",
    "https://i.ibb.co/tL8m9wWc/IMG-2224-JPG.jpg",
    "https://i.ibb.co/ycxn3n8k/IMG-2379-JPG.jpg",
    "https://i.ibb.co/XrxMTnTB/IMG-2400-JPG.jpg",
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