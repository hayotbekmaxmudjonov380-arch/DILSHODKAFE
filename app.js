/**
 * KAFE RESTORAN DILSHOD - INTERACTIVE MOTION & LOGIC
 * High-performance vanilla JS with 3D tilt physics, dynamic menu filtering,
 * interactive reservation, and smooth micro-animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyNavbar();
  init3DTilt();
  initCategoryTabs();
  initAmbientFollower();
  initDateConstraints();
  initScrollSpy();
});

// 1. STICKY NAVBAR EFFECT
function initStickyNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
}

// 2. 3D TILT EFFECT ON HERO CARD (60FPS Spring Physics)
function init3DTilt() {
  const card = document.getElementById('heroTiltCard');
  if (!card) return;

  const maxTilt = 12; // Maximum tilt angle in degrees

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within element
    const y = e.clientY - rect.top;  // y position within element
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

// 3. CATEGORY TABS FILTERING WITH SMOOTH FADE
function initCategoryTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const cards = document.querySelectorAll('.menu-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Toggle active class
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetCategory = tab.getAttribute('data-category');

      cards.forEach(card => {
        const itemCategory = card.getAttribute('data-category');
        
        if (targetCategory === 'all' || itemCategory === targetCategory) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          setTimeout(() => {
            card.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// 4. AMBIENT GLOW SUBTLE MOUSE FOLLOW (3D DEPTH)
function initAmbientFollower() {
  const glow1 = document.querySelector('.glow-1');
  const glow2 = document.querySelector('.glow-2');

  window.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    if (glow1) {
      glow1.style.transform = `translate(${mouseX * 40}px, ${mouseY * 40}px)`;
    }
    if (glow2) {
      glow2.style.transform = `translate(${-mouseX * 30}px, ${-mouseY * 30}px)`;
    }
  }, { passive: true });
}

// 5. DATE PICKER MINIMUM TODAY
function initDateConstraints() {
  const dateInput = document.getElementById('resDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }
}

// 6. SCROLL SPY FOR NAVIGATION HIGHLIGHT
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

// 7. RESERVATION FORM SUBMISSION
function handleReservationSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('resName').value.trim();
  const phone = document.getElementById('resPhone').value.trim();
  const date = document.getElementById('resDate').value;
  const time = document.getElementById('resTime').value;
  const guests = document.getElementById('resGuests').value;
  const notes = document.getElementById('resNotes').value.trim();

  if (!name || !phone || !date || !time) {
    alert("Iltimos, barcha majburiy maydonlarni to'ldiring!");
    return;
  }

  // Populate Summary
  const summaryEl = document.getElementById('modalSummary');
  summaryEl.innerHTML = `
    <div><strong>👤 Mehmon:</strong> ${name}</div>
    <div><strong>📞 Telefon:</strong> ${phone}</div>
    <div><strong>📅 Sana & Vaqt:</strong> ${date} soat ${time}</div>
    <div><strong>👥 Mehmonlar:</strong> ${guests}</div>
    ${notes ? `<div><strong>📝 Istak:</strong> ${notes}</div>` : ''}
  `;

  // Open Modal
  const modal = document.getElementById('successModal');
  modal.classList.add('active');

  // Reset form
  document.getElementById('reservationForm').reset();
  initDateConstraints();
}

function closeSuccessModal() {
  const modal = document.getElementById('successModal');
  modal.classList.remove('active');
}

// Quick Order Modal / Notification
function openOrderModal(dishName, price) {
  const reservationSection = document.getElementById('reservation');
  const notesField = document.getElementById('resNotes');
  
  if (notesField) {
    notesField.value = `Buyurtma taomi: ${dishName} (${price})`;
  }
  
  reservationSection.scrollIntoView({ behavior: 'smooth' });

  // Highlight form
  const formBox = document.querySelector('.reservation-form-box');
  formBox.style.boxShadow = '0 0 30px rgba(229, 169, 60, 0.4)';
  setTimeout(() => {
    formBox.style.boxShadow = '';
  }, 1600);
}
