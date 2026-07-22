# TasmaFive Final Security Audit Prompt

Use this prompt only after production email delivery and every intended payment
gateway are configured. Run it against the deployed website, admin application,
server code, production-safe configuration (with secret values redacted), and
provider dashboards. Do not print, copy, or commit live secrets.

## Audit instructions

Act as a senior application-security reviewer. Verify behavior with evidence;
do not treat the presence of code or a successful happy-path test as proof.
Report each finding with severity, affected route/file, reproduction or evidence,
impact, and a concrete fix. Separate code defects from deployment/dashboard
requirements. Re-test earlier findings and explicitly mark each one fixed,
partially fixed, not fixed, or not testable.

Use safe test accounts and test/sandbox payment methods first. Do not perform
destructive production tests, denial-of-service testing, mass email, real
charges, refunds, or account deletion without written authorization. Redact
emails, phones, tokens, cookies, signatures, payment IDs, and credentials from
all output.

## 1. Authentication, authorization, sessions, and account lifecycle

- Verify signup, login, logout, session lookup, OTP send/verify, team unlock,
  project-admin login, CMS-admin login/logout, and every admin API.
- Confirm strict route-specific throttles work for signup, login, OTP send,
  OTP verification, team access, project-admin access, and CMS-admin access.
- Confirm user/admin enumeration is not possible through messages, timing, or
  status codes. Test replay, stale sessions, OTP expiry, OTP attempt limits,
  concurrent requests, and privilege confusion between normal, team, project
  admin, and CMS admin identities.
- Verify production startup rejects missing, default, reused, or weak
  `AUTH_SECRET`, admin session secrets, CMS admin credentials, project-admin
  credentials, and team codes.
- Inspect both cookies for `HttpOnly`, `Secure`, appropriate `SameSite`, narrow
  scope, expiration, deletion parity, and resistance to CSRF/session fixation.
- Exercise authenticated account deletion with the correct user and an
  unrelated user. Verify password confirmation, ownership enforcement, session
  invalidation, OTP/activity deletion, payment-record anonymization, retained
  accounting integrity, idempotent failure handling, and no orphaned PII.

## 2. Email, OTP, notifications, and secret handling

- Recheck real email delivery end-to-end: sender/domain verification, SPF,
  DKIM, DMARC, production `From`, delivery failures, retries, rate limits, and
  user-safe errors. Verify the OTP reaches only the intended mailbox.
- Confirm demo OTP behavior is impossible in production, requires both
  `NODE_ENV=development` and the explicit development flag, is disabled when
  email is configured, and never appears in production responses, logs,
  traces, analytics, error reports, or admin notifications.
- Confirm OTPs are generated cryptographically, stored only as keyed hashes,
  expire, are single-use, have strict attempt limits, and cannot be moved
  between accounts or purposes.
- Search application, proxy, platform, database, email-provider, and error
  monitoring logs for passwords, OTPs, authorization headers, cookies, API
  keys, webhook signatures, payment payloads, full email/phone/IP combinations,
  and query-string tokens. Verify redaction and retention controls.

## 3. Payments and webhook integrity — test every provider

For Razorpay, Stripe, PayPal, and CCAvenue separately, test creation, redirect
or SDK flow, success, cancellation, failure, duplicate callback/webhook,
out-of-order events, replay, invalid signature, wrong amount, wrong currency,
wrong order/session/reference, test/live-mode separation, and receipt access.
Confirm only the owning user or an authenticated admin can view status or
download a receipt.

- **Razorpay:** prove API verification and webhook verification fail closed
  when their secrets are absent; verify signature, order ID, capture status,
  exact minor-unit amount, and currency before marking paid.
- **Stripe:** verify the webhook signing secret and raw body handling; reconcile
  checkout session ID, internal reference, `payment_status`, `amount_total`,
  currency, and payment intent before marking paid.
- **PayPal:** verify dashboard webhook ID and PayPal signature verification;
  reconcile order ID, capture status, exact amount, and currency in both capture
  and webhook paths before marking paid.
- **CCAvenue:** verify encrypted callback handling, order binding, exact amount,
  currency, status, live/test endpoint selection, and replay/idempotency.
- Verify refund and dispute events cannot convert an unrelated payment, and
  duplicate events cannot issue duplicate fulfillment or receipts. Confirm
  secrets and provider error payloads are absent from client responses/logs.

## 4. Input, content, APIs, and data privacy

- Test validation and size limits for every public/admin body, path parameter,
  query, search, slug, payment amount, email, phone, and free-text field.
- Test CMS project links, previews, service images, and live social media URLs
  against `javascript:`, `data:`, `file:`, protocol-relative forms, credentials
  in URLs, encoded bypasses, localhost, loopback, link-local, private IPv4/IPv6,
  `.local`, and `.internal`. Verify unsafe legacy database values are not served.
- Check NoSQL/operator injection, regex denial of service, stored/reflected XSS,
  HTML/email-template injection, SSRF, open redirect, mass assignment, IDOR,
  request smuggling assumptions, oversized bodies, and malformed JSON.
- Review every response for minimum necessary fields. Pay special attention to
  public payment links, auth/session responses, content APIs, admin lists,
  errors, health checks, and receipts. Verify database access, indexes,
  backups, encryption, least privilege, retention, and PII deletion policy.

## 5. Deployment, browser defenses, operations, and regression

- Verify production CORS uses only explicit HTTPS origins and credentials are
  never combined with a wildcard. Test allowed, disallowed, missing, and spoofed
  origins plus preflight behavior.
- Inspect Helmet/CSP and all response headers: HSTS, frame protection,
  MIME sniffing, referrer policy, permissions policy, cache controls for
  authenticated/payment responses, and removal of framework disclosure.
- Confirm production errors are generic while server logs retain a safe
  correlation signal without secrets or PII. Verify unknown routes and malformed
  requests do not leak stack traces or provider/database details.
- Confirm startup fails before listening when MongoDB URLs or production
  security settings are invalid; verify TLS, least-privilege database users,
  separate admin data access, timeouts, health monitoring, backups, restore
  drills, dependency scanning, patch status, and secret rotation procedures.
- Run server syntax checks, dependency audit, focused automated tests, and
  manual browser/API regressions for authentication, email, CMS, account
  deletion, receipts, and all four payment providers.

## Required final output

1. Executive risk summary and production go/no-go recommendation.
2. A finding list ordered by severity, with evidence and remediation.
3. A five-category checklist showing pass/fail/not-testable for every item.
4. A dedicated email-verification result.
5. A provider matrix for Razorpay, Stripe, PayPal, and CCAvenue, including
   signature verification and amount/currency reconciliation.
6. Remaining operational/dashboard actions, owners, and retest steps.
7. Explicit confirmation that no live secrets or customer PII were included in
   the report.
