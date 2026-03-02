// ===== SMOOTH SCROLL SNAPPING SYSTEM =====
// Sistema avanzado de desplazamiento con efecto de barrido

class SmoothScrollSnap {
    constructor(options = {}) {
        // Configuración por defecto
        this.config = {
            snapDuration: 800,       // Duración del snap en ms
            snapEasing: 'cubic-bezier(0.645, 0.045, 0.355, 1)', // Easing premium
            snapThreshold: 0.15,     // Umbral para snap (15% de la pantalla)
            wheelSensitivity: 1.5,   // Sensibilidad de la rueda
            touchSensitivity: 0.8,   // Sensibilidad táctil
            keyboardSensitivity: 100, // Sensibilidad teclado
            enableParallax: true,    // Efectos parallax
            enableProgress: true,    // Barra de progreso
            enableNavigationDots: true, // Puntos de navegación
            ...options
        };

        // Estado
        this.currentSection = 0;
        this.totalSections = 0;
        this.isAnimating = false;
        this.isEnabled = true;
        this.scrollDirection = 0;
        this.lastScrollTime = 0;
        this.scrollDelta = 0;
        
        // Elementos DOM
        this.sections = [];
        this.navDots = [];
        this.progressBar = null;
        
        // Referencias para animación
        this.animationFrame = null;
        this.startTime = null;
        this.startPosition = 0;
        this.targetPosition = 0;
        
        // Inicializar
        this.init();
    }

    // ===== INICIALIZACIÓN =====
    init() {
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        // Obtener secciones
        this.sections = Array.from(document.querySelectorAll('section[id]'));
        this.totalSections = this.sections.length;
        
        if (this.totalSections === 0) {
            console.warn('No se encontraron secciones con ID');
            return;
        }

        // Configurar estilos CSS
        this.injectStyles();
        
        // Configurar comportamiento de scroll
        this.setupScrollBehavior();
        
        // Configurar eventos
        this.setupEvents();
        
        // Crear elementos de UI
        if (this.config.enableProgress) this.createProgressBar();
        if (this.config.enableNavigationDots) this.createNavigationDots();
        
        // Calcular sección inicial
        this.calculateCurrentSection();
        
        // Actualizar UI inicial
        this.updateUI();
        
        console.log('✅ Smooth Scroll Snap inicializado');
    }

    // ===== ESTILOS CSS =====
    injectStyles() {
        const styles = `
            /* Smooth Scroll Snap Styles */
            html {
                scroll-behavior: auto !important;
                overflow: hidden;
                height: 100%;
            }
            
            body {
                margin: 0;
                padding: 0;
                overflow: hidden;
                height: 100%;
                position: relative;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }
            
            .smooth-scroll-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                overflow: hidden;
                will-change: transform;
                transform-style: preserve-3d;
                backface-visibility: hidden;
            }
            
            .smooth-scroll-content {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                will-change: transform;
                transform-style: preserve-3d;
                backface-visibility: hidden;
            }
            
            section {
                position: relative;
                min-height: 100vh;
                width: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                overflow: hidden;
            }
            
            /* Progress Bar */
            .scroll-progress {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 3px;
                background: rgba(255, 255, 255, 0.1);
                z-index: 9999;
                transform-origin: 0 0;
                transform: scaleX(0);
                transition: transform 0.3s ease;
            }
            
            .scroll-progress-bar {
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 100%;
                background: linear-gradient(90deg, #D4AF37, #00D4FF);
                transform-origin: 0 0;
            }
            
            /* Navigation Dots */
            .nav-dots {
                position: fixed;
                right: 30px;
                top: 50%;
                transform: translateY(-50%);
                z-index: 9998;
                display: flex;
                flex-direction: column;
                gap: 15px;
                padding: 20px 10px;
                background: rgba(10, 10, 10, 0.8);
                backdrop-filter: blur(10px);
                border-radius: 25px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .nav-dot {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.2);
                border: 2px solid transparent;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
            }
            
            .nav-dot:hover {
                background: rgba(212, 175, 55, 0.5);
                transform: scale(1.2);
            }
            
            .nav-dot.active {
                background: #D4AF37;
                transform: scale(1.3);
                box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
            }
            
            .nav-dot.active::before {
                content: '';
                position: absolute;
                top: -4px;
                left: -4px;
                right: -4px;
                bottom: -4px;
                border: 1px solid rgba(212, 175, 55, 0.3);
                border-radius: 50%;
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0% { transform: scale(1); opacity: 1; }
                70% { transform: scale(1.5); opacity: 0; }
                100% { transform: scale(1.5); opacity: 0; }
            }
            
            /* Scroll Indicator */
            .scroll-indicator {
                position: absolute;
                bottom: 40px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 10;
                opacity: 0.7;
                transition: opacity 0.3s ease;
            }
            
            .scroll-indicator.hidden {
                opacity: 0;
                pointer-events: none;
            }
            
            /* Touch Device Optimization */
            @media (max-width: 768px) {
                .nav-dots {
                    right: 15px;
                    padding: 15px 8px;
                    gap: 12px;
                }
                
                .nav-dot {
                    width: 10px;
                    height: 10px;
                }
                
                .scroll-indicator {
                    bottom: 20px;
                }
            }
            
            /* Reduced Motion Preference */
            @media (prefers-reduced-motion: reduce) {
                .smooth-scroll-content {
                    transition: none !important;
                }
                
                .nav-dot.active::before {
                    animation: none;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // ===== CONFIGURACIÓN DE SCROLL =====
    setupScrollBehavior() {
        // Crear contenedor de scroll suave
        const container = document.createElement('div');
        container.className = 'smooth-scroll-container';
        
        const content = document.createElement('div');
        content.className = 'smooth-scroll-content';
        
        // Mover todas las secciones al contenedor de scroll suave
        const bodyContent = document.body.innerHTML;
        document.body.innerHTML = '';
        content.innerHTML = bodyContent;
        container.appendChild(content);
        document.body.appendChild(container);
        
        // Guardar referencia
        this.container = container;
        this.content = content;
        
        // Re-obtener secciones después de mover el DOM
        this.sections = Array.from(this.content.querySelectorAll('section[id]'));
        
        // Configurar altura del contenido
        this.updateContentHeight();
        
        // Configurar posición inicial
        this.content.style.transform = `translate3d(0, 0, 0)`;
    }

    updateContentHeight() {
        const sectionHeight = window.innerHeight;
        this.content.style.height = `${sectionHeight * this.totalSections}px`;
        
        // Establecer altura fija para cada sección
        this.sections.forEach(section => {
            section.style.height = `${sectionHeight}px`;
            section.style.minHeight = `${sectionHeight}px`;
        });
    }

    // ===== EVENTOS =====
    setupEvents() {
        // Evento de rueda del mouse
        window.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
        
        // Eventos táctiles
        window.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        window.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        window.addEventListener('touchend', this.handleTouchEnd.bind(this));
        
        // Eventos de teclado
        window.addEventListener('keydown', this.handleKeydown.bind(this));
        
        // Evento de redimensionamiento
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Observador de intersección para efectos
        this.setupIntersectionObserver();
    }

    handleWheel(e) {
        if (!this.isEnabled || this.isAnimating) return;
        
        e.preventDefault();
        
        const currentTime = Date.now();
        const timeDiff = currentTime - this.lastScrollTime;
        
        // Suavizar la sensibilidad basada en el tiempo entre eventos
        const sensitivity = timeDiff > 100 ? this.config.wheelSensitivity : 
                          timeDiff > 50 ? this.config.wheelSensitivity * 0.5 : 
                          this.config.wheelSensitivity * 0.2;
        
        this.scrollDelta += e.deltaY * sensitivity;
        
        // Determinar dirección
        const direction = e.deltaY > 0 ? 1 : -1;
        
        // Solo procesar si hay suficiente desplazamiento
        if (Math.abs(this.scrollDelta) > window.innerHeight * this.config.snapThreshold) {
            this.scrollToSection(this.currentSection + direction);
            this.scrollDelta = 0;
        }
        
        this.lastScrollTime = currentTime;
        
        // Actualizar UI de progreso
        this.updateProgressBar(e.deltaY);
    }

    handleTouchStart(e) {
        if (!this.isEnabled || this.isAnimating) return;
        
        this.touchStartY = e.touches[0].clientY;
        this.touchStartTime = Date.now();
        this.touchDelta = 0;
    }

    handleTouchMove(e) {
        if (!this.isEnabled || this.isAnimating || !this.touchStartY) return;
        
        e.preventDefault();
        
        const touchY = e.touches[0].clientY;
        this.touchDelta = this.touchStartY - touchY;
        
        // Mover contenido provisionalmente
        const currentY = -this.currentSection * window.innerHeight;
        const newY = currentY + (this.touchDelta * this.config.touchSensitivity);
        this.content.style.transform = `translate3d(0, ${newY}px, 0)`;
    }

    handleTouchEnd() {
        if (!this.isEnabled || this.isAnimating || !this.touchStartY) return;
        
        const swipeDistance = Math.abs(this.touchDelta);
        const swipeTime = Date.now() - this.touchStartTime;
        const swipeVelocity = swipeDistance / swipeTime;
        
        // Determinar si fue un swipe rápido
        if (swipeVelocity > 0.5 || swipeDistance > window.innerHeight * 0.2) {
            const direction = this.touchDelta > 0 ? 1 : -1;
            this.scrollToSection(this.currentSection + direction);
        } else {
            // Volver a la sección actual si no fue un swipe
            this.scrollToSection(this.currentSection);
        }
        
        this.touchStartY = null;
        this.touchDelta = 0;
    }

    handleKeydown(e) {
        if (!this.isEnabled || this.isAnimating) return;
        
        switch(e.key) {
            case 'ArrowDown':
            case 'PageDown':
            case ' ':
                e.preventDefault();
                this.scrollToSection(this.currentSection + 1);
                break;
                
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                this.scrollToSection(this.currentSection - 1);
                break;
                
            case 'Home':
                e.preventDefault();
                this.scrollToSection(0);
                break;
                
            case 'End':
                e.preventDefault();
                this.scrollToSection(this.totalSections - 1);
                break;
                
            case 'Escape':
                this.toggleEnable();
                break;
        }
    }

    handleResize() {
        // Actualizar alturas
        this.updateContentHeight();
        
        // Volver a posicionar en la sección actual
        this.scrollToSection(this.currentSection, false);
    }

    // ===== ANIMACIÓN DE SCROLL =====
    scrollToSection(sectionIndex, animate = true) {
        // Validar índice
        sectionIndex = Math.max(0, Math.min(sectionIndex, this.totalSections - 1));
        
        // Si ya está en esa sección, no hacer nada
        if (sectionIndex === this.currentSection && animate) return;
        
        // Si no hay animación, saltar directamente
        if (!animate) {
            this.currentSection = sectionIndex;
            const targetY = -sectionIndex * window.innerHeight;
            this.content.style.transform = `translate3d(0, ${targetY}px, 0)`;
            this.updateUI();
            return;
        }
        
        // Cancelar animación en curso
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        // Configurar animación
        this.isAnimating = true;
        this.currentSection = sectionIndex;
        
        const startY = parseFloat(this.content.style.transform.split(',')[1]) || 0;
        const targetY = -sectionIndex * window.innerHeight;
        const duration = this.config.snapDuration;
        
        this.startPosition = startY;
        this.targetPosition = targetY;
        this.startTime = null;
        
        // Iniciar animación
        const animateScroll = (currentTime) => {
            if (!this.startTime) this.startTime = currentTime;
            
            const elapsed = currentTime - this.startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Aplicar easing
            const easeProgress = this.easing(progress);
            
            // Calcular posición actual
            const currentY = this.startPosition + (this.targetPosition - this.startPosition) * easeProgress;
            this.content.style.transform = `translate3d(0, ${currentY}px, 0)`;
            
            // Actualizar efectos parallax
            if (this.config.enableParallax) {
                this.updateParallaxEffects(progress);
            }
            
            // Continuar animación si no ha terminado
            if (progress < 1) {
                this.animationFrame = requestAnimationFrame(animateScroll);
            } else {
                // Animación completada
                this.isAnimating = false;
                this.animationFrame = null;
                this.updateUI();
                
                // Disparar evento personalizado
                this.dispatchScrollEvent();
            }
        };
        
        // Iniciar loop de animación
        this.animationFrame = requestAnimationFrame(animateScroll);
        
        // Actualizar UI inmediatamente
        this.updateUI();
    }

    easing(t) {
        // Cubic bezier easing para un movimiento suave y premium
        const c = this.config.snapEasing === 'cubic-bezier(0.645, 0.045, 0.355, 1)' 
            ? [0.645, 0.045, 0.355, 1]
            : [0.42, 0, 0.58, 1]; // ease-in-out por defecto
        
        return 1 - Math.pow(1 - t, 3); // Fallback easing cúbico
    }

    // ===== EFECTOS VISUALES =====
    updateParallaxEffects(progress) {
        // Aplicar efectos parallax a elementos con data-parallax
        const parallaxElements = this.content.querySelectorAll('[data-parallax]');
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const yOffset = progress * window.innerHeight * speed * 0.5;
            
            element.style.transform = `translate3d(0, ${yOffset}px, 0)`;
        });
    }

    updateProgressBar(deltaY) {
        if (!this.config.enableProgress || !this.progressBar) return;
        
        const progress = -this.content.style.transform.split(',')[1] / 
                        (window.innerHeight * (this.totalSections - 1)) || 0;
        
        this.progressBar.style.transform = `scaleX(${progress})`;
    }

    // ===== UI =====
    createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
        
        document.body.appendChild(progressBar);
        this.progressBar = progressBar;
    }

    createNavigationDots() {
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'nav-dots';
        
        for (let i = 0; i < this.totalSections; i++) {
            const dot = document.createElement('div');
            dot.className = 'nav-dot';
            dot.dataset.section = i;
            
            dot.addEventListener('click', () => {
                this.scrollToSection(i);
            });
            
            dotsContainer.appendChild(dot);
            this.navDots.push(dot);
        }
        
        document.body.appendChild(dotsContainer);
    }

    updateUI() {
        // Actualizar puntos de navegación
        this.navDots.forEach((dot, index) => {
            if (index === this.currentSection) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // Actualizar indicador de scroll
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            if (this.currentSection === this.totalSections - 1) {
                scrollIndicator.classList.add('hidden');
            } else {
                scrollIndicator.classList.remove('hidden');
            }
        }
        
        // Actualizar URL hash
        this.updateURLHash();
    }

    updateURLHash() {
        const currentSection = this.sections[this.currentSection];
        if (currentSection && currentSection.id) {
            history.replaceState(null, null, `#${currentSection.id}`);
        }
    }

    // ===== OBSERVADOR DE INTERSECCIÓN =====
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '-50px 0px -50px 0px'
        };
        
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                } else {
                    entry.target.classList.remove('in-view');
                }
            });
        }, observerOptions);
        
        // Observar elementos dentro de las secciones
        this.sections.forEach(section => {
            const animatedElements = section.querySelectorAll('.animate-on-scroll');
            animatedElements.forEach(element => {
                this.intersectionObserver.observe(element);
            });
        });
    }

    // ===== UTILIDADES =====
    calculateCurrentSection() {
        const currentY = Math.abs(parseFloat(this.content.style.transform.split(',')[1]) || 0);
        this.currentSection = Math.round(currentY / window.innerHeight);
    }

    dispatchScrollEvent() {
        const event = new CustomEvent('sectionChange', {
            detail: {
                section: this.currentSection,
                sectionId: this.sections[this.currentSection]?.id,
                totalSections: this.totalSections
            }
        });
        window.dispatchEvent(event);
    }

    toggleEnable() {
        this.isEnabled = !this.isEnabled;
        
        if (this.isEnabled) {
            this.content.style.pointerEvents = 'auto';
            console.log('✅ Scroll snapping habilitado');
        } else {
            this.content.style.pointerEvents = 'none';
            console.log('⏸️ Scroll snapping pausado');
        }
    }

    // ===== API PÚBLICA =====
    goToSection(sectionIndex) {
        this.scrollToSection(sectionIndex);
    }

    next() {
        this.scrollToSection(this.currentSection + 1);
    }

    prev() {
        this.scrollToSection(this.currentSection - 1);
    }

    enable() {
        this.isEnabled = true;
    }

    disable() {
        this.isEnabled = false;
    }

    destroy() {
        // Limpiar eventos
        window.removeEventListener('wheel', this.handleWheel);
        window.removeEventListener('touchstart', this.handleTouchStart);
        window.removeEventListener('touchmove', this.handleTouchMove);
        window.removeEventListener('touchend', this.handleTouchEnd);
        window.removeEventListener('keydown', this.handleKeydown);
        window.removeEventListener('resize', this.handleResize);
        
        // Cancelar animación
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        // Remover UI
        if (this.progressBar) this.progressBar.remove();
        if (this.navDots.length) {
            document.querySelector('.nav-dots')?.remove();
        }
        
        // Restaurar DOM
        if (this.container && this.content) {
            document.body.innerHTML = this.content.innerHTML;
            document.body.style.overflow = '';
            document.body.style.height = '';
        }
        
        console.log('🗑️ Smooth Scroll Snap destruido');
    }
}

// ===== INICIALIZACIÓN GLOBAL =====
let smoothScrollInstance = null;

function initSmoothScrollSnap(options = {}) {
    // Destruir instancia anterior si existe
    if (smoothScrollInstance) {
        smoothScrollInstance.destroy();
    }
    
    // Crear nueva instancia
    smoothScrollInstance = new SmoothScrollSnap(options);
    
    // Hacer disponible globalmente
    window.smoothScroll = smoothScrollInstance;
    
    return smoothScrollInstance;
}

// ===== EXPORTACIÓN =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SmoothScrollSnap, initSmoothScrollSnap };
} else {
    window.SmoothScrollSnap = SmoothScrollSnap;
    window.initSmoothScrollSnap = initSmoothScrollSnap;
}

// Auto-inicialización con opciones por defecto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.smoothScroll = initSmoothScrollSnap({
            snapDuration: 1000, // Un poco más lento para mayor elegancia
            snapEasing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
            snapThreshold: 0.1, // Más sensible
            wheelSensitivity: 1.2,
            enableParallax: true,
            enableProgress: true,
            enableNavigationDots: true
        });
    });
} else {
    window.smoothScroll = initSmoothScrollSnap({
        snapDuration: 1000,
        snapEasing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
        snapThreshold: 0.1,
        wheelSensitivity: 1.2,
        enableParallax: true,
        enableProgress: true,
        enableNavigationDots: true
    });
}