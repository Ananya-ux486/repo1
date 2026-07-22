# Payment gateway setup

The code supports Razorpay and CCAvenue for INR, and Stripe and PayPal for USD.
Checkout amounts are calculated by the server. Card numbers and CVV are never
stored in MongoDB.

## Before adding live credentials

1. Deploy the user site, admin site and Express server over HTTPS.
2. Set `PUBLIC_SITE_URL` to the user-site origin, for example
   `https://project.tasmafivesolutions.com`.
3. Set `API_PUBLIC_URL` to the public Express API origin.
4. Add the user and admin origins to `ALLOWED_ORIGINS`.
5. Keep `.env` private. Add credentials only to the server host's environment
   settings, never to Next.js public variables or Git.

Start with test/sandbox credentials for every provider.

## Razorpay (India / INR)

1. Go to [dashboard.razorpay.com](https://dashboard.razorpay.com/) and create the
   business account.
2. Complete business KYC and bank-account verification.
3. Switch to **Test Mode**.
4. Open **Account & Settings → API Keys → Generate Test Key**.
5. Add the key ID and key secret to the server:

   ```env
   RAZORPAY_KEY_ID=rzp_test_...
   RAZORPAY_KEY_SECRET=...
   ```

6. Open **Account & Settings → Webhooks**, add:
   `https://YOUR-API/api/payments/webhooks/razorpay`.
7. Create a strong webhook secret and set it as `RAZORPAY_WEBHOOK_SECRET`.
8. Enable at least `payment.captured` and `payment.failed`.
9. After test payments pass, activate Live Mode, generate live keys and replace
   only the server environment values.

## Stripe (International / USD)

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com/register), create
   the business account and complete verification.
2. Keep **Test mode** enabled.
3. Open **Developers → API keys** and copy the **Secret key** (`sk_test_...`) to:

   ```env
   STRIPE_SECRET_KEY=sk_test_...
   ```

4. Open **Developers → Webhooks → Add endpoint** and enter:
   `https://YOUR-API/api/payments/webhooks/stripe`.
5. Select these events:
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
   - `charge.refunded`
   - `charge.dispute.created`
6. Reveal the endpoint signing secret (`whsec_...`) and set
   `STRIPE_WEBHOOK_SECRET`.
7. After verification, switch to live mode, create the same live webhook and
   replace the test secret/key with live values on the server.

## PayPal (International / USD)

1. Go to [developer.paypal.com](https://developer.paypal.com/), sign in with the
   business PayPal account and open **Apps & Credentials**.
2. Under **Sandbox**, create an app.
3. Copy the client ID and secret:

   ```env
   PAYPAL_ENV=sandbox
   PAYPAL_CLIENT_ID=...
   PAYPAL_CLIENT_SECRET=...
   ```

4. In the app, add webhook URL:
   `https://YOUR-API/api/payments/webhooks/paypal`.
5. Subscribe to capture completed, capture denied, capture refunded and customer
   dispute created events.
6. Copy the generated Webhook ID to `PAYPAL_WEBHOOK_ID`.
7. Test with PayPal sandbox buyer accounts.
8. When approved for production, create/select the Live app, set
   `PAYPAL_ENV=live`, replace credentials and create the same live webhook.

## CCAvenue (India / INR)

1. Apply at [ccavenue.com](https://www.ccavenue.com/) for an Indian merchant
   account.
2. Complete KYC, website review, settlement bank and commercial approval.
3. Ask CCAvenue to enable test credentials if they are not visible.
4. In the merchant dashboard, obtain Merchant ID, Access Code and Working Key:

   ```env
   CCAVENUE_ENV=test
   CCAVENUE_MERCHANT_ID=...
   CCAVENUE_ACCESS_CODE=...
   CCAVENUE_WORKING_KEY=...
   ```

5. Give CCAvenue this return/cancel URL if domain whitelisting is required:
   `https://YOUR-API/api/payments/ccavenue/callback`.
6. After CCAvenue approves production, use the live credentials and set
   `CCAVENUE_ENV=live`.

## Test checklist

For each provider, verify a successful payment, customer cancellation and failed
payment. Confirm the record appears under **Admin → Payments**, the amount and
currency match the selected package/quote, and the status changes only after a
signed server callback or server-side capture.

Use the admin **Payments** tab to generate custom quote links. INR links offer
Razorpay/CCAvenue; USD links offer Stripe/PayPal. Links expire after 14 days and
can be disabled by the admin.

Never send card details, CVV, API secrets, webhook secrets or CCAvenue working
keys through chat, email, frontend code or MongoDB.
