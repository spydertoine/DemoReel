// Empêche le navigateur de scroller tout seul en bas au rechargement
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. PRELOADER (ÉCRAN DE CHARGEMENT) ---
    const preloader = document.querySelector('.preloader');
    const counterEl = document.querySelector('.loader-counter');
    let loadProgress = 0;

    // Simulation d'un chargement rapide et fluide
    const loadingInterval = setInterval(() => {
        loadProgress += Math.floor(Math.random() * 5) + 1; // Incrémente aléatoirement
        if (loadProgress >= 100) {
            loadProgress = 100;
            clearInterval(loadingInterval);
            setTimeout(() => {
                preloader.classList.add('hidden');
                document.body.style.overflow = 'auto'; // Réactive le scroll
            }, 300); // Laisse le 100% visible une fraction de seconde
        }
        counterEl.innerText = loadProgress + '%';
    }, 30);


    // --- 2. DARK MODE (Thème sombre) ---
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    
    // Vérifie si un thème était déjà sauvegardé
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.innerText = '☀️';
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            themeToggle.innerText = '☀️';
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggle.innerText = '🌙';
            localStorage.setItem('theme', 'light');
        }
    });


    // --- CONFIGURATION TACTILE ---
    const breakpointMobile = 1024;
    const isTouchOrMobile = () => {
        return (window.innerWidth <= breakpointMobile || ('ontouchstart' in window) || navigator.maxTouchPoints > 0 || window.matchMedia("(pointer: coarse)").matches);
    };


    // --- 3. CURSEUR & BOUTONS MAGNÉTIQUES ---
    const cursor = document.querySelector('.custom-cursor');

    if (!isTouchOrMobile()) {
        // Suivi de souris classique
        document.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
            });
        });

        const interactiveElements = document.querySelectorAll('a, button, .project-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursor.style.backgroundColor = 'rgba(162, 164, 224, 0.2)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.backgroundColor = 'rgba(162, 164, 224, 0.4)';
            });
        });

        // EFFET MAGNÉTIQUE SUR LES BOUTONS
        const magneticBtns = document.querySelectorAll('.magnetic-btn');
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                // Calcule la distance de la souris par rapport au centre du bouton
                const x = (e.clientX - rect.left) - rect.width / 2;
                const y = (e.clientY - rect.top) - rect.height / 2;
                // Déplace légèrement le bouton (force de 30%)
                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = `translate(0px, 0px)`; // Retour en place
            });
        });

    } else {
        if (cursor) cursor.remove();
    }


    // --- 4. CARTES PROJETS : EFFET TILT 3D & VIDÉO HOVER ---
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        // Logique de lecture vidéo au survol (Fonctionne même sur mobile via pression)
        const hoverVideo = card.querySelector('.hover-video');
        if (hoverVideo) {
            card.addEventListener('mouseenter', () => hoverVideo.play());
            card.addEventListener('mouseleave', () => {
                hoverVideo.pause();
                hoverVideo.currentTime = 0; // Remet la vidéo à zéro quand on quitte
            });
        }

        // Effet 3D Tilt (PC uniquement)
        if (!isTouchOrMobile()) {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -8;
                const rotateY = ((x - centerX) / centerX) * 8;

                requestAnimationFrame(() => {
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                    card.style.boxShadow = `${-(x - centerX) / 10}px ${-(y - centerY) / 10}px 40px rgba(0, 0, 0, 0.15)`;
                });
            });

            card.addEventListener('mouseleave', () => {
                requestAnimationFrame(() => {
                    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                    card.style.boxShadow = `0 15px 35px rgba(0, 0, 0, 0.08)`;
                });
            });
        }
    });


    // --- 5. LECTEUR VIDÉO PRINCIPAL : AVANCE/RETOUR 10S ---
    const videoElement = document.getElementById('showreel-video');
    if (videoElement) {
        document.addEventListener('keydown', (e) => {
            const rect = videoElement.getBoundingClientRect();
            const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
            if (isVisible) {
                if (e.key === 'ArrowRight') {
                    videoElement.currentTime += 10;
                    e.preventDefault();
                } else if (e.key === 'ArrowLeft') {
                    videoElement.currentTime -= 10;
                    e.preventDefault();
                }
            }
        });
    }

    // --- 6. ANIMATION D'APPARITION AU DÉFILEMENT ---
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(element => observer.observe(element));

});