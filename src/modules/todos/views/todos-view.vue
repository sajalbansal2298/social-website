<script setup lang="ts">
import TodoListElement from '../components/todolist-element.vue';
import TodoListInput from '../components/todolist-input.vue';
import { useTodosStore } from '../stores/store';
import { useCounterStore } from '@/stores';

const counterStore = useCounterStore();
counterStore.increment();
const todosStore = useTodosStore();
</script>
<template>
  <main>
    <h1>Todos</h1>
    <div class="todos">
      <TodoListElement v-for="todo in todosStore.todos" :key="todo.id" :todo="todo" />
      <TodoListInput />
    </div>
  </main>
</template>

<style scoped>
/* stylelint-disable */
</style>
