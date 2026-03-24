import { useState } from 'react';
import TaskModal from './TaskModal';

function TaskCard({ task, colId, onDragStart }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { title, tags, assignee } = task;

  return (
    <>
      <div 
        className="card cursor-pointer hover:ring-2 hover:ring-indigo-400 hover:ring-offset-1 transition-all"
        draggable
        onDragStart={onDragStart}
        onClick={() => setIsModalOpen(true)}
      >
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.map((tag, index) => (
              <span key={index} className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs rounded-full font-medium">
                {tag.label}
              </span>
            ))}
          </div>
        )}
        <p className="text-sm font-medium text-gray-800 leading-snug break-words mb-3">{title}</p>
        <div className="flex items-center justify-between mt-auto">
          <i className="ph ph-text-align-left text-gray-400 text-sm hidden"></i>
          <div className="flex -space-x-2 ml-auto">
            {task.assignees && task.assignees.length > 0 ? (
              task.assignees.map((assignee, idx) => (
                <div 
                  key={idx}
                  className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold ring-2 ring-white" 
                  title={`Assigned to ${assignee.name}`}
                >
                  {assignee.initial}
                </div>
              ))
            ) : (
              <div className="w-6 h-6 rounded-full border border-dashed border-gray-300 text-gray-400 flex items-center justify-center text-xs" title="Unassigned">
                <i className="ph ph-user"></i>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {isModalOpen && (
        <TaskModal 
          task={task} 
          colId={colId} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
}

export default TaskCard;
