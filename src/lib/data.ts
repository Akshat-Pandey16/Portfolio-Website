import type { IconType } from 'react-icons';
import {
  SiPython,
  SiGnubash,
  SiFastapi,
  SiDjango,
  SiPostgresql,
  SiRedis,
  SiRabbitmq,
  SiCelery,
  SiDocker,
  SiNginx,
  SiLinux,
  SiGit,
} from 'react-icons/si';
import { FaAws } from 'react-icons/fa';
import Pa from '../assets/projects/Papyrus.svg';
import Sb from '../assets/projects/SB.webp';
import Mh from '../assets/projects/MH.webp';
import Ht from '../assets/projects/HT.webp';
import Hc from '../assets/projects/HC.webp';
import DrdoLogo from '../assets/internships/DRDO.webp';
import SailLogo from '../assets/internships/SAIL.webp';

export const EMAIL = 'akshat16pandey@gmail.com';
export const GITHUB_USER = 'Akshat-Pandey16';
export const GITHUB_URL = 'https://github.com/Akshat-Pandey16';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/akshat16pandey/';
/* canonical job title — used verbatim everywhere (page title, JSON-LD, hero, ATS) */
export const ROLE = 'Backend Engineer';
/* honest availability — recruiters filter hard on this */
export const AVAILABILITY = 'Remote · open to relocation';
/* direct-download form of the Drive link so "Download résumé" actually downloads */
export const RESUME_URL =
  'https://drive.google.com/uc?export=download&id=15GuXe4ZxjM2FMZhDFf4CR-62Sbbe6LNS';

/* ⚠️ set this to your real deployed domain — powers canonical URL, OG/Twitter
   card, sitemap and JSON-LD. Change the one constant; everything follows. */
export const SITE_URL = 'https://akshatpandey.dev';

/* primary label is the mission-control callsign; `plain` is the word a recruiter
   actually scans for, shown as a quiet subtitle so we keep the theme AND the clarity. */
export type NavSection = { id: string; label: string; plain: string };

export const NAV_SECTIONS: NavSection[] = [
  { id: 'about', label: 'Profile', plain: 'About' },
  { id: 'projects', label: 'Services', plain: 'Projects' },
  { id: 'experience', label: 'Deployment', plain: 'Experience' },
  { id: 'skills', label: 'Stack', plain: 'Skills' },
  { id: 'why-hire', label: 'Runbook', plain: 'Why hire me' },
  { id: 'contact', label: 'Uplink', plain: 'Contact' },
];

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
  logo?: string;
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
      'Building the backend for a client-facing Video Management System — Django services with MediaMTX wired in for RTSP/WebRTC, so live camera feeds and AI analytics land in the app in real time.',
      'Architected the data and async layers — PostgreSQL, Redis, RabbitMQ and Celery — to push video-processing and AI workloads off the request path, keeping the services responsive under load.',
      'Built an internal MLOps pipeline (Django + React) that runs the full loop: dataset upload, auto-labeling, human verification and training / retraining, with a path to client-facing deployment.',
    ],
    stack: ['Python', 'Django', 'PostgreSQL', 'Redis', 'RabbitMQ', 'Celery', 'MediaMTX', 'Docker'],
    metrics: [
      { label: 'tenure', value: '2 yrs' },
      { label: 'role', value: 'backend' },
      { label: 'domain', value: 'video AI' },
    ],
  },
  {
    organization: 'Steel Authority of India',
    role: 'Flutter Developer Intern',
    period: '2023',
    location: 'SAIL · India',
    status: 'shipped',
    description:
      'Built a cross-platform mobile app that streamlined maintenance workflows across plant operations at one of India’s largest public-sector steel producers.',
    highlights: [
      'Shipped the Flutter client end to end against an in-house Node.js API.',
      'Modelled the data layer on top of an existing OracleDB without breaking legacy systems.',
      'Worked across engineering teams to scope, validate and hand off the build.',
    ],
    stack: ['Flutter', 'Node.js', 'OracleDB'],
    metrics: [
      { label: 'year', value: '2023' },
      { label: 'role', value: 'mobile' },
      { label: 'domain', value: 'plant ops' },
    ],
    logo: SailLogo,
    link: 'https://github.com/Akshat-Pandey16/MES-SAIL',
  },
  {
    organization: 'DRDO',
    role: 'Research & Development Intern',
    period: '2022',
    location: 'Defence R&D Organisation · India',
    status: 'shipped',
    description:
      'Worked on terrain-analysis pipelines for India’s premier defence research agency, accelerating ridge and spur detection for downstream geospatial research.',
    highlights: [
      'Built Python tooling around QGIS to automate DEM (Digital Elevation Model) processing.',
      'Turned researcher intent into reproducible scripts the team could run unattended.',
    ],
    stack: ['Python', 'QGIS', 'Geospatial'],
    metrics: [
      { label: 'year', value: '2022' },
      { label: 'role', value: 'research' },
      { label: 'domain', value: 'geospatial' },
    ],
    logo: DrdoLogo,
  },
];

/* ───────────────────────────── projects (services) ─────────────── */
export type Project = {
  title: string;
  blurb: string;
  image?: string;
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
    image: Pa,
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
    image: Ht,
    link: 'https://github.com/Akshat-Pandey16/HeadTogether',
    tags: ['Full-stack', 'Realtime', 'FastAPI'],
    year: '2024',
    status: 'active',
  },
  {
    title: 'ShieldBuntu',
    blurb:
      'One-click Ubuntu hardening, driven from a local browser. A FastAPI daemon turns 16 CIS-mapped Ansible roles into apply / dry-run / revert actions and streams every Ansible event back live over SSE — with snapshot-based reverts and PAM auth.',
    image: Sb,
    link: 'https://github.com/Akshat-Pandey16/ShieldBuntu',
    tags: ['Security', 'FastAPI', 'Ansible'],
    year: '2024',
    status: 'active',
  },
  {
    title: 'Hoctor',
    blurb:
      'Figures out which room a device is in from nothing but the surrounding Wi-Fi — capture a fingerprint per room, train a per-venue random forest, and predict with confidence scores. No beacons, no extra hardware, ships with a mock scanner so it runs anywhere.',
    image: Hc,
    link: 'https://github.com/Akshat-Pandey16/Hoctor',
    tags: ['Machine Learning', 'Django', 'scikit-learn'],
    year: '2025',
    status: 'shipped',
  },
  {
    title: 'MeshHawk',
    blurb:
      "Feed it a packet capture and it rebuilds the 802.11 topology with scapy + networkx, scores every cluster for 'mesh-ness', and maps who's really talking to whom — entirely local, nothing ever leaves the machine.",
    image: Mh,
    link: 'https://github.com/Akshat-Pandey16/MeshHawk',
    tags: ['Networking', 'FastAPI', 'scapy'],
    year: '2023',
    status: 'shipped',
  },
];

/* small backend-only repos that prove the foundations — rendered as
   terminal "service" cards with no preview image */
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

/* ───────────────────────────── the stack (service topology) ────── */
export type StackNode = {
  id: string;
  label: string;
  Icon: IconType;
  level: number;
  note: string;
  col: number; // 0..3, left → right pipeline
  row: number; // relative vertical offset within the column, centered at 0
};

/* a real request trace through the stack I build with */
export const STACK_NODES: StackNode[] = [
  { id: 'python', label: 'Python', Icon: SiPython, level: 93, note: 'the language home base', col: 0, row: 0 },
  { id: 'fastapi', label: 'FastAPI', Icon: SiFastapi, level: 91, note: 'async APIs, typed end to end', col: 1, row: -0.62 },
  { id: 'django', label: 'Django', Icon: SiDjango, level: 86, note: 'batteries-included services', col: 1, row: 0.62 },
  { id: 'celery', label: 'Celery', Icon: SiCelery, level: 84, note: 'work off the request path', col: 2, row: -0.62 },
  { id: 'rabbitmq', label: 'RabbitMQ', Icon: SiRabbitmq, level: 76, note: 'the message broker', col: 2, row: 0.62 },
  { id: 'redis', label: 'Redis', Icon: SiRedis, level: 82, note: 'cache + result backend', col: 3, row: -0.62 },
  { id: 'postgres', label: 'PostgreSQL', Icon: SiPostgresql, level: 89, note: 'where the truth lives', col: 3, row: 0.62 },
];

export const STACK_EDGES: [string, string][] = [
  ['python', 'fastapi'],
  ['python', 'django'],
  ['fastapi', 'celery'],
  ['django', 'celery'],
  ['fastapi', 'redis'],
  ['fastapi', 'postgres'],
  ['django', 'postgres'],
  ['celery', 'rabbitmq'],
  ['celery', 'redis'],
  ['celery', 'postgres'],
];

/* infrastructure base — the boxes the code runs on */
export const STACK_INFRA: { id: string; label: string; Icon: IconType; level: number }[] = [
  { id: 'docker', label: 'Docker', Icon: SiDocker, level: 84 },
  { id: 'linux', label: 'Linux', Icon: SiLinux, level: 87 },
  { id: 'nginx', label: 'Nginx', Icon: SiNginx, level: 74 },
  { id: 'aws', label: 'AWS', Icon: FaAws, level: 73 },
  { id: 'git', label: 'Git', Icon: SiGit, level: 89 },
  { id: 'bash', label: 'Bash', Icon: SiGnubash, level: 81 },
];

/* extra tokens that scroll past in the ticker */
export const MARQUEE = [
  'Python', 'FastAPI', 'Django', 'Celery', 'PostgreSQL', 'Redis', 'RabbitMQ',
  'Docker', 'AWS', 'Nginx', 'Linux', 'Git', 'Bash', 'WebRTC', 'MediaMTX',
  'SQLAlchemy', 'Pydantic', 'asyncpg', 'OpenAPI', 'pytest', 'SQL', 'uv',
];

/* ───────────────────────────── about stats ─────────────────────── */
export type Stat = {
  label: string;
  to: number;
  suffix?: string;
  literal?: string;
  hint: string;
};

export const STATS: Stat[] = [
  { label: 'years shipping code', to: 6, suffix: '+', hint: 'since 2020' },
  { label: 'at Intozi Tech', to: 2, suffix: ' yrs', hint: 'backend engineer' },
  { label: 'public repositories', to: 12, hint: 'open source' },
  { label: "KAVACH'23 national hackathon", to: 0, literal: 'WON', hint: 'Govt. of India' },
];

/* ───────────────────────────── runbook (how I work) ────────────── */
export type Reason = { tag: string; title: string; body: string };

export const REASONS: Reason[] = [
  {
    tag: 'adaptability',
    title: 'I pick up stacks fast',
    body:
      'RTSP/WebRTC streaming, Ansible, scapy, scikit-learn, a fresh frontend framework — I move into unfamiliar territory without ceremony. This deck I rebuilt from scratch just to sharpen the craft.',
  },
  {
    tag: 'architecture',
    title: 'I think backend-first',
    body:
      'Most of my comfort is in APIs, data and the boring parts that have to be right before the UI matters. I write the schema before I write the screen, and I keep it honest.',
  },
  {
    tag: 'ownership',
    title: 'I lead under pressure',
    body:
      "Hackathon ownership with receipts — winning KAVACH'23, the Government of India's national cybersecurity hackathon — plus a stack of honest learnings. I am comfortable being the one who decides.",
  },
  {
    tag: 'craft',
    title: 'I sweat the small things',
    body:
      'Tabs, spacing, copy, edge cases. The small things compound into a product that feels considered. I would rather ship less and actually finish it.',
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
  { label: 'Resume', value: 'PDF · Google Drive', href: RESUME_URL, icon: 'resume' },
  { label: 'GitHub', value: 'Akshat-Pandey16', href: GITHUB_URL, icon: 'github' },
  { label: 'LinkedIn', value: 'akshat16pandey', href: LINKEDIN_URL, icon: 'linkedin' },
  { label: 'Email', value: EMAIL, href: `mailto:${EMAIL}`, icon: 'email' },
];
