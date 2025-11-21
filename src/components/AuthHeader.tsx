import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import minilogo from "/minilogo.png";

export default function AuthHeader() {
    const navigate = useNavigate()
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    function logout() {
        navigate("/login")
    }

    return (
        <header className="relative w-full bg-[#5568FE] text-white py-3 px-4 flex items-center justify-between shadow-md">

            {/* --- LOGO A LA IZQUIERDA --- */}
            <div className="flex items-center gap-2">
                <img src={minilogo} className="h-10" />
                <span className="font-semibold text-lg"></span>
            </div>

            {/* --- CONTROLES DERECHA (¿? + Perfil) --- */}
            <div className="flex items-center gap-4">

                {/* --- SIGNO DE PREGUNTA --- */}
                <Link
                    to="/help"
                    className="text-2xl hover:bg-white/20 rounded-full px-2 py-1 transition"
                >
                    ?
                </Link>

                {/* --- BOTÓN PERFIL --- */}
                <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="p-2 hover:bg-white/20 rounded-full transition text-xl px-2 py-1 overflow-hidden animate-fade-in"
                >
                    👤
                </button>

                {/* --- DROPDOWN PERFIL --- */}
                {isProfileOpen && (
                    <div className="absolute right-4 top-14 bg-white text-gray-900 w-44 rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden animate-fade-in">
                        
                        <Link
                            to="/profile"
                            className="block px-4 py-3 text-sm font-medium hover:bg-gray-100 transition"
                            onClick={() => setIsProfileOpen(false)}
                        >
                            ⭐ Mi perfil
                        </Link>

                        <button
                            className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-100 transition"
                            onClick={() => {
                                setIsProfileOpen(false);
                                logout()
                            }}
                        >
                            🔒 Cerrar sesión
                        </button>
                    </div>
                )}
            </div>

            {/* --- BOTÓN MENÚ (ABAJO DEL BORDE AZUL) --- */}
            <button
                onClick={() => setIsMenuOpen(true)}
                className="absolute left-4 -bottom-14 text-[#5568FE] bg-white p-2 rounded-full shadow-md border border-gray-200 hover:bg-[#eef0ff] transition text-xl"
            >
                ☰
            </button>

            {/* --- MENÚ LATERAL (NO SOBREPASA EL BORDE AZUL) --- */}
            <aside
                className={`fixed top-[64px] left-0 bottom-0  w-60 bg-white text-[#5568FE] border-r shadow-xl 
                transform transition-transform duration-300 z-50 
                ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
                >
                <div className="px-5 py-4 border-b">
                    <span className="text-xl text-center font-bold text-[#5568FE]">Menu</span>
                </div>

                <nav className="flex flex-col px-4 py-6 gap-4">
                    {[
                        { name: "INICIO", path: "/home" },
                        { name: "REUNIONES", path: "/meetings" },
                        { name: "NOSOTROS", path: "/about" },
                        { name: "AYUDA", path: "/help" },
                    ].map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="w-full text-center py-2 border border-[#5568FE] rounded-full hover:bg-[#5568FE] hover:text-white font-medium shadow-sm transition"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Botón cerrar */}
                <button
                    onClick={() => setIsMenuOpen(false)}
                    className="absolute top-4 right-4 text-2xl text-[#5568FE] hover:opacity-70"
                >
                    ✕
                </button>
            </aside>
        </header>
    );
}
