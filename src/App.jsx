import { useState } from 'react';
import Login from './components/login';
import Register from './components/Register';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import BoardColumn from './components/BoardColumn';
import TaskCard from './components/TaskCard';
import ConfirmModal from './components/ConfirmModal';
import { useKanban } from './context/KanbanContext';

function App() {
  const { currentUser, currentBoard, moveTask, createColumn, prompt } = useKanban();
  const [authPage, setAuthPage] = useState('login');

  const handleDragStart = (e, taskId, sourceColId) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('sourceColId', sourceColId);
  };

  const handleDrop = (e, targetColId) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const sourceColId = e.dataTransfer.getData('sourceColId');
    
    if (!taskId || !sourceColId || sourceColId === targetColId) return;

    if (currentBoard) {
      moveTask(currentBoard.id, sourceColId, targetColId, taskId);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleAddColumn = async () => {
    const title = await prompt("Enter column title:");
    if (title && title.trim()) {
      createColumn(currentBoard.id, title.trim());
    }
  };

  if (!currentUser) {
    return (
      <>
        {authPage === 'login' 
          ? <Login onSwitchToRegister={() => setAuthPage('register')} />
          : <Register onSwitchToLogin={() => setAuthPage('login')} />}
        <ConfirmModal />
      </>
    );
  }

  return (
    <div className="app-container">
      <div id="app-screen" className="flex-1 flex h-full w-full overflow-hidden">
        
        <Sidebar />

        <main className="app-main">
          
          <Header />

          {/* BOARD CANVAS: Columns & Tasks */}
          <div className="board-wrapper">
            <div id="board-canvas" className="board-canvas">
              
              {currentBoard ? (
                <>
                  {currentBoard.columns.map(col => (
                    <BoardColumn 
                      key={col.id}
                      colId={col.id}
                      title={col.title} 
                      count={col.tasks.length}
                      onDrop={(e) => handleDrop(e, col.id)}
                      onDragOver={handleDragOver}
                    >
                      {col.tasks.map(task => (
                        <TaskCard 
                          key={task.id}
                          task={task}
                          colId={col.id}
                          onDragStart={(e) => handleDragStart(e, task.id, col.id)}
                        />
                      ))}
                    </BoardColumn>
                  ))}

                  {/* Add Column Button */}
                  <button className="btn btn-dashed" onClick={handleAddColumn}>
                    <i className="ph ph-plus text-lg"></i> Add Column
                  </button>
                </>
              ) : (
                <div className="flex items-center justify-center h-full w-full">
                  <p className="text-gray-500">No board selected or available. Create one to get started!</p>
                </div>
              )}

            </div>
          </div>
        </main>
      </div>
      <ConfirmModal />
    </div>
  );
}

export default App;
