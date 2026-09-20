"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

// Cortinilla Puertas de Gala (Black Tie)
export const PuertasGala = ({ alAbrir, nombre }: { alAbrir: () => void, nombre: string }) => {
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

// Sobre Artesanal con Sello de Cera (Crema)
export const SobreModal = ({ 
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
      key="sobre-modal"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -70, scale: 0.95 }}
      transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
      className="fixed inset-0 z-50 bg-[#1A1816] flex flex-col items-center justify-center p-6 text-center"
    >
      <div className="absolute w-80 h-80 bg-[#C5A880]/15 rounded-full blur-3xl pointer-events-none" />
      <div 
        onClick={alAbrir}
        className="relative w-full max-w-sm aspect-[4/3] bg-[#E8DCBF] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] border border-[#D6C49E] p-8 flex flex-col items-center justify-between overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform active:scale-[0.98]"
      >
        <div className="absolute inset-x-0 top-0 h-28 bg-[#DECCA6] border-b border-[#C8B388] pointer-events-none" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
        <div className="relative z-10 text-[9px] uppercase tracking-[0.4em] text-[#7A6B53]">
          {nombreInvitado ? `Invitación Para: ${nombreInvitado.replace('+', ' ')}` : "Invitación Exclusiva"}
        </div>
        <div className="relative z-10 my-auto space-y-2 pointer-events-none">
          <h1 className="text-4xl italic text-[#383126] font-normal leading-tight">{nombre}</h1>
          <div className="w-10 h-[1px] bg-[#B89B5E] mx-auto" />
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#73634B]">{fecha}</p>
          {pasesTotales && (
            <div className="inline-block px-3 py-1 bg-[#D8C49D]/40 rounded-full border border-[#C5A880]/30 text-[9px] uppercase tracking-widest text-[#5E4F39] font-sans font-semibold mt-1">
              Boleto Digital • {pasesTotales} {pasesTotales === 1 ? 'Pase' : 'Pases'}
            </div>
          )}
        </div>
        <div className="relative z-20 w-16 h-16 rounded-full bg-gradient-to-br from-[#E2B755] via-[#C99C35] to-[#997316] shadow-xl border-2 border-white flex flex-col items-center justify-center">
          <span className="text-white text-xl drop-shadow-sm">⚜</span>
          <span className="text-white text-[7px] tracking-[0.2em] font-sans font-bold uppercase mt-0.5">Abrir</span>
        </div>
      </div>
      <p onClick={alAbrir} className="text-[#A89F91] text-xs font-serif italic mt-6 tracking-widest cursor-pointer animate-pulse">
        Toca el sobre para abrir
      </p>
    </motion.div>
  );
};