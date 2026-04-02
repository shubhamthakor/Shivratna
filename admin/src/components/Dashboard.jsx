import { useEffect, useState } from 'react';

const CATS = ['red','blue','green','yellow','white','purple'];
const CAT_COLORS = { red:'#ef4444', blue:'#3b82f6', green:'#22c55e', yellow:'#eab308', white:'#94a3b8', purple:'#a855f7' };
const CAT_LABELS = { red:'Red', blue:'Blue', green:'Green', yellow:'Yellow', white:'White', purple:'Purple' };

export default function Dashboard({ gems }) {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => { const fn=()=>setW(window.innerWidth); window.addEventListener('resize',fn); return()=>window.removeEventListener('resize',fn); },[]);
  const isMobile = w < 640;

  const total    = gems.length;
  const active   = gems.filter(g => g.isActive).length;
  const precious = gems.filter(g => g.badge==='precious').length;
  const vedic    = gems.filter(g => g.vedic).length;

  const stats = [
    { label:'Total Gems',    value:total,    icon:'💎', color:'#0ea5e9', bg:'rgba(14,165,233,0.08)'   },
    { label:'Live on Site',  value:active,   icon:'✅', color:'#22c55e', bg:'rgba(34,197,94,0.08)'    },
    { label:'Precious Gems', value:precious, icon:'⭐', color:'#f59e0b', bg:'rgba(245,158,11,0.08)'   },
    { label:'Vedic Stones',  value:vedic,    icon:'🪐', color:'#8b5cf6', bg:'rgba(139,92,246,0.08)'   },
  ];

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:'clamp(20px,4vw,26px)', fontWeight:700, color:'#1e293b', marginBottom:4 }}>Dashboard</h1>
        <p style={{ fontSize:13, color:'#64748b' }}>Overview of your Shivratna Gemstone collection</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display:'grid', gridTemplateColumns: isMobile?'1fr 1fr':'repeat(4,1fr)', gap:'clamp(10px,2vw,18px)', marginBottom:'clamp(18px,3vw,28px)' }}>
        {stats.map(s => (
          <div key={s.label} style={{ background:'#fff', borderRadius:16, padding:'clamp(14px,3vw,22px)', border:'1px solid #e2e8f0', boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ width:40, height:40, borderRadius:11, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, marginBottom:12 }}>{s.icon}</div>
            <div style={{ fontSize:'clamp(24px,4vw,32px)', fontWeight:700, color:s.color, lineHeight:1 }}>{s.value}</div>
            <div style={{ fontSize:12, color:'#64748b', marginTop:5 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns: isMobile?'1fr':'1fr 1fr', gap:'clamp(12px,2vw,22px)' }}>
        {/* Category breakdown */}
        <div style={{ background:'#fff', borderRadius:16, padding:'clamp(16px,3vw,26px)', border:'1px solid #e2e8f0', boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize:15, fontWeight:600, color:'#1e293b', marginBottom:18 }}>Gems by Color</h3>
          {CATS.map(cat => {
            const count = gems.filter(g=>g.category===cat).length;
            return (
              <div key={cat} style={{ marginBottom:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:5 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                    <span style={{ width:9, height:9, borderRadius:'50%', background:CAT_COLORS[cat], display:'inline-block' }} />
                    <span style={{ fontSize:13, fontWeight:500, color:'#334155' }}>{CAT_LABELS[cat]}</span>
                  </div>
                  <span style={{ fontSize:13, fontWeight:600, color:'#1e293b' }}>{count}</span>
                </div>
                <div style={{ height:5, background:'#f1f5f9', borderRadius:99, overflow:'hidden' }}>
                  <div style={{ height:'100%', background:CAT_COLORS[cat], borderRadius:99, width:total?`${(count/total)*100}%`:'0%', opacity:0.7, transition:'width .6s' }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Gem list */}
        <div style={{ background:'#fff', borderRadius:16, padding:'clamp(16px,3vw,26px)', border:'1px solid #e2e8f0', boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize:15, fontWeight:600, color:'#1e293b', marginBottom:18 }}>Collection Overview</h3>
          <div style={{ maxHeight:280, overflowY:'auto' }}>
            {gems.slice(0,10).map(g => (
              <div key={g.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 0', borderBottom:'1px solid #f1f5f9' }}>
                <div style={{ width:34, height:34, borderRadius:8, background:'linear-gradient(135deg,#fdf2f8,#f0f9ff)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0, overflow:'hidden', border:'1px solid #e2e8f0' }}>
                  {g.images?.[0] ? <img src={g.images[0]} alt={g.name} style={{ width:'100%', height:'100%', objectFit:'contain', padding:3 }} /> : '💎'}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:'#1e293b', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{g.name}</div>
                  <div style={{ fontSize:11, color:'#94a3b8', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{g.priceDisplay}</div>
                </div>
                <span style={{ fontSize:10, padding:'3px 8px', borderRadius:99, fontWeight:600, flexShrink:0, background:g.isActive?'rgba(34,197,94,0.1)':'rgba(239,68,68,0.1)', color:g.isActive?'#16a34a':'#dc2626' }}>
                  {g.isActive?'Live':'Hidden'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
