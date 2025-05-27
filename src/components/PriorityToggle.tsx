import { Task } from '../types/task';
import { apiClient } from '../api/client';
import { ErrorMessage } from './ErrorMessage';
import '../App.css';
import { useState } from 'react';

export const PriorityToggle = ({ task, onUpdate }: { 
  task: Task, 
  onUpdate: () => void 
}) => {
  const [error, setError] = useState('');

  const togglePriority = async () => {
    try
    {
    await apiClient.put(`/ToDoTasks/TogglePriority/${task.identifier}`);
    setError('');
    onUpdate();
    }
    catch (error)
    {
      setError('Failed to set priority of task. Check connection with server.');
    }
  };

  return (
    <button 
      onClick={togglePriority}
      className={`priority-icon ${task.isPriority ? 'active' : ''}`}
      title="Mark as priority"
    >
      {task.isPriority ? '📌' : '📌'}
      <ErrorMessage message={error} />
    </button>
    
  );
};