// Menú toggle
document.getElementById('menu-toggle').addEventListener('click', () => {
    document.getElementById('nav-menu').classList.toggle('active');
});

// Función para crear un elemento de Short
function createShortElement(videoId) {
    const shortItem = document.createElement('div');
    shortItem.className = 'short-item';
    shortItem.innerHTML = `
        <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}"
                allowfullscreen></iframe>
    `;
    return shortItem;
}

// Cargar YouTube Shorts
document.addEventListener('DOMContentLoaded', () => {
    const shortsIds = [
        'n3a02UEWwhM', 'aug6ZvAjyVE', '565kztuKF2A', 'J2J3cVbqHr0',
        'CjOT--oEtDE', 'kPp8PCxp8qk', 'oFdVkDcE_sg'
    ];
    const shortsSection = document.getElementById('shorts-section');

    shortsIds.forEach(id => {
        const shortElement = createShortElement(id);
        shortsSection.appendChild(shortElement);
    });

    // Implementar scroll infinito
    shortsSection.addEventListener('scroll', () => {
        if (shortsSection.scrollTop + shortsSection.clientHeight >= shortsSection.scrollHeight - 100) {
            const randomId = shortsIds[Math.floor(Math.random() * shortsIds.length)];
            if (![...shortsSection.children].some(child => child.innerHTML.includes(randomId))) {
                const newShort = createShortElement(randomId);
                shortsSection.appendChild(newShort);
            }
        }
    });
});

// Función para el slider de patrocinadores
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.sponsors-slider');
    const items = slider.children;
    const totalItems = items.length;
    
    for (let i = 0; i < totalItems; i++) {
        slider.appendChild(items[i].cloneNode(true));
    }

    let itemWidth = items[0].offsetWidth;
    slider.style.width = `${itemWidth * totalItems * 2}px`;
    slider.style.transition = 'transform 2s ease-in-out';

    let currentIndex = 0;
    const slideInterval = 5000;
    
    const slideToNext = () => {
        currentIndex++;
        if (currentIndex >= totalItems) {
            currentIndex = 0;
            slider.style.transition = 'none';
            slider.style.transform = 'translateX(0px)';
            setTimeout(() => {
                slider.style.transition = 'transform 2s ease-in-out';
                currentIndex = totalItems;
                slider.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
            }, 20);
        } else {
            slider.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        }
    };

    setInterval(slideToNext, slideInterval);

    slider.addEventListener('touchstart', (e) => {
        const touchStartX = e.touches[0].clientX;
        slider.addEventListener('touchmove', (e) => {
            const touchMoveX = e.touches[0].clientX;
            if (touchMoveX - touchStartX < -50) {
                slideToNext();
                slider.removeEventListener('touchmove', arguments.callee);
            }
        }, { passive: true });
    }, { passive: true });

    window.addEventListener('resize', () => {
        itemWidth = items[0].offsetWidth;
        slider.style.width = `${itemWidth * totalItems * 2}px`;
    });
});

// Carrusel de imágenes
document.addEventListener('DOMContentLoaded', () => {
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const carouselImages = document.querySelector('.carousel-images');
    let index = 0;
    const imageCount = document.querySelectorAll('.carousel-images img').length;

    const updateCarousel = () => {
        carouselImages.style.transform = `translateX(${-index * 100}%)`;
    };

    prevButton.addEventListener('click', () => {
        index = (index > 0) ? index - 1 : imageCount - 1;
        updateCarousel();
    });

    nextButton.addEventListener('click', () => {
        index = (index < imageCount - 1) ? index + 1 : 0;
        updateCarousel();
    });

    setInterval(() => nextButton.click(), 5000);
});

// Obtener y cachear videos de YouTube
const API_KEY = 'AIzaSyB4HGg2WVC-Sq3Qyj9T9Z9aBBGbET1oGs0';
const PLAYLIST_ID = 'PLZ_v3bWMqpjEYZDAFLI-0GuAH4BpA5PiL';
const MAX_RESULTS = 10;
const CACHE_KEY = 'playlistData';
const CACHE_EXPIRY = 10 * 60 * 1000;

const playlistSlider = document.getElementById('playlist-slider');
let nextPageToken = '';

function getCachedData() {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
        const data = JSON.parse(cached);
        const now = Date.now();
        if (now - data.timestamp < CACHE_EXPIRY) {
            return data;
        }
    }
    return null;
}

function setCachedData(items, nextPageToken) {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
        items: items,
        nextPageToken: nextPageToken,
        timestamp: Date.now()
    }));
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
    nextPageToken = data.nextPageToken || '';

    if (!pageToken) {
        setCachedData(data.items, nextPageToken);
    }

    return data.items;
}

function createVideoElement(video) {
    const videoId = video.snippet.resourceId.videoId;
    const iframe = document.createElement('iframe');
    iframe.dataset.src = `https://www.youtube.com/embed/${videoId}`;
    iframe.frameBorder = '0';
    iframe.allow = 'autoplay; encrypted-media';
    iframe.allowFullscreen = true;
    iframe.className = 'playlist-item lazy';

    return iframe;
}

async function loadVideos() {
    const videos = await fetchPlaylistItems(nextPageToken);
    videos.forEach(video => {
        playlistSlider.appendChild(createVideoElement(video));
    });

    lazyLoadIframes();

    if (nextPageToken) {
        const loadMoreButton = document.createElement('button');
        loadMoreButton.textContent = 'Load More';
        loadMoreButton.addEventListener('click', async () => {
            loadMoreButton.disabled = true;
            const moreVideos = await fetchPlaylistItems(nextPageToken);
            moreVideos.forEach(video => {
                playlistSlider.appendChild(createVideoElement(video));
            });
            lazyLoadIframes();
            loadMoreButton.disabled = false;
        });
        playlistSlider.parentElement.appendChild(loadMoreButton);
    }
}

function lazyLoadIframes() {
    const iframes = document.querySelectorAll('iframe.lazy');
    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const iframe = entry.target;
                iframe.src = iframe.dataset.src;
                iframe.classList.remove('lazy');
                observer.unobserve(iframe);
            }
        });
    });

    iframes.forEach(iframe => observer.observe(iframe));
}

window.onload = loadVideos;

// WhatsApp Modal
document.getElementById('whatsappBtn').addEventListener('click', () => {
    document.getElementById('whatsappModal').style.display = 'block';
});

document.querySelector('.whatsapp-close').addEventListener('click', () => {
    document.getElementById('whatsappModal').style.display = 'none';
});

document.getElementById('sendMessageBtn').addEventListener('click', () => {
    const message = document.getElementById('whatsappMessage').value.trim();
    const phoneNumber = '593978606269';
    if (message) {
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
        document.getElementById('whatsappModal').style.display = 'none';
        document.getElementById('whatsappMessage').value = '';
    } else {
        alert('Por favor, escribe un mensaje antes de enviar.');
    }
});