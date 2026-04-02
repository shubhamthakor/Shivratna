import { useEffect, useRef, useState } from 'react';
import GEM_IMAGES from '../data/gemImages.js';

const HERO_GEMS = ['ruby','emerald','bluesapphire','tanzanite','yellowsapphire','amethyst','pinksapphire','diamond'];
const THUMB_GEMS = ['ruby','emerald','bluesapphire','tanzanite'];

export default function Hero({ onConsult }) {
  const [mainImg, setMainImg] = useState(GEM_IMAGES['ruby']?.[0] || '');
  const [fade,    setFade]    = useState(true);
  const [w,       setW]       = useState(window.innerWidth);
  const idxRef = useRef(0);

  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      idxRef.current = (idxRef.current + 1) % HERO_GEMS.length;
      const img = GEM_IMAGES[HERO_GEMS[idxRef.current]]?.[0];
      if (img) { setFade(false); setTimeout(() => { setMainImg(img); setFade(true); }, 350); }
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  const go = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const isMobile = w < 768;
  const isTablet = w >= 768 && w < 1024;
  const thumbPositions = [
    { top:-26, left:'50%', transform:'translateX(-50%)' },
    { bottom:-26, left:'50%', transform:'translateX(-50%)' },
    { left:-26, top:'50%', transform:'translateY(-50%)' },
    { right:-26, top:'50%', transform:'translateY(-50%)' },
  ];

  const orbitSize = isMobile ? 200 : isTablet ? 260 : 320;
  const outerSize = isMobile ? 260 : isTablet ? 330 : 400;
  const mainSize  = isMobile ? 150 : isTablet ? 190 : 240;
  const thumbSize = isMobile ? 38  : 52;

  return (
    <section style={{ minHeight:'100vh', background:'linear-gradient(135deg,#fdf2f8 0%,#f0f9ff 50%,#fdf2f8 100%)', display:'flex', alignItems:'center', paddingTop: isMobile?60:68, position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle 600px at 10% 50%,rgba(249,168,212,0.2),transparent 60%),radial-gradient(circle 600px at 90% 30%,rgba(186,230,253,0.25),transparent 60%)', pointerEvents:'none' }} />

      <div style={{ maxWidth:1300, margin:'0 auto', padding: isMobile?'40px 20px 60px':'60px clamp(20px,4vw,32px)', display:'grid', gridTemplateColumns: isMobile?'1fr': isTablet?'1fr 1fr':'1fr 1fr', gap: isMobile?40:80, alignItems:'center', width:'100%' }}>

        {/* Text Content */}
        <div style={{ textAlign: isMobile?'center':'left', order: isMobile?2:1 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.85)', border:'1px solid rgba(14,165,233,0.2)', padding:'7px 16px', borderRadius:99, fontSize:11, color:'#0ea5e9', fontWeight:500, marginBottom:20 }}>
            <span style={{ width:7, height:7, background:'#e879a0', borderRadius:'50%', animation:'pulse 2s infinite' }} />
            Khambhat, Gujarat's Premier Gemstone House
          </div>

          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize: isMobile?'clamp(30px,8vw,42px)': isTablet?'clamp(34px,5vw,52px)':'clamp(38px,5vw,60px)', fontWeight:700, lineHeight:1.1, color:'#1e293b', marginBottom:16 }}>
            Where Earth's{' '}
            <em style={{ fontStyle:'italic', background:'linear-gradient(135deg,#e879a0,#0ea5e9)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Rarest Treasures</em>
            <br />Meet Your Destiny
          </h1>

          <p style={{ fontSize: isMobile?13:15, color:'#475569', lineHeight:1.85, marginBottom:28, maxWidth: isMobile?'100%':480, margin: isMobile?'0 auto 28px':'0 0 28px' }}>
            For over 15 years, Hemal Thakor and Shivratna Gemstone have been Gujarat's trusted name for 100% certified natural gemstones — handpicked, lab-verified, and priced transparently in Indian Rupees per carat.
          </p>

          <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:36, justifyContent: isMobile?'center':'flex-start' }}>
            <button onClick={()=>go('collection')} style={{ background:'linear-gradient(135deg,#e879a0,#0ea5e9)', color:'#fff', border:'none', padding: isMobile?'12px 22px':'14px 30px', borderRadius:99, fontSize: isMobile?13:14, fontWeight:500, cursor:'pointer', boxShadow:'0 6px 18px rgba(14,165,233,0.3)', transition:'transform .3s' }} onMouseEnter={e=>e.currentTarget.style.transform='translateY(-3px)'} onMouseLeave={e=>e.currentTarget.style.transform=''}>
              ✦ Explore Collection
            </button>
            <button onClick={()=>go('about')} style={{ background:'rgba(255,255,255,0.8)', color:'#1e293b', border:'1.5px solid #e2e8f0', padding: isMobile?'12px 22px':'14px 30px', borderRadius:99, fontSize: isMobile?13:14, fontWeight:500, cursor:'pointer', transition:'all .3s' }} onMouseEnter={e=>{e.currentTarget.style.borderColor='#0ea5e9';e.currentTarget.style.color='#0ea5e9';}} onMouseLeave={e=>{e.currentTarget.style.borderColor='#e2e8f0';e.currentTarget.style.color='#1e293b';}}>
              Our Story →
            </button>
          </div>

          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap: isMobile?8:16, maxWidth: isMobile?360:'none', margin: isMobile?'0 auto':'0' }}>
            {[['15+','Years'],['22+','Gems'],['GIA','Certified'],['5000+','Clients']].map(([n,l]) => (
              <div key={l} style={{ textAlign:'center', background:'rgba(255,255,255,0.6)', borderRadius:14, padding: isMobile?'10px 6px':'12px 8px', border:'1px solid rgba(14,165,233,0.1)' }}>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize: isMobile?18:24, fontWeight:700, background:'linear-gradient(135deg,#e879a0,#0ea5e9)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', display:'block' }}>{n}</span>
                <span style={{ fontSize: isMobile?9:11, color:'#94a3b8', letterSpacing:'0.5px', textTransform:'uppercase', marginTop:2, display:'block' }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Visual / Orbit */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', order: isMobile?1:2 }}>
          <div style={{ width:outerSize, height:outerSize, position:'relative', flexShrink:0 }}>
            {/* Inner orbit */}
            <div style={{ position:'absolute', width:orbitSize, height:orbitSize, borderRadius:'50%', border:'1px dashed rgba(14,165,233,0.2)', top:'50%', left:'50%', transform:'translate(-50%,-50%)', animation:'spin 20s linear infinite' }}>
              {THUMB_GEMS.map((g,i) => {
                const img = GEM_IMAGES[g]?.[0];
                return (
                  <div key={g} style={{ position:'absolute', width:thumbSize, height:thumbSize, borderRadius:'50%', border:'3px solid #fff', boxShadow:'0 4px 12px rgba(0,0,0,0.1)', overflow:'hidden', background:'linear-gradient(135deg,#fdf2f8,#f0f9ff)', ...thumbPositions[i] }}>
                    {img && <img src={img} alt={g} style={{ width:'100%', height:'100%', objectFit:'contain', padding:4 }} />}
                  </div>
                );
              })}
            </div>

            {/* Outer orbit */}
            <div style={{ position:'absolute', width:outerSize, height:outerSize, borderRadius:'50%', border:'1px dashed rgba(14,165,233,0.1)', top:'50%', left:'50%', transform:'translate(-50%,-50%)', animation:'spin 35s linear infinite reverse' }} />

            {/* Main gem */}
            <div style={{ position:'absolute', width:mainSize, height:mainSize, borderRadius:'50%', top:'50%', left:'50%', transform:'translate(-50%,-50%)', border:'4px solid rgba(255,255,255,0.9)', boxShadow:'0 20px 60px rgba(14,165,233,0.25),0 0 0 8px rgba(255,255,255,0.4)', background:'linear-gradient(135deg,#fdf2f8,#f0f9ff)', overflow:'hidden', animation:'float 4s ease-in-out infinite' }}>
              {mainImg && <img src={mainImg} alt="Featured Gem" style={{ width:'100%', height:'100%', objectFit:'contain', padding:16, opacity: fade?1:0, transition:'opacity .35s' }} />}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(232,121,160,0.5)}50%{box-shadow:0 0 0 6px rgba(232,121,160,0)}}
        @keyframes float{0%,100%{transform:translate(-50%,-50%) translateY(0)}50%{transform:translate(-50%,-50%) translateY(-10px)}}
        @keyframes spin{to{transform:translate(-50%,-50%) rotate(360deg)}}
      `}</style>
    </section>
  );
}
