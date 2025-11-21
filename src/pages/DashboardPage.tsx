//import React from "react";
import { useNavigate } from "react-router";
import Dashimage from "/Dashimage.png"; 
export default function DashboardPage() {

    const navigator = useNavigate();

    // -------------------------------
    // Aquí irá la conexión con backend
    // Ejemplo:
    // const { user } = useAuth();
    // const username = user?.name;
    // Por ahora dejamos un nombre estático.
    // -------------------------------
    //const username = "Mehrab";

    
    function joinMeeting() {
        navigator("/meeting");
    }
        

    return (
        <div className="w-full px-6 md:px-14 lg:px-20 py-10">

            {/* --- TÍTULO BIENVENIDA --- */}
            <h1 className="text-[28px] md:text-[34px] font-bold text-center text-[#304FFE] mb-10">
                Bienvenido 👋
            </h1>

            {/* --- CONTENEDOR PRINCIPAL (Izquierda: texto+img | Derecha: formularios) --- */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                {/* ---------------- LEFT: TEXTO + IMAGEN ---------------- */}
                <div className="flex flex-col items-center">
                    <h2 className="text-[28px] md:text-[32px] font-bold text-[#304FFE] text-center mb-6 leading-tight">
                        Conéctate ahora con varias <br /> personas.
                    </h2>

                    <img
                        src={Dashimage}
                        alt="Dashboard illustration"
                        className="w-[350px] md:w-[450px] lg:w-[500px]"
                    />
                </div>

                {/* ---------------- RIGHT: FORMULARIOS ---------------- */}
                <div className="w-full max-w-lg mx-auto flex flex-col gap-8">

                    {/* --- FORMULARIO: UNIRSE CON ID --- */}
                    <div className="bg-white p-6 rounded-xl shadow-md border">
                        <label className="block text-sm font-medium text-[#304FFE]">
                            Ingresa inmediatamente con la ID de la reunión
                        </label>

                        <input
                            type="text"
                            placeholder="Introduce el ID"
                            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#304FFE] transition"
                        />
                        <button onClick={joinMeeting}
                            className="w-full mt-4 py-2 bg-[#304FFE] rounded-full text-white font-semibold hover:bg-[#1E40FF] transition"
                        >
                            Unirse
                        </button>
                    </div>

                    {/* --- FORMULARIO: CREAR REUNIÓN --- */}
                    <div className="bg-white rounded-xl shadow-md border overflow-hidden">

                        {/* HEADER GRADIENTE */}
                        <div className="px-6 py-3 bg-gradient-to-r from-[#304FFE] to-[#5E6BFF]">
                            <h3 className="text-white font-semibold text-lg">
                                Crear una reunión
                            </h3>
                        </div>

                        {/* CUERPO DEL FORM */}
                        <div className="px-6 py-6">

                            {/* TÍTULO */}
                            <label className="block text-sm font-medium text-[#304FFE]">
                                Título de la reunión
                            </label>

                            <input
                                type="text"
                                placeholder="Introduce un título"
                                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#304FFE]"
                            />

                            {/* DESCRIPCIÓN */}
                            <label className="block text-sm font-medium text-[#304FFE] mt-5">
                                Descripción
                            </label>

                            <textarea
                                placeholder="Escribe una descripción (opcional)"
                                className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#304FFE] resize-none"
                                rows={5}
                            ></textarea>

                            {/* BOTÓN CREAR */}
                            <button onClick={joinMeeting}
                                className="w-full mt-6 py-3 bg-[#304FFE] text-white font-semibold rounded-full hover:bg-[#1E40FF] transition"
                            >
                                Crear
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
