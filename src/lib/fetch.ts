/**
 * Performs a standardized API request using a predefined base URL.
 *
 * This function automatically attaches JSON headers, includes credentials
 * (cookies/session), and allows selecting between different API base paths
 * such as `/api/users` or `/api/auth`.
 *
 * @param {string} [endpoint=""] - The API endpoint to call (e.g., "/login", "/update/5").
 * @param {RequestInit} [options={}] - Additional fetch options (method, body, headers, etc.).
 * @param {"users" | "auth"} [base="users"] - Base API section to use, defaults to "users".
 *
 * @returns {Promise<Response>} The fetch response promise.
 *
 * @example
 * apiFetch("/login", {
 *   method: "POST",
 *   body: JSON.stringify({ email, password })
 * }, "auth");
 *
 * @example
 * apiFetch("/profile", { method: "GET" });
 */

export function apiFetch(
    endpoint: string = "",
    options: RequestInit = {},
    base: "users" | "auth" = "users"
): Promise<Response> {
    const baseUrl = import.meta.env.VITE_BASE_URL + `/api/${base}`;

    // Crear headers sin romper los de opciones
    const headers = new Headers(options.headers || {});
    headers.set("Content-Type", "application/json");

    // Agregar token SOLO si existe (sin afectar rutas públicas)
    const token = localStorage.getItem("token");
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    return fetch(baseUrl + endpoint, {
        ...options,
        headers,
        credentials: "include",
    });
}

export function chatApiFetch(
    endpoint: string = "",
    options: RequestInit = {},
    base: "chat" = "chat"
): Promise<Response> {
    const baseUrl = import.meta.env.VITE_CHAT_URL + `/api/${base}`;

    const headers = new Headers({
        "Content-Type": "application/json",
        ...options.headers,
    });

    return fetch(baseUrl + endpoint, {
        headers,
        ...options,
        credentials: "include",
    });
}
