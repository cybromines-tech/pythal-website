// Asset pipeline: converts the original Figma exports into WebP under public/images at their
// full original resolution. Line art (PNG sources) is lossless; photos are near-lossless.
// Usage: node scripts/optimize-assets.mjs <source-images-dir>
import sharp from 'sharp';

const src = (process.argv[2] ?? '../public_html/assets/images').replace(/\/?$/, '/');
const out = 'public/images/';

const lossless = { lossless: true, effort: 6 };
const photo = { quality: 92, smartSubsample: true, effort: 6 };

const jobs = [
  ['giving-art-exact.png', 'giving-art.webp', lossless],
  ['footer-child.png', 'footer-child.webp', { quality: 94, alphaQuality: 100 }],
  ...['shipping', 'returns', 'gifting', 'support'].map((n) => [`benefit-${n}.png`, `benefit-${n}.webp`, lossless]),
  ...['pink', 'gold', 'brown', 'green', 'black', 'blue'].flatMap((c) => [
    [`circle-${c}-exact.png`, `circle-${c}.webp`, lossless],
    // Originals are 2731 × 4096 JPEGs; 2400px wide still exceeds the 1728px display width.
    [`bundle-hover-${c}-hq.jpg`, `bundle-${c}.webp`, photo, 2400],
  ]),
];

for (const [from, to, options, width] of jobs) {
  let img = sharp(src + from);
  if (width) img = img.resize({ width, withoutEnlargement: true });
  const info = await img.webp(options).toFile(out + to);
  console.log(to, `${info.width}x${info.height}`, `${Math.round(info.size / 1024)}KB`);
}

await sharp(src + 'logo.png').png().toFile(`${out}logo.png`);

// Hero line art: drop the last rows, which carry a semi-transparent export seam.
await sharp(src + 'hero-decor-hq.png')
  .extract({ left: 0, top: 0, width: 3456, height: 2064 })
  .webp(lossless)
  .toFile(`${out}hero-art.webp`);

// Safety section: split the combined Figma export into six icons and the tree line.
const safetyIcons = [[323, 463], [580, 708], [836, 938], [1061, 1197], [1305, 1444], [1536, 1687]];
for (const [i, [x0, x1]] of safetyIcons.entries()) {
  await sharp(src + 'safety-art.png')
    .extract({ left: x0 - 4, top: 249, width: x1 - x0 + 9, height: 147 })
    .webp(lossless)
    .toFile(`${out}safety-icon-${i + 1}.webp`);
}
await sharp(src + 'safety-art.png')
  .extract({ left: 0, top: 430, width: 2007, height: 326 })
  .webp(lossless)
  .toFile(`${out}safety-trees.webp`);
console.log('hero art, safety icons + trees');
