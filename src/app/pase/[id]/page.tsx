"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { EVENTOS, ESTILOS } from '@/lib/eventos-config';
import { 
  Users, MapPin, Calendar, Clock, CheckCircle2, 
  Share2, ArrowLeft, UtensilsCrossed 
} from 'lucide-react';

function PaseContent() {
  const params = useParams();
  const paseId = params.id as string;

  const [confirmacion, setConfirmacion] = useState<any>(null);
  const [evento, setEvento] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarPase() {
      setLoading(true);
      
      // 1. Obtener datos de la confirmación
      const { data: confData, error } = await supabase
        .from('confirmaciones')
        .select('*')
        .eq('id', paseId)
        .single();

      if (confData && !error) {
        setConfirmacion(confData);

        // 2. Obtener datos del evento asociado
        const { data: evData } = await supabase
          .from('eventos')
          .select('*')
          .eq('id_supabase', confData.evento)
          .single();

        if (evData) {
          setEvento(evData);
        } else {
          // Fallback al config estático si es de los eventos prueba
          // @ts-ignore
          const localEv = Object.values(EVENTOS).find((e: any) => e.id_supabase === confData.evento);
          setEvento(localEv || null);
        }
      }
      setLoading(false);
    }

    if (paseId) cargarPase();
  }, [paseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center font-serif italic text-sm text-[#7A7267]">
        Generando tu pase de acceso...
      </div>
    );
  }

  if (!confirmacion || !evento) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6 text-center font-sans">
        <div className="bg-white p-8 rounded-3xl border border-[#EAE4D9] shadow-sm max-w-sm space-y-3">
          <p className="text-4xl">🎟️</p>
          <h2 className="text-xl font-bold text-slate-800">Pase no encontrado</h2>
          <p className="text-xs text-slate-500">Este enlace es inválido o la confirmación fue eliminada.</p>
        </div>
      </div>
    );
  }

  const esOscuro = evento.estilo_visual === "black_tie" || evento.tema?.modoOscuro;
  const totalLugares = (Number(confirmacion.adultos) || 0) + (Number(confirmacion.ninos) || 0);
  
  // URL del QR que apunta a la validación de acceso
  const urlCheckIn = typeof window !== "undefined" 
    ? `${window.location.origin}/checkin/${confirmacion.id}` 
    : "";
  
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(urlCheckIn)}&color=${esOscuro ? "C5A880" : "2E2820"}&bgcolor=${esOscuro ? "181614" : "FFFFFF"}`;

  return (
    <div className={`min-h-screen ${esOscuro ? "bg-[#080808] text-[#F3EFE6]" : "bg-[#F7F4EE] text-[#2E2820]"} p-4 md:p-10 flex flex-col items-center justify-center font-serif antialiased selection:bg-[#C5A880] selection:text-white`}>
      
      <div className="w-full max-w-sm space-y-6">
        
        {/* Cabecera superior sutil */}
        <div className="text-center space-y-1">
          <span className={`text-[9px] uppercase tracking-[0.4em] font-sans font-bold ${esOscuro ? "text-[#D4AF37]" : "text-[#C5A880]"}`}>
            Pase Oficial de Recepción
          </span>
          <h1 className="text-3xl italic">{evento.nombre}</h1>
          <p className="text-[11px] font-sans uppercase tracking-widest opacity-60">{evento.titulo}</p>
        </div>

        {/* TARJETA DEL BOLETO / TICKET */}
        <div className={`relative rounded-3xl shadow-2xl border-2 overflow-hidden ${
          esOscuro 
            ? "bg-[#181614] border-[#D4AF37]/40 shadow-[0_0_50px_rgba(212,175,55,0.15)]" 
            : "bg-white border-[#D4AF37]/30 shadow-xl"
        }`}>
          
          {/* Muescas decorativas laterales (Troquelado) */}
          <div className={`absolute top-[62%] -left-3.5 w-7 h-7 rounded-full border-r ${esOscuro ? "bg-[#080808] border-[#D4AF37]/40" : "bg-[#F7F4EE] border-[#D4AF37]/30"}`} />
          <div className={`absolute top-[62%] -right-3.5 w-7 h-7 rounded-full border-l ${esOscuro ? "bg-[#080808] border-[#D4AF37]/40" : "bg-[#F7F4EE] border-[#D4AF37]/30"}`} />

          {/* PARTE SUPERIOR DEL BOLETO */}
          <div className="p-7 space-y-6 text-center">
            
            {/* Foto del festejado en círculo pequeño */}
            {evento.foto_hero && (
              <div className="w-20 h-20 mx-auto rounded-full p-1 border-2 border-[#D4AF37]/40 overflow-hidden shadow-md">
                <img src={evento.foto_hero} alt="Portada" className="w-full h-full object-cover rounded-full" />
              </div>
            )}

            {/* Nombre del invitado */}
            <div className="space-y-1 border-b border-[#EAE4D9]/20 pb-4">
              <span className={`text-[9px] uppercase tracking-[0.25em] font-sans font-bold block ${esOscuro ? "text-[#D4AF37]" : "text-[#7A7267]"}`}>
                Invitado de Honor
              </span>
              <h2 className="text-2xl font-serif italic text-balance font-semibold">
                {confirmacion.nombre}
              </h2>
            </div>

            {/* Lugares y Mesa Asignada (LA JOYA LOGÍSTICA) */}
            <div className="grid grid-cols-2 gap-3 py-2">
              <div className={`p-3.5 rounded-2xl border ${esOscuro ? "bg-[#100E0D] border-[#C5A880]/20" : "bg-[#FAF9F6] border-[#EAE4D9]"}`}>
                <Users size={18} className={`mx-auto mb-1 ${esOscuro ? "text-[#D4AF37]" : "text-[#C5A880]"}`} />
                <span className="text-[9px] uppercase tracking-wider font-sans opacity-60 block">Lugares</span>
                <span className="text-xl font-bold font-sans">
                  {totalLugares} {totalLugares === 1 ? 'Persona' : 'Personas'}
                </span>
                <span className="text-[9px] font-sans block opacity-50 mt-0.5">
                  {confirmacion.adultos || 0} Ad. {confirmacion.ninos > 0 ? `• ${confirmacion.ninos} Niñ.` : ''}
                </span>
              </div>

              <div className={`p-3.5 rounded-2xl border ${esOscuro ? "bg-[#221F1C] border-[#D4AF37]/40 shadow-inner" : "bg-[#FAF6EE] border-[#C5A880]/40"}`}>
                <UtensilsCrossed size={18} className={`mx-auto mb-1 ${esOscuro ? "text-[#D4AF37]" : "text-[#C5A880]"}`} />
                <span className={`text-[9px] uppercase tracking-wider font-sans font-bold block ${esOscuro ? "text-[#D4AF37]" : "text-[#7A623A]"}`}>
                  Mesa Asignada
                </span>
                <span className={`text-xl font-black font-sans ${esOscuro ? "text-white" : "text-[#2E2820]"}`}>
                  {confirmacion.mesa ? confirmacion.mesa : "POR ASIGNAR"}
                </span>
                <span className="text-[8px] font-sans block opacity-50 mt-0.5">
                  {confirmacion.mesa ? "Ubicación confirmada" : "Días previos al evento"}
                </span>
              </div>
            </div>

            {/* Datos de fecha y hora */}
            <div className="space-y-1 text-xs font-sans opacity-80 pt-1">
              <p className="font-semibold flex items-center justify-center gap-1.5">
                <Calendar size={13} className={esOscuro ? "text-[#D4AF37]" : "text-[#C5A880]"} />
                {evento.fecha} • {evento.hora}
              </p>
              <p className="flex items-center justify-center gap-1.5 text-[11px] opacity-70">
                <MapPin size={12} className={esOscuro ? "text-[#D4AF37]" : "text-[#C5A880]"} />
                {evento.lugar}
              </p>
            </div>

          </div>

          {/* LÍNEA DE TROQUELADO / PERFORACIÓN */}
          <div className="relative border-b-2 border-dashed border-[#C5A880]/30 my-0 mx-5" />

          {/* PARTE INFERIOR DEL BOLETO: CÓDIGO QR Y CONTROL */}
          <div className="p-6 pt-5 text-center space-y-3">
            <div className="inline-block p-3 rounded-2xl bg-white shadow-inner border border-[#EAE4D9]/40">
              <img src={qrCodeUrl} alt="Código QR de Acceso" className="w-36 h-36 mx-auto" />
            </div>

            <div className="space-y-0.5">
              <span className={`text-[8px] uppercase tracking-[0.3em] font-mono block ${esOscuro ? "text-[#D4AF37]" : "text-[#A89F91]"}`}>
                FOLIO: #{String(confirmacion.id).padStart(4, '0').toUpperCase()}
              </span>
              <p className="text-[10px] font-sans opacity-60">
                Presenta este código en la entrada del salón
              </p>
            </div>
          </div>

        </div>

        {/* ACCIONES AL FINAL DE LA PANTALLA */}
        <div className="text-center space-y-3 pt-2 font-sans">
          <button
            onClick={() => window.print()}
            className={`w-full py-4 rounded-2xl font-bold uppercase text-xs tracking-widest transition-all shadow-md active:scale-95 cursor-pointer ${
              esOscuro 
                ? "bg-[#D4AF37] text-black hover:bg-[#C5A880]" 
                : "bg-[#2E2820] text-white hover:bg-black"
            }`}
          >
            📥 Guardar / Tomar Captura
          </button>

          <p className="text-[10px] opacity-50 italic">
            Tip: Puedes tomar una captura de pantalla a este boleto para tenerlo listo sin internet.
          </p>
        </div>

      </div>

    </div>
  );
}

export default function PasePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center text-sm font-serif italic text-[#7A7267]">Cargando...</div>}>
      <PaseContent />
    </Suspense>
  );
}