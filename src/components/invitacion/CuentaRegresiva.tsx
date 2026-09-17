"use client";

import React, { useState, useEffect } from 'react';

export const CuentaRegresiva = ({ 
  fechaISO, 
  esOscuro = false, 
  variante = "elegante" 
}: { 
  fechaISO: string, 
  esOscuro?: boolean, 
  variante?: "elegante" | "fiesta" 
}) => {
  const [timeLeft, setTimeLeft] = useState({ dias: 0, horas: 0, min: 0, seg: 0 });

  useEffect(() => {
    if (!fechaISO) return;
    const fechaObjetivo = new Date(fechaISO).getTime();

    const actualizar = () => {
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

    actualizar();
    const interval = setInterval(actualizar, 1000);
    return () => clearInterval(interval);
  }, [fechaISO]);

  if (variante === "fiesta") {
    return (
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
    );
  }

  return (
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
  );
};