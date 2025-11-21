import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../lib/AuthService";
import type { ResetPasswordRequest } from "../types/User";
import Logo from "/logo.jpeg";

/**
 *  Restore Password Page Component
 * 
 * This component renders the "Restore Password" page, allowing users to reset their password
 * using a token sent to their email.
 * 
 * @returns the Restore Password page
 */
export default function ForgotPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // States
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Extract token from URL
    const token = searchParams.get("token") || "";

    /**
     * useEffect Hook to verify the token on component mount
     * and set the validity state accordingly.
     */
    useEffect(() => {
        // Verify token existence on URL
        if (!token) {
            setIsValidToken(false);
            setError("Token inválido o ausente.");
            return;
        }

        // If there is a token, we assume it's valid until back-end answers
        setIsValidToken(true);
    }, [token]);

    /**
     *  Validate password complexity
     * 
     *  @param pass: string - The password to validate 
     *  @returns boolean - True if valid, false otherwise
     */
    const validatePassword = (pass: string): boolean => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
        return regex.test(pass);
    };

    /**
     *  Handle form submission for password reset
     * 
     *  @param e: React.FormEvent - The form submission event 
     *  @returns void
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        //Validations
        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        if (!validatePassword(password)) {
            setError("La contraseña debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial (@$!%*?&).");
            return;
        }

        if (!token) {
            setError("Token no válido.");
            return;
        }

        setLoading(true);

        try {
            const request: ResetPasswordRequest = {
                password: password
            };

            const response = await resetPassword(request);

            if (response.ok) {
                setSuccess(true);

                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            } else {
                const data = await response.json();
                setError(data.message || "Hubo un error al cambiar tu contraseña.");
            }
        } catch (error: any) {
            console.error("Error al cambiar contraseña:", error);
            setError("Hubo un error al cambiar tu contraseña.");
        } finally {
            setLoading(false);
        }
    }

    /**
     * Render invalid token message
     */
    if (isValidToken === false) {
        return (
            <main className="flex flex-col w-full max-w-md mx-auto px-4 text-center">
                <div className="lg:hidden mb-10">
                    <img src={Logo} alt="logo" className="w-[99px] h-[77px] mx-auto" />
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-red-700 mb-2">
                        Enlace Inválido
                    </h2>
                    <p className="text-red-600 mb-4">
                        {error || "El enlace de recuperación es inválido o ha expirado."}
                    </p>
                    <Link 
                        to="/forgot-password"
                        className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-colors"
                    >
                        Solicitar nuevo enlace
                    </Link>
                </div>
            </main>
        );
    }

    /**
     * Render success message
     */
    if (success) {
        return (
            <main className="flex flex-col w-full max-w-md mx-auto px-4 text-center">
                <div className="lg:hidden mb-10">
                    <img src={Logo} alt="logo" className="w-[99px] h-[77px] mx-auto" />
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                        ✓
                    </div>
                    <h2 className="text-xl font-semibold text-green-700 mb-2">
                        ¡Contraseña Cambiada!
                    </h2>
                    <p className="text-green-600">
                        Tu contraseña ha sido actualizada exitosamente. Serás redirigido al inicio de sesión...
                    </p>
                </div>
            </main>
        );
    }

    /**
     * Render the password reset form
     */
    return (
        <main className="flex flex-col w-full max-w-md mx-auto px-4">
            {/* Logo solo visible en móvil */}
            <div className="lg:hidden mb-10">
                <img
                    src={Logo}
                    alt="logo"
                    className="w-[99px] h-[77px] mx-auto"
                />
            </div>

            <h1 className="text-2xl md:text-3xl text-center font-semibold text-gray-900 mb-10">
                Recuperar Contraseña
            </h1>

            { error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="w-full">
                {/* Password Field */}
                <div className="flex flex-col w-5/6 mx-auto">
                    <label htmlFor="email" className=" text-[9px]">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="text-[8px] py-2 border-b border-[#918EF4] focus:outline-none focus:border-blue-500 bg-transparent"
                        placeholder="Digita tu Contraseña"
                        required
                        minLength={8}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Debe contener: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial
                    </p>
                </div>

                {/* Confirm Password Field */}
                <div className="flex flex-col w-5/6 mx-auto">
                    <label htmlFor="email" className=" text-[9px]">
                        Confirmar Contraseña
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="text-[8px] py-2 border-b border-[#918EF4] focus:outline-none focus:border-blue-500 bg-transparent"
                        placeholder="Confirma tu Contraseña"
                        required
                        minLength={8}
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-center mb-10">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-white font-semibold px-10 py-3.5 text-sm tracking-wide uppercase hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? "CAMBIANDO..." : "CAMBIAR"}
                    </button>
                </div>

                {/* Links */}
                <div className="flex flex-col gap-3 text-center">
                    <p className="text-gray-600 text-sm md:text-base">
                        ¿No tienes una cuenta?{" "}
                        <Link
                            to="/register"
                            className="text-blue-600 font-semibold uppercase text-sm tracking-wide hover:text-indigo-600 hover:underline transition-colors"
                        >
                            REGÍSTRATE AHORA!
                        </Link>
                    </p>

                    <p className="text-gray-600 text-sm md:text-base">
                        ¿Ya tienes cuenta?{" "}
                        <Link
                            to="/login"
                            className="text-blue-600 font-semibold uppercase text-sm tracking-wide hover:text-indigo-600 hover:underline transition-colors"
                        >
                            INICIA SESIÓN AHORA!
                        </Link>
                    </p>
                </div>
            </form>
        </main>
    );
}