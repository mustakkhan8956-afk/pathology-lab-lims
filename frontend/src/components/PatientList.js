import React, { useState } from 'react';
import axios from 'axios';

function PatientList({ patients, onRefresh }) {
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = async (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await axios.delete(`http://localhost:5000/api/patients/${patientId}`);
        setMessage('✅ Patient deleted successfully!');
        onRefresh();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage(`❌ Error: ${error.message}`);
      }
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.patient_id.includes(searchTerm)
  );

  return (
    <div className="list-container">
      <h2>📋 Patients List</h2>
      {message && (
        <div className={message.includes('✅') ? 'success-message' : 'error-message'}>
          {message}
        </div>
      )}

      <div className="form-group">
        <input
          type="text"
          placeholder="Search by name or Patient ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredPatients.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
          No patients found. Register a new patient to get started! 👤
        </p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map(patient => (
                <tr key={patient.patient_id}>
                  <td><strong>{patient.patient_id}</strong></td>
                  <td>{patient.name}</td>
                  <td>{patient.age || '-'}</td>
                  <td>{patient.gender || '-'}</td>
                  <td>{patient.contact || '-'}</td>
                  <td>{patient.email || '-'}</td>
                  <td>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => handleDelete(patient.patient_id)}
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

export default PatientList;
