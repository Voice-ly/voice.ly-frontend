import React from "react";
import { Link } from "react-router";

/**
 * HomePage component
 *
 * This is the main landing page for Voicely. It includes:
 * - A full-screen background image
 * - Marketing text promoting real-time communication
 * - A call-to-action button leading to the registration page
 * - An illustration aligned with the product theme
 *
 * The layout is fully responsive, shifting from a centered column on mobile
 * to a two-column design on larger screens.
 *
 * @component
 * @returns {JSX.Element} The Voicely home/landing page.
 */

const HomePage: React.FC = () => {
   return (
    <div
      className=" w-full flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('/wallpaper-home.png')`,
      }}
    >
      <section
        className="
          w-full max-w-7xl mx-auto 
          px-6 sm:px-10 lg:px-14 
          py-14 
          flex flex-col md:flex-row 
          items-center justify-between 
          gap-12 
          text-white
        "
      >
        {/* --- TEXT --- */}
        <div className="flex flex-col items-center  text-center md:text-center space-y-6 w-full md:w-1/2">
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-lg">
            Comunícate <br />
            sin límites, donde <br />
            sea y cuando sea.
          </h1>

          <p className="text-lg sm:text-xl font-light leading-relaxed max-w-md drop-shadow-md">
            Con Voicely, la distancia desaparece: trabaja, aprende o conversa en
            tiempo real con calidad, confianza y cercanía.
          </p>

          <Link
            to="/register"
            className="
              bg-[#0A2342] hover:bg-[#0c2d55] 
              transition text-white font-medium 
              px-8 py-3 rounded-full shadow-lg
            "
          >
            Empezar
          </Link>
        </div>

        {/* --- IMAGE --- */}
        <div className="flex justify-center md:justify-end w-full md:w-1/2">
          <img
            src="/img1-home.png"
            alt="Voicely illustration"
            className="
              w-[75%] sm:w-[85%] md:w-[95%] 
              max-w-xl drop-shadow-xl 
              transition-transform duration-500 hover:scale-105
            "
          />
        </div>
      </section>
    </div>
  );
};

export default HomePage;