import { Task } from '../types';

export const mockTasks: Task[] = [
  {
    id: 'KAN-1',
    title: 'login issue',
    assignee: {
      id: '1',
      name: 'Kunguma Balaji',
      email: 'kunguma.balaji@company.com',
      initials: 'KB',
    },
    reporter: {
      name: 'Kunguma Balaji',
      initials: 'KB',
    },
    priority: 'Medium',
    status: 'HUMAN NEEDED TO ASSESS',
    resolution: 'Unresolved',
    created: new Date('2026-05-19T10:43:00'),
    updated: new Date('2026-05-19T10:47:00'),
    dueDate: new Date('2026-05-26'),
    description: 'Problem: Users are unable to log in to their accounts after entering correct credentials. The login page appears to accept the input but shows a generic error message "Authentication failed".\n\nSolution: Verify session handling in the authentication service. Check if the JWT token generation is working correctly. May need to update token expiration settings or fix the session storage mechanism.',
    comments: [],
  },
  {
    id: 'KAN-2',
    title: 'date time issue',
    assignee: {
      id: '1',
      name: 'Kunguma Balaji',
      email: 'kunguma.balaji@company.com',
      initials: 'KB',
    },
    reporter: {
      name: 'Kunguma Balaji',
      initials: 'KB',
    },
    priority: 'Medium',
    status: 'HUMAN NEEDED TO ASSESS',
    resolution: 'Unresolved',
    created: new Date('2026-05-19T10:43:00'),
    updated: new Date('2026-05-19T10:47:00'),
    dueDate: new Date('2026-05-26'),
    description: 'Problem: Date and time calculations are returning incorrect values. For example, adding 5 days to a date is adding 10 days instead. The timezone offset appears to be applied twice.\n\nSolution: Review the DateTime utility functions. Check if timezone conversion is being called multiple times. Verify the moment.js or date-fns configuration. Update date arithmetic methods to handle DST transitions correctly.',
    comments: [],
  },
  {
    id: 'KAN-3',
    title: 'Invoice is paid but status = outstanding',
    assignee: null,
    reporter: {
      name: 'Kunguma Balaji',
      initials: 'KB',
    },
    priority: 'Medium',
    status: 'IN REVIEW - AI NEEDED',
    resolution: 'Unresolved',
    created: new Date('2026-05-19T10:43:00'),
    updated: new Date('2026-05-19T10:47:00'),
    dueDate: null,
    description: 'Problem: Invoices marked as paid in the payment system still show status as "outstanding" in the invoice module. This is causing reconciliation issues and incorrect financial reports.\n\nSolution: Implement a scheduled job to sync payment status with invoice status. Add a webhook listener for payment confirmation events. Update the invoice status update logic to handle partial payments correctly.',
    comments: [],
  },
];

export const getNextTaskId = (tasks: Task[]): string => {
  const maxNum = tasks.reduce((max, task) => {
    const num = parseInt(task.id.replace('KAN-', ''));
    return num > max ? num : max;
  }, 0);
  return `KAN-${maxNum + 1}`;
};
