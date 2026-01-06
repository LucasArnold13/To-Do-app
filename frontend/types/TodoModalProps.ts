import { Todo } from './todo';

export interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  todo: Todo | Omit<Todo, 'id' | 'createdAt' | 'updatedAt'> | null;
  onSave: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}
