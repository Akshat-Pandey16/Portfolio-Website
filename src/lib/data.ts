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

export type NavSection = {
  id: string;
  label: string;
};

export const NAV_SECTIONS: NavSection[] = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'why-hire', label: 'How I work' },
  { id: 'contact', label: 'Contact' },
];

export type Experience = {
  organization: string;
  role: string;
  period: string;
  location?: string;
  description: string;
  highlights: string[];
  stack: string[];
  logo?: string;
  link?: string;
};

export const EXPERIENCES: Experience[] = [
  {
    organization: 'Intozi Tech',
    role: 'Backend Developer',
    period: 'Jun 2024 — Present',
    location: 'Gurugram, India',
    description:
      'Lead backend at a computer-vision and video-analytics product company — owning the Python services across its products, including the core analytics product, Ikshana, and coordinating frontend and feature delivery inside a small team.',
    highlights: [
      'Building the backend for a client-facing Video Management System — Django services with MediaMTX wired in for RTSP/WebRTC streaming, so live camera feeds and AI analytics surface in the app in real time.',
      'Architected the data and async layers — PostgreSQL, Redis, RabbitMQ and Celery — to push video-processing jobs and AI workloads off the request path for responsive, scalable services.',
      'Built an internal MLOps pipeline (Django + React) covering dataset upload, auto-labeling, human verification and training/retraining, with a path to client-facing deployment.',
    ],
    stack: ['Python', 'Django', 'PostgreSQL', 'Redis', 'RabbitMQ', 'Celery', 'MediaMTX'],
  },
];

export type Project = {
  title: string;
  blurb: string;
  image: string;
  link: string;
  tags: string[];
  year: string;
  featured?: boolean;
};

export const PROJECTS: Project[] = [
  {
    title: 'Papyrus',
    blurb:
      'A self-hostable, privacy-first PDF toolkit — merge, split, compress, rotate, reorder and OCR — that runs in the browser with no signup. An async Celery pipeline does the heavy lifting, and a zero-retention mode purges your files on a timer so nothing lingers.',
    image: Pa,
    link: 'https://github.com/Akshat-Pandey16/papyrus',
    tags: ['Full-stack', 'FastAPI', 'Privacy'],
    year: '2026',
    featured: true,
  },
  {
    title: 'HeadTogether',
    blurb:
      'A social app built on geo-bounded rooms — ephemeral chat spaces pinned to a real-world spot that only people inside the radius can find. Real-time messaging over WebSockets with a Redis pub/sub fanout.',
    image: Ht,
    link: 'https://github.com/Akshat-Pandey16/HeadTogether',
    tags: ['Full-stack', 'Real-time', 'FastAPI'],
    year: '2024',
  },
  {
    title: 'ShieldBuntu',
    blurb:
      'One-click Ubuntu hardening that turns CIS Benchmark controls into 16 idempotent Ansible roles — each with apply, dry-run and snapshot revert. A FastAPI daemon runs them and streams every step back to the browser live.',
    image: Sb,
    link: 'https://github.com/Akshat-Pandey16/ShieldBuntu',
    tags: ['Security', 'FastAPI', 'Linux'],
    year: '2024',
  },
  {
    title: 'Hoctor',
    blurb:
      "Figures out which room you're in from nothing but the surrounding Wi-Fi signals. Capture a fingerprint per room, train a per-venue classifier, and it predicts your location with confidence scores — no beacons or extra hardware.",
    image: Hc,
    link: 'https://github.com/Akshat-Pandey16/Hoctor',
    tags: ['Machine Learning', 'Django', 'Full-stack'],
    year: '2025',
  },
  {
    title: 'MeshHawk',
    blurb:
      'Feed it a packet capture and it rebuilds the 802.11 topology, works out which clusters are actually meshing, and exports a printable PDF report. Everything runs locally — your captures never leave the machine.',
    image: Mh,
    link: 'https://github.com/Akshat-Pandey16/MeshHawk',
    tags: ['Networking', 'FastAPI', 'Security'],
    year: '2023',
  },
];

export type Skill = {
  name: string;
  Icon: IconType;
  level: number;
};

export type SkillGroup = {
  label: string;
  caption: string;
  skills: Skill[];
};

export const SKILL_GROUPS: SkillGroup[] = [
  {
    label: 'Languages & frameworks',
    caption: 'The keyboard end of the day-to-day.',
    skills: [
      { name: 'Python', Icon: SiPython, level: 92 },
      { name: 'FastAPI', Icon: SiFastapi, level: 90 },
      { name: 'Django', Icon: SiDjango, level: 85 },
      { name: 'Bash', Icon: SiGnubash, level: 80 },
    ],
  },
  {
    label: 'Data & async',
    caption: 'Where the system keeps its memory — and does its waiting.',
    skills: [
      { name: 'PostgreSQL', Icon: SiPostgresql, level: 88 },
      { name: 'Redis', Icon: SiRedis, level: 80 },
      { name: 'Celery', Icon: SiCelery, level: 82 },
      { name: 'RabbitMQ', Icon: SiRabbitmq, level: 75 },
    ],
  },
  {
    label: 'Infrastructure',
    caption: 'The boxes the code actually runs on.',
    skills: [
      { name: 'Docker', Icon: SiDocker, level: 82 },
      { name: 'Linux', Icon: SiLinux, level: 86 },
      { name: 'AWS', Icon: FaAws, level: 72 },
      { name: 'Nginx', Icon: SiNginx, level: 72 },
      { name: 'Git', Icon: SiGit, level: 88 },
    ],
  },
];

export type ContactLink = {
  label: string;
  href: string;
  icon: 'resume' | 'github' | 'linkedin' | 'email';
};

export const CONTACT_LINKS: ContactLink[] = [
  {
    label: 'Resume',
    href: 'https://drive.google.com/file/d/1AB5wbR75BfJ3VMbgNqaa94Rv9sGOf53-/view?usp=drivesdk',
    icon: 'resume',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/Akshat-Pandey16',
    icon: 'github',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/akshat16pandey/',
    icon: 'linkedin',
  },
  {
    label: 'Email',
    href: 'mailto:akshat16pandey@gmail.com',
    icon: 'email',
  },
];

export const EMAIL = 'akshat16pandey@gmail.com';
export const RESUME_URL =
  'https://drive.google.com/file/d/1AB5wbR75BfJ3VMbgNqaa94Rv9sGOf53-/view?usp=drivesdk';
