import { Task } from '../types/task';
import { apiClient } from '../api/client';
import { logger } from '../utility/logger';

interface TaskTableProps {
  tasks: Task[];
  onUpdate: () => void;
}

export const TaskTable = ({ tasks, onUpdate }: TaskTableProps) => {
  const isOverdue = (deadline?: string) => 
    deadline && new Date(deadline) < new Date();

  const handleToggle = async (ident: string) => {
    try {
      await apiClient.put(`/ToDoTasks/ToggleTaskDone/${ident}`);
      logger.info(`Task marked as done ${ident}`);
      onUpdate();
    }
    catch (error) {
      logger.error(`Failed to mark task as done ${ident}`, error as Error)
    }
  };

  const handleDelete = async (ident: string) => {
    try {
      await apiClient.delete(`/ToDoTasks/DeleteTask/${ident}`);
      logger.info(`Deleted task ${ident}`);
      onUpdate();
    } 
    catch (error) {
    logger.error(`Failed to delete task ${ident}`, error as Error);
    }
  };

  return (
    <table className="task-table">
      <thead>
        <tr>
          <th>Description</th>
          <th>Deadline</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map(task => (
          <tr 
            key={task.identifier}
            className={`task-row ${!task.isDone && isOverdue(task.deadline) ? 'overdue' : ''}`}
          >
            <td>{task.description}</td>
            <td>{task.deadline ? new Date(task.deadline).toLocaleString() : '-'}</td>
            <td>{task.isDone ? 'Done' : 'Pending'}</td>
            <td>
              <button onClick={() => handleToggle(task.identifier)}>
                {task.isDone ? 'Undo' : 'Complete'}
              </button>
              <button onClick={() => handleDelete(task.identifier)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};