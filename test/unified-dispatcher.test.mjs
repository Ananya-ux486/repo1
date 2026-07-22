import assert from "node:assert/strict";
import test from "node:test";
import {
  createUnifiedRequestHandler,
  isApiRequest,
} from "../unified-server.mjs";

test("matches only the API path boundary", () => {
  for (const url of ["/api", "/api/", "/api/health?probe=1"]) {
    assert.equal(isApiRequest(url), true, url);
  }
  for (const url of ["/", "/payment", "/apiary", "/API/health"]) {
    assert.equal(isApiRequest(url), false, url);
  }
});

test("dispatches API before Next without consuming the request", () => {
  const calls = [];
  const api = (req) => calls.push(["api", req]);
  const next = (req) => calls.push(["next", req]);
  const handler = createUnifiedRequestHandler(api, next);
  const apiRequest = { url: "/api/payments/webhooks/stripe" };
  const pageRequest = { url: "/payment" };

  handler(apiRequest, {});
  handler(pageRequest, {});

  assert.deepEqual(calls, [
    ["api", apiRequest],
    ["next", pageRequest],
  ]);
});
