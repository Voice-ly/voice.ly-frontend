import { Link, matchPath, useLocation } from "react-router";
import logo from "/logo.jpeg";

export default function PublicHeader() {
    const location = useLocation();

    const isRouteActive = (route: string) => {
        return matchPath(route, location.pathname);
    };

    const routes = [
        { label: "Inicio", path: "/home" },
        { label: "Sobre nosotros", path: "/about" },
        { label: "Unirse a una reunión", path: "/join" },
        { label: "Ayuda", path: "/help" },
    ];

        return (
            <header className="w-full p-2 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between
                ">

            {/* BOTONES - EN MOBILE QUEDAN ARRIBA Y CENTRADOS */}
            <div className="flex justify-center items-center gap-2 mb-4 sm:mb-0 sm:order-last">

                <Link to="/register">
                    <button className="
                        w-36 py-3 rounded-full
                        bg-gradient-to-r from-[#7B76F1] to-[#4A44ED]
                        text-white font-semibold text-sm sm:text-md
                        shadow-md transition-all duration-300
                        hover:brightness-110 hover:shadow-[0_0_10px_#6b64ff]
                    ">
                        Registrarse
                    </button>
                </Link>

                <Link to="/login">
                    <button className="
                        w-36 py-3 rounded-full
                        bg-gradient-to-r from-[#7B76F1] to-[#4A44ED]
                        text-white font-semibold text-sm sm:text-md
                        shadow-md transition-all duration-300
                        hover:brightness-110 hover:shadow-[0_0_10px_#6b64ff]
                    ">
                        Iniciar sesión
                    </button>
                </Link>

            </div>

            {/* LOGO + MENÚ → EN MOBILE VAN ABAJO Y A LA DERECHA */}
            <div className="flex items-center gap-6 sm:gap-12 justify-end w-full">

                {/* LOGO */}
                <Link to="/home">
                    <img
                        src={logo}
                        alt="logo"
                        className="cursor-pointer w-[55px] h-[55px] sm:w-[100px] sm:h-[80px] transition-transform hover:scale-105"
                    />
                </Link>

                {/* MENÚ */}
                <nav className="flex-1 flex sm:justify-center justify-center">
                    <ul className="flex flex-row gap-4 sm:gap-10 text-center">
                        {routes.map((route, i) => (
                            <li key={i}>
                                <Link
                                    to={route.path}
                                    className={`
                                        text-xs sm:text-lg font-medium text-[#4A44ED]
                                        relative pb-1 transition-all duration-300
                                        hover:text-[#2d27d8]
                                        after:content-['']
                                        after:block after:h-[3px] after:w-0
                                        after:bg-[#4A44ED] after:rounded-full after:mt-[4px]
                                        after:transition-all after:duration-300
                                        hover:after:w-full
                                        ${isRouteActive(route.path) ? "after:w-full" : ""}
                                    `}
                                >
                                    {route.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

            </div>

        </header>

    );
}