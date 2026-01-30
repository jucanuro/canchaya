 // Toggle simple para el menú móvil
  const toggleBtn = document.getElementById('nav-toggle');
  const mobilePanel = document.getElementById('mobile-panel');
  const nav = document.getElementById('primary-navigation');

  toggleBtn.addEventListener('click', () => {
    const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', String(!expanded));
    mobilePanel.classList.toggle('hidden');
  });

  // Cerrar menú al cambiar tamaño de ventana
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      mobilePanel.classList.add('hidden');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });