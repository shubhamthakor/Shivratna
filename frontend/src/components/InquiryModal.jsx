import { useState, useEffect } from 'react';
import { submitInquiry } from '../services/api';

export default function InquiryModal({ gemName, onClose }) {
  const [form,    setForm]    = useState({ name:'', phone:'', carat:'Under 1 carat', message:'' });
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [error,   setError]   = useState('');
  const [w,       setW]       = useState(window.innerWidth);

  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener('resize', fn);
    // Prevent body scroll when modal open
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('resize', fn); document.body.style.overflow = ''; };
  }, []);

  if (!gemName) return null;
  const isMobile = w < 640;

  const submit = async () => {
    if (!form.name || !form.phone) { setError('Please fill in name and phone number.'); return; }
    setLoading(true); setError('');
    try {
      await submitInquiry({ gemName, ...form, source:'gem-inquiry' });
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send. Please try WhatsApp instead.');
    } finally { setLoading(false); }
  };

  const inp = { width:'100%', background:'#f8fafc', border:'1.5px solid #e2e8f0', borderRadius:11, padding:'11px 14px', fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'#1e293b', outline:'none', marginTop:5 };

  return (
    <div onClick={e=>{if(e.target===e.currentTarget)onClose();}}
      style={{ display:'flex', position:'fixed', inset:0, zIndex:600, background:'rgba(15,23,42,0.7)', backdropFilter:'blur(8px)', alignItems: isMobile?'flex-end':'center', justifyContent:'center', padding: isMobile?0:20 }}>
      <div style={{ background:'#fff', borderRadius: isMobile?'20px 20px 0 0':22, maxWidth:480, width:'100%', padding: isMobile?'28px 20px 32px':'36px', boxShadow:'0 32px 80px rgba(0,0,0,0.18)', maxHeight: isMobile?'88vh':'90vh', overflowY:'auto', animation: isMobile?'slideUp .3s ease':'fadeIn .3s ease' }}>
        <style>{`@keyframes slideUp{from{transform:translateY(40px);opacity:0}to{transform:translateY(0);opacity:1}}@keyframes fadeIn{from{opacity:0;transform:scale(0.97)}to{opacity:1;transform:scale(1)}}`}</style>

        {/* Pull handle on mobile */}
        {isMobile && <div style={{ width:36, height:4, background:'#e2e8f0', borderRadius:2, margin:'0 auto 20px' }} />}

        {done ? (
          <div style={{ textAlign:'center', padding:'10px 0' }}>
            <div style={{ fontSize:52, marginBottom:14 }}>✅</div>
            <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, marginBottom:10 }}>Inquiry Sent!</h3>
            <p style={{ fontSize:14, color:'#475569', lineHeight:1.8, marginBottom:20 }}>
              Thank you <strong>{form.name}</strong>! Hemal Thakor will contact you on <strong>{form.phone}</strong> within 24 hours.
            </p>
            <a href="https://wa.me/919825899807" target="_blank" rel="noreferrer"
              style={{ display:'inline-flex', alignItems:'center', gap:8, background:'#25D366', color:'#fff', padding:'12px 22px', borderRadius:99, textDecoration:'none', fontWeight:500, fontSize:14, marginBottom:14 }}>
              💬 WhatsApp Now
            </a>
            <br />
            <button onClick={onClose} style={{ background:'none', border:'none', color:'#94a3b8', cursor:'pointer', fontSize:13, marginTop:8 }}>Close</button>
          </div>
        ) : (
          <>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18 }}>
              <div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize: isMobile?19:22, fontWeight:700, marginBottom:2 }}>{gemName}</div>
                <div style={{ fontSize:12, color:'#94a3b8' }}>Hemal Thakor responds within 24 hours</div>
              </div>
              <button onClick={onClose} style={{ background:'#f1f5f9', border:'none', borderRadius:'50%', width:32, height:32, cursor:'pointer', fontSize:15, color:'#64748b', flexShrink:0 }}>✕</button>
            </div>
            <div style={{ borderBottom:'1px solid #e2e8f0', marginBottom:18 }} />

            {error && <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:10, padding:'10px 14px', marginBottom:14, color:'#dc2626', fontSize:13 }}>⚠️ {error}</div>}

            {[['Your Name *','name','text'],['Mobile / WhatsApp *','phone','tel']].map(([label,key,type]) => (
              <div key={key} style={{ marginBottom:14 }}>
                <label style={{ fontSize:12, fontWeight:500, color:'#1e293b' }}>{label}</label>
                <input style={inp} type={type} value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} />
              </div>
            ))}
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, fontWeight:500, color:'#1e293b' }}>Carat Weight Needed</label>
              <select style={inp} value={form.carat} onChange={e=>setForm(f=>({...f,carat:e.target.value}))}>
                {['Under 1 carat','1–2 carats','2–5 carats','5–10 carats','10+ carats (Trade/Bulk)'].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <div style={{ marginBottom:20 }}>
              <label style={{ fontSize:12, fontWeight:500, color:'#1e293b' }}>Message (optional)</label>
              <textarea style={{ ...inp, height:72, resize:'none' }} value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} placeholder="Purpose, budget, certificate needed..." />
            </div>

            <button onClick={submit} disabled={loading}
              style={{ width:'100%', background:'linear-gradient(135deg,#e879a0,#0ea5e9)', color:'#fff', border:'none', padding:'14px 0', borderRadius:99, fontSize:14, fontWeight:500, cursor: loading?'not-allowed':'pointer', opacity: loading?0.75:1 }}>
              {loading ? '⏳ Sending...' : 'Send Inquiry ✦'}
            </button>
            <p style={{ textAlign:'center', marginTop:14, fontSize:12, color:'#94a3b8' }}>
              Or WhatsApp: <a href="https://wa.me/919825899807" target="_blank" rel="noreferrer" style={{ color:'#25D366', fontWeight:600 }}>+91 98258 99807</a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
