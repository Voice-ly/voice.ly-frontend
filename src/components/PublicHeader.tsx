import { Link, matchPath, useLocation } from "react-router";
import logo from "/logo.jpeg";

export default function PublicHeader() {
    const location = useLocation();
    const isRouteActive = (route: string) => {
        const match = matchPath(route, location.pathname);
        return match;
    };
    const routes = [
        { label: "Inicio", path: "/home" },
        { label: "Sobre nosotros", path: "/about" },
        { label: "Unirse a una reunión", path: "/join" },
        { label: "Ayuda", path: "/help" },
    ];
    return (
        <header className="w-full p-0 flex flex-col items-center sm:flex-row sm:justify-between sm:items-center">

            {/* ---------------- LOGO ---------------- */}
            <div className="flex items-center gap-4">
                <Link to="/home">
                    <img
                        src={logo}
                        alt="logo"
                        className="cursor-pointer w-[50px] h-[50px] sm:w-[100px] sm:h-[80px] transition-transform hover:scale-105"
                    />
                </Link>
            </div>

            {/* ---------------- MENÚ (CENTRADO EN PC) ---------------- */}
            <nav className="my-4 sm:my-0">
                <ul className="flex flex-row gap-4 sm:gap-10 text-center">
                    {routes.map((route, i) => (
                        <li key={i}>
                            <Link
                                to={route.path}
                                className={`text-xs sm:text-lg font-medium text-[#4A44ED] relative pb-1 transition-all duration-30 hover:text-[#2d27d8] after:content-['']
                                    after:block after:h-[3px] after:w-0 after:bg-[#4A44ED] after:rounded-full after:mt-[4px] after:transition-all after:duration-300 hover:after:w-full

                                    ${isRouteActive(route.path) ? "after:w-full after:bg-[#4A44ED]" : ""}
                                `}
                            >
                                {route.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* ---------------- BOTONES DERECHA ---------------- */}
            <div className="flex flex-col sm:flex-row sm:gap-3 w-full sm:w-auto mt-4 sm:mt-0 pr-2 ">

                <Link to="/register" className="w-full sm:w-auto">
                    <button className="
                        w-full sm:w-32 py-3 rounded-full 
                        bg-gradient-to-r from-[#7B76F1] to-[#4A44ED] 
                        text-white font-semibold text-xs sm:text-md
                        shadow-md
                        transition-all duration-300
                        hover:brightness-110 hover:shadow-[0_0_10px_#6b64ff]
                    ">
                        Registrarse
                    </button>
                </Link>

                <Link to="/login" className="w-full sm:w-auto mt-2 sm:mt-0">
                    <button className="
                        w-full sm:w-32 py-3 rounded-full 
                        bg-gradient-to-r from-[#7B76F1] to-[#4A44ED] 
                        text-white font-semibold text-xs sm:text-md
                        shadow-md
                        transition-all duration-300
                        hover:brightness-110 hover:shadow-[0_0_10px_#6b64ff]
                    ">
                        Iniciar sesión
                    </button>
                </Link>

            </div>
        </header>
    );
}