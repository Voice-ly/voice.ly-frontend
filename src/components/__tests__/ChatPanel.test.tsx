import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatPanel from '../ChatPanel';
import { useChatSocketStore } from '../../stores/useChatSocketStore';
import { useUserStore } from '../../stores/useUserStore';

// Mock de los stores
jest.mock('../stores/useChatSocketStore');
jest.mock('../stores/useUserStore');

// Mock de localStorage
const mockLocalStorage = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    clear: () => { store = {}; }
  };
})();
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('ChatPanel', () => {
  // Setup común para todas las pruebas
  const mockSocket = {
    emit: jest.fn(),
    on: jest.fn(),
    off: jest.fn()
  };

  const mockConnect = jest.fn();
  const mockOnClose = jest.fn();
  const mockMessagesEndRef = { current: null };

  const defaultProps = {
    roomId: 'room-123',
    messagesEndRef: mockMessagesEndRef,
    showChat: true,
    onClose: mockOnClose
  };

  beforeEach(() => {
    // Limpiar mocks antes de cada prueba
    jest.clearAllMocks();
    mockLocalStorage.clear();
    
    // Configurar stores mockeados
    (useChatSocketStore as jest.Mock).mockReturnValue({
      socket: mockSocket,
      connect: mockConnect
    });

    (useUserStore as jest.Mock).mockReturnValue({
      profile: { id: 'user-1', firstName: 'Juan' }
    });

    mockLocalStorage.setItem('token', 'fake-token');
  });

  // ==========================================
  // PRUEBAS DE RENDERIZADO
  // ==========================================

  describe('Renderizado', () => {
    it('debe renderizar el título del chat', () => {
      render(<ChatPanel {...defaultProps} />);
      expect(screen.getByText('Chat de la reunión')).toBeInTheDocument();
    });

    it('debe mostrar mensaje cuando no hay mensajes', () => {
      render(<ChatPanel {...defaultProps} />);
      expect(screen.getByText('No hay mensajes aún.')).toBeInTheDocument();
    });

    it('debe renderizar el input de texto', () => {
      render(<ChatPanel {...defaultProps} />);
      const input = screen.getByPlaceholderText('Escribe un mensaje...');
      expect(input).toBeInTheDocument();
    });

    it('debe renderizar el botón de enviar', () => {
      render(<ChatPanel {...defaultProps} />);
      const sendButton = screen.getByText('➤');
      expect(sendButton).toBeInTheDocument();
    });

    it('debe renderizar el botón de cerrar', () => {
      render(<ChatPanel {...defaultProps} />);
      const closeButton = screen.getByLabelText('Cerrar chat');
      expect(closeButton).toBeInTheDocument();
    });
  });

  // ==========================================
  // PRUEBAS DE VISIBILIDAD Y ANIMACIÓN
  // ==========================================

  describe('Visibilidad', () => {
    it('debe tener clase translate-x-0 cuando showChat es true', () => {
      const { container } = render(<ChatPanel {...defaultProps} showChat={true} />);
      const chatPanel = container.firstChild as HTMLElement;
      expect(chatPanel.className).toContain('translate-x-0');
    });

    it('debe tener clase translate-x-full cuando showChat es false', () => {
      const { container } = render(<ChatPanel {...defaultProps} showChat={false} />);
      const chatPanel = container.firstChild as HTMLElement;
      expect(chatPanel.className).toContain('translate-x-full');
    });
  });

  // ==========================================
  // PRUEBAS DE INTERACCIÓN
  // ==========================================

  describe('Interacciones del usuario', () => {
    it('debe actualizar el input al escribir', () => {
      render(<ChatPanel {...defaultProps} />);
      const input = screen.getByPlaceholderText('Escribe un mensaje...') as HTMLInputElement;
      
      fireEvent.change(input, { target: { value: 'Hola mundo' } });
      
      expect(input.value).toBe('Hola mundo');
    });

    it('debe llamar onClose al hacer clic en el botón X', () => {
      render(<ChatPanel {...defaultProps} />);
      const closeButton = screen.getByLabelText('Cerrar chat');
      
      fireEvent.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('debe limpiar el input después de enviar un mensaje', () => {
      render(<ChatPanel {...defaultProps} />);
      const input = screen.getByPlaceholderText('Escribe un mensaje...') as HTMLInputElement;
      const sendButton = screen.getByText('➤');
      
      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.click(sendButton);
      
      expect(input.value).toBe('');
    });

    it('debe enviar mensaje al presionar Enter', async () => {
      render(<ChatPanel {...defaultProps} />);
      const input = screen.getByPlaceholderText('Escribe un mensaje...');
      
      fireEvent.change(input, { target: { value: 'Mensaje con Enter' } });
      fireEvent.keyDown(window, { key: 'Enter' });
      
      await waitFor(() => {
        expect(mockSocket.emit).toHaveBeenCalledWith('send_message', {
          meetingId: 'room-123',
          message: 'Mensaje con Enter'
        });
      });
    });
  });

  // ==========================================
  // PRUEBAS DE LÓGICA DE NEGOCIO
  // ==========================================

  describe('Lógica de envío de mensajes', () => {
    it('debe emitir evento send_message con datos correctos', () => {
      render(<ChatPanel {...defaultProps} />);
      const input = screen.getByPlaceholderText('Escribe un mensaje...') as HTMLInputElement;
      const sendButton = screen.getByText('➤');
      
      fireEvent.change(input, { target: { value: 'Mensaje de prueba' } });
      fireEvent.click(sendButton);
      
      expect(mockSocket.emit).toHaveBeenCalledWith('send_message', {
        meetingId: 'room-123',
        message: 'Mensaje de prueba'
      });
    });

    it('NO debe enviar mensajes vacíos', () => {
      render(<ChatPanel {...defaultProps} />);
      const sendButton = screen.getByText('➤');
      
      fireEvent.click(sendButton);
      
      expect(mockSocket.emit).not.toHaveBeenCalled();
    });

    it('NO debe enviar mensajes solo con espacios', () => {
      render(<ChatPanel {...defaultProps} />);
      const input = screen.getByPlaceholderText('Escribe un mensaje...');
      const sendButton = screen.getByText('➤');
      
      fireEvent.change(input, { target: { value: '   ' } });
      fireEvent.click(sendButton);
      
      expect(mockSocket.emit).not.toHaveBeenCalled();
    });

    it('NO debe enviar si no hay roomId', () => {
      render(<ChatPanel {...defaultProps} roomId={undefined} />);
      const input = screen.getByPlaceholderText('Escribe un mensaje...') as HTMLInputElement;
      const sendButton = screen.getByText('➤');
      
      fireEvent.change(input, { target: { value: 'Test' } });
      fireEvent.click(sendButton);
      
      expect(mockSocket.emit).not.toHaveBeenCalled();
    });
  });

  // ==========================================
  // PRUEBAS DE CONEXIÓN SOCKET
  // ==========================================

  describe('Conexión Socket', () => {
    it('debe conectar al socket al montar si hay token', () => {
      mockLocalStorage.setItem('token', 'valid-token');
      
      render(<ChatPanel {...defaultProps} />);
      
      expect(mockConnect).toHaveBeenCalledWith('valid-token');
    });

    it('NO debe conectar si no hay token', () => {
      mockLocalStorage.clear();
      
      render(<ChatPanel {...defaultProps} />);
      
      expect(mockConnect).not.toHaveBeenCalled();
    });

    it('debe unirse al room al montar', () => {
      render(<ChatPanel {...defaultProps} />);
      
      expect(mockSocket.emit).toHaveBeenCalledWith('join_room', {
        meetingId: 'room-123'
      });
    });

    it('debe registrar listeners de socket', () => {
      render(<ChatPanel {...defaultProps} />);
      
      expect(mockSocket.on).toHaveBeenCalledWith('receive_message', expect.any(Function));
      expect(mockSocket.on).toHaveBeenCalledWith('room_participants', expect.any(Function));
    });

    it('debe limpiar listeners al desmontar', () => {
      const { unmount } = render(<ChatPanel {...defaultProps} />);
      
      unmount();
      
      expect(mockSocket.off).toHaveBeenCalledWith('receive_message', expect.any(Function));
      expect(mockSocket.off).toHaveBeenCalledWith('room_participants', expect.any(Function));
    });
  });

  // ==========================================
  // PRUEBAS DE MENSAJES
  // ==========================================

  describe('Renderizado de mensajes', () => {
    it('debe renderizar mensajes recibidos', async () => {
      render(<ChatPanel {...defaultProps} />);
      
      // Simular recepción de mensaje
      const receiveMessageCallback = (mockSocket.on as jest.Mock).mock.calls
        .find(call => call[0] === 'receive_message')?.[1];
      
      const mockMessage = {
        meetingId: 'room-123',
        senderId: 'user-2',
        message: 'Hola a todos',
        createdAt: Date.now()
      };
      
      receiveMessageCallback(mockMessage);
      
      await waitFor(() => {
        expect(screen.getByText(/Hola a todos/)).toBeInTheDocument();
      });
    });

    it('debe mostrar el nombre del usuario actual correctamente', async () => {
      render(<ChatPanel {...defaultProps} />);
      
      const receiveMessageCallback = (mockSocket.on as jest.Mock).mock.calls
        .find(call => call[0] === 'receive_message')?.[1];
      
      const mockMessage = {
        meetingId: 'room-123',
        senderId: 'user-1', // ID del usuario actual
        message: 'Mi mensaje',
        createdAt: Date.now()
      };
      
      receiveMessageCallback(mockMessage);
      
      await waitFor(() => {
        expect(screen.getByText(/Juan/)).toBeInTheDocument();
      });
    });

    it('debe mostrar "Usuario" para participantes desconocidos', async () => {
      render(<ChatPanel {...defaultProps} />);
      
      const receiveMessageCallback = (mockSocket.on as jest.Mock).mock.calls
        .find(call => call[0] === 'receive_message')?.[1];
      
      const mockMessage = {
        meetingId: 'room-123',
        senderId: 'unknown-user',
        message: 'Mensaje anónimo',
        createdAt: Date.now()
      };
      
      receiveMessageCallback(mockMessage);
      
      await waitFor(() => {
        expect(screen.getByText(/Usuario/)).toBeInTheDocument();
      });
    });
  });

  // ==========================================
  // PRUEBAS DE EDGE CASES
  // ==========================================

  describe('Casos edge', () => {
    it('debe manejar roomId undefined', () => {
      expect(() => {
        render(<ChatPanel {...defaultProps} roomId={undefined} />);
      }).not.toThrow();
    });

    it('debe manejar socket null', () => {
      (useChatSocketStore as jest.Mock).mockReturnValue({
        socket: null,
        connect: mockConnect
      });
      
      expect(() => {
        render(<ChatPanel {...defaultProps} />);
      }).not.toThrow();
    });

    it('debe prevenir el comportamiento por defecto de Enter', () => {
      render(<ChatPanel {...defaultProps} />);
      const preventDefault = jest.fn();
      
      fireEvent.keyDown(window, { 
        key: 'Enter', 
        preventDefault 
      });
      
      expect(preventDefault).toHaveBeenCalled();
    });
  });
});