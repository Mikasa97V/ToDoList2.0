import { createTodoApp } from "../index.js";

async function getTodoList(owner) {
  const response = await fetch(`http://localhost:3000/api/todos?owner=${owner}`);
  return response.json();
}

async function createTodoItem({ owner, name }) {
  const response = await fetch('http://localhost:3000/api/todos', {
    method: 'POST',
    body: JSON.stringify({
      name,
      owner,
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  return response.json();
}

const generateUniqueId = () => {
  return Math.random().toString(16).slice(2)
}

function createTodoItemToLocalStorage({ owner, name }) {
  const todoList = JSON.parse(localStorage.getItem(`todoList-${owner}`)) ?? []
  const newTodoItem = {
    owner,
    name,
    done: false,
    id: generateUniqueId(),
  }
  todoList.push(newTodoItem)
  localStorage.setItem(`todoList-${owner}`, JSON.stringify(todoList))

  return newTodoItem
}

function switchTodoItemDone({ todoItem }) {
  todoItem.done = !todoItem.done;
  fetch(`http://localhost:3000/api/todos/${todoItem.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ done: todoItem.done }),
    headers: { 'Content-type': 'application/json' },
  })
    .then(() => {
      console.log('change');
    });
}

function switchTodoItemDoneToLocalStorage({ todoItem }) {
  const todoList = JSON.parse(localStorage.getItem(`todoList-${todoItem.owner}`)) ?? []
  const newTodoList = todoList.map((it) => (
    it.id === todoItem.id
      ? { ...it, done:  !todoItem.done}
      : it
  ));

  localStorage.setItem(`todoList-${todoItem.owner}`, JSON.stringify(newTodoList))
}

function deleteTodoItem({ element, todoItem }) {
  if (!confirm('Вы уверены?')) return;
  element.remove();
  fetch(`http://localhost:3000/api/todos/${todoItem.id}`, {
    method: 'DELETE',
  })
    .then(() => {
      console.log('DELETED');
    });
}

function deleteTodoItemFromLocalStorage({ element, todoItem }) {
  if (!confirm('Вы уверены?')) return;
  element.remove();
  const todoList = JSON.parse(localStorage.getItem(`todoList-${todoItem.owner}`)) ?? []
  const newTodoList = todoList.filter((it) => it.id !== todoItem.id)

  localStorage.setItem(`todoList-${todoItem.owner}`, JSON.stringify(newTodoList))
}


export async function startTodoApp(owner, title) {
  const storageType = localStorage.getItem('storageType');
    let todoItemList = []
    let onCreateFormSubmit, onDoneClick, onDeleteClick;
    if (storageType === 'server') {
      todoItemList = await getTodoList(owner);
      onCreateFormSubmit = createTodoItem
      onDoneClick = switchTodoItemDone
      onDeleteClick = deleteTodoItem
    } else {
      todoItemList = JSON.parse(localStorage.getItem(`todoList-${owner}`)) ?? []
      onCreateFormSubmit = createTodoItemToLocalStorage
      onDoneClick = switchTodoItemDoneToLocalStorage
      onDeleteClick = deleteTodoItemFromLocalStorage
    }
    console.log('todoItemList', todoItemList)
    await createTodoApp(document.getElementById('todo-app'), {
      title,
      owner,
      todoItemList,
      onCreateFormSubmit,
      onDoneClick,
      onDeleteClick,
    });
}
