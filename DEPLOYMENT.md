# Soko staging deployment

Soko is a Node server with a SQLite database and encrypted merchant documents. The host must provide a persistent disk; a static-only website host is not sufficient for the marketplace API.

## Before starting

1. Choose a Node host that supports persistent storage and HTTPS.
2. Point a staging hostname (for example `staging.sokomarketplace.trade`) to that host.
3. Set these server environment variables in the host dashboard, never in Git:

   - `NODE_ENV=staging`
   - `APP_BASE_URL=https://staging.sokomarketplace.trade`
   - `DOCUMENT_ENCRYPTION_KEY` (long random value; back it up securely)
   - `CARRIER_WEBHOOK_SECRET` (random secret shared with the carrier)
   - `PAYMENTS_PROVIDER=development` for staging, or Paystack test mode when ready
   - `EMAIL_PROVIDER=resend`, `RESEND_API_KEY`, and `EMAIL_FROM`
   - `EMAIL_AUTO_FLUSH=false` until a scheduled/admin outbox flush is configured
   - `SOKO_DATA_DIR=/var/data` (the host's persistent disk mount path)
   - `BACKUP_INTERVAL_HOURS=24` to create a daily consistent backup on that disk

## Start and verify

```bash
npm ci
NODE_ENV=staging npm start
curl https://staging.sokomarketplace.trade/api/health
```

The health response must contain `"ok":true`. Create a buyer and merchant test account, verify the email links, complete a test checkout, and confirm that the admin email outbox shows delivery status.

## Storage and backups

Keep the `data/` directory on persistent storage. It contains the SQLite database and encrypted private merchant documents. Back up both together; changing `DOCUMENT_ENCRYPTION_KEY` makes existing identity documents unreadable.

Create a consistent local backup with:

```bash
npm run backup
```

The production server can run this automatically with `BACKUP_INTERVAL_HOURS=24`. These backups are still on the Render disk, so also copy them to separate storage for disaster recovery. Do not treat same-disk backups as an off-site backup.

## Domain and Resend

Resend only verifies the sending domain. The staging hostname still needs to point to the application host, and `APP_BASE_URL` must use that HTTPS hostname so verification and password-reset links open the deployed app.
