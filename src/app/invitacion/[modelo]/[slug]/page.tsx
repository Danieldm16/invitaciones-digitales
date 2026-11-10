"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { CalendarPlus, MessageCircle } from 'lucide-react';

// 1. Configuraciones y Estilos
import { EVENTOS, ESTILOS } from '@/lib/eventos-config';
import { supabase } from '@/lib/supabase';

// 2. Componentes modulares
import { PuertasGala, SobreModal, SobreBotanico } from '@/components/invitacion/Aperturas';
import { CuentaRegresiva } from '@/components/invitacion/CuentaRegresiva';
import { ReproductorMusica } from '@/components/invitacion/ReproductorMusica';
import { GaleriaLookbook } from '@/components/invitacion/GaleriaLookbook';
import { ItinerarioSeccion, DressCodeSeccion } from '@/components/invitacion/DetallesEvento';
import { FormularioRSVP } from '@/components/invitacion/FormularioRSVP';

// =========================================================================
// DICCIONARIO DE TEXTOS E INSIGNIAS POR CATEGORÍA
// =========================================================================
const CONFIG_CATEGORIAS: Record<string, {
  insignia: string;
  tituloCelebracion: string;
  subtituloHeader: string;
  labelItinerario: string;
  textoDefaultFrase: string;
}> = {
  boda: {
    insignia: "⚜",
    tituloCelebracion: "¡Nos Casamos!",
    subtituloHeader: "Nuestra Boda",
    labelItinerario: "Itinerario de Boda",
    textoDefaultFrase: "Con nuestro amor, la presencia de Dios entre nosotros y la bendición de nuestros padres.",
  },
  xv: {
    insignia: "👑",
    tituloCelebracion: "¡Mis XV Años!",
    subtituloHeader: "Mis XV Años",
    labelItinerario: "Itinerario de Gala",
    textoDefaultFrase: "Hay momentos en la vida que son inolvidables, y compartirlos con quienes más quiero los hace eternos.",
  },
  bautizo: {
    insignia: "🕊️",
    tituloCelebracion: "Mi Bautizo",
    subtituloHeader: "Mi Bautizo",
    labelItinerario: "Itinerario Sagrado",
    textoDefaultFrase: "Hoy recibo la bendición de Dios y el amor de toda mi familia.",
  },
  cumple: {
    insignia: "🎉",
    tituloCelebracion: "¡Festejemos Juntos!",
    subtituloHeader: "Mi Cumpleaños",
    labelItinerario: "Lineup & Fiesta",
    textoDefaultFrase: "Acompáñame a cantar, bailar y festejar la vida.",
  },
};

// =========================================================================
// 1. MOTOR BÁSICO ($390 - Papelería sin animaciones)
// =========================================================================
const LayoutBasico = ({ data, estiloActivo }: { data: any, estiloActivo: any }) => {
  const cat = (data.categoria || data.tipo || "boda").toLowerCase();
  const configCat = CONFIG_CATEGORIAS[cat] || CONFIG_CATEGORIAS.boda;
  const insigniaIcono = estiloActivo.id === "verde_olivo" ? "🌿" : configCat.insignia;

  const mensajeWhatsApp = encodeURIComponent(
    `¡Hola! Confirmo con mucho gusto mi asistencia para ${data.nombre} 🎉✨`
  );

  return (
    <div className={`min-h-screen ${estiloActivo.fondo} ${estiloActivo.textoPrincipal} flex justify-center py-0 md:py-8 px-0 md:px-4 ${estiloActivo.fuente} antialiased`}>
      <main className={`w-full max-w-md ${estiloActivo.tarjeta} min-h-screen shadow-2xl relative border-x overflow-hidden pb-16`}>
        
        {/* Cabecera con Foto Enmarcada */}
        <header className="relative pt-10 px-6 pb-6 flex flex-col items-center">
          {data.foto_hero && (
            <div className={`w-[82%] aspect-[3/4] rounded-t-2xl overflow-hidden shadow-xl border-4 ${estiloActivo.bordeAcento || estiloActivo.bordeDorado}`}>
              <img src={data.foto_hero} alt={data.nombre} className="w-full h-full object-cover" />
            </div>
          )}

          <div className={`w-full ${data.foto_hero ? "-mt-10" : "mt-2"} pt-10 pb-6 px-6 ${estiloActivo.tarjeta} rounded-2xl shadow-lg border ${estiloActivo.bordeAcento || estiloActivo.bordeDorado} text-center relative z-10 space-y-2`}>
            <h1 className="text-4xl md:text-5xl italic leading-none">{data.nombre}</h1>
            <p className={`text-[10px] uppercase tracking-[0.35em] ${estiloActivo.acento} font-sans font-medium`}>
              {data.titulo || configCat.subtituloHeader}
            </p>
          </div>
        </header>

        {/* Tarjeta Central de Detalles del Evento */}
        <div className="px-6 py-4 space-y-6">
          <div className={`relative ${estiloActivo.tarjeta} rounded-3xl p-8 pt-12 shadow-md border-2 ${estiloActivo.bordeAcento || estiloActivo.bordeDorado} text-center space-y-6`}>
            
            {/* Medallón Decorativo Dinámico */}
            <div className={`absolute -top-6 left-1/2 -translate-x-1/2 w-13 h-13 rounded-full ${estiloActivo.acentoBg} text-white shadow-md border-2 border-white flex items-center justify-center`}>
              <span className="text-lg">{insigniaIcono}</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-4xl italic">{configCat.tituloCelebracion}</h2>
              <p className={`text-[11px] leading-relaxed uppercase tracking-[0.18em] font-sans font-light px-2 ${estiloActivo.textoSecundario}`}>
                "{data.frase || configCat.textoDefaultFrase}"
              </p>
            </div>

            {/* Fecha y Dirección */}
            <div className="py-6 border-y border-current/15 space-y-3">
              <div className="space-y-1">
                <span className={`text-[10px] uppercase tracking-[0.3em] ${estiloActivo.acento} font-sans font-bold block`}>
                  Fecha
                </span>
                <p className="text-3xl font-serif font-light">
                  {data.fecha}
                </p>
                {data.hora && (
                  <p className={`text-xs uppercase tracking-widest font-sans font-semibold ${estiloActivo.acento}`}>
                    {data.hora}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-current/10 space-y-0.5">
                <p className="font-bold text-base">{data.lugar}</p>
                {data.direccion && (
                  <p className={`text-[11px] tracking-wide font-sans ${estiloActivo.textoSecundario}`}>
                    {data.direccion}
                  </p>
                )}
              </div>
            </div>

            {/* Botón de Google Maps */}
            {data.mapa && (
              <div>
                <a
                  href={data.mapa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-8 py-3 rounded-full border text-xs font-sans font-semibold uppercase tracking-[0.2em] transition-all shadow-xs ${estiloActivo.bordeAcento} ${estiloActivo.acento} hover:opacity-80`}
                >
                  📍 Abrir en Google Maps
                </a>
              </div>
            )}
          </div>

          {/* Botón de Confirmación por WhatsApp */}
          <div className="pt-4 text-center space-y-2">
            <a
              href={`https://wa.me/${data.wa_confirmar}?text=${mensajeWhatsApp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-4.5 rounded-[2rem] font-sans font-bold text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all cursor-pointer"
            >
              <MessageCircle size={18} />
              <span>Confirmar Asistencia</span>
            </a>
            <p className="text-[10px] uppercase tracking-widest font-sans opacity-50 pt-2">
              Te esperamos con mucha alegría
            </p>
          </div>
        </div>

      </main>
    </div>
  );
};

// =========================================================================
// 2. MOTOR MODERADO ($790 - Papelería + Audio + Contador + WhatsApp)
// =========================================================================
const LayoutModerado = ({ data, estiloActivo }: { data: any, estiloActivo: any }) => {
  const [sobreAbierto, setSobreAbierto] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const cat = (data.categoria || data.tipo || "boda").toLowerCase();
  const configCat = CONFIG_CATEGORIAS[cat] || CONFIG_CATEGORIAS.boda;
  const esOscuro = estiloActivo.modoOscuro;
  const insigniaIcono = estiloActivo.id === "verde_olivo" ? "🌿" : configCat.insignia;

  const abrirSobre = () => {
    setSobreAbierto(true);
    if (audioRef.current) {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  const mensajeWhatsApp = encodeURIComponent(
    `¡Hola! Confirmo con mucho gusto mi asistencia para ${data.nombre} 🎉✨`
  );

  return (
    <div className={`min-h-screen ${estiloActivo.fondo} ${estiloActivo.textoPrincipal} flex justify-center py-0 md:py-8 px-0 md:px-4 ${estiloActivo.fuente} antialiased relative`}>
      <ReproductorMusica audioRef={audioRef} playing={playing} toggleAudio={toggleAudio} musicaUrl={data.musica_url} mostrarBarra={false} esOscuro={esOscuro} estilo={estiloActivo} />

      <AnimatePresence mode="wait">
        {!sobreAbierto && (
          estiloActivo.id === "verde_olivo" ? (
            <SobreBotanico alAbrir={abrirSobre} nombre={data.nombre} fecha={data.fecha} />
          ) : (
            <SobreModal alAbrir={abrirSobre} nombre={data.nombre} fecha={data.fecha} estilo={estiloActivo} />
          )
        )}
      </AnimatePresence>

      <main className={`w-full max-w-md ${estiloActivo.tarjeta} min-h-screen shadow-2xl relative border-x overflow-hidden`}>
        <header className="relative pt-10 px-6 pb-6 flex flex-col items-center">
          <div className={`w-[82%] aspect-[3/4] rounded-t-2xl overflow-hidden shadow-xl border-4 ${estiloActivo.bordeAcento || estiloActivo.bordeDorado}`}>
            <img src={data.foto_hero} alt={data.nombre} className="w-full h-full object-cover" />
          </div>
          <div className={`w-full -mt-10 pt-12 pb-6 px-6 ${estiloActivo.tarjeta} rounded-2xl shadow-lg border ${estiloActivo.bordeAcento || estiloActivo.bordeDorado} text-center relative z-10`}>
            <h1 className="text-4xl md:text-5xl italic leading-none">{data.nombre}</h1>
            <p className={`text-[10px] uppercase tracking-[0.35em] ${estiloActivo.acento} mt-3 font-sans font-medium`}>
              {data.titulo || configCat.subtituloHeader}
            </p>
          </div>
        </header>

        <ReproductorMusica audioRef={audioRef} playing={playing} toggleAudio={toggleAudio} musicaUrl={data.musica_url} mostrarBarra={true} esOscuro={esOscuro} estilo={estiloActivo} />

        {/* Tarjeta Central */}
        <section className="px-6 py-6">
          <div className={`relative ${estiloActivo.tarjeta} rounded-2xl p-8 pt-12 shadow-md border-2 ${estiloActivo.bordeAcento || estiloActivo.bordeDorado} text-center space-y-6`}>
            <div className={`absolute -top-6 left-1/2 -translate-x-1/2 w-13 h-13 rounded-full ${estiloActivo.acentoBg} text-white shadow-md border-2 border-white flex items-center justify-center`}>
              <span className="text-lg">{insigniaIcono}</span>
            </div>
            <h2 className="text-4xl italic">{configCat.tituloCelebracion}</h2>
            <p className={`text-[11px] leading-relaxed uppercase tracking-[0.18em] font-sans font-light px-2 ${estiloActivo.textoSecundario}`}>
              "{data.frase || configCat.textoDefaultFrase}"
            </p>
            <div className="py-6 border-y border-current/15 space-y-2">
              <div className="flex items-center justify-center gap-4">
                <span className="text-2xl font-serif font-light">{data.fecha}</span>
              </div>
              <p className={`text-[11px] tracking-[0.2em] uppercase pt-1 font-sans ${estiloActivo.textoSecundario}`}>{data.direccion}</p>
            </div>
          </div>
        </section>

        <CuentaRegresiva fechaISO={data.fechaISO} esOscuro={esOscuro} estilo={estiloActivo} />
        <GaleriaLookbook fotos={data.galeria} esOscuro={esOscuro} estilo={estiloActivo} permitirZoom={false} />
        <ItinerarioSeccion itinerario={data.itinerario} lugarGeneral={data.lugar} mapaGeneral={data.mapa} esOscuro={esOscuro} estilo={estiloActivo} />
        <DressCodeSeccion dressCode={data.dressCode} notaDressCode={data.nota_dress_code} esOscuro={esOscuro} estilo={estiloActivo} conPaleta={false} />

        {/* Confirmación WhatsApp */}
        <section className="px-6 pt-6 pb-20">
          <a
            href={`https://wa.me/${data.wa_confirmar}?text=${mensajeWhatsApp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-5 rounded-[2rem] font-bold shadow-xl active:scale-95 transition-all text-sm cursor-pointer"
          >
            <MessageCircle size={20} /> Confirmar Asistencia
          </a>
        </section>
      </main>
    </div>
  );
};

// =========================================================================
// 3. MOTOR AVANZADO ($1,490 - Lujo + Pases + Supabase RSVP)
// =========================================================================
const LayoutAvanzado = ({ 
  data, 
  pasesTotales, 
  nombreInvitado,
  estiloActivo
}: { 
  data: any, 
  pasesTotales: number, 
  nombreInvitado: string,
  estiloActivo: any
}) => {
  const [aperturaCompletada, setAperturaCompletada] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const cat = (data.categoria || data.tipo || "boda").toLowerCase();
  const configCat = CONFIG_CATEGORIAS[cat] || CONFIG_CATEGORIAS.boda;
  const esOscuro = estiloActivo.modoOscuro;
  const insigniaIcono = estiloActivo.id === "verde_olivo" ? "🌿" : configCat.insignia;

  const abrirInvitacion = () => {
    setAperturaCompletada(true);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
      }
    }, 600);
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  const enlaceGoogleCalendar = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    `${data.titulo || configCat.subtituloHeader} - ${data.nombre}`
  )}&details=${encodeURIComponent(data.frase || "")}&location=${encodeURIComponent(`${data.lugar || ""}, ${data.direccion || ""}`)}`;

  return (
    <div className={`min-h-screen ${estiloActivo.fondo} ${estiloActivo.textoPrincipal} flex justify-center py-0 md:py-8 px-0 md:px-4 ${estiloActivo.fuente} antialiased relative`}>
      <ReproductorMusica audioRef={audioRef} playing={playing} toggleAudio={toggleAudio} musicaUrl={data.musica_url} esOscuro={esOscuro} estilo={estiloActivo} mostrarBarra={false} />

      {/* APERTURA INTELIGENTE SEGÚN ESTILO */}
      <AnimatePresence mode="wait">
        {!aperturaCompletada && (
          estiloActivo.id === "verde_olivo" ? (
            <SobreBotanico 
              alAbrir={abrirInvitacion} 
              nombre={data.nombre} 
              fecha={data.fecha} 
              nombreInvitado={nombreInvitado} 
              pasesTotales={pasesTotales} 
            />
          ) : esOscuro ? (
            <PuertasGala 
              alAbrir={abrirInvitacion} 
              nombre={data.nombre} 
              estilo={estiloActivo} 
            />
          ) : (
            <SobreModal 
              alAbrir={abrirInvitacion} 
              nombre={data.nombre} 
              fecha={data.fecha} 
              nombreInvitado={nombreInvitado} 
              pasesTotales={pasesTotales} 
              estilo={estiloActivo} 
            />
          )
        )}
      </AnimatePresence>

      <main className={`w-full max-w-md ${estiloActivo.tarjeta} min-h-screen shadow-2xl relative border-x overflow-hidden`}>
        <header className="relative pt-10 px-6 pb-6 flex flex-col items-center">
          <div className={`w-[82%] aspect-[3/4] rounded-t-2xl overflow-hidden shadow-xl border-4 ${estiloActivo.bordeAcento || estiloActivo.bordeDorado}`}>
            <img src={data.foto_hero} alt={data.nombre} className="w-full h-full object-cover" />
          </div>
          <div className={`w-full -mt-10 pt-12 pb-6 px-6 ${estiloActivo.tarjeta} rounded-2xl shadow-lg border ${estiloActivo.bordeAcento || estiloActivo.bordeDorado} text-center relative z-10`}>
            <h1 className="text-4xl md:text-5xl italic leading-none">{data.nombre}</h1>
            <p className={`text-[10px] uppercase tracking-[0.35em] ${estiloActivo.acento} mt-3 font-sans font-medium`}>
              {data.titulo || configCat.subtituloHeader}
            </p>
          </div>
        </header>

        <ReproductorMusica audioRef={audioRef} playing={playing} toggleAudio={toggleAudio} musicaUrl={data.musica_url} esOscuro={esOscuro} estilo={estiloActivo} mostrarBarra={true} />

        {/* Tarjeta Central Dinámica */}
        <section className="px-6 py-6">
          <div className={`relative ${estiloActivo.tarjeta} rounded-2xl p-8 pt-12 shadow-md border-2 ${estiloActivo.bordeAcento || estiloActivo.bordeDorado} text-center space-y-6`}>
            <div className={`absolute -top-6 left-1/2 -translate-x-1/2 w-13 h-13 rounded-full ${estiloActivo.acentoBg} text-white shadow-md border-2 border-white flex items-center justify-center`}>
              <span className="text-lg">{insigniaIcono}</span>
            </div>

            <h2 className="text-4xl italic">{configCat.tituloCelebracion}</h2>
            <p className={`text-[11px] leading-relaxed uppercase tracking-[0.18em] font-sans font-light px-2 ${estiloActivo.textoSecundario}`}>
              "{data.frase || configCat.textoDefaultFrase}"
            </p>

            <div className="py-6 border-y border-current/15 space-y-2">
              <div className="flex items-center justify-center gap-4">
                <span className="text-2xl font-serif">{data.fecha}</span>
              </div>
              <p className={`text-[11px] tracking-[0.2em] uppercase pt-1 font-sans ${estiloActivo.textoSecundario}`}>
                {data.direccion}
              </p>
            </div>

            <a
              href={enlaceGoogleCalendar}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full border text-xs font-sans font-semibold tracking-wider transition-all shadow-xs ${estiloActivo.bordeAcento || estiloActivo.bordeDorado} ${estiloActivo.acento} hover:opacity-80`}
            >
              <CalendarPlus size={16} /> Agendar en Google Calendar
            </a>
          </div>
        </section>

        <CuentaRegresiva fechaISO={data.fechaISO} esOscuro={esOscuro} estilo={estiloActivo} />
        <GaleriaLookbook fotos={data.galeria} esOscuro={esOscuro} estilo={estiloActivo} permitirZoom={true} />
        <ItinerarioSeccion itinerario={data.itinerario} lugarGeneral={data.lugar} mapaGeneral={data.mapa} esOscuro={esOscuro} estilo={estiloActivo} />
        <DressCodeSeccion dressCode={data.dressCode} notaDressCode={data.nota_dress_code} esOscuro={esOscuro} estilo={estiloActivo} conPaleta={true} />

        {/* Regalos */}
        {data.mesa_regalos && (
          <section className="px-6 py-4">
            <div className={`${estiloActivo.tarjeta} rounded-2xl p-6 shadow-md border ${estiloActivo.bordeAcento || estiloActivo.bordeDorado} text-center space-y-4`}>
              <h4 className={`text-2xl italic ${estiloActivo.acento}`}>Mesa de Regalos</h4>
              <p className={`text-[11px] leading-relaxed uppercase tracking-[0.15em] font-sans ${estiloActivo.textoSecundario}`}>
                Su compañía es lo más importante. Si deseas hacernos algún obsequio, lo recibiremos con mucho cariño.
              </p>
              <a href={data.mesa_regalos} target="_blank" rel="noopener noreferrer" className={`inline-block px-8 py-3 border text-xs uppercase tracking-[0.2em] rounded-full transition-all font-sans font-semibold ${estiloActivo.bordeAcento || estiloActivo.bordeDorado} ${estiloActivo.acento} hover:opacity-80`}>
                Ver Lista
              </a>
            </div>
          </section>
        )}

        <FormularioRSVP idSupabase={data.id_supabase} pasesTotales={pasesTotales} nombreInvitado={nombreInvitado} esOscuro={esOscuro} estilo={estiloActivo} />
      </main>
    </div>
  );
};

// =========================================================================
// CONTROLADOR PRINCIPAL
// =========================================================================
function InvitacionDinamica() {
  const params = useParams();
  const searchParams = useSearchParams();

  const modelo = params.modelo as string;
  const slug = params.slug as string;
  const pases = parseInt(searchParams.get('p') || '2');
  const invitado = searchParams.get('invitado') || '';
  const estiloParam = searchParams.get('estilo');

  const [eventoData, setEventoData] = useState<any>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function obtenerEvento() {
      setCargando(true);
      const { data: dbData } = await supabase
        .from('eventos')
        .select('*')
        .eq('slug', slug)
        .eq('activo', true)
        .single();

      if (dbData) {
        setEventoData({
          ...dbData,
          fechaISO: dbData.fecha_iso,
          wa_confirmar: dbData.wa_confirmar,
          foto_hero: dbData.foto_hero,
          mesa_regalos: dbData.mesa_regalos,
          musica_url: dbData.musica_url,
          dressCode: dbData.dress_code,
          nota_dress_code: dbData.nota_dress_code,
          itinerario: dbData.itinerario || [],
          galeria: dbData.galeria || []
        });
      } else {
        // @ts-ignore
        setEventoData(EVENTOS[slug] || null);
      }
      setCargando(false);
    }

    if (slug) obtenerEvento();
  }, [slug]);

  useEffect(() => {
    if (eventoData) {
      document.title = `${eventoData.nombre} • ${eventoData.titulo || "Invitación"} | Nuestra Invitación`;
    }
  }, [eventoData]);

  if (cargando) {
    return (
      <div className="min-h-screen bg-[#F7F4EE] flex items-center justify-center font-serif text-sm text-[#73634B]">
        Cargando invitación...
      </div>
    );
  }

  if (!eventoData) {
    return (
      <div className="p-20 text-center font-bold text-red-500 bg-black min-h-screen flex items-center justify-center font-sans">
        Error: Invitación no encontrada o inactiva.
      </div>
    );
  }

  // Resolver estilo visual activo dinámicamente
  const estiloClave = estiloParam || eventoData.estilo_visual || eventoData.estiloVisual || "crema_lujo";
  // @ts-ignore
  const estiloActivo = ESTILOS[estiloClave] || ESTILOS.crema_lujo;

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F4EE] flex items-center justify-center font-serif">Cargando invitación...</div>}>
      {modelo === 'basica' && <LayoutBasico data={eventoData} estiloActivo={estiloActivo} />}
      {modelo === 'moderada' && <LayoutModerado data={eventoData} estiloActivo={estiloActivo} />}
      {modelo === 'avanzada' && (
        <LayoutAvanzado 
          data={eventoData} 
          pasesTotales={pases} 
          nombreInvitado={invitado} 
          estiloActivo={estiloActivo}
        />
      )}
    </Suspense>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F4EE] flex items-center justify-center">Cargando...</div>}>
      <InvitacionDinamica />
    </Suspense>
  );
}