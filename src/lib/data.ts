import SAIL from '../assets/internships/SAIL.png';
import DRDO from '../assets/internships/DRDO.png';
import Sb from '../assets/projects/SB.png';
import Mh from '../assets/projects/MH.png';
import Ht from '../assets/projects/HT.png';
import Hc from '../assets/projects/HC.png';
import Fc from '../assets/projects/FC.png';
import cpp from '../assets/skills/cpp.png';
import python from '../assets/skills/python.png';
import linux from '../assets/skills/linux.png';
import flutter from '../assets/skills/flutter.png';
import sql from '../assets/skills/sql.png';
import react from '../assets/skills/react.png';
import fastapi from '../assets/skills/fastapi.png';
import django from '../assets/skills/django.png';
import gcp from '../assets/skills/gcp.png';

export type NavSection = {
  id: string;
  label: string;
};

export const NAV_SECTIONS: NavSection[] = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'why-hire', label: 'Why hire me' },
  { id: 'contact', label: 'Contact' },
];

export type Experience = {
  organization: string;
  role: string;
  period: string;
  description: string;
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
      'Led development of a cross-platform mobile application that streamlined maintenance workflows. Built the Flutter client and a Node.js API on top of OracleDB, collaborating with engineers across teams.',
    stack: ['Flutter', 'Node.js', 'OracleDB'],
    logo: SAIL,
    link: 'https://github.com/Akshat-Pandey16/MES-SAIL',
  },
  {
    organization: 'Defence Research and Development Organisation',
    role: 'Research & Development Intern',
    period: '2022',
    description:
      'Worked with terrain data using QGIS and Python to detect ridges and spurs from DEM data, improving the speed of geospatial analysis for downstream research.',
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
  icon: string;
};

export type SkillGroup = {
  label: string;
  caption: string;
  skills: Skill[];
};

export const SKILL_GROUPS: SkillGroup[] = [
  {
    label: 'Languages',
    caption: 'The keyboard end of the day-to-day.',
    skills: [
      { name: 'Python', icon: python },
      { name: 'C / C++', icon: cpp },
      { name: 'SQL', icon: sql },
    ],
  },
  {
    label: 'Backend & frameworks',
    caption: 'Where most of my time gets spent.',
    skills: [
      { name: 'FastAPI', icon: fastapi },
      { name: 'Django', icon: django },
      { name: 'React', icon: react },
      { name: 'Flutter', icon: flutter },
    ],
  },
  {
    label: 'Platforms',
    caption: 'The boxes the code actually runs on.',
    skills: [
      { name: 'Linux & Bash', icon: linux },
      { name: 'Google Cloud', icon: gcp },
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
