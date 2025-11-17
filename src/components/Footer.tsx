import { Link } from "react-router";
import logo from "/logo.jpeg";

export default function Footer() {
    const siteMap = [
        { label: "Inicio", path: "" },
        { label: "Sobre Nosotros", path: "" },
        { label: "Unirse a una reunión", path: "" },
        { label: "Crear reunión", path: "" },
        { label: "Registro", path: "" },
        { label: "Iniciar sesión", path: "" },
        { label: "Perfil", path: "" },
        { label: "Ayuda", path: "" },
    ];
    return (
        <footer>
            <div className="flex flex-row justify-between p-4 gap-2 w-full sm:px-12">
                <div className="flex flex-col w-28 sm:w-1/3 sm:flex-row">
                    <img
                        src={logo}
                        alt="logo"
                        className="w-[37px] h-[32px] sm:w-[103px] sm:h-[87px] mx-auto"
                    />
                    <p className="text-[6px] sm:text-[14px] text-[#4A44ED]">
                        Somos una solución tecnológica que facilita la
                        comunicación en tiempo real, promoviendo la colaboración
                        y la cercanía sin importar la distancia.
                    </p>
                </div>
                <div className="flex flex-col w-32 sm:w-1/3">
                    <h2 className="text-[#4A44ED] font-bold text-[6px] sm:text-[15px]">
                        Sitios de interés
                    </h2>
                    <div className="h-1 bg-[#1976D2] w-full"></div>
                    <nav>
                        <ul className="grid grid-flow-col grid-rows-4">
                            {siteMap.map((route, index) => (
                                <li key={index}>
                                    <Link
                                        to={route.path}
                                        className="text-[5px] sm:text-[9px] text-[#7B76F1] font-bold"
                                    >
                                        {route.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
                <div className="flex flex-col w-32 sm:w-1/3 sm:flex-row sm:justify-between gap-2">
                    <div className="mb-4 sm:w-1/2 sm:mb-0">
                        <h2 className="text-[#4A44ED] text-[6px] sm:text-[15px] font-bold">
                            Contacto
                        </h2>
                        <div className="h-1 bg-[#1976D2] w-full"></div>
                        <p className="text-[5px] text-[#7B76F1] sm:text-[9px]">
                            (406) 555-0120
                        </p>
                        <p className="text-[5px] text-[#7B76F1] sm:text-[9px]">
                            videoconferences@gmail.com
                        </p>
                    </div>
                    <div className="my-2 sm:w-1/2 sm:my-0">
                        <h2 className="text-[#4A44ED] text-[6px] font-bold sm:text-[15px]">
                            Manual de Usuario
                        </h2>
                        <div className="h-1 bg-[#1976D2] w-full"></div>
                        <p className="text-[5px] text-[#7B76F1] sm:text-[9px]">
                            Manual_usuario.pdf
                        </p>
                    </div>
                </div>
            </div>
            <h2 className="text-center text-[7px] text-[#4A44ED]">
                2025 <b>Voicely</b> . Todos los derechos reservados.
            </h2>
        </footer>
    );
}
