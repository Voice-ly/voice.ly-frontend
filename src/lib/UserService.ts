import type { UserSignupForm,} from "../types/User";
import { apiFetch } from "./fetch";

export function register(request: UserSignupForm): Promise<Response> {
    return apiFetch("/", {
        method: "POST",
        body: JSON.stringify(request),
    }, "users");
}


export function getUsers(): Promise<Response> {
    return apiFetch("/profile", { method: "GET" }, "users");
}

export function updateProfile(data: any): Promise<Response> {
    return apiFetch("/profile", {
        method: "PUT",
        body: JSON.stringify(data),
    }, "users");
}

export function deleteUser(): Promise<Response> {
    return apiFetch("/profile", { method: "DELETE" }, "users");
}