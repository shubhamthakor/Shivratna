import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [form,    setForm]    = useState({ username:'', password:'' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw,  setShowPw]  = useState(false);

  const submit = async e => {
    e.preventDefault();
    if (!form.username || !form.password) { setError('Please enter username and password.'); return; }
    setLoading(true); setError('');
    try { await login(form.username, form.password); }
    catch (err) { setError(err.response?.data?.message || 'Invalid credentials.'); }
    finally { setLoading(false); }
  };

  const inp = { width:'100%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:12, padding:'13px 16px', color:'#fff', fontSize:14, outline:'none', fontFamily:'Inter,sans-serif', transition:'border-color .2s' };

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#0f172a 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px 16px', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle 500px at 20% 50%,rgba(14,165,233,0.08),transparent),radial-gradient(circle 400px at 80% 30%,rgba(232,121,160,0.08),transparent)', pointerEvents:'none' }} />

      <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:24, padding:'clamp(28px,6vw,48px)', width:'100%', maxWidth:420, backdropFilter:'blur(20px)', position:'relative' }}>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ width:60, height:60, background:'linear-gradient(135deg,#e879a0,#0ea5e9)', borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, margin:'0 auto 14px', boxShadow:'0 8px 24px rgba(14,165,233,0.3)' }}>💎</div>
          <h1 style={{ color:'#fff', fontSize:'clamp(18px,4vw,22px)', fontWeight:700, marginBottom:4 }}>Shivratna Admin</h1>
          <p style={{ color:'#64748b', fontSize:13 }}>Sign in to manage your gemstone collection</p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:10, padding:'11px 14px', marginBottom:18, color:'#fca5a5', fontSize:13 }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={submit}>
          <div style={{ marginBottom:18 }}>
            <label style={{ fontSize:11, fontWeight:500, color:'#94a3b8', display:'block', marginBottom:8, letterSpacing:'.5px', textTransform:'uppercase' }}>Username</label>
            <input {...inp} name="username" type="text" value={form.username} onChange={e=>setForm(f=>({...f,username:e.target.value}))} placeholder="Enter your username" autoComplete="username"
              style={inp} onFocus={e=>e.target.style.borderColor='#0ea5e9'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.12)'} />
          </div>
          <div style={{ marginBottom:26 }}>
            <label style={{ fontSize:11, fontWeight:500, color:'#94a3b8', display:'block', marginBottom:8, letterSpacing:'.5px', textTransform:'uppercase' }}>Password</label>
            <div style={{ position:'relative' }}>
              <input name="password" type={showPw?'text':'password'} value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} placeholder="Enter your password" autoComplete="current-password"
                style={{ ...inp, paddingRight:44 }} onFocus={e=>e.target.style.borderColor='#0ea5e9'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.12)'} />
              <button type="button" onClick={()=>setShowPw(v=>!v)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'#64748b', cursor:'pointer', fontSize:16 }}>
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} style={{ width:'100%', background:'linear-gradient(135deg,#e879a0,#0ea5e9)', color:'#fff', border:'none', padding:'14px 0', borderRadius:12, fontSize:14, fontWeight:600, cursor: loading?'not-allowed':'pointer', opacity: loading?0.7:1, boxShadow:'0 6px 18px rgba(14,165,233,0.3)', transition:'all .3s' }}>
            {loading ? '⏳ Signing in...' : '🔐 Sign In to Admin Panel'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:22, fontSize:12, color:'#475569' }}>
          Shivratna Gemstone · Admin Panel v1.0<br />
          <span style={{ color:'#334155' }}>Hemal Thakor · Khambhat, Gujarat</span>
        </p>
      </div>
    </div>
  );
}
