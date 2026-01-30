  function switchTab(tabName, button) {
            // Ocultar todos los tabs
            const tabs = document.querySelectorAll('.tab-content');
            tabs.forEach(tab => tab.classList.add('hidden'));

            // Mostrar el tab seleccionado
            const selectedTab = document.getElementById(tabName);
            if (selectedTab) {
                selectedTab.classList.remove('hidden');
            }

            // Actualizar estilos de los botones
            const buttons = document.querySelectorAll('.tab-btn');
            buttons.forEach(btn => {
                btn.classList.remove('text-emerald-600', 'border-b-emerald-600');
                btn.classList.add('text-slate-600', 'border-b-transparent');
            });
            
            // Marcar el botón activo
            button.classList.remove('text-slate-600', 'border-b-transparent');
            button.classList.add('text-emerald-600', 'border-b-4', 'border-b-emerald-600');
        }