import { describe, it, expect, beforeEach } from 'vitest';

import { mount } from '@vue/test-utils';
import TodoListInput from '../todolist-input.vue';
import { createPinia, setActivePinia } from 'pinia';

describe('TodoListInput', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });
  it('renders properly', () => {
    const wrapper = mount(TodoListInput);

    expect(wrapper.find('[data-test="todo-input"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="add-button"]').exists()).toBe(true);
  });

  it('should be able to to change input', async () => {
    const wrapper = mount(TodoListInput);

    const input = wrapper.find('[data-test="todo-input"]');

    await input.setValue('Learn Vue 3');

    expect((input.element as HTMLInputElement).value).toBe('Learn Vue 3');
  });

  it('should be able to add todo', async () => {
    const wrapper = mount(TodoListInput);

    const input = wrapper.find('[data-test="todo-input"]');
    const button = wrapper.find('[data-test="add-button"]');
    await input.setValue('Learn Vue 3');
    await button.trigger('click');

    expect((input.element as HTMLInputElement).value).toBe('');
  });
});
