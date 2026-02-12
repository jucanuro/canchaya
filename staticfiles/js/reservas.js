// =====================================
// VARIABLES GLOBALES
// =====================================
let currentStep = 1;
let calendarMonth = 0;
let calendarYear = 2025;
let selectedCalendarDate = null;

// Array de reservas: cada elemento = { canchaId, canchaNombre, hora, precioHora }
let reservas = [];

let currentCancha = null;
let currentPrecio = 0;
let currentCanchaNombre = '';

// Variables para cervezas
let beerPricePerBox = 50;
let beerQuantity = 0;
let beerTotal = 0;

let userPreferences = {
    hour: null,
    date: null,
    city: null
};

const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// =====================================
// ONBOARDING
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

function prevStep() {
    currentStep--;
    updateOnboardingUI();
}

function updateOnboardingUI() {
    document.querySelectorAll('[id^="step"]').forEach(el => el.classList.add('hidden'));
    document.getElementById(`step${currentStep}`).classList.remove('hidden');
    const progress = (currentStep / 3) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
}

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

    document.getElementById('onboardingModal').classList.add('hidden');
    document.getElementById('mainScreen').classList.remove('hidden');

    const dateObj = new Date(userPreferences.date);
    const dateStr = dateObj.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('headerInfo').textContent = `${userPreferences.hour} • ${dateStr} • ${userPreferences.city}`;

    generateCalendar();
    selectCalendarDate(dateObj.getDate());
    generateCanchasGrid();
}

// =====================================
// CALENDARIO
// =====================================
function generateCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    calendarGrid.innerHTML = '';

    document.getElementById('calendarMonth').textContent = `${monthNames[calendarMonth]} ${calendarYear}`;

    const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const prevDaysInMonth = new Date(calendarYear, calendarMonth, 0).getDate();

    for (let i = firstDay - 1; i >= 0; i--) {
        const btn = document.createElement('button');
        btn.className = 'text-center py-3 rounded-lg font-semibold text-gray-400 bg-gray-100 cursor-default';
        btn.textContent = prevDaysInMonth - i;
        btn.disabled = true;
        calendarGrid.appendChild(btn);
    }

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

function prevCalendarMonth() {
    calendarMonth--;
    if (calendarMonth < 0) {
        calendarMonth = 11;
        calendarYear--;
    }
    generateCalendar();
}

function nextCalendarMonth() {
    calendarMonth++;
    if (calendarMonth > 11) {
        calendarMonth = 0;
        calendarYear++;
    }
    generateCalendar();
}

// =====================================
// CATÁLOGO DE CANCHAS
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
// FUNCIONES DEL CARRITO DE RESERVAS
// =====================================

function agregarReserva(canchaId, canchaNombre, hora, precioHora) {
    const existe = reservas.some(r => r.canchaId === canchaId && r.hora === hora);
    if (!existe) {
        reservas.push({ canchaId, canchaNombre, hora, precioHora });
    }
    renderizarCarrito();
    actualizarTotalesCanchas();
    enablePayButton();
}

function eliminarReserva(canchaId, hora) {
    reservas = reservas.filter(r => !(r.canchaId === canchaId && r.hora === hora));
    renderizarCarrito();
    actualizarTotalesCanchas();
    desmarcarBotonHora(canchaId, hora);
    enablePayButton();
}

function renderizarCarrito() {
    const contenedor = document.getElementById('listaReservas');
    if (!contenedor) return;
    
    if (reservas.length === 0) {
        contenedor.innerHTML = '<div class="text-center text-gray-500 py-4 text-sm">Aún no has seleccionado ninguna cancha.</div>';
        return;
    }

    let html = '';
    reservas.forEach(res => {
        html += `
            <div class="flex items-center justify-between bg-white p-3 rounded-lg border border-emerald-200 shadow-sm">
                <div class="flex-1">
                    <span class="font-bold text-emerald-700">${res.canchaNombre}</span>
                    <span class="text-gray-900 mx-1">•</span>
                    <span class="font-semibold">${res.hora}</span>
                    <span class="text-gray-600 text-sm ml-2">S/ ${res.precioHora}</span>
                </div>
                <button onclick="eliminarReserva(${res.canchaId}, '${res.hora}')" 
                        class="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition"
                        title="Eliminar reserva">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                </button>
            </div>
        `;
    });
    contenedor.innerHTML = html;
}

function desmarcarBotonHora(canchaId, hora) {
    const modalVisible = !document.getElementById('horarioModal').classList.contains('hidden');
    if (modalVisible && currentCancha === canchaId) {
        const botones = document.querySelectorAll('.hourButton.available');
        botones.forEach(btn => {
            if (btn.getAttribute('data-hora') === hora) {
                btn.classList.remove('border-emerald-600', 'border-2', 'bg-emerald-500', 'text-white', 'hover:bg-emerald-600');
                btn.classList.add('border-emerald-200', 'text-gray-900');
                const p = btn.querySelector('p');
                if (p) {
                    p.classList.remove('text-white', 'font-black');
                    p.classList.add('text-gray-900');
                }
            }
        });
    }
}

function actualizarTotalesCanchas() {
    const totalHoras = reservas.length;
    const subtotal = reservas.reduce((acc, r) => acc + r.precioHora, 0);
    
    document.getElementById('cantidadHoras').textContent = totalHoras;
    document.getElementById('subtotalCanchas').textContent = `S/ ${subtotal}`;
    
    const totalGeneral = subtotal + beerTotal;
    document.getElementById('detallePrecio').textContent = `S/ ${totalGeneral}`;
    document.getElementById('detalleCervezasResumen').textContent = `S/ ${beerTotal}`;
}

// =====================================
// CERVEZAS
// =====================================
function updateBeerTotal() {
    const beerSelect = document.getElementById('beerBrand');
    const beerQtyInput = document.getElementById('beerQuantity');
    
    if (beerSelect && beerQtyInput) {
        beerPricePerBox = parseInt(beerSelect.value);
        beerQuantity = parseInt(beerQtyInput.value) || 0;
        if (beerQuantity < 0) beerQuantity = 0;
        beerTotal = beerPricePerBox * beerQuantity;
        
        const subtotalEl = document.getElementById('beerSubtotal');
        if (subtotalEl) subtotalEl.textContent = `S/ ${beerTotal}`;
    }
    actualizarTotalesCanchas();
}

function resetBeerSelection() {
    const beerSelect = document.getElementById('beerBrand');
    const beerQtyInput = document.getElementById('beerQuantity');
    if (beerSelect) beerSelect.value = '50';
    if (beerQtyInput) beerQtyInput.value = 0;
    beerPricePerBox = 50;
    beerQuantity = 0;
    beerTotal = 0;
    
    const subtotalEl = document.getElementById('beerSubtotal');
    if (subtotalEl) subtotalEl.textContent = 'S/ 0';
    actualizarTotalesCanchas();
}

// =====================================
// MODAL DE HORARIOS
// =====================================
function openHorarioModal(canchaId, canchaNombre, precio) {
    currentCancha = canchaId;
    currentPrecio = precio;
    currentCanchaNombre = canchaNombre;
    
    document.getElementById('modalTitle').textContent = canchaNombre;
    document.getElementById('modalCanchaNombre').textContent = canchaNombre;
    
    resetBeerSelection();
    generarBotonesHorario();
    marcarBotonesSeleccionados();
    renderizarCarrito();
    actualizarTotalesCanchas();
    
    document.getElementById('horarioModal').classList.remove('hidden');
    enablePayButton();
}

function generarBotonesHorario() {
    const contenedor = document.getElementById('horarioButtonsContainer');
    const horarios = [
        { hora: '08:00', estado: 'available' },
        { hora: '09:00', estado: 'available' },
        { hora: '10:00', estado: 'booked' },
        { hora: '11:00', estado: 'available' },
        { hora: '14:00', estado: 'available' },
        { hora: '15:00', estado: 'available' },
        { hora: '16:00', estado: 'booked' },
        { hora: '17:00', estado: 'available' }
    ];
    
    let html = '';
    horarios.forEach(h => {
        const disponible = h.estado === 'available';
        const clases = disponible 
            ? 'hourButton available p-5 border-2 border-emerald-200 rounded-xl hover:border-emerald-600 hover:bg-emerald-50 transition cursor-pointer duration-200' 
            : 'hourButton booked p-5 border-2 border-red-200 rounded-xl bg-red-50 cursor-not-allowed opacity-60';
        
        const contenido = disponible
            ? `<p class="font-black text-gray-900 text-xl">${h.hora}</p>`
            : `<p class="font-black text-red-600 text-xl">${h.hora}</p><p class="text-xs text-red-600">Ocupado</p>`;
        
        html += `<button class="${clases}" data-hora="${h.hora}" data-cancha-id="${currentCancha}" data-cancha-nombre="${currentCanchaNombre}" data-precio="${currentPrecio}" ${!disponible ? 'disabled' : ''}>
                    ${contenido}
                </button>`;
    });
    contenedor.innerHTML = html;
    
    document.querySelectorAll('.hourButton.available').forEach(btn => {
        btn.removeEventListener('click', manejarClickHora);
        btn.addEventListener('click', manejarClickHora);
    });
}

function manejarClickHora(event) {
    const btn = event.currentTarget;
    const hora = btn.getAttribute('data-hora');
    const canchaId = parseInt(btn.getAttribute('data-cancha-id'));
    const canchaNombre = btn.getAttribute('data-cancha-nombre');
    const precio = parseInt(btn.getAttribute('data-precio'));
    
    const existe = reservas.some(r => r.canchaId === canchaId && r.hora === hora);
    
    if (existe) {
        eliminarReserva(canchaId, hora);
    } else {
        agregarReserva(canchaId, canchaNombre, hora, precio);
        btn.classList.remove('border-emerald-200', 'text-gray-900');
        btn.classList.add('border-emerald-600', 'border-2', 'bg-emerald-500', 'text-white', 'hover:bg-emerald-600');
        const p = btn.querySelector('p');
        if (p) {
            p.classList.remove('text-gray-900');
            p.classList.add('text-white', 'font-black');
        }
    }
}

function marcarBotonesSeleccionados() {
    const botones = document.querySelectorAll('.hourButton.available');
    botones.forEach(btn => {
        const hora = btn.getAttribute('data-hora');
        const existe = reservas.some(r => r.canchaId === currentCancha && r.hora === hora);
        if (existe) {
            btn.classList.remove('border-emerald-200', 'text-gray-900');
            btn.classList.add('border-emerald-600', 'border-2', 'bg-emerald-500', 'text-white', 'hover:bg-emerald-600');
            const p = btn.querySelector('p');
            if (p) {
                p.classList.remove('text-gray-900');
                p.classList.add('text-white', 'font-black');
            }
        } else {
            btn.classList.remove('border-emerald-600', 'border-2', 'bg-emerald-500', 'text-white', 'hover:bg-emerald-600');
            btn.classList.add('border-emerald-200', 'text-gray-900');
            const p = btn.querySelector('p');
            if (p) {
                p.classList.remove('text-white', 'font-black');
                p.classList.add('text-gray-900');
            }
        }
    });
}

function closeHorarioModal() {
    document.getElementById('horarioModal').classList.add('hidden');
}

// =====================================
// PAGO
// =====================================
function enablePayButton() {
    const btn = document.getElementById('pagarBtn');
    const terms = document.getElementById('acceptTerms');
    if (terms?.checked && reservas.length > 0) {
        btn.disabled = false;
    } else {
        btn.disabled = true;
    }
}

function procesarPago() {
    if (reservas.length === 0) {
        alert('Por favor selecciona al menos un horario');
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

    const subtotalCanchas = reservas.reduce((acc, r) => acc + r.precioHora, 0);
    const totalGeneral = subtotalCanchas + beerTotal;
    
    let detalleReservas = '';
    reservas.forEach(r => {
        detalleReservas += `\n   • ${r.canchaNombre} - ${r.hora} (S/ ${r.precioHora})`;
    });
    
    let mensajeCervezas = '';
    if (beerQuantity > 0) {
        mensajeCervezas = `\n🍺 Cervezas: ${beerQuantity} caja${beerQuantity !== 1 ? 's' : ''} (S/ ${beerTotal})`;
    }

    alert(`✅ ¡Reserva confirmada!\n\n` +
          `🏟️ Canchas reservadas:${detalleReservas}\n` +
          `━━━━━━━━━━━━━━━━\n` +
          `Subtotal canchas: S/ ${subtotalCanchas}${mensajeCervezas}\n` +
          `💵 TOTAL: S/ ${totalGeneral}\n` +
          `💳 Método: ${methodName}\n\n` +
          `📅 Fecha: ${userPreferences.date || 'No especificada'}\n` +
          `🕐 Horario preferido: ${userPreferences.hour || '--:--'}\n` +
          `📍 Ciudad: ${userPreferences.city || 'No especificada'}`);
    
    // Limpiar carrito después del pago
    reservas = [];
    renderizarCarrito();
    actualizarTotalesCanchas();
    closeHorarioModal();
}

// =====================================
// FILTROS
// =====================================
function openFilterModal() {
    document.getElementById('filterModal').classList.remove('hidden');
}

function closeFilterModal() {
    document.getElementById('filterModal').classList.add('hidden');
}

function applyFilters() {
    alert('✓ Filtros aplicados correctamente');
    closeFilterModal();
}

// =====================================
// EVENT LISTENERS INICIALES
// =====================================
document.addEventListener('DOMContentLoaded', () => {
    // Métodos de pago
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

    // Términos y condiciones
    document.getElementById('acceptTerms')?.addEventListener('change', enablePayButton);

    // Cervezas
    const beerSelect = document.getElementById('beerBrand');
    const beerQtyInput = document.getElementById('beerQuantity');
    if (beerSelect) beerSelect.addEventListener('change', updateBeerTotal);
    if (beerQtyInput) {
        beerQtyInput.addEventListener('input', function() {
            if (this.value < 0) this.value = 0;
            if (this.value > 20) this.value = 20;
            updateBeerTotal();
        });
    }
});