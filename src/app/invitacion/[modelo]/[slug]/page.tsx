"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Calendar, Gift, Music, Users, Utensils, 
  CheckCircle2, Clock, MessageCircle, Heart, Camera, Shirt,
  X, CalendarPlus, Music2, AlertCircle, Sparkles, PartyPopper
} from 'lucide-react';

import { EVENTOS, ESTILOS } from '@/lib/eventos-config';
import { supabase } from '@/lib/supabase';

// =========================================================================
// PUERTAS DE GALA (Cortinilla para Black Tie)
// =========================================================================
const PuertasGala = ({ alAbrir, nombre }: { alAbrir: () => void, nombre: string }) => {
  const inicial = nombre.charAt(0).toUpperCase();

  return (
    <motion.div 
      key="puertas-gala-overlay"
      className="fixed inset-0 z-[100] flex overflow-hidden bg-[#080808]"
      exit={{ opacity: 0, transition: { duration: 1, delay: 0.4 } }}
    >
      <div className="absolute inset-0 flex justify-center pointer-events-none">
        <div className="w-[1.5px] h-full bg-gradient-to-b from-transparent via-[#C5A880]/50 to-transparent shadow-[0_0_25px_rgba(212,175,55,0.4)]" />
      </div>

      <motion.div 
        initial={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
        className="relative w-1/2 h-full bg-[#0E0E0E] border-r border-[#C5A880]/20 flex items-center justify-end"
      />
      <motion.div 
        initial={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
        className="relative w-1/2 h-full bg-[#0E0E0E] border-l border-[#C5A880]/20 flex items-center justify-start"
      />

      <div className="absolute inset-0 flex items-center justify-center z-[110]">
        <motion.div exit={{ scale: 0, opacity: 0, transition: { duration: 0.4 } }} className="relative">
          <motion.div 
            animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute -inset-10 bg-[#D4AF37]/20 rounded-full blur-3xl" 
          />
          <motion.button
            onClick={alAbrir}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-36 h-36 flex items-center justify-center cursor-pointer group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#1F1B16] via-[#14120E] to-[#0A0907] rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.8)] border-2 border-[#D4AF37]/50 group-hover:border-[#D4AF37] transition-colors" />
            <div className="absolute inset-2 border border-[#C5A880]/30 rounded-full" />
            <div className="relative flex flex-col items-center">
              <span className="text-[#EADBB6] font-serif text-5xl italic leading-none">{inicial}</span>
              <div className="h-[1px] w-8 bg-[#C5A880]/40 my-1" />
              <span className="text-[#C5A880]/70 text-[7px] font-sans font-bold tracking-[0.4em] uppercase">Pulsar</span>
            </div>
            <div className="absolute -bottom-1 bg-[#D4AF37] w-8 h-8 rounded-full flex items-center justify-center shadow-lg border border-black">
              <Heart size={12} className="text-[#14120E]" fill="currentColor" />
            </div>
          </motion.button>
        </motion.div>
      </div>

      <motion.div exit={{ opacity: 0 }} className="absolute bottom-14 inset-x-0 text-center z-[105]">
        <p className="text-[#C5A880]/60 font-serif italic text-sm tracking-[0.3em] uppercase">
          Invitación Exclusiva • {nombre}
        </p>
      </motion.div>
    </motion.div>
  );
};

// =========================================================================
// 1. MOTOR BÁSICO ($590)
// =========================================================================
const LayoutBasico = ({ data }: { data: any }) => {
  const tema = data.tema || ESTILOS.crema_lujo;
  return (
    <div className={`min-h-screen ${tema.fondo} flex items-center justify-center p-4 ${tema.fuente}`}>
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 text-center text-slate-800">
        <div className="h-64 relative">
          <img src={data.foto_hero} className="w-full h-full object-cover" alt={data.nombre} />
          <div className={`absolute bottom-0 left-0 right-0 h-1 ${tema.acentoBg} opacity-50`} />
        </div>
        <div className="p-8">
          <h2 className={`text-xs uppercase tracking-[0.3em] ${tema.acento} font-bold mb-2`}>{data.titulo}</h2>
          <h1 className="text-4xl font-black mb-4">{data.nombre}</h1>
          <p className="text-slate-500 italic mb-8">"{data.frase}"</p>
          <div className="bg-slate-50 p-6 rounded-2xl text-left space-y-3 mb-8 text-slate-600 border border-slate-100">
            <p>📅 <strong>{data.fecha}</strong></p>
            <p>📍 {data.lugar}</p>
          </div>
          <div className="space-y-3">
            <a href={data.mapa} target="_blank" rel="noopener noreferrer" className="block w-full bg-[#C5A880] text-white py-4 rounded-xl font-bold transition-all">
              📍 Ver Mapa
            </a>
            <a href={`https://wa.me/${data.wa_confirmar}`} target="_blank" rel="noopener noreferrer" className="block w-full bg-[#25D366] text-white py-4 rounded-xl font-bold">
              ✅ Confirmar WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 2. MOTOR MODERADO ($950)
// =========================================================================
const LayoutModerado = ({ data }: { data: any }) => {
  const tema = data.tema || ESTILOS.crema_lujo;
  const [sobreAbierto, setSobreAbierto] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ dias: 0, horas: 0, min: 0, seg: 0 });
  const audioRef = useRef<HTMLAudioElement>(null);

  const esBoda = data.tipo === "boda";

  useEffect(() => {
    if (!data.fechaISO) return;
    const fechaObjetivo = new Date(data.fechaISO).getTime();

    const actualizarContador = () => {
      const ahora = new Date().getTime();
      const distancia = fechaObjetivo - ahora;

      if (distancia <= 0) {
        setTimeLeft({ dias: 0, horas: 0, min: 0, seg: 0 });
        return;
      }

      setTimeLeft({
        dias: Math.floor(distancia / (1000 * 60 * 60 * 24)),
        horas: Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        min: Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60)),
        seg: Math.floor((distancia % (1000 * 60)) / 1000),
      });
    };

    actualizarContador();
    const interval = setInterval(actualizarContador, 1000);
    return () => clearInterval(interval);
  }, [data.fechaISO]);

  const abrirSobre = () => {
    setSobreAbierto(true);
    if (audioRef.current) {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  const mensajeWhatsApp = encodeURIComponent(
    esBoda
      ? `¡Hola! Confirmo con mucho gusto mi asistencia a la boda de ${data.nombre} 💍✨`
      : `¡Hola ${data.nombre}! Confirmo mi asistencia a tu fiesta 🎉🎂`
  );

  // Cumpleaños Moderado
  if (!esBoda) {
    return (
      <div className={`min-h-screen ${tema.fondo} ${tema.fuente} pb-20 antialiased`}>
        <audio ref={audioRef} src={data.musica_url} loop preload="auto" />
        <header className="relative h-[50vh]">
          <img src={data.foto_hero} className="w-full h-full object-cover" alt={data.nombre} />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
            <div className="text-center px-4">
              <h1 className="text-5xl font-black mb-2 tracking-tighter drop-shadow-md">{data.nombre}</h1>
              <p className="uppercase tracking-[0.4em] text-sm font-medium opacity-90">{data.titulo}</p>
            </div>
          </div>
        </header>

        <main className="max-w-md mx-auto -mt-10 relative z-10 px-4 space-y-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 flex justify-around text-center border border-slate-100">
            {Object.entries(timeLeft).map(([label, val]) => (
              <div key={label}>
                <p className="text-3xl font-black text-indigo-600">{val}</p>
                <p className="text-[10px] uppercase text-slate-400 font-black tracking-widest">{label}</p>
              </div>
            ))}
          </div>

          {data.galeria && data.galeria.length > 0 && (
            <div className="bg-white rounded-[2.5rem] p-8 shadow-lg border border-slate-100">
              <div className="flex items-center gap-2 mb-6 text-slate-400 uppercase text-[10px] font-black tracking-widest">
                <Camera size={14} /> Momentos
              </div>
              <div className="grid grid-cols-2 gap-3">
                {data.galeria.slice(0, 4).map((foto: string, i: number) => (
                  <div key={i} className="h-40 bg-slate-100 rounded-2xl overflow-hidden shadow-sm">
                    <img src={foto} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" alt="Momento" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-[2.5rem] p-10 shadow-lg text-center space-y-10 text-slate-600 border border-slate-100">
            <div className="space-y-2 text-center">
              <Calendar className="mx-auto text-indigo-600" size={28} />
              <p className="text-xl font-bold text-slate-800">{data.fecha}</p>
              <p className="text-sm italic">A las {data.hora}</p>
            </div>
            <div className="space-y-4">
              <MapPin className="mx-auto text-indigo-600" size={28} />
              <p className="text-slate-800 font-medium">{data.lugar}</p>
              <p className="text-xs text-slate-400">{data.direccion}</p>
              <a href={data.mapa} target="_blank" rel="noopener noreferrer" className="inline-block text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest bg-indigo-600">
                Ver Mapa
              </a>
            </div>
          </div>

          <a
            href={`https://wa.me/${data.wa_confirmar}?text=${mensajeWhatsApp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-5 rounded-[2rem] font-bold shadow-xl active:scale-95 transition-all text-sm"
          >
            <MessageCircle size={20} /> Confirmar Asistencia
          </a>
        </main>
      </div>
    );
  }

  // Boda Moderada (Papelería Crema Canva)
  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#33302C] flex justify-center py-0 md:py-8 px-0 md:px-4 font-serif antialiased selection:bg-[#C5A880] selection:text-white relative">
      <audio ref={audioRef} src={data.musica_url} loop preload="auto" />

      <AnimatePresence mode="wait">
        {!sobreAbierto && (
          <motion.div
            key="sobre-modal-moderada"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -70, scale: 0.95 }}
            transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
            className="fixed inset-0 z-50 bg-[#1A1816] flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="absolute w-80 h-80 bg-[#C5A880]/15 rounded-full blur-3xl pointer-events-none" />
            <div 
              onClick={abrirSobre}
              className="relative w-full max-w-sm aspect-[4/3] bg-[#E8DCBF] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] border border-[#D6C49E] p-8 flex flex-col items-center justify-between overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform active:scale-[0.98]"
            >
              <div className="absolute inset-x-0 top-0 h-28 bg-[#DECCA6] border-b border-[#C8B388] pointer-events-none" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
              <div className="relative z-10 text-[9px] uppercase tracking-[0.4em] text-[#7A6B53]">Invitación Especial</div>
              <div className="relative z-10 my-auto space-y-2 pointer-events-none">
                <h1 className="text-4xl italic text-[#383126] font-normal leading-tight">{data.nombre}</h1>
                <div className="w-10 h-[1px] bg-[#B89B5E] mx-auto" />
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#73634B]">{data.fecha}</p>
              </div>
              <div className="relative z-20 w-16 h-16 rounded-full bg-gradient-to-br from-[#E2B755] via-[#C99C35] to-[#997316] shadow-xl border-2 border-white flex flex-col items-center justify-center">
                <span className="text-white text-xl drop-shadow-sm">⚜</span>
                <span className="text-white text-[7px] tracking-[0.2em] font-sans font-bold uppercase mt-0.5">Abrir</span>
              </div>
            </div>
            <p onClick={abrirSobre} className="text-[#A89F91] text-xs font-serif italic mt-6 tracking-widest cursor-pointer animate-pulse">
              Toca el sobre para abrir
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="w-full max-w-md bg-[#FAF8F5] min-h-screen shadow-2xl relative border-x border-[#EBE4D8] overflow-hidden">
        {/* Cabecera */}
        <header className="relative pt-10 px-6 pb-6 flex flex-col items-center bg-gradient-to-b from-[#EFE8DA] to-[#FAF8F5]">
          <div className="w-[82%] aspect-[3/4] rounded-t-2xl overflow-hidden shadow-xl border-4 border-white bg-white">
            <img src={data.foto_hero} alt={data.nombre} className="w-full h-full object-cover" />
          </div>
          <div className="w-full -mt-10 pt-12 pb-6 px-6 bg-[#E3D4B6] rounded-2xl shadow-lg border border-[#D1BE99] text-center relative z-10">
            <h1 className="text-4xl md:text-5xl italic text-[#3F372C] leading-none">{data.nombre}</h1>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#73634B] mt-3 font-sans font-medium">Nuestra Boda</p>
          </div>
        </header>

        {/* Reproductor */}
        <section className="px-6 py-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#EBE4D8] text-center space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-[#6E665D] font-sans font-semibold">
              {playing ? "Sonando nuestra canción..." : "Dale Play Para Escuchar Nuestra Canción"}
            </p>
            <div className="flex items-center justify-center gap-6 text-[#544D45]">
              <button onClick={toggleAudio} className="w-11 h-11 rounded-full bg-[#3B352E] text-[#F7F4EE] flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all text-xs cursor-pointer">
                {playing ? '⏸' : '▶'}
              </button>
            </div>
          </div>
        </section>

        {/* Tarjeta Nos Casamos */}
        <section className="px-6 py-6">
          <div className="relative bg-white rounded-2xl p-8 pt-12 shadow-md border-2 border-[#D4AF37]/35 text-center space-y-6">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-13 h-13 rounded-full bg-gradient-to-br from-[#E2B755] via-[#C99C35] to-[#997316] shadow-md border-2 border-white flex items-center justify-center">
              <span className="text-white text-lg">⚜</span>
            </div>
            <h2 className="text-4xl italic text-[#2E2820]">¡Nos Casamos!</h2>
            <p className="text-[11px] leading-relaxed uppercase tracking-[0.18em] text-[#696156] font-sans font-light px-2">"{data.frase}"</p>
            <div className="py-6 border-y border-[#EBE4D8] space-y-2">
              <p className="text-sm tracking-[0.3em] uppercase text-[#85796A] font-sans font-medium">Octubre</p>
              <div className="flex items-center justify-center gap-6 text-[#2E2820]">
                <span className="text-xs uppercase tracking-[0.2em] font-sans">Sábado</span>
                <span className="text-5xl font-serif font-light">24</span>
                <span className="text-xs uppercase tracking-[0.2em] font-sans">2026</span>
              </div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#8F867A] pt-1 font-sans">{data.direccion}</p>
            </div>
          </div>
        </section>

        {/* Cuenta Regresiva */}
        <section className="px-6 py-6 text-center space-y-4">
          <h3 className="text-3xl italic text-[#C5A880]">Faltan:</h3>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { val: timeLeft.dias, label: 'días' },
              { val: timeLeft.horas, label: 'horas' },
              { val: timeLeft.min, label: 'minutos' },
              { val: timeLeft.seg, label: 'segundos' },
            ].map((item, i) => (
              <div key={i} className="bg-white/90 py-3 rounded-xl shadow-xs border border-[#EAE2D5]">
                <span className="text-3xl font-light text-[#3F372C] block font-serif">{item.val < 10 ? `0${item.val}` : item.val}</span>
                <span className="text-[9px] text-[#8C847A] uppercase tracking-wider block font-sans mt-0.5">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Galería */}
        {data.galeria && (
          <section className="px-6 py-6 space-y-4">
            <div className="text-center space-y-1">
              <Camera className="mx-auto text-[#C5A880]" size={22} strokeWidth={1.5} />
              <h3 className="text-xs uppercase tracking-[0.3em] text-[#85796A] font-sans font-semibold">Nuestra Historia</h3>
              <p className="text-2xl italic text-[#3F372C]">Galería de Fotos</p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              {data.galeria.map((imgUrl: string, idx: number) => (
                <div key={idx} className={`rounded-2xl overflow-hidden shadow-sm border-2 border-white bg-white group ${idx === 0 ? "col-span-2 aspect-[16/10]" : "aspect-square"}`}>
                  <img src={imgUrl} alt="Foto" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Itinerario */}
        <section className="px-6 py-6">
          <div className="bg-white rounded-3xl p-8 shadow-md border-2 border-[#D4AF37]/40 text-center space-y-8">
            <div className="text-[#C5A880] text-xl">❖</div>
            <h3 className="text-3xl italic text-[#C5A880] -mt-5">Itinerario</h3>
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF6EE] flex items-center justify-center text-2xl border border-[#D4AF37]/30">⛪</div>
              <h4 className="text-2xl italic text-[#3A332B]">Ceremonia</h4>
              <p className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-sans font-bold">{data.hora || "5:00 PM"}</p>
              <p className="text-sm text-[#61584D] font-sans">{data.lugar}</p>
              <a href={data.mapa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-6 py-2 rounded-full border border-[#C5A880] text-[11px] uppercase tracking-[0.2em] text-[#8A6F48] hover:bg-[#C5A880]/10 transition-colors font-sans">Ver Mapa ↗</a>
            </div>
            <div className="w-16 h-[1px] bg-[#E8DFCF] mx-auto" />
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF6EE] flex items-center justify-center text-2xl border border-[#D4AF37]/30">🥂</div>
              <h4 className="text-2xl italic text-[#3A332B]">Recepción</h4>
              <p className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-sans font-bold">7:00 PM</p>
              <p className="text-sm text-[#61584D] font-sans">{data.lugar}</p>
              <a href={data.mapa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-6 py-2 rounded-full border border-[#C5A880] text-[11px] uppercase tracking-[0.2em] text-[#8A6F48] hover:bg-[#C5A880]/10 transition-colors font-sans">Ver Mapa ↗</a>
            </div>
          </div>
        </section>

        {/* Dress Code & Regalos */}
        <section className="px-6 py-4 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-[#EBE4D8] flex items-center gap-5">
            <div className="text-4xl">🤵👰</div>
            <div className="space-y-1">
              <h4 className="text-2xl italic text-[#C5A880]">Dress Code</h4>
              <p className="text-xs uppercase tracking-[0.2em] font-sans font-bold text-[#3A332B]">{data.dressCode || "FORMAL"}</p>
              <p className="text-[10px] text-[#7A7267] font-sans tracking-wide">Evitar asistir de color blanco o similares.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-[#EBE4D8] text-center space-y-4">
            <h4 className="text-2xl italic text-[#C5A880]">Regalos</h4>
            <p className="text-[11px] leading-relaxed uppercase tracking-[0.15em] text-[#696156] font-sans">Su compañía es lo más importante. Si deseas hacernos algún obsequio, lo recibiremos con mucho cariño.</p>
            <a href={data.mesa_regalos} target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-3 border border-[#C5A880] text-[#8A6F48] text-xs uppercase tracking-[0.2em] rounded-full hover:bg-[#C5A880]/10 transition-all font-sans font-semibold">Ver Lista</a>
          </div>
        </section>

        {/* Sobre de Confirmación WhatsApp */}
        <section className="px-6 pt-12 pb-24 flex flex-col items-center">
          <div className="relative w-full max-w-xs flex flex-col items-center">
            <div className="w-[90%] h-20 bg-[#D4C39E] rounded-t-2xl mx-auto -mb-16 border-t border-[#C2B088] shadow-inner opacity-90" style={{ clipPath: 'polygon(0 100%, 50% 0, 100% 100%)' }} />
            <div className="relative z-10 w-[84%] bg-white rounded-2xl p-6 pt-8 shadow-xl border border-[#EAE2D5] text-center space-y-4 -mb-10">
              <h3 className="text-3xl italic text-[#C5A880] font-normal leading-tight">Confirmación Asistencia</h3>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#7A7267] font-sans font-medium leading-relaxed px-1">Haznos saber si podremos contar contigo para este día tan especial</p>
              <div className="pt-2 pb-1">
                <a href={`https://wa.me/${data.wa_confirmar}?text=${mensajeWhatsApp}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-8 py-2.5 rounded-full border-2 border-[#C5A880] text-[#33302C] hover:bg-[#C5A880] hover:text-white transition-all text-xs uppercase tracking-[0.2em] font-sans font-bold active:scale-95 shadow-xs cursor-pointer group">
                  <span>CONFIRMAR</span>
                  <span className="text-[#C5A880] group-hover:text-white transition-colors text-sm font-light">↗</span>
                </a>
              </div>
            </div>
            <div className="relative z-20 w-full h-32 bg-[#DECCA6] rounded-2xl shadow-[0_20px_40px_rgba(130,105,65,0.25)] border border-[#CDBA93] overflow-hidden pointer-events-none">
              <div className="absolute inset-x-0 top-0 h-14 bg-[#D6C39A] border-b border-[#C0AD83]" style={{ clipPath: 'polygon(0 0, 50% 100%, 100% 0)' }} />
              <div className="absolute -bottom-2 -right-2 w-24 h-24 pointer-events-none">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
                  <path d="M50 85 C65 65, 85 70, 90 85 C75 90, 60 92, 50 85 Z" fill="#D4AF37" opacity="0.8" />
                  <path d="M60 65 C75 45, 95 50, 95 65 C85 75, 70 75, 60 65 Z" fill="#B89B5E" opacity="0.9" />
                  <ellipse cx="72" cy="72" rx="14" ry="8" transform="rotate(-30 72 72)" fill="#FAF8F5" stroke="#E5D9C5" strokeWidth="1" />
                  <ellipse cx="72" cy="72" rx="14" ry="8" transform="rotate(30 72 72)" fill="#FFFDFB" stroke="#E5D9C5" strokeWidth="1" />
                  <ellipse cx="72" cy="72" rx="14" ry="8" transform="rotate(90 72 72)" fill="#FAF8F5" stroke="#E5D9C5" strokeWidth="1" />
                  <circle cx="72" cy="72" r="4.5" fill="#D4AF37" stroke="#9E7E23" strokeWidth="0.8" />
                </svg>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

// =========================================================================
// 3. MOTOR AVANZADO ($1,490 - Estructura Unificada: Crema vs Black Tie)
// =========================================================================
const LayoutAvanzado = ({ 
  data, 
  pasesTotales, 
  nombreInvitado,
  estiloActivo
}: { 
  data: any, 
  pasesTotales: number, 
  nombreInvitado: string,
  estiloActivo: any
}) => {
  const [aperturaCompletada, setAperturaCompletada] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ dias: 0, horas: 0, min: 0, seg: 0 });
  const [fotoModal, setFotoModal] = useState<string | null>(null);

  // Estados Formulario Supabase
  const [adultos, setAdultos] = useState(Math.min(2, pasesTotales));
  const [ninos, setNinos] = useState(0);
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorCupo, setErrorCupo] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);

  const esBoda = data.tipo === "boda";
  const esOscuro = estiloActivo.modoOscuro;
  const totalAsistentes = adultos + ninos;
  const cupoExcedido = totalAsistentes > pasesTotales;

  useEffect(() => {
    if (!data.fechaISO) return;
    const fechaObjetivo = new Date(data.fechaISO).getTime();

    const actualizarContador = () => {
      const ahora = new Date().getTime();
      const distancia = fechaObjetivo - ahora;

      if (distancia <= 0) {
        setTimeLeft({ dias: 0, horas: 0, min: 0, seg: 0 });
        return;
      }

      setTimeLeft({
        dias: Math.floor(distancia / (1000 * 60 * 60 * 24)),
        horas: Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        min: Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60)),
        seg: Math.floor((distancia % (1000 * 60)) / 1000),
      });
    };

    actualizarContador();
    const interval = setInterval(actualizarContador, 1000);
    return () => clearInterval(interval);
  }, [data.fechaISO]);

  const abrirInvitacion = () => {
    setAperturaCompletada(true);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
      }
    }, 600);
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  const enlaceGoogleCalendar = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    `Boda de ${data.nombre}`
  )}&dates=20261024T170000/20261025T020000&details=${encodeURIComponent(
    data.frase
  )}&location=${encodeURIComponent(`${data.lugar}, ${data.direccion}`)}`;

  const handleRSVP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cupoExcedido) {
      setErrorCupo(`El cupo máximo es de ${pasesTotales} pases.`);
      return;
    }
    setErrorCupo("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const nombre = formData.get('nombre')?.toString().trim();
    const alergias = formData.get('alergias')?.toString().trim();
    const cancion = formData.get('cancion')?.toString().trim();

    const payload = {
      nombre,
      adultos,
      ninos,
      alergias: `Dieta/Alergias: ${alergias || 'Ninguna'} | Canción: ${cancion || 'N/A'}`,
      evento: data.id_supabase
    };

    const { error } = await supabase.from('confirmaciones').insert([payload]);

    if (!error) {
      setEnviado(true);
    } else {
      console.error("Error al registrar en Supabase:", error);
      alert("Hubo un error al registrar la confirmación.");
    }
    setLoading(false);
  };

  // CUMPLEAÑOS AVANZADO (Fiesta VIP)
  if (!esBoda) {
    return (
      <div className="min-h-screen bg-[#0A0713] text-[#F3EFE6] font-sans antialiased pb-24 selection:bg-[#8B5CF6] selection:text-white relative">
        <audio ref={audioRef} src={data.musica_url} preload="auto" loop />

        <header className="relative h-[65vh] flex items-center justify-center text-center overflow-hidden">
          <img src={data.foto_hero} className="absolute inset-0 w-full h-full object-cover opacity-50" alt={data.nombre} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#0A0713]/40 to-[#0A0713]" />
          <div className="relative z-10 p-6 space-y-4 max-w-md">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#A78BFA] text-[11px] font-bold tracking-widest uppercase">
              <Sparkles size={14} /> Fiesta VIP Exclusiva
            </div>
            <h1 className="text-6xl font-black tracking-tight text-white drop-shadow-2xl">{data.titulo}</h1>
            <p className="text-2xl font-light text-[#C4B5FD] tracking-wide">{data.nombre}</p>
            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent mx-auto" />
            <p className="text-sm font-semibold tracking-widest uppercase text-white/80">{data.fecha} • {data.hora}</p>
          </div>
        </header>

        <main className="max-w-md mx-auto px-6 space-y-12 -mt-10 relative z-20">
          <div className="bg-[#140F24] border border-[#8B5CF6]/40 rounded-3xl p-8 text-center space-y-3 shadow-lg">
            <PartyPopper className="mx-auto text-[#A78BFA]" size={30} />
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#A78BFA] font-bold">
              {nombreInvitado ? `Acceso VIP: ${nombreInvitado.replace('+', ' ')}` : "Pase VIP Personalizado"}
            </p>
            <h3 className="text-2xl font-black text-white">Tienes {pasesTotales} {pasesTotales === 1 ? 'acceso reservado' : 'accesos reservados'}</h3>
          </div>

          <div className="bg-[#140F24] border border-[#8B5CF6]/25 rounded-3xl p-7 text-center space-y-3 shadow-lg">
            <p className="text-xs uppercase font-bold text-[#A78BFA] tracking-widest">La fiesta empieza en</p>
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { val: timeLeft.dias, label: 'días' },
                { val: timeLeft.horas, label: 'hrs' },
                { val: timeLeft.min, label: 'min' },
                { val: timeLeft.seg, label: 'seg' },
              ].map((item, i) => (
                <div key={i} className="bg-[#1C1633] py-3 rounded-xl border border-[#8B5CF6]/20">
                  <span className="text-3xl font-black text-white block">{item.val}</span>
                  <span className="text-[10px] text-[#A78BFA] uppercase font-bold tracking-wider">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center space-y-5">
            <p className="italic text-base text-[#D1D5DB] px-4">"{data.frase}"</p>
            <a href={enlaceGoogleCalendar} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#8B5CF6] text-white text-xs font-bold tracking-widest uppercase transition-all shadow-lg active:scale-95">
              <CalendarPlus size={16} /> Agendar en Google Calendar
            </a>
          </div>

          <section className="bg-[#140F24] border-2 border-[#8B5CF6]/50 rounded-3xl p-8 shadow-xl space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase tracking-[0.3em] text-[#A78BFA] font-bold">R.S.V.P. VIP</span>
              <h3 className="text-3xl font-black text-white">Confirma tu Asistencia</h3>
            </div>
            <AnimatePresence mode="wait">
              {!enviado ? (
                <form onSubmit={handleRSVP} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#A78BFA]">Nombre completo *</label>
                    <input required name="nombre" defaultValue={nombreInvitado ? nombreInvitado.replace('+', ' ') : ""} placeholder="Tu nombre" className="w-full px-4 py-3 bg-[#0A0713] border border-[#8B5CF6]/40 rounded-xl text-sm text-white outline-none focus:border-[#A78BFA]" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-[#A78BFA]">Adultos</label>
                      <select value={adultos} onChange={(e) => setAdultos(parseInt(e.target.value))} className="w-full px-3 py-3 bg-[#0A0713] border border-[#8B5CF6]/40 rounded-xl text-sm text-white outline-none">
                        {[...Array(pasesTotales + 1)].map((_, i) => (<option key={i} value={i}>{i} {i === 1 ? 'Adulto' : 'Adultos'}</option>))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-[#A78BFA]">Niños</label>
                      <select value={ninos} onChange={(e) => setNinos(parseInt(e.target.value))} className="w-full px-3 py-3 bg-[#0A0713] border border-[#8B5CF6]/40 rounded-xl text-sm text-white outline-none">
                        {[...Array(pasesTotales + 1)].map((_, i) => (<option key={i} value={i}>{i} {i === 1 ? 'Niño' : 'Niños'}</option>))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#A78BFA] flex items-center gap-1">
                      <Music2 size={13} className="text-[#A78BFA]" /> ¿Qué rola no puede faltar con el DJ?
                    </label>
                    <input name="cancion" placeholder="Canción y artista" className="w-full px-4 py-3 bg-[#0A0713] border border-[#8B5CF6]/40 rounded-xl text-sm text-white outline-none focus:border-[#A78BFA]" />
                  </div>
                  <button type="submit" disabled={loading || cupoExcedido || totalAsistentes === 0} className="w-full py-4 rounded-full text-xs uppercase tracking-[0.25em] font-bold transition-all shadow-xl active:scale-95 cursor-pointer bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">
                    {loading ? "Confirmando..." : "Confirmar Mi Lugar"}
                  </button>
                </form>
              ) : (
                <div className="py-10 text-center space-y-4">
                  <CheckCircle2 size={42} className="mx-auto text-emerald-400" />
                  <h4 className="text-2xl font-black text-white">¡Lugar Confirmado!</h4>
                  <p className="text-xs text-[#C4B5FD]">Te esperamos para festejar con todo.</p>
                </div>
              )}
            </AnimatePresence>
          </section>
        </main>
      </div>
    );
  }

  // =========================================================================
  // BODA AVANZADA: ESTRUCTURA EXACTA DEL VIDEO 1 (EN CREMA O EN BLACK TIE)
  // =========================================================================
  return (
    <div className={`min-h-screen ${esOscuro ? "bg-[#080808]" : "bg-[#F7F4EE]"} flex justify-center py-0 md:py-8 px-0 md:px-4 font-serif antialiased selection:bg-[#C5A880] selection:text-white relative`}>
      <audio ref={audioRef} src={data.musica_url} loop preload="auto" />

      {/* 1. APERTURA: PUERTAS DE GALA (BLACK TIE) O SOBRE (CREMA) */}
      <AnimatePresence mode="wait">
        {!aperturaCompletada && (
          esOscuro ? (
            <PuertasGala alAbrir={abrirInvitacion} nombre={data.nombre} />
          ) : (
            <motion.div
              key="sobre-modal-crema"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -70, scale: 0.95 }}
              transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
              className="fixed inset-0 z-50 bg-[#1A1816] flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="absolute w-80 h-80 bg-[#C5A880]/15 rounded-full blur-3xl pointer-events-none" />
              <div 
                onClick={abrirInvitacion}
                className="relative w-full max-w-sm aspect-[4/3] bg-[#E8DCBF] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] border border-[#D6C49E] p-8 flex flex-col items-center justify-between overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform active:scale-[0.98]"
              >
                <div className="absolute inset-x-0 top-0 h-28 bg-[#DECCA6] border-b border-[#C8B388] pointer-events-none" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
                <div className="relative z-10 text-[9px] uppercase tracking-[0.4em] text-[#7A6B53]">
                  {nombreInvitado ? `Invitación Para: ${nombreInvitado.replace('+', ' ')}` : "Invitación Exclusiva"}
                </div>
                <div className="relative z-10 my-auto space-y-2 pointer-events-none">
                  <h1 className="text-4xl italic text-[#383126] font-normal leading-tight">{data.nombre}</h1>
                  <div className="w-10 h-[1px] bg-[#B89B5E] mx-auto" />
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#73634B]">{data.fecha}</p>
                  <div className="inline-block px-3 py-1 bg-[#D8C49D]/40 rounded-full border border-[#C5A880]/30 text-[9px] uppercase tracking-widest text-[#5E4F39] font-sans font-semibold mt-1">
                    Boleto Digital • {pasesTotales} {pasesTotales === 1 ? 'Pase' : 'Pases'}
                  </div>
                </div>
                <div className="relative z-20 w-16 h-16 rounded-full bg-gradient-to-br from-[#E2B755] via-[#C99C35] to-[#997316] shadow-xl border-2 border-white flex flex-col items-center justify-center">
                  <span className="text-white text-xl drop-shadow-sm">⚜</span>
                  <span className="text-white text-[7px] tracking-[0.2em] font-sans font-bold uppercase mt-0.5">Abrir</span>
                </div>
              </div>
              <p onClick={abrirInvitacion} className="text-[#A89F91] text-xs font-serif italic mt-6 tracking-widest cursor-pointer animate-pulse">
                Toca el sobre para abrir
              </p>
            </motion.div>
          )
        )}
      </AnimatePresence>

      {/* 2. MODAL LIGHTBOX EN PANTALLA COMPLETA */}
      <AnimatePresence>
        {fotoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFotoModal(null)}
            className="fixed inset-0 z-[120] bg-black/95 flex items-center justify-center p-4 cursor-pointer"
          >
            <button onClick={() => setFotoModal(null)} className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors">
              <X size={24} />
            </button>
            <motion.img initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }} src={fotoModal} alt="Foto ampliada" className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain border border-[#C5A880]/30" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. CONTENEDOR CENTRAL: IDÉNTICO EN CREMA O EN BLACK TIE */}
      <main className={`w-full max-w-md ${esOscuro ? "bg-[#121110] border-[#C5A880]/30 text-[#F3EFE6]" : "bg-[#FAF8F5] border-[#EBE4D8] text-[#33302C]"} min-h-screen shadow-2xl relative border-x overflow-hidden`}>
        {/* BOTÓN FLOTANTE DE MÚSICA (Crema & Black Tie) */}
        <button
          onClick={toggleAudio}
          className={`fixed top-5 right-5 z-40 w-11 h-11 rounded-full shadow-lg border flex items-center justify-center transition-all cursor-pointer ${
            esOscuro
              ? "bg-[#181614]/90 text-[#D4AF37] border-[#D4AF37]/50 shadow-[0_0_15px_rgba(212,175,55,0.3)]"
              : "bg-white/90 text-[#59524C] hover:text-[#C5A880] border-[#E8E1D5]"
          }`}
        >
          {playing ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}>
              <Music size={18} />
            </motion.div>
          ) : (
            <div className="relative">
              <Music size={18} className="opacity-40" />
              <div className="absolute top-1/2 left-0 w-full h-[1.5px] bg-current -rotate-45" />
            </div>
          )}
        </button>
        {/* CABECERA (Foto asomándose + Nombre) */}
        <header className={`relative pt-10 px-6 pb-6 flex flex-col items-center ${esOscuro ? "bg-gradient-to-b from-[#1C1A17] to-[#121110]" : "bg-gradient-to-b from-[#EFE8DA] to-[#FAF8F5]"}`}>
          <div className={`w-[82%] aspect-[3/4] rounded-t-2xl overflow-hidden shadow-xl border-4 ${esOscuro ? "border-[#222] bg-[#141414]" : "border-white bg-white"}`}>
            <img src={data.foto_hero} alt={data.nombre} className="w-full h-full object-cover" />
          </div>
          <div className={`w-full -mt-10 pt-12 pb-6 px-6 ${esOscuro ? "bg-[#1E1B17] border-[#C5A880]/30 text-[#FAF8F5]" : "bg-[#E3D4B6] border-[#D1BE99] text-[#3F372C]"} rounded-2xl shadow-lg border text-center relative z-10`}>
            <h1 className="text-4xl md:text-5xl italic leading-none">{data.nombre}</h1>
            <p className={`text-[10px] uppercase tracking-[0.35em] ${esOscuro ? "text-[#D4AF37]" : "text-[#73634B]"} mt-3 font-sans font-medium`}>
              Nuestra Boda
            </p>
          </div>
        </header>

        {/* REPRODUCTOR DE MÚSICA EN BARRA */}
        <section className="px-6 py-4">
          <div className={`${esOscuro ? "bg-[#1A1816] border-[#C5A880]/20" : "bg-white border-[#EBE4D8]"} rounded-2xl p-5 shadow-sm border text-center space-y-3`}>
            <p className={`text-xs uppercase tracking-[0.2em] ${esOscuro ? "text-[#C5A880]" : "text-[#6E665D]"} font-sans font-semibold`}>
              {playing ? "Sonando nuestra canción..." : "Dale Play Para Escuchar Nuestra Canción"}
            </p>
            <div className="flex items-center justify-center gap-6">
              <button 
                onClick={toggleAudio} 
                className={`w-11 h-11 rounded-full ${esOscuro ? "bg-[#D4AF37] text-black" : "bg-[#3B352E] text-[#F7F4EE]"} flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all text-xs cursor-pointer`}
              >
                {playing ? '⏸' : '▶'}
              </button>
            </div>
          </div>
        </section>

        {/* TARJETA "¡NOS CASAMOS!" + GOOGLE CALENDAR */}
        <section className="px-6 py-6">
          <div className={`relative ${esOscuro ? "bg-[#181614] border-[#D4AF37]/35" : "bg-white border-[#D4AF37]/35"} rounded-2xl p-8 pt-12 shadow-md border-2 text-center space-y-6`}>
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-13 h-13 rounded-full bg-gradient-to-br from-[#E2B755] via-[#C99C35] to-[#997316] shadow-md border-2 border-white flex items-center justify-center">
              <span className="text-white text-lg">⚜</span>
            </div>

            <h2 className={`text-4xl italic ${esOscuro ? "text-[#FAF8F5]" : "text-[#2E2820]"}`}>¡Nos Casamos!</h2>
            <p className={`text-[11px] leading-relaxed uppercase tracking-[0.18em] ${esOscuro ? "text-[#D9CEBA]" : "text-[#696156]"} font-sans font-light px-2`}>
              "{data.frase}"
            </p>

            <div className={`py-6 border-y ${esOscuro ? "border-[#C5A880]/20" : "border-[#EBE4D8]"} space-y-2`}>
              <p className={`text-sm tracking-[0.3em] uppercase ${esOscuro ? "text-[#D4AF37]" : "text-[#85796A]"} font-sans font-medium`}>
                Octubre
              </p>
              <div className={`flex items-center justify-center gap-6 ${esOscuro ? "text-[#FAF8F5]" : "text-[#2E2820]"}`}>
                <span className="text-xs uppercase tracking-[0.2em] font-sans">Sábado</span>
                <span className="text-5xl font-serif font-light">24</span>
                <span className="text-xs uppercase tracking-[0.2em] font-sans">2026</span>
              </div>
              <p className={`text-[11px] tracking-[0.2em] uppercase ${esOscuro ? "text-[#A89F91]" : "text-[#8F867A]"} pt-1 font-sans`}>
                {data.direccion}
              </p>
            </div>

            <a
              href={enlaceGoogleCalendar}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full ${esOscuro ? "bg-[#1C1A17] border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black" : "bg-[#FAF6EE] border-[#C5A880] text-[#7A623A] hover:bg-[#C5A880] hover:text-white"} border text-xs font-sans font-semibold tracking-wider transition-all shadow-xs`}
            >
              <CalendarPlus size={16} /> Agendar en Google Calendar
            </a>
          </div>
        </section>

        {/* CUENTA REGRESIVA ("Faltan:") */}
        <section className="px-6 py-6 text-center space-y-4">
          <h3 className={`text-3xl italic ${esOscuro ? "text-[#D4AF37]" : "text-[#C5A880]"}`}>Faltan:</h3>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { val: timeLeft.dias, label: 'días' },
              { val: timeLeft.horas, label: 'horas' },
              { val: timeLeft.min, label: 'minutos' },
              { val: timeLeft.seg, label: 'segundos' },
            ].map((item, i) => (
              <div key={i} className={`${esOscuro ? "bg-[#1A1816] border-[#C5A880]/20" : "bg-white/90 border-[#EAE2D5]"} py-3 rounded-xl shadow-xs border`}>
                <span className={`text-3xl font-light ${esOscuro ? "text-[#FAF8F5]" : "text-[#3F372C]"} block font-serif`}>
                  {item.val < 10 ? `0${item.val}` : item.val}
                </span>
                <span className={`text-[9px] ${esOscuro ? "text-[#C5A880]" : "text-[#8C847A]"} uppercase tracking-wider block font-sans mt-0.5`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* GALERÍA LOOKBOOK CON LIGHTBOX */}
        {data.galeria && (
          <section className="px-6 py-6 space-y-4">
            <div className="text-center space-y-1">
              <Camera className={`mx-auto ${esOscuro ? "text-[#D4AF37]" : "text-[#C5A880]"}`} size={22} strokeWidth={1.5} />
              <h3 className={`text-xs uppercase tracking-[0.3em] ${esOscuro ? "text-[#C5A880]" : "text-[#85796A]"} font-sans font-semibold`}>
                Nuestra Historia
              </h3>
              <p className={`text-2xl italic ${esOscuro ? "text-[#FAF8F5]" : "text-[#3F372C]"}`}>Galería de Fotos</p>
              <p className={`text-[10px] ${esOscuro ? "text-[#A89F91]" : "text-[#9E9485]"} font-sans tracking-widest pt-1`}>
                (Toca cualquier foto para ampliarla)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {data.galeria.map((imgUrl: string, idx: number) => (
                <div
                  key={idx}
                  onClick={() => setFotoModal(imgUrl)}
                  className={`rounded-2xl overflow-hidden shadow-sm border-2 ${esOscuro ? "border-[#C5A880]/30 bg-[#181614]" : "border-white bg-white"} group cursor-pointer ${
                    idx === 0 ? "col-span-2 aspect-[16/10]" : "aspect-square"
                  }`}
                >
                  <img src={imgUrl} alt="Foto" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ITINERARIO */}
        <section className="px-6 py-6">
          <div className={`${esOscuro ? "bg-[#181614] border-[#D4AF37]/35" : "bg-white border-[#D4AF37]/40"} rounded-3xl p-8 shadow-md border-2 text-center space-y-8`}>
            <div className={`${esOscuro ? "text-[#D4AF37]" : "text-[#C5A880]"} text-xl`}>❖</div>
            <h3 className={`text-3xl italic ${esOscuro ? "text-[#D4AF37]" : "text-[#C5A880]"} -mt-5`}>Itinerario</h3>

            <div className="space-y-3">
              <div className={`w-12 h-12 mx-auto rounded-full ${esOscuro ? "bg-[#221F1C] border-[#D4AF37]/40" : "bg-[#FAF6EE] border-[#D4AF37]/30"} flex items-center justify-center text-2xl border`}>
                ⛪
              </div>
              <h4 className={`text-2xl italic ${esOscuro ? "text-[#FAF8F5]" : "text-[#3A332B]"}`}>Ceremonia</h4>
              <p className={`text-xs uppercase tracking-[0.2em] ${esOscuro ? "text-[#D4AF37]" : "text-[#C5A880]"} font-sans font-bold`}>
                {data.hora || "5:00 PM"}
              </p>
              <p className={`text-sm ${esOscuro ? "text-[#D9CEBA]" : "text-[#61584D]"} font-sans`}>{data.lugar}</p>
              <a href={data.mapa} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 px-6 py-2 rounded-full border ${esOscuro ? "border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black" : "border-[#C5A880] text-[#8A6F48] hover:bg-[#C5A880]/10"} text-[11px] uppercase tracking-[0.2em] transition-colors font-sans`}>
                Ver Mapa ↗
              </a>
            </div>

            <div className={`w-16 h-[1px] ${esOscuro ? "bg-[#C5A880]/20" : "bg-[#E8DFCF]"} mx-auto`}></div>

            <div className="space-y-3">
              <div className={`w-12 h-12 mx-auto rounded-full ${esOscuro ? "bg-[#221F1C] border-[#D4AF37]/40" : "bg-[#FAF6EE] border-[#D4AF37]/30"} flex items-center justify-center text-2xl border`}>
                🥂
              </div>
              <h4 className={`text-2xl italic ${esOscuro ? "text-[#FAF8F5]" : "text-[#3A332B]"}`}>Recepción</h4>
              <p className={`text-xs uppercase tracking-[0.2em] ${esOscuro ? "text-[#D4AF37]" : "text-[#C5A880]"} font-sans font-bold`}>
                7:00 PM
              </p>
              <p className={`text-sm ${esOscuro ? "text-[#D9CEBA]" : "text-[#61584D]"} font-sans`}>{data.lugar}</p>
              <a href={data.mapa} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 px-6 py-2 rounded-full border ${esOscuro ? "border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black" : "border-[#C5A880] text-[#8A6F48] hover:bg-[#C5A880]/10"} text-[11px] uppercase tracking-[0.2em] transition-colors font-sans`}>
                Ver Mapa ↗
              </a>
            </div>
          </div>
        </section>

        {/* DRESS CODE CON PALETA VISUAL */}
        <section className="px-6 py-4 space-y-6">
          <div className={`${esOscuro ? "bg-[#181614] border-[#C5A880]/30" : "bg-white border-[#EBE4D8]"} rounded-3xl p-6 shadow-md border space-y-5`}>
            <div className="flex items-center gap-4">
              <div className="text-4xl">🤵👰</div>
              <div>
                <h4 className={`text-2xl italic ${esOscuro ? "text-[#D4AF37]" : "text-[#C5A880]"}`}>Código de Vestimenta</h4>
                <p className={`text-xs uppercase tracking-[0.2em] font-sans font-bold ${esOscuro ? "text-white" : "text-[#3A332B]"}`}>
                  {data.dressCode || "FORMAL"}
                </p>
              </div>
            </div>

            <div className={`space-y-2 pt-2 border-t ${esOscuro ? "border-[#C5A880]/20" : "border-[#EBE4D8]"}`}>
              <p className={`text-[10px] uppercase tracking-[0.2em] font-sans ${esOscuro ? "text-[#C5A880]" : "text-[#7A7267]"} font-semibold`}>
                Paleta de Colores Sugerida:
              </p>
              <div className="flex items-center justify-between pt-1">
                {[
                  { hex: "#B85D43", nombre: "Terracota" },
                  { hex: "#C5A880", nombre: "Champán" },
                  { hex: "#556B2F", nombre: "Olivo" },
                  { hex: "#1B2A4A", nombre: "Azul" },
                  { hex: "#2A2A2A", nombre: "Negro" }
                ].map((c, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className="w-7 h-7 rounded-full shadow-xs border border-white/20" style={{ backgroundColor: c.hex }} />
                    <span className="text-[8px] font-sans text-[#8A8177]">{c.nombre}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`p-3 ${esOscuro ? "bg-[#221F1C] border-[#C5A880]/30 text-[#D9CEBA]" : "bg-[#FAF6EE] border-[#E5D7C0] text-[#73634B]"} rounded-xl border text-[10px] font-sans flex items-center gap-2`}>
              <AlertCircle size={16} className={`${esOscuro ? "text-[#D4AF37]" : "text-[#C5A880]"} shrink-0`} />
              <span>Por favor, evitar asistir de color blanco, beige o marfil (reservados para la novia).</span>
            </div>
          </div>

          {/* Regalos */}
          <div className={`${esOscuro ? "bg-[#181614] border-[#EBE4D8]/10" : "bg-white border-[#EBE4D8]"} rounded-2xl p-6 shadow-md border text-center space-y-4`}>
            <h4 className={`text-2xl italic ${esOscuro ? "text-[#D4AF37]" : "text-[#C5A880]"}`}>Regalos</h4>
            <p className={`text-[11px] leading-relaxed uppercase tracking-[0.15em] ${esOscuro ? "text-[#D9CEBA]" : "text-[#696156]"} font-sans`}>
              Su compañía es lo más importante. Si deseas hacernos algún obsequio, lo recibiremos con mucho cariño.
            </p>
            <a href={data.mesa_regalos} target="_blank" rel="noopener noreferrer" className={`inline-block px-8 py-3 border ${esOscuro ? "border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black" : "border-[#C5A880] text-[#8A6F48] hover:bg-[#C5A880]/10"} text-xs uppercase tracking-[0.2em] rounded-full transition-all font-sans font-semibold`}>
              Ver Lista
            </a>
          </div>
        </section>

        {/* 4. FORMULARIO RSVP DE SUPABASE: IDÉNTICO EN CREMA O EN BLACK TIE */}
        <section className="px-6 pt-6 pb-20">
          <div className={`${esOscuro ? "bg-[#181614] border-[#D4AF37]/45 shadow-[0_0_40px_rgba(212,175,55,0.12)]" : "bg-white border-[#D4AF37]/40 shadow-xl"} rounded-3xl p-8 border-2 space-y-6`}>
            
            <div className="text-center space-y-2">
              <span className={`text-xs uppercase tracking-[0.3em] ${esOscuro ? "text-[#D4AF37]" : "text-[#C5A880]"} font-sans font-bold`}>R.S.V.P.</span>
              <h3 className={`text-3xl italic ${esOscuro ? "text-[#FAF8F5]" : "text-[#2E2820]"}`}>Confirmación de Asistencia</h3>
              
              <div className={`inline-block px-4 py-1.5 ${esOscuro ? "bg-[#221F1C] border-[#C5A880]/40 text-[#EADBB6]" : "bg-[#FAF6EE] border-[#C5A880]/40 text-[#7A623A]"} rounded-full border text-xs font-sans`}>
                <Users size={14} className={`inline mr-1 ${esOscuro ? "text-[#D4AF37]" : "text-[#C5A880]"}`} />
                Hemos reservado <strong>{pasesTotales} {pasesTotales === 1 ? 'pase' : 'pases'}</strong> para ti
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!enviado ? (
                <form onSubmit={handleRSVP} className="space-y-5 pt-2">
                  <div className="space-y-1">
                    <label className={`text-[10px] uppercase tracking-[0.2em] font-sans font-bold ${esOscuro ? "text-[#C5A880]" : "text-[#7A7267]"}`}>
                      Nombre completo *
                    </label>
                    <input
                      required
                      name="nombre"
                      defaultValue={nombreInvitado ? nombreInvitado.replace('+', ' ') : ""}
                      placeholder="Ej. Familia Rodríguez o Juan Pérez"
                      className={`w-full px-4 py-3 ${esOscuro ? "bg-[#0E0E0E] border-[#C5A880]/30 text-white" : "bg-[#FAF8F5] border-[#EAE2D5] text-[#33302C]"} border rounded-xl text-sm font-sans outline-none focus:border-[#C5A880] transition-colors`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className={`text-[10px] uppercase tracking-[0.2em] font-sans font-bold ${esOscuro ? "text-[#C5A880]" : "text-[#7A7267]"}`}>
                        Adultos
                      </label>
                      <select
                        value={adultos}
                        onChange={(e) => setAdultos(parseInt(e.target.value))}
                        className={`w-full px-3 py-3 ${esOscuro ? "bg-[#0E0E0E] border-[#C5A880]/30 text-white" : "bg-[#FAF8F5] border-[#EAE2D5] text-[#33302C]"} border rounded-xl text-sm font-sans outline-none cursor-pointer`}
                      >
                        {[...Array(pasesTotales + 1)].map((_, i) => (
                          <option key={i} value={i} className={esOscuro ? "bg-[#141414] text-white" : ""}>
                            {i} {i === 1 ? 'Adulto' : 'Adultos'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className={`text-[10px] uppercase tracking-[0.2em] font-sans font-bold ${esOscuro ? "text-[#C5A880]" : "text-[#7A7267]"}`}>
                        Niños
                      </label>
                      <select
                        value={ninos}
                        onChange={(e) => setNinos(parseInt(e.target.value))}
                        className={`w-full px-3 py-3 ${esOscuro ? "bg-[#0E0E0E] border-[#C5A880]/30 text-white" : "bg-[#FAF8F5] border-[#EAE2D5] text-[#33302C]"} border rounded-xl text-sm font-sans outline-none cursor-pointer`}
                      >
                        {[...Array(pasesTotales + 1)].map((_, i) => (
                          <option key={i} value={i} className={esOscuro ? "bg-[#141414] text-white" : ""}>
                            {i} {i === 1 ? 'Niño' : 'Niños'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {cupoExcedido && (
                    <p className="text-xs text-red-500 font-sans font-semibold">
                      ⚠️ Seleccionaste {totalAsistentes} lugares y tu cupo es de {pasesTotales}.
                    </p>
                  )}

                  <div className="space-y-1">
                    <label className={`text-[10px] uppercase tracking-[0.2em] font-sans font-bold ${esOscuro ? "text-[#C5A880]" : "text-[#7A7267]"}`}>
                      Alergias o dieta especial
                    </label>
                    <input
                      name="alergias"
                      placeholder="Ej. Vegetariano, intolerancia a lácteos..."
                      className={`w-full px-4 py-3 ${esOscuro ? "bg-[#0E0E0E] border-[#C5A880]/30 text-white" : "bg-[#FAF8F5] border-[#EAE2D5] text-[#33302C]"} border rounded-xl text-sm font-sans outline-none focus:border-[#C5A880] transition-colors`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={`text-[10px] uppercase tracking-[0.2em] font-sans font-bold ${esOscuro ? "text-[#C5A880]" : "text-[#7A7267]"} flex items-center gap-1`}>
                      <Music2 size={12} className={esOscuro ? "text-[#D4AF37]" : "text-[#C5A880]"} />
                      ¿Qué canción no puede faltar en la fiesta?
                    </label>
                    <input
                      name="cancion"
                      placeholder="Ej. Vivir mi vida - Marc Anthony"
                      className={`w-full px-4 py-3 ${esOscuro ? "bg-[#0E0E0E] border-[#C5A880]/30 text-white" : "bg-[#FAF8F5] border-[#EAE2D5] text-[#33302C]"} border rounded-xl text-sm font-sans outline-none focus:border-[#C5A880] transition-colors`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || cupoExcedido || totalAsistentes === 0}
                    className={`w-full py-4 rounded-full font-sans text-xs uppercase tracking-[0.25em] font-bold transition-all shadow-md active:scale-95 cursor-pointer ${
                      cupoExcedido || totalAsistentes === 0
                        ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                        : esOscuro
                        ? "bg-gradient-to-r from-[#C5A880] via-[#D4AF37] to-[#B89B5E] text-black hover:opacity-95"
                        : "bg-[#2E2820] text-white hover:bg-[#1A1816]"
                    }`}
                  >
                    {loading ? "Guardando en lista..." : "Enviar Confirmación Oficial"}
                  </button>

                  <p className={`text-[9px] text-center ${esOscuro ? "text-[#A89F91]" : "text-[#9E9485]"} font-sans`}>
                    Tus datos se enviarán directamente a la lista de invitados de los novios.
                  </p>
                </form>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-10 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border-2 border-emerald-200 shadow-sm">
                    <CheckCircle2 size={36} />
                  </div>
                  <h4 className={`text-3xl italic ${esOscuro ? "text-[#FAF8F5]" : "text-[#2E2820]"}`}>¡Confirmación Recibida!</h4>
                  <p className={`text-xs ${esOscuro ? "text-[#D9CEBA]" : "text-[#7A7267]"} font-sans max-w-xs mx-auto leading-relaxed`}>
                    Hemos registrado tu asistencia con éxito en la lista oficial de los novios. ¡Nos vemos en la boda!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

      </main>
    </div>
  );
};

// =========================================================================
// CONTROLADOR PRINCIPAL
// =========================================================================
function InvitacionDinamica() {
  const params = useParams();
  const searchParams = useSearchParams();

  const modelo = params.modelo as string;
  const slug = params.slug as string;
  const pases = parseInt(searchParams.get('p') || '2');
  const invitado = searchParams.get('invitado') || '';
  const estiloParam = searchParams.get('estilo');

  // @ts-ignore
  const data = EVENTOS[slug];

  if (!data) {
    return (
      <div className="p-20 text-center font-bold text-red-500 bg-black min-h-screen flex items-center justify-center font-sans">
        Error: Invitación no encontrada. Revisa el slug en la URL.
      </div>
    );
  }

  // Resolver estilo visual activo dinámicamente
  const estiloActivo = (estiloParam && ESTILOS[estiloParam as keyof typeof ESTILOS]) 
    ? ESTILOS[estiloParam as keyof typeof ESTILOS] 
    : (data.tema || (data.estiloVisual && ESTILOS[data.estiloVisual as keyof typeof ESTILOS]) || ESTILOS.crema_lujo);

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F4EE] flex items-center justify-center font-serif">Cargando invitación...</div>}>
      {modelo === 'basica' && <LayoutBasico data={data} />}
      {modelo === 'moderada' && <LayoutModerado data={data} />}
      {modelo === 'avanzada' && (
        <LayoutAvanzado 
          data={data} 
          pasesTotales={pases} 
          nombreInvitado={invitado} 
          estiloActivo={estiloActivo}
        />
      )}
    </Suspense>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F4EE] flex items-center justify-center">Cargando...</div>}>
      <InvitacionDinamica />
    </Suspense>
  );
}