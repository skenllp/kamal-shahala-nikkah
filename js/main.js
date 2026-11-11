// ==========================================================================
//  MAIN.JS — Gate reveal, music player, navigation utilities
// ==========================================================================
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initGate();
  initMusicToggle();
  initSideNav();
});

/* ---- Preloader dismiss ---- */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  
  // Dismiss once fully loaded
  const dismiss = () => {
    preloader.classList.add('loaded');
  };
  
  if (document.readyState === 'complete') {
    dismiss();
  } else {
    window.addEventListener('load', dismiss);
  }
  
  // Fallback safety timeout
  setTimeout(dismiss, 1600);
}

/* ---- Opening gate (tap-to-enter) ---- */
function initGate() {
  const gate = document.getElementById('gate');
  const enterBtn = document.getElementById('gate-enter');
  const overlay = document.getElementById('heroTransitionOverlay');
  const heroBgImg = document.querySelector('.hero__bg-img');
  if (!gate || !enterBtn) return;

  let opened = false;

  function openGate() {
    if (opened) return;
    opened = true;

    // Phase 1: Activate blur/fade overlay (covers the transition)
    if (overlay) {
      overlay.classList.add('active');
    }

    // Phase 2: After a short hold, start fading the gate out
    window.setTimeout(() => {
      gate.classList.add('gate-closing');
      document.body.classList.remove('gate-active');
      document.body.classList.add('page-loaded');
    }, 300);

    // Phase 3: Kick off hero bg image scale-in
    window.setTimeout(() => {
      if (heroBgImg) heroBgImg.classList.add('is-visible');
    }, 500);

    // Phase 4: Start fading out the transition overlay
    window.setTimeout(() => {
      if (overlay) {
        overlay.classList.remove('active');
        overlay.classList.add('fading-out');
      }
    }, 900);

    // Phase 5: Fully hide gate and remove overlay
    window.setTimeout(() => {
      gate.classList.add('gate-hidden');
      gate.setAttribute('aria-hidden', 'true');
      if (overlay) {
        overlay.classList.remove('fading-out');
        overlay.style.display = 'none';
      }
    }, 2300);

    // Attempt to auto-start music once the user has interacted with the page
    const music = document.getElementById('bgMusic');
    const musicBtn = document.getElementById('musicToggle');
    if (music && musicBtn) {
      music.volume = 0.5;
      music.play()
        .then(() => musicBtn.classList.add('is-playing'))
        .catch(() => {
          // Autoplay blocked by the browser — the button remains available
          // so the user can start playback manually. This mirrors standard
          // mobile autoplay-restriction handling.
        });
    }
  }

  enterBtn.addEventListener('click', openGate);
  enterBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openGate();
    }
  });

  // Fallback: if the gate is somehow skipped (e.g. no-JS fallback removed),
  // never block scrolling for more than a few seconds.
  window.setTimeout(() => {
    if (!opened) {
      document.body.classList.remove('gate-active');
      if (heroBgImg) heroBgImg.classList.add('is-visible');
    }
  }, 8000);
}

/* ---- Music toggle ---- */
function initMusicToggle() {
  const btn = document.getElementById('musicToggle');
  const music = document.getElementById('bgMusic');
  if (!btn || !music) return;

  btn.addEventListener('click', () => {
    if (music.paused) {
      music.play()
        .then(() => btn.classList.add('is-playing'))
        .catch(() => {});
      btn.setAttribute('aria-label', 'Pause background music');
    } else {
      music.pause();
      btn.classList.remove('is-playing');
      btn.setAttribute('aria-label', 'Play background music');
    }
  });
}

/* ---- Side nav dots — highlight active section on scroll ---- */
function initSideNav() {
  const dots = document.querySelectorAll('.side-nav__dot');
  if (!dots.length) return;

  const targets = Array.from(dots).map((d) => {
    const href = d.getAttribute('href');
    return href ? document.querySelector(href) : null;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = targets.indexOf(entry.target);
          dots.forEach((d, i) => {
            if (i === idx) d.setAttribute('aria-current', 'true');
            else d.removeAttribute('aria-current');
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  targets.forEach((t) => {
    if (t) observer.observe(t);
  });
}

/* ---- Top nav background on scroll ---- */
(function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.pageYOffset > 80);
  });
})();

/* ---- Smooth scroll for internal anchor links ---- */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

/* ---- Soft parallax on the hero background image ---- */
(function initHeroParallax() {
  const heroBgImg = document.querySelector('.hero__bg-img');
  if (!heroBgImg) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.pageYOffset;
        const hero = document.getElementById('hero');
        const heroHeight = hero ? hero.offsetHeight : 0;
        if (scrollY < heroHeight) {
          heroBgImg.style.transform = `scale(1) translateY(${scrollY * 0.12}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  });
})();
