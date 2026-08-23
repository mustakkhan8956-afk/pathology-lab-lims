import React, { useState } from 'react';
import axios from 'axios';

function ReportList({ reports, patients, onRefresh }) {
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.patient_id === patientId);
    return patient ? patient.name : 'Unknown';
  };

  const handleDelete = async (reportId) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await axios.delete(`http://localhost:5000/api/reports/${reportId}`);
        setMessage('✅ Report deleted successfully!');
        onRefresh();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage(`❌ Error: ${error.message}`);
      }
    }
  };

  const handlePrint = (reportId) => {
    const report = reports.find(r => r.report_id === reportId);
    if (report) {
      const printContent = `
        <html>
          <head>
            <title>Lab Report - ${report.report_id}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; border-bottom: 2px solid #667eea; padding-bottom: 20px; margin-bottom: 20px; }
              .report-data { margin: 20px 0; }
              .field { margin: 10px 0; }
              .label { font-weight: bold; color: #667eea; }
              .footer { text-align: center; margin-top: 40px; border-top: 2px solid #667eea; padding-top: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🏥 Pathology Lab Report</h1>
              <p>Laboratory Information Management System</p>
            </div>
            <div class="report-data">
              <div class="field"><span class="label">Report ID:</span> ${report.report_id}</div>
              <div class="field"><span class="label">Patient Name:</span> ${getPatientName(report.patient_id)}</div>
              <div class="field"><span class="label">Patient ID:</span> ${report.patient_id}</div>
              <div class="field"><span class="label">Test Type:</span> ${report.test_type}</div>
              <div class="field"><span class="label">Test Name:</span> ${report.test_name}</div>
              <div class="field"><span class="label">Results:</span> ${report.results || 'N/A'}</div>
              <div class="field"><span class="label">Normal Range:</span> ${report.normal_range || 'N/A'}</div>
              <div class="field"><span class="label">Status:</span> ${report.status}</div>
              <div class="field"><span class="label">Doctor Notes:</span> ${report.doctor_notes || 'N/A'}</div>
              <div class="field"><span class="label">Date:</span> ${new Date(report.created_at).toLocaleString()}</div>
            </div>
            <div class="footer">
              <p>This is an official laboratory report. For inquiries, please contact the lab.</p>
              <p>Printed on: ${new Date().toLocaleString()}</p>
            </div>
          </body>
        </html>
      `;
      const printWindow = window.open('', '', 'width=900,height=600');
      printWindow.document.write(printContent);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 250);
    }
  };

  const filteredReports = reports.filter(report =>
    report.report_id.includes(searchTerm) ||
    report.patient_id.includes(searchTerm) ||
    getPatientName(report.patient_id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="list-container">
      <h2>📄 Reports List</h2>
      {message && (
        <div className={message.includes('✅') ? 'success-message' : 'error-message'}>
          {message}
        </div>
      )}

      <div className="form-group">
        <input
          type="text"
          placeholder="Search by Report ID, Patient ID, or Patient Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredReports.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
          No reports found. Add a new report to get started! 📝
        </p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Patient</th>
                <th>Test Type</th>
                <th>Test Name</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map(report => (
                <tr key={report.report_id}>
                  <td><strong>{report.report_id}</strong></td>
                  <td>{getPatientName(report.patient_id)}</td>
                  <td>{report.test_type}</td>
                  <td>{report.test_name}</td>
                  <td>{report.status}</td>
                  <td>{new Date(report.created_at).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn-action btn-print"
                      onClick={() => handlePrint(report.report_id)}
                    >
                      🖨️ Print
                    </button>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => handleDelete(report.report_id)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ReportList;
