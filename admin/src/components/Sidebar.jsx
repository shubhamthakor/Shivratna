import { useAuth } from '../context/AuthContext';

const NAV = [
  { id:'dashboard', icon:'📊', label:'Dashboard'  },
  { id:'gems',      icon:'💎', label:'Manage Gems' },
  { id:'inquiries', icon:'📬', label:'Inquiries'   },
];

export default function Sidebar({ active, setActive, unreadCount, mobileOpen, onClose }) {
  const { admin, logout } = useAuth();

  const handleNav = (id) => {
    setActive(id);
    onClose?.();
  };

  const content = (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      {/* Logo */}
      <div style={{ padding:'22px 20px 18px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, background:'linear-gradient(135deg,#e879a0,#0ea5e9)', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, boxShadow:'0 4px 12px rgba(14,165,233,0.3)' }}>💎</div>
          <div>
            <div style={{ color:'#fff', fontWeight:700, fontSize:14, lineHeight:1.2 }}>Shivratna</div>
            <div style={{ color:'#64748b', fontSize:10, letterSpacing:'1px', textTransform:'uppercase' }}>Admin Panel</div>
          </div>
        </div>
        {/* Close button on mobile */}
        {onClose && (
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#64748b', cursor:'pointer', fontSize:20, lineHeight:1 }}>✕</button>
        )}
      </div>

      {/* Admin Info */}
      <div style={{ padding:'16px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
          <div style={{ width:34, height:34, background:'linear-gradient(135deg,#e879a0,#0ea5e9)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, flexShrink:0 }}>👤</div>
          <div style={{ minWidth:0 }}>
            <div style={{ color:'#e2e8f0', fontSize:13, fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{admin?.name || 'Admin'}</div>
            <div style={{ color:'#64748b', fontSize:11, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{admin?.email || ''}</div>
          </div>
        </div>
        <div style={{ padding:'3px 10px', background:'rgba(34,197,94,0.1)', borderRadius:99, display:'inline-flex', alignItems:'center', gap:5, fontSize:11, color:'#86efac' }}>
          <span style={{ width:5, height:5, background:'#22c55e', borderRadius:'50%' }} />Online
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:'12px 10px', overflowY:'auto' }}>
        {NAV.map(item => (
          <button key={item.id} onClick={() => handleNav(item.id)}
            style={{ width:'100%', display:'flex', alignItems:'center', gap:12, padding:'12px 14px', borderRadius:10, border:'none', cursor:'pointer', marginBottom:3, textAlign:'left', transition:'all .2s', fontFamily:'Inter,sans-serif',
              background: active===item.id ? 'rgba(14,165,233,0.15)' : 'transparent',
              color:      active===item.id ? '#38bdf8' : '#94a3b8',
              fontWeight: active===item.id ? 600 : 400, fontSize:14,
            }}
            onMouseEnter={e=>{if(active!==item.id){e.currentTarget.style.background='rgba(255,255,255,0.05)';e.currentTarget.style.color='#cbd5e1';}}}
            onMouseLeave={e=>{if(active!==item.id){e.currentTarget.style.background='transparent';e.currentTarget.style.color='#94a3b8';}}}>
            <span style={{ fontSize:18, flexShrink:0 }}>{item.icon}</span>
            <span style={{ flex:1 }}>{item.label}</span>
            {item.id==='inquiries' && unreadCount>0 && (
              <span style={{ background:'#0ea5e9', color:'#fff', fontSize:11, fontWeight:700, padding:'2px 7px', borderRadius:99, minWidth:20, textAlign:'center' }}>{unreadCount}</span>
            )}
            {active===item.id && <span style={{ width:4, height:4, background:'#0ea5e9', borderRadius:'50%', flexShrink:0 }} />}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding:'10px 10px 16px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        <a href="http://localhost:5173" target="_blank" rel="noreferrer"
          style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', borderRadius:10, color:'#94a3b8', textDecoration:'none', marginBottom:3, fontSize:14, transition:'all .2s' }}
          onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.05)';e.currentTarget.style.color='#cbd5e1';}}
          onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='#94a3b8';}}>
          <span style={{ fontSize:18 }}>🌐</span> View Website
        </a>
        <button onClick={logout}
          style={{ width:'100%', display:'flex', alignItems:'center', gap:12, padding:'12px 14px', borderRadius:10, border:'none', cursor:'pointer', background:'transparent', color:'#f87171', fontSize:14, textAlign:'left', fontFamily:'Inter,sans-serif', transition:'all .2s' }}
          onMouseEnter={e=>e.currentTarget.style.background='rgba(239,68,68,0.1)'}
          onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
          <span style={{ fontSize:18 }}>🚪</span> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside style={{ width:230, background:'#1e293b', minHeight:'100vh', display:'flex', flexDirection:'column', position:'fixed', left:0, top:0, bottom:0, zIndex:100, boxShadow:'4px 0 16px rgba(0,0,0,0.15)' }}
        className="desktop-sidebar">
        {content}
      </aside>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <>
          <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:200, background:'rgba(0,0,0,0.5)', backdropFilter:'blur(4px)' }} />
          <aside style={{ position:'fixed', left:0, top:0, bottom:0, width:260, background:'#1e293b', zIndex:201, display:'flex', flexDirection:'column', boxShadow:'8px 0 32px rgba(0,0,0,0.3)', animation:'slideIn .3s ease' }}>
            <style>{`@keyframes slideIn{from{transform:translateX(-100%)}to{transform:translateX(0)}}`}</style>
            {content}
          </aside>
        </>
      )}
    </>
  );
}
