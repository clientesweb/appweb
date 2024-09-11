var menuIcon = document.querySelector(".menu-icon");
var sidebar = document.querySelector(".sidebar");
var container = document.querySelector(".container");

// -------- Function -------- 

var menuIcon = document.querySelector(".menu-icon");
var sidebar = document.querySelector(".sidebar");
var mainContainer = document.querySelector(".container");

// -------- Function -------- 
menuIcon.onclick = function(){
    sidebar.classList.toggle("small-sidebar");
    mainContainer.classList.toggle("large-container");
}

// IDs de los videos de YouTube de los shorts
const youtubeShorts = [
    '9Nr3SMzGuoU',
    '5Ia0gTq0kq8',
    '-8OGNYFZJtM',
];

let currentIndex = 0;
const shortsContainer = document.getElementById('shorts-container');

// Función para cargar un nuevo short de YouTube
function loadNewShort() {
    if (currentIndex >= youtubeShorts.length) return;

    const newShort = document.createElement('div');
    newShort.classList.add('short-item');
    newShort.innerHTML = `
        <iframe src="https://www.youtube.com/embed/${youtubeShorts[currentIndex]}?autoplay=0" 
        frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen></iframe>`;
    
    shortsContainer.appendChild(newShort);
    observeShort(newShort);
    currentIndex++;
}

// Función para pausar todos los iframes
function pauseAllIframes() {
    const iframes = document.querySelectorAll('.short-item iframe');
    iframes.forEach(iframe => {
        iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    });
}

// Intersection Observer para manejar la reproducción automática
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const iframe = entry.target.querySelector('iframe');
        if (entry.isIntersecting) {
            iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        } else {
            iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        }
    });
}, { threshold: 0.5 });

function observeShort(short) {
    observer.observe(short);
}

// Inicializar la carga de shorts
loadNewShort();
loadNewShort();

// Cargar más shorts al hacer scroll
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const containerHeight = shortsContainer.scrollHeight;

    if (scrollTop + windowHeight >= containerHeight - 100) {
        loadNewShort();
    }
});