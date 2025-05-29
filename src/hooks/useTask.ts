import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/client';
import { Task } from '../types/task';
import { logger } from '../utility/logger';
import { ErrorMessage } from '../components/ErrorMessage';
import '../App.css';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  let [error, setError] = useState('');

  const clearError = () => setError('');

  const fetchTasks = useCallback(async () => {
    try {
      const { data } = await apiClient.get<Task[]>('/ToDoTasks/GetAllTasks');
      setTasks(data);
    } catch (err) {
      logger.error('Failed to fetch tasks. Check connection with the server.', err as Error);
      setError('Failed to fetch tasks. Check connection with the server.');
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const createTask = async (description: string, deadline?: string) => {
    setError('');

    if (description.trim().length <= 10) {
      setError('Description must be at least 11 characters');
      return false;
    }
    else if(description.trim().length > 500) {
      setError('Description cannot be more than 500 characters');
      return false;
    }
    
    try {
      const createRequest: { Description: string; Deadline?: string } = {
        Description: description.trim(),
      };
      
      if (deadline) 
        createRequest.Deadline = deadline;
      
      await apiClient.post<Task>('/ToDoTasks/CreateTask/', createRequest);
      await fetchTasks();
      setError('');
      return true;
    } catch (err) {
      logger.error('Failed to create tasks', err as Error);
      setError('Failed to create task');
      return false;
    }
  };

  return { tasks, error, createTask, fetchTasks, clearError };
};