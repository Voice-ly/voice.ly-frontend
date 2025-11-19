import "./styles/Help.css";

interface FAQItem {
    question: string;
    answer: string;
}


const HelpCenter: React.FC = () => {
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
        <div className="help-center">
            <div className="help-center__container">

                {/* Header Section */}
                <div className="help-center__header">
                    <h1 className="help-center__title">
                        Centro de Ayuda - Preguntas Frecuentes
                    </h1>

                </div>
                
                {/* Content */}
                <div className="help-center__content">

                    {/* Account FAQs */}
                    <section className="help-center__section">
                        <h2 className="help-center__section-title">
                            Cuenta y acceso
                        </h2>

                        <div className="help-center__faq-list">
                            {accountFAQs.map((faq, index) => (
                                <div key={index} className="help-center__faq-item">
                                    <h3 className="helpcenter__question">{faq.question}</h3>
                                    <p className="help-center__answer">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Meeting FAQs */}
                    <section className="help-center__section">
                        <h2 className="help-center__section-title">
                            Reuniones y uso de la plataforma
                        </h2>

                        <div className="help-center__faq-list">
                            {meetingFAQs.map((faq, index) => (
                                <div key = {index} className="help-center__faq-item">
                                    <h3 className="help-center__question">{faq.question}</h3>
                                    <p className="help-center__answer">{faq.answer}</p>
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