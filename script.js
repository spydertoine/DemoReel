document.addEventListener('DOMContentLoaded', () => {

    // 1. GESTION DU CURSEUR PERSONNALISÉ
    const cursor = document.querySelector('.custom-cursor');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Effet d'agrandissement du curseur sur les éléments cliquables
    const interactiveElements = document.querySelectorAll('a, .project-card, .btn-contact');

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

    // 2. ANIMATION D'APPARITION AU DÉFILEMENT (Intersection Observer)
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