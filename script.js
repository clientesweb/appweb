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

// IDs de los videos de YouTube de la playlist (ejemplo de IDs)
const youtubeVideos = [
    '9Nr3SMzGuoU', // Video 1
    '5Ia0gTq0kq8', // Video 2
    '-8OGNYFZJtM', // Video 3
    // Agrega más videos según tu playlist
];

let currentIndex = 0; // Índice del video actual
const shortsContainer = document.getElementById('shorts-container');

// Función para cargar un nuevo short de YouTube
function loadNewShort() {
    if (currentIndex >= youtubeVideos.length) return; // Si no hay más videos, detener carga

    // Crear un nuevo iframe para el video
    const newShort = document.createElement('div');
    newShort.classList.add('short-item');
    newShort.innerHTML = `
        <iframe width="100%" height="100%" 
        src="https://www.youtube.com/embed/${youtubeVideos[currentIndex]}?rel=0&autoplay=0" 
        frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen></iframe>`;
    
    // Agregar el iframe al contenedor
    shortsContainer.appendChild(newShort);
    observeShort(newShort); // Observar el nuevo short
    currentIndex++;
}

// Función para pausar todos los iframes
function pauseAllIframes() {
    const iframes = document.querySelectorAll('.short-item iframe');
    iframes.forEach(iframe => {
        iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    });
}

// Intersection Observer para detectar cuándo un iframe está visible
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const iframe = entry.target.querySelector('iframe');
        if (entry.isIntersecting) {
            // Cuando el iframe está visible, reproducir el video
            iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        } else {
            // Cuando el iframe sale de la vista, pausar el video
            iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        }
    });
}, { threshold: 0.5 }); // El 50% del video debe estar visible para que se reproduzca

// Función para observar un short individual
function observeShort(short) {
    observer.observe(short);
}

// Cargar los primeros shorts al cargar la página
loadNewShort();
loadNewShort();

// Escuchar el evento de scroll para cargar más videos y observarlos
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const containerHeight = shortsContainer.scrollHeight;

    // Cuando el usuario está cerca del final, cargar más videos
    if (scrollTop + windowHeight >= containerHeight - 100) {
        loadNewShort();
    }
});

// Inicialmente observar los primeros shorts cargados
document.querySelectorAll('.short-item').forEach(short => {
    observeShort(short);
});

// Funcionalidad de la barra lateral y contenedor
var menuIcon = document.querySelector(".menu-icon");
var sidebar = document.querySelector(".sidebar");
var mainContainer = document.querySelector(".container");

menuIcon.onclick = function(){
    sidebar.classList.toggle("small-sidebar");
    mainContainer.classList.toggle("large-container");
}