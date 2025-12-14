import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../HomePage';


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
describe('Home - pruebas unitarias', ()=>{
    beforeEach(()=>{
        vi.clearAllMocks();
        mockUseLocation.mockReturnValue({
            pathname: '/home',
            search: '',
            hash: '',
            state: null
        });
    });

    /**
     * Group 1: Initial rendering
     */
    describe('Renderizado inicial de los componentes', ()=>{
        it('debe renderizar los elementos de la página', ()=>{
            renderWithRouter(<HomePage/>);

            expect(screen.getByText(/Comunícate/)).toBeInTheDocument();
            expect(screen.getByText(/Con Voicely/)).toBeInTheDocument();
        });
    });
});