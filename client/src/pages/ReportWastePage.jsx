import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

const issueTypes = [
  'Overflowing Bin',
  'Garbage on Road',
  'Missed Collection',
  'Illegal Dumping',
  'Improper Waste Segregation',
  'Other',
];

const ReportWastePage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    issueType: issueTypes[0],
    description: '',
    address: '',
    latitude: '',
    longitude: '',
    occurredAt: '',
    contactInfo: '',
    file: null,
  });
  const [imagePreview, setImagePreview] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = file.name.split('.').pop().toLowerCase();

    if (!validTypes.includes(file.type) || !validExtensions.includes(`.${ext}`)) {
      setMessage('Only JPG, JPEG, PNG, and WEBP image files are allowed.');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setMessage('Image size must be under 3 MB.');
      return;
    }

    setForm((prev) => ({ ...prev, file }));
    setImagePreview(URL.createObjectURL(file));
    setMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'file' && value) {
          formData.append('image', value);
        } else if (value !== '' && value !== null) {
          formData.append(key, value);
        }
      });

      const { data } = await api.post('/complaints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage(`Complaint submitted successfully. Complaint ID: ${data.complaintId}`);
      setForm({
        issueType: issueTypes[0],
        description: '',
        address: '',
        latitude: '',
        longitude: '',
        occurredAt: '',
        contactInfo: '',
        file: null,
      });
      setImagePreview('');
      setTimeout(() => navigate('/track'), 1200);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to submit complaint.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container dashboard-shell">
      <div className="page-header">
        <h2>Report waste</h2>
        <p className="text-muted">Submit a complaint with location and optional image evidence.</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field">
              <label>Issue type</label>
              <select value={form.issueType} onChange={(e) => setForm({ ...form, issueType: e.target.value })}>
                {issueTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Date / time</label>
              <input type="datetime-local" value={form.occurredAt} onChange={(e) => setForm({ ...form, occurredAt: e.target.value })} />
            </div>
            <div className="field full-span">
              <label>Description</label>
              <textarea rows="5" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>
            <div className="field full-span">
              <label>Image upload</label>
              <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={handleFileChange} />
              {imagePreview && <img src={imagePreview} alt="Preview" style={{ marginTop: 12, borderRadius: 14, maxHeight: 220, objectFit: 'cover' }} />}
            </div>
            <div className="field">
              <label>Address</label>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
            </div>
            <div className="field">
              <label>Contact info (optional)</label>
              <input value={form.contactInfo} onChange={(e) => setForm({ ...form, contactInfo: e.target.value })} />
            </div>
            <div className="field">
              <label>Latitude</label>
              <input type="number" step="any" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} required />
            </div>
            <div className="field">
              <label>Longitude</label>
              <input type="number" step="any" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} required />
            </div>
          </div>

          {message && <div className="status-pill" style={{ marginTop: 18, display: 'inline-flex', background: message.includes('successfully') ? 'rgba(29,155,100,0.12)' : 'rgba(216,79,95,0.12)', color: message.includes('successfully') ? '#0a7c50' : '#b13b4b' }}>{message}</div>}

          <div style={{ marginTop: 24 }}>
            <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit complaint'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportWastePage;
