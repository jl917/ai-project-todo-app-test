import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  filterAtom,
  filteredTodosAtom,
  hasCompletedAtom,
  remainingCountAtom,
  todosAtom,
  type Todo,
  type TodoFilter,
} from './atoms/todoAtoms';
import './App.css';

const FILTERS: { value: TodoFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'active', label: '진행 중' },
  { value: 'completed', label: '완료' },
];

const TodoForm = () => {
  const setTodos = useSetAtom(todosAtom);
  const [text, setText] = useState('');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    setTodos((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text: t, done: false },
    ]);
    setText('');
  };

  return (
    <form className="todo-form" onSubmit={onSubmit}>
      <label className="sr-only" htmlFor="new-todo">
        새 할 일
      </label>
      <input
        id="new-todo"
        className="todo-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="할 일을 입력하세요"
        autoComplete="off"
      />
      <button type="submit" className="btn btn-primary">
        추가2
      </button>
    </form>
  );
};

const TodoItem = ({ todo }: { todo: Todo }) => {
  const setTodos = useSetAtom(todosAtom);

  const toggle = () => {
    setTodos((prev) =>
      prev.map((t) => (t.id === todo.id ? { ...t, done: !t.done } : t)),
    );
  };

  const remove = () => {
    setTodos((prev) => prev.filter((t) => t.id !== todo.id));
  };

  const checkboxId = `todo-${todo.id}`;

  return (
    <li className="todo-item">
      <div className="todo-row">
        <input
          id={checkboxId}
          type="checkbox"
          className="todo-check"
          checked={todo.done}
          onChange={toggle}
        />
        <label
          htmlFor={checkboxId}
          className={`todo-text ${todo.done ? 'done' : ''}`}
        >
          {todo.text}
        </label>
        <button
          type="button"
          className="btn btn-ghost btn-delete"
          onClick={remove}
          aria-label={`삭제: ${todo.text}`}
        >
          삭제
        </button>
      </div>
    </li>
  );
};

const FilterTabs = () => {
  const [filter, setFilter] = useAtom(filterAtom);

  return (
    <div className="filter-tabs" role="tablist" aria-label="할 일 필터">
      {FILTERS.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          role="tab"
          aria-selected={filter === value}
          className={`filter-tab ${filter === value ? 'active' : ''}`}
          onClick={() => setFilter(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

const TodoToolbar = () => {
  const remaining = useAtomValue(remainingCountAtom);
  const hasCompleted = useAtomValue(hasCompletedAtom);
  const setTodos = useSetAtom(todosAtom);

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.done));
  };

  return (
    <div className="todo-toolbar">
      <p className="todo-count" aria-live="polite">
        {remaining === 0 ? '모든 할 일을 끝냈어요' : `남은 할 일 ${remaining}개`}
      </p>
      {hasCompleted ? (
        <button
          type="button"
          className="btn btn-ghost"
          onClick={clearCompleted}
        >
          완료 항목 지우기
        </button>
      ) : null}
    </div>
  );
};

const TodoList = () => {
  const todos = useAtomValue(filteredTodosAtom);

  if (todos.length === 0) {
    return (
      <p className="todo-empty" role="status">
        표시할 할 일이 없습니다.
      </p>
    );
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
};

const App = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>할 일</h1>
        <p className="app-lead">Jotai로 상태를 관리합니다.</p>
      </header>
      <main className="app-main">
        <TodoForm />
        <FilterTabs />
        <TodoList />
        <TodoToolbar />
      </main>
    </div>
  );
};

export default App;
