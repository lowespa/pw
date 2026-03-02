// ===== CONFIGURACIÓN GLOBAL =====
const CONFIG = {
    email: 'lowespa@gmail.com',
    whatsapp: {
        phone: '56912345678', // Reemplaza con tu número
        defaultMessage: 'Hola Löwe Studio, me interesa conocer más sobre sus servicios digitales.'
    },
    social: {
        instagram: 'https://www.instagram.com/powerexcel_oficial/reels/',
        tiktok: 'https://www.tiktok.com/@guesselo',
        linkedin: 'https://linkedin.com/company/tulinkedin',
        youtube: 'https://youtube.com/@guesselo',
        twitter: 'https://x.com/'
    },
    emailjs: {
        serviceID: 'service_tu_servicio',
        templateID: 'template_tu_template',
        publicKey: 'tu_public_key'
    }
};

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar EmailJS
    emailjs.init(CONFIG.emailjs.publicKey);
    
    // Configurar componentes
    setupNavigation();
    setupContactForm();
    setupFloatingWidget();
    setupProjectsFilter();
    setupAnimations();
    setupStatsCounter();
    setupSocialLinks();
    setupParticles();
    
    console.log('✅ Löwe Studio - Sitio inicializado correctamente');
});

// ===== NAVEGACIÓN =====
function setupNavigation() {
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Efecto de scroll en navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Menú móvil
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            if (menuToggle) {
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });
    
    // Navegación suave
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.hash !== '') {
                e.preventDefault();
                const targetId = this.hash;
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// ===== FORMULARIO DE CONTACTO =====
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formMessage = document.getElementById('form-message');
    
    if (!contactForm) return;
    
    // Configurar email en el formulario
    const emailLink = document.getElementById('contact-email');
    if (emailLink) {
        emailLink.href = `mailto:${CONFIG.email}`;
        emailLink.textContent = CONFIG.email;
    }
    
    // Configurar notificación por email
    const formNotice = document.querySelector('.form-notice a');
    if (formNotice) {
        formNotice.href = `mailto:${CONFIG.email}`;
        formNotice.textContent = CONFIG.email;
    }
    
    // Enviar formulario
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (submitBtn) {
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
        }
        
        try {
            // Enviar con EmailJS
            const response = await emailjs.sendForm(
                CONFIG.emailjs.serviceID,
                CONFIG.emailjs.templateID,
                this
            );
            
            // Éxito
            showNotification('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
            
            // Mostrar mensaje en el formulario
            if (formMessage) {
                formMessage.textContent = '¡Gracias por contactarnos! Te responderemos en menos de 24 horas.';
                formMessage.className = 'form-message success';
                formMessage.style.display = 'block';
            }
            
            // Resetear formulario
            contactForm.reset();
            
            // Ocultar mensaje después de 5 segundos
            setTimeout(() => {
                if (formMessage) {
                    formMessage.style.display = 'none';
                }
            }, 5000);
            
        } catch (error) {
            console.error('Error enviando formulario:', error);
            
            // Error - Ofrecer alternativa mailto
            showNotification('Error al enviar. Puedes contactarnos directamente por email.', 'error');
            
            if (formMessage) {
                formMessage.textContent = 'Error al enviar. Por favor, envía un email directo a lowespa@gmail.com';
                formMessage.className = 'form-message error';
                formMessage.style.display = 'block';
            }
            
            // Preguntar si quiere usar mailto
            setTimeout(() => {
                const useMailto = confirm('¿Prefieres enviar directamente por correo electrónico?');
                if (useMailto) {
                    const name = document.getElementById('user_name').value;
                    const email = document.getElementById('user_email').value;
                    const message = document.getElementById('message').value;
                    const service = document.getElementById('service_type').value;
                    
                    const subject = `Contacto Löwe Studio - ${getServiceName(service)}`;
                    const body = `Nombre: ${name}%0AEmail: ${email}%0AServicio: ${getServiceName(service)}%0A%0AMensaje:%0A${message}`;
                    
                    window.location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                }
            }, 1000);
        } finally {
            // Restaurar botón
            if (submitBtn) {
                submitBtn.innerHTML = '<span>Enviar mensaje</span><i class="fas fa-paper-plane"></i>';
                submitBtn.disabled = false;
            }
        }
    });
    
    // Función auxiliar para nombres de servicio
    function getServiceName(value) {
        const services = {
            'web': 'Desarrollo Web',
            'estrategia': 'Estrategia Digital',
            'redes': 'Redes Sociales',
            'completo': 'Paquete Completo',
            'otros': 'Otros'
        };
        return services[value] || 'Servicio no especificado';
    }
}

// ===== WIDGET FLOTANTE =====
function setupFloatingWidget() {
    const widgetToggle = document.querySelector('.widget-toggle');
    const widgetMenu = document.querySelector('.widget-menu');
    const widgetButtons = document.querySelectorAll('.widget-btn');
    
    if (!widgetToggle || !widgetMenu) return;
    
    // Configurar enlaces del widget
    const whatsappBtn = document.querySelector('.widget-btn.whatsapp');
    if (whatsappBtn) {
        const message = encodeURIComponent(CONFIG.whatsapp.defaultMessage);
        whatsappBtn.href = `https://wa.me/${CONFIG.whatsapp.phone}?text=${message}`;
    }
    
    const emailBtn = document.querySelector('.widget-btn.email');
    if (emailBtn) {
        emailBtn.href = `mailto:${CONFIG.email}`;
    }
    
    // Configurar redes sociales
    const instagramBtn = document.querySelector('.widget-btn.instagram');
    if (instagramBtn && CONFIG.social.instagram) {
        instagramBtn.href = CONFIG.social.instagram;
    }
    
    const tiktokBtn = document.querySelector('.widget-btn.tiktok');
    if (tiktokBtn && CONFIG.social.tiktok) {
        tiktokBtn.href = CONFIG.social.tiktok;
    }
    
    const linkedinBtn = document.querySelector('.widget-btn.linkedin');
    if (linkedinBtn && CONFIG.social.linkedin) {
        linkedinBtn.href = CONFIG.social.linkedin;
    }
    
    // Alternar menú del widget
    widgetToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        widgetMenu.classList.toggle('active');
        widgetToggle.style.transform = widgetMenu.classList.contains('active') 
            ? 'rotate(45deg) scale(1.1)' 
            : 'rotate(0) scale(1)';
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.floating-widget')) {
            widgetMenu.classList.remove('active');
            widgetToggle.style.transform = 'rotate(0) scale(1)';
        }
    });
    
    // Cerrar menú al hacer scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        widgetMenu.classList.remove('active');
        widgetToggle.style.transform = 'rotate(0) scale(1)';
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            widgetMenu.classList.remove('active');
        }, 100);
    });
    
    // Efecto hover en botones del widget
    widgetButtons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(-10px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            if (!widgetMenu.classList.contains('active')) {
                this.style.transform = 'translateX(20px)';
            }
        });
    });
}

// ===== FILTRO DE PROYECTOS =====
function setupProjectsFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectsContainer = document.getElementById('projects-container');
    
    if (!filterButtons.length || !projectsContainer) return;
    
    // Datos de proyectos
    const projects = [
        {
            id: 1,
            title: 'E-commerce de Moda Premium',
            category: 'ecommerce',
            description: 'Tienda online con sistema de inventario, pagos y envíos automatizados.',
            tech: ['Shopify', 'JavaScript', 'CSS3'],
            link: '#'
        },
        {
            id: 2,
            title: 'Web Corporativa Fintech',
            category: 'web',
            description: 'Sitio corporativo con dashboard administrativo y sistema de usuarios.',
            tech: ['React', 'Node.js', 'MongoDB'],
            link: '#'
        },
        {
            id: 3,
            title: 'Rediseño de Marca Startup',
            category: 'branding',
            description: 'Identidad visual completa y guías de estilo para empresa tecnológica.',
            tech: ['Figma', 'Illustrator', 'Photoshop'],
            link: '#'
        },
        {
            id: 4,
            title: 'Gestión de Redes Sociales',
            category: 'social',
            description: 'Estrategia y gestión completa de redes para empresa de retail.',
            tech: ['Instagram', 'TikTok', 'Meta Ads'],
            link: '#'
        },
        {
            id: 5,
            title: 'Landing Page de Conversión',
            category: 'web',
            description: 'Landing optimizada para conversión con A/B testing integrado.',
            tech: ['HTML5', 'CSS3', 'JavaScript'],
            link: '#'
        },
        {
            id: 6,
            title: 'App de Reservas Online',
            category: 'web',
            description: 'Aplicación web para reservas con calendario y notificaciones.',
            tech: ['Vue.js', 'Firebase', 'Stripe'],
            link: '#'
        }
    ];
    
    // Función para renderizar proyectos
    function renderProjects(filter = 'all') {
        projectsContainer.innerHTML = '';
        
        const filteredProjects = filter === 'all' 
            ? projects 
            : projects.filter(project => project.category === filter);
        
        filteredProjects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.setAttribute('data-category', project.category);
            
            projectCard.innerHTML = `
                <div class="project-image">
                    <span class="project-category">${getCategoryName(project.category)}</span>
                </div>
                <div class="project-info">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-tech">
                        ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    <div class="project-links">
                        <a href="${project.link}" class="project-link" target="_blank">
                            <i class="fas fa-external-link-alt"></i>
                            <span>Ver demo</span>
                        </a>
                        <a href="#contact" class="project-link">
                            <i class="fas fa-info-circle"></i>
                            <span>Más info</span>
                        </a>
                    </div>
                </div>
            `;
            
            projectsContainer.appendChild(projectCard);
        });
    }
    
    // Función auxiliar para nombres de categoría
    function getCategoryName(category) {
        const categories = {
            'web': 'Web',
            'ecommerce': 'E-commerce',
            'branding': 'Branding',
            'social': 'Redes Sociales'
        };
        return categories[category] || category;
    }
    
    // Inicializar proyectos
    renderProjects();
    
    // Configurar filtros
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover active de todos
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Agregar active al botón clickeado
            this.classList.add('active');
            
            // Filtrar proyectos
            const filter = this.getAttribute('data-filter');
            renderProjects(filter);
        });
    });
}

// ===== ANIMACIONES =====
function setupAnimations() {
    // Observador de intersección para animaciones al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observar elementos a animar
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
    
    // Agregar estilos para animaciones
    const style = document.createElement('style');
    style.textContent = `
        .hero-line, .hero-subtitle, .hero-buttons, .hero-stats, .scroll-indicator {
            opacity: 0;
        }
        
        .hero-line.animated, 
        .hero-subtitle.animated, 
        .hero-buttons.animated, 
        .hero-stats.animated, 
        .scroll-indicator.animated {
            opacity: 1;
        }
        
        section {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        section.animated {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}

// ===== CONTADOR DE ESTADÍSTICAS =====
function setupStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    
    if (!statNumbers.length) return;
    
    // Función para animar contadores
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000; // 2 segundos
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 16);
    }
    
    // Observador para iniciar animación cuando sea visible
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    // Observar cada contador
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// ===== ENLACES DE REDES SOCIALES =====
function setupSocialLinks() {
    // Configurar enlaces en el footer
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        const platform = link.classList[1]; // instagram, tiktok, etc.
        if (CONFIG.social[platform]) {
            link.href = CONFIG.social[platform];
            link.target = '_blank';
        }
    });
    
    // Configurar enlaces en la sección de contacto
    const contactSocialLinks = document.querySelectorAll('.contact-social .social-link');
    contactSocialLinks.forEach(link => {
        const platform = link.classList[1];
        if (CONFIG.social[platform]) {
            link.href = CONFIG.social[platform];
            link.target = '_blank';
        }
    });
}

// ===== PARTÍCULAS EN EL HERO =====
function setupParticles() {
    const particlesContainer = document.getElementById('particles-js');
    
    if (!particlesContainer) return;
    
    // Configuración básica de partículas
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: "#00D4FF"
            },
            shape: {
                type: "circle"
            },
            opacity: {
                value: 0.3,
                random: true
            },
            size: {
                value: 3,
                random: true
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#00D4FF",
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: true,
                    mode: "repulse"
                },
                onclick: {
                    enable: true,
                    mode: "push"
                }
            }
        },
        retina_detect: true
    });
}

// ===== NOTIFICACIONES =====
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Configurar cierre automático
    const closeTimeout = setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Configurar cierre manual
    notification.querySelector('.notification-close').addEventListener('click', () => {
        clearTimeout(closeTimeout);
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Eliminar notificación anterior si existe
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
}

// ===== POLÍTICA DE PRIVACIDAD =====
document.addEventListener('DOMContentLoaded', () => {
    const privacyLink = document.getElementById('privacy-link');
    if (privacyLink) {
        privacyLink.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('Política de privacidad: Löwe Studio no comparte tus datos con terceros.', 'info');
        });
    }
});

// ===== DETECCIÓN DE DISPOSITIVOS MÓVILES =====
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Optimizar para móviles
if (isMobileDevice()) {
    document.documentElement.classList.add('mobile-device');
}