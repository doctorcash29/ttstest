// Función para dividir texto en spans (se usa para otras animaciones)
function splitText(selector) {
  const element = document.querySelector(selector);
  const text = element.textContent.trim();
  const letters = text.split('');
  element.innerHTML = letters.map(letter => `<span>${letter}</span>`).join('');
}

// Función para animar letras con Anime.js (para títulos, etc.)
function animateLetters(selector) {
  if (!document.querySelector(selector + " span")) {
    splitText(selector);
  }
  anime.timeline({
    loop: false,
    duration: 3000,
    easing: 'easeOutElastic(1, .8)',
  })
  .add({
    targets: selector + " span",
    opacity: [0, 1],
    translateY: [50, 0],
    delay: anime.stagger(100),
  })
  .add({
    targets: selector + " span",
    rotate: [0, 5, -5, 0],
    scale: [1, 1.1, 0.95, 1],
    easing: 'easeInOutSine',
    duration: 800,
    delay: anime.stagger(50, { start: 500 }),
  });
}

// Función para reproducir el sonido (sound1.mp3)
function playSound() {
  const sound = document.getElementById("sound1");
  sound.play();
}

// Observadores para animar títulos y secciones al hacer scroll
document.addEventListener('DOMContentLoaded', () => {
  const animateElements = document.querySelectorAll('.animate-title');
  const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateLetters('#' + entry.target.id);
        titleObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  animateElements.forEach(el => {
    if (!el.id) {
      el.id = 'animate-' + Math.random().toString(36).substr(2, 9);
    }
    titleObserver.observe(el);
  });

  const animateSections = document.querySelectorAll('.animate-section');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        sectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  
  animateSections.forEach(section => {
    sectionObserver.observe(section);
  });

  // Lógica para el botón "Play Music"
  const playMusicBtn = document.getElementById('play-music-btn');
  if (playMusicBtn) {
    playMusicBtn.addEventListener('click', () => {
      const audio = document.getElementById('background-music');
      if (audio.paused) {
        audio.play().catch(err => {
          console.error("No se pudo reproducir la música:", err);
        });
      }
      
      playMusicBtn.classList.add('click-anim');
      setTimeout(() => {
        playMusicBtn.classList.remove('click-anim');
      }, 300);
    });
  }
});

// NUEVA FUNCIÓN: Efecto scramble para simular el escaneo
function scrambleText(finalText, element, interval, callback) {
  const totalIterations = 15; // Número de cambios antes de fijar la letra
  let iteration = 0;
  const textLength = finalText.length;
  const scrambleInterval = setInterval(() => {
    let displayText = "";
    for (let i = 0; i < textLength; i++) {
      if (i < (iteration / totalIterations) * textLength) {
        displayText += finalText[i];
      } else {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
        displayText += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    element.textContent = displayText;
    iteration++;
    if (iteration > totalIterations) {
      clearInterval(scrambleInterval);
      element.textContent = finalText;
      if (callback) callback();
    }
  }, interval);
}

// Lógica del formulario de perfil y consola
const form = document.getElementById('profile-form');
const codeConsole = document.getElementById('code-console');
const accessBtn = document.querySelector('.access-btn');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nickname = document.getElementById('nickname').value;
    document.querySelector('.create-profile h3').textContent = 'Welcome!';
    
    // Aplica animación de "TV apagado" al botón
    accessBtn.classList.add('tv-off');
    
    // Se espera la duración de la animación (0.8s definida en CSS)
    setTimeout(() => {
      form.style.display = 'none';
      codeConsole.style.display = 'block';
      codeConsole.textContent = '';
      
      // Inicio de la cadena de animaciones:
      // El primer audio se reproduce al inicio (correcto)
      playSound();
      scrambleText("Analyzing existing users", codeConsole, 50, () => {
        // Para el segundo sonido: se espera 2 segundos antes de reproducirlo
        setTimeout(() => {
          playSound();
          scrambleText("Adding to the database", codeConsole, 50, () => {
            // Para el tercer sonido: se espera 2 segundos antes de reproducirlo
            setTimeout(() => {
              playSound();
              scrambleText(`Welcome, ${nickname}!`, codeConsole, 50, null);
            }, 2000);
          });
        }, 2000);
      });
    }, 800);
  });
}

// Lógica de la barra de desplazamiento personalizada
const scrollbar = document.querySelector('.scrollbar');
const scrollbarContainer = document.querySelector('.scrollbar-container');
let isDragging = false;

scrollbar.addEventListener('mousedown', () => {
  isDragging = true;
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});

function onMouseMove(e) {
  if (!isDragging) return;
  const containerRect = scrollbarContainer.getBoundingClientRect();
  const currentHeight = scrollbar.offsetHeight;
  let newTop = e.clientY - containerRect.top - currentHeight / 2;
  newTop = Math.max(0, Math.min(newTop, containerRect.height - currentHeight));
  scrollbar.style.top = `${newTop}px`;
  
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercentage = newTop / (containerRect.height - currentHeight);
  window.scrollTo(0, scrollHeight * scrollPercentage);
}

function onMouseUp() {
  isDragging = false;
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
}

// Actualiza la posición de la barra de progreso según scroll
window.addEventListener('scroll', () => {
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPosition = window.scrollY;
  const scrollPercentage = scrollPosition / scrollHeight;
  
  const threshold = 50;
  if (scrollPosition < threshold || scrollPosition > (scrollHeight - threshold)) {
    scrollbar.classList.add('short');
  } else {
    scrollbar.classList.remove('short');
  }
  
  const containerRect = scrollbarContainer.getBoundingClientRect();
  const currentHeight = scrollbar.offsetHeight;
  const newTop = scrollPercentage * (containerRect.height - currentHeight);
  scrollbar.style.top = `${newTop}px`;
});

// Efecto Matrix en el canvas
const canvasMatrix = document.getElementById("matrix");
const ctxMatrix = canvasMatrix.getContext("2d");
function resizeCanvas() {
  canvasMatrix.height = window.innerHeight;
  canvasMatrix.width = window.innerWidth;
}
resizeCanvas();

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const letterArr = letters.split("");
const fontSize = 14;
const columns = canvasMatrix.width / fontSize;
const drops = [];
for (let x = 0; x < columns; x++) {
  drops[x] = 1;
}

function drawMatrix() {
  ctxMatrix.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctxMatrix.fillRect(0, 0, canvasMatrix.width, canvasMatrix.height);
  ctxMatrix.fillStyle = "#0FFF95";
  ctxMatrix.font = fontSize + "px monospace";
  
  for (let i = 0; i < drops.length; i++) {
    const text = letterArr[Math.floor(Math.random() * letterArr.length)];
    ctxMatrix.fillText(text, i * fontSize, drops[i] * fontSize);
    
    if (drops[i] * fontSize > canvasMatrix.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}
setInterval(drawMatrix, 33);
window.addEventListener("resize", resizeCanvas);
