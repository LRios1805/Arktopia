/**
 * script.js - UI & interactions Arktopia (pro)
 * Conserve les features existantes + ajoute header sticky/solid et animations au scroll.
 */

document.addEventListener('DOMContentLoaded', () => {
  /* =========================
   * Sélecteurs utilitaires
   * ========================= */
  const header = document.querySelector('header, .site-header, .app-header'); // adapte au besoin
  const navLinks = document.querySelectorAll('nav a[href]:not([href^="#"])');
  const prefersReducedMotion = (typeof window.matchMedia === 'function')
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: false, addEventListener: null, addListener: null };

  /* ========== MENU MOBILE (burger) ========== */
  const btn = document.querySelector('.menu-btn');
  const menu = document.getElementById('main-menu');

  if (btn && menu) {
    // Relations ARIA
    if (!btn.hasAttribute('aria-controls')) btn.setAttribute('aria-controls', 'main-menu');
    btn.setAttribute('aria-expanded', 'false');

    const closeMenu = () => {
      menu.classList.remove('active');
      btn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll'); // si tu veux bloquer le scroll quand ouvert
    };

    const openMenu = () => {
      menu.classList.add('active');
      btn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('no-scroll');
    };

    const toggleMenu = () => {
      const opened = !menu.classList.contains('active');
      opened ? openMenu() : closeMenu();
    };

    btn.addEventListener('click', toggleMenu);

    // Ferme après clic sur un lien
    menu.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', closeMenu)
    );

    // Ferme si clic hors menu (uniquement si ouvert)
    document.addEventListener('click', (e) => {
      if (!menu.classList.contains('active')) return;
      const clickInsideMenu = menu.contains(e.target);
      const clickOnButton = btn.contains(e.target);
      if (!clickInsideMenu && !clickOnButton) closeMenu();
    }, { passive: true });

    // Ferme avec Échap
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('active')) {
        closeMenu();
        btn.focus();
      }
    });
  }

  /* ========== Lien actif dans la nav ========== */
  (function setActiveNav() {
    const currentPage = (() => {
      const last = window.location.pathname.split('/').pop();
      return (last && last !== '/') ? last.toLowerCase() : 'index.html';
    })();

    navLinks.forEach(a => {
      try {
        const target = new URL(a.getAttribute('href'), window.location.origin);
        const linkPage = (target.pathname.split('/').pop() || 'index.html').toLowerCase();
        a.classList.toggle('active', linkPage === currentPage);
      } catch { /* ignore URL errors */ }
    });
  })();

  /* ========== Apparition des sections (scroll reveal) ========== */
  const revealElements = document.querySelectorAll('.reveal');

  function showAllReveals() {
    revealElements.forEach((el) => el.classList.add('is-visible'));
  }

  if (prefersReducedMotion.matches) {
    showAllReveals();
  } else if (revealElements.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -80px' });

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback anciens navigateurs
    showAllReveals();
  }

  if (typeof prefersReducedMotion.addEventListener === 'function') {
    prefersReducedMotion.addEventListener('change', (event) => {
      if (event.matches) showAllReveals();
    });
  } else if (typeof prefersReducedMotion.addListener === 'function') {
    prefersReducedMotion.addListener((event) => {
      if (event.matches) showAllReveals();
    });
  }

  /* ========== Smooth scroll pour ancres internes (avec offset header) ========== */
  function getHeaderOffset() {
    // Si header sticky, compense sa hauteur pour ne pas masquer l’ancre
    return header ? header.offsetHeight : 0;
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const raw = anchor.getAttribute('href');
      const id = raw ? raw.slice(1) : '';
      if (!id) return;

      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();

      const offset = getHeaderOffset();
      const targetTop = target.getBoundingClientRect().top + window.scrollY - offset;

      if (prefersReducedMotion.matches) {
        window.scrollTo(0, targetTop);
      } else {
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      }

      // Déplace le focus pour l’accessibilité
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });

  /* ========== Filtrage des MODS (compatible .mod-card-modern) ========== */
  const search = document.getElementById('mods-search');
  const filter = document.getElementById('mods-filter');
  const cards = Array.from(document.querySelectorAll('.mod-card-modern'));

  function applyModsFilter() {
    const q = (search?.value || '').toLowerCase().trim();
    const cat = (filter?.value || '').toLowerCase().trim();

    cards.forEach(card => {
      const title = (card.querySelector('h2')?.textContent || '').toLowerCase();
      const desc = (card.querySelector('p')?.textContent || '').toLowerCase();
      const tags = (card.dataset.tags || '').toLowerCase();
      const matchText = !q || title.includes(q) || desc.includes(q) || tags.includes(q);
      const matchCat = !cat || tags.split(',').map(s => s.trim()).includes(cat) || tags.includes(cat); // tolérant
      card.style.display = (matchText && matchCat) ? '' : 'none';
    });
  }

  if (search) search.addEventListener('input', applyModsFilter);
  if (filter) filter.addEventListener('change', applyModsFilter);

  /* ========== Header sticky/solid au scroll ========== */
  if (header) {
    // Ajoute une classe si CSS gère déjà position: sticky; top:0;
    header.classList.add('is-sticky-ready');

    let ticking = false;
    const THRESHOLD = 8; // px depuis le haut

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrolled = window.scrollY > THRESHOLD;
        header.classList.toggle('is-scrolled', scrolled);
        header.classList.toggle('at-top', !scrolled);
        ticking = false;
      });
    };

    // État initial
    onScroll();

    // Listener performant
    window.addEventListener('scroll', onScroll, { passive: true });

    // Optionnel : si un "hero" existe, utiliser un observer pour précision
    const hero = document.querySelector('.hero, .masthead');
    if (hero && 'IntersectionObserver' in window) {
      const heroObs = new IntersectionObserver(([entry]) => {
        header.classList.toggle('is-scrolled', !entry.isIntersecting);
        header.classList.toggle('at-top', entry.isIntersecting);
      }, { threshold: 0.01, rootMargin: '-1px 0px 0px 0px' });
      heroObs.observe(hero);
    }
  }

});
