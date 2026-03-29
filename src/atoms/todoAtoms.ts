import { atom } from 'jotai';

export type Todo = {
  id: string;
  text: string;
  done: boolean;
};

export const todosAtom = atom<Todo[]>([]);

export type TodoFilter = 'all' | 'active' | 'completed';

export const filterAtom = atom<TodoFilter>('all');

export const filteredTodosAtom = atom((get) => {
  const todos = get(todosAtom);
  const f = get(filterAtom);
  if (f === 'active') return todos.filter((t) => !t.done);
  if (f === 'completed') return todos.filter((t) => t.done);
  return todos;
});

export const remainingCountAtom = atom(
  (get) => get(todosAtom).filter((t) => !t.done).length,
);

export const hasCompletedAtom = atom((get) =>
  get(todosAtom).some((t) => t.done),
);
