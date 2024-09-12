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
    $('.slick-slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        arrows: true, // Puedes activar/desactivar las flechas
        dots: true, // Puedes activar/desactivar los puntos de navegación
        autoplay: true,
        autoplaySpeed: 3000, // Tiempo entre cada slide (en milisegundos)
        draggable: true // Permite arrastrar el slider
    });
});