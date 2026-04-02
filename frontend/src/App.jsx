import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import GemGrid from './components/GemGrid';
import InquiryModal from './components/InquiryModal';
import ContactForm from './components/ContactForm';
import { GemModal, TrustBar, About, WhyUs, Footer } from './components/shared';
import useGems from './hooks/useGems';

function Contact() {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => { const fn=()=>setW(window.innerWidth); window.addEventListener('resize',fn); return()=>window.removeEventListener('resize',fn); }, []);
  const isMobile = w < 768;

  return (
    <div id="contact" style={{ background:'linear-gradient(135deg,#fdf2f8,#f0f9ff)', padding:'clamp(48px,8vw,80px) clamp(16px,4vw,32px)' }}>
      <div style={{ maxWidth:1000, margin:'0 auto', display:'grid', gridTemplateColumns: isMobile?'1fr':'1fr 1fr', gap:'clamp(28px,5vw,56px)', alignItems:'start' }}>

        {/* Contact Info */}
        <div>
          <span style={{ display:'block', fontSize:11, letterSpacing:'2.5px', textTransform:'uppercase', color:'#e879a0', fontWeight:500, marginBottom:14 }}>Get in Touch</span>
          <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(22px,4vw,34px)', fontWeight:700, marginBottom:16, lineHeight:1.2 }}>
            Talk to a Gemologist.<br />
            <em style={{ fontStyle:'italic', background:'linear-gradient(135deg,#e879a0,#0ea5e9)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Hemal Thakor Personally Responds.</em>
          </h3>
          <p style={{ fontSize:14, color:'#475569', lineHeight:1.9, marginBottom:24 }}>Every inquiry answered personally — no bots, no delays. Just an expert gemologist who cares.</p>

          {[['📞','Call / WhatsApp','+91 98258 99807'],['📧','Email','hemalthakor2011@gmail.com'],['📍','Visit Our Store','Shivratna Gemstone, Khambhat, Anand, Gujarat – 388620'],['⏰','Store Hours','Mon–Sat: 10:00 AM – 7:00 PM | Sun: By Appointment']].map(([icon,label,val]) => (
            <div key={label} style={{ display:'flex', gap:12, alignItems:'flex-start', marginBottom:18 }}>
              <div style={{ width:40, height:40, borderRadius:11, background:'#fff', boxShadow:'0 4px 16px rgba(14,165,233,0.10)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{icon}</div>
              <div>
                <strong style={{ fontSize:13, fontWeight:600, display:'block' }}>{label}</strong>
                <span style={{ fontSize:13, color:'#475569', wordBreak:'break-word' }}>{val}</span>
              </div>
            </div>
          ))}

          <a href="https://wa.me/919825899807" target="_blank" rel="noreferrer"
            style={{ display:'inline-flex', alignItems:'center', gap:10, background:'#25D366', color:'#fff', padding:'13px 22px', borderRadius:99, textDecoration:'none', fontWeight:500, fontSize:14, marginTop:20, boxShadow:'0 6px 18px rgba(37,211,102,0.3)' }}>
            💬 Chat on WhatsApp
          </a>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}

export default function App() {
  const { gems, loading, error } = useGems();
  const [selectedGem, setSelectedGem] = useState(null);
  const [inquiryGem,  setInquiryGem]  = useState(null);

  return (
    <>
      <Navbar onConsult={() => setInquiryGem('General Inquiry')} />
      <Hero onConsult={() => setInquiryGem('General Inquiry')} />
      <TrustBar />
      <About />
      <GemGrid gems={gems} loading={loading} error={error} onOpen={setSelectedGem} onInquire={setInquiryGem} />
      <WhyUs />
      <Contact />
      <Footer />

      {selectedGem && <GemModal gem={selectedGem} onClose={() => setSelectedGem(null)} onInquire={setInquiryGem} />}
      {inquiryGem  && <InquiryModal gemName={inquiryGem} onClose={() => setInquiryGem(null)} />}

      {/* Sticky WhatsApp */}
      <a href="https://wa.me/919825899807" target="_blank" rel="noreferrer"
        style={{ position:'fixed', bottom:24, right:20, zIndex:300, width:52, height:52, background:'#25D366', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, textDecoration:'none', boxShadow:'0 8px 24px rgba(37,211,102,0.45)', animation:'bounce 3s ease-in-out infinite' }}>
        💬
      </a>
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}`}</style>
    </>
  );
}
