/**
 * One-time / CI-safe image optimizer for public/images.
 * Keeps filenames & paths identical so the site layout never breaks.
 * Run: node scripts/optimize-images.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..", "public", "images");

const SKIP_DIRS = new Set(["flags"]); // tiny PNGs — leave alone
const MAX_EDGE = {
  hero: 1920,
  about: 1600,
  expertise: 1200,
  blog: 1200,
  instagram: 1080,
  projects: 1400,
  industries: 900,
  presence: 1200,
  default: 1600,
};

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      if (SKIP_DIRS.has(name)) continue;
      walk(full, out);
    } else if (/\.(jpe?g|png|webp)$/i.test(name)) {
      out.push(full);
    }
  }
  return out;
}

function bucketFor(file) {
  const rel = path.relative(root, file).replace(/\\/g, "/");
  const top = rel.split("/")[0];
  return top in MAX_EDGE ? top : "default";
}

async function main() {
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    console.error("sharp is required. Run: npm install sharp");
    process.exit(1);
  }

  const files = walk(root);
  let saved = 0;
  let bytesBefore = 0;
  let bytesAfter = 0;

  for (const file of files) {
    const before = fs.statSync(file).size;
    bytesBefore += before;
    const edge = MAX_EDGE[bucketFor(file)];
    const ext = path.extname(file).toLowerCase();
    const tmp = `${file}.tmp-opt`;

    try {
      let pipeline = sharp(file, { failOn: "none" }).rotate().resize({
        width: edge,
        height: edge,
        fit: "inside",
        withoutEnlargement: true,
      });

      if (ext === ".png") {
        pipeline = pipeline.png({ compressionLevel: 8, palette: true });
      } else if (ext === ".webp") {
        pipeline = pipeline.webp({ quality: 72 });
      } else {
        pipeline = pipeline.jpeg({ quality: 72, mozjpeg: true });
      }

      await pipeline.toFile(tmp);
      const after = fs.statSync(tmp).size;
      if (after < before * 0.98) {
        // OneDrive-safe replace (rename often EPERM on cloud-locked files)
        const buf = fs.readFileSync(tmp);
        fs.writeFileSync(file, buf);
        fs.unlinkSync(tmp);
        saved += 1;
        bytesAfter += after;
      } else {
        fs.unlinkSync(tmp);
        bytesAfter += before;
      }
    } catch (err) {
      if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
      bytesAfter += before;
      console.warn("skip", path.relative(root, file), err.message);
    }
  }

  const mb = (n) => (n / (1024 * 1024)).toFixed(2);
  console.log(
    `Optimized ${saved}/${files.length} images. ${mb(bytesBefore)}MB → ${mb(bytesAfter)}MB`
  );
}

main();
