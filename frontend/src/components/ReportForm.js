import React, { useState } from 'react';
import axios from 'axios';

function ReportForm({ patients, onReportAdded }) {
  const [formData, setFormData] = useState({
    patient_id: '',
    test_type: '',
    test_name: '',
    results: '',
    normal_range: '',
    doctor_notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const testTypes = ['Blood Test', 'Urine Test', 'X-Ray', 'ECG', 'Ultrasound', 'CT Scan', 'MRI', 'Other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.patient_id || !formData.test_type || !formData.test_name) {
      setMessage('❌ Please fill all required fields!');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/reports', formData);
      setMessage(`✅ ${response.data.message} Report ID: ${response.data.report_id}`);
      setFormData({
        patient_id: '',
        test_type: '',
        test_name: '',
        results: '',
        normal_range: '',
        doctor_notes: ''
      });
      setTimeout(() => {
        onReportAdded();
      }, 2000);
    } catch (error) {
      setMessage(`❌ Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>📝 Add New Report</h2>
      {message && (
        <div className={message.includes('✅') ? 'success-message' : 'error-message'}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Select Patient *</label>
            <select
              name="patient_id"
              value={formData.patient_id}
              onChange={handleChange}
              required
            >
              <option value="">Choose a patient...</option>
              {patients.map(patient => (
                <option key={patient.patient_id} value={patient.patient_id}>
                  {patient.name} ({patient.patient_id})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Test Type *</label>
            <select
              name="test_type"
              value={formData.test_type}
              onChange={handleChange}
              required
            >
              <option value="">Select test type...</option>
              {testTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Test Name *</label>
          <input
            type="text"
            name="test_name"
            value={formData.test_name}
            onChange={handleChange}
            placeholder="e.g., Hemoglobin Level, Blood Sugar"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Test Results</label>
            <input
              type="text"
              name="results"
              value={formData.results}
              onChange={handleChange}
              placeholder="Enter test results"
            />
          </div>
          <div className="form-group">
            <label>Normal Range</label>
            <input
              type="text"
              name="normal_range"
              value={formData.normal_range}
              onChange={handleChange}
              placeholder="e.g., 12-16 g/dL"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Doctor Notes</label>
          <textarea
            name="doctor_notes"
            value={formData.doctor_notes}
            onChange={handleChange}
            placeholder="Add any additional notes or observations"
            rows="3"
          />
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? '⏳ Adding Report...' : '✅ Add Report'}
        </button>
      </form>
    </div>
  );
}

export default ReportForm;
