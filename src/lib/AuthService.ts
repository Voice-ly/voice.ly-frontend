import type {
    ForgotPasswordRequest,
    ResetPasswordRequest,
    UserSigninForm,
} from "../types/User";
import { apiFetch } from "./fetch";
import {
    FacebookAuthProvider,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { auth } from "./firebase";

// Routes base URL: /auth
/**
 * Sends a login request to the API using email and password.
 *
 * @param {UserSigninForm} request - The user's login credentials.
 * @returns {Promise<Response>} The API response.
 */
export function login(request: UserSigninForm): Promise<Response> {
    return apiFetch(
        "/login",
        {
            method: "POST",
            body: JSON.stringify(request),
        },
        "auth"
    );
}

/**
 * Authenticates the user using Google OAuth via Firebase.
 *
 * @returns {Promise<void>} Resolves when authentication completes.
 */

export function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
}

/**
 * Authenticates the user using Facebook OAuth via Firebase.
 *
 * @returns {Promise<void>} Resolves when authentication completes.
 */

export function loginWithFacebook() {
    const provider = new FacebookAuthProvider();
    return signInWithPopup(auth, provider);
}

/**
 * Logs out the currently authenticated user by calling the API.
 *
 * @returns {Promise<Response>} The API response.
 */
export function logout(): Promise<Response> {
    return apiFetch("/logout", { method: "POST" }, "auth");
}

/**
 * Sends a request to initiate a password recovery process.
 *
 * @param {ForgotPasswordRequest} request - The user's email for password recovery.
 * @returns {Promise<Response>} The API response.
 */
export function forgotPassword(
    request: ForgotPasswordRequest
): Promise<Response> {
    return apiFetch(
        "/forgot-password",
        {
            method: "POST",
            body: JSON.stringify(request),
        },
        "auth"
    );
}

/**
 * Sends a request to reset the user's password.
 *
 * @param {ResetPasswordRequest} request - The reset token and new password data.
 * @returns {Promise<Response>} The API response.
 */
export function resetPassword(
    request: ResetPasswordRequest,
    token: string
): Promise<Response> {
    return apiFetch(
        `/reset-password?token=${token}`,
        {
            method: "POST",
            body: JSON.stringify(request),
        },
        "auth"
    );
}
