# Ransar Formulation

A full-stack application for Ransar Formulation: a responsive public company website and a private business desk for doctor relationships, follow-ups, product records and sales.

## Technology

- **Frontend:** React 18, Vite, responsive CSS
- **Backend:** Node.js, Express REST API
- **Database:** PostgreSQL
- **Authentication:** bcrypt password hashes and signed JWTs
- **Hosting:** Render Node web service; PostgreSQL database hosted separately

## Project structure

```
src/
  App.jsx       React page, login, dashboard and reusable UI
  api.js        Frontend API client
  app.css       Responsive public site and dashboard styles
  main.jsx      React entry point
server.js       Express API and production static-file server
schema.sql      PostgreSQL table definitions
vite.config.js  Vite development server and /api proxy
render.yaml     Render web service configuration
```

## Run locally

Requirements: Node.js 20+ and PostgreSQL.

1. Create a PostgreSQL database named `ransar_formulation`.
2. Copy `.env.example` to `.env` and set `DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`. Use a unique password of at least 12 characters and a random JWT secret.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the API in one terminal:

   ```bash
   npm run dev:api
   ```

5. Start the React development server in another terminal:

   ```bash
   npm run dev
   ```

6. Open the Vite URL shown in the terminal (usually `http://localhost:5173`). Vite proxies `/api` calls to the Node API on port 3000.

Build the frontend with `npm run build`; run the production server with `npm start`.

## Deploy on Render

1. Create a managed PostgreSQL database on Render (or provide a compatible PostgreSQL connection string).
2. Create a **Web Service** connected to `RTdeveloper2/ransar-formulation`, branch `main`. The included `render.yaml` configures a Node service with `npm install && npm run build`, `npm start`, and `/api/health` as its health check.
3. Add the PostgreSQL **internal** connection string as `DATABASE_URL` where applicable.
4. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in the Render environment. Use a unique password with at least 12 characters. The first admin account is created on startup only when no users exist yet.
5. Deploy and check `/api/health`. Then open **Business desk** and sign in with the configured admin credentials.

Never commit `.env`, passwords, database URLs or real customer data. Keep secrets in the hosting provider's environment settings.

## Important behavior and limitations

- Business records are fetched from and saved to PostgreSQL through authenticated Node API endpoints. The React app does not treat browser localStorage as the source of truth.
- The session token is kept in sessionStorage and expires after eight hours. Sign out to clear the browser session.
- The initial database starts with empty business records. Product names on the public page are placeholders; replace them with the real approved portfolio before launch.
- The contact form opens an email draft to a placeholder address. Replace `company@example.com` in `src/App.jsx` with the official business email, or implement a server-side enquiry endpoint before launch.
- The current business-data API stores the four record collections in one JSONB document. This is suitable as a small internal starting point, but normalized tables, role-based access, audit logs, backups and conflict-safe updates should be added before broader production use.
- Avoid entering patient-identifiable information or sensitive medical data. Review all pharmaceutical product descriptions and promotional material against approved product information and applicable Indian requirements.

## Checks

`npm run check` runs a production Vite build and checks the Node server syntax.
