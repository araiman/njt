const taskForm = document.querySelector('.task-form');
const todoListView = document.querySelector('.todo-list');
const styleWip = document.querySelector('#style-wip');
const styleDone = document.querySelector('#style-done');

let todos = [];

const DELETE_BUTTON_VALUE = '削除';

const taskState = {
    wip: {
        value: 'wip',
        label: '作業中'
    },
    done: {
        value: 'done',
        label: '完了'
    }
}

class Task {
    constructor(id, value) {
        this.id = id;
        this.state = taskState.wip;
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
    const stateCell = createCell(createButton(task.id, task.state.label, switchState));
    const deleteCell = createCell(createButton(task.id, deleteButtonLabel, deleteTask));

    return createRow(task.state.value, [idCell, todoCell, stateCell, deleteCell]);
}

const createRow = (state, columns) => {
    const row = document.createElement('tr');
    row.classList.add(state);
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
    todos.forEach(item => {
        if (item.id != e.target.value) {
            tmp.push(item);
            return;
        }

        item.state = item.state === taskState.wip ? taskState.done : taskState.wip;
        tmp.push(item);
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
    todos.forEach(item => todoListView.appendChild(createTodoView(item)));
}

const switchFilterByState = state => {
    switch (state) {
        case taskState.wip.value:
            styleWip.disabled = false;
            styleDone.disabled = true;
            break;
        case taskState.done.value:
            styleWip.disabled = true;
            styleDone.disabled = false;
            break;
        default:
            styleWip.disabled = true;
            styleDone.disabled = true;
    }
}