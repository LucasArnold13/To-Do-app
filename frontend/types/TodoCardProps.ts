import { Todo } from './todo';

export interface TodoCardProps extends Todo {
  onToggle: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}
