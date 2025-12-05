import { Link, useNavigate } from "react-router";
import logo from "/logo.jpeg";
import { useState, useEffect } from "react";
import {
    register,
    //registerWithGoogle,
    //registerWithFacebook,
} from "../lib/UserService";
import type { UserSignupForm } from "../types/User";
import {
    GitHubLoginButton,
    GoogleLoginButton,
} from "../components/AuthButtons";
import { loginWithGithub, loginWithGoogle } from "../lib/AuthService";
import {
    fetchSignInMethodsForEmail,
    GoogleAuthProvider,
    linkWithCredential,
    signInWithPopup,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { apiFetch } from "../lib/fetch";
import { useUserStore } from "../stores/useUserStore";

/**
 * RegisterPage Component
 * ----------------------
 * This component renders the user registration form, including:
 * - Name, lastname, age, email and password fields
 * - Real-time validation for each input
 * - Password requirements checklist
 * - Google and Facebook login buttons
 * - Success modal after registration
 *
 * It manages multiple validation rules using regex and dynamic UI states.
 */
// Regex
const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

export default function RegisterPage() {
    // --- Form state variables--
    const [firstName, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [age, setAge] = useState<string>("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");
    const { setProfile } = useUserStore();
    const [showSuccess, setShowSuccess] = useState(false);
    /**
     * Error tracking for each input
     */
    const [activeField, setActiveField] = useState("");
    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        age: "",
        email: "",
        password: "",
        confirmpassword: "",
    });
    /** Password visibility toggle */
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    /** Form validation flag */
    const [isValid, setIsValid] = useState(false);
    const navigate = useNavigate();
    /**
     * Password validation functions
     */
    const passwordChecks = {
        length: (pw: string) => pw.length >= 8,
        upper: (pw: string) => /[A-Z]/.test(pw),
        number: (pw: string) => /\d/.test(pw),
        special: (pw: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pw),
    };

    /**
     * Updates input value and applies restrictions based on field type.
     *
     * @param {string} name - Name of the field being updated
     * @param {string} value - New value entered by the user
     */
    const handleInput = (name: string, value: string) => {
        setActiveField(name);

        if (
            (name === "firstName" || name === "lastName") &&
            value &&
            !nameRegex.test(value)
        ) {
            return; // Solo letras
        }

        if (name === "age" && !/^\d*$/.test(value)) {
            return; // Solo números
        }

        switch (name) {
            case "firstName":
                setName(value);
                break;
            case "lastName":
                setLastName(value);
                break;
            case "age":
                setAge(value);
                break;
            case "email":
                setEmail(value);
                break;
            case "password":
                setPassword(value);
                break;
            case "confirmpassword":
                setConfirmPassword(value);
                break;
        }
    };

    /**
     * Runs live validation whenever an input changes.
     */
    useEffect(() => {
        if (!activeField) return;

        let errorText = "";

        switch (activeField) {
            case "firstName":
                errorText =
                    firstName.trim().length < 2 || !nameRegex.test(firstName)
                        ? "Nombre inválido"
                        : "";
                break;

            case "lastName":
                errorText =
                    lastName.trim().length < 2 || !nameRegex.test(lastName)
                        ? "Apellido inválido"
                        : "";
                break;

            case "email":
                errorText = emailRegex.test(email) ? "" : "Correo inválido";
                break;

            case "password":
                const goodPassword =
                    passwordChecks.length(password) &&
                    passwordChecks.upper(password) &&
                    passwordChecks.number(password) &&
                    passwordChecks.special(password);

                errorText = goodPassword
                    ? ""
                    : "Contraseña no cumple requisitos";
                break;

            case "confirmpassword":
                errorText =
                    confirmpassword === password
                        ? ""
                        : "Las contraseñas no coinciden";
                break;

            case "age":
                const numAge = Number(age);
                errorText =
                    numAge >= 13 && numAge <= 120 ? "" : "Edad inválida";
                break;
        }

        const newErrors = { ...errors, [activeField]: errorText };
        setErrors(newErrors);

        /** If all fields are filled and error-free, enable the form */
        const noErrors = Object.values(newErrors).every((e) => e === "");
        const allFilled = Boolean(
            firstName && lastName && email && password && confirmpassword && age
        );
        setIsValid(noErrors && allFilled);
    }, [
        firstName,
        lastName,
        email,
        password,
        confirmpassword,
        age,
        activeField,
    ]);

    /**
     * Handles form submission and sends data to backend.
     *
     * @param {React.FormEvent<HTMLFormElement>} e - Submit event
     */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isValid) return;

        const payload: UserSignupForm = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            age: Number(age),
            email: email.trim(),
            password,
            confirmpassword,
        };

        try {
            const res = await register(payload);
            if (!res.ok) {
                const text = await res.text().catch(() => "");
                console.error("Registro falló:", res.status, text);
                return;
            }

            setShowSuccess(true);
        } catch (err) {
            console.error("Error al registrar:", err);
        }
    };

    const handleLoginWithGoogle = (e: Event) => {
        e.preventDefault();
        loginWithGoogle()
            .then(async (result) => {
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
                        alert(
                            "Este email ya está registrado con Google. Debes iniciar sesión con Google."
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
                }
            });
    };

    const handleLoginWithGithub = (e: Event) => {
        e.preventDefault();
        loginWithGithub()
            .then(async (result) => {
                // The signed-in user info.
                const user: any = result.user;
                console.log(result);
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
                    navigate("/dashboard");
                }
                console.log(user);
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
                        alert(
                            "Este email ya está registrado con Google. Debes iniciar sesión con Google."
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
                }
            });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="w-full max-w-md">
                <img
                    src={logo}
                    alt="logo"
                    className="w-[99px] h-[77px] mx-auto"
                />

                <h1 className="text-3xl text-center font-bold mt-2">
                    Registrate
                </h1>
                <div className="flex gap-3 justify-center my-4">
                    <GoogleLoginButton submit={handleLoginWithGoogle} />
                    <GitHubLoginButton submit={handleLoginWithGithub} />
                </div>

                {/* FIRST NAME */}
                <div className="flex flex-col w-full relative">
                    <label className="text-[13px]">Nombres</label>
                    <input
                        type="text"
                        name="firstName"
                        value={firstName}
                        onChange={(e) =>
                            handleInput("firstName", e.target.value)
                        }
                        title="Solo letras, mínimo 2 caracteres"
                        className={`text-[13px] py-2 border-b bg-transparent focus:outline-none ${
                            errors.firstName
                                ? "border-red-500"
                                : "border-[#918EF4]"
                        }`}
                        placeholder="Ingresa tus nombres"
                    />
                    <p className="text-xs text-red-600">{errors.firstName}</p>
                </div>

                {/* LAST NAME */}
                <div className="flex flex-col w-full mt-4 relative">
                    <label className="text-[13px]">Apellidos</label>
                    <input
                        type="text"
                        name="lastName"
                        value={lastName}
                        onChange={(e) =>
                            handleInput("lastName", e.target.value)
                        }
                        title="mas de Solo letras"
                        className={`text-[13px] py-2 border-b bg-transparent focus:outline-none ${
                            errors.lastName
                                ? "border-red-500"
                                : "border-[#918EF4]"
                        }`}
                        placeholder="Ingresa tus apellidos"
                    />
                    <p className="text-xs text-red-600">{errors.lastName}</p>
                </div>

                {/* AGE */}
                <div className="flex flex-col w-full mt-4 relative">
                    <label className="text-[13px]">Edad</label>
                    <input
                        type="number"
                        name="age"
                        value={age}
                        onChange={(e) => handleInput("age", e.target.value)}
                        title="Ingresa una edad válida entre 13 y 120 años "
                        className={`text-[13px] py-2 border-b bg-transparent focus:outline-none ${
                            errors.age ? "border-red-500" : "border-[#918EF4]"
                        }`}
                        placeholder="Ingresa tu edad"
                    />
                    <p className="text-xs text-red-600">{errors.age}</p>
                </div>

                {/* EMAIL */}
                <div className="flex flex-col w-full mt-4 relative">
                    <label className="text-[13px]">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => handleInput("email", e.target.value)}
                        title="Debe ser un correo válido"
                        className={`text-[13px] py-2 border-b bg-transparent focus:outline-none ${
                            errors.email ? "border-red-500" : "border-[#918EF4]"
                        }`}
                        placeholder="Ingresa tu correo ejem:correo@example.com"
                    />
                    <p className="text-xs text-red-600">{errors.email}</p>
                </div>

                {/* PASSWORD */}
                <div className="flex flex-col w-full mt-4 relative">
                    <label className="text-[13px]">Contraseña</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) =>
                            handleInput("password", e.target.value)
                        }
                        title="Contraseña no cumple los requisitos, debe contener mínimo 8 caracteres, 1 mayúscula, 1 número y 1 símbolo"
                        className={`text-[13px] py-2 border-b bg-transparent focus:outline-none pr-20 ${
                            errors.password
                                ? "border-red-500"
                                : "border-[#918EF4]"
                        }`}
                        placeholder="Ingresa tu contraseña"
                    />

                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-2 top-8 text-xs text-blue-600"
                    >
                        {showPassword ? "Ocultar" : "Ver"}
                    </button>

                    <p className="text-xs text-red-600">{errors.password}</p>

                    {/* CHECKLIST */}
                    <ul className="text-xs mt-2 space-y-1">
                        <li
                            className={
                                passwordChecks.length(password)
                                    ? "text-green-600"
                                    : "text-red-600"
                            }
                        >
                            • 8 caracteres
                        </li>
                        <li
                            className={
                                passwordChecks.upper(password)
                                    ? "text-green-600"
                                    : "text-red-600"
                            }
                        >
                            • Una mayúscula
                        </li>
                        <li
                            className={
                                passwordChecks.number(password)
                                    ? "text-green-600"
                                    : "text-red-600"
                            }
                        >
                            • Un número
                        </li>
                        <li
                            className={
                                passwordChecks.special(password)
                                    ? "text-green-600"
                                    : "text-red-600"
                            }
                        >
                            • Un caracter especial
                        </li>
                    </ul>
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="flex flex-col w-full mt-4 relative">
                    <label className="text-[13px]">Confirmar contraseña</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={confirmpassword}
                        onChange={(e) =>
                            handleInput("confirmpassword", e.target.value)
                        }
                        title="Debe coincidir con la contraseña"
                        className={`text-[13px] py-2 border-b bg-transparent focus:outline-none ${
                            errors.confirmpassword
                                ? "border-red-500"
                                : "border-[#918EF4]"
                        }`}
                        placeholder="Repite tu contraseña"
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-2 top-8 text-xs text-blue-600"
                    >
                        {showPassword ? "Ocultar" : "Ver"}
                    </button>

                    <p className="text-xs text-red-600">
                        {errors.confirmpassword}
                    </p>
                </div>
                {/* SUCCESS MODAL */}
                {showSuccess && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                        <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center border border-gray-200 pointer-events-auto">
                            <h2 className="text-xl font-bold text-green-600">
                                ¡Cuenta creada!
                            </h2>
                            <p className="mt-2 text-gray-700">
                                Tu usuario ha sido registrado exitosamente.
                            </p>

                            <button
                                onClick={() => {
                                    setShowSuccess(false);
                                    navigate("/login");
                                }}
                                className="mt-4 bg-[#7B76F1] text-white px-6 py-2 rounded-full hover:brightness-110 transition"
                            >
                                Ir al login
                            </button>
                        </div>
                    </div>
                )}

                {/* SUBMIT */}
                <div className="flex justify-center mt-8">
                    <button
                        type="submit"
                        disabled={!isValid}
                        className={`bg-[#7B76F1] rounded-full text-white font-bold w-[153px] h-[56px]
              ${
                  isValid ? "opacity-100" : "opacity-40 cursor-not-allowed"
              } cursor-pointer`}
                    >
                        Registrarme
                    </button>
                </div>

                <p className="text-[13px] text-center mt-10 cursor-pointer">
                    ¿Ya tienes una cuenta?
                    <Link
                        to="/login"
                        className="text-[#1976D2] font-bold ml-1 inline-block"
                    >
                        ¡Inicia sesión ahora!
                    </Link>
                </p>
            </form>
        </div>
    );
}
