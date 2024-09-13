document.getElementById('menu-toggle').addEventListener('click', function() {
    document.getElementById('nav-menu').classList.toggle('active');
});
 document.addEventListener('DOMContentLoaded', () => {
    // Lista de IDs de YouTube Shorts
    const shortsIds = [
        '5Ia0gTq0kq8',
        '9Nr3SMzGuoU',
        '-8OGNYFZJtM',
        'QlQdYxAT_fk',
        '5E24fAubqm0',
        'X1IVvJuR8aA',
        'S3oYxa0WHlI'
        // Agrega más IDs de Shorts aquí
    ];

    const shortsSection = document.getElementById('shorts-section');

    // Función para crear un elemento de Short
    function createShortElement(videoId) {
        const shortItem = document.createElement('div');
        shortItem.className = 'short-item';
        shortItem.innerHTML = `
            <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}"
                    allowfullscreen>
            </iframe>
        `;
        return shortItem;
    }

    // Cargar Shorts
    shortsIds.forEach(id => {
        const shortElement = createShortElement(id);
        shortsSection.appendChild(shortElement);
    });

    // Implementar scroll infinito
    shortsSection.addEventListener('scroll', () => {
        if (shortsSection.scrollTop + shortsSection.clientHeight >= shortsSection.scrollHeight - 100) {
            // Cargar más Shorts cuando el usuario se acerca al final
            const randomId = shortsIds[Math.floor(Math.random() * shortsIds.length)];
            if (![...shortsSection.children].some(child => child.innerHTML.includes(randomId))) {
                const newShort = createShortElement(randomId);
                shortsSection.appendChild(newShort);
            }
        }
    });
}); 
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.sponsors-slider');
    const items = slider.children;
    const totalItems = items.length;
    const itemWidth = items[0].offsetWidth;

    // Clonar los primeros elementos para el efecto infinito
    for (let i = 0; i < totalItems; i++) {
        const clone = items[i].cloneNode(true);
        slider.appendChild(clone);
    }

    let currentIndex = 0;
    const slideToNext = () => {
        currentIndex++;
        if (currentIndex >= totalItems) {
            currentIndex = 0;
            slider.style.transition = 'none';
            slider.style.transform = `translateX(0px)`;
            setTimeout(() => {
                slider.style.transition = 'transform 0.5s ease';
            }, 20);
        } else {
            slider.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        }
    };

    // Cambiar el slide cada 3 segundos
    setInterval(slideToNext, 3000);
});
// Ocultar el preloader una vez que el video termine
window.addEventListener('load', function() {
    var preloader = document.getElementById('preloader');
    var preloaderVideo = document.getElementById('preloader-video');
    var mainContent = document.getElementById('main-content');

    // Carga y reproduce el video solo después de que el DOM esté completamente cargado
    preloaderVideo.setAttribute('autoplay', true); // Activa autoplay dinámicamente
    preloaderVideo.load(); // Carga el video

    // Oculta el preloader después de que termine el video
    preloaderVideo.onended = function() {
        preloader.style.display = 'none';  // Oculta el preloader
        mainContent.style.display = 'block';  // Muestra el contenido principal
    };
});