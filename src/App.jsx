import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "./api.js";

const emptyData = { doctors: [], followups: [], products: [], sales: [] };
const initialProducts = [
  { id: 1, name: "Product One", composition: "Replace with approved composition", category: "Category to confirm", price: 0, stock: 0, active: true },
  { id: 2, name: "Product Two", composition: "Replace with approved composition", category: "Category to confirm", price: 0, stock: 0, active: true },
  { id: 3, name: "Product Three", composition: "Replace with approved composition", category: "Category to confirm", price: 0, stock: 0, active: true },
  { id: 4, name: "Product Four", composition: "Replace with approved composition", category: "Category to confirm", price: 0, stock: 0, active: true },
  { id: 5, name: "Product Five", composition: "Replace with approved composition", category: "Category to confirm", price: 0, stock: 0, active: true },
  { id: 6, name: "Product Six", composition: "Replace with approved composition", category: "Category to confirm", price: 0, stock: 0, active: true },
];
const sections = [
  { id: "overview", label: "Overview", icon: "▦" },
  { id: "doctors", label: "Doctor directory", icon: "♙" },
  { id: "followups", label: "Follow-ups", icon: "◷" },
  { id: "products", label: "Products", icon: "▤" },
  { id: "sales", label: "Sales tracker", icon: "↗" },
];
const dateToday = () => new Date().toISOString().slice(0, 10);
const money = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(value) || 0);
const niceDate = (value) => value ? new Date(`${value}T12:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
const nextId = (rows) => Math.max(0, ...rows.map((row) => Number(row.id) || 0)) + 1;

function Brand({ subtitle = "FORMULATION" }) {
  return <a className="brand" href="#home" aria-label="Ransar Formulation home"><span className="brand-mark">R<span>+</span></span><span><strong>RANSAR</strong><small>{subtitle}</small></span></a>;
}

function PublicSite({ onDesk }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [enquiry, setEnquiry] = useState({ name: "", organisation: "", contact: "", interest: "Product information", message: "" });
  const submitEnquiry = (event) => {
    event.preventDefault();
    const subject = encodeURIComponent(`Ransar Formulation enquiry — ${enquiry.interest}`);
    const body = encodeURIComponent(`Name: ${enquiry.name}\nOrganisation: ${enquiry.organisation}\nContact: ${enquiry.contact}\nEnquiry: ${enquiry.interest}\n\nMessage:\n${enquiry.message}`);
    window.location.href = `mailto:company@example.com?subject=${subject}&body=${body}`;
  };
  return <div className="public-site">
    <div className="announcement"><span>●</span> Pharmaceutical marketing · Professional product information <a href="#contact">Contact our team ↗</a></div>
    <header className="site-header"><div className="site-nav"><Brand /><button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation">☰</button><nav className={menuOpen ? "nav-links open" : "nav-links"}><a onClick={() => setMenuOpen(false)} href="#about">About</a><a onClick={() => setMenuOpen(false)} href="#portfolio">Portfolio</a><a onClick={() => setMenuOpen(false)} href="#approach">Our approach</a><a onClick={() => setMenuOpen(false)} href="#contact">Contact</a><button className="button button-outline" onClick={onDesk}>Business desk ↗</button></nav></div></header>
    <main>
      <section className="hero section-wrap" id="home"><div className="hero-copy"><span className="eyebrow">BUILT ON PROFESSIONAL RELATIONSHIPS</span><h1>Better connections.<br /><em>Better healthcare.</em></h1><p>Ransar Formulation brings a focused pharmaceutical portfolio to healthcare professionals through clear product information, consistent communication and dependable partnerships.</p><div className="hero-actions"><a className="button button-primary" href="#portfolio">Explore our portfolio ↗</a><a className="text-link" href="#about">Get to know Ransar →</a></div><div className="hero-note">✓ Product information for healthcare professionals</div></div><div className="hero-art" aria-label="Illustration of pharmaceutical packaging"><div className="art-orbit"></div><div className="art-card art-card-back"><b>RANSAR</b><small>FORMULATION</small><div></div><span>PROFESSIONAL CARE</span></div><div className="art-card art-card-front"><span className="art-plus">R+</span><b>PRODUCT<br />PORTFOLIO</b><i></i><small>Illustrative packaging</small></div><div className="art-callout"><b>Thoughtful communication</b><span>Trusted partnerships</span></div></div></section>
      <section className="focus-strip"><div><small>OUR FOCUS</small><b>Clear product information</b><span>Useful and accessible</span></div><div><small>OUR FOCUS</small><b>Healthcare connections</b><span>Professional engagement</span></div><div><small>OUR FOCUS</small><b>Long-term growth</b><span>Responsible business</span></div></section>
      <section className="content-section section-wrap" id="about"><div><span className="eyebrow">ABOUT RANSAR</span><h2>A focused partner<br />for <em>healthcare brands.</em></h2></div><div className="section-copy"><p className="lead">Strong pharmaceutical businesses are built on dependable relationships, consistent communication and useful product information.</p><p>Ransar Formulation markets its product portfolio to healthcare professionals. We make it easier to explore our products and connect with our team for relevant information and business enquiries.</p></div></section>
      <section className="portfolio-section" id="portfolio"><div className="section-wrap"><div className="section-heading"><div><span className="eyebrow">OUR PORTFOLIO</span><h2>Six products.<br /><em>One trusted source.</em></h2></div><p>These entries are placeholders. Replace names and descriptions with approved, verified product information before launch.</p></div><div className="product-grid">{initialProducts.map((product, index) => <article className={`public-product tone-${index % 6}`} key={product.id}><div className="product-art"><span>0{index + 1} / PORTFOLIO</span><div className="mock-pack"><b>RANSAR</b><small>FORMULATION</small><strong>PRODUCT<br />NAME</strong><i></i></div></div><div className="product-copy"><small>PRODUCT CATEGORY</small><h3>{product.name}</h3><p>{product.composition}</p><a href="#contact" onClick={() => setEnquiry((current) => ({ ...current, interest: product.name }))}>Request product information ↗</a></div></article>)}</div></div></section>
      <section className="approach-section" id="approach"><div className="section-wrap approach-layout"><div><span className="eyebrow light">HOW WE WORK</span><h2>Relationships built<br />on <em>reliability.</em></h2><p>We focus on professional engagement, clear product communication and responsive follow-up with healthcare partners.</p><a className="button button-light" href="#contact">Connect with Ransar ↗</a></div><div className="approach-steps"><article><span>01</span><div><h3>Listen and understand</h3><p>Understand professional information needs and product enquiries.</p></div></article><article><span>02</span><div><h3>Share clear information</h3><p>Provide accurate, approved product details and documentation.</p></div></article><article><span>03</span><div><h3>Follow up responsibly</h3><p>Respond to enquiries and maintain professional communication.</p></div></article></div></div></section>
      <section className="contact-section section-wrap" id="contact"><div><span className="eyebrow">GET IN TOUCH</span><h2>Let's start a<br /><em>conversation.</em></h2><p>For product information, business enquiries or professional collaboration, contact the Ransar Formulation team.</p><div className="contact-placeholder"><b>Company contact details</b><span>Replace the email, phone and address with official business details.</span></div></div><form className="contact-form" onSubmit={submitEnquiry}><h3>Send an enquiry</h3><p>Tell us what you need and we’ll help you connect.</p><label>Full name<input required value={enquiry.name} onChange={(e) => setEnquiry({ ...enquiry, name: e.target.value })} placeholder="Your name" /></label><label>Clinic / organisation <span>OPTIONAL</span><input value={enquiry.organisation} onChange={(e) => setEnquiry({ ...enquiry, organisation: e.target.value })} placeholder="Organisation name" /></label><label>Email or phone number<input required value={enquiry.contact} onChange={(e) => setEnquiry({ ...enquiry, contact: e.target.value })} placeholder="How can we reach you?" /></label><label>I'm enquiring about<select value={enquiry.interest} onChange={(e) => setEnquiry({ ...enquiry, interest: e.target.value })}>{["Product information", "Business collaboration", "Distribution enquiry", ...initialProducts.map((p) => p.name), "Other"].map((option) => <option key={option}>{option}</option>)}</select></label><label>Message <span>OPTIONAL</span><textarea rows="3" value={enquiry.message} onChange={(e) => setEnquiry({ ...enquiry, message: e.target.value })} placeholder="A few details about your enquiry" /></label><button className="button button-primary" type="submit">Prepare enquiry →</button><small>Opens your email application. Configure the official company email before launch.</small></form></section>
    </main>
    <footer className="site-footer section-wrap"><Brand /><p>Professional pharmaceutical marketing.<br />Built on information, consistency and trust.</p><span>© {new Date().getFullYear()} Ransar Formulation. Product information must be verified before publication.</span></footer>
  </div>;
}

function Login({ onLogin, onBack, busy, error }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return <main className="auth-page"><div className="auth-card"><Brand subtitle="BUSINESS DESK" /><span className="eyebrow">PRIVATE WORKSPACE</span><h1>Welcome back.</h1><p>Sign in to manage doctor relationships, follow-ups, products and sales.</p><form onSubmit={(event) => { event.preventDefault(); onLogin(email, password); }}><label>Email address<input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} /></label><label>Password<input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>{error && <div className="error-message" role="alert">{error}</div>}<button className="button button-primary full-width" disabled={busy}>{busy ? "Signing in…" : "Sign in securely →"}</button></form><button className="back-link" onClick={onBack}>← Back to company website</button><small>Admin access is configured with server environment variables. There is no public sign-up.</small></div></main>;
}

function RecordForm({ section, onSave, onCancel, data }) {
  const configs = {
    doctors: { title: "Add doctor", fields: [["name", "Doctor name", "text", true], ["specialty", "Specialty", "text"], ["clinic", "Clinic / hospital", "text"], ["city", "City", "text"], ["phone", "Phone", "tel"], ["lastVisit", "Last visit", "date"], ["nextFollow", "Next follow-up", "date"], ["notes", "Notes", "textarea"]] },
    followups: { title: "Schedule follow-up", fields: [["doctor", "Doctor name", "text", true], ["date", "Follow-up date", "date", true], ["type", "Purpose", "text", true], ["status", "Status (Due / Scheduled / Overdue / Complete)", "text", true], ["notes", "Notes", "textarea"]] },
    products: { title: "Add product", fields: [["name", "Product name", "text", true], ["composition", "Composition / strength", "text"], ["category", "Category", "text"], ["price", "Price (₹)", "number"], ["stock", "Stock / units", "number"]] },
    sales: { title: "Record sale", fields: [["date", "Sale date", "date", true], ["product", "Product name", "text", true], ["units", "Units", "number", true], ["amount", "Amount (₹)", "number", true], ["source", "Customer / source", "text"]] },
  };
  const config = configs[section];
  const [values, setValues] = useState(() => section === "doctors" ? { lastVisit: dateToday(), ...Object.fromEntries(config.fields.map(([key]) => [key, ""])) } : section === "followups" ? { date: dateToday(), status: "Scheduled", ...Object.fromEntries(config.fields.map(([key]) => [key, ""])) } : section === "products" ? { price: "0", stock: "0", ...Object.fromEntries(config.fields.map(([key]) => [key, ""])) } : { date: dateToday(), units: "1", amount: "0", ...Object.fromEntries(config.fields.map(([key]) => [key, ""])) });
  if (!config) return null;
  const submit = (event) => {
    event.preventDefault();
    const record = { ...values, id: nextId(data[section]) };
    if (section === "products") { record.price = Number(record.price) || 0; record.stock = Number(record.stock) || 0; record.active = true; }
    if (section === "sales") { record.units = Number(record.units) || 0; record.amount = Number(record.amount) || 0; const match = data.products.find((p) => p.name.toLowerCase() === record.product.toLowerCase()); if (match) record.productId = match.id; }
    if (section === "followups") { const match = data.doctors.find((d) => d.name.toLowerCase() === record.doctor.toLowerCase()); if (match) record.doctorId = match.id; }
    onSave(record);
  };
  return <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel(); }}><form className="record-modal" onSubmit={submit}><div className="modal-heading"><div><span className="eyebrow">BUSINESS DESK</span><h2>{config.title}</h2></div><button type="button" className="icon-button" onClick={onCancel} aria-label="Close">×</button></div>{config.fields.map(([key, label, type, required]) => <label key={key}>{label}{type === "textarea" ? <textarea rows="3" required={required} value={values[key]} onChange={(e) => setValues({ ...values, [key]: e.target.value })} /> : <input type={type} required={required} min={type === "number" ? 0 : undefined} value={values[key]} onChange={(e) => setValues({ ...values, [key]: e.target.value })} />}</label>)}<div className="modal-actions"><button type="button" className="button button-outline" onClick={onCancel}>Cancel</button><button className="button button-primary">Save record</button></div></form></div>;
}

function Dashboard({ user, data, onChangeData, onLogout, saving, savedAt, error, onRetry }) {
  const [active, setActive] = useState("overview");
  const [modal, setModal] = useState("");
  const [query, setQuery] = useState("");
  const [mobileNav, setMobileNav] = useState(false);
  const [notice, setNotice] = useState("");
  const sectionLabel = sections.find((section) => section.id === active)?.label || "Overview";
  const filteredDoctors = useMemo(() => data.doctors.filter((doctor) => [doctor.name, doctor.specialty, doctor.clinic, doctor.city].join(" ").toLowerCase().includes(query.toLowerCase())), [data.doctors, query]);
  const overdue = data.followups.filter((item) => item.status?.toLowerCase() === "overdue" || (item.date && item.date < dateToday() && item.status?.toLowerCase() !== "complete"));
  const dueSoon = data.followups.filter((item) => item.status?.toLowerCase() !== "complete" && item.date && item.date <= dateToday());
  const totalSales = data.sales.reduce((sum, sale) => sum + (Number(sale.amount) || 0), 0);
  const updateSection = useCallback((section, rows) => onChangeData({ ...data, [section]: rows }), [data, onChangeData]);
  const saveRecord = (record) => {
    updateSection(modal, [...data[modal], record]);
    setModal("");
    setNotice("Record saved.");
    window.setTimeout(() => setNotice(""), 2500);
  };
  const markComplete = (item) => updateSection("followups", data.followups.map((row) => row.id === item.id ? { ...row, status: "Complete" } : row));
  const exportCsv = () => {
    const rows = [["record_type", "id", "date", "name", "detail", "status", "amount", "units"]];
    data.doctors.forEach((d) => rows.push(["doctor", d.id, d.lastVisit, d.name, [d.specialty, d.clinic, d.city].filter(Boolean).join(" | "), d.status || "", "", ""]));
    data.followups.forEach((f) => rows.push(["follow-up", f.id, f.date, f.doctor, [f.type, f.notes].filter(Boolean).join(" | "), f.status || "", "", ""]));
    data.products.forEach((p) => rows.push(["product", p.id, "", p.name, [p.composition, p.category].filter(Boolean).join(" | "), p.active ? "active" : "inactive", p.price || 0, p.stock || 0]));
    data.sales.forEach((s) => rows.push(["sale", s.id, s.date, s.product, s.source || "", "", s.amount || 0, s.units || 0]));
    const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a"); link.href = url; link.download = "ransar-business-export.csv"; link.click(); URL.revokeObjectURL(url);
  };
  const renderTable = (rows, columns, emptyText) => rows.length ? <div className="table-scroll"><table><thead><tr>{columns.map(([label]) => <th key={label}>{label}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={row.id ?? index}>{columns.map(([label, key]) => <td key={key}>{key === "action" ? <button className="table-action" onClick={() => markComplete(row)} disabled={row.status === "Complete"}>{row.status === "Complete" ? "Complete ✓" : "Mark complete"}</button> : key === "date" || key === "lastVisit" || key === "nextFollow" ? niceDate(row[key]) : key === "amount" || key === "price" ? money(row[key]) : key === "status" ? <span className={`status status-${String(row[key] || "due").toLowerCase().replace(/[^a-z]/g, "")}`}>{row[key] || "—"}</span> : row[key] ?? "—"}</td>)}</tr>)}</tbody></table></div> : <div className="empty-state"><b>Nothing here yet</b><span>{emptyText}</span></div>;
  const currentRows = active === "doctors" ? filteredDoctors : data[active] || [];
  const columnsBySection = {
    doctors: [["Doctor", "name"], ["Specialty", "specialty"], ["Clinic", "clinic"], ["City", "city"], ["Last visit", "lastVisit"], ["Next follow-up", "nextFollow"]],
    followups: [["Doctor", "doctor"], ["Date", "date"], ["Purpose", "type"], ["Status", "status"]],
    products: [["Product", "name"], ["Composition", "composition"], ["Category", "category"], ["Price", "price"], ["Stock", "stock"]],
    sales: [["Date", "date"], ["Product", "product"], ["Units", "units"], ["Amount", "amount"], ["Source", "source"]],
  };
  return <div className={`dashboard ${mobileNav ? "mobile-nav-open" : ""}`}>
    <aside className="sidebar"><Brand subtitle="BUSINESS DESK" /><span className="sidebar-label">WORKSPACE</span>{sections.map((section) => <button key={section.id} className={active === section.id ? "sidebar-link active" : "sidebar-link"} onClick={() => { setActive(section.id); setMobileNav(false); setQuery(""); }}><span>{section.icon}</span>{section.label}{section.id === "doctors" && <b>{data.doctors.length}</b>}{section.id === "followups" && overdue.length > 0 && <b className="alert-count">{overdue.length}</b>}</button>)}<div className="sidebar-bottom"><div className="avatar">{(user.email || "RF").slice(0, 2).toUpperCase()}</div><div><b>{user.email}</b><small>Authenticated workspace</small></div><button className="logout-mini" onClick={onLogout} aria-label="Sign out">↗</button></div></aside>
    <div className="dashboard-main"><header className="dashboard-top"><div className="top-left"><button className="menu-toggle dashboard-menu" onClick={() => setMobileNav(!mobileNav)} aria-label="Toggle dashboard navigation">☰</button><span>Workspace <b>/</b> <strong>{sectionLabel}</strong></span></div><div className="top-actions"><span className={saving ? "save-status saving" : "save-status"}>{saving ? "Saving…" : savedAt ? "Saved to database" : "Connected"}</span><button className="button button-outline export-button" onClick={exportCsv}>Export CSV ↓</button><button className="button button-primary" onClick={() => setModal(active === "overview" ? "doctors" : active)}>＋ Add record</button><button className="button button-outline logout-button" onClick={onLogout}>Sign out</button></div></header>
      <main className="dashboard-content"><div className="dashboard-heading"><div><span className="eyebrow">RANSAR WORKSPACE</span><h1>{active === "overview" ? "Your business at a glance." : sectionLabel}</h1><p>{active === "overview" ? "Keep your next conversations moving." : `Manage your ${sectionLabel.toLowerCase()} in one place.`}</p></div><span className="date-chip">{new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }).toUpperCase()}</span></div>
      {error && <div className="error-banner" role="alert">{error}<button onClick={onRetry}>Retry</button></div>}
      {notice && <div className="success-banner" role="status">{notice}</div>}
      {active === "overview" ? <>
        <div className="metric-grid"><article className="metric-card"><span>Doctors</span><b>{data.doctors.length}</b><small>In your directory</small></article><article className="metric-card"><span>Follow-ups due</span><b>{dueSoon.length}</b><small>{overdue.length} overdue</small></article><article className="metric-card"><span>Active products</span><b>{data.products.filter((p) => p.active !== false).length}</b><small>In your catalogue</small></article><article className="metric-card"><span>Recorded sales</span><b>{money(totalSales)}</b><small>{data.sales.length} entries recorded</small></article></div>
        <div className="dashboard-panels"><section className="panel"><div className="panel-title"><div><h2>Upcoming follow-ups</h2><p>Due today and overdue items</p></div><button className="text-button" onClick={() => setActive("followups")}>View all →</button></div>{data.followups.filter((f) => f.status !== "Complete").slice().sort((a,b) => String(a.date).localeCompare(String(b.date))).slice(0,6).map((item) => <div className="followup-row" key={item.id}><div className="row-avatar">{(item.doctor || "?").split(" ").slice(0,2).map((x) => x[0]).join("")}</div><div><b>{item.doctor}</b><span>{item.type || "Follow-up"}</span></div><time>{niceDate(item.date)}</time></div>)}{!data.followups.some((f) => f.status !== "Complete") && <div className="empty-state"><b>No follow-ups yet</b><span>Add a follow-up to see it here.</span></div>}</section><section className="panel"><div className="panel-title"><div><h2>Quick actions</h2><p>Keep records up to date</p></div></div>{[["doctors","Add a doctor","Create a healthcare professional record"],["followups","Schedule follow-up","Plan the next conversation"],["products","Add a product","Update your portfolio"],["sales","Record a sale","Track product sales"]].map(([id,label,desc]) => <button className="quick-action" key={id} onClick={() => setModal(id)}><span>＋</span><div><b>{label}</b><small>{desc}</small></div><strong>→</strong></button>)}</section></div>
      </> : <section className="panel records-panel"><div className="panel-title"><div><h2>{sectionLabel}</h2><p>{currentRows.length} record{currentRows.length === 1 ? "" : "s"}</p></div><div className="record-tools">{active === "doctors" && <input className="search-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search doctors…" aria-label="Search doctors" />}<button className="button button-primary" onClick={() => setModal(active)}>＋ Add {active === "followups" ? "follow-up" : active === "doctors" ? "doctor" : active === "products" ? "product" : "sale"}</button></div></div>{renderTable(currentRows, [...(columnsBySection[active] || []), ...(active === "followups" ? [["Action", "action"]] : [])], `Use the add button to create your first ${active === "followups" ? "follow-up" : active === "doctors" ? "doctor record" : active === "products" ? "product" : "sale"}.`)}</section>}
      <footer className="dashboard-footer"><span>Ransar Business Desk</span><span>Changes are saved to the connected PostgreSQL database.</span></footer>
      </main>
    </div>{mobileNav && <button className="mobile-scrim" onClick={() => setMobileNav(false)} aria-label="Close navigation" />}{modal && <RecordForm section={modal} data={data} onSave={saveRecord} onCancel={() => setModal("")} />}
  </div>;
}

export default function App() {
  const [page, setPage] = useState("public");
  const [token, setToken] = useState(() => sessionStorage.getItem("ransar_token") || "");
  const [user, setUser] = useState(() => { try { return JSON.parse(sessionStorage.getItem("ransar_user") || "null"); } catch { return null; } });
  const [data, setData] = useState(emptyData);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [authError, setAuthError] = useState("");
  const [dataError, setDataError] = useState("");
  const [savedAt, setSavedAt] = useState("");
  const [busyLogin, setBusyLogin] = useState(false);
  const [revision, setRevision] = useState(0);

  const signOut = useCallback(() => { sessionStorage.removeItem("ransar_token"); sessionStorage.removeItem("ransar_user"); setToken(""); setUser(null); setData(emptyData); setRevision(0); setPage("login"); setDataError(""); }, []);
  const loadData = useCallback(async (activeToken) => {
    setLoading(true); setDataError("");
    try { const result = await api.getData(activeToken); setData({ ...emptyData, ...result.data }); setSavedAt(result.updatedAt || ""); }
    catch (error) { if (error.status === 401) signOut(); else setDataError(error.message); }
    finally { setLoading(false); }
  }, [signOut]);

  useEffect(() => { if (token && user) { setPage("dashboard"); loadData(token); } }, [token, user, loadData]);
  useEffect(() => {
    if (!token || !user || revision === 0) return;
    const timeout = window.setTimeout(async () => {
      setSaving(true); setDataError("");
      try { const result = await api.saveData(token, data); setSavedAt(result.savedAt); }
      catch (error) { if (error.status === 401) signOut(); else setDataError(error.message); }
      finally { setSaving(false); }
    }, 500);
    return () => window.clearTimeout(timeout);
  }, [data, revision, token, user, signOut]);

  const login = async (email, password) => {
    setBusyLogin(true); setAuthError("");
    try { const result = await api.login(email, password); sessionStorage.setItem("ransar_token", result.token); sessionStorage.setItem("ransar_user", JSON.stringify(result.user)); setToken(result.token); setUser(result.user); setData(emptyData); setRevision(0); setPage("dashboard"); }
    catch (error) { setAuthError(error.message); }
    finally { setBusyLogin(false); }
  };
  const changeData = (next) => { setData(next); setRevision((value) => value + 1); };
  if (page === "dashboard" && token && user) return <>{loading ? <div className="loading-screen"><div className="spinner" /><p>Loading your business data…</p></div> : <Dashboard user={user} data={data} onChangeData={changeData} onLogout={signOut} saving={saving} savedAt={savedAt} error={dataError} onRetry={() => loadData(token)} />}</>;
  if (page === "login") return <Login onLogin={login} onBack={() => setPage("public")} busy={busyLogin} error={authError} />;
  return <PublicSite onDesk={() => { setAuthError(""); setPage("login"); }} />;
}
