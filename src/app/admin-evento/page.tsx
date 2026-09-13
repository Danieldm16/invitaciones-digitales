"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { EVENTOS, ESTILOS } from '@/lib/eventos-config';
import { 
  Users, Utensils, Baby, Download, RefreshCw, 
  Search, Link as LinkIcon, Check, MessageSquare, 
  Music, AlertCircle, Sparkles, ExternalLink
} from 'lucide-react';

function AdminContent() {
  const searchParams = useSearchParams();
  // Busca el evento o toma el primero disponible por defecto
  const eventId = searchParams.get('id') || Object.keys(EVENTOS)[0];
  
  // @ts-ignore
  const data = EVENTOS[eventId];

  const [confirmados, setConfirmados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  // Estados del Generador de Enlaces
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
    if (data) fetchConfirmados();
  }, [data]);

  async function fetchConfirmados() {
    setLoading(true);
    const { data: res, error } = await supabase
      .from('confirmaciones')
      .select('*')
      .eq('evento', data?.id_supabase)
      .order('created_at', { ascending: false });

    if (!error) setConfirmados(res || []);
    setLoading(false);
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md border border-slate-100">
          <AlertCircle className="mx-auto text-amber-500 mb-4" size={40} />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Evento no encontrado</h2>
          <p className="text-sm text-slate-500 mb-6">
            Asegúrate de poner el ID correcto en la URL, por ejemplo:
          </p>
          <code className="bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-700 block mb-6">
            ?id={Object.keys(EVENTOS)[0]}
          </code>
          <a href={`/admin-evento?id=${Object.keys(EVENTOS)[0]}`} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-wider">
            Cargar evento por defecto
          </a>
        </div>
      </div>
    );
  }

  // Cálculos de resumen
  const totalAdultos = confirmados.reduce((acc, inv) => acc + (Number(inv.adultos) || 0), 0);
  const totalNinos = confirmados.reduce((acc, inv) => acc + (Number(inv.ninos) || 0), 0);
  const totalPersonas = totalAdultos + totalNinos;

  // Filtrado de lista por buscador
  const listaFiltrada = confirmados.filter(inv => 
    inv.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    inv.alergias?.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Construcción del enlace personalizado para el invitado
  const paramsLink = new URLSearchParams();
  paramsLink.set("p", invitadoPases.toString());
  if (invitadoNombre.trim()) {
    paramsLink.set("invitado", invitadoNombre.trim());
  }
  if (data.tipo === "boda") {
    paramsLink.set("estilo", estiloSeleccionado);
  }

  const urlInvitacionGenerada = `${baseUrl}/invitacion/${modeloSeleccionado}/${eventId}?${paramsLink.toString()}`;

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

  // Exportar lista oficial a archivo CSV (Excel)
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 p-4 md:p-10 font-sans antialiased">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* ============================================================
            1. HEADER DEL PANEL
        ============================================================ */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 text-[11px] font-bold uppercase tracking-wider mb-2">
              <Sparkles size={13} /> Panel de Gestión
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
              {data.nombre}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Evento: <strong className="text-slate-700">{data.titulo}</strong> • ID: <code className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">{data.id_supabase}</code>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={fetchConfirmados}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors cursor-pointer"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Actualizar
            </button>

            <button
              onClick={exportarExcel}
              disabled={confirmados.length === 0}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md active:scale-95 cursor-pointer ${
                confirmados.length === 0 ? "bg-slate-300 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
              }`}
            >
              <Download size={16} />
              Descargar Excel
            </button>
          </div>
        </div>

        {/* ============================================================
            2. TARJETAS DE MÉTRICAS (KPIs)
        ============================================================ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users size={24} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Personas</p>
              <p className="text-3xl font-black text-slate-900">{totalPersonas}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={24} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Adultos</p>
              <p className="text-3xl font-black text-slate-900">{totalAdultos}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center">
              <Baby size={24} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Niños</p>
              <p className="text-3xl font-black text-slate-900">{totalNinos}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Utensils size={24} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Familias / Grupos</p>
              <p className="text-3xl font-black text-slate-900">{confirmados.length}</p>
            </div>
          </div>
        </div>

        {/* ============================================================
            3. GENERADOR DE ENLACES PERSONALIZADOS PARA INVITADOS
        ============================================================ */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <LinkIcon size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Generar Enlace Personalizado</h2>
              <p className="text-xs text-slate-500">Crea un link único con el nombre del invitado y su cupo de pases.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1">Nombre o Familia</label>
              <input
                value={invitadoNombre}
                onChange={(e) => setInvitadoNombre(e.target.value)}
                placeholder="Ej. Familia Martínez"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1">Pases Asignados</label>
              <select
                value={invitadoPases}
                onChange={(e) => setInvitadoPases(parseInt(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-indigo-500 cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 10].map(n => (
                  <option key={n} value={n}>{n} {n === 1 ? 'Pase' : 'Pases'}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1">Modelo / Plan</label>
              <select
                value={modeloSeleccionado}
                onChange={(e) => setModeloSeleccionado(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="avanzada">Avanzada ($1,490)</option>
                <option value="moderada">Moderada ($950)</option>
                <option value="basica">Básica ($590)</option>
              </select>
            </div>

            {data.tipo === "boda" && (
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1">Estilo Visual</label>
                <select
                  value={estiloSeleccionado}
                  onChange={(e) => setEstiloSeleccionado(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="crema_lujo">📜 Crema Artesanal</option>
                  <option value="black_tie">🖤 Black Tie Gala</option>
                </select>
              </div>
            )}
          </div>

          {/* Barra de link generado y botones de acción */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <input 
              readOnly
              value={urlInvitacionGenerada}
              className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono text-slate-600 select-all"
            />

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                onClick={copiarEnlace}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                {copiado ? <Check size={16} /> : <LinkIcon size={16} />}
                {copiado ? "¡Copiado!" : "Copiar"}
              </button>

              <button
                onClick={enviarWhatsAppInvitado}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <MessageSquare size={16} />
                WhatsApp
              </button>

              <a
                href={urlInvitacionGenerada}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                title="Abrir vista previa"
              >
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* ============================================================
            4. TABLA OFICIAL DE CONFIRMADOS
        ============================================================ */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4 p-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Lista Oficial de Asistencia</h3>
              <p className="text-xs text-slate-400">Confirmaciones recibidas en tiempo real desde Supabase.</p>
            </div>

            {/* Buscador */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar invitado o nota..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-100 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                  <th className="p-4">Invitado / Familia</th>
                  <th className="p-4 text-center">Lugares</th>
                  <th className="p-4">Menú Especial / Alergias / Canción</th>
                  <th className="p-4 text-right">Fecha Registro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {listaFiltrada.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-slate-800">{inv.nombre}</p>
                      <p className="text-[11px] text-slate-400">ID: {inv.id.toString().slice(0, 8)}</p>
                    </td>

                    <td className="p-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                        <span>{inv.adultos || 0} Ad.</span>
                        {inv.ninos > 0 && <span className="text-pink-600 font-semibold">• {inv.ninos} Niñ.</span>}
                      </span>
                    </td>

                    <td className="p-4 text-xs text-slate-600 max-w-sm">
                      {inv.alergias ? (
                        <span className="inline-block bg-amber-50/80 border border-amber-200/60 text-amber-900 px-2.5 py-1 rounded-lg">
                          {inv.alergias}
                        </span>
                      ) : (
                        <span className="text-slate-300 italic">Sin notas especiales</span>
                      )}
                    </td>

                    <td className="p-4 text-right text-xs text-slate-400 font-mono">
                      {inv.created_at ? new Date(inv.created_at).toLocaleDateString() : 'Reciente'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {confirmados.length === 0 && !loading && (
              <div className="p-16 text-center text-slate-400 italic text-sm">
                Aún no hay confirmaciones registradas para este evento.
              </div>
            )}

            {confirmados.length > 0 && listaFiltrada.length === 0 && (
              <div className="p-12 text-center text-slate-400 italic text-sm">
                No se encontraron invitados que coincidan con "{busqueda}".
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
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm font-bold text-slate-400">Cargando panel...</div>}>
      <AdminContent />
    </Suspense>
  );
}