import './style.css'

document.addEventListener('DOMContentLoaded', () => {

  // --- 0. Initialize Lenis (Smooth Scroll) ---
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    smooth: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = this.getAttribute('href');
      lenis.scrollTo(target);
    });
  });


  // --- 1. Dynamic Scroll Progress Bar ---
  const bar = document.querySelector('.scroll-progress-bar');
  if (bar) {
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      bar.style.width = scrolled + "%";
    });
  }


  // --- 2. Mouse Follower Effect ---
  if (window.matchMedia("(min-width: 900px)").matches) {
    const blob = document.createElement('div');
    blob.className = 'mouse-blob';
    document.body.appendChild(blob);

    window.addEventListener('pointermove', (e) => {
      const { clientX, clientY } = e;
      blob.animate({
        left: `${clientX}px`,
        top: `${clientY}px`
      }, { duration: 1500, fill: "forwards" });
    });
  }


  // --- 3. Reveal on Scroll ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));


  // --- 4. 3D Tilt Effect for Bento Cards ---
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5; // Subtle tilt
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  });


  // --- 5. Typing Effect ---
  const typedTextSpan = document.querySelector('.typed');
  if (typedTextSpan) {
    const textOptions = ["a Web Developer", "a Designer", "an Automation Expert"];
    let typeIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeDelay = 100;

    function type() {
      const currentText = textOptions[typeIndex];

      if (isDeleting) {
        typedTextSpan.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typeDelay = 50;
      } else {
        typedTextSpan.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typeDelay = 100;
      }

      if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        typeDelay = 2000;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        typeIndex = (typeIndex + 1) % textOptions.length;
        typeDelay = 500;
      }

      setTimeout(type, typeDelay);
    }

    typedTextSpan.textContent = '';
    setTimeout(type, 1000);
  }

  // --- 6. Contact Form Handling ---
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('.btn-submit');
      const originalBtnText = submitBtn.textContent;

      // Update button state
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());

      try {
        const response = await fetch('http://localhost:5678/webhook-test/ab180cc7-8a54-493a-988e-4e78c823802d', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          alert(`Thanks for reaching out, ${data.name}! Your message has been sent successfully.`);
          contactForm.reset();
        } else {
          throw new Error('Failed to send message');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Oops! Something went wrong. Please try again later or contact me directly via email.');
      } finally {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  }

});
