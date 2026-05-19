import { useState } from 'react';
import { Task } from '../types';
import { Avatar } from './Avatar';
import { StatusBadge } from './StatusBadge';
import { PriorityIcon } from './PriorityIcon';

interface ListViewProps {
  tasks: Task[];
  selectedTasks: Set<string>;
  onSelectTask: (taskId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onTaskClick: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
}

type SortColumn = 'title' | 'assignee' | 'priority' | 'status' | 'created' | 'updated' | 'dueDate';
type SortOrder = 'asc' | 'desc';

export const ListView: React.FC<ListViewProps> = ({
  tasks,
  selectedTasks,
  onSelectTask,
  onSelectAll,
  onTaskClick,
  onTaskDelete,
}) => {
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (!sortColumn) return 0;

    let aValue: any = a[sortColumn];
    let bValue: any = b[sortColumn];

    if (sortColumn === 'assignee') {
      aValue = a.assignee?.name || 'Unassigned';
      bValue = b.assignee?.name || 'Unassigned';
    }

    if (aValue instanceof Date && bValue instanceof Date) {
      return sortOrder === 'asc' ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime();
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }

    return 0;
  });

  const formatDate = (date: Date | null) => {
    if (!date) return 'None';
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year}${sortColumn !== 'dueDate' ? `, ${hours}:${minutes}` : ''}`;
  };

  const SortArrow = ({ column }: { column: SortColumn }) => {
    if (sortColumn !== column) return <span className="ml-1 text-gray-300">↕</span>;
    return <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-bg-sidebar border-b border-border">
          <tr>
            <th className="px-4 py-3 text-left w-12">
              <input
                type="checkbox"
                checked={selectedTasks.size === tasks.length && tasks.length > 0}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="w-4 h-4"
              />
            </th>
            <th
              className="px-4 py-3 text-left font-semibold text-sm cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('title')}
            >
              Work <SortArrow column="title" />
            </th>
            <th
              className="px-4 py-3 text-left font-semibold text-sm cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('assignee')}
            >
              Assignee <SortArrow column="assignee" />
            </th>
            <th className="px-4 py-3 text-left font-semibold text-sm">Reporter</th>
            <th
              className="px-4 py-3 text-left font-semibold text-sm cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('priority')}
            >
              Priority <SortArrow column="priority" />
            </th>
            <th
              className="px-4 py-3 text-left font-semibold text-sm cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('status')}
            >
              Status <SortArrow column="status" />
            </th>
            <th className="px-4 py-3 text-left font-semibold text-sm">Resolution</th>
            <th
              className="px-4 py-3 text-left font-semibold text-sm cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('created')}
            >
              Created <SortArrow column="created" />
            </th>
            <th
              className="px-4 py-3 text-left font-semibold text-sm cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('updated')}
            >
              Updated <SortArrow column="updated" />
            </th>
            <th
              className="px-4 py-3 text-left font-semibold text-sm cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('dueDate')}
            >
              Due date <SortArrow column="dueDate" />
            </th>
            <th className="px-4 py-3 text-left w-12"></th>
          </tr>
        </thead>
        <tbody>
          {sortedTasks.map((task) => (
            <tr
              key={task.id}
              className="border-b border-border hover:bg-row-hover transition-colors"
            >
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedTasks.has(task.id)}
                  onChange={(e) => onSelectTask(task.id, e.target.checked)}
                  className="w-4 h-4"
                />
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-col">
                  <button
                    onClick={() => onTaskClick(task)}
                    className="text-primary font-medium hover:underline text-left"
                  >
                    {task.id}
                  </button>
                  <span className="text-sm text-gray-700">{task.title}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                {task.assignee ? (
                  <Avatar name={task.assignee.name} initials={task.assignee.initials} />
                ) : (
                  <span className="text-sm text-gray-500">Unassigned</span>
                )}
              </td>
              <td className="px-4 py-3">
                {task.reporter && (
                  <Avatar name={task.reporter.name} initials={task.reporter.initials} />
                )}
              </td>
              <td className="px-4 py-3">
                <PriorityIcon priority={task.priority} />
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={task.status} />
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-gray-700">{task.resolution}</span>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-gray-700">{formatDate(task.created)}</span>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-gray-700">{formatDate(task.updated)}</span>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-gray-700">{formatDate(task.dueDate)}</span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onTaskClick(task)}
                    className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-700"
                    title="Edit"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => onTaskDelete(task.id)}
                    className="p-1 hover:bg-red-100 rounded text-gray-500 hover:text-red-700"
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
