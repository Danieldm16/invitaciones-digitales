"use client";

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, Mail, MapPin, Music, Clock, Users, 
  Calendar, MessageCircle, Heart, Star, Baby, 
  GraduationCap, Cloud, Cake, Briefcase, Cross,
  QrCode, UtensilsCrossed, ShieldCheck, Sparkles
} from 'lucide-react';

export default function LandingPage() {
  const preciosRef = useRef<null | HTMLDivElement>(null);

  const colores = {
    rosa: "text-[#D4A39E]",
    rosaBg: "bg-[#D4A39E]",
    verde: "text-[#8E9B8E]",
    verdeBg: "bg-[#8E9B8E]",
    gris: "text-[#2E2820]",
    grisBg: "bg-[#2E2820]",
    crema: "bg-[#FAF9F6]"
  };

  const scrollToPrecios = () => {
    preciosRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const contactarWhatsApp = (paquete: string) => {
    const mensaje = `¡Hola! Me encantó su página. Me interesa solicitar información sobre el Paquete ${paquete}.`;
    window.open(`https://wa.me/5218442995994?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  const paquetes = [
    {
      nombre: "Básico",
      precio: "$390",
      color: "border-[#EAE4D9]",
      tag: "Ideal Bautizos & Cumples",
      beneficios: [
        "Invitación Web Interactiva (no es PDF)",
        "Ubicación GPS directa en Google Maps",
        "Confirmación rápida por WhatsApp",
        "Foto de portada en alta definición",
        "Datos del evento y frase dedicatoria",
        "Carga instantánea en cualquier celular"
      ],
      cta: "Elegir Básico"
    },
    {
      nombre: "Moderado",
      precio: "$790",
      color: "border-[#8E9B8E] border-2",
      popular: true,
      tag: "El Más Popular",
      beneficios: [
        "Todo lo del Paquete Básico",
        "Sobre artesanal animado con sello de cera",
        "Música de fondo con reproductor interactivo",
        "Cuenta regresiva en vivo (Días y Horas)",
        "Galería de fotos de momentos especiales",
        "Itinerario con mapas independientes por parada",
        "Código de vestimenta (Dress Code)",
        "Mesa de regalos (Amazon, Liverpool, etc.)"
      ],
      cta: "Elegir Moderado"
    },
    {
      nombre: "Avanzado",
      precio: "$1,490",
      color: "border-[#D4A39E] border-2",
      tag: "Bodas, XV & Graduaciones",
      beneficios: [
        "Todo lo del Paquete Moderado",
        "Apertura con Sobre o Puertas de Gala (Black Tie)",
        "Confirmación RSVP web en base de datos",
        "Control estricto de cupos (Cero colados)",
        "Pase Digital Oficial para cada invitado",
        "Control de Mesas asignadas en tiempo real",
        "Acceso con Código QR para la recepcionista",
        "Galería Lookbook con zoom en pantalla completa",
        "Panel exclusivo de novios con descarga en Excel",
        "Botón para agendar en Google Calendar"
      ],
      cta: "Elegir Avanzado"
    }
  ];

  return (
    <div className={`min-h-screen ${colores.crema} font-sans ${colores.gris} antialiased selection:bg-[#D4A39E] selection:text-white`}>
      
      {/* NAVBAR */}
      <nav className="p-6 flex justify-center bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-[#EAE4D9]">
        <div className="text-center cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <h1 className="text-2xl font-serif tracking-tighter italic">Nuestra<span className={colores.rosa}>Invitacion</span></h1>
          <p className="text-[8px] uppercase tracking-[0.3em] opacity-60 font-bold">Invitaciones que conectan</p>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="py-20 md:py-28 px-6 text-center max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="flex justify-center mb-6">
            <div className={`p-4 rounded-full bg-white shadow-xs border border-[#EAE4D9]`}>
              <Mail className={colores.rosa} size={28} />
            </div>
          </div>
          <h2 className="text-5xl md:text-7xl font-serif mb-8 italic tracking-tight leading-tight text-[#2E2820]">
            Tus momentos inolvidables <br />
            <span className={colores.rosa}>merecen una gran entrada</span>
          </h2>
          <p className="text-base md:text-lg text-[#7A7267] mb-12 max-w-2xl mx-auto leading-relaxed">
            Olvídate de los PDFs pesados y las listas en papel. Creamos experiencias web interactivas con música, confirmación en tiempo real, pases digitales con QR y control de mesas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={scrollToPrecios}
              className={`${colores.grisBg} hover:bg-black text-white px-10 py-4 rounded-full font-bold shadow-lg hover:scale-105 transition-all text-xs uppercase tracking-widest cursor-pointer`}
            >
              Ver Paquetes y Precios
            </button>
            <button 
              onClick={() => contactarWhatsApp("General")}
              className={`border-2 border-[#D4A39E] ${colores.rosa} hover:bg-[#D4A39E] hover:text-white px-10 py-4 rounded-full font-bold transition-all text-xs uppercase tracking-widest cursor-pointer`}
            >
              Cotizar por WhatsApp
            </button>
          </div>
        </motion.div>
      </section>

      {/* TRES PILARES DIFERENCIADORES */}
      <section className="py-16 bg-[#FAF4F0]/60 border-y border-[#EAE4D9] px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 space-y-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-white border border-[#D4A39E]/30 flex items-center justify-center text-[#D4A39E] shadow-xs">
              <Music size={22} />
            </div>
            <h3 className="font-serif italic text-lg font-bold text-[#2E2820]">Música y Animación</h3>
            <p className="text-xs text-[#7A7267] leading-relaxed">Sobres con sello de cera que se abren con música de fondo al tocar la pantalla.</p>
          </div>

          <div className="p-6 space-y-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-white border border-[#8E9B8E]/30 flex items-center justify-center text-[#8E9B8E] shadow-xs">
              <QrCode size={22} />
            </div>
            <h3 className="font-serif italic text-lg font-bold text-[#2E2820]">Pases con Código QR</h3>
            <p className="text-xs text-[#7A7267] leading-relaxed">Cada invitado recibe su boleto digital oficial con mesa asignada para entrar al salón.</p>
          </div>

          <div className="p-6 space-y-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-white border border-[#C5A880]/30 flex items-center justify-center text-[#C5A880] shadow-xs">
              <Users size={22} />
            </div>
            <h3 className="font-serif italic text-lg font-bold text-[#2E2820]">Cero Colados</h3>
            <p className="text-xs text-[#7A7267] leading-relaxed">Tú defines cuántos lugares otorgas por enlace y el sistema bloquea registros extra.</p>
          </div>
        </div>
      </section>

      {/* EVENTOS QUE HACEMOS ESPECIALES */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF4F0] border border-[#D4A39E]/30 rounded-full text-[#D4A39E] text-[10px] font-bold uppercase tracking-wider mb-3">
            <Sparkles size={12} /> Catálogo
          </div>
          <h3 className="text-3xl md:text-4xl font-serif mb-16 italic text-[#2E2820]">Celebraciones que transformamos</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8">
            {[
              { n: "Bodas", i: <Heart size={22} />, desc: "Papelería fina & Black Tie" },
              { n: "XV Años", i: <Star size={22} />, desc: "Música, pases & fiesta" },
              { n: "Graduaciones", i: <GraduationCap size={22} />, desc: "Control de mesas & accesos" },
              { n: "Bautizos", i: <Baby size={22} />, desc: "Diseño tierno e informativo" },
              { n: "Baby Showers", i: <Cloud size={22} />, desc: "Ubicación & confirmaciones" },
              { n: "Cumpleaños", i: <Cake size={22} />, desc: "Reloj dinámico & ambiente" },
              { n: "Corporativos", i: <Briefcase size={22} />, desc: "Check-in por QR profesional" },
              { n: "Primera Comunión", i: <Cross size={22} />, desc: "Detalles religiosos y fiesta" }
            ].map((ev, i) => (
              <motion.div whileHover={{ y: -4 }} key={i} className="group">
                <div className="bg-[#FAF9F6] w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-xs border border-[#EAE4D9] group-hover:border-[#D4A39E] transition-all">
                  <span className={colores.rosa}>{ev.i}</span>
                </div>
                <p className="font-serif text-sm italic font-bold text-[#2E2820]">{ev.n}</p>
                <p className="text-[10px] text-[#A89F91] uppercase tracking-wider font-sans mt-0.5">{ev.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PAQUETES Y PRECIOS */}
      <section ref={preciosRef} className="py-28 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#A89F91]">Precios Transparentes</span>
          <h3 className="text-4xl md:text-5xl font-serif italic text-[#2E2820]">Elige la experiencia para tu evento</h3>
          <div className={`h-0.5 w-16 ${colores.rosaBg} mx-auto mt-4`} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {paquetes.map((p, i) => (
            <div 
              key={i} 
              className={`bg-white p-8 md:p-10 rounded-[3rem] shadow-xl relative flex flex-col justify-between transition-all hover:shadow-2xl ${p.color}`}
            >
              {p.popular && (
                <span className={`absolute -top-3.5 left-1/2 -translate-x-1/2 ${colores.verdeBg} text-white px-5 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-xs`}>
                  {p.tag}
                </span>
              )}

              <div>
                <div className="mb-4">
                  <span className="text-[10px] uppercase font-bold text-[#A89F91] tracking-wider block">{p.tag}</span>
                  <h4 className="text-3xl font-serif italic text-[#2E2820]">{p.nombre}</h4>
                </div>

                <div className="mb-8 pb-6 border-b border-[#F2EFE9]">
                  <span className="text-5xl font-serif font-bold text-[#2E2820] tracking-tight">{p.precio}</span>
                  <span className="text-xs font-sans text-[#A89F91] uppercase tracking-wider ml-1.5 font-bold">MXN</span>
                </div>

                <ul className="space-y-3.5 mb-8">
                  {p.beneficios.map((b, j) => (
                    <li key={j} className="flex items-start gap-3 text-xs text-[#554E45] leading-relaxed">
                      <Check size={16} className={`${colores.verde} shrink-0 mt-0.5`} />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => contactarWhatsApp(p.nombre)}
                className={`w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-[11px] transition-all cursor-pointer shadow-xs active:scale-95 ${
                  p.popular 
                    ? colores.verdeBg + ' hover:bg-[#7D8B7D] text-white shadow-md shadow-[#8E9B8E]/30' 
                    : 'bg-[#2E2820] text-white hover:bg-black'
                }`}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-[#A89F91] mt-12 font-sans italic">
          * Todos los paquetes incluyen dominio web, soporte y vigencia activa durante todo tu evento.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="py-20 border-t border-[#EAE4D9] text-center bg-white">
        <div className="mb-8">
          <h4 className="text-2xl font-serif italic mb-1 text-[#2E2820]">Nuestra<span className={colores.rosa}>Invitacion</span></h4>
          <p className="text-[9px] text-[#A89F91] uppercase tracking-[0.4em]">Invitaciones que conectan • Hecho en México</p>
        </div>
        <div className="flex gap-6 justify-center mb-8 text-[#A89F91]">
          <button onClick={() => contactarWhatsApp("Dudas")} className="hover:text-[#D4A39E] transition-colors cursor-pointer">
            <MessageCircle size={20} />
          </button>
          <a href="mailto:contacto@nuestrainvitacion.com" className="hover:text-[#D4A39E] transition-colors">
            <Mail size={20} />
          </a>
        </div>
        <p className="text-[10px] text-[#C5BDB2] uppercase tracking-widest">© 2026 Nuestra Invitación. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}