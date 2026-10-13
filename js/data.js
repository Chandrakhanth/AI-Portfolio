const PORTFOLIO_DATA = {
  profile: {
    name: "Chandrakhanth K",
    preferredName: "Chandy",
    title: "Data Engineering Professional",
    company: "Systech Solutions, Inc.",
    greeting: "Hey there! I'm Chandrakhanth 👋",
    tagline: "Architecting resilient, high-throughput data platforms with MS SQL Server, Python, PySpark, Microsoft Fabric, Snowflake, and Databricks.",
    bio: "Data Engineering professional proficient in architecting end-to-end data platforms, distributed data processing, and cloud lakehouses. Proficient in MS SQL Server, Python, PySpark, Microsoft Fabric (DP-700 Certified), Snowflake, and Databricks, I deliver dependable analytics from raw ingestion to executive BI marts.",
    shortBio: "Data Engineering Professional at Systech Solutions, Inc. with ~2+ years of production experience architecting end-to-end data platforms, Microsoft Fabric lakehouses, PySpark pipelines, and Snowflake data marts.",
    totalExperience: "2+ Years of progressive production engineering experience across Enterprise Data Pipelines, Distributed PySpark Compute, and Full-Stack Software Development.",
    experienceYears: "2+ Years",
    location: "Chennai, India (Open to Remote)",
    status: "Open to high-impact Data Engineering & Analytics opportunities",
    email: "chandrakhanth07@gmail.com",
    github: "https://github.com/chandrakhanth",
    linkedin: "https://linkedin.com/in/chandrakhanth",
    avatar: "assets/ai-avatar.jpg",
    avatarAlt: "Chandrakhanth K - 3D AI Digital Twin",
    avatarGreeting: "Welcome to my portfolio. I'm an AI assistant designed to help you explore my experience, projects, and technical expertise!",
    stats: [
      { label: "Daily Volume", value: "100M+", sub: "Distributed PySpark & SQL ETL" },
      { label: "Lakehouse & DW", value: "Fabric & Snowflake", sub: "DP-700 Certified • Medallion Architecture" },
      { label: "Pipeline Reliability", value: "90%", sub: "Automated Data Validation & SLA" },
      { label: "Core Foundation", value: "B.Tech IT", sub: "Anna University (2020–2024)" }
    ]
  },

  certifications: [
    {
      id: "microsoft-fabric",
      title: "Microsoft Fabric Analytics Engineer (DP-700)",
      company: "Microsoft",
      companyLogoKey: "microsoft",
      issuer: "Microsoft Certified",
      year: "2026",
      badge: "DP-700 Certified",
      color: "#0078d4",
      skills: ["Fabric Lakehouse", "OneLake", "Fabric Spark", "Direct Lake"]
    },
    {
      id: "airflow-dag-authoring",
      title: "Apache Airflow DAG Authoring",
      company: "Astronomer",
      companyLogoKey: "airflow",
      issuer: "Astronomer Certified",
      year: "2026",
      badge: "Airflow Certified",
      color: "#0284c7",
      skills: ["DAG Authoring", "XComs", "Custom Operators", "Sensors"]
    },
    {
      id: "airflow-fundamentals",
      title: "Apache Airflow Fundamentals",
      company: "Astronomer",
      companyLogoKey: "astronomer",
      issuer: "Astronomer Certified",
      year: "2026",
      badge: "Workflow Master",
      color: "#7c3aed",
      skills: ["Airflow Architecture", "Task Scheduling", "SLAs", "Operators"]
    },
    {
      id: "databricks-associate",
      title: "Databricks Data Engineer Associate",
      company: "Databricks",
      companyLogoKey: "databricks",
      issuer: "Databricks Certified",
      year: "2026 – 2028",
      badge: "Associate Certified",
      color: "#ff3621",
      skills: ["PySpark", "Delta Lake", "Lakehouse Platform", "Data Pipelines"]
    },
    {
      id: "btech-it",
      title: "B.Tech in Information Technology",
      company: "Anna University",
      companyLogoKey: "university",
      issuer: "C.Abdul Hakeem College of Engineering & Technology",
      year: "2020 – 2024",
      badge: "Degree",
      color: "#8b5cf6",
      skills: ["Distributed Systems", "SQL & Database Design", "Algorithms"]
    }
  ],

  companyLogos: {
    microsoft: `<svg viewBox="0 0 24 24" width="30" height="30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Microsoft Logo">
      <rect x="2" y="2" width="9.5" height="9.5" rx="1" fill="#F25022"/>
      <rect x="12.5" y="2" width="9.5" height="9.5" rx="1" fill="#7FBA00"/>
      <rect x="2" y="12.5" width="9.5" height="9.5" rx="1" fill="#00A4EF"/>
      <rect x="12.5" y="12.5" width="9.5" height="9.5" rx="1" fill="#FFB900"/>
    </svg>`,

    airflow: `<svg viewBox="0 0 24 24" width="30" height="30" fill="#017CEE" xmlns="http://www.w3.org/2000/svg" aria-label="Apache Airflow Logo">
      <path d="M17.195 16.822l4.002-4.102C23.55 10.308 23.934 5.154 24 .43a.396.396 0 0 0-.246-.373.392.392 0 0 0-.437.09l-6.495 6.658-4.102-4.003C10.309.45 5.154.066.43 0H.423a.397.397 0 0 0-.277.683l6.658 6.494-4.003 4.103C.45 13.692.065 18.846 0 23.57a.398.398 0 0 0 .683.282l6.494-6.657 3.934 3.837.17.165c2.41 2.353 7.565 2.737 12.288 2.803h.006a.397.397 0 0 0 .277-.683l-6.657-6.495zm-.409-9.476c.04.115.05.24.031.344-.17.96-1.593 2.538-4.304 3.87a.597.597 0 0 0-.08-.079c1.432-3.155 1.828-5.61 1.175-7.322l3.058 2.984.12.203zm-.131 9.44a.73.73 0 0 1-.347.031c-.96-.171-2.537-1.594-3.87-4.307a.656.656 0 0 0 .08-.078l-.001.001c3.155 1.432 5.61 1.83 7.324 1.174l-2.969 3.043M23.568.392a.05.05 0 0 1 .052-.011c.018.006.03.024.029.043-.065 4.655-.437 9.726-2.703 12.05-1.53 1.565-4.326 1.419-8.283-.377.006-.037.021-.07.02-.108 0-.044-.017-.082-.026-.123 2.83-1.39 4.315-3.037 4.506-4.115.057-.322-.009-.542-.102-.688l6.507-6.67V.392z"/>
    </svg>`,

    astronomer: `<svg viewBox="0 0 24 24" width="30" height="30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Astronomer Logo">
      <circle cx="12" cy="12" r="10" fill="rgba(124, 58, 237, 0.16)" stroke="#7C3AED" stroke-width="1.5"/>
      <path d="M12 4.5L5.5 19h3.2l1.5-3.6h4.6l1.5 3.6h3.2L12 4.5zm0 5.4l1.5 3.4h-3L12 9.9z" fill="#7C3AED"/>
      <circle cx="12" cy="11.8" r="1.3" fill="#00E5FF"/>
    </svg>`,

    databricks: `<svg viewBox="0 0 24 24" width="30" height="30" fill="#FF3621" xmlns="http://www.w3.org/2000/svg" aria-label="Databricks Logo">
      <path d="M.95 14.184L12 20.403l9.919-5.55v2.21L12 22.662l-10.484-5.96-.565.308v.77L12 24l11.05-6.218v-4.317l-.515-.309L12 19.118l-9.867-5.653v-2.21L12 16.805l11.05-6.218V6.32l-.515-.308L12 11.77 2.133 6.117v-2.21L12 9.512 21.919 3.96v2.21L12 11.722 1.516 5.762.95 6.07v.77L12 13.06l11.05-6.218V2.525l-.515-.309L12 7.825 2.133 2.172v-2.21L12 5.568 23.05-.65V.12L12 6.338.95.12z"/>
    </svg>`,

    university: `<svg viewBox="0 0 24 24" width="30" height="30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="University Degree">
      <path d="M12 3L2 8l10 5 10-5-10-5z" fill="#8B5CF6"/>
      <path d="M5 11.5v4.5c0 2.5 3.1 4.5 7 4.5s7-2 7-4.5v-4.5l-7 3.5-7-3.5z" fill="#8B5CF6" fill-opacity="0.85"/>
      <path d="M22 9v6" stroke="#8B5CF6" stroke-width="2" stroke-linecap="round"/>
      <circle cx="22" cy="15.5" r="1.2" fill="#8B5CF6"/>
    </svg>`
  },

  pipelineStages: [
    {
      id: "source",
      name: "Source System Ingestion",
      tech: "Retail POS & Sales APIs",
      rate: "45k records/min",
      latency: "1.2s",
      status: "SUCCESS",
      icon: "shopping-bag",
      description: "Extracting raw transactional sales, inventory counts, and customer interaction feeds from global retail store endpoints."
    },
    {
      id: "adf",
      name: "Azure Data Factory Ingestion",
      tech: "Azure Data Factory (ADF)",
      rate: "12 pipelines",
      latency: "4.8m",
      status: "SUCCESS",
      icon: "cloud",
      description: "Scheduled ingestion pipelines landing raw JSON/CSV feeds into Azure Data Lake storage with schema enforcement and audit logging."
    },
    {
      id: "databricks",
      name: "Databricks PySpark Cleansing",
      tech: "Databricks & PySpark",
      rate: "1.8 GB/batch",
      latency: "3.2m",
      status: "RUNNING",
      icon: "cpu",
      description: "Distributed transformation clusters executing Source System Analysis (SSA), deduplication, business logic validations, and data quality checks."
    },
    {
      id: "airflow",
      name: "Airflow DAG Orchestration",
      tech: "Apache Airflow (Astronomer)",
      rate: "24 daily DAGs",
      latency: "Real-time",
      status: "RUNNING",
      icon: "activity",
      description: "Primary owner of end-to-end DAG execution. Manages task dependencies, monitors XComs, and ensures 90% on-time delivery without pipeline stalls."
    },
    {
      id: "warehouse",
      name: "Cloud Lakehouse Storage",
      tech: "Snowflake & Greenplum",
      rate: "350k rows/load",
      latency: "Sub-minute",
      status: "SUCCESS",
      icon: "database",
      description: "Structured dimensional modeling (Star Schema) storing curated retail fact tables, inventory levels, and customer dimension histories."
    },
    {
      id: "bi",
      name: "Power BI Analytics & Forecasting",
      tech: "Power BI & DAX",
      rate: "Real-Time DirectQuery",
      latency: "< 2s",
      status: "SUCCESS",
      icon: "bar-chart-2",
      description: "Delivering actionable insights, real-time inventory decisions, and strategic supply chain forecasts to downstream business units."
    }
  ],

  projects: [
    {
      id: "data-orchestration-platform",
      title: "Enterprise Data Pipeline & Workflow Orchestration Platform",
      category: "orchestration",
      categoryLabel: "Data Engineering & Orchestration",
      featured: true,
      image: "assets/project-aurastream.jpg",
      summary: "End-to-end enterprise data pipeline and workflow orchestration platform at Systech Solutions. Orchestrates multi-tier ingestion, PySpark transformations, and dimensional lakehouse delivery across Apache Airflow, MS SQL Server, Databricks, and Snowflake with 90% SLA compliance.",
      problem: "Disparate source systems, complex multi-tier dependencies, and upstream data inconsistencies threatened daily analytical reporting SLAs and delayed business decision-making.",
      solution: "Architected a resilient orchestration framework utilizing Apache Airflow DAGs, custom operators, dynamic task dependencies, and automated retry mechanisms to safeguard daily data deliveries and streamline incident triage.",
      metrics: [
        { label: "SLA Adherence", value: "90%" },
        { label: "Daily Production Runs", value: "100+ DAGs" },
        { label: "Incident Triage", value: "65% Faster" },
        { label: "Pipeline Reliability", value: "High Availability" }
      ],
      techStack: ["Apache Airflow", "MS SQL Server", "Python", "PySpark", "Microsoft Fabric", "Snowflake", "Databricks", "Azure Data Factory", "Git"],
      githubUrl: "https://github.com/chandrakhanth",
      demoUrl: "#pipeline",
      architecture: [
        "Source Ingestion -> Multi-source transactional feeds extracted via Python & Azure Data Factory",
        "Distributed Cleansing -> Databricks PySpark transformations, schema enforcement & SSA deduplication",
        "Airflow Orchestration -> Automated dependency tracking, dynamic task instances & SLA monitoring",
        "Curated Lakehouse -> Snowflake & Microsoft Fabric curated star schemas for executive dashboards"
      ]
    }
  ],

  skills: [
    {
      category: "Primary Skills",
      badge: "PRIMARY & CORE",
      description: "Core programming languages, analytical SQL dialects, distributed compute, and data modeling foundations.",
      skills: [
        { name: "Python", level: 80, tags: ["ETL Scripts", "Pandas", "Automation", "OOP", "APIs", "PySpark"] },
        { name: "SQL (Advanced & T-SQL)", level: 85, tags: ["Window Functions", "CTEs", "Stored Procedures", "Query Optimization", "Indexing"] },
        { name: "PySpark", level: 70, tags: ["Distributed Compute", "DataFrames", "Spark SQL", "Transformations"] },
        { name: "Data Modeling", level: 90, tags: ["Star Schema", "Snowflake Schema", "Fact & Dimension Tables", "Medallion Architecture"] },
        { name: "Source System Analysis (SSA)", level: 90, tags: ["Schema Mapping", "Data Profiling", "Data Validation", "Deduplication"] },
        { name: "DAX & Power Query", level: 86, tags: ["Calculated Measures", "Data Cleaning", "Relationships"] }
      ]
    },
    {
      category: "Familiar Tools & Technologies",
      badge: "FAMILIAR & TOOLS",
      description: "Enterprise cloud lakehouses, orchestration engines, databases, and analytics tooling.",
      skills: [
        { name: "Snowflake", level: 70, tags: ["Virtual Warehouses", "SnowSQL", "Time Travel", "Zero-Copy Clone", "Marts"] },
        { name: "Databricks & Delta Lake", level: 70, tags: ["Databricks Certified", "PySpark", "Clusters", "Jobs", "Lakehouse"] },
        { name: "Microsoft Fabric (DP-700 Certified)", level: 80, tags: ["Fabric Lakehouse", "OneLake", "Fabric Spark", "Direct Lake", "Pipelines"] },
        { name: "Apache Airflow (Astronomer Certified)", level: 80, tags: ["DAG Authoring", "XComs", "Custom Operators", "Sensors", "Triage"] },
        { name: "Azure Data Factory (ADF)", level: 88, tags: ["Copy Data", "Pipelines", "Triggers", "Linked Services"] },
        { name: "MS SQL Server", level: 90, tags: ["Stored Procedures", "Indexing", "Query Optimization", "T-SQL", "ETL"] },
        { name: "Greenplum Database", level: 88, tags: ["MPP Architecture", "Distributed Tables", "Data Loading"] },
        { name: "Power BI", level: 80, tags: ["Dashboards", "DirectQuery", "Scheduled Refresh", "Visuals"] },
        { name: "Microsoft Azure", level: 90, tags: ["Azure Blob/ADLS Gen2", "ADF", "Azure VMs", "Key Vault"] },
        { name: "Git & Version Control", level: 92, tags: ["Branching", "Pull Requests", "CI/CD", "Collaboration"] },
        { name: "Linux & Nova / Bash", level: 60, tags: ["Shell Scripts", "Cron", "Log Analysis", "Server Config"] }
      ]
    }
  ],

  experience: [
    {
      period: "06/2025 — PRESENT",
      role: "Data Engineer",
      company: "Systech Solutions, Inc.",
      location: "Chennai, India",
      highlight: "Delivering scalable end-to-end data pipeline engineering, analytical lakehouses, and mission-critical DAG workflow orchestration.",
      bullets: [
        "End-to-End Pipeline Engineering: Engineered scalable ingestion and transformation pipelines using Python, PySpark, MS SQL Server, and Microsoft Fabric to consolidate multi-source enterprise retail feeds.",
        "Cloud Lakehouse & Warehousing: Designed and optimized dimensional star schemas, partitioned Delta Lake stores, and curated analytical data marts in Snowflake and Databricks.",
        "Workflow Orchestration: Managed and supervised daily Apache Airflow DAG executions, authoring custom operators and sensor logic to guarantee 90% on-time data availability.",
        "Incident Triage & Rapid Troubleshooting: Proactively investigated task failures by inspecting Airflow logs, task metadata, and XCom payloads, swiftly clearing downstream bottlenecks before SLA impact.",
        "Source System Analysis (SSA) & Integrity: Conducted rigorous Source System Analysis, implemented automated validation rules and deduplication routines, ensuring flawless data integrity for executive analytics.",
        "Deployment & Performance Optimization: Profiled query execution plans in SQL Server and Snowflake, accelerating batch load cycles by 40% and validating new production deployments."
      ],
      skills: ["MS SQL Server", "Python", "PySpark", "Microsoft Fabric", "Apache Airflow", "Snowflake", "Databricks", "Azure Data Factory", "Git"]
    },
    {
      period: "10/2024 — 04/2025",
      role: "Software Engineer",
      company: "SPB CORP LTD",
      location: "United Kingdom (Remote)",
      highlight: "Engineered scalable full-stack web applications, RESTful microservices, and high-performance relational database architectures.",
      bullets: [
        "Full-Stack Architecture: Built end-to-end full stack web applications with responsive user interfaces (HTML5/CSS3, JavaScript, React) connected to robust backend services powered by Python (FastAPI/Django).",
        "RESTful API & Microservices: Designed and implemented secure, versioned RESTful APIs handling cross-service authentication, asynchronous request queues, and dynamic JSON payload serialization.",
        "Database Modeling & Query Tuning: Architected relational schemas, tables, indexes, and stored procedures in MS SQL Server, profiling query execution plans to reduce API endpoint response times by 45%.",
        "State Management & Integration: Integrated client-side state caching, form validation workflows, and dynamic UI data-binding with comprehensive unit testing coverage.",
        "DevOps & Code Quality: Automated CI/CD build scripts, containerized local development with Docker, and conducted rigorous Git pull request peer reviews to maintain clean code standards."
      ],
      skills: ["JavaScript", "React", "Python", "FastAPI / Django", "MS SQL Server", "RESTful APIs", "HTML5 / CSS3", "Docker", "Git"]
    },
    {
      period: "06/2024 — 08/2024",
      role: "Software Engineer",
      company: "IIT Madras",
      location: "Chennai, India",
      highlight: "Engineered interactive full-stack research web dashboards, computational REST APIs, and backend data processing modules.",
      bullets: [
        "Full-Stack Analytical Dashboards: Developed dynamic, interactive web-based data dashboards using JavaScript, HTML5/CSS3, and Python (Flask/FastAPI) to visualize complex computational models and statistical metrics.",
        "High-Throughput REST APIs: Engineered backend REST API endpoints and data serialization services for seamless querying and retrieval across multi-gigabyte research datasets.",
        "Database Architecture & Validation: Structured PostgreSQL and SQL databases, enforcing relational constraints and writing automated data validation scripts to guarantee 100% schema integrity.",
        "Compute Performance & Optimization: Profiled and accelerated distributed batch parsing utilities and mathematical calculation routines on Linux server environments, boosting rendering speeds by 35%."
      ],
      skills: ["Python", "JavaScript", "Flask / FastAPI", "PostgreSQL", "REST APIs", "Data Visualization", "HTML5 / CSS3", "Linux", "Git"]
    }
  ],

  manifesto: [
    {
      title: "Pipelines Should Be Peaceful & Predictable",
      quote: "A great data pipeline is one you never have to wake up at 3 AM for. Clear DAG dependencies, thoughtful retries, and comprehensive alerting create true engineering calm."
    },
    {
      title: "Data Integrity Comes First",
      quote: "Speed without accuracy is just making bad decisions faster. Rigorous Source System Analysis (SSA) and automated data quality checks are non-negotiable."
    },
    {
      title: "Empathy for Downstream Consumers",
      quote: "Whether it's a Power BI dashboard for store managers or an ML model for forecasting, data engineers succeed when our business partners can make decisions with complete confidence."
    }
  ]
};

if (typeof window !== 'undefined') {
  window.PORTFOLIO_DATA = PORTFOLIO_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PORTFOLIO_DATA;
}
