import { useState } from 'react';
import { useKanban } from '../context/KanbanContext';

function Sidebar() {
  const { currentUser, userBoards, currentBoardId, selectBoard, createBoard, logout, userNotifications, clearNotifications } = useKanban();
  const [showNotif, setShowNotif] = useState(false);

  const handleCreateBoard = () => {
    const title = prompt("Enter new board title:");
    if (title && title.trim()) {
      createBoard(title.trim());
    }
  };

  const unreadCount = userNotifications.filter(n => !n.isRead).length;

  return (
    <aside className="app-sidebar flex flex-col h-full bg-slate-900 text-slate-300 w-64 border-r border-slate-700">
      <div className="p-4 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-2 text-white font-bold text-xl">
          <i className="ph-fill ph-kanban text-indigo-400"></i> Kanban
        </div>
        
        {/* Notifications Toggle */}
        <div className="relative">
          <button onClick={() => setShowNotif(!showNotif)} className="relative p-1 hover:text-white transition-colors">
            <i className="ph ph-bell text-xl"></i>
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
            )}
          </button>
          
          {showNotif && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-50 border border-slate-200">
              <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-700">Notifications</span>
                <button onClick={clearNotifications} className="text-xs text-indigo-600 hover:text-indigo-800">Clear</button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {userNotifications.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-slate-500">No notifications</div>
                ) : (
                  userNotifications.map(n => (
                    <div key={n.id} className={`px-4 py-2 text-sm border-b border-slate-50 last:border-0 ${!n.isRead ? 'bg-indigo-50 font-medium text-indigo-900' : 'text-slate-600'}`}>
                      {n.message}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto hidden-scrollbar">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Your Boards</h2>
          <button onClick={handleCreateBoard} className="text-slate-400 hover:text-white transition-colors" title="Create Board">
            <i className="ph ph-plus text-lg"></i>
          </button>
        </div>
        <ul id="board-list" className="space-y-1">
          {userBoards.map(board => (
            <li 
              key={board.id} 
              onClick={() => selectBoard(board.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors ${
                currentBoardId === board.id 
                  ? 'bg-indigo-600/20 text-indigo-400 font-medium' 
                  : 'hover:bg-slate-800 hover:text-white text-slate-400'
              }`}
            >
              <i className={currentBoardId === board.id ? "ph-fill ph-kanban" : "ph ph-kanban"}></i>
              <span className="truncate flex-1">{board.title}</span>
            </li>
          ))}
          {userBoards.length === 0 && (
            <li className="text-sm text-slate-500 px-3 italic">No boards available</li>
          )}
        </ul>
      </div>

      <div className="p-4 border-t border-slate-700 flex items-center justify-between mt-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
            {currentUser?.username.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-white truncate w-24">
            {currentUser?.username}
          </span>
        </div>
        <button onClick={logout} className="text-slate-400 hover:text-white transition-colors" title="Logout">
          <i className="ph ph-sign-out text-xl"></i>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
