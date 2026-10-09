const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...options.headers,
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.error || "The request could not be completed.");
    error.status = response.status;
    throw error;
  }
  return payload;
}

export const api = {
  login: (email, password) => request("/api/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  getData: (token) => request("/api/data", { token }),
  saveData: (token, data) => request("/api/data", { method: "PUT", token, body: JSON.stringify({ data }) }),
};
