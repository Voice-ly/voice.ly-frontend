type ToastType = 'success' | 'error' | 'warning' | 'info';

export function showToast(message: string, type: ToastType = 'info') {
  const body = document.body;
  if (!body) {
    console.warn(' No se encontró el elemento <body>.');
    return;
  }

  // Crear contenedor si no existe
  let container = document.getElementById('global-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'global-toast-container';
    container.className = `
      fixed top-5 right-5 z-[9999]
      flex flex-col gap-3 items-end
      pointer-events-none
    `;
    body.appendChild(container);
  }

  const colors: Record<ToastType, string> = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    warning: 'bg-yellow-400 text-black',
    info: 'bg-blue-600 text-white',
  };

  const toast = document.createElement('div');
  toast.className = `
    ${colors[type]}
    px-4 py-2 rounded-lg shadow-lg text-sm font-medium
    transform transition-all duration-500
    opacity-0 translate-x-5
    pointer-events-auto
  `;
  toast.textContent = message;

  container.appendChild(toast);

  // Animación de entrada
  requestAnimationFrame(() => {
    toast.classList.remove('opacity-0', 'translate-x-5');
    toast.classList.add('opacity-100', 'translate-x-0');
  });

  // Eliminación automática
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-x-5');
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}
