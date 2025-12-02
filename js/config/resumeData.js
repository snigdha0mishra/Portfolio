// Resume Data with full details
const resumeData = {
  skills: {
    software: [
      "React.js",
      "Node.js",
      "Flutter",
      "Firebase",
      "JavaScript",
      "Python",
      "HTML/CSS",
      "Git",
      "React Native",
      "MongoDB",
      "Django",
      "Bootstrap",
      "Tailwind CSS",
      "Expo",
      "Figma",
      "Adobe Creative Suite",
    ],
    dataScience: [
      "Python",
      "SQL",
      "PyTorch",
      "TensorFlow",
      "Pandas",
      "NumPy",
      "scikit-learn",
      "Tableau",
      "Statistics",
      "Machine Learning",
      "SciPy",
      "Matplotlib",
      "Seaborn",
      "BERT",
      "Computer Vision",
      "NLP",
      "Deep Learning",
      "MLOps",
      "Bayesian Optimization",
      "Grid Search",
      "t-SNE",
      "TensorBoard",
    ],
  },
  workExperience: {
    software: [
      {
        title: "Course Instructor",
        company: "iCode West Frisco",
        period: "Feb 2025 - Present",
        description:
          "Instructed over 50 students across multiple tech courses including Web Development (HTML, CSS, JS), Python Programming, Scratch, Game Development (Minecraft & Roblox Studio), Drones & Robotics, and Video Editing. Taught class sizes ranging from 3 to 12 students, leading hands-on projects, live coding challenges, and personalized debugging walkthroughs to reinforce core programming concepts. Collaborated with the instructional team to enhance course material and adapt lesson pacing to support diverse learning styles across multiple age groups. Mentored beginner-level students (ages 5–13) in developing interactive coding projects across multiple platforms, encouraging creativity and technical confidence through consistent guidance.",
      },
      {
        title: "Full-Stack Software Engineer",
        company: "Freelancing",
        period: "Aug 2023 - Apr 2024",
        description:
          "Developed and deployed scalable full-stack applications, ensuring high performance, code quality, and adherence to Agile principles. Collaborated with clients to gather requirements and deliver scalable web and mobile applications using React.js and Flutter. Engineered cross-platform mobile applications with Flutter and Firebase, incorporating real-time features and optimizing database performance, reducing query response time by 20%.",
      },
      {
        title: "Multimedia Design Assistant",
        company: "University of Texas at Dallas",
        period: "Mar 2023 - May 2024",
        description:
          "Worked closely with The Office of Facilities and Economic Development at UTD to promote school initiatives various forms of digital media. Independently managed all multimedia tasks, including capturing and editing hundreds of high-quality photographs documenting campus construction, fundraising events, and other significant university activities. Produced and edited promotional videos to promote on University Web Pages, highlighting campus facilities, sporting events, and construction progress to enhance the university's digital outreach and gaining knowledge of the Adobe Creative Cloud Suite. Test web pages before they are live to ensure seamless interaction between the user and the website, identifying and resolving any functionality or design issues to optimize user experience. Automated multimedia content scheduling and analytics, improving workflow efficiency by 10% through a custom app, Crossed.",
      },
    ],
    dataScience: [
      {
        title: "Healthcare Data Scientist",
        company: "TruBridge",
        period: "Jun 23, 2025 - Aug 18, 2025",
        description:
          "Conducted statistical analysis on 10,000+ population-level healthcare records using Python (Pandas, NumPy, SciPy), identifying significant correlations between social determinants and infection rates with 95% confidence intervals. Built predictive analytics models to forecast infection risk patterns across 15+ demographic segments, achieving 88% accuracy and enabling proactive public health interventions. Performed exploratory data analysis (EDA) on multi-dimensional healthcare datasets, uncovering previously unknown trends that influenced policy recommendations for 3 major health systems. Designed automated statistical testing frameworks using Python and SQL, reducing analysis time by 60% while ensuring reproducible results for longitudinal health studies. Created geospatial analysis models to map infection patterns across communities, providing actionable insights that informed resource allocation for 5+ healthcare organizations. Developed interactive Tableau dashboards for healthcare stakeholders, enabling real-time monitoring of population health metrics and improving data accessibility by 75%. Applied machine learning clustering algorithms (K-means, hierarchical clustering) to segment at-risk populations, resulting in more targeted intervention strategies.",
      },
      {
        title: "Healthcare Data Scientist",
        company: "Ascendion",
        period: "Jun 23, 2025 - Aug 29, 2025",
        description:
          "Researched and identified real-world healthcare challenges (fraud detection, patient engagement, and claims processing) and translated them into AI agent-based workflows. Utilized AVA+ Studios Retrieval Augmented Generation (RAG) system to store and query 500+ policy documents, enabling real-time validation of prior authorization requests with 92% accuracy. Built a React-based front-end application to visualize and interact with AI agents, integrating UI components and workflows into a larger Angular application with a Python backend. Implemented and tested backend services with FastAPI and Postman, and managed PostgreSQL databases for secure, scalable data handling",
      },
      {
        title: "Data Science Specialist",
        company: "UT Austin McCombs & Great Learning",
        period: "Feb 2024 - Oct 2024",
        description:
          "Analyzed 15+ enterprise datasets across e-commerce, financial services, and healthcare domains, applying statistical methods and machine learning algorithms to extract actionable business insights. Engineered predictive models with 85%+ accuracy for customer churn prediction, loan approval automation, and sentiment analysis using Python, scikit-learn, and TensorFlow. Processed and cleaned 100,000+ records using advanced data preprocessing techniques, reducing data quality issues by 40% and improving model performance. Developed end-to-end ML pipelines for 24 real-world business problems, from data collection through model deployment, resulting in measurable ROI improvements. Performed statistical hypothesis testing and A/B testing analysis to validate business assumptions, leading to data-driven recommendations that increased conversion rates by 15%. Built interactive dashboards and visualizations using Python (Matplotlib, Seaborn) to communicate complex findings to non-technical stakeholders, improving decision-making speed by 30%. Implemented deep learning models for computer vision and NLP tasks, achieving 90%+ classification accuracy on image recognition and sentiment analysis projects. Collaborated with cross-functional teams of 15+ data professionals in mentored learning sessions, delivering statistical insights and model recommendations under industry expert guidance.",
      },
    ],
  },
  projects: [
    {
      name: "Pocket Closet",
      description:
        "Built automated image preprocessing pipeline using Python rembg library for background removal, processing 15,000+ user-uploaded clothing photos to extract clean garment images with 94% segmentation accuracy, improving downstream classification performance by 12%. Integrated OpenRouter API for conversational AI styling assistant, providing personalized fashion advice, outfit coordination, and trend analysis through natural language interaction with 92% user satisfaction. Implemented static virtual try-on feature using React Native Canvas and coordinate-based image composition, enabling users to visualize complete outfits on body templates with 95% accuracy. Developed cross-platform mobile application using React Native, Expo Router, and MongoDB Atlas with Cloudinary CDN for optimized image storage, reducing load times by 45%. Architected scalable NoSQL database schema with MongoDB, supporting efficient querying of user wardrobes with 95% query response time under 100ms, handling 50,000+ API requests with 99.8% uptime",
      tech: "Typescript, React Native, AI/ML, APIs, FashionGAN, Detectron2, Pinterest API, InceptionV3, BodyPix, MangoDB, Expo, GitHub",
      type: "Mobile Development",
      period: "Sep 2024 - Jan 2025",
      category: "both" // Available in both software and data science
    },
    {
      name: "Bulked Nutrition App",
      description:
        "Developed intelligent nutrition tracking application using React Native, Expo, and Convex backend, integrating OpenRouter API for real-time conversational AI coaching and nutrition guidance. Implemented advanced prompt engineering for personalized meal planning, processing 5,000+ user queries with 92% response relevance score in beta testing. Integrated DeepAI API for generative image synthesis, creating 8,000+ unique AI-generated recipe visuals dynamically based on ingredient combinations and nutritional profiles. Designed modular component architecture with 90% code reusability across 25+ custom UI components, reducing feature development time by 40% and ensuring unified user experience. Built real-time data synchronization using Convex backend and Firebase authentication, supporting instant updates across devices with 99.9% uptime",
      tech: "Javascript, React Native, Firebase, Deep AI Image APIs, Edamam API, Convex, OpenRouter API, Expo",
      type: "Cross-Platform Development",
      period: "Aug 2024 – Nov 2024",
      category: "both" // Available in both software and data science
    },
    {
      name: "Attendance Gamification",
      description:
        "Interactive web platform enhancing student engagement and attendance tracking with a gamified experience. Led front-end development efforts using React.js, ensuring a dynamic and responsive user interface for student and professor views. Built interactive UI features such as character customization, minimap-based location tracking, and dynamic navigation buttons. Integrated Firebase for secure authentication and real-time attendance data logging. Collaborated using Git and Figma for design alignment and team coordination. Conducted usability testing with student users to iterate on UI improvements.",
      tech: "React.js, Firebase, UI/UX, HTML5, CSS, Git, Figma",
      type: "Web Development",
      period: "Jan 2024 – May 2024",
      category: "software" // Available in both software and data science
    },
    {
      name: "CNN Architecture Analysis",
      description:
        "Conducted comprehensive comparative analysis of AlexNet, VGG16, and custom hybrid CNN architectures for fine-grained shoe style classification across 63,000+ images from UT-Zapatos50k and Kaggle datasets, achieving up to 90% accuracy on structured categories. Implemented end-to-end deep learning pipeline using PyTorch with custom data loaders, achieving 75% reduction in training time (20 to 5 minutes) through optimizer selection and hyperparameter optimization (SGD vs. Adam). Designed and executed systematic ablation studies comparing model architectures with 40M to 140M parameters, analyzing precision, recall, F1-scores, and confusion matrices to identify optimal architecture-dataset combinations. Applied advanced data augmentation strategies (rotation, color jitter, crop scaling) guided by t-SNE dimensionality analysis to address class imbalance and improve model robustness across 20+ shoe style categories. Developed reproducible experimentation framework with TensorBoard logging and model checkpointing, generating actionable insights on architecture selection and dataset characteristics for computer vision applications.",
      tech: "PyTorch, Computer Vision, Deep Learning, AlexNet, VGG16, TensorBoard, t-SNE",
      type: "Research & AI",
      period: "Mar 2025 - May 2025",
      category: "dataScience" // Data science specific
    },
    {
      name: "JP Morgan Data Analytics Program",
      description:
        "Developed comprehensive financial analysis pipeline using Python, Pandas, NumPy, and Jupyter Notebook, analyzing 1,500+ trading days of JPMorgan stock data (2015-2020). Quantified 57.84% total return and identified 300% volatility spike during COVID-19 market disruption through statistical analysis and time-series modeling. Integrated OpenRouter API with prompt engineering to build conversational AI interface, enabling natural language queries across 50+ financial metrics and market indicators. Implemented generative AI for automated report generation using large language models, producing executive summaries and risk assessments from 1,000+ data points. Created 15+ interactive visualizations using Matplotlib and Seaborn with AI-generated narrative explanations, translating complex patterns into actionable insights",
      tech: "Python, Statistical Modeling, Machine Learning, Financial Analytics, Time-Series Analysis, Risk Assessment",
      type: "Financial Analytics",
      period: "Nov 2025",
      category: "dataScience" // Data science specific
    },
    {
      name: "Crossed Social Media App",
      description:
        "Architected full-stack mobile application using React Native, Expo, and Convex backend with Firebase authentication, supporting real-time data synchronization across 1,000+ concurrent users. Integrated Instagram, TikTok, YouTube, and Snapchat APIs enabling simultaneous content scheduling and publishing, reducing posting workflow time by 65%. Developed interactive analytics dashboards using React Native Chart Kit and Victory Native, visualizing engagement metrics, follower growth trends, and post-performance data across 4 platforms. Implemented RESTful API endpoints with Convex for data aggregation, processing 10,000+ social media posts and delivering real-time insights with <200ms latency",
      tech: "Javascript, Python, Full-Stack Development, Convex, React Native, Firebase",
      type: "Cross-Platform Development",
      period: "Aug 2023 – Dec 2023",
      category: "software" // Available in both software and data science
    },
  ],
};

// Career milestones for 3D game
const careerMilestones = [
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

