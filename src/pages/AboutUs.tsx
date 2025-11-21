//import React from "react";

/**
 * About Us Page Component
 * 
 * This component renders the "About Us" page for the application. It includes sections
 * for the company's mission, vision, and team, along with relevant illustrations.
 * 
 * @returns the About Us page
 */
export default function AboutUs() {
    return (
        <div className=" bg-white">
            <div className="container mx-auto px-4 py-2 lg:py-1">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 lg:gap-1">

                    {/* Left Section - Sobre Nosotros */}
                    <div className="flex flex-col justify-center px-1 lg:px-8">
                        <h1 className="text-4xl lg:text-5xl font-bold text-purple-600 mb-8 text-center ">
                            Sobre Nosotros
                        </h1>

                        <div className="space-y-6 text-center lg:text-center">
                            <p className="text-lg text-indigo-600 leading-relaxed">
                                En voicely creemos que la comunicación no tiene límites.
                                Nuestra plataforma de videoconferencias fue creada para
                                conectar personas, equipos y comunidades desde cualquier
                                lugar del mundo de forma simple, segura y accessible.
                            </p>

                            <p className="text-lg text-indigo-600 leading-relaxed">
                                Ofrecemos un espacio intuitivo para crear, unirse y
                                gestionar reuniones en línea con herramientas integradas
                                de chat, audio, video y colaboración en tiempo real, ya sea
                                para clases, trabajo o encuentros personales, nuestra
                                meta es hacer que cada conversación cuente.
                            </p>
                        </div>
                    </div>

                    {/* Right Section - More Section */}
                    <div className="relative bg-gradient-to-br from-indigo-600 to-purple-1500 rounded-lg lg:rounded-none p-8 lg:p-12 overflow-hidden">
                        {/* Background Image or Decorative Element */}
                        <div className="absolute top-0 left-0 w-full h-full z-9">
                            <img src="/wallpaper-public.png" alt="" className="w-full h-full object-cover object-center" />
                        </div>

                        <div className="relative z-10 space-y-8 text-white">
                            {/* Misión Block */}
                            <div>
                                <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                                    Nuestra Misión
                                </h2>
                                <p className="text-base lg:text-lg leading-relaxed opacity-95">
                                    Facilitar la comunicación digital mediante una plataforma moderna y
                                    confiable que promueva la colaboración, productividad y cercanía
                                    humana.
                                </p>
                            </div>

                            {/* Visión Block */}
                            <div>
                                <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                                    Nuestra Visión
                                </h2>
                                <p className="text-base lg:text-lg leading-relaxed opacity-95">
                                    Ser la solución preferida en videoconferencias en Latinoamérica,
                                    reconocida por su facilidad de uso, accesibilidad y compromiso con
                                    la privacidad de los usuarios.
                                </p>
                            </div>

                            {/* Equipo Block */}
                            <div>
                                <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                                    Nuestro Equipo
                                </h2>
                                <p className="text-base lg:text-lg leading-relaxed opacity-95">
                                    Somos un grupo de desarrolladores apasionados por la tecnología y
                                    la innovación. Trabajamos con metodologías ágiles y diseño centrado
                                    en el usuario para ofrecer una experiencia fluida, funcional y
                                    moderna.
                                </p>
                            </div>

                            {/* Team Illustration - Placeholder for the image */}
                            <div className="mt-8 flex justify-center relative z-10">
                                <img src="/team.png" alt="Nuestro Equipo" className="w-full max-w-md h-auto"/>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};