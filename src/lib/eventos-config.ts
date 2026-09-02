export const TEMAS = {
    CUMPLE: {
        primario: "bg-blue-600",
        acento: "text-blue-600",
        boton: "bg-blue-600 hover:bg-blue-700 shadow-blue-200",
        fondo: "bg-slate-50",
        tarjeta: "bg-white",
        fuente: "font-sans",
    },
    BODA_ELEGANTE: {
        primario: "bg-[#b89b5e]", // Dorado
        acento: "text-[#b89b5e]",
        boton: "bg-[#1a1a1a] hover:bg-black shadow-slate-200",
        fondo: "bg-[#faf9f6]",
        tarjeta: "bg-white",
        fuente: "font-serif",
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
    }
};