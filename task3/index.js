const taskForm = document.querySelector('.task-form');
const todos = document.querySelector('.todos');

let tasks = [];

const WIP = '作業中';
const DONE = '完了';

// classなのか、constを使うのがいいのか
class Task {
  constructor(id, value) {
    this.id = id;
    this.state = WIP;
    this.value = value;
  }
}

// TODOなのか、タスクなのか
const tasksHeader = `
      <tr>
        <th>ID</th>
        <th>コメント</th>
        <th>状態</th>
        <th></th>
      </tr>
`

const taskHtml = task => {
  return `
    <tr>
      <td>${task.id}</td>
      <td>${task.value}</td>
      <td><button>${task.state}</button></td>
      <td><button onclick="deleteItem(${task.id})">削除</button></td>
    </tr>
  `
}

const reRender = tasks => {
  const taskList = tasks.reduce((html, task) => html + taskHtml(task), ``);
  todos.innerHTML = tasksHeader + taskList;
}

// 名前がバラバラ
const addTodo = task => {
  tasks.push(task);
  todos.innerHTML += taskHtml(task);
}

const deleteItem = id => {
  // どうインデントするのが正しいのか
  tasks = tasks.filter(t => t.id !== id).map((t,i) => {
    t.id = i;
    return t
  });
  reRender(tasks);
}


taskForm.addEventListener('submit', e => {
  e.preventDefault();

  const taskName = taskForm.task.value.trim();

  if (taskName.length) {
    // ID発行の責務をどこに持たせるか
    const task = new Task(tasks.length, taskName);
    addTodo(task);
    taskForm.reset();
  }
});
