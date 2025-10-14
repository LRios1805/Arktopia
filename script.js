/**
 * script.js - Main JavaScript for projet_ark_pve site
 * Author: lucas
 * Description: Handles UI interactions and core logic
 */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Example: Navigation toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Example: Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Example: Form validation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            let valid = true;
            const email = this.querySelector('input[type="email"]');
            if (email && !validateEmail(email.value)) {
                valid = false;
                email.classList.add('error');
            } else if (email) {
                email.classList.remove('error');
            }
            if (!valid) {
                e.preventDefault();
            }
        });
    }
});

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Example: Utility function to show notifications
function showNotification(message, type = 'info') {
    const notif = document.createElement('div');
    notif.className = `notification ${type}`;
    notif.textContent = message;
    document.body.appendChild(notif);
    setTimeout(() => {
        notif.remove();
    }, 3000);
}

// === Filtrage des cartes de mods ===

document.addEventListener("DOMContentLoaded", () => {
  const search = document.getElementById("mods-search");
  const filter = document.getElementById("mods-filter");
  const cards = [...document.querySelectorAll(".mod-card")];

  function applyFilter() {
    const q = (search.value || "").toLowerCase();
    const cat = filter.value.toLowerCase();
    cards.forEach((c) => {
      const title = c.querySelector(".mod-title").textContent.toLowerCase();
      const desc = (c.querySelector(".mod-desc")?.textContent || "").toLowerCase();
      const tags = (c.dataset.tags || "").toLowerCase();

      const matchText = title.includes(q) || desc.includes(q) || tags.includes(q);
      const matchCat = !cat || tags.includes(cat);
      c.style.display = matchText && matchCat ? "" : "none";
    });
  }

  if (search && filter) {
    search.addEventListener("input", applyFilter);
    filter.addEventListener("change", applyFilter);
  }
});


// Export functions if using modules
// export { validateEmail, showNotification };