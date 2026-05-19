import { TaskStatus } from '../types';

interface StatusBadgeProps {
  status: TaskStatus;
  isDropdown?: boolean;
  onStatusChange?: (status: TaskStatus) => void;
}

const statusConfig = {
  'TO DO': { bg: 'bg-gray-100', text: 'text-gray-700' },
  'AI TASKS - DONE': { bg: 'bg-status-done', text: 'text-status-done-text' },
  'HUMAN NEEDED TO ASSESS': { bg: 'bg-status-needed', text: 'text-status-needed-text' },
  'IN REVIEW - AI NEEDED': { bg: 'bg-status-review', text: 'text-status-review-text' },
  'DONE': { bg: 'bg-green-100', text: 'text-green-700' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, isDropdown = false, onStatusChange }) => {
  const config = statusConfig[status];
  const displayText = status.length > 20 ? status.substring(0, 17) + '...' : status;

  if (isDropdown && onStatusChange) {
    const statuses: TaskStatus[] = ['TO DO', 'AI TASKS - DONE', 'HUMAN NEEDED TO ASSESS', 'IN REVIEW - AI NEEDED', 'DONE'];
    
    return (
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as TaskStatus)}
        className={`px-3 py-1 rounded text-sm font-medium border-0 cursor-pointer ${config.bg} ${config.text}`}
      >
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    );
  }

  return (
    <span className={`px-3 py-1 rounded text-sm font-medium inline-flex items-center gap-1 ${config.bg} ${config.text}`}>
      {displayText}
      {isDropdown && <span className="text-xs">▼</span>}
    </span>
  );
};
