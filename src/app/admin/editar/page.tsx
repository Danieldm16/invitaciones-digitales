"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const EMOJIS_ITINERARIO = ["⛪", "💍", "🥂", "🍽️", "🎂", "💃", "👑", "📸", "🕊️", "✨"];

function EditarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventoId = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [slug, setSlug] = useState("");
  const [plan, setPlan] = useState("avanzada");
  const [tipo, setTipo] = useState("boda");
  const [estiloVisual, setEstiloVisual] = useState("crema_lujo");
  const [nombre, setNombre] = useState("");
  const [titulo, setTitulo] = useState("");
  const [frase, setFrase] = useState("");
  const [fecha, setFecha] = useState("");
  const [fechaIso, setFechaIso] = useState("");
  const [hora, setHora] = useState("");
  const [lugar, setLugar] = useState("");
  const [direccion, setDireccion] = useState("");
  const [mapa, setMapa] = useState("");
  const [waConfirmar, setWaConfirmar] = useState("");
  const [fotoHero, setFotoHero] = useState("");
  const [mesaRegalos, setMesaRegalos] = useState("");
  const [musicaUrl, setMusicaUrl] = useState("");
  const [dressCode, setDressCode] = useState("FORMAL");
  const [notaDressCode, setNotaDressCode] = useState("");
  const [itinerario, setItinerario] = useState<{ h: string; a: string; icon?: string }[]>([]);

  useEffect(() => {
    async function cargarEvento() {
      if (!eventoId) return;
      const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .eq('id', eventoId)
        .single();

      if (data && !error) {
        setSlug(data.slug || "");
        setPlan(data.plan || "avanzada");
        setTipo(data.tipo || "boda");
        setEstiloVisual(data.estilo_visual || "crema_lujo");
        setNombre(data.nombre || "");
        setTitulo(data.titulo || "");
        setFrase(data.frase || "");
        setFecha(data.fecha || "");
        setFechaIso(data.fecha_iso ? data.fecha_iso.slice(0, 16) : "");
        setHora(data.hora || "");
        setLugar(data.lugar || "");
        setDireccion(data.direccion || "");
        setMapa(data.mapa || "");
        setWaConfirmar(data.wa_confirmar || "");
        setFotoHero(data.foto_hero || "");
        setMesaRegalos(data.mesa_regalos || "");
        setMusicaUrl(data.musica_url || "");
        setDressCode(data.dress_code || "FORMAL");
        setNotaDressCode(data.nota_dress_code || "");
        setItinerario(data.itinerario || []);
      }
      setLoading(false);
    }
    cargarEvento();
  }, [eventoId]);

  const agregarFilaItinerario = () => {
    setItinerario([...itinerario, { h: "", a: "", icon: "✨" }]);
  };

  const eliminarFilaItinerario = (index: number) => {
    setItinerario(itinerario.filter((_, i) => i !== index));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);

    const actualizacion = {
      slug: slug.trim().toLowerCase(),
      plan,
      tipo,
      estilo_visual: estiloVisual,
      nombre: nombre.trim(),
      titulo: titulo.trim(),
      frase: frase.trim(),
      fecha: fecha.trim(),
      fecha_iso: fechaIso ? new Date(fechaIso).toISOString() : null,
      hora: hora.trim(),
      lugar: lugar.trim(),
      direccion: direccion.trim(),
      mapa: mapa.trim(),
      wa_confirmar: waConfirmar.trim().replace(/\D/g, ''),
      foto_hero: fotoHero.trim(),
      mesa_regalos: mesaRegalos.trim(),
      musica_url: musicaUrl.trim(),
      dress_code: dressCode.trim(),
      nota_dress_code: notaDressCode.trim(),
      itinerario: itinerario.filter(item => item.h.trim() || item.a.trim())
    };

    const { error } = await supabase
      .from('eventos')
      .update(actualizacion)
      .eq('id', eventoId);

    setGuardando(false);
    if (!error) {
      toast.success("¡Cambios guardados con éxito!");
      router.push('/admin');
    } else {
      toast.error("Error al actualizar: " + error.message);
    }
  };

  if (loading) return <div className="p-12 text-center text-sm font-serif italic text-[#7A7267]">Cargando datos...</div>;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2E2820] p-4 md:p-12 font-sans antialiased">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#7A7267] hover:text-[#2E2820] transition-colors">
            <ArrowLeft size={16} /> Volver al Dashboard
          </Link>
          <span className="text-xs bg-[#FAF4F0] border border-[#D4A39E]/30 text-[#D4A39E] px-3.5 py-1 rounded-full font-bold uppercase tracking-wider">
            Modo Edición
          </span>
        </div>

        <form onSubmit={handleUpdate} className="bg-white p-6 md:p-10 rounded-3xl border border-[#EAE4D9] shadow-sm space-y-8">
          <div>
            <h1 className="text-3xl font-serif italic text-[#2E2820]">Editar Invitación: {nombre}</h1>
            <p className="text-xs text-[#7A7267] mt-1">Los cambios se actualizarán de inmediato en el enlace del cliente.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#FAF9F6] p-6 rounded-2xl border border-[#EAE4D9]">
            <div>
              <label className="text-[11px] font-bold text-[#554E45] block mb-1">Slug (URL corta)</label>
              <input required value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-3.5 py-2.5 bg-white border border-[#EAE4D9] rounded-xl text-xs font-mono outline-none" />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#554E45] block mb-1">Plan Contratado</label>
              <select value={plan} onChange={(e) => setPlan(e.target.value)} className="w-full px-3.5 py-2.5 bg-white border border-[#EAE4D9] rounded-xl text-xs outline-none font-semibold text-[#D4A39E]">
                <option value="avanzada">Avanzada ($1,490)</option>
                <option value="moderada">Moderada ($950)</option>
                <option value="basica">Básica ($590)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#554E45] block mb-1">Tipo de Evento</label>
              <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-full px-3.5 py-2.5 bg-white border border-[#EAE4D9] rounded-xl text-xs outline-none">
                <option value="boda">💍 Boda</option>
                <option value="cumple">🎂 Cumpleaños</option>
                <option value="xv">👑 XV Años</option>
                <option value="bautizo">🕊️ Bautizo</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#554E45] block mb-1">Estilo Visual</label>
              <select value={estiloVisual} onChange={(e) => setEstiloVisual(e.target.value)} className="w-full px-3.5 py-2.5 bg-white border border-[#EAE4D9] rounded-xl text-xs outline-none">
                <option value="crema_lujo">📜 Crema Artesanal</option>
                <option value="black_tie">🖤 Black Tie (Gala)</option>
                <option value="fiesta_vip">💜 Fiesta VIP</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-[#554E45] block mb-1">Nombre</label>
              <input required value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full px-3.5 py-2.5 border border-[#EAE4D9] rounded-xl text-xs outline-none focus:border-[#D4A39E]" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#554E45] block mb-1">Título</label>
              <input value={titulo} onChange={(e) => setTitulo(e.target.value)} className="w-full px-3.5 py-2.5 border border-[#EAE4D9] rounded-xl text-xs outline-none focus:border-[#D4A39E]" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-bold text-[#554E45] block mb-1">Fecha Visible</label>
              <input required value={fecha} onChange={(e) => setFecha(e.target.value)} className="w-full px-3.5 py-2.5 border border-[#EAE4D9] rounded-xl text-xs outline-none focus:border-[#D4A39E]" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#554E45] block mb-1">Hora</label>
              <input value={hora} onChange={(e) => setHora(e.target.value)} className="w-full px-3.5 py-2.5 border border-[#EAE4D9] rounded-xl text-xs outline-none focus:border-[#D4A39E]" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#554E45] block mb-1">Cuenta Regresiva</label>
              <input type="datetime-local" value={fechaIso} onChange={(e) => setFechaIso(e.target.value)} className="w-full px-3.5 py-2.5 border border-[#EAE4D9] rounded-xl text-xs outline-none focus:border-[#D4A39E]" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-[#554E45] block mb-1">Lugar</label>
              <input value={lugar} onChange={(e) => setLugar(e.target.value)} className="w-full px-3.5 py-2.5 border border-[#EAE4D9] rounded-xl text-xs outline-none focus:border-[#D4A39E]" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#554E45] block mb-1">Dirección</label>
              <input value={direccion} onChange={(e) => setDireccion(e.target.value)} className="w-full px-3.5 py-2.5 border border-[#EAE4D9] rounded-xl text-xs outline-none focus:border-[#D4A39E]" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-[#554E45] block mb-1">Código de Vestimenta</label>
              <input value={dressCode} onChange={(e) => setDressCode(e.target.value)} className="w-full px-3.5 py-2.5 border border-[#EAE4D9] rounded-xl text-xs outline-none focus:border-[#D4A39E]" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#554E45] block mb-1">Nota de Vestimenta (Opcional)</label>
              <input value={notaDressCode} onChange={(e) => setNotaDressCode(e.target.value)} placeholder="Dejar vacío si no aplica" className="w-full px-3.5 py-2.5 border border-[#EAE4D9] rounded-xl text-xs outline-none focus:border-[#D4A39E]" />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#554E45] block mb-1">URL Foto de Portada</label>
            <input value={fotoHero} onChange={(e) => setFotoHero(e.target.value)} className="w-full px-3.5 py-2.5 border border-[#EAE4D9] rounded-xl text-xs font-mono outline-none focus:border-[#D4A39E]" />
          </div>

          {/* Itinerario */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-[#554E45]">Itinerario</label>
              <button type="button" onClick={agregarFilaItinerario} className="text-xs text-[#D4A39E] font-bold hover:underline flex items-center gap-1 cursor-pointer">
                <Plus size={14} /> Añadir actividad
              </button>
            </div>
            {itinerario.map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-3.5 bg-[#FAF9F6] rounded-2xl border border-[#EAE4D9]">
                <div className="flex items-center gap-1.5 shrink-0">
                  <input
                    value={item.icon || "✨"}
                    onChange={(e) => {
                      const c = [...itinerario];
                      c[index].icon = e.target.value;
                      setItinerario(c);
                    }}
                    className="w-10 h-10 text-center text-xl bg-white border border-[#EAE4D9] rounded-xl outline-none"
                  />
                  <div className="flex items-center gap-1 overflow-x-auto max-w-[160px] p-1 bg-white border border-[#EAE4D9] rounded-xl">
                    {EMOJIS_ITINERARIO.map((em) => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => {
                          const c = [...itinerario];
                          c[index].icon = em;
                          setItinerario(c);
                        }}
                        className="hover:scale-125 transition-transform text-sm px-0.5 cursor-pointer"
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>
                <input value={item.h} onChange={(e) => { const c = [...itinerario]; c[index].h = e.target.value; setItinerario(c); }} placeholder="Hora" className="w-full sm:w-28 px-3 py-2 bg-white border border-[#EAE4D9] rounded-xl text-xs outline-none" />
                <input value={item.a} onChange={(e) => { const c = [...itinerario]; c[index].a = e.target.value; setItinerario(c); }} placeholder="Actividad" className="flex-1 w-full px-3 py-2 bg-white border border-[#EAE4D9] rounded-xl text-xs outline-none" />
                <button type="button" onClick={() => eliminarFilaItinerario(index)} className="p-2 text-red-400 hover:text-red-600 self-end sm:self-center cursor-pointer"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#EAE4D9] flex items-center justify-end gap-4">
            <Link href="/admin" className="px-6 py-3.5 text-xs font-bold text-[#7A7267] hover:text-[#2E2820] uppercase tracking-wider">
              Cancelar
            </Link>
            <button type="submit" disabled={guardando} className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#2E2820] hover:bg-black text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-md active:scale-95 cursor-pointer">
              <Save size={15} /> {guardando ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EditarPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-serif italic text-[#7A7267]">Cargando...</div>}>
      <EditarContent />
    </Suspense>
  );
}