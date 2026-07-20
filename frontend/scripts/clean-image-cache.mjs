/**
 * Clears only Next.js optimized-image cache (not the full .next folder).
 * Run after replacing images in public/images/ when the browser still shows old photos.
 *
 * Usage: npm run clean:cache
 */
import { rmSync, existsSync } from "node:fs";
import { join } from "node:path";

const cacheDir = join(process.cwd(), ".next", "cache", "images");

if (existsSync(cacheDir)) {
  rmSync(cacheDir, { recursive: true, force: true });
  console.log("Cleared .next/cache/images");
} else {
  console.log("No image cache found (.next/cache/images) — nothing to clear.");
}
