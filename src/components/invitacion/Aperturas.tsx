"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

// Cortinilla Puertas de Gala (Black Tie)
export const PuertasGala = ({ 
  alAbrir, 
  nombre,
  estilo 
}: { 
  alAbrir: () => void, 
  nombre: string,
  estilo?: any 
}) => {
  const inicial = nombre.charAt(0).toUpperCase();
  const acentoBg = estilo?.acentoBg || "bg-[#D4AF37]";

  return (
    <motion.div 
      key="puertas-gala-overlay"
      className="fixed inset-0 z-[100] flex overflow-hidden bg-[#080808]"
      exit={{ opacity: 0, transition: { duration: 1, delay: 0.4 } }}
    >
      <div className="absolute inset-0 flex items-center justify-center z-[110]">
        <motion.div exit={{ scale: 0, opacity: 0, transition: { duration: 0.4 } }} className="relative">
          <motion.button
            onClick={alAbrir}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-36 h-36 flex items-center justify-center cursor-pointer group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-[#1F1B16] via-[#14120E] to-[#0A0907] rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.8)] border-2 ${estilo?.bordeDorado || "border-[#D4AF37]/50"}`} />
            <div className="relative flex flex-col items-center">
              <span className="text-white font-serif text-5xl italic leading-none">{inicial}</span>
              <span className={`text-[7px] font-sans font-bold tracking-[0.4em] uppercase mt-2 ${estilo?.acento || "text-[#C5A880]"}`}>Pulsar</span>
            </div>
            <div className={`absolute -bottom-1 ${acentoBg} w-8 h-8 rounded-full flex items-center justify-center shadow-lg border border-black text-white`}>
              <Heart size={12} fill="currentColor" />
            </div>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export const SobreModal = ({ 
  alAbrir, 
  nombre, 
  fecha, 
  nombreInvitado, 
  pasesTotales,
  estilo 
}: { 
  alAbrir: () => void, 
  nombre: string, 
  fecha: string, 
  nombreInvitado?: string, 
  pasesTotales?: number,
  estilo?: any 
}) => {
  const acentoBg = estilo?.acentoBg || "bg-[#C99C35]";

  return (
    <motion.div
      key="sobre-modal"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -70, scale: 0.95 }}
      transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
      className="fixed inset-0 z-50 bg-[#141210] flex flex-col items-center justify-center p-6 text-center"
    >
      <div 
        onClick={alAbrir}
        className="relative w-full max-w-sm aspect-[4/3] bg-[#E8DCBF] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] border border-[#D6C49E] p-8 flex flex-col items-center justify-between overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform active:scale-[0.98]"
      >
        <div className="relative z-10 text-[9px] uppercase tracking-[0.4em] text-[#7A6B53]">
          {nombreInvitado ? `Invitación Para: ${nombreInvitado.replace('+', ' ')}` : "Invitación Exclusiva"}
        </div>
        <div className="relative z-10 my-auto space-y-2 pointer-events-none">
          <h1 className="text-4xl italic text-[#383126] font-normal leading-tight">{nombre}</h1>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#73634B]">{fecha}</p>
        </div>
        {/* Sello de Cera Dinámico */}
        <div className={`relative z-20 w-16 h-16 rounded-full ${acentoBg} text-white shadow-xl border-2 border-white flex flex-col items-center justify-center`}>
          <span className="text-xl drop-shadow-sm">⚜</span>
          <span className="text-[7px] tracking-[0.2em] font-sans font-bold uppercase mt-0.5">Abrir</span>
        </div>
      </div>
      <p onClick={alAbrir} className="text-white/60 text-xs font-serif italic mt-6 tracking-widest cursor-pointer animate-pulse">
        Toca el sobre para abrir
      </p>
    </motion.div>
  );
};

// =========================================================================
// Sobre Botánico & Viñedo (Exclusivo para Jardín & Olivo)
// =========================================================================
export const SobreBotanico = ({ 
  alAbrir, 
  nombre, 
  fecha, 
  nombreInvitado, 
  pasesTotales 
}: { 
  alAbrir: () => void, 
  nombre: string, 
  fecha: string, 
  nombreInvitado?: string, 
  pasesTotales?: number 
}) => {
  return (
    <motion.div
      key="sobre-botanico"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -70, scale: 0.95 }}
      transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
      className="fixed inset-0 z-50 bg-[#161D15] flex flex-col items-center justify-center p-6 text-center select-none"
    >
      {/* Resplandor verde follaje de fondo */}
      <div className="absolute w-96 h-96 bg-[#4A5D44]/25 rounded-full blur-3xl pointer-events-none" />

      {/* Tarjeta del Sobre */}
      <div 
        onClick={alAbrir}
        className="relative w-full max-w-sm aspect-[4/3] bg-[#E8EFE5] rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] border border-[#C8D6C4] p-8 flex flex-col items-center justify-between overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform active:scale-[0.98]"
      >
        {/* Solapa triangular verde salvia oscuro */}
        <div 
          className="absolute inset-x-0 top-0 h-32 bg-[#D1DEC9] border-b border-[#B8C9B0] pointer-events-none shadow-sm"
          style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} 
        />

        {/* Encabezado del sobre */}
        <div className="relative z-10 flex items-center gap-1.5 text-[9px] uppercase tracking-[0.35em] text-[#4A5D44] font-sans font-bold">
          <span>🌿</span>
          <span>{nombreInvitado ? `Invitación: ${nombreInvitado.replace('+', ' ')}` : "Hacienda & Jardín"}</span>
          <span>🌿</span>
        </div>

        {/* Nombres y fecha en tipografía fina */}
        <div className="relative z-10 my-auto space-y-1.5 pointer-events-none">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#6E7F68] font-sans">Nuestra Boda</p>
          <h1 className="text-4xl italic text-[#243021] font-serif leading-tight">{nombre}</h1>
          <div className="w-12 h-[1px] bg-[#8FA388] mx-auto my-1" />
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#556750] font-sans font-medium">{fecha}</p>
          
          {pasesTotales && (
            <div className="inline-block px-3 py-1 bg-[#D1DEC9]/60 rounded-full border border-[#B4C5AB] text-[9px] uppercase tracking-widest text-[#374533] font-sans font-semibold mt-1">
              {pasesTotales} {pasesTotales === 1 ? 'Pase de Entrada' : 'Pases de Entrada'}
            </div>
          )}
        </div>

        {/* Sello de Cera Botánico Verde Olivo */}
        <div className="relative z-20 w-16 h-16 rounded-full bg-gradient-to-br from-[#53684D] via-[#43543E] to-[#2B3827] shadow-[0_8px_20px_rgba(43,56,39,0.5)] border-2 border-[#D9E5D4] flex flex-col items-center justify-center group-hover:scale-105 transition-transform">
          <span className="text-xl">🌿</span>
          <span className="text-white text-[7px] tracking-[0.2em] font-sans font-bold uppercase -mt-0.5 opacity-90">Abrir</span>
        </div>
      </div>

      <p onClick={alAbrir} className="text-[#A2B59D] text-xs font-serif italic mt-6 tracking-widest cursor-pointer animate-pulse">
        Toca el sello para abrir la invitación
      </p>
    </motion.div>
  );
};