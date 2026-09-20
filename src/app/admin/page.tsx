"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { 
  Plus, Calendar, Eye, Power, Trash2, 
  ExternalLink, Sparkles, RefreshCw, Edit2, Search, Filter
} from 'lucide-react';

export default function AdminDashboard() {
  const [eventos, setEventos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados del Buscador y Filtros
  const [busqueda, setBusqueda] = useState("");
  const [filtroPlan, setFiltroPlan] = useState("todos");
  const [filtroEstado, setFiltroEstado] = useState("todos");

  useEffect(() => {
    cargarEventos();
  }, []);

  const cargarEventos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('eventos')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) {
      setEventos(data || []);
    } else {
      toast.error("Error al cargar los eventos de la base de datos.");
    }
    setLoading(false);
  };

  const toggleActivo = async (id: string, estadoActual: boolean, nombre: string) => {
    const nuevoEstado = !estadoActual;
    const { error } = await supabase
      .from('eventos')
      .update({ activo: nuevoEstado })
      .eq('id', id);

    if (!error) {
      setEventos(prev => prev.map(ev => ev.id === id ? { ...ev, activo: nuevoEstado } : ev));
      if (nuevoEstado) {
        toast.success(`La invitación de "${nombre}" ahora está Activa.`);
      } else {
        toast.warning(`La invitación de "${nombre}" ha sido Pausada.`);
      }
    } else {
      toast.error("No se pudo cambiar el estado del evento.");
    }
  };

  const eliminarEvento = async (id: string, nombre: string) => {
    const confirmar = confirm(`¿Estás seguro de eliminar la invitación de "${nombre}"?`);
    if (!confirmar) return;

    const { error } = await supabase
      .from('eventos')
      .delete()
      .eq('id', id);

    if (!error) {
      setEventos(prev => prev.filter(ev => ev.id !== id));
      toast.success(`Invitación de "${nombre}" eliminada correctamente.`);
    } else {
      toast.error("Error al eliminar la invitación.");
    }
  };

  // Lógica de Filtrado Multicriterio
  const eventosFiltrados = eventos.filter((ev) => {
    const coincideTexto = 
      ev.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      ev.slug?.toLowerCase().includes(busqueda.toLowerCase()) ||
      ev.lugar?.toLowerCase().includes(busqueda.toLowerCase());

    const coincidePlan = filtroPlan === "todos" || (ev.plan || "avanzada") === filtroPlan;
    const coincideEstado = filtroEstado === "todos" || (filtroEstado === "activas" ? ev.activo : !ev.activo);

    return coincideTexto && coincidePlan && coincideEstado;
  });

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2E2820] p-6 md:p-12 font-sans antialiased">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Cabecera */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-3xl border border-[#EAE4D9] shadow-xs">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAF4F0] border border-[#D4A39E]/30 rounded-full text-[#D4A39E] text-[11px] font-bold uppercase tracking-wider mb-2">
              <Sparkles size={13} /> Backoffice Interno
            </div>
            <h1 className="text-3xl md:text-4xl font-serif italic text-[#2E2820]">Control de Invitaciones</h1>
            <p className="text-xs text-[#7A7267] mt-1 font-medium">Gestiona los eventos activos, estados y accesos del equipo.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                cargarEventos();
                toast.info("Actualizando lista de eventos...");
              }}
              disabled={loading}
              className="p-3 bg-[#FAF9F6] hover:bg-[#F2EFE9] border border-[#EAE4D9] rounded-xl text-[#554E45] transition-colors cursor-pointer"
              title="Recargar lista"
            >
              <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
            </button>

            <Link
              href="/admin/crear"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#2E2820] hover:bg-black text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Plus size={16} /> Nueva Invitación
            </Link>
          </div>
        </div>

        {/* Barra de Búsqueda y Filtros */}
        <div className="bg-white p-6 rounded-3xl border border-[#EAE4D9] shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            
            {/* Buscador de texto */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A89F91]" size={16} />
              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por festejado, slug o salón..."
                className="w-full pl-10 pr-4 py-3 bg-[#FAF9F6] border border-[#EAE4D9] rounded-2xl text-xs text-[#2E2820] outline-none focus:border-[#D4A39E] transition-all"
              />
            </div>

            {/* Filtro por Plan */}
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <span className="text-[10px] uppercase font-bold text-[#8A8177] tracking-wider shrink-0 flex items-center gap-1">
                <Filter size={12} /> Plan:
              </span>
              {["todos", "avanzada", "moderada", "basica"].map((p) => (
                <button
                  key={p}
                  onClick={() => setFiltroPlan(p)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer shrink-0 ${
                    filtroPlan === p
                      ? "bg-[#2E2820] text-white shadow-xs"
                      : "bg-[#FAF9F6] text-[#7A7267] hover:bg-[#F2EFE9] border border-[#EAE4D9]"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Filtro por Estado */}
            <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="w-full md:w-auto px-3.5 py-2.5 bg-[#FAF9F6] border border-[#EAE4D9] rounded-xl text-xs text-[#2E2820] outline-none cursor-pointer font-medium"
              >
                <option value="todos">Todos los Estados</option>
                <option value="activas">Solo Activas</option>
                <option value="pausadas">Solo Pausadas</option>
              </select>
            </div>

          </div>
        </div>

        {/* Tabla de Resultados */}
        <div className="bg-white rounded-3xl border border-[#EAE4D9] shadow-xs overflow-hidden">
          <div className="p-6 border-b border-[#F2EFE9] flex items-center justify-between">
            <h2 className="text-base font-serif italic text-[#2E2820] font-bold">
              Resultados ({eventosFiltrados.length} de {eventos.length})
            </h2>
            {(busqueda || filtroPlan !== "todos" || filtroEstado !== "todos") && (
              <button
                onClick={() => { setBusqueda(""); setFiltroPlan("todos"); setFiltroEstado("todos"); }}
                className="text-xs text-[#D4A39E] font-bold hover:underline cursor-pointer"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF9F6] text-[10px] uppercase font-bold text-[#8A8177] tracking-wider border-b border-[#EAE4D9]">
                  <th className="p-4">Evento / Festejados</th>
                  <th className="p-4">Plan & Estilo</th>
                  <th className="p-4">Fecha Evento</th>
                  <th className="p-4 text-center">Estado</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2EFE9] text-sm">
                {eventosFiltrados.map((ev) => (
                  <tr key={ev.id} className="hover:bg-[#FAF9F6]/80 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {ev.foto_hero ? (
                          <img src={ev.foto_hero} className="w-12 h-12 rounded-xl object-cover border border-[#EAE4D9] shrink-0" alt="Hero" />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-[#FAF9F6] border border-[#EAE4D9] flex items-center justify-center text-[#A89F91] shrink-0">
                            <Calendar size={20} />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-[#2E2820]">{ev.nombre}</p>
                          <p className="text-xs text-[#8A8177] font-mono">/invitacion/{ev.plan || 'avanzada'}/{ev.slug}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-xs">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-[#FAF4F0] border border-[#D4A39E]/30 text-[#D4A39E] uppercase font-bold text-[10px] mr-1.5 font-sans">
                        {ev.plan || 'Avanzada'}
                      </span>
                      <p className="text-[#8A8177] text-[11px] mt-0.5 font-mono">
                        {ev.tipo} • {ev.estilo_visual}
                      </p>
                    </td>

                    <td className="p-4 text-xs text-[#554E45]">
                      <p className="font-semibold text-[#2E2820]">{ev.fecha}</p>
                      <p className="text-[#8A8177] text-[11px]">{ev.hora}</p>
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() => toggleActivo(ev.id, ev.activo, ev.nombre)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer font-sans ${
                          ev.activo 
                            ? "bg-[#F4F6F4] text-[#8E9B8E] border border-[#8E9B8E]/30" 
                            : "bg-red-50 text-red-600 border border-red-200"
                        }`}
                      >
                        <Power size={12} />
                        {ev.activo ? "Activa" : "Pausada"}
                      </button>
                    </td>

                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <a
                          href={`/invitacion/${ev.plan || 'avanzada'}/${ev.slug}?p=3`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-[#FAF4F0] text-[#554E45] hover:text-[#D4A39E] rounded-lg transition-colors"
                          title="Ver Invitación Pública"
                        >
                          <ExternalLink size={16} />
                        </a>

                        <Link
                          href={`/admin/editar?id=${ev.id}`}
                          className="p-2 hover:bg-[#FAF6EE] text-[#7A623A] rounded-lg transition-colors"
                          title="Editar Invitación"
                        >
                          <Edit2 size={16} />
                        </Link>

                        <a
                          href={`/admin-evento?id=${ev.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-[#F4F6F4] text-[#8E9B8E] rounded-lg transition-colors"
                          title="Ver Panel de Confirmaciones"
                        >
                          <Eye size={16} />
                        </a>

                        <button
                          onClick={() => eliminarEvento(ev.id, ev.nombre)}
                          className="p-2 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar Evento"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {eventosFiltrados.length === 0 && !loading && (
              <div className="p-16 text-center text-[#A89F91] font-serif italic text-sm">
                No se encontraron invitaciones con los filtros seleccionados.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}