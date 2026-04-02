import { useState, useMemo, useEffect } from 'react';
import GemCard from './GemCard';

const FILTERS = [
  { id:'all',    label:'All' },
  { id:'red',    label:'Red',    dot:'#ef4444' },
  { id:'blue',   label:'Blue',   dot:'#3b82f6' },
  { id:'green',  label:'Green',  dot:'#22c55e' },
  { id:'yellow', label:'Yellow', dot:'#eab308' },
  { id:'white',  label:'White',  dot:'#cbd5e1', dotBorder:'1px solid #94a3b8' },
  { id:'purple', label:'Purple', dot:'#a855f7' },
];

const Skeleton = () => (
  <div style={{ background:'#fff', borderRadius:20, overflow:'hidden', border:'1px solid #e2e8f0' }}>
    <div style={{ height:200, background:'linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)', backgroundSize:'200% 100%', animation:'shimmer 1.5s infinite' }} />
    <div style={{ padding:16 }}>
      {[80,60,90].map((w,i) => <div key={i} style={{ height:12, background:'#f1f5f9', borderRadius:6, marginBottom:8, width:`${w}%` }} />)}
    </div>
    <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
  </div>
);

export default function GemGrid({ gems, loading, error, onOpen, onInquire }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [cols,   setCols]   = useState(3);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setCols(w < 480 ? 1 : w < 768 ? 2 : w < 1100 ? 2 : 3);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const filtered = useMemo(() => gems.filter(g => {
    const matchCat  = filter === 'all' || g.category === filter;
    const q         = search.toLowerCase();
    const matchSrch = !q || g.name?.toLowerCase().includes(q) || g.hindi?.toLowerCase().includes(q) || (g.benefits||[]).some(b => b.toLowerCase().includes(q));
    return matchCat && matchSrch;
  }), [gems, filter, search]);

  return (
    <div id="collection" style={{ background:'#fafafa' }}>
      <div style={{ maxWidth:1300, margin:'0 auto', padding:'clamp(48px,8vw,96px) clamp(16px,4vw,32px)' }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:'clamp(32px,6vw,56px)' }}>
          <span style={{ display:'inline-block', fontSize:11, letterSpacing:'2.5px', textTransform:'uppercase', color:'#e879a0', fontWeight:500, marginBottom:12 }}>Our Collection</span>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(24px,5vw,44px)', fontWeight:700, color:'#1e293b', lineHeight:1.2, marginBottom:12 }}>
            Precious & Semi-Precious<br />
            <em style={{ fontStyle:'italic', background:'linear-gradient(135deg,#e879a0,#0ea5e9)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Gemstones — ₹ Per Carat</em>
          </h2>
          <p style={{ fontSize:'clamp(13px,2.5vw,15px)', color:'#475569', maxWidth:520, margin:'0 auto', lineHeight:1.8 }}>GIA & Gemval 2025–26 market data. 1 Ratti = 0.91 Carat.</p>
        </div>

        {/* Search */}
        <div style={{ position:'relative', maxWidth:420, margin:'0 auto 24px' }}>
          <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:15, pointerEvents:'none' }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search gemstone..."
            style={{ width:'100%', background:'#fff', border:'1.5px solid #e2e8f0', borderRadius:99, padding:'11px 16px 11px 42px', fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'#1e293b', outline:'none', boxShadow:'0 1px 3px rgba(0,0,0,0.06)', transition:'border-color .3s' }}
            onFocus={e=>e.target.style.borderColor='#0ea5e9'} onBlur={e=>e.target.style.borderColor='#e2e8f0'} />
        </div>

        {/* Filter chips — horizontally scrollable on mobile */}
        <div style={{ display:'flex', gap:8, marginBottom:32, overflowX:'auto', paddingBottom:4, justifyContent: window.innerWidth<768?'flex-start':'center', scrollbarWidth:'none' }}>
          <style>{`.filter-scroll::-webkit-scrollbar{display:none}`}</style>
          {FILTERS.map(f => (
            <button key={f.id} onClick={()=>setFilter(f.id)}
              style={{ background: filter===f.id ? 'linear-gradient(135deg,#e879a0,#0ea5e9)' : '#fff', border: filter===f.id ? 'none' : '1.5px solid #e2e8f0', padding:'8px 16px', borderRadius:99, fontSize:12, fontWeight:500, color: filter===f.id ? '#fff' : '#475569', cursor:'pointer', transition:'all .25s', display:'flex', alignItems:'center', gap:6, flexShrink:0, boxShadow: filter===f.id ? '0 4px 14px rgba(14,165,233,0.3)' : '0 1px 3px rgba(0,0,0,0.05)' }}>
              {f.dot && <span style={{ width:9, height:9, borderRadius:'50%', background:f.dot, border:f.dotBorder||'1px solid rgba(0,0,0,0.1)', flexShrink:0 }} />}
              {f.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display:'grid', gridTemplateColumns:`repeat(${cols},1fr)`, gap:'clamp(12px,2vw,24px)' }}>
            {Array(cols*2).fill(0).map((_,i) => <Skeleton key={i} />)}
          </div>
        ) : error ? (
          <div style={{ textAlign:'center', padding:'60px 20px', color:'#94a3b8' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>⚠️</div>
            <p style={{ fontSize:14 }}>{error}</p>
            <p style={{ fontSize:12, marginTop:6 }}>Make sure backend is running on port 5000.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 20px', color:'#94a3b8' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
            <p>No gems found. Try a different search or filter.</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:`repeat(${cols},1fr)`, gap:'clamp(12px,2vw,24px)' }}>
            {filtered.map(gem => <GemCard key={gem.id} gem={gem} onOpen={onOpen} onInquire={onInquire} />)}
          </div>
        )}
      </div>
    </div>
  );
}
