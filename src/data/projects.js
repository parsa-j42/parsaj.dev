// Billboards on the portfolio scene. The accent color is shared with the
// matching read-more panel in ./content.js (so the project's "color" stays
// consistent between billboard and modal).

export const PROJECTS = [
  {
    id: 'teamup',
    name: 'TeamUp',
    tagline: 'Cross-disciplinary team matching for students',
    description:
      'A platform for students to find teammates and mentors from outside their own major, built solo as a SAIT capstone in 4 months. NestJS and PostgreSQL backend, a React frontend translated from a team of designers’ Figma, AI-powered skill matching via Google Gemini, and a full deployment on AWS.',
    link: '#',
    tech: ['React', 'TypeScript', 'NestJS', 'PostgreSQL', 'AWS', 'Gemini'],
    accent: '#e98a3a',
    pos: { left: '7%', top: '36%' },
    rotate: -3,
    kind: 'billboard',
  },
  {
    id: 'inktoner',
    name: 'Ink, Toner & Moore',
    tagline: 'Internal ops app for a local print shop',
    description:
      'A purpose-built internal web app that replaced manual processes and third-party workarounds at a local print and shipping store. PDF receipt generation with destination-based tax math, inventory tracking, a customer order portal, and a unified package tracker covering FedEx, Purolator, and UPS.',
    link: '#',
    tech: ['React', 'TypeScript', 'Vite', 'Tailwind', 'Firebase'],
    accent: '#3a8ec7',
    pos: { right: '6%', top: '31%' },
    rotate: 4,
    kind: 'shop',
  },
  {
    id: 'schedule',
    name: 'SAIT Demure Selection',
    tagline: 'Generate every viable SAIT timetable',
    description:
      'A client-side schedule generator for SAIT students. Drop in a CSV of course sections and get every non-conflicting weekly timetable, ranked by your preferences for days off, time of day, delivery mode, and how tightly packed each day is.',
    link: '#',
    tech: ['React', 'TypeScript', 'Vite', 'Mantine UI'],
    accent: '#7c5cc7',
    pos: { left: '8%', bottom: '6%' },
    rotate: 2,
    kind: 'scroll',
  },
  {
    id: 'nl2sql',
    name: 'Natural Queries',
    tagline: 'Learn SQL by asking questions',
    description:
      'A frontend prototype for an interactive SQL learning app. A Playground mode that translates plain-English questions into SQL against a groundwater dataset, and a guided Story Mode with multi-chapter scenarios, hints, validation, and step-by-step explanations of the SQL in play.',
    link: '#',
    tech: ['React', 'TypeScript', 'Vite', 'Mantine UI', 'Mermaid.js'],
    accent: '#3aa07a',
    pos: { right: '12%', bottom: '10%' },
    rotate: -2,
    kind: 'book',
  },
  {
    id: 'parsajdev',
    name: 'parsaj.dev',
    tagline: 'The site you are reading right now',
    description:
      'An interactive portfolio that takes some cues from Stardew Valley and the weirder corners of the early web. A gravity-warped star field you can mess with, a spiral intro you walk along, and a little pastoral landing scene with billboards, clouds, and a pond. All on a single React page.',
    link: 'https://parsaj.dev',
    tech: ['React', 'Vite', 'Canvas', 'SVG'],
    accent: '#d18a4a',
    pos: { left: '40%', bottom: '4%' },
    rotate: -1,
    kind: 'plaque',
  },
];
