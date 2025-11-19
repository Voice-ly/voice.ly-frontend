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
            question: '',
            answer: ''
        }
    ]
}