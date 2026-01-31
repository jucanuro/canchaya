// ============================================
// DASHBOARD APP - ALPINE.JS COMPONENT
// ============================================

function dashboardApp() {
    return {
        // State
        sidebarOpen: false,
        currentDate: '',
        currentTime: '',
        chartsInitialized: false,
        
        // Init
        init() {
            this.updateDateTime();
            // Actualizar cada segundo
            setInterval(() => this.updateDateTime(), 1000);
            
            // Inicializar gráficos una sola vez cuando el DOM esté listo
            this.$nextTick(() => {
                if (!this.chartsInitialized) {
                    this.initCharts();
                    this.chartsInitialized = true;
                }
            });
        },
        
        // Update date and time
        updateDateTime() {
            const now = new Date();
            
            this.currentDate = now.toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            
            this.currentTime = now.toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit'
            });
        },
        
        // Initialize charts
        initCharts() {
            this.createRevenueChart();
            this.createOccupancyChart();
        },
        
        // Revenue Chart
        createRevenueChart() {
            const ctx = document.getElementById('revenueChart');
            if (!ctx) return;
            
            // Destruir chart existente si lo hay
            if (window.revenueChartInstance) {
                window.revenueChartInstance.destroy();
            }
            
            window.revenueChartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene'],
                    datasets: [{
                        label: 'Ingresos (S/.)',
                        data: [12400, 13200, 11800, 14500, 13900, 15420],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#10b981',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 7
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { 
                            display: false 
                        },
                        tooltip: {
                            backgroundColor: '#1e293b',
                            titleColor: '#f8fafc',
                            bodyColor: '#f8fafc',
                            borderColor: '#334155',
                            borderWidth: 1,
                            padding: 12,
                            displayColors: false,
                            callbacks: {
                                label: (context) => `S/. ${context.parsed.y.toLocaleString()}`
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { 
                                color: '#334155' 
                            },
                            ticks: { 
                                color: '#94a3b8',
                                callback: (value) => `S/. ${value.toLocaleString()}`
                            }
                        },
                        x: {
                            grid: { 
                                display: false 
                            },
                            ticks: { 
                                color: '#94a3b8' 
                            }
                        }
                    }
                }
            });
        },
        
        // Occupancy Chart
        createOccupancyChart() {
            const ctx = document.getElementById('occupancyChart');
            if (!ctx) return;
            
            // Destruir chart existente si lo hay
            if (window.occupancyChartInstance) {
                window.occupancyChartInstance.destroy();
            }
            
            window.occupancyChartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                    datasets: [{
                        label: 'Ocupación (%)',
                        data: [65, 75, 70, 85, 90, 95, 88],
                        backgroundColor: '#10b981',
                        borderRadius: 8,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { 
                            display: false 
                        },
                        tooltip: {
                            backgroundColor: '#1e293b',
                            titleColor: '#f8fafc',
                            bodyColor: '#f8fafc',
                            borderColor: '#334155',
                            borderWidth: 1,
                            padding: 12,
                            displayColors: false,
                            callbacks: {
                                label: (context) => `${context.parsed.y}%`
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            grid: { 
                                color: '#334155' 
                            },
                            ticks: { 
                                color: '#94a3b8',
                                callback: (value) => `${value}%`
                            }
                        },
                        x: {
                            grid: { 
                                display: false 
                            },
                            ticks: { 
                                color: '#94a3b8' 
                            }
                        }
                    }
                }
            });
        }
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN'
    }).format(amount);
}

// Format date
function formatDate(date) {
    return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Format time
function formatTime(time) {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Get relative time
function getRelativeTime(date) {
    const now = new Date();
    const then = new Date(date);
    const diff = Math.floor((now - then) / 1000); // segundos
    
    if (diff < 60) return 'Hace unos segundos';
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)} minutos`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} horas`;
    if (diff < 604800) return `Hace ${Math.floor(diff / 86400)} días`;
    return formatDate(date);
}

// ============================================
// DOM READY
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard cargado correctamente');
});