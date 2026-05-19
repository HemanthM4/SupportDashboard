import { useState } from 'react';
import { Task, TaskStatus, TaskPriority } from '../types';
import { AssigneeSelector } from './AssigneeSelector';
import { User } from '../hooks/useUsers';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (task: Omit<Task, 'id'>) => void;
  nextId: string;
  initialStatus?: TaskStatus;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  initialStatus = 'TO DO',
}) => {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<TaskStatus>(initialStatus);
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [dueDate, setDueDate] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState<User | null>(null);

  const handleCreate = () => {
    if (!title.trim()) return;

    const newTask: Omit<Task, 'id'> = {
      title,
      status,
      priority,
      assignee: selectedAssignee
        ? {
            id: selectedAssignee.id,
            name: selectedAssignee.name,
            email: selectedAssignee.email,
            initials: selectedAssignee.initials,
          }
        : null,
      reporter: {
        name: 'Kunguma Balaji',
        initials: 'KB',
      },
      resolution: 'Unresolved',
      created: new Date(),
      updated: new Date(),
      dueDate: dueDate ? new Date(dueDate) : null,
      description: '',
      comments: [],
    };

    onCreate(newTask);
    setTitle('');
    setStatus(initialStatus);
    setPriority('Medium');
    setDueDate('');
    setSelectedAssignee(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold text-gray-900">Create Task</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
              autoFocus
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option>TO DO</option>
              <option>AI TASKS - DONE</option>
              <option>HUMAN NEEDED TO ASSESS</option>
              <option>IN REVIEW - AI NEEDED</option>
              <option>DONE</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          {/* Assignee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assignee
            </label>
            <AssigneeSelector
              selectedUser={selectedAssignee}
              onSelect={setSelectedAssignee}
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border rounded text-sm hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-primary text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
            disabled={!title.trim()}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};
