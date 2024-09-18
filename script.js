document.getElementById('menu-toggle').addEventListener('click', function() {
    document.getElementById('nav-menu').classList.toggle('active');
});

document.addEventListener('DOMContentLoaded', () => {
    // Lista de IDs de YouTube Shorts
    const shortsIds = [

        'e2C7FzMQWiY',
        'E2E-UIDfPhE',
        '64b83rJ19xE',
        'n3a02UEWwhM',
        'aug6ZvAjyVE',
        '565kztuKF2A',
        'J2J3cVbqHr0',
        'CjOT--oEtDE',
        'kPp8PCxp8qk',
        'oFdVkDcE_sg'

        // Agrega más IDs de Shorts aquí
    ];

    const shortsSection = document.getElementById('shorts-section');

    // Función para crear un elemento de Short
    function createShortElement(videoId) {
        const shortItem = document.createElement('div');
        shortItem.className = 'short-item';
        shortItem.innerHTML = `
            <iframe src="https://www.youtube.com/embed/${videoId}?rel=0"
                    frameborder="0"
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
    
    // Clonar los primeros elementos para el efecto infinito
    for (let i = 0; i < totalItems; i++) {
        const clone = items[i].cloneNode(true);
        slider.appendChild(clone);
    }

    let itemWidth = items[0].offsetWidth;
    let totalWidth = itemWidth * totalItems;
    slider.style.width = `${totalWidth * 2}px`;

    let currentIndex = 0;
    const transitionDuration = 2; // Duración de la transición en segundos (más lenta)
    const slideInterval = 5000; // Intervalo entre slides en milisegundos (5 segundos)
    
    slider.style.transition = `transform ${transitionDuration}s ease-in-out`;

    const slideToNext = () => {
        currentIndex++;
        if (currentIndex >= totalItems) {
            currentIndex = 0;
            slider.style.transition = 'none';
            slider.style.transform = `translateX(0px)`;
            setTimeout(() => {
                slider.style.transition = `transform ${transitionDuration}s ease-in-out`;
                currentIndex = totalItems;
                slider.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
            }, 20);
        } else {
            slider.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        }
    };

    // Cambiar el slide cada 5 segundos
    setInterval(slideToNext, slideInterval);

    // Asegurar la experiencia táctil para dispositivos móviles
    slider.addEventListener('touchstart', (e) => {
        const touchStartX = e.touches[0].clientX;
        slider.addEventListener('touchmove', (e) => {
            const touchMoveX = e.touches[0].clientX;
            if (touchMoveX - touchStartX < -50) { // Desplazar a la izquierda
                slideToNext();
                slider.removeEventListener('touchmove', arguments.callee);
            }
        }, { passive: true });
    }, { passive: true });

    // Reajustar el ancho del slider cuando se cambia el tamaño de la ventana
    const updateItemWidth = () => {
        itemWidth = items[0].offsetWidth;
        totalWidth = itemWidth * totalItems;
        slider.style.width = `${totalWidth * 2}px`;
    };
    window.addEventListener('resize', updateItemWidth);
    updateItemWidth();
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
const MAX_RESULTS = 10; // Número de resultados a obtener por solicitud
const CACHE_KEY = 'playlistData';
const CACHE_EXPIRY = 10 * 60 * 1000; // Caché expira en 10 minutos
const playlistSlider = document.getElementById('playlist-slider');
const youtubeChat = document.getElementById('youtube-live-chat'); // El contenedor del chat
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

// Función para verificar si un video está en vivo
async function checkIfLive(videoId) {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${videoId}&key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    // Verifica si el video tiene detalles de transmisión en vivo
    return data.items[0]?.liveStreamingDetails ? true : false;
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

// Función para mostrar el chat de YouTube si hay un video en vivo
function showYouTubeChat(videoId) {
    youtubeChat.innerHTML = `
        <iframe 
            src="https://www.youtube.com/live_chat?v=${videoId}&embed_domain=${window.location.hostname}" 
            width="350" 
            height="500" 
            frameborder="0" 
            allowfullscreen>
        </iframe>
    `;
    youtubeChat.style.display = 'block'; // Muestra el chat
}

// Función para cargar los videos
async function loadVideos() {
    const videos = await fetchPlaylistItems(nextPageToken);
    
    for (const video of videos) {
        const videoId = video.snippet.resourceId.videoId;
        const isLive = await checkIfLive(videoId); // Verifica si el video está en vivo
        
        const videoElement = createVideoElement(video);
        playlistSlider.appendChild(videoElement);

        // Si hay un video en vivo, muestra el chat
        if (isLive) {
            showYouTubeChat(videoId);
        }
    }

    // Carga diferida
    lazyLoadIframes();

    // Cargar más videos si hay un token para la siguiente página
    if (nextPageToken) {
        const loadMoreButton = document.createElement('button');
        loadMoreButton.textContent = 'Cargar más';
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


document.getElementById('whatsappBtn').addEventListener('click', function() {
    document.getElementById('whatsappModal').style.display = 'block';
});

document.querySelector('.whatsapp-close').addEventListener('click', function() {
    document.getElementById('whatsappModal').style.display = 'none';
});

document.getElementById('sendMessageBtn').addEventListener('click', function() {
    const message = document.getElementById('whatsappMessage').value.trim();
    const phoneNumber = '593978606269'; // Número de WhatsApp al que se enviará el mensaje
    if (message) {
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank'); // Abre WhatsApp Web con el mensaje preescrito
        document.getElementById('whatsappModal').style.display = 'none';
        document.getElementById('whatsappMessage').value = '';
    } else {
        alert('Por favor, escribe un mensaje antes de enviar.');
    }
});
