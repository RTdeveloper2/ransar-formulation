require("dotenv").config();
const path = require("path");
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === "production";
if (isProduction && !process.env.JWT_SECRET) throw new Error("JWT_SECRET must be configured in production.");
if (isProduction && !process.env.DATABASE_URL) throw new Error("DATABASE_URL must be configured in production.");
const jwtSecret = process.env.JWT_SECRET || "local-development-only-change-me";
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && !/localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL) ? { rejectUnauthorized: false } : false,
  max: 10, idleTimeoutMillis: 30000, connectionTimeoutMillis: 10000
});
app.disable("x-powered-by");
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "1mb" }));
app.use("/api/login", rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: "draft-7", legacyHeaders: false }));
const EMPTY_DATA = { doctors: [], visits: [], followups: [], products: [], sales: [] };

async function initDatabase() {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS app_users (id BIGSERIAL PRIMARY KEY, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())"
  );
  await pool.query(
    "CREATE TABLE IF NOT EXISTS business_data (id INTEGER PRIMARY KEY CHECK (id = 1), data JSONB NOT NULL DEFAULT '{\"doctors\":[],\"visits\":[],\"followups\":[],\"products\":[],\"sales\":[]}'::jsonb, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())"
  );
  await pool.query(
    "INSERT INTO business_data (id, data) VALUES (1, $1::jsonb) ON CONFLICT (id) DO NOTHING",
    [JSON.stringify(EMPTY_DATA)]
  );
  const email = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = String(process.env.ADMIN_PASSWORD || "");
  if (email && password) {
    const existing = await pool.query("SELECT id FROM app_users LIMIT 1");
    if (existing.rowCount === 0) {
      if (password.length < 12) throw new Error("ADMIN_PASSWORD must be at least 12 characters.");
      await pool.query("INSERT INTO app_users (email, password_hash) VALUES ($1, $2)", [email, await bcrypt.hash(password, 12)]);
      console.log("Initial admin account created from environment variables.");
    }
  }
}
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return res.status(401).json({ error: "Please sign in to access the business desk." });
  try { req.user = jwt.verify(token, jwtSecret); return next(); }
  catch { return res.status(401).json({ error: "Your session expired. Please sign in again." }); }
}
app.get("/api/health", async (_req, res) => {
  try { await pool.query("SELECT 1"); res.json({ ok: true, database: "connected" }); }
  catch { res.status(503).json({ ok: false, database: "unavailable" }); }
});
app.post("/api/login", async (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  if (!email || !password || email.length > 254 || password.length > 1024) return res.status(400).json({ error: "Enter your email and password." });
  try {
    const result = await pool.query("SELECT id, email, password_hash FROM app_users WHERE email = $1", [email]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) return res.status(401).json({ error: "Email or password is incorrect." });
    const token = jwt.sign({ sub: String(user.id), email: user.email }, jwtSecret, { expiresIn: "8h" });
    return res.json({ token, user: { email: user.email }, expiresIn: 28800 });
  } catch (error) { console.error("Login failed:", error.message); return res.status(500).json({ error: "Unable to sign in right now." }); }
});
app.get("/api/data", requireAuth, async (_req, res) => {
  try {
    const result = await pool.query("SELECT data, updated_at FROM business_data WHERE id = 1");
    return res.json({ data: result.rows[0]?.data || EMPTY_DATA, updatedAt: result.rows[0]?.updated_at || null });
  } catch (error) { console.error("Data read failed:", error.message); return res.status(500).json({ error: "Unable to load business data." }); }
});
app.put("/api/data", requireAuth, async (req, res) => {
  const data = req.body?.data;
  const keys = ["doctors", "visits", "followups", "products", "sales"];
  if (!data || typeof data !== "object" || keys.some(key => !Array.isArray(data[key])) || keys.some(key => data[key].length > 10000)) {
    return res.status(400).json({ error: "Business data has an invalid format or is too large." });
  }
  try {
    await pool.query("INSERT INTO business_data (id, data, updated_at) VALUES (1, $1::jsonb, NOW()) ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()", [JSON.stringify(Object.fromEntries(keys.map(key => [key, data[key]])))]);
    return res.json({ ok: true, savedAt: new Date().toISOString() });
  } catch (error) { console.error("Data save failed:", error.message); return res.status(500).json({ error: "Unable to save changes. Check your connection and try again." }); }
});
app.use(express.static(path.join(__dirname, "dist"), { index: "index.html", fallthrough: true }));
app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "dist", "index.html")));
initDatabase().then(() => app.listen(PORT, () => console.log("Ransar Formulation server listening on port " + PORT))).catch(error => {
  console.error("Database initialization failed:", error);
  process.exit(1);
});
process.on("SIGTERM", async () => { await pool.end(); process.exit(0); });
