const taskForm = document.querySelector('.task-form');
const todo = document.querySelector('.todo');

const WIP = '作業中';
const DONE = '完了';

taskForm.addEventListener('submit', e => {
    e.preventDefault();

    const taskName = taskForm.task.value.trim();

    if (taskName.length) {
        todoController.addItem(taskName);
        taskForm.reset();
    }
});

const todoController = {
    todo: [],
    addItem: name => {
        const item = new Task(todoController.todo.length, name);
        todoController.todo.push(item);
        todoRenderer.addItem(item);
    },
    deleteItem: id => {
        todoController.todo = todoController.todo.filter(t => t.id !== id).map((t, i) => {
            t.id = i;
            return t
        });
        todoRenderer.reRender(todoController.todo);
    }
}

const todoRenderer = {
    header: `
      <tr>
        <th>ID</th>
        <th>コメント</th>
        <th>状態</th>
        <th></th>
      </tr>
    `,
    // インデント変
    row: task => {
        return `
        <tr>
         <td>${task.id}</td>
         <td>${task.value}</td>
         <td><button>${task.state}</button></td>
         <td><button onclick="todoController.deleteItem(${task.id})">削除</button></td>
        </tr>
    `
    },
    addItem: item => {
        todo.innerHTML += todoRenderer.row(item);
    },
    reRender: tasks => {
        const taskList = tasks.reduce((html, task) => html + todoRenderer.row(task), ``);
        todo.innerHTML = todoRenderer.header + taskList;
    }
}

class Task {
    constructor(id, value) {
        this.id = id;
        this.state = WIP;
        this.value = value;
    }
}
