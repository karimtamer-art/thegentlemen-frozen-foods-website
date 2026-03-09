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