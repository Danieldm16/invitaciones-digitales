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
// OPCIÓN 2: PUERTAS DE GALA (Theatrical Reveal)
// ==========================================
const PuertasGala = ({ alAbrir, nombre, tema }: { alAbrir: () => void, nombre: string, tema: any }) => {
  const inicial = nombre.charAt(0).toUpperCase();

  return (
    <motion.div 
      className="fixed inset-0 z-[100] flex overflow-hidden bg-[#0c0d0c]"
      exit={{ opacity: 0, transition: { duration: 1, delay: 0.5 } }}
    >
      {/* Luz de fondo que se asoma por la rendija */}
      <div className="absolute inset-0 flex justify-center">
        <div className="w-[2px] h-full bg-gradient-to-b from-transparent via-amber-200/40 to-transparent shadow-[0_0_20px_rgba(251,191,36,0.3)]" />
      </div>

      {/* Puerta Izquierda */}
      <motion.div 
        initial={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ duration: 1.5, ease: [0.6, 0.01, -0.05, 0.9] }}
        className="relative w-1/2 h-full bg-[#111211] border-r border-white/5 flex items-center justify-end"
      >
        {/* Textura de papel fino */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]" />
      </motion.div>

      {/* Puerta Derecha */}
      <motion.div 
        initial={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 1.5, ease: [0.6, 0.01, -0.05, 0.9] }}
        className="relative w-1/2 h-full bg-[#111211] border-l border-white/5 flex items-center justify-start"
      >
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]" />
      </motion.div>

      {/* Sello de Lacre Premium */}
      <div className="absolute inset-0 flex items-center justify-center z-[110]">
        <motion.div
            exit={{ scale: 0, opacity: 0, transition: { duration: 0.5 } }}
            className="relative"
        >
            {/* Brillo de fondo */}
            <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute -inset-10 bg-amber-500/20 rounded-full blur-3xl" 
            />

            <motion.button
                onClick={alAbrir}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-36 h-36 flex items-center justify-center"
            >
                {/* El Sello Físico */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#8b0000] to-[#5a0000] rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.6)] border-2 border-white/10" />
                
                {/* Borde dorado interno */}
                <div className="absolute inset-2 border border-amber-500/30 rounded-full" />

                {/* Monograma */}
                <div className="relative flex flex-col items-center">
                    <span className="text-amber-200/90 font-serif text-5xl italic leading-none">{inicial}</span>
                    <div className="h-[1px] w-8 bg-amber-200/30 my-1" />
                    <span className="text-amber-200/40 text-[7px] font-black tracking-[0.4em] uppercase">Pulsar</span>
                </div>

                {/* Pequeño detalle de corazón en oro */}
                <div className="absolute -bottom-1 bg-[#b89b5e] w-8 h-8 rounded-full flex items-center justify-center shadow-lg border border-white/20">
                    <Heart size={12} className="text-[#5a0000]" fill="currentColor" />
                </div>
            </motion.button>
        </motion.div>
      </div>

      {/* Texto inferior con mejor tipografía */}
      <motion.div 
        exit={{ opacity: 0 }}
        className="absolute bottom-16 inset-x-0 text-center z-[105]"
      >
         <p className="text-amber-100/30 font-serif italic text-sm tracking-[0.3em] uppercase">
            Propiedad exclusiva de la familia {nombre}
         </p>
      </motion.div>
    </motion.div>
  );
};
// --- Mantenemos los layouts Basico y Moderado iguales ---

const LayoutBasico = ({ data }: { data: any }) => {
  const tema = data.tema;
  return (
    <div className={`min-h-screen ${tema.fondo} flex items-center justify-center p-4 ${tema.fuente}`}>
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 text-center text-slate-800">
        <div className="h-64 relative">
          <img src={data.foto_hero} className="w-full h-full object-cover" />
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
            <a href={data.mapa} target="_blank" className={`block w-full ${tema.boton} text-white py-4 rounded-xl font-bold transition-all`}>📍 Ver Mapa</a>
            <a href={`https://wa.me/${data.wa_confirmar}`} target="_blank" className="block w-full bg-[#25D366] text-white py-4 rounded-xl font-bold">✅ Confirmar WhatsApp</a>
          </div>
        </div>
      </div>
    </div>
  );
};

const LayoutModerado = ({ data }: { data: any }) => {
  const tema = data.tema;
  const [sobreAbierto, setSobreAbierto] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ dias: 0, horas: 0, min: 0, seg: 0 });
  const audioRef = useRef<HTMLAudioElement>(null);

  // Cuenta regresiva
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

  // Abrir sobre y reproducir audio
  const handleAbrir = () => {
    setSobreAbierto(true);
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

  const mensajeWhatsApp = encodeURIComponent(
    `¡Hola! Confirmo con mucho gusto mi asistencia a la boda de ${data.nombre} 💍✨`
  );

  return (
    <div className="min-h-screen bg-[#1F1E1C] text-[#2C2A29] flex justify-center selection:bg-[#C5A880] selection:text-white">
      {/* Elemento de Audio */}
      <audio ref={audioRef} src={data.musica_url} loop preload="auto" />

      {/* --- PANTALLA 1: EL SOBRE INICIAL --- */}
      <AnimatePresence>
        {!sobreAbierto && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
            className="fixed inset-0 z-50 bg-[#161513] flex flex-col items-center justify-center p-6 text-center"
          >
            {/* Resplandor cálido de fondo */}
            <div className="absolute w-72 h-72 bg-[#C5A880]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative w-full max-w-sm aspect-[4/3] bg-[#FAF8F5] rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] p-8 flex flex-col items-center justify-between border border-[#EBE4D8] overflow-hidden">
              {/* Marca de agua decorativa */}
              <div className="text-[9px] uppercase tracking-[0.4em] text-[#8C827A] font-serif">
                Invitación de Boda
              </div>

              {/* Monograma central */}
              <div className="my-auto space-y-2">
                <p className="font-serif italic text-3xl text-[#3A3530]">{data.nombre}</p>
                <div className="w-12 h-[1px] bg-[#C5A880] mx-auto" />
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#A89F91] font-sans">
                  {data.fecha}
                </p>
              </div>

              {/* Sello de Lacre para abrir */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAbrir}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-[#802B28] via-[#6B201E] to-[#4A1412] shadow-xl border-2 border-[#D4AF37]/40 flex flex-col items-center justify-center text-white cursor-pointer group"
              >
                <Heart size={16} fill="currentColor" className="text-[#F2D7B6] group-hover:scale-110 transition-transform" />
                <span className="text-[7px] font-serif tracking-[0.2em] uppercase text-[#F2D7B6] mt-0.5">Abrir</span>
              </motion.button>
            </div>
            <p className="text-[#8C827A] text-xs font-serif italic mt-6 tracking-widest">Toca el sello para abrir</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- PANTALLA 2: LA REVISTA / HOJA ARTESANAL (Ancho móvil siempre perfecto) --- */}
      <main className="w-full max-w-md bg-[#FAF8F5] min-h-screen shadow-2xl relative my-0 md:my-6 md:rounded-[2.5rem] overflow-hidden border-x border-[#EBE4D8]">
        
        {/* Botón flotante de Música */}
        <button
          onClick={toggleAudio}
          className="fixed top-6 right-6 z-40 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-[#E8E1D5] flex items-center justify-center text-[#59524C] hover:text-[#C5A880] transition-colors"
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

        {/* 1. PORTADA EDITORIAL (Estilo Revista de Novias) */}
        <header className="relative h-[78vh] w-full flex flex-col justify-end p-8 text-white overflow-hidden">
          <motion.img
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            src={data.foto_hero}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#161513] via-black/25 to-transparent" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative z-10 text-center space-y-3"
          >
            <span className="text-[10px] uppercase tracking-[0.5em] text-[#E0CDA9] font-light">
              Nuestra Boda
            </span>
            <h1 className="text-5xl md:text-6xl font-serif italic font-normal tracking-tight text-[#FAF8F5]">
              {data.nombre}
            </h1>
            <p className="text-xs uppercase tracking-[0.3em] text-white/80 font-light pt-1">
              {data.fecha}
            </p>
          </motion.div>
        </header>

        {/* 2. FRASE DE LOS NOVIOS */}
        <section className="px-8 py-14 text-center border-b border-[#EBE4D8]">
          <p className="font-serif italic text-lg text-[#5A534D] leading-relaxed">
            "{data.frase}"
          </p>
          <div className="w-8 h-[1px] bg-[#C5A880] mx-auto mt-6" />
        </section>

        {/* 3. CUENTA REGRESIVA MINIMALISTA */}
        <section className="px-6 py-10 bg-[#F4EFE6] border-b border-[#EBE4D8]">
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#8A8177] text-center font-serif mb-6">
            Solo faltan
          </p>
          <div className="grid grid-cols-4 gap-2 text-center">
            {Object.entries(timeLeft).map(([label, val]) => (
              <div key={label} className="bg-white/80 backdrop-blur-sm py-4 rounded-xl shadow-xs border border-[#E8DFCFC]">
                <span className="text-2xl md:text-3xl font-serif text-[#3A3530] block font-light">
                  {val}
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#9E958B] block mt-1">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 4. FECHA & UBICACIÓN EDITORIAL */}
        <section className="px-8 py-14 space-y-10 text-center border-b border-[#EBE4D8]">
          <div className="space-y-3">
            <Calendar className="mx-auto text-[#C5A880]" size={26} strokeWidth={1.5} />
            <h3 className="text-xs uppercase tracking-[0.3em] text-[#8A8177] font-serif">Fecha y Hora</h3>
            <p className="text-2xl font-serif italic text-[#3A3530]">{data.fecha}</p>
            <p className="text-sm text-[#736B63] font-light">A las {data.hora}</p>
          </div>

          <div className="space-y-4 pt-4">
            <MapPin className="mx-auto text-[#C5A880]" size={26} strokeWidth={1.5} />
            <h3 className="text-xs uppercase tracking-[0.3em] text-[#8A8177] font-serif">Recepción</h3>
            <div>
              <p className="text-xl font-serif text-[#3A3530]">{data.lugar}</p>
              <p className="text-xs text-[#736B63] mt-1 max-w-xs mx-auto leading-relaxed">{data.direccion}</p>
            </div>
            <a
              href={data.mapa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#3A3530] text-[#FAF8F5] rounded-full text-[10px] tracking-[0.25em] uppercase hover:bg-[#25221F] transition-all shadow-md active:scale-95 mt-2"
            >
              Abrir en Google Maps
            </a>
          </div>
        </section>

        {/* 5. GALERÍA LOOKBOOK (5-10 fotos) */}
        <section className="px-6 py-14 border-b border-[#EBE4D8]">
          <div className="text-center mb-8 space-y-2">
            <Camera className="mx-auto text-[#C5A880]" size={24} strokeWidth={1.5} />
            <h3 className="text-xs uppercase tracking-[0.35em] text-[#8A8177] font-serif">
              Nuestra Historia
            </h3>
            <p className="text-xs font-serif italic text-[#8A8177]">Momentos inolvidables</p>
          </div>

          {/* Mosaico Asimétrico Editorial */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 aspect-[16/10] rounded-2xl overflow-hidden shadow-sm">
              <img
                src={data.foto_hero}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                alt="Foto principal"
              />
            </div>
            <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1583939003579-730e3918a45a"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                alt="Momento 1"
              />
            </div>
            <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                alt="Momento 2"
              />
            </div>
          </div>
        </section>

        {/* 6. MESA DE REGALOS */}
        <section className="px-8 py-14 text-center border-b border-[#EBE4D8] space-y-6">
          <Gift className="mx-auto text-[#C5A880]" size={26} strokeWidth={1.5} />
          <div className="space-y-1">
            <h3 className="text-xs uppercase tracking-[0.3em] text-[#8A8177] font-serif">Mesa de Regalos</h3>
            <p className="text-sm font-serif italic text-[#5A534D]">
              El mejor regalo es tu compañía, pero si deseas hacernos un detalle:
            </p>
          </div>
          <a
            href={data.mesa_regalos}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full py-4 border border-[#C5A880] text-[#3A3530] font-serif text-sm italic rounded-2xl hover:bg-[#C5A880]/10 transition-colors shadow-xs"
          >
            Ver Mesa en Tienda
          </a>
        </section>

        {/* 7. CONFIRMACIÓN POR WHATSAPP (Call to action principal) */}
        <section className="px-8 py-16 text-center space-y-6 bg-[#F5EFE6]/60">
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#8A8177]">Confirmación</p>
            <h3 className="text-2xl font-serif italic text-[#3A3530]">¿Nos acompañas?</h3>
            <p className="text-xs text-[#736B63] max-w-xs mx-auto">
              Agradecemos confirmar tu asistencia para tener listo tu lugar.
            </p>
          </div>

          <a
            href={`https://wa.me/${data.wa_confirmar}?text=${mensajeWhatsApp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full font-sans text-xs uppercase tracking-[0.25em] font-semibold shadow-lg shadow-green-600/20 active:scale-95 transition-all"
          >
            <MessageCircle size={20} />
            Confirmar por WhatsApp
          </a>
        </section>

        {/* Footer elegante */}
        <footer className="py-8 text-center border-t border-[#EBE4D8] text-[#A89F91] text-[10px] uppercase tracking-[0.3em] font-serif">
          {data.nombre} • 2026
        </footer>
      </main>
    </div>
  );
};

// ==========================================
// 3. MOTOR AVANZADO CON "PUERTAS DE GALA"
// ==========================================
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
    // Activar música tras el primer clic (requerido por navegadores)
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
        {/* Hero Cinematográfico */}
        <section className="relative h-screen flex items-center justify-center text-center px-6 overflow-hidden">
          <motion.div 
            initial={{ scale: 1.2, opacity: 0 }} 
            animate={estaAbierto ? { scale: 1, opacity: 0.4 } : {}} 
            transition={{ duration: 2, delay: 0.5 }}
            className="absolute inset-0"
          >
            <img src={data.foto_hero} className="w-full h-full object-cover" />
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

          {/* Galería Premium */}
          <section className="py-10 space-y-8">
              <div className="text-center">
                <Camera className="mx-auto text-amber-400/40 mb-2" />
                <h4 className="text-[10px] uppercase tracking-[0.4em] text-amber-400 font-black">Nuestra Historia</h4>
              </div>
              <div className="grid grid-cols-2 gap-3">
                  {data.galeria?.map((foto: string, i: number) => (
                      <motion.div 
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className={`relative overflow-hidden rounded-3xl bg-white/5 ${
                              i === 0 ? "col-span-2 h-72" : "h-48"
                          }`}
                      >
                          <img src={foto} className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" />
                      </motion.div>
                  ))}
              </div>
          </section>

          {/* Formulario RSVP Premium */}
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
                    <button disabled={loading} className="w-full py-6 rounded-full font-black uppercase tracking-[0.3em] text-[10px] bg-black text-white hover:shadow-2xl transition-all active:scale-95">
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
          className={`fixed bottom-10 right-10 p-5 rounded-full shadow-2xl z-50 transition-all border border-white/10 active:scale-90 ${
              playing ? 'bg-amber-500 text-black shadow-amber-500/40' : 'bg-white/5 text-white backdrop-blur-md'
          }`}
        >
          {playing ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 6, ease: "linear" }}>
              <Music size={24} />
              </motion.div>
          ) : <Music size={24} className="opacity-50" />}
        </button>
      </div>
    </>
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

  if (!data) return <div className="p-20 text-center font-bold text-red-500 bg-black h-screen">Error: Invitación no encontrada.</div>;

  return (
    <Suspense fallback={<div>Cargando...</div>}>
        {modelo === 'basica' && <LayoutBasico data={data} />}
        {modelo === 'moderada' && <LayoutModerado data={data} />}
        {modelo === 'avanzada' && <LayoutAvanzado data={data} pasesTotales={pases} />}
    </Suspense>
  );
}

export default function Page() {
  return <Suspense><InvitacionDinamica /></Suspense>;
}