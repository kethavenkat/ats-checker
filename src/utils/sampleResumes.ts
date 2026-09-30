export interface SampleResume {
  id: string;
  name: string;
  title: string;
  fileName: string;
  category: string;
  text: string;
}

export const SAMPLE_RESUMES: SampleResume[] = [
  {
    id: 'sample-software-engineer',
    name: 'Alex Rivera',
    title: 'Senior Full Stack Software Engineer',
    fileName: 'Alex_Rivera_Software_Engineer_Resume.pdf',
    category: 'Engineering',
    text: `ALEX RIVERA
San Francisco, CA | (555) 234-5678 | alex.rivera.dev@gmail.com
LinkedIn: linkedin.com/in/alexrivera-dev | GitHub: github.com/arivera-code | Portfolio: alexrivera.tech

PROFESSIONAL SUMMARY
Senior Full Stack Engineer with 6+ years of experience designing and shipping scalable cloud microservices, reactive frontend architectures, and distributed systems. Expert in TypeScript, React, Node.js, Python, PostgreSQL, and AWS. Proven track record of reducing API latency by 42% and architecting systems serving 1.5M daily active users.

CORE SKILLS
- Programming Languages: TypeScript, JavaScript (ES6+), Python, Go, SQL, HTML5, CSS3
- Frontend: React 18, Next.js, Redux Toolkit, Tailwind CSS, Webpack, Vite, Jest, Cypress
- Backend & APIs: Node.js, Express, FastAPI, GraphQL, RESTful APIs, gRPC, WebSockets
- Cloud & DevOps: AWS (EC2, S3, ECS, Lambda), Docker, Kubernetes, CI/CD (GitHub Actions), Terraform
- Databases: PostgreSQL, MongoDB, Redis, Prisma, DynamoDB
- Methodologies: Agile/Scrum, Test-Driven Development (TDD), System Design, Microservices

WORK EXPERIENCE
Senior Software Engineer | CloudScale Systems, San Francisco, CA
March 2022 – Present
- Architected and deployed a multi-tenant analytics dashboard using React, TypeScript, and Node.js microservices handling 120M events per day.
- Reduced p99 API query response times from 850ms to 120ms by implementing Redis caching and indexing optimization on PostgreSQL queries.
- Spearheaded the migration from a monolithic backend to AWS ECS containerized services, slashing AWS infrastructure spending by 28% annually.
- Mentored a cohort of 5 mid-level engineers, instituted weekly code review standards, and increased team unit test coverage from 64% to 91%.

Software Engineer | NexaTech Solutions, Austin, TX
July 2019 – February 2022
- Developed customer-facing web applications using React, Redux, and Express, increasing checkout flow completion rates by 18%.
- Built automated CI/CD deployment pipelines using Docker and GitHub Actions, cutting release turnaround times from 3 hours to 14 minutes.
- Integrated third-party payment gateways (Stripe, PayPal) with idempotency keys and error retry mechanisms, processing over $4M in monthly transactions.
- Implemented real-time notifications service using Socket.io and Redis Pub/Sub, boosting active user engagement metrics by 25%.

Junior Web Developer | Apex Digital Studio, Austin, TX
June 2018 – June 2019
- Built responsive client websites and internal portals using modern JavaScript, React, and CSS Flexbox/Grid.
- Collaborated with UI/UX designers in Figma to translate wireframes into accessible, cross-browser compatible components.
- Resolved 140+ bug tickets and improved Core Web Vitals performance scores across 12 production web portals.

EDUCATION
Bachelor of Science in Computer Science
University of Texas at Austin | Graduated May 2018 | GPA: 3.82

PROJECTS
- DevPulse: Open-source developer performance monitor built with React, Go, and TimescaleDB with 1,200+ GitHub stars.
- Algocraft: Interactive algorithm visualizer deployed on AWS S3/CloudFront with 45,000 monthly unique visitors.

CERTIFICATIONS
- AWS Certified Solutions Architect – Associate (2023)
- Certified Kubernetes Application Developer (CKAD, 2024)`
  },
  {
    id: 'sample-product-manager',
    name: 'Sarah Chen',
    title: 'Lead Technical Product Manager',
    fileName: 'Sarah_Chen_Product_Manager_Resume.pdf',
    category: 'Product',
    text: `SARAH CHEN
New York, NY | (555) 789-0123 | sarah.chen.pm@gmail.com
LinkedIn: linkedin.com/in/sarahchen-pm | Portfolio: sarahchenproduct.com

PROFESSIONAL SUMMARY
Data-driven Lead Product Manager with 7+ years of experience leading B2B SaaS and consumer AI products from ideation to scale. Skilled in customer discovery, roadmapping, SQL data analytics, agile execution, and cross-functional leadership across engineering, design, and marketing teams.

CORE SKILLS
- Product Strategy: Product Roadmap, Market Research, User Journey Mapping, Feature Prioritization, OKRs
- Data & Analytics: SQL, Mixpanel, Amplitude, Google Analytics 4, A/B Testing, Tableau
- Product Management Tools: Jira, Confluence, Linear, Figma, Notion, Miro, Asana
- Technical Literacy: REST APIs, Python basics, Webhooks, System Architecture, AI/LLM applications
- Soft Skills: Stakeholder Management, Executive Presentations, User Interviews, Mentorship

WORK EXPERIENCE
Lead Product Manager | Horizon SaaS Labs, New York, NY
January 2022 – Present
- Led product strategy and execution for enterprise workflow automation platform, driving $6.2M in Net New ARR over 18 months.
- Executed 45+ customer discovery interviews and identified critical friction points, leading to a revamped onboarding flow that increased 30-day user retention from 42% to 68%.
- Partnered with 14 engineers and 2 UX designers using two-week sprint cadences, delivering 94% of roadmap initiatives on schedule.
- Designed and evaluated 22 A/B experiments to optimize freemium self-serve conversion, driving a 31% uplift in paid subscriptions.

Senior Product Manager | Veloce Commerce, Boston, MA
August 2019 – December 2021
- Owned the end-to-end checkout and payments product line, processing $180M in annual Gross Merchandise Value.
- Integrated alternative payment methods (Apple Pay, Klarna, Google Pay), increasing mobile checkout completion rate by 22%.
- Defined KPI dashboards in Mixpanel and SQL to track product health, funnel abandonment, and churn indicators.

EDUCATION
Bachelor of Science in Business Administration & Information Systems
Boston University | Graduated May 2017

CERTIFICATIONS
- Pragmatic Institute Certified (PMC-III)
- Scrum Product Owner Certified (CSPO)`
  }
];

export const SAMPLE_JOB_DESCRIPTIONS = [
  {
    id: 'job-fullstack-sr',
    title: 'Senior Full Stack Engineer',
    company: 'Stripe / Fintech Unicorn',
    text: `Job Title: Senior Full Stack Engineer (Cloud & Platform)
Location: Remote (US) / San Francisco, CA

About the Role:
We are looking for a high-impact Senior Full Stack Engineer to build next-generation financial infrastructure. You will work across modern React frontends, robust Node.js microservices, and distributed AWS architectures.

Key Responsibilities:
- Design, build, and maintain mission-critical APIs and web interfaces serving millions of merchants worldwide.
- Collaborate with product managers, UX designers, and infrastructure teams to deliver high-reliability features.
- Optimize application performance, caching strategies, and database query throughput.
- Mentor junior engineers and uphold engineering excellence through rigorous code reviews and testing.

Required Qualifications & Skills:
- 5+ years of full-stack software development experience.
- Deep expertise in TypeScript, JavaScript (ES6+), React, and Node.js.
- Strong experience with relational databases (PostgreSQL or MySQL) and query optimization.
- Hands-on experience with AWS cloud services (ECS, S3, Lambda, CloudFront) and containerization with Docker.
- Proven experience designing and consuming RESTful APIs and GraphQL.
- Strong grasp of automated testing (Jest, Cypress, TDD) and CI/CD pipelines.

Preferred Qualifications:
- Experience with high-throughput distributed systems and microservices.
- Experience with Redis caching, Kafka, or message queues.
- Familiarity with Kubernetes and Terraform.
- Prior experience in fintech, payments, or compliance-driven environments.
- Bachelor's degree in Computer Science or equivalent practical experience.`
  },
  {
    id: 'job-frontend-lead',
    title: 'Lead Frontend Developer',
    company: 'NextGen AI Workspace',
    text: `Job Title: Lead Frontend Developer
Location: New York, NY / Hybrid

Role Summary:
We are searching for a Lead Frontend Developer to spearhead the frontend architecture of our generative AI workspace. You will lead UI engineering, establishing component design systems, state management, and real-time collaboration.

What You'll Do:
- Architect and develop scalable web applications using React, TypeScript, Tailwind CSS, and WebSockets.
- Champion frontend performance, accessibility (WCAG AA), Core Web Vitals, and smooth micro-interactions.
- Work closely with AI researchers to integrate streaming LLM responses into intuitive user workflows.
- Guide frontend architecture decisions, modularization, and testing standards.

Requirements:
- 6+ years professional frontend development experience with modern React and TypeScript.
- Mastery of state management (Zustand, Redux Toolkit, or React Query).
- Deep experience with responsive design, modern CSS (Tailwind CSS), and web animations.
- Strong understanding of web performance profiling and optimization.
- Excellent communication and cross-functional leadership skills.`
  }
];
