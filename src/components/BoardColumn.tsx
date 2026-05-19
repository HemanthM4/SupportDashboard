import {
  useDroppable,
} from '@dnd-kit/core';
import { Task, TaskStatus } from '../types';
import { BoardCard } from './BoardCard';

interface BoardColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onCreateTask: (status: TaskStatus) => void;
}

const statusConfig = {
  'TO DO': { bg: 'bg-gray-100', text: 'text-gray-700' },
  'AI TASKS - DONE': { bg: 'bg-status-done', text: 'text-status-done-text' },
  'HUMAN NEEDED TO ASSESS': { bg: 'bg-status-needed', text: 'text-status-needed-text' },
  'IN REVIEW - AI NEEDED': { bg: 'bg-status-review', text: 'text-status-review-text' },
  'DONE': { bg: 'bg-green-100', text: 'text-green-700' },
};

export const BoardColumn: React.FC<BoardColumnProps> = ({
  status,
  tasks,
  onTaskClick,
  onTaskDelete,
  onCreateTask,
}) => {
  const { setNodeRef } = useDroppable({ id: status });
  const config = statusConfig[status];

  return (
    <div
      ref={setNodeRef}
      className="bg-bg-sidebar rounded-lg p-4 min-h-96 flex flex-col"
    >
      <div className={`mb-4 pb-3 border-b-2 ${config.text}`}>
        <h3 className="font-semibold text-sm">
          {status} <span className="text-xs font-normal text-gray-500">({tasks.length})</span>
        </h3>
      </div>

      <div className="flex-1 space-y-3 min-h-64">
        {tasks.map((task) => (
          <BoardCard
            key={task.id}
            task={task}
            onTaskClick={onTaskClick}
            onTaskDelete={onTaskDelete}
          />
        ))}
      </div>

      <button
        onClick={() => onCreateTask(status)}
        className="mt-4 w-full py-2 text-center text-sm text-gray-600 hover:bg-gray-200 rounded transition-colors"
      >
        + Create issue
      </button>
    </div>
  );
};
