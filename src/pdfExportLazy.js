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
