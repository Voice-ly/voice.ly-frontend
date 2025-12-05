import { Link, useNavigate } from "react-router";
import logo from "/logo.jpeg";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { login, loginWithGithub, loginWithGoogle } from "../lib/AuthService";
import type { UserSigninForm } from "../types/User";
import {
    GitHubLoginButton,
    GoogleLoginButton,
} from "../components/AuthButtons";
import { getUsers } from "../lib/UserService";
import { useUserStore } from "../stores/useUserStore";
import { apiFetch } from "../lib/fetch";
import {
    fetchSignInMethodsForEmail,
    GoogleAuthProvider,
    linkWithCredential,
    signInWithPopup,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { showToast } from "../utils/toast";
/**
 * LoginPage Component
 *
 * This component renders the login page, allowing users to authenticate
 * using email/password, Google OAuth, or Facebook OAuth.
 *
 * It includes:
 * - Controlled form inputs for email and password.
 * - submit handler connected to the AuthService.
 * - Social login buttons (Google and Facebook).
 * - Redirect to "/dashboard" on successful login.
 */
export default function LoginPage() {
    const navigate = useNavigate();
    const initialForm: UserSigninForm = {
        email: "",
        password: "",
    };

    const { setProfile } = useUserStore();

    /**
     * React state holding the login form fields.
     * @type {[UserSigninForm, Function]}
     */
    const [form, setForm] = useState<UserSigninForm>(initialForm);

    /** Password vibility toggle**/
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    // validation function on inputs
    const validateInputs = () => {
        if (!form.email.trim() || !form.password.trim()) {
            showToast("Por favor completa todos los campos", "error");
            return false;
        }

        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(form.email)) {
            showToast("Correo inválido", "error");
            return false;
        }

        if (form.password.length < 8) {
            showToast("La contraseña debe tener mínimo 8 caracteres", "error");
            return false;
        }

        return true;
    };

    /**
     * Handles changes in form input fields.
     *
     * @param {ChangeEvent<HTMLInputElement>} e - The input change event.
     */
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    /**
     * Handles the submit event for the login form.
     * Calls the login service and redirects on success.
     *
     * @param {FormEvent} e - The form submission event.
     * @returns {Promise<void>}
     */
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validateInputs()) return;

        try {
            const res = await login(form);

            const data = await res.json();
            console.log(data);
            if (!res.ok) {
                showToast("Correo o contraseña inválidos", "error");
                return;
            }

            // guardar token real del backend
            localStorage.setItem("token", data.token);

            const getProfile = await getUsers();
            console.log(getProfile);

            showToast("Inicio de sesión exitoso", "success");
            setProfile(getProfile);
            navigate("/dashboard");
        } catch (e) {
            console.log("Error " + e);
            showToast("Error al iniciar sesión", "error");
        }
    };

    /**
     * Starts the authentication proccess with Google using Firebase.
     * 
     * This function opens an emergent window to complete the log in with their google account.
     * 
     */
    const handleLoginWithGoogle = (e: Event) => {
        e.preventDefault();
        loginWithGoogle()
            .then(async (result: any) => {
                const user: any = result.user;

                const idToken = await user.getIdToken();
                const res = await apiFetch(
                    "/socialAuth",
                    {
                        method: "POST",
                        body: JSON.stringify({ idToken }),
                    },
                    "auth"
                );
                const creationTime =
                    user.auth.currentUser.metadata.creationTime;

                const createdAt = {
                    _seconds: Math.floor(
                        new Date(creationTime).getTime() / 1000
                    ),
                };

                const token = await res.json();
                localStorage.setItem("token", token.token);
                const getProfile = await getUsers();
                console.log(getProfile);

                if (res.ok) {
                    const profile = {
                        firstName: user.auth.currentUser.displayName,
                        email: user.auth.currentUser.email,
                        createdAt,
                    };
                    const token = await res.json();
                    localStorage.setItem("token", token.token);
                    setProfile(profile);
                    showToast("Inicio de sesión con Google exitoso", "success");
                    navigate("/dashboard");
                }
            })
            .catch(async (error) => {
                if (
                    error.code ===
                    "auth/account-exists-with-different-credential"
                ) {
                    const email = error.customData.email;
                    const pendingCred = error.credential;

                    // Consultar proveedores asociados al email
                    const providers = await fetchSignInMethodsForEmail(
                        auth,
                        email
                    );

                    // Caso típico: ya existe la cuenta con Google
                    if (providers.includes("google.com")) {
                        showToast(
                            "Este correo ya está registrado con otro método",
                            "error"
                        );
                        showToast(
                            "Este correo ya está registrado con otro método",
                            "error"
                        );
                        const googleProvider = new GoogleAuthProvider();
                        const googleResult = await signInWithPopup(
                            auth,
                            googleProvider
                        );

                        // Vincular las credenciales de Facebook al usuario existente
                        await linkWithCredential(
                            googleResult.user,
                            pendingCred
                        );

                        console.log("Cuentas vinculadas correctamente");
                    }
                } else {
                    console.log(error);
                    showToast("Error al iniciar sesión con Google", "error");
                }
            });
    };

    /**
     * Starts the authentication proccess with Github using Firebase.
     * 
     * This function opens an emergent window to complete the log in with their Github account.
     * 
     */
    const handleLoginWithGithub = (e: Event) => {
        e.preventDefault();
        loginWithGithub()
            .then(async (result) => {
                // The signed-in user info.
                const user: any = result.user;

                const creationTime =
                    user.auth.currentUser.metadata.creationTime;

                const createdAt = {
                    _seconds: Math.floor(
                        new Date(creationTime).getTime() / 1000
                    ),
                };
                const idToken = await user.getIdToken();
                const res = await apiFetch(
                    "/socialAuth",
                    {
                        method: "POST",
                        body: JSON.stringify({ idToken }),
                    },
                    "auth"
                );

                if (res.ok) {
                    const profile = {
                        firstName: user.auth.currentUser.displayName,
                        email: user.auth.currentUser.email,
                        createdAt,
                    };
                    setProfile(profile);

                    const token = await res.json();
                    localStorage.setItem("token", token.token);
                    showToast(
                        "Inicio de sesión con Facebook exitoso",
                        "success"
                    );
                    navigate("/dashboard");
                }
            })
            .catch(async (error) => {
                if (
                    error.code ===
                    "auth/account-exists-with-different-credential"
                ) {
                    const email = error.customData.email;
                    const pendingCred = error.credential;

                    // Consultar proveedores asociados al email
                    const providers = await fetchSignInMethodsForEmail(
                        auth,
                        email
                    );

                    // Caso típico: ya existe la cuenta con Google
                    if (providers.includes("google.com")) {
                        showToast(
                            "Este correo ya está registrado con otro método",
                            "error"
                        );
                        const googleProvider = new GoogleAuthProvider();
                        const googleResult = await signInWithPopup(
                            auth,
                            googleProvider
                        );

                        // Vincular las credenciales de Facebook al usuario existente
                        await linkWithCredential(
                            googleResult.user,
                            pendingCred
                        );

                        console.log("Cuentas vinculadas correctamente");
                    }
                } else {
                    console.log(error);
                    showToast("Error al iniciar sesión con Github", "error");
                }
            });
    };

    return (
        <div className="py-0 sm:py-49 h-full">
            <img src={logo} alt="logo" className="w-[99px] h-[77px] mx-auto" />
            <h1 className="text-3xl text-center font-bold">Inicia Sesión</h1>
            <div className="flex gap-3 justify-center my-4">
                <GoogleLoginButton submit={handleLoginWithGoogle} />
                <GitHubLoginButton submit={handleLoginWithGithub} />
            </div>
            <form method="post" className="w-full" onSubmit={handleSubmit}>
                {/* EMAIL */}
                <div className="flex flex-col w-5/6 mx-auto">
                    <label className="text-[9px] sm:text-[13px]">Email</label>

                    <input
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        name="email"
                        className="text-[8px] sm:text-[13px] py-2 border-b 
                        border-[#918EF4] focus:outline-none focus:border-blue-500 
                        bg-transparent"
                        placeholder="johndoe@email.com"
                        required
                    />
                </div>

                {/* PASSWORD */}
                <div className="flex flex-col w-5/6 mx-auto mt-3 relative">
                    <label className="text-[9px] sm:text-[13px]">
                        Contraseña
                    </label>

                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className="text-[8px] sm:text-[13px] py-2 border-b 
                        border-[#918EF4] focus:outline-none focus:border-blue-500 
                        bg-transparent"
                        placeholder="Digita tu Contraseña"
                        required
                    />

                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-2 top-7 text-xs text-blue-800"
                    >
                        {showPassword ? "Ocultar" : "Ver"}
                    </button>
                </div>

                {/* Forgot password link */}
                <span className="flex justify-end">
                    <Link
                        to={"/forgot-password"}
                        className="text-[#7B76F1] text-[13px] mr-8 mt-2"
                    >
                        ¿Olvidaste tu contraseña?
                    </Link>
                </span>

                {/* Submit Button */}
                <span className="flex justify-center mt-6">
                    <button
                        type="submit"
                        className="bg-[#7B76F1] rounded-full text-white 
                        font-bold w-[153px] h-[56px] cursor-pointer"
                    >
                        Iniciar
                    </button>
                </span>

                {/* LINK REGISTER */}
                <p className="text-[#424242] text-[13px] text-center mt-4">
                    ¿No tienes una cuenta?{" "}
                    <Link to={"/register"} className="text-[#1976D2] font-bold">
                        Registrate ahora!
                    </Link>
                </p>
            </form>
        </div>
    );
}
