const taskForm = document.querySelector('.task-form');
const todos = document.querySelector('.todos');

let taskId = 0;

const WIP = '作業中';
const DONE = '完了';

class Task {
  constructor(id, value) {
    this.id = id;
    this.state = WIP;
    this.value = value;
  }
}

const addTodo = task => {
  const html = `
    <tr>
      <td>${task.id}</td>
      <td>${task.value}</td>
      <td><button>${task.state}</button></td>
      <td><button>削除</button></td>
    </tr>
    `;

  todos.innerHTML += html;
}

taskForm.addEventListener('submit', e => {
  e.preventDefault();

  const taskName = taskForm.task.value.trim();

  if (taskName.length) {
    const task = new Task(taskId++, taskName)
    addTodo(task);
    taskForm.reset();
  }
});
