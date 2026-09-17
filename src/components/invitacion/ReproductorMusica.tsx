"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Music } from 'lucide-react';

export const ReproductorMusica = ({ 
  audioRef, 
  playing, 
  toggleAudio, 
  musicaUrl, 
  esOscuro = false,
  mostrarBarra = true 
}: { 
  audioRef: React.RefObject<HTMLAudioElement | null>, 
  playing: boolean, 
  toggleAudio: () => void, 
  musicaUrl?: string, 
  esOscuro?: boolean,
  mostrarBarra?: boolean 
}) => {
  return (
    <>
      <audio ref={audioRef} src={musicaUrl} loop preload="auto" />

      {/* Botón flotante superior derecho */}
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

      {/* Barra de reproducción con botón play */}
      {mostrarBarra && (
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
      )}
    </>
  );
};