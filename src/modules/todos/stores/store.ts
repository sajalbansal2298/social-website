import { ref, type Ref } from 'vue';
import { defineStore } from 'pinia';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export const useTodosStore = defineStore('todos', () => {
  const todos: Ref<Todo[]> = ref([]);

  function addTodo(title: string) {
    todos.value.push({
      id: todos.value.length + 1,
      title: title,
      completed: false,
    });
  }

  function removeTodo(id: number) {
    todos.value = todos.value.filter((todo) => todo.id !== id);
  }

  function editTodo(id: number, title: string) {
    todos.value = todos.value.map((todo) => {
      if (todo.id === id) {
        todo.title = title;
      }
      return todo;
    });
  }

  function toggleCompleted(id: number) {
    todos.value = todos.value.map((todo) => {
      if (todo.id === id) {
        todo.completed = !todo.completed;
      }
      return todo;
    });
  }

  return { todos, addTodo, removeTodo, toggleCompleted, editTodo };
});
