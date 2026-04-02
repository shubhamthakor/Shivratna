import { useState } from 'react';
import { submitInquiry } from '../services/api';

export default function ContactForm() {
  const [form,    setForm]    = useState({ name:'', phone:'', email:'', gem:'', message:'' });
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [error,   setError]   = useState('');

  const submit = async () => {
    if (!form.name || !form.phone) { setError('Please fill in name and mobile number.'); return; }
    setLoading(true); setError('');
    try {
      await submitInquiry({ gemName: form.gem || 'General Inquiry', ...form, source:'contact-form' });
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send. Please try WhatsApp.');
    } finally { setLoading(false); }
  };

  const inp = { width:'100%', background:'#f8fafc', border:'1.5px solid #e2e8f0', borderRadius:11, padding:'11px 14px', fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'#1e293b', outline:'none', marginTop:5 };

  if (done) return (
    <div style={{ background:'#fff', borderRadius:22, padding:'clamp(24px,5vw,40px)', boxShadow:'0 20px 48px rgba(14,165,233,0.14)', textAlign:'center' }}>
      <div style={{ fontSize:52, marginBottom:14 }}>✅</div>
      <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, marginBottom:10 }}>Message Sent!</h3>
      <p style={{ fontSize:14, color:'#475569', lineHeight:1.8, marginBottom:20 }}>
        Thank you <strong>{form.name}</strong>! Hemal Thakor will personally contact you within 24 hours.
      </p>
      <a href="https://wa.me/919825899807" target="_blank" rel="noreferrer"
        style={{ display:'inline-flex', alignItems:'center', gap:8, background:'#25D366', color:'#fff', padding:'12px 22px', borderRadius:99, textDecoration:'none', fontWeight:500, fontSize:14 }}>
        💬 Chat on WhatsApp Now
      </a>
    </div>
  );

  return (
    <div style={{ background:'#fff', borderRadius:22, padding:'clamp(24px,5vw,40px)', boxShadow:'0 20px 48px rgba(14,165,233,0.14)' }}>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(18px,3vw,24px)', fontWeight:700, marginBottom:5 }}>Request a Quote</div>
      <div style={{ fontSize:13, color:'#94a3b8', marginBottom:22 }}>Hemal Thakor responds within 24 hours with pricing and Vedic guidance.</div>

      {error && <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:10, padding:'10px 14px', marginBottom:14, color:'#dc2626', fontSize:13 }}>⚠️ {error}</div>}

      {[['Full Name *','name','text'],['Mobile Number *','phone','tel'],['Email Address','email','email']].map(([label,key,type]) => (
        <div key={key} style={{ marginBottom:14 }}>
          <label style={{ fontSize:12, fontWeight:500, color:'#1e293b' }}>{label}</label>
          <input style={inp} type={type} value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} />
        </div>
      ))}
      <div style={{ marginBottom:14 }}>
        <label style={{ fontSize:12, fontWeight:500, color:'#1e293b' }}>Gemstone of Interest</label>
        <select style={inp} value={form.gem} onChange={e=>setForm(f=>({...f,gem:e.target.value}))}>
          <option value="">Select a gemstone...</option>
          {['Ruby / Manik','Blue Sapphire / Neelam','Yellow Sapphire / Pukhraj','Emerald / Panna','Red Coral / Moonga','Hessonite / Gomed','Tanzanite','Aquamarine / Beruj','Amethyst','Pink Sapphire','Diamond / Heera','Other / Not Sure'].map(o=><option key={o}>{o}</option>)}
        </select>
      </div>
      <div style={{ marginBottom:22 }}>
        <label style={{ fontSize:12, fontWeight:500, color:'#1e293b' }}>Requirements</label>
        <textarea style={{ ...inp, height:80, resize:'none' }} value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} placeholder="Birth details, purpose, budget, carat weight..." />
      </div>
      <button onClick={submit} disabled={loading}
        style={{ width:'100%', background:'linear-gradient(135deg,#e879a0,#0ea5e9)', color:'#fff', border:'none', padding:'14px 0', borderRadius:99, fontSize:14, fontWeight:500, cursor: loading?'not-allowed':'pointer', opacity: loading?0.75:1 }}>
        {loading ? '⏳ Sending...' : 'Send Inquiry ✦'}
      </button>
    </div>
  );
}
