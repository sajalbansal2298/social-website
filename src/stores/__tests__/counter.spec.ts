import { setActivePinia, createPinia } from 'pinia';
import { useCounterStore } from '../counter';
import { describe, it, expect, beforeEach } from 'vitest';

describe('Counter Store', () => {
  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    setActivePinia(createPinia());
  });

  it('increments', () => {
    const counter = useCounterStore();
    expect(counter.count).toBe(0);
    counter.increment();
    expect(counter.count).toBe(1);
  });

  it('decrements', () => {
    const counter = useCounterStore();
    expect(counter.count).toBe(0);
    counter.decrement();
    expect(counter.count).toBe(-1);
  });

  it('decrements by amount', () => {
    const counter = useCounterStore();
    expect(counter.count).toBe(0);
    counter.decrementBy(2);
    expect(counter.count).toBe(-2);
  });

  it('increments by amount', () => {
    const counter = useCounterStore();
    counter.setCount(1);
    counter.incrementBy(4);
    expect(counter.count).toBe(5);
  });

  it('returns double count', () => {
    const counter = useCounterStore();
    counter.setCount(1);
    expect(counter.doubleCount).toBe(2);
  });
});
