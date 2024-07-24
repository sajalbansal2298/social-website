<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  selectedOptionId: {
    required: true,
    type: String,
  },
  isCorrect: {
    required: true,
    type: Boolean,
  },
  points: {
    required: true,
    type: Number,
  },
});

const getButtonState = computed((): { class: string; text: string } => {
  if (!props.selectedOptionId) {
    return {
      class: 'notAnswered',
      text: `Not Answered: ${props.points} Pts`,
    };
  }
  if (!props.isCorrect) {
    return {
      class: 'incorrect',
      text: `Incorrect Answer: ${props.points} Pts`,
    };
  }
  return {
    class: 'correct',
    text: `Correct Answer: ${props.points} Pts`,
  };
});
</script>

<template>
  <button :class="getButtonState.class" @click="$emit('button-clicked')">
    {{ getButtonState.text }}
  </button>
</template>

<style scoped lang="scss">
button {
  display: block;
  background-color: #21a1f6;
  color: #fff;
  width: 100%;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 150%;
  padding: 8px;
  max-width: 190px;
  border-radius: 100px;
  transition: 0.25s;

  &:hover {
    filter: brightness(1.1);
  }

  &:disabled {
    cursor: unset;

    &:hover {
      filter: none;
    }
  }
}

.notAnswered {
  background-color: #e48845;
}

.incorrect {
  background-color: #c54645;
}

.correct {
  background-color: #3b964f;
}
</style>
