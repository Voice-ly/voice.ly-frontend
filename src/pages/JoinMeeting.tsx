import React from "react";
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
    const [meetingId, setMeetingId] = React.useState("");

    function tempJoinMeeting(e: React.MouseEvent) {
        e.preventDefault();
        if (meetingId.trim()) {
            navigate(`/meeting/${meetingId}`);
        }
    }

    return (
        <div className="w-full max-w-xl sm:py-50">

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
                                value={meetingId}
                                onChange={(e) => setMeetingId(e.target.value)}
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
                                href="/login"
                                className="text-blue-600 font-semibold hover:text-indigo-600 hover:underline transition-colors"
                            >
                                Crea una nueva reunión
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}