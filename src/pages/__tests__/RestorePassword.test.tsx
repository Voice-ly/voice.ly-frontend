import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ForgotPassword from '../RestorePassword';

/**
 * Initial configuration
 * =====================
 * These mocks avoid that tests do real calls to external services
 */
vi.mock('../lib/AuthService', () => ({
    resetPassword: vi.fn()
}));

const renderWithToken = (token: string = 'valid-token-123') => {
    return render(
        <MemoryRouter initialEntries={[`/reset-password?token=${token}`]}>
        <ForgotPassword />
        </MemoryRouter>
    );
};

// Renderizar sin token
const renderWithoutToken = () => {
    return render(
        <MemoryRouter initialEntries={['/reset-password']}>
        <ForgotPassword />
        </MemoryRouter>
    );
};

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

/**
 * Main test suit
 */
describe('RestorePassword Component - pruebas unitarias',()=>{
    beforeEach(()=>{
        vi.clearAllMocks();
    });

    /**
     * Group 1: Initial render with valid token
     * ========================================
     */
    describe('Renderizado con token válido',()=>{
         it('debe renderizar el título principal', () => {
            renderWithToken();
            
            const title = screen.getByText('Recuperar Contraseña');
            expect(title).toBeInTheDocument();
        });

        it('debe mostrar el logo en móvil', () => {
            renderWithToken();
            
            const logos = screen.getAllByAltText('logo');
            expect(logos.length).toBeGreaterThan(0);
            expect(logos[0]).toHaveAttribute('src', '/logo.jpeg');
        });

        it('debe renderizar los campos de contraseña', () => {
            renderWithToken();
            
            expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
            expect(screen.getByLabelText('Confirmar Contraseña')).toBeInTheDocument();
        });

        it('debe mostrar los placeholders correctos', () => {
            renderWithToken();
            
            expect(screen.getByPlaceholderText('Digita tu contraseña')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Confirma tu contraseña')).toBeInTheDocument();
        });

        it('debe mostrar las indicaciones de requisitos de contraseña', () => {
            renderWithToken();
            
            const requirements = screen.getByText(/1 mayúscula, 1 minúscula, 1 número y 1 carácter especial/i);
            expect(requirements).toBeInTheDocument();
        });

        it('debe mostrar el botón de cambiar contraseña', () => {
            renderWithToken();
            
            const submitButton = screen.getByText('CAMBIAR');
            expect(submitButton).toBeInTheDocument();
            expect(submitButton).toHaveAttribute('type', 'submit');
        });

        it('debe mostrar los enlaces de registro e inicio de sesión', () => {
            renderWithToken();
            
            expect(screen.getByText(/¿No tienes una cuenta?/i)).toBeInTheDocument();
            expect(screen.getByText('¡Regístrate ahora!')).toBeInTheDocument();
            
            expect(screen.getByText(/¿Ya tienes cuenta?/i)).toBeInTheDocument();
            expect(screen.getByText('¡Inicia sesión ahora!')).toBeInTheDocument();
        });
    });

    /**
     * Group 2: Render without token (invalid)
     * =======================================
     */
    describe('Renderizado sin token (estado inválido)',()=>{
        it('debe mostrar mensaje de enlace inválido cuando no hay token', () => {
            renderWithoutToken();
            
            expect(screen.getByText('Enlace Inválido')).toBeInTheDocument();
        });

        it('debe mostrar el enlace para solicitar nuevo token', () => {
            renderWithoutToken();
            
            const newLinkButton = screen.getByText('Solicitar nuevo enlace');
            expect(newLinkButton).toBeInTheDocument();
            expect(newLinkButton).toHaveAttribute('href', '/forgot-password');
        });

        it('debe mostrar el logo en estado de error', () => {
            renderWithoutToken();
            
            const logo = screen.getByAltText('logo');
            expect(logo).toBeInTheDocument();
        });

        it('debe tener el estilo correcto para el mensaje de error', () => {
            renderWithoutToken();
            
            const errorContainer = screen.getByText('Enlace Inválido').closest('div');
            expect(errorContainer).toHaveClass('bg-red-50', 'border-red-200');
        });

        it('no debe mostrar el formulario cuando no hay token', () => {
            renderWithoutToken();
            
            expect(screen.queryByLabelText('Contraseña')).not.toBeInTheDocument();
            expect(screen.queryByText('CAMBIAR')).not.toBeInTheDocument();
        });
    });

    /**
     * Group 3 : Interactions with inputs
     * ==================================
     */
    describe('Interacciones con campos de contraseña', ()=>{
        it('debe permitir escribir en el campo de contraseña', () => {
            renderWithToken();
            
            const passwordInput = screen.getByPlaceholderText('Digita tu contraseña');
            
            fireEvent.change(passwordInput, { target: { value: 'Test123!@#' } });
            
            expect(passwordInput).toHaveValue('Test123!@#');
        });

        it('debe permitir escribir en el campo de confirmar contraseña', () => {
            renderWithToken();
            
            const confirmInput = screen.getByPlaceholderText('Confirma tu contraseña');
            
            fireEvent.change(confirmInput, { target: { value: 'Test123!@#' } });
            
            expect(confirmInput).toHaveValue('Test123!@#');
        });

        it('debe mantener valores independientes en ambos campos', () => {
            renderWithToken();
            
            const passwordInput = screen.getByPlaceholderText('Digita tu contraseña');
            const confirmInput = screen.getByPlaceholderText('Confirma tu contraseña');
            
            fireEvent.change(passwordInput, { target: { value: 'Password1!' } });
            fireEvent.change(confirmInput, { target: { value: 'Password2!' } });
            
            expect(passwordInput).toHaveValue('Password1!');
            expect(confirmInput).toHaveValue('Password2!');
        });

        it('debe limpiar los campos cuando se borra el texto', () => {
            renderWithToken();
            
            const passwordInput = screen.getByPlaceholderText('Digita tu contraseña');
            
            fireEvent.change(passwordInput, { target: { value: 'Test123!' } });
            expect(passwordInput).toHaveValue('Test123!');
            
            fireEvent.change(passwordInput, { target: { value: '' } });
            expect(passwordInput).toHaveValue('');
        });

        it('debe aceptar contraseñas con caracteres especiales permitidos', () => {
            renderWithToken();
            
            const passwordInput = screen.getByPlaceholderText('Digita tu contraseña');
            
            const specialChars = 'Pass1@$!%*?&';
            fireEvent.change(passwordInput, { target: { value: specialChars } });
            
            expect(passwordInput).toHaveValue(specialChars);
        });

        it('debe aceptar contraseñas largas', () => {
            renderWithToken();
            
            const passwordInput = screen.getByPlaceholderText('Digita tu contraseña');
            const longPassword = 'MyVeryLongPassword123!@#$%';
            
            fireEvent.change(passwordInput, { target: { value: longPassword } });
            
            expect(passwordInput).toHaveValue(longPassword);
        });
    });

    /**
     * Group 4: form validations
     * =========================
     */
    describe('Validación del formulario',()=>{
        it('debe mostrar error cuando las contraseñas no coinciden', () => {
            renderWithToken();
            
            const passwordInput = screen.getByPlaceholderText('Digita tu contraseña');
            const confirmInput = screen.getByPlaceholderText('Confirma tu contraseña');
            const submitButton = screen.getByText('CAMBIAR');
            
            fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
            fireEvent.change(confirmInput, { target: { value: 'Different123!' } });
            fireEvent.click(submitButton);
            
            expect(screen.getByText('Las contraseñas no coinciden.')).toBeInTheDocument();
        });

        it('debe mostrar error cuando la contraseña no tiene mayúscula', () => {
            renderWithToken();
            
            const passwordInput = screen.getByPlaceholderText('Digita tu contraseña');
            const confirmInput = screen.getByPlaceholderText('Confirma tu contraseña');
            const submitButton = screen.getByText('CAMBIAR');
            
            const weakPassword = 'password123!';
            fireEvent.change(passwordInput, { target: { value: weakPassword } });
            fireEvent.change(confirmInput, { target: { value: weakPassword } });
            fireEvent.click(submitButton);
            
            expect(screen.getByText(/La contraseña debe contener al menos/i)).toBeInTheDocument();
        });

        it('debe mostrar error cuando la contraseña no tiene minúscula', () => {
            renderWithToken();
            
            const passwordInput = screen.getByPlaceholderText('Digita tu contraseña');
            const confirmInput = screen.getByPlaceholderText('Confirma tu contraseña');
            const submitButton = screen.getByText('CAMBIAR');
            
            const weakPassword = 'PASSWORD123!';
            fireEvent.change(passwordInput, { target: { value: weakPassword } });
            fireEvent.change(confirmInput, { target: { value: weakPassword } });
            fireEvent.click(submitButton);
            
            expect(screen.getByText(/La contraseña debe contener al menos/i)).toBeInTheDocument();
        });

        it('debe mostrar error cuando la contraseña no tiene número', () => {
            renderWithToken();
            
            const passwordInput = screen.getByPlaceholderText('Digita tu contraseña');
            const confirmInput = screen.getByPlaceholderText('Confirma tu contraseña');
            const submitButton = screen.getByText('CAMBIAR');
            
            const weakPassword = 'Password!@#';
            fireEvent.change(passwordInput, { target: { value: weakPassword } });
            fireEvent.change(confirmInput, { target: { value: weakPassword } });
            fireEvent.click(submitButton);
            
            expect(screen.getByText(/La contraseña debe contener al menos/i)).toBeInTheDocument();
        });

        it('debe mostrar error cuando la contraseña no tiene carácter especial', () => {
            renderWithToken();
            
            const passwordInput = screen.getByPlaceholderText('Digita tu contraseña');
            const confirmInput = screen.getByPlaceholderText('Confirma tu contraseña');
            const submitButton = screen.getByText('CAMBIAR');
            
            const weakPassword = 'Password123';
            fireEvent.change(passwordInput, { target: { value: weakPassword } });
            fireEvent.change(confirmInput, { target: { value: weakPassword } });
            fireEvent.click(submitButton);
            
            expect(screen.getByText(/La contraseña debe contener al menos/i)).toBeInTheDocument();
        });

        it('debe aceptar contraseñas válidas que cumplan todos los requisitos', () => {
            renderWithToken();
            
            const passwordInput = screen.getByPlaceholderText('Digita tu contraseña');
            const confirmInput = screen.getByPlaceholderText('Confirma tu contraseña');
            
            const validPassword = 'ValidPass123!';
            fireEvent.change(passwordInput, { target: { value: validPassword } });
            fireEvent.change(confirmInput, { target: { value: validPassword } });
            
            // No debe haber errores visibles antes de enviar
            expect(screen.queryByText('Las contraseñas no coinciden.')).not.toBeInTheDocument();
        });
    });
});