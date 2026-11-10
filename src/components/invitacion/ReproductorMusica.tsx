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
  mostrarBarra = true,
  estilo 
}: { 
  audioRef: React.RefObject<HTMLAudioElement | null>, 
  playing: boolean, 
  toggleAudio: () => void, 
  musicaUrl?: string, 
  esOscuro?: boolean,
  mostrarBarra?: boolean,
  estilo?: any 
}) => {
  const acento = estilo?.acento || (esOscuro ? "text-[#D4AF37]" : "text-[#59524C]");
  const botonFondo = estilo?.botonPrimario || (esOscuro ? "bg-[#D4AF37] text-black" : "bg-[#3B352E] text-white");

  return (
    <>
      <audio ref={audioRef} src={musicaUrl} loop preload="auto" />

      {/* Botón flotante */}
      <button
        onClick={toggleAudio}
        className={`fixed top-5 right-5 z-40 w-11 h-11 rounded-full shadow-lg border flex items-center justify-center transition-all cursor-pointer ${
          esOscuro ? "bg-[#181614]/90 border-white/20" : "bg-white/90 border-black/10"
        } ${acento}`}
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

      {/* Barra */}
      {mostrarBarra && (
        <section className="px-6 py-4">
          <div className={`${estilo?.tarjeta || "bg-white"} rounded-2xl p-5 shadow-sm border ${estilo?.bordeAcento || "border-black/10"} text-center space-y-3`}>
            <p className={`text-xs uppercase tracking-[0.2em] ${acento} font-sans font-semibold`}>
              {playing ? "Sonando nuestra canción..." : "Dale Play Para Escuchar Nuestra Canción"}
            </p>
            <div className="flex items-center justify-center gap-6">
              <button 
                onClick={toggleAudio} 
                className={`w-11 h-11 rounded-full ${botonFondo} flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all text-xs cursor-pointer`}
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