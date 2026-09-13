export const TEMAS = {
    CUMPLE: {
        primario: "bg-indigo-600",
        acento: "text-indigo-600",
        boton: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200",
        fondo: "bg-slate-50",
        tarjeta: "bg-white",
        fuente: "font-sans",
    },
    BODA_LUJO: {
        primario: "bg-[#b89b5e]",
        acento: "text-[#b89b5e]",
        boton: "bg-[#b89b5e] text-white hover:bg-[#a68a4f] shadow-amber-900/20",
        fondo: "bg-[#0c0d0c]",
        tarjeta: "bg-[#141514] border border-white/5",
        fuente: "font-serif",
    }
};

export const EVENTOS = {
    irma_cumple: {
        tipo: "cumple",
        tema: TEMAS.CUMPLE,
        nombre: "Irma",
        titulo: "¡Mi cumple #28!",
        frase: "Acompáñame a cantar, bailar y festejar la vida.",
        fecha: "Sábado 21 de Noviembre",
        fechaISO: "2026-11-21T19:30:00", // Fecha futura para que el reloj funcione
        hora: "7:30 PM",
        lugar: "Terraza Real",
        direccion: "Valle Verde 170, Real del Valle",
        mapa: "https://maps.google.com",
        wa_confirmar: "5218442995994",
        foto_hero: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205",
        id_supabase: "cumple-irma-28",
        mesa_regalos: "https://www.amazon.com.mx",
        musica_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        galeria: [
            "https://images.unsplash.com/photo-1517457373958-b7bdd4587205",
            "https://images.unsplash.com/photo-1530103862676-de8c9debad1d",
            "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
            "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4"
        ]
    },
    "boda-ana-y-juan": {
        tipo: "boda",
        tema: TEMAS.BODA_LUJO,
        nombre: "Ana & Juan",
        titulo: "Nuestra Boda",
        frase: "Con nuestro amor, la presencia de Dios entre nosotros y la bendición de nuestros padres.",
        fecha: "Sábado 24 de Octubre",
        fechaISO: "2026-10-24T17:00:00", // Fecha futura alineada a Canva
        hora: "5:00 PM",
        lugar: "San Nicolás de Tolentino",
        direccion: "Ramos Arizpe, Coahuila",
        mapa: "https://maps.google.com",
        wa_confirmar: "528110000000",
        foto_hero: "https://images.unsplash.com/photo-1519741497674-611481863552",
        mesa_regalos: "https://amazon.com.mx",
        id_supabase: "boda-ana-juan-2026",
        musica_url: "/musica/cancion_bodas.mp3",
        dressCode: "FORMAL",
        galeria: [
            "https://images.unsplash.com/photo-1519741497674-611481863552",
            "https://images.unsplash.com/photo-1583939003579-730e3918a45a",
            "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",
            "https://images.unsplash.com/photo-1520854221256-17451cc331bf",
            "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af",
            "https://images.unsplash.com/photo-1469371670807-013ccf25f16a"
        ],
        itinerario: [
            { h: "5:00 PM", a: "Ceremonia Religiosa - San Nicolás de Tolentino" },
            { h: "7:00 PM", a: "Recepción y Banquete - Hacienda del Valle" },
            { h: "02:00 AM", a: "Fin del Evento" }
        ]
    }
};