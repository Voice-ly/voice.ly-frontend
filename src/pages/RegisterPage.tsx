import { Link } from "react-router";
import logo from "/logo.jpeg";
import { useState } from "react";

export default function RegisterPage() {

    const [isValid, setIsValid] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(false);

const handleChange = () => {
    const form = document.querySelector("form");

    const pass = form?.password.value || "";
    const confirm = form?.confirmPassword.value || "";

    const match = pass === confirm && pass.length >= 8;

    setPasswordsMatch(match);
    setIsValid(form ? form.checkValidity() && match : false);
};




return (
        <main className="w-screen  flex flex-col sm:flex-row bg-cover bg-center"
            style={{ backgroundImage: "url('/wallpaper-public.png')" }}
        >
            {/* LEFT SIDE (IMAGE + TEXT) - HIDDEN IN MOBILE */}
            <section className="hidden sm:flex w-1/2 flex-col justify-center px-10">
                <img
                    src="/meeting.png"
                    alt="Voicely meeting"
                    className="rounded-3xl shadow-xl w-[90%] mx-auto"
                />

                <h2 className="text-white text-3xl font-bold mt-10 text-center drop-shadow-lg">
                    Habla, comparte y colabora en tiempo real.
                </h2>

                <p className="text-white text-base opacity-80 text-center max-w-md mx-auto mt-4 drop-shadow-md">
                    En Voicely conectamos personas, ideas y equipos desde cualquier
                    lugar del mundo, brindando comunicación fluida, segura y
                    cercana en un solo clic.
                </p>
            </section>

            {/* RIGHT SIDE - FORM */}
            <section className="w-full sm:w-1/2 bg-white min-h-screen flex flex-col justify-center py-10 px-6">

                {/* LOGO */}
                <img
                    src={logo}
                    alt="logo"
                    className="w-[99px] h-[77px] mx-auto"
                />

                <h1 className="text-3xl text-center font-bold mt-2">
                    Registrate
                </h1>

                <h1 className="text-center mt-3">(Botones Proveedores)</h1>

                <form method="post" className="w-full mt-6" onChange={handleChange}>
                    {/* NAME */}
                    <div className="flex flex-col w-5/6 mx-auto">
                        <label className="text-[13px]">Nombres</label>
                        <input
                            type="text"
                            name="firstName"
                            required
                            minLength={2}
                            className="text-[13px] py-2 border-b border-[#918EF4] bg-transparent focus:outline-none"
                            placeholder="Juan"
                        />
                    </div>

                    {/* LAST NAME */}
                    <div className="flex flex-col w-5/6 mx-auto mt-4">
                        <label className="text-[13px]">Apellidos</label>
                        <input
                            type="text"
                            name="lastName"
                            required
                            minLength={2}
                            className="text-[13px] py-2 border-b border-[#918EF4] bg-transparent focus:outline-none"
                            placeholder="Guzman"
                        />
                    </div>

                    {/* AGE */}
                    <div className="flex flex-col w-5/6 mx-auto mt-4">
                        <label className="text-[13px]">Edad</label>
                        <input
                            type="number"
                            name="age"
                            required
                            min={10}
                            max={120}
                            className="text-[13px] py-2 border-b border-[#918EF4] bg-transparent focus:outline-none"
                            placeholder="30"
                        />
                    </div>

                    {/* EMAIL */}
                    <div className="flex flex-col w-5/6 mx-auto mt-4">
                        <label className="text-[13px]">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="text-[13px] py-2 border-b border-[#918EF4] bg-transparent focus:outline-none"
                            placeholder="johndoe@email.com"
                        />
                    </div>
                    {/*  CAMBIO: Bloque de contraseña con botón mostrar/ocultar */}
                <div className="relative">
                <label
                    htmlFor="password"
                    className="font-medium text-black-200 block mb-1"
                ></label>
                    {/* PASSWORD */}
                    <div className="flex flex-col w-5/6 mx-auto mt-4">
                        <label className="text-[13px]">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            required
                            minLength={8}
                            onChange={handleChange}
                            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$"
                            title="Debe contener: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial"
                            className="text-[13px] py-2 border-b border-[#918EF4] bg-transparent focus:outline-none"
                            placeholder="Digita tu Contraseña"
                        />
                    </div>
                </div>
                    {/* CONFIRM PASSWORD */}
                    <div className="flex flex-col w-5/6 mx-auto mt-4">
                        <label className="text-[13px]">Confirmar Contraseña</label>
                        <input
                        type="password"
                        name="confirmPassword"
                        required
                        minLength={8}
                        onChange={handleChange}
                        className={`text-[13px] py-2 border-b bg-transparent focus:outline-none
                        ${passwordsMatch ? "border-[#918EF4]" : "border-red-500"}
                        `}
                        placeholder="Digita tu Contraseña"
                    />
                    </div>

                    {/* SUBMIT */}
                    <span className="flex justify-center mt-8">
                        <button
                        type="submit"
                        disabled={!isValid}
                        className={`bg-[#7B76F1] rounded-full text-white font-bold w-[153px] h-[56px] 
                            ${isValid ? "opacity-100" : "opacity-40 cursor-not-allowed"}`}
                    >
                        REGISTRARME
                    </button>

                    </span>

                    {/* FOOTER */}
                    <p className="tex-[#424242] text-[13px] text-center mt-10">
                        ¿Ya tienes una cuenta?{" "}
                        <Link to="/login" className="text-[#1976D2] font-bold mt-1 inline-block">
                            INICIA SESIÓN AHORA!
                        </Link>
                    </p>
                </form>
            </section>
        </main>
    );
}
