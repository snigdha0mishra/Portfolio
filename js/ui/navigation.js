// Navigation Functions
function showCareerPage(career) {
  const landing = document.getElementById("landing");
  const softwarePage = document.getElementById("software-page");
  const dataPage = document.getElementById("data-science-page");
  const completePage = document.getElementById("complete-page");

  landing.style.display = "none";
  if (completePage) completePage.classList.remove("active");

  if (career === "software") {
    softwarePage.classList.add("active");
    dataPage.classList.remove("active");
  } else {
    dataPage.classList.add("active");
    softwarePage.classList.remove("active");
  }
  window.scrollTo(0, 0);
  addPageTransitionEffect();
}

function goToHome() {
  const landing = document.getElementById("landing");
  const softwarePage = document.getElementById("software-page");
  const dataPage = document.getElementById("data-science-page");
  const completePage = document.getElementById("complete-page");

  // Simply show landing and hide career pages - don't manipulate scrolling
  landing.style.display = "flex";
  softwarePage.classList.remove("active");
  dataPage.classList.remove("active");
  
  // Hide complete page but keep it in document flow for scrolling
  if (completePage) {
    completePage.classList.remove("active");
  }

  // Reset scroll state so user can scroll to complete profile again
  if (typeof window.resetScrollState === 'function') {
    window.resetScrollState();
  }

  // Ensure scrolling is enabled
  if (typeof window.enableScrolling === 'function') {
    window.enableScrolling();
  }

  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });
  addPageTransitionEffect();
}

function scrollToContent() {
  const completePage = document.getElementById("complete-page");
  const landing = document.getElementById("landing");
  const softwarePage = document.getElementById("software-page");
  const dataPage = document.getElementById("data-science-page");
  const exploreButton = document.getElementById("explore-button");

  // Don't hide landing - keep it visible so user can scroll back up to it
  // Just ensure complete page is active/visible
  softwarePage.classList.remove("active");
  dataPage.classList.remove("active");
  if (completePage) completePage.classList.add("active");

  // Reset any styles that might have been applied to landing
  landing.style.visibility = "";
  landing.style.opacity = "";
  landing.style.pointerEvents = "";
  landing.style.height = "";
  landing.style.display = "";

  // Button is now part of landing page flow, so it scrolls with the page
  // No need to hide it manually

  // Ensure scrolling is enabled and continues to work in both directions
  if (typeof window.enableScrolling === 'function') {
    window.enableScrolling();
  }

  // Force enable scrolling with !important
  document.body.style.setProperty('overflow-y', 'auto', 'important');
  document.body.style.setProperty('overflow-x', 'hidden', 'important');
  document.documentElement.style.setProperty('overflow', 'auto', 'important');

  // Don't manipulate scroll position - let it flow naturally
  // User should be able to scroll up and down freely between landing and complete profile
  addPageTransitionEffect();
}

function addPageTransitionEffect() {
  const transitionEl = document.createElement("div");
  transitionEl.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #00ffff, #ff0080);
    opacity: 0.1;
    z-index: 9998;
    pointer-events: none;
    animation: pageTransition 0.5s ease-out;
  `;

  const style = document.createElement("style");
  style.textContent = `
    @keyframes pageTransition {
      0% { opacity: 0.3; transform: scale(1.1); }
      100% { opacity: 0; transform: scale(1); }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(transitionEl);

  setTimeout(() => {
    document.body.removeChild(transitionEl);
    document.head.removeChild(style);
  }, 500);
}

// Make functions global for HTML onclick handlers
window.showCareerPage = showCareerPage;
window.scrollToContent = scrollToContent;
window.goToHome = goToHome;

