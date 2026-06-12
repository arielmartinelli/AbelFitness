document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Mobile Menu Toggler ---
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu-links a');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
      });
    });
  }

  // --- 2. Header Scrolled Class ---
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- 3. Scroll Entrance Animations (Intersection Observer) ---
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Stop observing once animated
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- 4. Active Navigation Links on Scroll ---
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  });

  // --- 5. Pricing Plan Switcher & Pre-filled WhatsApp Links ---
  const billingMonthly = document.getElementById('billing-monthly');
  const billingQuarterly = document.getElementById('billing-quarterly');
  
  const priceDigital = document.getElementById('price-digital');
  const priceCoaching = document.getElementById('price-coaching');
  const priceElite = document.getElementById('price-elite');

  const btnPlanDigital = document.getElementById('btn-plan-digital');
  const btnPlanCoaching = document.getElementById('btn-plan-coaching');
  const btnPlanElite = document.getElementById('btn-plan-elite');

  const waPhone = '34600000000'; // Target WhatsApp number

  // Price definitions
  const prices = {
    monthly: { digital: '25.000', coaching: '49.000', elite: '89.000' },
    quarterly: { digital: '21.250', coaching: '41.650', elite: '75.650' } // Approx 15% discount
  };

  function updatePricing(billingMode) {
    // UI Classes
    if (billingMode === 'monthly') {
      billingMonthly.classList.add('active');
      billingQuarterly.classList.remove('active');
    } else {
      billingQuarterly.classList.add('active');
      billingMonthly.classList.remove('active');
    }

    // Animate and set prices
    const updateVal = (el, val) => {
      el.style.transform = 'scale(0.85)';
      el.style.opacity = '0.3';
      setTimeout(() => {
        el.textContent = val;
        el.style.transform = 'scale(1)';
        el.style.opacity = '1';
      }, 150);
    };

    updateVal(priceDigital, prices[billingMode].digital);
    updateVal(priceCoaching, prices[billingMode].coaching);
    updateVal(priceElite, prices[billingMode].elite);

    // Update WhatsApp links
    const billingLabel = billingMode === 'monthly' ? 'Mensual' : 'Trimestral';
    
    const msgDigital = `Hola Abel, me interesa el plan de Rutina Digital (${billingLabel} - $${prices[billingMode].digital}/mes). ¿Cuáles son los pasos a seguir?`;
    const msgCoaching = `Hola Abel, me interesa el plan de Asesoramiento 1-a-1 (${billingLabel} - $${prices[billingMode].coaching}/mes). ¿Cómo empezamos a entrenar?`;
    const msgElite = `Hola Abel, me interesa el plan Elite Transformation (${billingLabel} - $${prices[billingMode].elite}/mes). Me gustaría recibir más información.`;

    btnPlanDigital.href = `https://wa.me/${waPhone}?text=${encodeURIComponent(msgDigital)}`;
    btnPlanCoaching.href = `https://wa.me/${waPhone}?text=${encodeURIComponent(msgCoaching)}`;
    btnPlanElite.href = `https://wa.me/${waPhone}?text=${encodeURIComponent(msgElite)}`;
  }

  // Bind Switch Event Listeners
  if (billingMonthly && billingQuarterly) {
    billingMonthly.addEventListener('click', () => updatePricing('monthly'));
    billingQuarterly.addEventListener('click', () => updatePricing('quarterly'));
  }

  // Initialize links on load
  updatePricing('monthly');


  // --- 6. WhatsApp Reviews Carousel ---
  const carouselViewport = document.getElementById('carousel-viewport');
  const carouselTrack = document.getElementById('carousel-track');
  const carouselPrevBtn = document.getElementById('carousel-prev');
  const carouselNextBtn = document.getElementById('carousel-next');
  const carouselDotsContainer = document.getElementById('carousel-dots');
  const chatCards = document.querySelectorAll('.chat-card');

  if (carouselTrack && chatCards.length > 0) {
    let currentIndex = 0;
    let cardsVisible = 1;
    let totalCards = chatCards.length;

    // Detect how many cards are visible in viewport
    function checkCardsVisible() {
      if (window.innerWidth >= 768) {
        cardsVisible = 2;
      } else {
        cardsVisible = 1;
      }
    }

    // Build Dots
    function buildDots() {
      carouselDotsContainer.innerHTML = '';
      const totalDots = Math.max(1, totalCards - cardsVisible + 1);
      for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (i === currentIndex) dot.classList.add('active');
        dot.addEventListener('click', () => {
          currentIndex = i;
          slideToIndex();
        });
        carouselDotsContainer.appendChild(dot);
      }
    }

    // Update dots active status
    function updateDots() {
      const dots = document.querySelectorAll('.carousel-dot');
      dots.forEach((dot, index) => {
        if (index === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    // Main slide action
    function slideToIndex() {
      // Get track dimensions
      const gap = 24; // Gap defined in CSS
      const cardWidth = chatCards[0].offsetWidth;
      const offset = currentIndex * (cardWidth + gap);
      
      carouselTrack.style.transform = `translateX(-${offset}px)`;
      
      // Update button states
      carouselPrevBtn.disabled = currentIndex === 0;
      carouselNextBtn.disabled = currentIndex >= (totalCards - cardsVisible);
      
      updateDots();
    }

    // Button controls
    carouselPrevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        slideToIndex();
      }
    });

    carouselNextBtn.addEventListener('click', () => {
      if (currentIndex < (totalCards - cardsVisible)) {
        currentIndex++;
        slideToIndex();
      }
    });

    // Touch & Mouse Drag Interactivity
    let startX = 0;
    let isDragging = false;
    let startTranslate = 0;
    let currentTranslate = 0;
    let animationID = 0;

    // Helper functions for drag position
    function getPositionX(event) {
      return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function touchStart(index) {
      return function (event) {
        isDragging = true;
        startX = getPositionX(event);
        carouselTrack.style.transition = 'none'; // Pause animation for fluid drag
        
        // Calculate current translation
        const gap = 24;
        const cardWidth = chatCards[0].offsetWidth;
        startTranslate = -currentIndex * (cardWidth + gap);
        currentTranslate = startTranslate;
        
        // Cancel animation frame if any
        cancelAnimationFrame(animationID);
      };
    }

    function touchMove(event) {
      if (!isDragging) return;
      
      const currentX = getPositionX(event);
      const diffX = currentX - startX;
      currentTranslate = startTranslate + diffX;
      
      carouselTrack.style.transform = `translateX(${currentTranslate}px)`;
    }

    function touchEnd() {
      if (!isDragging) return;
      isDragging = false;
      
      carouselTrack.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      
      const gap = 24;
      const cardWidth = chatCards[0].offsetWidth;
      const movedBy = currentTranslate - startTranslate;
      
      // Threshold for swipe trigger
      const threshold = 80;
      
      if (movedBy < -threshold && currentIndex < (totalCards - cardsVisible)) {
        currentIndex++;
      } else if (movedBy > threshold && currentIndex > 0) {
        currentIndex--;
      }
      
      slideToIndex();
    }

    // Bind Drag/Touch Events
    carouselViewport.addEventListener('touchstart', touchStart(currentIndex), { passive: true });
    carouselViewport.addEventListener('touchmove', touchMove, { passive: true });
    carouselViewport.addEventListener('touchend', touchEnd);

    carouselViewport.addEventListener('mousedown', touchStart(currentIndex));
    carouselViewport.addEventListener('mousemove', touchMove);
    carouselViewport.addEventListener('mouseup', touchEnd);
    carouselViewport.addEventListener('mouseleave', touchEnd);

    // Initial setup & resize handling
    checkCardsVisible();
    buildDots();
    slideToIndex();

    window.addEventListener('resize', () => {
      const oldVisible = cardsVisible;
      checkCardsVisible();
      if (oldVisible !== cardsVisible) {
        // Recalculate index if bounds changed
        if (currentIndex > (totalCards - cardsVisible)) {
          currentIndex = Math.max(0, totalCards - cardsVisible);
        }
        buildDots();
      }
      // Re-slide to snap cards properly
      slideToIndex();
    });
  }
});
