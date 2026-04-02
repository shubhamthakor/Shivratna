import { useState, useEffect } from 'react';
import { toggleGem, deleteGem } from '../services/api';

const CAT_COLORS = { red:'#ef4444', blue:'#3b82f6', green:'#22c55e', yellow:'#eab308', white:'#64748b', purple:'#a855f7' };

export default function GemTable({ gems, onEdit, onDelete, onRefresh }) {
  const [search,    setSearch]    = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [toggling,  setToggling]  = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [deleting,  setDeleting]  = useState(null);
  const [w,         setW]         = useState(window.innerWidth);

  useEffect(() => { const fn=()=>setW(window.innerWidth); window.addEventListener('resize',fn); return()=>window.removeEventListener('resize',fn); },[]);
  const isMobile = w < 640;

  const filtered = gems.filter(g => {
    const matchCat = catFilter==='all' || g.category===catFilter;
    const q = search.toLowerCase();
    return matchCat && (!q || g.name?.toLowerCase().includes(q) || g.hindi?.toLowerCase().includes(q));
  });

  const handleToggle = async (id) => {
    setToggling(id);
    try { await toggleGem(id); onRefresh(); }
    catch (err) { alert(err.response?.data?.message || 'Toggle failed'); }
    finally { setToggling(null); }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try { await deleteGem(id); onRefresh(); onDelete(); setConfirmId(null); }
    catch (err) { alert(err.response?.data?.message || 'Delete failed'); }
    finally { setDeleting(null); }
  };

  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontSize:'clamp(20px,4vw,26px)', fontWeight:700, color:'#1e293b', marginBottom:4 }}>Manage Gems</h1>
        <p style={{ fontSize:13, color:'#64748b' }}>{filtered.length} of {gems.length} gems</p>
      </div>

      {/* Filters */}
      <div style={{ background:'#fff', borderRadius:14, padding:'12px 16px', border:'1px solid #e2e8f0', marginBottom:18, display:'flex', gap:10, flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ position:'relative', flex:1, minWidth:160 }}>
          <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', fontSize:13 }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search gems..."
            style={{ width:'100%', border:'1.5px solid #e2e8f0', borderRadius:9, padding:'8px 10px 8px 30px', fontSize:13, outline:'none', color:'#1e293b' }} />
        </div>
        <select value={catFilter} onChange={e=>setCatFilter(e.target.value)}
          style={{ border:'1.5px solid #e2e8f0', borderRadius:9, padding:'8px 12px', fontSize:13, color:'#1e293b', outline:'none', background:'#fff' }}>
          <option value="all">All Colors</option>
          {['red','blue','green','yellow','white','purple'].map(c=><option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
        </select>
      </div>

      {/* Mobile card view */}
      {isMobile ? (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign:'center', padding:40, color:'#94a3b8' }}>No gems found</div>
          ) : filtered.map(g => (
            <div key={g.id} style={{ background:'#fff', borderRadius:14, padding:16, border:'1px solid #e2e8f0', boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                <div style={{ width:44, height:44, borderRadius:10, background:'linear-gradient(135deg,#fdf2f8,#f0f9ff)', overflow:'hidden', flexShrink:0, border:'1px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {g.images?.[0] ? <img src={g.images[0]} alt={g.name} style={{ width:'100%', height:'100%', objectFit:'contain', padding:4 }} /> : <span style={{ fontSize:22 }}>💎</span>}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:600, fontSize:15, color:'#1e293b' }}>{g.name}</div>
                  <div style={{ fontSize:11, color:'#94a3b8', fontStyle:'italic' }}>{g.hindi}</div>
                </div>
                <span style={{ padding:'4px 10px', borderRadius:99, fontSize:10, fontWeight:600, background: g.isActive?'rgba(34,197,94,0.1)':'rgba(239,68,68,0.1)', color: g.isActive?'#16a34a':'#dc2626', flexShrink:0 }}>
                  {g.isActive?'Live':'Hidden'}
                </span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                <div>
                  <div style={{ fontSize:12, fontWeight:600, color:'#0ea5e9' }}>{g.priceDisplay}</div>
                  <div style={{ fontSize:10, color:'#94a3b8' }}>{g.unit}</div>
                </div>
                <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:99, background:`${CAT_COLORS[g.category]}18`, fontSize:11, fontWeight:500, color:CAT_COLORS[g.category] }}>
                  <span style={{ width:7, height:7, borderRadius:'50%', background:CAT_COLORS[g.category] }} />{g.category}
                </span>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={()=>handleToggle(g.id)} disabled={toggling===g.id}
                  style={{ flex:1, padding:'8px 0', borderRadius:9, border:'1px solid #e2e8f0', background:'#fff', fontSize:12, fontWeight:500, cursor:'pointer', color:g.isActive?'#16a34a':'#dc2626' }}>
                  {toggling===g.id?'...':g.isActive?'Hide':'Show'}
                </button>
                <button onClick={()=>onEdit(g)} style={{ flex:1, padding:'8px 0', borderRadius:9, border:'1px solid rgba(14,165,233,0.3)', background:'rgba(14,165,233,0.05)', fontSize:12, fontWeight:500, cursor:'pointer', color:'#0ea5e9' }}>✏️ Edit</button>
                <button onClick={()=>setConfirmId(g.id)} style={{ flex:1, padding:'8px 0', borderRadius:9, border:'1px solid rgba(239,68,68,0.2)', background:'rgba(239,68,68,0.05)', fontSize:12, fontWeight:500, cursor:'pointer', color:'#dc2626' }}>🗑️ Del</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Desktop table */
        <div style={{ background:'#fff', borderRadius:16, border:'1px solid #e2e8f0', overflow:'hidden', boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', minWidth:700 }}>
              <thead>
                <tr>
                  {['Gem','Category','Price (₹/ct)','Hardness','Status','Actions'].map(h => (
                    <th key={h} style={{ padding:'12px 14px', textAlign:'left', fontSize:11, fontWeight:600, color:'#64748b', letterSpacing:'1px', textTransform:'uppercase', borderBottom:'2px solid #e2e8f0', background:'#f8fafc', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length===0 ? (
                  <tr><td colSpan={6} style={{ padding:40, textAlign:'center', color:'#94a3b8', fontSize:14 }}>No gems found.</td></tr>
                ) : filtered.map(g => (
                  <tr key={g.id} style={{ transition:'background .15s' }} onMouseEnter={e=>e.currentTarget.style.background='#f8fafc'} onMouseLeave={e=>e.currentTarget.style.background=''}>
                    <td style={{ padding:'12px 14px', borderBottom:'1px solid #f1f5f9' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:40, height:40, borderRadius:9, background:'linear-gradient(135deg,#fdf2f8,#f0f9ff)', overflow:'hidden', flexShrink:0, border:'1px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'center' }}>
                          {g.images?.[0]?<img src={g.images[0]} alt={g.name} style={{ width:'100%', height:'100%', objectFit:'contain', padding:3 }}/>:<span style={{ fontSize:18 }}>💎</span>}
                        </div>
                        <div>
                          <div style={{ fontWeight:600, fontSize:14, color:'#1e293b' }}>{g.name}</div>
                          <div style={{ fontSize:11, color:'#94a3b8', fontStyle:'italic' }}>{g.hindi}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding:'12px 14px', borderBottom:'1px solid #f1f5f9' }}>
                      <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:99, background:`${CAT_COLORS[g.category]}18`, fontSize:12, fontWeight:500, color:CAT_COLORS[g.category] }}>
                        <span style={{ width:7, height:7, borderRadius:'50%', background:CAT_COLORS[g.category] }}/>{g.category}
                      </span>
                    </td>
                    <td style={{ padding:'12px 14px', borderBottom:'1px solid #f1f5f9' }}>
                      <div style={{ fontSize:13, fontWeight:600, color:'#0ea5e9' }}>{g.priceDisplay}</div>
                    </td>
                    <td style={{ padding:'12px 14px', borderBottom:'1px solid #f1f5f9' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                        <div style={{ flex:1, height:4, background:'#f1f5f9', borderRadius:99, minWidth:50 }}>
                          <div style={{ height:'100%', background:'linear-gradient(90deg,#e879a0,#0ea5e9)', borderRadius:99, width:`${(g.hardness||0)*10}%` }}/>
                        </div>
                        <span style={{ fontSize:12, fontWeight:600, color:'#334155' }}>{g.hardness}</span>
                      </div>
                    </td>
                    <td style={{ padding:'12px 14px', borderBottom:'1px solid #f1f5f9' }}>
                      <button onClick={()=>handleToggle(g.id)} disabled={toggling===g.id}
                        style={{ padding:'5px 12px', borderRadius:99, fontSize:11, fontWeight:600, border:'none', cursor:'pointer', background:g.isActive?'rgba(34,197,94,0.1)':'rgba(239,68,68,0.1)', color:g.isActive?'#16a34a':'#dc2626' }}>
                        {toggling===g.id?'...':g.isActive?'● Live':'○ Hidden'}
                      </button>
                    </td>
                    <td style={{ padding:'12px 14px', borderBottom:'1px solid #f1f5f9' }}>
                      <div style={{ display:'flex', gap:7 }}>
                        <button onClick={()=>onEdit(g)} style={{ padding:'6px 12px', borderRadius:7, border:'1px solid #e2e8f0', background:'#fff', fontSize:12, fontWeight:500, color:'#0ea5e9', cursor:'pointer' }}>✏️ Edit</button>
                        <button onClick={()=>setConfirmId(g.id)} style={{ padding:'6px 12px', borderRadius:7, border:'1px solid #fecaca', background:'#fff', fontSize:12, fontWeight:500, color:'#dc2626', cursor:'pointer' }}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {confirmId && (
        <div onClick={e=>{if(e.target===e.currentTarget)setConfirmId(null);}}
          style={{ position:'fixed', inset:0, background:'rgba(15,23,42,0.5)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999, padding:20 }}>
          <div style={{ background:'#fff', borderRadius:20, padding:'clamp(24px,5vw,36px)', maxWidth:380, width:'100%', textAlign:'center', boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize:44, marginBottom:14 }}>🗑️</div>
            <h3 style={{ fontSize:19, fontWeight:700, color:'#1e293b', marginBottom:8 }}>Delete Gem?</h3>
            <p style={{ fontSize:14, color:'#64748b', marginBottom:24 }}>
              Delete <strong style={{ color:'#1e293b' }}>{gems.find(g=>g.id===confirmId)?.name}</strong>? This will immediately remove it from your website.
            </p>
            <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
              <button onClick={()=>setConfirmId(null)} style={{ padding:'11px 22px', borderRadius:10, border:'1.5px solid #e2e8f0', background:'#fff', fontSize:14, fontWeight:500, cursor:'pointer', color:'#475569' }}>Cancel</button>
              <button onClick={()=>handleDelete(confirmId)} disabled={deleting===confirmId} style={{ padding:'11px 22px', borderRadius:10, border:'none', background:'#ef4444', fontSize:14, fontWeight:600, cursor:'pointer', color:'#fff', opacity:deleting===confirmId?0.7:1 }}>
                {deleting===confirmId?'Deleting...':'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
