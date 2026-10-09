# Ransar Formulation — Company Website & Business Desk

A responsive public-facing pharmaceutical marketing website paired with a lightweight internal business-desk prototype.

## What's included

- **Company website:** responsive landing page, company overview, product portfolio, approach and enquiry form UI.
- **Business desk:** overview metrics, doctor directory, follow-up planner, product catalogue and sales tracker.
- **Daily workflow:** add doctors, schedule follow-ups, mark tasks complete, maintain product details and record sales.
- **Export:** download business records as CSV.
- **Responsive UX:** desktop sidebar, mobile navigation, accessible form labels and clear demo-data indicators.
- **No build step:** plain HTML, CSS and JavaScript, suitable for Render Static Site hosting.

## Deploy on Render

1. In Render, choose **New + → Static Site**.
2. Connect `RTdeveloper2/ransar-formulation`.
3. Select branch `main`.
4. Set the **Publish Directory** to `.`.
5. Leave the build command empty (this is a static site), then deploy.

Render will serve `index.html` directly. After a push to `main`, the site can automatically redeploy if auto-deploy is enabled.

## Before making the site public

Replace the six placeholder product names and descriptions in `index.html` with your real product details. Update the same product names in the demo seed data in `app.js`. Add the official business email, phone number and address.

- Product names, package illustrations, compositions, category labels and dashboard entries are placeholders.
- Do not publish unverified product claims. Have pharmaceutical promotional materials reviewed against approved product information and applicable Indian regulations.
- The enquiry form is a frontend demo and **does not send or store submissions** until you configure the official email/backend.
- The Business Desk uses browser `localStorage` for demonstration. Records remain in that browser only, are not shared between devices/users, and are not securely backed up.
- Do not enter patient-identifiable information or sensitive medical data into this prototype.
- The dashboard has no authentication or server-side database. It is not ready for sensitive or multi-user production use.

## Suggested production roadmap

1. Connect the enquiry form to a backend or a business mailbox.
2. Add secure login and role-based access.
3. Move doctors, follow-ups, products and sales into PostgreSQL.
4. Add reminders (email/WhatsApp only with proper consent and compliant provider setup).
5. Add product-wise sales reports, territory tracking and backup/export.
6. Add an audit trail and access controls before storing business-sensitive information.

## Run locally

Open `index.html` in a modern browser, or run a simple static server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.
