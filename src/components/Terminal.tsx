import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react';
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
import { FACE } from '../lib/face';
import { AsciiFace } from './AsciiFace';
import { Htop } from './Htop';

const RM =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* the left pane shows exactly ONE of these at a time — click a menu item or
   type a command and the content swaps in place, so the page never scrolls */
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
  | { k: 'neofetch' }
  | { k: 'ssh'; host: string }
  | { k: 'console' };

/* career, rendered as a git history */
const COMMITS: [string, string, string][] = [
  ['a1f0cc2', 'now', 'feat(mlops): dataset → label → verify → retrain, all in-tool'],
  ['b7e2c19', '2026', 'ship: onveef — zeep-free ONVIF ingest client for IP cameras'],
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
  'echo', 'history', 'git', 'htop', 'ssh', 'sudo', 'project',
];

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

const SKILL_GROUPS: { h: string; items: string }[] = [
  { h: 'languages', items: 'Python · SQL · Bash · TypeScript' },
  { h: 'ingest & streaming', items: 'MediaMTX (RTSP/WebRTC) · ONVIF · WebSockets · SSE' },
  { h: 'pipelines & async', items: 'Celery · RabbitMQ · Redis · ARQ' },
  { h: 'stores', items: 'PostgreSQL · Redis · S3' },
  { h: 'frameworks', items: 'FastAPI · Django · React' },
  { h: 'ml & data', items: 'scikit-learn · scapy · NetworkX' },
  { h: 'infra', items: 'Docker · Kubernetes · Nginx · AWS · Linux · Git' },
];

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
  const [view, setView] = useState<View>({ k: 'home' });
  const [consoleLines, setConsoleLines] = useState<ReactNode[]>([]);
  const [sshLines, setSshLines] = useState<ReactNode[]>([]);
  const [input, setInput] = useState('');
  const [focused, setFocused] = useState(false);
  const [overlay, setOverlay] = useState<'htop' | null>(null);
  const [cwd, setCwd] = useState<string[]>([]);
  const [booting, setBooting] = useState(!RM);

  const idRef = useRef(0);
  const histRef = useRef<string[]>([]);
  const histIdxRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const paneRef = useRef<HTMLDivElement>(null);
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
      case 'neofetch': case 'fetch': setView({ k: 'neofetch' }); break;
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
      case 'sudo': sudoCmd(rest); break;
      case 'exit': case 'logout': pushConsole(<div className="out dim">There's no exit — this is the whole site. Try {L('help')}.</div>); break;
      case 'open': openRepo(rest); break;
      default:
        pushConsole(<div className="out"><span className="rd">{first}: command not found</span> — try {L('help')}{nearHint(first) ? <> · did you mean {L(nearHint(first))}?</> : null}</div>);
    }
  }

  /* run + echo (typed commands) and keep deep-links in sync */
  const run = (cmd: string, opts?: { echo?: boolean }) => {
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
  function homeNode(): ReactNode {
    return (
      <div className="home">
        <div className="eyebrow">// akshat pandey</div>
        <h1 className="home-h1"><span className="g">Data&nbsp;Platform</span> Engineer</h1>
        <p className="home-lead measure">{TAGLINE}</p>
        <p className="out dim measure">
          Two years in at <span className="cy">Intozi Tech</span>, a computer-vision &amp; video-analytics
          product company in Gurugram. I care about the boring-on-purpose stuff: data that arrives
          intact, pipelines that don't fall over, and models that stay fed.
        </p>
        <div className="statusline"><span className="g bold">● open to work</span> <span className="dim">— {AVAILABILITY}. Fastest reply is email.</span></div>
        <div className="btnrow" style={{ marginTop: 4 }}>
          <button type="button" className="btn primary" onClick={() => run('projects')}>See projects</button>
          <button type="button" className="btn" onClick={() => run('experience')}>Experience</button>
          <button type="button" className="btn" onClick={() => run('resume')}>Résumé</button>
          <button type="button" className="btn" onClick={() => run('contact')}>Contact</button>
        </div>
        <p className="out faint hint-line">
          Prefer a keyboard? There's a command line in the side panel — try {L('git log', 'git log')}, {L('htop')}, or {L('ssh papyrus', 'ssh papyrus')}.
        </p>
      </div>
    );
  }
  function aboutNode(): ReactNode {
    return (
      <>
        <div className="eyebrow">// about</div>
        <div className="two">
          <div className="measure">
            <p className="out">I'm <span className="g bold">Akshat</span>. I build the data &amp; streaming platform behind a video-AI product at Intozi Tech.</p>
            <p className="out">Day to day that's the ingest paths, the Celery/RabbitMQ pipelines that keep live camera feeds and model inference off the request path, the Postgres/Redis data layers under them, and an internal MLOps loop that takes raw datasets all the way to a re-trained model. I'm mostly self-taught, with a CS degree from Bhilai Institute of Technology.</p>
            <p className="out">The frontend I pick up when it needs doing — this terminal is one of those times. When a project needs a tool I haven't used — Ansible, scapy, scikit-learn, ONVIF — I learn it on the way and ship.</p>
            <p className="out faint">Off the clock I'm a published author (a novelette and two novels) and I shoot &amp; edit short films — same discipline as the backend: structure, revision, and deciding what to cut.</p>
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
            <div className="btnrow" style={{ marginTop: 16 }}>
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
        <div className="eyebrow">// experience</div>
        <div className="two">
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
        <div className="eyebrow" style={{ marginTop: 18 }}>// earlier</div>
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
        <div className="m"><span className="faint">{p.year}</span><span className="g">{p.tags.join(' · ')}</span></div>
      </div>
    );
  }
  function projectsNode(): ReactNode {
    return (
      <>
        <div className="eyebrow">// projects · open source</div>
        <p className="out dim">Click a card to read more. Everything here is on <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GitHub ↗</a>.</p>
        <div className="grid">{PROJECTS.map(projectCard)}</div>
        <div className="eyebrow" style={{ marginTop: 18 }}>// lab · foundations</div>
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
        <div className="lr" style={{ marginTop: 8 }}><span className="g bold"># {p.title}</span> <span className="faint">{p.year}</span> {statusTag(p.status)}</div>
        <p className="out measure" style={{ marginTop: 6 }}>{p.blurb}</p>
        <div className="lr" style={{ marginTop: 10 }}>{p.tags.map((t) => <span className="chip" key={t}>{t}</span>)}</div>
        <div className="btnrow" style={{ marginTop: 12 }}>
          <a className="btn primary" href={p.link} target="_blank" rel="noopener noreferrer">Open repo ↗</a>
        </div>
        {isMain && SSH_LOGS[slug(p)] ? <p className="out faint" style={{ marginTop: 10 }}>developers: it's live — try {L('ssh ' + slug(p), 'ssh ' + slug(p))}</p> : null}
      </>
    );
  }
  function skillsNode(): ReactNode {
    return (
      <>
        <div className="eyebrow">// skills · what I reach for</div>
        <div className="grid">
          {SKILL_GROUPS.map((g) => (
            <div className="panel" key={g.h}>
              <div className="g bold">{g.h}</div>
              <div className="out dim" style={{ marginTop: 6 }}>{g.items}</div>
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
        <div className="eyebrow">// contact</div>
        <div className="panel" style={{ marginBottom: 12 }}>
          <span className="g bold">● open to work</span> <span className="dim">— {AVAILABILITY}. Fastest way to reach me is email; I read everything.</span>
        </div>
        <div className="grid">
          {CONTACT_LINKS.map((c) =>
            c.icon === 'resume' ? (
              <button type="button" className="card" style={{ textAlign: 'left' }} key={c.label} onClick={() => run('resume')}>
                <div className="t">Résumé</div><div className="d">{c.value}</div>
              </button>
            ) : (
              <a className="card" key={c.label} href={c.href} target={c.icon === 'email' ? undefined : '_blank'} rel="noopener noreferrer">
                <div className="t">{c.label}</div><div className="d">{c.value}</div>
              </a>
            ),
          )}
        </div>
      </>
    );
  }
  function resumeNode(): ReactNode {
    return (
      <>
        <div className="eyebrow">// résumé</div>
        <div className="panel" style={{ maxWidth: 580 }}>
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
        <div className="eyebrow">// git log --oneline · career</div>
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
  function neofetchNode(): ReactNode {
    return (
      <>
        <div className="eyebrow">// neofetch</div>
        <div className="fetch">
          <AsciiFace art={FACE} />
          <div className="info">
            <div className="hd">akshat@intozi</div>
            <div className="rl">{'─'.repeat(22)}</div>
            {frow('Name', 'Akshat Pandey')}
            {frow('Role', <>{ROLE} @ <span className="cy">Intozi Tech</span></>)}
            {frow('Uptime', '2 yrs @ Intozi · coding since 2020')}
            {frow('Focus', 'ingest · async pipelines · MLOps')}
            {frow('Stack', 'Python · FastAPI · Django · Postgres')}
            {frow('Async', 'Celery · RabbitMQ · Redis · ARQ')}
            {frow('Stream', 'MediaMTX · WebRTC · ONVIF')}
            {frow('Base', 'Gurugram, IN · remote-friendly')}
            {frow('Status', <span className="g">● open to work</span>)}
            <div className="blocks">{colorBlocks()}</div>
          </div>
        </div>
      </>
    );
  }
  function helpNode(): ReactNode {
    const core: [string, string][] = [
      ['about', 'who I am'], ['experience', 'what I do at Intozi'], ['projects', 'open-source work'],
      ['skills', 'the stack I use'], ['resume', 'view / download the PDF'], ['contact', 'ways to reach me'],
    ];
    const curious = ['neofetch', 'git log', 'htop', 'ssh papyrus', 'ls', 'whoami', 'sudo hire-me'];
    return (
      <>
        <div className="eyebrow">// help</div>
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
        <div className="eyebrow">// shell</div>
        <div className="console">{consoleLines}</div>
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

  function renderView(): ReactNode {
    switch (view.k) {
      case 'home': return homeNode();
      case 'about': return aboutNode();
      case 'experience': return experienceNode();
      case 'projects': return projectsNode();
      case 'project': return projectDetailNode(view.slug);
      case 'skills': return skillsNode();
      case 'resume': return resumeNode();
      case 'contact': return contactNode();
      case 'help': return helpNode();
      case 'gitlog': return gitlogNode();
      case 'neofetch': return neofetchNode();
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
    if (e.key === 'Enter') { e.preventDefault(); const v = input; setInput(''); if (v.trim()) run(v, { echo: true }); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (histIdxRef.current > 0) { histIdxRef.current--; setInput(histRef.current[histIdxRef.current] ?? ''); } }
    else if (e.key === 'ArrowDown') { e.preventDefault(); if (histIdxRef.current < histRef.current.length) { histIdxRef.current++; setInput(histRef.current[histIdxRef.current] ?? ''); } }
    else if (e.key === 'ArrowRight') {
      const m = input && !/\s/.test(input) ? CMDS.find((c) => c.startsWith(input.toLowerCase()) && c !== input.toLowerCase()) : undefined;
      const el = e.currentTarget;
      if (m && el.selectionStart != null && el.selectionStart >= input.length) { e.preventDefault(); setInput(m); }
    }
    else if (e.key === 'Tab') { e.preventDefault(); complete(); }
    else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); setConsoleLines([]); setView({ k: 'home' }); }
  }
  function complete() {
    const t = input.trim();
    if (!t || /\s/.test(t)) return;
    const hits = CMDS.filter((c) => c.startsWith(t.toLowerCase()));
    if (hits.length === 1) setInput(hits[0] + ' ');
    else if (hits.length > 1) pushConsole(<div className="out dim">{hits.join('  ')}</div>);
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

  /* honor a deep link once, after boot (site.com/#projects) */
  useEffect(() => {
    if (booting) return;
    const h = decodeURIComponent(location.hash.replace(/^#/, '')).trim().toLowerCase();
    const first = h.split(/\s+/)[0];
    if (h && (SECTION.has(first) || CMDS.includes(first))) exec(h);
    focusDesktop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booting]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  /* swap scrolls the pane to the top; streaming views stick to the bottom */
  useEffect(() => {
    const el = paneRef.current;
    if (!el) return;
    if (view.k === 'ssh' || view.k === 'console') el.scrollTop = el.scrollHeight;
    else el.scrollTop = 0;
  }, [view, consoleLines, sshLines]);

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
        <Clock />
      </div>

      <div className="term-main">
        <main
          className="pane"
          ref={paneRef}
          onClick={(e) => { if (!(e.target as HTMLElement).closest('button, a, input')) focusDesktop(); }}
        >
          <div className="pane-inner" key={view.k === 'project' ? 'p-' + view.slug : view.k}>
            {renderView()}
          </div>
        </main>

        <aside className="rail" aria-label="profile and navigation">
          <div className="rail-fetch">
            <AsciiFace art={FACE} />
            <div className="rail-id">
              <button type="button" className="rail-name" onClick={() => run('home')}>akshat@intozi</button>
              <div className="rl">{'─'.repeat(18)}</div>
              {frow('Role', ROLE)}
              {frow('Focus', 'ingest · pipelines · MLOps')}
              {frow('Data', 'Postgres · Redis · Celery')}
              {frow('Base', 'Gurugram, IN')}
              {frow('Status', <span className="g">● open to work</span>)}
            </div>
          </div>

          <nav className="rail-nav" aria-label="sections">
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

          <div className="rail-cli" onClick={focus}>
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
                onChange={(e) => setInput(e.target.value)}
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
            <div className="cli-hint faint">↑ history · Tab completes · {L('help')}</div>
          </div>
        </aside>
      </div>

      {overlay === 'htop' && <Htop reducedMotion={RM} onExit={() => { setOverlay(null); focus(); }} />}
    </div>
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
