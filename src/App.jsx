import { useState, useEffect, useRef, createContext, useContext, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { StoreProvider, useStore, collectAllTasks } from './Store';
import { Sidebar, Editor, Icon } from './Components';
import { ListView, CalendarView, GalleryView, FilesView, TeamView, MiscView, ArchiveView, ActiveView, SettingsView } from './Views';
import { SongListView, SongDetailView, ReleasesListView, ReleaseDetailView, CombinedTimelineView, TaskDashboardView, FinancialsView, ProgressView, EventsListView, EventDetailView, ExpensesListView, ExpenseDetailView, VideosListView, VideoDetailView, GlobalTasksListView, GlobalTaskDetailView } from './SpecViews';
import { COLOR_VALUES, THEME, cn } from './utils';

// Toast notification context and component
const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  
  const showToast = useCallback((message, options = {}) => {
    const id = crypto.randomUUID();
    const toast = {
      id,
      message,
      type: options.type || 'info', // 'info', 'success', 'error', 'warning'
      duration: options.duration ?? 5000,
      action: options.action || null, // { label: string, onClick: () => void }
    };
    setToasts(prev => [...prev, toast]);
    
    // Auto-dismiss after duration
    if (toast.duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, toast.duration);
    }
    
    return id;
  }, []);
  
  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);
  



  return (
    <ToastContext.Provider value={{ showToast, dismissToast, toasts }}>
      {children}
    </ToastContext.Provider>
  );
};

// Toast notification display component
const ToastContainer = () => {
  const { toasts, dismissToast } = useToast();
  const { data } = useStore();
  const settings = data.settings || {};
  const isDark = settings.themeMode === 'dark';
  const focusMode = settings.focusMode || false;
  
  if (toasts.length === 0) return null;
  
  return (
    <div className="fixed bottom-20 md:bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-2 max-w-sm w-full px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-center justify-between gap-3 p-4 w-full",
            focusMode ? "rounded-lg shadow-lg border" : "border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.85)]",
            isDark 
              ? "bg-slate-800 text-slate-50 border-slate-600" 
              : "bg-white text-slate-900 border-black",
            toast.type === 'success' && (isDark ? 'border-l-green-500' : 'border-l-green-600'),
            toast.type === 'error' && (isDark ? 'border-l-red-500' : 'border-l-red-600'),
            toast.type === 'warning' && (isDark ? 'border-l-yellow-500' : 'border-l-yellow-600'),
            focusMode ? "border-l-4" : "border-l-8"
          )}
          style={{ animation: 'slideInUp 0.3s ease-out' }}
        >
          <span className={cn(
            "flex-1 text-sm",
            focusMode ? "font-medium" : "font-bold uppercase"
          )}>
            {toast.message}
          </span>
          
          <div className="flex items-center gap-2">
            {toast.action && (
              <button
                onClick={() => {
                  toast.action.onClick();
                  dismissToast(toast.id);
                }}
                className={cn(
                  "px-3 py-1 text-xs font-bold uppercase transition-colors",
                  focusMode ? "rounded bg-[var(--accent)] text-slate-900 hover:opacity-80" : "bg-[var(--accent)] text-slate-900 border-2 border-black hover:-translate-y-0.5 active:translate-y-0",
                  isDark && !focusMode && "border-slate-600"
                )}
              >
                {toast.action.label}
              </button>
            )}
            <button
              onClick={() => dismissToast(toast.id)}
              className={cn(
                "p-1 transition-colors",
                isDark ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-900"
              )}
            >
              <Icon name="X" size={16} />
            </button>
          </div>
        </div>
      ))}
      
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

// Custom hook to handle mutations with undo toast notifications
export const useUndoableAction = () => {
  const { showToast } = useToast();
  const { actions } = useStore();
  
  const performAction = useCallback(async (actionFn, successMessage) => {
    try {
      await actionFn();
      showToast(successMessage, {
        type: 'success',
        action: { // Always show undo since we just added to stack
          label: 'Undo',
          onClick: async () => {
            const result = await actions.undo();
            if (result?.undone) {
              showToast(`Undone: ${result.description}`, { type: 'info', duration: 3000 });
            }
          }
        }
      });
    } catch (error) {
      showToast(`Error: ${error.message || 'Action failed'}`, { type: 'error' });
    }
  }, [showToast, actions]);
  
  const triggerUndo = useCallback(async () => {
    const result = await actions.undo();
    if (result?.undone) {
      showToast(`Undone: ${result.description}`, { type: 'info', duration: 3000 });
    } else {
      showToast('Nothing to undo', { type: 'warning', duration: 2000 });
    }
    return result;
  }, [actions, showToast]);
  
  return { performAction, triggerUndo };
};

// Floating Action Button (FAB) for mobile quick actions
const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const fabRef = useRef(null);
  const { data, actions } = useStore();
  const { showToast } = useToast();
  const settings = data.settings || {};
  const isDark = settings.themeMode === 'dark';

  // Quick add form state
  const [taskTitle, setTaskTitle] = useState('');
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [noteTitle, setNoteTitle] = useState('');

  const closeTaskModal = () => {
    setTaskTitle('');
    setShowTaskModal(false);
  };

  const closeExpenseModal = () => {
    setExpenseName('');
    setExpenseAmount('');
    setShowExpenseModal(false);
  };

  const closeNoteModal = () => {
    setNoteTitle('');
    setShowNoteModal(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fabRef.current && !fabRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleAddTask = async () => {
    if (!taskTitle.trim()) return;
    await actions.addGlobalTask({
      taskName: taskTitle.trim(),
      status: 'Not Started',
      category: 'Other'
    });
    showToast(`Task "${taskTitle.trim()}" created`, { type: 'success' });
    setTaskTitle('');
    setShowTaskModal(false);
  };

  const handleAddExpense = async () => {
    if (!expenseName.trim()) return;
    const parsedAmount = parseFloat(expenseAmount);
    if (expenseAmount && (isNaN(parsedAmount) || parsedAmount < 0)) {
      showToast('Expense amount must be 0 or greater', { type: 'warning', duration: 3000 });
      return;
    }

    await actions.addExpense({
      name: expenseName.trim(),
      paidCost: parsedAmount || 0,
      status: 'Complete'
    });
    showToast(`Expense "${expenseName.trim()}" logged`, { type: 'success' });
    setExpenseName('');
    setExpenseAmount('');
    setShowExpenseModal(false);
  };

  const handleAddNote = async () => {
    if (!noteTitle.trim()) return;
    await actions.addGlobalTask({
      taskName: noteTitle.trim(),
      status: 'Not Started',
      category: 'Other',
      notes: 'Quick note'
    });
    showToast(`Note "${noteTitle.trim()}" created`, { type: 'success' });
    setNoteTitle('');
    setShowNoteModal(false);
  };

  const menuItems = [
    { 
      label: 'Add Task', 
      icon: 'Activity', 
      action: () => { setIsOpen(false); setShowTaskModal(true); },
      color: isDark ? 'bg-purple-600' : 'bg-purple-500'
    },
    { 
      label: 'Log Expense', 
      icon: 'Receipt', 
      action: () => { setIsOpen(false); setShowExpenseModal(true); },
      color: isDark ? 'bg-green-600' : 'bg-green-500'
    },
    { 
      label: 'Quick Note', 
      icon: 'FileText', 
      action: () => { setIsOpen(false); setShowNoteModal(true); },
      color: isDark ? 'bg-blue-600' : 'bg-blue-500'
    }
  ];

  // Quick add modal component
  const QuickModal = ({ title, show, onClose, onSubmit, children }) => {
    useEffect(() => {
      if (!show) return;
      const handleEscape = (event) => {
        if (event.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [show, onClose]);

    if (!show) return null;
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div 
          className={cn(
            "w-full max-w-sm p-4",
            THEME.punk.card,
            isDark ? "bg-slate-800" : "bg-white"
          )}
          onClick={e => e.stopPropagation()}
        >
          <h3 className={cn("font-black uppercase text-lg mb-4 border-b-4 pb-2", isDark ? "border-slate-600" : "border-black")}>
            {title}
          </h3>
          {children}
          <div className="flex gap-2 mt-4">
            <button 
              onClick={onClose}
              className={cn("flex-1 py-2", THEME.punk.btn)}
            >
              Cancel
            </button>
            <button 
              onClick={onSubmit}
              className={cn("flex-1 py-2", THEME.punk.btn, "bg-[var(--accent)] text-slate-900")}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* FAB Container - Only visible on mobile/tablet */}
      <div 
        ref={fabRef}
        className="md:hidden fixed bottom-6 right-6 z-30"
      >
        {/* Expanded Menu Items */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 flex flex-col gap-3 mb-2">
            {menuItems.map((item, index) => (
              <button
                key={item.label}
                onClick={item.action}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-white font-bold uppercase text-sm whitespace-nowrap",
                  "border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.85)]",
                  "transform transition-all duration-200 hover:-translate-y-1",
                  isDark ? "border-slate-600" : "border-black",
                  item.color
                )}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: 'fadeInUp 0.2s ease-out forwards'
                }}
              >
                <Icon name={item.icon} size={18} />
                {item.label}
              </button>
            ))}
          </div>
        )}

        {/* Main FAB Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center",
            "border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.85)]",
            "transform transition-all duration-200",
            isOpen ? "rotate-45" : "rotate-0",
            isDark 
              ? "bg-[var(--accent)] border-slate-600 text-slate-900" 
              : "bg-[var(--accent)] border-black text-slate-900"
          )}
        >
          <Icon name="Plus" size={24} strokeWidth={3} />
        </button>
      </div>

      {/* Task Modal */}
      <QuickModal 
        title="Add Task" 
        show={showTaskModal} 
        onClose={closeTaskModal}
        onSubmit={handleAddTask}
      >
        <input
          type="text"
          value={taskTitle}
          onChange={e => setTaskTitle(e.target.value)}
          placeholder="Task name..."
          className={cn("w-full", THEME.punk.input)}
          autoFocus
          onKeyDown={e => e.key === 'Enter' && handleAddTask()}
        />
      </QuickModal>

      {/* Expense Modal */}
      <QuickModal 
        title="Log Expense" 
        show={showExpenseModal} 
        onClose={closeExpenseModal}
        onSubmit={handleAddExpense}
      >
        <div className="space-y-3">
          <input
            type="text"
            value={expenseName}
            onChange={e => setExpenseName(e.target.value)}
            placeholder="Expense name..."
            className={cn("w-full", THEME.punk.input)}
            autoFocus
          />
          <input
            type="number"
            value={expenseAmount}
            onChange={e => setExpenseAmount(e.target.value)}
            placeholder="Amount ($)"
            className={cn("w-full", THEME.punk.input)}
            min="0"
            step="0.01"
            onKeyDown={e => e.key === 'Enter' && handleAddExpense()}
          />
        </div>
      </QuickModal>

      {/* Note Modal */}
      <QuickModal 
        title="Quick Note" 
        show={showNoteModal} 
        onClose={closeNoteModal}
        onSubmit={handleAddNote}
      >
        <input
          type="text"
          value={noteTitle}
          onChange={e => setNoteTitle(e.target.value)}
          placeholder="Note title..."
          className={cn("w-full", THEME.punk.input)}
          autoFocus
          onKeyDown={e => e.key === 'Enter' && handleAddNote()}
        />
      </QuickModal>

      {/* Animation keyframes */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};


// Hook to sync React Router with hash-based routing for backward compatibility
const useRouteSync = (setTab, setSelectedSong, setSelectedRelease, setSelectedEvent, setSelectedExpense, setSelectedVideo, setSelectedGlobalTask) => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { data } = useStore();

  // Map React Router paths to tab names
  const pathToTab = {
    '/': 'today',
    '/today': 'today',
    '/dashboard': 'dashboard',
    '/songs': 'songs',
    '/releases': 'releases',
    '/videos': 'videos',
    '/events': 'events',
    '/tasks': 'globalTasks',
    '/expenses': 'expenses',
    '/calendar': 'calendar',
    '/timeline': 'timeline',
    '/financials': 'financials',
    '/progress': 'progress',
    '/team': 'team',
    '/gallery': 'gallery',
    '/files': 'files',
    '/settings': 'settings',
    '/archive': 'archive',
    '/active': 'active',
  };

  // Sync React Router to app state on mount and route changes
  useEffect(() => {
    const path = location.pathname;
    
    // Handle detail routes with IDs
    if (path.startsWith('/songs/') && params.songId) {
      const song = (data.songs || []).find(s => s.id === params.songId);
      if (song) {
        setSelectedSong(song);
        setTab('songDetail');
      }
    } else if (path.startsWith('/releases/') && params.releaseId) {
      const release = (data.releases || []).find(r => r.id === params.releaseId);
      if (release) {
        setSelectedRelease(release);
        setTab('releaseDetail');
      }
    } else if (path.startsWith('/videos/') && params.videoId) {
      const standalone = (data.standaloneVideos || []).find(v => v.id === params.videoId);
      const attached = (data.songs || []).flatMap(song => song.videos || []).find(v => v.id === params.videoId);
      const video = standalone || attached;
      if (video) {
        setSelectedVideo(video);
        setTab('videoDetail');
      }
    } else if (path.startsWith('/events/') && params.eventId) {
      const event = (data.events || []).find(e => e.id === params.eventId);
      if (event) {
        setSelectedEvent(event);
        setTab('eventDetail');
      }
    } else if (path.startsWith('/expenses/') && params.expenseId) {
      const expense = (data.expenses || []).find(e => e.id === params.expenseId);
      if (expense) {
        setSelectedExpense(expense);
        setTab('expenseDetail');
      }
    } else if (path.startsWith('/tasks/') && params.taskId) {
      const task = (data.globalTasks || []).find(t => t.id === params.taskId);
      if (task) {
        setSelectedGlobalTask(task);
        setTab('globalTaskDetail');
      }
    } else {
      // Handle list routes
      const tab = pathToTab[path];
      if (tab) {
        setTab(tab);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, params, data.songs, data.releases, data.standaloneVideos, data.events, data.expenses, data.globalTasks]);

  // Handle legacy hash-based URLs for backward compatibility
  useEffect(() => {
    const handleHashRoute = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (!hash) return;
      
      const urlParams = new URLSearchParams(hash);
      const tab = urlParams.get('tab');
      const songId = urlParams.get('songId');
      const releaseId = urlParams.get('releaseId');
      const eventId = urlParams.get('eventId');
      const expenseId = urlParams.get('expenseId');
      const videoId = urlParams.get('videoId');
      const taskId = urlParams.get('taskId');

      // Convert hash route to React Router route
      if (songId) {
        navigate(`/songs/${songId}`, { replace: true });
      } else if (releaseId) {
        navigate(`/releases/${releaseId}`, { replace: true });
      } else if (videoId) {
        navigate(`/videos/${videoId}`, { replace: true });
      } else if (eventId) {
        navigate(`/events/${eventId}`, { replace: true });
      } else if (expenseId) {
        navigate(`/expenses/${expenseId}`, { replace: true });
      } else if (taskId) {
        navigate(`/tasks/${taskId}`, { replace: true });
      } else if (tab) {
        // Map old tab names to new routes
        const tabToPath = {
          'today': '/today',
          'dashboard': '/dashboard',
          'songs': '/songs',
          'releases': '/releases',
          'videos': '/videos',
          'events': '/events',
          'globalTasks': '/tasks',
          'expenses': '/expenses',
          'calendar': '/calendar',
          'timeline': '/timeline',
          'financials': '/financials',
          'progress': '/progress',
          'team': '/team',
          'gallery': '/gallery',
          'files': '/files',
          'settings': '/settings',
          'archive': '/archive',
          'active': '/active',
        };
        const path = tabToPath[tab];
        if (path) {
          navigate(path, { replace: true });
        }
      }
    };

    // Check for hash on initial load
    if (window.location.hash) {
      handleHashRoute();
    }

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashRoute);
    return () => window.removeEventListener('hashchange', handleHashRoute);
  }, [navigate]);

  // Return navigation function that uses React Router
  return useCallback((path, options = {}) => {
    navigate(path, options);
  }, [navigate]);
};

const TodayView = ({ onNavigate }) => {
  const { data } = useStore();
  const navigate = useNavigate();
  const settings = data.settings || {};
  const isDark = settings.themeMode === 'dark';
  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  // Collect all tasks from all sources
  const tasks = collectAllTasks(data);
  
  // Filter state for sources
  const [sourceFilters, setSourceFilters] = useState({
    'Song': true,
    'Version': true,
    'Release': true,
    'Video': true,
    'Event': true,
    'Global Task': true
  });

  // Get source icon and color
  const getSourceBadge = (source) => {
    const badges = {
      'Song': { icon: 'Music', label: '🎵 Song', color: 'bg-blue-100 text-blue-800 border-blue-500' },
      'Version': { icon: 'Music2', label: '🎵 Version', color: 'bg-blue-100 text-blue-800 border-blue-500' },
      'Release': { icon: 'Disc', label: '💿 Release', color: 'bg-purple-100 text-purple-800 border-purple-500' },
      'Video': { icon: 'Video', label: '🎬 Video', color: 'bg-pink-100 text-pink-800 border-pink-500' },
      'Event': { icon: 'Calendar', label: '📅 Event', color: 'bg-green-100 text-green-800 border-green-500' },
      'Global Task': { icon: 'CheckCircle', label: '✅ Task', color: 'bg-yellow-100 text-yellow-800 border-yellow-500' }
    };
    return badges[source] || { icon: 'Circle', label: source, color: 'bg-gray-100 text-gray-800 border-gray-500' };
  };

  // Navigate to source
  const navigateToSource = (task) => {
    if (task.source === 'Song' || task.source === 'Version') {
      navigate(`/songs/${task.sourceId}`);
    } else if (task.source === 'Release') {
      navigate(`/releases/${task.sourceId}`);
    } else if (task.source === 'Video') {
      // Videos can be standalone or part of songs - for now go to videos list
      navigate('/videos');
    } else if (task.source === 'Event') {
      navigate(`/events/${task.sourceId}`);
    } else if (task.source === 'Global Task') {
      navigate(`/tasks/${task.sourceId}`);
    }
  };

  // Filter tasks by selected sources
  const filteredTasks = tasks.filter(t => sourceFilters[t.source]);
  
  // Separate overdue and upcoming tasks
  const overdue = filteredTasks.filter(t => t.date && t.date < today && t.status !== 'Complete' && t.status !== 'Done');
  const upcoming = filteredTasks.filter(t => t.date && t.date >= today && t.date <= nextWeek && t.status !== 'Complete' && t.status !== 'Done');
  const allUpcoming = filteredTasks.filter(t => t.date && t.date >= today && t.status !== 'Complete' && t.status !== 'Done');

  // Count tasks by source
  const sourceCount = Object.keys(sourceFilters).reduce((acc, source) => {
    acc[source] = tasks.filter(t => t.source === source && t.status !== 'Complete' && t.status !== 'Done').length;
    return acc;
  }, {});

  // Toggle source filter
  const toggleSourceFilter = (source) => {
    setSourceFilters(prev => ({ ...prev, [source]: !prev[source] }));
  };

  return (
    <div className="p-6 pb-24 space-y-4">
      <h2 className={cn(THEME.punk.textStyle, "punk-accent-underline text-2xl")}>Today</h2>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button onClick={() => onNavigate('dashboard')} className={cn('p-4 text-left hover:bg-yellow-50 dark:hover:bg-slate-700', THEME.punk.card)}>
          <div className="text-xs opacity-60 uppercase font-bold">Total Tasks</div>
          <div className="text-2xl font-black">{tasks.filter(t => t.status !== 'Complete' && t.status !== 'Done').length}</div>
        </button>
        <button onClick={() => onNavigate('dashboard')} className={cn('p-4 text-left hover:bg-red-50 dark:hover:bg-red-900', THEME.punk.card, 'bg-red-50 dark:bg-red-900')}>
          <div className="text-xs opacity-60 uppercase font-bold">Overdue</div>
          <div className="text-2xl font-black text-red-600">{overdue.length}</div>
        </button>
        <button onClick={() => onNavigate('calendar')} className={cn('p-4 text-left hover:bg-yellow-50 dark:hover:bg-yellow-900', THEME.punk.card, 'bg-yellow-50 dark:bg-yellow-900')}>
          <div className="text-xs opacity-60 uppercase font-bold">Due This Week</div>
          <div className="text-2xl font-black text-yellow-600">{upcoming.length}</div>
        </button>
        <button onClick={() => onNavigate('songs')} className={cn('p-4 text-left hover:bg-blue-50 dark:hover:bg-slate-700', THEME.punk.card)}>
          <div className="text-xs opacity-60 uppercase font-bold">Songs</div>
          <div className="text-2xl font-black">{(data.songs || []).length}</div>
        </button>
      </div>

      {/* Source Filters */}
      <div className={cn('p-4', THEME.punk.card)}>
        <div className="font-bold uppercase mb-3 text-sm">Filter by Source</div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(sourceFilters).map(([source, enabled]) => {
            const badge = getSourceBadge(source);
            const count = sourceCount[source];
            return (
              <button
                key={source}
                onClick={() => toggleSourceFilter(source)}
                className={cn(
                  "px-3 py-2 text-xs font-bold border-2 transition-all flex items-center gap-2",
                  enabled 
                    ? cn(badge.color, "opacity-100") 
                    : "bg-gray-100 dark:bg-slate-700 text-gray-400 border-gray-300 dark:border-slate-600 opacity-50"
                )}
              >
                <Icon name={badge.icon} size={14} />
                <span>{source}</span>
                <span className="px-1.5 py-0.5 bg-black dark:bg-slate-900 text-white rounded-full text-[10px] font-black">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Overdue Tasks */}
      {overdue.length > 0 && (
        <div className={cn('p-4', THEME.punk.card, 'bg-red-50 dark:bg-red-900 border-red-500')}>
          <div className="flex items-center justify-between mb-3">
            <div className="font-bold uppercase text-sm text-red-600 dark:text-red-300 flex items-center gap-2">
              <Icon name="AlertTriangle" size={18} />
              Overdue Tasks ({overdue.length})
            </div>
          </div>
          <div className="space-y-2">
            {overdue.slice(0, 10).map(task => {
              const badge = getSourceBadge(task.source);
              return (
                <div
                  key={task.id}
                  onClick={() => navigateToSource(task)}
                  className={cn(
                    "flex flex-col sm:flex-row sm:items-center gap-2 p-3 cursor-pointer hover:bg-red-100 dark:hover:bg-red-800 transition-colors border-2",
                    isDark ? "bg-slate-800 border-red-700" : "bg-white border-red-300"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">{task.title}</div>
                    <div className="text-xs opacity-60 truncate">{task.sourceName}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn("px-2 py-1 text-[10px] font-bold border", badge.color)}>
                      {badge.label}
                    </span>
                    <span className="px-2 py-1 text-[10px] font-bold bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 border border-red-500">
                      {task.date}
                    </span>
                    <span className="px-2 py-1 text-[10px] font-bold bg-gray-200 dark:bg-slate-700 border border-gray-400 dark:border-slate-600">
                      {task.status}
                    </span>
                  </div>
                </div>
              );
            })}
            {overdue.length > 10 && (
              <button 
                onClick={() => onNavigate('dashboard')}
                className={cn("w-full p-2 text-xs font-bold uppercase", THEME.punk.btn, "bg-red-600 text-white")}
              >
                View All {overdue.length} Overdue Tasks
              </button>
            )}
          </div>
        </div>
      )}

      {/* Upcoming Tasks (This Week) */}
      <div className={cn('p-4', THEME.punk.card)}>
        <div className="flex items-center justify-between mb-3">
          <div className="font-bold uppercase text-sm flex items-center gap-2">
            <Icon name="Calendar" size={18} />
            Due This Week ({upcoming.length})
          </div>
          {allUpcoming.length > upcoming.length && (
            <button 
              onClick={() => onNavigate('calendar')}
              className={cn("px-3 py-1 text-xs", THEME.punk.btn)}
            >
              View All
            </button>
          )}
        </div>
        <div className="space-y-2">
          {upcoming.length === 0 ? (
            <div className="text-sm opacity-60 py-4 text-center">No tasks due this week! 🎉</div>
          ) : (
            upcoming.slice(0, 10).map(task => {
              const badge = getSourceBadge(task.source);
              const isToday = task.date === today;
              return (
                <div
                  key={task.id}
                  onClick={() => navigateToSource(task)}
                  className={cn(
                    "flex flex-col sm:flex-row sm:items-center gap-2 p-3 cursor-pointer transition-colors border-2",
                    isDark 
                      ? "bg-slate-800 border-slate-600 hover:bg-slate-700" 
                      : "bg-white border-gray-300 hover:bg-gray-50",
                    isToday && "bg-yellow-50 dark:bg-yellow-900 border-yellow-500"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">{task.title}</div>
                    <div className="text-xs opacity-60 truncate">{task.sourceName}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn("px-2 py-1 text-[10px] font-bold border", badge.color)}>
                      {badge.label}
                    </span>
                    <span className={cn(
                      "px-2 py-1 text-[10px] font-bold border",
                      isToday 
                        ? "bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 border-yellow-500"
                        : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-500"
                    )}>
                      {isToday ? '📍 TODAY' : task.date}
                    </span>
                    <span className="px-2 py-1 text-[10px] font-bold bg-gray-200 dark:bg-slate-700 border border-gray-400 dark:border-slate-600">
                      {task.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button onClick={() => onNavigate('songs')} className={cn('p-3 text-center', THEME.punk.btn, 'flex flex-col items-center gap-2')}>
          <Icon name="Plus" size={20} />
          <span className="text-xs">New Song</span>
        </button>
        <button onClick={() => onNavigate('releases')} className={cn('p-3 text-center', THEME.punk.btn, 'flex flex-col items-center gap-2')}>
          <Icon name="Plus" size={20} />
          <span className="text-xs">New Release</span>
        </button>
        <button onClick={() => onNavigate('events')} className={cn('p-3 text-center', THEME.punk.btn, 'flex flex-col items-center gap-2')}>
          <Icon name="Plus" size={20} />
          <span className="text-xs">New Event</span>
        </button>
        <button onClick={() => onNavigate('globalTasks')} className={cn('p-3 text-center', THEME.punk.btn, 'flex flex-col items-center gap-2')}>
          <Icon name="Plus" size={20} />
          <span className="text-xs">New Task</span>
        </button>
      </div>
    </div>
  );
};

function AppInner() {
  const [tab, setTab] = useState('songs');
  const [editing, setEditing] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [selectedRelease, setSelectedRelease] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedGlobalTask, setSelectedGlobalTask] = useState(null);
  const { data, actions } = useStore();
  const { showToast } = useToast();
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  const settings = data.settings || {};
  const isDark = settings.themeMode === 'dark';
  const focusMode = settings.focusMode || false;
  const accent = COLOR_VALUES[settings.themeColor || 'pink'] || COLOR_VALUES.pink;

  // React Router navigation hook (replaces hash-based routing)
  const routerNavigate = useRouteSync(
    setTab,
    setSelectedSong,
    setSelectedRelease,
    setSelectedEvent,
    setSelectedExpense,
    setSelectedVideo,
    setSelectedGlobalTask
  );

  // Feature 4: Era Mode state
  const eraModeActive = settings.eraModeActive && settings.eraModeEraId;
  const eraModeEra = eraModeActive ? (data.eras || []).find(e => e.id === settings.eraModeEraId) : null;
  const onboardingDismissed = settings.onboardingDismissed || false;
  const isManagerMode = settings.appMode === 'manager';

  const onboardingSteps = [
    { key: 'settings', label: 'Set project name and artist info', done: Boolean(settings.artistName && settings.albumTitle), action: () => routerNavigate('/settings') },
    ...(isManagerMode ? [{ key: 'artist', label: 'Add your first artist in Manager Mode', done: (data.artists || []).length > 0, action: () => routerNavigate('/settings') }] : []),
    { key: 'song', label: 'Create your first song', done: (data.songs || []).length > 0, action: () => routerNavigate('/songs') },
    { key: 'release', label: 'Create your first release', done: (data.releases || []).length > 0, action: () => routerNavigate('/releases') },
  ];
  const onboardingComplete = onboardingSteps.every(step => step.done);

  // Phase 10: Apply dark class to html element for Tailwind dark mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  
  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setCommandOpen(prev => !prev);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const showCreatedToast = (type, entity) => {
    const openMap = { song: () => handleSelectSong(entity), release: () => handleSelectRelease(entity), event: () => handleSelectEvent(entity), expense: () => handleSelectExpense(entity), task: () => handleSelectGlobalTask(entity) };
    showToast(`${type} created`, {
      type: 'success',
      action: {
        label: 'Open details',
        onClick: () => openMap[type]?.()
      }
    });
  };
// Handle song selection
  const handleSelectSong = (song) => {
    setSelectedSong(song);
    setTab('songDetail');
    routerNavigate(`/songs/${song.id}`);
  };

  // Handle release selection
  const handleSelectRelease = (release) => {
    setSelectedRelease(release);
    setTab('releaseDetail');
    routerNavigate(`/releases/${release.id}`);
  };

  // Handle event selection
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setTab('eventDetail');
    routerNavigate(`/events/${event.id}`);
  };

  // Handle expense selection
  const handleSelectExpense = (expense) => {
    setSelectedExpense(expense);
    setTab('expenseDetail');
    routerNavigate(`/expenses/${expense.id}`);
  };

  // Handle video selection - Following unified Item/Page architecture
  const handleSelectVideo = (video) => {
    setSelectedVideo(video);
    setTab('videoDetail');
    routerNavigate(`/videos/${video.id}`);
  };

  // Handle global task selection - Following unified Item/Page architecture
  const handleSelectGlobalTask = (task) => {
    setSelectedGlobalTask(task);
    setTab('globalTaskDetail');
    routerNavigate(`/tasks/${task.id}`);
  };

  const commandItems = [
    { label: 'Go to Today', action: () => routerNavigate('/today') },
    { label: 'Go to Songs', action: () => routerNavigate('/songs') },
    { label: 'Go to Releases', action: () => routerNavigate('/releases') },
    { label: 'Go to Events', action: () => routerNavigate('/events') },
    { label: 'Go to Timeline', action: () => routerNavigate('/timeline') },
    { label: 'Create Song', action: async () => { const song = await actions.addSong({ title: 'New Song' }); handleSelectSong(song); } },
    { label: 'Create Release', action: async () => { const release = await actions.addRelease({ name: 'New Release', type: 'Single' }); handleSelectRelease(release); } },
    { label: 'Create Task', action: async () => { const task = await actions.addGlobalTask({ taskName: 'New Task', status: 'Not Started', category: 'Other' }); handleSelectGlobalTask(task); } },
  ].filter(item => item.label.toLowerCase().includes(commandQuery.toLowerCase()));

  return (
    <div
      style={{
        '--accent': accent.base,
        '--accent-strong': accent.strong,
        '--accent-soft': accent.soft,
      }}
      data-focus-mode={focusMode ? 'true' : undefined}
      className={cn(
        "flex h-screen overflow-hidden",
        focusMode ? "font-sans" : cn("punk-shell", THEME.punk.font),
        isDark ? "bg-slate-900 text-slate-50" : "bg-slate-50 text-slate-900"
      )}
    >
      {/* Sidebar - hidden in focus mode */}
      {!focusMode && (
        <Sidebar
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          activeTab={tab}
          setActiveTab={(t) => { 
            setTab(t); 
            setSelectedSong(null); 
            setSelectedRelease(null); 
            setSelectedEvent(null); 
            setSelectedExpense(null); 
            setSelectedVideo(null); 
            setSelectedGlobalTask(null);
            
            // Map tab names to routes
            const tabToPath = {
              'today': '/today',
              'dashboard': '/dashboard',
              'songs': '/songs',
              'releases': '/releases',
              'videos': '/videos',
              'events': '/events',
              'globalTasks': '/tasks',
              'expenses': '/expenses',
              'calendar': '/calendar',
              'timeline': '/timeline',
              'financials': '/financials',
              'progress': '/progress',
              'team': '/team',
              'gallery': '/gallery',
              'files': '/files',
              'settings': '/settings',
              'archive': '/archive',
              'active': '/active',
            };
            const path = tabToPath[t];
            if (path) routerNavigate(path);
          }}
        />
      )}

      <main
        className={cn(
          "flex-1 flex flex-col min-w-0 relative transition-all duration-200",
          focusMode ? "ml-0" : "ml-0 md:ml-64",
          focusMode ? "" : "punk-canvas",
          isDark ? "text-slate-50" : "text-slate-900"
        )}
      >
        {/* Header with Focus Mode Toggle and Mobile Menu */}
        <div className={cn(
          "fixed top-0 right-0 z-30 p-4 flex items-center gap-2",
          focusMode ? "left-0" : "left-0 md:left-64"
        )}>
          {/* Mobile Menu Button - only when not in focus mode */}
          {!focusMode && !sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className={cn(
                "md:hidden p-2 shadow-lg",
                focusMode ? "border" : "border-4",
                isDark ? "bg-slate-800 text-slate-50 border-slate-600" : "bg-white text-slate-900 border-black"
              )}
            >
              <Icon name="Menu" />
            </button>
          )}
          
          {/* Spacer to push focus mode toggle to the right */}
          <div className="flex-1" />

          {/* Manager Mode Artist Selector */}
          {data.settings?.appMode === 'manager' && (
            <div className="hidden md:block">
              <select
                value={data.settings?.selectedArtistId || 'all'}
                onChange={(e) => actions.saveSettings({ selectedArtistId: e.target.value === 'all' ? '' : e.target.value })}
                className={cn(
                  "px-3 py-2 font-bold uppercase text-xs transition-transform hover:-translate-y-0.5 border-[3px] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.85)]",
                  isDark ? "bg-slate-800 text-slate-50 border-slate-600" : "bg-white text-slate-900 border-black"
                )}
              >
                <option value="all">All Artists</option>
                {(data.artists || []).map(artist => (
                  <option key={artist.id} value={artist.id}>{artist.name}</option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={() => setCommandOpen(true)}
            title="Quick actions"
            className={cn(
              "p-2 flex items-center gap-2 font-bold uppercase text-xs transition-transform hover:-translate-y-0.5 border-[3px] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.85)]",
              isDark ? "bg-slate-800 text-slate-50 border-slate-600" : "bg-white text-slate-900 border-black"
            )}
          >
            <Icon name="Search" size={16} />
            <span className="hidden sm:inline">Quick</span>
          </button>

          {/* Focus Mode Toggle Button */}
          <button
            onClick={() => actions.saveSettings({ focusMode: !focusMode })}
            title={focusMode ? "Exit Focus Mode" : "Enter Focus Mode"}
            className={cn(
              "p-2 flex items-center gap-2 font-bold uppercase text-xs transition-transform hover:-translate-y-0.5",
              focusMode ? "border rounded" : "border-[3px]",
              focusMode ? "shadow-sm" : "shadow-[4px_4px_0px_0px_rgba(0,0,0,0.85)]",
              isDark 
                ? "bg-slate-800 text-slate-50 border-slate-600 hover:bg-slate-700" 
                : "bg-white text-slate-900 border-black hover:bg-[var(--accent-soft)]",
              focusMode && "bg-[var(--accent)] text-slate-900"
            )}
          >
            <Icon name={focusMode ? "EyeOff" : "Eye"} size={18} />
            <span className="hidden sm:inline">{focusMode ? "Exit Focus" : "Focus"}</span>
          </button>
        </div>

        {/* Feature 4: Era Mode Indicator Banner */}
        {eraModeActive && eraModeEra && (
          <div className={cn(
            "fixed top-14 right-0 z-20 px-4 py-2 flex items-center justify-between gap-4",
            focusMode ? "left-0 border-b" : "left-0 md:left-64 border-b-4",
            focusMode 
              ? "bg-yellow-300 border-yellow-500 text-black"
              : "bg-yellow-400 border-black text-black"
          )}>
            <div className="flex items-center gap-2 font-bold text-sm">
              <span>🎯 ERA MODE:</span>
              <span style={{ color: eraModeEra.color || '#000' }}>{eraModeEra.name}</span>
            </div>
            <button 
              onClick={() => actions.saveSettings({ eraModeActive: false })}
              className={cn(
                "px-3 py-1 text-xs font-bold",
                focusMode 
                  ? "bg-gray-800 text-white rounded hover:bg-gray-700"
                  : "bg-black text-white hover:bg-gray-800"
              )}
            >
              Exit Era Mode
            </button>
          </div>
        )}

        <div className={cn(
          "flex-1 overflow-y-auto",
          "pt-16", // Always have padding for the header
          eraModeActive && "pt-28" // Extra padding when era mode banner is shown
        )}>
          {/* Launch Checklist - inside scrollable area to avoid overlapping */}
          {!onboardingDismissed && !onboardingComplete && (
            <div className={cn(
              "mx-6 mb-4 mt-2 p-4 relative",
              focusMode ? "border rounded" : "border-4",
              focusMode ? "shadow-sm" : "shadow-[4px_4px_0px_0px_rgba(0,0,0,0.85)]",
              isDark ? "bg-slate-800 border-slate-600" : "bg-white border-black"
            )}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-black uppercase">Welcome to Era Manifesto!</div>
                  <div className="text-xs opacity-70 mt-1">
                    {isManagerMode ? "Let's set up your first artist pipeline" : "Let's get your music project started"}
                  </div>
                </div>
                <button onClick={() => actions.saveSettings({ onboardingDismissed: true })} className="text-xs opacity-70 hover:opacity-100">Dismiss</button>
              </div>
              <div className="grid md:grid-cols-2 gap-2 text-sm">
                {onboardingSteps.map(step => (
                  <button key={step.key} onClick={step.action} className={cn("text-left px-3 py-2 border-2", step.done ? "bg-green-100 border-green-500" : "bg-yellow-50 border-black")}>
                    {step.done ? '✅' : '⬜'} {step.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Songs - Following unified Item/Page architecture */}
          {tab === 'songs' && <SongListView onSelectSong={handleSelectSong} onSongCreated={(song) => showCreatedToast('song', song)} />}
          {tab === 'songDetail' && selectedSong && <SongDetailView song={selectedSong} onBack={() => { setSelectedSong(null); setTab('songs'); routerNavigate('/songs'); }} />}
          
          {/* Videos - Following unified Item/Page architecture */}
          {tab === 'videos' && <VideosListView onSelectVideo={handleSelectVideo} />}
          {tab === 'videoDetail' && selectedVideo && <VideoDetailView video={selectedVideo} onBack={() => { setSelectedVideo(null); setTab('videos'); routerNavigate('/videos'); }} />}
          
          {/* Global Tasks - Following unified Item/Page architecture */}
          {tab === 'globalTasks' && <GlobalTasksListView onSelectTask={handleSelectGlobalTask} onTaskCreated={(task) => showCreatedToast('task', task)} />}
          {tab === 'globalTaskDetail' && selectedGlobalTask && <GlobalTaskDetailView task={selectedGlobalTask} onBack={() => { setSelectedGlobalTask(null); setTab('globalTasks'); routerNavigate('/tasks'); }} />}
          
          {/* Releases - Following unified Item/Page architecture */}
          {tab === 'releases' && <ReleasesListView onSelectRelease={handleSelectRelease} onReleaseCreated={(release) => showCreatedToast('release', release)} />}
          {tab === 'releaseDetail' && selectedRelease && <ReleaseDetailView release={selectedRelease} onBack={() => { setSelectedRelease(null); setTab('releases'); routerNavigate('/releases'); }} onSelectSong={handleSelectSong} />}
          
          {tab === 'timeline' && <CombinedTimelineView />}
          
          {/* Events - Following unified Item/Page architecture */}
          {tab === 'events' && <EventsListView onSelectEvent={handleSelectEvent} onEventCreated={(event) => showCreatedToast('event', event)} />}
          {tab === 'eventDetail' && selectedEvent && <EventDetailView event={selectedEvent} onBack={() => { setSelectedEvent(null); setTab('events'); routerNavigate('/events'); }} />}
          
          {/* Expenses - Following unified Item/Page architecture */}
          {tab === 'expenses' && <ExpensesListView onSelectExpense={handleSelectExpense} onExpenseCreated={(expense) => showCreatedToast('expense', expense)} />}
          {tab === 'expenseDetail' && selectedExpense && <ExpenseDetailView expense={selectedExpense} onBack={() => { setSelectedExpense(null); setTab('expenses'); routerNavigate('/expenses'); }} />}
          
          {tab === 'today' && <TodayView onNavigate={(path) => {
            const tabToPath = {
              'globalTasks': '/tasks',
              'calendar': '/calendar',
              'dashboard': '/dashboard',
            };
            routerNavigate(tabToPath[path] || `/${path}`);
          }} />}

          {/* Task Dashboard - replaces confusing Plan view */}
          {tab === 'dashboard' && <TaskDashboardView />}
          
          {/* Financial and Progress Views */}
          {tab === 'financials' && <FinancialsView />}
          {tab === 'progress' && <ProgressView />}
          
          {/* Original Views */}
          {tab === 'list' && <ListView onEdit={setEditing} />}
          {tab === 'calendar' && <CalendarView onEdit={setEditing} onSelectEvent={handleSelectEvent} />}
          {tab === 'gallery' && <GalleryView />}
          {tab === 'files' && <FilesView />}
          {tab === 'team' && <TeamView />}
          {tab === 'misc' && <MiscView />}
          {tab === 'archive' && <ArchiveView />}
          {tab === 'active' && <ActiveView onEdit={setEditing} />}
          {tab === 'settings' && <SettingsView />}
        </div>

        <Editor task={editing} onClose={() => setEditing(null)} />
      </main>

      {/* Floating Action Button for mobile quick actions */}
      <FloatingActionButton />

      {/* Focus Mode Styles - simplify UI when focus mode is active */}
      {focusMode && (
        <style>{`
          /* Reduce border widths from 4px/3px to 1px in focus mode */
          [data-focus-mode="true"] .border-4,
          [data-focus-mode="true"] .border-\\[4px\\],
          [data-focus-mode="true"] .border-\\[3px\\] {
            border-width: 1px !important;
          }
          
          /* Reduce shadows in focus mode */
          [data-focus-mode="true"] .shadow-\\[4px_4px_0px_0px_rgba\\(0\\,0\\,0\\,0\\.85\\)\\],
          [data-focus-mode="true"] .shadow-\\[6px_6px_0px_0px_rgba\\(0\\,0\\,0\\,0\\.85\\)\\] {
            box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
          }
          
          /* Remove punk textures in focus mode */
          [data-focus-mode="true"] .punk-shell::before,
          [data-focus-mode="true"] .punk-shell::after,
          [data-focus-mode="true"] .punk-canvas::before,
          [data-focus-mode="true"] .punk-canvas::after {
            display: none !important;
          }
        `}</style>
      )}
      
      {commandOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-24 px-4" onClick={() => setCommandOpen(false)}>
          <div className={cn("w-full max-w-2xl p-4", THEME.punk.card, isDark ? 'bg-slate-800' : 'bg-white')} onClick={e => e.stopPropagation()}>
            <input
              value={commandQuery}
              onChange={e => setCommandQuery(e.target.value)}
              placeholder="Jump to view or run action..."
              className={cn('w-full mb-3', THEME.punk.input)}
              autoFocus
            />
            <div className="max-h-80 overflow-y-auto space-y-2">
              {commandItems.map(item => (
                <button
                  key={item.label}
                  onClick={async () => { await item.action(); setCommandOpen(false); setCommandQuery(''); }}
                  className="w-full text-left px-3 py-2 border-2 border-black hover:bg-yellow-50 font-bold text-sm"
                >
                  {item.label}
                </button>
              ))}
              {commandItems.length === 0 && <div className="text-sm opacity-60">No matching actions.</div>}
            </div>
          </div>
        </div>
      )}

      {/* Toast notification container */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* All routes point to AppInner - routing is managed internally */}
            <Route path="/" element={<AppInner />} />
            <Route path="/today" element={<AppInner />} />
            <Route path="/dashboard" element={<AppInner />} />
            <Route path="/songs" element={<AppInner />} />
            <Route path="/songs/:songId" element={<AppInner />} />
            <Route path="/releases" element={<AppInner />} />
            <Route path="/releases/:releaseId" element={<AppInner />} />
            <Route path="/videos" element={<AppInner />} />
            <Route path="/videos/:videoId" element={<AppInner />} />
            <Route path="/events" element={<AppInner />} />
            <Route path="/events/:eventId" element={<AppInner />} />
            <Route path="/tasks" element={<AppInner />} />
            <Route path="/tasks/:taskId" element={<AppInner />} />
            <Route path="/expenses" element={<AppInner />} />
            <Route path="/expenses/:expenseId" element={<AppInner />} />
            <Route path="/calendar" element={<AppInner />} />
            <Route path="/timeline" element={<AppInner />} />
            <Route path="/financials" element={<AppInner />} />
            <Route path="/progress" element={<AppInner />} />
            <Route path="/team" element={<AppInner />} />
            <Route path="/gallery" element={<AppInner />} />
            <Route path="/files" element={<AppInner />} />
            <Route path="/settings" element={<AppInner />} />
            <Route path="/archive" element={<AppInner />} />
            <Route path="/active" element={<AppInner />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </StoreProvider>
  );
}
