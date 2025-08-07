import csv
import os
from collections import defaultdict

class TaskAnalytics:
    def __init__(self):
        self.data_dir = os.path.join(os.path.dirname(__file__), 'data')
        self.tasks = []

    def load_data(self, filename='task_data_day1.csv'):
        """加载CSV数据"""
        file_path = os.path.join(self.data_dir, filename)
        self.tasks = []

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    # 转换数字类型
                    row['预计时长'] = int(row['预计时长'])
                    row['实际时长'] = int(row['实际时长'])
                    self.tasks.append(row)
            return True
        except Exception as e:
            print(f"加载数据出错: {e}")
            return False

    def get_task_list(self):
        """获取任务列表"""
        return self.tasks

    def get_personal_stats(self):
        """获取个人任务统计"""
        stats = defaultdict(lambda: {'taskCount': 0, 'totalHours': 0})
        for task in self.tasks:
            stats[task['完成人']]['taskCount'] += 1
            stats[task['完成人']]['totalHours'] += task['预计时长']
        return dict(stats)

    def get_tag_distribution(self):
        """获取标签人力分布"""
        stats = defaultdict(int)
        total_hours = 0

        for task in self.tasks:
            stats[task['标签']] += task['预计时长']
            total_hours += task['预计时长']

        # 计算百分比
        result = {}
        for tag, hours in stats.items():
            result[tag] = {
                'hours': hours,
                'percentage': round((hours / total_hours) * 100, 1)
            }
        return result

    def get_task_summary(self):
        """获取任务汇总信息"""
        total_tasks = len(self.tasks)
        completed_tasks = sum(1 for task in self.tasks if task['完成情况'] == '已完成')
        in_progress_tasks = sum(1 for task in self.tasks if task['完成情况'] == '进行中')
        not_started_tasks = sum(1 for task in self.tasks if task['完成情况'] == '未开始')

        total_estimated_hours = sum(task['预计时长'] for task in self.tasks)
        total_actual_hours = sum(task['实际时长'] for task in self.tasks)

        return {
            'total_tasks': total_tasks,
            'completed_tasks': completed_tasks,
            'in_progress_tasks': in_progress_tasks,
            'not_started_tasks': not_started_tasks,
            'total_estimated_hours': total_estimated_hours,
            'total_actual_hours': total_actual_hours
        }