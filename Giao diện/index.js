const API_URL = `${window.location.protocol}//${window.location.hostname}:8080/api/todos`;

const taskInput = document.getElementById('task-text-input');
const prioritySelect = document.getElementById('task-priority-select');
const addTaskBtn = document.getElementById('add-task-btn');
const taskContainer = document.getElementById('task-container');
const filterInputs = document.querySelectorAll("input[name='filter']");
const notesInput = document.getElementById('notes-input');
const saveNotesBtn = document.getElementById('save-notes-btn');

let allTodos = [];
let currentFilter = 'all';

function normalizePriority(value) {
    if (!value) return 'Cao';
    const lower = String(value).toLowerCase();
    if (lower === 'cao' || lower === 'high') return 'Cao';
    if (lower === 'trungbinh' || lower === 'medium' || lower === 'trung bình') return 'TrungBinh';
    if (lower === 'thap' || lower === 'low') return 'Thap';
    return 'Cao';
}

function getPriorityClass(priority) {
    const normalized = normalizePriority(priority);
    if (normalized === 'Cao') return 'high';
    if (normalized === 'TrungBinh') return 'medium';
    return 'low';
}

function getPriorityLabel(priority) {
    const normalized = normalizePriority(priority);
    if (normalized === 'Cao') return 'Cao';
    if (normalized === 'TrungBinh') return 'Trung bình';
    return 'Thấp';
}

function initPage() {
    fetch(API_URL)
        .then((response) => response.json())
        .then((data) => {
            allTodos = Array.isArray(data) ? data : [];
            renderTasks();
        })
        .catch((error) => console.error('Lỗi khi tải trang', error));
}

function renderTasks() {
    const filteredTodos = allTodos.filter((todo) => {
        if (currentFilter === 'all') return true;

        const priority = normalizePriority(todo.priority);
        const className = getPriorityClass(priority);

        if (currentFilter === 'high') return className === 'high';
        if (currentFilter === 'Medium') return className === 'medium';
        if (currentFilter === 'Low') return className === 'low';
        return true;
    });

    taskContainer.innerHTML = filteredTodos.map((todo) => {
        const priority = normalizePriority(todo.priority);
        const className = getPriorityClass(priority);
        return `
            <li class="task-item ${className}">
                <div class="info">
                    <span class="title">${todo.title}</span>
                    <div class="meta">
                        <span class="priority-tag">${getPriorityLabel(priority)}</span>
                        <span>${todo.completed ? 'Hoàn thành' : 'Đang làm'}</span>
                    </div>
                </div>
                <div class="actions">
                    <button class="done-btn" data-id="${todo.id}" data-action="toggle">
                        ${todo.completed ? 'Hoàn tác' : 'Hoàn thành'}
                    </button>
                    <button class="delete-btn" data-id="${todo.id}" data-action="delete">Xóa</button>
                </div>
            </li>
        `;
    }).join('');
}

function addTask() {
    const title = taskInput.value.trim();

    if (!title) {
        alert('Vui lòng nhập nội dung');
        return;
    }

    const newTask = {
        title: title,
        completed: false,
        priority: prioritySelect ? prioritySelect.value : 'Cao',
    };

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Thêm task thất bại');
            }
            return response.json();
        })
        .then((savedTask) => {
            allTodos.push(savedTask);
            taskInput.value = '';
            if (prioritySelect) prioritySelect.value = 'Cao';
            renderTasks();
        })
        .catch((error) => {
            console.error('Lỗi khi thêm task:', error);
            alert('Không thể thêm việc');
        });
}

function updateTask(id, completed) {
    const todo = allTodos.find((item) => Number(item.id) === Number(id));
    if (!todo) return;

    fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: todo.id,
            title: todo.title,
            completed: completed,
            priority: todo.priority,
        }),
    })
        .then((response) => response.json())
        .then((updatedTodo) => {
            allTodos = allTodos.map((item) =>
                Number(item.id) === Number(id) ? updatedTodo : item
            );
            renderTasks();
        })
        .catch((error) => {
            console.error('Lỗi cập nhật task:', error);
        });
}

function deleteTask(id) {
    fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    })
        .then(() => {
            allTodos = allTodos.filter((todo) => Number(todo.id) !== Number(id));
            renderTasks();
        })
        .catch((error) => {
            console.error('Lỗi xóa task:', error);
        });
}

function saveNotes() {
    if (!notesInput) return;
    localStorage.setItem('todo-notes', notesInput.value);
    alert('Ghi chú đã lưu');
}

function loadNotes() {
    if (!notesInput) return;
    const savedNotes = localStorage.getItem('todo-notes');
    if (savedNotes) {
        notesInput.value = savedNotes;
    }
}

function bindEvents() {
    addTaskBtn.addEventListener('click', addTask);

    taskInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    if (saveNotesBtn) {
        saveNotesBtn.addEventListener('click', saveNotes);
    }

    filterInputs.forEach((checkbox) => {
        checkbox.addEventListener('change', (event) => {
            if (!event.target.checked) return;
            currentFilter = event.target.value;
            renderTasks();
        });
    });

    taskContainer.addEventListener('click', (event) => {
        const button = event.target.closest('button');
        if (!button) return;

        const id = button.dataset.id;
        const action = button.dataset.action;

        if (action === 'toggle') {
            const todo = allTodos.find((item) => Number(item.id) === Number(id));
            if (todo) {
                updateTask(id, !todo.completed);
            }
        }

        if (action === 'delete') {
            deleteTask(id);
        }
    });
}

function init() {
    loadNotes();
    bindEvents();
    initPage();
}

document.addEventListener('DOMContentLoaded', init);
