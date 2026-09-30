import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, ClipboardList, House, Recycle, Trash2 } from 'lucide-react';
import api from '../lib/api';

const CitizenDashboardPage = () => {
  const [stats, setStats] = useState({ totalComplaints: 0, pendingComplaints: 0, resolvedComplaints: 0, activePickupRequests: 0 });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [complaintsRes, pickupsRes, notificationsRes] = await Promise.all([
          api.get('/complaints/mine'),
          api.get('/pickups/mine'),
          api.get('/notifications'),
        ]);

        const complaints = complaintsRes.data || [];
        const pickupList = pickupsRes.data || [];

        setRecentComplaints(complaints.slice(0, 4));
        setPickups(pickupList.slice(0, 4));
        setNotifications(notificationsRes.data || []);

        setStats({
          totalComplaints: complaints.length,
          pendingComplaints: complaints.filter((item) => item.status !== 'Resolved' && item.status !== 'Rejected').length,
          resolvedComplaints: complaints.filter((item) => item.status === 'Resolved').length,
          activePickupRequests: pickupList.filter((item) => item.status !== 'Completed' && item.status !== 'Cancelled').length,
        });
      } catch (error) {
        console.error(error);
      }
    };

    load();
  }, []);

  return (
    <div className="container dashboard-shell">
      <div className="page-header">
        <h2>Citizen dashboard</h2>
        <p className="text-muted">Track waste reports and pickup requests in one place.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-box">
          <div className="label">Total complaints</div>
          <span className="value">{stats.totalComplaints}</span>
        </div>
        <div className="stat-box">
          <div className="label">Pending complaints</div>
          <span className="value">{stats.pendingComplaints}</span>
        </div>
        <div className="stat-box">
          <div className="label">Resolved complaints</div>
          <span className="value">{stats.resolvedComplaints}</span>
        </div>
        <div className="stat-box">
          <div className="label">Active pickup requests</div>
          <span className="value">{stats.activePickupRequests}</span>
        </div>
      </div>

      <div className="panel-grid">
        <div className="card">
          <h3>Quick actions</h3>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/report">Report Waste</Link>
            <Link className="btn btn-secondary" to="/pickup">Request Pickup</Link>
            <Link className="btn btn-ghost" to="/track">Track Complaint</Link>
            <Link className="btn btn-ghost" to="/awareness">Waste Awareness</Link>
          </div>
        </div>
        <div className="card">
          <h3><Bell size={16} /> Notifications</h3>
          <div className="list">
            {notifications.length ? notifications.slice(0, 4).map((note) => (
              <div key={note._id} className="list-item">
                <div>
                  <strong>{note.title}</strong>
                  <div className="text-muted">{note.message}</div>
                </div>
              </div>
            )) : <div className="empty-state">No notifications</div>}
          </div>
        </div>
      </div>

      <div className="panel-grid">
        <div className="card">
          <h3>Recent activity</h3>
          <div className="list">
            {recentComplaints.length ? recentComplaints.map((complaint) => (
              <div key={complaint._id} className="list-item">
                <div>
                  <strong>{complaint.complaintId}</strong>
                  <div className="text-muted">{complaint.issueType}</div>
                </div>
                <span className="status-pill">{complaint.status}</span>
              </div>
            )) : <div className="empty-state">No complaints yet.</div>}
          </div>
        </div>
        <div className="card">
          <h3>Pickup requests</h3>
          <div className="list">
            {pickups.length ? pickups.map((pickup) => (
              <div key={pickup._id} className="list-item">
                <div>
                  <strong>{pickup.requestId}</strong>
                  <div className="text-muted">{pickup.wasteType}</div>
                </div>
                <span className="status-pill">{pickup.status}</span>
              </div>
            )) : <div className="empty-state">No pickup requests yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboardPage;
