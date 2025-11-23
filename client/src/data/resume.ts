import type { EducationEntry, LanguageSkill, SkillGroup, WorkExperience } from '../types/resume'

export const skillGroups: SkillGroup[] = [
  {
    title: 'Backend Development',
    items: [
      {
        label: 'Languages / Frameworks:',
        description: 'Spring Boot Framework, Java, Python, Node.js'
      },
      {
        label: 'Data Access:',
        description: 'JPA, MyBatis'
      },
      {
        label: 'Design Patterns:',
        description: 'Observer Pattern, Strategy Pattern, Chain of Responsibility, Template Method, Singleton'
      }
    ]
  },
  {
    title: 'Frontend Development',
    items: [
      {
        label: 'Markup & Styling:',
        description: 'HTML, CSS, Bootstrap, Tailwind'
      },
      {
        label: 'Languages / Libraries:',
        description: 'JavaScript, jQuery, Vue.js, React.js'
      },
      {
        label: 'Real-time Communication:',
        description: 'WebSocket, HTTP Messaging API'
      }
    ]
  },
  {
    title: 'Databases & Storage',
    items: [
      {
        label: 'Relational Databases:',
        description: 'PostgreSQL, MySQL, Oracle'
      },
      {
        label: 'NoSQL / Time-Series Databases:',
        description: 'Redis, InfluxDB, MongoDB, Elasticsearch'
      },
      {
        label: 'Object Storage:',
        description: 'MinIO, S3, Cloudinary'
      }
    ]
  },
  {
    title: 'Cloud & Deployment',
    items: [
      {
        label: 'Cloud Platforms:',
        description: 'AWS, GCP'
      },
      {
        label: 'Containerization:',
        description: 'Docker, Docker Swarm'
      },
      {
        label: 'Deployment / Automation Tools:',
        description: 'GitLab CI/CD, Jenkins, Shell Script, BAT Script'
      }
    ]
  },
  {
    title: 'Monitoring & Analysis',
    items: [
      {
        label: 'Monitoring Tools:',
        description: 'Grafana, Prometheus, Kibana, Jconsole'
      },
      {
        label: 'Logging & Alerting:',
        description: 'ELK Stack (Elasticsearch, Logstash, Kibana)'
      }
    ]
  },
  {
    title: 'Version Control & Collaboration',
    items: [
      {
        label: 'Tools:',
        description: 'Git, SVN, Nexus Repository'
      }
    ]
  }
]

export const workExperiences: WorkExperience[] = [
  {
    role: 'Software Engineer',
    company: 'Onework Co., Ltd. — Taipei, Taiwan',
    date: 'Aug 2024 - Apr 2025',
    projects: [
      {
        title: 'PDS-Connected IoT Platform (End-to-End Independent Development)',
        bullets: [
          'Designed backend architecture and implemented features including API development, performance testing (JMeter, Postman), Dockerized deployment, and Jenkins-based CI/CD pipeline.',
          'Managed over 30 proxy units, each handling 10,0000+ sensors, 10,000+ devices, and 500+ equipment, ensuring real-time data processing and frontend visualization.',
          'Optimized JVM performance and WebSocket handling to process high-frequency payloads (optical image streaming every 500ms, multi-proxy sensor updates within 1s).',
          'Reduced equipment query latency from 64 seconds to under 95 milliseconds.',
          'Addressed mobile server data synchronization challenges under low bandwidth (64 Kbps) environments.',
          'Applied Observer and Singleton patterns to decouple modules and implement real-time state propagation.'
        ]
      },
      {
        title: 'FarEasTone HEMS-Server (Independent Development)',
        bullets: [
          'Developed a residential energy management system with scheduled data processing and Redis-based multi-level caching (by year, month, week, day).',
          'Designed complete API layers and integrated crontab scheduling to handle time-series IoT data aggregation and statistics.',
          'Implemented efficient data processing pipelines for real-time energy consumption monitoring and analytics.'
        ]
      },
      {
        title: 'Cathay FM-Server Refactoring Project (Architecture & API Design)',
        bullets: [
          'Led the transition from a monolithic architecture to a modular, distributed system (Portal Server + multiple FM services).',
          'Implemented dynamic multi-datasource switching based on different buildings, optimizing database access and improving system performance.',
          'Collaborated with PMs to design system architecture diagrams and refactor legacy functionality for improved scalability and maintainability.',
          'Handled 80M+ annual IoT records, integrating Kafka and local message tables for reliable synchronization and compensation in high-load scenarios.',
          'Resolved real-time synchronization and broadcast performance across multi-building environments using WebSocket.'
        ]
      },
      {
        title: 'Lalamove Mobile Server & IoT Gateway Integration',
        bullets: [
          'Developed and deployed mobile server for hybrid gateways, focusing on real-time device monitoring and event notification.',
          'Implemented file upload and download services using S3-compatible object storage (MinIO) for efficient media handling.',
          'Optimized WebSocket message flow for stable, low-latency updates during multi-device interactions.'
        ]
      },
      {
        title: 'PDS Platform Device Data Integration for Fujifilm',
        bullets: [
          'Implemented high-throughput data processing pipelines for optical equipment, ensuring reliable ingestion and storage of large datasets.',
          'Designed data synchronization strategies to maintain consistency between edge devices and centralized services.'
        ]
      },
      {
        title: 'Large-Scale Policy Management Migration for Cathay FM Building',
        bullets: [
          'Led the migration of extensive policy management functionalities using a decoupled, microservice-aligned architecture.',
          'Enhanced legacy APIs for better performance and maintainability during the transition process.'
        ]
      },
      {
        title: 'Trading System Development',
        bullets: [
          'Developed RESTful APIs for back-office settlement operations, ensuring compliance and accuracy.',
          'Conducted Docker stress testing and verified capacity planning for the Asia stock broker platform.'
        ]
      },
      {
        title: 'ACS / 3DS System Optimization & Asynchronous Architecture',
        bullets: [
          'Refactored the transaction query module by applying indexing and table partitioning, reducing query time from 30 seconds to under 3 seconds.',
          'Integrated RocketMQ to handle asynchronous transaction writeback, significantly improving system stability and scalability.',
          'Developed and executed data migration scripts to transition from Oracle to MySQL.'
        ]
      },
      {
        title: 'Test Automation & Efficiency Improvement',
        bullets: [
          'Created automated test modules using Selenium, replacing manual testing and reducing testing time by over 50%.'
        ]
      },
      {
        title: 'Bank of Communications / SeaMoney Testing Support',
        bullets: [
          'Refactored legacy code from JPA to MyBatis, ensuring better testability through comprehensive unit tests.',
          'Collaborated with the Shanghai team to define test workflows and documentation, ensuring consistency and test quality.'
        ]
      }
    ]
  },
  {
    role: 'MIS Specialist',
    company: 'EverBiz Industrial Co., Ltd. — Taipei, Taiwan',
    date: 'Apr 2016 - Dec 2016',
    bullets: [
      'Developed Excel VBA scripts to automate the generation of departmental reports and analytical charts, significantly reducing manual effort and improving data processing efficiency.',
      'Supported the IT team in managing employee accounts, system access, and device configurations, ensuring data security and proper access control across the organization.',
      'Created multiple custom VBA tools for data cleansing, report generation, automatic data comparison, and routine task automation, streamlining daily operational workflows.',
      'Contributed to the development of internal surveillance software and an automated employee check-in system, improving administrative efficiency and attendance tracking.'
    ]
  }
]

export const educationEntries: EducationEntry[] = [
  {
    school: 'Tamkang University of Science and Technology',
    degree: 'B.B.A. in Information Management',
    period: '2016 - 2021',
    description: [
      'Actively pursued IT skills during university, earning certifications including CCNA, MTA, and TQC Java.',
      'Developed a strong interest in Java, leading to in-depth study of language design and practical application.',
      'Successfully transitioned into the industry as a Java software engineer, applying academic knowledge to real-world development.'
    ]
  }
]

export const languageSkills: LanguageSkill[] = [
  { name: 'Chinese', proficiency: 'Native / Bilingual Proficiency', level: 100 },
  { name: 'English', proficiency: 'Advanced Proficiency', level: 85 }
]
