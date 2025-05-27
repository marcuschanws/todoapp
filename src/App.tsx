import React, { useState } from 'react';
import { useTasks } from './hooks/useTask';
import { TaskTable } from './components/TaskTable';
import { ErrorMessage } from './components/ErrorMessage';
import './App.css';

export const App = () => {
  const { tasks, error, createTask, fetchTasks } = useTasks();
  const [newTask, setNewTask] = useState({ description: '', deadline: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createTask(newTask.description, newTask.deadline);

    if (success) 
      setNewTask({ description: '', deadline: '' });
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-brand">
          <img 
          src="/favicon.ico" 
          alt="App Icon"
          className="app-icon"
        />
      <h1>To-Do Manager: Set your goals!</h1>
      </div>
      </header>
      <form onSubmit={handleSubmit} >
        <label className='label-task-input'> Task description (11 - 500 characters):</label>
        <textarea 
          className='task-input'
          title='Key in task (between 11 - 500 characters)'
          value={newTask.description}
          onChange={e => setNewTask(p => ({ ...p, description: e.target.value }))}
          placeholder="Enter task (min. 11 characters)"
        />
        <ErrorMessage message={error} />
        <label className='label-task-deadline'> Task's deadline </label>
        <input
          className='date-input'
          title = 'Deadline for the task (optional)'
          type="datetime-local"
          value={newTask.deadline}
          onChange={e => setNewTask(p => ({ ...p, deadline: e.target.value }))}
        />
        <button type="submit" title='Save task' className='submit-task'>Add Task</button>
      </form>
      <TaskTable tasks={tasks} 
        onUpdate={fetchTasks} />
    </div>
  );
};