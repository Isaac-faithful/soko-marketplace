# Soko merchant and support operations (launch draft)

**Status:** internal operating draft — not legal advice. Have local counsel review it before launch. Replace placeholders with the final Soko legal entity, support contact, SLAs and country-specific requirements.

## Merchant onboarding and approval

### 1. Account and submission

1. Merchant creates an account and verifies their email.
2. Merchant completes the onboarding form: legal name, store name, phone, country, address, product categories, payout account and delivery areas/prices.
3. Merchant uploads the required documents shown for their country (normally government ID, business registration where applicable, proof of address and payout-account evidence).
4. Merchant confirms that listings, products and fulfilment claims are accurate, then submits the application.

The application moves through: `draft` → `submitted` → `under_review` → `approved`, or `rejected` / `needs_more_information`. An approved merchant can list products; a rejected or incomplete merchant cannot receive customer orders.

### 2. Admin review checklist

The reviewer records a decision note and checks:

- name, phone, country and address consistency;
- document legibility, expiry and signs of tampering;
- payout-account name and currency match;
- duplicate accounts, unusual activity and sanctions/risk signals;
- prohibited, regulated, counterfeit or unsafe product categories;
- product descriptions, photos, stock and delivery promise; and
- whether the merchant can serve the selected delivery areas.

Do not approve a merchant when identity or payout ownership cannot be established. Ask for specific missing information rather than requesting unnecessary documents.

### 3. Decision and ongoing monitoring

- **Approve:** record reviewer, date, scope and any conditions; notify the merchant.
- **Needs information:** keep the application pending and specify exactly what to provide.
- **Reject:** record a clear reason and whether re-application is allowed.
- **Suspend:** pause listings and payouts when there is safety, fraud, legal, repeated fulfilment or customer-harm risk. Preserve evidence and give a response route where safe.
- **Payout changes:** require re-verification and a short review hold after a merchant changes payout details.

Review high-risk categories and active merchants periodically. Keep an audit log of approvals, document access, suspensions and reinstatements.

## Support playbooks

### Failed or delayed delivery

1. Open a support case linked to the order and place a payout hold if payout has not been released.
2. Check the buyer address, merchant-to-Soko dispatch proof, Soko receiving record, outbound tracking events, carrier reason and contact attempts.
3. Ask the buyer and merchant for missing evidence; give the merchant normally **48 hours** to respond to a dispute.
4. Choose an outcome: one re-delivery, return to merchant, replacement, partial refund or full refund.
5. Record the decision, refund allocation, payout action and customer notification. Close only after the buyer confirms receipt or the refund is complete.

### Refunds and returns

1. Confirm order, payment status, delivery status and the reason for the request.
2. Request photos/video, packaging, tracking and any relevant product evidence.
3. Apply the published policy and any mandatory consumer protections; never promise an outcome before review.
4. If approved, calculate product and delivery portions separately. Product commission is reversed proportionally; delivery is not included in product commission.
5. Refund through the original payment route, restore stock only when appropriate, release or reverse payout, and send a written decision.

### Disputes and escalation

1. Give the other party the case summary and a fair response deadline (normally 48 hours).
2. Keep buyer, merchant and carrier evidence in the case; do not edit the original record.
3. A support lead reviews new evidence and conflicts of interest. Escalate safety, fraud, high-value, repeat or legal complaints to the authorised Soko decision-maker.
4. The final decision must state the facts relied on, remedy, payout/refund action and appeal route (if available).
5. Retain the audit record according to the final retention schedule and use recurring issues to improve merchant guidance and carrier selection.

## Minimum case record

`case_id`, `order_id`, buyer, merchant, opened_at, issue type, evidence links, inbound carrier events, Soko receiving record, outbound carrier events, merchant response, decision maker, decision, product refund, delivery refund, commission reversal, payout status, notifications sent, and closed_at.

## Soko-managed fulfilment

1. After payment confirmation, the merchant prepares and labels the order with the Soko order reference.
2. The merchant sends the parcel to the assigned Soko fulfilment office and records the inbound carrier, tracking, proof and estimated office arrival. The merchant must not send the order directly to the buyer.
3. Soko staff physically receive the parcel, check the reference, package count and visible condition, then record a receiving note. Merchant settlement is eligible only after this check-in and the normal payment, dispute and risk controls pass.
4. Soko selects the outbound carrier, dispatches the parcel to the buyer, and records the buyer-facing tracking link and estimated delivery date.
5. From Soko office receipt onward, Soko owns carrier coordination and buyer delivery updates. Failed outbound delivery returns to Soko, not directly to the merchant, unless support records another decision.

## Before launch

- Choose and publish support channels, business hours and response targets.
- Confirm the final refund windows and country-specific consumer rights with counsel.
- Train at least one backup reviewer and restrict access to identity documents.
- Run test cases for lost parcel, wrong item, damaged item, buyer cancellation, duplicate payment and merchant non-response.
