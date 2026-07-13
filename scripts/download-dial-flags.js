const fs = require("fs");
const path = require("path");
const https = require("https");

const root = path.join(__dirname, "..");
const src = fs.readFileSync(path.join(root, "src/data/countryCodes.ts"), "utf8");
const codes = [...src.matchAll(/code: "([A-Z]{2})"/g)].map((m) => m[1].toLowerCase());
const uniq = [...new Set(codes)];

const outDir = path.join(root, "public/images/flags/dial");
fs.mkdirSync(outDir, { recursive: true });

function download(code) {
  return new Promise((resolve) => {
    const file = path.join(outDir, `${code}.png`);
    if (fs.existsSync(file) && fs.statSync(file).size > 100) {
      resolve({ code, status: "exists" });
      return;
    }
    const url = `https://flagcdn.com/w40/${code}.png`;
    const req = https.get(url, (res) => {
      if (res.statusCode !== 200) {
        resolve({ code, status: `http-${res.statusCode}` });
        res.resume();
        return;
      }
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => {
        fs.writeFileSync(file, Buffer.concat(chunks));
        resolve({ code, status: "ok" });
      });
    });
    req.on("error", () => resolve({ code, status: "error" }));
    req.setTimeout(15000, () => {
      req.destroy();
      resolve({ code, status: "timeout" });
    });
  });
}

(async () => {
  console.log("codes", uniq.length);
  const results = [];
  for (const code of uniq) {
    results.push(await download(code));
  }
  const ok = results.filter((r) => r.status === "ok" || r.status === "exists").length;
  console.log("downloaded/ready", ok, "/", uniq.length);
  console.log(results.filter((r) => r.status !== "ok" && r.status !== "exists"));
})();
