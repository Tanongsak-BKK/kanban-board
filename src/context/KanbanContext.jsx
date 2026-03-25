import { createContext, useContext, useState, useEffect } from 'react';

const KanbanContext = createContext();

export const useKanban = () => {
  return useContext(KanbanContext);
};

const generateId = (prefix) => `${prefix}-${Math.random().toString(36).substr(2, 9)}`;

// Default initial data if none exists
const defaultBoards = [
  {
    id: 'board-1',
    title: 'My First Board',
    members: ['admin', 'user1', 'user2', 'user3'], // who has access
    columns: [
      {
        id: 'col-todo',
        title: 'To Do',
        tasks: [
          { 
            id: 'task-1', 
            title: 'Design Landing Page', 
            tags: [
              { label: 'Design', colorClass: 'badge-brand' }, 
              { label: 'High Priority', colorClass: 'badge-brand' }
            ], 
            assignees: [{ name: 'admin', initial: 'A' }] 
          },
          { 
            id: 'task-2', 
            title: 'Write Copy', 
            tags: [
              { label: 'Content', colorClass: 'badge-brand' }
            ], 
            assignees: [] 
          }
        ]
      },
      {
        id: 'col-inprogress',
        title: 'In Progress',
        tasks: [
          { 
            id: 'task-3', 
            title: 'Setup Database', 
            tags: [
              { label: 'Backend', colorClass: 'badge-brand' }
            ], 
            assignees: [{ name: 'admin', initial: 'A' }] 
          }
        ]
      }
    ]
  }
];

export const KanbanProvider = ({ children }) => {
  // --- STATE ---
  const [users, setUsers] = useState(() => {
    const defaultUsers = [
      { username: 'admin', password: 'password' },
      { username: 'user1', password: 'password' },
      { username: 'user2', password: 'password' },
      { username: 'user3', password: 'password' }
    ];
    const saved = localStorage.getItem('kanban_users');
    if (!saved) return defaultUsers;
    const parsed = JSON.parse(saved);
    
    // Ensure all default mockup users exist in the parsed list
    const merged = [...parsed];
    defaultUsers.forEach(du => {
      if (!merged.find(u => u.username === du.username)) {
        merged.push(du);
      }
    });
    return merged;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('kanban_currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [boards, setBoards] = useState(() => {
    const saved = localStorage.getItem('kanban_boards');
    return saved ? JSON.parse(saved) : defaultBoards;
  });

  // Notifications: simple array of objects { id, message, isRead, userId }
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('kanban_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentBoardId, setCurrentBoardId] = useState(() => {
    const saved = localStorage.getItem('kanban_currentBoardId');
    return saved ? saved : (boards.length > 0 ? boards[0].id : null);
  });

  // --- PERSISTENCE ---
  useEffect(() => { localStorage.setItem('kanban_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('kanban_currentUser', JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => { localStorage.setItem('kanban_boards', JSON.stringify(boards)); }, [boards]);
  useEffect(() => { localStorage.setItem('kanban_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { if (currentBoardId) localStorage.setItem('kanban_currentBoardId', currentBoardId); }, [currentBoardId]);

  // Derived state: the currently active board
  const currentBoard = boards.find(b => b.id === currentBoardId) || null;

  // Derive boards the current user has access to
  const userBoards = currentUser 
    ? boards.filter(b => b.members.includes(currentUser.username))
    : [];

  // Derived state: active notifications for current user
  const userNotifications = currentUser
    ? notifications.filter(n => n.userId === currentUser.username)
    : [];

  // --- AUTHENTICATION ACTIONS ---
  const register = (username, password) => {
    if (users.find(u => u.username === username)) {
      throw new Error('Username already exists');
    }
    const newUsers = [...users, { username, password }];
    setUsers(newUsers);
    return true;
  };

  const login = (username, password) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    setCurrentUser(user);
    
    // Automatically set current board to their first available board if they have one
    const userAccessBoards = boards.filter(b => b.members.includes(user.username));
    if (userAccessBoards.length > 0) {
      setCurrentBoardId(userAccessBoards[0].id);
    } else {
      setCurrentBoardId(null);
    }
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentBoardId(null);
  };

  // --- NOTIFICATION ACTIONS ---
  const addNotification = (userId, message) => {
    const newNotification = {
      id: generateId('notif'),
      userId,
      message,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };


  
  const clearNotifications = () => {
    if (!currentUser) return;
    setNotifications(prev => prev.filter(n => n.userId !== currentUser.username));
  };

  // --- BOARD ACTIONS ---
  const selectBoard = (boardId) => setCurrentBoardId(boardId);

  const createBoard = (title) => {
    if (!currentUser) return;
    const newBoard = {
      id: generateId('board'),
      title,
      members: [currentUser.username],
      columns: []
    };
    setBoards(prev => [...prev, newBoard]);
    setCurrentBoardId(newBoard.id);
  };

  const renameBoard = (boardId, newTitle) => {
    setBoards(prev => prev.map(b => b.id === boardId ? { ...b, title: newTitle } : b));
  };

  const deleteBoard = (boardId) => {
    setBoards(prev => {
      const newBoards = prev.filter(b => b.id !== boardId);
      if (currentBoardId === boardId) {
        // If we deleted the active board, select another one if available
        const userAccess = newBoards.filter(b => currentUser && b.members.includes(currentUser.username));
        setCurrentBoardId(userAccess.length > 0 ? userAccess[0].id : null);
      }
      return newBoards;
    });
  };

  const inviteMember = (boardId, username) => {
    // Check if user exists
    const userExists = users.some(u => u.username === username);
    if (!userExists) throw new Error('User does not exist');

    setBoards(prev => prev.map(b => {
      if (b.id === boardId) {
        if (b.members.includes(username)) throw new Error('User already in board');
        return { ...b, members: [...b.members, username] };
      }
      return b;
    }));
    
    // Notify the user
    const board = boards.find(b => b.id === boardId);
    if (board) {
      addNotification(username, `You were invited to board "${board.title}" by ${currentUser.username}`);
    }
  };


  // --- COLUMN ACTIONS ---
  const createColumn = (boardId, title) => {
    setBoards(prev => prev.map(b => {
      if (b.id === boardId) {
        return {
          ...b,
          columns: [...b.columns, { id: generateId('col'), title, tasks: [] }]
        };
      }
      return b;
    }));
  };

  const renameColumn = (boardId, colId, title) => {
    setBoards(prev => prev.map(b => {
      if (b.id === boardId) {
        return {
          ...b,
          columns: b.columns.map(c => c.id === colId ? { ...c, title } : c)
        };
      }
      return b;
    }));
  };

  const deleteColumn = (boardId, colId) => {
    setBoards(prev => prev.map(b => {
      if (b.id === boardId) {
        return {
          ...b,
          columns: b.columns.filter(c => c.id !== colId)
        };
      }
      return b;
    }));
  };

  const createTask = (boardId, colId, taskParams) => {
    setBoards(prev => prev.map(b => {
      if (b.id === boardId) {
        return {
          ...b,
          columns: b.columns.map(c => {
            if (c.id === colId) {
              return {
                ...c,
                tasks: [...c.tasks, { 
                  id: generateId('task'), 
                  title: taskParams.title || 'New Task',
                  tags: taskParams.tags || [],
                  assignees: taskParams.assignees || [] 
                }]
              };
            }
            return c;
          })
        };
      }
      return b;
    }));
    
    // Notify all assigned members except the current user
    if (taskParams.assignees && taskParams.assignees.length > 0) {
      taskParams.assignees.forEach(assignee => {
        if (assignee.name !== currentUser?.username) {
          addNotification(assignee.name, `You were assigned to a new task "${taskParams.title}" by ${currentUser?.username}`);
        }
      });
    }
  };

  const updateTask = (boardId, colId, taskId, updates) => {
    let newlyAssigned = [];
    let taskTitle = '';

    setBoards(prev => prev.map(b => {
      if (b.id === boardId) {
        return {
          ...b,
          columns: b.columns.map(c => {
            if (c.id === colId) {
              return {
                ...c,
                tasks: c.tasks.map(t => {
                  if (t.id === taskId) {
                    taskTitle = updates.title || t.title;
                    
                    // Identify newly added assignees for notification
                    if (updates.assignees) {
                      const oldNames = (t.assignees || []).map(a => a.name);
                      newlyAssigned = updates.assignees
                        .filter(a => !oldNames.includes(a.name) && a.name !== currentUser?.username)
                        .map(a => a.name);
                    }
                    
                    return { ...t, ...updates };
                  }
                  return t;
                })
              };
            }
            return c;
          })
        };
      }
      return b;
    }));

    // Notify newly assigned members
    newlyAssigned.forEach(username => {
      addNotification(username, `You were assigned to task "${taskTitle}" by ${currentUser?.username}`);
    });
  };

  const deleteTask = (boardId, colId, taskId) => {
    setBoards(prev => prev.map(b => {
      if (b.id === boardId) {
        return {
          ...b,
          columns: b.columns.map(c => {
            if (c.id === colId) {
              return {
                ...c,
                tasks: c.tasks.filter(t => t.id !== taskId)
              };
            }
            return c;
          })
        };
      }
      return b;
    }));
  };

  const moveTask = (boardId, sourceColId, targetColId, taskId) => {
    if (sourceColId === targetColId) return;

    setBoards(prev => prev.map(b => {
      if (b.id === boardId) {
        const newCols = b.columns.map(col => ({ ...col, tasks: [...col.tasks] }));
        
        const sourceColIndex = newCols.findIndex(c => c.id === sourceColId);
        const targetColIndex = newCols.findIndex(c => c.id === targetColId);
        if (sourceColIndex === -1 || targetColIndex === -1) return b;
        
        const taskIndex = newCols[sourceColIndex].tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) return b;
        
        const [task] = newCols[sourceColIndex].tasks.splice(taskIndex, 1);
        newCols[targetColIndex].tasks.push(task);
        
        return { ...b, columns: newCols };
      }
      return b;
    }));
  };

  const value = {
    users,
    currentUser,
    boards,
    userBoards,
    currentBoard,
    currentBoardId,
    userNotifications,
    
    register,
    login,
    logout,
    
    selectBoard,
    createBoard,
    renameBoard,
    deleteBoard,
    inviteMember,
    
    createColumn,
    renameColumn,
    deleteColumn,
    
    createTask,
    updateTask,
    deleteTask,
    moveTask,


    clearNotifications
  };

  return (
    <KanbanContext.Provider value={value}>
      {children}
    </KanbanContext.Provider>
  );
};
