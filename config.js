// ===== CONFIGURACIÓN DE LÖWE STUDIO =====
// Este archivo centraliza todas las configuraciones para fácil mantenimiento

const LOWE_CONFIG = {
    // Información de la empresa
    company: {
        name: "Löwe SpA",
        tradingName: "Löwe Studio",
        founded: 2019,
        email: "lowespa@gmail.com",
        phone: "+56 9 1234 5678", // Reemplaza con tu número
        address: "Tu dirección, Ciudad, País",
        businessHours: {
            weekdays: "9:00 - 18:00",
            saturdays: "10:00 - 14:00"
        }
    },
    
    // Contacto principal
    contact: {
        email: "lowespa@gmail.com", // Cambiar aquí para actualizar en todo el sitio
        backupEmail: "contacto@lowestudio.com", // Email alternativo
        whatsapp: {
            phone: "56912345678", // Reemplaza con tu número (sin + ni espacios)
            defaultMessage: "Hola Löwe Studio, me interesa conocer más sobre sus servicios digitales."
        }
    },
    
    // Redes sociales (actualizar los enlaces aquí)
    socialMedia: {
        instagram: {
            url: "https://instagram.com/tuinstagram",
            username: "@tuinstagram"
        },
        tiktok: {
            url: "https://www.https://www.tiktok.com/@guesselo",
            username: "@guesselo"
        },
        linkedin: {
            url: "https://linkedin.com/company/tulinkedin",
            username: "Löwe Studio"
        },
        youtube: {
            url: "https://www.youtube.com/channel/UC2CV3O0BHcDhRGBK_MX9OiQ",
            username: "@GuessElo"
        },
        twitter: {
            url: "https://twitter.com/tutwitter",
            username: "@tutwitter"
        },
        behance: {
            url: "https://behance.net/tubehance",
            username: "Löwe Studio"
        }
    },
    
    // Configuración de EmailJS (para formulario de contacto)
    emailJS: {
        serviceID: "service_tu_servicio", // Reemplaza con tu Service ID
        templateID: "template_tu_template", // Reemplaza con tu Template ID
        publicKey: "tu_public_key", // Reemplaza con tu Public Key
        templateParams: {
            to_email: "lowespa@gmail.com", // Email destino
            from_name: "Usuario del Sitio Web",
            reply_to: "", // Se llena automáticamente
            subject: "Nuevo contacto desde Löwe Studio"
        }
    },
    
    // Estadísticas de la empresa
    stats: {
        projectsCompleted: 50,
        yearsExperience: 5,
        happyClients: 150,
        retentionRate: 99,
        followerGrowth: 200, // Porcentaje
        viewsManaged: 5000000
    },
    
    // Servicios ofrecidos
    services: [
        {
            id: "web",
            name: "Desarrollo Web Profesional",
            description: "Sitios corporativos, e-commerce y aplicaciones web a medida.",
            features: [
                "Sitios corporativos premium",
                "E-commerce de alto rendimiento",
                "Aplicaciones web a medida",
                "Optimización y mantenimiento"
            ]
        },
        {
            id: "strategy",
            name: "Presencia Digital Estratégica",
            description: "Branding, estrategia de contenido, SEO y análisis de datos.",
            features: [
                "Branding y identidad visual",
                "Estrategia de contenido",
                "SEO y posicionamiento",
                "Analytics y reportes"
            ]
        },
        {
            id: "social",
            name: "Crecimiento en Redes Sociales",
            description: "Gestión completa, campañas publicitarias y análisis de engagement.",
            features: [
                "Gestión completa de redes",
                "Campañas publicitarias",
                "Incremento de seguidores",
                "Análisis de engagement"
            ]
        }
    ],
    
    // Colores de la marca (puedes ajustarlos)
    colors: {
        primary: "#0A0A0A", // Negro profundo
        secondary: "#111111", // Negro oscuro
        accent: "#D4AF37",   // Dorado
        accent2: "#00D4FF",  // Cian
        accent3: "#10B981",  // Esmeralda
        text: {
            light: "#E5E5E5",
            medium: "#AAAAAA",
            dark: "#666666"
        }
    },
    
    // URLs importantes
    urls: {
        website: "https://lowestudio.com",
        portfolio: "https://lowestudio.com/projects",
        blog: "https://blog.lowestudio.com",
        careers: "https://lowestudio.com/careers"
    },
    
    // Textos legales
    legal: {
        privacyPolicy: "#",
        termsOfService: "#",
        cookiePolicy: "#"
    },
    
    // Métricas de performance
    performance: {
        pageLoadTime: "2.5s", // Objetivo de carga
        seoScore: 95, // Objetivo de puntuación SEO
        accessibilityScore: 90 // Objetivo de accesibilidad
    }
};

// ===== FUNCIONES DE UTILIDAD =====

// Actualizar dinámicamente el email en toda la página
function updateEmail(newEmail) {
    LÖWE_CONFIG.contact.email = newEmail;
    LÖWE_CONFIG.emailJS.templateParams.to_email = newEmail;
    
    // Actualizar enlaces mailto
    document.querySelectorAll('[data-email="contact"]').forEach(element => {
        if (element.tagName === 'A') {
            element.href = `mailto:${newEmail}`;
            element.textContent = newEmail;
        } else {
            element.textContent = newEmail;
        }
    });
    
    console.log(`✅ Email actualizado a: ${newEmail}`);
}

// Actualizar número de WhatsApp
function updateWhatsApp(newPhone) {
    LÖWE_CONFIG.contact.whatsapp.phone = newPhone.replace(/\D/g, '');
    
    // Actualizar enlaces de WhatsApp
    document.querySelectorAll('[data-whatsapp="contact"]').forEach(element => {
        if (element.tagName === 'A') {
            const message = encodeURIComponent(LÖWE_CONFIG.contact.whatsapp.defaultMessage);
            element.href = `https://wa.me/${newPhone}?text=${message}`;
        }
    });
    
    console.log(`✅ WhatsApp actualizado a: ${newPhone}`);
}

// Actualizar enlaces de redes sociales
function updateSocialMedia(platform, newUrl) {
    if (LÖWE_CONFIG.socialMedia[platform]) {
        LÖWE_CONFIG.socialMedia[platform].url = newUrl;
        
        // Actualizar enlaces en la página
        document.querySelectorAll(`[data-social="${platform}"]`).forEach(element => {
            if (element.tagName === 'A') {
                element.href = newUrl;
            }
        });
        
        console.log(`✅ ${platform} actualizado a: ${newUrl}`);
    } else {
        console.error(`❌ Plataforma no reconocida: ${platform}`);
    }
}

// Configurar EmailJS
function setupEmailJS() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(LÖWE_CONFIG.emailJS.publicKey);
        console.log('✅ EmailJS inicializado correctamente');
    } else {
        console.error('❌ EmailJS no está cargado');
    }
}

// Cargar configuración en la página
function loadConfiguration() {
    // Actualizar email
    updateEmail(LÖWE_CONFIG.contact.email);
    
    // Actualizar WhatsApp
    updateWhatsApp(LÖWE_CONFIG.contact.whatsapp.phone);
    
    // Actualizar redes sociales
    Object.keys(LÖWE_CONFIG.socialMedia).forEach(platform => {
        const url = LÖWE_CONFIG.socialMedia[platform].url;
        if (url && url !== '#') {
            updateSocialMedia(platform, url);
        }
    });
    
    // Actualizar estadísticas
    document.querySelectorAll('[data-stat="projects"]').forEach(el => {
        el.textContent = LÖWE_CONFIG.stats.projectsCompleted + '+';
    });
    
    document.querySelectorAll('[data-stat="years"]').forEach(el => {
        el.textContent = LÖWE_CONFIG.stats.yearsExperience + '+';
    });
    
    document.querySelectorAll('[data-stat="clients"]').forEach(el => {
        el.textContent = LÖWE_CONFIG.stats.happyClients + '+';
    });
    
    console.log('✅ Configuración de Löwe Studio cargada correctamente');
}

// ===== INICIALIZACIÓN =====
// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadConfiguration);
} else {
    loadConfiguration();
}

// Hacer la configuración disponible globalmente
window.LOWE_CONFIG = LOWE_CONFIG;