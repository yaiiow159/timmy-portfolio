<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ResumeDialog from '../components/common/ResumeDialog.vue'

gsap.registerPlugin(ScrollTrigger)

const { t } = useI18n()
const languageBarsAnimated = ref(false)
const showDialog = ref(false)

onMounted(() => {
  const tl = gsap.timeline()
  
  tl.from('.resume-header', {
    y: 30,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out'
  })
  .from('.resume-section', {
    y: 30,
    opacity: 0,
    duration: 0.5,
    stagger: 0.2,
    ease: 'power3.out'
  }, '-=0.3')
  
  animateWorkExperience()
  animateLanguageSkills()
})

function animateWorkExperience() {
  gsap.utils.toArray<HTMLElement>('.job-entry').forEach((entry) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: entry as gsap.DOMTarget,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    })
    
    tl.from(entry as gsap.TweenTarget, {
      x: -50,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    })
    .from(entry.querySelectorAll('.job-detail'), {
      y: 20,
      opacity: 0,
      duration: 0.4,
      stagger: 0.1,
      ease: 'power3.out'
    }, '-=0.2')
    .from(entry.querySelectorAll('.job-bullet'), {
      scale: 0.5,
      opacity: 0,
      duration: 0.3,
      stagger: 0.05,
      ease: 'back.out(1.7)'
    }, '-=0.2')
    .from(entry.querySelector('.job-date'), {
      width: 0,
      opacity: 0,
      duration: 0.5,
      ease: 'power3.inOut'
    }, '-=0.3')
  })
}

function animateLanguageSkills() {
  if (languageBarsAnimated.value) return
  
  languageBarsAnimated.value = true
  
  gsap.to('.language-bar', {
    width: (_index, element) => {
      return element.getAttribute('data-percent')
    },
    duration: 1.5,
    ease: 'power3.out',
    stagger: 0.1
  })
}

function downloadResume(language: 'zh' | 'en') {
  const resumeUrl = language === 'zh'
    ? '/resume_zh.pdf'
    : '/resume_en.pdf'

  const link = document.createElement('a')
  link.href = resumeUrl
  link.target = '_blank'
  link.download = language === 'zh' ? 'resume_zh.pdf' : 'resume_en.pdf'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<template>
  <div class="min-h-screen py-12">
    <div class="container mx-auto px-4">
      <div class="resume-header mb-12 text-center">
        <h1 class="text-4xl font-bold mb-4 text-text-primary">{{ t('resume.title') }}</h1>
        <p class="text-lg text-text-secondary mb-6">
          Full-stack developer with expertise in Java, Spring Boot, Vue.js, and more.
        </p>
        
        <button
          class="bg-accent hover:bg-accent-dark text-white font-bold py-2 px-6 rounded-lg transition-colors"
          @click="showDialog = true"
        >
          {{ t('resume.downloadPdf') }}
        </button>
      </div>
      
      <ResumeDialog
        v-model="showDialog"
        @download="downloadResume"
      />
      
      <section class="resume-section mb-12 bg-secondary rounded-lg p-6 shadow-lg">
        <h2 class="text-2xl font-bold mb-6 text-accent">{{ t('resume.skills') }}</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-xl font-semibold mb-3 text-text-primary">Backend Development</h3>
            <ul class="space-y-2">
              <li class="flex items-start">
                <span class="text-accent mr-2">•</span>
                <div>
                  <span class="font-medium">Languages / Frameworks:</span>
                  <span class="text-text-secondary"> Spring Boot Framework, Java, Python, Node.js</span>
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-accent mr-2">•</span>
                <div>
                  <span class="font-medium">Data Access:</span>
                  <span class="text-text-secondary"> JPA, MyBatis</span>
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-accent mr-2">•</span>
                <div>
                  <span class="font-medium">Design Patterns:</span>
                  <span class="text-text-secondary"> Observer Pattern, Strategy Pattern, Chain of Responsibility, Template Method, Singleton</span>
                </div>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-xl font-semibold mb-3 text-text-primary">Frontend Development</h3>
            <ul class="space-y-2">
              <li class="flex items-start">
                <span class="text-accent mr-2">•</span>
                <div>
                  <span class="font-medium">Markup & Styling:</span>
                  <span class="text-text-secondary"> HTML, CSS, Bootstrap, Tailwind</span>
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-accent mr-2">•</span>
                <div>
                  <span class="font-medium">Languages / Libraries:</span>
                  <span class="text-text-secondary"> JavaScript, jQuery, Vue.js, React.js</span>
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-accent mr-2">•</span>
                <div>
                  <span class="font-medium">Real-time Communication:</span>
                  <span class="text-text-secondary"> WebSocket, HTTP Messaging API</span>
                </div>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-xl font-semibold mb-3 text-text-primary">Databases & Storage</h3>
            <ul class="space-y-2">
              <li class="flex items-start">
                <span class="text-accent mr-2">•</span>
                <div>
                  <span class="font-medium">Relational Databases:</span>
                  <span class="text-text-secondary"> PostgreSQL, MySQL, Oracle</span>
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-accent mr-2">•</span>
                <div>
                  <span class="font-medium">NoSQL / Time-Series Databases:</span>
                  <span class="text-text-secondary"> Redis, InfluxDB, MongoDB, Elasticsearch</span>
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-accent mr-2">•</span>
                <div>
                  <span class="font-medium">Object Storage:</span>
                  <span class="text-text-secondary"> MinIO, S3, Cloudinary</span>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3 text-text-primary">Cloud & Deployment</h3>
            <ul class="space-y-2">
              <li class="flex items-start">
                <span class="text-accent mr-2">•</span>
                <div>
                  <span class="font-medium">Cloud Platforms:</span>
                  <span class="text-text-secondary"> AWS, GCP</span>
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-accent mr-2">•</span>
                <div>
                  <span class="font-medium">Containerization:</span>
                  <span class="text-text-secondary"> Docker, Docker Swarm</span>
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-accent mr-2">•</span>
                <div>
                  <span class="font-medium">Deployment / Automation Tools:</span>
                  <span class="text-text-secondary">GitLab CI/CD, Jenkins, Shell Script, BAT Script</span>
                </div>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-xl font-semibold mb-3 text-text-primary">Monitoring & Analysis</h3>
            <ul class="space-y-2">
              <li class="flex items-start">
                <span class="text-accent mr-2">•</span>
                <div>
                  <span class="font-medium">Monitoring Tools:</span>
                  <span class="text-text-secondary"> Grafana, Prometheus, Kibana, Jconsole</span>
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-accent mr-2">•</span>
                <div>
                  <span class="font-medium">Logging & Alerting:</span>
                  <span class="text-text-secondary"> ELK Stack (Elasticsearch, Logstash, Kibana)</span>
                </div>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-xl font-semibold mb-3 text-text-primary">Version Control & Collaboration</h3>
            <ul class="space-y-2">
              <li class="flex items-start">
                <span class="text-accent mr-2">•</span>
                <div>
                  <span class="font-medium">Tools:</span>
                  <span class="text-text-secondary"> Git, SVN, Nexus Repository</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
      
      <section class="resume-section mb-12 bg-secondary rounded-lg p-6 shadow-lg">
        <h2 class="text-2xl font-bold mb-6 text-accent">{{ t('resume.experience') }}</h2>
        
        <div class="job-entry mb-8 relative pl-6 border-l-2 border-accent">
          <div class="absolute -left-2 top-0 w-4 h-4 rounded-full bg-accent job-bullet"></div>
          <div class="mb-2 job-detail">
            <h3 class="text-xl font-semibold text-text-primary">Software Engineer</h3>
            <p class="text-accent">Onework Co., Ltd. — Taipei, Taiwan</p>
            <p class="text-sm text-text-secondary job-date">Aug 2024 - Apr 2025</p>
          </div>
          
          <h4 class="font-semibold mt-4 mb-2 text-text-primary job-detail">PDS-Connected IoT Platform (End-to-End Independent Development)</h4>
          <ul class="space-y-2 text-text-secondary">
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Designed backend architecture and implemented features including API development, performance testing (JMeter, Postman), Dockerized deployment, and Jenkins-based CI/CD pipeline.</span>
            </li>
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Managed over 30 proxy units, each handling 10,0000+ sensors, 10,000+ devices, and 500+ equipment, ensuring real-time data processing and frontend visualization.</span>
            </li>
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Optimized JVM performance and WebSocket handling to process high-frequency payloads (optical image streaming every 500ms, multi-proxy sensor updates within 1s).</span>
            </li>
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Reduced equipment query latency from 64 seconds to under 95 milliseconds.</span>
            </li>
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Addressed mobile server data synchronization challenges under low bandwidth (64 Kbps) environments.</span>
            </li>
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Applied Observer and Singleton patterns to decouple modules and implement real-time state propagation.</span>
            </li>
          </ul>

          <h4 class="font-semibold mt-4 mb-2 text-text-primary job-detail">FarEasTone HEMS-Server (Independent Development)</h4>
          <ul class="space-y-2 text-text-secondary">
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Developed a residential energy management system with scheduled data processing and Redis-based multi-level caching (by year, month, week, day).</span>
            </li>
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Designed complete API layers and integrated crontab scheduling to handle time-series IoT data aggregation and statistics.</span>
            </li>
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Implemented efficient data processing pipelines for real-time energy consumption monitoring and analytics.</span>
            </li>
          </ul>

          <h4 class="font-semibold mt-4 mb-2 text-text-primary job-detail">Cathay FM-Server Refactoring Project (Architecture & API Design)</h4>
          <ul class="space-y-2 text-text-secondary">
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Led the transition from a monolithic architecture to a modular, distributed system (Portal Server + multiple FM services).</span>
            </li>
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Implemented dynamic multi-datasource switching based on different buildings, optimizing database access and improving system performance.</span>
            </li>
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Collaborated with PMs to design system architecture diagrams and refactor legacy functionality for improved scalability and maintainability.</span>
            </li>
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Handled 80M+ annual IoT records, integrating Kafka and local message tables for reliable synchronization and compensation in high-load scenarios.</span>
            </li>
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Resolved real-time synchronization and broadcast performance across multi-building environments using WebSocket.</span>
            </li>
          </ul>
        </div>
        
        <div class="job-entry mb-8 relative pl-6 border-l-2 border-accent">
          <div class="absolute -left-2 top-0 w-4 h-4 rounded-full bg-accent job-bullet"></div>
          <div class="mb-2 job-detail">
            <h3 class="text-xl font-semibold text-text-primary">Software Engineer</h3>
            <p class="text-accent">ESound Technology Co., Ltd. — Taipei, Taiwan</p>
            <p class="text-sm text-text-secondary job-date">Sep 2023 - Feb 2024</p>
          </div>
          
          <h4 class="font-semibold mt-4 mb-2 text-text-primary job-detail">Full-Stack Development & Maintenance</h4>
          <ul class="space-y-2 text-text-secondary">
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Independently led full-stack development and ongoing maintenance for the Child Placement and Tracking System, including feature enhancements, bug fixes, performance tuning, and system deployment. Covered end-to-end development from backend logic to frontend UI.</span>
            </li>
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Backend built with Spring MVC, database systems included Oracle and MySQL. Frontend technologies used: jQuery, Thymeleaf, Bootstrap, and CSS.</span>
            </li>
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Designed and optimized Oracle Procedures, Functions, Schemas, Tables, and Indexes to significantly improve query performance.</span>
            </li>
          </ul>

          <h4 class="font-semibold mt-4 mb-2 text-text-primary job-detail">System Performance & Security Enhancements</h4>
          <ul class="space-y-2 text-text-secondary">
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Integrated SonarQube for static code analysis, enhancing code maintainability and system security.</span>
            </li>
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Developed Shell and Python automation scripts to streamline deployment and testing processes, increasing development efficiency.</span>
            </li>
          </ul>
        </div>
        
        <div class="job-entry mb-8 relative pl-6 border-l-2 border-accent">
          <div class="absolute -left-2 top-0 w-4 h-4 rounded-full bg-accent job-bullet"></div>
          <div class="mb-2 job-detail">
            <h3 class="text-xl font-semibold text-text-primary">Software Engineer</h3>
            <p class="text-accent">Hitrust Technology Co., Ltd. — Taipei, Taiwan</p>
            <p class="text-sm text-text-secondary job-date">Aug 2022 - Sep 2023</p>
          </div>

          <h4 class="font-semibold mt-4 mb-2 text-text-primary job-detail">Veri-id System Refactoring & Feature Expansion</h4>
          <ul class="space-y-2 text-text-secondary">
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Led module refactoring and integration, including SSO-based permission design, approval mechanisms, custom report exports (Excel/PDF), and third-party API integration.</span>
            </li>
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Resolved integration bottlenecks and enhanced overall system modularity and maintainability.</span>
            </li>
          </ul>

          <h4 class="font-semibold mt-4 mb-2 text-text-primary job-detail">ACS / 3DS System Optimization & Asynchronous Architecture</h4>
          <ul class="space-y-2 text-text-secondary">
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Refactored the transaction query module by applying indexing and table partitioning, reducing query time from 30 seconds to under 3 seconds.</span>
            </li>
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Integrated RocketMQ to handle asynchronous transaction writeback, significantly improving system stability and scalability.</span>
            </li>
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Developed and executed data migration scripts to transition from Oracle to MySQL.</span>
            </li>
          </ul>

          <h4 class="font-semibold mt-4 mb-2 text-text-primary job-detail">Test Automation & Efficiency Improvement</h4>
          <ul class="space-y-2 text-text-secondary">
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Created automated test modules using Selenium, replacing manual testing and reducing testing time by over 50%.</span>
            </li>
          </ul>

          <h4 class="font-semibold mt-4 mb-2 text-text-primary job-detail">Bank of Communications / SeaMoney Testing Support</h4>
          <ul class="space-y-2 text-text-secondary">
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Refactored legacy code from JPA to MyBatis, ensuring better testability through comprehensive unit tests.</span>
            </li>
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Collaborated with the Shanghai team to define test workflows and documentation, ensuring consistency and test quality.</span>
            </li>
          </ul>
        </div>

        <div class="job-entry mb-8 relative pl-6 border-l-2 border-accent">
          <div class="absolute -left-2 top-0 w-4 h-4 rounded-full bg-accent job-bullet"></div>
          <div class="mb-2 job-detail">
            <h3 class="text-xl font-semibold text-text-primary">MIS Specialist</h3>
            <p class="text-accent">EverBiz Industrial Co., Ltd. — Taipei, Taiwan</p>
            <p class="text-sm text-text-secondary job-date">Apr 2016 - Dec 2016</p>
          </div>

          <ul class="space-y-2 text-text-secondary">
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Developed Excel VBA scripts to automate the generation of departmental reports and analytical charts, significantly reducing manual effort and improving data processing efficiency.</span>
            </li>
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Supported the IT team in managing employee accounts, system access, and device configurations, ensuring data security and proper access control across the organization.</span>
            </li>
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Created multiple custom VBA tools for data cleansing, report generation, automatic data comparison, and routine task automation, streamlining daily operational workflows.</span>
            </li>
            <li class="flex items-start job-detail">
              <span class="text-accent mr-2">•</span>
              <span>Contributed to the development of internal surveillance software and an automated employee check-in system, improving administrative efficiency and attendance tracking.</span>
            </li>
          </ul>
        </div>
      </section>
      
      <section class="resume-section mb-12 bg-secondary rounded-lg p-6 shadow-lg">
        <h2 class="text-2xl font-bold mb-6 text-accent">{{ t('resume.education') }}</h2>
        
        <div class="relative pl-6 border-l-2 border-accent">
          <div class="absolute -left-2 top-0 w-4 h-4 rounded-full bg-accent"></div>
          <div class="mb-2">
            <h3 class="text-xl font-semibold text-text-primary">Tamkang University of Science and Technology</h3>
            <p class="text-accent">B.B.A. in Information Management</p>
            <p class="text-sm text-text-secondary">2016 - 2021</p>
          </div>
          
          <p class="text-text-secondary mt-4">
            Actively pursued IT skills during university, earning certifications including CCNA, MTA, and TQC Java.
            Developed a strong interest in Java, leading to in-depth study of language design and practical application.
            Successfully transitioned into the industry as a Java software engineer, applying academic knowledge to real-world development.
          </p>
        </div>
      </section>
      
      <section class="resume-section language-section bg-secondary rounded-lg p-6 shadow-lg">
        <h2 class="text-2xl font-bold mb-6 text-accent">{{ t('resume.languages') }}</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex items-center">
            <div class="w-24">
              <span class="font-medium text-text-primary language-label">Chinese</span>
            </div>
            <div class="flex-grow">
              <div class="h-2 w-full bg-gray-700 rounded-full">
                <div class="language-bar h-2 rounded-full bg-accent" style="width: 100%"></div>
              </div>
              <span class="text-sm text-text-secondary language-label">Native / Bilingual Proficiency</span>
            </div>
          </div>
          
          <div class="flex items-center">
            <div class="w-24">
              <span class="font-medium text-text-primary language-label">English</span>
            </div>
            <div class="flex-grow">
              <div class="h-2 w-full bg-gray-700 rounded-full">
                <div class="language-bar h-2 rounded-full bg-accent" style="width: 85%"></div>
              </div>
              <span class="text-sm text-text-secondary language-label">Advanced Proficiency</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.job-entry {
  overflow: hidden;
}

.language-bar {
  transform-origin: left;
}

.job-date {
  position: relative;
  display: inline-block;
  overflow: hidden;
}

.language-label {
  display: inline-block;
}
</style>
