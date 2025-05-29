import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { ErrorMessage } from './ErrorMessage';
import { formatForInput, localToUTCISO } from '../utility/dateUtils';
import '../App.css';

interface EditDeadlineProps {
  taskIdent: string;
  currentDeadline?: string;
  onUpdate: () => void;
}

export const EditDeadline = ({ taskIdent, currentDeadline, onUpdate }: EditDeadlineProps) => {
  let [newDeadline, setNewDeadline] = useState(currentDeadline || '');
  const [error, setError] = useState('');

    useEffect(() => {
    setNewDeadline(formatForInput(currentDeadline));
  }, [currentDeadline]);

  const handleUpdate = async () => {
    try {
      const deadlineUTC = localToUTCISO(newDeadline);

      if (deadlineUTC === currentDeadline) {
        setError('New selected deadline same as previous one');
        return false;
      }

      await apiClient.put(`/ToDoTasks/UpdateDeadline/${taskIdent}`, deadlineUTC || null);
      setError('');
      onUpdate();
    } catch (err) {
      setError('Failed to update deadline');
    }
  };

  return (
    <div className="deadline-edit">
      <input
        type="datetime-local"
        value={newDeadline}
        onChange={(e) => setNewDeadline(e.target.value)}
      />
      <button className='deadline-edit-button' onClick={handleUpdate} title="Update deadline">🗘</button>
      <ErrorMessage message={error} />
    </div>
  );
};