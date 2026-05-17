document.addEventListener('DOMContentLoaded', () => {

    // 1. GESTION DU CURSEUR PERSONNALISÉ (Désactivé sur mobile via CSS)
    const cursor = document.querySelector('.custom-cursor');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    const interactiveElements = document.querySelectorAll('a, .btn-contact');
    
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

    // 2. EFFET TILT 3D SUR LES CARTES PROJETS
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            // Uniquement si on est sur un écran d'ordinateur
            if(window.innerWidth > 768) {
                const rect = card.getBoundingClientRect();
                // Position de la souris relative à la carte
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Centre de la carte
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Calcul de l'inclinaison (Rotation max de 8 degrés pour rester élégant)
                const rotateX = ((y - centerY) / centerY) * -8;
                const rotateY = ((x - centerX) / centerX) * 8;

                // Application de la transformation 3D et de l'ombre dynamique
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                
                // L'ombre bouge à l'opposé de la lumière
                const shadowX = (x - centerX) / 10;
                const shadowY = (y - centerY) / 10;
                card.style.boxShadow = `${-shadowX}px ${-shadowY}px 40px rgba(0, 0, 0, 0.15)`;
            }
        });

        // Remise à zéro quand la souris quitte la carte
        card.addEventListener('mouseleave', () => {
            if(window.innerWidth > 768) {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                card.style.boxShadow = `none`;
            }
        });
    });

    // 3. ANIMATION D'APPARITION AU DÉFILEMENT (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.15 // Déclenche l'animation quand 15% de l'élément est visible
    });

    revealElements.forEach(element => {
        observer.observe(element);
    });
});