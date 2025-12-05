import type { UserSignupForm } from "../types/User";
import { apiFetch } from "./fetch";
import {
    GithubAuthProvider,
    //getAuth,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { auth } from "./firebase";

// Routes base: /api/users
/**
 * Registers a new user by sending their data to the backend `/api/users` route.
 *
 * @param {UserSignupForm} request - The user's signup form data.
 * @returns {Promise<Response>} A promise that resolves with the server's response.
 */

// Rutas base: /api/users

export function register(request: UserSignupForm): Promise<Response> {
    return apiFetch(
        "/",
        {
            method: "POST",
            body: JSON.stringify(request),
        },
        "users"
    );
}

/**
 * Retrieves the profile information of the currently authenticated user.
 *
 * @returns {Promise<Response>} A promise containing the user profile data.
 */

export async function getUsers(): Promise<any> {
    const token = "Bearer " + localStorage.getItem("token");

    const res = await apiFetch(
        "/profile",
        { method: "GET", headers: { authorization: token } },
        "users"
    );

    if (!res.ok) throw new Error("Error obteniendo usuario");

    return await res.json(); // <-- REAL JSON HERE
}

/**
 * Updates the profile of the currently authenticated user.
 *
 * @param {any} data - Partial user data to update.
 * @returns {Promise<Response>} A promise containing the backend response.
 */

export function updateProfile(data: any): Promise<Response> {
    const token = "Bearer " + localStorage.getItem("token");

    return apiFetch(
        "/profile",
        {
            method: "PUT",
            body: JSON.stringify(data),
            headers: { authorization: token },
        },
        "users"
    );
}

/**
 * Deletes the currently authenticated user.
 *
 * @returns {Promise<Response>} A promise that resolves when the account is deleted.
 */
export function deleteUser(data: any): Promise<Response> {
    const token = "Bearer " + localStorage.getItem("token");

    return apiFetch(
        "/profile",
        {
            method: "DELETE",
            body: JSON.stringify(data),
            headers: { authorization: token },
        },
        "users"
    );
}

/**
 * Handles the registration flow for users authenticated through Google or Facebook.
 * A temporary password is generated to meet backend validation requirements.
 *
 * @async
 * @param {any} user - Firebase user object obtained from a social login provider.
 * @returns {Promise<Response>} A promise resolving with the backend registration response.
 */

async function handleSocialRegister(user: any) {
    const tempPassword = "Aa!12345"; // temporal password that accomplish all rules

    const payload: UserSignupForm = {
        firstName: user.displayName?.split(" ")[0] || "User",
        lastName: user.displayName?.split(" ").slice(1).join(" ") || "Google",
        email: user.email || "",
        password: tempPassword,
        confirmpassword: tempPassword,
        age: 18, // should be > 0
    };

    return register(payload);
}

/**
 * Registers a user using Google authentication.
 * After successful Google sign-in, user data is sent to the backend for account creation.
 *
 * @async
 * @returns {Promise<Response>} Backend response after attempting registration.
 * @throws Will throw an error if Google authentication fails.
 */
// Register with Google
export async function registerWithGoogle() {
    const provider = new GoogleAuthProvider();

    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Its sent to backend to create the new user
        return await handleSocialRegister(user);
    } catch (error) {
        console.error("Google registration error:", error);
        throw error;
    }
}

/**
 * Register with Github 
 */
export async function registerWithGithub() {
    const provider = new GithubAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        return await handleSocialRegister(user);
    } catch (error) {
        console.error("Facebook error", error);
        throw error;
    }
}
