const baseUrl = import.meta.env.VITE_BASE_URL + "/api/users";

export function apiFetch(
    endpoint: string = "",
    options: RequestInit = {}
): Promise<Response> {
    const headers = new Headers({
        "Content-type": "application/json",
        ...options.headers,
    });

    return fetch(baseUrl + endpoint, {
        headers,
        ...options,
    });
}
