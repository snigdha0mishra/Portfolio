// Loading Screen Functions
let loadingTimedOut = false;
let loadingTimeout = setTimeout(() => {
  loadingTimedOut = true;
  const errorDiv = document.getElementById("loading-error");
  if (errorDiv) errorDiv.style.display = "flex";
}, 10000); // 10 seconds

function initLoadingAnimation() {
  const loadingProgress = document.querySelector(".loading-progress");
  let progress = 0;
  const animate = () => {
    if (loadingTimedOut) return;
    progress += Math.random() * 3;
    if (progress > 100) progress = 100;
    if (loadingProgress) loadingProgress.style.width = progress + "%";
    if (progress < 100) {
      setTimeout(animate, 100);
    } else {
      clearTimeout(loadingTimeout);
      setTimeout(() => {
        const loading = document.getElementById("loading");
        if (loading) loading.style.display = "none";
        // Enable scrolling after loading is complete
        enableScrolling();
      }, 500);
    }
  };
  animate();
}

function enableScrolling() {
  // Use !important to override any CSS rules
  document.body.style.setProperty('overflow-y', 'auto', 'important');
  document.body.style.setProperty('height', 'auto', 'important');
  document.body.style.setProperty('overflow-x', 'hidden', 'important');
  document.documentElement.style.setProperty('overflow', 'auto', 'important');
  document.documentElement.style.setProperty('height', 'auto', 'important');
}

// Make enableScrolling available globally
window.enableScrolling = enableScrolling;

