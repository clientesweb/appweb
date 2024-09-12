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
        slidesToShow: 1, // Muestra un slide a la vez en vista vertical
        slidesToScroll: 1, // Desplaza un slide a la vez
        draggable: true, // Habilita arrastre
        vertical: true, // Hacer el slider vertical
        verticalSwiping: true, // Habilita el arrastre vertical
        autoplay: true, // Opcional: para que el slider se desplace automáticamente
        autoplaySpeed: 3000, // Opcional: velocidad del autoplay en milisegundos
        dots: true, // Opcional: para mostrar los puntos de navegación
        infinite: true, // Opcional: para hacer el slider infinito
        arrows: true // Mostrar flechas de navegación
    });
});