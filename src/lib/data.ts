export const EMAIL = 'akshat16pandey@gmail.com';
export const GITHUB_USER = 'Akshat-Pandey16';
export const GITHUB_URL = 'https://github.com/Akshat-Pandey16';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/akshat16pandey/';
/* canonical job title — used verbatim everywhere (page title, JSON-LD, hero, ATS) */
export const ROLE = 'Backend Engineer';
/* honest availability — recruiters filter hard on this */
export const AVAILABILITY = 'Remote · open to relocation';
/* served same-origin from /public so the résumé view/download work.
   ⚠️ the PDF lives at: public/Akshat-Pandey-Resume.pdf */
export const RESUME_FILE = '/Akshat-Pandey-Resume.pdf';
export const RESUME_DOWNLOAD_NAME = 'Akshat-Pandey-Resume.pdf';

/* ⚠️ set this to your real deployed domain — powers canonical URL, OG/Twitter
   card, sitemap and JSON-LD (all in index.html). */
export const SITE_URL = 'https://akshatpandey.dev';

/* ───────────────────────────── experience ──────────────────────── */
export type Experience = {
  organization: string;
  role: string;
  period: string;
  location?: string;
  status: 'live' | 'shipped';
  description: string;
  highlights: string[];
  stack: string[];
  metrics: { label: string; value: string }[];
  link?: string;
};

export const EXPERIENCES: Experience[] = [
  {
    organization: 'Intozi Tech',
    role: ROLE,
    period: 'Jun 2024 — Present',
    location: 'Gurugram, India',
    status: 'live',
    description:
      'I own the backend at a computer-vision and video-analytics product company — the Python services across the product line, including the core analytics engine, Ikshana — and keep frontend and feature delivery moving inside a small, fast team.',
    highlights: [
      'Own the backend of a client-facing Video Management System — Django services with MediaMTX wired in for RTSP/WebRTC, streaming live camera feeds and AI analytics into the app in real time.',
      'Moved video-processing and AI inference off the request path with Celery, RabbitMQ and Redis, so the API stays responsive while heavy jobs run asynchronously in the background.',
      'Built an internal MLOps platform (Django + React) that runs the full loop — dataset upload, auto-labeling, human verification and re-training — so new models ship without ever leaving the tool.',
    ],
    stack: ['Python', 'Django', 'PostgreSQL', 'Redis', 'RabbitMQ', 'Celery', 'MediaMTX', 'Docker'],
    metrics: [
      { label: 'tenure', value: '2 yrs' },
      { label: 'role', value: 'backend' },
      { label: 'domain', value: 'video AI' },
    ],
  },
];

/* ───────────────────────────── projects ────────────────────────── */
export type Project = {
  title: string;
  blurb: string;
  link: string;
  tags: string[];
  year: string;
  status: 'live' | 'active' | 'shipped';
  featured?: boolean;
};

export const PROJECTS: Project[] = [
  {
    title: 'Papyrus',
    blurb:
      'An open-source, self-hostable PDF workshop that runs in your browser — merge, split, compress, rotate, reorder and OCR, with sign & redact on the way — and a zero-retention mode that purges every file on a timer. A FastAPI + Celery pipeline does the heavy lifting, and document content is never logged.',
    link: 'https://github.com/Akshat-Pandey16/papyrus',
    tags: ['Full-stack', 'FastAPI', 'Celery', 'Privacy'],
    year: '2026',
    status: 'live',
    featured: true,
  },
  {
    title: 'HeadTogether',
    blurb:
      'A location-native social app built on geo-bounded rooms: ephemeral spaces pinned to a real-world spot that only people inside the radius can find. Realtime chat with presence, reactions, typing, DMs and auto-promoting waitlists — a 2023 hackathon idea rebuilt end-to-end.',
    link: 'https://github.com/Akshat-Pandey16/HeadTogether',
    tags: ['Full-stack', 'Realtime', 'FastAPI'],
    year: '2024',
    status: 'active',
  },
  {
    title: 'ShieldBuntu',
    blurb:
      'One-click Ubuntu hardening, driven from a local browser. A FastAPI daemon turns 16 CIS-mapped Ansible roles into apply / dry-run / revert actions and streams every Ansible event back live over SSE — with snapshot-based reverts and PAM auth.',
    link: 'https://github.com/Akshat-Pandey16/ShieldBuntu',
    tags: ['Security', 'FastAPI', 'Ansible'],
    year: '2024',
    status: 'active',
  },
  {
    title: 'Hoctor',
    blurb:
      'Figures out which room a device is in from nothing but the surrounding Wi-Fi — capture a fingerprint per room, train a per-venue random forest, and predict with confidence scores. No beacons, no extra hardware, ships with a mock scanner so it runs anywhere.',
    link: 'https://github.com/Akshat-Pandey16/Hoctor',
    tags: ['Machine Learning', 'Django', 'scikit-learn'],
    year: '2025',
    status: 'shipped',
  },
  {
    title: 'MeshHawk',
    blurb:
      "Feed it a packet capture and it rebuilds the 802.11 topology with scapy + networkx, scores every cluster for 'mesh-ness', and maps who's really talking to whom — entirely local, nothing ever leaves the machine.",
    link: 'https://github.com/Akshat-Pandey16/MeshHawk',
    tags: ['Networking', 'FastAPI', 'scapy'],
    year: '2023',
    status: 'shipped',
  },
];

/* small backend-only repos that prove the foundations */
export const LAB_REPOS: Project[] = [
  {
    title: 'fastapi-boilerplate',
    blurb:
      'A production-grade FastAPI starter: async SQLAlchemy 2.0, Pydantic v2, RFC 7807 errors, a layered api → service → repository architecture, structlog, Alembic and multi-stage Docker. The foundation I reach for.',
    link: 'https://github.com/Akshat-Pandey16/fastapi-boilerplate',
    tags: ['FastAPI', 'SQLAlchemy', 'Docker'],
    year: '2025',
    status: 'active',
  },
  {
    title: 'sqs-fastapi-service',
    blurb:
      'A focused service that ingests SQS messages into Redis and serves them back through FastAPI — a clean reference for queue-to-cache fan-in patterns.',
    link: 'https://github.com/Akshat-Pandey16/sqs-fastapi-service',
    tags: ['FastAPI', 'Redis', 'AWS'],
    year: '2025',
    status: 'shipped',
  },
];

/* ───────────────────────────── contact ─────────────────────────── */
export type ContactLink = {
  label: string;
  value: string;
  href: string;
  icon: 'resume' | 'github' | 'linkedin' | 'email';
};

export const CONTACT_LINKS: ContactLink[] = [
  { label: 'Resume', value: 'PDF · view & download', href: RESUME_FILE, icon: 'resume' },
  { label: 'GitHub', value: 'Akshat-Pandey16', href: GITHUB_URL, icon: 'github' },
  { label: 'LinkedIn', value: 'akshat16pandey', href: LINKEDIN_URL, icon: 'linkedin' },
  { label: 'Email', value: EMAIL, href: `mailto:${EMAIL}`, icon: 'email' },
];
