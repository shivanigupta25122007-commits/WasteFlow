import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

const wasteTypes = ['Organic', 'Plastic', 'Paper', 'E-Waste', 'Mixed Waste', 'Other'];

const PickupRequestPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    wasteType: wasteTypes[0],
    quantity: '',
    pickupAddress: '',
    preferredDate: '',
    preferredTime: '',
    notes: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { data } = await api.post('/pickups', form);
      setMessage(`Pickup request submitted successfully. Request ID: ${data.requestId}`);
      setForm({
        wasteType: wasteTypes[0],
        quantity: '',
        pickupAddress: '',
        preferredDate: '',
        preferredTime: '',
        notes: '',
      });
      setTimeout(() => navigate('/dashboard'), 1100);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to submit pickup request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container dashboard-shell">
      <div className="page-header">
        <h2>Request pickup</h2>
        <p className="text-muted">Schedule collection for recyclables, organic waste, or mixed material.</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field">
              <label>Waste type</label>
              <select value={form.wasteType} onChange={(e) => setForm({ ...form, wasteType: e.target.value })}>
                {wasteTypes.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Quantity</label>
              <input value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
            </div>
            <div className="field full-span">
              <label>Pickup address</label>
              <input value={form.pickupAddress} onChange={(e) => setForm({ ...form, pickupAddress: e.target.value })} required />
            </div>
            <div className="field">
              <label>Preferred date</label>
              <input type="date" value={form.preferredDate} onChange={(e) => setForm({ ...form, preferredDate: e.target.value })} required />
            </div>
            <div className="field">
              <label>Preferred time</label>
              <input type="time" value={form.preferredTime} onChange={(e) => setForm({ ...form, preferredTime: e.target.value })} required />
            </div>
            <div className="field full-span">
              <label>Additional notes</label>
              <textarea rows="4" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>

          {message && <div className="status-pill" style={{ marginTop: 18, display: 'inline-flex', background: message.includes('successfully') ? 'rgba(29,155,100,0.12)' : 'rgba(216,79,95,0.12)', color: message.includes('successfully') ? '#0a7c50' : '#b13b4b' }}>{message}</div>}

          <div style={{ marginTop: 24 }}>
            <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Request pickup'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PickupRequestPage;
