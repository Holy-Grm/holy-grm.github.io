document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Header Scroll Effect ---
  const header = document.querySelector("header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // --- 2. Mobile Menu Toggle ---
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navLinks = document.querySelector(".nav-links");
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  // --- 3. Smooth Scrolling ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetElement = document.querySelector(this.getAttribute("href"));
      if (targetElement) {
        // Close mobile menu if open
        navLinks.classList.remove("active");
        
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    });
  });

  // --- 4. Intersection Observer for Fade Animations ---
  const fadeElements = document.querySelectorAll(".fade-up");
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => fadeObserver.observe(el));

  // --- 5. Carousel Logic ---
  const track = document.querySelector('.carousel-track');
  const slides = Array.from(document.querySelectorAll('.carousel-slide'));
  if (track && slides.length > 0) {
    const nextButton = document.querySelector('.carousel-next');
    const prevButton = document.querySelector('.carousel-prev');
    const dotsNav = document.querySelector('.carousel-dots');
    
    let itemsPerView = window.innerWidth >= 1024 ? 3 : (window.innerWidth >= 768 ? 2 : 1);
    let currentIndex = 0;

    const renderDots = () => {
      dotsNav.innerHTML = '';
      const dotCount = Math.max(1, slides.length - itemsPerView + 1);
      for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (i === currentIndex) dot.classList.add('active');
        dot.setAttribute('data-index', i);
        dotsNav.appendChild(dot);
      }
    };
    
    renderDots();

    const updateCarousel = (index) => {
      // Ensure index is within bounds
      const maxIndex = Math.max(0, slides.length - itemsPerView);
      currentIndex = Math.min(Math.max(index, 0), maxIndex);
      
      const slideWidth = slides[0].getBoundingClientRect().width;
      track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

      // Update dots
      const dots = Array.from(dotsNav.children);
      dots.forEach(dot => dot.classList.remove('active'));
      const activeDotIndex = Math.min(currentIndex, Math.max(0, dots.length - 1));
      if(dots[activeDotIndex]) {
        dots[activeDotIndex].classList.add('active');
      }
    };

    window.addEventListener('resize', () => {
      itemsPerView = window.innerWidth >= 1024 ? 3 : (window.innerWidth >= 768 ? 2 : 1);
      const maxIndex = Math.max(0, slides.length - itemsPerView);
      if (currentIndex > maxIndex) {
         currentIndex = maxIndex;
      }
      renderDots();
      updateCarousel(currentIndex);
    });

    nextButton.addEventListener('click', () => {
      updateCarousel(currentIndex + 1);
      resetAutoScroll();
    });

    prevButton.addEventListener('click', () => {
      updateCarousel(currentIndex - 1);
      resetAutoScroll();
    });

    dotsNav.addEventListener('click', e => {
      const targetDot = e.target.closest('.carousel-dot');
      if (!targetDot) return;
      
      const targetIndex = parseInt(targetDot.getAttribute('data-index'));
      updateCarousel(targetIndex);
      resetAutoScroll();
    });

    // Auto scroll
    let autoScrollInterval;
    const startAutoScroll = () => {
      autoScrollInterval = setInterval(() => {
        const maxIndex = Math.max(0, slides.length - itemsPerView);
        if (currentIndex >= maxIndex) {
          updateCarousel(0); // loop back
        } else {
          updateCarousel(currentIndex + 1);
        }
      }, 5000);
    };

    const resetAutoScroll = () => {
      clearInterval(autoScrollInterval);
      startAutoScroll();
    };

    startAutoScroll();
  }

  // --- 6. Modal Logic ---
  const modalOverlay = document.querySelector('.modal-overlay');
  const modalClose = document.querySelector('.modal-close');
  const projectCards = document.querySelectorAll('.project-card.clickable');
  
  // Elements inside modal
  const mTitle = document.getElementById('modal-title');
  const mImg = document.getElementById('modal-img');
  const mDesc = document.getElementById('modal-desc');
  const mTech = document.getElementById('modal-tech');
  
  if (modalOverlay) {
    projectCards.forEach(card => {
      card.addEventListener('click', () => {
        // Populate data
        mTitle.textContent = card.dataset.title;
        mImg.src = card.dataset.img;
        mImg.alt = card.dataset.title;
        mDesc.textContent = card.dataset.desc;
        
        // Render tech badges
        const tags = card.dataset.tech.split(',');
        mTech.innerHTML = '';
        tags.forEach(tag => {
          if (tag.trim()) {
            const span = document.createElement('span');
            span.classList.add('tech-badge');
            span.textContent = tag.trim();
            mTech.appendChild(span);
          }
        });
        
        // Show modal
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });
    
    const closeModal = () => {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if(e.target === modalOverlay) closeModal();
    });
  }

});
