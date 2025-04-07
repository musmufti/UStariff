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

// Scenario descriptions
const scenarioDescriptions = {
    low: "Low Impact: US buyers absorb part of the tariff cost; minimal shift to other suppliers",
    medium: "Medium Impact: Some US buyers switch to alternative suppliers; others negotiate price reductions",
    high: "High Impact: Significant shift to suppliers from countries with lower tariffs; major price pressure"
};

// Current scenario
let currentScenario = 'medium';

// Chart instances
let monthlyChart, categoriesChart, sectorsChart, tariffChart;

// Initialize charts
function initCharts() {
    // Monthly exports chart
    const monthlyCtx = document.getElementById('monthly-chart').getContext('2d');
    monthlyChart = new Chart(monthlyCtx, {
        type: 'line',
        data: getMonthlyChartData(),
        options: {
            responsive: true,
            scales: {
                y: {
                    title: {
                        display: true,
                        text: '$ Billion'
                    }
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
                    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#9E9E9E', '#616161'
                ]
            }]
        },
        options: {
            responsive: true,
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
            scales: {
                y: {
                    title: {
                        display: true,
                        text: '$ Billion'
                    }
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
                backgroundColor: '#1976d2'
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Tariff Rate (%)'
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
                borderColor: '#1565C0',
                backgroundColor: 'rgba(21, 101, 192, 0.1)',
                tension: 0.1
            },
            {
                label: `${currentScenario.charAt(0).toUpperCase() + currentScenario.slice(1)} Impact`,
                data: monthlyExportData.map(item => item.exports * currentRate.overall),
                borderColor: '#FF6B6B',
                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                borderDash: [5, 5],
                tension: 0.1
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
                backgroundColor: '#0088FE'
            },
            {
                label: 'Current Other',
                data: [0.31, 0.28, 0.27, 0.44],
                backgroundColor: '#FFBB28'
            },
            {
                label: 'Projected Textiles',
                data: [1.15 * currentRate.textile, 1.08 * currentRate.textile, 1.05 * currentRate.textile, 0.92 * currentRate.textile],
                backgroundColor: '#90CAF9'
            },
            {
                label: 'Projected Other',
                data: [0.31 * currentRate.overall, 0.28 * currentRate.overall, 0.27 * currentRate.overall, 0.44 * currentRate.overall],
                backgroundColor: '#4CAF50'
            }
        ]
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
    
    // Update impact loss display
    const impactLoss = pakistanExportData.totalExports * (1 - impactRates[currentScenario].overall);
    document.getElementById('impact-loss').innerText = `$${impactLoss.toFixed(1)}B`;
    
    // Update scenario description
    document.getElementById('scenario-description').innerText = scenarioDescriptions[currentScenario];
}

// Add event listeners to scenario buttons
document.addEventListener('DOMContentLoaded', function() {
    initCharts();
    
    // Add click event listeners to scenario buttons
    document.getElementById('low-impact').addEventListener('click', function() {
        setScenario('low');
    });
    
    document.getElementById('medium-impact').addEventListener('click', function() {
        setScenario('medium');
    });
    
    document.getElementById('high-impact').addEventListener('click', function() {
        setScenario('high');
    });
});

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
