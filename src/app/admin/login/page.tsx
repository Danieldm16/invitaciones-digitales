"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (error) {
      setErrorMsg("Credenciales incorrectas. Verifica tu correo y contraseña.");
      setLoading(false);
    } else {
      // Redirigir al dashboard administrativo
      router.push('/admin');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-center items-center p-6 font-sans antialiased text-slate-800">
      
      <div className="w-full max-w-md space-y-8">
        
        {/* Logo / Cabecera */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-4 rounded-3xl bg-white shadow-sm border border-slate-200/80 mb-2">
            <Lock className="text-[#D4A39E]" size={28} />
          </div>
          <h1 className="text-3xl font-serif italic text-slate-900">
            Nuestra<span className="text-[#D4A39E]">Invitacion</span>
          </h1>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400 font-bold">
            Acceso Exclusivo de Equipo
          </p>
        </div>

        {/* Tarjeta de Login */}
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-200/80 space-y-6">
          
          <form onSubmit={handleLogin} className="space-y-5">
            {errorMsg && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-xs text-red-600 font-medium">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Correo Electrónico
              </label>
              <div className="relative flex items-center">
                <Mail size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nuestrainvitacion.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#D4A39E] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Contraseña
              </label>
              <div className="relative flex items-center">
                <Lock size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#D4A39E] focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-slate-900 hover:bg-black text-white text-xs uppercase tracking-widest font-bold transition-all shadow-md active:scale-95 disabled:bg-slate-300 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? "Verificando..." : "Ingresar al Panel"}
              {!loading && <ArrowRight size={15} />}
            </button>
          </form>

        </div>

        <p className="text-center text-[11px] text-slate-400">
          ¿Olvidaste tu acceso? Contacta al administrador técnico.
        </p>

      </div>
    </div>
  );
}