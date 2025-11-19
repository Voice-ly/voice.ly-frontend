//import React from "react";
import "./styles/AboutUs.css";

export default function AboutUs() {
    return (
        <div className="about-us">
            <div className="about-us__container">
                <div className="about-us__grid">

                    {/* Left Section - Sobre Nosotros */}
                    <div className="about-us__left-section">
                        <h1 className="about-us__main-tittle">
                            Sobre Nosotros
                        </h1>

                        <div className="about-us__content">
                            <p className="about-us__paragraph">
                                En voicely creemos que la comunicación no tiene límites.
                                Nuestra plataforma de videoconferencias fue creada para
                                conectar personas, equipos y comunidades desde cualquier
                                lugar del mundo de forma simple, segura y accessible.
                            </p>

                            <p className="about-us__paragraph">
                                Ofrecemos un espacio intuitivo para crear, unirse y
                                gestionar reuniones en línea con herramientas integradas
                                de chat, audio, video y colaboración en tiempo real, ya sea
                                para clases, trabajo o encuentros personales, nuestra
                                meta es hacer que cada conversación cuente.
                            </p>
                        </div>
                    </div>

                    {/* Right Section - More Section */}
                    <div className="about-us__right-section">
                        {/* Background Image or Decorative Element */}
                        <div className="about-us__background-image">
                            <img src="/wallpaper-public.png" alt=""/>
                        </div>

                        <div className="about-us__info-blocks">
                            {/* Misión Block */}
                            <div className="about-us__block">
                                <h2 className="about-us__block-title">
                                    Nuestra Misión
                                </h2>
                                <p className="about-us__block-text">
                                    Facilitar la comunicación digital mediante una plataforma moderna y
                                    confiable que promueva la colaboración, productividad y cercanía
                                    humana.
                                </p>
                            </div>

                            {/* Visión Block */}
                            <div className="about-us__block">
                                <h2 className="about-us__block-title">
                                    Nuestra Visión
                                </h2>
                                <p className="about-us__block-text">
                                    Ser la solución preferida en videoconferencias en Latinoamérica,
                                    reconocida por su facilidad de uso, accesibilidad y compromiso con
                                    la privacidad de los usuarios.
                                </p>
                            </div>

                            {/* Equipo Block */}
                            <div className="about-us__block">
                                <h2 className="about-us__block-title">
                                    Nuestro Equipo
                                </h2>
                                <p className="about-us__block-text">
                                    Somos un grupo de desarrolladores apasionados por la tecnología y
                                    la innovación. Trabajamos con metodologías ágiles y diseño centrado
                                    en el usuario para ofrecer una experiencia fluida, funcional y
                                    moderna.
                                </p>
                            </div>

                            {/* Team Illustration - Placeholder for the image */}
                            <div className="about-us__image-container">
                                <div className="about-us__image-placeholder">
                                    <img src="/team.png" alt="Nuestro Equipo" className="about-us__image"/>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};