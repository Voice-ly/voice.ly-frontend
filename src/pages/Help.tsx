/**
 * Inerface for FAQ items
 * @interface FAQItem
 */
interface FAQItem {
    question: string;
    answer: string;
}

/**
 * Help Center Page Component
 * 
 * This component renders the Help Center page, which includes frequently asked questions (FAQs)
 * about account management and meetings.
 * 
 * @returns the Help Center page
 */
const HelpCenter: React.FC = () => {

    /**
     * Account FAQs
     * @type {FAQItem[]} : Array of frequently asked questions about account management
     */
    const accountFAQs: FAQItem[] = [
        {
            question: '¿Cómo creo una cuenta?',
            answer: 'Haz clic en "Registrarse" en el menú principal, completa tus datos y acepta los términos. También puedes registrarte con Google o Facebook.'
        },
        {
            question: 'Olvidé mi contraseña, ¿qué hago?',
            answer: 'En la pantalla de inicio de sesión selecciona "¿Olvidaste tu contraseña?" e ingresa tu correo. Te enviaremos un enlace para recuperarla.'
        },
        {
            question: '¿Puedo cambiar mis datos personales?',
            answer: 'Sí. En tu Perfil de usuario puedes editar tu nombre, correo, edad o contraseña y guardar los cambios.'
        }
    ];

    /**
     * Meeting FAQs
     * @type {FAQItem[]} : Array of frequently asked questions about meetings
     */
    const meetingFAQs: FAQItem[] = [
        {
            question: '¿Cómo creo una reunión?',
            answer: 'Desde el menú selecciona "Crear reunión", asigna un nombre o tema y presiona "Crear". Obtendrás un enlace o ID único para compartir.'
        },
        {
            question: '¿Cómo me uno a una reunión?',
            answer: 'En la opción "Unirse a reunión", ingresa el ID o enlace que te compartieron y haz click en "Unirse".'
        },
        {
            question: '¿Cuántas personas pueden participar?',
            answer: 'La plataforma admite entre 2 y 10 usuarios por videollamada, con calidad optimizada para una conexión estable.'
        },
        {
            question: '¿Quién puede unirse a mis reuniones?',
            answer: 'Solo las personas que tengan tu ID o enlace de invitación podrán ingresar.'
        },
        {
            question: '¿Dónde puedo reportar un problema o enviar sugerencias?',
            answer: 'Puedes escribirnos a través del formulario de contacto en el pie de página o al correo de soporte: videoconferences@gmail.com'
        }
    ];

    return (
        <div className=" bg-white py-4 md:py-8 lg:py-8">
            <div className="max-w-6xl mx-auto px-4 md:px-8">

                {/* Header Section */}
                <div className="mb-8 lg:mb-12">
                    <h1 className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white text-2xl md:text-3xl lg:text-4xl font-bold text-center py-6 md:py-8 px-8 md:px-12 rounded-xl md:rounded-2xl">
                        Centro de Ayuda - Preguntas Frecuentes
                    </h1>

                </div>
                
                {/* Content */}
                <div className="space-y-8 lg:space-y-12">

                    {/* Account FAQs */}
                    <section className="bg-white border-2 border-purple-600 rounded-none md:rounded-xl p-6 md:p-8 lg:p-10">
                        <h2 className="text-indigo-700 text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8">
                            Cuenta y acceso
                        </h2>

                        <div className="space-y-6">
                            {accountFAQs.map((faq, index) => (
                                <div key={index} 
                                    className={`pb-4 ${index !== accountFAQs.length - 1 ? 'border-b border-purple-200' : ''}`}
                                    >
                                    <h3 className="text-purple-700 text-base md:text-lg font-semibold mb-3 leading-relaxed">
                                        {faq.question}
                                    </h3>
                                    <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Meeting FAQs */}
                    <section className="bg-white border-2 border-purple-600 rounded-none md:rounded-xl p-6 md:p-8 lg:p-10">
                        <h2 className="help-center__section-titext-indigo-700 text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8tle">
                            Reuniones
                        </h2>

                        <div className="space-y-6">
                            {meetingFAQs.map((faq, index) => (
                                <div key = {index} 
                                    className={`pb-4 ${index !== meetingFAQs.length - 1 ? 'border-b border-purple-200' : ''}`}
                                >
                                    <h3 className="text-purple-700 text-base md:text-lg font-semibold mb-3 leading-relaxed">
                                        {faq.question}
                                    </h3>
                                    <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;