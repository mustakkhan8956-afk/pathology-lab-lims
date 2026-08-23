import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PatientForm from './components/PatientForm';
import PatientList from './components/PatientList';
import ReportForm from './components/ReportForm';
import ReportList from './components/ReportList';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [patients, setPatients] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPatients();
    fetchReports();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/patients');
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/reports');
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🏥 Pathology Lab LIMS</h1>
        <p>Laboratory Information Management System</p>
      </header>

      <nav className="nav-menu">
        <button 
          className={currentPage === 'dashboard' ? 'active' : ''}
          onClick={() => setCurrentPage('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={currentPage === 'register' ? 'active' : ''}
          onClick={() => setCurrentPage('register')}
        >
          👤 Register Patient
        </button>
        <button 
          className={currentPage === 'patients' ? 'active' : ''}
          onClick={() => setCurrentPage('patients')}
        >
          📋 Patients
        </button>
        <button 
          className={currentPage === 'add-report' ? 'active' : ''}
          onClick={() => setCurrentPage('add-report')}
        >
          📝 Add Report
        </button>
        <button 
          className={currentPage === 'reports' ? 'active' : ''}
          onClick={() => setCurrentPage('reports')}
        >
          📄 Reports
        </button>
      </nav>

      <main className="main-content">
        {currentPage === 'dashboard' && (
          <div className="dashboard">
            <div className="stats">
              <div className="stat-card">
                <h3>Total Patients</h3>
                <p className="stat-number">{patients.length}</p>
              </div>
              <div className="stat-card">
                <h3>Total Reports</h3>
                <p className="stat-number">{reports.length}</p>
              </div>
              <div className="stat-card">
                <h3>Pending Reports</h3>
                <p className="stat-number">{reports.filter(r => r.status === 'Pending').length}</p>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'register' && (
          <PatientForm onPatientAdded={() => {
            fetchPatients();
            setCurrentPage('patients');
          }} />
        )}

        {currentPage === 'patients' && (
          <PatientList patients={patients} onRefresh={fetchPatients} />
        )}

        {currentPage === 'add-report' && (
          <ReportForm patients={patients} onReportAdded={() => {
            fetchReports();
            setCurrentPage('reports');
          }} />
        )}

        {currentPage === 'reports' && (
          <ReportList reports={reports} patients={patients} onRefresh={fetchReports} />
        )}
      </main>

      <footer className="app-footer">
        <p>Pathology Lab LIMS © 2024 | Developed with ❤️</p>
      </footer>
    </div>
  );
}

export default App;
