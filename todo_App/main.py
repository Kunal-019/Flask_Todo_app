from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

tasks = []

@app.route('/')
def index():
    return render_template('index.html', tasks=tasks)

@app.route('/tasks', methods=['POST']) # adding task api
def add_task():
    data = request.get_json()
    task = {
        'id': len(tasks) + 1,
        'title': data['title'],
        'status': 'in_progress'
    }
    tasks.append(task)
    return jsonify(task), 201

@app.route('/tasks/<int:id>', methods=['PUT']) # editing task api
def edit_task(id):
    data = request.get_json()
    task = next((task for task in tasks if task['id'] == id), None)
    if task is None:
        return jsonify({'error': 'Task not found'}), 404
    task['title'] = data.get('title', task['title'])
    task['status'] = data.get('status', task['status'])
    return jsonify(task)

@app.route('/tasks/<int:id>', methods=['DELETE'])  # deleting task api
def delete_task(id):
    global tasks
    tasks = [task for task in tasks if task['id'] != id]
    return '', 204

@app.route('/tasks/<int:id>/status', methods=['PUT']) # updating task_Status api
def update_task_status(id):
    data = request.get_json()
    task = next((task for task in tasks if task['id'] == id), None)
    if task is None:
        return jsonify({'error': 'Task not found'}), 404
    task['status'] = data.get('status', task['status'])
    return jsonify(task)

if __name__ == '__main__':
    app.run(debug=True)
