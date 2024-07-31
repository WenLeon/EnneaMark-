// Referencias a los elementos
const caraInput = document.getElementById('caraInput');
const extraImageCheckbox = document.getElementById('extraImageCheckbox');
const selloSelect1 = document.getElementById('selloSelect1');
const selloSelect2 = document.getElementById('selloSelect2');
const selloSelect3 = document.getElementById('selloSelect3');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const downloadButton = document.getElementById('downloadButton');

const extraImageURL = 'Images/logo.png';

let caraImage = null;
let extraImage = new Image();
let selloImage1 = null;
let selloImage2 = null;
let selloImage3 = null;

// Cargar la imagen adicional
extraImage.onload = function() {
    if (extraImageCheckbox.checked) {
        drawImages();
    }
};
extraImage.src = extraImageURL;

// Cargar la imagen principal (cara)
caraInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            caraImage = new Image();
            caraImage.onload = function() {
                drawImages();
            };
            caraImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Manejar el cambio en el checkbox de la imagen adicional
extraImageCheckbox.addEventListener('change', function() {
    drawImages();
});

// Actualizar las opciones del dropdown
function updateSelloSelects() {
    const selectedGroup1 = selloSelect1.value;
    const selectedGroup2 = selloSelect2.value;
    const selectedGroup3 = selloSelect3.value;

    // Actualizar opciones del primer select
    Array.from(selloSelect1.options).forEach(option => {
        option.disabled = option.value !== "" && (option.value === selectedGroup2 || option.value === selectedGroup3);
    });

    // Actualizar opciones del segundo select
    Array.from(selloSelect2.options).forEach(option => {
        option.disabled = option.value !== "" && (option.value === selectedGroup1 || option.value === selectedGroup3);
    });

    // Actualizar opciones del tercer select
    Array.from(selloSelect3.options).forEach(option => {
        option.disabled = option.value !== "" && (option.value === selectedGroup1 || option.value === selectedGroup2);
    });

    // Habilitar o deshabilitar el tercer select
    selloSelect3.disabled = !selloSelect2.value;
}


// Manejar el cambio en el primer select
function handleSelect1Change() {
    const selloSrc = selloSelect1.value;
    if (selloSrc) {
        selloImage1 = new Image();
        selloImage1.onload = function() {
            drawImages();
        };
        selloImage1.src = selloSrc;
        selloSelect2.disabled = false;
        updateSelloSelects();
    } else {
        selloImage1 = null;
        selloSelect2.disabled = true;
        selloSelect2.value = '';
        selloSelect3.value = '';
        selloImage2 = null;
        selloImage3 = null;
        updateSelloSelects();
        drawImages();
    }
}

// Manejar el cambio en el segundo select
function handleSelect2Change() {
    const selloSrc = selloSelect2.value;
    if (selloSrc) {
        selloImage2 = new Image();
        selloImage2.onload = function() {
            drawImages();
        };
        selloImage2.src = selloSrc;
        updateSelloSelects();
    } else {
        selloImage2 = null;
        selloImage3 = null;
        updateSelloSelects();
        drawImages();
    }
}

// Manejar el cambio en el tercer select
function handleSelect3Change() {
    const selloSrc = selloSelect3.value;
    if (selloSrc) {
        selloImage3 = new Image();
        selloImage3.onload = function() {
            drawImages();
        };
        selloImage3.src = selloSrc;
        updateSelloSelects();
    } else {
        selloImage3 = null;
        updateSelloSelects();
        drawImages();
    }
}

selloSelect1.addEventListener('change', handleSelect1Change);
selloSelect2.addEventListener('change', handleSelect2Change);
selloSelect3.addEventListener('change', handleSelect3Change);

// Dibujar imágenes en el canvas
// Definir un tamaño fijo para el canvas
const canvasWidth = 512; // Tamaño fijo para el canvas
const canvasHeight = 512; // Tamaño fijo para el canvas

// Dibujar imágenes en el canvas
function drawImages() {
    if (!caraImage) return;

    // Establecer el tamaño del canvas
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calcular la escala para ajustar la imagen principal al tamaño del canvas
    const scale = Math.min(canvasWidth / caraImage.width, canvasHeight / caraImage.height);
    const newWidth = caraImage.width * scale;
    const newHeight = caraImage.height * scale;
    const xOffset = (canvasWidth - newWidth) / 2;
    const yOffset = (canvasHeight - newHeight) / 2;

    // Dibujar la imagen principal redimensionada
    ctx.drawImage(caraImage, xOffset, yOffset, newWidth, newHeight);

    // Dimensiones específicas para el logo y los sellos
    const logoWidth = 190; // Ancho del logo
    const logoHeight = 75; // Alto del logo
    const selloWidth = 75; // Ancho del sello
    const selloHeight = 75; // Alto del sello

    let xPos = 10;

    // Dibujar la imagen adicional (logo) si está seleccionada
    if (extraImageCheckbox.checked) {
        ctx.drawImage(extraImage, xPos, canvasHeight - logoHeight - 20, logoWidth, logoHeight);
        xPos += logoWidth + 10;
    }

    // Dibujar la primera imagen de sello
    if (selloImage1) {
        ctx.drawImage(selloImage1, xPos, canvasHeight - selloHeight - 20, selloWidth, selloHeight);
        xPos += selloWidth + 10;
    }

    // Dibujar la segunda imagen de sello
    if (selloImage2) {
        ctx.drawImage(selloImage2, xPos, canvasHeight - selloHeight - 20, selloWidth, selloHeight);
        xPos += selloWidth + 10;
    }

    // Dibujar la tercera imagen de sello
    if (selloImage3) {
        ctx.drawImage(selloImage3, xPos, canvasHeight - selloHeight - 20, selloWidth, selloHeight);
    }
}



// Descargar la imagen
downloadButton.addEventListener('click', function() {
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'profile_image.png';
    link.click();
});
