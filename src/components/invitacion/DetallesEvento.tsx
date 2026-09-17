"use client";

import React from 'react';
import { AlertCircle } from 'lucide-react';

export const ItinerarioSeccion = ({ 
  data, 
  esOscuro = false 
}: { 
  data: any, 
  esOscuro?: boolean 
}) => {
  return (
    <section className="px-6 py-6">
      <div className={`${esOscuro ? "bg-[#181614] border-[#D4AF37]/35" : "bg-white border-[#D4AF37]/40"} rounded-3xl p-8 shadow-md border-2 text-center space-y-8`}>
        <div className={`${esOscuro ? "text-[#D4AF37]" : "text-[#C5A880]"} text-xl`}>❖</div>
        <h3 className={`text-3xl italic ${esOscuro ? "text-[#D4AF37]" : "text-[#C5A880]"} -mt-5`}>Itinerario</h3>

        <div className="space-y-3">
          <div className={`w-12 h-12 mx-auto rounded-full ${esOscuro ? "bg-[#221F1C] border-[#D4AF37]/40" : "bg-[#FAF6EE] border-[#D4AF37]/30"} flex items-center justify-center text-2xl border`}>
            ⛪
          </div>
          <h4 className={`text-2xl italic ${esOscuro ? "text-[#FAF8F5]" : "text-[#3A332B]"}`}>Ceremonia</h4>
          <p className={`text-xs uppercase tracking-[0.2em] ${esOscuro ? "text-[#D4AF37]" : "text-[#C5A880]"} font-sans font-bold`}>
            {data.hora || "5:00 PM"}
          </p>
          <p className={`text-sm ${esOscuro ? "text-[#D9CEBA]" : "text-[#61584D]"} font-sans`}>{data.lugar}</p>
          <a href={data.mapa} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 px-6 py-2 rounded-full border ${esOscuro ? "border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black" : "border-[#C5A880] text-[#8A6F48] hover:bg-[#C5A880]/10"} text-[11px] uppercase tracking-[0.2em] transition-colors font-sans`}>
            Ver Mapa ↗
          </a>
        </div>

        <div className={`w-16 h-[1px] ${esOscuro ? "bg-[#C5A880]/20" : "bg-[#E8DFCF]"} mx-auto`} />

        <div className="space-y-3">
          <div className={`w-12 h-12 mx-auto rounded-full ${esOscuro ? "bg-[#221F1C] border-[#D4AF37]/40" : "bg-[#FAF6EE] border-[#D4AF37]/30"} flex items-center justify-center text-2xl border`}>
            🥂
          </div>
          <h4 className={`text-2xl italic ${esOscuro ? "text-[#FAF8F5]" : "text-[#3A332B]"}`}>Recepción</h4>
          <p className={`text-xs uppercase tracking-[0.2em] ${esOscuro ? "text-[#D4AF37]" : "text-[#C5A880]"} font-sans font-bold`}>
            7:00 PM
          </p>
          <p className={`text-sm ${esOscuro ? "text-[#D9CEBA]" : "text-[#61584D]"} font-sans`}>{data.lugar}</p>
          <a href={data.mapa} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 px-6 py-2 rounded-full border ${esOscuro ? "border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black" : "border-[#C5A880] text-[#8A6F48] hover:bg-[#C5A880]/10"} text-[11px] uppercase tracking-[0.2em] transition-colors font-sans`}>
            Ver Mapa ↗
          </a>
        </div>
      </div>
    </section>
  );
};

export const DressCodeSeccion = ({ 
  dressCode, 
  esOscuro = false, 
  conPaleta = true 
}: { 
  dressCode?: string, 
  esOscuro?: boolean, 
  conPaleta?: boolean 
}) => {
  return (
    <section className="px-6 py-4 space-y-6">
      <div className={`${esOscuro ? "bg-[#181614] border-[#C5A880]/30" : "bg-white border-[#EBE4D8]"} rounded-3xl p-6 shadow-md border space-y-5`}>
        <div className="flex items-center gap-4">
          <div className="text-4xl">🤵👰</div>
          <div>
            <h4 className={`text-2xl italic ${esOscuro ? "text-[#D4AF37]" : "text-[#C5A880]"}`}>Código de Vestimenta</h4>
            <p className={`text-xs uppercase tracking-[0.2em] font-sans font-bold ${esOscuro ? "text-white" : "text-[#3A332B]"}`}>
              {dressCode || "FORMAL"}
            </p>
          </div>
        </div>

        {conPaleta && (
          <div className={`space-y-2 pt-2 border-t ${esOscuro ? "border-[#C5A880]/20" : "border-[#EBE4D8]"}`}>
            <p className={`text-[10px] uppercase tracking-[0.2em] font-sans ${esOscuro ? "text-[#C5A880]" : "text-[#7A7267]"} font-semibold`}>
              Paleta de Colores Sugerida:
            </p>
            <div className="flex items-center justify-between pt-1">
              {[
                { hex: "#B85D43", nombre: "Terracota" },
                { hex: "#C5A880", nombre: "Champán" },
                { hex: "#556B2F", nombre: "Olivo" },
                { hex: "#1B2A4A", nombre: "Azul" },
                { hex: "#2A2A2A", nombre: "Negro" }
              ].map((c, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-7 h-7 rounded-full shadow-xs border border-white/20" style={{ backgroundColor: c.hex }} />
                  <span className="text-[8px] font-sans text-[#8A8177]">{c.nombre}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={`p-3 ${esOscuro ? "bg-[#221F1C] border-[#C5A880]/30 text-[#D9CEBA]" : "bg-[#FAF6EE] border-[#E5D7C0] text-[#73634B]"} rounded-xl border text-[10px] font-sans flex items-center gap-2`}>
          <AlertCircle size={16} className={`${esOscuro ? "text-[#D4AF37]" : "text-[#C5A880]"} shrink-0`} />
          <span>Por favor, evitar asistir de color blanco, beige o marfil (reservados para la novia).</span>
        </div>
      </div>
    </section>
  );
};