"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { CalendarPlus, MessageCircle, Sparkles, PartyPopper, Music2, CheckCircle2 } from 'lucide-react';

// 1. Configuraciones y Estilos
import { EVENTOS, ESTILOS } from '@/lib/eventos-config';
import { supabase } from '@/lib/supabase';

// 2. Componentes modulares
import { PuertasGala, SobreModal } from '@/components/invitacion/Aperturas';
import { CuentaRegresiva } from '@/components/invitacion/CuentaRegresiva';
import { ReproductorMusica } from '@/components/invitacion/ReproductorMusica';
import { GaleriaLookbook } from '@/components/invitacion/GaleriaLookbook';
import { ItinerarioSeccion, DressCodeSeccion } from '@/components/invitacion/DetallesEvento';
import { FormularioRSVP } from '@/components/invitacion/FormularioRSVP';

// =========================================================================
// 1. MOTOR BÁSICO ($590)
// =========================================================================
const LayoutBasico = ({ data }: { data: any }) => {
  const tema = data.tema || ESTILOS.crema_lujo;
  return (
    <div className={`min-h-screen ${tema.fondo} flex items-center justify-center p-4 ${tema.fuente}`}>
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 text-center text-slate-800">
        <div className="h-64 relative">
          <img src={data.foto_hero} className="w-full h-full object-cover" alt={data.nombre} />
          <div className={`absolute bottom-0 left-0 right-0 h-1 ${tema.acentoBg} opacity-50`} />
        </div>
        <div className="p-8">
          <h2 className={`text-xs uppercase tracking-[0.3em] ${tema.acento} font-bold mb-2`}>{data.titulo}</h2>
          <h1 className="text-4xl font-black mb-4">{data.nombre}</h1>
          <p className="text-slate-500 italic mb-8">"{data.frase}"</p>
          <div className="bg-slate-50 p-6 rounded-2xl text-left space-y-3 mb-8 text-slate-600 border border-slate-100">
            <p>📅 <strong>{data.fecha}</strong></p>
            <p>📍 {data.lugar}</p>
          </div>
          <div className="space-y-3">
            <a href={data.mapa} target="_blank" rel="noopener noreferrer" className="block w-full bg-[#C5A880] text-white py-4 rounded-xl font-bold transition-all">
              📍 Ver Mapa
            </a>
            <a href={`https://wa.me/${data.wa_confirmar}`} target="_blank" rel="noopener noreferrer" className="block w-full bg-[#25D366] text-white py-4 rounded-xl font-bold">
              ✅ Confirmar WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 2. MOTOR MODERADO ($950)
// =========================================================================
const LayoutModerado = ({ data }: { data: any }) => {
  const tema = data.tema || ESTILOS.crema_lujo;
  const [sobreAbierto, setSobreAbierto] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const esBoda = data.tipo === "boda";
  const encabezadoFestejo = esBoda ? "¡Nos Casamos!" : data.tipo === "xv" ? "¡Mis XV Años!" : "¡Festejemos!";

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
    esBoda
      ? `¡Hola! Confirmo con mucho gusto mi asistencia a la boda de ${data.nombre} 💍✨`
      : `¡Hola ${data.nombre}! Confirmo mi asistencia a tu evento 🎉`
  );

  // Cumpleaños Moderado
  if (!esBoda) {
    return (
      <div className={`min-h-screen ${tema.fondo} ${tema.fuente} pb-20 antialiased`}>
        <ReproductorMusica audioRef={audioRef} playing={playing} toggleAudio={toggleAudio} musicaUrl={data.musica_url} mostrarBarra={false} />
        
        <header className="relative h-[50vh]">
          <img src={data.foto_hero} className="w-full h-full object-cover" alt={data.nombre} />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
            <div className="text-center px-4">
              <h1 className="text-5xl font-black mb-2 tracking-tighter drop-shadow-md">{data.nombre}</h1>
              <p className="uppercase tracking-[0.4em] text-sm font-medium opacity-90">{data.titulo}</p>
            </div>
          </div>
        </header>

        <main className="max-w-md mx-auto -mt-10 relative z-10 px-4 space-y-8">
          <CuentaRegresiva fechaISO={data.fechaISO} variante="fiesta" />
          <GaleriaLookbook fotos={data.galeria} permitirZoom={false} />
          
          <a
            href={`https://wa.me/${data.wa_confirmar}?text=${mensajeWhatsApp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-5 rounded-[2rem] font-bold shadow-xl active:scale-95 transition-all text-sm"
          >
            <MessageCircle size={20} /> Confirmar Asistencia
          </a>
        </main>
      </div>
    );
  }

  // Boda / Evento Elegante Moderado
  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#33302C] flex justify-center py-0 md:py-8 px-0 md:px-4 font-serif antialiased selection:bg-[#C5A880] selection:text-white relative">
      <ReproductorMusica audioRef={audioRef} playing={playing} toggleAudio={toggleAudio} musicaUrl={data.musica_url} mostrarBarra={false} />

      <AnimatePresence mode="wait">
        {!sobreAbierto && (
          <SobreModal alAbrir={abrirSobre} nombre={data.nombre} fecha={data.fecha} />
        )}
      </AnimatePresence>

      <main className="w-full max-w-md bg-[#FAF8F5] min-h-screen shadow-2xl relative border-x border-[#EBE4D8] overflow-hidden">
        <header className="relative pt-10 px-6 pb-6 flex flex-col items-center bg-gradient-to-b from-[#EFE8DA] to-[#FAF8F5]">
          <div className="w-[82%] aspect-[3/4] rounded-t-2xl overflow-hidden shadow-xl border-4 border-white bg-white">
            <img src={data.foto_hero} alt={data.nombre} className="w-full h-full object-cover" />
          </div>
          <div className="w-full -mt-10 pt-12 pb-6 px-6 bg-[#E3D4B6] rounded-2xl shadow-lg border border-[#D1BE99] text-center relative z-10">
            <h1 className="text-4xl md:text-5xl italic text-[#3F372C] leading-none">{data.nombre}</h1>
            {/* Título dinámico en lugar de "Nuestra Boda" */}
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#73634B] mt-3 font-sans font-medium">
              {data.titulo}
            </p>
          </div>
        </header>

        <ReproductorMusica audioRef={audioRef} playing={playing} toggleAudio={toggleAudio} musicaUrl={data.musica_url} mostrarBarra={true} />

        {/* Tarjeta con encabezado dinámico */}
        <section className="px-6 py-6">
          <div className="relative bg-white rounded-2xl p-8 pt-12 shadow-md border-2 border-[#D4AF37]/35 text-center space-y-6">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-13 h-13 rounded-full bg-gradient-to-br from-[#E2B755] via-[#C99C35] to-[#997316] shadow-md border-2 border-white flex items-center justify-center">
              <span className="text-white text-lg">⚜</span>
            </div>
            <h2 className="text-4xl italic text-[#2E2820]">{encabezadoFestejo}</h2>
            <p className="text-[11px] leading-relaxed uppercase tracking-[0.18em] text-[#696156] font-sans font-light px-2">"{data.frase}"</p>
            <div className="py-6 border-y border-[#EBE4D8] space-y-2">
              <div className="flex items-center justify-center gap-4 text-[#2E2820]">
                <span className="text-2xl font-serif font-light">{data.fecha}</span>
              </div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#8F867A] pt-1 font-sans">{data.direccion}</p>
            </div>
          </div>
        </section>

        <CuentaRegresiva fechaISO={data.fechaISO} esOscuro={false} />
        <GaleriaLookbook fotos={data.galeria} esOscuro={false} permitirZoom={false} />
        <ItinerarioSeccion itinerario={data.itinerario} lugar={data.lugar} mapa={data.mapa} esOscuro={false} />
        <DressCodeSeccion dressCode={data.dressCode} notaDressCode={data.nota_dress_code} esOscuro={false} conPaleta={false} />

        {/* Confirmación WhatsApp */}
        <section className="px-6 pt-6 pb-20">
          <a
            href={`https://wa.me/${data.wa_confirmar}?text=${mensajeWhatsApp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-5 rounded-[2rem] font-bold shadow-xl active:scale-95 transition-all text-sm"
          >
            <MessageCircle size={20} /> Confirmar Asistencia
          </a>
        </section>
      </main>
    </div>
  );
};

// =========================================================================
// 3. MOTOR AVANZADO ($1,490)
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

  const esBoda = data.tipo === "boda";
  const esOscuro = estiloActivo.modoOscuro;
  const encabezadoFestejo = esBoda ? "¡Nos Casamos!" : data.tipo === "xv" ? "¡Mis XV Años!" : "¡Festejemos Juntos!";

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
    `${data.titulo} - ${data.nombre}`
  )}&details=${encodeURIComponent(data.frase || "")}&location=${encodeURIComponent(`${data.lugar || ""}, ${data.direccion || ""}`)}`;

  // Cumpleaños Avanzado (Fiesta VIP)
  if (!esBoda) {
    return (
      <div className="min-h-screen bg-[#0A0713] text-[#F3EFE6] font-sans antialiased pb-24 selection:bg-[#8B5CF6] selection:text-white relative">
        <ReproductorMusica audioRef={audioRef} playing={playing} toggleAudio={toggleAudio} musicaUrl={data.musica_url} mostrarBarra={false} />

        <header className="relative h-[65vh] flex items-center justify-center text-center overflow-hidden">
          <img src={data.foto_hero} className="absolute inset-0 w-full h-full object-cover opacity-50" alt={data.nombre} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#0A0713]/40 to-[#0A0713]" />
          <div className="relative z-10 p-6 space-y-4 max-w-md">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#A78BFA] text-[11px] font-bold tracking-widest uppercase">
              <Sparkles size={14} /> Fiesta VIP Exclusiva
            </div>
            <h1 className="text-6xl font-black tracking-tight text-white drop-shadow-2xl">{data.nombre}</h1>
            <p className="text-2xl font-light text-[#C4B5FD] tracking-wide">{data.titulo}</p>
            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent mx-auto" />
            <p className="text-sm font-semibold tracking-widest uppercase text-white/80">{data.fecha} • {data.hora}</p>
          </div>
        </header>

        <main className="max-w-md mx-auto px-6 space-y-12 -mt-10 relative z-20">
          <div className="bg-[#140F24] border border-[#8B5CF6]/40 rounded-3xl p-8 text-center space-y-3 shadow-lg">
            <PartyPopper className="mx-auto text-[#A78BFA]" size={30} />
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#A78BFA] font-bold">
              {nombreInvitado ? `Acceso VIP: ${nombreInvitado.replace('+', ' ')}` : "Pase VIP Personalizado"}
            </p>
            <h3 className="text-2xl font-black text-white">Tienes {pasesTotales} {pasesTotales === 1 ? 'acceso reservado' : 'accesos reservados'}</h3>
          </div>

          <CuentaRegresiva fechaISO={data.fechaISO} variante="fiesta" />
          <GaleriaLookbook fotos={data.galeria} permitirZoom={true} />
          <ItinerarioSeccion itinerario={data.itinerario} lugar={data.lugar} mapa={data.mapa} esOscuro={true} />

          <div className="text-center space-y-5">
            <p className="italic text-base text-[#D1D5DB] px-4">"{data.frase}"</p>
            <a href={enlaceGoogleCalendar} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#8B5CF6] text-white text-xs font-bold tracking-widest uppercase transition-all shadow-lg active:scale-95">
              <CalendarPlus size={16} /> Agendar en Google Calendar
            </a>
          </div>

          <FormularioRSVP idSupabase={data.id_supabase} pasesTotales={pasesTotales} nombreInvitado={nombreInvitado} esOscuro={true} />
        </main>
      </div>
    );
  }

  // Boda / Evento Avanzado (Crema vs Black Tie)
  return (
    <div className={`min-h-screen ${esOscuro ? "bg-[#080808]" : "bg-[#F7F4EE]"} flex justify-center py-0 md:py-8 px-0 md:px-4 font-serif antialiased selection:bg-[#C5A880] selection:text-white relative`}>
      <ReproductorMusica audioRef={audioRef} playing={playing} toggleAudio={toggleAudio} musicaUrl={data.musica_url} esOscuro={esOscuro} mostrarBarra={false} />

      <AnimatePresence mode="wait">
        {!aperturaCompletada && (
          esOscuro ? (
            <PuertasGala alAbrir={abrirInvitacion} nombre={data.nombre} />
          ) : (
            <SobreModal alAbrir={abrirInvitacion} nombre={data.nombre} fecha={data.fecha} nombreInvitado={nombreInvitado} pasesTotales={pasesTotales} />
          )
        )}
      </AnimatePresence>

      <main className={`w-full max-w-md ${esOscuro ? "bg-[#121110] border-[#C5A880]/30 text-[#F3EFE6]" : "bg-[#FAF8F5] border-[#EBE4D8] text-[#33302C]"} min-h-screen shadow-2xl relative border-x overflow-hidden`}>
        <header className={`relative pt-10 px-6 pb-6 flex flex-col items-center ${esOscuro ? "bg-gradient-to-b from-[#1C1A17] to-[#121110]" : "bg-gradient-to-b from-[#EFE8DA] to-[#FAF8F5]"}`}>
          <div className={`w-[82%] aspect-[3/4] rounded-t-2xl overflow-hidden shadow-xl border-4 ${esOscuro ? "border-[#222] bg-[#141414]" : "border-white bg-white"}`}>
            <img src={data.foto_hero} alt={data.nombre} className="w-full h-full object-cover" />
          </div>
          <div className={`w-full -mt-10 pt-12 pb-6 px-6 ${esOscuro ? "bg-[#1E1B17] border-[#C5A880]/30 text-[#FAF8F5]" : "bg-[#E3D4B6] border-[#D1BE99] text-[#3F372C]"} rounded-2xl shadow-lg border text-center relative z-10`}>
            <h1 className="text-4xl md:text-5xl italic leading-none">{data.nombre}</h1>
            {/* Título dinámico en lugar de "Nuestra Boda" */}
            <p className={`text-[10px] uppercase tracking-[0.35em] ${esOscuro ? "text-[#D4AF37]" : "text-[#73634B]"} mt-3 font-sans font-medium`}>
              {data.titulo}
            </p>
          </div>
        </header>

        <ReproductorMusica audioRef={audioRef} playing={playing} toggleAudio={toggleAudio} musicaUrl={data.musica_url} esOscuro={esOscuro} mostrarBarra={true} />

        {/* Tarjeta dinámica */}
        <section className="px-6 py-6">
          <div className={`relative ${esOscuro ? "bg-[#181614] border-[#D4AF37]/35" : "bg-white border-[#D4AF37]/35"} rounded-2xl p-8 pt-12 shadow-md border-2 text-center space-y-6`}>
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-13 h-13 rounded-full bg-gradient-to-br from-[#E2B755] via-[#C99C35] to-[#997316] shadow-md border-2 border-white flex items-center justify-center">
              <span className="text-white text-lg">⚜</span>
            </div>

            <h2 className={`text-4xl italic ${esOscuro ? "text-[#FAF8F5]" : "text-[#2E2820]"}`}>{encabezadoFestejo}</h2>
            <p className={`text-[11px] leading-relaxed uppercase tracking-[0.18em] ${esOscuro ? "text-[#D9CEBA]" : "text-[#696156]"} font-sans font-light px-2`}>
              "{data.frase}"
            </p>

            <div className={`py-6 border-y ${esOscuro ? "border-[#C5A880]/20" : "border-[#EBE4D8]"} space-y-2`}>
              <div className="flex items-center justify-center gap-4 text-[#2E2820]">
                <span className={`text-2xl font-serif ${esOscuro ? "text-[#FAF8F5]" : "text-[#2E2820]"}`}>{data.fecha}</span>
              </div>
              <p className={`text-[11px] tracking-[0.2em] uppercase ${esOscuro ? "text-[#A89F91]" : "text-[#8F867A]"} pt-1 font-sans`}>
                {data.direccion}
              </p>
            </div>

            <a
              href={enlaceGoogleCalendar}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full ${esOscuro ? "bg-[#1C1A17] border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black" : "bg-[#FAF6EE] border-[#C5A880] text-[#7A623A] hover:bg-[#C5A880] hover:text-white"} border text-xs font-sans font-semibold tracking-wider transition-all shadow-xs`}
            >
              <CalendarPlus size={16} /> Agendar en Google Calendar
            </a>
          </div>
        </section>

        <CuentaRegresiva fechaISO={data.fechaISO} esOscuro={esOscuro} />
        <GaleriaLookbook fotos={data.galeria} esOscuro={esOscuro} permitirZoom={true} />
        <ItinerarioSeccion itinerario={data.itinerario} lugar={data.lugar} mapa={data.mapa} esOscuro={esOscuro} />
        <DressCodeSeccion dressCode={data.dressCode} notaDressCode={data.nota_dress_code} esOscuro={esOscuro} conPaleta={true} />

        {/* Regalos */}
        <section className="px-6 py-4">
          <div className={`${esOscuro ? "bg-[#181614] border-[#EBE4D8]/10" : "bg-white border-[#EBE4D8]"} rounded-2xl p-6 shadow-md border text-center space-y-4`}>
            <h4 className={`text-2xl italic ${esOscuro ? "text-[#D4AF37]" : "text-[#C5A880]"}`}>Regalos</h4>
            <p className={`text-[11px] leading-relaxed uppercase tracking-[0.15em] ${esOscuro ? "text-[#D9CEBA]" : "text-[#696156]"} font-sans`}>
              Su compañía es lo más importante. Si deseas hacernos algún obsequio, lo recibiremos con mucho cariño.
            </p>
            <a href={data.mesa_regalos} target="_blank" rel="noopener noreferrer" className={`inline-block px-8 py-3 border ${esOscuro ? "border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black" : "border-[#C5A880] text-[#8A6F48] hover:bg-[#C5A880]/10"} text-xs uppercase tracking-[0.2em] rounded-full transition-all font-sans font-semibold`}>
              Ver Lista
            </a>
          </div>
        </section>

        <FormularioRSVP idSupabase={data.id_supabase} pasesTotales={pasesTotales} nombreInvitado={nombreInvitado} esOscuro={esOscuro} />
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

  // Actualiza el título de la pestaña del navegador automáticamente
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

  const estiloActivo = (estiloParam && ESTILOS[estiloParam as keyof typeof ESTILOS]) 
    ? ESTILOS[estiloParam as keyof typeof ESTILOS] 
    : (eventoData.tema || (eventoData.estilo_visual && ESTILOS[eventoData.estilo_visual as keyof typeof ESTILOS]) || ESTILOS.crema_lujo);

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F4EE] flex items-center justify-center font-serif">Cargando invitación...</div>}>
      {modelo === 'basica' && <LayoutBasico data={eventoData} />}
      {modelo === 'moderada' && <LayoutModerado data={eventoData} />}
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