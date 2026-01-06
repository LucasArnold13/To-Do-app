'use client';

import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { todoApi } from '@/lib/api/todoApi';
import { Todo } from '@/types/todo';
import TodoModal from '@/components/TodoModal';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await todoApi.getAllTodos();
      setTodos(data);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTodo = async (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (selectedTodo?.id) {
        await todoApi.updateTodo(selectedTodo.id, { ...todo, id: selectedTodo.id });
      } else {
        await todoApi.createTodo(todo);
      }
      await fetchTodos();
      setIsModalOpen(false);
      setSelectedTodo(null);
      setSelectedDate(null);
    } catch (error) {
      console.error('Failed to save todo:', error);
    }
  };

  const getTodosForDay = (day: number) => {
    return todos.filter((todo) => {
      if (!todo.dueDate) return false;
      const dueDate = new Date(todo.dueDate);
      return (
        dueDate.getDate() === day &&
        dueDate.getMonth() === currentDate.getMonth() &&
        dueDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const handleDayClick = (day: number, dayTodos: Todo[]) => {
    if (dayTodos.length === 1) {
      setSelectedTodo(dayTodos[0]);
      setIsModalOpen(true);
    } else if (dayTodos.length === 0) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day, 12, 0);
      setSelectedDate(date);
      setSelectedTodo(null);
      setIsModalOpen(true);
    }
  };

  const monthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];

  const dayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    // Convert Sunday (0) to 7, then subtract 1 to make Monday = 0
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const today = new Date();
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <>
      <header className="relative bg-gray-800 after:pointer-events-none after:absolute after:inset-x-0 after:inset-y-0 after:border-y after:border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Calendar
          </h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={previousMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Previous month"
                >
                  <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Next month"
                >
                  <ChevronRightIcon className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-semibold text-gray-600 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty cells for days before month starts */}
              {emptyDays.map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square" />
              ))}

              {/* Days of the month */}
              {days.map((day) => {
                const dayTodos = getTodosForDay(day);
                const hasOverdue = dayTodos.some(todo => !todo.completed && new Date(todo.dueDate!) < new Date());
                const hasCompleted = dayTodos.some(todo => todo.completed);
                const hasActive = dayTodos.some(todo => !todo.completed);

                return (
                  <button
                    key={day}
                    onClick={() => handleDayClick(day, dayTodos)}
                    className={`aspect-square rounded-lg p-2 text-left transition-colors relative ${
                      isToday(day)
                        ? 'bg-blue-600 text-white font-bold hover:bg-blue-700'
                        : 'hover:bg-gray-100 text-gray-900 border border-gray-200'
                    }`}
                  >
                    <span className="text-sm font-semibold">{day}</span>
                    
                    {/* Todo indicators */}
                    {dayTodos.length > 0 && (
                      <div className="mt-1 space-y-1">
                        {dayTodos.slice(0, 3).map((todo) => (
                          <div
                            key={todo.id}
                            className={`text-xs truncate px-1 py-0.5 rounded ${
                              todo.completed
                                ? 'bg-green-100 text-green-800'
                                : new Date(todo.dueDate!) < new Date()
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            } ${isToday(day) ? 'bg-opacity-20 text-white' : ''}`}
                          >
                            {todo.title}
                          </div>
                        ))}
                        {dayTodos.length > 3 && (
                          <div className={`text-xs ${isToday(day) ? 'text-white' : 'text-gray-500'}`}>
                            +{dayTodos.length - 3} mehr
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Todo Modal */}
          <TodoModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedTodo(null);
              setSelectedDate(null);
            }}
            todo={
              selectedTodo || (selectedDate
                ? {
                    title: '',
                    description: '',
                    completed: false,
                    dueDate: selectedDate.toISOString(),
                  }
                : null)
            }
            onSave={handleSaveTodo}
          />
        </div>
      </main>
    </>
  );
}
