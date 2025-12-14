import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MeetingPage from '../MeetingPage';

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



vi.mock('../../lib/Socket', ()=>({
    connect: vi.fn(),
    disconnect: vi.fn(),
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn()
}));

vi.mock('../../lib/webrtc', ()=>({
    initWebRTC: vi.fn(),
    toggleAudio: vi.fn(),
    toggleVideo: vi.fn(),
    cleanupWebRTC: vi.fn()
}));

vi.mock('../../lib/ChatService',()=>({
    exitMeeting: vi.fn()
}));


const renderWithRouter = (component: React.ReactElement) => {
    return render(<MemoryRouter>{component}</MemoryRouter>)
};

/**
 * Main test suit
 */
describe('Meeting Component - pruebas unitarias', ()=>{
    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetAllMocks();
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

    afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
    });

    /**
     * Group 1: Initial render
     * =======================
     */
    describe('Renderizado inicial',()=>{
        it('debe renderizar el botón de vista', () => {
            renderWithRouter(<MeetingPage/>)
            
            const viewButton = screen.getByText('▣ Vista');
            expect(viewButton).toBeInTheDocument();
        });

        it('debe mostrar el contador de usuarios en línea', () => {
            renderWithRouter(<MeetingPage/>)
            
            const onlineStatus = screen.getByText(/En línea/i);
            expect(onlineStatus).toBeInTheDocument();
        });

        it('debe mostrar el ID de la reunión', () => {
            renderWithRouter(<MeetingPage/>)
            
            expect(screen.getByText(/Id de la reunión:/i)).toBeInTheDocument();
        });

        it('debe mostrar todos los botones de control', () => {
            renderWithRouter(<MeetingPage/>)
            
            expect(screen.getByText(/micrófono/i)).toBeInTheDocument();
            expect(screen.getByText(/cámara/i)).toBeInTheDocument();
            expect(screen.getByText('Participantes')).toBeInTheDocument();
            expect(screen.getByText('Chat')).toBeInTheDocument();
        });

        it('debe mostrar el botón de salir', () => {
            renderWithRouter(<MeetingPage/>)
            
            const exitButton = screen.getByText('Salir');
            expect(exitButton).toBeInTheDocument();
        });

        it('debe tener el video-grid container', () => {
            renderWithRouter(<MeetingPage/>)
            
            const videoGrid = document.getElementById('video-grid');
            expect(videoGrid).toBeInTheDocument();
        });

        it('debe iniciar con el chat oculto', () => {
            renderWithRouter(<MeetingPage/>)
        
            // El chat no debe estar visible inicialmente
            expect(screen.queryByText('Chat de la reunión')).not.toBeInTheDocument();
        });
    });

    /**
     * Group 2: Audio toggle
     * =====================
     */
    describe('Toggle de audio (micrófono)',()=>{
        it('debe iniciar con el audio desactivado', () => {
            renderWithRouter(<MeetingPage/>)
            
            expect(screen.getByText('Activar micrófono')).toBeInTheDocument();
            expect(screen.getByText('🔇')).toBeInTheDocument();
        });

        it('debe cambiar a "Desactivar" al hacer click', () => {
            renderWithRouter(<MeetingPage/>)
            
            const audioButton = screen.getByTitle(/Activar\/Desactivar de microfono/i);
            
            fireEvent.click(audioButton);
            
            expect(screen.getByText('Desactivar micrófono')).toBeInTheDocument();
            expect(screen.getByText('🎤')).toBeInTheDocument();
        });

        it('debe alternar entre activado y desactivado', () => {
            renderWithRouter(<MeetingPage/>)
            
            const audioButton = screen.getByTitle(/Activar\/Desactivar de microfono/i);
            
            // Primera vez - activar
            fireEvent.click(audioButton);
            expect(screen.getByText('Desactivar micrófono')).toBeInTheDocument();
            
            // Segunda vez - desactivar
            fireEvent.click(audioButton);
            expect(screen.getByText('Activar micrófono')).toBeInTheDocument();
            
            // Tercera vez - activar de nuevo
            fireEvent.click(audioButton);
            expect(screen.getByText('Desactivar micrófono')).toBeInTheDocument();
        });

        it('debe tener el emoji correcto según el estado', () => {
            renderWithRouter(<MeetingPage/>)
            
            const audioButton = screen.getByTitle(/Activar\/Desactivar de microfono/i);
            
            // Desactivado
            expect(screen.getByText('🔇')).toBeInTheDocument();
            
            // Activado
            fireEvent.click(audioButton);
            expect(screen.getByText('🎤')).toBeInTheDocument();
        });

        it('debe tener el atributo title correcto', () => {
            renderWithRouter(<MeetingPage/>)
            
            const audioButton = screen.getByTitle(/Activar\/Desactivar de microfono/i);
            
            expect(audioButton).toHaveAttribute('title', 'Activar/Desactivar de microfono (Alt + D)');
        });
    });

    /**
     * Group 3: video toggle
     * =====================
     */
    describe('Toggle de video (cámara)', ()=>{
        it('debe iniciar con el video desactivado', () => {
            renderWithRouter(<MeetingPage/>)
            
            expect(screen.getByText('Activar cámara')).toBeInTheDocument();
            expect(screen.getByText('🚫')).toBeInTheDocument();
        });

        it('debe cambiar a "Desactivar" al hacer click', () => {
            renderWithRouter(<MeetingPage/>)
            
            const videoButton = screen.getByTitle(/Activar\/Desactivar de cámara/i);
            
            fireEvent.click(videoButton);
            
            expect(screen.getByText('Desactivar cámara')).toBeInTheDocument();
            expect(screen.getByText('📷')).toBeInTheDocument();
        });

        it('debe alternar entre activado y desactivado', () => {
            renderWithRouter(<MeetingPage/>)
            
            const videoButton = screen.getByTitle(/Activar\/Desactivar de cámara/i);
            
            // Primera vez - activar
            fireEvent.click(videoButton);
            expect(screen.getByText('Desactivar cámara')).toBeInTheDocument();
            
            // Segunda vez - desactivar
            fireEvent.click(videoButton);
            expect(screen.getByText('Activar cámara')).toBeInTheDocument();
        });

        it('debe tener el emoji correcto según el estado', () => {
            renderWithRouter(<MeetingPage/>)
            
            const videoButton = screen.getByTitle(/Activar\/Desactivar de cámara/i);
            
            // Desactivado
            expect(screen.getByText('🚫')).toBeInTheDocument();
            
            // Activado
            fireEvent.click(videoButton);
            expect(screen.getByText('📷')).toBeInTheDocument();
        });

        it('debe tener el atributo title correcto', () => {
            renderWithRouter(<MeetingPage/>)
            
            const videoButton = screen.getByTitle(/Activar\/Desactivar de cámara/i);
            
            expect(videoButton).toHaveAttribute('title', 'Activar/Desactivar de cámara (Alt + E)');
        });

        it('debe poder activar audio y video independientemente', () => {
            renderWithRouter(<MeetingPage/>)
            
            const audioButton = screen.getByTitle(/Activar\/Desactivar de microfono/i);
            const videoButton = screen.getByTitle(/Activar\/Desactivar de cámara/i);
            
            // Activar solo audio
            fireEvent.click(audioButton);
            expect(screen.getByText('Desactivar micrófono')).toBeInTheDocument();
            expect(screen.getByText('Activar cámara')).toBeInTheDocument();
            
            // Ahora activar video también
            fireEvent.click(videoButton);
            expect(screen.getByText('Desactivar micrófono')).toBeInTheDocument();
            expect(screen.getByText('Desactivar cámara')).toBeInTheDocument();
        });
    });

    /**
     * Group 4: chat panel
     * ===================
     */
    describe('Panel de chat',()=>{
        it('debe abrir el chat al hacer click en el botón', () => {
            renderWithRouter(<MeetingPage/>)
            
            const chatButton = screen.getByTitle('Chat (Alt + C)');
            
            fireEvent.click(chatButton);
            
            expect(screen.getByText('Chat de la reunión')).toBeInTheDocument();
        });

        it('debe cerrar el chat al hacer click de nuevo', () => {
            renderWithRouter(<MeetingPage/>)
            
            const chatButton = screen.getByTitle('Chat (Alt + C)');
            
            // Abrir
            fireEvent.click(chatButton);
            expect(screen.getByText('Chat de la reunión')).toBeInTheDocument();
            
            // Cerrar
            fireEvent.click(chatButton);
            expect(screen.queryByText('Chat de la reunión')).not.toBeInTheDocument();
        });

        it('debe mostrar el input de mensaje cuando el chat está abierto', () => {
            renderWithRouter(<MeetingPage/>)
            
            const chatButton = screen.getByTitle('Chat (Alt + C)');
            fireEvent.click(chatButton);
            
            const input = screen.getByPlaceholderText('Escribe un mensaje...');
            expect(input).toBeInTheDocument();
        });

        it('debe mostrar el botón de enviar cuando el chat está abierto', () => {
            renderWithRouter(<MeetingPage/>)
            
            const chatButton = screen.getByTitle('Chat (Alt + C)');
            fireEvent.click(chatButton);
            
            const sendButton = screen.getByText('➤');
            expect(sendButton).toBeInTheDocument();
        });

        it('debe tener el botón de cerrar (X) en el chat', () => {
            renderWithRouter(<MeetingPage/>)
            
            const chatButton = screen.getByTitle('Chat (Alt + C)');
            fireEvent.click(chatButton);
            
            const closeButton = screen.getByLabelText('Cerrar chat');
            expect(closeButton).toBeInTheDocument();
            expect(closeButton.textContent).toBe('✕');
        });

        it('debe cerrar el chat con el botón X', () => {
            renderWithRouter(<MeetingPage/>)
            
            // Abrir chat
            const chatButton = screen.getByTitle('Chat (Alt + C)');
            fireEvent.click(chatButton);
            
            // Cerrar con X
            const closeButton = screen.getByLabelText('Cerrar chat');
            fireEvent.click(closeButton);
            
            expect(screen.queryByText('Chat de la reunión')).not.toBeInTheDocument();
        });
    });
});