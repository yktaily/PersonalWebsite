/* Small, dependency-free enhancements. All project copy lives in index.html. */
(() => {
  'use strict';
  const config = window.PORTFOLIO_CONFIG || {};

  // Treat configurable text as text, never executable HTML.
  if (typeof config.personalIntro === 'string' && config.personalIntro.trim()) {
    const intro = document.querySelector('[data-personal-intro]');
    if (intro) {
      intro.textContent = config.personalIntro.trim();
      intro.closest('.intro-placeholder')?.classList.add('is-complete');
    }
  }
  if (typeof config.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email)) {
    document.querySelectorAll('[data-email]').forEach(link => {
      link.href = `mailto:${config.email}`;
      if (link.hasAttribute('data-email-text')) link.textContent = config.email;
    });
  }
  if (typeof config.linkedin === 'string') {
    try {
      const url = new URL(config.linkedin);
      if (url.protocol === 'https:' && /(^|\.)linkedin\.com$/i.test(url.hostname)) {
        document.querySelectorAll('[data-linkedin]').forEach(link => { link.href = url.href; });
      }
    } catch { /* Keep the valid default link in the HTML. */ }
  }
  const resume = config.resume;
  if (resume?.enabled === true && typeof resume.path === 'string' && /\.pdf$/i.test(resume.path) && !/^(?:[a-z]+:|\/\/)/i.test(resume.path)) {
    document.querySelectorAll('[data-resume]').forEach(link => {
      link.href = resume.path;
      link.download = resume.filename || 'Yusif-Ktaily-Resume.pdf';
      link.hidden = false;
    });
  }
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = String(new Date().getFullYear()); });

  // Mobile navigation: keyboard access, Escape, and close after choosing a section.
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  if (header && menuButton && nav) {
    header.classList.add('js-nav');
    const setMenu = open => {
      menuButton.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
      const label = menuButton.querySelector('.sr-only');
      if (label) label.textContent = open ? 'Close navigation' : 'Open navigation';
    };
    menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('click', event => {
      if (!header.contains(event.target)) setMenu(false);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        setMenu(false); menuButton.focus();
      }
    });
    const desktop = window.matchMedia('(min-width: 761px)');
    desktop.addEventListener?.('change', event => { if (event.matches) setMenu(false); });
  }

  // Reading progress and current section indicator; one animation frame per scroll.
  const progress = document.querySelector('.scroll-progress');
  const sectionLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];
  const sections = sectionLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  let queued = false;
  const updatePosition = () => {
    const maximum = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = `scaleX(${maximum > 0 ? Math.min(1, Math.max(0, window.scrollY / maximum)) : 0})`;
    const atBottom = maximum > 0 && window.scrollY >= maximum - 6;
    let current = '';
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= 170) current = section.id;
    }
    if (atBottom) current = 'contact';
    sectionLinks.forEach(link => {
      if (link.getAttribute('href') === `#${current}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    queued = false;
  };
  const queuePosition = () => {
    if (!queued) { queued = true; window.requestAnimationFrame(updatePosition); }
  };
  window.addEventListener('scroll', queuePosition, { passive: true });
  window.addEventListener('resize', queuePosition, { passive: true });
  document.querySelectorAll('details').forEach(details => details.addEventListener('toggle', () => {
    if (!details.open) details.querySelectorAll('video').forEach(video => video.pause());
    queuePosition();
  }));
  updatePosition();

  // Image lightbox. Each project is a separate, navigable gallery.
  const dialog = document.querySelector('.lightbox');
  if (!dialog) return;
  const image = dialog.querySelector('.lightbox-image');
  const caption = dialog.querySelector('#lightbox-caption');
  const count = dialog.querySelector('.lightbox-count');
  const title = dialog.querySelector('#lightbox-title');
  const previous = dialog.querySelector('.lightbox-prev');
  const next = dialog.querySelector('.lightbox-next');
  const close = dialog.querySelector('.lightbox-close');
  const names = { chemistry: 'Galvanic Cell Investigation', physics: 'Golf-Club Collision Investigation', robotics: 'Robotics Competition', internship: 'Inside the Internship', leadership: 'Leadership Work' };
  const galleryMap = new Map();
  let activeItems = [], activeIndex = 0, lastTrigger = null, touchStartX = 0, touchStartY = 0;
  const triggers = document.querySelectorAll('.media-trigger[data-gallery]');
  triggers.forEach(trigger => {
    const thumbnail = trigger.querySelector('img');
    const src = trigger.dataset.image || thumbnail?.getAttribute('src');
    if (!src) return;
    const group = trigger.dataset.gallery;
    if (!galleryMap.has(group)) galleryMap.set(group, []);
    const item = { src, alt: thumbnail?.alt || trigger.dataset.caption || '', caption: trigger.dataset.caption || thumbnail?.alt || '', trigger };
    galleryMap.get(group).push(item);
    trigger.addEventListener('click', () => {
      // Old browsers can still view the image without a polyfill or a library.
      if (typeof dialog.showModal !== 'function') { window.open(src, '_blank', 'noopener,noreferrer'); return; }
      activeItems = galleryMap.get(group);
      activeIndex = activeItems.indexOf(item);
      lastTrigger = trigger;
      title.textContent = names[group] || 'Project gallery';
      render();
      dialog.showModal();
      document.body.classList.add('gallery-open');
      close.focus();
    });
  });
  function render() {
    const item = activeItems[activeIndex];
    if (!item) return;
    image.src = item.src;
    image.alt = item.alt;
    caption.textContent = item.caption;
    count.textContent = `${activeIndex + 1} / ${activeItems.length}`;
    previous.disabled = activeItems.length < 2;
    next.disabled = activeItems.length < 2;
  }
  function step(direction) {
    if (!activeItems.length) return;
    activeIndex = (activeIndex + direction + activeItems.length) % activeItems.length;
    render();
  }
  previous.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('gallery-open');
    image.removeAttribute('src');
    if (lastTrigger?.isConnected) lastTrigger.focus({ preventScroll: true });
  });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1); }
    else if (event.key === 'ArrowRight') { event.preventDefault(); step(1); }
  });
  image.addEventListener('touchstart', event => {
    touchStartX = event.changedTouches[0].screenX;
    touchStartY = event.changedTouches[0].screenY;
  }, { passive: true });
  image.addEventListener('touchend', event => {
    const dx = event.changedTouches[0].screenX - touchStartX;
    const dy = event.changedTouches[0].screenY - touchStartY;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
  }, { passive: true });
})();
