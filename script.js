/* ========================================
   A2BC BARBERSHOP — script.js
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Navbar scroll effect ---- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Hamburger / mobile nav ---- */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });
  // Close nav on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---- Scroll-reveal animation ---- */
  const animEls = document.querySelectorAll('[data-anim]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting, target }) => {
      if (!isIntersecting) return;
      const delay = parseInt(target.dataset.delay || 0);
      setTimeout(() => target.classList.add('animated'), delay);
      revealObserver.unobserve(target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  animEls.forEach(el => revealObserver.observe(el));

  /* ---- Testimonial Slider ---- */
  const track     = document.getElementById('testimonial-track');
  const prevBtn   = document.getElementById('prev-btn');
  const nextBtn   = document.getElementById('next-btn');
  const dotsWrap  = document.getElementById('slider-dots');
  const cards     = track.querySelectorAll('.testimonial-card');
  let current = 0;
  let perView = window.innerWidth <= 768 ? 1 : 2;
  let maxIdx  = cards.length - perView;
  let autoTimer;

  // Build dots
  const buildDots = () => {
    dotsWrap.innerHTML = '';
    const total = Math.ceil(cards.length / perView);
    for (let i = 0; i < total; i++) {
      const btn = document.createElement('button');
      btn.className = 'slider-dot' + (i === 0 ? ' active' : '');
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      btn.setAttribute('aria-label', `Go to review ${i + 1}`);
      btn.addEventListener('click', () => goTo(i * perView));
      dotsWrap.appendChild(btn);
    }
  };

  const updateDots = () => {
    const dots = dotsWrap.querySelectorAll('.slider-dot');
    dots.forEach((d, i) => {
      const active = i === Math.floor(current / perView);
      d.classList.toggle('active', active);
      d.setAttribute('aria-selected', String(active));
    });
  };

  const goTo = (idx) => {
    current = Math.max(0, Math.min(idx, maxIdx));
    const cardWidth = cards[0].offsetWidth + 24; // gap = 24
    track.style.transform = `translateX(-${current * cardWidth}px)`;
    updateDots();
  };

  prevBtn.addEventListener('click', () => { clearInterval(autoTimer); goTo(current - perView); startAuto(); });
  nextBtn.addEventListener('click', () => { clearInterval(autoTimer); goTo(current + perView); startAuto(); });

  const startAuto = () => {
    autoTimer = setInterval(() => {
      goTo(current + perView > maxIdx ? 0 : current + perView);
    }, 5000);
  };

  const init = () => {
    perView = window.innerWidth <= 768 ? 1 : 2;
    maxIdx  = cards.length - perView;
    current = 0;
    track.style.transform = 'translateX(0)';
    buildDots();
  };

  init();
  startAuto();
  window.addEventListener('resize', () => { init(); clearInterval(autoTimer); startAuto(); });

  /* ---- Video Modal ---- */
  const playBtn     = document.getElementById('play-video-btn');
  const modal       = document.getElementById('video-modal');
  const modalClose  = document.getElementById('modal-close');
  const modalBdrop  = document.getElementById('modal-backdrop');

  const openModal = () => {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  };

  playBtn.addEventListener('click', openModal);
  playBtn.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(); } });
  modalClose.addEventListener('click', closeModal);
  modalBdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  /* ---- Booking Form ---- */
  const form       = document.getElementById('booking-form');
  const successMsg = document.getElementById('form-success');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputs = form.querySelectorAll('[required]');
    let valid = true;

    inputs.forEach(input => {
      if (!input.value.trim()) {
        valid = false;
        input.style.borderColor = '#e05555';
        input.addEventListener('input', () => { input.style.borderColor = ''; }, { once: true });
      }
    });

    if (!valid) return;

    const submitBtn = document.getElementById('submit-booking');
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    setTimeout(() => {
      form.classList.add('hidden');
      successMsg.classList.remove('hidden');
    }, 1200);
  });

  /* ---- Service Category Tabs Filtering ---- */
  const serviceTabs = document.querySelectorAll('.service-tab');
  const serviceCards = document.querySelectorAll('.service-card[data-category]');

  serviceTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      serviceTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;

      serviceCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('filtered-out');
        } else {
          card.classList.add('filtered-out');
        }
      });
    });
  });

  /* ---- Auto-Select Service when clicking "Book This Service" ---- */
  const serviceLinks = document.querySelectorAll('[data-service-select]');
  const serviceSelectInput = document.getElementById('service');

  serviceLinks.forEach(link => {
    link.addEventListener('click', () => {
      const selectedVal = link.getAttribute('data-service-select');
      if (selectedVal && serviceSelectInput) {
        serviceSelectInput.value = selectedVal;
      }
    });
  });

  /* ---- Visual Staff Picker in Booking Form ---- */
  const staffPickerItems = document.querySelectorAll('.staff-picker-item');
  const barberHiddenInput = document.getElementById('barber');

  const selectStaff = (staffVal) => {
    staffPickerItems.forEach(item => {
      const isMatch = item.getAttribute('data-barber') === staffVal;
      item.classList.toggle('active', isMatch);
      const radio = item.querySelector('input[type="radio"]');
      if (radio) radio.checked = isMatch;
    });
    if (barberHiddenInput) {
      barberHiddenInput.value = staffVal;
    }
  };

  staffPickerItems.forEach(item => {
    item.addEventListener('click', () => {
      const val = item.getAttribute('data-barber');
      selectStaff(val);
    });
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const val = item.getAttribute('data-barber');
        selectStaff(val);
      }
    });
  });

  /* ---- Auto-Select Barber when clicking "Book with [Barber]" or "Select Any Staff" ---- */
  const barberLinks = document.querySelectorAll('[data-barber-select]');
  barberLinks.forEach(link => {
    link.addEventListener('click', () => {
      const selectedBarber = link.getAttribute('data-barber-select');
      if (selectedBarber) {
        selectStaff(selectedBarber);
      }
    });
  });

  /* ---- Set Minimum Booking Date to Today ---- */
  const bookDateInput = document.getElementById('book-date');
  if (bookDateInput) {
    const today = new Date().toISOString().split('T')[0];
    bookDateInput.min = today;
    bookDateInput.value = today;
  }

  /* ---- Gift Card Purchase Modal ---- */
  const giftModal = document.getElementById('gift-modal');
  const giftModalClose = document.getElementById('gift-modal-close');
  const giftModalBackdrop = document.getElementById('gift-modal-backdrop');
  const giftTriggers = document.querySelectorAll('#gift-card-btn, a[href="#gift-card"], [data-gift-trigger]');
  
  const giftForm = document.getElementById('gift-card-form');
  const giftSuccessState = document.getElementById('gift-success-state');
  const closeGiftSuccessBtn = document.getElementById('close-gift-success');
  const printGiftBtn = document.getElementById('print-gift-btn');

  // Preview elements
  const previewAmount = document.getElementById('preview-amount');
  const previewTo = document.getElementById('preview-to');
  const previewFrom = document.getElementById('preview-from');
  const previewMsg = document.getElementById('preview-msg');

  // Form inputs
  const giftToInput = document.getElementById('gift-to');
  const giftFromInput = document.getElementById('gift-from');
  const giftMsgInput = document.getElementById('gift-msg-input');
  const giftAmountInput = document.getElementById('gift-amount-input');
  const presetBtns = document.querySelectorAll('.preset-btn');
  const deliveryRadios = document.querySelectorAll('input[name="delivery_method"]');
  const emailDeliveryFields = document.getElementById('email-delivery-fields');
  const giftEmailInput = document.getElementById('gift-email');
  const giftDateInput = document.getElementById('gift-date');
  const deliveryLabelEmail = document.getElementById('delivery-label-email');
  const deliveryLabelPrint = document.getElementById('delivery-label-print');

  // Set today's date for gift date input
  if (giftDateInput) {
    const today = new Date().toISOString().split('T')[0];
    giftDateInput.min = today;
    giftDateInput.value = today;
  }

  const openGiftModal = (e) => {
    if (e) e.preventDefault();
    if (giftModal) {
      giftModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeGiftModal = () => {
    if (giftModal) {
      giftModal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  };

  giftTriggers.forEach(btn => {
    btn.addEventListener('click', openGiftModal);
  });

  if (giftModalClose) giftModalClose.addEventListener('click', closeGiftModal);
  if (giftModalBackdrop) giftModalBackdrop.addEventListener('click', closeGiftModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && giftModal && !giftModal.classList.contains('hidden')) {
      closeGiftModal();
    }
  });

  // Live Preview Updating
  if (giftToInput && previewTo) {
    giftToInput.addEventListener('input', () => {
      previewTo.textContent = giftToInput.value.trim() || "Recipient's name";
    });
  }

  if (giftFromInput && previewFrom) {
    giftFromInput.addEventListener('input', () => {
      previewFrom.textContent = giftFromInput.value.trim() || 'Your name';
    });
  }

  if (giftMsgInput && previewMsg) {
    giftMsgInput.addEventListener('input', () => {
      previewMsg.textContent = giftMsgInput.value.trim() 
        ? `"${giftMsgInput.value.trim()}"` 
        : '"Enjoy your grooming experience at A2BC!"';
    });
  }

  const updateAmount = (val) => {
    const num = parseFloat(val) || 0;
    if (previewAmount) {
      previewAmount.textContent = `$${num.toFixed(2)}`;
    }
    if (giftAmountInput) {
      giftAmountInput.value = num > 0 ? num : '';
    }
    presetBtns.forEach(b => {
      b.classList.toggle('active', parseFloat(b.dataset.amount) === num);
    });
  };

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const amt = btn.dataset.amount;
      updateAmount(amt);
    });
  });

  if (giftAmountInput) {
    giftAmountInput.addEventListener('input', () => {
      const num = parseFloat(giftAmountInput.value) || 0;
      if (previewAmount) {
        previewAmount.textContent = `$${num.toFixed(2)}`;
      }
      presetBtns.forEach(b => {
        b.classList.toggle('active', parseFloat(b.dataset.amount) === num);
      });
    });
  }

  // Delivery method toggle (Email vs Print)
  deliveryRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      const isEmail = radio.value === 'email';
      if (emailDeliveryFields) {
        emailDeliveryFields.classList.toggle('hidden', !isEmail);
      }
      if (deliveryLabelEmail) deliveryLabelEmail.classList.toggle('active', isEmail);
      if (deliveryLabelPrint) deliveryLabelPrint.classList.toggle('active', !isEmail);

      if (giftEmailInput) giftEmailInput.required = isEmail;
      if (giftDateInput) giftDateInput.required = isEmail;
    });
  });

  // Gift Card Submission & Simulated Checkout
  if (giftForm) {
    giftForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let valid = true;
      const requiredInputs = giftForm.querySelectorAll('input[required]');
      requiredInputs.forEach(inp => {
        if (!inp.value.trim()) {
          valid = false;
          inp.style.borderColor = '#e05555';
          inp.addEventListener('input', () => { inp.style.borderColor = ''; }, { once: true });
        }
      });

      const amountVal = parseFloat(giftAmountInput.value) || 0;
      if (amountVal <= 0) {
        valid = false;
        giftAmountInput.style.borderColor = '#e05555';
        giftAmountInput.addEventListener('input', () => { giftAmountInput.style.borderColor = ''; }, { once: true });
      }

      if (!valid) return;

      const submitBtn = document.getElementById('gift-submit-btn');
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Payment...';
      submitBtn.disabled = true;

      setTimeout(() => {
        // Generate random voucher code
        const randCode = 'A2BC-' + Math.floor(1000 + Math.random() * 9000) + '-GIFT';
        const formattedAmount = `$${amountVal.toFixed(2)}`;
        const toName = giftToInput.value.trim();
        const fromName = giftFromInput.value.trim();
        const selectedDelivery = document.querySelector('input[name="delivery_method"]:checked').value;

        // Populate Success State
        document.getElementById('success-voucher-code').textContent = randCode;
        document.getElementById('success-voucher-amount').textContent = formattedAmount;
        document.getElementById('success-to-text').textContent = toName;
        document.getElementById('success-from-text').textContent = fromName;
        
        const deliveryText = selectedDelivery === 'email'
          ? `Sent via Email to ${giftEmailInput.value.trim()} on ${giftDateInput.value}`
          : 'Ready for Instant Printing';
        document.getElementById('success-delivery-text').textContent = deliveryText;

        // Switch to success view
        giftForm.classList.add('hidden');
        giftSuccessState.classList.remove('hidden');

        // Reset submit button for next time
        submitBtn.innerHTML = 'Add to Cart &amp; Checkout';
        submitBtn.disabled = false;
      }, 900);
    });
  }

  if (closeGiftSuccessBtn) {
    closeGiftSuccessBtn.addEventListener('click', () => {
      closeGiftModal();
      // Reset view after modal closes
      setTimeout(() => {
        giftSuccessState.classList.add('hidden');
        giftForm.classList.remove('hidden');
        giftForm.reset();
        updateAmount(50);
        if (giftToInput) previewTo.textContent = "Recipient's name";
        if (giftFromInput) previewFrom.textContent = "Your name";
        if (previewMsg) previewMsg.textContent = '"Enjoy your grooming experience at A2BC!"';
        if (emailDeliveryFields) emailDeliveryFields.classList.remove('hidden');
        if (deliveryLabelEmail) deliveryLabelEmail.classList.add('active');
        if (deliveryLabelPrint) deliveryLabelPrint.classList.remove('active');
      }, 300);
    });
  }

  if (printGiftBtn) {
    printGiftBtn.addEventListener('click', () => {
      window.print();
    });
  }

  /* ---- Smooth active nav highlight ---- */
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navAnchors = document.querySelectorAll('.nav-link');
  const highlightNav = () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navAnchors.forEach(a => {
      a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--gold)' : '';
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

});

