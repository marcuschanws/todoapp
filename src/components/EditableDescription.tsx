import { useState } from 'react';
import { apiClient } from '../api/client';
import { Task } from '../types/task';
import { ErrorMessage } from './ErrorMessage';
import '../App.css';

export const EditableDescription = ({ task, onUpdate }: { 
  task: Task, 
  onUpdate: () => void 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newDescription, setNewDescription] = useState(task.description);
  const [error, setError] = useState('');

  const handleSave = async () => {
    try
    {
    if (newDescription.trim().length <= 10) {
      setError('Description must be at least 11 characters');
      return false;
    }
    else if(newDescription.trim().length > 500) {
      setError('Description cannot be more than 500 characters');
      return false;
    }
    else if(newDescription.trim() === task.description) {
      setError('Description name must be changed');
      return false;
    }

    await apiClient.put(`/ToDoTasks/UpdateDescription/${task.identifier}`, newDescription.trim());
    setIsEditing(false);
    setError('');
    onUpdate();
    }
    catch (err)
    {
      setError('Failed to update description.')
    }
  };

  return (
    <div className="editable-description">
      {isEditing ? (
        <>
        
          <textarea className ='description-edit-input'
            value={newDescription}
            onChange={(e) => {
              setNewDescription(e.target.value);
              setError('');
            }}
          />
          <div>
          <button className='edit-icon-clicked' onClick={handleSave} 
            title="Save">✓
          </button>
          <button className= 'edit-icon-clicked' onClick={() => setIsEditing(false) } 
            title="Cancel">❌
            </button>
          
          </div>
          <ErrorMessage message={error} />
        </>
      ) : (
        <>
          <span>{task.description}</span>
          <button 
            onClick={() => setIsEditing(true)}
            className="edit-icon"
            title="Edit description"
          >
            🖍
          </button>
        </>
      )}
    </div>
  );
};