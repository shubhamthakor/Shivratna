import { useState, useEffect } from 'react';

export default function Navbar({ onConsult }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [w, setW] = useState(window.innerWidth);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    const onResize = () => { setW(window.innerWidth); if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize); };
  }, []);

  const isMobile = w < 768;
  const go = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false); };
  const LINKS = [['collection','Collection'],['about','About Us'],['why','Why Us'],['contact','Contact']];

  return (
    <>
      <nav style={{ position:'fixed', top:0, width:'100%', zIndex:200, background:'rgba(255,255,255,0.96)', backdropFilter:'blur(16px)', borderBottom:'1px solid #e2e8f0', boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.08)' : 'none', transition:'box-shadow .3s' }}>
        <div style={{ maxWidth:1300, margin:'0 auto', padding:'0 clamp(16px,4vw,32px)', height: isMobile ? 60 : 68, display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>

          {/* Logo */}
          <a href="#" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none', flexShrink:0 }}>
            <div style={{ width: isMobile?32:38, height: isMobile?32:38, background:'linear-gradient(135deg,#e879a0,#0ea5e9)', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', fontSize: isMobile?15:18, boxShadow:'0 4px 12px rgba(232,121,160,0.3)' }}>💎</div>
            <div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize: isMobile?16:20, fontWeight:700, color:'#1e293b', lineHeight:1.1 }}>Shivratna</div>
              <div style={{ fontSize:9, color:'#94a3b8', letterSpacing:'1.5px', textTransform:'uppercase' }}>Gemstone</div>
            </div>
          </a>

          {/* Desktop nav links */}
          {!isMobile && (
            <ul style={{ display:'flex', alignItems:'center', gap:28, listStyle:'none', margin:0 }}>
              {LINKS.map(([id,label]) => (
                <li key={id}><span onClick={()=>go(id)} style={{ fontSize:13, fontWeight:500, color:'#475569', cursor:'pointer', transition:'color .2s' }} onMouseEnter={e=>e.target.style.color='#0ea5e9'} onMouseLeave={e=>e.target.style.color='#475569'}>{label}</span></li>
              ))}
            </ul>
          )}

          <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
            <button onClick={onConsult} style={{ background:'linear-gradient(135deg,#e879a0,#0ea5e9)', color:'#fff', border:'none', padding: isMobile?'8px 14px':'10px 22px', borderRadius:99, fontSize: isMobile?11:13, fontWeight:500, cursor:'pointer', boxShadow:'0 4px 14px rgba(14,165,233,0.3)', whiteSpace:'nowrap' }}>
              {isMobile ? 'Consult' : 'Free Consultation'}
            </button>

            {/* Hamburger */}
            {isMobile && (
              <button onClick={()=>setMenuOpen(v=>!v)} aria-label="Menu" style={{ background:'none', border:'1.5px solid #e2e8f0', borderRadius:8, padding:'7px 8px', display:'flex', flexDirection:'column', gap:4, cursor:'pointer' }}>
                {[0,1,2].map(i => (
                  <span key={i} style={{ display:'block', width:18, height:2, background: menuOpen&&i!==1?'#e879a0':'#475569', borderRadius:2, transition:'all .3s',
                    transform: menuOpen && i===0 ? 'rotate(45deg) translate(4px,4px)' : menuOpen && i===2 ? 'rotate(-45deg) translate(4px,-4px)' : 'none',
                    opacity: menuOpen && i===1 ? 0 : 1 }} />
                ))}
              </button>
            )}
          </div>
        </div>

        {/* Mobile dropdown */}
        <div style={{ overflow:'hidden', maxHeight: menuOpen ? 300 : 0, transition:'max-height .35s ease', background:'#fff', borderTop: menuOpen ? '1px solid #f1f5f9' : 'none' }}>
          {LINKS.map(([id,label]) => (
            <button key={id} onClick={()=>go(id)} style={{ display:'flex', alignItems:'center', width:'100%', textAlign:'left', padding:'15px 20px', background:'none', border:'none', borderBottom:'1px solid #f8fafc', fontSize:15, fontWeight:500, color:'#334155', cursor:'pointer' }}>
              {label}
            </button>
          ))}
          <div style={{ padding:'12px 20px 16px' }}>
            <button onClick={()=>{onConsult();setMenuOpen(false);}} style={{ width:'100%', background:'linear-gradient(135deg,#e879a0,#0ea5e9)', color:'#fff', border:'none', padding:'13px', borderRadius:99, fontSize:14, fontWeight:500, cursor:'pointer' }}>
              Free Consultation ✦
            </button>
          </div>
        </div>
      </nav>

      {/* Backdrop */}
      {menuOpen && <div onClick={()=>setMenuOpen(false)} style={{ position:'fixed', inset:0, zIndex:199, background:'rgba(0,0,0,0.25)' }} />}
    </>
  );
}
