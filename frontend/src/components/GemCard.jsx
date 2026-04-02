import { useState } from 'react';

export default function GemCard({ gem, onOpen, onInquire }) {
  const [idx,     setIdx]    = useState(0);
  const [hovered, setHovered] = useState(false);
  const imgs = gem.images || [];

  const slide = (e, dir) => { e.stopPropagation(); setIdx(i => (i + dir + imgs.length) % imgs.length); };

  return (
    <div
      onClick={() => onOpen(gem)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:'#fff', borderRadius:20, overflow:'hidden',
        boxShadow: hovered ? '0 20px 48px rgba(14,165,233,0.14)' : '0 1px 4px rgba(0,0,0,0.07)',
        border: hovered ? '1px solid rgba(14,165,233,0.2)' : '1px solid #e2e8f0',
        transform: hovered ? 'translateY(-6px)' : 'none',
        transition:'all .35s cubic-bezier(.175,.885,.32,1.275)',
        cursor:'pointer',
      }}
    >
      {/* Image Slider */}
      <div style={{ height:'min(52vw,220px)', position:'relative', overflow:'hidden', background:'linear-gradient(135deg,#fdf2f8,#f0f9ff)' }}>
        <div style={{ display:'flex', height:'100%', transform:`translateX(-${idx*100}%)`, transition:'transform .5s cubic-bezier(.4,0,.2,1)' }}>
          {imgs.length > 0 ? imgs.map((src,i) => (
            <img key={i} src={src} alt={`${gem.name} ${i+1}`} style={{ width:'100%', height:'100%', objectFit:'contain', flexShrink:0, padding:'clamp(8px,3vw,16px)', background:'linear-gradient(135deg,#fdf2f8,#f0f9ff)' }} loading="lazy" />
          )) : (
            <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:52, flexShrink:0 }}>💎</div>
          )}
        </div>

        {imgs.length > 1 && <>
          <button onClick={e=>slide(e,-1)} style={{ position:'absolute', left:8, top:'50%', transform:'translateY(-50%)', background:'rgba(255,255,255,0.9)', border:'none', borderRadius:'50%', width:28, height:28, fontSize:15, fontWeight:700, cursor:'pointer', opacity: hovered?1:0, transition:'opacity .2s', display:'flex', alignItems:'center', justifyContent:'center', zIndex:4 }}>‹</button>
          <button onClick={e=>slide(e,1)}  style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', background:'rgba(255,255,255,0.9)', border:'none', borderRadius:'50%', width:28, height:28, fontSize:15, fontWeight:700, cursor:'pointer', opacity: hovered?1:0, transition:'opacity .2s', display:'flex', alignItems:'center', justifyContent:'center', zIndex:4 }}>›</button>
          <div style={{ position:'absolute', bottom:8, left:'50%', transform:'translateX(-50%)', display:'flex', gap:4, zIndex:4 }}>
            {imgs.map((_,i) => <button key={i} onClick={e=>{e.stopPropagation();setIdx(i);}} style={{ width:i===idx?16:5, height:5, borderRadius:99, background:i===idx?'#fff':'rgba(255,255,255,0.5)', border:'none', padding:0, cursor:'pointer', transition:'all .3s' }} />)}
          </div>
        </>}

        {/* Badges */}
        <div style={{ position:'absolute', top:10, left:10, display:'flex', gap:5, zIndex:4, flexWrap:'wrap' }}>
          <span style={{ padding:'4px 10px', borderRadius:99, fontSize:9, fontWeight:700, letterSpacing:'.5px', textTransform:'uppercase', ...(gem.badge==='precious' ? { background:'linear-gradient(135deg,#ffd700,#ffaa00)', color:'#7c3700' } : { background:'rgba(255,255,255,0.9)', color:'#64748b' }) }}>
            {gem.badge==='precious' ? '✦ Precious' : 'Semi'}
          </span>
          {gem.vedic && <span style={{ padding:'4px 10px', borderRadius:99, fontSize:9, fontWeight:700, textTransform:'uppercase', background:'linear-gradient(135deg,rgba(249,168,212,0.92),rgba(186,230,253,0.92))', color:'#0369a1' }}>🪐 Vedic</span>}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding:'clamp(14px,3vw,20px)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
          <div style={{ minWidth:0, flex:1 }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(16px,4vw,21px)', fontWeight:700, color:'#1e293b', lineHeight:1.15, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{gem.name}</div>
            <div style={{ fontSize:11, color:'#94a3b8', fontStyle:'italic', marginTop:1 }}>{gem.hindi}</div>
          </div>
          <div style={{ width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,rgba(249,168,212,0.15),rgba(186,230,253,0.15))', border:'1px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, flexShrink:0, marginLeft:8 }}>{gem.planet}</div>
        </div>

        <div style={{ fontSize:10, color:'#94a3b8', marginBottom:8, fontStyle:'italic' }}>{gem.scientific}</div>
        <p style={{ fontSize:12, color:'#475569', lineHeight:1.7, marginBottom:10, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{gem.desc}</p>

        <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginBottom:10 }}>
          {(gem.benefits||[]).slice(0,3).map(b => <span key={b} style={{ fontSize:9, padding:'3px 8px', background:'rgba(14,165,233,0.07)', color:'#0ea5e9', borderRadius:99, fontWeight:500 }}>{b}</span>)}
        </div>

        {/* Meta 2-col */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:10 }}>
          {[['Origin',(gem.specs?.Origin||'—').split(',')[0]],['Hardness',`${gem.hardness} Mohs`]].map(([l,v]) => (
            <div key={l} style={{ background:'#f8fafc', borderRadius:8, padding:'6px 10px' }}>
              <div style={{ fontSize:8, letterSpacing:'1px', textTransform:'uppercase', color:'#94a3b8', marginBottom:1 }}>{l}</div>
              <div style={{ fontSize:11, fontWeight:600, color:'#1e293b', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Mohs bar */}
        <div style={{ marginBottom:12 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
            <span style={{ fontSize:9, letterSpacing:'1px', textTransform:'uppercase', color:'#94a3b8' }}>Mohs Hardness</span>
            <span style={{ fontSize:11, fontWeight:600, color:'#0ea5e9' }}>{gem.hardness}/10</span>
          </div>
          <div style={{ height:3, background:'#e2e8f0', borderRadius:99, overflow:'hidden' }}>
            <div style={{ height:'100%', background:'linear-gradient(90deg,#e879a0,#0ea5e9)', borderRadius:99, width:`${(gem.hardness||0)*10}%` }} />
          </div>
        </div>

        {/* Price row */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:10, borderTop:'1px solid #f1f5f9' }}>
          <div style={{ minWidth:0 }}>
            <div style={{ fontSize:9, letterSpacing:'1px', textTransform:'uppercase', color:'#94a3b8', marginBottom:1 }}>₹/Carat</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(13px,3vw,17px)', fontWeight:700, background:'linear-gradient(135deg,#e879a0,#0ea5e9)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{gem.priceDisplay}</div>
          </div>
          <button onClick={e=>{e.stopPropagation();onInquire(gem.name);}}
            style={{ background:'linear-gradient(135deg,#e879a0,#0ea5e9)', color:'#fff', border:'none', padding:'8px 14px', borderRadius:99, fontSize:11, fontWeight:500, cursor:'pointer', flexShrink:0, marginLeft:8, transition:'transform .2s' }}
            onMouseEnter={e=>e.currentTarget.style.transform='scale(1.05)'}
            onMouseLeave={e=>e.currentTarget.style.transform=''}>
            Inquire →
          </button>
        </div>
      </div>
    </div>
  );
}
