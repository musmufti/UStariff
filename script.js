// Pakistan's export data to the US
const pakistanExportData = {
    totalExports: 5.5, // $5.5 billion annual exports to the US
    textileExports: 2.8, // $2.8 billion in textile and apparel exports
    tariffRate: 29, // 29% reciprocal tariff imposed by the US
    previousTariffRate: 10, // Baseline tariff before the increase
    pakistanTariffOnUS: 58 // Pakistan's tariff on US goods
};

// Monthly export data
const monthlyExportData = [
    { month: "Jan", exports: 0.46, textiles: 0.36 },
    { month: "Feb", exports: 0.48, textiles: 0.38 },
    { month: "Mar", exports: 0.52, textiles: 0.41 },
    { month: "Apr", exports: 0.47, textiles: 0.37 },
    { month: "May", exports: 0.45, textiles: 0.36 },
    { month: "Jun", exports: 0.44, textiles: 0.35 },
    { month: "Jul", exports: 0.43, textiles: 0.34 },
    { month: "Aug", exports: 0.46, textiles: 0.36 },
    { month: "Sep", exports: 0.45, textiles: 0.35 },
    { month: "Oct", exports: 0.47, textiles: 0.37 },
    { month: "Nov", exports: 0.44, textiles: 0.35 },
    { month: "Dec", exports: 0.43, textiles: 0.34 }
];

// Impact rates for different scenarios
const impactRates = {
    low: { overall: 0.9, textile: 0.85 },
    medium: { overall: 0.8, textile: 0.75 },
    high: { overall: 0.7, textile: 0.65 }
};

// Export categories for Pakistan's exports to US
const exportCategories = [
    { name: "Textiles", value: 79 },
    { name: "Leather", value: 5 },
    { name: "Surgical", value: 4 },
    { name: "Rice", value: 3 },
    { name: "Sports", value: 3 },
    { name: "Others", value: 6 }
];

// Compare Pakistan with other countries affected by tariffs
const countryComparison = [
    { country: "Pakistan", tariffRate: 29, exports: 5.5 },
    { country: "China", tariffRate: 34, exports: 427.2 },
    { country: "Vietnam", tariffRate: 46, exports: 127.5 },
    { country: "Thailand", tariffRate: 36, exports: 41.8 },
    { country: "India", tariffRate: 27, exports: 83.2 },
    { country: "EU", tariffRate: 20, exports: 587.1 }
];

// Data for radar chart comparing competitive position
const competitivePositionData = {
    labels: ['Price (1-10)', 'Quality (1-10)', 'Delivery (1-10)', 'Compliance (1-10)', 'Tariff Impact (1-10)', 'Market Access (1-10)'],
    tooltips: [
        'Lower production costs (10 = best)',
        'Product quality and finish (10 = best)',
        'Speed and reliability (10 = best)',
        'Labor and environmental standards (10 = best)',
        'Resilience to tariffs (10 = best)',
        'Trade agreements and market reach (10 = best)'
    ],
    datasets: {
        Pakistan: [8, 6, 5, 6, 5, 6],
        Bangladesh: [9, 5, 6, 5, 7, 5],
        India: [7, 7, 7, 7, 6, 7],
        Vietnam: [6, 8, 8, 8, 4, 8]
    }
};

// Scenario descriptions
const scenarioDescriptions = {
    low: "Low Impact: US buyers absorb part of the tariff cost; minimal shift to other suppliers",
    medium: "Medium Impact: Some US buyers switch to alternative suppliers; others negotiate price reductions",
    high: "High Impact: Significant shift to suppliers from countries with lower tariffs; major price pressure"
};

// Current scenario
let currentScenario = 'medium';

// Competitor visibility state
let competitorVisibility = {
    Pakistan: true,
    Bangladesh: true,
    India: true,
    Vietnam: true
};

// Colors for charts
const chartColors = {
    primary: '#0088FE',
    secondary: '#00C49F',
    tertiary: '#FFBB28',
    quaternary: '#FF8042',
    lightRed: '#FF6B6B',
    darkRed: '#D32F2F',
    lightGreen: '#4CAF50',
    darkGreen: '#2E7D32',
    lightBlue: '#90CAF9',
    darkBlue: '#1565C0',
    lightGray: '#9E9E9E',
    darkGray: '#616161'
};

// Chart instances
let monthlyChart, categoriesChart, sectorsChart, tariffChart, radarChart;

// Initialize charts
function initCharts() {
    // Monthly exports chart
    const monthlyCtx = document.getElementById('monthly-chart').getContext('2d');
    monthlyChart = new Chart(monthlyCtx, {
        type: 'line',
        data: getMonthlyChartData(),
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: '$ Billion'
                    },
                    min: 0.3,
                    max: 0.55
                }
            }
        }
    });

    // Categories chart
    const categoriesCtx = document.getElementById('categories-chart').getContext('2d');
    categoriesChart = new Chart(categoriesCtx, {
        type: 'pie',
        data: {
            labels: exportCategories.map(item => item.name),
            datasets: [{
                data: exportCategories.map(item => item.value),
                backgroundColor: [
                    chartColors.primary, 
                    chartColors.tertiary, 
                    chartColors.quaternary, 
                    chartColors.secondary, 
                    chartColors.lightGray, 
                    chartColors.darkGray
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            }
        }
    });

    // Sectors impact chart
    const sectorsCtx = document.getElementById('sectors-chart').getContext('2d');
    sectorsChart = new Chart(sectorsCtx, {
        type: 'bar',
        data: getSectorsChartData(),
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '$ Billion'
                    },
                    max: 1.2
                }
            }
        }
    });

    // Tariff comparison chart
    const tariffCtx = document.getElementById('tariff-chart').getContext('2d');
    tariffChart = new Chart(tariffCtx, {
        type: 'bar',
        data: {
            labels: countryComparison.map(item => item.country),
            datasets: [{
                label: 'Tariff Rate (%)',
                data: countryComparison.map(item => item.tariffRate),
                backgroundColor: chartColors.darkBlue
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Tariff Rate (%)'
                    },
                    max: 50
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            const country = context.label;
                            const data = countryComparison.find(item => item.country === country);
                            return `Exports to US: $${data.exports.toFixed(1)}B`;
                        }
                    }
                }
            }
        }
    });

    // Radar chart
    const radarCtx = document.getElementById('radar-chart').getContext('2d');
    radarChart = new Chart(radarCtx, {
        type: 'radar',
        data: getRadarChartData(),
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    min: 0,
                    max: 10,
                    ticks: {
                        stepSize: 2
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        title: function(context) {
                            const index = context[0].dataIndex;
                            return `${competitivePositionData.labels[index]}`;
                        },
                        beforeLabel: function(context) {
                            const index = context.dataIndex;
                            return `${competitivePositionData.tooltips[index]}`;
                        }
                    }
                }
            }
        }
    });
}

// Get monthly chart data based on current scenario
function getMonthlyChartData() {
    const currentRate = impactRates[currentScenario];
    
    return {
        labels: monthlyExportData.map(item => item.month),
        datasets: [
            {
                label: 'Current Exports',
                data: monthlyExportData.map(item => item.exports),
                borderColor: chartColors.darkBlue,
                backgroundColor: 'rgba(21, 101, 192, 0.1)',
                tension: 0.3
            },
            {
                label: `${currentScenario.charAt(0).toUpperCase() + currentScenario.slice(1)} Impact`,
                data: monthlyExportData.map(item => item.exports * currentRate.overall),
                borderColor: chartColors.lightRed,
                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                borderDash: [5, 5],
                tension: 0.3
            }
        ]
    };
}

// Get sectors chart data based on current scenario
function getSectorsChartData() {
    const currentRate = impactRates[currentScenario];
    
    return {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [
            {
                label: 'Current Textiles',
                data: [1.15, 1.08, 1.05, 0.92],
                backgroundColor: chartColors.primary
            },
            {
                label: 'Current Non-Textiles',
                data: [0.31, 0.28, 0.27, 0.44],
                backgroundColor: chartColors.tertiary
            },
            {
                label: 'Projected Textiles',
                data: [1.15 * currentRate.textile, 1.08 * currentRate.textile, 1.05 * currentRate.textile, 0.92 * currentRate.textile],
                backgroundColor: chartColors.lightBlue
            },
            {
                label: 'Projected Non-Textiles',
                data: [0.31 * currentRate.overall, 0.28 * currentRate.overall, 0.27 * currentRate.overall, 0.44 * currentRate.overall],
                backgroundColor: chartColors.lightGreen
            }
        ]
    };
}

// Get radar chart data based on competitor visibility
function getRadarChartData() {
    const datasets = [];
    const colors = {
        Pakistan: chartColors.primary,
        Bangladesh: chartColors.tertiary,
        India: chartColors.quaternary,
        Vietnam: chartColors.lightGray
    };
    
    Object.keys(competitorVisibility).forEach(country => {
        if (competitorVisibility[country]) {
            datasets.push({
                label: country,
                data: competitivePositionData.datasets[country],
                borderColor: colors[country],
                backgroundColor: `${colors[country]}66`,
                pointBackgroundColor: colors[country]
            });
        }
    });
    
    return {
        labels: competitivePositionData.labels,
        datasets: datasets
    };
}

// Update charts based on selected scenario
function updateCharts() {
    // Update monthly chart
    monthlyChart.data = getMonthlyChartData();
    monthlyChart.update();
    
    // Update sectors chart
    sectorsChart.data = getSectorsChartData();
    sectorsChart.update();
    
    // Update impact values
    const currentRate = impactRates[currentScenario];
    const textileExports = pakistanExportData.textileExports;
    const nonTextileExports = pakistanExportData.totalExports - textileExports;
    
    const impactLoss = pakistanExportData.totalExports * (1 - currentRate.overall);
    const projectedTotal = pakistanExportData.totalExports - impactLoss;
    const textileLoss = textileExports * (1 - currentRate.textile);
    const nonTextileLoss = nonTextileExports * (1 - currentRate.overall);
    
    document.getElementById('impact-loss').innerText = `$${impactLoss.toFixed(1)}B`;
    document.getElementById('projected-total').innerText = `$${projectedTotal.toFixed(1)}B`;
    document.getElementById('textile-loss').innerText = `$${textileLoss.toFixed(1)}B`;
    document.getElementById('nontextile-loss').innerText = `$${nonTextileLoss.toFixed(1)}B`;
    
    // Update scenario description
    document.getElementById('scenario-description').innerText = scenarioDescriptions[currentScenario];
}

// Update radar chart based on competitor visibility
function updateRadarChart() {
    radarChart.data = getRadarChartData();
    radarChart.update();
}

// Set the active scenario
function setScenario(scenario) {
    // Update current scenario
    currentScenario = scenario;
    
    // Update active button
    document.querySelectorAll('.scenario-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`${scenario}-impact`).classList.add('active');
    
    // Update charts
    updateCharts();
}

// Toggle competitor visibility
function toggleCompetitor(country) {
    competitorVisibility[country] = !competitorVisibility[country];
    
    // Update competitor item styles
    document.querySelectorAll('.competitor-item').forEach(item => {
        const itemCountry = item.getAttribute('data-country');
        if (itemCountry === country) {
            if (competitorVisibility[country]) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        }
    });
    
    // Update radar chart
    updateRadarChart();
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts
    initCharts();
    
    // Add event listeners to scenario buttons
    document.getElementById('low-impact').addEventListener('click', function() {
        setScenario('low');
    });
    
    document.getElementById('medium-impact').addEventListener('click', function() {
        setScenario('medium');
    });
    
    document.getElementById('high-impact').addEventListener('click', function() {
        setScenario('high');
    });
    
    // Add event listeners to competitor selectors
    document.querySelectorAll('.competitor-item').forEach(item => {
        item.addEventListener('click', function() {
            const country = this.getAttribute('data-country');
            toggleCompetitor(country);
        });
    });
    
    // Set initial state
    setScenario('medium');
});
