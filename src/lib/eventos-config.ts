export const TEMAS = {
    CUMPLE: {
        primario: "bg-blue-600",
        acento: "text-blue-600",
        boton: "bg-blue-600 hover:bg-blue-700 shadow-blue-200",
        fondo: "bg-slate-50",
        tarjeta: "bg-white",
        fuente: "font-sans",
    },
    // BODA_LUJO: {
    //     primario: "bg-amber-400",
    //     acento: "text-amber-400",
    //     boton: "bg-amber-400 text-black hover:bg-amber-500 shadow-amber-900/20",
    //     fondo: "bg-[#0f0f0f]", // Fondo oscuro de lujo
    //     tarjeta: "bg-white",
    //     fuente: "font-serif",
    // }
    BODA_LUJO: {
        primario: "bg-[#b89b5e]", // Oro viejo
        acento: "text-[#b89b5e]",
        boton: "bg-[#b89b5e] text-white hover:bg-[#a68a4f] shadow-xl shadow-[#b89b5e]/20",
        fondo: "bg-[#0c0d0c]", // Negro profundo orgánico
        tarjeta: "bg-[#141514] border border-white/5",
        fuente: "font-serif tracking-widest",
    }
};

export const EVENTOS = {
    irma_cumple: {
        tema: TEMAS.CUMPLE,
        nombre: "Irma",
        titulo: "¡Mi cumple #28!",
        frase: "Acompáñame a cantar y festejar.",
        fecha: "Sábado 5 de Septiembre",
        hora: "6:30 PM",
        lugar: "Mi casa en Ramos",
        direccion: "Valle Verde 170, Real del Valle",
        mapa: "https://www.google.com/maps?q=25.5421456,-100.9726649&z=17&hl=es",
        wa_confirmar: "5218442995994",
        foto_hero: "/eventos/cumple_irma/foto-irma.jpg",
        id_supabase: "cumple-mateo-avanzado",
        fechaISO: "2026-09-05T18:30:00", // <--- Para el reloj
        mesa_regalos: "https://www.amazon.com.mx/hz/wishlist/ls/IAE016G6M4B3?ref_=wl_share",
        musica_url: "https://www.bensound.com/bensound-music/bensound-happyrock.mp3",
        galeria: [
            "https://images.unsplash.com/photo-1511795409834-ef04bbd61622",
            "https://images.unsplash.com/photo-1519225421980-715cb0215aed",
            "https://images.unsplash.com/photo-1520854221256-17451cc331bf",
            "https://images.unsplash.com/photo-1583939003579-730e3918a45a"
        ],
    },
    "boda-ana-y-juan": {
        tema: TEMAS.BODA_LUJO,
        nombre: "Ana & Juan",
        titulo: "Nuestra Boda",
        frase: "Lo mejor de nuestras vidas está por comenzar",
        fecha: "Sábado 20 de Diciembre",
        fechaISO: "2025-12-20T18:00:00",
        hora: "6:00 PM",
        lugar: "Hacienda del Valle",
        direccion: "Km 12 Carretera Nacional, Monterrey",
        mapa: "https://maps.app.goo.gl/xxx",
        wa_confirmar: "528110000000",
        foto_hero: "https://images.unsplash.com/photo-1519741497674-611481863552",
        mesa_regalos: "https://amazon.com.mx",
        id_supabase: "boda-ana-juan-2025",
        musica_url: "/musica/cancion_bodas.mp3",
        
        // --- CAMPOS EXCLUSIVOS PARA EL AVANZADO ---
        dressCode: "Gala - Smoking & Vestido Largo",
        itinerario: [
            { h: "18:00", a: "Ceremonia Religiosa" },
            { h: "19:30", a: "Cóctel de Bienvenida" },
            { h: "21:00", a: "Banquete y Fiesta" },
            { h: "02:00", a: "Fin del Evento" }
        ],
        galeria: [
            "https://images.unsplash.com/photo-1511795409834-ef04bbd61622",
            "https://images.unsplash.com/photo-1519225421980-715cb0215aed",
            "https://images.unsplash.com/photo-1520854221256-17451cc331bf",
            "https://images.unsplash.com/photo-1583939003579-730e3918a45a"
        ],
    }
};