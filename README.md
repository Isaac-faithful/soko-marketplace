# Soko

Soko is a marketplace prototype connecting merchants in Nigeria, Ghana, and Kenya with African diaspora buyers. Merchants list products in their local currency. Buyers convert their money before payment and send the order amount in the seller's local currency. Soko does not perform the currency conversion.

## Run locally

The backend uses Node's built-in HTTP, cryptography, and SQLite modules, so no dependency installation is required. Node 22.5 or newer is required. From this folder, run:

```bash
npm start
```

Then open `http://localhost:4173`.

Do not use the old Python static-file command: it cannot run authentication, database, product, or order APIs.

### Demo accounts

- Merchant: `merchant@soko.demo`
- Buyer: `buyer@soko.demo`
- Administrator: `admin@soko.demo`
- Buyer and merchant password: `SokoDemo123!`
- Administrator password: `SokoAdmin123!`

You can also create a new buyer or merchant account from `auth.html`.

## What is included

- Responsive buyer marketplace
- Category filtering
- NGN, GHS, and KES merchant pricing
- Single-country baskets so one order uses one local currency
- Shopping bag with estimated totals
- Delivery-address checkout
- Country-specific demo payment instructions and unique payment references
- Simulated payment confirmation and order-tracking timeline
- Merchant early-access form
- Dedicated responsive merchant dashboard
- Store profile and operating-country settings
- Product creation, publishing, stock, and visibility controls
- Incoming orders with local-payment and fulfilment statuses
- Dashboard metrics and demo store analytics
- Buyer and merchant account registration
- Password hashing with per-user salts
- Server-side sessions using HttpOnly, SameSite cookies
- SQLite persistence for users, merchants, products, orders, and order items
- Role and ownership checks on merchant APIs
- Server-controlled product prices and inventory updates during ordering
- Soko Trust Console with administrator-only access
- Merchant approval, suspension, rejection, and verification status
- Product approval and rejection before public listing
- Buyer order history and dispute creation
- Administrator dispute resolution and cross-market order oversight
- Permanent administrative audit trail with reasons
- Unpaid orders created before collection instructions are shown
- Provider-independent local-currency payment records and references
- Idempotent provider confirmation events
- Double-entry payment ledger and reconciliation balances
- Merchant-defined destination delivery shown only at checkout
- Private merchant commission agreements applying only to product value
- Dispatch-triggered merchant payout submissions
- Duplicate-confirmation and duplicate-payout protection
- Original locally hosted product photography
- Search and country/category catalogue filters
- Detailed product pages with variants and stock states
- Verified merchant storefront pages
- Authenticated buyer favourites
- Merchant product editing with automatic re-moderation
- Up to five compressed photographs per product
- Merchant-managed variant names, values, stock, and price adjustments
- Variant-aware bags, checkout pricing, order records, and stock reduction
- Thirty-minute unpaid-order reservations with automatic stock restoration
- Combined-quantity checks preventing variant overselling
- Sample merchants from Nigeria, Ghana, and Kenya

## Important prototype limitations

Products and payments remain sample data. Accounts and records now use a real local SQLite database, but email verification, password recovery, production payment confirmation, shipping, tax, identity verification, rate limiting at infrastructure level, backups, and regulated merchant onboarding are not connected yet.

The checkout deliberately uses demonstration collection details. Buyers are assumed to already hold NGN, GHS, or KES; Soko performs no conversion. For database products, the backend first creates an `Awaiting payment` order with a unique reference. “Simulate provider confirmation” sends an idempotent development-provider event; it never moves real money.

Buyers see only product value, merchant-defined delivery, and the resulting total. Soko commission is private, applies only to product value, and remains unset until agreed with a merchant. Merchant settlement is the product value minus the agreed commission, plus delivery. Dispatch creates one merchant payout submission even when the dispatch request is repeated. In production, collection, safeguarding, and settlement must be performed by appropriately licensed payment partners.

## Backend structure

- `server.js` serves the website and permission-checked JSON APIs.
- `data/soko.db` is created automatically and is excluded from Git.
- Passwords are stored as scrypt hashes, never as readable text.
- Raw session tokens are only placed in HttpOnly cookies; the database stores token hashes.
- A merchant API request is scoped to the merchant linked to the signed-in user.
- Payment confirmation is accepted as a provider event, not a client-side status change.
- `payments`, `provider_events`, `ledger_entries`, and `payouts` preserve the complete money trail.
- The Trust Console reconciliation view compares expected and received collections, settlements, and account balances.

## Catalogue image assets

The demo catalogue uses original images generated with the built-in image-generation tool and stored locally:

- `assets/products/cocoa-shea-cream.png`
- `assets/products/african-black-soap.png`
- `assets/products/baobab-face-oil.png`

The prompt set requested square, photorealistic, unbranded studio product photography: cocoa-and-shea cream on warm sand, three artisanal black-soap bars on sage, and baobab facial oil on dusty lavender. All prompts excluded people, readable branding, text, and watermarks.

Run the syntax checks with:

```bash
npm run check
```

## Paystack test adapter

Soko defaults to the local development provider. The Paystack adapter supports transaction initialization, signed webhooks, transfer recipients, transfers, refunds, balance checks, and transaction/transfer verification calls. Merchant account numbers are sent server-side to the provider; Soko stores only the provider recipient token and final four digits.

Configure Paystack test mode with environment variables based on `.env.example`:

```bash
PAYMENTS_PROVIDER=paystack \
PAYSTACK_SECRET_KEY=sk_test_your_key \
APP_BASE_URL=https://your-public-test-url.example \
npm start
```

Set the Paystack webhook URL to:

```text
https://your-public-test-url.example/api/webhooks/paystack
```

Soko verifies `x-paystack-signature` using HMAC SHA-512 before processing any webhook. In Paystack mode, local payment simulation is disabled. Buyers receive Paystack's authorization URL and merchant dispatch uses the Paystack Transfers API when a recipient is configured.

Automatic refunds are allowed only before merchant payout submission. Repeated refund requests are idempotent. Once settlement has been submitted, Soko blocks automatic refunding until the merchant payout is recovered or reversed.

## Verified fulfilment and payout gate

Merchant fulfilment and settlement are deliberately separate. A merchant can prepare an order, mark it ready for collection, and submit a carrier, tracking number, public tracking link, collection-proof link, and estimated delivery date. This creates a shipment awaiting Soko verification; it does not create a payout.

An administrator must verify carrier collection in the Trust Console. The server permits settlement only when the underlying payment is confirmed, the order has no open dispute, and the shipment is awaiting verification. Verification is audit-logged, creates a buyer-visible tracking event, moves the order to `In transit`, and submits one idempotent merchant payout. Repeating the verification cannot create a second payout.

## Merchant identity onboarding

Merchants complete legal identity, phone, business type and registration, address, and ID details. They upload government ID, business registration, and proof of address, then verify their payout account before submitting for Soko review. Unapproved merchants remain invisible to buyers, cannot receive orders, and their products cannot be approved.

Identity files are limited to PDF, JPG, or PNG under 650 KB. Soko encrypts each file with AES-256-GCM inside the ignored `data/private/merchant-documents` directory. The static server denies every request under `/data`; only an authenticated administrator can decrypt and inspect a document through its protected endpoint. Set and securely back up `DOCUMENT_ENCRYPTION_KEY` in every deployed environment. Production startup fails when this key is missing.

## Notifications and development email

Buyers, merchants, and administrators share an authenticated notification centre at `/notifications.html`. It provides unread state, mark-one and mark-all-read operations, and email preferences for orders, shipping, account updates, and optional marketing. Marketing email is disabled by default.

Payment confirmation, new paid orders, dispatch review, verified collection, merchant verification, payout changes, disputes, and low stock generate idempotent notifications. Database event keys prevent webhook or action retries from creating duplicates. Email-enabled notifications enter the `email_outbox` table with a simulated status; administrators can inspect the development outbox through `/api/admin/email-outbox`. Messages deliberately exclude merchant commission, identity documents, and complete payout-account details. Connect this outbox to a transactional email provider before production.

The email adapter supports Resend through `EMAIL_PROVIDER=resend`, `RESEND_API_KEY`, and `EMAIL_FROM`. A background flush runs after API requests, sends up to ten queued messages, records provider failures, and retries each message up to five times. Administrators can manually flush with `POST /api/admin/email-outbox/flush`. Development mode never sends network email and leaves records marked `simulated`.

## Returns, cancellations, and refunds

The shared `/returns.html` workspace gives buyers, merchants, and administrators role-specific case actions. Buyer cancellation is restricted to orders that have not entered preparation. Returns can be requested after dispatch, merchants receive a configurable response deadline, buyers can attach evidence and return tracking, and Soko records the final decision in the audit trail.

Opening a case immediately places the merchant settlement on hold. Refund decisions keep product and delivery amounts separate: commission is reversed proportionally only against refunded product value, while approved delivery refunds pass through in full. Amounts are checked against the original order allocation, stock restoration is idempotent, duplicate cases and refunds are blocked, and a repeated admin decision cannot issue a second refund. The default return window is seven days and the merchant response deadline is 48 hours; administrators can change both in the returns workspace.

## Final-mile delivery lifecycle

Shipments support `awaiting_verification`, `collected_verified`, `in_transit`, `customs`, `out_for_delivery`, `delivered`, `delivery_failed`, and `returned`. Administrators can record carrier scans through the protected shipment-status endpoint, while carriers can send signed HMAC-SHA256 updates to `/api/webhooks/carrier` using `CARRIER_WEBHOOK_SECRET`. Carrier collection must be verified before later delivery statuses are accepted.

Buyers can confirm receipt through `/api/buyer/orders/:orderId/confirm-delivery`. Soko records `delivered_at`, adds a tracking event, updates the order to `Delivered`, and measures the return window from delivery time.

## Security controls

The `/security.html` centre provides TOTP authenticator MFA, signed-in device review, session revocation, and an administrator risk queue. Login failures are recorded and temporarily lock an account after repeated attempts; API requests are rate-limited by source and route class. New accounts require email verification, and password recovery uses short-lived, single-use tokens (development mode displays the token; production should deliver it by email).

Changing a merchant payout destination requires the current password and MFA when enabled, creates an 85-point risk event, and starts a 72-hour cooling-off period. Payout submission checks this cooldown, open high-risk events, and return/dispute holds. Administrators can resolve a risk as safe or confirmed fraud; confirmed fraud suspends the merchant. Session records include device and IP metadata, while security notifications avoid passwords, tokens, identity files, and complete bank details.

Never commit a real secret key. Start with `sk_test_...`; live keys and real money must wait for Paystack's approval of Soko's marketplace and delayed-settlement model.

Run all tests with:

```bash
npm test
```

## Proposed product boundary

Soko should begin as a managed marketplace, not a currency exchange. The buyer converts funds separately, then follows Soko's instructions to send NGN, GHS, or KES. Soko owns discovery, ordering, payment confirmation, customer service, and the transaction record. The exact custody and settlement design still requires regulated payment and legal advice in each operating country.
