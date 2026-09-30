import { useEffect, useState } from 'react';
import api from '../lib/api';

const ComplaintTrackingPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/complaints/mine');
        setComplaints(data);
        if (data[0]) setSelectedId(data[0]._id);
      } catch (error) {
        console.error(error);
      }
    };

    load();
  }, []);

  const selectedComplaint = complaints.find((complaint) => complaint._id === selectedId) || complaints[0];

  return (
    <div className="container dashboard-shell">
      <div className="page-header">
        <h2>Complaint tracking</h2>
        <p className="text-muted">Monitor complaint lifecycle and resolution updates.</p>
      </div>

      <div className="panel-grid">
        <div className="card">
          <h3>Your complaints</h3>
          <div className="list">
            {complaints.length ? complaints.map((complaint) => (
              <button key={complaint._id} className="list-item" style={{ textAlign: 'left', width: '100%', border: 'none', cursor: 'pointer' }} onClick={() => setSelectedId(complaint._id)}>
                <div>
                  <strong>{complaint.complaintId}</strong>
                  <div className="text-muted">{complaint.issueType}</div>
                </div>
                <span className="status-pill">{complaint.status}</span>
              </button>
            )) : <div className="empty-state">No complaints yet.</div>}
          </div>
        </div>

        <div className="card">
          {selectedComplaint ? (
            <>
              <h3>{selectedComplaint.complaintId}</h3>
              <p><strong>Issue type:</strong> {selectedComplaint.issueType}</p>
              <p><strong>Location:</strong> {selectedComplaint.address}</p>
              <p><strong>Status:</strong> {selectedComplaint.status}</p>
              <p><strong>Description:</strong> {selectedComplaint.description}</p>
              {selectedComplaint.imageUrl && <img src={selectedComplaint.imageUrl} alt="Complaint" style={{ borderRadius: 16, marginTop: 12, maxHeight: 260 }} />}
              <div className="activity-timeline" style={{ marginTop: 20 }}>
                {(selectedComplaint.statusHistory || []).map((entry, index) => (
                  <div key={`${entry.status}-${index}`} className="timeline-item">
                    <div className="timeline-dot" />
                    <div>
                      <strong>{entry.status}</strong>
                      <div className="text-muted">{entry.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : <div className="empty-state">Select a complaint to view details.</div>}
        </div>
      </div>
    </div>
  );
};

export default ComplaintTrackingPage;
