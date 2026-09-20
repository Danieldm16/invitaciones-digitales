"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ESTILOS } from '@/lib/eventos-config';
import { toast } from 'sonner';
import { 
  ArrowLeft, Save, Plus, Trash2, MessageCircle, 
  Upload, Image as ImageIcon 
} from 'lucide-react';

const EMOJIS_ITINERARIO = ["⛪", "💍", "🥂", "🍽️", "🎂", "💃", "👑", "📸", "🕊️", "✨"];

function EditarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventoId = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [progreso, setProgreso] = useState("");

  // 1. Configuración Técnica
  const [slug, setSlug] = useState("");
  const [plan, setPlan] = useState("avanzada");
  const [tipo, setTipo] = useState("boda");
  const [estiloVisual, setEstiloVisual] = useState("crema_lujo");

  // 2. Información Principal
  const [nombre, setNombre] = useState("");
  const [titulo, setTitulo] = useState("");
  const [frase, setFrase] = useState("");

  // 3. Fechas y Ubicación General
  const [fecha, setFecha] = useState("");
  const [fechaIso, setFechaIso] = useState("");
  const [hora, setHora] = useState("");
  const [lugar, setLugar] = useState("");
  const [direccion, setDireccion] = useState("");
  const [mapa, setMapa] = useState("");

  // 4. WhatsApp
  const [waConfirmar, setWaConfirmar] = useState("");

  // 5. Multimedia y Regalos
  const [fotoHero, setFotoHero] = useState("");
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [galeriaUrls, setGaleriaUrls] = useState<string[]>([]);
  const [nuevasGaleriaFiles, setNuevasGaleriaFiles] = useState<File[]>([]);
  const [musicaUrl, setMusicaUrl] = useState("");
  const [mesaRegalos, setMesaRegalos] = useState("");

  // 6. Vestimenta e Itinerario
  const [dressCode, setDressCode] = useState("FORMAL");
  const [notaDressCode, setNotaDressCode] = useState("");
  const [itinerario, setItinerario] = useState<{ h: string; a: string; icon?: string; lugar?: string; mapa?: string }[]>([]);

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
        setGaleriaUrls(Array.isArray(data.galeria) ? data.galeria : []);
        setMusicaUrl(data.musica_url || "");
        setMesaRegalos(data.mesa_regalos || "");
        setDressCode(data.dress_code || "FORMAL");
        setNotaDressCode(data.nota_dress_code || "");
        setItinerario(Array.isArray(data.itinerario) ? data.itinerario : []);
      }
      setLoading(false);
    }
    cargarEvento();
  }, [eventoId]);

  const subirArchivoStorage = async (file: File, carpeta: string): Promise<string | null> => {
    const extension = file.name.split('.').pop();
    const nombreUnico = `${carpeta}/${Date.now()}_${Math.random().toString(36).substring(7)}.${extension}`;
    
    const { data, error } = await supabase.storage
      .from('fotos-eventos')
      .upload(nombreUnico, file, { cacheControl: '3600', upsert: false });

    if (error) {
      console.error("Error al subir imagen:", error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('fotos-eventos')
      .getPublicUrl(data.path);

    return publicUrl;
  };

  const agregarFilaItinerario = () => {
    setItinerario([...itinerario, { h: "", a: "", icon: "✨", lugar: "", mapa: "" }]);
  };

  const eliminarFilaItinerario = (index: number) => {
    setItinerario(itinerario.filter((_, i) => i !== index));
  };

  const eliminarFotoGaleriaExistente = (index: number) => {
    setGaleriaUrls(galeriaUrls.filter((_, i) => i !== index));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug.trim() || !nombre.trim()) {
      toast.error("Por favor completa el slug y el nombre.");
      return;
    }

    setGuardando(true);
    let urlFotoHeroFinal = fotoHero;

    // Si seleccionó una foto de portada nueva para reemplazar:
    if (heroFile) {
      setProgreso("Subiendo nueva foto de portada...");
      const nuevaUrl = await subirArchivoStorage(heroFile, slug);
      if (nuevaUrl) urlFotoHeroFinal = nuevaUrl;
    }

    // Si seleccionó fotos adicionales para la galería:
    let listaGaleriaFinal = [...galeriaUrls];
    if (nuevasGaleriaFiles.length > 0) {
      setProgreso("Subiendo fotos nuevas a la galería...");
      for (const f of nuevasGaleriaFiles) {
        const urlG = await subirArchivoStorage(f, `${slug}/galeria`);
        if (urlG) listaGaleriaFinal.push(urlG);
      }
    }

    setProgreso("Guardando cambios...");

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
      foto_hero: urlFotoHeroFinal,
      galeria: listaGaleriaFinal,
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
      toast.success("¡Invitación actualizada con éxito!");
      router.push('/admin');
    } else {
      toast.error("Error al actualizar: " + error.message);
    }
  };

  if (loading) return <div className="p-12 text-center text-sm font-serif italic text-[#7A7267]">Cargando datos...</div>;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2E2820] p-4 md:p-12 font-sans antialiased">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Barra superior */}
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

          {/* 1. CONFIGURACIÓN TÉCNICA */}
          <div className="bg-[#FAF9F6] p-6 rounded-2xl border border-[#EAE4D9] space-y-4">
            <h2 className="text-[10px] font-bold uppercase text-[#8A8177] tracking-widest">1. Configuración de URL y Plan</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#554E45] block mb-1">Slug (URL corta) *</label>
                <input
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#EAE4D9] rounded-xl text-xs font-mono outline-none focus:border-[#D4A39E]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#554E45] block mb-1">Plan Contratado</label>
                <select
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#EAE4D9] rounded-xl text-xs outline-none focus:border-[#D4A39E] font-semibold text-[#D4A39E] cursor-pointer"
                >
                  <option value="avanzada">Avanzada ($1,490)</option>
                  <option value="moderada">Moderada ($790)</option>
                  <option value="basica">Básica ($390)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#554E45] block mb-1">Tipo de Evento</label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#EAE4D9] rounded-xl text-xs outline-none focus:border-[#D4A39E] cursor-pointer"
                >
                  <option value="boda">💍 Boda</option>
                  <option value="cumple">🎂 Cumpleaños</option>
                  <option value="xv">👑 XV Años</option>
                  <option value="bautizo">🕊️ Bautizo</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#554E45] block mb-1">Estilo Visual</label>
                <select
                  value={estiloVisual}
                  onChange={(e) => setEstiloVisual(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#EAE4D9] rounded-xl text-xs outline-none focus:border-[#D4A39E] cursor-pointer"
                >
                  {Object.values(ESTILOS).map((est: any) => (
                    <option key={est.id} value={est.id}>
                      {est.nombreVisible || est.id}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 2. DATOS DEL FESTEJADO */}
          <div className="space-y-4">
            <h2 className="text-[10px] font-bold uppercase text-[#8A8177] tracking-widest">2. Información Principal</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#554E45] block mb-1">Nombre(s) de Festejado(s) *</label>
                <input
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#EAE4D9] rounded-xl text-xs outline-none focus:border-[#D4A39E]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#554E45] block mb-1">Título de la Invitación</label>
                <input
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#EAE4D9] rounded-xl text-xs outline-none focus:border-[#D4A39E]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#554E45] block mb-1">Frase Emotiva</label>
              <textarea
                value={frase}
                onChange={(e) => setFrase(e.target.value)}
                rows={2}
                className="w-full px-3.5 py-2.5 border border-[#EAE4D9] rounded-xl text-xs outline-none focus:border-[#D4A39E]"
              />
            </div>
          </div>

          {/* 3. FECHAS Y UBICACIÓN GENERAL */}
          <div className="space-y-4">
            <h2 className="text-[10px] font-bold uppercase text-[#8A8177] tracking-widest">3. Fechas y Ubicación Principal</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#554E45] block mb-1">Fecha Visible *</label>
                <input
                  required
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#EAE4D9] rounded-xl text-xs outline-none focus:border-[#D4A39E]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#554E45] block mb-1">Hora Principal</label>
                <input
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#EAE4D9] rounded-xl text-xs outline-none focus:border-[#D4A39E]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#554E45] block mb-1">Fecha y Hora Reloj (Cuenta Regresiva)</label>
                <input
                  type="datetime-local"
                  value={fechaIso}
                  onChange={(e) => setFechaIso(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#EAE4D9] rounded-xl text-xs outline-none focus:border-[#D4A39E]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#554E45] block mb-1">Lugar Principal / Salón</label>
                <input
                  value={lugar}
                  onChange={(e) => setLugar(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#EAE4D9] rounded-xl text-xs outline-none focus:border-[#D4A39E]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#554E45] block mb-1">Dirección General</label>
                <input
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#EAE4D9] rounded-xl text-xs outline-none focus:border-[#D4A39E]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#554E45] block mb-1">Link de Google Maps General</label>
                <input
                  value={mapa}
                  onChange={(e) => setMapa(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#EAE4D9] rounded-xl text-xs outline-none focus:border-[#D4A39E]"
                />
              </div>
            </div>
          </div>

          {/* 4. DESTINO DE CONFIRMACIONES WHATSAPP (BÁSICA Y MODERADA) */}
          <div className="bg-[#F4F6F4] p-6 rounded-2xl border border-[#8E9B8E]/30 space-y-3">
            <div className="flex items-center gap-2 text-[#4A5D4A]">
              <MessageCircle size={18} />
              <h2 className="text-xs font-bold uppercase tracking-wider">Confirmaciones por WhatsApp (Para Básica y Moderada)</h2>
            </div>
            <p className="text-[11px] text-[#556B55]">
              A este número de WhatsApp llegarán los mensajes de los invitados cuando hagan clic en el botón de confirmar.
            </p>
            <div className="max-w-sm">
              <label className="text-[11px] font-bold text-[#3E4D3E] block mb-1">Número de WhatsApp (con código de país sin +)</label>
              <input
                value={waConfirmar}
                onChange={(e) => setWaConfirmar(e.target.value)}
                placeholder="ej: 5218441234567"
                className="w-full px-3.5 py-2.5 bg-white border border-[#8E9B8E]/40 rounded-xl text-xs outline-none focus:border-[#8E9B8E] font-mono text-[#2E2820]"
              />
            </div>
          </div>

          {/* 5. MULTIMEDIA, MÚSICA Y REGALOS (¡AHORA CON MÚSICA Y SUBIDA DE FOTOS!) */}
          <div className="space-y-4">
            <h2 className="text-[10px] font-bold uppercase text-[#8A8177] tracking-widest">5. Fotos, Música y Regalos</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Foto de Portada */}
              <div className="p-5 border-2 border-dashed border-[#EAE4D9] bg-[#FAF9F6]/60 rounded-2xl text-center space-y-3">
                <ImageIcon className="mx-auto text-[#D4A39E]" size={26} />
                <p className="text-xs font-bold text-[#2E2820]">Foto de Portada</p>
                {fotoHero && (
                  <div className="w-20 h-20 mx-auto rounded-xl overflow-hidden border border-[#EAE4D9] shadow-xs">
                    <img src={fotoHero} alt="Hero actual" className="w-full h-full object-cover" />
                  </div>
                )}
                <p className="text-[10px] text-[#7A7267]">Selecciona un archivo si deseas reemplazar la portada:</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setHeroFile(e.target.files?.[0] || null)}
                  className="text-xs text-[#7A7267] file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-[#FAF4F0] file:text-[#D4A39E]"
                />
              </div>

              {/* Galería de Fotos */}
              <div className="p-5 border-2 border-dashed border-[#EAE4D9] bg-[#FAF9F6]/60 rounded-2xl text-center space-y-3">
                <Upload className="mx-auto text-[#8E9B8E]" size={26} />
                <p className="text-xs font-bold text-[#2E2820]">Galería ({galeriaUrls.length} fotos guardadas)</p>
                
                {/* Miniaturas de fotos existentes con botón de borrar */}
                {galeriaUrls.length > 0 && (
                  <div className="flex items-center justify-center gap-1.5 flex-wrap max-h-24 overflow-y-auto p-1 bg-white rounded-xl border border-[#EAE4D9]">
                    {galeriaUrls.map((url, idx) => (
                      <div key={idx} className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-200 group">
                        <img src={url} alt={`Foto ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => eliminarFotoGaleriaExistente(idx)}
                          className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-[10px] text-[#7A7267]">Subir más fotos a la galería:</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setNuevasGaleriaFiles(Array.from(e.target.files || []))}
                  className="text-xs text-[#7A7267] file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-[#F4F6F4] file:text-[#8E9B8E]"
                />
              </div>
            </div>

            {/* Música y Regalos (¡Aquí está la música que faltaba!) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#554E45] block mb-1">Música (.mp3 o link directo)</label>
                <input
                  value={musicaUrl}
                  onChange={(e) => setMusicaUrl(e.target.value)}
                  placeholder="ej: /musica/cancion.mp3 o URL externa"
                  className="w-full px-3.5 py-2.5 border border-[#EAE4D9] rounded-xl text-xs outline-none focus:border-[#D4A39E]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#554E45] block mb-1">Mesa de Regalos (Link de tienda)</label>
                <input
                  value={mesaRegalos}
                  onChange={(e) => setMesaRegalos(e.target.value)}
                  placeholder="https://amazon.com.mx/..."
                  className="w-full px-3.5 py-2.5 border border-[#EAE4D9] rounded-xl text-xs outline-none focus:border-[#D4A39E]"
                />
              </div>
            </div>
          </div>

          {/* 6. VESTIMENTA E ITINERARIO */}
          <div className="space-y-4">
            <h2 className="text-[10px] font-bold uppercase text-[#8A8177] tracking-widest">6. Vestimenta e Itinerario con Lugares</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#554E45] block mb-1">Código de Vestimenta</label>
                <input
                  value={dressCode}
                  onChange={(e) => setDressCode(e.target.value)}
                  placeholder="ej: FORMAL, BLACK TIE, GUAYABERA"
                  className="w-full px-3.5 py-2.5 border border-[#EAE4D9] rounded-xl text-xs outline-none focus:border-[#D4A39E]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#554E45] block mb-1">Nota de Vestimenta (Opcional)</label>
                <input
                  value={notaDressCode}
                  onChange={(e) => setNotaDressCode(e.target.value)}
                  placeholder="ej: Evitar blanco / Calzado cómodo para jardín"
                  className="w-full px-3.5 py-2.5 border border-[#EAE4D9] rounded-xl text-xs outline-none focus:border-[#D4A39E]"
                />
              </div>
            </div>

            {/* Itinerario */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-[11px] font-bold text-[#554E45]">Puntos del Itinerario</label>
                  <p className="text-[10px] text-slate-400">Cada actividad puede tener su propio lugar y su propio enlace de Maps.</p>
                </div>
                <button
                  type="button"
                  onClick={agregarFilaItinerario}
                  className="text-xs text-[#D4A39E] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={14} /> Añadir actividad
                </button>
              </div>

              {itinerario.map((item, index) => (
                <div key={index} className="p-4 bg-[#FAF9F6] rounded-2xl border border-[#EAE4D9] space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
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
                      <div className="flex items-center gap-1 overflow-x-auto max-w-[140px] p-1 bg-white border border-[#EAE4D9] rounded-xl">
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

                    <input
                      value={item.h}
                      onChange={(e) => {
                        const c = [...itinerario];
                        c[index].h = e.target.value;
                        setItinerario(c);
                      }}
                      placeholder="Hora (ej: 5:00 PM)"
                      className="w-full sm:w-28 px-3 py-2 bg-white border border-[#EAE4D9] rounded-xl text-xs outline-none"
                    />

                    <input
                      value={item.a}
                      onChange={(e) => {
                        const c = [...itinerario];
                        c[index].a = e.target.value;
                        setItinerario(c);
                      }}
                      placeholder="Actividad (ej: Ceremonia Religiosa)"
                      className="flex-1 w-full px-3 py-2 bg-white border border-[#EAE4D9] rounded-xl text-xs outline-none"
                    />

                    {itinerario.length > 1 && (
                      <button
                        type="button"
                        onClick={() => eliminarFilaItinerario(index)}
                        className="p-2 text-red-400 hover:text-red-600 transition-colors self-end sm:self-center cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-[#EAE4D9]/60">
                    <input
                      value={item.lugar || ""}
                      onChange={(e) => {
                        const c = [...itinerario];
                        c[index].lugar = e.target.value;
                        setItinerario(c);
                      }}
                      placeholder="Lugar específico (ej. Parroquia San Pedro)"
                      className="w-full px-3 py-1.5 bg-white border border-[#EAE4D9] rounded-lg text-[11px] outline-none"
                    />

                    <input
                      value={item.mapa || ""}
                      onChange={(e) => {
                        const c = [...itinerario];
                        c[index].mapa = e.target.value;
                        setItinerario(c);
                      }}
                      placeholder="Link de Google Maps para este lugar"
                      className="w-full px-3 py-1.5 bg-white border border-[#EAE4D9] rounded-lg text-[11px] outline-none font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BOTÓN FINAL */}
          <div className="pt-4 border-t border-[#EAE4D9] flex items-center justify-end gap-4">
            <Link href="/admin" className="px-6 py-3.5 text-xs font-bold text-[#7A7267] hover:text-[#2E2820] transition-colors uppercase tracking-wider">
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={guardando}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#2E2820] hover:bg-black disabled:bg-slate-300 text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-md active:scale-95 cursor-pointer"
            >
              <Save size={15} /> {guardando ? (progreso || "Guardando...") : "Guardar Cambios"}
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