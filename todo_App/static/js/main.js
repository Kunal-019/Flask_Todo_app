document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');

    taskForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const taskTitle = document.getElementById('task-title').value;
        await addTask(taskTitle);
        document.getElementById('task-title').value = '';
    });

    taskList.addEventListener('click', async (event) => {
        const target = event.target;
        const taskId = target.parentElement.getAttribute('data-id');

        if (target.classList.contains('edit-btn')) {
            const newTitle = prompt('Edit task title:', target.previousElementSibling.previousElementSibling.textContent);
            if (newTitle) {
                await editTask(taskId, newTitle);
            }
        } else if (target.classList.contains('delete-btn')) {
            await deleteTask(taskId);
        } else if (target.classList.contains('status-btn')) {
            const newStatus = target.dataset.status;
            await updateTaskStatus(taskId, newStatus);
        }
    });

    async function addTask(title) {
        const response = await fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title }),
        });
        if (response.ok) {
            const task = await response.json();
            const taskElement = createTaskElement(task);
            taskList.appendChild(taskElement);
        }
    }

    async function editTask(id, title) {
        const response = await fetch(`/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title }),
        });
        if (response.ok) {
            location.reload();
        }
    }

    async function deleteTask(id) {
        const response = await fetch(`/tasks/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            location.reload();
        }
    }

    async function updateTaskStatus(id, status) {
        const response = await fetch(`/tasks/${id}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });
        if (response.ok) {
            location.reload();
        }
    }

    function createTaskElement(task) {
        const li = document.createElement('li');
        li.setAttribute('data-id', task.id);

        const titleSpan = document.createElement('span');
        titleSpan.textContent = task.title;

        const statusSpan = document.createElement('span');
        statusSpan.textContent = task.status;

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-btn');

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-btn');

        const statusButton = document.createElement('button');
        statusButton.textContent = 'Change Status';
        statusButton.classList.add('status-btn');
        statusButton.dataset.status = 'completed';  

        li.appendChild(titleSpan);
        li.appendChild(statusSpan);
        li.appendChild(editButton);
        li.appendChild(deleteButton);
        li.appendChild(statusButton);

        return li;
    }
});
