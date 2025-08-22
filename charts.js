// Gas Station Smart Manager - Charts Implementation

// Global chart storage
window.charts = {}; // 통합 차트 관리 객체

// Color configuration (디자인 기획서 기반)
const COLORS = {
    primary: '#1E3A8A',     // 딥 블루 (신뢰성, 전문성)
    secondary: '#F97316',   // 에너지 오렌지 (활력, 성장)
    success: '#10B981',     // 성공 그린
    warning: '#F59E0B',     // 경고 앰버
    danger: '#EF4444',      // 위험 레드
    gray: '#6B7280',
    lightGray: '#F3F4F6'
};

// Chart defaults
Chart.defaults.font.family = 'Pretendard, Inter, system-ui, sans-serif';
Chart.defaults.font.size = 12;
Chart.defaults.color = COLORS.gray;

// ADDED: 차트를 파괴하는 헬퍼 함수
function destroyChart(chartId) {
    if (window.charts[chartId]) {
        window.charts[chartId].destroy();
        delete window.charts[chartId];
    }
}

// CHANGED: 모든 차트 함수가 동적 데이터를 받도록 수정

// Dashboard Charts
function initializePredictionChart(chartId, data) {
    const ctx = document.getElementById(chartId);
    if (!ctx) return;
    
    destroyChart(chartId); // 기존 차트 파괴

    window.charts[chartId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.dates, // CHANGED
            datasets: [{
                label: '휘발유',
                data: data.gasoline, // CHANGED
                borderColor: COLORS.secondary,
                backgroundColor: COLORS.secondary + '20',
                borderWidth: 3, // CHANGED: 선 굵기 증가
                fill: false,
                tension: 0.4,
                pointBackgroundColor: COLORS.secondary,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5, // CHANGED: 포인트 크기 증가
                pointHoverRadius: 7
            }, {
                label: '경유',
                data: data.diesel, // CHANGED
                borderColor: COLORS.primary,
                backgroundColor: COLORS.primary + '20',
                borderWidth: 3, // CHANGED: 선 굵기 증가
                fill: false,
                tension: 0.4,
                pointBackgroundColor: COLORS.primary,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5, // CHANGED: 포인트 크기 증가
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { usePointStyle: true, padding: 20, font: { weight: '500' } }
                },
                tooltip: {
                    callbacks: {
                        label: context => `${context.dataset.label}: ${context.parsed.y.toLocaleString()}원`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: { callback: value => `${value.toLocaleString()}원` }
                }
            },
            interaction: { intersect: false, mode: 'index' }
        }
    });
}


// Analysis Charts
function initializeMarketChart(chartId, data) {
    const ctx = document.getElementById(chartId);
    if (!ctx) return;

    destroyChart(chartId);

    const isOilChart = chartId.includes('oil');
    const chartData = isOilChart ? data.oilPrices : data.exchangeRates;
    const label = isOilChart ? '브렌트유 ($/bbl)' : 'USD/KRW';
    const color = isOilChart ? COLORS.warning : COLORS.primary;

    window.charts[chartId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.dates,
            datasets: [{
                label: label,
                data: chartData,
                borderColor: color,
                backgroundColor: color + '20',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    ticks: {
                        callback: value => isOilChart ? `$${value}` : `${value.toLocaleString()}원`
                    }
                }
            }
        }
    });
}

function initializePriceTrendChart(chartId, data) {
    const ctx = document.getElementById(chartId);
    if (!ctx) return;
    
    destroyChart(chartId);

    window.charts[chartId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.dates,
            datasets: [{
                label: '휘발유',
                data: data.gasoline,
                borderColor: COLORS.secondary,
                borderWidth: 2,
                fill: false,
                tension: 0.4
            }, {
                label: '경유',
                data: data.diesel,
                borderColor: COLORS.primary,
                borderWidth: 2,
                fill: false,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'top' } },
            scales: {
                y: {
                    ticks: { callback: value => `${value.toFixed(0)}원` }
                }
            }
        }
    });
}


function initializePatternChart(chartId, data) {
    const ctx = document.getElementById(chartId);
    if (!ctx) return;
    
    destroyChart(chartId);

    const isHourly = chartId.includes('hourly');
    const labels = isHourly ? Array.from({length: 24}, (_, i) => i + '시') : ['월', '화', '수', '목', '금', '토', '일'];
    const chartData = isHourly ? data.hourlyPatterns : data.weeklyPatterns;
    const color = isHourly ? COLORS.success : COLORS.primary;

    window.charts[chartId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '판매량',
                data: chartData,
                backgroundColor: color,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
        }
    });
}


// Profit Charts
function initializeDailyProfitChart(chartId, data) {
    const ctx = document.getElementById(chartId);
    if (!ctx) return;
    
    destroyChart(chartId);

    window.charts[chartId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.dailyProfits.map(d => d.date),
            datasets: [{
                label: '실제 수익',
                data: data.dailyProfits.map(d => d.profit),
                backgroundColor: COLORS.success + '80',
                borderColor: COLORS.success,
                borderWidth: 1
            }, {
                label: '목표 수익',
                data: Array(data.dailyProfits.length).fill(data.dailyTarget),
                type: 'line',
                borderColor: COLORS.danger,
                borderWidth: 2,
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'top' } },
            scales: {
                y: {
                    ticks: {
                        callback: value => `${(value / 1000).toFixed(0)}K`
                    }
                }
            }
        }
    });
}

function initializeFuelTypeProfitChart(chartId, data) {
    const ctx = document.getElementById(chartId);
    if (!ctx) return;
    
    destroyChart(chartId);
    
    const totalProfit = data.gasoline + data.diesel;
    const gasolinePercent = (data.gasoline / totalProfit) * 100;
    const dieselPercent = (data.diesel / totalProfit) * 100;

    window.charts[chartId] = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['휘발유', '경유'],
            datasets: [{
                data: [gasolinePercent, dieselPercent],
                backgroundColor: [COLORS.secondary, COLORS.primary],
                borderWidth: 0,
                hoverBorderWidth: 4,
                hoverBorderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true } },
                tooltip: {
                    callbacks: {
                        label: context => `${context.label}: ${context.parsed.toFixed(1)}%`
                    }
                }
            },
            cutout: '60%'
        }
    });
}