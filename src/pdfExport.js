/**
 * PDF Export Service for Album Tracker
 * Uses jspdf to generate professional PDF reports for various entities
 */
import { jsPDF } from 'jspdf';

// Helper to format money values
const formatMoney = (value) => {
  const num = Number(value) || 0;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
};

// Helper to format dates
const formatDate = (date) => {
  if (!date) return 'Not Set';
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return date;
  }
};

// Helper to get current timestamp
const getTimestamp = () => {
  return new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Helper to get effective cost (paid > quoted > estimated)
const getEffectiveCost = (entity = {}) => {
  if (entity.paidCost > 0) return entity.paidCost;
  if (entity.quotedCost > 0) return entity.quotedCost;
  return entity.estimatedCost || 0;
};

// Helper to get team member name by ID
const getTeamMemberName = (memberId, teamMembers = []) => {
  const member = teamMembers.find(m => m.id === memberId);
  return member?.name || 'Unknown';
};

// Helper to get era name by ID
const getEraName = (eraId, eras = []) => {
  const era = eras.find(e => e.id === eraId);
  return era?.name || 'Unknown Era';
};

// Common PDF setup
const createPDFDoc = (title) => {
  const doc = new jsPDF();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text(title, 14, 20);
  
  // Add timestamp
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${getTimestamp()}`, 14, 28);
  
  // Horizontal line
  doc.setLineWidth(0.5);
  doc.line(14, 32, 196, 32);
  
  return { doc, startY: 40 };
};

// Helper to add a section header
const addSectionHeader = (doc, title, y) => {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(title, 14, y);
  doc.setLineWidth(0.3);
  doc.line(14, y + 2, 196, y + 2);
  return y + 10;
};

// Helper to add key-value row
const addKeyValue = (doc, key, value, y, keyWidth = 50) => {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(key + ':', 14, y);
  doc.setFont('helvetica', 'normal');
  doc.text(String(value || 'N/A'), 14 + keyWidth, y);
  return y + 6;
};

// Helper to check and add new page if needed
const checkPageBreak = (doc, y, needed = 30) => {
  if (y > 270 - needed) {
    doc.addPage();
    return 20;
  }
  return y;
};

// Helper to add a simple table
const addTable = (doc, headers, rows, startY, colWidths) => {
  let y = startY;
  const rowHeight = 8;
  const pageHeight = 270;
  
  // Table header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setFillColor(240, 240, 240);
  doc.rect(14, y - 5, 182, rowHeight, 'F');
  
  let x = 14;
  headers.forEach((header, i) => {
    doc.text(header, x + 2, y);
    x += colWidths[i];
  });
  
  y += rowHeight;
  
  // Table rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  rows.forEach((row) => {
    // Check for page break
    if (y > pageHeight) {
      doc.addPage();
      y = 20;
      
      // Re-add header on new page
      doc.setFont('helvetica', 'bold');
      doc.setFillColor(240, 240, 240);
      doc.rect(14, y - 5, 182, rowHeight, 'F');
      
      x = 14;
      headers.forEach((header, i) => {
        doc.text(header, x + 2, y);
        x += colWidths[i];
      });
      y += rowHeight;
      doc.setFont('helvetica', 'normal');
    }
    
    x = 14;
    row.forEach((cell, i) => {
      const cellText = String(cell || '').substring(0, Math.floor(colWidths[i] / 2)); // Truncate if needed
      doc.text(cellText, x + 2, y);
      x += colWidths[i];
    });
    y += rowHeight;
  });
  
  return y + 5;
};

/**
 * Export Song PDF
 * Contains: Song title, credits (writers/composers), ISRC, metadata, current status, task list
 * Does NOT include lyrics
 */
export const exportSongPDF = (song, teamMembers = [], eras = []) => {
  if (!song) return;
  
  const { doc, startY } = createPDFDoc(`Song Report: ${song.title || 'Untitled'}`);
  let y = startY;
  
  // Basic Information Section
  y = addSectionHeader(doc, 'Basic Information', y);
  y = addKeyValue(doc, 'Song Title', song.title, y);
  y = addKeyValue(doc, 'Release Date', formatDate(song.releaseDate), y);
  y = addKeyValue(doc, 'Single', song.isSingle ? 'Yes' : 'No', y);
  y = addKeyValue(doc, 'Stems Needed', song.stemsNeeded ? 'Yes' : 'No', y);
  
  if (song.isrc) {
    y = addKeyValue(doc, 'ISRC', song.isrc, y);
  }
  
  y += 5;
  
  // Credits Section
  y = checkPageBreak(doc, y);
  y = addSectionHeader(doc, 'Credits', y);
  
  const writers = (song.writers || []).join(', ') || 'Not specified';
  y = addKeyValue(doc, 'Writers', writers, y);
  
  const composers = (song.composers || []).join(', ') || 'Not specified';
  y = addKeyValue(doc, 'Composers', composers, y);
  
  // Musicians
  if (song.musicians && song.musicians.length > 0) {
    y += 3;
    doc.setFont('helvetica', 'bold');
    doc.text('Musicians:', 14, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    
    song.musicians.forEach(m => {
      y = checkPageBreak(doc, y);
      const name = getTeamMemberName(m.memberId, teamMembers);
      const instruments = (m.instruments || []).join(', ') || 'Not specified';
      doc.text(`• ${name}: ${instruments}`, 18, y);
      y += 5;
    });
  }
  
  y += 5;
  
  // Metadata Section
  y = checkPageBreak(doc, y);
  y = addSectionHeader(doc, 'Metadata', y);
  
  if (song.eraIds && song.eraIds.length > 0) {
    const eraNames = song.eraIds.map(id => getEraName(id, eras)).join(', ');
    y = addKeyValue(doc, 'Era(s)', eraNames, y);
  }
  
  if (song.hasExclusivity) {
    y = addKeyValue(doc, 'Exclusivity', 'Yes', y);
    if (song.exclusiveStartDate || song.exclusiveEndDate) {
      y = addKeyValue(doc, 'Exclusive Period', `${formatDate(song.exclusiveStartDate)} - ${formatDate(song.exclusiveEndDate)}`, y, 60);
    }
    if (song.exclusiveNotes) {
      y = addKeyValue(doc, 'Notes', song.exclusiveNotes, y);
    }
  }
  
  // Instruments
  if (song.instruments && song.instruments.length > 0) {
    y = addKeyValue(doc, 'Instruments', song.instruments.join(', '), y);
  }
  
  y += 5;
  
  // Task List Section
  y = checkPageBreak(doc, y, 50);
  y = addSectionHeader(doc, 'Tasks', y);
  
  const allTasks = [
    ...(song.deadlines || []).map(t => ({ ...t, _type: 'Auto' })),
    ...(song.customTasks || []).map(t => ({ ...t, _type: 'Custom' }))
  ];
  
  if (allTasks.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.text('No tasks for this song.', 14, y);
    y += 10;
  } else {
    const taskRows = allTasks.map(task => [
      task._type,
      task.type || task.title || 'Untitled',
      formatDate(task.date),
      task.status || 'Not Started',
      formatMoney(getEffectiveCost(task))
    ]);
    
    y = addTable(doc, ['Type', 'Task', 'Due Date', 'Status', 'Cost'], taskRows, y, [25, 60, 40, 35, 30]);
  }
  
  // Cost Summary
  y = checkPageBreak(doc, y, 40);
  y = addSectionHeader(doc, 'Cost Summary', y);
  
  const totalEstimated = allTasks.reduce((sum, t) => sum + (t.estimatedCost || 0), 0);
  const totalQuoted = allTasks.reduce((sum, t) => sum + (t.quotedCost || 0), 0);
  const totalPaid = allTasks.reduce((sum, t) => sum + (t.paidCost || 0), 0);
  
  y = addKeyValue(doc, 'Estimated Cost', formatMoney(totalEstimated), y);
  y = addKeyValue(doc, 'Quoted Cost', formatMoney(totalQuoted), y);
  y = addKeyValue(doc, 'Amount Paid', formatMoney(totalPaid), y);
  
  // Notes
  if (song.notes) {
    y = checkPageBreak(doc, y, 30);
    y = addSectionHeader(doc, 'Notes', y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(song.notes, 180);
    doc.text(lines, 14, y);
    y += lines.length * 5 + 5;
  }
  
  // Save the PDF
  doc.save(`Song_Report_${(song.title || 'Untitled').replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
};

/**
 * Export Video PDF
 * Contains: Video title, production plan/notes, cast/crew list, budget overview
 */
export const exportVideoPDF = (video, teamMembers = []) => {
  if (!video) return;
  
  const { doc, startY } = createPDFDoc(`Video Report: ${video.title || 'Untitled'}`);
  let y = startY;
  
  // Basic Information Section
  y = addSectionHeader(doc, 'Basic Information', y);
  y = addKeyValue(doc, 'Video Title', video.title, y);
  y = addKeyValue(doc, 'Release Date', formatDate(video.releaseDate), y);
  
  // Video type
  const videoType = video.videoType || (video.types ? Object.keys(video.types).find(k => video.types[k]) : null);
  if (videoType) {
    const typeLabels = {
      music: 'Music Video',
      lyric: 'Lyric Video',
      enhancedLyric: 'Enhanced Lyric Video',
      loop: 'Loop Video',
      visualizer: 'Visualizer',
      live: 'Live Video',
      custom: 'Custom Video'
    };
    y = addKeyValue(doc, 'Video Type', typeLabels[videoType] || videoType, y);
  }
  
  if (video.isStandalone) {
    y = addKeyValue(doc, 'Standalone', 'Yes', y);
  }
  
  y += 5;
  
  // Production Plan / Notes Section
  y = checkPageBreak(doc, y);
  y = addSectionHeader(doc, 'Production Plan / Notes', y);
  
  if (video.notes) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(video.notes, 180);
    doc.text(lines, 14, y);
    y += lines.length * 5 + 5;
  } else {
    doc.setFont('helvetica', 'italic');
    doc.text('No production notes available.', 14, y);
    y += 10;
  }
  
  // Exclusivity
  if (video.timedExclusive) {
    y = checkPageBreak(doc, y, 25);
    y = addSectionHeader(doc, 'Exclusivity', y);
    y = addKeyValue(doc, 'Timed Exclusive', 'Yes', y);
    if (video.exclusiveStartDate || video.exclusiveEndDate) {
      y = addKeyValue(doc, 'Exclusive Period', `${formatDate(video.exclusiveStartDate)} - ${formatDate(video.exclusiveEndDate)}`, y, 60);
    }
    if (video.exclusiveNotes) {
      y = addKeyValue(doc, 'Platform/Notes', video.exclusiveNotes, y);
    }
    y += 5;
  }
  
  // Cast/Crew List Section
  y = checkPageBreak(doc, y, 40);
  y = addSectionHeader(doc, 'Cast / Crew', y);
  
  const assignedMembers = [];
  
  // From musicians on video
  if (video.musicians && video.musicians.length > 0) {
    video.musicians.forEach(m => {
      assignedMembers.push({
        name: getTeamMemberName(m.memberId, teamMembers),
        role: (m.instruments || []).join(', ') || 'Performer'
      });
    });
  }
  
  // From task assignments
  const allTasks = [...(video.tasks || []), ...(video.customTasks || [])];
  allTasks.forEach(task => {
    (task.assignedMembers || []).forEach(am => {
      const name = getTeamMemberName(am.memberId, teamMembers);
      if (!assignedMembers.find(m => m.name === name)) {
        assignedMembers.push({
          name,
          role: task.type || task.title || 'Task Assignment'
        });
      }
    });
  });
  
  if (assignedMembers.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.text('No cast/crew assigned.', 14, y);
    y += 10;
  } else {
    const crewRows = assignedMembers.map(m => [m.name, m.role]);
    y = addTable(doc, ['Name', 'Role / Task'], crewRows, y, [90, 90]);
  }
  
  y += 5;
  
  // Budget Overview Section
  y = checkPageBreak(doc, y, 50);
  y = addSectionHeader(doc, 'Budget Overview', y);
  
  // Video-level budget
  if (video.budgetedCost) {
    y = addKeyValue(doc, 'Budgeted Cost', formatMoney(video.budgetedCost), y);
  }
  
  // Task-level costs
  const taskEstimated = allTasks.reduce((sum, t) => sum + (t.estimatedCost || 0), 0);
  const taskQuoted = allTasks.reduce((sum, t) => sum + (t.quotedCost || 0), 0);
  const taskPaid = allTasks.reduce((sum, t) => sum + (t.paidCost || 0), 0);
  
  y = addKeyValue(doc, 'Estimated Cost', formatMoney(taskEstimated), y);
  y = addKeyValue(doc, 'Quoted Cost', formatMoney(taskQuoted), y);
  y = addKeyValue(doc, 'Amount Paid', formatMoney(taskPaid), y);
  
  // Budget warning if over
  if (video.budgetedCost && taskEstimated > video.budgetedCost) {
    y += 3;
    doc.setTextColor(200, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(`[!] Over budget by ${formatMoney(taskEstimated - video.budgetedCost)}`, 14, y);
    doc.setTextColor(0, 0, 0);
    y += 8;
  }
  
  y += 5;
  
  // Tasks Section
  y = checkPageBreak(doc, y, 50);
  y = addSectionHeader(doc, 'Tasks', y);
  
  if (allTasks.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.text('No tasks for this video.', 14, y);
  } else {
    const taskRows = allTasks.map(task => [
      task.type || task.title || 'Untitled',
      formatDate(task.date),
      task.status || 'Not Started',
      formatMoney(getEffectiveCost(task))
    ]);
    
    y = addTable(doc, ['Task', 'Due Date', 'Status', 'Cost'], taskRows, y, [60, 40, 50, 40]);
  }
  
  // Save the PDF
  doc.save(`Video_Report_${(video.title || 'Untitled').replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
};

/**
 * Export Release PDF
 * Contains: Release name, tracklist with song titles, total budget breakdown, release checklist status
 */
export const exportReleasePDF = (release, songs = []) => {
  if (!release) return;
  
  const { doc, startY } = createPDFDoc(`Release Report: ${release.name || 'Untitled'}`);
  let y = startY;
  
  // Basic Information Section
  y = addSectionHeader(doc, 'Basic Information', y);
  y = addKeyValue(doc, 'Release Name', release.name, y);
  y = addKeyValue(doc, 'Release Type', (release.type || 'Unknown') + (release.type === 'Other' && release.typeDetails ? ` (${release.typeDetails})` : ''), y, 50);
  y = addKeyValue(doc, 'Release Date', formatDate(release.releaseDate), y);
  y = addKeyValue(doc, 'Physical Copies', release.hasPhysicalCopies ? 'Yes' : 'No', y);
  
  if (release.hasExclusivity) {
    y = addKeyValue(doc, 'Exclusivity', 'Yes', y);
    if (release.exclusiveStartDate || release.exclusiveEndDate) {
      y = addKeyValue(doc, 'Exclusive Period', `${formatDate(release.exclusiveStartDate)} - ${formatDate(release.exclusiveEndDate)}`, y, 60);
    }
  }
  
  y += 5;
  
  // Tracklist Section
  y = checkPageBreak(doc, y, 50);
  y = addSectionHeader(doc, 'Tracklist', y);
  
  const tracks = release.tracks || [];
  if (tracks.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.text('No tracks added to this release.', 14, y);
    y += 10;
  } else {
    const trackRows = tracks.sort((a, b) => (a.order || 0) - (b.order || 0)).map((track, idx) => {
      if (track.isExternal) {
        return [String(idx + 1), track.externalTitle || 'Untitled', `by ${track.externalArtist || 'Unknown'}`, 'External'];
      } else {
        const song = songs.find(s => s.id === track.songId);
        const songTitle = song?.title || 'Unknown Song';
        const versions = track.versionIds && track.versionIds.length > 0 
          ? track.versionIds.filter(v => v !== 'core').map(vid => {
              const version = (song?.versions || []).find(v => v.id === vid);
              return version?.name || 'Unknown Version';
            }).join(', ')
          : 'Core Version';
        return [String(idx + 1), songTitle, versions, 'Internal'];
      }
    });
    
    y = addTable(doc, ['#', 'Track', 'Version', 'Type'], trackRows, y, [15, 80, 60, 35]);
  }
  
  y += 5;
  
  // Budget Breakdown Section
  y = checkPageBreak(doc, y, 50);
  y = addSectionHeader(doc, 'Budget Breakdown', y);
  
  // Release-level costs
  y = addKeyValue(doc, 'Estimated Cost', formatMoney(release.estimatedCost || 0), y);
  y = addKeyValue(doc, 'Quoted Cost', formatMoney(release.quotedCost || 0), y);
  y = addKeyValue(doc, 'Amount Paid', formatMoney(release.paidCost || 0), y);
  
  // Task costs
  const allTasks = [...(release.tasks || []), ...(release.customTasks || [])];
  const taskEstimated = allTasks.reduce((sum, t) => sum + (t.estimatedCost || 0), 0);
  const taskQuoted = allTasks.reduce((sum, t) => sum + (t.quotedCost || 0), 0);
  const taskPaid = allTasks.reduce((sum, t) => sum + (t.paidCost || 0), 0);
  
  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.text('Task Costs:', 14, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  
  y = addKeyValue(doc, 'Task Estimated', formatMoney(taskEstimated), y);
  y = addKeyValue(doc, 'Task Quoted', formatMoney(taskQuoted), y);
  y = addKeyValue(doc, 'Task Paid', formatMoney(taskPaid), y);
  
  // Total
  const totalEstimated = (release.estimatedCost || 0) + taskEstimated;
  const totalQuoted = (release.quotedCost || 0) + taskQuoted;
  const totalPaid = (release.paidCost || 0) + taskPaid;
  
  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.text('Total:', 14, y);
  y += 6;
  
  y = addKeyValue(doc, 'Total Estimated', formatMoney(totalEstimated), y);
  y = addKeyValue(doc, 'Total Quoted', formatMoney(totalQuoted), y);
  y = addKeyValue(doc, 'Total Paid', formatMoney(totalPaid), y);
  
  y += 5;
  
  // Release Checklist (Tasks) Section
  y = checkPageBreak(doc, y, 50);
  y = addSectionHeader(doc, 'Release Checklist', y);
  
  if (allTasks.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.text('No tasks for this release.', 14, y);
    y += 10;
  } else {
    const completedTasks = allTasks.filter(t => t.status === 'Complete' || t.status === 'Done').length;
    const progress = Math.round((completedTasks / allTasks.length) * 100);
    
    doc.setFont('helvetica', 'bold');
    doc.text(`Progress: ${progress}% (${completedTasks}/${allTasks.length} tasks complete)`, 14, y);
    y += 8;
    
    const taskRows = allTasks.map(task => [
      task.type || task.title || 'Untitled',
      formatDate(task.date),
      task.status || 'Not Started',
      formatMoney(getEffectiveCost(task))
    ]);
    
    y = addTable(doc, ['Task', 'Due Date', 'Status', 'Cost'], taskRows, y, [60, 40, 50, 40]);
  }
  
  // Notes
  if (release.notes) {
    y = checkPageBreak(doc, y, 30);
    y = addSectionHeader(doc, 'Notes', y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(release.notes, 180);
    doc.text(lines, 14, y);
  }
  
  // Save the PDF
  doc.save(`Release_Report_${(release.name || 'Untitled').replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
};

/**
 * Export Era PDF
 * Contains: Era name, high-level summary of releases, songs in this era, total cost summary
 */
export const exportEraPDF = (era, releases = [], songs = []) => {
  if (!era) return;
  
  const { doc, startY } = createPDFDoc(`Era Report: ${era.name || 'Untitled'}`);
  let y = startY;
  
  // Basic Information Section
  y = addSectionHeader(doc, 'Era Information', y);
  y = addKeyValue(doc, 'Era Name', era.name, y);
  if (era.color) {
    y = addKeyValue(doc, 'Color', era.color, y);
  }
  
  y += 5;
  
  // Filter releases and songs for this era
  const eraReleases = releases.filter(r => (r.eraIds || []).includes(era.id));
  const eraSongs = songs.filter(s => (s.eraIds || []).includes(era.id));
  
  // Summary Statistics
  y = addSectionHeader(doc, 'Summary', y);
  y = addKeyValue(doc, 'Total Releases', eraReleases.length, y);
  y = addKeyValue(doc, 'Total Songs', eraSongs.length, y);
  
  // Calculate total videos
  const totalVideos = eraSongs.reduce((sum, song) => sum + (song.videos || []).length, 0);
  y = addKeyValue(doc, 'Total Videos', totalVideos, y);
  
  y += 5;
  
  // Releases in this Era
  y = checkPageBreak(doc, y, 50);
  y = addSectionHeader(doc, 'Releases', y);
  
  if (eraReleases.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.text('No releases in this era.', 14, y);
    y += 10;
  } else {
    const releaseRows = eraReleases.map(r => [
      r.name || 'Untitled',
      r.type || 'Unknown',
      formatDate(r.releaseDate),
      formatMoney(getEffectiveCost(r))
    ]);
    
    y = addTable(doc, ['Release', 'Type', 'Date', 'Cost'], releaseRows, y, [70, 40, 40, 40]);
  }
  
  y += 5;
  
  // Songs in this Era
  y = checkPageBreak(doc, y, 50);
  y = addSectionHeader(doc, 'Songs', y);
  
  if (eraSongs.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.text('No songs in this era.', 14, y);
    y += 10;
  } else {
    const songRows = eraSongs.map(s => {
      // Calculate song progress
      const allTasks = [
        ...(s.deadlines || []),
        ...(s.customTasks || []),
        ...(s.versions || []).flatMap(v => [...(v.tasks || []), ...(v.customTasks || [])])
      ];
      const completed = allTasks.filter(t => t.status === 'Complete' || t.status === 'Done').length;
      const progress = allTasks.length > 0 ? Math.round((completed / allTasks.length) * 100) : 0;
      
      return [
        s.title || 'Untitled',
        formatDate(s.releaseDate),
        s.isSingle ? 'Yes' : 'No',
        `${progress}%`
      ];
    });
    
    y = addTable(doc, ['Song', 'Release Date', 'Single', 'Progress'], songRows, y, [70, 40, 30, 40]);
  }
  
  y += 5;
  
  // Cost Summary
  y = checkPageBreak(doc, y, 50);
  y = addSectionHeader(doc, 'Total Cost Summary', y);
  
  // Calculate costs from releases
  let releaseEstimated = 0;
  let releaseQuoted = 0;
  let releasePaid = 0;
  
  eraReleases.forEach(r => {
    releaseEstimated += r.estimatedCost || 0;
    releaseQuoted += r.quotedCost || 0;
    releasePaid += r.paidCost || 0;
    
    // Include release tasks
    const tasks = [...(r.tasks || []), ...(r.customTasks || [])];
    tasks.forEach(t => {
      releaseEstimated += t.estimatedCost || 0;
      releaseQuoted += t.quotedCost || 0;
      releasePaid += t.paidCost || 0;
    });
  });
  
  // Calculate costs from songs
  let songEstimated = 0;
  let songQuoted = 0;
  let songPaid = 0;
  
  eraSongs.forEach(s => {
    const allTasks = [
      ...(s.deadlines || []),
      ...(s.customTasks || []),
      ...(s.versions || []).flatMap(v => [...(v.tasks || []), ...(v.customTasks || [])])
    ];
    allTasks.forEach(t => {
      songEstimated += t.estimatedCost || 0;
      songQuoted += t.quotedCost || 0;
      songPaid += t.paidCost || 0;
    });
  });
  
  doc.setFont('helvetica', 'bold');
  doc.text('Release Costs:', 14, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  y = addKeyValue(doc, 'Estimated', formatMoney(releaseEstimated), y);
  y = addKeyValue(doc, 'Quoted', formatMoney(releaseQuoted), y);
  y = addKeyValue(doc, 'Paid', formatMoney(releasePaid), y);
  
  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.text('Song Costs:', 14, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  y = addKeyValue(doc, 'Estimated', formatMoney(songEstimated), y);
  y = addKeyValue(doc, 'Quoted', formatMoney(songQuoted), y);
  y = addKeyValue(doc, 'Paid', formatMoney(songPaid), y);
  
  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.text('Grand Total:', 14, y);
  y += 6;
  y = addKeyValue(doc, 'Total Estimated', formatMoney(releaseEstimated + songEstimated), y);
  y = addKeyValue(doc, 'Total Quoted', formatMoney(releaseQuoted + songQuoted), y);
  y = addKeyValue(doc, 'Total Paid', formatMoney(releasePaid + songPaid), y);
  
  // Save the PDF
  doc.save(`Era_Report_${(era.name || 'Untitled').replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
};
