/**
 * Image Scatter Component
 * Adapted from VengeanceUI (Ashutoshx7/VengeanceUI) for Vanilla JavaScript & GSAP
 * Customized for A2BC Barbershop
 */

(function () {
  'use strict';

  const scatterData = [
    {
      category: "Master Fades",
      eyebrow: "Precision Grooming",
      heading: 'Master Fades & <span class="brand-gold">Razor Precision</span>',
      description: "Sharp tapers, seamless skin fades, and clean lines executed by master craftsmen.",
      images: [
        'Close-up-of-barbers-tattooed-hands-holding-comb-and-scissors-and-giving-man-trendy-hairstyle.jpg',
        'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80',
        '6afbd8a6ef8d2a64f84510d7143d6c77.jpg',
        '1.jpg',
        '2.jpg'
      ]
    },
    {
      category: "Hot Towel & Beard",
      eyebrow: "Classic Barbering",
      heading: 'Traditional Shaves & <span class="brand-gold">Beard Artistry</span>',
      description: "Eucalyptus hot towels, lathered straight-razor glide, and immaculate beard contouring.",
      images: [
        'barber-bg.jpg',
        'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80',
        '3.jpg',
        '4.jpg'
      ]
    },
    {
      category: "Modern Styling",
      eyebrow: "Signature Cuts",
      heading: 'Modern Textures & <span class="brand-gold">Tailored Styles</span>',
      description: "From textured crops and classic side parts to high-volume pompadours with premium finish.",
      images: [
        'hero.jpg',
        'https://images.unsplash.com/photo-1517832606589-7629c3395909?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=600&q=80',
        '5.jpg',
        '6.jpg'
      ]
    },
    {
      category: "The Atmosphere",
      eyebrow: "Exclusive Lounge",
      heading: 'The Elite A2BC <span class="brand-gold">Experience</span>',
      description: "Vintage Belmont chairs, tailored hospitality, and an atmosphere built for the modern gentleman.",
      images: [
        'hero.jpg',
        'Close-up-of-barbers-tattooed-hands-holding-comb-and-scissors-and-giving-man-trendy-hairstyle.jpg',
        'barber-bg.jpg',
        '7.jpg'
      ]
    },
    {
      category: "Fresh Client Cuts",
      eyebrow: "New Cuts Showcase",
      heading: 'Fresh Looks & <span class="brand-gold">Sharp Styles</span>',
      description: "Recent client cuts and styling straight from the chairs of A2BC Barbershop.",
      images: [
        '1.jpg',
        '2.jpg',
        '3.jpg',
        '4.jpg',
        '5.jpg',
        '6.jpg',
        '7.jpg'
      ]
    }
  ];

  function initImageScatter() {
    const container = document.getElementById('image-scatter-container');
    const gallery = document.getElementById('image-scatter-gallery');
    const heading = document.getElementById('image-scatter-heading');
    const eyebrow = document.getElementById('image-scatter-eyebrow');
    const desc = document.getElementById('image-scatter-desc');
    const indicatorsWrap = document.getElementById('scatter-indicators');
    const prevBtn = document.getElementById('scatter-prev');
    const nextBtn = document.getElementById('scatter-next');

    if (!container || !gallery || !heading || typeof gsap === 'undefined') {
      return;
    }

    const animationDuration = 0.75;
    const animationOverlap = 0.45;
    const headingFadeDuration = 0.45;

    let activeCards = [];
    let currentSection = 0;
    let isAnimating = false;
    let autoInterval = null;
    let isPaused = false;

    function getCardSize() {
      const w = window.innerWidth;
      if (w < 480) {
        return { width: 140, height: 180 };
      } else if (w < 768) {
        return { width: 175, height: 220 };
      } else if (w < 1200) {
        return { width: 210, height: 260 };
      } else {
        return { width: 240, height: 295 };
      }
    }

    function getViewport() {
      const cW = container.clientWidth || window.innerWidth;
      const cH = container.clientHeight || 700;
      const isMobile = window.innerWidth < 768;
      return {
        width: cW,
        height: cH,
        centerX: cW / 2,
        centerY: cH / 2,
        rangeMin: Math.min(cW, cH) * (isMobile ? 0.32 : 0.30),
        rangeMax: Math.min(cW, cH) * (isMobile ? 0.47 : 0.45),
      };
    }

    function getEdgePosition(centerX, centerY, cardWidth, cardHeight) {
      const vp = getViewport();
      const distances = {
        left: centerX,
        right: vp.width - centerX,
        top: centerY,
        bottom: vp.height - centerY,
      };

      const minDistance = Math.min(...Object.values(distances));
      const cardCenterOffsetX = cardWidth / 2;
      const cardCenterOffsetY = cardHeight / 2;
      const offsetVariation = () => (Math.random() - 0.5) * 350;

      if (minDistance === distances.left) {
        return {
          x: -cardWidth - 80 - Math.random() * 160,
          y: centerY - cardCenterOffsetY + offsetVariation(),
        };
      }
      if (minDistance === distances.right) {
        return {
          x: vp.width + 60 + Math.random() * 160,
          y: centerY - cardCenterOffsetY + offsetVariation(),
        };
      }
      if (minDistance === distances.top) {
        return {
          x: centerX - cardCenterOffsetX + offsetVariation(),
          y: -cardHeight - 80 - Math.random() * 160,
        };
      }
      return {
        x: centerX - cardCenterOffsetX + offsetVariation(),
        y: vp.height + 60 + Math.random() * 160,
      };
    }

    function createCards(sectionIndex) {
      const cards = [];
      const sectionData = scatterData[sectionIndex];
      if (!sectionData || !sectionData.images.length) return cards;

      const { width: cardWidth, height: cardHeight } = getCardSize();
      const vp = getViewport();

      sectionData.images.forEach((src, idx) => {
        const card = document.createElement('div');
        card.className = 'scatter-card';
        card.style.width = `${cardWidth}px`;
        card.style.height = `${cardHeight}px`;

        const img = document.createElement('img');
        img.src = src;
        img.alt = `${sectionData.category} showcase ${idx + 1}`;
        img.loading = 'lazy';
        card.appendChild(img);

        // Distribute nicely around circle with sector distribution
        const total = sectionData.images.length;
        const baseAngle = (idx / total) * Math.PI * 2;
        const angleJitter = (Math.random() - 0.5) * (Math.PI / total * 1.2);
        const angle = baseAngle + angleJitter;

        const radius = vp.rangeMin + Math.random() * (vp.rangeMax - vp.rangeMin);
        const centerX = vp.centerX + Math.cos(angle) * radius;
        const centerY = vp.centerY + Math.sin(angle) * radius;

        gsap.set(card, {
          left: centerX - cardWidth / 2,
          top: centerY - cardHeight / 2,
          rotation: Math.random() * 46 - 23,
          transformOrigin: 'center center'
        });

        gallery.appendChild(card);
        cards.push({ element: card, centerX, centerY, cardWidth, cardHeight });
      });

      return cards;
    }

    function animateHeading(sectionData) {
      const tl = gsap.timeline();
      tl.to([eyebrow, heading, desc], {
        opacity: 0,
        y: -14,
        duration: headingFadeDuration * 0.6,
        stagger: 0.05,
        ease: 'power2.in',
      })
        .call(() => {
          if (eyebrow) eyebrow.textContent = sectionData.eyebrow;
          if (heading) heading.innerHTML = sectionData.heading;
          if (desc) desc.textContent = sectionData.description;
        })
        .to([eyebrow, heading, desc], {
          opacity: 1,
          y: 0,
          duration: headingFadeDuration,
          stagger: 0.07,
          ease: 'power2.out',
        });
      return tl;
    }

    function animateCards(exitingCards, enteringCards) {
      const tl = gsap.timeline();

      exitingCards.forEach(({ element, centerX, centerY, cardWidth, cardHeight }) => {
        const targetEdge = getEdgePosition(centerX, centerY, cardWidth, cardHeight);
        tl.to(
          element,
          {
            left: targetEdge.x,
            top: targetEdge.y,
            rotation: Math.random() * 160 - 80,
            opacity: 0,
            duration: animationDuration,
            ease: 'power2.in',
            onComplete: () => {
              if (element.parentNode) element.remove();
            },
          },
          0
        );
      });

      enteringCards.forEach(({ element, centerX, centerY, cardWidth, cardHeight }) => {
        const targetEdge = getEdgePosition(centerX, centerY, cardWidth, cardHeight);
        gsap.set(element, {
          left: targetEdge.x,
          top: targetEdge.y,
          rotation: Math.random() * 160 - 80,
          opacity: 0,
        });

        tl.to(
          element,
          {
            left: centerX - cardWidth / 2,
            top: centerY - cardHeight / 2,
            rotation: Math.random() * 46 - 23,
            opacity: 1,
            duration: animationDuration,
            ease: 'power2.out',
          },
          animationOverlap
        );
      });

      return tl;
    }

    function updateIndicators(targetIndex) {
      if (!indicatorsWrap) return;
      const pills = indicatorsWrap.querySelectorAll('.scatter-pill');
      pills.forEach((pill, idx) => {
        pill.classList.toggle('active', idx === targetIndex);
        pill.setAttribute('aria-selected', String(idx === targetIndex));
      });
    }

    function goToSection(targetIndex) {
      if (isAnimating || targetIndex === currentSection) return;
      isAnimating = true;

      const targetData = scatterData[targetIndex];
      const newCards = createCards(targetIndex);

      updateIndicators(targetIndex);

      Promise.all([
        animateCards(activeCards, newCards),
        animateHeading(targetData),
      ]).then(() => {
        activeCards = newCards;
        currentSection = targetIndex;
        isAnimating = false;
      });
    }

    function nextSection() {
      if (isPaused) return;
      const target = (currentSection + 1) % scatterData.length;
      goToSection(target);
    }

    function prevSection() {
      const target = (currentSection - 1 + scatterData.length) % scatterData.length;
      goToSection(target);
    }

    function resetTimer() {
      if (autoInterval) clearInterval(autoInterval);
      autoInterval = setInterval(nextSection, 4200);
    }

    // Build indicator pills
    if (indicatorsWrap) {
      indicatorsWrap.innerHTML = '';
      scatterData.forEach((item, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `scatter-pill ${idx === 0 ? 'active' : ''}`;
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-selected', String(idx === 0));
        btn.setAttribute('aria-label', `View ${item.category}`);
        btn.innerHTML = `<span class="pill-dot"></span><span class="pill-title">${item.category}</span>`;
        btn.addEventListener('click', () => {
          goToSection(idx);
          resetTimer();
        });
        indicatorsWrap.appendChild(btn);
      });
    }

    // Controls
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSection();
        resetTimer();
      });
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSection();
        resetTimer();
      });
    }

    // Hover pauses auto-play
    container.addEventListener('mouseenter', () => { isPaused = true; });
    container.addEventListener('mouseleave', () => { isPaused = false; });

    // Initial render
    activeCards = createCards(0);
    const initialData = scatterData[0];
    if (eyebrow) eyebrow.textContent = initialData.eyebrow;
    if (heading) heading.innerHTML = initialData.heading;
    if (desc) desc.textContent = initialData.description;
    gsap.set([eyebrow, heading, desc], { opacity: 1, y: 0 });

    // Resize handling
    let resizeDebounce;
    window.addEventListener('resize', () => {
      clearTimeout(resizeDebounce);
      resizeDebounce = setTimeout(() => {
        activeCards.forEach(({ element }) => {
          if (element.parentNode) element.remove();
        });
        activeCards = createCards(currentSection);
      }, 250);
    });

    // Auto-play timer
    resetTimer();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initImageScatter);
  } else {
    initImageScatter();
  }
})();
