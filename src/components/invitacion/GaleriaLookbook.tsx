"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X } from 'lucide-react';

export const GaleriaLookbook = ({ 
  fotos, 
  esOscuro = false, 
  permitirZoom = true 
}: { 
  fotos?: string[], 
  esOscuro?: boolean, 
  permitirZoom?: boolean 
}) => {
  const [fotoModal, setFotoModal] = useState<string | null>(null);

  if (!fotos || fotos.length === 0) return null;

  return (
    <>
      <section className="px-6 py-6 space-y-4">
        <div className="text-center space-y-1">
          <Camera className={`mx-auto ${esOscuro ? "text-[#D4AF37]" : "text-[#C5A880]"}`} size={22} strokeWidth={1.5} />
          <h3 className={`text-xs uppercase tracking-[0.3em] ${esOscuro ? "text-[#C5A880]" : "text-[#85796A]"} font-sans font-semibold`}>
            Nuestra Historia
          </h3>
          <p className={`text-2xl italic ${esOscuro ? "text-[#FAF8F5]" : "text-[#3F372C]"}`}>Galería de Fotos</p>
          {permitirZoom && (
            <p className={`text-[10px] ${esOscuro ? "text-[#A89F91]" : "text-[#9E9485]"} font-sans tracking-widest pt-1`}>
              (Toca cualquier foto para ampliarla)
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          {fotos.map((imgUrl: string, idx: number) => (
            <div
              key={idx}
              onClick={() => permitirZoom && setFotoModal(imgUrl)}
              className={`rounded-2xl overflow-hidden shadow-sm border-2 ${
                esOscuro ? "border-[#C5A880]/30 bg-[#181614]" : "border-white bg-white"
              } group ${permitirZoom ? "cursor-pointer" : ""} ${idx === 0 ? "col-span-2 aspect-[16/10]" : "aspect-square"}`}
            >
              <img src={imgUrl} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
          ))}
        </div>
      </section>

      {/* Modal Pantalla Completa */}
      <AnimatePresence>
        {fotoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFotoModal(null)}
            className="fixed inset-0 z-[120] bg-black/95 flex items-center justify-center p-4 cursor-pointer"
          >
            <button 
              onClick={() => setFotoModal(null)} 
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X size={24} />
            </button>
            <motion.img 
              initial={{ scale: 0.85 }} 
              animate={{ scale: 1 }} 
              exit={{ scale: 0.85 }} 
              src={fotoModal} 
              alt="Foto ampliada" 
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain border border-[#C5A880]/30" 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};