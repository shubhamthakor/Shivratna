import { useState, useEffect } from 'react';

// ── RESPONSIVE HOOK ───────────────────────────────────────────────────────────
function useWidth() {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return w;
}

// ── GEM DETAIL MODAL ──────────────────────────────────────────────────────────
export function GemModal({ gem, onClose, onInquire }) {
  const [idx, setIdx] = useState(0);
  const w = useWidth();
  const isMobile = w < 640;
  if (!gem) return null;
  const imgs = gem.images || [];

  return (
    <div onClick={e=>{if(e.target===e.currentTarget)onClose();}}
      style={{ display:'flex', position:'fixed', inset:0, zIndex:500, background:'rgba(15,23,42,0.7)', backdropFilter:'blur(8px)', alignItems:'center', justifyContent:'center', padding: isMobile?0:20, overflowY:'auto' }}>
      <div style={{ background:'#fff', borderRadius: isMobile?'20px 20px 0 0':24, maxWidth:820, width:'100%', maxHeight: isMobile?'92vh':'90vh', overflowY:'auto', boxShadow:'0 32px 80px rgba(0,0,0,0.2)', marginTop: isMobile?'auto':0, animation:'slideUp .3s ease' }}>
        <style>{`@keyframes slideUp{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>

        {/* Slider */}
        <div style={{ position:'relative', height: isMobile?200:300, overflow:'hidden', borderRadius: isMobile?'20px 20px 0 0':'24px 24px 0 0', background:'linear-gradient(135deg,#fdf2f8,#f0f9ff)' }}>
          <div style={{ display:'flex', height:'100%', transform:`translateX(-${idx*100}%)`, transition:'transform .5s' }}>
            {imgs.length > 0 ? imgs.map((src,i) => (
              <img key={i} src={src} alt={`${gem.name} ${i+1}`} style={{ width:'100%', height:'100%', objectFit:'contain', flexShrink:0, padding: isMobile?16:28, background:'linear-gradient(135deg,#fdf2f8,#f0f9ff)' }} />
            )) : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:64 }}>💎</div>}
          </div>
          {imgs.length > 1 && <>
            <button onClick={()=>setIdx(i=>(i-1+imgs.length)%imgs.length)} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', background:'rgba(255,255,255,0.92)', border:'none', borderRadius:'50%', width:34, height:34, fontSize:18, fontWeight:700, cursor:'pointer' }}>‹</button>
            <button onClick={()=>setIdx(i=>(i+1)%imgs.length)} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'rgba(255,255,255,0.92)', border:'none', borderRadius:'50%', width:34, height:34, fontSize:18, fontWeight:700, cursor:'pointer' }}>›</button>
            <div style={{ position:'absolute', bottom:10, left:'50%', transform:'translateX(-50%)', display:'flex', gap:5 }}>
              {imgs.map((_,i) => <button key={i} onClick={()=>setIdx(i)} style={{ width:i===idx?20:7, height:7, borderRadius:99, background:i===idx?'#fff':'rgba(255,255,255,0.5)', border:'none', padding:0, cursor:'pointer', transition:'all .3s' }} />)}
            </div>
          </>}
        </div>

        {/* Header */}
        <div style={{ padding: isMobile?'16px 16px 0':'24px 28px 0', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div style={{ minWidth:0, flex:1 }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize: isMobile?22:30, fontWeight:700 }}>{gem.name}{gem.hindi?` / ${gem.hindi}`:''}</div>
            <div style={{ fontStyle:'italic', fontSize:12, color:'#94a3b8', marginTop:2 }}>{gem.scientific}</div>
          </div>
          <button onClick={onClose} style={{ background:'#f1f5f9', border:'none', borderRadius:'50%', width:32, height:32, cursor:'pointer', fontSize:15, color:'#64748b', flexShrink:0, marginLeft:10 }}>✕</button>
        </div>

        <div style={{ padding: isMobile?'0 16px 24px':'0 28px 28px' }}>
          <p style={{ fontSize: isMobile?13:14, color:'#475569', lineHeight:1.9, margin:'14px 0 18px' }}>{gem.desc}</p>
          <div style={{ display:'grid', gridTemplateColumns: isMobile?'1fr':'1fr 1fr', gap:10, marginBottom:18 }}>
            {Object.entries(gem.specs||{}).map(([k,v]) => (
              <div key={k} style={{ background:'#f8fafc', borderRadius:10, padding:'10px 12px' }}>
                <div style={{ fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#94a3b8', marginBottom:3 }}>{k}</div>
                <div style={{ fontSize:12, fontWeight:500 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ background:'linear-gradient(135deg,#fdf2f8,#f0f9ff)', borderRadius:12, padding:'16px 18px', display:'flex', justifyContent:'space-between', alignItems:'center', border:'1px solid rgba(14,165,233,0.1)', marginBottom:16, flexWrap:'wrap', gap:10 }}>
            <div>
              <div style={{ fontSize:10, letterSpacing:'1px', textTransform:'uppercase', color:'#94a3b8', marginBottom:3 }}>Market Rate (₹ per Carat)</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize: isMobile?20:26, fontWeight:700, background:'linear-gradient(135deg,#e879a0,#0ea5e9)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{gem.priceDisplay}</div>
              <div style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>{gem.unit}</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:10, letterSpacing:'1px', textTransform:'uppercase', color:'#94a3b8', marginBottom:4 }}>Hardness</div>
              <div style={{ fontSize:13, fontWeight:600, color:'#0ea5e9' }}>{gem.hardness}/10 Mohs</div>
            </div>
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:16 }}>
            {(gem.benefits||[]).map(b => <span key={b} style={{ fontSize:11, padding:'5px 12px', background:'rgba(14,165,233,0.07)', color:'#0ea5e9', borderRadius:99, fontWeight:500 }}>{b}</span>)}
          </div>
          <button onClick={()=>{onClose();onInquire(gem.name);}}
            style={{ width:'100%', background:'linear-gradient(135deg,#e879a0,#0ea5e9)', color:'#fff', border:'none', padding:'14px 0', borderRadius:99, fontSize:14, fontWeight:500, cursor:'pointer', boxShadow:'0 6px 18px rgba(14,165,233,0.3)' }}>
            Inquire About This Stone ✦
          </button>
        </div>
      </div>
    </div>
  );
}

// ── TRUST BAR ─────────────────────────────────────────────────────────────────
export function TrustBar() {
  const w = useWidth();
  const isMobile = w < 600;
  const items = [['🔬','GIA / IGI Certified'],['🌿','100% Natural'],['🚚','Free Shipping'],['📜','Lab Certificate'],['💰','₹/Carat Pricing'],['🪐','Vedic Guidance']];
  return (
    <div style={{ background:'linear-gradient(135deg,#e879a0,#0369a1)', padding: isMobile?'14px 16px':'18px 32px', overflowX:'auto' }}>
      <div style={{ maxWidth:1300, margin:'0 auto', display:'flex', justifyContent: isMobile?'flex-start':'space-around', alignItems:'center', gap: isMobile?20:16, minWidth: isMobile?480:'auto' }}>
        {items.map(([icon,text]) => (
          <div key={text} style={{ display:'flex', alignItems:'center', gap:7, color:'#fff', flexShrink:0 }}>
            <span style={{ fontSize: isMobile?16:19 }}>{icon}</span>
            <span style={{ fontSize: isMobile?11:12, fontWeight:500, whiteSpace:'nowrap' }}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── ABOUT ─────────────────────────────────────────────────────────────────────
export function About() {
  const w = useWidth();
  const isMobile = w < 768;
  return (
    <div id="about" style={{ background:'linear-gradient(135deg,#fdf2f8,#f0f9ff)', padding:'clamp(48px,8vw,96px) clamp(16px,4vw,32px)' }}>
      <div style={{ maxWidth:1300, margin:'0 auto', background:'#fff', borderRadius:24, padding:'clamp(28px,5vw,64px)', display:'grid', gridTemplateColumns: isMobile?'1fr':'1fr 1.2fr', gap: isMobile?32:64, boxShadow:'0 20px 48px rgba(14,165,233,0.14)' }}>

        {/* Owner Card */}
        <div>
          <div style={{ height:4, background:'linear-gradient(90deg,#e879a0,#0ea5e9)', borderRadius:4, marginBottom:28 }} />
          <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20 }}>
            <div style={{ width: isMobile?56:72, height: isMobile?56:72, borderRadius:'50%', background:'linear-gradient(135deg,#e879a0,#0ea5e9)', display:'flex', alignItems:'center', justifyContent:'center', fontSize: isMobile?24:28, flexShrink:0, boxShadow:'0 8px 24px rgba(232,121,160,0.3)' }}>👤</div>
            <div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize: isMobile?18:24, fontWeight:700 }}>Hemal Thakor</div>
              <div style={{ fontSize:11, color:'#94a3b8', letterSpacing:'0.8px', textTransform:'uppercase' }}>Founder & Senior Gemologist</div>
            </div>
          </div>
          {[['📧','hemalthakor2011@gmail.com'],['📞','+91 98258 99807'],['📍','Khambhat, Anand, Gujarat – 388620'],['🏪','Shivratna Gemstone, Khambhat']].map(([icon,text]) => (
            <div key={text} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10, fontSize:13, color:'#475569' }}>
              <div style={{ width:28, height:28, background:'linear-gradient(135deg,rgba(249,168,212,0.15),rgba(186,230,253,0.15))', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, flexShrink:0, border:'1px solid rgba(14,165,233,0.1)' }}>{icon}</div>
              <span style={{ fontSize: isMobile?12:13, wordBreak:'break-word' }}>{text}</span>
            </div>
          ))}
          <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'linear-gradient(135deg,rgba(249,168,212,0.2),rgba(186,230,253,0.2))', border:'1px solid rgba(14,165,233,0.15)', padding:'9px 16px', borderRadius:99, marginTop:14, fontSize:12, fontWeight:500, color:'#0ea5e9' }}>✦ 15+ Years of Gemological Excellence</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:7, marginTop:12 }}>
            {['GIA Trained','IGI Verified','Vedic Astrology','Ethical Sourcing'].map(c => (
              <span key={c} style={{ background:'#fafafa', border:'1px solid #e2e8f0', padding:'5px 12px', borderRadius:99, fontSize:11, fontWeight:500, color:'#0ea5e9' }}>{c}</span>
            ))}
          </div>
        </div>

        {/* Story */}
        <div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(22px,4vw,38px)', fontWeight:700, marginBottom:18, lineHeight:1.2 }}>
            15 Years of Crafting<br />
            <em style={{ fontStyle:'italic', background:'linear-gradient(135deg,#e879a0,#0ea5e9)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Destiny Through Gems</em>
          </h2>
          {[
            "Born in the gem-trading heritage of Khambhat — one of India's most celebrated gemstone hubs — Hemal Thakor founded Shivratna Gemstone with a singular vision: to bring lab-certified, 100% natural gemstones to every household in India with full transparency and Vedic guidance.",
            "Every stone is handpicked from trusted mines across Burma, Sri Lanka, Colombia, and Africa. We test each gem at certified laboratories before it reaches your hands.",
            "Whether you seek a Blue Sapphire for Saturn, a radiant Ruby for the Sun, or a serene Emerald for Mercury — we guide you with both gemological science and ancient Vedic wisdom."
          ].map((p,i) => <p key={i} style={{ fontSize: isMobile?13:14, color:'#475569', lineHeight:1.9, marginBottom:14 }}>{p}</p>)}
          <button onClick={()=>document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}
            style={{ marginTop:8, background:'linear-gradient(135deg,#e879a0,#0ea5e9)', color:'#fff', border:'none', padding:'13px 26px', borderRadius:99, fontSize:14, fontWeight:500, cursor:'pointer', boxShadow:'0 6px 18px rgba(14,165,233,0.3)' }}>
            Book Free Consultation ✦
          </button>
        </div>
      </div>
    </div>
  );
}

// ── WHY US ────────────────────────────────────────────────────────────────────
export function WhyUs() {
  const w = useWidth();
  const cols = w < 480 ? 1 : w < 900 ? 2 : 3;
  const features = [
    ['🔬','Laboratory Certified','Every gemstone with GIA, IGI, or GRS certification. Origin reports and treatment disclosure provided.'],
    ['🌿','100% Natural & Ethical','Fully natural, unenhanced stones. Supply chain traceable mine-to-hand with conflict-free guarantees.'],
    ['🪐','Vedic Astrology Guidance','Hemal Thakor personally guides each client to the right gem for their Rashi, Lagna, and planetary needs.'],
    ['💰','Transparent ₹/Carat Pricing','Prices updated quarterly. Direct sourcing from miners in Khambhat, Jaipur, and abroad.'],
    ['🚚','Insured Pan-India Delivery','Free insured shipping. Tamper-proof gem pouches with sealed certificates and tracking.'],
    ['📞','Personal Expert Support','WhatsApp Hemal Thakor on +91 98258 99807. Every inquiry answered personally — no bots.'],
  ];
  return (
    <div id="why" style={{ background:'linear-gradient(135deg,#fdf2f8,#f0f9ff)', padding:'clamp(48px,8vw,96px) clamp(16px,4vw,32px)' }}>
      <div style={{ maxWidth:1300, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'clamp(32px,6vw,56px)' }}>
          <span style={{ display:'inline-block', fontSize:11, letterSpacing:'2.5px', textTransform:'uppercase', color:'#e879a0', fontWeight:500, marginBottom:12 }}>Our Promise</span>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(22px,4vw,44px)', fontWeight:700, color:'#1e293b', lineHeight:1.2 }}>
            Why <em style={{ fontStyle:'italic', background:'linear-gradient(135deg,#e879a0,#0ea5e9)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Shivratna</em> Is Gujarat's Most Trusted Name
          </h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:`repeat(${cols},1fr)`, gap:'clamp(12px,2vw,24px)' }}>
          {features.map(([icon,title,desc]) => (
            <div key={title} style={{ background:'#fff', borderRadius:20, padding:'clamp(20px,4vw,32px)', boxShadow:'0 1px 3px rgba(0,0,0,0.06)', border:'1px solid #e2e8f0', transition:'all .3s' }}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-6px)';e.currentTarget.style.boxShadow='0 20px 48px rgba(14,165,233,0.14)';}}
              onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='0 1px 3px rgba(0,0,0,0.06)';}}>
              <div style={{ width:48, height:48, borderRadius:13, background:'linear-gradient(135deg,rgba(249,168,212,0.2),rgba(186,230,253,0.2))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, marginBottom:16, border:'1px solid rgba(14,165,233,0.1)' }}>{icon}</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(16px,2vw,19px)', fontWeight:700, marginBottom:8 }}>{title}</div>
              <p style={{ fontSize:'clamp(12px,1.5vw,13px)', color:'#475569', lineHeight:1.8 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
export function Footer() {
  const w = useWidth();
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 1024;
  return (
    <footer style={{ background:'linear-gradient(135deg,#0f172a,#1e293b)', color:'#94a3b8', padding:'clamp(40px,6vw,72px) clamp(16px,4vw,32px) 28px' }}>
      <div style={{ maxWidth:1300, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns: isMobile?'1fr': isTablet?'1fr 1fr':'1.5fr 1fr 1fr', gap:'clamp(28px,4vw,56px)', marginBottom:'clamp(28px,4vw,48px)' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
              <div style={{ width:38, height:38, background:'linear-gradient(135deg,#e879a0,#0ea5e9)', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17 }}>💎</div>
              <div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:'#fff' }}>Shivratna Gemstone</div>
                <div style={{ fontSize:10, letterSpacing:'2px', textTransform:'uppercase', color:'#64748b' }}>Khambhat · Gujarat · India</div>
              </div>
            </div>
            <p style={{ fontSize:13, lineHeight:1.9, color:'#64748b', marginBottom:16 }}>Gujarat's most trusted source for certified natural gemstones. Founded by Hemal Thakor with 15+ years of expertise.</p>
            <div style={{ display:'flex', gap:8 }}>
              {['📘','📸','💬','📧'].map(icon => <a key={icon} href="#" style={{ width:34, height:34, borderRadius:9, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, textDecoration:'none' }}>{icon}</a>)}
            </div>
          </div>
          {!isMobile && (
            <div>
              <h4 style={{ fontSize:11, fontWeight:600, color:'#fff', letterSpacing:'.5px', marginBottom:16, textTransform:'uppercase' }}>Gemstones</h4>
              <ul style={{ listStyle:'none' }}>
                {['Ruby / Manik','Blue Sapphire / Neelam','Yellow Sapphire / Pukhraj','Emerald / Panna','Red Coral / Moonga','Tanzanite','Aquamarine','Amethyst'].map(item => (
                  <li key={item} style={{ marginBottom:8 }}><a href="#" style={{ fontSize:13, color:'#64748b', textDecoration:'none' }}>{item}</a></li>
                ))}
              </ul>
            </div>
          )}
          {!isMobile && (
            <div>
              <h4 style={{ fontSize:11, fontWeight:600, color:'#fff', letterSpacing:'.5px', marginBottom:16, textTransform:'uppercase' }}>Quick Links</h4>
              <ul style={{ listStyle:'none' }}>
                {['About Hemal Thakor','Gem Collection','Free Consultation','Vedic Gemstone Guide','Shipping Policy','Privacy Policy'].map(item => (
                  <li key={item} style={{ marginBottom:8 }}><a href="#" style={{ fontSize:13, color:'#64748b', textDecoration:'none' }}>{item}</a></li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:22, display:'flex', flexDirection: isMobile?'column':'row', justifyContent:'space-between', alignItems: isMobile?'center':'center', gap:12, textAlign: isMobile?'center':'left' }}>
          <div style={{ fontSize:11, color:'#475569' }}>
            © 2026 Shivratna Gemstone · Hemal Thakor · +91 98258 99807<br />
            <span style={{ fontSize:10, color:'#334155' }}>Prices are indicative (₹/carat). 1 Ratti ≈ 0.91 Carat.</span>
          </div>
          <div style={{ display:'flex', gap:7 }}>
            {['GIA','IGI','GRS'].map(c => <span key={c} style={{ fontSize:10, padding:'4px 10px', borderRadius:99, border:'1px solid rgba(14,165,233,0.2)', color:'#bae6fd', fontWeight:500 }}>{c}</span>)}
          </div>
        </div>
      </div>
    </footer>
  );
}
