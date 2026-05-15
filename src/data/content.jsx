// Long-form copy for the modal panels.
//
// Each entry has the same shape:
//   { label, color, accent, body: ({ Section, P, Tag, Row, Job }) => JSX }
//
// `body` receives small render helpers from panel-typography.jsx so the prose
// doesn't have to repeat all the inline styling. Keep the entries as plain
// data - no hooks, no state - they're called inside FogPanel.

import React from 'react';

// ── Cloud labels (about, experiences, skills, certificates, education) ────────

export const CLOUD_CONTENT = {
  about: {
    label: 'About Me',
    color: '#f5f1e8',
    accent: '#d18a4a',
    body: ({ P }) => (
      <>
        <P style={{ fontSize: 14, color: '#7a4a26', marginBottom: 8 }}>
          <strong>Parsa Jafari</strong> · Full-Stack Developer
        </P>
        <P style={{ fontSize: 12, color: '#8a6a46', marginBottom: 16 }}>
          Greater Toronto Area · Canada · React · TypeScript · Node.js · AWS
        </P>
        <P>
          I'm a full-stack software developer with a focus on React, TypeScript, and Node.js,
          and real experience shipping production software on AWS. I enjoy building things
          that actually get used - whether that's an AI-powered platform for teachers, a
          team-matching app for students, or an accessibility tool built with university researchers.
        </P>
        <P>
          Most recently I've been working as a frontend developer at HoneyBeeLogic, building an
          AI-powered K-12 lesson planning platform. Before that I completed my Software Development
          diploma at SAIT, where my capstone project had me engineering an entire full-stack
          application on my own - from database schema to cloud deployment.
        </P>
        <P>
          I'm strongest in TypeScript, React, NestJS, and PostgreSQL, and I've picked up new stacks
          before without too much friction. Currently looking for full-time software developer
          opportunities.
        </P>
      </>
    ),
  },

  experiences: {
    label: 'Experiences',
    color: '#eaf3ff',
    accent: '#3a8ec7',
    body: ({ P, Job }) => (
      <>
        <Job
          company="HoneyBeeLogic"
          role="Frontend Software Developer"
          when="May 2024 - Present · 2 yrs 1 mo"
          where="Calgary, Alberta, Canada"
        >
          <P>
            Frontend Developer on an AI-powered K-12 educational platform built with React,
            TypeScript, Vite, and Mantine UI. Led the full frontend development of <strong>CaseCraft</strong>,
            a tool that transforms case-study creation for educators - supporting customized
            scenario generation for K-12 and professional learning. Built an intuitive UI, integrated
            AI for scenario generation, implemented complex state management, and delivered
            multi-format document export (PDF, Word, plain text).
          </P>
          <P>
            Also contributed to <strong>Ally</strong>, which generates personalized learning plans
            based on curriculum outcomes, and helped establish the core frontend architecture for
            the broader HoneyBeeLogic toolkit - including AWS Cognito authentication and shared
            component structure across multiple AI-powered mini-apps.
          </P>
        </Job>

        <Job
          company="Ink, Toner & Moore"
          role="Software Developer"
          when="June 2025 - October 2025 · 5 mo"
          where="Calgary, AB"
        >
          <P>
            Built an internal web application for a local small business to digitize and streamline
            day-to-day operations, replacing manual processes and third-party workarounds with a
            single purpose-built tool.
          </P>
          <P>
            Features: PDF receipt generator handling complex scenarios like shipping receipts with
            destination-based tax calculation and variable costs; inventory tracking for keys and
            cartridges; a digital order-management system where customers could check their own
            order status; a unified package tracker for FedEx, Purolator and UPS; an internal notes
            system; and a quick-access directory.
          </P>
          <P>
            Hosted on GitHub Pages with Firebase as the backend - a completely free yet secure and
            fully functional solution. React, TypeScript, Vite, Tailwind CSS, React Router, React
            Hook Form, Zod.
          </P>
        </Job>

        <Job
          company="Southern Alberta Institute of Technology (SAIT)"
          role="Full-Stack Engineer · Capstone"
          when="January 2025 - April 2025 · 4 mo"
          where="Calgary, AB"
        >
          <P>
            Sole engineer on a 4-month SAIT capstone alongside a team of UI/UX and graphic designers.
            Built <strong>TeamUp</strong> from the ground up - a platform helping students find
            teammates and mentors from other majors for personal projects.
          </P>
          <P>
            Architected and built the entire backend and database system handling students, mentors,
            projects, skills, profiles, group management, and role-based access control. Designed
            the schema in PostgreSQL + TypeORM, built REST endpoints with NestJS, implemented JWT
            auth and full data persistence.
          </P>
          <P>
            On the frontend, faithfully translated my teammates' Figma designs into a production-ready
            React app. Integrated Google Gemini API for AI-powered skill matching - intentionally flexible
            so students from any major could describe their skills freely.
          </P>
          <P>
            Deployed on AWS: EC2 (Red Hat Linux) for the NestJS backend, RDS for PostgreSQL, Amplify
            for the React frontend; configured domain and DNS to make it publicly accessible.
          </P>
        </Job>

        <Job
          company="University of Calgary"
          role="Mobile Application Developer"
          when="July 2022 - August 2022 · 2 mo"
          where="Calgary, AB"
        >
          <P>
            Volunteered full-time under Dr. Far at the University of Calgary to build an
            accessibility-focused sidewalk navigation app for iOS and Android using React Native.
            Worked across both frontend and backend - Google Maps API integration, interactive
            pin-dropping UI for mapping sidewalk routes, Firebase authentication, and database
            connectivity.
          </P>
        </Job>

        <Job
          company="Meyar Keyfiat Co."
          role="Software Developer"
          when="July 2021 - December 2021 · 6 mo"
          where="Tehran, Iran"
        >
          <P>
            Developed a web application using Django + Python that let staff from different
            locations save and view real-time wagon inspection data. Focused on the backend -
            designing a scalable schema, optimizing queries, and rendering them efficiently.
          </P>
        </Job>
      </>
    ),
  },

  skills: {
    label: 'Skills',
    color: '#eef9ee',
    accent: '#3aa07a',
    body: ({ Section, Tag, Row }) => (
      <>
        <Section title="Languages & Databases" />
        <Row>
          {['TypeScript', 'JavaScript (ES6+)', 'Python', 'SQL', 'PostgreSQL', 'SQLite', 'Firebase', 'NoSQL']
            .map((t) => <Tag key={t}>{t}</Tag>)}
        </Row>
        <Section title="Frontend" />
        <Row>
          {['React', 'React Native', 'Vite', 'Mantine UI', 'HTML', 'CSS', 'Tailwind', 'React Hook Form', 'Zod']
            .map((t) => <Tag key={t}>{t}</Tag>)}
        </Row>
        <Section title="Backend" />
        <Row>
          {['Node.js', 'NestJS', 'TypeORM', 'Django', 'FastAPI', 'Flask']
            .map((t) => <Tag key={t}>{t}</Tag>)}
        </Row>
        <Section title="Cloud, DevOps & Tools" />
        <Row>
          {['AWS - EC2', 'AWS - RDS', 'AWS - Lambda', 'AWS - Amplify', 'AWS - Cognito',
            'Docker', 'CI/CD', 'Git', 'GitHub', 'Swagger', 'Linux', 'Figma']
            .map((t) => <Tag key={t}>{t}</Tag>)}
        </Row>
      </>
    ),
  },

  certificates: {
    label: 'Certificates',
    color: '#fff4e0',
    accent: '#e98a3a',
    body: ({ Section, P }) => (
      <>
        <Section title="Python Programming" />
        <P>Programming fundamentals, OOP, and data manipulation with Python.</P>
        <Section title="CompTIA Network+" />
        <P>Networking concepts, infrastructure, operations, security, and troubleshooting.</P>
        <Section title="Web Design" />
        <P>HTML, CSS, Dreamweaver, Bootstrap, JavaScript, and jQuery - full client-side web build.</P>
      </>
    ),
  },

  education: {
    label: 'Education',
    color: '#f3eaff',
    accent: '#7c5cc7',
    body: ({ Section, P }) => (
      <>
        <Section title="Southern Alberta Institute of Technology (SAIT)" />
        <P style={{ marginBottom: 4 }}><strong>Diploma - Software Development</strong></P>
        <P style={{ fontSize: 11, color: '#8a6a8c', marginBottom: 16 }}>September 2023 - April 2025 · Calgary</P>
        <P>
          Two-year diploma covering full-stack web development, software architecture, databases,
          networking, mobile development, and a 4-month capstone shipped on AWS.
        </P>
        <Section title="Activities" />
        <P><strong>Member</strong> - SAIT Student Code Club (SSC), 2025 · Calgary</P>
        <P><strong>Youth Coding Mentor</strong> - Calgary Public Library Code Club, 2022 · Calgary</P>
      </>
    ),
  },
};

// ── Project read-more panels (opened from the billboard "READ MORE" button) ──

export const PROJECT_DETAILS = {
  teamup: {
    label: 'TeamUp',
    color: '#fff4e0',
    accent: '#e98a3a',
    body: ({ Section, P, Tag, Row }) => (
      <>
        <Section title="Overview" />
        <P>
          <strong>TeamUp</strong> is a cross-disciplinary team-matching platform for students. It
          lets them post project ideas, find teammates from majors outside their own, and connect
          with professors willing to mentor. I built it as my SAIT capstone over 4 months as the
          sole engineer, alongside a team of UI/UX and graphic designers.
        </P>
        <Section title="The Problem" />
        <P>
          Almost every student has had this experience. You have a project idea, you need someone
          with a different skillset (a developer if you're a designer, a data scientist if you're
          in business), but your network is mostly people from your own program. The school is
          full of talented people; you just have no way to find them. TeamUp was built to fix
          that, like a mini LinkedIn scoped to your school and centered on project collaboration.
        </P>
        <Section title="What I Built" />
        <P>
          With all my teammates focused on design, I architected and built the entire backend and
          database. The domain ended up fairly involved: students, mentors, projects, skills,
          profiles, group management, and role-based access control. I designed the schema from
          scratch in PostgreSQL with TypeORM, built out the full REST API with NestJS, and
          implemented JWT authentication and persistence end to end.
        </P>
        <P>
          On the frontend, I translated my teammates' Figma designs into a production-ready React
          app, sticking faithfully to their vision rather than improvising. I also integrated the
          Google Gemini API for AI-powered skill matching, intentionally flexible so students from
          any major could describe their skills in their own words instead of picking from a
          fixed list.
        </P>
        <Section title="Deployment" />
        <P>
          The full stack runs on AWS: EC2 (Red Hat Linux) for the NestJS backend, RDS for
          PostgreSQL, and Amplify for the React frontend. I also configured the domain and DNS to
          make the application publicly accessible.
        </P>
        <Section title="Tech" />
        <Row>
          {['React', 'TypeScript', 'NestJS', 'PostgreSQL', 'TypeORM', 'JWT', 'AWS EC2', 'AWS RDS',
            'AWS Amplify', 'Google Gemini API', 'Figma'].map((t) => <Tag key={t}>{t}</Tag>)}
        </Row>
      </>
    ),
  },

  inktoner: {
    label: 'Ink, Toner & Moore',
    color: '#eaf3ff',
    accent: '#3a8ec7',
    body: ({ Section, P, Tag, Row }) => (
      <>
        <Section title="Overview" />
        <P>
          An internal web application I built for <strong>Ink, Toner & Moore</strong>, a local
          print and shipping shop, to digitize their day-to-day operations. The goal was to
          replace manual processes and a patchwork of third-party tools with one purpose-built
          system that fit the way the shop actually worked.
        </P>
        <Section title="Highlights" />
        <P>
          A PDF receipt generator that handles complex scenarios like shipping receipts with
          destination-based tax calculation and variable costs. Inventory tracking for keys and
          printer cartridges. A digital order management system where customers can look up their
          own order status without having to call in. A unified package tracker covering FedEx,
          Purolator, and UPS in one view. On top of that, an internal notes system and a quick
          access directory for staff.
        </P>
        <Section title="Architecture" />
        <P>
          Hosted on GitHub Pages with Firebase as the backend, which kept the whole thing
          completely free to run while still being secure and fully functional. Built with React,
          TypeScript, and Vite, styled with Tailwind CSS, routed with React Router, and using
          React Hook Form with Zod for validation.
        </P>
        <Section title="Tech" />
        <Row>
          {['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'React Router', 'React Hook Form',
            'Zod', 'Firebase', 'GitHub Pages'].map((t) => <Tag key={t}>{t}</Tag>)}
        </Row>
      </>
    ),
  },

  schedule: {
    label: 'SAIT Demure Selection',
    color: '#f3eaff',
    accent: '#7c5cc7',
    body: ({ Section, P, Tag, Row }) => (
      <>
        <Section title="Overview" />
        <P>
          A schedule generator I built for SAIT students to take the pain out of registration
          week. For any given set of courses there are an absurd number of possible section
          combinations, and most of them have weird two-hour gaps, awkward early mornings, or one
          lonely class on a Friday. Finding the genuinely good ones by hand is brutal.
        </P>
        <Section title="How It Works" />
        <P>
          You drop in a CSV of the course sections you're considering and the tool spits out every
          possible non-conflicting timetable, rendered on an interactive weekly calendar you can
          click through. Under the hood it's a recursive combination generator that groups
          sections by course, checks each candidate for time conflicts, and ranks the results.
        </P>
        <Section title="Preference Filters" />
        <P>
          On top of the raw generator, there's a filter layer so students can tune the output to
          their actual life: days off, morning vs. evening classes, online vs. in-person vs.
          hybrid delivery mix, and how tightly packed each day is.
        </P>
        <Section title="Architecture" />
        <P>
          The whole thing is client-side. React Context for state, React Big Calendar for the
          visualization, CSV validation on input, and zero backend. Hosted on GitHub Pages so it
          stays free, private, and instantly shareable with classmates.
        </P>
        <Section title="Why" />
        <P>
          The existing options for planning a SAIT schedule were either clunky or didn't exist,
          and registration was painful enough without spending a Sunday afternoon manually
          checking time conflicts in a spreadsheet.
        </P>
        <Section title="Tech" />
        <Row>
          {['React', 'TypeScript', 'Vite', 'Mantine UI', 'React Big Calendar', 'GitHub Pages']
            .map((t) => <Tag key={t}>{t}</Tag>)}
        </Row>
      </>
    ),
  },

  nl2sql: {
    label: 'Natural Queries',
    color: '#eef9ee',
    accent: '#3aa07a',
    body: ({ Section, P, Tag, Row }) => (
      <>
        <Section title="Overview" />
        <P>
          <strong>Natural Queries</strong> is a frontend prototype for an interactive SQL learning
          platform, built with the goal of making SQL feel less like reading a textbook and more
          like solving a story.
        </P>
        <Section title="Modes" />
        <P>
          <strong>Playground Mode</strong> lets users ask questions about a groundwater and
          well-analysis database in plain English and see the equivalent SQL alongside the
          results, so they can build intuition for how natural language maps onto real queries.
        </P>
        <P>
          <strong>Story Mode</strong> is a guided experience that walks learners through
          multi-chapter scenarios with context, tasks, hints, full solutions, and per-step
          explanations of the SQL concepts in play.
        </P>
        <Section title="Backstory" />
        <P>
          I originally pitched this as my SAIT capstone, but since my teammates were all UI/UX
          and graphic designers, the project didn't have enough frontend surface area for them
          and leaned a bit too technical for the team's strengths, so we ended up going with
          TeamUp instead. Natural Queries has stuck with me though, and it's a project I'd like
          to come back to and finish on my own.
        </P>
        <Section title="Engineering Notes" />
        <P>
          Since it's currently a prototype, the AI and database layers are simulated in the
          frontend with scripted responses and mock data, but the full UX, validation flow, and
          learning loop are functional end to end. The architecture is intentionally structured
          so a real LLM (Gemini or OpenAI) and a backend can be slotted in later without
          rewriting the UI.
        </P>
        <P>
          I also integrated Mermaid.js to render an interactive ER diagram of the underlying
          schema with zoom and pan controls, wrote a small SQL validator that normalizes and
          compares user queries against expected solutions to give meaningful feedback, set up
          lazy-loaded routes for faster initial loads, and configured a GitHub Actions workflow
          that builds the project and deploys it to GitHub Pages on every push to main.
        </P>
        <Section title="Tech" />
        <Row>
          {['React', 'TypeScript', 'Vite', 'Mantine UI', 'React Router', 'Mermaid.js',
            'GitHub Actions', 'GitHub Pages'].map((t) => <Tag key={t}>{t}</Tag>)}
        </Row>
      </>
    ),
  },

  parsajdev: {
    label: 'parsaj.dev',
    color: '#f5f1e8',
    accent: '#d18a4a',
    body: ({ Section, P, Tag, Row }) => (
      <>
        <Section title="Overview" />
        <P>
          The site you're reading right now. I wanted the homepage itself to be a project, not
          just a wrapper around one - so it borrows a bit from Stardew Valley and the weirder
          corners of the early web instead of looking like another templated dev portfolio.
        </P>
        <Section title="What's In It" />
        <P>
          The opening is a gravity-warped star field on canvas - the cursor pulls, pushes, or
          swirls the stars depending on the mode. The spiral transition is a sampled path you
          actually walk along, not a CSS tween. The landing scene is a small pastoral world:
          project billboards you can flip open, drifting clouds with hanging info banners, a pond
          with ripples and a frog hiding in the grass, plus the usual fireflies and butterflies.
        </P>
        <Section title="Constraints" />
        <P>
          No heavy framework, no CMS, no headless anything. One React page, plain SVG and canvas
          for the art, CSS animations for the ambient life. The point was to see if I could make
          something that felt custom without reaching for a templated stack.
        </P>
        <Section title="Tech" />
        <Row>
          {['React', 'Vite', 'Canvas', 'SVG', 'CSS Animations'].map((t) => <Tag key={t}>{t}</Tag>)}
        </Row>
      </>
    ),
  },
};
