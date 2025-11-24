// Enhanced script with proper mobile animation support
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const closeMenu = document.getElementById("close-menu");
  const mobileMenu = document.getElementById("mobile-menu");
  const splineViewer = document.querySelector("spline-viewer");
  const mobileGif = document.getElementById("mobile-gif");

  // === RESPONSIVE HANDLING ===
  function handleResize() {
    if (window.innerWidth < 768) {
      if (splineViewer) splineViewer.style.display = "none";
      if (mobileGif) mobileGif.style.display = "block";
      if (!mobileMenu.classList.contains("hidden")) {
        mobileMenu.classList.add("hidden");
        mobileMenu.classList.remove("flex");
      }
    } else {
      if (splineViewer) splineViewer.style.display = "block";
      if (mobileGif) mobileGif.style.display = "none";
      mobileMenu.classList.add("hidden");
      mobileMenu.classList.remove("flex");
    }
    ScrollTrigger.getAll().forEach(trigger => trigger.refresh());
  }
  handleResize();
  window.addEventListener("resize", handleResize);

  // === MOBILE MENU ===
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

  // === MASCOT SCROLL ANIMATION - Works on both desktop & mobile ===
  gsap.set(".mascot", { y: 0, rotation: 0, opacity: 1 });

  // Hero section animation
  gsap.to(".mascot", {
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom center",
      scrub: 1.2,
      markers: false,
    },
    y: 350,
    rotation: 15,
    scale: 1.05,
    ease: "none"
  });

  // Who We Are section animation
  gsap.to(".mascot", {
    scrollTrigger: {
      trigger: "section:nth-of-type(2)",
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

  // Why Partner section animation
  gsap.to(".mascot", {
    scrollTrigger: {
      trigger: "section:nth-of-type(3)",
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

  // Bounce effect when reaching bottom
  gsap.to(".mascot", {
    scrollTrigger: {
      trigger: "section:nth-of-type(3)",
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
