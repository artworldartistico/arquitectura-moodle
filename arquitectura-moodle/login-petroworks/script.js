document.addEventListener('DOMContentLoaded', function () {
    const textElement = document.getElementById('text');
    const imageElement = document.getElementById('image');
    let isPower = true;

    function toggleText() {
        textElement.classList.add('fade-out');
        setTimeout(() => {
            textElement.innerHTML = `Somos <img id="image" src="${isPower ? 'images/logo-petroworks-nuevo.png' : 'images/Power.png'}" alt="${isPower ? 'Petroworks' : 'Power'}">`;
            isPower = !isPower;
            textElement.classList.remove('fade-out');
            setTimeout(() => {
                textElement.classList.add('fade-in');
                setTimeout(() => {
                    textElement.classList.remove('fade-in');
                    setTimeout(toggleText, 2000); // Espera 2 segundos antes de iniciar la siguiente animación
                }, 1000); // Tiempo de animación de fade-in
            }, 10); // Breve pausa para permitir la eliminación de la clase anterior
        }, 1000); // Tiempo de animación de fade-out
    }

    setTimeout(toggleText, 2000); // Espera 2 segundos antes de iniciar la primera animación
});

//FIELD EYEE FOR SEE THE PASSWORD

var passField = document.querySelector(".home .contentBx .formBx form .wrapper input");
var btnEye = document.querySelector("span i");

btnEye.onclick = function(){
    if(passField.type === "password"){
        passField.type = "text";
        btnEye.classList.add("hide-btn");
    }else{
        passField.type = "password";
        btnEye.classList.remove("hide-btn");
    }
}

//PARALLAX EFFECTS

const container = document.getElementById('box-container');
        const boxes = document.querySelectorAll('.box');

        document.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            boxes.forEach((box, index) => {
                const depth = (index + 1) * 25;
                box.style.transform = `translateY(${scrollPosition / depth}%)`;
            });
        });

        container.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            boxes.forEach((box, index) => {
                const depth = (index + 1) * 7;
                const offsetX = (mouseX - centerX) / depth;
                const offsetY = (mouseY - centerY) / depth;
                box.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            });
        });

//MULTIPLE TYPING TEXT ANIMATION

const text = document.querySelector(".sec-text");

const textLoad = () => {
    setTimeout(() => {
        text.textContent = "o Power";
    }, 0);
    setTimeout(() => {
        text.textContent = "a gente";
    }, 4000);
};

// Inicialmente carga el texto
textLoad();

// Configura el intervalo para que llame a textLoad cada 8 segundos
setInterval(textLoad, 8000);


//SLIDER VIDEOS

const videoElement = document.querySelector('.slider-videos');
const videoSources = [
    'videos/DJI_0224.MP4',
    'videos/DJI_0400.MP4',
    'videos/DJI_0805.MP4',
    'videos/DJI_0996.MP4'
];

let currentVideoIndex = 0;

function videoslider(links) {
    videoElement.src = links;
    videoElement.play();
}

videoElement.addEventListener('ended', () => {
    currentVideoIndex = (currentVideoIndex + 1) % videoSources.length;
    videoElement.src = videoSources[currentVideoIndex];
    videoElement.play();
});

// Start the video playlist
videoslider(videoSources[currentVideoIndex]);

//Drag and drop the scroll videos
const ulElement = document.querySelector('.container-video ul');

let isDown = false;
let startX;
let scrollLeft;

ulElement.addEventListener('mousedown', (e) => {
    isDown = true;
    ulElement.classList.add('active');
    startX = e.pageX - ulElement.offsetLeft;
    scrollLeft = ulElement.scrollLeft;
});

ulElement.addEventListener('mouseleave', () => {
    isDown = false;
    ulElement.classList.remove('active');
});

ulElement.addEventListener('mouseup', () => {
    isDown = false;
    ulElement.classList.remove('active');
});

ulElement.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - ulElement.offsetLeft;
    const walk = (x - startX); // Ajusta la velocidad de desplazamiento si es necesario
    ulElement.scrollLeft = scrollLeft - walk;
});

// Para dispositivos móviles
ulElement.addEventListener('touchstart', (e) => {
    isDown = true;
    ulElement.classList.add('active');
    startX = e.touches[0].pageX - ulElement.offsetLeft;
    scrollLeft = ulElement.scrollLeft;
});

ulElement.addEventListener('touchend', () => {
    isDown = false;
    ulElement.classList.remove('active');
});

ulElement.addEventListener('touchmove', (e) => {
    if (!isDown) return;
    const x = e.touches[0].pageX - ulElement.offsetLeft;
    const walk = (x - startX); // Ajusta la velocidad de desplazamiento si es necesario
    ulElement.scrollLeft = scrollLeft - walk;
});