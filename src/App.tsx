import { useState } from 'react';
import { useTasks } from './hooks/useTask';
import { TaskTable } from './components/TaskTable';

export const App = () => {
  const { tasks, error, createTask, fetchTasks } = useTasks();
  const [newTask, setNewTask] = useState({ description: '', deadline: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createTask(newTask.description, newTask.deadline);
    if (success) setNewTask({ description: '', deadline: '' });
  };

  return (
    <div className="app-container">
      <h1>To-Do Manager: Set your goals!</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newTask.description}
          onChange={e => setNewTask(p => ({ ...p, description: e.target.value }))}
          placeholder="Enter task (min. 11 characters)"
        />
        <input
          type="datetime-local"
          value={newTask.deadline}
          onChange={e => setNewTask(p => ({ ...p, deadline: e.target.value }))}
        />
        <button type="submit">Add Task</button>
        {error && <div className="error">{error}</div>}
      </form>
      <TaskTable tasks={tasks} onUpdate={fetchTasks} />
    </div>
  );
};