import {describe, it, expect, vi, beforeEach} from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import ProfilePage from '../ProfilePage';

/**
 * Initial configuration
 * =====================
 * These mocks avoid that tests do real calls to external services
 */
const mockNavigate = vi.fn();
const mockUseLocation = vi.fn();
vi.mock('react-router', async () => {
    const actual = await vi.importActual('react-router');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useLocation: ()=> mockUseLocation(),
    };
});

vi.mock('../../lib/UserService', ()=>({
    updateProfile: vi.fn(),
    deleteUser: vi.fn()
}));

vi.mock('../../utils/toast', ()=>({
    showToast: vi.fn()
}));

const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>)
};

/**
 * Main test suit
 */
describe('ProfilePage Component - pruebas unitarias', ()=>{
    beforeEach(()=>{
        vi.clearAllMocks();
        mockUseLocation.mockReturnValue({
            pathname: '/about-us',
            search: '',
            hash: '',
            state: null
        });
        vi.mock('../../stores/useUserStore', ()=>({
            useUserStore: ()=> ({
                profile: {
                    firstName: 'Juan',
                    lastName: 'Pérez',
                    email: 'juan@example.com',
                    age: 25,
                    createdAt: { _seconds: 1609459200 }
                },
                setProfile: vi.fn()
            })
        }));
    });

    /**
     * Group 1: Initial render
     * =======================
     */
    describe('Renderizado inicial', ()=>{
        it('debe renderizar el título de la página', ()=>{
            renderWithRouter(<ProfilePage/>);

            expect(screen.getByText('Perfil de Usuario')).toBeInTheDocument();
        });

        it('debe mostrar los datos del usuario desde el store', ()=>{
            renderWithRouter(<ProfilePage/>);

            expect(screen.getByDisplayValue('Juan Pérez')).toBeInTheDocument();
            expect(screen.getByDisplayValue('juan@example.com')).toBeInTheDocument();
            expect(screen.getByDisplayValue('25')).toBeInTheDocument();
        });

        it('debe mostrar la fecha de creación correctamente formateada', ()=>{
            renderWithRouter(<ProfilePage/>);

            expect(screen.getByText(/Creado desde:/)).toBeInTheDocument();
        });

        it('debe mostrar el botón para volver al dashboard', ()=>{
            renderWithRouter(<ProfilePage/>);

            const backLink = screen.getByText('← Volver al Dashboard');
            expect(backLink).toBeInTheDocument();
        });

        it('debe renderizar todos los campos del formulario', ()=>{
            renderWithRouter(<ProfilePage/>);

            expect(screen.getByText('Nombres y Apellidos')).toBeInTheDocument();
            expect(screen.getByText('Email')).toBeInTheDocument();
            expect(screen.getByText('Edad')).toBeInTheDocument();
            expect(screen.getByText('Contraseña')).toBeInTheDocument();
        });

        it('debe mostrar los botones de acción', ()=>{
            renderWithRouter(<ProfilePage/>);

            expect(screen.getByText('Eliminar cuenta')).toBeInTheDocument();
            expect(screen.getByText('Guardar cambios')).toBeInTheDocument();
        });
    });

    /**
     * Group 2: inputs interactions
     * ============================
     */
    describe('Interacciones con inputs', ()=>{
        it('debe actualizar el nombre cuando el usuario escribe', ()=>{
            renderWithRouter(<ProfilePage/>);

            const nameInput = screen.getByDisplayValue('Juan Pérez');

            fireEvent.change(nameInput, {target: {value: 'María García'}});
            expect(nameInput).toHaveValue('María García');
        });

        it('debe actualizar el email cuando el usuario escribe', ()=>{
            renderWithRouter(<ProfilePage/>);

            const emailInput = screen.getByDisplayValue('juan@example.com');

            fireEvent.change(emailInput, {target: {value: 'new@test.com'}});
            expect(emailInput).toHaveValue('new@test.com');
        });

        it('debe actualizar la edad cuando el usuario escribe', ()=>{
            renderWithRouter(<ProfilePage/>);

            const ageInput = screen.getByDisplayValue('25');

            fireEvent.change(ageInput, {target: {value: '30'}});
            expect(ageInput).toHaveValue(30);
        });

        it('debe permitir escribir en el campo de contraseña', ()=>{
            renderWithRouter(<ProfilePage/>);

            const passwordInput = screen.getByPlaceholderText('Ingresa una nueva contraseña');

            fireEvent.change(passwordInput, {target: {value: 'newPassword1!'}});
            expect(passwordInput).toHaveValue('newPassword1!');
        });
    });

    /**
     * Group 3: Name formating
     * =======================
     */
    describe('Formateo del nombre completo', () => {
    
        it('debe eliminar espacios dobles al escribir el nombre', () => {
            renderWithRouter(<ProfilePage/>);
            
            const nameInput = screen.getByDisplayValue('Juan Pérez');
            
            // Escribimos con espacios dobles
            fireEvent.change(nameInput, { target: { value: 'María  González' } });
            
            // Debe quedar con un solo espacio (gracias a formatFullName)
            expect(nameInput).toHaveValue('María González');
        });

        it('debe eliminar espacios al inicio del nombre', () => {
            renderWithRouter(<ProfilePage/>);
            
            const nameInput = screen.getByDisplayValue('Juan Pérez');
            
            // Escribimos con espacio al inicio
            fireEvent.change(nameInput, { target: { value: '  Pedro' } });
            
            // No debe tener espacio al inicio
            expect(nameInput).toHaveValue('Pedro');
        });

        it('debe permitir nombres con un solo espacio entre palabras', () => {
            renderWithRouter(<ProfilePage/>);
            
            const nameInput = screen.getByDisplayValue('Juan Pérez');
            
            fireEvent.change(nameInput, { target: { value: 'Ana María López García' } });
            
            expect(nameInput).toHaveValue('Ana María López García');
            });

        it('debe manejar múltiples espacios consecutivos', () => {
            renderWithRouter(<ProfilePage/>);
            
            const nameInput = screen.getByDisplayValue('Juan Pérez');
            
            fireEvent.change(nameInput, { target: { value: 'Pedro    Luis    García' } });
            
            // Debe convertir múltiples espacios en uno solo
            expect(nameInput).toHaveValue('Pedro Luis García');
        });
    });

    /**
     * Group 4: Password visibility toggle
     * ===================================
     */
    describe('Visibilidad de contraseña', () => {
        
        it('debe iniciar con la contraseña oculta', () => {
            renderWithRouter(<ProfilePage/>);
            
            const passwordInput = screen.getByPlaceholderText('Ingresa una nueva contraseña');
            
            expect(passwordInput).toHaveAttribute('type', 'password');
        });

        it('debe mostrar la contraseña cuando se hace clic en "Ver"', () => {
            renderWithRouter(<ProfilePage/>);
            
            const passwordInput = screen.getByPlaceholderText('Ingresa una nueva contraseña');
            
            // Encontramos todos los botones "Ver" y tomamos el primero
            const toggleButtons = screen.getAllByText('Ver');
            fireEvent.click(toggleButtons[0]);
            
            // Ahora debe ser type="text"
            expect(passwordInput).toHaveAttribute('type', 'text');
        });

        it('debe ocultar la contraseña cuando se hace clic en "Ocultar"', () => {
            renderWithRouter(<ProfilePage/>);
            
            const passwordInput = screen.getByPlaceholderText('Ingresa una nueva contraseña');
            
            // Primero mostramos la contraseña
            const toggleButtons = screen.getAllByText('Ver');
            fireEvent.click(toggleButtons[0]);
            
            // Ahora ocultamos
            const hideButton = screen.getAllByText('Ocultar')[0];
            fireEvent.click(hideButton);
            
            expect(passwordInput).toHaveAttribute('type', 'password');
        });

        it('debe alternar entre mostrar y ocultar múltiples veces', () => {
            renderWithRouter(<ProfilePage/>);
        
            const passwordInput = screen.getByPlaceholderText('Ingresa una nueva contraseña');
            
            // Primera vez - mostrar
            fireEvent.click(screen.getAllByText('Ver')[0]);
            expect(passwordInput).toHaveAttribute('type', 'text');
            
            // Segunda vez - ocultar
            fireEvent.click(screen.getAllByText('Ocultar')[0]);
            expect(passwordInput).toHaveAttribute('type', 'password');
            
            // Tercera vez - mostrar de nuevo
            fireEvent.click(screen.getAllByText('Ver')[0]);
            expect(passwordInput).toHaveAttribute('type', 'text');
        });
    });

    /**
     * Group 5: delete modal (only UI)
     * ===============================
     */
    describe('Modal de eliminación - interacciones UI', ()=>{
        it('debe iniciar con el modal cerrado', ()=>{
            renderWithRouter(<ProfilePage/>);
            expect(screen.queryByText('Para confirmar, ingresa tu contraseña.')).not.toBeInTheDocument();
        });

        it('debe abrir el modal cuando se hace clic en "Eliminar cuenta"',()=>{
            renderWithRouter(<ProfilePage/>);

            const deleteBtn = screen.getByText('Eliminar cuenta');
            fireEvent.click(deleteBtn);

            expect(screen.getByText('Para confirmar, ingresa tu contraseña.')).toBeInTheDocument();
            expect(screen.getByAltText('warning')).toBeInTheDocument();
        });

        it('debe cerrar el modal cuando se hace clic en "Cancelar"', async()=>{
            renderWithRouter(<ProfilePage/>);

            const deleteBtn = screen.getByText('Eliminar cuenta');
            fireEvent.click(deleteBtn);

            expect(screen.getByText('Para confirmar, ingresa tu contraseña.')).toBeInTheDocument();

            const cancelBtn = screen.getByText('Cancelar');
            fireEvent.click(cancelBtn);

            await waitFor(()=>{
                expect(screen.queryByAltText('Para confirmar, ingresa tu contraseña.')).not.toBeInTheDocument();
            });
        });

        it('debe permitir escribir en el campo de contraseña del modal', ()=>{
            renderWithRouter(<ProfilePage/>);

            fireEvent.click(screen.getByText('Eliminar cuenta'));

            const modalPassInput = screen.getByPlaceholderText('Ingresa tu contraseña');
            fireEvent.change(modalPassInput, {target: {value: 'miPassword1'}});

            expect(modalPassInput).toHaveValue('miPassword1');
        });

        it('debe limpiar el campo de contraseña al cerrar y reabrir el modal', async()=>{
            renderWithRouter(<ProfilePage/>);

            fireEvent.click(screen.getByText('Eliminar cuenta'));

            const modalPassInput = screen.getByPlaceholderText('Ingresa tu contraseña');
            fireEvent.change(modalPassInput, {target: {value: 'miPassword1'}});

            fireEvent.click(screen.getByText('Cancelar'));

            await waitFor(()=>{
                expect(screen.queryByText('Para confirmar, ingresa tu contraseña.')).not.toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('Eliminar cuenta'));

            const newModalPassInput = screen.getByPlaceholderText('Ingresa tu contraseña');
            expect(newModalPassInput).toHaveValue('');
        })
    })
});