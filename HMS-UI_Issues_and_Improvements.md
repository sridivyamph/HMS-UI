# HMS-UI Issues & Improvements

## Overview

## Issues Found

1. **Hospital ID hardcoded to 3** — The entire system has `hospitalId = 3` hardcoded in login, API calls, and business logic. It needs to be dynamic so the same codebase can serve multiple hospitals.

2. **`GET /unauth/configurations?domainName=local` is broken (500 error)** — This API is supposed to return app configuration (including `hospitalId`) on startup. It currently throws a serialization error (`Could not set value of type java.util.LinkedHashMap`). On failure, the frontend falls back to `{ hospitalId: 3 }`, which is the root cause of the hardcoded hospital ID problem.

3. **Payment audit fields populated incorrectly** — When payments are captured, the `created_by` / `updated_by` fields are filled with `system_webhook` instead of the actual user who made the purchase.

## Improvement Ideas

1. **Admin: Hospital onboarding API** — Admin module needs an API endpoint to onboard new hospitals dynamically, so hospitals can be registered through the UI without backend changes.

2. **Doctor appointment pricing API** — Need an API to create/set the cost of doctor appointments so that the correct price is charged at booking time.

3. **Razorpay: Remove PayLater option** — Try to remove the PayLater option from Razorpay payment methods and keep only other options (cards, UPI, net banking, etc.), so both online payment and cash payment methods are available.

4. **Doctor slot management API + Admin UI** — Need an API to enable/configure slots for newly created doctors, and a full slot management feature (create, edit, disable slots across dates) in the admin module UI.
