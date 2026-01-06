'use client';

import { useEffect, useState } from 'react';
import TodoCard from '@/app/components/TodoCard';
import TodoModal from '@/components/TodoModal';
import { Todo } from '@/types/todo';
import { todoApi } from '@/lib/api/todoApi';

export default function DashboardPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await todoApi.getAllTodos();
      console.log('Fetched todos:', data);
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    try {
      const updated = await todoApi.updateTodo(id, {
        ...todo,
        completed: !todo.completed,
      });
      setTodos(todos.map(t => t.id === id ? updated : t));
    } catch (err) {
      console.error('Error toggling todo:', err);
      alert('Failed to update todo');
    }
  };

  const handleEdit = (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      setEditingTodo(todo);
      setIsModalOpen(true);
    }
  };

  const handleSave = async (todo: any) => {
    if (editingTodo?.id) {
      const updated = await todoApi.updateTodo(editingTodo.id, todo);
      setTodos(todos.map(t => t.id === editingTodo.id ? updated : t));
    } else {
      const created = await todoApi.createTodo(todo);
      setTodos([...todos, created]);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this todo?')) {
      return;
    }

    try {
      await todoApi.deleteTodo(id);
      setTodos(todos.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error deleting todo:', err);
      alert('Failed to delete todo');
    }
  };

  return (
    <>
      <header className="relative bg-gray-800 after:pointer-events-none after:absolute after:inset-x-0 after:inset-y-0 after:border-y after:border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Dashboard
          </h1>
          <button
            onClick={() => {
              setEditingTodo(null);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            + Add Todo
          </button>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-2 text-gray-600">Loading todos...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              <p className="font-semibold">Error loading todos</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {!loading && !error && todos.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-lg">No todos yet</p>
              <p className="text-gray-500 text-sm mt-2">Create your first todo to get started!</p>
            </div>
          )}

          {!loading && !error && todos.length > 0 && (
            <div className="space-y-4">
              {todos.map((todo) => (
                <TodoCard
                  key={todo.id}
                  {...todo}
                  onToggle={handleToggle}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <TodoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTodo(null);
        }}
        todo={editingTodo}
        onSave={handleSave}
      />
    </>
  );
}
