import { TodoCardProps } from '@/types/TodoCardProps';
import { TodoStatus } from '@/types/TodoStatus';
import { formatDate, formatDueDate } from '@/lib/utils/dateFormatter';

export default function TodoCard({
  id,
  title,
  description,
  completed,
  dueDate,
  createdAt,
  updatedAt,
  onToggle,
  onEdit,
  onDelete,
}: TodoCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={completed}
          onChange={() => onToggle(id)}
          className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
        
        {/* Content */}
        <div className="flex-1">
          <h3 className={`text-lg font-semibold ${completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
            {title}
          </h3>
          {description && (
            <p className="mt-1 text-sm text-gray-600">
              {description}
            </p>
          )}
          <div className="mt-3 flex flex-col gap-2 text-xs text-gray-500">
            <div className="flex items-center gap-4 flex-wrap">
              {dueDate && (
                <span className="flex items-center gap-1" title={new Date(dueDate).toLocaleString('de-DE')}>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Due: {formatDueDate(dueDate)}
                </span>
              )}
              <span className={`px-2 py-1 rounded-full ${
                completed 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {completed ? TodoStatus.COMPLETED : TodoStatus.IN_PROGRESS}
              </span>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              {createdAt && (
                <span className="flex items-center gap-1" title={new Date(createdAt).toLocaleString('de-DE')}>
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Created {formatDate(createdAt)}
                </span>
              )}
              {updatedAt && (
                <span className="flex items-center gap-1" title={new Date(updatedAt).toLocaleString('de-DE')}>
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Updated {formatDate(updatedAt)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button 
            onClick={() => onEdit(id)}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
            aria-label="Edit todo"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button 
            onClick={() => onDelete(id)}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            aria-label="Delete todo"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
