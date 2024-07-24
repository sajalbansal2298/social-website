import { setActivePinia, createPinia } from 'pinia';
import { useTodosStore } from './store';
import { describe, it, expect, beforeEach } from 'vitest';

// const todos = [
//   {
//     id: 1,
//     title: "Learn Vue 3",
//     completed: false,
//   },
//   {
//     id: 2,
//     title: "Learn Vue Router",
//     completed: false,
//   },
//   {
//     id: 3,
//     title: "Learn Pinia",
//     completed: false,
//   },
// ];

describe('Todo Store', () => {
  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    setActivePinia(createPinia());
  });

  it('should start empty', () => {
    const todos = useTodosStore();
    expect(todos.todos.length).toBe(0);
  });

  it('should add a todo', () => {
    const todos = useTodosStore();
    todos.addTodo('Learn Vue 3');
    expect(todos.todos.length).toBe(1);
  });

  it('should remove a todo', () => {
    const todos = useTodosStore();
    todos.addTodo('Learn Vue 3');
    todos.addTodo('Learn Vue Router');
    todos.addTodo('Learn Pinia');
    expect(todos.todos.length).toBe(3);
    todos.removeTodo(2);
    expect(todos.todos.length).toBe(2);
  });

  it('should edit a todo', () => {
    const todos = useTodosStore();
    todos.addTodo('Learn Vue 3');
    todos.addTodo('Learn Vue Router');
    todos.addTodo('Learn Pinia');
    expect(todos.todos.length).toBe(3);
    todos.editTodo(2, 'Learn Vue Router 4');
    expect(todos.todos[1].title).toBe('Learn Vue Router 4');
  });

  it('should toggle a todo', () => {
    const todos = useTodosStore();
    todos.addTodo('Learn Vue 3');
    todos.addTodo('Learn Vue Router');
    todos.addTodo('Learn Pinia');

    expect(todos.todos[0].completed).toBe(false);
    todos.toggleCompleted(1);
    expect(todos.todos[0].completed).toBe(true);
  });
});
