import { Link } from "react-router";
import logo from "/logo.jpeg";

export default function LoginPage() {
    return (
        <main className="flex flex-col mx-auto w-screen">
            <div>
                <img
                    src={logo}
                    alt="logo"
                    className="w-[99px] h-[77px] mx-auto"
                />
                <h1 className="text-2xl text-center font-bold">
                    Inicia Sesión
                </h1>
                <h1>(Botones Proveedores)</h1>
                <form method="post" className="w-full">
                    <div className="flex flex-col w-5/6 mx-auto">
                        <label htmlFor="email" className=" text-[9px]">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="text-[8px] py-2 border-b border-[#918EF4] focus:outline-none focus:border-blue-500 bg-transparent"
                            placeholder="johndoe@email.com"
                            required
                        />
                    </div>
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
                    <span className="flex justify-end">
                        <Link
                            to={"/forgot-password"}
                            className="text-[#7B76F1] text-[13px] mr-8 mt-2"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </span>
                    <span className="flex justify-center mt-6">
                        <button
                            type="submit"
                            className="bg-[#7B76F1] rounded-full text-white font-bold w-[153px] h-[56px] cursor-pointer"
                        >
                            Iniciar
                        </button>
                    </span>
                    <span className="flex justify-center mt-4"></span>
                    <p className="tex-[#424242] text-[13px] text-center">
                        ¿No tienes una cuenta?{" "}
                        <Link
                            to={"/register"}
                            className="text-[#1976D2] font-bold"
                        >
                            REGISTRATE AHORA!
                        </Link>
                    </p>
                </form>
            </div>
            <div className="bg-[#918EF4] invisible sm:visible">
                <img src={logo} alt="logo" />
            </div>
        </main>
    );
}
