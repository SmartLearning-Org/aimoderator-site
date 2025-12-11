(function() {
  "use strict";

  // Cache DOM elements
  const body = document.body;
  const header = document.querySelector('#header');
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
  const scrollTopBtn = document.querySelector('#scroll-top');
  const navmenu = document.querySelector('#navmenu');
  const navmenulinks = document.querySelectorAll('.navmenu a');

  // Throttle function for scroll events
  function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    if (!header || (!header.classList.contains('scroll-up-sticky') && !header.classList.contains('sticky-top') && !header.classList.contains('fixed-top'))) return;
    window.scrollY > 100 ? body.classList.add('scrolled') : body.classList.remove('scrolled');
  }

  // Throttled scroll handler
  const throttledToggleScrolled = throttle(toggleScrolled, 10);

  /**
   * Mobile nav toggle
   */
  function mobileNavToggle() {
    const isActive = body.classList.toggle('mobile-nav-active');
    if (mobileNavToggleBtn) {
      mobileNavToggleBtn.classList.toggle('bi-list');
      mobileNavToggleBtn.classList.toggle('bi-x');
      mobileNavToggleBtn.setAttribute('aria-expanded', isActive);
    }
  }

  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToggle);
  }

  /**
   * Hide mobile nav on same-page/hash links using event delegation
   */
  if (navmenu) {
    navmenu.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && body.classList.contains('mobile-nav-active')) {
        mobileNavToggle();
      }
    });
  }

  /**
   * Scroll top button
   */
  function toggleScrollTop() {
    if (scrollTopBtn) {
      window.scrollY > 100 ? scrollTopBtn.classList.add('active') : scrollTopBtn.classList.remove('active');
    }
  }

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }
  }

  /**
   * Navmenu Scrollspy - optimized
   */
  let activeLink = null;
  function navmenuScrollspy() {
    if (!navmenulinks.length) return;
    
    const scrollY = window.scrollY + 200;
    
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      const section = document.querySelector(navmenulink.hash);
      if (!section) return;
      
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      
      if (scrollY >= sectionTop && scrollY <= sectionBottom) {
        if (activeLink !== navmenulink) {
          // Remove active from all links
          navmenulinks.forEach(link => link.classList.remove('active'));
          // Add active to current link
          navmenulink.classList.add('active');
          activeLink = navmenulink;
        }
      } else if (activeLink === navmenulink) {
        navmenulink.classList.remove('active');
        activeLink = null;
      }
    });
  }

  // Throttled scroll handler for scrollspy
  const throttledNavmenuScrollspy = throttle(navmenuScrollspy, 100);

  /**
   * Combined load event handler
   */
  window.addEventListener('load', function() {
    toggleScrolled();
    if (scrollTopBtn) toggleScrollTop();
    aosInit();
    navmenuScrollspy();

    // Correct scrolling position upon page load for URLs containing hash links
    if (window.location.hash) {
      const section = document.querySelector(window.location.hash);
      if (section) {
        setTimeout(() => {
          const scrollMarginTop = parseInt(getComputedStyle(section).scrollMarginTop) || 0;
          window.scrollTo({
            top: section.offsetTop - scrollMarginTop,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  // Add scroll event listeners with throttling
  document.addEventListener('scroll', throttledToggleScrolled);
  document.addEventListener('scroll', throttledNavmenuScrollspy);
  if (scrollTopBtn) {
    document.addEventListener('scroll', throttle(toggleScrollTop, 10));
  }

})();
