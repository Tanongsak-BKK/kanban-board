import { useState } from 'react';
import { useKanban } from '../context/KanbanContext';

function TaskModal({ task, colId, onClose }) {
  const { currentBoard, updateTask, deleteTask } = useKanban();
  
  const [title, setTitle] = useState(task.title);
  const [selectedAssignees, setSelectedAssignees] = useState(task.assignees || []);
  // convert tags array to comma separated string for easy editing
  const [tagsStr, setTagsStr] = useState(task.tags ? task.tags.map(t => t.label).join(', ') : "");

  // Prevent event bubbling so clicking inside modal doesn't close it
  const handleModalClick = (e) => e.stopPropagation();

  const handleSave = () => {
    // Parse tags
    const newTags = tagsStr.split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)
      .map(t => ({ label: t, colorClass: 'badge-brand' }));

    updateTask(currentBoard.id, colId, task.id, {
      title,
      tags: newTags,
      assignees: selectedAssignees
    });

    onClose();
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTask(currentBoard.id, colId, task.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={handleModalClick}>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Edit Task</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <i className="ph ph-x text-xl"></i>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assignees</label>
            <div className="flex flex-wrap gap-2">
              {currentBoard.members.map(member => {
                const isSelected = selectedAssignees.some(a => a.name === member);
                return (
                  <button
                    key={member}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedAssignees(selectedAssignees.filter(a => a.name !== member));
                      } else {
                        setSelectedAssignees([...selectedAssignees, { name: member, initial: member.charAt(0).toUpperCase() }]);
                      }
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
                      isSelected 
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 ring-2 ring-indigo-500/20' 
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      {member.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">{member}</span>
                    {isSelected && <i className="ph ph-check-circle text-indigo-600 text-sm"></i>}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (Comma separated)</label>
            <input
              type="text"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              placeholder="e.g. Design, High Priority"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <div className="flex flex-wrap gap-1 mt-2">
              {tagsStr.split(',').map(t => t.trim()).filter(t => t.length > 0).map((tag, index) => (
                <span key={index} className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs rounded-full font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-4">
          <button 
            onClick={handleDelete}
            className="flex items-center gap-1 text-red-600 hover:text-red-700 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
          >
            <i className="ph ph-trash"></i> Delete Task
          </button>
          
          <div className="flex gap-2">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default TaskModal;
