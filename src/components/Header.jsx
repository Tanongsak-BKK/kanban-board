import { useState } from 'react';
import { useKanban } from '../context/KanbanContext';

function Header() {
  const { currentBoard, renameBoard, deleteBoard, inviteMember } = useKanban();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState("");

  if (!currentBoard) {
    return (
      <header className="app-header h-16 border-b border-slate-200 bg-white flex items-center px-6">
        <h1 className="text-xl font-bold text-slate-400">No Board Selected</h1>
      </header>
    );
  }

  const handleTitleClick = () => {
    setEditTitle(currentBoard.title);
    setIsEditingTitle(true);
  };

  const handleTitleSubmit = (e) => {
    e.preventDefault();
    if (editTitle.trim()) {
      renameBoard(currentBoard.id, editTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleDeleteBoard = () => {
    if (confirm(`Are you sure you want to delete board "${currentBoard.title}"?`)) {
      deleteBoard(currentBoard.id);
    }
  };

  const handleInvite = () => {
    const username = prompt("Enter username to invite:");
    if (username && username.trim()) {
      try {
        inviteMember(currentBoard.id, username.trim());
        alert("User invited successfully!");
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <header className="app-header h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 z-10 shadow-sm">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        
        {isEditingTitle ? (
          <form onSubmit={handleTitleSubmit} className="flex-1 max-w-sm">
            <input 
              type="text" 
              autoFocus
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              className="text-xl font-bold text-slate-800 bg-white border-2 border-indigo-500 rounded px-2 py-1 outline-none w-full"
            />
          </form>
        ) : (
          <h1 
            onClick={handleTitleClick}
            className="text-xl font-bold text-slate-800 hover:bg-slate-100 px-2 py-1 rounded cursor-pointer truncate transition-colors"
            title="Click to rename"
          >
            {currentBoard.title}
          </h1>
        )}

        <button onClick={handleDeleteBoard} className="text-slate-400 hover:text-red-500 transition-colors p-1" title="Delete Board">
          <i className="ph ph-trash text-xl"></i>
        </button>
      </div>

      <div className="flex items-center gap-4 shrink-0 ml-4">
        {/* Collaboration Members */}
        <div className="hidden sm:flex -space-x-2" id="board-members">
          {currentBoard.members.map((member, i) => (
            <div 
              key={i}
              className="w-8 h-8 rounded-full border-2 border-white bg-indigo-100 text-indigo-800 flex items-center justify-center text-xs font-bold ring-1 ring-slate-200" 
              title={member}
            >
              {member.charAt(0).toUpperCase()}
            </div>
          ))}
        </div>
        
        <button onClick={handleInvite} className="flex items-center gap-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded-lg font-medium text-sm transition-colors border border-indigo-200">
          <i className="ph ph-user-plus text-lg"></i> Share
        </button>
      </div>
    </header>
  );
}

export default Header;
