<script setup lang="ts">
import { useTodosStore } from '../stores/store';
import { ref } from 'vue';
const todosStore = useTodosStore();
const newTodoTitle = ref('');

function handleAddTodo(): void {
  todosStore.addTodo(newTodoTitle.value);
  newTodoTitle.value = '';
}
</script>
<template>
  <div class="addTodo">
    <input
      class="todoInput"
      type="text"
      v-model="newTodoTitle"
      placeholder="Add a todo"
      @keyup.enter="handleAddTodo()"
      data-test="todo-input"
    />
    <button @click="handleAddTodo()" data-test="add-button">Add</button>
  </div>
</template>

<style scoped>
.todoInput {
  background-color: black;
  color: white;
  border: 1px solid hsl(160deg 100% 37% / 100%);
  padding: 10px 20px;
  border-radius: 5px;
}
</style>
