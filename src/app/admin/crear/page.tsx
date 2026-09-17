"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { 
  ArrowLeft, Upload, Sparkles, Plus, Trash2, Image as ImageIcon 
} from 'lucide-react';
import { toast } from 'sonner';

const EMOJIS_ITINERARIO = ["⛪", "💍", "🥂", "🍽️", "🎂", "💃", "👑", "📸", "🕊️", "✨"];

export default function CrearInvitacionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [progreso, setProgreso] = useState("");

  const [slug, setSlug] = useState("");
  const [plan, setPlan] = useState("avanzada");
  const [tipo, setTipo] = useState("boda");
  const [estiloVisual, setEstiloVisual] = useState("crema_lujo");
  const [nombre, setNombre] = useState("");
  const [titulo, setTitulo] = useState("Nuestra Boda");
  const [frase, setFrase] = useState("Lo mejor de nuestras vidas está por comenzar.");
  const [fecha, setFecha] = useState("");
  const [fechaIso, setFechaIso] = useState("");
  const [hora, setHora] = useState("");
  const [lugar, setLugar] = useState("");
  const [direccion, setDireccion] = useState("");
  const [mapa, setMapa] = useState("");
  const [waConfirmar, setWaConfirmar] = useState("");
  const [mesaRegalos, setMesaRegalos] = useState("");
  const [musicaUrl, setMusicaUrl] = useState("");
  const [dressCode, setDressCode] = useState("FORMAL");
  const [notaDressCode, setNotaDressCode] = useState("Por favor, evitar asistir de color blanco, beige o marfil (reservados para la novia).");

  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [galeriaFiles, setGaleriaFiles] = useState<File[]>([]);

  const [itinerario, setItinerario] = useState<{ h: string; a: string; icon: string }[]>([
    { h: "5:00 PM", a: "Ceremonia Religiosa", icon: "⛪" },
    { h: "7:00 PM", a: "Recepción y Banquete", icon: "🥂" }
  ]);

  const handleNombreChange = (val: string) => {
    setNombre(val);
    if (!slug) {
      const slugGenerado = val
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(slugGenerado);
    }
  };

  const agregarFilaItinerario = () => {
    setItinerario([...itinerario, { h: "", a: "", icon: "✨" }]);
  };

  const eliminarFilaItinerario = (index: number) => {
    setItinerario(itinerario.filter((_, i) => i !== index));
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug.trim() || !nombre.trim()) {
      toast.error("Por favor completa el slug y el nombre.");
      return;
    }

    setLoading(true);
    setProgreso("Subiendo foto de portada...");

    let urlFotoHero = "https://images.unsplash.com/photo-1519741497674-611481863552";
    if (heroFile) {
      const urlSubida = await subirArchivoStorage(heroFile, slug);
      if (urlSubida) urlFotoHero = urlSubida;
    }

    setProgreso("Subiendo fotos de galería...");
    const urlsGaleria: string[] = [];
    for (const f of galeriaFiles) {
      const urlG = await subirArchivoStorage(f, `${slug}/galeria`);
      if (urlG) urlsGaleria.push(urlG);
    }

    setProgreso("Guardando invitación...");

    const nuevoEvento = {
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
      foto_hero: urlFotoHero,
      galeria: urlsGaleria,
      mesa_regalos: mesaRegalos.trim(),
      musica_url: musicaUrl.trim(),
      id_supabase: slug.trim().toLowerCase(),
      dress_code: dressCode.trim(),
      nota_dress_code: notaDressCode.trim(),
      itinerario: itinerario.filter(item => item.h.trim() || item.a.trim()),
      activo: true
    };

    const { error } = await supabase.from('eventos').insert([nuevoEvento]);

    setLoading(false);
    if (!error) {
      toast.success("¡Invitación creada y publicada con éxito!");
      router.push('/admin');
    } else {
      console.error("Error al guardar en Supabase:", error);
      toast.error("Hubo un error al guardar: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2E2820] p-4 md:p-12 font-sans antialiased">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Barra superior */}
        <div className="flex items-center justify-between">
          <Link href="/admin" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#7A7267] hover:text-[#2E2820] transition-colors">
            <ArrowLeft size={16} /> Volver al Dashboard
          </Link>
          <span className="text-xs bg-[#FAF4F0] border border-[#D4A39E]/30 text-[#D4A39E] px-3.5 py-1 rounded-full font-bold uppercase tracking-wider">
            Nueva Invitación
          </span>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 rounded-3xl border border-[#EAE4D9] shadow-sm space-y-8">
          <div>
            <h1 className="text-3xl font-serif italic text-[#2E2820]">Crear Invitación Digital</h1>
            <p className="text-xs text-[#7A7267] mt-1">Completa los datos para generar el enlace del cliente automáticamente.</p>
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
                  placeholder="ej: boda-sofia-carlos"
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
                  <option value="moderada">Moderada ($950)</option>
                  <option value="basica">Básica ($590)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#554E45] block mb-1">Tipo de Evento</label>
                <select
                  value={tipo}
                  onChange={(e) => {
                    const nuevoTipo = e.target.value;
                    setTipo(nuevoTipo);
                    if (nuevoTipo === "xv") {
                      setTitulo("Mis XV Años");
                      setNotaDressCode("Evitar color del vestido de la quinceañera.");
                    } else if (nuevoTipo === "cumple") {
                      setTitulo("¡Mi Cumpleaños!");
                      setNotaDressCode("");
                    } else if (nuevoTipo === "bautizo") {
                      setTitulo("Mi Bautizo");
                      setNotaDressCode("");
                    } else {
                      setTitulo("Nuestra Boda");
                      setNotaDressCode("Por favor, evitar asistir de color blanco, beige o marfil (reservados para la novia).");
                    }
                  }}
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
                  <option value="crema_lujo">📜 Crema Artesanal</option>
                  <option value="black_tie">🖤 Black Tie (Gala)</option>
                  <option value="fiesta_vip">💜 Fiesta VIP (Neón)</option>
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
                  onChange={(e) => handleNombreChange(e.target.value)}
                  placeholder="ej: Sofía & Carlos"
                  className="w-full px-3.5 py-2.5 border border-[#EAE4D9] rounded-xl text-xs outline-none focus:border-[#D4A39E]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#554E45] block mb-1">Título de la Invitación</label>
                <input
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="ej: Nuestra Boda, Mis XV Años..."
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
                placeholder="Frase inspiracional o dedicatoria..."
                className="w-full px-3.5 py-2.5 border border-[#EAE4D9] rounded-xl text-xs outline-none focus:border-[#D4A39E]"
              />
            </div>
          </div>

          {/* 3. FECHAS Y UBICACIÓN */}
          <div className="space-y-4">
            <h2 className="text-[10px] font-bold uppercase text-[#8A8177] tracking-widest">3. Fechas y Ubicación</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#554E45] block mb-1">Fecha Visible *</label>
                <input
                  required
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  placeholder="ej: Sábado 15 de Noviembre"
                  className="w-full px-3.5 py-2.5 border border-[#EAE4D9] rounded-xl text-xs outline-none focus:border-[#D4A39E]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#554E45] block mb-1">Hora</label>
                <input
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  placeholder="ej: 6:00 PM"
                  className="w-full px-3.5 py-2.5 border border-[#EAE4D9] rounded-xl text-xs outline-none focus:border-[#D4A39E]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#554E45] block mb-1">Fecha Reloj (Cuenta Regresiva)</label>
                <input
                  type="datetime-local"
                  value={fechaIso}
                  onChange={(e) => setFechaIso(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#EAE4D9] rounded-xl text-xs outline-none focus:border-[#D4A39E]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#554E45] block mb-1">Lugar / Salón</label>
                <input
                  value={lugar}
                  onChange={(e) => setLugar(e.target.value)}
                  placeholder="ej: Parroquia San Pedro / Hacienda San José"
                  className="w-full px-3.5 py-2.5 border border-[#EAE4D9] rounded-xl text-xs outline-none focus:border-[#D4A39E]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#554E45] block mb-1">Dirección Completa</label>
                <input
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="ej: Av. Hidalgo #123, Saltillo"
                  className="w-full px-3.5 py-2.5 border border-[#EAE4D9] rounded-xl text-xs outline-none focus:border-[#D4A39E]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#554E45] block mb-1">Link de Google Maps</label>
                <input
                  value={mapa}
                  onChange={(e) => setMapa(e.target.value)}
                  placeholder="https://maps.google.com/..."
                  className="w-full px-3.5 py-2.5 border border-[#EAE4D9] rounded-xl text-xs outline-none focus:border-[#D4A39E]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#554E45] block mb-1">WhatsApp para Confirmar (con lada)</label>
                <input
                  value={waConfirmar}
                  onChange={(e) => setWaConfirmar(e.target.value)}
                  placeholder="ej: 528441234567"
                  className="w-full px-3.5 py-2.5 border border-[#EAE4D9] rounded-xl text-xs outline-none focus:border-[#D4A39E]"
                />
              </div>
            </div>
          </div>

          {/* 4. MULTIMEDIA */}
          <div className="space-y-4">
            <h2 className="text-[10px] font-bold uppercase text-[#8A8177] tracking-widest">4. Fotos y Música</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 border-2 border-dashed border-[#EAE4D9] bg-[#FAF9F6]/60 rounded-2xl text-center space-y-2">
                <ImageIcon className="mx-auto text-[#D4A39E]" size={26} />
                <p className="text-xs font-bold text-[#2E2820]">Foto de Portada</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setHeroFile(e.target.files?.[0] || null)}
                  className="text-xs text-[#7A7267] file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-[#FAF4F0] file:text-[#D4A39E]"
                />
              </div>

              <div className="p-5 border-2 border-dashed border-[#EAE4D9] bg-[#FAF9F6]/60 rounded-2xl text-center space-y-2">
                <Upload className="mx-auto text-[#8E9B8E]" size={26} />
                <p className="text-xs font-bold text-[#2E2820]">Galería de Fotos (Múltiples)</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setGaleriaFiles(Array.from(e.target.files || []))}
                  className="text-xs text-[#7A7267] file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-[#F4F6F4] file:text-[#8E9B8E]"
                />
                {galeriaFiles.length > 0 && (
                  <p className="text-[11px] text-[#8E9B8E] font-bold">✓ {galeriaFiles.length} fotos seleccionadas</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#554E45] block mb-1">Música (.mp3 o link directo)</label>
                <input
                  value={musicaUrl}
                  onChange={(e) => setMusicaUrl(e.target.value)}
                  placeholder="ej: /musica/cancion.mp3 o link directo"
                  className="w-full px-3.5 py-2.5 border border-[#EAE4D9] rounded-xl text-xs outline-none focus:border-[#D4A39E]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#554E45] block mb-1">Mesa de Regalos (Link)</label>
                <input
                  value={mesaRegalos}
                  onChange={(e) => setMesaRegalos(e.target.value)}
                  placeholder="https://amazon.com.mx/..."
                  className="w-full px-3.5 py-2.5 border border-[#EAE4D9] rounded-xl text-xs outline-none focus:border-[#D4A39E]"
                />
              </div>
            </div>
          </div>

          {/* 5. VESTIMENTA E ITINERARIO */}
          <div className="space-y-4">
            <h2 className="text-[10px] font-bold uppercase text-[#8A8177] tracking-widest">5. Vestimenta e Itinerario</h2>

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
                <label className="text-[11px] font-bold text-[#554E45] block mb-1">Nota o Advertencia (Opcional)</label>
                <input
                  value={notaDressCode}
                  onChange={(e) => setNotaDressCode(e.target.value)}
                  placeholder="ej: Evitar color blanco / Calzado cómodo"
                  className="w-full px-3.5 py-2.5 border border-[#EAE4D9] rounded-xl text-xs outline-none focus:border-[#D4A39E]"
                />
                <p className="text-[10px] text-[#A89F91] mt-1">Si queda vacío, la advertencia no se muestra.</p>
              </div>
            </div>

            {/* Itinerario con Emojis */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-[#554E45]">Puntos del Itinerario</label>
                <button
                  type="button"
                  onClick={agregarFilaItinerario}
                  className="text-xs text-[#D4A39E] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={14} /> Añadir actividad
                </button>
              </div>

              {itinerario.map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-3.5 bg-[#FAF9F6] rounded-2xl border border-[#EAE4D9]">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <input
                      value={item.icon || "✨"}
                      onChange={(e) => {
                        const copia = [...itinerario];
                        copia[index].icon = e.target.value;
                        setItinerario(copia);
                      }}
                      className="w-10 h-10 text-center text-xl bg-white border border-[#EAE4D9] rounded-xl outline-none"
                    />
                    <div className="flex items-center gap-1 overflow-x-auto max-w-[160px] p-1 bg-white border border-[#EAE4D9] rounded-xl">
                      {EMOJIS_ITINERARIO.map((em) => (
                        <button
                          key={em}
                          type="button"
                          onClick={() => {
                            const copia = [...itinerario];
                            copia[index].icon = em;
                            setItinerario(copia);
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
                      const copia = [...itinerario];
                      copia[index].h = e.target.value;
                      setItinerario(copia);
                    }}
                    placeholder="Hora (ej: 5:00 PM)"
                    className="w-full sm:w-28 px-3 py-2 bg-white border border-[#EAE4D9] rounded-xl text-xs outline-none"
                  />

                  <input
                    value={item.a}
                    onChange={(e) => {
                      const copia = [...itinerario];
                      copia[index].a = e.target.value;
                      setItinerario(copia);
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
              disabled={loading}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#2E2820] hover:bg-black disabled:bg-slate-300 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
            >
              {loading ? (progreso || "Guardando...") : "Publicar Invitación"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}