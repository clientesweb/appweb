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
const MAX_RESULTS = 50; // Número de resultados a obtener por solicitud
const CACHE_KEY = 'playlistData';
const CACHE_EXPIRY = 10 * 60 * 1000; // Caché expira en 10 minutos

const playlistSlider = document.getElementById('playlist-slider');
let nextPageToken = ''; // Token para la siguiente página

// Función para obtener datos de la caché
function getCachedData() {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
        const data = JSON.parse(cached);
        const now = new Date().getTime();
        if (now - data.timestamp < CACHE_EXPIRY) {
            return data;
        }
    }
    return null;
}

// Función para guardar datos en caché
function setCachedData(items, nextPageToken) {
    const data = {
        items: items,
        nextPageToken: nextPageToken,
        timestamp: new Date().getTime()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
}

async function fetchPlaylistItems(pageToken = '') {
    const cachedData = getCachedData();
    if (cachedData && !pageToken) {
        nextPageToken = cachedData.nextPageToken;
        return cachedData.items;
    }

    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${PLAYLIST_ID}&key=${API_KEY}&maxResults=${MAX_RESULTS}${pageToken ? `&pageToken=${pageToken}` : ''}`;
    const response = await fetch(url);
    const data = await response.json();
    const items = data.items;
    nextPageToken = data.nextPageToken || '';

    // Guardar en caché si no estamos paginando
    if (!pageToken) {
        setCachedData(items, nextPageToken);
    }

    return items;
}

function createVideoElement(video) {
    const videoId = video.snippet.resourceId.videoId;
    const iframe = document.createElement('iframe');
    iframe.dataset.src = `https://www.youtube.com/embed/${videoId}`; // Usa data-src para carga diferida
    iframe.frameBorder = '0';
    iframe.allow = 'autoplay; encrypted-media';
    iframe.allowFullscreen = true;
    iframe.className = 'playlist-item lazy'; // Añade la clase lazy

    return iframe;
}

// Función para cargar los videos
async function loadVideos() {
    const videos = await fetchPlaylistItems(nextPageToken);
    videos.forEach(video => {
        const videoElement = createVideoElement(video);
        playlistSlider.appendChild(videoElement);
    });

    // Carga diferida
    lazyLoadIframes();

    // Cargar más videos si hay un token para la siguiente página
    if (nextPageToken) {
        const loadMoreButton = document.createElement('button');
        loadMoreButton.textContent = 'Load More Videos';
        loadMoreButton.addEventListener('click', async () => {
            loadMoreButton.disabled = true;
            const moreVideos = await fetchPlaylistItems(nextPageToken);
            moreVideos.forEach(video => {
                const videoElement = createVideoElement(video);
                playlistSlider.appendChild(videoElement);
            });
            lazyLoadIframes();
            loadMoreButton.disabled = false;
        });
        playlistSlider.parentElement.appendChild(loadMoreButton);
    }
}

// Función para cargar iframes cuando están en el viewport
function lazyLoadIframes() {
    const iframes = document.querySelectorAll('iframe.lazy');
    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const iframe = entry.target;
                iframe.src = iframe.dataset.src; // Carga el iframe
                iframe.classList.remove('lazy');
                observer.unobserve(iframe); // Deja de observar el iframe
            }
        });
    });

    iframes.forEach(iframe => observer.observe(iframe));
}

window.onload = loadVideos;