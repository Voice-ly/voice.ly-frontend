
import { Link, useNavigate } from "react-router";
import logo from "/logo.jpeg";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { login, loginWithFacebook, loginWithGoogle } from "../lib/AuthService";
import type { UserSigninForm } from "../types/User";
import {
    FacebookLoginButton,
    GoogleLoginButton,
} from "../components/AuthButtons";
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

    /**
     * React state holding the login form fields.
     * @type {[UserSigninForm, Function]}
     */
    const [form, setForm] = useState<UserSigninForm>(initialForm);

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
        try {
            const res = await login(form);
            if (!res.ok) {
                throw new Error(String(res.status));
            }
            navigate("/dashboard");
        } catch (e) {
            console.log("Error " + e);
        } finally {
            console.log("Exito");
        }
    };


    return (
        <div className="py-0 sm:py-49 h-full">
            
            <img src={logo} alt="logo" className="w-[99px] h-[77px] mx-auto" />
            <h1 className="text-3xl text-center font-bold">Inicia Sesión</h1>
            <div className="flex gap-3 justify-center my-4">
                <GoogleLoginButton submit={() => loginWithGoogle(navigate)}/>
                <FacebookLoginButton submit={()=>loginWithFacebook(navigate)} />
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
                <div className="flex flex-col w-5/6 mx-auto mt-3">
                    <label className="text-[9px] sm:text-[13px]">
                        Contraseña
                    </label>

                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className="text-[8px] sm:text-[13px] py-2 border-b 
                        border-[#918EF4] focus:outline-none focus:border-blue-500 
                        bg-transparent"
                        placeholder="Digita tu Contraseña"
                        required
                    />
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
