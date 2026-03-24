import { useState } from 'react';
import { useKanban } from '../context/KanbanContext';

function BoardColumn({ colId, title, count, children, onDrop, onDragOver }) {
  const { currentBoardId, renameColumn, deleteColumn, createTask } = useKanban();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");

  const handleTitleClick = () => {
    setEditTitle(title);
    setIsEditing(true);
  };

  const handleTitleSubmit = (e) => {
    e.preventDefault();
    if (editTitle.trim()) {
      renameColumn(currentBoardId, colId, editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm(`Delete column "${title}" and all its tasks?`)) {
      deleteColumn(currentBoardId, colId);
    }
  };

  const handleAddTask = () => {
    const taskTitle = prompt("Enter task title:");
    if (taskTitle && taskTitle.trim()) {
      createTask(currentBoardId, colId, { title: taskTitle.trim() });
    }
  };

  return (
    <div 
      className="board-column group"
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <div className="board-column-header flex justify-between items-center bg-gray-50/50 p-3 border-b border-gray-200">
        {isEditing ? (
          <form onSubmit={handleTitleSubmit} className="flex-1 mr-2">
            <input 
              type="text" 
              autoFocus
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              className="text-sm font-bold text-gray-800 bg-white border border-indigo-400 rounded px-1.5 py-0.5 outline-none w-full"
            />
          </form>
        ) : (
          <h3 
            onClick={handleTitleClick}
            className="board-column-title flex-1 cursor-pointer hover:bg-gray-200 px-1.5 py-0.5 rounded transition-colors text-sm font-bold text-gray-700 uppercase tracking-wide"
            title="Click to rename"
          >
            {title}
          </h3>
        )}
        
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">{count}</span>
          <button onClick={handleDelete} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1" title="Delete Column">
            <i className="ph ph-trash"></i>
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[50px] task-container">
        {children}
      </div>
      
      <div className="p-2 pt-0 mt-1">
        <button onClick={handleAddTask} className="w-full flex items-center justify-center gap-1 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors">
          <i className="ph ph-plus text-lg"></i> Add Task
        </button>
      </div>
    </div>
  );
}

export default BoardColumn;
