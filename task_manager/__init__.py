from flask import Flask, render_template, send_from_directory
import os

def create_app():
    app = Flask(__name__, static_folder='static', template_folder='templates')

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

    return app