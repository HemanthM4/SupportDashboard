import { useState, useEffect } from 'react';
import { Task, ViewType, TaskStatus } from './types';
import { mockTasks, getNextTaskId } from './data/mockTasks';
import { Navbar } from './components/Navbar';
import { ListView } from './components/ListView';
import { BoardView } from './components/BoardView';
import { TaskModal } from './components/TaskModal';
import { CreateTaskModal } from './components/CreateTaskModal';
import { FilterDropdown, FilterState } from './components/FilterDropdown';
import { notifyAssignment } from './lib/api';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [viewType, setViewType] = useState<ViewType>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [filterState, setFilterState] = useState<FilterState>({});
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [createTaskWithStatus, setCreateTaskWithStatus] = useState<TaskStatus>('TO DO');

  // Initialize tasks from localStorage or use mock data
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          assignee: task.assignee
            ? {
                id: task.assignee.id || task.assignee.email || task.assignee.name,
                name: task.assignee.name,
                email: task.assignee.email || '',
                initials: task.assignee.initials,
              }
            : null,
          created: new Date(task.created),
          updated: new Date(task.updated),
          dueDate: task.dueDate ? new Date(task.dueDate) : null,
          comments: (task.comments || []).map((comment: any) => ({
            ...comment,
            timestamp: new Date(comment.timestamp),
          })),
        }));
        setTasks(parsedTasks);
      } catch (error) {
        console.error('Failed to load tasks:', error);
        setTasks(mockTasks);
      }
    } else {
      setTasks(mockTasks);
    }
  }, []);

  // Persist tasks to localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Filter tasks based on search and filters
  const getFilteredTasks = () => {
    let filtered = tasks.filter((task) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const titleMatch = task.title.toLowerCase().includes(query);
        const idMatch = task.id.toLowerCase().includes(query);
        if (!titleMatch && !idMatch) return false;
      }

      // Status filter
      if (filterState.status && filterState.status.length > 0) {
        if (!filterState.status.includes(task.status)) return false;
      }

      // Priority filter
      if (filterState.priority && filterState.priority.length > 0) {
        if (!filterState.priority.includes(task.priority)) return false;
      }

      return true;
    });

    return filtered;
  };

  const filteredTasks = getFilteredTasks();

  const handleSelectTask = (taskId: string, selected: boolean) => {
    const newSelectedTasks = new Set(selectedTasks);
    if (selected) {
      newSelectedTasks.add(taskId);
    } else {
      newSelectedTasks.delete(taskId);
    }
    setSelectedTasks(newSelectedTasks);
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedTasks(new Set(filteredTasks.map((t) => t.id)));
    } else {
      setSelectedTasks(new Set());
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleSaveTask = async (task: Task) => {
    const previousTask = tasks.find((t) => t.id === task.id);
    const assigneeChanged =
      previousTask?.assignee?.email !== task.assignee?.email;

    setTasks(
      tasks.map((t) =>
        t.id === task.id
          ? { ...task, updated: new Date() }
          : t
      )
    );

    if (assigneeChanged && task.assignee?.email) {
      try {
        await notifyAssignment({
          task,
          previousAssigneeEmail: previousTask?.assignee?.email || null,
        });
      } catch (error) {
        console.error('Failed to send assignment notification:', error);
      }
    }

    setShowTaskModal(false);
    setSelectedTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
    setShowTaskModal(false);
    setSelectedTask(null);
  };

  const handleCreateTask = async (newTask: Omit<Task, 'id'>) => {
    const taskWithId: Task = {
      ...newTask,
      id: getNextTaskId(tasks),
    };
    setTasks([...tasks, taskWithId]);

    if (taskWithId.assignee?.email) {
      try {
        await notifyAssignment({ task: taskWithId });
      } catch (error) {
        console.error('Failed to send assignment notification:', error);
      }
    }

    setShowCreateModal(false);
  };

  const handleTaskStatusChange = (taskId: string, status: TaskStatus) => {
    setTasks(
      tasks.map((t) =>
        t.id === taskId
          ? { ...t, status, updated: new Date() }
          : t
      )
    );
  };

  const handleCreateClick = () => {
    setCreateTaskWithStatus('TO DO');
    setShowCreateModal(true);
  };

  const handleGroupClick = () => {
    // Group functionality could be implemented here
    // For now, just a placeholder
    alert('Group functionality coming soon!');
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      <Navbar
        viewType={viewType}
        onViewChange={setViewType}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterClick={() => setShowFilterDropdown(true)}
        onGroupClick={handleGroupClick}
        onCreateClick={handleCreateClick}
        tasksCount={filteredTasks.length}
      />

      <div className="flex-1 overflow-auto">
        {viewType === 'list' ? (
          <ListView
            tasks={filteredTasks}
            selectedTasks={selectedTasks}
            onSelectTask={handleSelectTask}
            onSelectAll={handleSelectAll}
            onTaskClick={handleTaskClick}
            onTaskDelete={handleDeleteTask}
          />
        ) : (
          <BoardView
            tasks={filteredTasks}
            onTaskStatusChange={handleTaskStatusChange}
            onTaskClick={handleTaskClick}
            onTaskDelete={handleDeleteTask}
            onCreateTask={(status) => {
              setCreateTaskWithStatus(status);
              setShowCreateModal(true);
            }}
          />
        )}
      </div>

      {/* Modals */}
      {showTaskModal && selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setShowTaskModal(false)}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
        />
      )}

      {showCreateModal && (
        <CreateTaskModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateTask}
          nextId={getNextTaskId(tasks)}
          initialStatus={createTaskWithStatus}
        />
      )}

      {showFilterDropdown && (
        <FilterDropdown
          isOpen={showFilterDropdown}
          onClose={() => setShowFilterDropdown(false)}
          onFilter={setFilterState}
        />
      )}
    </div>
  );
}

export default App;
