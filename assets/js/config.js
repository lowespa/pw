// ============================================================
// LÖWE STUDIO — CONFIG.JS
// Modifica aquí toda la información sin tocar el HTML principal
// ============================================================

const CONFIG = {

  brand: {
    name: "LÖWE STUDIO",
    tagline: "Estudio digital de alto nivel · Temuco, Chile",
  },

  contact: {
    whatsapp: "+56974355501",
    whatsappMsg: "Hola Löwe, quiero una cotización para mi proyecto digital.",
    email: "lowespa@gmail.com",
    phone: "+56 9 1234 5678",
    address: "Temuco, Región de La Araucanía, Chile",
    mapsUrl: "https://maps.google.com/?q=Temuco,Chile",
    hours: "Lun – Vie · 9:00 – 18:30",
    responseTime: "Respuesta en menos de 24 horas",
  },

  social: {
    instagram: "https://instagram.com/lowestudio",
    tiktok: "https://tiktok.com/@lowestudio",
    youtube: "https://youtube.com/@lowestudio",
    google: "https://google.com",
    maps: "https://maps.google.com/?q=Temuco,Chile",
    linkedin: "https://linkedin.com/company/lowestudio",
  },

  stats: {
    projects:  { value: 147, label: "Proyectos entregados", suffix: "+" },
    years:     { value: 6,  label: "Años de experiencia",  suffix: "+" },
    clients:   { value: 70, label: "Clientes satisfechos", suffix: "+" },
    retention: { value: 94, label: "Tasa de retención",    suffix: "%" },
  },

  impact: {
    growth:    { value: 340, label: "Crecimiento promedio seguidores", suffix: "%" },
    views:     { value: 2.8, label: "Millones de views acumuladas",    suffix: "M+" },
    satisfied: { value: 45,  label: "Clientes activos",                suffix: "+" },
    retention: { value: 94,  label: "Tasa de retención mensual",       suffix: "%" },
  },

  services: [
    {
      id: "web",
      icon: "◈",
      title: "Desarrollo Web Profesional",
      subtitle: "Sitios que convierten, no solo se ven bien",
      items: [
        "Landing pages de alta conversión",
        "Sitios corporativos y e-commerce",
        "Optimización SEO técnico avanzado",
        "Performance Web Core Vitals",
        "Integración con CRM y herramientas",
        "Mantenimiento y soporte continuo",
      ],
    },
    {
      id: "digital",
      icon: "◉",
      title: "Presencia Digital Estratégica",
      subtitle: "Visibilidad que posiciona tu marca",
      items: [
        "Estrategia SEO local y regional",
        "Google Business Profile optimizado",
        "Branding digital coherente",
        "Posicionamiento en buscadores",
        "Reputación y autoridad online",
        "Auditorías digitales completas",
      ],
    },
    {
      id: "social",
      icon: "◎",
      title: "Crecimiento en Redes Sociales",
      subtitle: "Comunidades reales, resultados medibles",
      items: [
        "Gestión de Instagram y TikTok",
        "Producción de contenido visual",
        "Estrategia de contenido mensual",
        "Análisis y reportes de métricas",
        "Campañas de pauta digital",
        "Crecimiento orgánico sostenido",
      ],
    },
    {
      id: "funnels",
      icon: "◐",
      title: "Automatización y Embudos",
      subtitle: "Sistemas que venden mientras duermes",
      items: [
        "Diseño de embudos de conversión",
        "Automatización de email marketing",
        "Integración de CRM y chatbots",
        "Seguimiento y nurturing de leads",
        "A/B testing y optimización",
        "Reportes de ROI en tiempo real",
      ],
    },
  ],

  testimonials: [
    {
      name: "María González",
      role: "Fundadora, 6to Tiendas Online",
      text: "Löwe transformó nuestra presencia digital por completo. Pasamos de 15 a 300 ventas mensuales en solo 4 meses.",
      stars: 5,
    },
    {
      name: "Carlos Fuentes",
      role: "CEO, Constructo Emprende",
      text: "El sitio web que desarrollaron superó todas nuestras expectativas. Profesional, rápido y con resultados reales.",
      stars: 5,
    },
    {
      name: "Ana Riquelme",
      role: "CEO, Gym recoleta",
      text: "Nuestras reservas online aumentaron un 280% tras trabajar con Löwe. Definitivamente la mejor inversión del año.",
      stars: 5,
    },
  ],

  promo: {
    active: true,
    badge: "OFERTA LIMITADA",
    title: "Pack Lanzamiento Digital",
    description: "Todo lo que tu marca necesita para despegar",
    originalPrice: "$120.000",
    price: "$70.000",
    items: [
      "Landing page profesional",
      "SEO técnico incluido",
      "Dominio y Hosting",
      "Google Business optimizado",
    ],
    cta: "Quiero este pack",
    note: "* Solo 5 cupos disponibles este mes",
  },
};

CONFIG.urls = {
  whatsapp: () => `https://wa.me/${CONFIG.contact.whatsapp}?text=${encodeURIComponent(CONFIG.contact.whatsappMsg)}`,
  email:    () => `mailto:${CONFIG.contact.email}`,
};
