// ============================================
// CANCHAYA DASHBOARD - JAVASCRIPT (TEMA CLARO)
// ============================================
// Colores adaptados a fondo blanco y texto oscuro
// ============================================

(function() {
    'use strict';

    const chartInstances = {};
    let dashboardInitialized = false;

    function initDashboard() {
        if (dashboardInitialized) return;
        try {
            if (window.Chart) {
                Chart.defaults.font.family = "'Inter', sans-serif";
                Chart.defaults.font.size = 12;
                Chart.defaults.color = '#334155'; // slate-700
                Chart.defaults.plugins.tooltip.backgroundColor = '#ffffff';
                Chart.defaults.plugins.tooltip.titleColor = '#0f172a';
                Chart.defaults.plugins.tooltip.bodyColor = '#1e293b';
                Chart.defaults.plugins.tooltip.borderColor = '#cbd5e1';
                Chart.defaults.plugins.tooltip.borderWidth = 1;
                Chart.defaults.plugins.tooltip.padding = 12;
                Chart.defaults.plugins.tooltip.cornerRadius = 8;
                Chart.defaults.plugins.tooltip.displayColors = false;
                Chart.defaults.animation.duration = 1000;
                Chart.defaults.animation.easing = 'easeOutQuart';
            }

            initRealTimeClock();
            createAllCharts();

            dashboardInitialized = true;
        } catch (error) {
            console.error('Error inicializando dashboard:', error);
        }
    }

    function initRealTimeClock() {
        const timeElement = document.getElementById('currentTime');
        if (!timeElement) return;
        function updateTime() {
            const now = new Date();
            timeElement.textContent = now.toLocaleTimeString('es-PE', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        }
        updateTime();
        setInterval(updateTime, 1000);
    }

    function destroyChart(id) {
        if (chartInstances[id]) {
            chartInstances[id].destroy();
            delete chartInstances[id];
        }
    }

    function createAllCharts() {
        // Gráfico 1: Línea (ingresos)
        const ctx1 = document.getElementById('chart1')?.getContext('2d');
        if (ctx1) {
            destroyChart('chart1');
            chartInstances.chart1 = new Chart(ctx1, {
                type: 'line',
                data: {
                    labels: ['Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene'],
                    datasets: [{
                        label: 'Ingresos (S/.)',
                        data: [12400, 13200, 11800, 14500, 13900, 15420],
                        borderColor: '#059669', // emerald-600
                        backgroundColor: 'rgba(5, 150, 105, 0.08)',
                        borderWidth: 3,
                        tension: 0.3,
                        fill: true,
                        pointBackgroundColor: '#059669',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: (ctx) => `S/ ${ctx.parsed.y.toLocaleString('es-PE')}`
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: '#e2e8f0' },
                            ticks: {
                                color: '#475569',
                                callback: (v) => `S/ ${v.toLocaleString('es-PE')}`
                            }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { color: '#475569' }
                        }
                    }
                }
            });
        }

        // Gráfico 2: Barras (ocupación)
        const ctx2 = document.getElementById('chart2')?.getContext('2d');
        if (ctx2) {
            destroyChart('chart2');
            chartInstances.chart2 = new Chart(ctx2, {
                type: 'bar',
                data: {
                    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                    datasets: [{
                        label: 'Ocupación (%)',
                        data: [65, 75, 70, 85, 90, 95, 88],
                        backgroundColor: '#059669',
                        borderRadius: 8,
                        borderSkipped: false,
                        hoverBackgroundColor: '#047857'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: (ctx) => `${ctx.parsed.y}%`
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            grid: { color: '#e2e8f0' },
                            ticks: {
                                color: '#475569',
                                callback: (v) => `${v}%`
                            }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { color: '#475569' }
                        }
                    }
                }
            });
        }

        // Gráfico 3: Dona (distribución)
        const ctx3 = document.getElementById('chart3')?.getContext('2d');
        if (ctx3) {
            destroyChart('chart3');
            chartInstances.chart3 = new Chart(ctx3, {
                type: 'doughnut',
                data: {
                    labels: ['Fútbol 7', 'Fútbol 5', 'Fútbol 11'],
                    datasets: [{
                        data: [45, 35, 20],
                        backgroundColor: ['#059669', '#2563eb', '#d97706'],
                        borderWidth: 0,
                        hoverOffset: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: '#1e293b',
                                font: { size: 12, weight: '500' },
                                padding: 16,
                                usePointStyle: true,
                                pointStyle: 'circle'
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: (ctx) => {
                                    const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                                    const percent = ((ctx.parsed / total) * 100).toFixed(1);
                                    return `${ctx.label}: ${ctx.parsed}% (${percent}%)`;
                                }
                            }
                        }
                    }
                }
            });
        }

        // Ocultar skeletons
        ['chart1', 'chart2', 'chart3'].forEach(id => {
            const loader = document.getElementById(id + '-loading');
            if (loader) loader.style.display = 'none';
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDashboard);
    } else {
        initDashboard();
    }
})();