import type {
    ForgotPasswordRequest,
    ResetPasswordRequest,
    UserSigninForm,
} from "../types/User";
import { apiFetch } from "./fetch";
import {
    FacebookAuthProvider,
    fetchSignInMethodsForEmail,
    GoogleAuthProvider,
    linkWithCredential,
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

export function loginWithFacebook(navigate:any) {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
        .then(async (result) => {
            // The signed-in user info.
            const user = result.user;
            const idToken = await user.getIdToken();
            const res = await apiFetch(
                "/socialAuth",
                {
                    method: "POST",
                    body: JSON.stringify({ idToken }),
                },
                "auth"
            )

            if (res.ok) {
                navigate("/dashboard");
            }
            console.log(user);



        })
        .catch(async (error) => {
            if (error.code === "auth/account-exists-with-different-credential") {
                const email = error.customData.email;
                const pendingCred = error.credential;

                // Consultar proveedores asociados al email
                const providers = await fetchSignInMethodsForEmail(auth, email);

                // Caso típico: ya existe la cuenta con Google
                if (providers.includes("google.com")) {
                    alert("Este email ya está registrado con Google. Debes iniciar sesión con Google.");

                    const googleProvider = new GoogleAuthProvider();
                    const googleResult = await signInWithPopup(auth, googleProvider);

                    // Vincular las credenciales de Facebook al usuario existente
                    await linkWithCredential(googleResult.user, pendingCred);

                    console.log("Cuentas vinculadas correctamente");
                }
            } else {
                console.log(error);
            }
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
    request: ResetPasswordRequest,
    token:string
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

