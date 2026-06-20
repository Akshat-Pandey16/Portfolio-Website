import { describe, it, expect } from 'vitest';
import {
  NAV_SECTIONS,
  EXPERIENCES,
  PROJECTS,
  LAB_REPOS,
  STACK_NODES,
  STACK_EDGES,
  CONTACT_LINKS,
  ROLE,
  SITE_URL,
  RESUME_FILE,
} from './data';

describe('nav sections', () => {
  it('have unique ids and both labels', () => {
    const ids = NAV_SECTIONS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of NAV_SECTIONS) {
      expect(s.label.length).toBeGreaterThan(0);
      expect(s.plain.length).toBeGreaterThan(0);
    }
  });
});

describe('experiences', () => {
  it('each entry is well-formed', () => {
    expect(EXPERIENCES.length).toBeGreaterThan(0);
    for (const e of EXPERIENCES) {
      expect(e.organization).toBeTruthy();
      expect(e.role).toBeTruthy();
      expect(e.period).toBeTruthy();
      expect(['live', 'shipped']).toContain(e.status);
      expect(e.highlights.length).toBeGreaterThan(0);
      expect(e.stack.length).toBeGreaterThan(0);
      expect(e.metrics.length).toBeGreaterThan(0);
    }
  });

  it('current role uses the canonical ROLE title', () => {
    expect(EXPERIENCES[0]?.role).toBe(ROLE);
  });
});

describe('projects', () => {
  it('have unique titles and valid GitHub links', () => {
    const all = [...PROJECTS, ...LAB_REPOS];
    const titles = all.map((p) => p.title);
    expect(new Set(titles).size).toBe(titles.length);
    for (const p of all) {
      expect(p.link.startsWith('https://github.com/')).toBe(true);
      expect(p.tags.length).toBeGreaterThan(0);
    }
  });
});

describe('stack topology', () => {
  it('every edge references a real node', () => {
    const ids = new Set(STACK_NODES.map((n) => n.id));
    for (const [a, b] of STACK_EDGES) {
      expect(ids.has(a)).toBe(true);
      expect(ids.has(b)).toBe(true);
    }
  });
});

describe('config constants', () => {
  it('SITE_URL is absolute https', () => {
    expect(SITE_URL.startsWith('https://')).toBe(true);
  });

  it('resume file is a same-origin pdf', () => {
    expect(RESUME_FILE.startsWith('/')).toBe(true);
    expect(RESUME_FILE.endsWith('.pdf')).toBe(true);
  });

  it('contact links all have a label and href', () => {
    for (const l of CONTACT_LINKS) {
      expect(l.label).toBeTruthy();
      expect(l.href).toBeTruthy();
    }
  });
});
