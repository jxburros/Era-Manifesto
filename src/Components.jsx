/*
 * Copyright 2026 Jeffrey Guntly (JX Holdings, LLC)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useState, useEffect, memo, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Music, List, Zap, Image, Users, Receipt, Calendar, PieChart, Archive, Settings, Menu, X, ChevronDown, ChevronRight, Plus, Split, Folder, Circle, PlayCircle, Activity, CheckCircle, Trash2, Camera, Download, Copy, Upload, DollarSign, TrendingUp, File, FileText, Video, FileSpreadsheet, AlertTriangle, AlertCircle, Eye, EyeOff, Layout, ChevronLeft, Star, Heart, Moon, Sun, Crown, Sparkles, Flame, Music2, Disc, Mic, Headphones, Radio, Guitar, Piano, Drum, Lock, Search } from 'lucide-react';
import { useStore, STATUS_OPTIONS, getEffectiveCost } from './Store';
import { THEME, COLORS, formatMoney, STAGES, cn, saveScrollPosition, getScrollPosition } from './utils';

/**
 * Custom hook for scroll position persistence
 * Automatically saves and restores scroll position for a specific key/route
 * 
 * @param {string} scrollKey - Unique identifier for this scroll position
 * @param {Object} containerRef - Optional ref to the scrollable container (defaults to window)
 * @returns {Object} - Returns the containerRef to attach to scrollable element
 */
export const useScrollPersistence = (scrollKey, containerRef = null) => {
  const location = useLocation();
  const internalRef = useRef(null);
  const ref = containerRef || internalRef;

  // Restore scroll position on mount
  useEffect(() => {
    const savedPosition = getScrollPosition(scrollKey);
    if (savedPosition && ref.current) {
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        if (ref.current) {
          ref.current.scrollTop = savedPosition;
        }
      }, 0);
    } else if (savedPosition && !ref.current) {
      // If no container ref, scroll window
      window.scrollTo(0, savedPosition);
    }
  }, [scrollKey, ref]);

  // Save scroll position before unmount or route change
  useEffect(() => {
    const savePosition = () => {
      const position = ref.current ? ref.current.scrollTop : window.scrollY;
      saveScrollPosition(scrollKey, position);
    };

    // Save on route change
    return () => {
      savePosition();
    };
  }, [scrollKey, location, ref]);

  // Return the ref so it can be attached to the scrollable container
  return containerRef ? {} : { ref: internalRef };
};

export const Icon = memo(function Icon({ name, ...props }) {
  const icons = { Music, List, Zap, Image, Users, Receipt, Calendar, PieChart, Archive, Settings, Menu, X, ChevronDown, ChevronRight, Plus, Split, Folder, Circle, PlayCircle, Activity, CheckCircle, Trash2, Camera, Download, Copy, Upload, DollarSign, TrendingUp, File, FileText, Video, FileSpreadsheet, AlertTriangle, AlertCircle, Eye, EyeOff, Layout, ChevronLeft, Star, Heart, Moon, Sun, Crown, Sparkles, Flame, Music2, Disc, Mic, Headphones, Radio, Guitar, Piano, Drum, Lock, Search };
  const I = icons[name] || Circle;
  return <I {...props} />;
});

Icon.displayName = 'Icon';

export const Sidebar = ({ isOpen, setIsOpen, activeTab, setActiveTab }) => {
  const { data } = useStore();
  const settings = data.settings || {};
  const colorClass = COLORS[settings.themeColor || 'pink'].split(' ')[2];
  const isDark = settings.themeMode === 'dark';
  const [viewsExpanded, setViewsExpanded] = useState(false);
  const [contentExpanded, setContentExpanded] = useState(true);
  const [uploadsExpanded, setUploadsExpanded] = useState(false);

  // Map tab IDs to React Router paths
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

  // Top buttons (side-by-side)
  const topButtons = [
    { id: 'today', label: 'Today', icon: 'Zap' },
    { id: 'dashboard', label: 'Dashboard', icon: 'PieChart' },
    { id: 'calendar', label: 'Calendar', icon: 'Calendar' },
  ];

  // Content sub-items (Songs, Releases, Videos)
  const contentMenu = [
    { id: 'songs', label: 'Songs', icon: 'Music' },
    { id: 'releases', label: 'Releases', icon: 'Download' },
    { id: 'videos', label: 'Videos', icon: 'PlayCircle' },
  ];

  // Uploads sub-items (Photos, Files)
  const uploadsMenu = [
    { id: 'gallery', label: 'Photos', icon: 'Image' },
    { id: 'files', label: 'Files', icon: 'File' },
  ];

  // Main sections (standalone items)
  const mainMenu = [
    { id: 'events', label: 'Events', icon: 'Calendar' },
    { id: 'globalTasks', label: 'Global Tasks', icon: 'Activity' },
    { id: 'expenses', label: 'Expenses', icon: 'Receipt' },
    { id: 'team', label: 'Team', icon: 'Users' },
  ];

  // Views sub-items
  const viewsMenu = [
    { id: 'financials', label: 'Financials', icon: 'DollarSign' },
    { id: 'progress', label: 'Progress', icon: 'TrendingUp' },
    { id: 'timeline', label: 'Timeline', icon: 'List' },
    { id: 'active', label: 'Active Tasks', icon: 'Zap' },
  ];

  // Footer items
  const footerMenu = [
    { id: 'archive', label: 'Trash', icon: 'Trash2' },
    { id: 'settings', label: 'Settings', icon: 'Settings' },
  ];

  const isViewsActive = viewsMenu.some(v => v.id === activeTab);
  const isContentActive = contentMenu.some(v => v.id === activeTab);
  const isUploadsActive = uploadsMenu.some(v => v.id === activeTab);

  const MenuButton = ({ item, compact = false }) => (
    <Link
      to={tabToPath[item.id] || `/${item.id}`}
      onClick={() => { setActiveTab(item.id); setIsOpen(false); }}
      className={cn(
        "w-full flex items-center gap-3 px-4 text-left font-bold uppercase tracking-wide border-[3px] transition-transform hover:-translate-y-0.5 no-underline",
        compact ? "py-2 text-sm" : "py-2",
        isDark ? "border-slate-600" : "border-black",
        activeTab === item.id
          ? "bg-[var(--accent)] text-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.35)]"
          : (isDark ? "bg-slate-700 text-slate-200 hover:bg-slate-600" : "bg-white hover:bg-[var(--accent-soft)]")
      )}
    >
      <Icon name={item.icon} size={compact ? 14 : 18} /> {item.label}
    </Link>
  );

  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200 flex flex-col punk-panel",
      isDark ? "text-slate-50" : "text-slate-900",
      isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
    )}>
      {/* Logo Header */}
      <div className={cn(
        "p-6 border-b-[3px] flex justify-between items-center",
        isDark ? "bg-slate-900 border-slate-600" : "bg-gray-50 border-black"
      )}>
        <div>
          <Link to="/dashboard" className="no-underline">
            <h1 className={cn("text-xl flex items-center gap-2 punk-accent-underline font-rubik-distressed cursor-pointer", colorClass)}><Icon name="Music" /> Era Manifesto</h1>
          </Link>
          <div className={cn("text-xs font-bold mt-1", isDark ? "text-slate-400" : "opacity-60")}>{settings.artistName || 'Artist'}</div>
          <div className={cn("text-[10px] mt-1", isDark ? "text-slate-500" : "opacity-50")}>⌘/Ctrl+K for quick actions</div>
        </div>
        <button onClick={() => setIsOpen(false)} className={cn("md:hidden", isDark && "text-slate-50")}><Icon name="X" /></button>
      </div>

      {/* Top Buttons (Dashboard + Calendar side-by-side) */}
      <div className="p-4 pb-2">
        <div className="grid grid-cols-3 gap-2">
          {topButtons.map(item => (
            <Link
              key={item.id}
              to={tabToPath[item.id] || `/${item.id}`}
              onClick={() => { setActiveTab(item.id); setIsOpen(false); }}
              className={cn(
                "flex flex-col items-center justify-center gap-1 p-3 font-bold uppercase tracking-wide border-[3px] transition-transform hover:-translate-y-0.5 text-xs no-underline",
                isDark ? "border-slate-600" : "border-black",
                activeTab === item.id
                  ? "bg-[var(--accent)] text-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.35)]"
                  : (isDark ? "bg-slate-700 text-slate-200 hover:bg-slate-600" : "bg-white hover:bg-[var(--accent-soft)]")
              )}
            >
              <Icon name={item.icon} size={20} />
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 pb-4 space-y-2 overflow-y-auto">
        {/* Content Expandable Section */}
        <div>
          <button
            onClick={() => setContentExpanded(!contentExpanded)}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 text-left font-bold uppercase tracking-wide border-[3px] transition-transform hover:-translate-y-0.5",
              isDark ? "border-slate-600" : "border-black",
              isContentActive
                ? "bg-[var(--accent)] text-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.35)]"
                : (isDark ? "bg-slate-700 text-slate-200 hover:bg-slate-600" : "bg-white hover:bg-[var(--accent-soft)]")
            )}
          >
            <span className="flex items-center gap-3">
              <Icon name="Package" size={18} /> Content
            </span>
            <Icon name={contentExpanded ? "ChevronDown" : "ChevronRight"} size={16} />
          </button>

          {/* Content Sub-items */}
          {contentExpanded && (
            <div className={cn(
              "ml-4 mt-2 space-y-2 pl-2 border-l-[3px]",
              isDark ? "border-slate-600" : "border-black"
            )}>
              {contentMenu.map(item => (
                <MenuButton key={item.id} item={item} compact />
              ))}
            </div>
          )}
        </div>

        {/* Uploads Expandable Section */}
        <div>
          <button
            onClick={() => setUploadsExpanded(!uploadsExpanded)}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 text-left font-bold uppercase tracking-wide border-[3px] transition-transform hover:-translate-y-0.5",
              isDark ? "border-slate-600" : "border-black",
              isUploadsActive
                ? "bg-[var(--accent)] text-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.35)]"
                : (isDark ? "bg-slate-700 text-slate-200 hover:bg-slate-600" : "bg-white hover:bg-[var(--accent-soft)]")
            )}
          >
            <span className="flex items-center gap-3">
              <Icon name="Upload" size={18} /> Uploads
            </span>
            <Icon name={uploadsExpanded ? "ChevronDown" : "ChevronRight"} size={16} />
          </button>

          {/* Uploads Sub-items */}
          {uploadsExpanded && (
            <div className={cn(
              "ml-4 mt-2 space-y-2 pl-2 border-l-[3px]",
              isDark ? "border-slate-600" : "border-black"
            )}>
              {uploadsMenu.map(item => (
                <MenuButton key={item.id} item={item} compact />
              ))}
            </div>
          )}
        </div>

        {/* Main Menu Items */}
        {mainMenu.map(item => (
          <MenuButton key={item.id} item={item} />
        ))}

        {/* Views Expandable Section */}
        <div className="pt-2">
          <button
            onClick={() => setViewsExpanded(!viewsExpanded)}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 text-left font-bold uppercase tracking-wide border-[3px] transition-transform hover:-translate-y-0.5",
              isDark ? "border-slate-600" : "border-black",
              isViewsActive
                ? "bg-[var(--accent)] text-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.35)]"
                : (isDark ? "bg-slate-700 text-slate-200 hover:bg-slate-600" : "bg-white hover:bg-[var(--accent-soft)]")
            )}
          >
            <span className="flex items-center gap-3">
              <Icon name="Folder" size={18} /> Views
            </span>
            <Icon name={viewsExpanded ? "ChevronDown" : "ChevronRight"} size={16} />
          </button>

          {/* Views Sub-items */}
          {viewsExpanded && (
            <div className={cn(
              "ml-4 mt-2 space-y-2 pl-2 border-l-[3px]",
              isDark ? "border-slate-600" : "border-black"
            )}>
              {viewsMenu.map(item => (
                <MenuButton key={item.id} item={item} compact />
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Footer Items */}
      <div className="p-4 pt-2">
        <div className="grid grid-cols-3 gap-2">
          {footerMenu.map(item => (
            <Link
              key={item.id}
              to={tabToPath[item.id] || `/${item.id}`}
              onClick={() => { setActiveTab(item.id); setIsOpen(false); }}
              className={cn(
                "flex flex-col items-center justify-center gap-1 p-3 font-bold uppercase tracking-wide border-[3px] transition-transform hover:-translate-y-0.5 text-xs no-underline",
                isDark ? "border-slate-600" : "border-black",
                activeTab === item.id
                  ? "bg-[var(--accent)] text-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.35)]"
                  : (isDark ? "bg-slate-700 text-slate-200 hover:bg-slate-600" : "bg-white hover:bg-[var(--accent-soft)]")
              )}
            >
              <Icon name={item.icon} size={20} />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Editor = ({ task, onClose }) => {
    const { actions, data } = useStore();
    const [form, setForm] = useState(task ? {...task} : {});
    const [tab, setTab] = useState('details');
    const [sub, setSub] = useState('');

    const addSubTask = () => {
        const cleanedSubTask = sub.trim();
        if (!cleanedSubTask) return;
        actions.add('tasks', { title: cleanedSubTask, parentId: form.id, status: 'Not Started' });
        setSub('');
    };
    const artistName = data.settings?.artistName || 'Artist';

    useEffect(() => {
        if (task) setForm({...task});
    }, [task]);

    if (!task) return null;

    const save = async () => {
        // eslint-disable-next-line no-unused-vars
        const { children, ...clean } = form;
        ['estimatedCost', 'quotedCost', 'actualCost'].forEach(k => { if (isNaN(clean[k])) clean[k] = 0; });
        await actions.update('tasks', form.id, clean);
        onClose();
    };

    const handleUpload = (e) => {
       const file = e.target.files[0];
       if (!file) return;
       const reader = new FileReader();
       reader.onload = (ev) => {
           actions.add('photos', { taskId: form.id, data: ev.target.result, name: file.name });
       };
       reader.readAsDataURL(file);
    };

    const photos = (data.photos || []).filter(p => p.taskId === form.id);

    return (
        <div className={cn("fixed inset-y-0 right-0 w-full md:w-[500px] bg-white z-50 shadow-2xl flex flex-col", THEME.punk.font, "border-l-4 border-black")}>
            <div className="p-4 border-b-4 border-black flex justify-between bg-gray-100">
                <span className="font-bold uppercase">Edit {form.isCategory ? 'Category' : 'Task'}</span>
                <div className="flex gap-2">
                    <button onClick={() => { actions.archiveItem('tasks', form.id, 'Editor archive'); onClose(); }} className="p-2 hover:bg-red-100 text-red-500"><Icon name="Trash2"/></button>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200"><Icon name="X"/></button>
                </div>
            </div>
            <div className="flex border-b-4 border-black">
                {['details', 'finance', 'photos'].map(t => (
                    <button key={t} onClick={() => setTab(t)} className={cn("flex-1 py-3 uppercase font-bold", tab === t ? "bg-black text-white" : "hover:bg-gray-100")}>{t}</button>
                ))}
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {tab === 'details' && (
                    <>
                       {!form.isCategory && (
                          <div className={cn("p-4 bg-gray-50 flex gap-2", THEME.punk.card)}>
                             {Object.entries(STAGES).map(([k, v]) => (
                                <button key={k} onClick={() => setForm({...form, status: k})} className={cn("flex-1 py-2 text-[10px] font-bold uppercase border-2 border-black", form.status === k ? "bg-black text-white" : "bg-white")}>{v.label}</button>
                             ))}
                          </div>
                       )}
                        <input value={form.title || ''} onChange={e => setForm({...form, title: e.target.value})} className={cn("w-full", THEME.punk.input)} placeholder="TITLE" />
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="text-xs font-bold opacity-50">Checklist</label><select value={form.checklistState || ''} onChange={e => setForm({...form, checklistState: e.target.value})} className={cn("w-full", THEME.punk.input)}>{['', 'Complete', 'Paid', 'Complete but unpaid', 'Paid but incomplete', 'Archived'].map(s => <option key={s} value={s}>{s || 'Select state'}</option>)}</select></div>
                            <div><label className="text-xs font-bold opacity-50">Stage</label><select value={form.stageId || ''} onChange={e => setForm({...form, stageId: e.target.value})} className={cn("w-full", THEME.punk.input)}>{data.stages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
                            <div><label className="text-xs font-bold opacity-50">Due</label><input type="date" value={form.dueDate || ''} onChange={e => setForm({...form, dueDate: e.target.value})} className={cn("w-full", THEME.punk.input)} /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-bold opacity-50">Notes</label>
                            <textarea value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} className={cn("w-full h-20", THEME.punk.input)} placeholder="Context, exclusivity, platform info" />
                          </div>
                          <div className="space-y-2">
                            <div>
                              <label className="text-xs font-bold opacity-50">Exclusivity</label>
                              <input value={form.exclusiveType || ''} onChange={e => setForm({ ...form, exclusiveType: e.target.value })} className={cn("w-full", THEME.punk.input)} placeholder="Platform exclusive, radio-only, etc." />
                            </div>
                            <div>
                              <label className="text-xs font-bold opacity-50">Instruments / Platforms</label>
                              <input value={form.instruments || ''} onChange={e => setForm({ ...form, instruments: e.target.value })} className={cn("w-full", THEME.punk.input)} placeholder="Guitar, synth, TikTok, YouTube" />
                            </div>
                          </div>
                        </div>
                        <button onClick={() => setForm({...form, assignees: Array.from(new Set([...(form.assignees || []), artistName]))})} className={cn("px-3 py-2 text-xs", THEME.punk.btn)}>
                          Assign me ({artistName})
                         </button>
                         <div className="border-t-4 border-black pt-4">
                            <div className="flex gap-2">
                               <input value={sub} onChange={e => setSub(e.target.value)} className={cn("w-full", THEME.punk.input)} placeholder="Quick sub-task..." onKeyDown={e => { if(e.key === 'Enter') { addSubTask(); }}} />
                               <button onClick={addSubTask} disabled={!sub.trim()} className={cn("px-4", THEME.punk.btn, "bg-black text-white", !sub.trim() && "opacity-50 cursor-not-allowed hover:translate-y-0")}>Add</button>
                            </div>
                       </div>
                    </>
                )}
                {tab === 'finance' && (
                    <div className={cn("p-4 space-y-4", THEME.punk.card)}>
                        <div className="grid grid-cols-3 gap-2">
                            {['Estimated', 'Quoted', 'Actual'].map(k => (
                                <div key={k}><label className="text-[10px] font-bold uppercase opacity-50">{k}</label><input type="number" value={form[`${k.toLowerCase()}Cost`] || 0} onChange={e => setForm({...form, [`${k.toLowerCase()}Cost`]: parseFloat(e.target.value) || 0})} className={cn("w-full text-sm", THEME.punk.input)} /></div>
                            ))}
                        </div>
                        <div><label className="text-[10px] font-bold uppercase opacity-50">Vendor</label><select value={form.vendorId || ''} onChange={e => setForm({...form, vendorId: e.target.value})} className={cn("w-full text-sm", THEME.punk.input)}><option value="">--</option>{data.vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}</select></div>
                    </div>
                )}
                {tab === 'photos' && (
                    <div className="space-y-4">
                        <label className="w-full h-24 border-2 border-dashed border-gray-400 flex items-center justify-center cursor-pointer hover:bg-gray-50"><Icon name="Camera" className="opacity-50" /><input type="file" accept="image/*" onChange={handleUpload} className="hidden" /></label>
                        <div className="grid grid-cols-3 gap-2">{photos.map(p => <div key={p.id} className="relative aspect-square"><img src={p.data} className="w-full h-full object-cover border-2 border-black" /><button onClick={() => actions.delete('photos', p.id)} className="absolute top-1 right-1 bg-red-500 text-white p-1"><Icon name="X" size={12} /></button></div>)}</div>
                    </div>
                )}
            </div>
            <div className="p-4 border-t-4 border-black bg-white"><button onClick={save} className={cn("w-full py-3", THEME.punk.btn, "bg-black text-white")}>Save Changes</button></div>
        </div>
    );
};

// Phase 4: Unified Task Editor Component
// Provides consistent task editing interface across songs, versions, videos, releases, global tasks, and events
export const UnifiedTaskEditor = ({ 
    task, 
    onSave, 
    onCancel, 
    onDelete,
    showSourceInfo = false,
    sourceLabel = '',
    sourceName = '',
    teamMembers = []
}) => {
    const [form, setForm] = useState({ ...task });
    const [newAssignment, setNewAssignment] = useState({ memberId: '', cost: 0, instrument: '' });
    const [budgetError, setBudgetError] = useState(false);

    useEffect(() => {
        setForm({ ...task });
    }, [task]);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        if (onSave) onSave(form);
    };

    const addAssignment = () => {
        if (!newAssignment.memberId) return;
        const budget = getEffectiveCost(form);
        const current = (form.assignedMembers || []).reduce((s, m) => s + (parseFloat(m.cost) || 0), 0);
        const nextTotal = current + (parseFloat(newAssignment.cost) || 0);
        if (budget > 0 && nextTotal > budget) {
            setBudgetError(true);
            setTimeout(() => setBudgetError(false), 3000);
            return;
        }
        setBudgetError(false);
        const updatedMembers = [...(form.assignedMembers || []), {
            memberId: newAssignment.memberId,
            cost: parseFloat(newAssignment.cost) || 0,
            instrument: newAssignment.instrument || ''
        }];
        handleChange('assignedMembers', updatedMembers);
        setNewAssignment({ memberId: '', cost: 0, instrument: '' });
    };

    const removeAssignment = (index) => {
        const updatedMembers = (form.assignedMembers || []).filter((_, i) => i !== index);
        handleChange('assignedMembers', updatedMembers);
    };

    const budget = getEffectiveCost(form);
    const allocated = (form.assignedMembers || []).reduce((s, m) => s + (m.cost || 0), 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onCancel}>
            <div className={cn("w-full max-w-lg p-6 bg-white max-h-[90vh] overflow-y-auto", THEME.punk.card)} onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4 border-b-4 border-black pb-2">
                    <h3 className="font-black uppercase">{form.type || form.title || 'Edit Task'}</h3>
                    <button onClick={onCancel} className="p-1 hover:bg-gray-200"><Icon name="X" size={16} /></button>
                </div>

                {showSourceInfo && (
                    <div className="mb-4 p-2 bg-gray-100 border-2 border-black text-xs">
                        <span className="font-bold">{sourceLabel}:</span> {sourceName}
                    </div>
                )}

                <div className="space-y-4">
                    {/* Title/Type */}
                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Task Name</label>
                        <input 
                            value={form.title || form.type || ''} 
                            onChange={e => handleChange(form.title !== undefined ? 'title' : 'type', e.target.value)} 
                            className={cn("w-full", THEME.punk.input)} 
                        />
                    </div>

                    {/* Date and Status */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Due Date</label>
                            <input 
                                type="date" 
                                value={form.date || form.dueDate || ''} 
                                onChange={e => handleChange(form.date !== undefined ? 'date' : 'dueDate', e.target.value)} 
                                className={cn("w-full", THEME.punk.input)} 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Status</label>
                            <select
                                value={form.status || 'Not Started'}
                                onChange={e => handleChange('status', e.target.value)}
                                className={cn("w-full", THEME.punk.input)}
                            >
                                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Cost Layers */}
                    <div className="grid grid-cols-3 gap-2">
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Estimated</label>
                            <input 
                                type="number" 
                                value={form.estimatedCost || 0} 
                                onChange={e => handleChange('estimatedCost', parseFloat(e.target.value) || 0)} 
                                className={cn("w-full text-sm", THEME.punk.input)} 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Quoted</label>
                            <input 
                                type="number" 
                                value={form.quotedCost || 0} 
                                onChange={e => handleChange('quotedCost', parseFloat(e.target.value) || 0)} 
                                className={cn("w-full text-sm", THEME.punk.input)} 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Paid</label>
                            <input 
                                type="number" 
                                value={form.paidCost || 0} 
                                onChange={e => handleChange('paidCost', parseFloat(e.target.value) || 0)} 
                                className={cn("w-full text-sm", THEME.punk.input)} 
                            />
                        </div>
                    </div>

                    {/* Description/Notes */}
                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Notes</label>
                        <textarea 
                            value={form.notes || form.description || ''} 
                            onChange={e => handleChange(form.notes !== undefined ? 'notes' : 'description', e.target.value)} 
                            className={cn("w-full h-20", THEME.punk.input)} 
                            placeholder="Additional details..."
                        />
                    </div>

                    {/* Team Member Assignments */}
                    <div className="border-t-2 border-black pt-4">
                        <label className="block text-xs font-bold uppercase mb-2">Team Assignments</label>
                        {budget > 0 && (
                            <div className="text-xs mb-2 p-2 bg-gray-100 border border-black">
                                Budget: {formatMoney(budget)} | Allocated: {formatMoney(allocated)} | Remaining: {formatMoney(budget - allocated)}
                            </div>
                        )}
                        <div className="flex flex-wrap gap-2 mb-2">
                            {(form.assignedMembers || []).map((m, idx) => {
                                const member = teamMembers.find(tm => tm.id === m.memberId);
                                return (
                                    <span key={idx} className="px-2 py-1 border-2 border-black bg-purple-100 text-xs font-bold flex items-center gap-2">
                                {member?.name || 'Member'} {m.instrument ? `• ${m.instrument}` : ''} ({formatMoney(m.cost)})
                                        <button onClick={() => removeAssignment(idx)} className="text-red-600">×</button>
                                    </span>
                                );
                            })}
                        </div>
                        <div className="flex gap-2 items-center">
                            <select 
                                value={newAssignment.memberId} 
                                onChange={e => setNewAssignment(prev => ({ ...prev, memberId: e.target.value }))} 
                                className={cn("flex-1 text-xs", THEME.punk.input)}
                            >
                                <option value="">Select member...</option>
                                {teamMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                            <input
                                type="number"
                                value={newAssignment.cost || ''}
                                onChange={e => setNewAssignment(prev => ({ ...prev, cost: e.target.value }))} 
                                placeholder="Cost" 
                                className={cn("w-20 text-xs", THEME.punk.input)}
                            />
                            <input
                                value={newAssignment.instrument || ''}
                                onChange={e => setNewAssignment(prev => ({ ...prev, instrument: e.target.value }))}
                                placeholder="Instrument"
                                className={cn("w-32 text-xs", THEME.punk.input)}
                            />
                            <button onClick={addAssignment} className={cn("px-3 py-2 text-xs", THEME.punk.btn, "bg-purple-600 text-white")}>Add</button>
                        </div>
                        {budgetError && (
                            <div className="text-xs text-red-600 font-bold mt-1 p-2 bg-red-50 border border-red-300">
                                ⚠️ Cannot exceed task budget. Reduce the cost amount.
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-6 pt-4 border-t-4 border-black">
                    <button onClick={handleSave} className={cn("flex-1 px-4 py-2", THEME.punk.btn, "bg-green-500 text-white")}>
                        Save Changes
                    </button>
                    {onDelete && (
                        <button onClick={onDelete} className={cn("px-4 py-2", THEME.punk.btn, "bg-red-500 text-white")}>
                            <Icon name="Trash2" size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

/**
 * Breadcrumb Navigation Component
 * Displays a parent-child navigation trail (e.g., Song > Version > Task)
 * 
 * @param {Array} items - Array of breadcrumb items: [{ label: string, onClick?: () => void }]
 * @param {string} separator - Separator character (default: '>')
 */
export const Breadcrumb = ({ items = [], separator = '>' }) => {
    const { data } = useStore();
    const settings = data.settings || {};
    const isDark = settings.themeMode === 'dark';
    const focusMode = settings.focusMode || false;

    if (!items || items.length === 0) return null;

    return (
        <nav className={cn(
            "flex items-center gap-2 text-sm mb-4 pb-3",
            focusMode ? "border-b" : "border-b-2",
            isDark ? "border-slate-700 text-slate-300" : "border-black text-slate-700"
        )}>
            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    {index > 0 && (
                        <span className={cn(
                            "select-none",
                            isDark ? "text-slate-600" : "text-slate-400"
                        )}>{separator}</span>
                    )}
                    {item.onClick ? (
                        <button
                            onClick={item.onClick}
                            className={cn(
                                "transition-colors",
                                focusMode ? "hover:text-[var(--accent)] font-medium" : "hover:text-[var(--accent)] font-bold uppercase",
                                isDark ? "text-slate-300 hover:text-[var(--accent)]" : "text-slate-700 hover:text-[var(--accent)]"
                            )}
                        >
                            {item.label}
                        </button>
                    ) : (
                        <span className={cn(
                            focusMode ? "font-semibold" : "font-bold uppercase",
                            isDark ? "text-slate-50" : "text-black"
                        )}>
                            {item.label}
                        </span>
                    )}
                </div>
            ))}
        </nav>
    );
};

/**
 * QuickAddSongModal Component
 * Simplified song creation modal requiring only name and era
 * Auto-generates tasks based on project template when saved
 * 
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Called when modal is closed
 * @param {function} onSongCreated - Called with the new song after creation
 */
export const QuickAddSongModal = ({ isOpen, onClose, onSongCreated }) => {
    const { data, actions } = useStore();
    const [name, setName] = useState('');
    const [eraId, setEraId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const settings = data.settings || {};
    const isDark = settings.themeMode === 'dark';

    // Set default era when modal opens
    useEffect(() => {
        if (isOpen) {
            // Use Era Mode era, default era, or first available era
            const defaultEra = (settings.eraModeActive && settings.eraModeEraId) 
                ? settings.eraModeEraId 
                : settings.defaultEraId || (data.eras?.[0]?.id || '');
            setEraId(defaultEra);
            setName('');
            setIsSubmitting(false);
        }
    }, [isOpen, settings.eraModeActive, settings.eraModeEraId, settings.defaultEraId, data.eras]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        
        setIsSubmitting(true);
        try {
            // Create song with minimal required fields
            // Tasks will be auto-generated by addSong action based on project template
            const newSong = await actions.addSong({
                title: name.trim(),
                eraIds: eraId ? [eraId] : [],
                // Default values that allow task auto-generation
                category: 'Album',
                releaseDate: '',
                isSingle: false,
                videoType: 'None',
                stemsNeeded: false
            });
            
            if (onSongCreated) onSongCreated(newSong);
            onClose();
        } catch (error) {
            console.error('Error creating song:', error);
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (!isSubmitting) {
            setName('');
            setEraId('');
            onClose();
        }
    };

    const availableEras = data.eras || [];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={handleCancel}>
            <div 
                className={cn(
                    "w-full max-w-md p-6 max-h-[90vh] overflow-y-auto",
                    THEME.punk.card,
                    isDark ? "bg-slate-800" : "bg-white"
                )} 
                onClick={e => e.stopPropagation()}
            >
                <form onSubmit={handleSubmit}>
                    <div className={cn(
                        "flex justify-between items-center mb-6 pb-3 border-b-4",
                        isDark ? "border-slate-600" : "border-black"
                    )}>
                        <h3 className={cn(
                            "font-black uppercase text-lg",
                            isDark ? "text-slate-50" : "text-black"
                        )}>
                            Quick Add Song
                        </h3>
                        <button 
                            type="button"
                            onClick={handleCancel} 
                            disabled={isSubmitting}
                            className={cn(
                                "p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded",
                                isSubmitting && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            <Icon name="X" size={20} />
                        </button>
                    </div>

                    <div className="space-y-4 mb-6">
                        {/* Song Name (Required) */}
                        <div>
                            <label className={cn(
                                "block text-xs font-bold uppercase mb-2",
                                isDark ? "text-slate-300" : "text-black"
                            )}>
                                Song Name <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Enter song name"
                                className={cn("w-full", THEME.punk.input)}
                                autoFocus
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Era (Required) */}
                        <div>
                            <label className={cn(
                                "block text-xs font-bold uppercase mb-2",
                                isDark ? "text-slate-300" : "text-black"
                            )}>
                                Era <span className="text-red-500">*</span>
                            </label>
                            {availableEras.length === 0 ? (
                                <div className={cn(
                                    "p-3 text-xs border-2",
                                    isDark ? "border-slate-600 bg-slate-700 text-slate-300" : "border-yellow-500 bg-yellow-50 text-yellow-800"
                                )}>
                                    <Icon name="AlertTriangle" size={14} className="inline mr-1" />
                                    No eras available. Create an era first in Settings.
                                </div>
                            ) : (
                                <select
                                    value={eraId}
                                    onChange={e => setEraId(e.target.value)}
                                    className={cn("w-full", THEME.punk.input)}
                                    required
                                    disabled={isSubmitting}
                                >
                                    <option value="">Select an era...</option>
                                    {availableEras.map(era => (
                                        <option key={era.id} value={era.id}>
                                            {era.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Info Note */}
                        <div className={cn(
                            "p-3 text-xs border-2",
                            isDark ? "border-slate-600 bg-slate-700 text-slate-300" : "border-blue-500 bg-blue-50 text-blue-800"
                        )}>
                            <Icon name="AlertCircle" size={14} className="inline mr-1" />
                            Tasks will be auto-generated. You can add details and customize later.
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                            className={cn(
                                "flex-1 px-4 py-3",
                                THEME.punk.btn,
                                isDark ? "bg-slate-700 text-slate-200" : "bg-white",
                                isSubmitting && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!name.trim() || !eraId || availableEras.length === 0 || isSubmitting}
                            className={cn(
                                "flex-1 px-4 py-3 font-black",
                                THEME.punk.btn,
                                "bg-green-500 text-white",
                                (!name.trim() || !eraId || availableEras.length === 0 || isSubmitting) && 
                                "opacity-50 cursor-not-allowed hover:translate-y-0"
                            )}
                        >
                            {isSubmitting ? 'Creating...' : 'Create Song'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/**
 * QuickAddReleaseModal Component
 * Simplified release creation modal requiring only name and release date
 * Auto-generates tasks based on release type
 * 
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Called when modal is closed
 * @param {function} onReleaseCreated - Called with the new release after creation
 */
export const QuickAddReleaseModal = ({ isOpen, onClose, onReleaseCreated }) => {
    const { data, actions } = useStore();
    const [name, setName] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [eraId, setEraId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const settings = data.settings || {};
    const isDark = settings.themeMode === 'dark';

    // Set default era when modal opens
    useEffect(() => {
        if (isOpen) {
            // Use Era Mode era, default era, or first available era
            const defaultEra = (settings.eraModeActive && settings.eraModeEraId) 
                ? settings.eraModeEraId 
                : settings.defaultEraId || (data.eras?.[0]?.id || '');
            setEraId(defaultEra);
            setName('');
            setReleaseDate('');
            setIsSubmitting(false);
        }
    }, [isOpen, settings.eraModeActive, settings.eraModeEraId, settings.defaultEraId, data.eras]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !releaseDate) return;
        
        setIsSubmitting(true);
        try {
            // Create release with minimal required fields
            // Tasks will be auto-generated by addRelease action based on release date
            const newRelease = await actions.addRelease({
                name: name.trim(),
                releaseDate: releaseDate,
                eraIds: eraId ? [eraId] : [],
                // Default values
                type: 'Album',
                hasPhysicalCopies: false,
                hasExclusivity: false
            });
            
            if (onReleaseCreated) onReleaseCreated(newRelease);
            onClose();
        } catch (error) {
            console.error('Error creating release:', error);
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (!isSubmitting) {
            setName('');
            setReleaseDate('');
            setEraId('');
            onClose();
        }
    };

    const availableEras = data.eras || [];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={handleCancel}>
            <div 
                className={cn(
                    "w-full max-w-md p-6 max-h-[90vh] overflow-y-auto",
                    THEME.punk.card,
                    isDark ? "bg-slate-800" : "bg-white"
                )} 
                onClick={e => e.stopPropagation()}
            >
                <form onSubmit={handleSubmit}>
                    <div className={cn(
                        "flex justify-between items-center mb-6 pb-3 border-b-4",
                        isDark ? "border-slate-600" : "border-black"
                    )}>
                        <h3 className={cn(
                            "font-black uppercase text-lg",
                            isDark ? "text-slate-50" : "text-black"
                        )}>
                            Quick Add Release
                        </h3>
                        <button 
                            type="button"
                            onClick={handleCancel} 
                            disabled={isSubmitting}
                            className={cn(
                                "p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded",
                                isSubmitting && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            <Icon name="X" size={20} />
                        </button>
                    </div>

                    <div className="space-y-4 mb-6">
                        {/* Release Name (Required) */}
                        <div>
                            <label className={cn(
                                "block text-xs font-bold uppercase mb-2",
                                isDark ? "text-slate-300" : "text-black"
                            )}>
                                Release Name <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Enter release name"
                                className={cn("w-full", THEME.punk.input)}
                                autoFocus
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Release Date (Required) */}
                        <div>
                            <label className={cn(
                                "block text-xs font-bold uppercase mb-2",
                                isDark ? "text-slate-300" : "text-black"
                            )}>
                                Release Date <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="date"
                                value={releaseDate}
                                onChange={e => setReleaseDate(e.target.value)}
                                className={cn("w-full", THEME.punk.input)}
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Era (Required) */}
                        <div>
                            <label className={cn(
                                "block text-xs font-bold uppercase mb-2",
                                isDark ? "text-slate-300" : "text-black"
                            )}>
                                Era <span className="text-red-500">*</span>
                            </label>
                            {availableEras.length === 0 ? (
                                <div className={cn(
                                    "p-3 text-xs border-2",
                                    isDark ? "border-slate-600 bg-slate-700 text-slate-300" : "border-yellow-500 bg-yellow-50 text-yellow-800"
                                )}>
                                    <Icon name="AlertTriangle" size={14} className="inline mr-1" />
                                    No eras available. Create an era first in Settings.
                                </div>
                            ) : (
                                <select
                                    value={eraId}
                                    onChange={e => setEraId(e.target.value)}
                                    className={cn("w-full", THEME.punk.input)}
                                    required
                                    disabled={isSubmitting}
                                >
                                    <option value="">Select an era...</option>
                                    {availableEras.map(era => (
                                        <option key={era.id} value={era.id}>
                                            {era.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Info Note */}
                        <div className={cn(
                            "p-3 text-xs border-2",
                            isDark ? "border-slate-600 bg-slate-700 text-slate-300" : "border-blue-500 bg-blue-50 text-blue-800"
                        )}>
                            <Icon name="AlertCircle" size={14} className="inline mr-1" />
                            Tasks will be auto-generated based on release date. You can add details later.
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                            className={cn(
                                "flex-1 px-4 py-3",
                                THEME.punk.btn,
                                isDark ? "bg-slate-700 text-slate-200" : "bg-white",
                                isSubmitting && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!name.trim() || !releaseDate || !eraId || availableEras.length === 0 || isSubmitting}
                            className={cn(
                                "flex-1 px-4 py-3 font-black",
                                THEME.punk.btn,
                                "bg-purple-500 text-white",
                                (!name.trim() || !releaseDate || !eraId || availableEras.length === 0 || isSubmitting) && 
                                "opacity-50 cursor-not-allowed hover:translate-y-0"
                            )}
                        >
                            {isSubmitting ? 'Creating...' : 'Create Release'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};