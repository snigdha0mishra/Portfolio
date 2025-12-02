// Modal Functions
function showModal(type, index, category = null) {
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modalContent");

  if (type === "project" && resumeData.projects[index]) {
    const project = resumeData.projects[index];
    // Format description as bullet points
    const bullets = project.description.split(/\. /).filter(Boolean).map(line => 
      line.trim().endsWith('.') ? line.trim() : line.trim() + '.'
    ).map(line => `<li>${line}</li>`).join(''); // Used map function to format the description as bullet points
    
    modalContent.innerHTML = `
      <button class="close-modal" onclick="closeModal()">×</button>
      <h2 style="color: #00ffff; margin-bottom: 20px; font-family: 'Orbitron', monospace;">${project.name}</h2>
      <div style="background: linear-gradient(45deg, #1a0a2e, #16213e); padding: 25px; border-radius: 15px; margin: 20px 0; border: 2px solid #00ffff;">
        <div style="margin-bottom: 15px;">
          <span style="color: #ff0080; font-weight: bold;">Period:</span> 
          <span style="color: #ffffff;">${project.period}</span>
        </div>
        <div style="margin-bottom: 20px;">
          <span style="color: #ff0080; font-weight: bold;">Description:</span>
          <ul style="color: #ffffff; margin-top: 10px; line-height: 1.6; text-align: left; padding-left: 20px;">${bullets}</ul>
        </div>
        <div style="margin-bottom: 15px;">
          <span style="color: #ff0080; font-weight: bold;">Technologies:</span> 
          <span style="color: #00ffff;">${project.tech}</span>
        </div>
        <div style="margin-bottom: 15px;">
          <span style="color: #ff0080; font-weight: bold;">Category:</span> 
          <span style="color: #00ffff;">${project.type}</span>
        </div>
      </div>
    `;
  } else if (
    type === "work" &&
    category &&
    resumeData.workExperience[category] &&
    resumeData.workExperience[category][index]
  ) {
    const work = resumeData.workExperience[category][index];
    // Format description as bullet points
    const bullets = work.description.split(/\. /).filter(Boolean).map(line => 
      line.trim().endsWith('.') ? line.trim() : line.trim() + '.'
    ).map(line => `<li>${line}</li>`).join('');
    
    modalContent.innerHTML = `
      <button class="close-modal" onclick="closeModal()">×</button>
      <h2 style="color: #00ffff; margin-bottom: 20px; font-family: 'Orbitron', monospace;">${work.title}</h2>
      <div style="background: linear-gradient(45deg, #1a0a2e, #16213e); padding: 25px; border-radius: 15px; margin: 20px 0; border: 2px solid #00ffff;">
        <div style="margin-bottom: 15px;">
          <span style="color: #ff0080; font-weight: bold;">Company:</span> 
          <span style="color: #ffffff;">${work.company}</span>
        </div>
        <div style="margin-bottom: 15px;">
          <span style="color: #ff0080; font-weight: bold;">Period:</span> 
          <span style="color: #ffffff;">${work.period}</span>
        </div>
        <div style="margin-bottom: 20px;">
          <span style="color: #ff0080; font-weight: bold;">Responsibilities & Achievements:</span>
          <ul style="color: #ffffff; margin-top: 10px; line-height: 1.6; text-align: left; padding-left: 20px;">${bullets}</ul>
        </div>
      </div>
    `;
  }

  modal.style.display = "block";
  addModalGlowEffect();
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function addModalGlowEffect() {
  const modal = document.querySelector(".modal-content");
  modal.style.boxShadow =
    "0 0 50px rgba(0, 255, 255, 0.3), 0 0 100px rgba(255, 0, 128, 0.2)";
}

// Experience Stack Functions
let collectedExperiences = [];
let currentExperienceIndex = 0;

function showExperienceStack(experiences) {
  if (!experiences || experiences.length === 0) return;
  collectedExperiences = experiences;
  currentExperienceIndex = 0;
  
  const stack = document.getElementById("experience-stack");
  if (stack) {
    stack.style.display = "block";
    displayCurrentExperience();
  }
}

function displayCurrentExperience() {
  const cardsContainer = document.getElementById("experience-cards");
  const experience = collectedExperiences[currentExperienceIndex];
  
  if (!experience) return;
  
  cardsContainer.innerHTML = `
    <div class="experience-card" style="position:relative;">
      <button class="close-modal" onclick="closeExperienceStack()" style="position:absolute;top:10px;right:20px;font-size:2em;background:none;border:none;color:#00ffff;cursor:pointer;">×</button>
      <h3>${experience.text || 'Experience'}</h3>
      <div class="details">${experience.details || ''}</div>
      <div class="type">${experience.type || ''}</div>
    </div>
  `;
}

function closeExperienceStack() {
  const stack = document.getElementById("experience-stack");
  if (stack) {
    stack.style.display = "none";
  }
  collectedExperiences = [];
  currentExperienceIndex = 0;
  
}

// Make functions global
window.showModal = showModal;
window.closeModal = closeModal;
window.showExperienceStack = showExperienceStack;
window.closeExperienceStack = closeExperienceStack;

