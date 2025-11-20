export function apiFetch(
    endpoint: string = "",
    options: RequestInit = {},
    base: "users" | "auth" = "users"
): Promise<Response> {

    const baseUrl = import.meta.env.VITE_BASE_URL + `/api/${base}`;

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