"use client";

import React, { useState, useEffect } from 'react';

export const CuentaRegresiva = ({ 
  fechaISO, 
  esOscuro = false, 
  variante = "elegante",
  estilo 
}: { 
  fechaISO: string, 
  esOscuro?: boolean, 
  variante?: "elegante" | "fiesta",
  estilo?: any
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

  const acentoClase = estilo?.acento || (esOscuro ? "text-[#D4AF37]" : "text-[#C5A880]");
  const bordeClase = estilo?.bordeAcento || (esOscuro ? "border-[#D4AF37]/30" : "border-[#EAE2D5]");
  const cajaFondo = esOscuro ? "bg-[#181614]" : "bg-white/95";

  if (variante === "fiesta") {
    return (
      <div className={`${estilo?.tarjeta || "bg-[#140F24] text-white"} border ${estilo?.bordeAcento || "border-[#8B5CF6]/25"} rounded-3xl p-7 text-center space-y-3 shadow-lg`}>
        <p className={`text-xs uppercase font-bold ${acentoClase} tracking-widest`}>La fiesta empieza en</p>
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { val: timeLeft.dias, label: 'días' },
            { val: timeLeft.horas, label: 'hrs' },
            { val: timeLeft.min, label: 'min' },
            { val: timeLeft.seg, label: 'seg' },
          ].map((item, i) => (
            <div key={i} className={`${esOscuro ? "bg-white/5" : "bg-black/5"} py-3 rounded-xl border ${bordeClase}`}>
              <span className="text-3xl font-black block">{item.val}</span>
              <span className={`text-[10px] ${acentoClase} uppercase font-bold tracking-wider`}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="px-6 py-6 text-center space-y-4">
      <h3 className={`text-3xl italic ${acentoClase}`}>Faltan:</h3>
      <div className="grid grid-cols-4 gap-2 text-center">
        {[
          { val: timeLeft.dias, label: 'días' },
          { val: timeLeft.horas, label: 'horas' },
          { val: timeLeft.min, label: 'minutos' },
          { val: timeLeft.seg, label: 'segundos' },
        ].map((item, i) => (
          <div key={i} className={`${cajaFondo} ${bordeClase} py-3 rounded-xl shadow-xs border`}>
            <span className={`text-3xl font-light ${estilo?.textoPrincipal || (esOscuro ? "text-[#FAF8F5]" : "text-[#3F372C]")} block font-serif`}>
              {item.val < 10 ? `0${item.val}` : item.val}
            </span>
            <span className={`text-[9px] ${acentoClase} uppercase tracking-wider block font-sans mt-0.5`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};