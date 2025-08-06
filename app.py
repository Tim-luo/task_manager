from task_manager import create_app

app = create_app()

if __name__ == '__main__':
    # 获取当前目录
    import os
    current_dir = os.path.dirname(os.path.abspath(__file__))
    print(f"Serving files from {current_dir}")
    print("Backend server running at http://localhost:5000/")
    app.run(debug=True, host='localhost', port=5000)