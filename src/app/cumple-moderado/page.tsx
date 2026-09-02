"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Gift, MessageCircle, Music } from 'lucide-react';
import { EVENTOS } from '@/lib/eventos-config';

export default function InvitacionModerada() {
  const data = EVENTOS.irma_cumple;
  const tema = data.tema;

  const [timeLeft, setTimeLeft] = useState({ dias: 0, horas: 0, min: 0, seg: 0 });

  useEffect(() => {
    const targetDate = new Date(data.fechaISO).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance < 0) { clearInterval(interval); return; }
      setTimeLeft({
        dias: Math.floor(distance / (1000 * 60 * 60 * 24)),
        horas: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        min: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seg: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [data.fechaISO]);

  return (
    <div className={`min-h-screen ${tema.fondo} ${tema.fuente} pb-20`}>
      {/* Hero */}
      <div className="relative h-[50vh] overflow-hidden">
        <img src={data.foto_hero} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-6xl font-bold mb-2">{data.nombre}</h1>
            <p className="uppercase tracking-[0.3em] font-bold">{data.titulo}</p>
          </div>
        </div>
      </div>

      {/* Reloj */}
      <div className="max-w-md mx-auto -mt-10 relative z-10 px-4">
        <div className={`${tema.tarjeta} rounded-2xl shadow-xl p-6 flex justify-around text-center border border-slate-100`}>
          {Object.entries(timeLeft).map(([label, val]) => (
            <div key={label}>
              <p className={`text-3xl font-bold ${tema.acento}`}>{val}</p>
              <p className="text-[10px] uppercase text-slate-400 font-bold">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detalles */}
      <div className="max-w-md mx-auto mt-12 px-8 space-y-12 text-center text-slate-700">
        <div>
          <Calendar className={`mx-auto mb-2 ${tema.acento}`} />
          <h3 className="text-xl font-bold">{data.fecha}</h3>
          <p className="text-sm">A las {data.hora}</p>
        </div>

        <div>
          <MapPin className={`mx-auto mb-2 ${tema.acento}`} />
          <h3 className="text-xl font-bold">{data.lugar}</h3>
          <p className="text-sm mb-4">{data.direccion}</p>
          <a href={data.mapa} target="_blank" className={`inline-block text-white px-8 py-3 rounded-full text-sm font-bold ${tema.boton} w-full`}>
            📍 Abrir Google Maps
          </a>
        </div>

        {/* Mesa de Regalos */}
        <div className="p-8 rounded-3xl border-2 border-dashed border-slate-200">
          <Gift className={`mx-auto mb-4 ${tema.acento}`} />
          <p className="text-sm mb-6 font-medium italic text-slate-500">Tu presencia es mi mejor regalo, pero si deseas tener un detalle:</p>
          <a href={data.mesa_regalos} target="_blank" className={`block w-full py-3 rounded-xl text-white font-bold ${tema.boton}`}>
             Ver Mesa de Regalos
          </a>
        </div>

        {/* Confirmación WhatsApp (Faltaba en el anterior) */}
        <a 
          href={`https://wa.me/${data.wa_confirmar}?text=Hola! Confirmo mi asistencia al evento de ${data.nombre}`} 
          target="_blank"
          className="flex items-center justify-center gap-2 w-full bg-green-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-100 hover:bg-green-600 transition-all"
        >
          <MessageCircle size={20} />
          Confirmar por WhatsApp
        </a>
      </div>

      {/* Botón Flotante Música */}
      <button className="fixed bottom-6 right-6 p-4 bg-white rounded-full shadow-2xl text-slate-800 z-50">
        <Music size={24} />
      </button>
    </div>
  );
}