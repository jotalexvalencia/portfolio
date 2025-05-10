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

  function adjustMainContentPadding() {
    if (mainNav && mainElement) {
      const navHeight = mainNav.offsetHeight;
      mainElement.style.paddingTop = `${navHeight}px`;
      // Añadimos un offset de 20px para que los títulos de sección queden un poco más arriba al navegar
      // Este valor es usado por scroll-margin-top en el CSS
      document.documentElement.style.setProperty('--scroll-padding', `${navHeight + 20}px`);
    }
  }

  // Llamada inicial MUY TEMPRANA para ajustar el padding antes de que todo cargue y evitar saltos.
  // Esto es crucial porque la barra de navegación es 'fixed'.
  adjustMainContentPadding();

  function applyTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    if (toggleThemeButton) {
      toggleThemeButton.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
    }
    localStorage.setItem('theme', theme);
    // No es necesario llamar a adjustMainContentPadding aquí si la altura de la nav no cambia con el tema
  }


  function applyLanguage(lang) {
    document.querySelectorAll(`.${ES_CLASS}, .${EN_CLASS}`).forEach(el => {
      el.classList.add(HIDDEN_CLASS);
    });
    document.querySelectorAll(`.${lang}`).forEach(el => {
      el.classList.remove(HIDDEN_CLASS);
    });
    if (toggleLanguageButton) {
      toggleLanguageButton.textContent = lang === ES_CLASS ? 'EN' : 'ES';
    }
    document.documentElement.lang = lang;
    localStorage.setItem('language', lang);
    // No es necesario llamar a adjustMainContentPadding aquí si la altura de la nav no cambia con el idioma
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
      currentLanguage = newLanguage; // Actualizar currentLanguage después de aplicar
    });
  }

  // Ajustar el padding en cada redimensionamiento de la ventana
  window.addEventListener('resize', adjustMainContentPadding);

  // Aplicar tema e idioma guardados al cargar la página
  applyTheme(currentTheme);
  applyLanguage(currentLanguage);

  // Scroll inicial a #perfil si no hay hash en la URL, después de un breve delay para asegurar que todo esté renderizado
  // y el padding de la barra de navegación se haya aplicado.
  if (!window.location.hash) {
    setTimeout(() => {
      const perfilSection = document.getElementById('perfil');
      if (perfilSection) {
        // Usamos scrollIntoView con el offset ya manejado por scroll-margin-top
        perfilSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100); // Un pequeño delay puede ayudar
  }


  // Lógica para scroll suave de la barra de navegación en móviles
  const navList = document.querySelector('#main-nav ul');
  const navLinks = document.querySelectorAll('#main-nav a.nav-link');

  navLinks.forEach(link => {
    link.addEventListener('click', function (event) {
      // Comprueba si la lista de navegación es más ancha que su contenedor (indica scroll)
      if (navList && navList.scrollWidth > navList.clientWidth) {
        // Desplaza el elemento clickeado a la vista
        // 'nearest' asegura que si el elemento ya es visible, no scrollea innecesariamente.
        // 'center' intenta centrar el elemento horizontalmente.
        this.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
      // La navegación a la sección se maneja por el href y el scroll-margin-top del CSS
      // No es necesario event.preventDefault() si los href son correctos (#id-seccion)
    });
  });

  // Inicialización de SwiperJS
  if (typeof Swiper !== 'undefined') {
    const swiper = new Swiper(".mySwiper", {
      effect: "coverflow",
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: "auto", // Permite que Swiper determine cuántos slides mostrar
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

});
