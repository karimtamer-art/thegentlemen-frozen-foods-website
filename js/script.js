// Remove no-trans after initial paint so transitions work normally on interaction
requestAnimationFrame(() => requestAnimationFrame(() =>
  document.documentElement.classList.remove('no-trans')
));

    function animateCounter(id, target) {
      let count = 0;
      const increment = Math.ceil(target / 100);
      const timer = setInterval(() => {
        count += increment;
        if (count >= target) {
          count = target;
          clearInterval(timer);
        }
        const element = document.getElementById(id);
        if (element) {
          element.innerText = count;
        }
      }, 30);
    }

    // Mobile menu toggle functionality
    const mobileMenu = document.querySelector('.mobile-menu');
    const navbarUl = document.querySelector('.navbar ul');

    if (mobileMenu && navbarUl) {
      mobileMenu.addEventListener('click', () => {
        navbarUl.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.querySelector('.navbar').classList.toggle('active'); // toggle overlay

        // Change hamburger icon to close icon when active
        const icon = mobileMenu.querySelector('i');
        if (icon) {
          if (navbarUl.classList.contains('active')) {
            icon.className = 'fas fa-times';
          } else {
            icon.className = 'fas fa-bars';
          }
        }
      });

      // Close menu when clicking outside the menu (overlay)
      document.querySelector('.navbar').addEventListener('click', (e) => {
        if (e.target === document.querySelector('.navbar.active')) {
          navbarUl.classList.remove('active');
          mobileMenu.classList.remove('active');
          document.querySelector('.navbar').classList.remove('active');
          const icon = mobileMenu.querySelector('i');
          if (icon) {
            icon.className = 'fas fa-bars';
          }
        }
      });
    }

    window.addEventListener('load', () => {
      animateCounter('countries', 3);
      animateCounter('years', 5);
      animateCounter('clients', 3);
    });



  //   function createSnowflake() {
  //   const snowflake = document.createElement("div");
  //   snowflake.classList.add("snowflake");
  //   snowflake.textContent = "❄";

  //   // Random horizontal start
  //   snowflake.style.left = Math.random() * window.innerWidth + "px";

  //   // Random size
  //   snowflake.style.fontSize = Math.random() * 10 + 10 + "px";

  //   // Random drift
  //   snowflake.style.setProperty("--drift", Math.random() * 100 - 50 + "px");

  //   // Random duration
  //   snowflake.style.animationDuration = Math.random() * 5 + 5 + "s";

  //   document.querySelector(".hero").appendChild(snowflake);

  //   // Remove after animation
  //   setTimeout(() => {
  //     snowflake.remove();
  //   }, 10000);
  // }

  // setInterval(createSnowflake, 200); // every 200ms a new flake

// =========================
// Nav Slider — SlideTabs sliding pill (desktop only)
// Mirrors the React SlideTabs component: pill follows hover, snaps back to
// the active page link on mouse-leave.
// =========================
(function () {
  var navbarUl = document.querySelector('.navbar ul');
  if (!navbarUl) return;

  // Inject the pill element (CSS keeps it display:none on mobile)
  var slider = document.createElement('li');
  slider.className = 'nav-slider';
  slider.setAttribute('aria-hidden', 'true');
  navbarUl.appendChild(slider);

  // All real nav items (excludes the slider itself)
  var navItems = Array.from(navbarUl.querySelectorAll('li:not(.nav-slider)'));

  // Find the active link and its parent <li>
  var activeLink = navbarUl.querySelector('a.active');
  var activeLi = activeLink ? activeLink.parentElement : navItems[0];

  // Position the pill over a given <li>
  function moveSlider(li) {
    slider.style.left   = li.offsetLeft + 'px';
    slider.style.top    = li.offsetTop  + 'px';
    slider.style.width  = li.offsetWidth  + 'px';
    slider.style.height = li.offsetHeight + 'px';
    slider.style.opacity = '1';
  }

  // Place pill on the active link once layout is ready
  if (activeLi) {
    requestAnimationFrame(function () { moveSlider(activeLi); });
  }

  // Follow the mouse across nav items
  navItems.forEach(function (li) {
    li.addEventListener('mouseenter', function () { moveSlider(li); });
  });

  // Snap back to the active link when the mouse leaves the nav
  navbarUl.addEventListener('mouseleave', function () {
    if (activeLi) moveSlider(activeLi);
  });

  // Keep pill aligned after window resize
  window.addEventListener('resize', function () {
    if (activeLi) requestAnimationFrame(function () { moveSlider(activeLi); });
  });
}());