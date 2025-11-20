import type {
    ForgotPasswordRequest,
    ResetPasswordRequest,
    UserSigninForm,
    UserSignupForm,
} from "../types/User";
import { apiFetch } from "./fetch";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export function register(request: UserSignupForm): Promise<Response> {
    return apiFetch("", {
        method: "POST",
        body: JSON.stringify(request),
    });
}

export function login(request: UserSigninForm): Promise<Response> {
    return apiFetch("/login", {
        method: "POST",
        body: JSON.stringify(request),
    });
}

export function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken;
            // The signed-in user info.
            const user = result.user;
            // IdP data available using getAdditionalUserInfo(result)
            // ...
        })
        .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
}

export function logout(): Promise<Response> {
    return apiFetch("/logout", { method: "POST" });
}

export function getUsers(): Promise<Response> {
    return apiFetch("", { method: "GET" });
}

export function getProfile(): Promise<Response> {
    return apiFetch("", { method: "GET" });
}

export function deleteUser(): Promise<Response> {
    return apiFetch("", { method: "DELETE" });
}

export function forgotPassword(
    request: ForgotPasswordRequest
): Promise<Response> {
    return apiFetch("/forgotPassword", {
        method: "POST",
        body: JSON.stringify(request),
    });
}

export function resetPassword(
    request: ResetPasswordRequest
): Promise<Response> {
    return apiFetch("/reset-password", {
        method: "POST",
        body: JSON.stringify(request),
    });
}
