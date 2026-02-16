/**
 * Lazy-loaded PDF Export Module
 * This wrapper ensures jsPDF is only loaded when PDF export is actually used
 */

// Re-export all PDF export functions dynamically
export const exportSongPDF = async (...args) => {
  const { exportSongPDF } = await import('./pdfExport.js');
  return exportSongPDF(...args);
};

export const exportVideoPDF = async (...args) => {
  const { exportVideoPDF } = await import('./pdfExport.js');
  return exportVideoPDF(...args);
};

export const exportReleasePDF = async (...args) => {
  const { exportReleasePDF } = await import('./pdfExport.js');
  return exportReleasePDF(...args);
};

export const exportEraPDF = async (...args) => {
  const { exportEraPDF } = await import('./pdfExport.js');
  return exportEraPDF(...args);
};
