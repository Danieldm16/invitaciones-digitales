"use client";

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LogOut, User } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [autenticado, setAutenticado] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const esPaginaLogin = pathname === '/admin/login';

  useEffect(() => {
    async function verificarSesion() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setAutenticado(false);
        // Si no hay sesión y no estamos en login, expulsar a login
        if (!esPaginaLogin) {
          router.replace('/admin/login');
        }
      } else {
        setAutenticado(true);
        setUserEmail(session.user.email || null);
        // Si ya está logueado e intenta entrar a login, mandar al dashboard
        if (esPaginaLogin) {
          router.replace('/admin');
        }
      }
      setCargando(false);
    }

    verificarSesion();

    // Escuchar cambios de sesión (ej. si cierra sesión en otra pestaña)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && !esPaginaLogin) {
        router.replace('/admin/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname, esPaginaLogin, router]);

  // Si estamos en la página de login, mostramos solo la pantalla de login sin barra superior
  if (esPaginaLogin) {
    return <>{children}</>;
  }

  // Pantalla de carga mientras se valida la sesión
  if (cargando) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Verificando seguridad...</p>
      </div>
    );
  }

  // Si no está autenticado, no pintar nada (ya va redirigiendo)
  if (!autenticado) {
    return null;
  }

  const handleCerrarSesion = async () => {
    await supabase.auth.signOut();
    router.replace('/admin/login');
  };

  // Si está autenticado, mostramos la barra superior con Cerrar Sesión + el contenido
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Barra de seguridad superior */}
      <header className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between text-xs border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-300">Sesión de Administrador:</span>
          <span className="text-slate-400 font-mono hidden sm:inline">{userEmail}</span>
        </div>

        <button
          onClick={handleCerrarSesion}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-300 font-semibold transition-colors cursor-pointer"
        >
          <LogOut size={14} />
          <span>Cerrar Sesión</span>
        </button>
      </header>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}