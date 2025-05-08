// d:\02-tic\mi-portfolio\src\js\main.js

document.addEventListener('DOMContentLoaded', () => {
  const mainNav = document.getElementById('main-nav');
  const mainElement = document.querySelector('main');
  const toggleThemeButton = document.getElementById('toggle-theme');
  const toggleLanguageButton = document.getElementById('toggle-language');
  let currentTheme = localStorage.getItem('theme') || 'light'; // Made let for potential modification by other scripts if any
  let currentLanguage = localStorage.getItem('language') || 'es';

  // --- ICONOS ---
  const sunIcon = '☀️'; // Icono para tema claro
  const moonIcon = '🌙'; // Icono para tema oscuro

  function applyTheme(theme) {
    currentTheme = theme; // Update global currentTheme
    document.documentElement.setAttribute('data-theme', theme);
    if (toggleThemeButton) {
      toggleThemeButton.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
    }
    localStorage.setItem('theme', theme);
    adjustMainContentPadding(); // Ajustar padding por si el tema cambia la altura de la nav
  }

  function adjustMainContentPadding() {
    if (mainNav && mainElement) {
      const navHeight = mainNav.offsetHeight;
      mainElement.style.paddingTop = `${navHeight}px`;
      // Establecer la variable CSS para el scroll-margin-top de las secciones
      document.documentElement.style.setProperty('--scroll-padding', `${navHeight}px`);
    }
  }

  function applyLanguage(lang) {
    document.querySelectorAll('.es, .en').forEach(el => {
      el.classList.add('hidden');
    });
    document.querySelectorAll(`.${lang}`).forEach(el => {
      // Solo quitar 'hidden' si NO es un mensaje de estado del formulario
      if (!el.classList.contains('form-message')) {
        el.classList.remove('hidden');
      }
    });
    if (toggleLanguageButton) {
      toggleLanguageButton.textContent = lang === 'es' ? 'EN' : 'ES';
    }
    document.documentElement.lang = lang;
    localStorage.setItem('language', lang);
    adjustMainContentPadding(); // Ajustar padding por si el idioma cambia la altura de la nav
  }

  if (toggleThemeButton) {
    toggleThemeButton.addEventListener('click', () => {
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }

  if (toggleLanguageButton) {
    toggleLanguageButton.addEventListener('click', () => {
      const newLanguage = currentLanguage === 'es' ? 'en' : 'es';
      applyLanguage(newLanguage);
      currentLanguage = newLanguage; // Actualizar la variable global después de aplicar
    });
  }

  // Ajuste inicial del padding y en redimensionamiento
  adjustMainContentPadding();
  window.addEventListener('resize', adjustMainContentPadding);

  // Inicialización
  applyTheme(currentTheme);
  applyLanguage(currentLanguage);

  // --- Manejo de clics en enlaces de navegación ---
  const navList = document.querySelector('#main-nav ul');
  const navLinks = document.querySelectorAll('#main-nav a.nav-link');

  navLinks.forEach(link => {
    link.addEventListener('click', function (event) {
      // El desplazamiento suave a la sección es manejado por CSS (scroll-behavior: smooth)
      // y el comportamiento por defecto del navegador para href="#..."

      // Para la barra de navegación horizontalmente desplazable (móvil):
      // Desplaza el elemento clickeado al centro de la barra de navegación.
      if (navList && navList.scrollWidth > navList.clientWidth) {
        // 'this' se refiere al elemento 'a' clickeado
        this.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });
  });

  // Inicialización de Swiper
  if (typeof Swiper !== 'undefined') {
    const swiper = new Swiper(".mySwiper", {
      effect: "coverflow",
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: "auto", // Importante para que el tamaño de los slides se ajuste
      coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      loop: true, // Para que el carrusel sea infinito
      autoplay: {
        delay: 3000, // Tiempo en milisegundos (3 segundos)
        disableOnInteraction: false, // Continuar autoplay después de interacción manual
        pauseOnMouseEnter: true, // Pausar autoplay cuando el mouse está sobre el carrusel
      },
    });
  } else {
    console.warn('Swiper library not loaded.');
  }

  // Manejo del formulario de contacto (si existe)
  const contactForm = document.getElementById('contact-form');
  const formStatusMessages = document.getElementById('form-status-messages');

  function showFormMessage(type, lang) {
    if (!formStatusMessages) return;
    formStatusMessages.querySelectorAll('.form-message').forEach(msg => msg.classList.add('hidden'));
    const messageElement = formStatusMessages.querySelector(`.form-message.${lang}[data-status="${type}"]`);
    if (messageElement) {
      messageElement.classList.remove('hidden');
    }
  }

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const currentLang = document.documentElement.lang || 'es';
      const submitButton = contactForm.querySelector(`button[type="submit"].${currentLang}`) || contactForm.querySelector('button[type="submit"]');


      showFormMessage('sending', currentLang);
      if (submitButton) submitButton.disabled = true;


      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
      })
        .then(response => {
          if (response.ok) {
            showFormMessage('success', currentLang);
            contactForm.reset();
          } else {
            response.json().then(data => {
              if (data.error) {
                console.error("Error from Netlify:", data.error);
                showFormMessage('error', currentLang);
              } else {
                showFormMessage('error', currentLang);
              }
            }).catch(() => {
              showFormMessage('error', currentLang);
            });
          }
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
          showFormMessage('network-error', currentLang);
        })
        .finally(() => {
          if (submitButton) submitButton.disabled = false;
        });
    });
  }
});
