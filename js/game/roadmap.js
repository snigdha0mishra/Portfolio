// Enhanced 3D Roadmap Variables
let roadmapScene, roadmapCamera, roadmapRenderer;
let vehicle,
  vehicleBody,
  vehicleWheels = [];
let roadmapControls = {};
let experienceTexts = [];
let obstacles = [];
let threeDTexts = [];
let objectiveTexts = []; // For floating objectives in 3D world
let ramps = []; // For jump ramps
let platforms = []; // For elevated platforms
let progressCount = 0;
let roadmapActive = false;
let mouseX = 0,
  mouseY = 0;
let cameraTarget = new THREE.Vector3();
let gameCompleted = false;
let playAreaSize = 80; // Increased from 40 to 80 for larger map
let lives = 3;
let timer = 90; // Increased timer for larger map
let timerInterval = null;
let isPaused = false;
let hills = []; // Array to store hill objects

// Vehicle physics
let vehicleVelocity = { x: 0, y: 0, z: 0 };
let isJumping = false;
let onGround = true;

// Background 3D scene variables (handled in graphics/background3d.js)

// Experience stack variables
let collectedExperiences = [];
let currentExperienceIndex = 0;

// Career milestones are imported from resumeData.js
// Use careerMilestones if available, otherwise create fallback
let gameMilestones;
if (typeof careerMilestones !== 'undefined' && careerMilestones.length > 0) {
  gameMilestones = careerMilestones;
} else {
  // Fallback milestones (should not be needed if resumeData.js loads correctly)
  gameMilestones = [
  {
    text: "STARTED CODING",
    position: [0, 1, 0],
    collected: false,
    details: "First lines of code written in Python and JavaScript",
    type: "Education",
  },
  {
    text: "FIRST PROJECT",
    position: [5, 1, -5],
    collected: false,
    details: "Built a simple calculator app using HTML/CSS/JavaScript",
    type: "Project",
  },
  {
    text: "UTD STUDENT",
    position: [10, 1, -3],
    collected: false,
    details: "Enrolled at University of Texas at Dallas - Computer Science",
    type: "Education",
  },
  {
    text: "FREELANCE DEV",
    position: [-5, 1, -8],
    collected: false,
    details: "Started freelancing as Full-Stack Software Engineer",
    type: "Work",
  },
  {
    text: "TEACHING ROLE",
    position: [8, 1, -12],
    collected: false,
    details: "Became Course Instructor at iCode West Frisco",
    type: "Work",
  },
  {
    text: "DATA SCIENCE",
    position: [-3, 1, -15],
    collected: false,
    details: "Started specializing in Data Science and Machine Learning",
    type: "Interest",
  },
  {
    text: "AI PROJECTS",
    position: [12, 1, -18],
    collected: false,
    details: "Developed AI-powered applications including Pocket Closet",
    type: "Project",
  },
  {
    text: "HEALTHCARE ML",
    position: [2, 1, -22],
    collected: false,
    details: "Worked as Healthcare Data Scientist at TruBridge",
    type: "Work",
  },
  {
    text: "MOBILE APPS",
    position: [-8, 1, -25],
    collected: false,
    details: "Developed cross-platform mobile applications with Flutter",
    type: "Project",
  },
  {
    text: "FULL STACK",
    position: [6, 1, -28],
    collected: false,
    details: "Mastered full-stack development with React.js and Node.js",
    type: "Skill",
  },
  {
    text: "CURRENT DAY",
    position: [0, 1, -32],
    collected: false,
    details: "Continuing to grow and learn new technologies",
    type: "Current",
  },
  {
    text: "FUTURE GOALS",
    position: [0, 1, -40],
    collected: false,
    details: "Aspiring to lead innovative tech projects and mentor others",
    type: "Future",
  },
  ];
}

// Navigation, Modal, and Experience Stack functions are in separate modules
// They are loaded before this file, so we reference them from window scope

// Vehicle Choice Modal Functions
function showVehicleChoice() {
  document.getElementById("vehicle-modal").style.display = "block";
}

function closeVehicleModal() {
  document.getElementById("vehicle-modal").style.display = "none";
}

function startGameFromVehicle() {
  closeVehicleModal();
  startRoadmap();
}

// 3D Background Scene functions are in graphics/background3d.js

// Enhanced 3D Roadmap Functions
function startRoadmap() {
  const roadmapSection = document.getElementById('roadmap-section');
  roadmapSection.classList.add('active');
  roadmapActive = true;
  gameCompleted = false;
  lives = 3;
  timer = 90; // Increased timer for larger map
  isPaused = false;
  progressCount = 0;

  // Reset vehicle physics
  vehicleVelocity = { x: 0, y: 0, z: 0 };
  isJumping = false;
  onGround = true;

  updateRoadmapUI();

  if (!roadmapScene) {
    initRoadmap();
  } else {
    // Clear and recreate objects for new game
    clearRoadmapObjects();
    createExperienceTexts();
    createObstacles();
    create3DTexts();
    create3DObjectiveTexts();
    createRamps();
    createPlatforms();
    createHills();

    // Reset vehicle position
    if (vehicle) {
      vehicle.position.set(0, 0.5, 5);
      vehicle.rotation.set(0, 0, 0);
    }
  }
  animateRoadmap();
  setupRoadmapControls();
  setupMouseControls();

  // Start timer
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!roadmapActive || isPaused) return;
    timer--;
    updateRoadmapUI();
    if (timer <= 0) {
      endRoadmapGame(false, "Time is up!");
    }
  }, 1000);
}

function exitRoadmap() {
  const roadmapSection = document.getElementById('roadmap-section');
  roadmapSection.classList.remove('active');
  roadmapActive = false;
  isPaused = false;

  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  // Reset game state
  progressCount = 0;
  const milestonesToReset = (typeof careerMilestones !== 'undefined' && careerMilestones.length > 0) ? careerMilestones : gameMilestones;
  milestonesToReset.forEach((milestone) => {
    milestone.collected = false;
  });

  // Reset UI
  updateRoadmapUI();

  // Reset vehicle position
  if (vehicle) {
    vehicle.position.set(0, 0.5, 5);
    vehicle.rotation.set(0, 0, 0);
  }

  // Clear and recreate objects
  clearRoadmapObjects();
  if (roadmapScene) {
    createExperienceTexts();
    createObstacles();
    create3DTexts();
  }
}

// Game flow management
function startGameFlow() {
  // Show objectives modal instead of immediately starting game
  showObjectivesModal();
}

function showObjectivesModal() {
  document.getElementById("objectives-modal").style.display = "block";
}

function closeObjectivesModal() {
  document.getElementById("objectives-modal").style.display = "none";
}

function startGameNow() {
  closeObjectivesModal();
  startRoadmap();
}

function create3DObjectiveTexts() {
  // Clear existing objective texts
  objectiveTexts.forEach((text) => roadmapScene.remove(text));
  objectiveTexts = [];

  const objectives = [
    {
      text: "FIND 12 EXPERIENCE CARDS",
      position: [0, 8, -10],
      color: 0x00ffff,
    },
    { text: "USE SPACE TO JUMP", position: [15, 6, -5], color: 0x00ff00 },
    { text: "AVOID OBSTACLES = -10s", position: [-15, 6, -5], color: 0xff0080 },
    { text: "DON'T FALL OFF!", position: [0, 5, 15], color: 0xff4444 },
    {
      text: "USE RAMPS TO REACH HIGH CARDS",
      position: [-10, 7, 10],
      color: 0x8a2be2,
    },
  ];

  objectives.forEach((objective, index) => {
    const textGroup = new THREE.Group();

    // Create text background
    const bgGeometry = new THREE.PlaneGeometry(8, 1.2);
    const bgMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.7,
    });
    const bg = new THREE.Mesh(bgGeometry, bgMaterial);
    textGroup.add(bg);

    // Create text border
    const borderGeometry = new THREE.PlaneGeometry(8.2, 1.4);
    const borderMaterial = new THREE.MeshBasicMaterial({
      color: objective.color,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
    });
    const border = new THREE.Mesh(borderGeometry, borderMaterial);
    border.position.z = -0.01;
    textGroup.add(border);

    // Position the text
    textGroup.position.set(
      objective.position[0],
      objective.position[1],
      objective.position[2]
    );
    textGroup.lookAt(roadmapCamera.position);
    textGroup.userData = {
      originalY: objective.position[1],
      floatOffset: index * 1.5,
      pulseSpeed: 0.02 + index * 0.01,
    };

    roadmapScene.add(textGroup);
    objectiveTexts.push(textGroup);
  });
}

function updateRoadmapUI() {
  const hud = document.getElementById("game-hud");
  const mainBtn = document.getElementById("main-game-btn");
  const controlsPanel = document.getElementById("game-controls-panel");

  if (roadmapActive) {
    hud.style.display = "flex";
    hud.innerHTML = `
                    <span>TIME: <b>${timer}s</b></span>
                    <span>LIVES: <b>${lives}</b></span>
                    <span>EXPERIENCES: <b>${progressCount}/12</b></span>
                `;
    // Switch to "Choose Your Vehicle" during game
    mainBtn.innerHTML = `
                    <span>Choose Your Vehicle</span>
                    <span style="font-size:1.5em;">🚗</span>
                `;
    mainBtn.onclick = showVehicleChoice;
    mainBtn.title = "Choose Your Vehicle";
    controlsPanel.style.display = "block";
  } else {
    hud.style.display = "none";
    // Switch back to "Play a Game?" when game ends
    mainBtn.innerHTML = `
                    <span>Play a Game?</span>
                    <span style="font-size:1.5em;">🎮</span>
                `;
    mainBtn.onclick = startGameFlow;
    mainBtn.title = "Play a Game?";
    controlsPanel.style.display = "none";
  }
}

function endRoadmapGame(win, reason) {
  roadmapActive = false;
  isPaused = false;
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  const msg = win
    ? "You collected all experiences! You win!"
    : `Game Over: ${reason}`;
  const endText = document.createElement("div");
  endText.style.cssText = `
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                background: linear-gradient(45deg, #1a0a2e, #16213e); color: #00ffff;
                padding: 30px; border: 3px solid #ff0080; border-radius: 15px;
                font-family: 'Orbitron', monospace; z-index: 10000; text-align: center;
                max-width: 400px; animation: completionPopup 2s ease-out forwards;`;
  endText.innerHTML = `<h2 style="color: #ff0080; margin-bottom: 15px;">${msg}</h2>`;
  document.body.appendChild(endText);

  setTimeout(() => {
    document.body.removeChild(endText);
    exitRoadmap();
  }, 3000);
}

function loseLife(reason) {
  lives--;
  updateRoadmapUI();
  if (lives <= 0) {
    endRoadmapGame(false, reason);
  }
}

function initRoadmap() {
  // Create scene
  roadmapScene = new THREE.Scene();
  roadmapScene.fog = new THREE.Fog(0x0a0a0f, 10, 100);

  // Create camera
  roadmapCamera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  // Create renderer
  roadmapRenderer = new THREE.WebGLRenderer({ antialias: true });
  roadmapRenderer.setSize(window.innerWidth, window.innerHeight);
  roadmapRenderer.setClearColor(0x0a0a0f);
  roadmapRenderer.shadowMap.enabled = true;
  roadmapRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

  document
    .getElementById("roadmap-container")
    .appendChild(roadmapRenderer.domElement);

  createPlayArea();
  createEnhancedVehicle();
  createExperienceTexts();
  createObstacles();
  create3DTexts();
  create3DObjectiveTexts();
  setupRoadmapLighting();

  // Reset vehicle physics
  vehicleVelocity = { x: 0, y: 0, z: 0 };
  isJumping = false;
  onGround = true;

  // Position camera behind vehicle
  roadmapCamera.position.set(0, 10, 15);
  roadmapCamera.lookAt(0, 0, 0);
}

function createPlayArea() {
  // Large free-range play area
  const areaGeometry = new THREE.PlaneGeometry(playAreaSize, playAreaSize);
  const areaMaterial = new THREE.MeshBasicMaterial({
    color: 0x1a0a2e,
    transparent: true,
    opacity: 0.8,
  });
  const area = new THREE.Mesh(areaGeometry, areaMaterial);
  area.rotation.x = -Math.PI / 2;
  area.position.y = 0;
  roadmapScene.add(area);

  // Add grid
  const gridHelper = new THREE.GridHelper(playAreaSize, 80, 0x00ffff, 0x00ffff);
  gridHelper.material.opacity = 0.2;
  gridHelper.material.transparent = true;
  roadmapScene.add(gridHelper);

  // Create hills scattered around the map
  createHills();

  // Create jump ramps
  createRamps();

  // Create elevated platforms
  createPlatforms();

  // Add some synthwave mountains and stars
  createWireframeMountains();
  createStarField();
}

function createRamps() {
  ramps.forEach((ramp) => roadmapScene.remove(ramp));
  ramps = [];

  const rampPositions = [
    { x: 20, z: 20, rotation: Math.PI / 4 },
    { x: -25, z: 15, rotation: -Math.PI / 6 },
    { x: 15, z: -30, rotation: Math.PI / 3 },
    { x: -20, z: -20, rotation: -Math.PI / 4 },
    { x: 30, z: -10, rotation: Math.PI / 2 },
    { x: -15, z: 25, rotation: 0 },
    { x: 10, z: 30, rotation: Math.PI / 6 },
  ];

  rampPositions.forEach((pos, index) => {
    // Create ramp geometry
    const rampGeometry = new THREE.BoxGeometry(8, 1, 4);
    const rampMaterial = new THREE.MeshBasicMaterial({
      color: 0x444488,
      transparent: true,
      opacity: 0.8,
    });

    const ramp = new THREE.Mesh(rampGeometry, rampMaterial);
    ramp.position.set(pos.x, 0.5, pos.z);
    ramp.rotation.y = pos.rotation;
    ramp.rotation.z = Math.PI / 12; // 15 degree incline

    // Add neon edges to ramps
    const edgesGeometry = new THREE.EdgesGeometry(rampGeometry);
    const edgesMaterial = new THREE.LineBasicMaterial({
      color: 0x00ffff,
      linewidth: 2,
    });
    const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    ramp.add(edges);

    ramp.userData = { isRamp: true };
    roadmapScene.add(ramp);
    ramps.push(ramp);
  });
}

function createPlatforms() {
  platforms.forEach((platform) => roadmapScene.remove(platform));
  platforms = [];

  const platformPositions = [
    { x: 25, z: 25, height: 4 },
    { x: -30, z: 20, height: 3 },
    { x: 20, z: -25, height: 5 },
    { x: -25, z: -30, height: 3.5 },
    { x: 35, z: -5, height: 4.5 },
    { x: -10, z: 35, height: 3 },
  ];

  platformPositions.forEach((pos, index) => {
    // Create platform
    const platformGeometry = new THREE.BoxGeometry(6, 0.5, 6);
    const platformMaterial = new THREE.MeshBasicMaterial({
      color: 0x2a2a6e,
      transparent: true,
      opacity: 0.9,
    });

    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.set(pos.x, pos.height, pos.z);

    // Add glowing edges
    const edgesGeometry = new THREE.EdgesGeometry(platformGeometry);
    const edgesMaterial = new THREE.LineBasicMaterial({
      color: 0xff0080,
      linewidth: 2,
    });
    const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    platform.add(edges);

    platform.userData = { isPlatform: true, height: pos.height };
    roadmapScene.add(platform);
    platforms.push(platform);
  });
}

function createHills() {
  hills.forEach((hill) => roadmapScene.remove(hill));
  hills = [];

  // Create various hill types
  const hillTypes = [
    { geometry: new THREE.ConeGeometry(3, 6, 8), color: 0x2a1a4e },
    { geometry: new THREE.SphereGeometry(4, 8, 8), color: 0x3a2a5e },
    { geometry: new THREE.CylinderGeometry(2, 4, 5, 8), color: 0x4a3a6e },
  ];

  // Place hills strategically around the map
  for (let i = 0; i < 25; i++) {
    const hillType = hillTypes[Math.floor(Math.random() * hillTypes.length)];
    const hill = new THREE.Mesh(
      hillType.geometry,
      new THREE.MeshBasicMaterial({
        color: hillType.color,
        transparent: true,
        opacity: 0.7,
        wireframe: Math.random() > 0.5,
      })
    );

    // Position hills away from spawn area (center)
    let x, z;
    do {
      x = (Math.random() - 0.5) * (playAreaSize - 10);
      z = (Math.random() - 0.5) * (playAreaSize - 10);
    } while (Math.abs(x) < 15 && Math.abs(z) < 15); // Keep away from spawn

    hill.position.set(x, hillType.geometry.parameters.height / 2 || 3, z);
    hill.userData = {
      rotationSpeed: (Math.random() - 0.5) * 0.005,
      originalY: hill.position.y,
    };

    roadmapScene.add(hill);
    hills.push(hill);
  }
}

function createWireframeMountains() {
  const mountainGeometry = new THREE.ConeGeometry(8, 15, 8);
  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0080,
    wireframe: true,
    transparent: true,
    opacity: 0.6,
  });

  // Left mountains
  for (let i = 0; i < 5; i++) {
    const mountain = new THREE.Mesh(mountainGeometry, wireframeMaterial);
    mountain.position.set(
      -20 - Math.random() * 10,
      7.5,
      -i * 15 - Math.random() * 10
    );
    mountain.scale.set(
      1 + Math.random(),
      0.8 + Math.random() * 0.4,
      1 + Math.random()
    );
    roadmapScene.add(mountain);
  }

  // Right mountains
  for (let i = 0; i < 5; i++) {
    const mountain = new THREE.Mesh(
      mountainGeometry,
      wireframeMaterial.clone()
    );
    mountain.material.color.setHex(0x8a2be2);
    mountain.position.set(
      20 + Math.random() * 10,
      7.5,
      -i * 15 - Math.random() * 10
    );
    mountain.scale.set(
      1 + Math.random(),
      0.8 + Math.random() * 0.4,
      1 + Math.random()
    );
    roadmapScene.add(mountain);
  }
}

function createStarField() {
  const starGeometry = new THREE.BufferGeometry();
  const starCount = 1000;
  const positions = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 200;
  }

  starGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  const starMaterial = new THREE.PointsMaterial({
    color: 0x00ffff,
    size: 0.5,
    transparent: true,
    opacity: 0.8,
  });

  const stars = new THREE.Points(starGeometry, starMaterial);
  stars.position.y = 30;
  roadmapScene.add(stars);
}

function createEnhancedVehicle() {
  vehicle = new THREE.Group();

  // Rotate the entire vehicle to face forward (towards camera)
  vehicle.rotation.y = Math.PI;

  // Main car body - lower and more aerodynamic like RX7/Miata
  const bodyGeometry = new THREE.BoxGeometry(1.8, 0.6, 4.2);
  const bodyMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0080, // Classic synthwave pink
    transparent: true,
    opacity: 0.9,
  });
  vehicleBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
  vehicleBody.position.y = 0.3;
  vehicle.add(vehicleBody);

  // Hood - sleek and low (now visible from front)
  const hoodGeometry = new THREE.BoxGeometry(1.6, 0.25, 1.8);
  const hoodMaterial = new THREE.MeshBasicMaterial({
    color: 0xe0006e,
    transparent: true,
    opacity: 0.9,
  });
  const hood = new THREE.Mesh(hoodGeometry, hoodMaterial);
  hood.position.set(0, 0.55, 1.4);
  vehicle.add(hood);

  // Classic sports car roof - lower profile
  const roofGeometry = new THREE.BoxGeometry(1.4, 0.4, 1.8);
  const roofMaterial = new THREE.MeshBasicMaterial({
    color: 0xc0005a,
    transparent: true,
    opacity: 0.8,
  });
  const roof = new THREE.Mesh(roofGeometry, roofMaterial);
  roof.position.set(0, 0.7, -0.2);
  vehicle.add(roof);

  // Windshield - more angled like classic sports cars
  const windshieldGeometry = new THREE.BoxGeometry(1.4, 0.6, 0.1);
  const windshieldMaterial = new THREE.MeshBasicMaterial({
    color: 0x444444,
    transparent: true,
    opacity: 0.4,
  });
  const windshield = new THREE.Mesh(windshieldGeometry, windshieldMaterial);
  windshield.position.set(0, 0.65, 0.8);
  windshield.rotation.x = -0.4;
  vehicle.add(windshield);

  // Rear spoiler - classic 80s/90s style
  const spoilerGeometry = new THREE.BoxGeometry(1.6, 0.1, 0.4);
  const spoilerMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0080,
    transparent: true,
    opacity: 0.9,
  });
  const spoiler = new THREE.Mesh(spoilerGeometry, spoilerMaterial);
  spoiler.position.set(0, 0.8, -2.2);
  vehicle.add(spoiler);

  // Classic retro wheels with rims
  const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.25, 12);
  const wheelMaterial = new THREE.MeshBasicMaterial({ color: 0x222222 });
  const wheelRimGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.27, 8);
  const wheelRimMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });

  const wheelPositions = [
    [-0.75, 0, 1.3], // Front left
    [0.75, 0, 1.3], // Front right
    [-0.75, 0, -1.3], // Rear left
    [0.75, 0, -1.3], // Rear right
  ];

  vehicleWheels = [];
  wheelPositions.forEach((pos) => {
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    const rim = new THREE.Mesh(wheelRimGeometry, wheelRimMaterial);
    wheel.position.set(pos[0], pos[1], pos[2]);
    rim.position.set(pos[0], pos[1], pos[2]);
    wheel.rotation.z = Math.PI / 2;
    rim.rotation.z = Math.PI / 2;
    vehicle.add(wheel);
    vehicle.add(rim);
    vehicleWheels.push(wheel);
  });

  // RETRO POP-UP HEADLIGHTS - Now clearly visible from front view!
  const popUpGeometry = new THREE.BoxGeometry(0.3, 0.15, 0.3);
  const popUpMaterial = new THREE.MeshBasicMaterial({
    color: 0x333333,
    transparent: true,
    opacity: 0.9,
  });

  // Left pop-up headlight housing (more prominent)
  const leftPopUp = new THREE.Mesh(popUpGeometry, popUpMaterial);
  leftPopUp.position.set(-0.6, 0.45, 1.9);
  leftPopUp.rotation.x = -0.2; // Slight angle for retro look
  vehicle.add(leftPopUp);

  // Right pop-up headlight housing
  const rightPopUp = new THREE.Mesh(popUpGeometry, popUpMaterial);
  rightPopUp.position.set(0.6, 0.45, 1.9);
  rightPopUp.rotation.x = -0.2; // Slight angle for retro look
  vehicle.add(rightPopUp);

  // Actual headlight bulbs inside pop-ups - larger and more visible
  const headlightGeometry = new THREE.SphereGeometry(0.15, 8, 8);
  const headlightMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffdd,
    transparent: true,
    opacity: 1,
  });

  const leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
  const rightHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
  leftHeadlight.position.set(-0.6, 0.45, 2.05);
  rightHeadlight.position.set(0.6, 0.45, 2.05);
  vehicle.add(leftHeadlight);
  vehicle.add(rightHeadlight);

  // Front grille - classic sports car feature
  const grilleGeometry = new THREE.BoxGeometry(1.2, 0.3, 0.05);
  const grilleMaterial = new THREE.MeshBasicMaterial({
    color: 0x222222,
    transparent: true,
    opacity: 0.8,
  });
  const grille = new THREE.Mesh(grilleGeometry, grilleMaterial);
  grille.position.set(0, 0.35, 2.08);
  vehicle.add(grille);

  // Front bumper
  const bumperGeometry = new THREE.BoxGeometry(1.8, 0.15, 0.3);
  const bumperMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0080,
    transparent: true,
    opacity: 0.9,
  });
  const frontBumper = new THREE.Mesh(bumperGeometry, bumperMaterial);
  frontBumper.position.set(0, 0.2, 2.0);
  vehicle.add(frontBumper);

  // Side mirrors - classic 80s style
  const mirrorGeometry = new THREE.BoxGeometry(0.08, 0.08, 0.15);
  const mirrorMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });

  const leftMirror = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
  const rightMirror = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
  leftMirror.position.set(-0.9, 0.6, 0.5);
  rightMirror.position.set(0.9, 0.6, 0.5);
  vehicle.add(leftMirror);
  vehicle.add(rightMirror);

  // Underglow effect - pure synthwave style!
  const underglowGeometry = new THREE.PlaneGeometry(2.2, 4.8);
  const underglowMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.15,
  });
  const underglow = new THREE.Mesh(underglowGeometry, underglowMaterial);
  underglow.rotation.x = -Math.PI / 2;
  underglow.position.y = 0.05;
  vehicle.add(underglow);

  // Rear lights - classic taillights
  const tailLightGeometry = new THREE.BoxGeometry(0.2, 0.15, 0.1);
  const tailLightMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 0.8,
  });

  const leftTailLight = new THREE.Mesh(tailLightGeometry, tailLightMaterial);
  const rightTailLight = new THREE.Mesh(tailLightGeometry, tailLightMaterial);
  leftTailLight.position.set(-0.7, 0.4, -2.1);
  rightTailLight.position.set(0.7, 0.4, -2.1);
  vehicle.add(leftTailLight);
  vehicle.add(rightTailLight);

  // Racing stripes - because it's the 80s!
  const stripeGeometry = new THREE.BoxGeometry(0.15, 0.02, 4.2);
  const stripeMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.8,
  });
  const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
  stripe.position.set(0, 0.62, 0);
  vehicle.add(stripe);

  // Vehicle glow effect - enhanced for retro feel
  const glowGeometry = new THREE.BoxGeometry(2.2, 1, 4.6);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0080,
    transparent: true,
    opacity: 0.1,
  });
  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  glow.position.y = 0.3;
  vehicle.add(glow);

  vehicle.position.set(0, 0.5, 5);
  roadmapScene.add(vehicle);
}

function createObstacles() {
  // Clear only non-protective obstacles
  obstacles
    .filter((obs) => !obs.userData.isProtective)
    .forEach((obstacle) => roadmapScene.remove(obstacle));
  obstacles = obstacles.filter((obs) => obs.userData.isProtective);

  const obstacleTypes = [
    { type: "cube", color: 0xff0080, size: [1, 1, 1] },
    { type: "sphere", color: 0x8a2be2, size: [0.8, 0.8, 0.8] },
    { type: "cylinder", color: 0x00ffff, size: [0.5, 2, 0.5] },
    { type: "pyramid", color: 0xffa500, size: [1, 2, 1] },
  ];

  // Increase obstacle count for larger map
  for (let i = 0; i < 35; i++) {
    const obstacleType =
      obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
    let obstacle;

    if (obstacleType.type === "cube") {
      obstacle = new THREE.Mesh(
        new THREE.BoxGeometry(...obstacleType.size),
        new THREE.MeshBasicMaterial({
          color: obstacleType.color,
          transparent: true,
          opacity: 0.8,
        })
      );
    } else if (obstacleType.type === "sphere") {
      obstacle = new THREE.Mesh(
        new THREE.SphereGeometry(obstacleType.size[0], 8, 8),
        new THREE.MeshBasicMaterial({
          color: obstacleType.color,
          transparent: true,
          opacity: 0.8,
        })
      );
    } else if (obstacleType.type === "cylinder") {
      obstacle = new THREE.Mesh(
        new THREE.CylinderGeometry(
          obstacleType.size[0],
          obstacleType.size[0],
          obstacleType.size[1],
          8
        ),
        new THREE.MeshBasicMaterial({
          color: obstacleType.color,
          transparent: true,
          opacity: 0.8,
        })
      );
    } else if (obstacleType.type === "pyramid") {
      obstacle = new THREE.Mesh(
        new THREE.ConeGeometry(obstacleType.size[0], obstacleType.size[1], 4),
        new THREE.MeshBasicMaterial({
          color: obstacleType.color,
          transparent: true,
          opacity: 0.8,
        })
      );
    }

    // Place randomly but avoid spawn area
    let x, z;
    do {
      x = (Math.random() - 0.5) * (playAreaSize - 4);
      z = (Math.random() - 0.5) * (playAreaSize - 4);
    } while (Math.abs(x) < 10 && Math.abs(z) < 10); // Keep spawn area clear

    obstacle.position.set(x, obstacleType.size[1] / 2, z);
    obstacle.userData = {
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      originalY: obstacle.position.y,
      isProtective: false,
    };
    roadmapScene.add(obstacle);
    obstacles.push(obstacle);
  }
}

function create3DTexts() {
  // Clear existing 3D texts
  threeDTexts.forEach((text) => roadmapScene.remove(text));
  threeDTexts = [];

  const textWords = [
    "CODE",
    "BUILD",
    "CREATE",
    "INNOVATE",
    "LEARN",
    "GROW",
    "DREAM",
    "ACHIEVE",
  ];

  textWords.forEach((word, index) => {
    const textGroup = new THREE.Group();

    // Create 3D text using basic geometry
    const letters = word.split("");
    let xOffset = 0;

    letters.forEach((letter) => {
      const letterGeometry = new THREE.BoxGeometry(0.8, 1.2, 0.2);
      const letterMaterial = new THREE.MeshBasicMaterial({
        color: Math.random() > 0.5 ? 0x00ffff : 0xff0080,
        transparent: true,
        opacity: 0.9,
      });
      const letterMesh = new THREE.Mesh(letterGeometry, letterMaterial);
      letterMesh.position.x = xOffset;
      textGroup.add(letterMesh);
      xOffset += 1;
    });

    // Position text in 3D space
    const x = (Math.random() - 0.5) * 8;
    const y = 3 + Math.random() * 5;
    const z = -15 - Math.random() * 160;
    textGroup.position.set(x, y, z);

    // Add floating animation
    textGroup.userData = {
      originalY: y,
      floatSpeed: 0.01 + Math.random() * 0.01,
      rotationSpeed: (Math.random() - 0.5) * 0.01,
    };

    roadmapScene.add(textGroup);
    threeDTexts.push(textGroup);
  });
}

function createExperienceTexts() {
  experienceTexts.forEach((text) => roadmapScene.remove(text));
  experienceTexts = [];

  // Mix of ground level and elevated positions for experience cards
  const strategicPositions = [
    // Ground level cards (easier to reach)
    { x: 25, z: 30, y: 1.5, elevated: false },
    { x: -30, z: 25, y: 1.5, elevated: false },
    { x: 35, z: -20, y: 1.5, elevated: false },
    { x: -25, z: -35, y: 1.5, elevated: false },

    // Elevated cards on platforms (need jumping)
    { x: 25, z: 25, y: 5.5, elevated: true },
    { x: -30, z: 20, y: 4.5, elevated: true },
    { x: 20, z: -25, y: 6.5, elevated: true },
    { x: -25, z: -30, y: 5, elevated: true },

    // Medium height cards (reachable with small jumps)
    { x: 20, z: -30, y: 2.5, elevated: false },
    { x: -15, z: 30, y: 2.5, elevated: false },
    { x: 30, z: 20, y: 2.5, elevated: false },
    { x: -35, z: -10, y: 2.5, elevated: false },
  ];

  const milestonesToUse = (typeof careerMilestones !== 'undefined' && careerMilestones.length > 0) ? careerMilestones : gameMilestones;
  milestonesToUse.forEach((milestone, index) => {
    if (!milestone.collected && index < strategicPositions.length) {
      const textGroup = new THREE.Group();
      const position = strategicPositions[index];

      // Create text background
      const bgGeometry = new THREE.PlaneGeometry(6, 1.5);
      const bgMaterial = new THREE.MeshBasicMaterial({
        color: position.elevated ? 0x2a1a4e : 0x1a0a2e,
        transparent: true,
        opacity: 0.9,
      });
      const bg = new THREE.Mesh(bgGeometry, bgMaterial);
      textGroup.add(bg);

      // Create text border with different colors for elevated cards
      const borderGeometry = new THREE.PlaneGeometry(6.2, 1.7);
      const borderMaterial = new THREE.MeshBasicMaterial({
        color: position.elevated ? 0xff0080 : 0x00ffff,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide,
      });
      const border = new THREE.Mesh(borderGeometry, borderMaterial);
      border.position.z = -0.01;
      textGroup.add(border);

      // Position at strategic location
      textGroup.position.set(position.x, position.y, position.z);
      textGroup.lookAt(roadmapCamera.position);
      textGroup.userData = {
        milestone: milestone,
        index: index,
        elevated: position.elevated,
      };
      textGroup.userData.originalY = position.y;
      textGroup.userData.floatOffset = index * 0.5;

      roadmapScene.add(textGroup);
      experienceTexts.push(textGroup);

      // Add protective obstacles around some experience cards
      if (Math.random() > 0.6) {
        createProtectiveObstacles(position.x, position.z);
      }
    }
  });
}

function createProtectiveObstacles(centerX, centerZ) {
  const obstacleCount = 3 + Math.floor(Math.random() * 3); // 3-5 obstacles

  for (let i = 0; i < obstacleCount; i++) {
    const angle = (i / obstacleCount) * Math.PI * 2;
    const distance = 4 + Math.random() * 3; // 4-7 units away
    const x = centerX + Math.cos(angle) * distance;
    const z = centerZ + Math.sin(angle) * distance;

    const obstacleTypes = [
      { type: "cube", color: 0xff0080, size: [1.5, 2, 1.5] },
      { type: "cylinder", color: 0x8a2be2, size: [0.8, 3, 0.8] },
    ];

    const obstacleType =
      obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
    let obstacle;

    if (obstacleType.type === "cube") {
      obstacle = new THREE.Mesh(
        new THREE.BoxGeometry(...obstacleType.size),
        new THREE.MeshBasicMaterial({
          color: obstacleType.color,
          transparent: true,
          opacity: 0.8,
          wireframe: Math.random() > 0.5,
        })
      );
    } else {
      obstacle = new THREE.Mesh(
        new THREE.CylinderGeometry(
          obstacleType.size[0],
          obstacleType.size[0],
          obstacleType.size[1],
          8
        ),
        new THREE.MeshBasicMaterial({
          color: obstacleType.color,
          transparent: true,
          opacity: 0.8,
          wireframe: Math.random() > 0.5,
        })
      );
    }

    obstacle.position.set(x, obstacleType.size[1] / 2, z);
    obstacle.userData = {
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      originalY: obstacle.position.y,
      isProtective: true,
    };

    roadmapScene.add(obstacle);
    obstacles.push(obstacle);
  }
}

function setupRoadmapLighting() {
  // Ambient light
  const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
  roadmapScene.add(ambientLight);

  // Directional light with synthwave colors
  const directionalLight = new THREE.DirectionalLight(0xff0080, 0.6);
  directionalLight.position.set(10, 10, 5);
  directionalLight.castShadow = true;
  roadmapScene.add(directionalLight);

  // Additional synthwave lighting
  const synthLight = new THREE.DirectionalLight(0x00ffff, 0.4);
  synthLight.position.set(-10, 8, -5);
  roadmapScene.add(synthLight);

  // Vehicle pop-up headlights - retro style beams
  const leftHeadlight = new THREE.SpotLight(
    0xffffaa,
    1.5,
    25,
    Math.PI / 8,
    0.3
  );
  leftHeadlight.position.set(-0.6, 0.45, 2.1);
  leftHeadlight.target.position.set(-0.6, 0, 5);
  vehicle.add(leftHeadlight);
  vehicle.add(leftHeadlight.target);

  const rightHeadlight = new THREE.SpotLight(
    0xffffaa,
    1.5,
    25,
    Math.PI / 8,
    0.3
  );
  rightHeadlight.position.set(0.6, 0.45, 2.1);
  rightHeadlight.target.position.set(0.6, 0, 5);
  vehicle.add(rightHeadlight);
  vehicle.add(rightHeadlight.target);
}

function setupRoadmapControls() {
  document.addEventListener("keydown", (event) => {
    if (!roadmapActive) return;

    roadmapControls[event.code] = true;

    if (event.code === "Escape") {
      exitRoadmap();
    }

    // Prevent default space bar behavior (page scrolling)
    if (event.code === "Space") {
      event.preventDefault();
    }
  });

  document.addEventListener("keyup", (event) => {
    if (!roadmapActive) return;
    roadmapControls[event.code] = false;
  });
}

function setupMouseControls() {
  const container = document.getElementById("roadmap-container");

  container.addEventListener("mousemove", (event) => {
    if (!roadmapActive) return;

    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  container.addEventListener("click", () => {
    if (!roadmapActive) return;
    container.requestPointerLock();
  });
}

function updateVehicle() {
  if (!vehicle || !roadmapActive || isPaused) return;
  const speed = 0.08; // Reduced significantly for smooth gliding feel
  const rotationSpeed = 0.02; // Slower rotation for smoother control
  const boostMultiplier = roadmapControls["ShiftLeft"] ? 1.5 : 1; // Moderate boost
  const jumpPower = 0.5; // Increased jump power for reaching elevated cards
  const gravity = 0.018; // Slightly reduced gravity for better air time

  // WASD and Arrow Key controls - adjusted for front-facing vehicle
  if (roadmapControls["KeyW"] || roadmapControls["ArrowUp"]) {
    vehicleVelocity.z += speed * boostMultiplier; // Forward (away from camera)
  }
  if (roadmapControls["KeyS"] || roadmapControls["ArrowDown"]) {
    vehicleVelocity.z -= speed * boostMultiplier; // Backward (toward camera)
  }
  if (roadmapControls["KeyA"] || roadmapControls["ArrowLeft"]) {
    vehicleVelocity.x += speed * boostMultiplier; // Left
  } else if (roadmapControls["KeyD"] || roadmapControls["ArrowRight"]) {
    vehicleVelocity.x -= speed * boostMultiplier; // Right
  }

  // Apply friction to horizontal movement
  vehicleVelocity.x *= 0.92; // Increased friction for smooth gliding
  vehicleVelocity.z *= 0.92;

  // Smooth vehicle tilting for retro racing feel - adjusted for front-facing
  if (roadmapControls["KeyA"] || roadmapControls["ArrowLeft"]) {
    vehicle.rotation.z = Math.min(vehicle.rotation.z + rotationSpeed, 0.15);
    vehicle.rotation.y = Math.min(
      vehicle.rotation.y + rotationSpeed * 0.2,
      Math.PI + 0.08
    );
  } else if (roadmapControls["KeyD"] || roadmapControls["ArrowRight"]) {
    vehicle.rotation.z = Math.max(vehicle.rotation.z - rotationSpeed, -0.15);
    vehicle.rotation.y = Math.max(
      vehicle.rotation.y - rotationSpeed * 0.2,
      Math.PI - 0.08
    );
  } else {
    vehicle.rotation.z *= 0.92;
    // Return to neutral front-facing position
    if (vehicle.rotation.y > Math.PI) {
      vehicle.rotation.y = Math.PI + (vehicle.rotation.y - Math.PI) * 0.92;
    } else {
      vehicle.rotation.y = Math.PI + (vehicle.rotation.y - Math.PI) * 0.92;
    }
  }

  // Jump controls
  if (roadmapControls["Space"] && onGround && !isJumping) {
    vehicleVelocity.y = jumpPower;
    isJumping = true;
    onGround = false;

    // Create jump effect
    createJumpEffect(vehicle.position);
  }

  // Apply gravity
  if (!onGround) {
    vehicleVelocity.y -= gravity;
  }

  // Update vehicle position
  vehicle.position.x += vehicleVelocity.x;
  vehicle.position.z += vehicleVelocity.z;
  vehicle.position.y += vehicleVelocity.y;

  // Ground and platform collision detection
  let groundHeight = 0.5; // Default ground level
  let onPlatform = false;

  // Check platform collisions
  platforms.forEach((platform) => {
    const distance = Math.sqrt(
      Math.pow(vehicle.position.x - platform.position.x, 2) +
        Math.pow(vehicle.position.z - platform.position.z, 2)
    );

    if (
      distance < 3 &&
      vehicle.position.y <= platform.position.y + 0.5 &&
      vehicle.position.y >= platform.position.y - 1
    ) {
      groundHeight = platform.position.y + 0.5;
      onPlatform = true;
    }
  });

  // Ground collision
  if (vehicle.position.y <= groundHeight) {
    vehicle.position.y = groundHeight;
    vehicleVelocity.y = 0;
    onGround = true;
    isJumping = false;
  }

  // Check if vehicle fell off play area - AUTOMATIC GAME OVER
  if (
    Math.abs(vehicle.position.x) > playAreaSize / 2 ||
    Math.abs(vehicle.position.z) > playAreaSize / 2
  ) {
    endRoadmapGame(false, "You fell off the world!");
    return;
  }

  // If falling too far below ground
  if (vehicle.position.y < -5) {
    endRoadmapGame(false, "You fell into the void!");
    return;
  }

  // Mouse look controls - adjusted for front-facing view
  cameraTarget.x = vehicle.position.x + mouseX * 3;
  cameraTarget.y = vehicle.position.y + mouseY * 2;
  cameraTarget.z = vehicle.position.z;

  // Position camera to show front of car clearly
  roadmapCamera.position.x = vehicle.position.x;
  roadmapCamera.position.z = vehicle.position.z - 8; // Position in front of the car
  roadmapCamera.position.y = 8 + vehicle.position.y; // Slightly elevated view
  roadmapCamera.lookAt(cameraTarget);

  vehicleWheels.forEach((wheel) => {
    wheel.rotation.x += 0.08; // Slightly slower wheel rotation
  });

  // Animate vehicle underglow and effects
  const time = Date.now() * 0.001;
  if (vehicle.children) {
    vehicle.children.forEach((child) => {
      // Animate underglow pulsing
      if (
        child.material &&
        child.material.color &&
        child.material.color.getHex() === 0x00ffff &&
        child.material.opacity < 0.2
      ) {
        child.material.opacity = 0.1 + Math.sin(time * 3) * 0.05;
      }
      // Animate main glow
      if (
        child.material &&
        child.material.color &&
        child.material.color.getHex() === 0xff0080 &&
        child.material.opacity < 0.2
      ) {
        child.material.opacity = 0.08 + Math.sin(time * 2) * 0.03;
      }
    });
  }

  checkCollisions();
  checkObstacleCollisions();

  // Win if all experiences collected
  const milestonesToCheck = (typeof careerMilestones !== 'undefined' && careerMilestones.length > 0) ? careerMilestones : gameMilestones;
  if (progressCount >= milestonesToCheck.length) {
    endRoadmapGame(true, "All experiences collected!");
  }
}

function createJumpEffect(position) {
  const jumpParticles = [];
  const particleCount = 15;

  for (let i = 0; i < particleCount; i++) {
    const particleGeometry = new THREE.SphereGeometry(0.1, 6, 6);
    const particleMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.8,
    });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);

    particle.position.copy(position);
    particle.position.y -= 0.3; // Start from vehicle bottom
    particle.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      Math.random() * 0.5,
      (Math.random() - 0.5) * 2
    );

    roadmapScene.add(particle);
    jumpParticles.push(particle);
  }

  // Animate jump particles
  const animateJumpParticles = () => {
    jumpParticles.forEach((particle, index) => {
      particle.position.add(particle.velocity);
      particle.velocity.y -= 0.02; // gravity
      particle.material.opacity -= 0.05;

      if (particle.material.opacity <= 0) {
        roadmapScene.remove(particle);
        jumpParticles.splice(index, 1);
      }
    });

    if (jumpParticles.length > 0) {
      requestAnimationFrame(animateJumpParticles);
    }
  };
  animateJumpParticles();
}

function checkCollisions() {
  const tempExperiences = [];

  experienceTexts.forEach((textGroup, index) => {
    const horizontalDistance = Math.sqrt(
      Math.pow(vehicle.position.x - textGroup.position.x, 2) +
        Math.pow(vehicle.position.z - textGroup.position.z, 2)
    );
    const verticalDistance = Math.abs(
      vehicle.position.y - textGroup.position.y
    );

    // Check if close enough horizontally and vertically
    if (
      horizontalDistance < 3 &&
      verticalDistance < 2 &&
      !textGroup.userData.milestone.collected
    ) {
      // Collision detected - collect experience
      textGroup.userData.milestone.collected = true;
      progressCount++;
      updateRoadmapUI();

      // Add to temporary collection
      tempExperiences.push(textGroup.userData.milestone);

      // Special effect for elevated cards
      if (textGroup.userData.elevated) {
        createElevatedCollectionEffect(textGroup.position);
      }

      // Add collection animation
      const collectAnimation = () => {
        textGroup.position.y += 0.3;
        textGroup.rotation.y += 0.1;
        if (textGroup.children[0] && textGroup.children[0].material) {
          textGroup.children[0].material.opacity -= 0.05;
        }

        if (textGroup.position.y < textGroup.userData.originalY + 10) {
          requestAnimationFrame(collectAnimation);
        } else {
          roadmapScene.remove(textGroup);
          experienceTexts.splice(experienceTexts.indexOf(textGroup), 1);
        }
      };
      collectAnimation();

      // Add particle effect
      createCollectionParticles(textGroup.position);
    }
  });

  // Show experience stack if experiences were collected
  if (tempExperiences.length > 0) {
    if (typeof window.showExperienceStack === 'function') {
      window.showExperienceStack(tempExperiences);
    }
  }
}

function createElevatedCollectionEffect(position) {
  // Special sparkle effect for elevated cards
  const sparkleCount = 20;
  const sparkles = [];

  for (let i = 0; i < sparkleCount; i++) {
    const sparkleGeometry = new THREE.SphereGeometry(0.05, 4, 4);
    const sparkleMaterial = new THREE.MeshBasicMaterial({
      color: 0xffd700, // Gold color for elevated cards
      transparent: true,
      opacity: 1,
    });
    const sparkle = new THREE.Mesh(sparkleGeometry, sparkleMaterial);

    sparkle.position.copy(position);
    sparkle.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 4,
      Math.random() * 4,
      (Math.random() - 0.5) * 4
    );

    roadmapScene.add(sparkle);
    sparkles.push(sparkle);
  }

  // Animate sparkles
  const animateSparkles = () => {
    sparkles.forEach((sparkle, index) => {
      sparkle.position.add(sparkle.velocity);
      sparkle.velocity.y -= 0.03; // gravity
      sparkle.material.opacity -= 0.02;
      sparkle.rotation.x += 0.1;
      sparkle.rotation.y += 0.1;

      if (sparkle.material.opacity <= 0) {
        roadmapScene.remove(sparkle);
        sparkles.splice(index, 1);
      }
    });

    if (sparkles.length > 0) {
      requestAnimationFrame(animateSparkles);
    }
  };
  animateSparkles();
}

function checkObstacleCollisions() {
  obstacles.forEach((obstacle, index) => {
    const distance = vehicle.position.distanceTo(obstacle.position);

    if (distance < 2) {
      // Lose a life on collision - call loseLife function
      loseLife('Hit an obstacle!');
      
      // Timer penalty - reduce by 10 seconds
      timer = Math.max(0, timer - 10);
      updateRoadmapUI();

      // Show penalty message
      showTimerPenalty();

      const bounceDirection = new THREE.Vector3()
        .subVectors(vehicle.position, obstacle.position)
        .normalize();

      vehicle.position.add(bounceDirection.multiplyScalar(1));

      // Add crash effect
      createCrashEffect(obstacle.position);

      // Remove obstacle
      roadmapScene.remove(obstacle);
      obstacles.splice(index, 1);

      // Check if timer reached zero
      if (timer <= 0) {
        endRoadmapGame(false, "Time is up due to penalties!");
      }
    }
  });
}

function showTimerPenalty() {
  const penaltyText = document.createElement("div");
  penaltyText.style.cssText = `
                position: fixed;
                top: 200px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(45deg, #ff0080, #ff4040);
                color: white;
                padding: 15px 25px;
                border: 2px solid #ff0080;
                border-radius: 10px;
                font-family: 'Orbitron', monospace;
                font-weight: bold;
                z-index: 10000;
                text-align: center;
                font-size: 1.2em;
                animation: penaltyPulse 2s ease-out forwards;
                box-shadow: 0 0 20px #ff0080;
            `;

  penaltyText.innerHTML = "<ion-icon name='warning-outline'></ion-icon> COLLISION! -10 SECONDS <ion-icon name='warning-outline'></ion-icon>";

  const style = document.createElement("style");
  style.textContent = `
                @keyframes penaltyPulse {
                    0% { opacity: 0; transform: translateX(-50%) scale(0.5); }
                    30% { opacity: 1; transform: translateX(-50%) scale(1.1); }
                    70% { opacity: 1; transform: translateX(-50%) scale(1); }
                    100% { opacity: 0; transform: translateX(-50%) scale(0.8); }
                }
            `;
  document.head.appendChild(style);
  document.body.appendChild(penaltyText);

  setTimeout(() => {
    document.body.removeChild(penaltyText);
    document.head.removeChild(style);
  }, 2000);
}

function createCollectionParticles(position) {
  const particleCount = 30;
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    const particleGeometry = new THREE.SphereGeometry(0.1, 4, 4);
    const particleMaterial = new THREE.MeshBasicMaterial({
      color: Math.random() > 0.5 ? 0x00ffff : 0xff0080,
      transparent: true,
      opacity: 0.8,
    });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);

    particle.position.copy(position);
    particle.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 3,
      Math.random() * 3,
      (Math.random() - 0.5) * 3
    );

    roadmapScene.add(particle);
    particles.push(particle);
  }

  // Animate particles
  const animateParticles = () => {
    particles.forEach((particle, index) => {
      particle.position.add(particle.velocity);
      particle.velocity.y -= 0.05; // gravity
      particle.material.opacity -= 0.03;

      if (particle.material.opacity <= 0) {
        roadmapScene.remove(particle);
        particles.splice(index, 1);
      }
    });

    if (particles.length > 0) {
      requestAnimationFrame(animateParticles);
    }
  };
  animateParticles();
}

function createCrashEffect(position) {
  const crashGeometry = new THREE.SphereGeometry(2, 8, 8);
  const crashMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0080,
    transparent: true,
    opacity: 0.6,
  });
  const crashSphere = new THREE.Mesh(crashGeometry, crashMaterial);
  crashSphere.position.copy(position);
  roadmapScene.add(crashSphere);

  // Animate crash effect
  const animateCrash = () => {
    crashSphere.scale.multiplyScalar(1.1);
    crashSphere.material.opacity -= 0.05;

    if (crashSphere.material.opacity > 0) {
      requestAnimationFrame(animateCrash);
    } else {
      roadmapScene.remove(crashSphere);
    }
  };
  animateCrash();
}

function clearRoadmapObjects() {
  obstacles.forEach((obstacle) => roadmapScene.remove(obstacle));
  obstacles = [];

  threeDTexts.forEach((text) => roadmapScene.remove(text));
  threeDTexts = [];

  experienceTexts.forEach((text) => roadmapScene.remove(text));
  experienceTexts = [];

  hills.forEach((hill) => roadmapScene.remove(hill));
  hills = [];

  ramps.forEach((ramp) => roadmapScene.remove(ramp));
  ramps = [];

  platforms.forEach((platform) => roadmapScene.remove(platform));
  platforms = [];

  objectiveTexts.forEach((text) => roadmapScene.remove(text));
  objectiveTexts = [];

  // Reset vehicle physics
  vehicleVelocity = { x: 0, y: 0, z: 0 };
  isJumping = false;
  onGround = true;
}

function animateRoadmap() {
  if (!roadmapActive) return;

  requestAnimationFrame(animateRoadmap);

  updateVehicle();

  // Animate floating texts
  const time = Date.now() * 0.001;
  experienceTexts.forEach((textGroup) => {
    if (textGroup.userData.originalY !== undefined) {
      textGroup.position.y =
        textGroup.userData.originalY +
        Math.sin(time * 2 + textGroup.userData.floatOffset) * 0.3;
    }

    // Make texts face camera
    textGroup.lookAt(roadmapCamera.position);

    // Add pulsing glow effect to borders
    if (textGroup.children[1] && textGroup.children[1].material) {
      textGroup.children[1].material.opacity = 0.6 + Math.sin(time * 3) * 0.2;
    }
  });

  // Animate objective texts
  objectiveTexts.forEach((textGroup) => {
    if (textGroup.userData.originalY !== undefined) {
      textGroup.position.y =
        textGroup.userData.originalY +
        Math.sin(time * 1.5 + textGroup.userData.floatOffset) * 0.4;
    }

    // Make objective texts face camera
    textGroup.lookAt(roadmapCamera.position);

    // Add pulsing effect to objective borders
    if (textGroup.children[1] && textGroup.children[1].material) {
      textGroup.children[1].material.opacity =
        0.7 + Math.sin(time * textGroup.userData.pulseSpeed) * 0.3;
    }
  });

  // Animate 3D texts
  threeDTexts.forEach((textGroup) => {
    if (textGroup.userData.originalY !== undefined) {
      textGroup.position.y =
        textGroup.userData.originalY +
        Math.sin(time * textGroup.userData.floatSpeed) * 0.5;
      textGroup.rotation.y += textGroup.userData.rotationSpeed;
    }
  });

  // Animate obstacles
  obstacles.forEach((obstacle) => {
    obstacle.rotation.y += obstacle.userData.rotationSpeed;
    obstacle.position.y =
      obstacle.userData.originalY + Math.sin(time * 2) * 0.1;
  });

  // Animate hills
  hills.forEach((hill) => {
    hill.rotation.y += hill.userData.rotationSpeed;
    hill.position.y = hill.userData.originalY + Math.sin(time * 1.5) * 0.05;
  });

  // Render
  roadmapRenderer.render(roadmapScene, roadmapCamera);
}

// Window Resize Handler for roadmap (called from main.js)
function handleRoadmapResize() {
  if (roadmapRenderer && roadmapCamera) {
    roadmapCamera.aspect = window.innerWidth / window.innerHeight;
    roadmapCamera.updateProjectionMatrix();
    roadmapRenderer.setSize(window.innerWidth, window.innerHeight);
  }
}

// Make functions global for HTML onclick handlers
window.startRoadmap = startRoadmap;
window.exitRoadmap = exitRoadmap;
window.startGameFlow = startGameFlow;
window.showObjectivesModal = showObjectivesModal;
window.closeObjectivesModal = closeObjectivesModal;
window.startGameNow = startGameNow;
window.showVehicleChoice = showVehicleChoice;
window.closeVehicleModal = closeVehicleModal;
window.startGameFromVehicle = startGameFromVehicle;
window.handleRoadmapResize = handleRoadmapResize;
window.loseLife = loseLife;
// Expose isPaused for modals.js to use
Object.defineProperty(window, 'isPaused', {
  get: function() { return isPaused; },
  set: function(value) { isPaused = value; }
});
