// =====================================
// VARIABLES GLOBALES
// =====================================
let currentStep = 1;
let calendarMonth = 0;
let calendarYear = 2025;
let selectedCalendarDate = null;
let selectedHora = null;
let currentCancha = null;
let currentPrecio = 0;

let userPreferences = {
    hour: null,
    date: null,
    city: null
};

const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const weekdayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

// =====================================
// ONBOARDING - PASO 1: HORARIO
// =====================================
function nextStep() {
    if (currentStep === 1) {
        const hour = document.getElementById('hourSelect').value;
        if (!hour) {
            alert('Por favor selecciona un horario');
            return;
        }
        userPreferences.hour = hour;
    } else if (currentStep === 2) {
        const date = document.getElementById('dateSelect').value;
        if (!date) {
            alert('Por favor selecciona una fecha');
            return;
        }
        userPreferences.date = date;
    }
    currentStep++;
    updateOnboardingUI();
}

// =====================================
// ONBOARDING - PASO ANTERIOR
// =====================================
function prevStep() {
    currentStep--;
    updateOnboardingUI();
}

// =====================================
// ACTUALIZAR UI DEL ONBOARDING
// =====================================
function updateOnboardingUI() {
    document.querySelectorAll('[id^="step"]').forEach(el => el.classList.add('hidden'));
    document.getElementById(`step${currentStep}`).classList.remove('hidden');
    const progress = (currentStep / 3) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
}

// =====================================
// USAR GPS PARA UBICACIÓN
// =====================================
function useGPS() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userPreferences.city = 'Mi ubicación (GPS)';
                alert('✓ Ubicación detectada correctamente');
                completeOnboarding();
            },
            (error) => {
                alert('No se pudo acceder al GPS. Por favor selecciona una ciudad.');
            }
        );
    } else {
        alert('GPS no disponible en tu dispositivo');
    }
}

// =====================================
// COMPLETAR ONBOARDING
// =====================================
function completeOnboarding() {
    const city = document.getElementById('citySelect').value || userPreferences.city;
    
    if (!city && !userPreferences.city) {
        alert('Por favor selecciona una ciudad o usa GPS');
        return;
    }
    
    if (!userPreferences.hour || !userPreferences.date) {
        alert('Por favor completa todos los pasos');
        return;
    }

    userPreferences.city = city;

    // Ocultar modal y mostrar pantalla principal
    document.getElementById('onboardingModal').classList.add('hidden');
    document.getElementById('mainScreen').classList.remove('hidden');

    // Actualizar header
    const dateObj = new Date(userPreferences.date);
    const dateStr = dateObj.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('headerInfo').textContent = `${userPreferences.hour} • ${dateStr} • ${userPreferences.city}`;

    // Generar calendario y canchas
    generateCalendar();
    selectCalendarDate(dateObj.getDate());
    generateCanchasGrid();
}

// =====================================
// GENERAR CALENDARIO
// =====================================
function generateCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    calendarGrid.innerHTML = '';

    document.getElementById('calendarMonth').textContent = `${monthNames[calendarMonth]} ${calendarYear}`;

    const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const prevDaysInMonth = new Date(calendarYear, calendarMonth, 0).getDate();

    // Días del mes anterior
    for (let i = firstDay - 1; i >= 0; i--) {
        const btn = document.createElement('button');
        btn.className = 'text-center py-3 rounded-lg font-semibold text-gray-400 bg-gray-100 cursor-default';
        btn.textContent = prevDaysInMonth - i;
        btn.disabled = true;
        calendarGrid.appendChild(btn);
    }

    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
        const btn = document.createElement('button');
        const isToday = day === 4;
        const isSelected = selectedCalendarDate &&
                          selectedCalendarDate.getDate() === day &&
                          selectedCalendarDate.getMonth() === calendarMonth &&
                          selectedCalendarDate.getFullYear() === calendarYear;

        btn.className = 'text-center py-3 rounded-lg font-semibold transition cursor-pointer ';

        if (isSelected) {
            btn.className += 'bg-emerald-600 text-white hover:bg-emerald-700';
        } else if (isToday) {
            btn.className += 'border-2 border-emerald-300 text-gray-700 hover:bg-emerald-100';
        } else {
            btn.className += 'bg-gray-100 text-gray-700 hover:bg-gray-200';
        }

        btn.textContent = day;
        btn.onclick = () => selectCalendarDate(day);
        calendarGrid.appendChild(btn);
    }

    // Días del mes siguiente
    const totalCells = calendarGrid.children.length;
    const remainingCells = 42 - totalCells;
    for (let i = 1; i <= remainingCells; i++) {
        const btn = document.createElement('button');
        btn.className = 'text-center py-3 rounded-lg font-semibold text-gray-400 bg-gray-100 cursor-default';
        btn.textContent = i;
        btn.disabled = true;
        calendarGrid.appendChild(btn);
    }
}

// =====================================
// SELECCIONAR FECHA DEL CALENDARIO
// =====================================
function selectCalendarDate(day) {
    selectedCalendarDate = new Date(calendarYear, calendarMonth, day);
    const dateStr = selectedCalendarDate.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('selectedDayInfo').textContent = dateStr;
    document.getElementById('hourDisplay').textContent = userPreferences.hour;
    generateCalendar();
}

// =====================================
// NAVEGAR MES ANTERIOR
// =====================================
function prevCalendarMonth() {
    calendarMonth--;
    if (calendarMonth < 0) {
        calendarMonth = 11;
        calendarYear--;
    }
    generateCalendar();
}

// =====================================
// NAVEGAR MES SIGUIENTE
// =====================================
function nextCalendarMonth() {
    calendarMonth++;
    if (calendarMonth > 11) {
        calendarMonth = 0;
        calendarYear++;
    }
    generateCalendar();
}

// =====================================
// GENERAR CATÁLOGO DE CANCHAS
// =====================================
function generateCanchasGrid() {
    const canchas = [
        { id: 1, nombre: 'Cancha Premium', tipo: 'Fútbol 5', precio: 45, estrellas: 5, superficie: 'Pasto Sintético', capacidad: '5v5' },
        { id: 2, nombre: 'Cancha Deportiva', tipo: 'Fútbol 7', precio: 60, estrellas: 4, superficie: 'Pasto Sintético', capacidad: '7v7' },
        { id: 3, nombre: 'Estadio Municipal', tipo: 'Fútbol 11', precio: 120, estrellas: 5, superficie: 'Pasto Natural', capacidad: '11v11' },
        { id: 4, nombre: 'Cancha Elite', tipo: 'Fútbol 5', precio: 50, estrellas: 5, superficie: 'Pasto Sintético Premium', capacidad: '5v5' },
        { id: 5, nombre: 'Cancha Plus', tipo: 'Fútbol 7', precio: 65, estrellas: 5, superficie: 'Pasto Sintético', capacidad: '7v7' },
        { id: 6, nombre: 'Cancha Star', tipo: 'Fútbol 11', precio: 130, estrellas: 5, superficie: 'Pasto Natural Premium', capacidad: '11v11' },
        { id: 7, nombre: 'Cancha Gold', tipo: 'Fútbol 5', precio: 55, estrellas: 4, superficie: 'Pasto Sintético', capacidad: '5v5' },
        { id: 8, nombre: 'Cancha Pro', tipo: 'Fútbol 7', precio: 70, estrellas: 4, superficie: 'Pasto Sintético Premium', capacidad: '7v7' },
    ];

    const grid = document.getElementById('canchasGrid');
    grid.innerHTML = '';

    canchas.forEach(cancha => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg hover:border-emerald-300 transition overflow-hidden cursor-pointer group';
        card.onclick = () => openHorarioModal(cancha.id, cancha.nombre, cancha.precio);

        const estrellas = '⭐'.repeat(cancha.estrellas);
        const colores = [
            'from-emerald-300 to-teal-400',
            'from-teal-300 to-cyan-400',
            'from-green-400 to-emerald-500',
            'from-emerald-400 to-green-500',
            'from-teal-400 to-cyan-500',
            'from-green-500 to-emerald-600',
            'from-emerald-500 to-teal-600',
            'from-cyan-400 to-teal-500'
        ];
        const color = colores[cancha.id - 1];

        card.innerHTML = `
            <div class="relative h-40 bg-gradient-to-br ${color} flex items-center justify-center text-5xl">
                ⚽
            </div>
            <div class="p-4">
                <h4 class="font-bold text-gray-900 text-sm mb-1 group-hover:text-emerald-700 transition">${cancha.nombre}</h4>
                <p class="text-xs text-gray-600 mb-2">${cancha.tipo}</p>
                <p class="text-xs text-yellow-500 font-bold mb-3">${estrellas}</p>
                <div class="mb-3 pb-3 border-b border-gray-200">
                    <p class="text-lg font-black text-emerald-600">S/ ${cancha.precio}</p>
                    <p class="text-xs text-gray-600">por hora</p>
                </div>
                <div class="space-y-1 text-xs">
                    <p><span class="font-bold">Superficie:</span> ${cancha.superficie}</p>
                    <p><span class="font-bold">Capacidad:</span> ${cancha.capacidad}</p>
                </div>
                <button class="w-full mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-2 rounded-lg transition text-xs">
                    Reservar
                </button>
            </div>
        `;

        grid.appendChild(card);
    });
}

// =====================================
// ABRIR MODAL DE HORARIOS
// =====================================
function openHorarioModal(canchaId, canchaNombre, precio) {
    currentCancha = canchaId;
    currentPrecio = precio;
    selectedHora = null;
    document.getElementById('modalTitle').textContent = canchaNombre;
    document.getElementById('horarioModal').classList.remove('hidden');
    document.getElementById('pagarBtn').disabled = true;
    document.querySelectorAll('.hourButton').forEach(btn => {
        btn.classList.remove('border-emerald-600', 'bg-emerald-100');
        if (!btn.classList.contains('booked')) {
            btn.classList.add('border-emerald-200');
        }
    });
}

// =====================================
// CERRAR MODAL DE HORARIOS
// =====================================
function closeHorarioModal() {
    document.getElementById('horarioModal').classList.add('hidden');
}

// =====================================
// SELECCIONAR HORARIO
// =====================================
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.hourButton.available').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.hourButton').forEach(btn => {
                btn.classList.remove('border-emerald-600', 'bg-emerald-100');
                if (!btn.classList.contains('booked')) {
                    btn.classList.add('border-emerald-200');
                }
            });

            this.classList.add('border-emerald-600', 'bg-emerald-100');
            selectedHora = this.getAttribute('data-hora');

            const horaInt = parseInt(selectedHora.split(':')[0]);
            document.getElementById('detalleHora').textContent = `${selectedHora} - ${String(horaInt + 1).padStart(2, '0')}:00`;
            document.getElementById('detallePrecio').textContent = `S/ ${currentPrecio}`;

            enablePayButton();
        });
    });

    // =====================================
    // SELECCIONAR MÉTODO DE PAGO
    // =====================================
    document.querySelectorAll('.paymentMethod').forEach(method => {
        method.addEventListener('click', function() {
            document.querySelectorAll('.paymentMethod div').forEach(m => {
                m.classList.remove('border-emerald-600', 'bg-emerald-50');
                m.classList.add('border-gray-200');
            });
            this.querySelector('div').classList.add('border-emerald-600', 'bg-emerald-50');
            this.querySelector('div').classList.remove('border-gray-200');
            enablePayButton();
        });
    });

    document.getElementById('acceptTerms')?.addEventListener('change', enablePayButton);
});

// =====================================
// HABILITAR BOTÓN PAGAR
// =====================================
function enablePayButton() {
    const btn = document.getElementById('pagarBtn');
    const terms = document.getElementById('acceptTerms');
    if (terms?.checked && selectedHora) {
        btn.disabled = false;
    } else {
        btn.disabled = true;
    }
}

// =====================================
// PROCESAR PAGO
// =====================================
function procesarPago() {
    if (!selectedHora) {
        alert('Por favor selecciona un horario');
        return;
    }

    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
    const paymentNames = {
        'credit_card': 'Tarjeta de Crédito',
        'debit_card': 'Tarjeta de Débito',
        'yape': 'Yapeí',
        'plin': 'Plin',
        'transfer': 'Transferencia Bancaria',
        'cash': 'Efectivo'
    };

    const methodName = paymentNames[paymentMethod] || 'Desconocido';
    alert(`✓ ¡Reserva confirmada!\n\nCancha: ${document.getElementById('modalTitle').textContent}\nHorario: ${document.getElementById('detalleHora').textContent}\nTotal: ${document.getElementById('detallePrecio').textContent}\nMétodo: ${methodName}`);
    
    closeHorarioModal();
}

// =====================================
// ABRIR MODAL DE FILTROS
// =====================================
function openFilterModal() {
    document.getElementById('filterModal').classList.remove('hidden');
}

// =====================================
// CERRAR MODAL DE FILTROS
// =====================================
function closeFilterModal() {
    document.getElementById('filterModal').classList.add('hidden');
}

// =====================================
// APLICAR FILTROS
// =====================================
function applyFilters() {
    alert('✓ Filtros aplicados correctamente');
    closeFilterModal();
}