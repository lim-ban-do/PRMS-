/**
 * PRMS — Pure JavaScript Application Interactions
 * (No TypeScript, Standard Vanilla JS)
 */

document.addEventListener('DOMContentLoaded', () => {
  const passwordInput = document.getElementById('login-password');

  // Password visibility toggle
  const togglePassBtn = document.getElementById('toggle-password');
  if (togglePassBtn && passwordInput) {
    togglePassBtn.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
    });
  }

  // Modal open/close helpers
  window.openModal = (modalId) => {
    const el = document.getElementById(modalId);
    if (el) el.style.display = 'flex';
  };

  window.closeModal = (modalId) => {
    const el = document.getElementById(modalId);
    if (el) el.style.display = 'none';
  };

  // CSV Exporter
  window.exportTableToCSV = (tableId, filename) => {
    const table = document.getElementById(tableId);
    if (!table) return;

    let csv = [];
    const rows = table.querySelectorAll('tr');
    for (let i = 0; i < rows.length; i++) {
      let row = [], cols = rows[i].querySelectorAll('td, th');
      for (let j = 0; j < cols.length; j++) {
        let text = cols[j].innerText.replace(/"/g, '""');
        row.push('"' + text.trim() + '"');
      }
      csv.push(row.join(','));
    }

    const csvFile = new Blob([csv.join('\n')], { type: 'text/csv' });
    const downloadLink = document.createElement('a');
    downloadLink.download = filename || 'prms_report.csv';
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
});
