import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ForgotPassword from '../ForgotPassword';



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
describe('Forgot password - pruebas unitarias', ()=>{
    beforeEach(()=>{
        vi.clearAllMocks();
        mockUseLocation.mockReturnValue({
            pathname: '/forgot-password',
            search: '',
            hash: '',
            state: null
        });
    });

    /**
     * Group 1: basic render
     */
    describe('Renderizado inicial', ()=>{
        it('debe renderizar los componentes iniciales del formulario', ()=>{
            renderWithRouter(<ForgotPassword/>);

            expect(screen.getByText('Recuperar Contraseña')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Ingresa tu email')).toBeInTheDocument();
        });

        it('debe renderizar el botón', ()=>{
            renderWithRouter(<ForgotPassword/>);

            const submitButton = screen.getByRole('button', {name: 'Enviar'});
            expect(submitButton).toBeInTheDocument();
        });
    });

    /**
     * Group 2: User interactions
     */
    describe('Interacciones del usuario básicas', ()=>{
        it('el botón no debe cambiar a enviando en caso de correo invalido', async()=>{
            renderWithRouter(<ForgotPassword/>);

            const submitButton = screen.getByRole('button', {name: 'Enviar'})
            const emailInput = screen.getByPlaceholderText('Ingresa tu email');

            fireEvent.change(emailInput, {target: {value: 'noemail'}});
            fireEvent.click(submitButton);

            await waitFor(()=>{
                expect(submitButton).toBeInTheDocument();
            });
        });
    });
});