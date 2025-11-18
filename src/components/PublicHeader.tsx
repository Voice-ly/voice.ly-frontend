import { Link } from "react-router";
import logo from "/logo.jpeg";

export default function PublicHeader() {
    const routes = [
        { label: "Inicio", path: "home" },
        { label: "Sobre nosotros", path: "" },
        { label: "Unirse a una reunión", path: "" },
        { label: "Ayuda", path: "" },
    ];
    return (
        <header className="flex flex-col w-full p-2 sm:flex-row-reverse sm:justify-between">
            <div className="flex justify-end gap-2 sm:gap-2">
                <Link to={"/register"}>
                    <button className="bg-linear-to-r from-[#7B76F1] to-[#4A44ED] w-28 sm:w-36 p-4 rounded-full text-white font-semibold text-xs sm:my-6 sm:text-base cursor-pointer">
                        Registrarse
                    </button>
                </Link>
                <Link to={"/login"}>
                    <button className="bg-linear-to-r from-[#7B76F1] to-[#4A44ED] p-4 w-28 sm:w-36 rounded-full text-white font-semibold text-xs sm:my-6 cursor-pointer sm:text-base">
                        Iniciar sesión
                    </button>
                </Link>
            </div>
            <div className="flex flex-row">
                <Link to={"/"}>
                    <img
                        src={logo}
                        className="cursor-pointer w-[53px] h-[44px] sm:w-[103px] sm:h-[87px]"
                        alt="logo"
                    />
                </Link>
                <nav className="sm:mx-52">
                    <ul className="flex flex-row ml-2 my-2 sm:my-6 content-center gap-2">
                        {routes.map((route, index) => (
                            <li key={index}>
                                <Link
                                    to={route.path}
                                    className="cursor-pointer text-xs text-[#4A44ED] sm:text-lg sm:mx-2"
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
