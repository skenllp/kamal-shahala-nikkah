// ===== COUNTDOWN TIMER =====
(function () {
  'use strict';

  const WEDDING_DATE = new Date('2026-11-22T00:00:00');

  function pad(num) {
    return String(num).padStart(2, '0');
  }

  function updateCountdown() {
    const now = new Date();
    const diff = WEDDING_DATE - now;

    const grid = document.getElementById('countdownGrid');
    const complete = document.getElementById('countdownComplete');

    if (diff <= 0) {
      setCountdownValue('cd-days', '00');
      setCountdownValue('cd-hours', '00');
      setCountdownValue('cd-minutes', '00');
      setCountdownValue('cd-seconds', '00');
      if (grid) grid.hidden = true;
      if (complete) {
        complete.hidden = false;
        complete.classList.add('aos-animate');
      }
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setCountdownValue('cd-days', pad(days));
    setCountdownValue('cd-hours', pad(hours));
    setCountdownValue('cd-minutes', pad(minutes));
    setCountdownValue('cd-seconds', pad(seconds));
  }

  function setCountdownValue(id, newVal) {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.textContent !== newVal) {
      el.classList.add('flip');
      setTimeout(() => el.classList.remove('flip'), 350);
      el.textContent = newVal;
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
})();
