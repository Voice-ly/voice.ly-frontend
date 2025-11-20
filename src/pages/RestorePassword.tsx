
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
                {/* Password Field */}
                <div className="flex flex-col w-5/6 mx-auto">
                    <label htmlFor="email" className=" text-[9px]">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        name="password"
                        className="text-[8px] py-2 border-b border-[#918EF4] focus:outline-none focus:border-blue-500 bg-transparent"
                        placeholder="Digita tu Contraseña"
                        required
                        minLength={8}
                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$"
                        title="Debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial (@$!%*?&)"
                    />
                </div>

                {/* Confirm Password Field */}
                <div className="flex flex-col w-5/6 mx-auto">
                    <label htmlFor="email" className=" text-[9px]">
                        Confirmar Contraseña
                    </label>
                    <input
                        type="password"
                        name="confirmPassword"
                        className="text-[8px] py-2 border-b border-[#918EF4] focus:outline-none focus:border-blue-500 bg-transparent"
                        placeholder="Digita tu Contraseña"
                        required
                        minLength={8}
                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$"
                        title="Debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial (@$!%*?&)"
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-center mb-10">
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-white font-semibold px-10 py-3.5 text-sm tracking-wide uppercase hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                    >
                        CAMBIAR
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