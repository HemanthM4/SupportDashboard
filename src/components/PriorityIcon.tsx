import { TaskPriority } from '../types';

interface PriorityIconProps {
  priority: TaskPriority;
}

export const PriorityIcon: React.FC<PriorityIconProps> = ({ priority }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-priority-medium text-lg font-bold">=</span>
      <span className="text-sm text-gray-700">{priority}</span>
    </div>
  );
};
