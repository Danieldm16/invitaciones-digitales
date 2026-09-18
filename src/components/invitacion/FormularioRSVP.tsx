"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Music2, CheckCircle2, Ticket, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const FormularioRSVP = ({ 
  idSupabase, 
  pasesTotales = 2, 
  nombreInvitado = "", 
  esOscuro = false 
}: { 
  idSupabase: string, 
  pasesTotales?: number, 
  nombreInvitado?: string, 
  esOscuro?: boolean 
}) => {
  const [adultos, setAdultos] = useState(Math.min(2, pasesTotales));
  const [ninos, setNinos] = useState(0);
  const [enviado, setEnviado] = useState(false);
  const [paseId, setPaseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorCupo, setErrorCupo] = useState("");

  const totalAsistentes = adultos + ninos;
  const cupoExcedido = totalAsistentes > pasesTotales;

  const handleRSVP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cupoExcedido) {
      setErrorCupo(`El cupo máximo es de ${pasesTotales} pases.`);
      return;
    }
    setErrorCupo("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const nombre = formData.get('nombre')?.toString().trim();
    const alergias = formData.get('alergias')?.toString().trim();
    const cancion = formData.get('cancion')?.toString().trim();

    const payload = {
      nombre,
      adultos,
      ninos,
      alergias: `Dieta/Alergias: ${alergias || 'Ninguna'} | Canción: ${cancion || 'N/A'}`,
      evento: idSupabase
    };

    // Guardamos y recuperamos el ID generado
    const { data, error } = await supabase
      .from('confirmaciones')
      .insert([payload])
      .select('id')
      .single();

    if (!error && data) {
      setPaseId(data.id);
      setEnviado(true);
      toast.success("¡Asistencia confirmada con éxito!");
    } else {
      console.error("Error al registrar en Supabase:", error);
      toast.error("Hubo un problema de conexión al registrar tu asistencia. Intenta de nuevo.");
    }
    setLoading(false);
  };

  return (
    <section className="px-6 pt-6 pb-20">
      <div className={`${esOscuro ? "bg-[#181614] border-[#D4AF37]/45 shadow-[0_0_40px_rgba(212,175,55,0.12)]" : "bg-white border-[#D4AF37]/40 shadow-xl"} rounded-3xl p-8 border-2 space-y-6`}>
        
        <div className="text-center space-y-2">
          <span className={`text-xs uppercase tracking-[0.3em] ${esOscuro ? "text-[#D4AF37]" : "text-[#C5A880]"} font-sans font-bold`}>R.S.V.P.</span>
          <h3 className={`text-3xl italic ${esOscuro ? "text-[#FAF8F5]" : "text-[#2E2820]"}`}>Confirmación de Asistencia</h3>
          
          <div className={`inline-block px-4 py-1.5 ${esOscuro ? "bg-[#221F1C] border-[#C5A880]/40 text-[#EADBB6]" : "bg-[#FAF6EE] border-[#C5A880]/40 text-[#7A623A]"} rounded-full border text-xs font-sans`}>
            <Users size={14} className={`inline mr-1 ${esOscuro ? "text-[#D4AF37]" : "text-[#C5A880]"}`} />
            Hemos reservado <strong>{pasesTotales} {pasesTotales === 1 ? 'pase' : 'pases'}</strong> para ti
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!enviado ? (
            <form onSubmit={handleRSVP} className="space-y-5 pt-2">
              <div className="space-y-1">
                <label className={`text-[10px] uppercase tracking-[0.2em] font-sans font-bold ${esOscuro ? "text-[#C5A880]" : "text-[#7A7267]"}`}>
                  Nombre completo o Familia *
                </label>
                <input
                  required
                  name="nombre"
                  defaultValue={nombreInvitado ? nombreInvitado.replace('+', ' ') : ""}
                  placeholder="Ej. Familia Rodríguez o Juan Pérez"
                  className={`w-full px-4 py-3 ${esOscuro ? "bg-[#0E0E0E] border-[#C5A880]/30 text-white" : "bg-[#FAF8F5] border-[#EAE2D5] text-[#33302C]"} border rounded-xl text-sm font-sans outline-none focus:border-[#C5A880] transition-colors`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={`text-[10px] uppercase tracking-[0.2em] font-sans font-bold ${esOscuro ? "text-[#C5A880]" : "text-[#7A7267]"}`}>
                    Adultos
                  </label>
                  <select
                    value={adultos}
                    onChange={(e) => setAdultos(parseInt(e.target.value))}
                    className={`w-full px-3 py-3 ${esOscuro ? "bg-[#0E0E0E] border-[#C5A880]/30 text-white" : "bg-[#FAF8F5] border-[#EAE2D5] text-[#33302C]"} border rounded-xl text-sm font-sans outline-none cursor-pointer`}
                  >
                    {[...Array(pasesTotales + 1)].map((_, i) => (
                      <option key={i} value={i} className={esOscuro ? "bg-[#141414] text-white" : ""}>
                        {i} {i === 1 ? 'Adulto' : 'Adultos'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className={`text-[10px] uppercase tracking-[0.2em] font-sans font-bold ${esOscuro ? "text-[#C5A880]" : "text-[#7A7267]"}`}>
                    Niños
                  </label>
                  <select
                    value={ninos}
                    onChange={(e) => setNinos(parseInt(e.target.value))}
                    className={`w-full px-3 py-3 ${esOscuro ? "bg-[#0E0E0E] border-[#C5A880]/30 text-white" : "bg-[#FAF8F5] border-[#EAE2D5] text-[#33302C]"} border rounded-xl text-sm font-sans outline-none cursor-pointer`}
                  >
                    {[...Array(pasesTotales + 1)].map((_, i) => (
                      <option key={i} value={i} className={esOscuro ? "bg-[#141414] text-white" : ""}>
                        {i} {i === 1 ? 'Niño' : 'Niños'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {cupoExcedido && (
                <p className="text-xs text-red-500 font-sans font-semibold">
                  ⚠️ Seleccionaste {totalAsistentes} lugares y tu cupo es de {pasesTotales}.
                </p>
              )}

              <div className="space-y-1">
                <label className={`text-[10px] uppercase tracking-[0.2em] font-sans font-bold ${esOscuro ? "text-[#C5A880]" : "text-[#7A7267]"}`}>
                  Alergias o dieta especial
                </label>
                <input
                  name="alergias"
                  placeholder="Ej. Vegetariano, intolerancia a lácteos..."
                  className={`w-full px-4 py-3 ${esOscuro ? "bg-[#0E0E0E] border-[#C5A880]/30 text-white" : "bg-[#FAF8F5] border-[#EAE2D5] text-[#33302C]"} border rounded-xl text-sm font-sans outline-none focus:border-[#C5A880] transition-colors`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-[10px] uppercase tracking-[0.2em] font-sans font-bold ${esOscuro ? "text-[#C5A880]" : "text-[#7A7267]"} flex items-center gap-1`}>
                  <Music2 size={12} className={esOscuro ? "text-[#D4AF37]" : "text-[#C5A880]"} />
                  ¿Qué canción no puede faltar en la fiesta?
                </label>
                <input
                  name="cancion"
                  placeholder="Ej. Vivir mi vida - Marc Anthony"
                  className={`w-full px-4 py-3 ${esOscuro ? "bg-[#0E0E0E] border-[#C5A880]/30 text-white" : "bg-[#FAF8F5] border-[#EAE2D5] text-[#33302C]"} border rounded-xl text-sm font-sans outline-none focus:border-[#C5A880] transition-colors`}
                />
              </div>

              <button
                type="submit"
                disabled={loading || cupoExcedido || totalAsistentes === 0}
                className={`w-full py-4 rounded-full font-sans text-xs uppercase tracking-[0.25em] font-bold transition-all shadow-md active:scale-95 cursor-pointer ${
                  cupoExcedido || totalAsistentes === 0
                    ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                    : esOscuro
                    ? "bg-gradient-to-r from-[#C5A880] via-[#D4AF37] to-[#B89B5E] text-black hover:opacity-95"
                    : "bg-[#2E2820] text-white hover:bg-[#1A1816]"
                }`}
              >
                {loading ? "Guardando en lista..." : "Enviar Confirmación Oficial"}
              </button>

              <p className={`text-[9px] text-center ${esOscuro ? "text-[#A89F91]" : "text-[#9E9485]"} font-sans`}>
                Tus datos se enviarán directamente a la lista de invitados de los novios.
              </p>
            </form>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center space-y-5">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border-2 border-emerald-200 shadow-sm">
                <CheckCircle2 size={36} />
              </div>
              <div className="space-y-1">
                <h4 className={`text-3xl italic ${esOscuro ? "text-[#FAF8F5]" : "text-[#2E2820]"}`}>¡Lugar Confirmado!</h4>
                <p className={`text-xs ${esOscuro ? "text-[#D9CEBA]" : "text-[#7A7267]"} font-sans max-w-xs mx-auto leading-relaxed`}>
                  Hemos reservado tus lugares. Ya puedes consultar y guardar tu pase de acceso oficial para el evento.
                </p>
              </div>

              {/* BOTÓN PARA ABRIR SU PASE DIGITAL */}
              {paseId && (
                <div className="pt-3">
                  <a
                    href={`/pase/${paseId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
                      esOscuro
                        ? "bg-[#D4AF37] text-black hover:bg-[#C5A880] shadow-[0_0_25px_rgba(212,175,55,0.3)]"
                        : "bg-[#2E2820] hover:bg-black text-white"
                    }`}
                  >
                    <Ticket size={16} />
                    <span>Ver Mi Pase Digital</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};