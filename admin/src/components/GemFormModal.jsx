import { useState, useRef, useEffect } from 'react';
import { addGem, updateGem } from '../services/api';

const EMPTY = { name:'',hindi:'',scientific:'',category:'red',badge:'semi',vedic:false,planet:'',hardness:'',priceMin:'',priceMax:'',unit:'per carat',desc:'',origin:'',clarity:'',treatment:'',benefits:'',images:[] };

function GemForm({ initial, onSave, onClose, title }) {
  const [form,    setForm]    = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [imgPrev, setImgPrev] = useState(initial.images || []);
  const [w,       setW]       = useState(window.innerWidth);
  const fileRef = useRef();

  useEffect(() => {
    const fn=()=>setW(window.innerWidth); window.addEventListener('resize',fn);
    document.body.style.overflow='hidden';
    return()=>{ window.removeEventListener('resize',fn); document.body.style.overflow=''; };
  },[]);

  const isMobile = w < 640;
  const handle = e => { const {name,value,type,checked}=e.target; setForm(f=>({...f,[name]:type==='checkbox'?checked:value})); };

  const handleImages = e => {
    const files = Array.from(e.target.files);
    if (imgPrev.length + files.length > 4) { setError('Maximum 4 images allowed.'); return; }
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => { setImgPrev(p=>[...p,ev.target.result]); setForm(f=>({...f,images:[...(f.images||[]),ev.target.result]})); };
      reader.readAsDataURL(file);
    });
  };

  const removeImg = idx => { setImgPrev(p=>p.filter((_,i)=>i!==idx)); setForm(f=>({...f,images:(f.images||[]).filter((_,i)=>i!==idx)})); };

  const submit = async e => {
    e.preventDefault();
    if (!form.name||!form.desc||!form.priceMin||!form.priceMax) { setError('Name, description, and price range are required.'); return; }
    setLoading(true); setError('');
    try { await onSave(form); }
    catch (err) { setError(err.response?.data?.message || 'Save failed. Please try again.'); }
    finally { setLoading(false); }
  };

  const inp = { width:'100%', border:'1.5px solid #e2e8f0', borderRadius:10, padding:'10px 13px', fontSize:13, color:'#1e293b', outline:'none', fontFamily:'Inter,sans-serif', background:'#f8fafc' };
  const grp = { marginBottom:14 };
  const lbl = { fontSize:11, fontWeight:500, color:'#475569', display:'block', marginBottom:5 };

  return (
    <div onClick={e=>{if(e.target===e.currentTarget)onClose();}}
      style={{ position:'fixed', inset:0, background:'rgba(15,23,42,0.6)', backdropFilter:'blur(8px)', display:'flex', alignItems: isMobile?'flex-end':'center', justifyContent:'center', zIndex:998, padding: isMobile?0:20 }}>
      <div style={{ background:'#fff', borderRadius: isMobile?'20px 20px 0 0':20, maxWidth:700, width:'100%', maxHeight: isMobile?'92vh':'90vh', overflowY:'auto', boxShadow:'0 32px 80px rgba(0,0,0,0.2)', animation: isMobile?'slideUp .3s ease':'fadeIn .3s ease' }}>
        <style>{`@keyframes slideUp{from{transform:translateY(40px);opacity:0}to{transform:translateY(0);opacity:1}}@keyframes fadeIn{from{opacity:0;transform:scale(0.97)}to{opacity:1;transform:scale(1)}}`}</style>

        {isMobile && <div style={{ width:36, height:4, background:'#e2e8f0', borderRadius:2, margin:'12px auto 0' }} />}

        {/* Header */}
        <div style={{ padding: isMobile?'16px 16px 0':'22px 24px 0', display:'flex', justifyContent:'space-between', alignItems:'center', position:'sticky', top:0, background:'#fff', zIndex:10, borderRadius: isMobile?'20px 20px 0 0':'20px 20px 0 0', borderBottom:'1px solid #f1f5f9', paddingBottom:14 }}>
          <div>
            <h2 style={{ fontSize:'clamp(16px,3vw,19px)', fontWeight:700, color:'#1e293b' }}>{title}</h2>
            <p style={{ fontSize:12, color:'#94a3b8', marginTop:2 }}>Fill in the gem details below</p>
          </div>
          <button onClick={onClose} style={{ background:'#f1f5f9', border:'none', borderRadius:'50%', width:32, height:32, cursor:'pointer', fontSize:16, color:'#64748b' }}>✕</button>
        </div>

        <form onSubmit={submit} style={{ padding: isMobile?'16px':'24px' }}>
          {error && <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:10, padding:'11px 14px', marginBottom:16, color:'#dc2626', fontSize:13 }}>⚠️ {error}</div>}

          {/* Images */}
          <div style={{ ...grp, marginBottom:20 }}>
            <label style={lbl}>Gem Images (max 4)</label>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              {imgPrev.map((src,i) => (
                <div key={i} style={{ position:'relative', width:72, height:72 }}>
                  <img src={src} style={{ width:72, height:72, objectFit:'contain', borderRadius:9, border:'1px solid #e2e8f0', background:'linear-gradient(135deg,#fdf2f8,#f0f9ff)', padding:6 }} alt="" />
                  <button type="button" onClick={()=>removeImg(i)} style={{ position:'absolute', top:-7, right:-7, width:20, height:20, borderRadius:'50%', background:'#ef4444', color:'#fff', border:'none', cursor:'pointer', fontSize:11, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
                </div>
              ))}
              {imgPrev.length < 4 && (
                <button type="button" onClick={()=>fileRef.current.click()} style={{ width:72, height:72, borderRadius:9, border:'2px dashed #e2e8f0', background:'#f8fafc', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:4, color:'#94a3b8', fontSize:10 }}>
                  <span style={{ fontSize:20 }}>📸</span>Add
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImages} style={{ display:'none' }} />
            </div>
          </div>

          {/* 2-col grid responsive */}
          <div style={{ display:'grid', gridTemplateColumns: isMobile?'1fr':'1fr 1fr', gap:'0 18px' }}>
            <div style={grp}><label style={lbl}>Gem Name *</label><input style={inp} name="name" value={form.name} onChange={handle} placeholder="e.g. Ruby" required /></div>
            <div style={grp}><label style={lbl}>Hindi / Local Name</label><input style={inp} name="hindi" value={form.hindi} onChange={handle} placeholder="e.g. Manik (माणिक)" /></div>
            <div style={grp}><label style={lbl}>Scientific Name</label><input style={inp} name="scientific" value={form.scientific} onChange={handle} placeholder="e.g. Corundum — Al₂O₃" /></div>
            <div style={grp}><label style={lbl}>Planet</label><input style={inp} name="planet" value={form.planet} onChange={handle} placeholder="e.g. ☀️ Sun" /></div>
            <div style={grp}><label style={lbl}>Color Category *</label>
              <select style={inp} name="category" value={form.category} onChange={handle}>
                {['red','blue','green','yellow','white','purple'].map(c=><option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
              </select>
            </div>
            <div style={grp}><label style={lbl}>Badge *</label>
              <select style={inp} name="badge" value={form.badge} onChange={handle}>
                <option value="precious">Precious</option><option value="semi">Semi-Precious</option>
              </select>
            </div>
            <div style={grp}><label style={lbl}>Price Min (₹/carat) *</label><input style={inp} name="priceMin" type="number" value={form.priceMin} onChange={handle} placeholder="e.g. 73626" required /></div>
            <div style={grp}><label style={lbl}>Price Max (₹/carat) *</label><input style={inp} name="priceMax" type="number" value={form.priceMax} onChange={handle} placeholder="e.g. 3241758" required /></div>
            <div style={grp}><label style={lbl}>Hardness (Mohs)</label><input style={inp} name="hardness" type="number" step="0.5" min="1" max="10" value={form.hardness} onChange={handle} placeholder="e.g. 9.0" /></div>
            <div style={grp}><label style={lbl}>Unit</label><input style={inp} name="unit" value={form.unit} onChange={handle} placeholder="per carat" /></div>
            <div style={grp}><label style={lbl}>Origin</label><input style={inp} name="origin" value={form.origin||form.specs?.Origin||''} onChange={handle} placeholder="e.g. Burma, Sri Lanka" /></div>
            <div style={grp}><label style={lbl}>Clarity</label><input style={inp} name="clarity" value={form.clarity||form.specs?.Clarity||''} onChange={handle} placeholder="e.g. Eye-clean preferred" /></div>
          </div>

          <div style={grp}><label style={lbl}>Treatment</label><input style={inp} name="treatment" value={form.treatment||form.specs?.Treatment||''} onChange={handle} placeholder="e.g. Heat common; unheated premium" /></div>
          <div style={grp}><label style={lbl}>Description *</label><textarea style={{ ...inp, height:90, resize:'vertical' }} name="desc" value={form.desc} onChange={handle} placeholder="Full description..." required /></div>
          <div style={grp}><label style={lbl}>Benefits (comma-separated)</label><input style={inp} name="benefits" value={Array.isArray(form.benefits)?form.benefits.join(', '):form.benefits} onChange={handle} placeholder="e.g. Boosts confidence, Sun planet stone" /></div>

          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:22 }}>
            <input type="checkbox" id="vedic" name="vedic" checked={form.vedic} onChange={handle} style={{ width:16, height:16, accentColor:'#0ea5e9' }} />
            <label htmlFor="vedic" style={{ fontSize:14, color:'#334155', cursor:'pointer' }}>🪐 This is a Vedic / Jyotish gemstone</label>
          </div>

          <div style={{ display:'flex', gap:10, justifyContent:'flex-end', flexWrap:'wrap' }}>
            <button type="button" onClick={onClose} style={{ padding:'11px 22px', borderRadius:10, border:'1.5px solid #e2e8f0', background:'#fff', fontSize:14, fontWeight:500, cursor:'pointer', color:'#475569' }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ padding:'11px 28px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#e879a0,#0ea5e9)', fontSize:14, fontWeight:600, cursor: loading?'not-allowed':'pointer', color:'#fff', opacity: loading?0.7:1 }}>
              {loading ? 'Saving...' : title}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AddGemModal({ onClose, onSuccess }) {
  const handleSave = async (form) => { await addGem(form); onSuccess('Gem added! It is now live on your website.'); onClose(); };
  return <GemForm initial={EMPTY} onSave={handleSave} onClose={onClose} title="Add New Gem" />;
}

export function EditGemModal({ gem, onClose, onSuccess }) {
  const initial = { ...gem, origin:gem.specs?.Origin||'', clarity:gem.specs?.Clarity||'', treatment:gem.specs?.Treatment||'', benefits:Array.isArray(gem.benefits)?gem.benefits.join(', '):'' };
  const handleSave = async (form) => { await updateGem(gem.id, form); onSuccess('Gem updated successfully!'); onClose(); };
  return <GemForm initial={initial} onSave={handleSave} onClose={onClose} title="Update Gem" />;
}
