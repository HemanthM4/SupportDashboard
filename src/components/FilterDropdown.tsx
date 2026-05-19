import { useState } from 'react';
import { TaskStatus, TaskPriority } from '../types';

interface FilterDropdownProps {
  onFilter: (filters: FilterState) => void;
  isOpen: boolean;
  onClose: () => void;
}

export interface FilterState {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  assignee?: string[];
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({ onFilter, isOpen, onClose }) => {
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority[]>([]);

  const statuses: TaskStatus[] = ['TO DO', 'AI TASKS - DONE', 'HUMAN NEEDED TO ASSESS', 'IN REVIEW - AI NEEDED', 'DONE'];
  const priorities: TaskPriority[] = ['Low', 'Medium', 'High'];

  const handleApply = () => {
    onFilter({
      status: selectedStatus.length > 0 ? selectedStatus : undefined,
      priority: selectedPriority.length > 0 ? selectedPriority : undefined,
    });
    onClose();
  };

  const handleReset = () => {
    setSelectedStatus([]);
    setSelectedPriority([]);
    onFilter({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-start justify-center pt-20 z-40" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4">Filters</h3>

        <div className="mb-6">
          <h4 className="font-medium text-sm mb-3">Status</h4>
          <div className="space-y-2">
            {statuses.map((status) => (
              <label key={status} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedStatus.includes(status)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedStatus([...selectedStatus, status]);
                    } else {
                      setSelectedStatus(selectedStatus.filter((s) => s !== status));
                    }
                  }}
                  className="w-4 h-4"
                />
                <span className="text-sm">{status}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-medium text-sm mb-3">Priority</h4>
          <div className="space-y-2">
            {priorities.map((priority) => (
              <label key={priority} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedPriority.includes(priority)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPriority([...selectedPriority, priority]);
                    } else {
                      setSelectedPriority(selectedPriority.filter((p) => p !== priority));
                    }
                  }}
                  className="w-4 h-4"
                />
                <span className="text-sm">{priority}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm border border-border rounded hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 text-sm bg-primary text-white rounded hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};
