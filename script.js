document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURATION ---
    const breakpointMobile = 1024; // Augmenté pour couvrir les tablettes (iPad)

    // 1. GESTION DU CURSEUR PERSONNALISÉ (Désactivé intelligemment sur Mobile/Tactile)
    const cursor = document.querySelector('.custom-cursor');

    // Fonction ultra-robuste pour détecter le tactile et les tablettes
    const isTouchOrMobile = () => {
        return (
            window.innerWidth <= breakpointMobile ||
            ('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0) ||
            // La sécurité ultime : si l'appareil principal de navigation est un doigt (tactile)
            window.matchMedia("(pointer: coarse)").matches 
        );
    };

    // --- LOGIQUE CONDITIONNELLE DU CURSEUR ---
    if (!isTouchOrMobile()) {
        // SI NOUS SOMMES SUR PC (Pas tactile, grand écran)

        // A. Suivi de la souris
        document.addEventListener('mousemove', (e) => {
            // Utilisation de requestAnimationFrame pour plus de fluidité
            requestAnimationFrame(() => {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
            });
        });

        // B. Effets de survol sur éléments interactifs
        const interactiveElements = document.querySelectorAll('a, .btn-contact, .project-card');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursor.style.backgroundColor = 'rgba(162, 164, 224, 0.2)'; // Plus transparent au survol
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.backgroundColor = 'rgba(162, 164, 224, 0.4)'; // Retour au style initial
            });
        });
    } else {
        // SI NOUS SOMMES SUR MOBILE/TABLETTE
        // On supprime carrément l'élément HTML du curseur pour être sûr qu'il n'interfère pas
        if (cursor) {
            cursor.remove();
        }
    }

    // 2. EFFET TILT 3D SUR LES CARTES PROJETS (Conservé uniquement sur PC)
    const cards = document.querySelectorAll('.project-card');

    if (!isTouchOrMobile()) {
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -8; // Max 8 degrés
                const rotateY = ((x - centerX) / centerX) * 8; // Max 8 degrés

                requestAnimationFrame(() => {
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                    
                    const shadowX = (x - centerX) / 10;
                    const shadowY = (y - centerY) / 10;
                    card.style.boxShadow = `${-shadowX}px ${-shadowY}px 40px rgba(0, 0, 0, 0.15)`;
                });
            });

            card.addEventListener('mouseleave', () => {
                requestAnimationFrame(() => {
                    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                    card.style.boxShadow = `0 15px 35px rgba(0, 0, 0, 0.08)`; // Retour à l'ombre CSS par défaut
                });
            });
        });
    }

    // 3. ANIMATION D'APPARITION AU DÉFILEMENT (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.15 
    });

    revealElements.forEach(element => {
        observer.observe(element);
    });
});