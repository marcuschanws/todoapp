import { useState, useRef } from 'react';
import { Task } from '../types/task';
import { ErrorMessage } from './ErrorMessage';
import { Celebration } from './Celebration';
import '../App.css';

interface CompleteButtonProps {
  task: Task;
  onComplete: () => Promise<boolean>;
}

export const CompleteButton = ({ task, onComplete }: CompleteButtonProps) => {
  const [celebrating, setCelebrating] = useState(false);
  const [error, setError] = useState('');
  const wasDone = useRef(task.isDone);

  const handleClick = async () => {
    const previousState = task.isDone;
    try
    {
    let result = await onComplete();
    
    // Only celebrate when changing from not done to done
    if (!previousState && !task.isDone && result) {
      setCelebrating(true);
      setTimeout(() => setCelebrating(false), 1500);
    }
    }
    catch (error)
    {
      setError('Failed to celebrate :(');
      setCelebrating(false);
    }
  };

  return (
    <div className="button-container">
      <button className="complete-btn" onClick={handleClick} title= "Toggle task status">
        {task.isDone ? 'Undo' : 'Complete'}
      </button>
      <ErrorMessage message={error} />
      {celebrating && <Celebration />}
    </div>
  );
};