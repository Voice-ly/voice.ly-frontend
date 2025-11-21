import type { UserSignupForm,} from "../types/User";
import { apiFetch } from "./fetch";

export function register(request: UserSignupForm): Promise<Response> {
    return apiFetch("/", {
        method: "POST",
        body: JSON.stringify(request),
    }, "users");
}


export async function getUsers(): Promise<any> {
  const res = await apiFetch("/profile", { method: "GET" }, "users");

  if (!res.ok) throw new Error("Error obteniendo usuario");

  return await res.json(); // <-- AQUÍ EL JSON REAL
}

export function updateProfile(data: any): Promise<Response> {
    return apiFetch("/profile", {
        method: "PUT",
        body: JSON.stringify(data),
    }, "users");
}

export function deleteUser(data:any): Promise<Response> {
    return apiFetch("/profile", { method: "DELETE",body: JSON.stringify(data), },  "users");
}