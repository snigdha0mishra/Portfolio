// 3D Background Scene - Synthwave floating objects
let backgroundScene, backgroundCamera, backgroundRenderer;
let backgroundObjects = [];
let backgroundClock; // Use a Clock for smooth, frame-rate independent motion

// Synthwave color palette
const synthwaveColors = [
  0x00ffff, // neon cyan
  0xff0080, // neon pink
  0x8a2be2, // neon purple
  0x00d4ff, // neon blue
  0xffa500, // orange accent
  0xffffff, // white
];

function initBackgroundScene() {
  const container = document.getElementById('background-3d');
  const landingPage = document.querySelector('.landing-page');
  
  // Use window dimensions if landing page isn't ready yet
  let width = window.innerWidth;
  let height = window.innerHeight;
  
  if (landingPage && landingPage.offsetWidth > 0 && landingPage.offsetHeight > 0) {
    width = landingPage.offsetWidth;
    height = landingPage.offsetHeight;
  }
  
  // Prevent division by zero
  if (height === 0) height = window.innerHeight || 800;
  if (width === 0) width = window.innerWidth || 1200;
  
  backgroundScene = new THREE.Scene();
  backgroundCamera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  backgroundRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  backgroundRenderer.setSize(width, height);
  backgroundRenderer.setClearColor(0x000000, 0);
  container.innerHTML = '';
  container.appendChild(backgroundRenderer.domElement);
  
  // Use a Clock for smooth, frame-rate independent motion
  backgroundClock = new THREE.Clock();
  backgroundClock.start();
  
  createBackgroundObjects();
  backgroundCamera.position.set(0, 0, 10);
  animateBackground();
}

function createBackgroundObjects() {
  const objectTypes = [
    { geometry: new THREE.BoxGeometry(0.8, 0.8, 0.8) },
    { geometry: new THREE.SphereGeometry(0.5, 8, 8) },
    { geometry: new THREE.ConeGeometry(0.4, 1.2, 6) },
    { geometry: new THREE.CylinderGeometry(0.3, 0.3, 1, 8) },
    { geometry: new THREE.OctahedronGeometry(0.6) },
    { geometry: new THREE.TetrahedronGeometry(0.7) },
    { geometry: new THREE.DodecahedronGeometry(0.5) },
  ];

  // Create 40 floating objects with synthwave colors
  for (let i = 0; i < 40; i++) {
    const objType = objectTypes[Math.floor(Math.random() * objectTypes.length)];
    const color = synthwaveColors[Math.floor(Math.random() * synthwaveColors.length)];
    const material = new THREE.MeshBasicMaterial({ 
      color: color,
      transparent: true,
      opacity: 0.3 + Math.random() * 0.4,
      wireframe: Math.random() > 0.5,
    });
    
    const object = new THREE.Mesh(objType.geometry, material);
    object.position.set(
      (Math.random() - 0.5) * 60,
      (Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 30
    );

    object.userData = {
      rotationSpeed: {
        x: (Math.random() - 0.5) * 0.5, // radians per second
        y: (Math.random() - 0.5) * 0.5,
        z: (Math.random() - 0.5) * 0.3,
      },
      // SLOW floatSpeed: cycles per second (0.02–0.08)
      floatSpeed: 0.02 + Math.random() * 0.06,
      phaseSeed: Math.random() * Math.PI * 2,
      originalPosition: object.position.clone(),
      amplitude: 3 + Math.random() * 4,
      amplitude2: 0.5 + Math.random() * 1.5,
      scale: 0.5 + Math.random() * 1.5,
    };

    object.scale.setScalar(object.userData.scale);
    backgroundScene.add(object);
    backgroundObjects.push(object);
  }

  createGlowingParticles();
}

function createGlowingParticles() {
  const particleGeometry = new THREE.SphereGeometry(0.1, 6, 6);
  
  for (let i = 0; i < 20; i++) {
    const color = synthwaveColors[Math.floor(Math.random() * synthwaveColors.length)];
    const material = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.8,
    });

    const particle = new THREE.Mesh(particleGeometry, material);
    particle.position.set(
      (Math.random() - 0.5) * 80,
      (Math.random() - 0.5) * 50,
      (Math.random() - 0.5) * 40
    );

    particle.userData = {
      rotationSpeed: {
        x: (Math.random() - 0.5) * 1.0,
        y: (Math.random() - 0.5) * 1.0,
        z: (Math.random() - 0.5) * 1.0,
      },
      floatSpeed: 0.03 + Math.random() * 0.07, // SLOW cycles per second
      phaseSeed: Math.random() * Math.PI * 2,
      originalPosition: particle.position.clone(),
      amplitude: 2 + Math.random() * 3,
      pulseSpeed: 0.5 + Math.random() * 1.5,
    };

    backgroundScene.add(particle);
    backgroundObjects.push(particle);
  }
}

function animateBackground() {
  requestAnimationFrame(animateBackground);

  // Only render if the container is visible
  const container = document.getElementById('background-3d');
  const landingPage = document.querySelector('.landing-page');
  
  if (!container || !backgroundRenderer || !backgroundScene) return;
  
  // Check if landing page is visible
  if (landingPage && landingPage.style.display === 'none') {
    return; // Skip rendering when landing page is hidden
  }

  // Use the clock if available for smooth, frame-rate independent motion
  const delta = backgroundClock ? backgroundClock.getDelta() : 0.016;
  const time = backgroundClock ? backgroundClock.getElapsedTime() : Date.now() * 0.001;

  backgroundObjects.forEach((object, index) => {
    if (!object.userData) return; // Safety check
    
    // Make rotation frame-rate independent
    object.rotation.x += object.userData.rotationSpeed.x * delta;
    object.rotation.y += object.userData.rotationSpeed.y * delta;
    object.rotation.z += object.userData.rotationSpeed.z * delta;

    // Use seeded phase (not an integer index) and combine multiple sinusoids for smooth, organic motion
    // floatSpeed is now cycles per second, so multiply by 2π
    const fs = object.userData.floatSpeed || 0.03;
    const phase = object.userData.phaseSeed || index * 0.13;
    const omega = 2 * Math.PI * fs;

    object.position.y =
      object.userData.originalPosition.y +
      Math.sin(time * omega + phase) * object.userData.amplitude +
      Math.sin(time * (omega * 0.6) + phase * 1.3) * (object.userData.amplitude2 || 0.5);

    object.position.x =
      object.userData.originalPosition.x +
      Math.cos(time * (omega * 0.8) + phase * 1.7) * (object.userData.amplitude * 0.5) +
      Math.sin(time * (omega * 1.2) + phase * 0.9) * (object.userData.amplitude2 || 0.3);

    if (object.userData.pulseSpeed) {
      object.material.opacity =
        0.5 + Math.sin(time * object.userData.pulseSpeed + phase) * 0.3;
    }
  });

  backgroundCamera.position.x = Math.sin(time * 0.08) * 3;
  backgroundCamera.position.y = Math.cos(time * 0.12) * 2;
  backgroundCamera.position.z = 10 + Math.sin(time * 0.05) * 2;
  backgroundCamera.lookAt(0, 0, 0);

  backgroundRenderer.render(backgroundScene, backgroundCamera);
}

function handleBackgroundResize() {
  const landingPage = document.querySelector('.landing-page');
  if (!backgroundRenderer || !backgroundCamera) return;
  
  // If landing page is hidden, use window dimensions
  let width = window.innerWidth;
  let height = window.innerHeight;
  
  if (landingPage && landingPage.offsetWidth > 0 && landingPage.offsetHeight > 0) {
    width = landingPage.offsetWidth;
    height = landingPage.offsetHeight;
  }
  
  // Prevent division by zero
  if (height === 0) height = window.innerHeight || 800;
  if (width === 0) width = window.innerWidth || 1200;
  
  backgroundCamera.aspect = width / height;
  backgroundCamera.updateProjectionMatrix();
  backgroundRenderer.setSize(width, height);
}

