var menuIcon = document.querySelector(".menu-icon");
var sidebar = document.querySelector(".sidebar");
var container = document.querySelector(".container");

// -------- Function -------- 

menuIcon.onclick = function(){
    sidebar.classList.toggle("small-sidebar");
    container.classList.toggle("large-container");
}
// IDs de los videos de YouTube (puedes obtener estos de tu playlist de shorts)
const youtubeVideos = [
    'https://www.youtube.com/shorts/9Nr3SMzGuoU?feature=share',
    'https://www.youtube.com/shorts/5Ia0gTq0kq8?feature=share',
    'https://www.youtube.com/shorts/-8OGNYFZJtM?feature=share',
    // Añade los IDs de todos los videos de la playlist
];

let currentIndex = 0;
const container = document.getElementById('shorts-container');

// Función para cargar un nuevo short de YouTube
function loadNewShort() {
    if (currentIndex >= youtubeVideos.length) return; // Si no hay más videos, detener carga

    // Crear un nuevo iframe para el video
    const newShort = document.createElement('div');
    newShort.classList.add('short-item');
    newShort.innerHTML = `<iframe width="100%" height="100%" 
                          src="https://www.youtube.com/embed/${youtubeVideos[currentIndex]}?rel=0&autoplay=0" 
                          frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowfullscreen></iframe>`;
    
    // Agregarlo al contenedor
    container.appendChild(newShort);
    currentIndex++;
}

// Escuchar el evento de scroll
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const containerHeight = container.scrollHeight;

    // Cuando el usuario está cerca del final, cargar más videos
    if (scrollTop + windowHeight >= containerHeight - 100) {
        loadNewShort();
    }
});

// Cargar los primeros videos al inicio
loadNewShort();
loadNewShort();