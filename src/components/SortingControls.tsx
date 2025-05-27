import '../App.css';

export const SortingControls = ({ onSortChange }: { 
  onSortChange: (sortType: 'deadline' | 'alphabetical' | 'creation date') => void 
}) => {
  return (
    <div className="sorting-controls">
      <label>Sort by:</label>
      <select onChange={(e) => onSortChange(e.target.value as any)}>
        <option value="deadline">Deadline</option>
        <option value="alphabetical">Alphabetical</option>
        <option value="creation date">Creation Date</option>
      </select>
    </div>
  );
};