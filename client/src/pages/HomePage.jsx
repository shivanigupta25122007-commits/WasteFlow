import { motion } from 'framer-motion';
import { ArrowRight, Building2, CheckCircle2, Leaf, MapPinned, Recycle, ShieldCheck, Sparkles, Trash2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const metrics = [
  { label: 'Active communities', value: '1.2k+' },
  { label: 'Waste reports', value: '18k+' },
  { label: 'Collections completed', value: '94%' },
];

const features = [
  { icon: <Trash2 size={18} />, title: 'Smart reporting', text: 'Citizen-led waste reporting with location intelligence and issue tracking.' },
  { icon: <MapPinned size={18} />, title: 'Live hotspots', text: 'Identify places with repeated waste issues and optimize city services.' },
  { icon: <Recycle size={18} />, title: 'Pickup orchestration', text: 'Coordinate waste collection scheduling and resource planning in real time.' },
  { icon: <ShieldCheck size={18} />, title: 'Role-safe access', text: 'Role-based permissions protect citizen and admin workflows securely.' },
];

const steps = [
  'Create a complaint or pickup request.',
  'Admins review and assign local teams.',
  'Residents track progress and receive updates.',
];

const awarenessCards = [
  { title: 'Wet Waste', tag: 'Organic / Compost', icon: <Leaf size={18} /> },
  { title: 'Dry Waste', tag: 'Recyclables', icon: <Recycle size={18} /> },
  { title: 'E-Waste', tag: 'Electronics', icon: <Building2 size={18} /> },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const HomePage = () => (
  <>
    <section className="hero">
      <div className="container hero-grid">
        <motion.div initial="hidden" animate="show" variants={fadeUp} transition={{ duration: 0.5 }}>
          <div className="section-header">
            <span className="status-pill">Smart Clean City Infrastructure</span>
          </div>
          <h1>Smart Waste Management for Cleaner Communities</h1>
          <p className="lead">
            Empower residents, support local teams, and reduce environmental burden with a responsive waste reporting and pickup platform built for modern cities.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/report">Report Waste <ArrowRight size={16} /></Link>
            <Link className="btn btn-secondary" to="/pickup">Request Pickup</Link>
            <Link className="btn btn-ghost" to="/track">Track Complaint</Link>
          </div>
          <div className="metrics-row">
            {metrics.map((item) => (
              <div key={item.label} className="metric-card">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="hero-visual">
          <div className="visual-card">
            <div className="visual-panel">
              <div className="brand" style={{ marginBottom: 10 }}>
                <span className="brand-mark"><Sparkles size={18} /></span>
                WasteFlow Dashboard
              </div>
            </div>
            <div className="grid-3">
              <div className="card">
                <strong>214</strong>
                <div className="text-muted">Reports this week</div>
              </div>
              <div className="card">
                <strong>31</strong>
                <div className="text-muted">Hotspots</div>
              </div>
              <div className="card">
                <strong>88%</strong>
                <div className="text-muted">Resolved</div>
              </div>
            </div>
            <div className="visual-panel">
              <div className="list-item">
                <span>Overflowing bin in Sector 4</span>
                <span className="status-pill">Pending</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2>The problem we solve</h2>
          <p>Unmanaged garbage and delayed collections create health hazards, inefficiency, and fragmented city operations.</p>
        </div>
        <div className="feature-grid">
          {features.map((item) => (
            <motion.div whileHover={{ y: -4 }} key={item.title} className="feature-card">
              <div className="icon-wrap">{item.icon}</div>
              <h3>{item.title}</h3>
              <p className="text-muted">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2>How it works</h2>
        </div>
        <div className="steps-grid feature-grid">
          {steps.map((step, index) => (
            <div key={step} className="feature-card">
              <div className="icon-wrap">0{index + 1}</div>
              <h3>{step}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2>Waste awareness</h2>
          <p>Small household actions create large civic impact.</p>
        </div>
        <div className="awareness-grid feature-grid">
          {awarenessCards.map((item) => (
            <div key={item.title} className="feature-card">
              <div className="icon-wrap">{item.icon}</div>
              <h3>{item.title}</h3>
              <p className="text-muted">{item.tag}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2>Platform highlights</h2>
        </div>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="icon-wrap"><Users size={18} /></div>
            <h3>Citizen-first</h3>
            <p className="text-muted">Submit issues quickly with secure, accountable forms.</p>
          </div>
          <div className="feature-card">
            <div className="icon-wrap"><CheckCircle2 size={18} /></div>
            <h3>Admin visibility</h3>
            <p className="text-muted">Monitor the full pipeline from complaint to resolution.</p>
          </div>
          <div className="feature-card">
            <div className="icon-wrap"><Leaf size={18} /></div>
            <h3>Community impact</h3>
            <p className="text-muted">Support cleaner neighborhoods with measurable waste trends.</p>
          </div>
          <div className="feature-card">
            <div className="icon-wrap"><Sparkles size={18} /></div>
            <h3>Performance data</h3>
            <p className="text-muted">Track issue volume, hotspots, and collection performance.</p>
          </div>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <h2>Join the next wave of eco-smart urban management.</h2>
          <p className="text-muted">Turn local waste issues into actionable city improvement.</p>
          <div className="hero-actions" style={{ justifyContent: 'center' }}>
            <Link className="btn btn-primary" to="/register">Get started</Link>
          </div>
        </div>
      </div>
    </section>

    <footer className="section" style={{ paddingTop: '0' }}>
      <div className="container">
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div className="brand"><span className="brand-mark"><Recycle size={18} /></span>WasteFlow</div>
          <div className="text-muted">© 2026 Waste Management Platform</div>
        </div>
      </div>
    </footer>
  </>
);

export default HomePage;
