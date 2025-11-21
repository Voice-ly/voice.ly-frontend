import Logo from "/logo.png";
import { useNavigate } from "react-router";

/**
 * Join Meeting Page Component
 * 
 * This component renders the "Join Meeting" page, allowing users to join an existing meeting
 * by entering a meeting ID.
 * @returns the Join Meeting page
 */
export default function JoinMeeting() {
    const navigate = useNavigate();

    function tempJoinMeeting(e: React.MouseEvent) {
        e.preventDefault();
        navigate("/meeting");
    }

    return (
        <div className="flex flex-col lg:flex-row min-h-screen">

            {/* Left section - only desktop */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                {/* Background image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/wallpaper-home.png"
                        alt=""
                        className="w-full h-full object-cover"
                    />
                    {/* Overlay to secure legibility on case there's no image */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 to-purple-600"></div>
                </div>

                {/* Content over background */}
                <div className="relative z-10 flex flex-col items-center justify-center w-full p-8 lg:p-12 text-white text-center">
                    {/* Logo */}
                    <div className="mb-8">
                        <img
                            src={Logo}
                            alt="Voicely"
                            className="h-12 w-auto mx-auto"
                        />
                    </div>

                    {/* Illustration */}
                    <div className="mb-8 max-w-lg">
                        <img
                            src="/corporation-home.png"
                            alt="Personas en videollamada"
                            className="w-full h-auto"
                        />
                    </div>

                    {/* Text */}
                    <div className="max-w-md">
                        <h2 className="text-3xl font-bold mb-4 leading-tight">
                            Conéctate ahora con varias personas.
                        </h2>
                        <p className="text-base leading-relaxed opacity-90">
                            Implementa la conexión entre personas y organizaciones,
                            brindarles tecnología confiable al servicio de la colaboración.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right section - Join Meeting form */}
            <div className="w-full lg:w-1/2 bg-white min-h-screen flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-xl">

                    {/* Card Container */}
                    <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">

                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-500 to-teal-500 px-6 py-4">
                            <h1 className="text-white text-xl md:text-2xl font-bold">
                                Unirse a una Reunión
                            </h1>
                        </div>

                        {/* Body - Join Meeting Form */}
                        <div className="p-6 md:p-8">
                            <form className="space-y-6">

                                {/* Meeting ID Input */}
                                <div>
                                    <label
                                        htmlFor="meetingId"
                                        className="block text-gray-700 text-sm font-medium mb-2">
                                        ID de la Reunión
                                    </label>
                                    <input
                                        type="text"
                                        id="meetingId"
                                        placeholder="Introduce el ID de la reunión"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="pt-4">
                                    <button
                                        //type="submit"
                                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3.5 px-6 rounded-full text-base hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                                        onClick={tempJoinMeeting}
                                    >
                                        Unirse
                                    </button>
                                </div>
                            </form>

                            {/* Additional info */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <p className="text-sm text-gray-600 text-center">
                                    ¿No tienes un ID de reunión?{' '}
                                    <a 
                                        href="/dashboard"
                                        className="text-blue-600 font-semibold hover:text-indigo-600 hover:underline transition-colors"
                                    >
                                        Crea una nueva reunión
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}