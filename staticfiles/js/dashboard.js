// ============================================
// CANCHAYA DASHBOARD - JAVASCRIPT
// ============================================
// Sin bucles infinitos, sin problemas
// ============================================

let chartsCreated = false;

function createCharts() {
    // Prevenir múltiples ejecuciones
    if (chartsCreated) {
        return;
    }
    
    chartsCreated = true;
    
    // Actualizar hora en tiempo real
    function updateTime() {
        const now = new Date();
        document.getElementById('currentTime').textContent = now.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    updateTime();
    setInterval(updateTime, 1000);
    
    // GRÁFICO 1: Ingresos Mensuales
    const ctx1 = document.getElementById('chart1');
    if (ctx1) {
        new Chart(ctx1, {
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
                            label: (context) => `S/. ${context.parsed.y.toLocaleString('es-PE')}`
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
                            callback: (value) => `S/. ${value.toLocaleString('es-PE')}`
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
    
    // GRÁFICO 2: Ocupación de Canchas
    const ctx2 = document.getElementById('chart2');
    if (ctx2) {
        new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                datasets: [{
                    label: 'Ocupación (%)',
                    data: [65, 75, 70, 85, 90, 95, 88],
                    backgroundColor: '#10b981',
                    borderRadius: 8,
                    borderSkipped: false,
                    hoverBackgroundColor: '#059669'
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

// Ejecutar cuando el documento esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createCharts);
} else {
    createCharts();
}