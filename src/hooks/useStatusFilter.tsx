import { useState, useMemo } from 'react';
import { Task } from '../types/task';

export const useStatusFilter = (tasks: Task[]) => {
    const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'overdue'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const filteredTasks = useMemo(() => {
    const now = new Date();

    return tasks.filter(task => {
      if (filter === 'active') 
        return !task.isDone;
      if (filter === 'completed') 
        return task.isDone;
      if (filter === 'overdue') {
        return !task.isDone && task.deadline && new Date(task.deadline) < now;
      }
      return true; // 'all' filter
    });
  }, [tasks, filter]);

  const totalItems = filteredTasks.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return {
    filter,
    setFilter,
    currentPage,
    setCurrentPage,
    filteredTasks,
    totalItems,
    totalPages,
    itemsPerPage
    };
};