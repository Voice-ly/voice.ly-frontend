import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../LoginPage';



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
describe('Login Page - pruebas unitarias', () => {
    beforeEach(()=>{
        vi.clearAllMocks();
        mockUseLocation.mockReturnValue({
            pathname: '/login',
            search: '',
            hash: '',
            state: null
        })
    });

    /**
     * Group 1: basic render
     * =====================
     * Verifies that all the visual elements appear succesfully
     */
    describe('Renderizado inicial', () => {

        it('debe renderizar el formulario de inicio de sesión completo', ()=>{
            renderWithRouter(<LoginPage/>);

            //Verify that the title is present
            expect(screen.getByText('Inicia Sesión')).toBeInTheDocument();

            //Verify that the login fields are present
            expect(screen.getByPlaceholderText('johndoe@email.com')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Digita tu Contraseña')).toBeInTheDocument();
        });

        it('debe renderizar el botón de iniciar sesión', ()=>{
            renderWithRouter(<LoginPage/>);

            const submitButton = screen.getByRole('button', {name: 'Iniciar'});
            expect(submitButton).not.toBeDisabled();
        });
    });
    /**
     * Group 2: user interactions
     * ==========================
     */
    describe('Interacciones del usuario', ()=>{    
        it('no debe llamar a navigate si la validación falla', async () => {
            renderWithRouter(<LoginPage />);


            const emailInput = screen.getByPlaceholderText('johndoe@email.com');
            const passwordInput = screen.getByPlaceholderText('Digita tu Contraseña');
            const submitButton = screen.getByRole('button', { name: 'Iniciar' });


            fireEvent.change(emailInput, { target: { value: 'noemail' } });
            fireEvent.change(passwordInput, { target: { value: '' } });


            fireEvent.click(submitButton);


            await waitFor(() => {
                expect(mockNavigate).not.toHaveBeenCalled();
            });
        });
    });
});