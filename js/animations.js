// ==========================================================================
//  ANIMATIONS.JS — Scroll reveal (AOS-like), RSVP form
// ==========================================================================
(function () {
  'use strict';

  /* ---------------------------------------------------------------------
     RSVP → Google Sheets
     -----------------------------------------------------------------------
     To connect this form to a Google Sheet:
     1. Create a Google Sheet with columns: Timestamp, Name, Mobile, Email,
        Side, Attend, Guests, Message.
     2. Open Extensions → Apps Script and paste a doPost(e) handler that
        appends e.parameter values as a new row, then deploy it as a
        Web App (Execute as: Me, Who has access: Anyone).
     3. Paste the deployment URL below. Until a real URL is set, the form
        still validates and shows the success popup, but nothing is stored.
     --------------------------------------------------------------------- */
  const GOOGLE_SCRIPT_URL = ''; // <-- paste your Apps Script Web App URL here

  /* ---- Scroll reveal ---- */
  function initAOS() {
    const elements = document.querySelectorAll('[data-aos]');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = parseInt(el.getAttribute('data-aos-delay') || '0', 10);
            setTimeout(() => el.classList.add('aos-animate'), delay);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach((el) => observer.observe(el));
  }

  /* ---- RSVP form ---- */
  function initRSVP() {
    const form = document.getElementById('rsvp-form');
    const popup = document.getElementById('rsvpPopup');
    const popupClose = document.getElementById('rsvpPopupClose');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = form.querySelector('.rsvp-btn');
      if (!btn) return;

      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<span>Sending&hellip;</span>';
      btn.disabled = true;

      const data = new FormData(form);
      data.append('timestamp', new Date().toISOString());

      const finish = () => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        form.reset();
        if (popup) {
          popup.classList.add('is-visible');
          popup.setAttribute('aria-hidden', 'false');
        }
      };

      if (GOOGLE_SCRIPT_URL) {
        // no-cors keeps this working with a standard Apps Script deployment,
        // which does not return CORS headers by default.
        fetch(GOOGLE_SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: data })
          .then(finish)
          .catch(finish);
      } else {
        // No sheet connected yet — still confirm receipt to the guest.
        setTimeout(finish, 600);
      }
    });

    if (popup && popupClose) {
      popupClose.addEventListener('click', () => {
        popup.classList.remove('is-visible');
        popup.setAttribute('aria-hidden', 'true');
      });
      popup.addEventListener('click', (e) => {
        if (e.target === popup) {
          popup.classList.remove('is-visible');
          popup.setAttribute('aria-hidden', 'true');
        }
      });
    }
  }

  /* ---- Init all ---- */
  function init() {
    initAOS();
    initRSVP();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
