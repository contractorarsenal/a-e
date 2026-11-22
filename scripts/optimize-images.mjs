// Generates web-optimized copies of the originals in /Photos. Originals are never modified.
import sharp from 'sharp';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(root, 'Photos');
const OUT = path.join(root, 'public', 'img');
const WIDTHS = [480, 768, 1080, 1600];

// slug -> original filename. Edit here to add photos.
const PHOTOS = {
  'proposal-hands': 'IMG_3849.JPEG',
  'proposal-moment': 'IMG_7091.JPG',
  'proposal-laughing': 'Facetune_13-06-2024-10-18-38.JPEG',
  'proposal-kiss': 'Facetune_13-06-2024-10-19-52.JPEG',
};

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });
const manifest = {};
for (const [slug, file] of Object.entries(PHOTOS)) {
  const src = path.join(SRC, file);
  const meta = await sharp(src).rotate().metadata(); // honours EXIF orientation
  const orientedW = meta.orientation && meta.orientation >= 5 ? meta.height : meta.width;
  const orientedH = meta.orientation && meta.orientation >= 5 ? meta.width : meta.height;
  const { dominant } = await sharp(src).rotate().resize(64).stats();
  const color = `rgb(${dominant.r},${dominant.g},${dominant.b})`;
  const widths = WIDTHS.filter((w) => w <= orientedW);
  for (const w of widths) {
    const base = sharp(src).rotate().resize({ width: w, withoutEnlargement: true });
    await Promise.all([
      base.clone().avif({ quality: 52, effort: 4 }).toFile(path.join(OUT, `${slug}-${w}.avif`)),
      base.clone().webp({ quality: 78 }).toFile(path.join(OUT, `${slug}-${w}.webp`)),
      // JPEG is only the legacy fallback: one size is enough
      ...(w === 1080 ? [base.clone().jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(OUT, `${slug}-${w}.jpg`))] : []),
    ]);
  }
  manifest[slug] = { width: orientedW, height: orientedH, color, widths };
  console.log(slug, orientedW + 'x' + orientedH, widths.join(','));
}

// Social share image (1200x630) — crop keeps both faces and the clasped hands.
await sharp(path.join(SRC, PHOTOS['proposal-hands']))
  .rotate()
  .extract({ left: 0, top: 1060, width: 3024, height: 1583 })
  .resize(1200, 630)
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(path.join(OUT, 'og.jpg'));

await writeFile(path.join(root, 'src', 'generated', 'images.json'), JSON.stringify(manifest, null, 2));
console.log('done');
