// One-off asset pipeline: converts the original Figma exports into web-sized
// WebP files under public/images. Usage: node scripts/optimize-assets.mjs <source-images-dir>
import sharp from 'sharp';

const src = (process.argv[2] ?? '../public_html/assets/images').replace(/\/?$/, '/');
const out = 'public/images/';

const jobs = [
  ['logo.png', 'logo.png', null, 'png'],
  ['giving-art-exact.png', 'giving-art.webp', 2986],
  ['footer-child.png', 'footer-child.webp', 1080],
  ...['shipping', 'returns', 'gifting', 'support'].map((n) => [`benefit-${n}.png`, `benefit-${n}.webp`, 256]),
  ...['pink', 'gold', 'brown', 'green', 'black', 'blue'].flatMap((c) => [
    [`circle-${c}-exact.png`, `circle-${c}.webp`, 648],
    [`bundle-hover-${c}-hq.jpg`, `bundle-${c}.webp`, 1800],
  ]),
];

for (const [from, to, width, fmt] of jobs) {
  let img = sharp(src + from);
  if (width) img = img.resize({ width, withoutEnlargement: true });
  img = fmt === 'png' ? img.png() : img.webp({ quality: 86, alphaQuality: 100 });
  const info = await img.toFile(out + to);
  console.log(to, `${info.width}x${info.height}`, `${Math.round(info.size / 1024)}KB`);
}

// Hero line art: drop the last rows, which carry a semi-transparent export seam.
await sharp(src + 'hero-decor-hq.png')
  .extract({ left: 0, top: 0, width: 3456, height: 2064 })
  .webp({ quality: 86, alphaQuality: 100 })
  .toFile(`${out}hero-art.webp`);
await sharp(`${out}hero-art.webp`).resize({ width: 1300 }).webp({ quality: 82, alphaQuality: 90 }).toFile(`${out}hero-art-1300.webp`);

// Safety section: split the combined Figma export into six icons and the tree line.
const safetyIcons = [[323, 463], [580, 708], [836, 938], [1061, 1197], [1305, 1444], [1536, 1687]];
for (const [i, [x0, x1]] of safetyIcons.entries()) {
  await sharp(src + 'safety-art.png')
    .extract({ left: x0 - 4, top: 249, width: x1 - x0 + 9, height: 147 })
    .webp({ quality: 90, alphaQuality: 100 })
    .toFile(`${out}safety-icon-${i + 1}.webp`);
}
await sharp(src + 'safety-art.png')
  .extract({ left: 0, top: 430, width: 2007, height: 326 })
  .webp({ quality: 90, alphaQuality: 100 })
  .toFile(`${out}safety-trees.webp`);
console.log('safety icons + trees');
