import {
  closePublicApi,
  initializePublicApi,
} from "./app.js";

const port = Number(process.env.PORT || 8080);
const app = await initializePublicApi();
const server = app.listen(port, () => {
  console.log(`[tasmafive-server] http://localhost:${port}`);
});

let shuttingDown = false;
async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`[tasmafive-server] ${signal}; shutting down`);
  const forceExit = setTimeout(() => process.exit(1), 10_000);
  forceExit.unref();
  await new Promise((resolve) => server.close(resolve));
  await closePublicApi();
  clearTimeout(forceExit);
  process.exit(0);
}

process.once("SIGINT", () => void shutdown("SIGINT"));
process.once("SIGTERM", () => void shutdown("SIGTERM"));
