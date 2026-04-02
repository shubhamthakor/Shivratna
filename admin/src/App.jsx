import { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import GemTable from './components/GemTable';
import Inquiries from './components/Inquiries';
import { AddGemModal, EditGemModal } from './components/GemFormModal';
import { getAllGems, getInquiries } from './services/api';

const SIDEBAR_W = 230;

function AdminPanel() {
  const { admin, loading: authLoading } = useAuth();
  const [page,        setPage]        = useState('dashboard');
  const [gems,        setGems]        = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [editGem,     setEditGem]     = useState(null);
  const [showAdd,     setShowAdd]     = useState(false);
  const [toast,       setToast]       = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [w, setW] = useState(window.innerWidth);

  useEffect(() => { const fn=()=>setW(window.innerWidth); window.addEventListener('resize',fn); return()=>window.removeEventListener('resize',fn); },[]);
  const isMobile = w < 900;

  const fetchGems = useCallback(async () => {
    if (!admin) return;
    setLoading(true);
    try { const {data}=await getAllGems(); setGems(data.gems||[]); }
    catch(err){ console.error(err); }
    finally { setLoading(false); }
  }, [admin]);

  const fetchUnread = useCallback(async () => {
    if (!admin) return;
    try { const {data}=await getInquiries({status:'new',limit:1}); setUnreadCount(data.unread||0); }
    catch{}
  }, [admin]);

  useEffect(() => { fetchGems(); fetchUnread(); const iv=setInterval(fetchUnread,30000); return()=>clearInterval(iv); }, [fetchGems,fetchUnread]);

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(''),4000); };
  const handleSetPage = (p) => { if(p==='add'){setShowAdd(true);return;} setPage(p); };

  if (authLoading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f8fafc' }}>
      <div style={{ textAlign:'center' }}><div style={{ fontSize:44,marginBottom:14 }}>💎</div><p style={{ color:'#64748b',fontSize:14 }}>Loading Admin...</p></div>
    </div>
  );

  if (!admin) return <Login />;

  const PAGE_TITLES = { dashboard:'Dashboard', gems:'Manage Gems', inquiries:'Inquiries' };

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#f8fafc', fontFamily:'Inter,sans-serif' }}>

      {/* Sidebar */}
      <Sidebar active={page} setActive={handleSetPage} unreadCount={unreadCount} mobileOpen={mobileSidebar} onClose={()=>setMobileSidebar(false)} />

      {/* Main */}
      <main style={{ flex:1, marginLeft: isMobile?0:SIDEBAR_W, minHeight:'100vh', display:'flex', flexDirection:'column' }}>

        {/* Top bar */}
        <div style={{ position:'sticky', top:0, zIndex:90, background:'rgba(248,250,252,0.96)', backdropFilter:'blur(8px)', borderBottom:'1px solid #e2e8f0', padding: isMobile?'12px 16px':'14px clamp(16px,3vw,32px)', display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            {isMobile && (
              <button onClick={()=>setMobileSidebar(v=>!v)} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:8, padding:'8px 10px', display:'flex', flexDirection:'column', gap:4, cursor:'pointer' }}>
                <span style={{ display:'block', width:16, height:2, background:'#475569', borderRadius:2 }}/>
                <span style={{ display:'block', width:16, height:2, background:'#475569', borderRadius:2 }}/>
                <span style={{ display:'block', width:16, height:2, background:'#475569', borderRadius:2 }}/>
              </button>
            )}
            <div>
              <div style={{ fontSize: isMobile?14:16, fontWeight:600, color:'#1e293b' }}>{PAGE_TITLES[page] || 'Admin'}</div>
              {!isMobile && <div style={{ fontSize:12, color:'#94a3b8' }}>Welcome back, {admin?.name}</div>}
            </div>
          </div>
          <button onClick={()=>setShowAdd(true)}
            style={{ display:'flex', alignItems:'center', gap:6, background:'linear-gradient(135deg,#e879a0,#0ea5e9)', color:'#fff', border:'none', padding: isMobile?'9px 14px':'10px 20px', borderRadius:10, fontSize: isMobile?12:13, fontWeight:600, cursor:'pointer', boxShadow:'0 4px 14px rgba(14,165,233,0.3)', whiteSpace:'nowrap', fontFamily:'Inter,sans-serif' }}>
            ➕ {isMobile?'Add':'Add New Gem'}
          </button>
        </div>

        {/* Content */}
        <div style={{ flex:1, padding: isMobile?'16px':'clamp(16px,3vw,32px)', overflow:'auto' }}>
          {loading && page!=='inquiries' ? (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:300 }}>
              <div style={{ textAlign:'center' }}><div style={{ fontSize:40,marginBottom:12 }}>💎</div><p style={{ color:'#64748b',fontSize:14 }}>Loading...</p></div>
            </div>
          ) : page==='dashboard' ? (
            <Dashboard gems={gems} />
          ) : page==='inquiries' ? (
            <Inquiries />
          ) : (
            <GemTable gems={gems} onEdit={setEditGem} onDelete={()=>showToast('Gem deleted from website.')} onRefresh={fetchGems} />
          )}
        </div>
      </main>

      {showAdd && <AddGemModal onClose={()=>setShowAdd(false)} onSuccess={(msg)=>{fetchGems();showToast(msg);}} />}
      {editGem  && <EditGemModal gem={editGem} onClose={()=>setEditGem(null)} onSuccess={(msg)=>{fetchGems();setEditGem(null);showToast(msg);}} />}

      {/* Toast */}
      {toast && (
        <div style={{ position:'fixed', bottom:24, left:'50%', transform:'translateX(-50%)', background:'linear-gradient(135deg,#e879a0,#0ea5e9)', color:'#fff', padding:'12px 24px', borderRadius:99, fontSize:13, fontWeight:500, zIndex:9999, boxShadow:'0 8px 24px rgba(14,165,233,0.35)', whiteSpace:'nowrap', animation:'toastUp .3s ease' }}>
          ✅ {toast}
        </div>
      )}
      <style>{`@keyframes toastUp{from{transform:translateX(-50%) translateY(20px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}`}</style>
    </div>
  );
}

export default function App() {
  return <AuthProvider><AdminPanel /></AuthProvider>;
}
