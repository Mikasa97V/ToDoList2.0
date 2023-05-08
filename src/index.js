import {
  createAppTitle,
  createTodoItemElement,
  createTodoItemForm,
  createTodoList,
} from './todo-app/view.js';

async function createTodoApp(container, {
  title,
  owner,
  todoItemList = [],
  onCreateFormSubmit,
  onDoneClick,
  onDeleteClick,
}) {
  const todoAppTitle = createAppTitle(title);
  const todoItemForm = createTodoItemForm();
  const todoList = createTodoList();
  const handlers = { onDone: onDoneClick, onDelete: onDeleteClick };

  container.append(todoAppTitle);
  container.append(todoItemForm.form);
  container.append(todoList);

  todoItemList.forEach((todoItem) => {
    const todoItemElement = createTodoItemElement(todoItem, handlers);
    todoList.append(todoItemElement);
  });

  todoItemForm.form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!todoItemForm.input.value) return;

    const todoItem = await onCreateFormSubmit({
      owner,
      name: todoItemForm.input.value.trim(),
    });
    const todoItemElement = createTodoItemElement(todoItem, handlers);

    todoList.append(todoItemElement);
    todoItemForm.input.value = '';
  });

}

export { createTodoApp };
