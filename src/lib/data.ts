import type { IconType } from 'react-icons';
import {
  SiPython,
  SiFastapi,
  SiDjango,
  SiReact,
  SiPostgresql,
  SiRedis,
  SiRabbitmq,
  SiNginx,
  SiLinux,
} from 'react-icons/si';
import { FaAws } from 'react-icons/fa';
import SAIL from '../assets/internships/SAIL.webp';
import DRDO from '../assets/internships/DRDO.webp';
import Sb from '../assets/projects/SB.webp';
import Mh from '../assets/projects/MH.webp';
import Ht from '../assets/projects/HT.webp';
import Hc from '../assets/projects/HC.webp';
import Fc from '../assets/projects/FC.webp';

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
  description: string;
  highlights: string[];
  stack: string[];
  logo: string;
  link?: string;
};

export const EXPERIENCES: Experience[] = [
  {
    organization: 'Steel Authority of India Limited',
    role: 'Flutter Developer Intern',
    period: '2023',
    description:
      'Led development of a cross-platform mobile application that streamlined maintenance workflows across plant operations.',
    highlights: [
      'Shipped the Flutter client end-to-end against an in-house Node.js API.',
      'Modelled the data layer on top of an existing OracleDB without breaking legacy systems.',
      'Coordinated with engineers across teams to scope and validate the build.',
    ],
    stack: ['Flutter', 'Node.js', 'OracleDB'],
    logo: SAIL,
    link: 'https://github.com/Akshat-Pandey16/MES-SAIL',
  },
  {
    organization: 'Defence Research and Development Organisation',
    role: 'Research & Development Intern',
    period: '2022',
    description:
      'Worked on terrain analysis pipelines to accelerate ridge and spur detection for downstream geospatial research.',
    highlights: [
      'Built Python tooling around QGIS to automate DEM (Digital Elevation Model) processing.',
      'Translated researcher intent into reproducible scripts the team could run unattended.',
    ],
    stack: ['Python', 'QGIS', 'Geospatial'],
    logo: DRDO,
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
    title: 'ShieldBuntu',
    blurb:
      'A hardening toolkit for Ubuntu that bundles secure-by-default configurations behind a simple UI. Built for non-experts who still want a sane baseline.',
    image: Sb,
    link: 'https://github.com/Akshat-Pandey16/ShieldBuntu',
    tags: ['Security', 'Linux', 'Python'],
    year: '2024',
    featured: true,
  },
  {
    title: 'MeshHawk',
    blurb:
      'Mesh-network monitoring concept giving operators a live view of node health and routing.',
    image: Mh,
    link: 'https://github.com/Akshat-Pandey16/MeshHawk',
    tags: ['Networking', 'Backend'],
    year: '2024',
  },
  {
    title: 'HeadTogether',
    blurb:
      'Scheduling, polls and chat collapsed into one focused workspace.',
    image: Ht,
    link: 'https://github.com/Akshat-Pandey16/HeadTogether',
    tags: ['Product', 'Full-stack'],
    year: '2023',
  },
  {
    title: 'Hoctor',
    blurb:
      'Healthcare assistant prototype that helps clinicians log and revisit interactions.',
    image: Hc,
    link: 'https://github.com/Akshat-Pandey16/Hoctor.git',
    tags: ['Healthtech', 'Backend'],
    year: '2023',
  },
  {
    title: 'FineCode',
    blurb:
      'Lightweight linter front-end that surfaces code-quality signals during pull requests.',
    image: Fc,
    link: 'https://github.com/Akshat-Pandey16/FineCode',
    tags: ['Devtools', 'TypeScript'],
    year: '2023',
  },
];

export type Skill = {
  name: string;
  Icon: IconType;
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
      { name: 'Python', Icon: SiPython },
      { name: 'FastAPI', Icon: SiFastapi },
      { name: 'Django', Icon: SiDjango },
      { name: 'React', Icon: SiReact },
    ],
  },
  {
    label: 'Data & messaging',
    caption: 'Where the system actually keeps its memory.',
    skills: [
      { name: 'PostgreSQL', Icon: SiPostgresql },
      { name: 'Redis', Icon: SiRedis },
      { name: 'RabbitMQ', Icon: SiRabbitmq },
    ],
  },
  {
    label: 'Platforms',
    caption: 'The boxes the code actually runs on.',
    skills: [
      { name: 'AWS', Icon: FaAws },
      { name: 'Linux & Bash', Icon: SiLinux },
      { name: 'Nginx', Icon: SiNginx },
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
