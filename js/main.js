// Main Initialization Script
function addSynthwaveScrollEffects() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'synthwaveSlideIn 0.8s ease-out forwards';
        if (entry.target.classList.contains('neon-card')) {
          entry.target.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.3)';
        }
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll(
    '.neon-card, .timeline-item, .project-card, .info-card'
  );
  animatedElements.forEach(el => observer.observe(el));
}

// Add synthwave slide-in animation styles
const synthwaveStyles = document.createElement('style');
synthwaveStyles.textContent = `
  @keyframes synthwaveSlideIn {
    from {
      opacity: 0;
      transform: translateY(30px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  @keyframes completionPopup {
    from {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.5);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
`;
document.head.appendChild(synthwaveStyles);

// Window Resize Handler
function handleResize() {
  // Reserved for future resize handlers if needed
}

// Scroll to Explore Feature
let scrollingEnabled = false;
let hasScrolledToContent = false;
let scrollHandler = null;
let lastScrollTop = 0;

function initScrollToExplore() {
  // Only initialize if scrolling is enabled (after loading)
  if (!scrollingEnabled) return;

  const exploreButton = document.getElementById('explore-button');
  const landing = document.getElementById('landing');

  // Click handler for explore button
  if (exploreButton && !exploreButton.hasAttribute('data-handler-added')) {
    exploreButton.setAttribute('data-handler-added', 'true');
    exploreButton.addEventListener('click', () => {
      if (!hasScrolledToContent && typeof scrollToContent === 'function') {
        hasScrolledToContent = true;
        scrollToContent();
      }
    });
  }

  // Scroll detection - show complete profile when user scrolls down
  // Also manage explore button visibility based on scroll position
  if (!scrollHandler) {
    scrollHandler = () => {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const landing = document.getElementById('landing');
      const exploreButton = document.getElementById('explore-button');
      const landingHeight = landing && landing.offsetHeight ? landing.offsetHeight : 0;
      
      // Button is now part of landing page flow, so it scrolls naturally
      // No need to show/hide based on scroll position
      
      // Once content is shown, let normal scrolling happen - don't interfere
      if (hasScrolledToContent) {
        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
        return;
      }
      
      if (!scrollingEnabled) return;
      
      // Only trigger if we're still on the landing page and scrolling down
      if (landing && landing.style.display !== 'none' && currentScrollTop > landingHeight * 0.5 && currentScrollTop > lastScrollTop) {
        if (typeof scrollToContent === 'function') {
          hasScrolledToContent = true;
          scrollToContent();
          // After showing content, scrolling continues normally - don't prevent it
        }
      }
      
      lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    };
    
    window.addEventListener('scroll', scrollHandler, false);
  }
}

// Function to reset scroll state (for navigation back to home)
window.resetScrollState = function() {
  hasScrolledToContent = false;
  lastScrollTop = 0;
};

// Monitor when scrolling becomes enabled - always enable scrolling after loading
const originalEnableScrolling = window.enableScrolling;
window.enableScrolling = function() {
  if (originalEnableScrolling) originalEnableScrolling();
  scrollingEnabled = true;
  // Initialize scroll to explore feature
  initScrollToExplore();
};

// Initialize Everything
document.addEventListener('DOMContentLoaded', function() {
  initLoadingAnimation();
  addSynthwaveScrollEffects();
  
  // Initialize 3D background after a brief delay to ensure Three.js is loaded
  setTimeout(() => {
    if (typeof initBackgroundScene === 'function') {
      initBackgroundScene();
    }
  }, 100);
  
  // Add click outside modal to close
  const modal = document.getElementById('modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target.id === 'modal') {
        closeModal();
      }
    });
  }
  
  // Add resize listener
  window.addEventListener('resize', () => {
    handleResize();
    if (typeof handleBackgroundResize === 'function') {
      handleBackgroundResize();
    }
  });
  
  console.log('ENHANCED SYNTHWAVE PORTFOLIO INITIALIZED');
});

