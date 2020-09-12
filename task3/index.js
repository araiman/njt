const taskForm = document.querySelector('.task-form');
const todoListView = document.querySelector('.todo-list');

let todos = [];

const WIP = '作業中';
const DONE = '完了';
const DELETE_BUTTON_VALUE = '削除';

class Task {
    constructor(id, value) {
        this.id = id;
        this.state = WIP;
        this.value = value;
    }
}

const addTask = () => {
    const value = taskForm.value.trim();
    if (value.length) {
        const task = new Task(todos.length, value)

        todos.push(task);
        appendToTodoList(task);

        taskForm.value = '';
    }
}

const appendToTodoList = task => {
    const todoView = createTodoView(task);
    todoListView.appendChild(todoView);
}

const createTodoView = task => {
    const idCell = createCell(task.id);
    const todoCell = createCell(task.value);
    const stateCell = createCell(createButton(task.id, task.state, switchState));
    const deleteCell = createCell(createButton(task.id, DELETE_BUTTON_VALUE, deleteTask));

    return createRow([idCell, todoCell, stateCell, deleteCell]);
}

const createRow = columns => {
    const row = document.createElement('tr');
    columns.forEach(c => row.appendChild(c));

    return row;
}

const createCell = value => {
    const cell = document.createElement('td');

    switch (typeof value) {
        case "string":
        case "number":
            cell.textContent = value;
            break;
        default:
            cell.appendChild(value);
    }

    return cell;
}

const createButton = (id, text, clickEvent) => {
    const button = document.createElement('button');
    button.textContent = text;
    button.value = id;
    button.addEventListener('click', clickEvent);
    return button;
}

const switchState = e => {
    tmp = []
    todos.forEach(t => {
        if (t.id != e.target.value) {
            tmp.push(t);
            return;
        }

        t.state = t.state === WIP ? DONE : WIP;
        tmp.push(t);
    });
    todos = tmp;

    reRender(todos);
}

const deleteTask = e => {
    todos = todos.filter(t => t.id != e.target.value)
        .map((t, i) => {
            t.id = i;
            return t;
        });

    reRender(todos);
}

const reRender = todos => {
    todoListView.innerHTML = '';
    todos.forEach(t => todoListView.appendChild(createTodoView(t)));
}
