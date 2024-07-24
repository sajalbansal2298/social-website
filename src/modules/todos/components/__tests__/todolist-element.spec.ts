import { describe, it, expect, beforeAll } from 'vitest';

import { mount } from '@vue/test-utils';
import TodoListElement from '../todolist-element.vue';
import { createPinia, setActivePinia } from 'pinia';

const todo = {
  id: 1,
  title: 'Learn Vue 3',
  completed: false,
};

describe('TodoListElement', () => {
  beforeAll(() => {
    setActivePinia(createPinia());
  });
  it('renders properly', () => {
    const wrapper = mount(TodoListElement, { props: { todo } });

    expect(wrapper.find('[data-test="todo-text"]').text()).toContain('Learn Vue 3');
  });
  it('should have edit button', () => {
    const wrapper = mount(TodoListElement, { props: { todo } });

    expect(wrapper.find('[data-test="edit-button"]').exists()).toBe(true);
  });

  it('should have delete button', () => {
    const wrapper = mount(TodoListElement, { props: { todo } });

    expect(wrapper.find('[data-test="delete-button"]').exists()).toBe(true);
  });

  it('should have done button', () => {
    const wrapper = mount(TodoListElement, { props: { todo } });

    expect(wrapper.find('[data-test="done-button"]').exists()).toBe(true);
  });

  it('done button should not be visible initially', () => {
    const wrapper = mount(TodoListElement, { props: { todo } });

    expect(wrapper.find('[data-test="done-button"]').isVisible()).toBe(false);
  });

  it('should have edit input', () => {
    const wrapper = mount(TodoListElement, { props: { todo } });

    expect(wrapper.find('[data-test="edit-input"]').exists()).toBe(true);
  });

  it('edit input should not be visible initially', () => {
    const wrapper = mount(TodoListElement, { props: { todo } });

    expect(wrapper.find('[data-test="edit-input"]').isVisible()).toBe(false);
  });

  it('should show input when clicked in edit button', async () => {
    const wrapper = mount(TodoListElement, { props: { todo } });

    const editButton = wrapper.find('[data-test="edit-button"]');
    await editButton.trigger('click');

    expect(wrapper.find('[data-test="edit-input"]').isVisible()).toBe(true);
  });

  it('should show done button when clicked in edit button', async () => {
    const wrapper = mount(TodoListElement, { props: { todo } });

    const editButton = wrapper.find('[data-test="edit-button"]');
    await editButton.trigger('click');

    expect(wrapper.find('[data-test="done-button"]').isVisible()).toBe(true);
  });

  it('should hide edit button when clicked in edit button', async () => {
    const wrapper = mount(TodoListElement, { props: { todo } });

    const editButton = wrapper.find('[data-test="edit-button"]');
    await editButton.trigger('click');

    expect(wrapper.find('[data-test="edit-button"]').isVisible()).toBe(false);
  });

  it('should show input to edit todo when clicked in edit button', async () => {
    const wrapper = mount(TodoListElement, { props: { todo } });

    const editButton = wrapper.find('[data-test="edit-button"]');
    await editButton.trigger('click');

    const editInput = wrapper.find('[data-test="edit-input"]');

    expect(editInput.isVisible()).toBe(true);
  });

  it('should be able to edit value', async () => {
    const wrapper = mount(TodoListElement, { props: { todo } });
    const value = 'Learn Vue 3 and Vite';

    const editButton = wrapper.find('[data-test="edit-button"]');
    await editButton.trigger('click');

    const editInput = wrapper.find('[data-test="edit-input"]');
    await editInput.setValue(value);

    expect((editInput.element as HTMLInputElement).value).toBe(value);

    const doneButton = wrapper.find('[data-test="done-button"]');
    await doneButton.trigger('click');

    expect(wrapper.find('[data-test="todo-text"]').isVisible()).toBe(true);
  });

  it('should emit submit event when clicked in done button', async () => {
    const wrapper = mount(TodoListElement, { props: { todo } });
    const value = 'Learn Vue 3 and Vite';

    const editButton = wrapper.find('[data-test="edit-button"]');
    await editButton.trigger('click');

    const editInput = wrapper.find('[data-test="edit-input"]');
    await editInput.setValue(value);

    const doneButton = wrapper.find('[data-test="done-button"]');
    await doneButton.trigger('click');

    expect(wrapper.emitted('submit')).toBeTruthy();
  });

  it('should emit delete event when clicked in delete button', async () => {
    const wrapper = mount(TodoListElement, { props: { todo } });

    const deleteButton = wrapper.find('[data-test="delete-button"]');
    await deleteButton.trigger('click');

    expect(wrapper.emitted('delete')).toBeTruthy();
  });

  it('should emit edit event when clicked in edit button', async () => {
    const wrapper = mount(TodoListElement, { props: { todo } });

    const editButton = wrapper.find('[data-test="edit-button"]');
    await editButton.trigger('click');

    expect(wrapper.emitted('edit')).toBeTruthy();
  });
});
