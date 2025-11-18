export default function RightImage() {
  return (
    <section className="hidden sm:flex w-1/2  relative items-center justify-center overflow-hidden">

      {/* Fondo */}
      <img
        src="/wallpaper-public.png"
        alt="background"
        className="absolute inset-0 w-full h-full object-cover brightness-75"
      />

     
      {/* Contenido */}
      <div className="relative z-3 px-3 text-center max-w-md">
        <img
          src="/meeting.png"
          alt="Voicely meeting"
          className="rounded-3xl shadow-2xl w-full mb-1"
        />
        <h2 className="text-white text-3xl font-bold drop-shadow-lg">
          Habla, comparte y colabora en tiempo real.
        </h2>
        <p className="text-white text-base opacity-90 mt-4 drop-shadow-md">
          En Voicely conectamos personas, ideas y equipos desde cualquier lugar del mundo.
        </p>
      </div>

    </section>
  );
}
