// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化数据
    window.dataModule.initData();
    // 初始化图表
    window.chartModule.createCharts();

    // DOM元素
    const taskTableBody = document.getElementById('taskTableBody');
    const searchTasks = document.getElementById('searchTasks');
    const filterStatus = document.getElementById('filterStatus');
    const dataSource = document.getElementById('dataSource');
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const prevPageSm = document.getElementById('prevPageSm');
    const nextPageSm = document.getElementById('nextPageSm');
    const paginationNumbers = document.getElementById('paginationNumbers');
    const startRange = document.getElementById('startRange');
    const endRange = document.getElementById('endRange');
    const totalItems = document.getElementById('totalItems');
    const totalTasks = document.getElementById('totalTasks');
    const taskStatusSummary = document.getElementById('taskStatusSummary');
    const totalEstimatedHours = document.getElementById('totalEstimatedHours');
    const totalActualHours = document.getElementById('totalActualHours');
    const hourVariance = document.getElementById('hourVariance');
    const variancePercentage = document.getElementById('variancePercentage');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('#sidebar nav a');
    const contentSections = document.querySelectorAll('main > section[id$="-tasks"]');

    // 分页变量
    let currentPage = 1;
    const itemsPerPage = 5;
    let totalPages = 1;

    // 更新总页数
    function updateTotalPages() {
        const filteredData = window.dataModule.getFilteredData();
        totalPages = Math.ceil(filteredData.length / itemsPerPage);
        if (currentPage > totalPages) {
            currentPage = Math.max(1, totalPages);
        }
    }

    // 渲染任务表格
    function renderTaskTable() {
        const filteredData = window.dataModule.getFilteredData();
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);
        const pageData = filteredData.slice(startIndex, endIndex);

        if (pageData.length === 0) {
            taskTableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="px-6 py-10 text-center text-gray-500">
                        没有找到匹配的任务
                    </td>
                </tr>
            `;
            return;
        }

        let html = '';
        pageData.forEach(task => {
            let statusClass = '';
            let statusIcon = '';

            switch (task['完成情况']) {
                case '已完成':
                    statusClass = 'bg-green-100 text-green-800';
                    statusIcon = 'fa-check-circle';
                    break;
                case '进行中':
                    statusClass = 'bg-blue-100 text-blue-800';
                    statusIcon = 'fa-spinner';
                    break;
                case '未开始':
                    statusClass = 'bg-gray-100 text-gray-800';
                    statusIcon = 'fa-clock-o';
                    break;
            }

            let tagClass = '';
            switch (task['标签']) {
                case '需求':
                    tagClass = 'bg-purple-100 text-purple-800';
                    break;
                case '改进':
                    tagClass = 'bg-yellow-100 text-yellow-800';
                    break;
                default:
                    tagClass = 'bg-gray-100 text-gray-800';
            }

            const timeRange = `${task['开始时间']} 至 ${task['结束时间']}`;

            html += `
                <tr class="hover:bg-gray-50 transition-colors duration-150">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${task['任务ID']}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${task['任务名称']}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tagClass}">${task['标签']}</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${task['预计时长']} 小时</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${task['实际时长']} 小时</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                            <i class="fa ${statusIcon} mr-1"></i> ${task['完成情况']}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${task['完成人']}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${timeRange}</td>
                </tr>
            `;
        });

        taskTableBody.innerHTML = html;

        // 更新分页信息
        startRange.textContent = startIndex + 1;
        endRange.textContent = endIndex;
        totalItems.textContent = filteredData.length;

        // 更新分页按钮状态
        prevPage.disabled = currentPage === 1;
        prevPageSm.disabled = currentPage === 1;
        nextPage.disabled = currentPage === totalPages;
        nextPageSm.disabled = currentPage === totalPages;

        // 渲染页码
        renderPaginationNumbers();
    }

    // 渲染分页数字
    function renderPaginationNumbers() {
        paginationNumbers.innerHTML = '';

        // 显示最多5个页码
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);

        // 调整起始页码，确保显示5个页码
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }

        for (let i = startPage; i <= endPage; i++) {
            const button = document.createElement('button');
            button.className = `relative inline-flex items-center px-4 py-2 border ${i === currentPage ? 'border-primary bg-primary text-white' : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'} text-sm font-medium`;
            button.textContent = i;
            button.addEventListener('click', () => {
                currentPage = i;
                renderTaskTable();
            });
            paginationNumbers.appendChild(button);
        }
    }

    // 过滤任务
    function filterTasks() {
        const searchTerm = searchTasks.value.toLowerCase();
        const statusFilter = filterStatus.value;
        const currentData = window.dataModule.getFilteredData();

        const filteredData = currentData.filter(task => {
            const matchesSearch = task['任务ID'].toLowerCase().includes(searchTerm) ||
                                task['任务名称'].toLowerCase().includes(searchTerm) ||
                                task['完成人'].toLowerCase().includes(searchTerm);
            const matchesStatus = statusFilter === 'all' || task['完成情况'] === statusFilter;

            return matchesSearch && matchesStatus;
        });

        window.dataModule.setFilteredData(filteredData);
        currentPage = 1;
        updateTotalPages();
        renderTaskTable();
        updateOverviewCards();
        window.chartModule.updateCharts(filteredData);
    }

    // 更新概览卡片
    function updateOverviewCards() {
        const filteredData = window.dataModule.getFilteredData();
        const total = filteredData.length;
        const completed = filteredData.filter(task => task['完成情况'] === '已完成').length;
        const inProgress = filteredData.filter(task => task['完成情况'] === '进行中').length;
        const notStarted = filteredData.filter(task => task['完成情况'] === '未开始').length;

        let statusSummary = '';
        if (completed > 0) statusSummary += `${completed} 已完成`;
        if (inProgress > 0) statusSummary += `${statusSummary ? ', ' : ''}${inProgress} 进行中`;
        if (notStarted > 0) statusSummary += `${statusSummary ? ', ' : ''}${notStarted} 未开始`;

        const totalEstimated = filteredData.reduce((sum, task) => sum + task['预计时长'], 0);
        const totalActual = filteredData.reduce((sum, task) => sum + task['实际时长'], 0);
        const variance = totalActual - totalEstimated;
        const variancePercent = totalEstimated > 0 ? ((variance / totalEstimated) * 100).toFixed(1) : 0;

        totalTasks.textContent = total;
        taskStatusSummary.textContent = statusSummary;
        totalEstimatedHours.textContent = totalEstimated;
        totalActualHours.textContent = totalActual;

        if (variance >= 0) {
            hourVariance.textContent = `+${variance}`;
            hourVariance.className = 'text-3xl font-bold text-danger';
            variancePercentage.textContent = `超出 ${variancePercent}%`;
            variancePercentage.className = 'text-gray-500 text-sm mt-2 text-danger';
        } else {
            hourVariance.textContent = variance;
            hourVariance.className = 'text-3xl font-bold text-secondary';
            variancePercentage.textContent = `节省 ${Math.abs(variancePercent)}%`;
            variancePercentage.className = 'text-gray-500 text-sm mt-2 text-secondary';
        }
    }

    // 侧边导航切换
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // 移除所有导航链接的活动状态
            navLinks.forEach(l => {
                l.classList.remove('border-primary', 'bg-primary/5');
                l.classList.add('border-transparent');
            });

            // 添加当前导航链接的活动状态
            this.classList.add('border-primary', 'bg-primary/5');
            this.classList.remove('border-transparent');

            // 隐藏所有内容区域
            contentSections.forEach(section => {
                section.classList.add('hidden');
            });

            // 显示对应的内容区域
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.remove('hidden');
            }
        });
    });

    // 初始化应用
    function initApp() {
        updateTotalPages();
        renderTaskTable();
        updateOverviewCards();
        window.chartModule.updateCharts(window.dataModule.getFilteredData());

        // 添加事件监听器
        searchTasks.addEventListener('input', filterTasks);
        filterStatus.addEventListener('change', filterTasks);
        dataSource.addEventListener('change', () => {
            const source = dataSource.value;
            window.dataModule.switchDataSource(source);
            filterTasks();
        });
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // 分页按钮事件
        prevPage.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderTaskTable();
            }
        });

        nextPage.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderTaskTable();
            }
        });

        prevPageSm.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderTaskTable();
            }
        });

        nextPageSm.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderTaskTable();
            }
        });

        // 滚动监听，改变导航栏样式
        window.addEventListener('scroll', () => {
            if (window.scrollY > 10) {
                navbar.classList.add('py-2');
                navbar.classList.remove('py-3');
            } else {
                navbar.classList.add('py-3');
                navbar.classList.remove('py-2');
            }
        });

        // 平滑滚动
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                    // 关闭移动端菜单
                    mobileMenu.classList.add('hidden');
                }
            });
        });
    }

    // 启动应用
    initApp();
});

// Tailwind 配置
window.tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#3b82f6',
                secondary: '#10b981',
                accent: '#8b5cf6',
                warning: '#f59e0b',
                danger: '#ef4444',
                dark: '#1e293b',
                light: '#f8fafc'
            },
            fontFamily: {
                inter: ['Inter', 'system-ui', 'sans-serif'],
            },
        }
    }
};