import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HelpCenter from '../Help';



/**
 * Initial configuration
 * =====================
 * These mocks avoid that tests do real calls to external services
 */

// React-router mock to control navigation
const mockNavigate = vi.fn();
const mockUseLocation = vi.fn();

vi.mock('react-router', async () => {
    const actual = await vi.importActual('react-router');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useLocation: ()=> mockUseLocation(),
        Link: ({ children, to, ...props }: any) => {
            return <a href={to} {...props}>{children}</a>;
        }
    };
});


const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>)
};


/**
 * Main test suit
 */
describe('Help - pruebas unitarias', ()=>{
    beforeEach(()=>{
        vi.clearAllMocks();
        mockUseLocation.mockReturnValue({
            pathname: '/help',
            search: '',
            hash: '',
            state: null
        });
    });

    /**
     * Group 1: initial render
     */
    describe('Renderizado inicial', ()=>{
        it('debe renderizar los títulos', ()=>{
            renderWithRouter(<HelpCenter/>);

            expect(screen.getByText('Centro de Ayuda - Preguntas Frecuentes')).toBeInTheDocument();
            expect(screen.getByText('Cuenta y acceso')).toBeInTheDocument();
            expect(screen.getByText('Reuniones')).toBeInTheDocument();
        });

        it('debe renderizar las preguntas', ()=>{
            renderWithRouter(<HelpCenter/>);

            expect(screen.getByText('¿Cómo creo una cuenta?')).toBeInTheDocument();
            expect(screen.getByText('Olvidé mi contraseña, ¿qué hago?')).toBeInTheDocument();
            expect(screen.getByText('¿Puedo cambiar mis datos personales?')).toBeInTheDocument();

            expect(screen.getByText('¿Cómo creo una reunión?')).toBeInTheDocument();
            expect(screen.getByText('¿Cómo me uno a una reunión?')).toBeInTheDocument();
            expect(screen.getByText('¿Cuántas personas pueden participar?')).toBeInTheDocument();
            expect(screen.getByText('¿Quién puede unirse a mis reuniones?')).toBeInTheDocument();
            expect(screen.getByText('¿Dónde puedo reportar un problema o enviar sugerencias?')).toBeInTheDocument();
        });

        it('debe renderizar las respuestas', ()=>{
            renderWithRouter(<HelpCenter/>);

            expect(screen.getByText(/"Registrarse"/)).toBeInTheDocument();
            expect(screen.getByText(/¿Olvidaste tu contraseña?/)).toBeInTheDocument();
            expect(screen.getByText(/Perfil/)).toBeInTheDocument();

            expect(screen.getByText(/enlace o ID único/)).toBeInTheDocument();
            expect(screen.getByText(/enlace que te compartieron/)).toBeInTheDocument();
            expect(screen.getByText(/10 usuarios/)).toBeInTheDocument();
            expect(screen.getByText(/enlace de invitación/)).toBeInTheDocument();
            expect(screen.getByText(/correo de soporte/)).toBeInTheDocument();
        })
    })
})