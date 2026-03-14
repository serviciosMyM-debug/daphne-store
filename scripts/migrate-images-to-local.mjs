import fs from "fs/promises";
import path from "path";

const PRODUCTS = [
  {
    slug: "strapless-baker",
    images: [
      "https://i.ibb.co/4ZTPLRxZ/IMG-2305-JPG.jpg",
      "https://i.ibb.co/TBp1thJ/IMG-2312-JPG.jpg",
      "https://i.ibb.co/HTjX2CjS/IMG-2298-JPG.jpg",
    ],
  },
  {
    slug: "sastrero-dries-lino",
    images: [
      "https://i.ibb.co/jk9HTrmM/IMG-2258-JPG.jpg",
      "https://i.ibb.co/BKf4RbV/IMG-2231-jpg.jpg",
      "https://i.ibb.co/YFh3NMW/IMG-2284-JPG.jpg",
      "https://i.ibb.co/jTjX2CjS/IMG-2298-JPG.jpg",
    ],
  },
  {
    slug: "camisa-crop-henry",
    images: [
      "https://i.ibb.co/HtdFsm3q/IMG-2353-JPG.jpg",
      "https://i.ibb.co/kX0xpNPs/IMG-2371-JPG.jpg",
      "https://i.ibb.co/XQXR0Wz/IMG-2357-JPG.jpg",
    ],
  },
  {
    slug: "camisa-crop-dion",
    images: [
      "https://i.ibb.co/6dTLtRr/IMG-2325-JPG.jpg",
      "https://i.ibb.co/7thMMgD7/IMG-2273-JPG.jpg",
      "https://i.ibb.co/pj6f4bvQ/IMG-2323-JPG.jpg",
    ],
  },
  {
    slug: "chaleco-daze",
    images: [
      "https://i.ibb.co/4RPn6D6/IMG-2200-JPG.jpg",
      "https://i.ibb.co/h3espBL/IMG-2207-JPG.jpg",
      "https://i.ibb.co/tL8m9wWc/IMG-2224-JPG.jpg",
      "https://i.ibb.co/ycxn3n8k/IMG-2379-JPG.jpg",
      "https://i.ibb.co/XrxMTnTB/IMG-2400-JPG.jpg",
    ],
  },
];

const outputDir = path.join(process.cwd(), "public", "products");
const manifestPath = path.join(process.cwd(), "scripts", "local-image-manifest.json");

function extensionFromUrl(url) {
  const clean = url.split("?")[0];
  const ext = path.extname(clean).toLowerCase();
  return ext || ".jpg";
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function downloadFile(url, filepath) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });

  if (!response.ok) {
    throw new Error(`No se pudo descargar ${url} (${response.status})`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(filepath, buffer);
}

async function main() {
  await ensureDir(outputDir);

  const manifest = [];

  for (const product of PRODUCTS) {
    const localUrls = [];

    for (let i = 0; i < product.images.length; i++) {
      const url = product.images[i];
      const ext = extensionFromUrl(url);
      const filename = `${product.slug}-${i + 1}${ext}`;
      const filepath = path.join(outputDir, filename);

      console.log(`Descargando ${url} -> public/products/${filename}`);
      await downloadFile(url, filepath);

      localUrls.push(`/products/${filename}`);
    }

    manifest.push({
      slug: product.slug,
      images: localUrls,
    });
  }

  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf8");

  console.log("\nListo.");
  console.log(`Manifest generado en: ${manifestPath}`);
  console.log("Ahora corré: npx tsx prisma/update-images-local.ts");
}

main().catch((error) => {
  console.error("Error migrando imágenes:", error);
  process.exit(1);
});