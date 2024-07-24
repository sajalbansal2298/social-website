import { ref, computed, readonly } from 'vue';
import { defineStore } from 'pinia';
import { userModel } from './users';

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0);
  const doubleCount = computed(() => count.value * 2);
  function increment() {
    userModel.addUser();
    count.value++;
  }

  function setCount(value: number) {
    count.value = value;
  }

  function decrement() {
    count.value--;
  }

  function incrementBy(amount: number) {
    count.value += amount;
  }

  function decrementBy(amount: number) {
    count.value -= amount;
  }

  return {
    count: readonly(count),
    doubleCount,
    setCount,
    increment,
    decrement,
    decrementBy,
    incrementBy,
  };
});
