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
        slidesToShow: 3, // Número de slides a mostrar a la vez
        slidesToScroll: 1, // Número de slides a desplazar a la vez
        draggable: true, // Habilitar arrastre
        autoplay: true, // Opcional: para que el slider se desplace automáticamente
        autoplaySpeed: 2000, // Opcional: velocidad del autoplay en milisegundos
        dots: true, // Opcional: para mostrar los puntos de navegación
        infinite: true, // Opcional: para hacer el slider infinito
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });
});