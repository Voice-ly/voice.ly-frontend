
import { Link } from "react-router-dom";
import Logo from "/logo.jpeg";

export default function ForgotPassword() {
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

            <form method="post" className="w-full">
                {/* Email Field */}
                <div className="flex flex-col w-full mb-7">
                    <label htmlFor="email" className="text-sm text-gray-700 mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        className="text-base py-3 px-4 border-b border-gray-300 focus:outline-none focus:border-indigo-600 bg-transparent transition-colors"
                        placeholder="Ingresa tu email"
                        required
                    />
                </div>

                {/* Confirmar Email Field */}
                <div className="flex flex-col w-full mb-10">
                    <label htmlFor="confirmEmail" className="text-sm text-gray-700 mb-2">
                        Confirmar Email
                    </label>
                    <input
                        type="email"
                        name="confirmEmail"
                        className="text-base py-3 px-4 border-b border-gray-300 focus:outline-none focus:border-indigo-600 bg-transparent transition-colors"
                        placeholder="Confirma tu email"
                        required
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-center mb-10">
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-white font-semibold px-10 py-3.5 text-sm tracking-wide uppercase hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                    >
                        ENVIAR
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