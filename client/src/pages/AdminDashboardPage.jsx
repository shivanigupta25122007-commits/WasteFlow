import { useEffect, useState } from 'react';
import { Activity, BarChart3, ClipboardList, MapPinned, Truck } from 'lucide-react';
import api from '../lib/api';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    totalPickups: 0,
    completedPickups: 0,
    activeIssues: 0,
  });
  const [charts, setCharts] = useState({
    complaintsOverTime: [],
    complaintsByCategory: [],
    statusDistribution: [],
    pickupStats: [],
  });
  const [hotspots, setHotspots] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        setStats(data.stats);
        setCharts(data.charts);
        setHotspots(data.hotspots || []);
      } catch (error) {
        console.error(error);
      }
    };

    load();
  }, []);

  const maxBar = (items) => items.reduce((max, item) => Math.max(max, item.count || 0), 1);

  return (
    <div className="container dashboard-shell">
      <div className="page-header">
        <h2>Admin dashboard</h2>
        <p className="text-muted">Operational overview for complaints, pickup routes, and hotspot analysis.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-box"><div className="label">Total users</div><span className="value">{stats.totalUsers}</span></div>
        <div className="stat-box"><div className="label">Total complaints</div><span className="value">{stats.totalComplaints}</span></div>
        <div className="stat-box"><div className="label">Pending complaints</div><span className="value">{stats.pendingComplaints}</span></div>
        <div className="stat-box"><div className="label">Resolved complaints</div><span className="value">{stats.resolvedComplaints}</span></div>
        <div className="stat-box"><div className="label">Pickup requests</div><span className="value">{stats.totalPickups}</span></div>
        <div className="stat-box"><div className="label">Completed pickups</div><span className="value">{stats.completedPickups}</span></div>
        <div className="stat-box"><div className="label">Active issues</div><span className="value">{stats.activeIssues}</span></div>
        <div className="stat-box"><div className="label">Waste hotspots</div><span className="value">{hotspots.length}</span></div>
      </div>

      <div className="panel-grid">
        <div className="card">
          <h3><BarChart3 size={16} /> Complaints by category</h3>
          <div className="list">
            {charts.complaintsByCategory.length ? charts.complaintsByCategory.map((item) => (
              <div key={item._id} className="list-item" style={{ alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <strong>{item._id}</strong>
                </div>
                <div style={{ width: '120px', height: '12px', background: '#e9f3ee', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${(item.count / maxBar(charts.complaintsByCategory)) * 100}%`, height: '100%', background: '#2ca36a' }} />
                </div>
                <strong style={{ minWidth: '32px', textAlign: 'right' }}>{item.count}</strong>
              </div>
            )) : <div className="empty-state">No category data available.</div>}
          </div>
        </div>

        <div className="card">
          <h3><Activity size={16} /> Complaint status distribution</h3>
          <div className="list">
            {charts.statusDistribution.length ? charts.statusDistribution.map((item) => (
              <div key={item._id} className="list-item">
                <span>{item._id}</span>
                <strong>{item.count}</strong>
              </div>
            )) : <div className="empty-state">No status data available.</div>}
          </div>
        </div>
      </div>

      <div className="panel-grid">
        <div className="card">
          <h3><ClipboardList size={16} /> Pickup statistics</h3>
          <div className="list">
            {charts.pickupStats.length ? charts.pickupStats.map((item) => (
              <div key={item._id} className="list-item">
                <span>{item._id}</span>
                <strong>{item.count}</strong>
              </div>
            )) : <div className="empty-state">No pickup data available.</div>}
          </div>
        </div>

        <div className="card">
          <h3><MapPinned size={16} /> Waste hotspots</h3>
          <div className="list">
            {hotspots.length ? hotspots.map((hotspot) => (
              <div key={hotspot.area} className="list-item">
                <div>
                  <strong>{hotspot.area}</strong>
                  <div className="text-muted">{hotspot.mainIssueType}</div>
                </div>
                <div>
                  <strong>{hotspot.numberOfComplaints}</strong>
                </div>
              </div>
            )) : <div className="empty-state">No hotspot data.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
