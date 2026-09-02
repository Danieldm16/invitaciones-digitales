"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { EVENTOS } from '@/lib/eventos-config';
import { Users, Utensils, Baby, Download, RefreshCw } from 'lucide-react';

function AdminContent() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('id') || 'mateo_5'; // Por defecto busca a mateo
  
  // Buscamos los datos del evento en nuestro archivo de configuración
  // @ts-ignore
  const data = EVENTOS[eventId]; 

  const [confirmados, setConfirmados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data) fetchConfirmados();
  }, [data]);

  async function fetchConfirmados() {
    setLoading(true);
    const { data: res, error } = await supabase
      .from('confirmaciones')
      .select('*')
      .eq('evento', data.id_supabase) // Filtra usando el ID de Supabase del config
      .order('created_at', { ascending: false });

    if (!error) setConfirmados(res || []);
    setLoading(false);
  }

  if (!data) return <div className="p-10 text-center text-red-500 font-bold">Evento no encontrado en la configuración.</div>;

  // Cálculos dinámicos
  const totalAdultos = confirmados.reduce((acc, inv) => acc + (inv.adultos || 0), 0);
  const totalNinos = confirmados.reduce((acc, inv) => acc + (inv.ninos || 0), 0);

  return (
    <div className={`min-h-screen bg-slate-50 p-6 ${data.tema.fuente}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Panel de Control</h1>
                <p className="text-slate-500">Gestionando: <span className={data.tema.acento}>{data.nombre} - {data.titulo}</span></p>
            </div>
            <button 
                onClick={fetchConfirmados}
                className="p-2 bg-white border rounded-lg hover:bg-slate-100 transition-colors"
            >
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
        </div>

        {/* Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <Users className="text-blue-500 mb-2" />
            <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Adultos</p>
            <p className="text-3xl font-black text-slate-800">{totalAdultos}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <Baby className="text-pink-500 mb-2" />
            <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Niños</p>
            <p className="text-3xl font-black text-slate-800">{totalNinos}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <Utensils className="text-orange-500 mb-2" />
            <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Total Grupos</p>
            <p className="text-3xl font-black text-slate-800">{confirmados.length}</p>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800 text-white">
                <th className="p-4 text-[10px] uppercase tracking-widest">Invitado</th>
                <th className="p-4 text-[10px] uppercase tracking-widest text-center">Adultos</th>
                <th className="p-4 text-[10px] uppercase tracking-widest text-center">Niños</th>
                <th className="p-4 text-[10px] uppercase tracking-widest">Notas / Alergias</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {confirmados.map((inv) => (
                <tr key={inv.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="p-4 font-bold text-slate-700">{inv.nombre}</td>
                  <td className="p-4 text-center font-medium">{inv.adultos}</td>
                  <td className="p-4 text-center font-medium">{inv.ninos}</td>
                  <td className="p-4 text-sm text-slate-500 italic">{inv.alergias || 'Sin notas'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {confirmados.length === 0 && !loading && (
            <div className="p-20 text-center text-slate-400 italic">No hay confirmaciones todavía.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
    return <Suspense><AdminContent /></Suspense>
}