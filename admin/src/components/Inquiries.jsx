import { useState, useEffect, useCallback } from 'react';
import API from '../services/api';

const STATUS_COLORS = {
  new:     { bg:'rgba(14,165,233,0.1)',  color:'#0369a1', label:'🔵 New'     },
  read:    { bg:'rgba(100,116,139,0.1)', color:'#475569', label:'👁 Read'    },
  replied: { bg:'rgba(34,197,94,0.1)',   color:'#16a34a', label:'✅ Replied'  },
  closed:  { bg:'rgba(239,68,68,0.1)',   color:'#dc2626', label:'🔒 Closed'  },
};

function timeAgo(date) {
  const s = Math.floor((new Date()-new Date(date))/1000);
  if(s<60) return 'just now';
  if(s<3600) return `${Math.floor(s/60)}m ago`;
  if(s<86400) return `${Math.floor(s/3600)}h ago`;
  return new Date(date).toLocaleDateString('en-IN',{day:'numeric',month:'short'});
}

export default function Inquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [filter,    setFilter]    = useState('all');
  const [selected,  setSelected]  = useState(null);
  const [notes,     setNotes]     = useState('');
  const [saving,    setSaving]    = useState(false);
  const [total,     setTotal]     = useState(0);
  const [unread,    setUnread]    = useState(0);
  const [w,         setW]         = useState(window.innerWidth);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => { const fn=()=>setW(window.innerWidth); window.addEventListener('resize',fn); return()=>window.removeEventListener('resize',fn); },[]);
  const isMobile = w < 768;

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/inquiries', { params:{ status:filter } });
      setInquiries(data.inquiries||[]); setTotal(data.total||0); setUnread(data.unread||0);
    } catch(err){ console.error(err); } finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { fetchInquiries(); }, [fetchInquiries]);

  const openInquiry = async (inq) => {
    setSelected(inq); setNotes(inq.notes||''); setShowDetail(true);
    if(inq.status==='new') {
      try { await API.patch(`/inquiries/${inq._id}/read`); setInquiries(p=>p.map(i=>i._id===inq._id?{...i,status:'read'}:i)); setUnread(u=>Math.max(0,u-1)); }
      catch{}
    }
  };

  const updateStatus = async (status) => {
    if(!selected) return; setSaving(true);
    try { const {data}=await API.patch(`/inquiries/${selected._id}/status`,{status,notes}); setSelected(data.inquiry); setInquiries(p=>p.map(i=>i._id===data.inquiry._id?data.inquiry:i)); }
    catch{ alert('Update failed'); } finally{ setSaving(false); }
  };

  const deleteInquiry = async (id) => {
    if(!window.confirm('Delete this inquiry?')) return;
    try { await API.delete(`/inquiries/${id}`); setInquiries(p=>p.filter(i=>i._id!==id)); if(selected?._id===id){setSelected(null);setShowDetail(false);} }
    catch{ alert('Delete failed'); }
  };

  const FILTERS = ['all','new','read','replied','closed'];
  const filterBar = (
    <div style={{ display:'flex', gap:7, marginBottom:14, overflowX:'auto', paddingBottom:2 }}>
      {FILTERS.map(f=>(
        <button key={f} onClick={()=>setFilter(f)} style={{ padding:'7px 14px', borderRadius:99, fontSize:11, fontWeight:500, border:'none', cursor:'pointer', flexShrink:0, transition:'all .2s', fontFamily:'Inter,sans-serif',
          background:filter===f?'linear-gradient(135deg,#e879a0,#0ea5e9)':'#fff',
          color:filter===f?'#fff':'#475569', boxShadow:filter===f?'0 4px 12px rgba(14,165,233,0.25)':'0 1px 3px rgba(0,0,0,0.06)', border:filter===f?'none':'1px solid #e2e8f0' }}>
          {f==='all'?`All (${total})`:f.charAt(0).toUpperCase()+f.slice(1)}
        </button>
      ))}
    </div>
  );

  const InquiryCard = ({ inq }) => (
    <div onClick={()=>openInquiry(inq)} style={{ background:'#fff', borderRadius:12, padding:14, border: selected?._id===inq._id?'2px solid #0ea5e9':'1px solid #e2e8f0', cursor:'pointer', transition:'all .15s', marginBottom:10 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, flex:1, minWidth:0 }}>
          <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#fdf2f8,#f0f9ff)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:700, color:'#e879a0', flexShrink:0, border:'1px solid #e2e8f0' }}>
            {inq.name?.charAt(0)?.toUpperCase()}
          </div>
          <div style={{ minWidth:0 }}>
            <div style={{ fontWeight:600, fontSize:14, color:'#1e293b', display:'flex', alignItems:'center', gap:5 }}>
              {inq.name} {inq.status==='new'&&<span style={{ width:6,height:6,background:'#0ea5e9',borderRadius:'50%',display:'inline-block' }}/>}
            </div>
            <div style={{ fontSize:12, color:'#94a3b8' }}>{inq.gemName}</div>
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:5, flexShrink:0 }}>
          <span style={{ fontSize:9, padding:'3px 8px', borderRadius:99, fontWeight:600, background:STATUS_COLORS[inq.status]?.bg, color:STATUS_COLORS[inq.status]?.color }}>{STATUS_COLORS[inq.status]?.label}</span>
          <span style={{ fontSize:11, color:'#94a3b8' }}>{timeAgo(inq.createdAt)}</span>
        </div>
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <a href={`tel:${inq.phone}`} onClick={e=>e.stopPropagation()} style={{ fontSize:13, color:'#0ea5e9', fontWeight:500, textDecoration:'none' }}>{inq.phone}</a>
        <div style={{ display:'flex', gap:6 }}>
          <a href={`https://wa.me/${inq.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{ padding:'4px 8px', borderRadius:7, background:'rgba(37,211,102,0.1)', border:'1px solid rgba(37,211,102,0.2)', color:'#16a34a', fontSize:12, textDecoration:'none' }}>💬</a>
          <button onClick={e=>{e.stopPropagation();deleteInquiry(inq._id);}} style={{ padding:'4px 8px', borderRadius:7, background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.15)', color:'#dc2626', fontSize:12, cursor:'pointer' }}>🗑️</button>
        </div>
      </div>
    </div>
  );

  const DetailPanel = () => selected ? (
    <div style={{ background:'#fff', borderRadius:16, border:'1px solid #e2e8f0', padding:20, boxShadow:'0 4px 16px rgba(0,0,0,0.06)', overflowY:'auto', flex:1 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
        <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:700 }}>Inquiry Details</h3>
        {isMobile && <button onClick={()=>setShowDetail(false)} style={{ background:'#f1f5f9', border:'none', borderRadius:'50%', width:28, height:28, cursor:'pointer', fontSize:14 }}>✕</button>}
      </div>

      <div style={{ background:'linear-gradient(135deg,#fdf2f8,#f0f9ff)', borderRadius:12, padding:14, marginBottom:16 }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, marginBottom:6 }}>{selected.gemName}</div>
        <span style={{ fontSize:11, padding:'4px 10px', borderRadius:99, fontWeight:600, background:STATUS_COLORS[selected.status]?.bg, color:STATUS_COLORS[selected.status]?.color }}>
          {STATUS_COLORS[selected.status]?.label}
        </span>
      </div>

      {[['👤 Name',selected.name],['📞 Phone',selected.phone],['📧 Email',selected.email||'—'],['💎 Carat',selected.carat||'—'],['🕐 Received',new Date(selected.createdAt).toLocaleString('en-IN')]].map(([label,val])=>(
        <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:'1px solid #f1f5f9', fontSize:13, flexWrap:'wrap', gap:4 }}>
          <span style={{ color:'#64748b' }}>{label}</span>
          <span style={{ fontWeight:500, color:'#1e293b', textAlign:'right', wordBreak:'break-word' }}>{val}</span>
        </div>
      ))}

      {selected.message && (
        <div style={{ marginTop:14, marginBottom:14 }}>
          <div style={{ fontSize:10, letterSpacing:'1px', textTransform:'uppercase', color:'#94a3b8', marginBottom:7 }}>Message</div>
          <div style={{ background:'#f8fafc', borderRadius:9, padding:12, fontSize:13, color:'#334155', lineHeight:1.7 }}>{selected.message}</div>
        </div>
      )}

      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:10, letterSpacing:'1px', textTransform:'uppercase', color:'#94a3b8', marginBottom:7 }}>Your Notes</div>
        <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Add private notes..." style={{ width:'100%', background:'#f8fafc', border:'1.5px solid #e2e8f0', borderRadius:9, padding:11, fontSize:13, color:'#1e293b', outline:'none', resize:'none', height:70, fontFamily:'Inter,sans-serif' }} />
      </div>

      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:10, letterSpacing:'1px', textTransform:'uppercase', color:'#94a3b8', marginBottom:9 }}>Update Status</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7 }}>
          {['read','replied','closed','new'].map(s=>(
            <button key={s} onClick={()=>updateStatus(s)} disabled={saving||selected.status===s} style={{ padding:'9px 0', borderRadius:9, border:'1px solid #e2e8f0', fontSize:12, fontWeight:500, cursor:selected.status===s?'default':'pointer', fontFamily:'Inter,sans-serif', background:selected.status===s?STATUS_COLORS[s]?.bg:'#fff', color:selected.status===s?STATUS_COLORS[s]?.color:'#475569', opacity:saving?0.7:1 }}>
              {STATUS_COLORS[s]?.label}
            </button>
          ))}
        </div>
      </div>

      <button onClick={()=>updateStatus(selected.status)} disabled={saving} style={{ width:'100%', background:'linear-gradient(135deg,#e879a0,#0ea5e9)', color:'#fff', border:'none', padding:'11px 0', borderRadius:10, fontSize:13, fontWeight:600, cursor:'pointer', marginBottom:10, fontFamily:'Inter,sans-serif', opacity:saving?0.7:1 }}>
        {saving?'Saving...':'💾 Save Notes'}
      </button>

      <div style={{ display:'flex', gap:8 }}>
        <a href={`https://wa.me/${selected.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, background:'#25D366', color:'#fff', padding:'10px 0', borderRadius:10, textDecoration:'none', fontSize:13, fontWeight:500 }}>💬 WhatsApp</a>
        {selected.email && <a href={`mailto:${selected.email}`} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, background:'#0ea5e9', color:'#fff', padding:'10px 0', borderRadius:10, textDecoration:'none', fontSize:13, fontWeight:500 }}>📧 Email</a>}
      </div>
    </div>
  ) : (
    <div style={{ background:'#fff', borderRadius:16, border:'1px solid #e2e8f0', padding:40, textAlign:'center', color:'#94a3b8', flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
      <div style={{ fontSize:40, marginBottom:12 }}>📬</div>
      <p style={{ fontSize:14 }}>Select an inquiry to view details</p>
    </div>
  );

  return (
    <div style={{ height:'calc(100vh - 110px)', display:'flex', flexDirection:'column' }}>
      <div style={{ marginBottom:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4, flexWrap:'wrap', gap:8 }}>
          <h1 style={{ fontSize:'clamp(18px,4vw,26px)', fontWeight:700, color:'#1e293b', display:'flex', alignItems:'center', gap:8 }}>
            Inquiries {unread>0&&<span style={{ background:'#0ea5e9', color:'#fff', fontSize:12, fontWeight:700, padding:'2px 8px', borderRadius:99 }}>{unread}</span>}
          </h1>
          <button onClick={fetchInquiries} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:8, padding:'7px 12px', fontSize:12, cursor:'pointer', color:'#475569', fontFamily:'Inter,sans-serif' }}>🔄 Refresh</button>
        </div>
        <p style={{ fontSize:13, color:'#64748b' }}>{total} total inquiries</p>
      </div>
      {filterBar}

      {/* Mobile: show detail as overlay */}
      {isMobile && showDetail && selected ? (
        <div style={{ position:'fixed', inset:0, background:'#fff', zIndex:300, padding:'20px 16px', overflowY:'auto', display:'flex', flexDirection:'column' }}>
          <DetailPanel />
        </div>
      ) : (
        <div style={{ display:'flex', gap:20, flex:1, minHeight:0, overflow:'hidden' }}>
          {/* List */}
          <div style={{ flex: isMobile?1:'none', width: isMobile?'100%':380, overflowY:'auto', flexShrink:0 }}>
            {loading ? (
              <div style={{ textAlign:'center', padding:40, color:'#94a3b8' }}>Loading...</div>
            ) : inquiries.length===0 ? (
              <div style={{ textAlign:'center', padding:40, color:'#94a3b8' }}><div style={{ fontSize:36, marginBottom:10 }}>📭</div><p>No {filter!=='all'?filter:''} inquiries yet</p></div>
            ) : (
              inquiries.map(inq=><InquiryCard key={inq._id} inq={inq} />)
            )}
          </div>
          {/* Detail — only on desktop */}
          {!isMobile && <DetailPanel />}
        </div>
      )}
    </div>
  );
}
