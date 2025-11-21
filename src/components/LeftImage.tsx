/**
 * RightImage Component
 *
 * Displays the right-side visual section of the authentication pages.
 * This section is only visible on screens `sm` and above.
 *
 * It includes:
 * - A full-size background image
 * - The Voicely mini logo
 * - A meeting illustration
 * - A title and descriptive text
 *
 * This component is typically paired with a form on the left side to create a split layout.
 *
 * @component
 * @returns {JSX.Element} The styled right-side image section.
 */
export default function RightImage() {
  return (
    <section className="hidden sm:flex w-1/2 relative items-center justify-center overflow-hidden">

      {/* Background image */}
      <img
        src="/wallpaper-public.png"
        alt="background"
        className="absolute inset-0 w-full h-full object-cover brightness-76"
      />

      {/* Content */}
      <div className="relative z-0 px-0 text-center max-w-md ">
         {/* Voicely mini logo */}
         <img
            src="/minilogo.png"
            alt="Voicely minilogo"
            className=" shadow-1xl mb-15 w-50 mx-auto"
            >
        </img> 
        {/* Meeting illustration, title, and description */}
        <img
          src="/meeting.png"
          alt="Voicely meeting"
          className="rounded-3xl shadow-2xl w-full mb-4"
        />
        <h2 className="text-white text-3xl font-bold drop-shadow-lg mb-9">
          Habla, comparte y colabora en tiempo real.
        </h2>
        <p className="text-white text-base opacity-90 mt-4 drop-shadow-md">
          En Voicely conectamos personas, ideas y equipos desde cualquier lugar del mundo.
        </p>
      </div>

    </section>
  );
}
