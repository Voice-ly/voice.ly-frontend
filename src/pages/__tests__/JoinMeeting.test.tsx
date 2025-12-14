import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import JoinMeeting from '../JoinMeeting';

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
        Link: ({ children, to, ...props }: any) => {
            <a href={to} {...props}>{children}</a>
        }
    };
});

const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>)
};

/**
 * Main test suite
 */
describe('JoinMeeting Component - pruebas unitarias',()=>{
    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetAllMocks();
    });

    afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
    });

    /**
     * Group 1: initial render
     * =======================
     */
    describe('Renderizado inicial', ()=>{
        it('debe renderizar el título principal', () => {
            renderWithRouter(<JoinMeeting/>)
            
            const title = screen.getByText('Unirse a una Reunión');
            expect(title).toBeInTheDocument();
        });

        it('debe mostrar el label del campo de ID', () => {
            renderWithRouter(<JoinMeeting/>)
            
            const label = screen.getByText('ID de la Reunión');
            expect(label).toBeInTheDocument();
        });

        it('debe renderizar el input de ID de reunión', () => {
            renderWithRouter(<JoinMeeting/>)
            
            const input = screen.getByPlaceholderText('Introduce el ID de la reunión');
            expect(input).toBeInTheDocument();
        });

        it('debe mostrar el botón de unirse', () => {
            renderWithRouter(<JoinMeeting/>)
            
            const button = screen.getByText('Unirse');
            expect(button).toBeInTheDocument();
        });

        it('debe mostrar el mensaje de información adicional', () => {
            renderWithRouter(<JoinMeeting/>)
            
            expect(screen.getByText(/¿No tienes un ID de reunión?/i)).toBeInTheDocument();
        });

        it('debe mostrar el enlace para crear nueva reunión', () => {
            renderWithRouter(<JoinMeeting/>)
            
            const link = screen.getByText('Crea una nueva reunión');
            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute('href', '/login');
        });

        it('debe tener el card container con borde', () => {
            renderWithRouter(<JoinMeeting/>)
            
            const card = screen.getByText('Unirse a una Reunión').closest('div');
            expect(card).toHaveClass('bg-gradient-to-r', 'from-blue-500', 'to-teal-500');
        });
    });

    /**
     * Group 2: input interactions
     * ===========================
     */
    describe('Interacciones con el input de ID', ()=>{
        it('debe permitir escribir el ID de la reunión', () => {
            renderWithRouter(<JoinMeeting/>)
            
            const input = screen.getByPlaceholderText('Introduce el ID de la reunión');
            
            fireEvent.change(input, { target: { value: 'ABC123' } });
            
            expect(input).toHaveValue('ABC123');
        });

        it('debe iniciar con el input vacío', () => {
            renderWithRouter(<JoinMeeting/>)
            
            const input = screen.getByPlaceholderText('Introduce el ID de la reunión');
            
            expect(input).toHaveValue('');
        });

        it('debe limpiar el input cuando se borra el texto', () => {
            renderWithRouter(<JoinMeeting/>)
            
            const input = screen.getByPlaceholderText('Introduce el ID de la reunión');
            
            fireEvent.change(input, { target: { value: 'TEST123' } });
            expect(input).toHaveValue('TEST123');
            
            fireEvent.change(input, { target: { value: '' } });
            expect(input).toHaveValue('');
        });

        it('debe aceptar IDs alfanuméricos', () => {
            renderWithRouter(<JoinMeeting/>)
            
            const input = screen.getByPlaceholderText('Introduce el ID de la reunión');
            
            fireEvent.change(input, { target: { value: 'meeting123ABC' } });
            
            expect(input).toHaveValue('meeting123ABC');
        });

        it('debe aceptar IDs con guiones', () => {
            renderWithRouter(<JoinMeeting/>)
            
            const input = screen.getByPlaceholderText('Introduce el ID de la reunión');
            
            fireEvent.change(input, { target: { value: 'room-123-abc' } });
            
            expect(input).toHaveValue('room-123-abc');
        });

        it('debe aceptar IDs con guiones bajos', () => {
            renderWithRouter(<JoinMeeting/>)
            
            const input = screen.getByPlaceholderText('Introduce el ID de la reunión');
            
            fireEvent.change(input, { target: { value: 'meeting_2024_01' } });
            
            expect(input).toHaveValue('meeting_2024_01');
        });

        it('debe aceptar IDs numéricos', () => {
            renderWithRouter(<JoinMeeting/>)
            
            const input = screen.getByPlaceholderText('Introduce el ID de la reunión');
            
            fireEvent.change(input, { target: { value: '123456789' } });
            
            expect(input).toHaveValue('123456789');
        });

        it('debe aceptar IDs con caracteres especiales', () => {
            renderWithRouter(<JoinMeeting/>)
            
            const input = screen.getByPlaceholderText('Introduce el ID de la reunión');
            
            fireEvent.change(input, { target: { value: 'room@2024' } });
            
            expect(input).toHaveValue('room@2024');
        });

        it('debe mantener el valor al hacer múltiples cambios', () => {
            renderWithRouter(<JoinMeeting/>)
            
            const input = screen.getByPlaceholderText('Introduce el ID de la reunión');
            
            fireEvent.change(input, { target: { value: 'ABC' } });
            expect(input).toHaveValue('ABC');
            
            fireEvent.change(input, { target: { value: 'ABC123' } });
            expect(input).toHaveValue('ABC123');
            
            fireEvent.change(input, { target: { value: 'ABC123XYZ' } });
            expect(input).toHaveValue('ABC123XYZ');
        });
    });
});