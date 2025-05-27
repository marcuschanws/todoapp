import { useState } from 'react';
import { apiClient } from '../api/client';
import { ErrorMessage } from './ErrorMessage';
import '../App.css';

interface EditDeadlineProps {
  taskIdent: string;
  currentDeadline?: string;
  onUpdate: () => void;
}

export const EditDeadline = ({ taskIdent, currentDeadline, onUpdate }: EditDeadlineProps) => {
  let [newDeadline, setNewDeadline] = useState(currentDeadline || '');
  const [error, setError] = useState('');

  const handleUpdate = async () => {
    try {
      if (newDeadline) {
        const localDate = new Date(newDeadline);
        const utcIsoString = new Date(
          Date.UTC(
            localDate.getFullYear(),
            localDate.getMonth(),
            localDate.getDate(),
            localDate.getHours(),
            localDate.getMinutes()
          )
        ).toISOString()

        newDeadline = utcIsoString;
      }

      if (currentDeadline) {
        const localDate = new Date(currentDeadline);
        const utcIsoString = new Date(
          Date.UTC(
            localDate.getFullYear(),
            localDate.getMonth(),
            localDate.getDate(),
            localDate.getHours(),
            localDate.getMinutes()
          )
        ).toISOString()

        currentDeadline = utcIsoString;
      }

      if (newDeadline === currentDeadline) {
        setError('New selected deadline same as previous one');
        return false;
      }

      await apiClient.put(`/ToDoTasks/UpdateDeadline/${taskIdent}`, newDeadline || null);
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