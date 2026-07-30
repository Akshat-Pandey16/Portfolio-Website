import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react';
import { flushSync } from 'react-dom';
import {
  AVAILABILITY,
  AWARD,
  CONTACT_LINKS,
  EDUCATION,
  EMAIL,
  EXPERIENCES,
  GITHUB_URL,
  LAB_REPOS,
  PAST_ROLES,
  PROJECTS,
  RESUME_DOWNLOAD_NAME,
  RESUME_FILE,
  ROLE,
  TAGLINE,
  type Project,
} from '../lib/data';
import { FaGithub, FaLinkedin, FaRegFileLines } from 'react-icons/fa6';
import { FACE } from '../lib/face';
import { AsciiFace } from './AsciiFace';
import { Htop } from './Htop';

/* the only pictograms on the site: a recruiter scans the contact list for a
   logo, not for the word "GitHub" */
const CONTACT_ICON: Record<string, ReactNode> = {
  resume: <FaRegFileLines />,
  github: <FaGithub />,
  linkedin: <FaLinkedin />,
};

const RM =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/*
  Theme. The inline script in index.html has already stamped data-theme before
  first paint, so we read back from the DOM rather than recomputing — that keeps
  React's first render in step with what's already on screen.
*/
type Theme = 'dark' | 'light';
const THEME_BG: Record<Theme, string> = { dark: '#070b09', light: '#e4eae1' };

function initialTheme(): Theme {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

/* `home` is the landing: a full-bleed neofetch with the menu under it and no
   rail. Every other view splits the window into content pane + rail, and the
   identity block flies from the centre of the screen into that rail. */
type View =
  | { k: 'home' }
  | { k: 'about' }
  | { k: 'experience' }
  | { k: 'projects' }
  | { k: 'project'; slug: string }
  | { k: 'skills' }
  | { k: 'resume' }
  | { k: 'contact' }
  | { k: 'help' }
  | { k: 'gitlog' }
  | { k: 'ssh'; host: string }
  | { k: 'console' };

/* career, rendered as a git history */
const COMMITS: [string, string, string][] = [
  ['a1f0cc2', 'now', 'feat(mlops): dataset → label → verify → retrain, all in-tool'],
  ['b7e2c19', '2026', 'ship: onveef — zeep-free ONVIF ingest client for IP cameras'],
  ['4c8be5d', '2025', 'perf(db): partition the hot table — 200GB → 80GB, 90-day hot window'],
  ['7d3e11b', '2025', 'perf(pipeline): move video + inference off the request path'],
  ['3b9a04e', '2025', 'ship: Hoctor — wifi indoor localization (random forest)'],
  ['c04f7aa', '2024', 'feat(ingest): live RTSP/WebRTC via MediaMTX into the VMS'],
  ['e21b8d9', '2024', 'ship: ShieldBuntu — CIS hardening, streamed over SSE'],
  ['9ba33c1', '2024', 'join: Intozi Tech — backend & data platform'],
  ['f5c0d70', '2023', "win: KAVACH'23 — Govt. of India national hackathon"],
  ['0012abf', '2020', 'init: first commit.'],
];

/* project "servers" you can ssh into — a delighter for developers */
const SSH_LOGS: Record<string, string[]> = {
  papyrus: ['POST /api/v1/compress 200 · 3 files', 'celery: ocr.task[a3f] done in 2.41s', 'purge: 6 files wiped (zero-retention TTL)', 'GET /healthz 200'],
  headtogether: ['ws: room#kailash presence=12', 'msg relayed · room#cp · 3ms', 'waitlist: promoted user 88', 'ws: typing… room#kailash'],
  shieldbuntu: ['ansible: role[19-firewall] ok', 'SSE: harden.ufw changed', 'snapshot: pre-apply saved', 'pam: auth ok (local)'],
  hoctor: ['scan: 14 APs · rssi vector built', 'rf.predict: room=lab-2 conf=0.91', 'model: per-venue forest loaded'],
  meshhawk: ['pcap: 1.4k frames parsed', 'graph: 6 clusters · mesh-score 0.78', 'networkx: centrality computed'],
  fosslove: ['GET /api/v1/apps 200 · 142 apps', 'script: built for pop-os (apt+flatpak)', 'redis: catalog cache warm', 'auth: refresh token rotated'],
};

const CMDS = [
  'help', 'home', 'about', 'experience', 'projects', 'skills', 'resume', 'contact',
  'neofetch', 'clear', 'ls', 'cd', 'cat', 'pwd', 'whoami', 'uname', 'date',
  'echo', 'history', 'git', 'htop', 'ssh', 'sudo', 'project', 'theme',
];

const VIEW_TITLE: Partial<Record<View['k'], string>> = {
  about: 'About', experience: 'Experience', projects: 'Projects', project: 'Project',
  skills: 'Skills', resume: 'Résumé', contact: 'Contact', help: 'Help',
  gitlog: 'Career log', console: 'Shell', ssh: 'ssh',
};

/* commands that map to a shareable #hash (deep links: site.com/#projects) */
const SECTION = new Set(['home', 'about', 'experience', 'projects', 'skills', 'resume', 'contact']);

const NAV: { cmd: string; label: string; primary?: boolean }[] = [
  { cmd: 'about', label: 'About' },
  { cmd: 'experience', label: 'Experience' },
  { cmd: 'projects', label: 'Projects' },
  { cmd: 'skills', label: 'Skills' },
  { cmd: 'resume', label: 'Résumé', primary: true },
  { cmd: 'contact', label: 'Contact' },
];

const SKILL_GROUPS: { h: string; items: string[] }[] = [
  { h: 'languages', items: ['Python', 'SQL', 'Bash', 'TypeScript'] },
  { h: 'ingest & streaming', items: ['MediaMTX (RTSP/WebRTC)', 'ONVIF', 'WebSockets', 'SSE'] },
  { h: 'pipelines & async', items: ['Celery', 'RabbitMQ', 'Redis', 'ARQ', 'SQS'] },
  { h: 'stores', items: ['PostgreSQL', 'partitioning & archival', 'Redis', 'S3'] },
  { h: 'cloud', items: ['AWS', 'Lambda', 'SQS', 'S3'] },
  { h: 'frameworks', items: ['FastAPI', 'Django', 'React'] },
  { h: 'ml & data', items: ['scikit-learn', 'scapy', 'NetworkX'] },
  { h: 'infra', items: ['Docker', 'Kubernetes', 'Nginx', 'Linux', 'Git'] },
];

/*
  Views whose content is genuinely shorter than the canvas sit centred rather
  than stacking at the top over a hole. The rest either flow and scroll
  (projects, experience, console, ssh) or hand a child `.grow` to absorb the
  leftover height (home, about, résumé, contact).
*/
const FILL: Partial<Record<View['k'], string>> = {
  home: 'pi-center',
  about: 'pi-center',
  skills: 'pi-center',
  contact: 'pi-center',
  project: 'pi-center',
  help: 'pi-center',
  gitlog: 'pi-center',
};

/*
  Resolve a shareable deep link (site.com/#projects, #project onveef) into the
  opening view. This runs as the state initialiser rather than in an effect: it
  reads the URL synchronously, so a deep link paints its own section on the
  first frame instead of flashing the landing and swapping.
*/
function initialView(): View {
  if (typeof location === 'undefined') return { k: 'home' };
  const h = decodeURIComponent(location.hash.replace(/^#/, '')).trim().toLowerCase();
  if (!h) return { k: 'home' };
  const [first, ...rest] = h.split(/\s+/);
  if (first === 'project' && rest.length) return { k: 'project', slug: rest.join(' ') };
  if (SECTION.has(first)) return { k: first } as View;
  return { k: 'home' };
}

function slug(p: Project): string {
  return (p.link.split('/').pop() ?? p.title).toLowerCase();
}
function firstSentence(s: string): string {
  const i = s.indexOf('. ');
  return i >= 0 ? s.slice(0, i + 1) : s;
}
function statusTag(s: string): ReactNode {
  const cls = s === 'live' ? 'st-live' : s === 'active' ? 'st-active' : 'st-shipped';
  return <span className={cls}>{s === 'shipped' ? '○' : '●'} {s}</span>;
}
function colorBlocks(): ReactNode {
  const r1 = ['#0b110e', '#ef7a6d', '#2bd68a', '#e3b341', '#63b6ea', '#b48ce8', '#48c8bd', '#d3ddd4'];
  const r2 = ['#465447', '#ff9c8f', '#5cebab', '#f4cf6b', '#8cc9f2', '#caa8f2', '#6fdcd2', '#ffffff'];
  return (
    <>
      {[r1, r2].map((row, i) => (
        <div key={i}>{row.map((c, j) => <span key={j} style={{ color: c }}>██</span>)}</div>
      ))}
    </>
  );
}

export function Terminal() {
  const [view, setView] = useState<View>(initialView);
  const [consoleLines, setConsoleLines] = useState<ReactNode[]>([]);
  const [sshLines, setSshLines] = useState<ReactNode[]>([]);
  const [input, setInput] = useState('');
  const [focused, setFocused] = useState(false);
  const [overlay, setOverlay] = useState<'htop' | null>(null);
  const [cwd, setCwd] = useState<string[]>([]);
  const [booting, setBooting] = useState(!RM);
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [completions, setCompletions] = useState<string[]>([]);

  const idRef = useRef(0);
  const histRef = useRef<string[]>([]);
  const histIdxRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const paneRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [navScrolls, setNavScrolls] = useState(false);
  const unlockedRef = useRef(false);

  const nid = () => idRef.current++;

  /* only auto-focus the command line on desktop — on phones it would pop the
     on-screen keyboard and shove the layout around */
  const isDesktop = () => typeof window !== 'undefined' && window.innerWidth > 880;
  const focus = useCallback(() => inputRef.current?.focus(), []);
  const focusDesktop = useCallback(() => { if (isDesktop()) inputRef.current?.focus(); }, []);

  /* push a line into the console-delighter buffer and switch the pane to it */
  const pushConsole = useCallback((node: ReactNode) => {
    setConsoleLines((b) => [...b, <div className="cline" key={nid()}>{node}</div>]);
    setView({ k: 'console' });
  }, []);

  /* echo of a typed command, terminal-style — used inside the console view */
  function echo(cmd: string): ReactNode {
    const path = cwd.length ? '~/' + cwd.join('/') : '~';
    return (
      <div className="cmdline">
        <span className="ps"><span className="u">akshat@intozi</span><span className="c">:</span><span className="p">{path}</span><span className="c">$ </span></span>
        <span>{cmd}</span>
      </div>
    );
  }

  /* the shell dispatcher — shared by typing, nav clicks and inline links */
  function exec(raw: string) {
    const cmd = (raw ?? '').trim();
    if (!cmd) return;
    histRef.current.push(cmd);
    histIdxRef.current = histRef.current.length;

    const first = cmd.split(/\s+/)[0].toLowerCase();
    const rest = cmd.slice(first.length).trim();

    // inside an ssh session, a small set of verbs behaves specially; anything
    // else (a nav command, say) falls through and ends the session naturally
    if (view.k === 'ssh') {
      if (first === 'exit' || first === 'logout') {
        setView({ k: 'home' });
        return;
      }
      if (first === 'status' || first === 'uptime') {
        setSshLines((l) => [...l, <div className="out g" key={nid()}>● {view.host}.prod — nominal · up 41d</div>]);
        return;
      }
      if (first === 'clear') { setSshLines([]); return; }
    }

    switch (first) {
      case 'home': setView({ k: 'home' }); break;
      case 'about': setView({ k: 'about' }); break;
      case 'experience': case 'work': setView({ k: 'experience' }); break;
      case 'projects': setView({ k: 'projects' }); break;
      case 'project': openProject(rest); break;
      case 'skills': case 'stack': setView({ k: 'skills' }); break;
      case 'resume': case 'cv': setView({ k: 'resume' }); break;
      case 'contact': setView({ k: 'contact' }); break;
      case 'help': case '?': setView({ k: 'help' }); break;
      /* the landing IS the neofetch screen — the command takes you back to it */
      case 'neofetch': case 'fetch': setView({ k: 'home' }); break;
      case 'git': setView({ k: 'gitlog' }); break;
      case 'htop': case 'top': setOverlay('htop'); break;
      case 'ssh': sshCmd(rest); break;
      case 'clear': case 'cls': setConsoleLines([]); setView({ k: 'home' }); break;
      case 'ls': case 'dir': lsCmd(); break;
      case 'cd': cdCmd(rest); break;
      case 'cat': catCmd(rest); break;
      case 'pwd': pushConsole(<div className="out">/home/akshat{cwd.length ? '/' + cwd.join('/') : ''}</div>); break;
      case 'whoami': pushConsole(<div className="out">akshat{unlockedRef.current ? <span className="faint"> (root — you escalated, respect)</span> : null}</div>); break;
      case 'uname': pushConsole(<div className="out dim">Linux intozi-akshat 6.17.0-oem #1 SMP x86_64 GNU/Linux</div>); break;
      case 'hostname': pushConsole(<div className="out">intozi-akshat</div>); break;
      case 'date': pushConsole(<div className="out dim">{new Date().toString()}</div>); break;
      case 'echo': pushConsole(<div className="out">{rest}</div>); break;
      case 'history': pushConsole(<pre className="out">{histRef.current.map((h, i) => `${String(i + 1).padStart(3)}  ${h}`).join('\n')}</pre>); break;
      case 'theme': themeCmd(rest); break;
      case 'sudo': sudoCmd(rest); break;
      case 'exit': case 'logout': pushConsole(<div className="out dim">There's no exit — this is the whole site. Try {L('help')}.</div>); break;
      case 'open': openRepo(rest); break;
      default:
        pushConsole(<div className="out"><span className="rd">{first}: command not found</span> — try {L('help')}{nearHint(first) ? <> · did you mean {L(nearHint(first))}?</> : null}</div>);
    }
  }

  /* run + echo (typed commands) and keep deep-links in sync */
  const run = (cmd: string, opts?: { echo?: boolean }) => {
    const apply = () => {
      if (opts?.echo && view.k === 'ssh') {
        setSshLines((l) => [...l, <div key={nid()}>{echo(cmd)}</div>]);
      } else if (opts?.echo) {
        // typed commands that stay on the console show their prompt echo
        const first = cmd.trim().split(/\s+/)[0].toLowerCase();
        const isConsoley = !['home', 'about', 'experience', 'work', 'projects', 'project', 'skills', 'stack', 'resume', 'cv', 'contact', 'help', 'neofetch', 'fetch', 'git', 'htop', 'top', 'ssh', 'clear', 'cls'].includes(first);
        if (isConsoley) setConsoleLines((l) => [...l, <div key={nid()}>{echo(cmd)}</div>]);
      }
      exec(cmd);
      const base = cmd.split(' ')[0].toLowerCase();
      if (SECTION.has(base)) { try { history.replaceState(null, '', base === 'home' ? location.pathname : `#${base}`); } catch { /* ignore */ } }
    };

    /*
      Animate only the landing⇄app boundary — that's the one swap where an
      element genuinely moves (the identity block, from screen centre into the
      rail). Everything else stays instant, and browsers without view
      transitions just get the plain swap.
    */
    const crossesLanding = view.k === 'home' || ['home', 'neofetch', 'fetch', 'clear', 'cls'].includes(cmd.trim().split(/\s+/)[0].toLowerCase());
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    if (crossesLanding && !RM && typeof doc.startViewTransition === 'function') {
      doc.startViewTransition(() => flushSync(apply));
    } else {
      apply();
    }
  };

  /* a clickable inline command token */
  const L = (cmd: string, label?: ReactNode): ReactNode => (
    <button type="button" className="cmd" onClick={() => run(cmd)}>{label ?? cmd}</button>
  );

  function openProject(q: string) {
    const key = q.replace(/\.md$/, '').toLowerCase();
    const p = [...PROJECTS, ...LAB_REPOS].find(
      (x) => slug(x) === key || x.title.toLowerCase() === key || x.title.toLowerCase().startsWith(key),
    );
    if (!p) { pushConsole(<div className="out"><span className="rd">project '{q}' not found.</span> see {L('projects')}</div>); return; }
    setView({ k: 'project', slug: slug(p) });
  }

  /* ── content builders (hoisted function declarations) ───────────────── */
  function frow(k: string, v: ReactNode): ReactNode {
    return <div className="frow"><span className="k">{k}</span><span className="v">{v}</span></div>;
  }
  /*
    The landing: what you'd actually see on opening a terminal. The identity
    block carries `view-transition-name: ident`, and the rail's copy carries the
    same name — so navigating animates this one element from here into the rail
    instead of cross-fading two unrelated boxes.
  */
  function landingNode(): ReactNode {
    return (
      <div className="land">
        {/* the visible identity is a neofetch readout, which is the wrong shape
            for a document heading — so the page's one h1 is a real sentence,
            read by screen readers and search engines, seen by nobody */}
        <h1 className="vh">Akshat Pandey — {ROLE} at Intozi Tech</h1>
        <div className="land-fetch" style={{ viewTransitionName: 'ident' }}>
          <AsciiFace art={FACE} dark={theme === 'dark'} />
          <div className="land-info">
            <div className="hd">akshat@intozi</div>
            <div className="rl">{'─'.repeat(30)}</div>
            {frow('Name', 'Akshat Pandey')}
            {frow('Role', <>{ROLE} @ <span className="cy">Intozi Tech</span></>)}
            {frow('Uptime', '2 yrs @ Intozi · coding since 2020')}
            {frow('Focus', 'ingest · async pipelines · MLOps')}
            {frow('Scale', <>200k rows/hr · <span className="am">200 → 80 GB</span> · air-gapped</>)}
            {frow('Stack', 'Python · FastAPI · Django · Postgres')}
            {frow('Async', 'Celery · RabbitMQ · Redis · ARQ · SQS')}
            {frow('Stream', 'MediaMTX · WebRTC · ONVIF')}
            {frow('Cloud', 'AWS — Lambda · SQS · S3 · Docker · K8s')}
            {frow('Shipped', <>{PROJECTS.length + LAB_REPOS.length} repos — {L('projects', 'open source ↗')}</>)}
            {frow('Base', 'Gurugram, IN · remote-friendly')}
            {frow('Status', <span className="g">● open to work — {AVAILABILITY}</span>)}
            <div className="blocks">{colorBlocks()}</div>
          </div>
        </div>

        {/* the pitch — neofetch gives identity, this gives the reason to read on */}
        <p className="land-lead">{TAGLINE}</p>

        <nav className="land-nav" aria-label="sections">
          {NAV.map((n) => (
            <button
              key={n.cmd}
              type="button"
              className={'landbtn' + (n.primary ? ' primary' : '')}
              onClick={() => run(n.cmd)}
            >
              <span className="pmt" aria-hidden="true">›</span>{n.label}
            </button>
          ))}
          <button type="button" className="landbtn" onClick={() => run('help')}>
            <span className="pmt" aria-hidden="true">›</span>help
          </button>
        </nav>

        <p className="land-hint faint">
          …or just type. Try {L('git log', 'git log')}, {L('htop')}, {L('ssh papyrus', 'ssh papyrus')} or {L('sudo hire-me', 'sudo hire-me')}.
        </p>

        <div className="land-cli" onClick={focus}>{cliBlock()}</div>
      </div>
    );
  }
  function aboutNode(): ReactNode {
    return (
      <>
        <h2 className="eyebrow">// about</h2>
        <div className="two two-stretch">
          <div className="measure">
            <p className="out lead">I'm <span className="g bold">Akshat</span>. I build the data &amp; streaming platform behind a video-AI product at Intozi Tech.</p>
            <p className="out">Day to day that's the ingest paths, the Celery/RabbitMQ pipelines that keep live camera feeds and model inference off the request path, the Postgres/Redis data layers under them, and an internal MLOps loop that takes raw datasets all the way to a re-trained model. I'm mostly self-taught, with a CS degree from Bhilai Institute of Technology.</p>
            <p className="out">The work I'm proudest of is the least glamorous: a client's database was taking ~200k rows an hour and heading past 200&nbsp;GB, so I partitioned the hot table, kept 90 days online and archived the rest to its own server — <span className="am">200&nbsp;GB down to 80</span>, in an air-gapped environment where there's no managed service to fall back on.</p>
            <p className="out">The frontend I pick up when it needs doing — this terminal is one of those times. When a project needs a tool I haven't used — Ansible, scapy, scikit-learn, ONVIF — I learn it on the way and ship.</p>
          </div>
          <aside className="panel">
            <div className="kv">
              <span className="k">role</span><span>{ROLE}</span>
              <span className="k">company</span><span>Intozi Tech · 2 yrs</span>
              <span className="k">base</span><span>Gurugram, IN</span>
              <span className="k">degree</span><span>{EDUCATION.degree.replace('B.Tech, ', 'B.Tech ')} · {EDUCATION.note}</span>
              <span className="k">award</span><span className="am">{AWARD.title} — national hackathon, winner</span>
              <span className="k">status</span><span className="g">● open to work</span>
            </div>
            {/* moved out of the prose column so both columns reach the same depth */}
            <div className="side-note">
              <h3 className="eyebrow">// off the clock</h3>
              <p className="out faint">A published author (a novelette and two novels), and I shoot &amp; edit short films — same discipline as the backend: structure, revision, and deciding what to cut.</p>
            </div>
            <div className="btnrow">
              <button type="button" className="btn primary" onClick={() => run('resume')}>Résumé</button>
              <button type="button" className="btn" onClick={() => run('contact')}>Contact</button>
            </div>
          </aside>
        </div>
      </>
    );
  }
  function experienceNode(): ReactNode {
    const e = EXPERIENCES[0];
    return (
      <>
        <h2 className="eyebrow">// experience</h2>
        <div className="two two-stretch">
          <div>
            <div className="lr"><span className="g bold">{e.organization}</span> <span className="dim">{e.role}</span> {statusTag(e.status)}</div>
            <p className="out dim measure" style={{ marginTop: 6 }}>{e.description}</p>
            <div className="lr" style={{ marginTop: 12, gap: 26 }}>
              {e.metrics.map((m) => (
                <div key={m.label}>
                  <div className="g bold" style={{ fontSize: '1.15em' }}>{m.value}</div>
                  <div className="faint" style={{ fontSize: 12 }}>{m.label}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12 }}>
              {e.highlights.map((h, i) => (
                <p className="out measure" key={i} style={{ marginTop: 8 }}><span className="g">→ </span>{h}</p>
              ))}
            </div>
          </div>
          <aside className="panel">
            <div className="kv">
              <span className="k">period</span><span>{e.period}</span>
              <span className="k">location</span><span>{e.location}</span>
              <span className="k">role</span><span>{e.role}</span>
            </div>
            <div className="eyebrow" style={{ marginTop: 16 }}>stack</div>
            <div className="lr">{e.stack.map((s) => <span className="chip" key={s}>{s}</span>)}</div>
          </aside>
        </div>
        <p className="out faint" style={{ marginTop: 12 }}>the full timeline → {L('git log', 'git log')}</p>
        <h3 className="eyebrow" style={{ marginTop: 18 }}>// earlier</h3>
        {PAST_ROLES.map((p) => (
          <div className="lr" key={p.org} style={{ marginTop: 5 }}>
            <span className="dim bold">{p.org}</span>
            <span className="faint">{p.role}</span>
            <span className="faint">· {p.period}</span>
            <span className="faint">· {p.note}</span>
          </div>
        ))}
      </>
    );
  }
  function projectCard(p: Project): ReactNode {
    return (
      <div
        className={'card' + (p.featured ? ' feat' : '')}
        key={p.title}
        role="button"
        tabIndex={0}
        onClick={() => run('project ' + slug(p))}
        onKeyDown={(ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); run('project ' + slug(p)); } }}
      >
        <div className="lr"><span className="t">{p.title}</span> {p.status ? statusTag(p.status) : null}</div>
        <div className="d">{firstSentence(p.blurb)}</div>
        <div className="m">
          <span className="faint">{p.year}</span>
          {p.tags.map((t) => <span className="tg" key={t}>{t}</span>)}
        </div>
      </div>
    );
  }
  function projectsNode(): ReactNode {
    return (
      <>
        <h2 className="eyebrow">// projects · open source</h2>
        <p className="out dim">Click a card to read more. Everything here is on <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GitHub ↗</a>.</p>
        <div className="grid">{PROJECTS.map(projectCard)}</div>
        <h3 className="eyebrow" style={{ marginTop: 18 }}>// lab · foundations</h3>
        <div className="grid">{LAB_REPOS.map(projectCard)}</div>
      </>
    );
  }
  function projectDetailNode(sl: string): ReactNode {
    const p = [...PROJECTS, ...LAB_REPOS].find((x) => slug(x) === sl);
    if (!p) return <div className="out"><span className="rd">project not found.</span> see {L('projects')}</div>;
    const isMain = PROJECTS.includes(p);
    return (
      <>
        <button type="button" className="cmd back" onClick={() => run('projects')}>← all projects</button>
        <div className="two two-stretch" style={{ marginTop: 10 }}>
          <div>
            <div className="lr"><span className="g bold"># {p.title}</span> <span className="faint">{p.year}</span> {statusTag(p.status)}</div>
            <p className="out measure" style={{ marginTop: 8 }}>{p.blurb}</p>
            {isMain && SSH_LOGS[slug(p)] ? <p className="out faint" style={{ marginTop: 12 }}>developers: it's live — try {L('ssh ' + slug(p), 'ssh ' + slug(p))}</p> : null}
          </div>
          <aside className="panel">
            <div className="kv">
              <span className="k">year</span><span>{p.year}</span>
              <span className="k">status</span><span>{statusTag(p.status)}</span>
              <span className="k">shelf</span><span>{isMain ? 'projects' : 'lab · foundations'}</span>
            </div>
            <div className="eyebrow" style={{ marginTop: 14 }}>stack</div>
            <div className="lr">{p.tags.map((t) => <span className="chip" key={t}>{t}</span>)}</div>
            <div className="btnrow">
              <a className="btn primary" href={p.link} target="_blank" rel="noopener noreferrer">Open repo ↗</a>
            </div>
          </aside>
        </div>
      </>
    );
  }
  function skillsNode(): ReactNode {
    return (
      <>
        <h2 className="eyebrow">// skills · what I reach for</h2>
        <div className="skill-grid">
          {SKILL_GROUPS.map((g) => (
            <div className="panel" key={g.h}>
              <div className="g bold">{g.h}</div>
              <div className="lr skill-chips">
                {g.items.map((i) => <span className="chip" key={i}>{i}</span>)}
              </div>
            </div>
          ))}
        </div>
        <p className="out faint" style={{ marginTop: 12 }}>Grouped by how often I reach for them, not by a made-up percentage. Want to see what's actually running? try {L('htop')}.</p>
      </>
    );
  }
  function contactNode(): ReactNode {
    return (
      <>
        <h2 className="eyebrow">// contact</h2>
        <div className="ct-two">
          <div className="ct-main">
            {/* email is the one action worth making unmissable */}
            <a className="ct-primary" href={`mailto:${EMAIL}`}>
              <span className="eyebrow">fastest reply</span>
              <span className="ct-mail">{EMAIL}</span>
              <span className="ct-sub">Email me — I read everything, and I reply.</span>
            </a>
            <div className="ct-links">
              {CONTACT_LINKS.filter((c) => c.icon !== 'email').map((c) => {
                const inner = (
                  <>
                    <span className="ic" aria-hidden="true">{CONTACT_ICON[c.icon]}</span>
                    <span className="tx">
                      <span className="lb">{c.icon === 'resume' ? 'Résumé' : c.label}</span>
                      <span className="vl">{c.value}</span>
                    </span>
                    <span className="go" aria-hidden="true">{c.icon === 'resume' ? '→' : '↗'}</span>
                  </>
                );
                return c.icon === 'resume' ? (
                  <button type="button" className="ct-link" key={c.label} onClick={() => run('resume')}>{inner}</button>
                ) : (
                  <a className="ct-link" key={c.label} href={c.href} target="_blank" rel="noopener noreferrer">{inner}</a>
                );
              })}
            </div>
          </div>

          {/* the details a recruiter has to ask for otherwise */}
          <aside className="panel ct-side">
            <div className="g bold">● open to work</div>
            <p className="out dim" style={{ marginTop: 4, fontSize: 13 }}>{AVAILABILITY}.</p>
            <div className="kv">
              <span className="k">looking for</span><span>{ROLE} · backend</span>
              <span className="k">setup</span><span>{AVAILABILITY}</span>
              <span className="k">based</span><span>Gurugram, IN</span>
              <span className="k">timezone</span><span>IST · UTC+05:30</span>
              <span className="k">stack</span><span>Python · Django · FastAPI · Postgres · Celery</span>
              <span className="k">domain</span><span>video AI · streaming · MLOps</span>
            </div>
            <div className="btnrow">
              <button type="button" className="btn primary" onClick={() => run('resume')}>Résumé</button>
              <button type="button" className="btn" onClick={() => run('projects')}>Projects</button>
            </div>
          </aside>
        </div>
      </>
    );
  }
  function resumeNode(): ReactNode {
    return (
      <>
        <h2 className="eyebrow">// résumé</h2>
        <div className="res-bar">
          <span className="g bold">Akshat-Pandey-Resume.pdf</span>
          <span className="chip">PDF · one page</span>
          <span className="sp" />
          <a className="btn" href={RESUME_FILE} target="_blank" rel="noopener noreferrer">Open in a new tab ↗</a>
          <a className="btn primary" href={RESUME_FILE} download={RESUME_DOWNLOAD_NAME}>Download ↓</a>
        </div>
        {/* read it here — a recruiter shouldn't have to leave the page for it.
            <object> renders its children when the browser can't show a PDF. */}
        <div className="res-frame grow">
          <object data={`${RESUME_FILE}#view=FitH&toolbar=0&navpanes=0`} type="application/pdf" aria-label="Akshat Pandey — résumé">
            <div className="res-fb">
              <p className="out dim">Your browser can't show the PDF inline.</p>
              <p className="out"><a href={RESUME_FILE} target="_blank" rel="noopener noreferrer">Open it in a new tab ↗</a></p>
            </div>
          </object>
        </div>
        <div className="panel res-card">
          <div className="lr"><span className="g bold">Akshat-Pandey-Resume.pdf</span> <span className="chip">PDF · one page</span></div>
          <p className="out dim" style={{ marginTop: 6 }}>Open it in a new tab to read, or download a copy.</p>
          <div className="btnrow" style={{ marginTop: 12 }}>
            <a className="btn primary" href={RESUME_FILE} target="_blank" rel="noopener noreferrer">View in browser ↗</a>
            <a className="btn" href={RESUME_FILE} download={RESUME_DOWNLOAD_NAME}>Download ↓</a>
          </div>
        </div>
      </>
    );
  }
  function gitlogNode(): ReactNode {
    return (
      <>
        <h2 className="eyebrow">// git log --oneline · career</h2>
        <pre className="out">
          {COMMITS.map((c, i) => (
            <span key={c[0]}>
              <span className="am">* </span><span className="am">{c[0]}</span>{i === 0 ? <span className="am"> (HEAD → main)</span> : null} {c[2]}{'\n'}
              <span className="faint">{'|             ' + c[1] + ' · Akshat Pandey'}</span>{'\n'}
              {i < COMMITS.length - 1 ? <><span className="am">|</span>{'\n'}</> : null}
            </span>
          ))}
        </pre>
      </>
    );
  }
  function helpNode(): ReactNode {
    const core: [string, string][] = [
      ['about', 'who I am'], ['experience', 'what I do at Intozi'], ['projects', 'open-source work'],
      ['skills', 'the stack I use'], ['resume', 'view / download the PDF'], ['contact', 'ways to reach me'],
    ];
    const curious = ['neofetch', 'git log', 'htop', 'ssh papyrus', 'ls', 'whoami', 'theme', 'sudo hire-me'];
    return (
      <>
        <h2 className="eyebrow">// help</h2>
        <p className="out dim">Click any menu item in the panel, or type a command. Here's the menu:</p>
        <div className="kv" style={{ marginTop: 8 }}>
          {core.map(([c, d]) => (
            <span key={c} style={{ display: 'contents' }}>
              <span className="k">{L(c)}</span><span className="dim">{d}</span>
            </span>
          ))}
        </div>
        <p className="out faint" style={{ marginTop: 12 }}>
          for the curious (developer commands): {curious.map((c, i) => (
            <span key={c}>{i ? ' · ' : ''}{L(c.split(' ')[0] === 'ssh' || c.split(' ')[0] === 'git' ? c : c.split(' ')[0], c)}</span>
          ))}
        </p>
        <p className="out faint">↑/↓ history · Tab completes · Ctrl+L clears</p>
      </>
    );
  }
  function consoleNode(): ReactNode {
    if (!consoleLines.length) {
      return <div className="out faint">// shell — output from ls, cat, whoami, echo, sudo … shows up here. Type {L('help')} for the menu.</div>;
    }
    return (
      <>
        <h2 className="eyebrow">// shell</h2>
        <div className="console" role="log" aria-live="polite">{consoleLines}</div>
      </>
    );
  }
  function sshNode(host: string): ReactNode {
    return (
      <>
        <div className="lr"><span className="g bold">ssh akshat@{host}.prod</span> <span className="st-live">● connected</span></div>
        <pre className="out g" style={{ marginTop: 8 }}>{`┌${'─'.repeat(40)}┐\n│  ${(host + '.prod').padEnd(20)}  ● all systems nominal │\n└${'─'.repeat(40)}┘`}</pre>
        <div className="out dim" style={{ marginTop: 6 }}>tailing /var/log/{host}.log — type {L('exit')} to disconnect, or pick a menu item.</div>
        <div className="console" style={{ marginTop: 8 }}>{sshLines}</div>
      </>
    );
  }

  /* one command line, rendered either in the landing or in the rail */
  function cliBlock(): ReactNode {
    return (
      <>
        <div className="cli-line">
          <span className="ps"><span className="u">$</span> </span>
          <span className="typed">{input}</span>
          <span className={focused ? 'blk-caret' : 'blk-caret off'} aria-hidden="true" />
          {ghost && <span className="ghost" aria-hidden="true">{ghost}</span>}
          {input === '' && <span className="ph2">type a command…</span>}
          <input
            id="term-input"
            ref={inputRef}
            className="cli"
            value={input}
            onChange={(e) => { setInput(e.target.value); setCompletions([]); }}
            onKeyDown={handleKey}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label="terminal command input"
          />
        </div>
        {completions.length > 0 && (
          <div className="cli-comp" role="status">
            {completions.slice(0, 10).map((c) => (
              <button
                key={c}
                type="button"
                className="cmd"
                onClick={() => { setInput(c + ' '); setCompletions([]); focus(); }}
              >
                {c}
              </button>
            ))}
            {completions.length > 10 && <span className="faint">+{completions.length - 10} more</span>}
          </div>
        )}
        <div className="cli-hint faint">↑ history · Tab completes · {L('help')}</div>
      </>
    );
  }

  function renderView(): ReactNode {
    switch (view.k) {
      case 'home': return landingNode();
      case 'about': return aboutNode();
      case 'experience': return experienceNode();
      case 'projects': return projectsNode();
      case 'project': return projectDetailNode(view.slug);
      case 'skills': return skillsNode();
      case 'resume': return resumeNode();
      case 'contact': return contactNode();
      case 'help': return helpNode();
      case 'gitlog': return gitlogNode();
      case 'console': return consoleNode();
      case 'ssh': return sshNode(view.host);
    }
  }

  /* ── mini filesystem (dev delighter) ────────────────────────────────── */
  function lsCmd() {
    if (cwd[0] === 'projects') {
      pushConsole(<div className="out">{PROJECTS.map((p) => <span key={p.title} className="g">{slug(p)}.md&nbsp;&nbsp;</span>)}</div>);
    } else if (cwd[0] === 'lab') {
      pushConsole(<div className="out">{LAB_REPOS.map((p) => <span key={p.title} className="g">{slug(p)}.md&nbsp;&nbsp;</span>)}</div>);
    } else {
      pushConsole(
        <div className="out">
          <span>about.md&nbsp;&nbsp;experience.md&nbsp;&nbsp;</span>
          <span className="b bold">projects/&nbsp;&nbsp;lab/&nbsp;&nbsp;</span>
          <span>skills.md&nbsp;&nbsp;</span><span className="am">resume.pdf&nbsp;&nbsp;</span><span>contact.md</span>
        </div>,
      );
    }
  }
  function cdCmd(arg: string) {
    const a = arg.trim();
    if (!a || a === '~' || a === '/' || a === '..') { setCwd([]); pushConsole(<div className="out faint">— /home/akshat</div>); return; }
    if (a === 'projects' || a === 'lab') { setCwd([a]); pushConsole(<div className="out faint">— /home/akshat/{a}</div>); return; }
    pushConsole(<div className="out rd">cd: {a}: no such directory</div>);
  }
  function catCmd(arg: string) {
    const a = arg.trim().replace(/\.md$/, '').replace(/\.pdf$/, '').toLowerCase();
    const known = new Set(['about', 'experience', 'skills', 'contact', 'resume']);
    if (known.has(a)) { exec(a); return; }
    const p = [...PROJECTS, ...LAB_REPOS].find((x) => slug(x) === a);
    if (p) { setView({ k: 'project', slug: slug(p) }); return; }
    pushConsole(<div className="out rd">cat: {arg || ''}: no such file</div>);
  }
  /* `theme` with no argument flips; `theme light|dark` sets it outright */
  function themeCmd(rest: string) {
    const want = rest.trim().toLowerCase();
    if (want && want !== 'light' && want !== 'dark') {
      pushConsole(<div className="out"><span className="rd">theme: unknown theme '{want}'</span> — try {L('theme light', 'theme light')} or {L('theme dark', 'theme dark')}</div>);
      return;
    }
    const next: Theme = want ? (want as Theme) : theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    pushConsole(<div className="out">theme → <span className="g">{next}</span> <span className="faint">(remembered on this device)</span></div>);
  }
  function sudoCmd(rest: string) {
    if (/hire/.test(rest)) {
      pushConsole(<div className="out dim">[sudo] password for recruiter: <span className="faint">••••••••</span></div>);
      window.setTimeout(() => {
        unlockedRef.current = true;
        pushConsole(<div className="out"><span className="g bold">✓ access granted.</span> Email <a href={`mailto:${EMAIL}`}>{EMAIL}</a> or run {L('contact')}. I reply.</div>);
      }, 380);
    } else if (/rm\s+-rf/.test(rest)) {
      pushConsole(<div className="out rd">rm: refusing to remove '/' — I need this machine, it's open to work 🙂</div>);
    } else {
      pushConsole(<div className="out dim">akshat is not in the sudoers file. (kidding — try {L('sudo hire-me', 'sudo hire-me')})</div>);
    }
  }
  function openRepo(id: string) {
    const p = [...PROJECTS, ...LAB_REPOS].find((x) => slug(x) === id.toLowerCase());
    if (!p) { openProject(id); return; }
    pushConsole(<div className="out">opening <span className="g">{p.title}</span> → <a href={p.link} target="_blank" rel="noopener noreferrer">{p.link.replace('https://', '')} ↗</a></div>);
    window.open(p.link, '_blank', 'noopener');
  }
  function sshCmd(host: string) {
    const h = host.trim().toLowerCase().replace(/.*@/, '');
    if (!SSH_LOGS[h]) {
      pushConsole(<div className="out"><span className="rd">ssh: could not resolve host '{host}'</span>. try: {Object.keys(SSH_LOGS).map((k, i) => <span key={k}>{i ? ' ' : ''}{L('ssh ' + k, k)}</span>)}</div>);
      return;
    }
    setSshLines([]);
    setView({ k: 'ssh', host: h });
  }
  function nearHint(c: string): string {
    return CMDS.find((x) => x.startsWith(c) || c.startsWith(x)) ?? '';
  }

  /* ── input handling ─────────────────────────────────────────────────── */
  function handleKey(e: ReactKeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') { e.preventDefault(); const v = input; setInput(''); setCompletions([]); if (v.trim()) run(v, { echo: true }); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (histIdxRef.current > 0) { histIdxRef.current--; setInput(histRef.current[histIdxRef.current] ?? ''); } }
    else if (e.key === 'ArrowDown') { e.preventDefault(); if (histIdxRef.current < histRef.current.length) { histIdxRef.current++; setInput(histRef.current[histIdxRef.current] ?? ''); } }
    else if (e.key === 'ArrowRight') {
      const m = input && !/\s/.test(input) ? CMDS.find((c) => c.startsWith(input.toLowerCase()) && c !== input.toLowerCase()) : undefined;
      const el = e.currentTarget;
      if (m && el.selectionStart != null && el.selectionStart >= input.length) { e.preventDefault(); setInput(m); }
    }
    else if (e.key === 'Escape') {
      // Esc is the way back out of a section — matches the visible `← home` chip
      if (completions.length) { setCompletions([]); return; }
      if (input) { setInput(''); return; }
      if (view.k !== 'home') { e.preventDefault(); run('home'); }
    }
    else if (e.key === 'Tab') { e.preventDefault(); complete(); }
    else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); setConsoleLines([]); setView({ k: 'home' }); }
  }
  /*
    Tab used to push the candidate list through pushConsole — which appends a
    line AND switches the pane to the shell, so completing a command threw you
    out of whatever you were reading, once per keypress. It now behaves like
    readline: fill in as far as every candidate agrees, and list the rest
    in place under the prompt.
  */
  function complete() {
    const t = input.trim();
    if (!t || /\s/.test(t)) return;
    const hits = CMDS.filter((c) => c.startsWith(t.toLowerCase()));
    if (!hits.length) { setCompletions([]); return; }
    if (hits.length === 1) { setInput(hits[0] + ' '); setCompletions([]); return; }
    let prefix = hits[0];
    for (const h of hits) while (!h.startsWith(prefix)) prefix = prefix.slice(0, -1);
    if (prefix.length > t.length) setInput(prefix);
    setCompletions(hits);
  }

  /* ── boot: a short, skippable splash, then reveal the two panes ──────── */
  useEffect(() => {
    if (!booting) return;
    const t = window.setTimeout(() => setBooting(false), 1500);
    const skip = () => setBooting(false);
    window.addEventListener('keydown', skip, { once: true });
    window.addEventListener('pointerdown', skip, { once: true });
    return () => { window.clearTimeout(t); window.removeEventListener('keydown', skip); window.removeEventListener('pointerdown', skip); };
  }, [booting]);

  /* the deep link is resolved in the state initialiser above, so all this has
     left to do is put the caret in the command line once the splash clears */
  useEffect(() => { if (!booting) focusDesktop(); }, [booting, focusDesktop]);

  /* the command line moves between the landing and the rail, so it remounts on
     that boundary — put the caret back afterwards */
  useEffect(() => { focusDesktop(); }, [view.k, focusDesktop]);

  /* persist the choice and keep the browser chrome (address bar / form controls)
     in step with the palette */
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_BG[theme]);
    try { localStorage.setItem('theme', theme); } catch { /* private mode — session only */ }
  }, [theme]);

  /* name the tab after the view, so back/forward and a wall of open tabs both
     say something more useful than the same title nine times */
  useEffect(() => {
    document.title = view.k === 'home'
      ? `Akshat Pandey — ${ROLE}`
      : `${VIEW_TITLE[view.k] ?? view.k} · Akshat Pandey`;
  }, [view]);

  /* The menu is the one zone allowed to give way — vertically on a short
     window, horizontally in the phone bar. Either way, measure it so a clipped
     list gets a fade instead of an edge that looks like the end of the list. */
  useEffect(() => {
    const el = navRef.current;
    if (!el) { setNavScrolls(false); return; }
    const check = () =>
      setNavScrolls(el.scrollHeight - el.clientHeight > 2 || el.scrollWidth - el.clientWidth > 2);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [view.k]);

  /* live log tail while ssh'd in */
  useEffect(() => {
    if (view.k !== 'ssh' || RM) return;
    const logs = SSH_LOGS[view.host] ?? [];
    let i = 0;
    const iv = window.setInterval(() => {
      const t = new Date().toTimeString().slice(0, 8);
      setSshLines((l) => [...l.slice(-40), <div className="out" key={nid()}><span className="faint">{t}</span> <span className="cy">{logs[i % logs.length]}</span></div>]);
      i += 1;
    }, 1600);
    return () => window.clearInterval(iv);
  }, [view]);

  /* swap scrolls the pane to the top; streaming views stick to the bottom */
  useEffect(() => {
    const el = paneRef.current;
    if (!el) return;
    if (view.k === 'ssh' || view.k === 'console') el.scrollTop = el.scrollHeight;
    else el.scrollTop = 0;
  }, [view, consoleLines, sshLines]);

  const onLanding = view.k === 'home';
  const lc = input.toLowerCase();
  const ghostMatch = input && !/\s/.test(input) ? CMDS.find((c) => c.startsWith(lc) && c !== lc) : undefined;
  const ghost = ghostMatch ? ghostMatch.slice(input.length) : '';

  if (booting) {
    return (
      <div className="term boot" role="status" aria-label="booting">
        <pre className="boot-lines">
          <span className="faint">[ <span className="g">0.00</span> ] GRUB loading Zorin OS 18 …{'\n'}</span>
          <span className="faint">[ <span className="g">0.31</span> ] kernel: waking data-platform engineer{'\n'}</span>
          <span className="faint">[ <span className="g">0.58</span> ] starting: postgres redis rabbitmq celery … <span className="g">ok</span>{'\n'}</span>
          <span className="faint">[ <span className="g">0.79</span> ] systemd: reached target <span className="g">open-to-work.service</span>{'\n'}</span>
          <span className="dim">Last login: just now on tty1 — loading akshat@intozi …</span>
        </pre>
        <div className="boot-skip faint">press any key to skip</div>
      </div>
    );
  }

  return (
    <div className="term">
      <a className="skip" href="#term-input">Skip to command input</a>

      <div className="term-top">
        <span className="dots" aria-hidden="true"><span className="dot r" /><span className="dot y" /><span className="dot g" /></span>
        <span className="term-tab"><b>akshat@intozi</b><span className="tabpath">: {view.k === 'ssh' ? 'ssh:' + view.host : cwd.length ? '~/' + cwd.join('/') : '~'}</span></span>
        <span className="grow" />
        {/* the status line lives in the window chrome: always on screen, on
            every view, and never something you have to scroll a panel to find */}
        <button type="button" className="top-meters" onClick={() => setOverlay('htop')} title="open htop">
          <MiniMeters reducedMotion={RM} />
          <span className="mtag">htop</span>
        </button>
        <a className="top-status" href={`mailto:${EMAIL}`}>
          <span className="status-dot" aria-hidden="true" />open to work
        </a>
        <button
          type="button"
          className="themebtn"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title={theme === 'dark' ? 'Switch to the light theme' : 'Switch to the dark theme'}
          aria-label={theme === 'dark' ? 'Switch to the light theme' : 'Switch to the dark theme'}
        >
          <span className="ico" aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
          <span className="lbl">{theme === 'dark' ? 'light' : 'dark'}</span>
        </button>
        <Clock />
      </div>

      <div className={'term-main' + (onLanding ? ' is-landing' : '')}>
        <main
          className="pane"
          ref={paneRef}
          onClick={(e) => { if (!(e.target as HTMLElement).closest('button, a, input')) focusDesktop(); }}
        >
          {/* the way back, in the one place people look for it */}
          {!onLanding && (
            <div className="backbar">
              <button
                type="button"
                className="backhome"
                onClick={() => run('home')}
                title="back to the start (Esc)"
              >
                <span aria-hidden="true">←</span> home
                <kbd aria-hidden="true">Esc</kbd>
              </button>
            </div>
          )}
          <div
            className={'pane-inner' + (FILL[view.k] ? ' ' + FILL[view.k] : '')}
            key={view.k === 'project' ? 'p-' + view.slug : view.k}
          >
            {renderView()}
          </div>
        </main>

        {/* no rail on the landing — it flies in with the first navigation */}
        {!onLanding && (
        <aside className="rail" aria-label="profile and navigation">
          <div className="rail-fetch" style={{ viewTransitionName: 'ident' }}>
            <AsciiFace art={FACE} dark={theme === 'dark'} />
            <div className="rail-id">
              <button type="button" className="rail-name" onClick={() => run('home')}>akshat@intozi</button>
              <div className="rl">{'─'.repeat(18)}</div>
              <div className="rail-rows">
                {frow('Role', ROLE)}
                {frow('Focus', 'ingest · pipelines · MLOps')}
                {frow('Data', 'Postgres · Redis · Celery')}
                {frow('Base', 'Gurugram, IN')}
                {frow('Status', <span className="g">● open to work</span>)}
              </div>
              {/* the phone bar's one-line stand-in for the readout above — and
                  the only always-visible CTA once the hire card is gone. The
                  window tab already says akshat@intozi, so this line spends its
                  width on the role instead of repeating the name. */}
              <a className="rail-mini" href={`mailto:${EMAIL}`}>
                <span className="rm-role">{ROLE}</span>
                <span className="g">● open to work</span>
              </a>
            </div>
          </div>

          <nav
            className={'rail-nav' + (navScrolls ? ' is-scrollable' : '')}
            ref={navRef}
            aria-label="sections"
          >
            {/* home as a destination in the list people already navigate with */}
            <button type="button" className="navbtn navhome" onClick={() => run('home')}>
              <span className="pmt" aria-hidden="true">←</span>home
            </button>
            {NAV.map((n) => {
              const active = view.k === n.cmd || (n.cmd === 'projects' && view.k === 'project');
              return (
                <button
                  key={n.cmd}
                  type="button"
                  className={'navbtn' + (n.primary ? ' primary' : '') + (active ? ' active' : '')}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => run(n.cmd)}
                >
                  <span className="pmt" aria-hidden="true">›</span>{n.label}
                </button>
              );
            })}
            <button type="button" className={'navbtn' + (view.k === 'help' ? ' active' : '')} onClick={() => run('help')}>
              <span className="pmt" aria-hidden="true">›</span>help
            </button>
          </nav>

          {/* the rail's own dead zone — the highest-value action goes in it */}
          <div className="rail-hire">
            <div className="eyebrow">// status</div>
            <div><span className="g bold">● open to work</span></div>
            <div className="out dim rail-hire-d">{AVAILABILITY}</div>
            <a className="btn primary" href={`mailto:${EMAIL}`}>Email me →</a>
          </div>

          <div className="rail-cli" onClick={focus}>{cliBlock()}</div>
        </aside>
        )}
      </div>

      {overlay === 'htop' && <Htop reducedMotion={RM} onExit={() => { setOverlay(null); focus(); }} />}
    </div>
  );
}

/*
  Three quiet meters that bridge the rail's dead zone and hint that `htop` is
  real. Deliberately unlabelled numbers — decoration, not a claimed metric.
*/
function MiniMeters({ reducedMotion }: { reducedMotion: boolean }) {
  const [v, setV] = useState<number[]>([38, 54, 21]);

  useEffect(() => {
    if (reducedMotion) return;
    const drift = (n: number, by: number) => Math.max(6, Math.min(94, n + (Math.random() - 0.5) * by));
    const iv = window.setInterval(() => {
      setV(([a, b, c]) => [drift(a, 18), drift(b, 8), drift(c, 26)]);
    }, 2200);
    return () => window.clearInterval(iv);
  }, [reducedMotion]);

  const rows: [string, number, boolean][] = [['cpu', v[0], false], ['mem', v[1], true], ['net', v[2], false]];
  return (
    <>
      {rows.map(([lab, val, mem]) => (
        <span className="hmeter" key={lab}>
          <span className="lab">{lab}</span>
          <span className={'hbar' + (mem ? ' mem' : '')}><i style={{ width: `${val.toFixed(0)}%` }} /></span>
          <span className="hpct">{val.toFixed(0)}%</span>
        </span>
      ))}
    </>
  );
}

function Clock() {
  const [t, setT] = useState('');
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const ist = new Date(d.getTime() + (d.getTimezoneOffset() + 330) * 60000);
      setT(ist.toTimeString().slice(0, 5) + ' IST');
    };
    tick();
    const iv = window.setInterval(tick, 15000);
    return () => window.clearInterval(iv);
  }, []);
  return <span className="term-clock tnum">{t}</span>;
}
