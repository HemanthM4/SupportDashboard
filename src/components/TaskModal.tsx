import { useState } from 'react';
import { Task, TaskStatus, TaskPriority } from '../types';
import { StatusBadge } from './StatusBadge';
import { AssigneeSelector } from './AssigneeSelector';

interface TaskModalProps {
  task: Task;
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  task,
  onClose,
  onSave,
  onDelete,
}) => {
  const [editedTask, setEditedTask] = useState<Task>(task);
  const [comment, setComment] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'comments' | 'history' | 'work-log'>('all');

  const handleSave = () => {
    onSave(editedTask);
  };

  const handleStatusChange = (status: TaskStatus) => {
    setEditedTask({ ...editedTask, status });
  };

  const handlePriorityChange = (priority: TaskPriority) => {
    setEditedTask({ ...editedTask, priority });
  };

  const formatDateTime = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex" onClick={onClose}>
      <div
        className="bg-bg-sidebar flex-1 light"
        onClick={(e) => e.stopPropagation()}
      />
      
      <div className="bg-white w-full max-w-3xl shadow-lg flex flex-col overflow-hidden">
        {/* Header with Back and Task ID */}
        <div className="px-6 py-4 border-b border-border flex items-center gap-4">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            ← Back
          </button>
          
          <button className="text-primary text-sm font-medium border border-primary px-3 py-1 rounded hover:bg-blue-50">
            + Add epic
          </button>
          
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-gray-600">/</span>
            <button className="px-3 py-1 text-sm font-medium text-primary hover:bg-blue-50 rounded">
              {task.id}
            </button>
            <button className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded">
              ⬆
            </button>
            <button className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded">
              ⬇
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 pt-6 pb-4">
            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              {editedTask.title}
            </h1>

            {/* Quick Actions */}
            <div className="flex gap-2 mb-8">
              <button className="text-gray-600 hover:text-gray-900 text-lg">➕</button>
              <button className="text-gray-600 hover:text-gray-900 text-lg">⋯</button>
            </div>

            {/* Description Section */}
            <div className="mb-10">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Description</h3>
              {editedTask.description && editedTask.description.trim() ? (
                <div className="bg-white border border-border rounded p-4 min-h-32 mb-3">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{editedTask.description}</p>
                </div>
              ) : (
                <div className="bg-gray-50 border border-dashed border-gray-300 rounded p-4 min-h-32 flex items-center justify-center mb-3">
                  <textarea
                    value={editedTask.description || ''}
                    onChange={(e) =>
                      setEditedTask({ ...editedTask, description: e.target.value })
                    }
                    placeholder="✎ Improve description"
                    className="w-full bg-transparent text-sm focus:outline-none resize-none text-gray-600"
                  />
                </div>
              )}
              {editedTask.description && editedTask.description.trim() && (
                <button
                  onClick={() => setEditedTask({ ...editedTask, description: editedTask.description })}
                  className="text-primary text-sm font-medium hover:underline"
                >
                  Edit description
                </button>
              )}
              <div className="text-xs text-gray-500 mt-2">
                Press Ctrl + / to learn time-saving keyboard shortcuts.
              </div>
            </div>

            {/* Subtasks Section */}
            <div className="mb-10">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Subtasks</h3>
              <div className="bg-white border border-border rounded p-3 min-h-12">
                <button className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                  + Add subtask
                </button>
              </div>
            </div>

            {/* Linked Work Items */}
            <div className="mb-10">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Linked work items</h3>
              <div className="bg-white border border-border rounded p-3 min-h-12">
                <button className="text-primary text-sm font-medium hover:underline">
                  + Add linked work item
                </button>
              </div>
            </div>

            {/* Activity Section */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Activity</h3>
              
              {/* Tabs */}
              <div className="flex gap-6 border-b border-border mb-4">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'comments', label: 'Comments' },
                  { id: 'history', label: 'History' },
                  { id: 'work-log', label: 'Work log' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'text-primary border-primary'
                        : 'text-gray-600 border-transparent hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Comments */}
              <div className="space-y-4 mb-6">
                {editedTask.comments && editedTask.comments.length > 0 ? (
                  editedTask.comments.map((c) => (
                    <div key={c.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-avatar flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                        {c.author.initials}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {c.author.name}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{c.text}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {c.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No comments yet</p>
                )}
              </div>

              {/* Add Comment */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-avatar flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                  KB
                </div>
                <div className="flex-1">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full px-4 py-3 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary text-sm resize-none"
                    rows={3}
                  />
                  <div className="flex gap-2 justify-between mt-2 flex-wrap">
                    <div className="flex gap-1">
                      <button className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">
                        👍 Looks good!
                      </button>
                      <button className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">
                        🙋 Need help?
                      </button>
                      <button className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">
                        🚫 This is blocked...
                      </button>
                      <button className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">
                        🔍 Can you clarify...?
                      </button>
                      <button className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">
                        ✅ This is on track
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar with Details */}
        <style>{`
          .task-details-drawer {
            width: 280px;
            border-left: 1px solid #DFE1E6;
            background: #FFFFFF;
          }
        `}</style>

        {/* Footer with Details Aside */}
        <div className="flex border-t border-border">
          {/* Main Content stays above */}
          <div className="flex-1"></div>
          
          {/* Details Panel */}
          <div className="task-details-drawer px-4 py-6 max-h-96 overflow-y-auto">
            <div className="space-y-6 text-sm">
              {/* Status */}
              <div>
                <label className="text-gray-600 font-medium block mb-2">Status</label>
                <StatusBadge
                  status={editedTask.status}
                  isDropdown
                  onStatusChange={handleStatusChange}
                />
              </div>

              {/* Priority */}
              <div>
                <label className="text-gray-600 font-medium block mb-2">Priority</label>
                <select
                  value={editedTask.priority}
                  onChange={(e) =>
                    handlePriorityChange(e.target.value as TaskPriority)
                  }
                  className="w-full px-2 py-1 border border-border rounded text-sm"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              {/* Assignee */}
              <div>
                <label className="text-gray-600 font-medium block mb-2">Assignee</label>
                <AssigneeSelector
                  selectedUser={editedTask.assignee ? {
                    id: editedTask.assignee.id,
                    name: editedTask.assignee.name,
                    email: editedTask.assignee.email,
                    initials: editedTask.assignee.initials,
                    avatar: '#6554C0',
                  } : null}
                  onSelect={(user) => {
                    if (user) {
                      setEditedTask({
                        ...editedTask,
                        assignee: {
                          id: user.id,
                          name: user.name,
                          email: user.email,
                          initials: user.initials,
                        },
                      });
                    } else {
                      setEditedTask({
                        ...editedTask,
                        assignee: null,
                      });
                    }
                  }}
                />
              </div>

              {/* Reporter */}
              <div>
                <label className="text-gray-600 font-medium block mb-2">Reporter</label>
                <div className="text-gray-700 text-sm">
                  {editedTask.reporter.name}
                </div>
              </div>

              {/* Created */}
              <div>
                <label className="text-gray-600 font-medium block mb-2">Created</label>
                <div className="text-gray-700 text-sm">
                  {formatDateTime(editedTask.created)}
                </div>
              </div>

              {/* Updated */}
              <div>
                <label className="text-gray-600 font-medium block mb-2">Updated</label>
                <div className="text-gray-700 text-sm">
                  {formatDateTime(editedTask.updated)}
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="text-gray-600 font-medium block mb-2">Due Date</label>
                <input
                  type="date"
                  value={
                    editedTask.dueDate
                      ? editedTask.dueDate.toISOString().split('T')[0]
                      : ''
                  }
                  onChange={(e) => {
                    const date = e.target.value
                      ? new Date(e.target.value)
                      : null;
                    setEditedTask({ ...editedTask, dueDate: date });
                  }}
                  className="w-full px-2 py-1 border border-border rounded text-sm"
                />
              </div>

              {/* Resolution */}
              <div>
                <label className="text-gray-600 font-medium block mb-2">Resolution</label>
                <input
                  type="text"
                  value={editedTask.resolution}
                  onChange={(e) =>
                    setEditedTask({ ...editedTask, resolution: e.target.value })
                  }
                  className="w-full px-2 py-1 border border-border rounded text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-border bg-gray-50 flex items-center justify-between">
          <button
            onClick={() => onDelete(task.id)}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Delete
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-border rounded text-sm hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-primary text-white rounded text-sm hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
