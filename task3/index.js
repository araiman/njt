const taskForm = document.querySelector('.task-form');
const todoList = document.querySelector('.todo-list');

const todos = [];

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
  const idCell = createCell(task.id);
  const todoCell = createCell(task.value);
  const stateCell = createCell(createButton(task.state));
  const deleteCell = createCell(createButton(DELETE_BUTTON_VALUE));

  const todo = createRow([idCell, todoCell, stateCell, deleteCell]);

  todoList.appendChild(todo);
}

const createCell = value => {
  const cell = document.createElement('td');

  switch (typeof value) {
    case "string":
      cell.textContent = value;
      break;
    case "number":
      cell.textContent = value;
      break;
    default:
      cell.appendChild(value);
  }

  return cell;
}

const createButton = value => {
  const button = document.createElement('button');
  button.textContent = value;

  return button;
}

const createRow = (columns) => {
  const row = document.createElement('tr');
  columns.forEach(c => {
    row.appendChild(c);
  })

  return row;
}
