from flask import Flask, render_template, send_from_directory
import os
from .analytics import TaskAnalytics

def create_app():
    app = Flask(__name__, static_folder='static', template_folder='templates')
    analytics = TaskAnalytics()
    analytics.load_data()

    # 主页路由
    @app.route('/')
    def home():
        return render_template('index.html')

    # 提供其他HTML文件的路由
    @app.route('/<path:filename>')
    def serve_file(filename):
        if filename.endswith('.html'):
            return render_template(filename)
        else:
            return send_from_directory('static', filename)

    # API路由 - 获取任务列表
    @app.route('/api/tasks')
    def get_tasks():
        return {'tasks': analytics.get_task_list()}

    # API路由 - 获取个人任务统计
    @app.route('/api/personal-stats')
    def get_personal_stats():
        return {'stats': analytics.get_personal_stats()}

    # API路由 - 获取标签分布
    @app.route('/api/tag-distribution')
    def get_tag_distribution():
        return {'distribution': analytics.get_tag_distribution()}

    # API路由 - 获取任务汇总
    @app.route('/api/task-summary')
    def get_task_summary():
        return {'summary': analytics.get_task_summary()}

    return app