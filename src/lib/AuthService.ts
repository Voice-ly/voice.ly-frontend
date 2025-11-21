import type {
    ForgotPasswordRequest,
    ResetPasswordRequest,
    UserSigninForm,
} from "../types/User";
import { apiFetch } from "./fetch";
import {
    FacebookAuthProvider,
    getAuth,
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

/**
 * Authenticates the user using Facebook OAuth via Firebase.
 *
 * @returns {Promise<void>} Resolves when authentication completes.
 */
export function loginWithFacebook() {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            // The signed-in user info.
            const user = result.user;

            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            const credential =
                FacebookAuthProvider.credentialFromResult(result);
            const accessToken = credential?.accessToken;

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
            const credential = FacebookAuthProvider.credentialFromError(error);

            // ...
        });
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
    request: ResetPasswordRequest
): Promise<Response> {
    return apiFetch(
        "/reset-password",
        {
            method: "POST",
            body: JSON.stringify(request),
        },
        "auth"
    );
}
