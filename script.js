/**
 * script.js - Main JavaScript for projet_ark_pve site
 * Author: lucas
 * Description: Handles UI interactions and core logic
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ========== MENU MOBILE (burger) ========== */
  const btn = document.querySelector('.menu-btn');
  const menu = document.getElementById('main-menu');
  if (btn && menu) {
    btn.addEventListener('click', () => {
      const opened = menu.classList.toggle('active'); // .menu.active est stylé dans ton CSS
      btn.setAttribute('aria-expanded', opened ? 'true' : 'false');
    });
    // Ferme après clic sur un lien
    menu.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        menu.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
      })
    );
    // Ferme si clic hors menu
    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && e.target !== btn) {
        menu.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ========== Smooth scroll pour ancres internes ========== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ========== Validation basique d’un éventuel formulaire ========== */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      let valid = true;
      const email = contactForm.querySelector('input[type="email"]');
      if (email && !validateEmail(email.value)) {
        valid = false;
        email.classList.add('error');
      } else if (email) {
        email.classList.remove('error');
      }
      if (!valid) e.preventDefault();
    });
  }

  /* ========== Filtrage des MODS (compatible .mod-card-modern) ========== */
  const search = document.getElementById('mods-search');
  const filter = document.getElementById('mods-filter');
  const cards = Array.from(document.querySelectorAll('.mod-card-modern'));

  function applyModsFilter() {
    const q = (search?.value || '').toLowerCase();
    const cat = (filter?.value || '').toLowerCase();

    cards.forEach(card => {
      const title = (card.querySelector('h2')?.textContent || '').toLowerCase();
      const desc  = (card.querySelector('p')?.textContent || '').toLowerCase();
      const tags  = (card.dataset.tags || '').toLowerCase(); // optionnel : <div data-tags="qol dinos">
      const matchText = !q || title.includes(q) || desc.includes(q) || tags.includes(q);
      const matchCat  = !cat || tags.includes(cat);
      card.style.display = (matchText && matchCat) ? '' : 'none';
    });
  }

  if (search) search.addEventListener('input', applyModsFilter);
  if (filter) filter.addEventListener('change', applyModsFilter);
});

/* ---------- Utils ---------- */
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Petite notif simple
function showNotification(message, type = 'info') {
  const notif = document.createElement('div');
  notif.className = `notification ${type}`;
  notif.textContent = message;
  Object.assign(notif.style, {
    position: 'fixed', bottom: '20px', right: '20px',
    background: '#11151f', color: '#e6edf3',
    border: '1px solid rgba(255,255,255,.08)', borderRadius: '10px',
    padding: '10px 14px', boxShadow: '0 10px 24px rgba(0,0,0,.4)', zIndex: 9999
  });
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 3000);
}

// export { validateEmail, showNotification };
