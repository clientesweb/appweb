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

document.addEventListener('DOMContentLoaded', () => {
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const carouselImages = document.querySelector('.carousel-images');
    let index = 0;
    const imageCount = document.querySelectorAll('.carousel-images img').length;

    function updateCarousel() {
        const offset = -index * 100;
        carouselImages.style.transform = `translateX(${offset}%)`;
    }

    prevButton.addEventListener('click', () => {
        index = (index > 0) ? index - 1 : imageCount - 1;
        updateCarousel();
    });

    nextButton.addEventListener('click', () => {
        index = (index < imageCount - 1) ? index + 1 : 0;
        updateCarousel();
    });

    // Optional: Auto-slide every 5 seconds
    setInterval(() => {
        nextButton.click();
    }, 5000);
});

const API_KEY = 'AIzaSyB4HGg2WVC-Sq3Qyj9T9Z9aBBGbET1oGs0';
const PLAYLIST_ID = 'PLZ_v3bWMqpjEYZDAFLI-0GuAH4BpA5PiL'; // Reemplaza con tu ID de playlist

const playlistSlider = document.getElementById('playlist-slider');

async function fetchPlaylistItems() {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${PLAYLIST_ID}&key=${API_KEY}&maxResults=50`);
    const data = await response.json();
    return data.items;
}

function createVideoElement(video) {
    const videoId = video.snippet.resourceId.videoId;
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}`;
    iframe.frameBorder = '0';
    iframe.allow = 'autoplay; encrypted-media';
    iframe.allowFullscreen = true;
    iframe.className = 'playlist-item';

    return iframe;
}

async function loadVideos() {
    const videos = await fetchPlaylistItems();
    videos.forEach(video => {
        const videoElement = createVideoElement(video);
        playlistSlider.appendChild(videoElement);
    });
}

window.onload = loadVideos;