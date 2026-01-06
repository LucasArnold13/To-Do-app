import { Todo } from '@/types/todo';
import { request } from './apiClient';

export const todoApi = {
  getAllTodos: (): Promise<Todo[]> => 
    request<Todo[]>('/api/todos'),

  getTodoById: (id: number): Promise<Todo> => 
    request<Todo>(`/api/todos/${id}`),

  createTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Promise<Todo> => 
    request<Todo>('/api/todos', {
      method: 'POST',
      body: JSON.stringify(todo),
    }),

  updateTodo: (id: number, todo: Partial<Todo>): Promise<Todo> => 
    request<Todo>(`/api/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(todo),
    }),

  deleteTodo: (id: number): Promise<void> => 
    request<void>(`/api/todos/${id}`, {
      method: 'DELETE',
    }),

  toggleTodoCompleted: (id: number, completed: boolean): Promise<Todo> => 
    request<Todo>(`/api/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ completed }),
    }),

  getTodosByCompleted: (completed: boolean): Promise<Todo[]> => 
    request<Todo[]>(`/api/todos/completed/${completed}`),
};
