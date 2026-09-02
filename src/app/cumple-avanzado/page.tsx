"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Gift, Users, CheckCircle2, Music, Clock, MessageCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { EVENTOS } from '@/lib/eventos-config';

function InvitacionContent() {
  const searchParams = useSearchParams();
  const data = EVENTOS.irma_cumple;
  const tema = data.tema;

  const pasesTotales = parseInt(searchParams.get('p') || '3');
  const [adultos, setAdultos] = useState(1);
  const [ninos, setNinos] = useState(0);
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ dias: 0, horas: 0, min: 0, seg: 0 });

  const total = adultos + ninos;
  const cupoExcedido = total > pasesTotales;

  // Lógica del Reloj
  useEffect(() => {
    const targetDate = new Date(data.fechaISO).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance < 0) { clearInterval(interval); return; }
      setTimeLeft({
        dias: Math.floor(distance / (1000 * 60 * 60 * 24)),
        horas: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        min: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seg: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [data.fechaISO]);

  const handleConfirmacion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(cupoExcedido) return;
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      nombre: formData.get('nombre'),
      adultos, ninos,
      alergias: formData.get('alergias'),
      evento: data.id_supabase
    };
    const { error } = await supabase.from('confirmaciones').insert([payload]);
    if(!error) setEnviado(true);
    setLoading(false);
  };

  return (
    <div className={`min-h-screen ${tema.fondo} ${tema.fuente} pb-20`}>
      {/* Hero Pro */}
      <section className="relative h-[60vh] flex items-center justify-center text-center">
        <img src={data.foto_hero} className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
        <div className="relative z-10 text-white px-6">
          <h2 className="text-amber-400 tracking-[0.5em] text-xs uppercase mb-4">Vip Event</h2>
          <h1 className="text-7xl font-bold mb-4">{data.nombre}</h1>
          <p className="text-xl italic font-light italic">"{data.frase}"</p>
        </div>
      </section>

      {/* Reloj Pro */}
      <div className="max-w-md mx-auto -mt-12 relative z-20 px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 flex justify-around text-center border border-slate-100">
           {Object.entries(timeLeft).map(([label, val]) => (
            <div key={label}>
              <p className="text-3xl font-bold text-black">{val}</p>
              <p className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detalles del Evento */}
      <div className="max-w-md mx-auto mt-20 px-8 space-y-16 text-center text-slate-700">
        <div>
          <Calendar className="mx-auto mb-4 text-amber-500" size={32} />
          <h3 className="text-2xl font-bold">{data.fecha}</h3>
          <p className="text-slate-500 uppercase tracking-widest text-xs mt-2">A las {data.hora}</p>
        </div>

        <div>
          <MapPin className="mx-auto mb-4 text-amber-500" size={32} />
          <h4 className="text-xl font-bold">{data.lugar}</h4>
          <p className="text-slate-500 text-sm mb-6">{data.direccion}</p>
          <a href={data.mapa} target="_blank" className="inline-block border-2 border-black text-black px-10 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all">
            Ver Ubicación
          </a>
        </div>

        {/* Mesa de Regalos */}
        <div className="bg-slate-100/50 p-10 rounded-[3rem] border border-slate-200">
            <Gift className="mx-auto mb-4 text-slate-400" />
            <h4 className="font-bold mb-2">Mesa de Regalos</h4>
            <p className="text-sm text-slate-500 mb-6">Si deseas tener un detalle, puedes encontrar nuestra mesa aquí:</p>
            <a href={data.mesa_regalos} className="block w-full bg-slate-800 text-white py-4 rounded-2xl font-bold text-sm">Amazon Wishlist</a>
        </div>

        {/* Formulario RSVP Avanzado */}
        <div id="rsvp" className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 text-left">
            <div className="text-center mb-8">
                <Users className="mx-auto mb-2 text-slate-300" />
                <h3 className="text-3xl font-bold">R.S.V.P.</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Pases: {pasesTotales}</p>
            </div>

            <AnimatePresence mode="wait">
            {!enviado ? (
                <form onSubmit={handleConfirmacion} className="space-y-6">
                <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Nombre Completo</label>
                    <input required name="nombre" className="w-full border-b-2 py-2 outline-none focus:border-amber-500 transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Adultos</label>
                    <select value={adultos} onChange={(e)=>setAdultos(parseInt(e.target.value))} className="w-full border-b-2 py-2 bg-transparent">
                        {[...Array(pasesTotales+1)].map((_,i)=>(<option key={i} value={i}>{i}</option>))}
                    </select>
                    </div>
                    <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Niños</label>
                    <select value={ninos} onChange={(e)=>setNinos(parseInt(e.target.value))} className="w-full border-b-2 py-2 bg-transparent">
                        {[...Array(pasesTotales+1)].map((_,i)=>(<option key={i} value={i}>{i}</option>))}
                    </select>
                    </div>
                </div>
                
                <button 
                    disabled={loading || cupoExcedido || total === 0} 
                    className={`w-full py-5 rounded-2xl font-bold text-white shadow-xl transition-all ${cupoExcedido ? 'bg-red-200 text-red-500' : 'bg-black active:scale-95'}`}
                >
                    {loading ? "Registrando..." : cupoExcedido ? "Límite excedido" : "Confirmar Ahora"}
                </button>
                </form>
            ) : (
                <div className="text-center py-10">
                    <CheckCircle2 size={60} className="mx-auto text-green-500 mb-4" />
                    <p className="font-bold text-xl uppercase tracking-tighter">¡Registro Exitoso!</p>
                    <p className="text-slate-500 text-sm">Te esperamos con alegría.</p>
                </div>
            )}
            </AnimatePresence>
        </div>
      </div>
      
      {/* Música flotante */}
      <button className="fixed bottom-8 right-8 p-4 bg-black text-white rounded-full shadow-2xl z-50">
        <Music size={24} />
      </button>
    </div>
  );
}

export default function Page() {
    return <Suspense><InvitacionContent /></Suspense>
}