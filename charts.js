// 图表对象存储
let charts = {};

// 创建图表
function createCharts() {
    // 任务状态分布图表
    const statusCtx = document.getElementById('statusDistributionChart').getContext('2d');
    charts.statusChart = new Chart(statusCtx, {
        type: 'doughnut',
        data: {
            labels: ['已完成', '进行中', '未开始'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: ['#10b981', '#3b82f6', '#9ca3af'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });

    // 任务标签分布图表
    const tagCtx = document.getElementById('tagDistributionChart').getContext('2d');
    charts.tagChart = new Chart(tagCtx, {
        type: 'pie',
        data: {
            labels: ['需求', '改进'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#8b5cf6', '#f59e0b'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });

    // 工时对比图表
    const hourCtx = document.getElementById('hourComparisonChart').getContext('2d');
    charts.hourChart = new Chart(hourCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: '预计时长',
                data: [],
                backgroundColor: '#3b82f6',
                borderRadius: 4
            }, {
                label: '实际时长',
                data: [],
                backgroundColor: '#10b981',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: false,
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '小时'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y + ' 小时';
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });

    // 团队成员任务分布图表
    const teamCtx = document.getElementById('teamMemberChart').getContext('2d');
    charts.teamChart = new Chart(teamCtx, {
        type: 'polarArea',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#3b82f6',
                    '#10b981',
                    '#8b5cf6',
                    '#f59e0b',
                    '#ef4444'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    ticks: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            return `${label}: ${value} 任务`;
                        }
                    }
                }
            }
        }
    });
}

// 更新图表数据
function updateCharts(filteredData) {
    // 更新任务状态分布
    const completed = filteredData.filter(task => task['完成情况'] === '已完成').length;
    const inProgress = filteredData.filter(task => task['完成情况'] === '进行中').length;
    const notStarted = filteredData.filter(task => task['完成情况'] === '未开始').length;

    charts.statusChart.data.datasets[0].data = [completed, inProgress, notStarted];
    charts.statusChart.update();

    // 更新任务标签分布
    const requirement = filteredData.filter(task => task['标签'] === '需求').length;
    const improvement = filteredData.filter(task => task['标签'] === '改进').length;

    charts.tagChart.data.datasets[0].data = [requirement, improvement];
    charts.tagChart.update();

    // 更新工时对比图表 - 只显示前5个任务避免图表过于拥挤
    const topTasks = [...filteredData].sort((a, b) => b['预计时长'] - a['预计时长']).slice(0, 5);
    const taskIds = topTasks.map(task => task['任务ID']);
    const estimatedHours = topTasks.map(task => task['预计时长']);
    const actualHours = topTasks.map(task => task['实际时长']);

    charts.hourChart.data.labels = taskIds;
    charts.hourChart.data.datasets[0].data = estimatedHours;
    charts.hourChart.data.datasets[1].data = actualHours;
    charts.hourChart.update();

    // 更新团队成员任务分布
    const members = [...new Set(filteredData.map(task => task['完成人']))];
    const memberTasks = members.map(member => filteredData.filter(task => task['完成人'] === member).length);

    charts.teamChart.data.labels = members;
    charts.teamChart.data.datasets[0].data = memberTasks;
    charts.teamChart.update();
}

// 导出函数
window.chartModule = {
    createCharts,
    updateCharts
};