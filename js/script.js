// Remove no-trans after initial paint so transitions work normally on interaction
requestAnimationFrame(() => requestAnimationFrame(() =>
  document.documentElement.classList.remove('no-trans')
));

// =========================
// Header scroll state
// Contact page always stays "scrolled" (dark hero); all others toggle at 40px
// =========================
(function () {
  var header = document.getElementById('site-header');
  if (!header) return;

  var isContactPage = document.body.id === 'page-contact';

  function updateHeader() {
    if (isContactPage) {
      header.classList.add('scrolled');
    } else {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
}());

// =========================
// Mobile nav toggle
// =========================
(function () {
  var hamburger = document.getElementById('hamburger');
  var mobileNav = document.getElementById('mobile-nav');
  var backdrop  = document.getElementById('nav-backdrop');

  if (!hamburger || !mobileNav) return;

  function closeNav() {
    mobileNav.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    var isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  if (backdrop) backdrop.addEventListener('click', closeNav);

  mobileNav.querySelectorAll('.mobile-nav-list a').forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });
}());

// =========================
// IntersectionObserver — reveal animations (.reveal, .reveal-left, .reveal-right)
// =========================
(function () {
  var revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!revealEls.length) return;

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        el.classList.add('visible');
      } else {
        observer.observe(el);
      }
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }
}());

// =========================
// Stats counter animation
// Supports two patterns:
//   about.html  — textContent holds the value e.g. "10+"
//   export.html — data-target + data-suffix attributes
// =========================
(function () {
  var statNums = document.querySelectorAll('.stat-num:not(.stat-static)');
  if (!statNums.length) return;

  var counterIo = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var target, suffix;

      if (el.dataset.target !== undefined && el.dataset.target !== '') {
        target = parseInt(el.dataset.target, 10);
        suffix = el.dataset.suffix || '';
      } else {
        var raw = el.textContent.trim();
        target = parseFloat(raw);
        suffix = raw.replace(String(target), '');
      }

      if (isNaN(target)) { counterIo.unobserve(el); return; }

      var steps = 60;
      var increment = target / steps;
      var current = 0;
      var count = 0;

      el.textContent = '0' + suffix;

      var tick = function () {
        count++;
        current = count >= steps ? target : current + increment;
        el.textContent = (Number.isInteger(target)
          ? Math.round(current)
          : current.toFixed(1)) + suffix;
        if (count < steps) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      counterIo.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNums.forEach(function (el) { counterIo.observe(el); });
}());

// =========================
// Custom select dropdown — Purpose of Inquiry
// =========================
(function () {
  var dropdown = document.getElementById('inquiry-dropdown');
  if (!dropdown) return;

  var trigger  = dropdown.querySelector('.custom-select__trigger');
  var valueEl  = dropdown.querySelector('.custom-select__value');
  var options  = dropdown.querySelectorAll('.custom-select__option');
  var hidden   = document.getElementById('inquiry');

  function openDropdown() {
    dropdown.setAttribute('aria-expanded', 'true');
  }

  function closeDropdown() {
    dropdown.setAttribute('aria-expanded', 'false');
  }

  trigger.addEventListener('click', function () {
    var isOpen = dropdown.getAttribute('aria-expanded') === 'true';
    isOpen ? closeDropdown() : openDropdown();
  });

  options.forEach(function (opt) {
    opt.addEventListener('click', function () {
      var val   = opt.dataset.value;
      var label = opt.querySelector('strong').textContent;

      hidden.value = val;
      valueEl.textContent = label;
      trigger.classList.add('has-value');

      options.forEach(function (o) { o.classList.remove('selected'); });
      opt.classList.add('selected');

      closeDropdown();
    });
  });

  document.addEventListener('click', function (e) {
    if (!dropdown.contains(e.target)) closeDropdown();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDropdown();
  });
}());

// =========================
// Web3Forms — contact form submission
// =========================
(function () {
  var contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    var btn = contactForm.querySelector('.btn-submit');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    var data = new FormData(contactForm);
    try {
      var res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data
      });
      var json = await res.json();
      if (json.success) {
        btn.textContent = 'Message Sent!';
        contactForm.reset();
      } else {
        throw new Error(json.message);
      }
    } catch (err) {
      console.error('Web3Forms error:', err);
      btn.textContent = 'Failed — try again';
      btn.disabled = false;
    }
  });
}());

// =========================
// Nav Slider — sliding pill highlight (desktop only)
// =========================
(function () {
  var navbarUl = document.querySelector('.navbar ul');
  if (!navbarUl) return;

  var slider = document.createElement('li');
  slider.className = 'nav-slider';
  slider.setAttribute('aria-hidden', 'true');
  navbarUl.appendChild(slider);

  var navItems = Array.from(navbarUl.querySelectorAll('li:not(.nav-slider)'));
  var activeLink = navbarUl.querySelector('a.active');
  var activeLi = activeLink ? activeLink.parentElement : navItems[0];

  function moveSlider(li) {
    slider.style.left    = li.offsetLeft + 'px';
    slider.style.top     = li.offsetTop  + 'px';
    slider.style.width   = li.offsetWidth  + 'px';
    slider.style.height  = li.offsetHeight + 'px';
    slider.style.opacity = '1';
  }

  if (activeLi) {
    requestAnimationFrame(function () { moveSlider(activeLi); });
  }

  navItems.forEach(function (li) {
    li.addEventListener('mouseenter', function () { moveSlider(li); });
  });

  navbarUl.addEventListener('mouseleave', function () {
    if (activeLi) moveSlider(activeLi);
  });

  window.addEventListener('resize', function () {
    if (activeLi) requestAnimationFrame(function () { moveSlider(activeLi); });
  });
}());
