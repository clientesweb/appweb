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

$(document).ready(function(){
    $('.slick-list').slick({
        slidesToShow: 1, // Muestra un slide a la vez
        slidesToScroll: 1, // Desplaza un slide a la vez
        infinite: true, // Habilita el desplazamiento infinito
        autoplay: true, // Habilita el autoplay
        autoplaySpeed: 5000, // Velocidad de autoplay en milisegundos (5 segundos)
        arrows: true, // Activa las flechas de navegación
        dots: true, // Habilita los puntos de navegación
        speed: 1000 // Velocidad de transición entre slides en milisegundos (1 segundo)
    });
});