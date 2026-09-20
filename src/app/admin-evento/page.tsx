"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { EVENTOS } from '@/lib/eventos-config';
import { 
  Users, Utensils, Baby, Download, RefreshCw, 
  Search, Link as LinkIcon, Check, MessageSquare, 
  AlertCircle, Sparkles, ExternalLink, Heart 
} from 'lucide-react';

function AdminContent() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('id') || Object.keys(EVENTOS)[0];

  const [eventoData, setEventoData] = useState<any>(null);
  const [cargandoEvento, setCargandoEvento] = useState(true);
  const [confirmados, setConfirmados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  // Generador de Enlaces
  const [invitadoNombre, setInvitadoNombre] = useState("");
  const [invitadoPases, setInvitadoPases] = useState(2);
  const [modeloSeleccionado, setModeloSeleccionado] = useState("avanzada");
  const [estiloSeleccionado, setEstiloSeleccionado] = useState("crema_lujo");
  const [copiado, setCopiado] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
  }, []);

  useEffect(() => {
    async function cargarDatosEvento() {
      setCargandoEvento(true);
      const { data: dbData } = await supabase
        .from('eventos')
        .select('*')
        .eq('slug', eventId)
        .single();

      if (dbData) {
        setEventoData({
          ...dbData,
          id_supabase: dbData.id_supabase || dbData.slug,
          plan: dbData.plan || "avanzada",
        });
        setModeloSeleccionado(dbData.plan || "avanzada");
        setEstiloSeleccionado(dbData.estilo_visual || "crema_lujo");
      } else {
        // @ts-ignore
        const configLocal = EVENTOS[eventId];
        if (configLocal) {
          setEventoData(configLocal);
          setModeloSeleccionado("avanzada");
        }
      }
      setCargandoEvento(false);
    }

    if (eventId) cargarDatosEvento();
  }, [eventId]);

  useEffect(() => {
    if (eventoData) fetchConfirmados();
  }, [eventoData]);

  async function fetchConfirmados() {
    setLoading(true);
    const { data: res, error } = await supabase
      .from('confirmaciones')
      .select('*')
      .eq('evento', eventoData?.id_supabase || eventId)
      .order('created_at', { ascending: false });

    if (!error) setConfirmados(res || []);
    setLoading(false);
  }

  if (cargandoEvento) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6 text-sm font-serif italic text-[#7A7267]">
        Cargando panel de gestión...
      </div>
    );
  }

  if (!eventoData) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md border border-[#EAE4D9]">
          <AlertCircle className="mx-auto text-[#D4A39E] mb-4" size={40} />
          <h2 className="text-xl font-serif italic text-[#2E2820] mb-2">Evento no encontrado</h2>
          <p className="text-xs text-[#7A7267] mb-6">Asegúrate de poner el ID o slug correcto en la URL.</p>
          <a href="/admin" className="px-6 py-3 bg-[#2E2820] text-white rounded-xl font-bold text-xs uppercase tracking-wider">
            Ir al Dashboard General
          </a>
        </div>
      </div>
    );
  }

  const totalAdultos = confirmados.reduce((acc, inv) => acc + (Number(inv.adultos) || 0), 0);
  const totalNinos = confirmados.reduce((acc, inv) => acc + (Number(inv.ninos) || 0), 0);
  const totalPersonas = totalAdultos + totalNinos;

  const listaFiltrada = confirmados.filter(inv => 
    inv.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    inv.alergias?.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Solo necesitamos el pase y el nombre del invitado
  const paramsLink = new URLSearchParams();
  paramsLink.set("p", invitadoPases.toString());
  if (invitadoNombre.trim()) {
    paramsLink.set("invitado", invitadoNombre.trim());
  }

  // El plan ya viene del evento (o 'avanzada' por defecto)
  const modeloFinal = eventoData.plan || "avanzada";
  const urlInvitacionGenerada = `${baseUrl}/invitacion/${modeloFinal}/${eventoData.slug || eventId}?${paramsLink.toString()}`;

  const copiarEnlace = () => {
    navigator.clipboard.writeText(urlInvitacionGenerada);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const enviarWhatsAppInvitado = () => {
    const textoMensaje = encodeURIComponent(
      `¡Hola ${invitadoNombre || ""}! Nos hace mucha ilusión invitarte a nuestro evento. Aquí tienes tu pase digital:\n\n${urlInvitacionGenerada}\n\n¡Por favor confírmanos tu lugar!`
    );
    window.open(`https://wa.me/?text=${textoMensaje}`, "_blank");
  };

  const exportarExcel = () => {
    if (confirmados.length === 0) return;
    const encabezados = ["Invitado", "Adultos", "Niños", "Total Personas", "Detalles / Alergias / Música", "Fecha Registro"];
    const filas = confirmados.map(inv => [
      `"${(inv.nombre || '').replace(/"/g, '""')}"`,
      inv.adultos || 0,
      inv.ninos || 0,
      (Number(inv.adultos) || 0) + (Number(inv.ninos) || 0),
      `"${(inv.alergias || '').replace(/"/g, '""')}"`,
      inv.created_at ? new Date(inv.created_at).toLocaleString() : ''
    ]);
    const csvString = "\uFEFF" + [encabezados.join(","), ...filas.map(f => f.join(","))].join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `lista_invitados_${eventId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const actualizarMesaInvitado = async (id: string, nuevaMesa: string) => {
    const { error } = await supabase
      .from('confirmaciones')
      .update({ mesa: nuevaMesa.trim() })
      .eq('id', id);

    if (!error) {
      setConfirmados(prev => prev.map(inv => inv.id === id ? { ...inv, mesa: nuevaMesa.trim() } : inv));
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2E2820] p-4 md:p-10 font-sans antialiased">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Cabecera de Marca */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 md:p-8 rounded-3xl border border-[#EAE4D9] shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAF4F0] border border-[#D4A39E]/30 rounded-full text-[#D4A39E] text-[11px] font-bold uppercase tracking-wider mb-2">
              <Sparkles size={13} /> Gestión de Invitados
            </div>
            <h1 className="text-3xl md:text-4xl font-serif italic text-[#2E2820]">
              {eventoData.nombre}
            </h1>
            <p className="text-xs text-[#7A7267] mt-1 font-medium">
              {eventoData.titulo} • Plan: <span className="uppercase font-bold text-[#D4A39E]">{eventoData.plan || "Avanzada"}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={fetchConfirmados}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#FAF9F6] hover:bg-[#F2EFE9] border border-[#EAE4D9] rounded-xl text-xs font-bold text-[#554E45] transition-colors cursor-pointer"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              Actualizar
            </button>

            <button
              onClick={exportarExcel}
              disabled={confirmados.length === 0}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md active:scale-95 cursor-pointer ${
                confirmados.length === 0 ? "bg-slate-300 cursor-not-allowed" : "bg-[#8E9B8E] hover:bg-[#7D8B7D] shadow-[#8E9B8E]/20"
              }`}
            >
              <Download size={15} />
              Descargar Excel
            </button>
          </div>
        </div>

        {/* Tarjetas de Métricas (Paleta del Logo) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-[#EAE4D9] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF4F0] text-[#D4A39E] flex items-center justify-center">
              <Users size={22} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-[#A89F91] tracking-wider">Total Personas</p>
              <p className="text-3xl font-serif font-bold text-[#2E2820]">{totalPersonas}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#EAE4D9] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F4F6F4] text-[#8E9B8E] flex items-center justify-center">
              <Users size={22} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-[#A89F91] tracking-wider">Adultos</p>
              <p className="text-3xl font-serif font-bold text-[#2E2820]">{totalAdultos}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#EAE4D9] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF4F0] text-[#D4A39E] flex items-center justify-center">
              <Baby size={22} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-[#A89F91] tracking-wider">Niños</p>
              <p className="text-3xl font-serif font-bold text-[#2E2820]">{totalNinos}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#EAE4D9] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF6EE] text-[#C5A880] flex items-center justify-center">
              <Utensils size={22} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-[#A89F91] tracking-wider">Familias / Grupos</p>
              <p className="text-3xl font-serif font-bold text-[#2E2820]">{confirmados.length}</p>
            </div>
          </div>
        </div>

        {/* Generador de Enlaces */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#EAE4D9] shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF4F0] text-[#D4A39E] flex items-center justify-center">
              <LinkIcon size={18} />
            </div>
            <div>
              <h2 className="text-base font-serif italic text-[#2E2820] text-lg font-bold">Crear Pase para Invitado</h2>
              <p className="text-xs text-[#7A7267]">Genera el enlace personalizado con el número exacto de pases para enviar por WhatsApp.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Nombre o Familia */}
            <div>
              <label className="text-[10px] font-bold uppercase text-[#8A8177] tracking-wider block mb-1">
                Familia o Invitado
              </label>
              <input
                value={invitadoNombre}
                onChange={(e) => setInvitadoNombre(e.target.value)}
                placeholder="Ej. Familia Martínez o Lic. Roberto García"
                className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#EAE4D9] rounded-xl text-xs text-[#2E2820] outline-none focus:border-[#D4A39E]"
              />
            </div>

            {/* 2. Número de pases */}
            <div>
              <label className="text-[10px] font-bold uppercase text-[#8A8177] tracking-wider block mb-1">
                Pases Reservados
              </label>
              <select
                value={invitadoPases}
                onChange={(e) => setInvitadoPases(parseInt(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#EAE4D9] rounded-xl text-xs text-[#2E2820] outline-none focus:border-[#D4A39E] cursor-pointer font-bold text-[#2E2820]"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 10].map(n => (
                  <option key={n} value={n}>{n} {n === 1 ? 'Pase Personal' : 'Pases'}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <input 
              readOnly
              value={urlInvitacionGenerada}
              className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#EAE4D9] rounded-xl text-xs font-mono text-[#554E45] select-all"
            />

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                onClick={copiarEnlace}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-3 bg-[#2E2820] hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer uppercase tracking-wider"
              >
                {copiado ? <Check size={15} /> : <LinkIcon size={15} />}
                {copiado ? "¡Copiado!" : "Copiar"}
              </button>

              <button
                onClick={enviarWhatsAppInvitado}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer uppercase tracking-wider"
              >
                <MessageSquare size={15} />
                WhatsApp
              </button>

              <a
                href={urlInvitacionGenerada}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-[#FAF9F6] hover:bg-[#F2EFE9] border border-[#EAE4D9] text-[#554E45] rounded-xl transition-colors"
                title="Abrir vista previa"
              >
                <ExternalLink size={15} />
              </a>
            </div>
          </div>
        </div>

        {/* Tabla de Confirmados */}
        <div className="bg-white rounded-3xl border border-[#EAE4D9] shadow-xs overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-serif italic text-[#2E2820]">Lista Oficial de Asistencia</h3>
              <p className="text-xs text-[#8A8177]">Respuestas en tiempo real registradas por los invitados.</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A89F91]" size={15} />
              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre o nota..."
                className="w-full pl-9 pr-4 py-2 bg-[#FAF9F6] border border-[#EAE4D9] rounded-xl text-xs text-[#2E2820] outline-none focus:border-[#D4A39E]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF9F6] border-y border-[#EAE4D9] text-[10px] uppercase tracking-wider font-bold text-[#8A8177]">
                  <th className="p-4">Invitado / Familia</th>
                  <th className="p-4 text-center">Lugares</th>
                  <th className="p-4 text-center">Mesa Asignada</th>
                  <th className="p-4">Menú Especial / Alergias / Canción</th>
                  <th className="p-4 text-right">Fecha Registro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2EFE9] text-sm">
                {listaFiltrada.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#FAF9F6]/80 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-[#2E2820]">{inv.nombre}</p>
                      <p className="text-[10px] text-[#A89F91] font-mono">ID: {inv.id.toString().slice(0, 8)}</p>
                    </td>

                    <td className="p-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6EE] text-[#7A623A] border border-[#E5D7C0] text-xs font-bold font-sans">
                        <span>{inv.adultos || 0} Ad.</span>
                        {inv.ninos > 0 && <span className="text-[#D4A39E] font-semibold">• {inv.ninos} Niñ.</span>}
                      </span>
                    </td>

                    {/* CAMPO EDITABLE DE MESA EN TIEMPO REAL */}
                    <td className="p-4 text-center">
                      <input
                        defaultValue={inv.mesa || ""}
                        onBlur={(e) => actualizarMesaInvitado(inv.id, e.target.value)}
                        placeholder="Ej: Mesa 4"
                        className="w-24 px-2.5 py-1.5 text-center text-xs font-bold bg-[#FAF9F6] border border-[#EAE4D9] rounded-xl outline-none focus:border-[#D4A39E] text-[#2E2820]"
                      />
                    </td>

                    <td className="p-4 text-xs text-[#554E45] max-w-sm">
                      {inv.alergias ? (
                        <span className="inline-block bg-[#FAF6EE] border border-[#E5D7C0] text-[#7A623A] px-2.5 py-1 rounded-lg">
                          {inv.alergias}
                        </span>
                      ) : (
                        <span className="text-[#C5BDB2] italic">Sin notas especiales</span>
                      )}
                    </td>

                    {/* BOTÓN PARA VER / REENVIAR PASE */}
                    <td className="p-4 text-right">
                      <a
                        href={`/pase/${inv.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#FAF9F6] hover:bg-[#FAF4F0] border border-[#EAE4D9] text-[#554E45] hover:text-[#D4A39E] rounded-xl text-xs font-bold transition-colors"
                        title="Ver Pase Digital"
                      >
                        <span>Pase</span>
                        <span className="text-[10px]">↗</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {confirmados.length === 0 && !loading && (
              <div className="p-16 text-center text-[#A89F91] font-serif italic text-sm">
                Aún no hay confirmaciones registradas para este evento.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center text-sm font-serif italic text-[#7A7267]">Cargando panel...</div>}>
      <AdminContent />
    </Suspense>
  );
}