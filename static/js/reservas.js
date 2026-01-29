// ============================================
// GESTIÓN DE PRECIOS
// ============================================
const priceMin = document.getElementById('priceMin');
const priceMax = document.getElementById('priceMax');
const minDisplay = document.getElementById('minDisplay');
const maxDisplay = document.getElementById('maxDisplay');

if (priceMin) {
    priceMin.addEventListener('input', () => {
        minDisplay.textContent = priceMin.value;
    });
}

if (priceMax) {
    priceMax.addEventListener('input', () => {
        maxDisplay.textContent = priceMax.value;
    });
}

// ============================================
// NAVEGACIÓN CALENDARIO
// ============================================
let currentMonth = 0;
let currentYear = 2025;

const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const weekdayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    updateMonthYear();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    updateMonthYear();
}

function updateMonthYear() {
    const monthYearEl = document.getElementById('monthYear');
    if (monthYearEl) {
        monthYearEl.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    }
}

// ============================================
// SELECCIÓN DE FECHAS
// ============================================
document.querySelectorAll('.dateBtn').forEach(button => {
    button.addEventListener('click', function() {
        const allButtons = document.querySelectorAll('.dateBtn');
        allButtons.forEach(btn => {
            btn.classList.remove('bg-emerald-600', 'text-white', 'font-black', 'shadow-lg', 'hover:shadow-xl', 'ring-2', 'ring-emerald-300');
            btn.classList.add('text-gray-700', 'font-bold', 'hover:bg-emerald-100', 'hover:shadow-md');
        });
        
        this.classList.remove('text-gray-700', 'font-bold', 'hover:bg-emerald-100', 'hover:shadow-md');
        this.classList.add('bg-emerald-600', 'text-white', 'font-black', 'shadow-lg', 'hover:shadow-xl', 'ring-2', 'ring-emerald-300', 'hover:bg-emerald-700');
        
        const day = this.getAttribute('data-date');
        const selectedDate = new Date(currentYear, currentMonth, parseInt(day));
        const weekday = weekdayNames[selectedDate.getDay()];
        
        const dateText = `${weekday}, ${day} de ${monthNames[currentMonth]} de ${currentYear}`;
        const selectedDateText = document.getElementById('selectedDateText');
        if (selectedDateText) {
            selectedDateText.textContent = dateText;
        }
        
        console.log('Fecha seleccionada:', dateText);
    });
});

// ============================================
// CAMBIO DE VISTA (MES/SEMANA)
// ============================================
let currentView = 'month';
let currentWeekStart = 4; // Enero 4

function switchView(view) {
    currentView = view;
    const monthView = document.getElementById('monthView');
    const weekView = document.getElementById('weekView');
    const monthBtn = document.getElementById('monthViewBtn');
    const weekBtn = document.getElementById('weekViewBtn');
    
    if (view === 'month') {
        monthView.classList.remove('hidden');
        weekView.classList.add('hidden');
        
        monthBtn.classList.add('border-emerald-200', 'bg-white', 'text-emerald-700', 'border-2');
        monthBtn.classList.remove('border-gray-300', 'text-gray-700', 'border');
        weekBtn.classList.remove('border-emerald-200', 'bg-white', 'text-emerald-700', 'border-2');
        weekBtn.classList.add('border-gray-300', 'text-gray-700', 'border');
        console.log('✓ Vista de Mes activada');
    } else if (view === 'week') {
        monthView.classList.add('hidden');
        weekView.classList.remove('hidden');
        
        weekBtn.classList.add('border-emerald-200', 'bg-white', 'text-emerald-700', 'border-2');
        weekBtn.classList.remove('border-gray-300', 'text-gray-700', 'border');
        monthBtn.classList.remove('border-emerald-200', 'bg-white', 'text-emerald-700', 'border-2');
        monthBtn.classList.add('border-gray-300', 'text-gray-700', 'border');
        updateWeekDisplay();
        console.log('✓ Vista de Semana activada');
    }
}

function updateWeekDisplay() {
    const weekRange = document.getElementById('weekRange');
    const weekRangeEnd = currentWeekStart + 6;
    if (weekRange) {
        weekRange.textContent = `${currentWeekStart} - ${weekRangeEnd} de Enero`;
    }
}

function previousWeek() {
    currentWeekStart -= 7;
    if (currentWeekStart < 1) {
        currentWeekStart = 25; // Mes anterior
    }
    updateWeekDisplay();
}

function nextWeek() {
    currentWeekStart += 7;
    if (currentWeekStart > 31) {
        currentWeekStart = 7; // Mes siguiente
    }
    updateWeekDisplay();
}

// ============================================
// MODAL HORARIOS
// ============================================
let selectedHora = null;
let currentCancha = null;
let currentPrecio = 0;

function openHorarioModal(canchaId, canchaNombre, fecha, precio) {
    currentCancha = canchaId;
    currentPrecio = precio;
    selectedHora = null;
    
    const modal = document.getElementById('horarioModal');
    const title = document.getElementById('modalTitle');
    const subtitle = document.getElementById('modalSubtitle');
    
    if (modal && title && subtitle) {
        title.textContent = canchaNombre;
        subtitle.textContent = fecha;
        modal.classList.remove('hidden');
        
        document.getElementById('confirmarBtn').disabled = true;
        
        document.querySelectorAll('.hourButton').forEach(btn => {
            btn.classList.remove('border-emerald-600', 'bg-emerald-100', 'selected');
            if (!btn.classList.contains('booked')) {
                btn.classList.add('border-emerald-200');
            }
        });
    }
}

function closeHorarioModal() {
    const modal = document.getElementById('horarioModal');
    if (modal) {
        modal.classList.add('hidden');
        selectedHora = null;
    }
}

// ============================================
// SELECCIÓN DE HORARIOS
// ============================================
document.querySelectorAll('.hourButton.available').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.hourButton').forEach(btn => {
            btn.classList.remove('border-emerald-600', 'bg-emerald-100', 'selected', 'border-2');
            if (!btn.classList.contains('booked')) {
                btn.classList.add('border-emerald-200');
            }
        });
        
        this.classList.add('border-emerald-600', 'bg-emerald-100', 'selected', 'border-2');
        this.classList.remove('border-emerald-200');
        
        selectedHora = this.getAttribute('data-hora');
        
        const horaInt = parseInt(selectedHora.split(':')[0]);
        const detalleHora = document.getElementById('detalleHora');
        if (detalleHora) {
            detalleHora.textContent = `${selectedHora} - ${String(horaInt + 1).padStart(2, '0')}:00`;
        }
        
        const detallePrecio = document.getElementById('detallePrecio');
        if (detallePrecio) {
            detallePrecio.textContent = `$${currentPrecio}`;
        }
        
        const confirmarBtn = document.getElementById('confirmarBtn');
        if (confirmarBtn) {
            confirmarBtn.disabled = false;
        }
    });
});

// ============================================
// CONFIRMACIÓN DE RESERVA
// ============================================
function confirmarReserva() {
    if (!selectedHora) {
        alert('Por favor selecciona un horario');
        return;
    }
    
    const detalleHora = document.getElementById('detalleHora')?.textContent || selectedHora;
    const detallePrecio = document.getElementById('detallePrecio')?.textContent || `$${currentPrecio}`;
    const selectedDateText = document.getElementById('selectedDateText')?.textContent || 'Fecha no especificada';
    
    console.log('✓ Reserva confirmada:', {
        cancha: currentCancha,
        fecha: selectedDateText,
        hora: selectedHora,
        precio: currentPrecio
    });
    
    alert(`✓ ¡Reserva confirmada!\n\nFecha: ${selectedDateText}\nHorario: ${detalleHora}\nPrecio: ${detallePrecio}`);
    closeHorarioModal();
}

// ============================================
// CERRAR MODAL CON ESC
// ============================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeHorarioModal();
    }
});

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    updateMonthYear();
    console.log('✓ Sistema de reservas cargado correctamente');
});