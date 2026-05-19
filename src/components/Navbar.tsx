import { ViewType } from '../types';

interface NavbarProps {
  viewType: ViewType;
  onViewChange: (view: ViewType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterClick: () => void;
  onGroupClick: () => void;
  onCreateClick: () => void;
  tasksCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewType,
  onViewChange,
  searchQuery,
  onSearchChange,
  onFilterClick,
  onGroupClick,
  onCreateClick,
  tasksCount,
}) => {
  return (
    <div className="border-b border-border">
      {/* Top section with title and menu */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <span className="text-gray-400">⊞</span>
          <h1 className="text-lg font-semibold text-gray-900">support tickets</h1>
        </div>
        <button className="text-gray-500 hover:text-gray-700">⋯</button>
      </div>

      {/* Controls section */}
      <div className="flex items-center justify-between px-6 py-4 gap-4">
        <div className="flex gap-3 flex-1">
          {/* Search bar */}
          <input
            type="text"
            placeholder="Search work"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 px-3 py-2 border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />

          {/* Filter buttons */}
          <button className="px-3 py-2 border border-border rounded text-sm hover:bg-row-hover flex items-center gap-2">
            👤 Assignee
          </button>

          <button
            onClick={onFilterClick}
            className="px-3 py-2 border border-border rounded text-sm hover:bg-row-hover flex items-center gap-2"
          >
            Filter
          </button>

          <button
            onClick={onGroupClick}
            className="px-3 py-2 border border-border rounded text-sm hover:bg-row-hover flex items-center gap-2"
          >
            Group
          </button>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          <select className="px-3 py-2 border border-border rounded text-sm hover:bg-row-hover bg-white">
            <option>Saved filters</option>
          </select>

          {/* View toggle */}
          <button
            onClick={() => onViewChange('list')}
            className={`p-2 rounded ${
              viewType === 'list'
                ? 'bg-gray-200 text-gray-900'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            title="List view"
          >
            ☰
          </button>

          <button
            onClick={() => onViewChange('board')}
            className={`p-2 rounded ${
              viewType === 'board'
                ? 'bg-gray-200 text-gray-900'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            title="Board view"
          >
            ⊞
          </button>

          <button className="text-gray-500 hover:text-gray-700">⋯</button>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-border">
        <button
          onClick={onCreateClick}
          className="px-4 py-2 bg-primary text-white rounded text-sm font-medium hover:bg-blue-700"
        >
          + Create
        </button>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>{tasksCount} of {tasksCount}</span>
          <button className="text-gray-500 hover:text-gray-700">↻</button>
        </div>
      </div>
    </div>
  );
};
