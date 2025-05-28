import { Task } from '../types/task';
import { apiClient } from '../api/client';
import { logger } from '../utility/logger';
import { useState, useEffect, useMemo } from 'react';
import { SortingControls } from '../components/SortingControls';
import { EditDeadline } from '../components/EditableDeadline';
import { EditableDescription } from '../components/EditableDescription';
import { PriorityToggle } from '../components/PriorityToggle';
import { ErrorMessage } from './ErrorMessage';
import '../App.css';
import { CompleteButton } from './CompleteCelebration';
import { useStatusFilter } from '../hooks/useStatusFilter';
import { useTasks } from '../hooks/useTask';

interface TaskTableProps {
  tasks: Task[];
  onUpdate: () => void;
}

export const TaskTable = ({ tasks, onUpdate }: TaskTableProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [error, setError] = useState('');
  const [sortType, setSortType] = useState<'deadline' | 'alphabetical' | 'creation date'>('deadline');
    const {
      filter,
      setFilter,
      currentPage,
      setCurrentPage,
      filteredTasks,
      totalItems,
      totalPages,
      itemsPerPage
    } = useStatusFilter(tasks);

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      onUpdate();
    }, 60000);

    return () => clearInterval(interval);
  }, [onUpdate]);

    const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      // Priority tasks first
      if (a.isPriority !== b.isPriority) 
        return a.isPriority ? -1 : 1;
      
      // Then apply selected sorting
      if (sortType === 'deadline') {
        const aDeadline = a.deadline ? new Date(a.deadline) : null;
        const bDeadline = b.deadline ? new Date(b.deadline) : null;
        
        if (!aDeadline && !bDeadline) 
          return 0;
        if (!aDeadline) 
          return 1;
        if (!bDeadline) 
          return -1;
        return aDeadline.getTime() - bDeadline.getTime();
      }

      if (sortType === 'creation date') {
        const aCreation = a.createdAt ? new Date(a.createdAt) : null;
        const bCreation = b.createdAt ? new Date(b.createdAt) : null;
        
        if (!aCreation && !bCreation) 
          return 0;
        if (!aCreation) 
          return 1;
        if (!bCreation) 
          return -1;
        return aCreation.getTime() - bCreation.getTime();
      }
      
      return a.description.localeCompare(b.description);
    });
  }, [filteredTasks, sortType]);

  // Paginate the sorted tasks
  const paginatedSortedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedTasks.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedTasks, currentPage, itemsPerPage]);

  // Reset to first page when filter or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, sortType]);

  // Filter buttons handler
  const handleFilterChange = (newFilter: typeof filter) => {
    setError('');
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handleToggle = async (ident: string) => {
    try {
      await apiClient.put(`/ToDoTasks/ToggleTaskDone/${ident}`);
      logger.info(`Task marked as done ${ident}`);
      setError('');
      onUpdate();
      return true;
    }
    catch (error) {
      setError('Failed to mark task as done. Check connection with the server.');
      logger.error(`Failed to mark task as done ${ident}`, error as Error)
      return false;
    }
  };

  const handleDelete = async (ident: string) => {
    try {
      await apiClient.delete(`/ToDoTasks/DeleteTask/${ident}`);
      logger.info(`Deleted task ${ident}`);
      setError('');
      onUpdate();
    } 
    catch (error) {
      setError('Failed to delete task. Check connection with the server.');
      logger.error(`Failed to delete task ${ident}`, error as Error);
    }
  };

  const isOverdue = (deadline?: string, isDone?: boolean) => {
    if (!deadline || isDone) 
      return false;

    return new Date(deadline).getTime() < new Date().getTime();
  };

    return (
    <div className="task-table">
      <SortingControls onSortChange={setSortType} />
      
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Description</th>
            <th>Deadline</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedSortedTasks.map(task => (
             <tr 
            key={task.identifier}
            className={`task-row ${!task.isDone && isOverdue(task.deadline) ? 'overdue' : ''}`}
            >
              <td>
                <PriorityToggle task={task} onUpdate={onUpdate} />
                <ErrorMessage message={error} />
              </td>
              <td>
                <ErrorMessage message={error} />
                <EditableDescription task={task} onUpdate={onUpdate} />
              </td>
              <td className="deadline-cell" width='30%'>
                <div className="deadline-row">
                  {task.deadline ? (
                    new Date(task.deadline).toLocaleString()
                  ) : (
                    <span className="no-deadline">No deadline</span>
                  )}
                </div>
                <div className="edit-row">
                  <EditDeadline 
                    taskIdent={task.identifier}
                    currentDeadline={task.deadline}
                    onUpdate={onUpdate}
                />
                </div>
              </td>
              <td>
              {task.isDone ? (
                <span className="done">Done</span>
              ) : isOverdue(task.deadline) ? (
                <span className="overdue">Overdue</span>
              ) : (
                'Pending'
              )}
            </td>
            <td>
              <div className="button-container">
               <CompleteButton 
                  task={task} 
                  onComplete={() => handleToggle(task.identifier)}
                /> 
              </div>
              <ErrorMessage message={error} />
            <div className="button-container">
              <button className="delete-btn" onClick={() => handleDelete(task.identifier)} 
                title="Delete task">❌</button>
            </div>
            <ErrorMessage message={error} />
            </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="footer">
        <div className="items-left">{totalItems} tasks left</div>
        
        <div className="pagination">
          <button className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => {
              setError('');
              setCurrentPage(currentPage - 1)}}>
            &lt;&lt;
          </button>

          <div className="page-controls">
            <span>Page </span>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                setError('');
                const page = Math.max(1, Math.min(totalPages, Number(e.target.value)));
                setCurrentPage(page);
              }}
              className="page-input"
            />
            <span> of {totalPages}</span>
          </div>
          
          <button className="pagination-btn"
            disabled={currentPage >= totalPages}
            onClick={() => {
              setError('');
              setCurrentPage(currentPage + 1)}}>
            &gt;&gt;
          </button>
        </div>
        
        <div className="status-filter">
          <button onClick={() => handleFilterChange('all')}>All ({tasks.length})</button>
          <button onClick={() => handleFilterChange('active')}>Active</button>
          <button onClick={() => handleFilterChange('completed')}>Completed</button>
          <button onClick={() => handleFilterChange('overdue')}>Overdue</button>
        </div>
      </div>
    </div>
  );
};