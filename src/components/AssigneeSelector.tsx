import { useState } from 'react';
import { User, useUsers, useSearchUsers } from '../hooks/useUsers';

interface AssigneeSelectorProps {
  selectedUser: User | null;
  onSelect: (user: User | null) => void;
}

export const AssigneeSelector: React.FC<AssigneeSelectorProps> = ({
  selectedUser,
  onSelect,
}) => {
  const { users, loading, error } = useUsers();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { results: searchResults } = useSearchUsers(searchQuery);

  const displayUsers = searchQuery ? searchResults : users;

  if (loading) {
    return (
      <div className="px-3 py-2 text-sm text-gray-500">
        Loading users...
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-3 py-2 text-sm text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-border rounded text-sm bg-white hover:bg-gray-50 text-left flex items-center justify-between"
      >
        <span>
          {selectedUser ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-avatar flex items-center justify-center text-white text-xs font-semibold">
                {selectedUser.initials}
              </div>
              <span>{selectedUser.name}</span>
            </div>
          ) : (
            <span className="text-gray-500">Unassigned</span>
          )}
        </span>
        <span className="text-xs">▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded shadow-lg z-10">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border-b border-border text-sm focus:outline-none"
            autoFocus
          />

          {/* Unassigned Option */}
          <button
            onClick={() => {
              onSelect(null);
              setIsOpen(false);
              setSearchQuery('');
            }}
            className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm border-b border-gray-100"
          >
            <span className="text-gray-500">Unassigned</span>
          </button>

          {/* User List */}
          <div className="max-h-48 overflow-y-auto">
            {displayUsers.length > 0 ? (
              displayUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    onSelect(user);
                    setIsOpen(false);
                    setSearchQuery('');
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-100 text-sm flex items-center gap-2 border-b border-gray-50 ${
                    selectedUser?.id === user.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-avatar flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                    {user.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {user.email}
                    </div>
                  </div>
                  {selectedUser?.id === user.id && (
                    <span className="text-primary">✓</span>
                  )}
                </button>
              ))
            ) : (
              <div className="px-3 py-4 text-sm text-gray-500 text-center">
                No users found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
