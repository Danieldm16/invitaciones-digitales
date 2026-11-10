"use client";

import React from 'react';
import { AlertCircle } from 'lucide-react';

const PALETA_DEFAULT = [
  { hex: "#B85D43", nombre: "Terracota" },
  { hex: "#C5A880", nombre: "Champán" },
  { hex: "#556B2F", nombre: "Olivo" },
  { hex: "#1B2A4A", nombre: "Azul" },
  { hex: "#2A2A2A", nombre: "Negro" }
];

export const ItinerarioSeccion = ({ 
  itinerario = [], 
  lugarGeneral = "", 
  lugar = "",
  mapaGeneral = "",
  mapa = "",
  esOscuro = false,
  estilo
}: { 
  itinerario?: { h: string; a: string; icon?: string; lugar?: string; mapa?: string }[], 
  lugarGeneral?: string, 
  lugar?: string,
  mapaGeneral?: string, 
  mapa?: string,
  esOscuro?: boolean,
  estilo?: any
}) => {
  if (!itinerario || itinerario.length === 0) return null;

  const ubicacionBase = lugarGeneral || lugar || "";
  const mapaBase = mapaGeneral || mapa || "";
  const acento = estilo?.acento || (esOscuro ? "text-[#D4AF37]" : "text-[#C5A880]");
  const borde = estilo?.bordeAcento || (esOscuro ? "border-[#D4AF37]/35" : "border-[#C5A880]/40");
  const tarjetaClase = estilo?.tarjeta || (esOscuro ? "bg-[#181614] text-white" : "bg-white text-[#3A332B]");

  return (
    <section className="px-6 py-6">
      <div className={`relative ${tarjetaClase} rounded-3xl p-8 shadow-md border-2 ${borde} text-center space-y-8`}>
        <div className={`${acento} text-xl`}>❖</div>
        <h3 className={`text-3xl italic ${acento} -mt-5`}>Itinerario</h3>

        <div className="space-y-8">
          {itinerario.map((item, index) => {
            const lugarActividad = item.lugar || ubicacionBase;
            const mapaActividad = item.mapa || (index === 0 ? mapaBase : undefined);

            return (
              <React.Fragment key={index}>
                <div className="space-y-2">
                  <div className={`w-12 h-12 mx-auto rounded-full ${esOscuro ? "bg-white/5" : "bg-black/5"} ${borde} flex items-center justify-center text-2xl border shadow-xs`}>
                    {item.icon || (index === 0 ? "⛪" : index === 1 ? "🥂" : "✨")}
                  </div>
                  
                  <h4 className={`text-2xl italic ${estilo?.textoPrincipal || (esOscuro ? "text-[#FAF8F5]" : "text-[#3A332B]")}`}>
                    {item.a}
                  </h4>
                  
                  <p className={`text-xs uppercase tracking-[0.2em] ${acento} font-sans font-bold`}>
                    {item.h}
                  </p>

                  {lugarActividad && (
                    <p className={`text-xs ${estilo?.textoSecundario || (esOscuro ? "text-[#D9CEBA]" : "text-[#61584D]")} font-sans`}>
                      {lugarActividad}
                    </p>
                  )}

                  {mapaActividad && (
                    <div className="pt-1">
                      <a 
                        href={mapaActividad} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={`inline-flex items-center gap-1.5 px-6 py-1.5 rounded-full border ${borde} ${acento} hover:opacity-80 text-[11px] uppercase tracking-[0.2em] transition-all font-sans`}
                      >
                        Ver Ubicación en Maps ↗
                      </a>
                    </div>
                  )}
                </div>

                {index < itinerario.length - 1 && (
                  <div className={`w-16 h-[1px] ${borde} opacity-40 mx-auto`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const DressCodeSeccion = ({ 
  dressCode = "FORMAL", 
  notaDressCode = "",
  paleta = PALETA_DEFAULT,
  esOscuro = false, 
  conPaleta = true,
  estilo
}: { 
  dressCode?: string, 
  notaDressCode?: string,
  paleta?: { hex: string; nombre: string }[],
  esOscuro?: boolean, 
  conPaleta?: boolean,
  estilo?: any
}) => {
  const acento = estilo?.acento || (esOscuro ? "text-[#D4AF37]" : "text-[#C5A880]");
  const borde = estilo?.bordeAcento || (esOscuro ? "border-[#C5A880]/30" : "border-[#EBE4D8]");
  const tarjetaClase = estilo?.tarjeta || (esOscuro ? "bg-[#181614] text-white" : "bg-white text-[#3A332B]");

  return (
    <section className="px-6 py-4 space-y-6">
      <div className={`${tarjetaClase} rounded-3xl p-6 shadow-md border ${borde} space-y-5`}>
        <div className="flex items-center gap-4">
          <div className="text-4xl">🤵👰</div>
          <div>
            <h4 className={`text-2xl italic ${acento}`}>Código de Vestimenta</h4>
            <p className={`text-xs uppercase tracking-[0.2em] font-sans font-bold ${estilo?.textoPrincipal || (esOscuro ? "text-white" : "text-[#3A332B]")}`}>
              {dressCode}
            </p>
          </div>
        </div>

        {conPaleta && paleta && paleta.length > 0 && (
          <div className={`space-y-2 pt-2 border-t ${borde} opacity-90`}>
            <p className={`text-[10px] uppercase tracking-[0.2em] font-sans ${acento} font-semibold`}>
              Paleta de Colores Sugerida:
            </p>
            <div className="flex items-center justify-between pt-1">
              {paleta.map((c, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-7 h-7 rounded-full shadow-xs border border-white/20" style={{ backgroundColor: c.hex }} />
                  <span className="text-[8px] font-sans text-current opacity-70">{c.nombre}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {notaDressCode && notaDressCode.trim() !== "" && (
          <div className={`p-3 ${esOscuro ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"} rounded-xl border text-[10px] font-sans flex items-center gap-2`}>
            <AlertCircle size={16} className={`${acento} shrink-0`} />
            <span className={estilo?.textoSecundario || ""}>{notaDressCode}</span>
          </div>
        )}
      </div>
    </section>
  );
};