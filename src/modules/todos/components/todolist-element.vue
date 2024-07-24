<script setup lang="ts">
import { useTodosStore, type Todo } from '../stores/store';
import { ref, onMounted } from 'vue';

defineProps<{
  todo: Todo;
}>();

const emit = defineEmits<{
  (e: 'edit', id: number): void;
  (e: 'submit', id: number): void;
  (e: 'delete', id: number): void;
}>();

const todosStore = useTodosStore();
const todoTitle = ref('');
const isEditingId = ref(0);

function handleEdit(todoId: number): void {
  const thisTodo = todosStore.todos.find((todo) => todo.id === todoId);

  todoTitle.value = thisTodo?.title || '';
  isEditingId.value = todoId;
  emit('edit', todoId);
}

function handleSubmit(todoId: number): void {
  todosStore.editTodo(todoId, todoTitle.value);
  isEditingId.value = 0;
  emit('submit', todoId);
}

function handleDelete(todoId: number): void {
  todosStore.removeTodo(todoId);
  emit('delete', todoId);
}

function logger() {
  console.log('hey this is logged');
}

onMounted(() => {
  logger();
});
</script>
<template>
  <div class="todo" data-test="todo">
    <input
      class="todoInput todoText"
      v-show="todo.id == isEditingId"
      type="text"
      v-model="todoTitle"
      @keyup.enter="handleSubmit(todo.id)"
      data-test="edit-input"
    />
    <div
      class="todoText"
      :class="{ completed: todo.completed }"
      @dblclick="handleEdit(todo.id)"
      @click="todosStore.toggleCompleted(todo.id)"
      data-test="todo-text"
      v-show="todo.id != isEditingId"
    >
      {{ todo.title }}
    </div>
    <button v-show="todo.id == isEditingId" @click="handleSubmit(todo.id)" data-test="done-button">done</button>
    <button
      v-show="todo.id != isEditingId"
      :disabled="todo.completed"
      @click="handleEdit(todo.id)"
      data-test="edit-button"
    >
      Edit
    </button>
    <button @click="handleDelete(todo.id)" data-test="delete-button">X</button>
  </div>
</template>

<style scoped>
.todo {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  border-bottom: 1px solid hsl(160deg 100% 37% / 100%);
  padding: 10px;
  color: white;
}

.completed {
  text-decoration: line-through;
  color: gray;
}

.todoText {
  min-width: 500px;
  cursor: pointer;
  color: red;
}

.todoInput {
  background-color: black;
  color: white;
  border: 1px solid hsl(160deg 100% 37% / 100%);
  padding: 10px 20px;
  border-radius: 5px;
}
</style>
