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

// =========================================================================
// PUERTAS DE GALA (Para el modelo Avanzado)
// =========================================================================
const PuertasGala = ({ alAbrir, nombre, tema }: { alAbrir: () => void, nombre: string, tema: any }) => {
  const inicial = nombre.charAt(0).toUpperCase();

  return (
    <motion.div 
      key="puertas-gala-overlay"
      className="fixed inset-0 z-[100] flex overflow-hidden bg-[#0c0d0c]"
      exit={{ opacity: 0, transition: { duration: 1, delay: 0.5 } }}
    >
      <div className="absolute inset-0 flex justify-center">
        <div className="w-[2px] h-full bg-gradient-to-b from-transparent via-amber-200/40 to-transparent shadow-[0_0_20px_rgba(251,191,36,0.3)]" />
      </div>

      <motion.div 
        initial={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ duration: 1.5, ease: [0.6, 0.01, -0.05, 0.9] }}
        className="relative w-1/2 h-full bg-[#111211] border-r border-white/5 flex items-center justify-end"
      />
      <motion.div 
        initial={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 1.5, ease: [0.6, 0.01, -0.05, 0.9] }}
        className="relative w-1/2 h-full bg-[#111211] border-l border-white/5 flex items-center justify-start"
      />

      <div className="absolute inset-0 flex items-center justify-center z-[110]">
        <motion.div exit={{ scale: 0, opacity: 0, transition: { duration: 0.5 } }} className="relative">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute -inset-10 bg-amber-500/20 rounded-full blur-3xl" 
          />
          <motion.button
            onClick={alAbrir}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-36 h-36 flex items-center justify-center cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#8b0000] to-[#5a0000] rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.6)] border-2 border-white/10" />
            <div className="absolute inset-2 border border-amber-500/30 rounded-full" />
            <div className="relative flex flex-col items-center">
              <span className="text-amber-200/90 font-serif text-5xl italic leading-none">{inicial}</span>
              <div className="h-[1px] w-8 bg-amber-200/30 my-1" />
              <span className="text-amber-200/40 text-[7px] font-black tracking-[0.4em] uppercase">Pulsar</span>
            </div>
            <div className="absolute -bottom-1 bg-[#b89b5e] w-8 h-8 rounded-full flex items-center justify-center shadow-lg border border-white/20">
              <Heart size={12} className="text-[#5a0000]" fill="currentColor" />
            </div>
          </motion.button>
        </motion.div>
      </div>

      <motion.div exit={{ opacity: 0 }} className="absolute bottom-16 inset-x-0 text-center z-[105]">
        <p className="text-amber-100/30 font-serif italic text-sm tracking-[0.3em] uppercase">
          Propiedad exclusiva de la familia {nombre}
        </p>
      </motion.div>
    </motion.div>
  );
};

// =========================================================================
// 1. MOTOR BÁSICO
// =========================================================================
const LayoutBasico = ({ data }: { data: any }) => {
  const tema = data.tema;
  return (
    <div className={`min-h-screen ${tema.fondo} flex items-center justify-center p-4 ${tema.fuente}`}>
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 text-center text-slate-800">
        <div className="h-64 relative">
          <img src={data.foto_hero} className="w-full h-full object-cover" alt={data.nombre} />
          <div className={`absolute bottom-0 left-0 right-0 h-1 ${tema.primario} opacity-50`} />
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
            <a href={data.mapa} target="_blank" rel="noopener noreferrer" className={`block w-full ${tema.boton} text-white py-4 rounded-xl font-bold transition-all`}>
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
// 2. MOTOR MODERADO (Canva Luxury + Sobre con Apertura Garantizada)
// =========================================================================
const LayoutModerado = ({ data }: { data: any }) => {
  const [sobreAbierto, setSobreAbierto] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ dias: 0, horas: 0, min: 0, seg: 0 });
  const audioRef = useRef<HTMLAudioElement>(null);

  // Cuenta regresiva
  useEffect(() => {
    const fechaObjetivo = data.fechaISO ? new Date(data.fechaISO).getTime() : new Date("2026-10-24T17:00:00").getTime();
    const interval = setInterval(() => {
      const ahora = new Date().getTime();
      const distancia = fechaObjetivo - ahora;
      if (distancia < 0) return clearInterval(interval);
      setTimeLeft({
        dias: Math.floor(distancia / (1000 * 60 * 60 * 24)),
        horas: Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        min: Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60)),
        seg: Math.floor((distancia % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [data.fechaISO]);

  // Al abrir el sobre -> Reproduce música
  const abrirSobre = () => {
    setSobreAbierto(true);
    if (audioRef.current) {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {
        console.log("Reproducción manual disponible en el botón de música.");
      });
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
    `¡Hola! Confirmo con mucho gusto mi asistencia a la boda de ${data.nombre} 💍✨`
  );

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#33302C] flex justify-center py-0 md:py-8 px-0 md:px-4 font-serif antialiased selection:bg-[#C5A880] selection:text-white relative">
      {/* Elemento de Audio */}
      <audio ref={audioRef} src={data.musica_url} loop preload="auto" />

      {/* ============================================================
          PANTALLA INICIAL: SOBRE CERRADO
      ============================================================ */}
      <AnimatePresence mode="wait">
        {!sobreAbierto && (
          <motion.div
            key="sobre-modal-abrir"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -70, scale: 0.95 }}
            transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
            className="fixed inset-0 z-50 bg-[#1A1816] flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="absolute w-80 h-80 bg-[#C5A880]/15 rounded-full blur-3xl pointer-events-none" />

            {/* Todo el sobre es clickeable para máxima comodidad */}
            <div 
              onClick={abrirSobre}
              className="relative w-full max-w-sm aspect-[4/3] bg-[#E8DCBF] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] border border-[#D6C49E] p-8 flex flex-col items-center justify-between overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform active:scale-[0.98]"
            >
              {/* Solapa decorativa */}
              <div 
                className="absolute inset-x-0 top-0 h-28 bg-[#DECCA6] border-b border-[#C8B388] pointer-events-none"
                style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
              />

              <div className="relative z-10 text-[9px] uppercase tracking-[0.4em] text-[#7A6B53]">
                Invitación Especial
              </div>

              <div className="relative z-10 my-auto space-y-2 pointer-events-none">
                <h1 className="text-4xl italic text-[#383126] font-normal leading-tight">
                  {data.nombre}
                </h1>
                <div className="w-10 h-[1px] bg-[#B89B5E] mx-auto" />
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#73634B]">
                  {data.fecha}
                </p>
              </div>

              {/* Sello de Lacre */}
              <div className="relative z-20 w-16 h-16 rounded-full bg-gradient-to-br from-[#E2B755] via-[#C99C35] to-[#997316] shadow-xl border-2 border-white flex flex-col items-center justify-center">
                <span className="text-white text-xl drop-shadow-sm">⚜</span>
                <span className="text-white text-[7px] tracking-[0.2em] font-sans font-bold uppercase mt-0.5">Abrir</span>
              </div>
            </div>

            <p 
              onClick={abrirSobre} 
              className="text-[#A89F91] text-xs font-serif italic mt-6 tracking-widest cursor-pointer animate-pulse"
            >
              Toca el sello para abrir
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================
          CARTA / INVITACIÓN ESTILO CANVA
      ============================================================ */}
      <main className="w-full max-w-md bg-[#FAF8F5] min-h-screen shadow-2xl relative border-x border-[#EBE4D8] overflow-hidden">
        
        {/* Botón flotante de música */}
        <button
          onClick={toggleAudio}
          className="fixed top-5 right-5 z-40 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-[#E8E1D5] flex items-center justify-center text-[#59524C] hover:text-[#C5A880] transition-colors cursor-pointer"
        >
          {playing ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}>
              <Music size={18} />
            </motion.div>
          ) : (
            <div className="relative">
              <Music size={18} className="opacity-40" />
              <div className="absolute top-1/2 left-0 w-full h-[1.5px] bg-[#59524C] -rotate-45" />
            </div>
          )}
        </button>

        {/* 1. CABECERA: FOTO DE PAREJA */}
        <header className="relative pt-10 px-6 pb-6 flex flex-col items-center bg-gradient-to-b from-[#EFE8DA] to-[#FAF8F5]">
          <div className="w-[82%] aspect-[3/4] rounded-t-2xl overflow-hidden shadow-xl border-4 border-white bg-white">
            <img 
              src={data.foto_hero} 
              alt={data.nombre} 
              className="w-full h-full object-cover" 
            />
          </div>

          <div className="w-full -mt-10 pt-12 pb-6 px-6 bg-[#E3D4B6] rounded-2xl shadow-lg border border-[#D1BE99] text-center relative z-10">
            <h1 className="text-4xl md:text-5xl italic text-[#3F372C] leading-none">
              {data.nombre}
            </h1>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#73634B] mt-3 font-sans font-medium">
              Nuestra Boda
            </p>
          </div>
        </header>

        {/* 2. REPRODUCTOR INTERACTIVO */}
        <section className="px-6 py-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#EBE4D8] text-center space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-[#6E665D] font-sans font-semibold">
              {playing ? "Sonando nuestra canción..." : "Dale Play Para Escuchar Nuestra Canción"}
            </p>
            <div className="flex items-center justify-center gap-6 text-[#544D45]">
              <button 
                onClick={toggleAudio} 
                className="w-11 h-11 rounded-full bg-[#3B352E] text-[#F7F4EE] flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all text-xs cursor-pointer"
              >
                {playing ? '⏸' : '▶'}
              </button>
            </div>
          </div>
        </section>

        {/* 3. TARJETA PRINCIPAL: "¡NOS CASAMOS!" */}
        <section className="px-6 py-6">
          <div className="relative bg-white rounded-2xl p-8 pt-12 shadow-md border-2 border-[#D4AF37]/35 text-center space-y-6">
            {/* Sello de lacre dorado superior */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-13 h-13 rounded-full bg-gradient-to-br from-[#E2B755] via-[#C99C35] to-[#997316] shadow-md border-2 border-white flex items-center justify-center">
              <span className="text-white text-lg">⚜</span>
            </div>

            <h2 className="text-4xl italic text-[#2E2820]">
              ¡Nos Casamos!
            </h2>

            <p className="text-[11px] leading-relaxed uppercase tracking-[0.18em] text-[#696156] font-sans font-light px-2">
              "Con nuestro amor, la presencia de Dios entre nosotros y la bendición de nuestros padres, tenemos el honor de invitarte a nuestro día especial que se dará a cabo el:"
            </p>

            {/* Bloque Fecha */}
            <div className="py-6 border-y border-[#EBE4D8] space-y-2">
              <p className="text-sm tracking-[0.3em] uppercase text-[#85796A] font-sans font-medium">
                Diciembre
              </p>
              <div className="flex items-center justify-center gap-6 text-[#2E2820]">
                <span className="text-xs uppercase tracking-[0.2em] font-sans">Sábado</span>
                <span className="text-5xl font-serif font-light">20</span>
                <span className="text-xs uppercase tracking-[0.2em] font-sans">2025</span>
              </div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#8F867A] pt-1 font-sans">
                {data.direccion}
              </p>
            </div>
          </div>
        </section>

        {/* 4. CONTADOR REGRESIVO */}
        <section className="px-6 py-6 text-center space-y-4">
          <h3 className="text-3xl italic text-[#C5A880]">Faltan:</h3>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { val: timeLeft.dias, label: 'días' },
              { val: timeLeft.horas, label: 'horas' },
              { val: timeLeft.min, label: 'minutos' },
              { val: timeLeft.seg, label: 'segundos' },
            ].map((item, i) => (
              <div key={i} className="bg-white/80 py-3 rounded-xl shadow-xs border border-[#EAE2D5]">
                <span className="text-3xl font-light text-[#3F372C] block font-serif">
                  {item.val < 10 ? `0${item.val}` : item.val}
                </span>
                <span className="text-[9px] text-[#8C847A] uppercase tracking-wider block font-sans mt-0.5">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 5. ITINERARIO */}
        <section className="px-6 py-6">
          <div className="bg-white rounded-3xl p-8 shadow-md border-2 border-[#D4AF37]/40 text-center space-y-8">
            <div className="text-[#C5A880] text-xl">❖</div>
            <h3 className="text-3xl italic text-[#C5A880] -mt-5">Itinerario</h3>

            {/* Ceremonia */}
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF6EE] flex items-center justify-center text-2xl border border-[#D4AF37]/30">
                ⛪
              </div>
              <h4 className="text-2xl italic text-[#3A332B]">Ceremonia</h4>
              <p className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-sans font-bold">{data.hora || "5:00 PM"}</p>
              <p className="text-sm text-[#61584D] font-sans">{data.lugar}</p>
              <a 
                href={data.mapa} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-6 py-2 rounded-full border border-[#C5A880] text-[11px] uppercase tracking-[0.2em] text-[#8A6F48] hover:bg-[#C5A880]/10 transition-colors font-sans"
              >
                Ver Mapa ↗
              </a>
            </div>

            <div className="w-16 h-[1px] bg-[#E8DFCF] mx-auto" />

            {/* Recepción */}
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF6EE] flex items-center justify-center text-2xl border border-[#D4AF37]/30">
                🥂
              </div>
              <h4 className="text-2xl italic text-[#3A332B]">Recepción</h4>
              <p className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-sans font-bold">7:00 PM</p>
              <p className="text-sm text-[#61584D] font-sans">{data.lugar}</p>
              <a 
                href={data.mapa} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-6 py-2 rounded-full border border-[#C5A880] text-[11px] uppercase tracking-[0.2em] text-[#8A6F48] hover:bg-[#C5A880]/10 transition-colors font-sans"
              >
                Ver Mapa ↗
              </a>
            </div>
          </div>
        </section>

        {/* 6. DRESS CODE Y REGALOS */}
        <section className="px-6 py-4 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-[#EBE4D8] flex items-center gap-5">
            <div className="text-4xl">🤵👰</div>
            <div className="space-y-1">
              <h4 className="text-2xl italic text-[#C5A880]">Dress Code</h4>
              <p className="text-xs uppercase tracking-[0.2em] font-sans font-bold text-[#3A332B]">
                {data.dressCode || "FORMAL"}
              </p>
              <p className="text-[10px] text-[#7A7267] font-sans tracking-wide">
                Evitar asistir de color blanco o similares.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-[#EBE4D8] text-center space-y-4">
            <h4 className="text-2xl italic text-[#C5A880]">Regalos</h4>
            <p className="text-[11px] leading-relaxed uppercase tracking-[0.15em] text-[#696156] font-sans">
              Su compañía es lo más importante. Si deseas hacernos algún obsequio, lo recibiremos con mucho cariño.
            </p>
            <a 
              href={data.mesa_regalos} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 border border-[#C5A880] text-[#8A6F48] text-xs uppercase tracking-[0.2em] rounded-full hover:bg-[#C5A880]/10 transition-all font-sans font-semibold"
            >
              Ver Lista
            </a>
          </div>
        </section>

        {/* 7. BOTÓN WHATSAPP */}
        <section className="px-6 pt-6 pb-16 text-center space-y-4">
          <a
            href={`https://wa.me/${data.wa_confirmar}?text=${mensajeWhatsApp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full font-sans text-xs uppercase tracking-[0.25em] font-bold shadow-xl shadow-green-600/20 active:scale-95 transition-all"
          >
            <MessageCircle size={20} />
            Confirmar por WhatsApp
          </a>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#9C9488] font-sans">
            ¡Esperamos contar con tu presencia!
          </p>
        </section>

      </main>
    </div>
  );
};

// =========================================================================
// 3. MOTOR AVANZADO
// =========================================================================
const LayoutAvanzado = ({ data, pasesTotales }: { data: any, pasesTotales: number }) => {
  const tema = data.tema;
  const [estaAbierto, setEstaAbierto] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adultos, setAdultos] = useState(1);
  const [ninos, setNinos] = useState(0);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleMusica = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) audio.pause();
    else audio.play().catch(() => {});
    setPlaying(!playing);
  };

  const abrirInvitacion = () => {
    setEstaAbierto(true);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
      }
    }, 1000);
  };

  const handleRSVP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    <>
      <AnimatePresence>
        {!estaAbierto && <PuertasGala alAbrir={abrirInvitacion} nombre={data.nombre} tema={tema} />}
      </AnimatePresence>

      <div className={`min-h-screen bg-[#050505] text-white ${tema.fuente} pb-20`}>
        <section className="relative h-screen flex items-center justify-center text-center px-6 overflow-hidden">
          <motion.div 
            initial={{ scale: 1.2, opacity: 0 }} 
            animate={estaAbierto ? { scale: 1, opacity: 0.4 } : {}} 
            transition={{ duration: 2, delay: 0.5 }}
            className="absolute inset-0"
          >
            <img src={data.foto_hero} className="w-full h-full object-cover" alt={data.nombre} />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#050505]" />
          <motion.div 
            initial={{ y: 50, opacity: 0 }} 
            animate={estaAbierto ? { y: 0, opacity: 1 } : {}} 
            transition={{ delay: 1, duration: 1 }}
            className="relative z-10"
          >
            <Heart className="mx-auto mb-6 text-amber-400" fill="currentColor" size={30} />
            <h2 className="tracking-[0.6em] text-[10px] uppercase mb-4 text-amber-400/80 font-bold">Nuestra Boda</h2>
            <h1 className="text-7xl font-serif mb-6 italic text-amber-50 leading-tight tracking-tighter">
              {data.nombre}
            </h1>
            <div className="h-[1px] w-20 bg-amber-400/30 mx-auto mb-6" />
            <p className="text-xl font-light tracking-widest uppercase text-amber-100/60 tracking-[0.2em]">{data.fecha}</p>
          </motion.div>
        </section>

        <main className="max-w-md mx-auto px-6 space-y-24 -mt-20 relative z-20">
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[3rem] p-10 text-center">
            <Users className="mx-auto mb-4 text-amber-400 opacity-60" />
            <p className="text-[10px] uppercase tracking-[0.3em] text-amber-400/40 mb-2 font-bold">Pases Exclusivos</p>
            <h3 className="text-2xl font-serif italic text-amber-50">Hemos reservado {pasesTotales} lugares para ti</h3>
          </div>

          <section className="bg-white text-black rounded-[3.5rem] p-12 shadow-[0_20px_50px_rgba(251,191,36,0.2)] border border-amber-100">
            <div className="text-center mb-10">
              <h3 className="text-4xl font-serif italic text-slate-900 tracking-tighter">R.S.V.P.</h3>
              <p className="text-slate-400 text-[10px] uppercase tracking-widest mt-4 font-black">Confirmar antes del 1 de Dic</p>
            </div>
            <AnimatePresence mode="wait">
              {!enviado ? (
                <form onSubmit={handleRSVP} className="space-y-10">
                  <div className="border-b border-slate-100 pb-2">
                    <label className="text-[9px] font-black uppercase text-slate-300 tracking-widest">Nombre del Invitado</label>
                    <input required name="nombre" className="w-full py-2 outline-none text-xl font-serif italic text-slate-800 bg-transparent" placeholder="Escribe aquí..." />
                  </div>
                  <div className="grid grid-cols-2 gap-10">
                    <div>
                      <label className="text-[9px] font-black uppercase text-slate-300 tracking-widest block mb-2">Adultos</label>
                      <select value={adultos} onChange={(e) => setAdultos(parseInt(e.target.value))} className="w-full py-3 bg-slate-50 rounded-2xl outline-none px-4 font-serif italic text-lg">
                        {[...Array(pasesTotales + 1)].map((_, i) => (<option key={i} value={i}>{i}</option>))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase text-slate-300 tracking-widest block mb-2">Niños</label>
                      <select value={ninos} onChange={(e) => setNinos(parseInt(e.target.value))} className="w-full py-3 bg-slate-50 rounded-2xl outline-none px-4 font-serif italic text-lg">
                        {[...Array(pasesTotales + 1)].map((_, i) => (<option key={i} value={i}>{i}</option>))}
                      </select>
                    </div>
                  </div>
                  <button disabled={loading} className="w-full py-6 rounded-full font-black uppercase tracking-[0.3em] text-[10px] bg-black text-white hover:shadow-2xl transition-all active:scale-95 cursor-pointer">
                    {loading ? "Registrando..." : "Enviar Confirmación"}
                  </button>
                </form>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
                  <CheckCircle2 size={60} className="mx-auto text-green-500 mb-6" />
                  <h4 className="text-2xl font-serif italic text-slate-800">¡Confirmación Enviada!</h4>
                  <p className="text-slate-400 text-sm mt-2">Gracias por acompañarnos.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </main>

        <audio ref={audioRef} src={data.musica_url} preload="auto" loop />

        <button 
          onClick={toggleMusica}
          className={`fixed bottom-10 right-10 p-5 rounded-full shadow-2xl z-50 transition-all border border-white/10 active:scale-90 cursor-pointer ${
            playing ? 'bg-amber-500 text-black shadow-amber-500/40' : 'bg-white/5 text-white backdrop-blur-md'
          }`}
        >
          {playing ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}>
              <Music size={24} />
            </motion.div>
          ) : <Music size={24} className="opacity-50" />}
        </button>
      </div>
    </>
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

  // @ts-ignore
  const data = EVENTOS[slug];

  if (!data) {
    return (
      <div className="p-20 text-center font-bold text-red-500 bg-black min-h-screen flex items-center justify-center">
        Error: Invitación no encontrada. Revisa el slug en la URL.
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F4EE] flex items-center justify-center">Cargando invitación...</div>}>
      {modelo === 'basica' && <LayoutBasico data={data} />}
      {modelo === 'moderada' && <LayoutModerado data={data} />}
      {modelo === 'avanzada' && <LayoutAvanzado data={data} pasesTotales={pases} />}
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