"use client";
import React from 'react';
import { EVENTOS } from '@/lib/eventos-config';

export default function InvitacionBasica() {
  // AQUÍ ESTÁ EL TRUCO: Solo cambias esta variable y toda la página cambia
  const data = EVENTOS.irma_cumple; 
  const tema = data.tema;

  return (
    <div className={`min-h-screen ${tema.fondo} flex items-center justify-center p-4 ${tema.fuente}`}>
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden">
        
        {/* Imagen dinámica */}
        <div className="h-64 relative overflow-hidden">
          <img src={data.foto_hero} className="w-full h-full object-cover" />
          <div className={`${tema.primario} absolute bottom-0 left-0 right-0 h-1 opacity-50`} />
        </div>

        <div className="p-8 text-center">
          <h2 className={`text-sm uppercase tracking-widest ${tema.acento} font-bold mb-2`}>
            {data.titulo}
          </h2>
          <h1 className="text-4xl font-extrabold text-slate-800 mb-4">
            {data.nombre}
          </h1>
          
          <p className="text-slate-600 mb-8 italic italic">"{data.frase}"</p>

          <div className="bg-slate-50 p-6 rounded-2xl text-left space-y-4 mb-8">
            <p className="font-bold text-slate-700">📅 {data.fecha}</p>
            <p className="text-sm text-slate-600">📍 {data.lugar}</p>
          </div>

          <a href={data.mapa} target="_blank" className={`block w-full ${tema.boton} text-white py-4 rounded-xl font-bold mb-3 transition-all`}>
            📍 Ver ubicación
          </a>
          
          <a href={`https://wa.me/${data.wa_confirmar}`} target="_blank" className="block w-full bg-green-500 text-white py-4 rounded-xl font-bold">
            ✅ Confirmar WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}