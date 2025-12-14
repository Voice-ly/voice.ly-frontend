import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RegisterPage from '../RegisterPage';



/**
 * Initial configuration
 * =====================
 * These mocks avoid that tests do real calls to external services
 */

// React-router mock to control navegation
const mockNavigate = vi.fn();
const mockUseLocation = vi.fn();

vi.mock('react-router', async () => {
    const actual = await vi.importActual('react-router');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useLocation: ()=> mockUseLocation(),
        Link: ({ children, to, ...props }: any) => {
            <a href={to} {...props}>{children}</a>
        }
    };
});

// Authentication services mock
vi.mock('../../lib/UserService');
vi.mock('../../lib/AuthService');
vi.mock('../../stores/useUserStore', () => ({
    useUserStore: () => ({
        setProfile: vi.fn(),
    }),
}));

const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>)
};

/**
 * Main test suit
 */
describe('RegisterPage - Pruebas Unitarias', () => {
    // Mock cleaning before any test
    beforeEach(() => {
        vi.clearAllMocks();
        mockUseLocation.mockReturnValue({
            pathname: '/register',
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

        it('debe renderizar el formulario de registro completo', () => {
            renderWithRouter(<RegisterPage/>);

            // Verify that the title is present
            expect(screen.getByText('Registrate')).toBeInTheDocument();

            // Verify that all fields are present
            expect(screen.getByPlaceholderText('Ingresa tus nombres')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Ingresa tus apellidos')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Ingresa tu edad')).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/Ingresa tu correo/)).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Ingresa tu contraseña')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Repite tu contraseña')).toBeInTheDocument();
        });

        it('debe mostrar el botón de registro deshabilitado inicialmente', () => {
            renderWithRouter(<RegisterPage />);

            const submitButton = screen.getByRole('button', {name: /Registrarme/i });
            expect(submitButton).toBeDisabled();
            expect(submitButton).toHaveClass('opacity-40');
        });

        it('debe mostrar el checklist de requisitos de contraseña', () => {
            renderWithRouter(<RegisterPage/>);

            expect(screen.getByText('• 8 caracteres')).toBeInTheDocument();
            expect(screen.getByText('• Una mayúscula')).toBeInTheDocument();
            expect(screen.getByText('• Un número')).toBeInTheDocument();
            expect(screen.getByText('• Un caracter especial')).toBeInTheDocument();
        });
    });

    /**
     * Group 2: Fields validations
     * ===========================
     * Test the validation rules of every input
     */
    describe('Validación de campos', () => {
        it('debe mostrar error cuando el nombre tiene menos de 2 caracteres', async ()=> {
            renderWithRouter(<RegisterPage/>);
            const nameInput = screen.getByPlaceholderText('Ingresa tus nombres');

            // Simulates what the user writes
            fireEvent.change(nameInput, {target: { value: 'A'}});
            
            // Waits until the error message appears
            await waitFor(() => {
                expect(screen.getByText('Nombre inválido')).toBeInTheDocument();
            });
        });

        it('debe aceptar nombres con tildes y espacios', async () => {
            renderWithRouter(<RegisterPage/>);

            const nameInput = screen.getByPlaceholderText('Ingresa tus nombres');

            fireEvent.change(nameInput, { target: { value: 'José María' }});
            await waitFor(()=> {
                expect(screen.queryByText('Nombre inválido')).not.toBeInTheDocument();
            });
        });

        it('debe rechazar números en el nombre', () => {
            renderWithRouter(<RegisterPage/>);

            const nameInput = screen.getByPlaceholderText('Ingresa tus nombres');
            
            // Tries to write numbers
            fireEvent.change(nameInput, { target: { value: 'Juan123'}});

            // Input should NOT change because regex blocks it
            expect(nameInput).toHaveValue('');
        });

        it('debe validar formato de email correctamente', async () => {
            renderWithRouter(<RegisterPage/>);

            const emailInput = screen.getByPlaceholderText(/Ingresa tu correo/);

            // Invalid email
            fireEvent.change(emailInput, { target: { value: 'correo-mal-escrito'}});

            await waitFor(() => {
                expect(screen.getByText('Correo inválido')).toBeInTheDocument();
            });

            // Valid email
            fireEvent.change(emailInput, { target: { value: 'test@gmail.com'}});
            await waitFor(()=> {
                expect(screen.queryByText('Correo inválido')).not.toBeInTheDocument();
            });
        });

        it('debe validar que la edad esté entre 13 y 120', async () => {
            renderWithRouter(<RegisterPage/>);

            const ageInput = screen.getByPlaceholderText(/Ingresa tu edad/);

            // Really young age
            fireEvent.change(ageInput, { target: { value: '10'}});
            await waitFor(() => {
                expect(screen.getByText('Edad inválida')).toBeInTheDocument();
            });

            // Valid Age
            fireEvent.change(ageInput, { target: { value: '25'}});
            await waitFor(() => {
                expect(screen.queryByText('Edad inválidad')).not.toBeInTheDocument();
            });
        });
    });

    /**
     * Group 3: Password validation
     * ============================
     * Test all security requisites of the password
     */
    describe('Validación de contraseña', () => {
        it('debe actualizar el checklist según los requisitos cumplidos', async ()=> {
            renderWithRouter(<RegisterPage/>);

            const passwordInput = screen.getByPlaceholderText(/Ingresa tu contraseña/);

            // Weak password
            fireEvent.change(passwordInput, {target: {value: 'abc'}});

            await waitFor(()=> {
                const checkItemas = screen.getAllByText(/•/);
                // All items should be in red (text-red-600)
                checkItemas.forEach(item => {
                    expect(item).toHaveClass('text-red-600');
                });
            });

            // Strong password
            fireEvent.change(passwordInput, {target: {value: 'Password1123!'}});

            await waitFor(() => {
                const checkItems = screen.getAllByText(/•/);
                //All items should be green
                checkItems.forEach(item => {
                    expect(item).toHaveClass('text-green-600');
                });
            });
        });

        it('debe validar que las contraseñas coincidan', async () => {
            renderWithRouter(<RegisterPage/>);

            const passwordInput = screen.getByPlaceholderText(/Ingresa tu contraseña/);
            const confirmInput = screen.getByPlaceholderText(/Repite tu contraseña/);

            fireEvent.change(passwordInput, {target: {value: 'Password1123!'}});
            fireEvent.change(confirmInput, {target: {value: 'Password456!'}});

            await waitFor(() => {
                expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument();
            });

            // Now we make the match
            fireEvent.change(confirmInput, {target: {value: 'Password1123!'}});

            await waitFor(() => {
                expect(screen.queryByText('Las contraseñas no coinciden')).not.toBeInTheDocument();
            });
        });
    });

    /**
     * Group 4: User interactions
     * ==========================
     */
    describe('Interacciones del usuario', () => {
        it('debe alternar visibilidad de contraseña al hacer click en "Ver/Ocultar"', () => {
            renderWithRouter(<RegisterPage />);
      
            const passwordInput = screen.getByPlaceholderText('Ingresa tu contraseña');
            const toggleButtons = screen.getAllByText('Ver');

            // Initially it should be password type
            expect(passwordInput).toHaveAttribute('type', 'password');

            // Click on button
            fireEvent.click(toggleButtons[0]);

            // Now it should be text type
            expect(passwordInput).toHaveAttribute('type', 'text');
            expect(screen.getAllByText('Ocultar')[0]).toBeInTheDocument();
        });

        it('debe habilitar el boton de registro cuando todos los campos sean válidos', async ()=> {
            renderWithRouter(<RegisterPage />);
      
            // Refill correctly all fields
            fireEvent.change(screen.getByPlaceholderText('Ingresa tus nombres'), {
                target: { value: 'Juan' }
            });
            fireEvent.change(screen.getByPlaceholderText('Ingresa tus apellidos'), {
                target: { value: 'Pérez' }
            });
            fireEvent.change(screen.getByPlaceholderText('Ingresa tu edad'), {
                target: { value: '25' }
            });
            fireEvent.change(screen.getByPlaceholderText(/Ingresa tu correo/), {
                target: { value: 'juan@example.com' }
            });
            fireEvent.change(screen.getByPlaceholderText('Ingresa tu contraseña'), {
                target: { value: 'Password123!' }
            });
            fireEvent.change(screen.getByPlaceholderText('Repite tu contraseña'), {
                target: { value: 'Password123!' }
            });

            // Waiting for button to be available
            await waitFor(() => {
                const submitButton = screen.getByRole('button', {name: /Registrarme/i});
                expect(submitButton).not.toBeDisabled();
                expect(submitButton).toHaveClass('opacity-100');
            });
        });
    });
});