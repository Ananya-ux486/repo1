/**
 * Hostinger "Entry file" — boots Express /api + Next.js together.
 * Do not use plain `next start` on this project or login/API will return HTML.
 */
process.env.TF_FORCE_PRODUCTION = "1";
if (!process.argv.includes("--production")) {
  process.argv.push("--production");
}

const { start } = await import("./unified-server.mjs");

start().catch((error) => {
  console.error(
    "[tasmafive] startup failed",
    process.env.NODE_ENV === "production" ? error?.name || "Error" : error,
  );
  process.exit(1);
});
