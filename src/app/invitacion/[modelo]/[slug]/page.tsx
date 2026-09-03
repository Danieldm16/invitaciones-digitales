"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Calendar, Gift, Music, Users, Utensils, 
  CheckCircle2, Clock, MessageCircle, Heart, Camera, Shirt 
} from 'lucide-react';

import { EVENTOS } from '@/lib/eventos-config';
import { supabase } from '@/lib/supabase';

// ==========================================
// 1. MOTOR BÁSICO (Simplicidad y Claridad)
// ==========================================
const LayoutBasico = ({ data }: { data: any }) => {
  const tema = data.tema;
  return (
    <div className={`min-h-screen ${tema.fondo} flex items-center justify-center p-4 ${tema.fuente}`}>
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 text-center">
        <div className="h-64 relative">
          <img src={data.foto_hero} className="w-full h-full object-cover" />
          <div className={`absolute bottom-0 left-0 right-0 h-1 ${tema.primario} opacity-50`} />
        </div>
        <div className="p-8">
          <h2 className={`text-xs uppercase tracking-[0.3em] ${tema.acento} font-bold mb-2`}>{data.titulo}</h2>
          <h1 className="text-4xl font-black text-slate-800 mb-4">{data.nombre}</h1>
          <p className="text-slate-500 italic mb-8">"{data.frase}"</p>
          <div className="bg-slate-50 p-6 rounded-2xl text-left space-y-3 mb-8 text-slate-600">
            <p>📅 <strong>{data.fecha}</strong></p>
            <p>📍 {data.lugar}</p>
          </div>
          <div className="space-y-3">
            <a href={data.mapa} target="_blank" className={`block w-full ${tema.boton} text-white py-4 rounded-xl font-bold transition-all`}>📍 Ver Mapa</a>
            <a href={`https://wa.me/${data.wa_confirmar}`} target="_blank" className="block w-full bg-green-500 text-white py-4 rounded-xl font-bold">✅ Confirmar WhatsApp</a>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. MOTOR MODERADO (Interactividad y Estilo)
// ==========================================
const LayoutModerado = ({ data }: { data: any }) => {
  const tema = data.tema;
  const [timeLeft, setTimeLeft] = useState({ dias: 0, horas: 0, min: 0, seg: 0 });
  

  useEffect(() => {
    const targetDate = new Date(data.fechaISO).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance < 0) return clearInterval(interval);
      setTimeLeft({
        dias: Math.floor(distance / (1000 * 60 * 60 * 24)),
        horas: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        min: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seg: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [data.fechaISO]);

  return (
    <div className={`min-h-screen ${tema.fondo} ${tema.fuente} pb-20`}>
      <header className="relative h-[50vh]">
        <img src={data.foto_hero} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-2 tracking-tighter">{data.nombre}</h1>
            <p className="uppercase tracking-[0.4em] text-sm font-light">{data.titulo}</p>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto -mt-10 relative z-10 px-4 space-y-8">
        {/* Reloj Animado */}
        <div className="bg-white rounded-3xl shadow-xl p-8 flex justify-around text-center border border-slate-100">
          {Object.entries(timeLeft).map(([label, val]) => (
            <div key={label}>
              <p className={`text-3xl font-bold ${tema.acento}`}>{val}</p>
              <p className="text-[10px] uppercase text-slate-400 font-black">{label}</p>
            </div>
          ))}
        </div>

        {/* Galería Simple (Nueva en Moderada) */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-lg">
           <div className="flex items-center gap-2 mb-4 text-slate-400 uppercase text-[10px] font-bold tracking-widest">
              <Camera size={14} /> Momentos
           </div>
           <div className="grid grid-cols-2 gap-2">
              <div className="h-40 bg-slate-100 rounded-2xl overflow-hidden"><img src={data.foto_hero} className="w-full h-full object-cover" /></div>
              <div className="h-40 bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center text-slate-300">Foto 2</div>
           </div>
        </div>

        {/* Datos y Regalos */}
        <div className="bg-white rounded-[2.5rem] p-10 shadow-lg text-center space-y-10 text-slate-600">
           <div className="space-y-2">
              <Calendar className={`mx-auto ${tema.acento}`} />
              <p className="text-xl font-bold text-slate-800">{data.fecha}</p>
              <p className="text-sm italic">A las {data.hora}</p>
           </div>
           <div className="space-y-4">
              <MapPin className={`mx-auto ${tema.acento}`} />
              <p className="text-slate-800 font-medium">{data.lugar}</p>
              <a href={data.mapa} target="_blank" className={`inline-block text-white px-8 py-3 rounded-full text-xs font-bold uppercase ${tema.boton}`}>Ver Mapa</a>
           </div>
           <div className="pt-8 border-t border-slate-100">
              <Gift className="mx-auto mb-4 text-slate-300" />
              <a href={data.mesa_regalos} target="_blank" className={`block w-full py-4 rounded-2xl text-white font-bold text-sm ${tema.boton}`}>Mesa de Regalos</a>
           </div>
        </div>

        <a href={`https://wa.me/${data.wa_confirmar}`} className="flex items-center justify-center gap-2 w-full bg-green-500 text-white py-5 rounded-[2rem] font-bold shadow-xl">
          <MessageCircle size={20} /> Confirmar Asistencia
        </a>
      </main>
    </div>
  );
};

// ==========================================
// 3. MOTOR AVANZADO (Lujo y Gestión Total)
// ==========================================
const LayoutAvanzado = ({ data, pasesTotales }: { data: any, pasesTotales: number }) => {
  const tema = data.tema;
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adultos, setAdultos] = useState(1);
  const [ninos, setNinos] = useState(0);
  const [playing, setPlaying] = useState(false);
  // Referencia tipada para TypeScript
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleMusica = () => {
  const audio = audioRef.current;
  if (!audio) return;

  // Verificamos si hay una fuente válida antes de intentar reproducir
  if (!audio.src || audio.src.includes('undefined')) {
    console.error("Error: No hay una fuente de audio válida.");
    return;
  }

  if (playing) {
    audio.pause();
  } else {
    // El play() devuelve una promesa, la manejamos para evitar el error de consola
    audio.play().catch(error => {
        console.error("El navegador bloqueó el audio o la fuente es inválida:", error);
    });
  }

  setPlaying(!playing);

  };

  const total = adultos + ninos;
  const cupoExcedido = total > pasesTotales;

  const handleRSVP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cupoExcedido) return;
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      nombre: formData.get('nombre'),
      adultos, ninos,
      alergias: formData.get('alergias'),
      evento: data.id_supabase
    };
    const { error } = await supabase.from('confirmaciones').insert([payload]);
    if (!error) setEnviado(true);
    setLoading(false);
  };

  return (
    <div className={`min-h-screen bg-[#0f0f0f] text-white ${tema.fuente} pb-20`}>
      {/* Hero Cinematográfico */}
      <section className="relative h-screen flex items-center justify-center text-center px-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} className="absolute inset-0">
          <img src={data.foto_hero} className="w-full h-full object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#0f0f0f]" />
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative z-10">
          <Heart className="mx-auto mb-6 text-amber-400" fill="currentColor" size={30} />
          <h2 className="tracking-[0.6em] text-[10px] uppercase mb-4 text-amber-400 font-bold">Reserva la fecha</h2>
          <h1 className="text-7xl font-serif mb-6 italic text-amber-50 leading-tight">{data.nombre}</h1>
          <div className="h-[1px] w-20 bg-amber-400 mx-auto mb-6" />
          <p className="text-xl font-light tracking-widest uppercase text-amber-100/60">{data.fecha}</p>
        </motion.div>
      </section>

      <main className="max-w-md mx-auto px-6 space-y-24 -mt-20 relative z-20">
        
        {/* Sección de Pases (Diferenciador visual) */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[3rem] p-10 text-center">
           <Users className="mx-auto mb-4 text-amber-400" />
           <p className="text-xs uppercase tracking-[0.2em] text-amber-400/60 mb-2">Pases exclusivos</p>
           <h3 className="text-2xl font-serif italic text-amber-50">Hemos reservado {pasesTotales} lugares para ti</h3>
        </div>

        {/* Cronograma / Detalles Dinámicos */}
        <div className="space-y-4">
            <Clock className="mx-auto text-amber-400" size={24} />
            <h4 className="text-sm uppercase tracking-widest text-amber-400/80 font-bold">Cronograma</h4>
            <div className="space-y-6 text-amber-50/70 font-light">
                {/* Mapeamos el itinerario que pusimos en el config */}
                {data.itinerario?.map((item: any, i: number) => (
                    <p key={i} className="text-lg">
                    <span className="text-amber-200/40 mr-2">{item.h}</span> — {item.a}
                    </p>
                ))}
            </div>
        </div>

        {/* Dress Code Dinámico */}
        <div className="bg-amber-400/5 border border-amber-400/10 rounded-[3rem] p-12 text-center">
                <Shirt className="mx-auto mb-4 text-amber-400" />
                <h4 className="text-sm uppercase tracking-widest mb-4 font-bold">Código de Vestimenta</h4>
                <p className="text-2xl font-serif italic mb-2 text-amber-100">{data.dressCode}</p>
                <p className="text-xs text-amber-100/40">Agradecemos respetar el código sugerido.</p>
        </div>

        {/* Formulario RSVP de Lujo */}
        <section className="bg-white text-black rounded-[3rem] p-10 shadow-2xl shadow-amber-400/10">
            <div className="text-center mb-10 text-slate-800">
              <h3 className="text-3xl font-serif italic">R.S.V.P.</h3>
              <p className="text-slate-400 text-xs uppercase tracking-widest mt-2">Favor de confirmar antes del 1 de Dic</p>
            </div>
            <AnimatePresence mode="wait">
              {!enviado ? (
                <form onSubmit={handleRSVP} className="space-y-8">
                  <div className="border-b border-slate-200">
                    <label className="text-[10px] font-bold uppercase text-slate-400">Nombre</label>
                    <input required name="nombre" className="w-full py-2 outline-none text-slate-800 bg-transparent" placeholder="Tu nombre..." />
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="border-b border-slate-200">
                      <label className="text-[10px] font-bold uppercase text-slate-400 text-center block">Adultos</label>
                      <select value={adultos} onChange={(e) => setAdultos(parseInt(e.target.value))} className="w-full py-2 bg-transparent text-slate-800 outline-none">
                        {[...Array(pasesTotales + 1)].map((_, i) => (<option key={i} value={i}>{i}</option>))}
                      </select>
                    </div>
                    <div className="border-b border-slate-200">
                      <label className="text-[10px] font-bold uppercase text-slate-400 text-center block">Niños</label>
                      <select value={ninos} onChange={(e) => setNinos(parseInt(e.target.value))} className="w-full py-2 bg-transparent text-slate-800 outline-none">
                        {[...Array(pasesTotales + 1)].map((_, i) => (<option key={i} value={i}>{i}</option>))}
                      </select>
                    </div>
                  </div>
                  <button disabled={loading || cupoExcedido} className={`w-full py-5 rounded-full font-bold uppercase tracking-widest text-[10px] transition-all ${cupoExcedido ? 'bg-red-50 text-red-400' : 'bg-black text-white'}`}>
                    {loading ? "Procesando..." : cupoExcedido ? "Límite excedido" : "Enviar Confirmación"}
                  </button>
                </form>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10 text-slate-800">
                   <CheckCircle2 size={50} className="mx-auto text-green-500 mb-4" />
                   <h4 className="text-xl font-bold italic font-serif uppercase tracking-tighter">¡Confirmado!</h4>
                   <p className="text-slate-500 text-sm">Gracias por acompañarnos.</p>
                </motion.div>
              )}
            </AnimatePresence>
        </section>
      </main>

      {/* Elemento de audio con precarga desactivada para evitar errores al cargar */}
      <audio 
        ref={audioRef} 
        src={data.musica_url} 
        preload="none" 
        loop 
      />

      {/* Botón flotante con lógica de visualización */}
      <button 
        onClick={toggleMusica}
        className={`fixed bottom-8 right-8 p-4 rounded-full shadow-2xl z-50 transition-all active:scale-90 ${
            playing ? 'bg-amber-500 text-black shadow-amber-500/40' : 'bg-white text-slate-800'
        }`}
      >
        {playing ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}>
            <Music size={24} />
            </motion.div>
        ) : (
            <div className="relative">
            <Music size={24} className="opacity-40" />
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-400 -rotate-45" />
            </div>
        )}
      </button>

    </div>
  );
};

// ==========================================
// CONTROLADOR PRINCIPAL
// ==========================================
function InvitacionDinamica() {
  const params = useParams();
  const searchParams = useSearchParams();

  const modelo = params.modelo as string;
  const slug = params.slug as string;
  const pases = parseInt(searchParams.get('p') || '2');

  // @ts-ignore
  const data = EVENTOS[slug];

  if (!data) return <div className="p-20 text-center font-bold text-red-500">Error: Invitación no encontrada.</div>;

  if (modelo === 'basica') return <LayoutBasico data={data} />;
  if (modelo === 'moderada') return <LayoutModerado data={data} />;
  if (modelo === 'avanzada') return <LayoutAvanzado data={data} pasesTotales={pases} />;

  return <div className="p-20 text-center">Modelo no válido</div>;
}

export default function Page() {
  return <Suspense><InvitacionDinamica /></Suspense>;
}