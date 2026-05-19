import { useDraggable } from '@dnd-kit/core';
import { Task } from '../types';
import { PriorityIcon } from './PriorityIcon';

interface BoardCardProps {
  task: Task;
  onTaskClick: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
}

export const BoardCard: React.FC<BoardCardProps> = ({
  task,
  onTaskClick,
  onTaskDelete,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`bg-white rounded border border-border p-3 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow group ${
        isDragging ? 'opacity-50' : ''
      }`}
      onClick={() => onTaskClick(task)}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs text-gray-500 font-medium">{task.id}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTaskDelete(task.id);
          }}
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 text-sm"
        >
          ⋯
        </button>
      </div>

      <h4 className="text-sm font-medium text-gray-900 mb-3 line-clamp-2 uppercase">
        {task.title}
      </h4>

      <div className="flex justify-between items-end">
        <PriorityIcon priority={task.priority} />
        {task.assignee && (
          <div className="w-6 h-6 rounded-full bg-avatar flex items-center justify-center text-white text-xs font-semibold">
            {task.assignee.initials}
          </div>
        )}
      </div>
    </div>
  );
};
