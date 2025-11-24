// script.js
document.addEventListener("DOMContentLoaded", (event) => {
  const menuToggle = document.getElementById("menu-toggle");
  const closeMenu = document.getElementById("close-menu");
  const mobileMenu = document.getElementById("mobile-menu");
  const splineViewer = document.querySelector("spline-viewer");
  const mobileGif = document.getElementById("mobile-gif");

  function handleResize() {
    if (window.innerWidth < 768) {
      splineViewer.style.display = "none";
      mobileGif.style.display = "block";
      if (!mobileMenu.classList.contains("hidden")) {
        mobileMenu.classList.add("hidden");
        mobileMenu.classList.remove("flex");
      }
    } else {
      splineViewer.style.display = "block";
      mobileGif.style.display = "none";
      mobileMenu.classList.add("hidden");
      mobileMenu.classList.remove("flex");
    }
  }

  handleResize();
  window.addEventListener("resize", handleResize);

  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    mobileMenu.classList.toggle("hidden");
    mobileMenu.classList.toggle("flex");
  });

  closeMenu.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
    mobileMenu.classList.remove("flex");
  });

  document.addEventListener("click", (e) => {
    if (!mobileMenu.contains(e.target) && e.target !== menuToggle) {
      mobileMenu.classList.add("hidden");
      mobileMenu.classList.remove("flex");
    }
  });

  mobileMenu.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  const menuItems = mobileMenu.querySelectorAll("a");
  menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
      mobileMenu.classList.remove("flex");
    });
  });

  // Remove Spline viewer logo if present and observe for future injections
  function removeSplineLogo(node) {
    try {
      if (!node) return;
      // If it's an element reference, remove it; if selector, query and remove
      if (node instanceof Element) {
        node.remove();
        return;
      }
      const el = document.getElementById("logo") || document.querySelector('a[href*="spline.design"]');
      if (el) el.remove();
    } catch (e) {
      // Fallback: hide it if remove fails
      const el = document.getElementById("logo") || document.querySelector('a[href*="spline.design"]');
      if (el) {
        el.style.setProperty("display", "none", "important");
        el.style.visibility = "hidden";
        el.style.pointerEvents = "none";
      }
    }
  }

  // Initial attempt to remove any existing logo
  removeSplineLogo();

  // Observe DOM for injected logo elements and remove them when added
  const logoObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (!(node instanceof Element)) continue;
        if (node.id === "logo" || (node.matches && node.matches('a[href*="spline.design"]'))) {
          removeSplineLogo(node);
        } else {
          const found = node.querySelector && (node.querySelector('#logo') || node.querySelector('a[href*="spline.design"]'));
          if (found) removeSplineLogo(found);
        }
      }
    }
  });

  logoObserver.observe(document.body, { childList: true, subtree: true });

  // Stop observing after a short time to avoid long-running observers
  setTimeout(() => logoObserver.disconnect(), 8000);

  // Try to find and remove logo elements inside open Shadow DOMs
  function findAndRemoveInShadow(selector) {
    const results = [];
    function walk(node) {
      if (!node || !node.querySelector) return;
      try {
        const found = node.querySelectorAll(selector);
        found.forEach((el) => {
          results.push(el);
          try { el.remove(); } catch (e) { /* ignore */ }
        });
      } catch (e) {
        // some nodes (like svg) may throw on querySelectorAll for certain selectors
      }
      // recurse into children and their shadowRoots if present and open
      node.childNodes && node.childNodes.forEach((child) => {
        if (child.shadowRoot) walk(child.shadowRoot);
        walk(child);
      });
    }
    walk(document);
    return results;
  }

  // Attempt removal inside shadow roots (if the spline viewer uses open shadow DOM)
  findAndRemoveInShadow('#logo');
  findAndRemoveInShadow('a[href*="spline.design"]');

  // Fallback: place an overlay mask over the bottom-right area where the logo appears
  // This visually covers the logo even if it's inside a closed shadow root or iframe.
  (function createLogoMask() {
    const mask = document.createElement('div');
    mask.id = 'spline-logo-mask';
    Object.assign(mask.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '137px',
      height: '36px',
      borderRadius: '12px',
      background: 'linear-gradient(rgb(22, 24, 28) 0%, rgb(18, 19, 22) 100%)',
      boxShadow: 'rgb(6, 7, 9) 0px -2px 0px -1px inset, rgba(255, 255, 255, 0.04) 0px 1px 0px inset',
      zIndex: '2147483647',
      pointerEvents: 'auto'
    });

    // Prevent clicks from reaching the logo link underneath
    mask.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
    });

    // Only add once
    if (!document.getElementById('spline-logo-mask')) {
      document.body.appendChild(mask);
    }
  })();

  // ========== SCROLL ANIMATION FOR MASCOT (ENHANCED) ==========
  // Register GSAP ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // Set initial position for mascot (ensure it's ready for animation)
  gsap.set(".mascot", { y: 0, rotation: 0, opacity: 1 });

  // ===== HERO SECTION ANIMATION =====
  // Mascot moves down smoothly as user scrolls through hero section
  gsap.to(".mascot", {
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom center",
      scrub: 1.2, // Smooth scrubbing tied to scrollbar
      markers: false, // Set to true for debugging
    },
    y: 350,
    rotation: 15,
    scale: 1.05,
    ease: "none"
  });

  // ===== WHO WE ARE SECTION ANIMATION =====
  // Mascot continues moving and gains more rotation
  gsap.to(".mascot", {
    scrollTrigger: {
      trigger: "section:nth-of-type(1)",
      start: "top 80%",
      end: "center center",
      scrub: 1.2,
      markers: false,
    },
    y: 500,
    rotation: -10,
    scale: 1.1,
    ease: "none"
  });

  // ===== WHY PARTNER SECTION ANIMATION =====
  // Mascot continues its journey downward
  gsap.to(".mascot", {
    scrollTrigger: {
      trigger: "section:nth-of-type(2)",
      start: "top center",
      end: "bottom center",
      scrub: 1.2,
      markers: false,
    },
    y: 650,
    rotation: 5,
    scale: 1.15,
    ease: "none"
  });

  // Optional: Bounce effect when reaching bottom
  gsap.to(".mascot", {
    scrollTrigger: {
      trigger: "section:nth-of-type(2)",
      start: "bottom 20%",
      end: "bottom bottom",
      scrub: 1.2,
    },
    y: 700,
    rotation: -15,
    scale: 1.2,
    ease: "none"
  });

  // Refresh ScrollTrigger on resize for responsive behavior
  window.addEventListener("resize", () => {
    ScrollTrigger.getAll().forEach(trigger => trigger.refresh());
  });
});