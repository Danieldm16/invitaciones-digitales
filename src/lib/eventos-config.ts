// =========================================================================
// 1. ESTILOS VISUALES ("SKINS")
// =========================================================================
export const ESTILOS = {
  // Estilo 1: Papelería Fina / Canva Artesanal
  crema_lujo: {
    id: "crema_lujo",
    nombreVisible: "Crema Artesanal",
    fondo: "bg-[#F7F4EE]",
    tarjeta: "bg-white text-[#33302C] border-[#EBE4D8]",
    acento: "text-[#C5A880]",
    acentoBg: "bg-[#C5A880]",
    bordeDorado: "border-[#D4AF37]/40",
    textoPrincipal: "text-[#33302C]",
    textoSecundario: "text-[#7A7267]",
    fuente: "font-serif",
    modoOscuro: false,
  },
  // Estilo 2: Black Tie / Gala Nocturna
  black_tie: {
    id: "black_tie",
    nombreVisible: "Black Tie Gala",
    fondo: "bg-[#080808]",
    tarjeta: "bg-[#121110] text-[#F3EFE6] border-[#C5A880]/30",
    acento: "text-[#D4AF37]",
    acentoBg: "bg-[#D4AF37]",
    bordeDorado: "border-[#D4AF37]/50",
    textoPrincipal: "text-[#FAF8F5]",
    textoSecundario: "text-[#A89F91]",
    fuente: "font-serif",
    modoOscuro: true,
  },
  // Estilo 3: Fiesta / Nightlife (Cumpleaños & XV)
  fiesta_vip: {
    id: "fiesta_vip",
    nombreVisible: "Fiesta VIP",
    fondo: "bg-[#0A0713]",
    tarjeta: "bg-[#140F24] text-white border-[#8B5CF6]/30",
    acento: "text-[#A78BFA]",
    acentoBg: "bg-[#8B5CF6]",
    bordeDorado: "border-[#8B5CF6]/40",
    textoPrincipal: "text-white",
    textoSecundario: "text-[#9CA3AF]",
    fuente: "font-sans",
    modoOscuro: true,
  },
};

// Mantenemos TEMAS como alias para que ningún código antiguo falle
export const TEMAS = ESTILOS;

// =========================================================================
// 2. BASE DE DATOS DE CLIENTES
// =========================================================================
export const EVENTOS = {
  // BODA: Ana & Juan
  "boda-ana-y-juan": {
    tipo: "boda",
    estiloVisual: "crema_lujo", // Estilo por defecto (puedes cambiarlo a "black_tie")
    tema: ESTILOS.crema_lujo,
    nombre: "Ana & Juan",
    titulo: "Nuestra Boda",
    frase: "Con nuestro amor, la presencia de Dios entre nosotros y la bendición de nuestros padres.",
    fecha: "Sábado 24 de Octubre",
    fechaISO: "2026-10-24T17:00:00",
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
  },

  // CUMPLEAÑOS: Irma
  "irma_cumple": {
    tipo: "cumple",
    estiloVisual: "fiesta_vip",
    tema: ESTILOS.fiesta_vip,
    nombre: "Irma",
    titulo: "¡Mi cumple #28!",
    frase: "Acompáñame a cantar, bailar y festejar la vida.",
    fecha: "Sábado 21 de Noviembre",
    fechaISO: "2026-11-21T19:30:00",
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
  }
};