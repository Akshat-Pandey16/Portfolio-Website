export const EMAIL = 'akshat16pandey@gmail.com';
export const GITHUB_USER = 'Akshat-Pandey16';
export const GITHUB_URL = 'https://github.com/Akshat-Pandey16';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/akshat16pandey/';
/* canonical job title — used verbatim everywhere (page title, JSON-LD, hero, ATS) */
export const ROLE = 'Data Platform Engineer';
/* honest availability — recruiters filter hard on this */
export const AVAILABILITY = 'Remote · open to relocation';
/* served same-origin from /public so the résumé view/download work.
   ⚠️ the PDF lives at: public/Akshat-Pandey-Resume.pdf */
export const RESUME_FILE = '/Akshat-Pandey-Resume.pdf';
export const RESUME_DOWNLOAD_NAME = 'Akshat-Pandey-Resume.pdf';

/* ⚠️ set this to your real deployed domain — powers canonical URL, OG/Twitter
   card, sitemap and JSON-LD (all in index.html). */
export const SITE_URL = 'https://akshat16pandey.netlify.app';

/* one-line positioning statement — reused in hero, meta description, JSON-LD */
export const TAGLINE =
  'I build the data & streaming platform behind a video-AI product — ingestion, async pipelines and the MLOps loop that keeps production models fed.';

/* ───────────────────────────── education & recognition ─────────────── */
export const EDUCATION = {
  degree: 'B.Tech, Computer Science',
  school: 'Bhilai Institute of Technology, Durg',
  period: '2020 — 2024',
  note: 'CPI 9.68',
};
export const AWARD = {
  title: "KAVACH'23",
  detail: 'Winner — inaugural nationwide cybersecurity hackathon, Government of India',
};

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
      'I own the Python backend at a computer-vision & video-analytics product company — and most of that work is data-platform: the streaming ingest, the async processing pipelines, and the data layers that production AI workloads run on. It is a small team, so I also coordinate delivery and pick up frontend when a feature needs it.',
    highlights: [
      'Architected the data & async layer — PostgreSQL, Redis, RabbitMQ, Celery — so video-processing and model-inference jobs run off the request path and the API stays responsive under load.',
      'Built the live-video ingest for a client-facing Video Management System: Django services with MediaMTX wired in for RTSP/WebRTC, streaming camera feeds and AI analytics into the app in real time.',
      'Built an internal MLOps pipeline (Django + React) that runs the full data loop — dataset upload → auto-labeling → human verification → re-training — so new models ship without ever leaving the tool.',
    ],
    stack: ['Python', 'Django', 'FastAPI', 'PostgreSQL', 'Redis', 'RabbitMQ', 'Celery', 'MediaMTX', 'Docker'],
    metrics: [
      { label: 'tenure', value: '2 yrs' },
      { label: 'focus', value: 'data platform' },
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
    title: 'onveef',
    blurb:
      'A fast, zeep-free ONVIF client library for IP cameras — how software discovers devices, pulls their stream URLs and drives PTZ, imaging and events. Every mainstream Python ONVIF library parses the WSDL/XSD at runtime; onveef hand-builds SOAP envelopes and parses responses with a sans-IO core, so it imports instantly and stays verifiable from recorded fixtures with no hardware. Two runtime deps (httpx + defusedxml), XXE-safe parsing, and coverage of ONVIF Profile S/T/G/M/A/C — device, media, PTZ, imaging, events, analytics and WS-Discovery.',
    link: 'https://github.com/Akshat-Pandey16/onveef',
    tags: ['ONVIF', 'Python', 'IP cameras', 'sans-IO'],
    year: '2026',
    status: 'active',
    featured: true,
  },
  {
    title: 'Papyrus',
    blurb:
      'A self-hostable, privacy-first PDF studio backed by an async job pipeline — merge, split, compress, OCR, reorder and rotate through a fast browser UI, with sign & redact on the way. A FastAPI API hands heavy work to Celery + Redis workers and an S3-compatible store; a zero-retention mode purges files on a TTL and document content is never logged.',
    link: 'https://github.com/Akshat-Pandey16/papyrus',
    tags: ['Pipeline', 'FastAPI', 'Celery', 'S3'],
    year: '2026',
    status: 'live',
    featured: true,
  },
  {
    title: 'MeshHawk',
    blurb:
      "Drop in a packet capture and MeshHawk reconstructs the 802.11 topology with scapy, scores every connected component for 'mesh-ness', and maps who's really talking to whom — a directed MAC graph in NetworkX, ARQ for the heavy parsing, and either a file upload or a live monitor-mode sniff as the ingest path. Runs local-first: the captures and graph analysis stay on your machine.",
    link: 'https://github.com/Akshat-Pandey16/MeshHawk',
    tags: ['Graph', 'FastAPI', 'scapy', 'NetworkX'],
    year: '2026',
    status: 'active',
  },
  {
    title: 'Hoctor',
    blurb:
      'Figures out which room a device is in from nothing but the surrounding Wi-Fi. Capture a signal fingerprint per room, train a per-venue scikit-learn random forest (cached and persisted to disk), then predict with confidence and per-room probabilities. No beacons, no extra hardware — and a mock scanner so the full stack runs in CI.',
    link: 'https://github.com/Akshat-Pandey16/Hoctor',
    tags: ['Machine Learning', 'Django', 'scikit-learn'],
    year: '2026',
    status: 'shipped',
  },
  {
    title: 'FOSSLove',
    blurb:
      'A catalog of free & open-source apps for Windows and Linux that builds you one ready-to-run install script across the right package managers (winget, APT, DNF, pacman, Flatpak, Snap). A FastAPI + async SQLAlchemy + PostgreSQL + Redis backend behind a Next.js 16 / React 19 front end, with accounts, shareable public collections, JWT + Argon2id auth, and an admin panel whose feature flags and rate limits are editable without a redeploy.',
    link: 'https://github.com/Akshat-Pandey16/fosslove',
    tags: ['Full-stack', 'FastAPI', 'PostgreSQL', 'Next.js'],
    year: '2026',
    status: 'active',
  },
  {
    title: 'HeadTogether',
    blurb:
      'A location-native social app built on geo-bounded rooms: ephemeral chat spaces anchored to a real-world spot that only people inside the radius can discover. Realtime over WebSockets with idempotent sends and cursor-based recovery — presence, reactions, replies, pins, typing, DMs and auto-promoting waitlists — with Redis pub/sub and Argon2id. A 2023 hackathon idea rebuilt end-to-end.',
    link: 'https://github.com/Akshat-Pandey16/HeadTogether',
    tags: ['Realtime', 'FastAPI', 'WebSockets', 'Redis'],
    year: '2026',
    status: 'active',
  },
  {
    title: 'ShieldBuntu',
    blurb:
      'One-click Ubuntu CIS hardening, driven from a local browser. A FastAPI daemon discovers 16 idempotent, CIS-mapped Ansible roles and exposes apply / dry-run / check / revert as a typed API, streaming every Ansible event back live over SSE with replay-from-sequence. Snapshot-based reverts, a concurrency-safe orchestrator, and PAM auth.',
    link: 'https://github.com/Akshat-Pandey16/ShieldBuntu',
    tags: ['Security', 'FastAPI', 'Ansible', 'SSE'],
    year: '2026',
    status: 'active',
  },
];

/* small repos that prove the foundations */
export const LAB_REPOS: Project[] = [
  {
    title: 'fastapi-boilerplate',
    blurb:
      'A production-grade FastAPI starter and the foundation I reach for: async SQLAlchemy 2.0, Pydantic v2, a layered api → service → repository architecture, RFC 7807 errors, structlog, Alembic, multi-stage Docker, and CI with ruff + mypy --strict.',
    link: 'https://github.com/Akshat-Pandey16/fastapi-boilerplate',
    tags: ['FastAPI', 'SQLAlchemy', 'Docker'],
    year: '2026',
    status: 'active',
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

/* ───────────────────────────── earlier roles ───────────────────── */
/* internships — for a complete career picture ahead of Intozi */
export type PastRole = { org: string; role: string; period: string; note: string };

export const PAST_ROLES: PastRole[] = [
  { org: 'Steel Authority of India', role: 'Flutter Developer Intern', period: '2023', note: 'mobile app development' },
  { org: 'DRDO', role: 'R&D Intern', period: '2022', note: 'geospatial terrain analysis' },
];
