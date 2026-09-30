import { Leaf, Recycle, Trash2, ShieldAlert, ClipboardCheck, Wind, Factory, Sparkles } from 'lucide-react';

const cards = [
  { title: 'Wet Waste', description: 'Do: compost kitchen scraps. Don’t: mix with plastic or e-waste.', icon: <Leaf size={18} /> },
  { title: 'Dry Waste', description: 'Do: keep paper, cardboard and metals clean. Don’t: contaminate with food.', icon: <Recycle size={18} /> },
  { title: 'E-Waste', description: 'Do: drop batteries and electronics at designated collection bins.', icon: <Factory size={18} /> },
  { title: 'Plastic Waste', description: 'Do: rinse and flatten packaging. Don’t: burn plastic materials.', icon: <Trash2 size={18} /> },
  { title: 'Hazardous Waste', description: 'Do: separate chemical or biomedical waste. Don’t: dump into regular bins.', icon: <ShieldAlert size={18} /> },
  { title: 'Composting', description: 'Do: turn organic food waste into nutrient-rich compost.', icon: <Sparkles size={18} /> },
  { title: 'Reduce Reuse Recycle', description: 'Do: repair, share and reuse before disposal.', icon: <ClipboardCheck size={18} /> },
  { title: 'Proper Bin Usage', description: 'Do: segregate by material type and color-coded bins.', icon: <Wind size={18} /> },
];

const AwarenessPage = () => (
  <div className="container dashboard-shell">
    <div className="page-header">
      <h2>Waste awareness</h2>
      <p className="text-muted">Learn practical steps to reduce waste and improve daily sorting.</p>
    </div>

    <div className="feature-grid">
      {cards.map((card) => (
        <div key={card.title} className="feature-card">
          <div className="icon-wrap">{card.icon}</div>
          <h3>{card.title}</h3>
          <p className="text-muted">{card.description}</p>
        </div>
      ))}
    </div>
  </div>
);

export default AwarenessPage;
