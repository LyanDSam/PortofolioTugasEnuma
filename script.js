/**
 * Samuel Lyandro Saputra — Portfolio Core JavaScript (2026)
 * Built with vanilla ES6 and optimized for high-performance visual effects.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all core systems
  const app = new PortfolioApp();
  app.init();
});

class PortfolioApp {
  constructor() {
    this.loaderPercent = 0;
    this.cursor = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  init() {
    this.initLoader();
    this.initCustomCursor();
    this.initSpotlightGrid();
    this.initScrollEffects();
    this.initMagneticButtons();
    this.initTiltCards();
    this.initScrambleHeadline();
    this.initEmailCopy();
    this.initContactForm();
    this.initMobileMenu();
  }

  /* ==========================================================================
     1. PAGE LOADER
     ========================================================================== */
  initLoader() {
    const loader = document.getElementById('page-loader');
    const loaderPercentText = document.getElementById('loader-percent');
    const loaderBar = document.getElementById('loader-bar');

    if (!loader) return;

    // Simulate high-speed asset loading
    const loadAssets = () => {
      const step = () => {
        const increment = Math.floor(Math.random() * 8) + 4; // random step
        this.loaderPercent = Math.min(this.loaderPercent + increment, 100);
        
        if (loaderPercentText) loaderPercentText.textContent = this.loaderPercent;
        if (loaderBar) loaderBar.style.width = `${this.loaderPercent}%`;

        if (this.loaderPercent < 100) {
          requestAnimationFrame(step);
        } else {
          // Finished loading
          setTimeout(() => {
            loader.classList.add('loaded');
            // Trigger reveals after loader hides
            setTimeout(() => {
              this.triggerInitialReveals();
            }, 300);
          }, 400);
        }
      };
      requestAnimationFrame(step);
    };

    // Run loader
    loadAssets();
  }

  /* ==========================================================================
     2. CUSTOM CURSOR (LERPED POSITIONING)
     ========================================================================== */
  initCustomCursor() {
    const cursorContainer = document.getElementById('custom-cursor');
    if (!cursorContainer || this.isTouchDevice) return;

    const dot = cursorContainer.querySelector('.cursor-dot');
    const ring = cursorContainer.querySelector('.cursor-ring');

    // Mouse movement listener
    window.addEventListener('mousemove', (e) => {
      this.cursor.targetX = e.clientX;
      this.cursor.targetY = e.clientY;
    }, { passive: true });

    // Hover state management
    const hoverables = document.querySelectorAll('a, button, select, input, textarea, .magnetic');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => cursorContainer.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursorContainer.classList.remove('hovering'));
    });

    // Lerp loop
    const lerp = (start, end, amt) => (1 - amt) * start + amt * end;
    
    let currentX = 0;
    let currentY = 0;
    let ringX = 0;
    let ringY = 0;

    const updateCursor = () => {
      // Direct placement for dot
      currentX = lerp(currentX, this.cursor.targetX, 0.3);
      currentY = lerp(currentY, this.cursor.targetY, 0.3);
      
      // Slower lerp for ring (creates lag effect)
      ringX = lerp(ringX, this.cursor.targetX, 0.15);
      ringY = lerp(ringY, this.cursor.targetY, 0.15);

      if (dot) dot.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      if (ring) ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

      requestAnimationFrame(updateCursor);
    };

    requestAnimationFrame(updateCursor);
  }

  /* ==========================================================================
     3. SPOTLIGHT GRID BACKGROUND
     ========================================================================== */
  initSpotlightGrid() {
    const grid = document.getElementById('spotlight-grid');
    if (!grid) return;

    // Track mouse coordinates on document root for spotlight mask
    document.addEventListener('mousemove', (e) => {
      document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);
    }, { passive: true });
  }

  /* ==========================================================================
     4. SCROLL EFFECTS & REVEALS
     ========================================================================== */
  initScrollEffects() {
    const header = document.getElementById('header');
    const backToTop = document.getElementById('back-to-top');
    const scrollProgress = document.getElementById('scroll-progress');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    // 1. Header scroll class & Back to Top visibility
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      // Sticky header state
      if (scrollY > 50) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }

      // Scroll progress percentage
      if (scrollProgress && docHeight > 0) {
        const percent = (scrollY / docHeight) * 100;
        scrollProgress.style.width = `${percent}%`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // 2. Back to Top Click
    if (backToTop) {
      backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // 3. Scroll Reveal via IntersectionObserver
    const revealCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Reveal only once
        }
      });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => revealObserver.observe(el));

    // 4. Scroll Spy Navigation Highlight
    const scrollSpyCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    };

    const scrollSpyObserver = new IntersectionObserver(scrollSpyCallback, {
      root: null,
      threshold: 0.3,
      rootMargin: '-20% 0px -60% 0px'
    });

    sections.forEach(sec => scrollSpyObserver.observe(sec));
  }

  triggerInitialReveals() {
    // Reveal hero elements sequentially on load
    const heroReveals = document.querySelectorAll('.hero-section .reveal');
    heroReveals.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('active');
      }, index * 150);
    });
  }

  /* ==========================================================================
     5. MAGNETIC BUTTONS
     ========================================================================== */
  initMagneticButtons() {
    if (this.isTouchDevice) return; // Disable on touch screens

    const magneticElements = document.querySelectorAll('.magnetic');
    
    magneticElements.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const btnX = rect.left + rect.width / 2;
        const btnY = rect.top + rect.height / 2;
        
        // Calculate offset delta
        const deltaX = e.clientX - btnX;
        const deltaY = e.clientY - btnY;

        // Apply magnetic pull transformation (limit to max 12px translation)
        const pullFactor = 0.35;
        const moveX = deltaX * pullFactor;
        const moveY = deltaY * pullFactor;

        btn.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      });

      btn.addEventListener('mouseleave', () => {
        // Reset element position smoothly
        btn.style.transform = '';
        btn.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      });

      btn.addEventListener('mouseenter', () => {
        btn.style.transition = 'none'; // Disable transition during mouse move for immediate response
      });
    });
  }

  /* ==========================================================================
     6. CARD 3D TILT EFFECT
     ========================================================================== */
  initTiltCards() {
    if (this.isTouchDevice) return;

    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        
        // Mouse coordinates relative to card
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Map mouse coordinates to degrees rotation
        const rotateY = ((x / rect.width) - 0.5) * 10; // Max tilt 5 degrees on Y axis
        const rotateX = (0.5 - (y / rect.height)) * 10; // Max tilt 5 degrees on X axis

        // Set card tilt variables and coordinate variables
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease';
      });

      card.addEventListener('mouseleave', () => {
        // Reset style smoothly
        card.style.transform = '';
        card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      });
    });
  }

  /* ==========================================================================
     7. TEXT SCRAMBLE HEADLINE
     ========================================================================== */
  initScrambleHeadline() {
    const subheadline = document.getElementById('hero-subheadline');
    if (!subheadline) return;

    const phrase = subheadline.textContent.trim();
    
    // Characters used for scrambling
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    
    class TextScrambler {
      constructor(el) {
        this.el = el;
        this.update = this.update.bind(this);
      }
      
      setText(newText) {
        this.oldText = this.el.textContent;
        this.newText = newText;
        this.promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < this.newText.length; i++) {
          const from = this.oldText[i] || '';
          const to = this.newText[i] || '';
          const start = Math.floor(Math.random() * 40);
          const end = start + Math.floor(Math.random() * 40);
          this.queue.push({ from, to, start, end, char: '' });
        }
        cancelAnimationFrame(this.frameId);
        this.frame = 0;
        this.update();
        return this.promise;
      }
      
      update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
          let { from, to, start, end, char } = this.queue[i];
          if (this.frame >= end) {
            complete++;
            output += to;
          } else if (this.frame >= start) {
            if (!char || Math.random() < 0.28) {
              char = chars[Math.floor(Math.random() * chars.length)];
              this.queue[i].char = char;
            }
            output += `<span class="scramble-char">${char}</span>`;
          } else {
            output += from;
          }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
          this.resolve();
        } else {
          this.frameId = requestAnimationFrame(this.update);
          this.frame++;
        }
      }
    }

    // Scramble on loader completion
    const scrambler = new TextScrambler(subheadline);
    
    // Trigger scramble 1s after DOM load or as reveal starts
    setTimeout(() => {
      scrambler.setText(phrase);
    }, 1200);
  }

  /* ==========================================================================
     8. EMAIL COPY TO CLIPBOARD
     ========================================================================== */
  initEmailCopy() {
    const copyBtn = document.getElementById('copy-email-btn');
    const emailAddr = document.getElementById('email-address');

    if (!copyBtn || !emailAddr) return;

    const copyIcon = copyBtn.querySelector('.copy-icon');
    const checkIcon = copyBtn.querySelector('.check-icon');

    copyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const email = emailAddr.textContent.trim();
      navigator.clipboard.writeText(email).then(() => {
        // Toggle SVGs
        copyIcon?.classList.add('hidden');
        checkIcon?.classList.remove('hidden');

        // Show premium toast
        this.showToast('Email successfully copied to clipboard.', 'success');

        // Reset state after 2 seconds
        setTimeout(() => {
          copyIcon?.classList.remove('hidden');
          checkIcon?.classList.add('hidden');
        }, 2000);
      }).catch(err => {
        console.error('Copy failed: ', err);
        this.showToast('Unable to copy email. Please try manual copy.', 'error');
      });
    });
  }

  /* ==========================================================================
     9. CONTACT FORM VALIDATION & SUBMIT
     ========================================================================== */
  initContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');

    if (!form || !submitBtn) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        this.showToast('Please fill out all contact fields.', 'error');
        return;
      }

      // Display loading state on submit button
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Kirim...</span>';

      // Simulate network request
      setTimeout(() => {
        // Success feedback
        this.showToast(`Terima kasih ${name}, pesan Anda berhasil dikirim!`, 'success');
        
        // Reset form & UI
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 1500);
    });
  }

  /* ==========================================================================
     10. MOBILE NAVIGATION DRAWER
     ========================================================================== */
  initMobileMenu() {
    const toggle = document.getElementById('mobile-toggle');
    const overlay = document.getElementById('mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (!toggle || !overlay) return;

    const toggleMenu = () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !isOpen);
      overlay.classList.toggle('active', !isOpen);
      document.body.style.overflow = !isOpen ? 'hidden' : '';
    };

    toggle.addEventListener('click', toggleMenu);
    
    // Close menu when clicking overlay links
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (overlay.classList.contains('active')) {
          toggleMenu();
        }
      });
    });
  }

  /* ==========================================================================
     11. TOAST NOTIFICATION GENERATOR
     ========================================================================== */
  showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span>${message}</span>
      <button class="toast-close" aria-label="Close message">&times;</button>
    `;

    container.appendChild(toast);

    // Fade-in trigger
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Close on click
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    });

    // Auto-remove after 4 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
      }
    }, 4000);
  }
}
