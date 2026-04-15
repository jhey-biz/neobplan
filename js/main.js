/* ========================================
   NEOBPLAN - Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Navbar scroll behavior ───────────────────────────────────────
  const navbar = document.querySelector('.navbar');
  const backTop = document.querySelector('.back-top');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    if (y > 400) {
      backTop.classList.add('visible');
    } else {
      backTop.classList.remove('visible');
    }
  });

  // ─── Back to top ─────────────────────────────────────────────────
  if (backTop) {
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ─── Hamburger mobile menu ────────────────────────────────────────
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
    });

    mobileMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // ─── Active nav link on scroll ────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(section => observer.observe(section));

  // ─── Reveal on scroll ────────────────────────────────────────────
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // ─── Counter animation ────────────────────────────────────────────
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4); // easeOutQuart
      const current = Math.floor(ease * target);
      el.textContent = current.toLocaleString('ko-KR') + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  // ─── Smooth scroll for anchor links ──────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ─── Org chart hover animation ────────────────────────────────────
  document.querySelectorAll('.org-box').forEach(box => {
    box.addEventListener('mouseenter', () => {
      box.style.filter = 'brightness(1.1)';
    });
    box.addEventListener('mouseleave', () => {
      box.style.filter = '';
    });
  });

  // ─── Project card hover tilt effect ──────────────────────────────
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -4;
      const rotateY = ((x - cx) / cx) * 4;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ─── Particles (subtle background dots) ──────────────────────────
  function createParticles(container, count = 20) {
    if (!container) return;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('div');
      dot.style.cssText = `
        position: absolute;
        width: ${Math.random() * 4 + 2}px;
        height: ${Math.random() * 4 + 2}px;
        background: rgba(58, 170, 53, ${Math.random() * 0.3 + 0.1});
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: particle-float ${Math.random() * 6 + 4}s ease-in-out infinite;
        animation-delay: ${Math.random() * 4}s;
        pointer-events: none;
      `;
      container.appendChild(dot);
    }
  }

  // Add particle animation CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes particle-float {
      0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
      50% { transform: translateY(-20px) scale(1.2); opacity: 0.7; }
    }
  `;
  document.head.appendChild(style);

  const heroBg = document.querySelector('.hero-bg-pattern');
  createParticles(heroBg, 15);

  // ─── Table row hover highlight ────────────────────────────────────
  document.querySelectorAll('.other-table tbody tr').forEach((row, index) => {
    row.addEventListener('mouseenter', () => {
      row.style.background = 'rgba(58, 170, 53, 0.06)';
    });
    row.addEventListener('mouseleave', () => {
      row.style.background = '';
    });
  });

});
