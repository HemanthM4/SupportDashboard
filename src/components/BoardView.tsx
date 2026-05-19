import {
  DndContext,
  DragEndEvent,
  closestCorners,
} from '@dnd-kit/core';
import { Task, TaskStatus } from '../types';
import { BoardColumn } from './BoardColumn';

interface BoardViewProps {
  tasks: Task[];
  onTaskStatusChange: (taskId: string, status: TaskStatus) => void;
  onTaskClick: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onCreateTask: (status: TaskStatus) => void;
}

const columns: TaskStatus[] = [
  'TO DO',
  'AI TASKS - DONE',
  'HUMAN NEEDED TO ASSESS',
  'IN REVIEW - AI NEEDED',
  'DONE',
];

export const BoardView: React.FC<BoardViewProps> = ({
  tasks,
  onTaskStatusChange,
  onTaskClick,
  onTaskDelete,
  onCreateTask,
}) => {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    const task = tasks.find((t) => t.id === taskId);
    if (task && task.status !== newStatus) {
      onTaskStatusChange(taskId, newStatus);
    }
  };

  const getTasksByStatus = (status: TaskStatus): Task[] => {
    return tasks.filter((t) => t.status === status);
  };

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-5 gap-4 p-4 overflow-x-auto">
        {columns.map((status) => (
          <BoardColumn
            key={status}
            status={status}
            tasks={getTasksByStatus(status)}
            onTaskClick={onTaskClick}
            onTaskDelete={onTaskDelete}
            onCreateTask={onCreateTask}
          />
        ))}
      </div>
    </DndContext>
  );
};
