import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AboutUs from '../AboutUs';

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
describe('About Us - pruebas unitarias', ()=> {
    beforeEach(()=>{
        vi.clearAllMocks();
        mockUseLocation.mockReturnValue({
            pathname: '/about-us',
            search: '',
            hash: '',
            state: null
        })
    });

    /**
     * Group 1: basic render
     */
    describe('Renderizado inicial',()=>{
        it('debe renderizar la información del componente', ()=>{
            renderWithRouter(<AboutUs/>);

            expect(screen.getByText('Sobre Nosotros')).toBeInTheDocument();

            expect(screen.getByText(/voicely creemos/)).toBeInTheDocument();
            expect(screen.getByText(/Ofrecemos/)).toBeInTheDocument();
            expect(screen.getByText('Nuestra Misión')).toBeInTheDocument();
            expect(screen.getByText(/Facilitar/)).toBeInTheDocument();
            expect(screen.getByText('Nuestra Visión')).toBeInTheDocument();
            expect(screen.getByText(/solución preferida/)).toBeInTheDocument();
            expect(screen.getByText('Nuestro Equipo')).toBeInTheDocument();
            expect(screen.getByText(/grupo de desarrolladores/)).toBeInTheDocument();
        })
    })
})