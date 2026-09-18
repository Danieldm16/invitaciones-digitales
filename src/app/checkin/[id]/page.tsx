"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { EVENTOS } from '@/lib/eventos-config';
import { 
  CheckCircle2, AlertTriangle, Users, UtensilsCrossed, 
  Clock, XCircle, ArrowRight, RefreshCw, ShieldCheck 
} from 'lucide-react';
import { toast } from 'sonner';

function CheckInContent() {
  const params = useParams();
  const paseId = params.id as string;

  const [confirmacion, setConfirmacion] = useState<any>(null);
  const [evento, setEvento] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    cargarDatosCheckIn();
  }, [paseId]);

  const cargarDatosCheckIn = async () => {
    setLoading(true);

    const { data: confData, error } = await supabase
      .from('confirmaciones')
      .select('*')
      .eq('id', paseId)
      .single();

    if (confData && !error) {
      setConfirmacion(confData);

      // Buscar datos del evento
      const { data: evData } = await supabase
        .from('eventos')
        .select('*')
        .eq('id_supabase', confData.evento)
        .single();

      if (evData) {
        setEvento(evData);
      } else {
        // @ts-ignore
        const localEv = Object.values(EVENTOS).find((e: any) => e.id_supabase === confData.evento);
        setEvento(localEv || null);
      }
    }
    setLoading(false);
  };

  const registrarIngreso = async () => {
    setProcesando(true);
    const ahora = new Date().toISOString();

    const { error } = await supabase
      .from('confirmaciones')
      .update({ 
        ingresado: true, 
        ingresado_at: ahora 
      })
      .eq('id', paseId);

    if (!error) {
      setConfirmacion((prev: any) => ({
        ...prev,
        ingresado: true,
        ingresado_at: ahora
      }));
      toast.success("¡Ingreso registrado en el sistema!");
    } else {
      toast.error("Error al registrar el ingreso: " + error.message);
    }
    setProcesando(false);
  };

  const deshacerIngreso = async () => {
    const confirmar = confirm("¿Deseas reactivar este pase como no ingresado?");
    if (!confirmar) return;

    setProcesando(true);
    const { error } = await supabase
      .from('confirmaciones')
      .update({ 
        ingresado: false, 
        ingresado_at: null 
      })
      .eq('id', paseId);

    if (!error) {
      setConfirmacion((prev: any) => ({
        ...prev,
        ingresado: false,
        ingresado_at: null
      }));
      toast.info("Pase restablecido a no ingresado.");
    }
    setProcesando(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-[#D4A39E] rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold uppercase tracking-widest text-[#7A7267]">Escaneando boleto...</p>
      </div>
    );
  }

  if (!confirmacion) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
        <XCircle size={60} className="text-red-400 mb-4" />
        <h1 className="text-2xl font-black mb-2">Boleto Inválido</h1>
        <p className="text-xs text-slate-400 max-w-xs mb-6">Este código no existe en la base de datos o fue revocado.</p>
        <button onClick={cargarDatosCheckIn} className="px-6 py-3 bg-slate-800 rounded-xl text-xs font-bold uppercase">
          Volver a escanear
        </button>
      </div>
    );
  }

  const totalLugares = (Number(confirmacion.adultos) || 0) + (Number(confirmacion.ninos) || 0);
  const yaIngresado = confirmacion.ingresado;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2E2820] flex flex-col items-center justify-center p-4 md:p-8 font-sans antialiased">
      
      <div className="w-full max-w-md space-y-6">
        
        {/* Cabecera de Evento */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#EAE4D9] rounded-full text-[10px] uppercase font-bold text-[#8A8177] tracking-wider shadow-xs mb-1">
            <ShieldCheck size={13} className="text-[#8E9B8E]" />
            Control de Acceso • {evento?.nombre || "Evento Oficial"}
          </div>
          <p className="text-xs font-mono text-[#A89F91]">FOLIO #{String(confirmacion.id).padStart(4, '0')}</p>
        </div>

        {/* =========================================================
            CASO A: EL PASE ES VÁLIDO Y TODAVÍA NO INGRESA (VERDE)
        ========================================================= */}
        {!yaIngresado ? (
          <div className="bg-white rounded-3xl p-8 border-2 border-emerald-500/40 shadow-xl space-y-6 text-center">
            
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border-2 border-emerald-200 shadow-sm animate-bounce">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.3em] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                PASE VÁLIDO • LISTO PARA INGRESAR
              </span>
              <h2 className="text-3xl font-serif italic text-[#2E2820] pt-3 font-bold text-balance">
                {confirmacion.nombre}
              </h2>
            </div>

            {/* Cuadrícula de Datos Clave para la Hostess */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-4 bg-[#FAF9F6] border border-[#EAE4D9] rounded-2xl text-center space-y-1">
                <Users size={20} className="mx-auto text-[#D4A39E]" />
                <span className="text-[10px] uppercase font-bold text-[#8A8177] block">Lugares</span>
                <span className="text-2xl font-black text-[#2E2820] block">{totalLugares}</span>
                <span className="text-[9px] text-[#A89F91] block">
                  {confirmacion.adultos || 0} Ad. {confirmacion.ninos > 0 ? `• ${confirmacion.ninos} Niñ.` : ''}
                </span>
              </div>

              <div className="p-4 bg-[#FAF6EE] border-2 border-[#D4AF37]/40 rounded-2xl text-center space-y-1 shadow-inner">
                <UtensilsCrossed size={20} className="mx-auto text-[#C5A880]" />
                <span className="text-[10px] uppercase font-black text-[#7A623A] tracking-wider block">Mesa Asignada</span>
                <span className="text-2xl font-black text-[#2E2820] block">
                  {confirmacion.mesa ? confirmacion.mesa : "SIN MESA"}
                </span>
                <span className="text-[9px] text-[#8A6F48] block">
                  {confirmacion.mesa ? "Ubicación salón" : "Asignar en recepción"}
                </span>
              </div>
            </div>

            {confirmacion.alergias && (
              <div className="p-3.5 bg-amber-50/80 border border-amber-200/60 rounded-xl text-left text-xs text-amber-900 space-y-0.5">
                <span className="font-bold block text-[10px] uppercase tracking-wider text-amber-700">Notas / Menú Especial:</span>
                <p className="italic">{confirmacion.alergias}</p>
              </div>
            )}

            {/* BOTÓN GIGANTE DE REGISTRO */}
            <button
              onClick={registrarIngreso}
              disabled={procesando}
              className="w-full py-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-emerald-600/20 cursor-pointer flex items-center justify-center gap-2"
            >
              {procesando ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Registrando...</span>
                </>
              ) : (
                <>
                  <span>Marcar Ingreso al Salón</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

          </div>
        ) : (
          /* =========================================================
             CASO B: EL PASE YA HABÍA SIDO UTILIZADO (ALERTA ROJA)
          ========================================================= */
          <div className="bg-white rounded-3xl p-8 border-2 border-red-500/50 shadow-2xl space-y-6 text-center">
            
            <div className="w-16 h-16 mx-auto rounded-full bg-red-50 text-red-600 flex items-center justify-center border-2 border-red-200 shadow-sm">
              <AlertTriangle size={36} />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.25em] font-black text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                ⚠️ PASE YA UTILIZADO
              </span>
              <h2 className="text-2xl font-serif italic text-[#2E2820] pt-3 font-bold">
                {confirmacion.nombre}
              </h2>
              <p className="text-xs text-red-600 font-semibold pt-1">
                Este boleto ya ingresó anteriormente al evento.
              </p>
            </div>

            <div className="p-4 bg-red-50/50 border border-red-100 rounded-2xl space-y-2 text-xs text-[#554E45]">
              <div className="flex items-center justify-center gap-2 text-red-700 font-bold">
                <Clock size={15} />
                <span>
                  Hora de entrada: {confirmacion.ingresado_at ? new Date(confirmacion.ingresado_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Hoy'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Lugares registrados: <strong>{totalLugares} personas</strong> en <strong>{confirmacion.mesa || "Mesa general"}</strong>
              </p>
            </div>

            <button
              onClick={deshacerIngreso}
              disabled={procesando}
              className="text-xs text-slate-400 hover:text-slate-600 underline cursor-pointer font-medium"
            >
              ¿Error de la recepcionista? Reactivar pase
            </button>

          </div>
        )}

        <div className="text-center">
          <p className="text-[10px] text-[#A89F91] uppercase tracking-widest">
            Nuestra Invitación • Sistema de Recepción Digital
          </p>
        </div>

      </div>

    </div>
  );
}

export default function CheckInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center text-xs font-bold text-[#7A7267]">Cargando...</div>}>
      <CheckInContent />
    </Suspense>
  );
}