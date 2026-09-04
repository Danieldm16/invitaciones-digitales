"use client";

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, Mail, MapPin, Music, Clock, Users, 
  Calendar, MessageCircle, Heart, Star, Baby, 
  GraduationCap, Cloud, Cake, Briefcase, Cross 
} from 'lucide-react';

export default function LandingPage() {
  // Referencia para el scroll automático
  const preciosRef = useRef<null | HTMLDivElement>(null);

  const colores = {
    rosa: "text-[#D4A39E]",
    rosaBg: "bg-[#D4A39E]",
    verde: "text-[#8E9B8E]",
    verdeBg: "bg-[#8E9B8E]",
    gris: "text-[#333333]",
    grisBg: "bg-[#333333]",
    crema: "bg-[#FAF9F6]"
  };

  const scrollToPrecios = () => {
    preciosRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const contactarWhatsApp = (paquete: string) => {
    const mensaje = `¡Hola! Me encantó su página. Me interesa pedir información sobre el Paquete ${paquete}.`;
    window.open(`https://wa.me/528445031562?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  const paquetes = [
    {
      nombre: "Básico",
      precio: "$590",
      color: "border-slate-200",
      beneficios: ["Diseño Elegante", "Ubicación GPS", "Botón WhatsApp", "1 Foto Principal", "Invitación tipo Micro-site"],
      cta: "Elegir Básico"
    },
    {
      nombre: "Moderado",
      precio: "$950",
      color: "border-[#8E9B8E] border-2",
      popular: true,
      beneficios: ["Todo lo del Básico", "Cuenta Regresiva", "Música de fondo", "Mesa de Regalos", "Galería de Fotos (5-10 fotos)", "Animaciones Fluidas"],
      cta: "Elegir Moderado"
    },
    {
      nombre: "Avanzado",
      precio: "$1,490",
      color: "border-[#D4A39E] border-2",
      beneficios: ["Todo lo del Moderado", "Galería de Fotos Premium", "Confirmación RSVP (Base de datos)", "Control de Pases Individuales", "Panel para el cliente (Admin)", "Itinerario Detallado", "Código de Vestimenta"],
      cta: "Elegir Avanzado"
    }
  ];

  return (
    <div className={`min-h-screen ${colores.crema} font-sans ${colores.gris}`}>
      
      {/* NAVBAR */}
      <nav className="p-6 flex justify-center bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="text-center cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <h1 className="text-2xl font-serif tracking-tighter italic">Nuestra<span className={colores.rosa}>Invitacion</span></h1>
            <p className="text-[8px] uppercase tracking-[0.3em] opacity-60 font-bold">Invitaciones que conectan</p>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="py-24 px-6 text-center max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex justify-center mb-6">
            <div className={`p-4 rounded-full ${colores.crema} shadow-inner border border-white`}>
              <Mail className={colores.rosa} size={32} />
            </div>
          </div>
          <h2 className="text-5xl md:text-7xl font-serif mb-8 italic tracking-tight leading-tight">
            Tus eventos merecen <br />
            <span className={colores.rosa}>una entrada inolvidable</span>
          </h2>
          <p className="text-lg text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            Creamos invitaciones digitales que tus invitados querrán guardar. Interactivas, elegantes y listas para compartir por WhatsApp.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button 
              onClick={scrollToPrecios}
              className={`${colores.grisBg} text-white px-10 py-4 rounded-full font-bold shadow-xl hover:scale-105 transition-transform`}
            >
                Ver Paquetes
            </button>
            <button 
              onClick={() => contactarWhatsApp("General")}
              className={`border-2 border-[#D4A39E] ${colores.rosa} px-10 py-4 rounded-full font-bold hover:bg-[#D4A39E] hover:text-white transition-all`}
            >
                Cotizar ahora
            </button>
          </div>
        </motion.div>
      </section>

      {/* EVENTOS */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-6xl mx-auto text-center">
            <h3 className="text-3xl font-serif mb-20 italic">Eventos que hacemos especiales</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8">
                {[
                    { n: "Bodas", i: <Heart size={24} /> },
                    { n: "XV Años", i: <Star size={24} /> },
                    { n: "Bautizos", i: <Baby size={24} /> },
                    { n: "Graduaciones", i: <GraduationCap size={24} /> },
                    { n: "Baby Showers", i: <Cloud size={24} /> },
                    { n: "Cumpleaños", i: <Cake size={24} /> },
                    { n: "Corporativos", i: <Briefcase size={24} /> },
                    { n: "Primera Comunión", i: <Cross size={24} /> }
                ].map((ev, i) => (
                    <motion.div whileHover={{ y: -5 }} key={i} className="group">
                        <div className="bg-[#FAF9F6] w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                            <span className={colores.rosa}>{ev.i}</span>
                        </div>
                        <p className="font-serif text-xs uppercase tracking-widest font-bold opacity-70">{ev.n}</p>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* PAQUETES (Aquí llega el scroll) */}
      <section ref={preciosRef} className="py-32 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-20">
            <h3 className="text-5xl font-serif mb-4 italic">Nuestros Paquetes</h3>
            <div className={`h-1 w-20 ${colores.rosaBg} mx-auto mb-6`} />
            <p className="text-slate-400 max-w-lg mx-auto italic">Elige el nivel de detalle y tecnología que mejor se adapte a tu celebración.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {paquetes.map((p, i) => (
                <div key={i} className={`bg-white p-12 rounded-[3.5rem] shadow-2xl relative transition-transform hover:scale-[1.02] ${p.color}`}>
                    {p.popular && (
                        <span className={`absolute -top-4 left-1/2 -translate-x-1/2 ${colores.verdeBg} text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]`}>
                            Sugerido
                        </span>
                    )}
                    <h4 className="text-3xl font-serif mb-3 italic">{p.nombre}</h4>
                    <p className="text-5xl font-black mb-10 tracking-tighter">{p.precio}<span className="text-sm font-normal text-slate-300"> MXN</span></p>
                    
                    <ul className="space-y-5 mb-12 min-h-[280px]">
                        {p.beneficios.map((b, j) => (
                            <li key={j} className="flex items-start gap-3 text-sm text-slate-600 leading-tight">
                                <Check size={18} className={`${colores.verde} mt-0.5 flex-shrink-0`} />
                                {b}
                            </li>
                        ))}
                    </ul>

                    <button 
                      onClick={() => contactarWhatsApp(p.nombre)}
                      className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] transition-all ${
                        p.popular 
                        ? colores.verdeBg + ' text-white shadow-xl shadow-[#8E9B8E]/30' 
                        : 'bg-slate-900 text-white hover:bg-black'
                      }`}
                    >
                        {p.cta}
                    </button>
                </div>
            ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-24 border-t border-slate-100 text-center bg-white">
        <div className="mb-12">
            <h4 className="text-2xl font-serif italic mb-2">Nuestra<span className={colores.rosa}>Invitacion</span></h4>
            <p className="text-[10px] text-slate-400 uppercase tracking-[0.4em]">Diseño & Tecnología para tus eventos</p>
        </div>
        <div className="flex gap-8 justify-center mb-12">
            <a href="#" className="text-slate-300 hover:text-[#D4A39E] transition-colors"><MessageCircle /></a>
            <a href="#" className="text-slate-300 hover:text-[#D4A39E] transition-colors"><Mail /></a>
        </div>
        <p className="text-[10px] text-slate-300 uppercase tracking-widest">© 2026 Nuestra Invitación. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}