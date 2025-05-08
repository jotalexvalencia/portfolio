// d:\02-tic\mi-portfolio\src\js\main.js

document.addEventListener('DOMContentLoaded', () => {
  const mainNav = document.getElementById('main-nav');
  const mainElement = document.querySelector('main');
  const toggleThemeButton = document.getElementById('toggle-theme');
  const toggleLanguageButton = document.getElementById('toggle-language');
  let currentTheme = localStorage.getItem('theme') || 'light';
  let currentLanguage = localStorage.getItem('language') || 'es';

  // --- ICONOS ---
  const sunIcon = '☀️'; // Icono para tema claro
  const moonIcon = '🌙'; // Icono para tema oscuro
  // --- CLASES CSS FRECUENTES ---
  const ES_CLASS = 'es';
  const EN_CLASS = 'en';
  const HIDDEN_CLASS = 'hidden';
  // const FORM_MESSAGE_CLASS = 'form-message'; // Ya no se necesita

  function applyTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    if (toggleThemeButton) {
      toggleThemeButton.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
    }
    localStorage.setItem('theme', theme);
    adjustMainContentPadding();
  }

  function adjustMainContentPadding() {
    if (mainNav && mainElement) {
      const navHeight = mainNav.offsetHeight;
      mainElement.style.paddingTop = `${navHeight}px`;
      document.documentElement.style.setProperty('--scroll-padding', `${navHeight}px`);
    }
  }

  function applyLanguage(lang) {
    document.querySelectorAll(`.${ES_CLASS}, .${EN_CLASS}`).forEach(el => {
      el.classList.add(HIDDEN_CLASS);
    });
    document.querySelectorAll(`.${lang}`).forEach(el => {
      // Ya no necesitamos la condición de form-message
      el.classList.remove(HIDDEN_CLASS);
    });
    if (toggleLanguageButton) {
      toggleLanguageButton.textContent = lang === ES_CLASS ? 'EN' : 'ES';
    }
    document.documentElement.lang = lang;
    localStorage.setItem('language', lang);
    adjustMainContentPadding();
  }

  if (toggleThemeButton) {
    toggleThemeButton.addEventListener('click', () => {
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }

  if (toggleLanguageButton) {
    toggleLanguageButton.addEventListener('click', () => {
      const newLanguage = currentLanguage === ES_CLASS ? EN_CLASS : ES_CLASS;
      applyLanguage(newLanguage);
      currentLanguage = newLanguage;
    });
  }

  adjustMainContentPadding();
  window.addEventListener('resize', adjustMainContentPadding);

  applyTheme(currentTheme);
  applyLanguage(currentLanguage);

  const navList = document.querySelector('#main-nav ul');
  const navLinks = document.querySelectorAll('#main-nav a.nav-link');

  navLinks.forEach(link => {
    link.addEventListener('click', function (event) {
      if (navList && navList.scrollWidth > navList.clientWidth) {
        this.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });
  });

  if (typeof Swiper !== 'undefined') {
    const swiper = new Swiper(".mySwiper", {
      effect: "coverflow",
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: "auto",
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
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
    });
  } else {
    console.warn('Swiper library not loaded.');
  }

  // La lógica del formulario de contacto ha sido eliminada.

});
