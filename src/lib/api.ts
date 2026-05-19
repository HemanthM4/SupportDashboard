import { Task } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface AssignmentNotificationPayload {
  task: Task;
  previousAssigneeEmail?: string | null;
}

export async function notifyAssignment(payload: AssignmentNotificationPayload) {
  if (!payload.task.assignee?.email) {
    return { skipped: true };
  }

  const response = await fetch(`${API_URL}/api/assignments/notify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to send assignment notification');
  }

  return response.json();
}
