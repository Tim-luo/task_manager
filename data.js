// 数据存储
let dailyData = [];
let monthlyData = [];
let currentData = [];
let filteredData = [];

// 模拟CSV数据
const dailyCsvData = `任务ID,任务名称,标签,预计时长,实际时长,完成情况,完成人,开始时间,结束时间
T006,性能监控系统开发,需求,20,18,进行中,李四,2023-11-06,2023-11-10
T009,新功能需求分析,需求,8,6,进行中,张三,2023-11-10,2023-11-12
T010,自动化测试脚本编写,改进,10,9,未开始,李四,2023-11-13,2023-11-15
T012,用户体验调研,需求,6,7,进行中,赵六,2023-11-12,2023-11-14
T014,系统备份策略优化,改进,4,4,未开始,李四,2023-11-16,2023-11-17
T015,数据迁移工具开发,需求,15,12,进行中,王五,2023-11-14,2023-11-18`;

const monthlyCsvData = `任务ID,任务名称,标签,预计时长,实际时长,完成情况,完成人,开始时间,结束时间
T006,性能监控系统开发,需求,20,20,已完成,李四,2023-11-06,2023-11-09
T009,新功能需求分析,需求,8,5,已完成,张三,2023-11-10,2023-11-11
T010,自动化测试脚本编写,改进,10,9,已完成,李四,2023-11-13,2023-11-14
T012,用户体验调研,需求,6,5,已完成,赵六,2023-11-12,2023-11-13
T014,系统备份策略优化,改进,4,4,已完成,李四,2023-11-16,2023-11-17
T015,数据迁移工具开发,需求,15,12,已完成,王五,2023-11-14,2023-11-17
T016,日志系统优化,改进,5,5,已完成,张三,2023-11-15,2023-11-16
T017,数据库备份方案,改进,4,4,已完成,王五,2023-11-16,2023-11-17
T018,用户权限管理优化,需求,8,8,已完成,赵六,2023-11-18,2023-11-19
T019,性能测试报告生成,需求,6,6,已完成,张三,2023-11-20,2023-11-21`;

// 解析CSV数据
function parseCsv(csv) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',');
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        const obj = {};
        const currentLine = lines[i].split(',');

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentLine[j];
        }

        // 转换数字类型
        obj['预计时长'] = parseInt(obj['预计时长']);
        obj['实际时长'] = parseInt(obj['实际时长']);

        result.push(obj);
    }

    return result;
}

// 初始化数据
function initData() {
    dailyData = parseCsv(dailyCsvData);
    monthlyData = parseCsv(monthlyCsvData);
    currentData = dailyData;
    filteredData = [...currentData];
}

// 切换数据源
function switchDataSource(source) {
    currentData = source === 'daily' ? dailyData : monthlyData;
    filteredData = [...currentData];
    return filteredData;
}

// 导出函数和变量
window.dataModule = {
    initData,
    switchDataSource,
    getFilteredData: () => filteredData,
    setFilteredData: (data) => { filteredData = data; }
};