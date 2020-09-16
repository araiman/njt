const taskForm = document.querySelector('.task-form');
const todoListView = document.querySelector('.todo-list');
const stateFilter = document.querySelectorAll('.filter-button');
const addTaskButton = document.querySelector('.add-task-button');

const deleteButtonLabel = '削除';

const taskState = {
    default: {},
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

let todos = [];
let displayState = taskState.default;

const addTask = () => {
    const value = taskForm.value.trim();
    if (value.length) {
        const task = new Task(todos.length, value)
        todos.push(task);

        reRender(todos);
        taskForm.value = '';
    }
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
    columns.forEach(c => row.appendChild(c));

    return row;
}

const createCell = value => {
    const cell = document.createElement('td');

    switch (typeof value) {
        case 'string':
        case 'number':
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
    todos = todos.filter(item => item.id != e.target.value)
        .map((t, i) => {
            t.id = i;
            return t;
        });

    reRender(todos);
}

const switchFilterByState = e => {
    switch (e.target.value) {
        case taskState.wip.value:
            displayState = taskState.wip;
            reRender(todos);
            break;
        case taskState.done.value:
            displayState = taskState.done;
            reRender(todos);
            break;
        default:
            displayState = taskState.default;
            reRender(todos);
    }
}

const reRender = todos => {
    todoListView.innerHTML = '';

    displayState === taskState.default
        ? todos.forEach(item => todoListView.appendChild(createTodoView(item)))
        : todos.filter(item => item.state === displayState).forEach(item => todoListView.appendChild(createTodoView(item)));
}

window.onload = () => {
    stateFilter.forEach(f => f.addEventListener('change', switchFilterByState));
    addTaskButton.addEventListener('click', addTask);
}
