export const TodoStatus = {
  COMPLETED: 'Completed',
  IN_PROGRESS: 'In Progress',
} as const;

export type TodoStatusType = typeof TodoStatus[keyof typeof TodoStatus];
