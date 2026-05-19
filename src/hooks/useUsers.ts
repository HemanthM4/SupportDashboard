import { useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatar: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/users`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const data = await response.json();
        setUsers(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Return empty array on error
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
};

export const useSearchUsers = (query: string) => {
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/users/search/${encodeURIComponent(query)}`);
        
        if (!response.ok) {
          throw new Error('Search failed');
        }

        const data = await response.json();
        setResults(data);
      } catch (err) {
        console.error('Error searching users:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    searchUsers();
  }, [query]);

  return { results, loading };
};
