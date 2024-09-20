document.getElementById('menu-toggle').addEventListener('click', function() {
    document.getElementById('nav-menu').classList.toggle('active');
});

document.addEventListener('DOMContentLoaded', () => {
    // Clave de API de YouTube y ID de la playlist
    const apiKey = 'AIzaSyB4HGg2WVC-Sq3Qyj9T9Z9aBBGbET1oGs0'; // Reemplaza con tu clave de API
    const playlistId = 'PLZ_v3bWMqpjFa0xI11mahmOCxPk_1TK2s'; // Reemplaza con el ID de tu playlist

    const shortsSection = document.getElementById('shorts-section');
    const maxResults = 5; // Máximo de shorts a mostrar

    // Mostrar un loader mientras se cargan los iframes
    function showLoader() {
        for (let i = 0; i < maxResults; i++) {
            const shortItem = document.createElement('div');
            shortItem.className = 'short-item loader'; // Clase para estilo de carga
            shortsSection.appendChild(shortItem);
        }
    }

    // Remover el loader
    function removeLoader() {
        const loaders = document.querySelectorAll('.loader');
        loaders.forEach(loader => loader.remove());
    }

    // Función para obtener los videos de la playlist
    function fetchPlaylistVideos(pageToken = '') {
        const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${maxResults}&playlistId=${playlistId}&key=${apiKey}&pageToken=${pageToken}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                removeLoader(); // Elimina el loader antes de cargar los iframes

                data.items.forEach(item => {
                    const videoId = item.snippet.resourceId.videoId;
                    const shortElement = createShortElement(videoId);
                    shortsSection.appendChild(shortElement);
                });
            })
            .catch(error => {
                console.error('Error al cargar la playlist de YouTube:', error);
                removeLoader(); // Remover el loader en caso de error
            });
    }

    // Crear elemento de Short con lazy loading
    function createShortElement(videoId) {
        const shortItem = document.createElement('div');
        shortItem.className = 'short-item';
        shortItem.innerHTML = `
            <iframe src="https://www.youtube.com/embed/${videoId}?rel=0"
                    loading="lazy"  // Carga diferida para mejorar la velocidad
                    frameborder="0"
                    allowfullscreen>
            </iframe>
        `;
        return shortItem;
    }

    // Mostrar loaders y cargar Shorts al iniciar
    showLoader();
    fetchPlaylistVideos();
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
const MAX_RESULTS = 5; // Número de videos a obtener
const CACHE_KEY = 'playlistData';
const CACHE_EXPIRY = 10 * 60 * 1000; // Caché expira en 10 minutos

const playlistSlider = document.getElementById('playlist-slider');

// Función para obtener datos de la caché
function getCachedData() {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
        const data = JSON.parse(cached);
        const now = new Date().getTime();
        if (now - data.timestamp < CACHE_EXPIRY) {
            return data.items;
        }
    }
    return null;
}

// Función para guardar datos en caché
function setCachedData(items) {
    const data = {
        items: items,
        timestamp: new Date().getTime()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
}

// Función para obtener videos de la playlist
async function fetchPlaylistItems() {
    const cachedData = getCachedData();
    if (cachedData) {
        return cachedData;
    }

    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${PLAYLIST_ID}&key=${API_KEY}&maxResults=${MAX_RESULTS}`;
    const response = await fetch(url);
    const data = await response.json();
    const items = data.items;

    // Guardar en caché
    setCachedData(items);

    return items;
}

// Función para crear el elemento de iframe del video
function createVideoElement(video) {
    const videoId = video.snippet.resourceId.videoId;
    const iframe = document.createElement('iframe');
    iframe.dataset.src = `https://www.youtube.com/embed/${videoId}`;
    iframe.frameBorder = '0';
    iframe.allow = 'autoplay; encrypted-media';
    iframe.allowFullscreen = true;
    iframe.className = 'playlist-item lazy'; // Clase lazy para la carga diferida

    return iframe;
}

// Función para cargar los videos
async function loadVideos() {
    const videos = await fetchPlaylistItems();
    videos.forEach(video => {
        const videoElement = createVideoElement(video);
        playlistSlider.appendChild(videoElement);
    });

    // Carga diferida
    lazyLoadIframes();
}

// Función para cargar iframes cuando están en el viewport
function lazyLoadIframes() {
    const iframes = document.querySelectorAll('iframe.lazy');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const iframe = entry.target;
                iframe.src = iframe.dataset.src; // Carga el iframe cuando está visible
                iframe.classList.remove('lazy');
                observer.unobserve(iframe); // Deja de observar el iframe una vez cargado
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
