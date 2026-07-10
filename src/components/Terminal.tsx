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
  CONTACT_LINKS,
  EMAIL,
  EXPERIENCES,
  GITHUB_URL,
  LAB_REPOS,
  PAST_ROLES,
  PROJECTS,
  RESUME_DOWNLOAD_NAME,
  RESUME_FILE,
  ROLE,
  type Project,
} from '../lib/data';
import { FACE } from '../lib/face';
import { AsciiFace } from './AsciiFace';
import { Htop } from './Htop';

const RM =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* career, rendered as a git history */
const COMMITS: [string, string, string][] = [
  ['a1f0cc2', 'now', 'feat(mlops): dataset → label → verify → retrain, all in-tool'],
  ['7d3e11b', '2025', 'perf(api): move inference off the request path (celery/rabbitmq)'],
  ['3b9a04e', '2025', 'ship: Hoctor — wifi indoor localization (random forest)'],
  ['c04f7aa', '2024', 'feat(vms): live RTSP/WebRTC via MediaMTX into the app'],
  ['e21b8d9', '2024', 'ship: ShieldBuntu — one-click CIS hardening, streamed over SSE'],
  ['9ba33c1', '2024', 'join: Intozi Tech — backend engineer'],
  ['f5c0d70', '2023', "win: KAVACH'23 — Govt. of India national hackathon"],
  ['0012abf', '2020', 'init: first commit. hello, backend.'],
];

/* project "servers" you can ssh into — a delighter for developers */
const SSH_LOGS: Record<string, string[]> = {
  papyrus: ['POST /api/merge 200 · 4 files', 'celery: ocr.task[a3f] done in 2.41s', 'purge: 6 files wiped (zero-retention)', 'GET /healthz 200'],
  headtogether: ['ws: room#kailash presence=12', 'msg relayed · room#cp · 3ms', 'waitlist: promoted user 88', 'ws: typing… room#kailash'],
  shieldbuntu: ['ansible: role[19-firewall] ok', 'SSE: harden.ufw changed', 'snapshot: pre-apply saved', 'pam: auth ok (local)'],
  hoctor: ['scan: 14 APs · rssi vector built', 'rf.predict: room=lab-2 conf=0.91', 'model: per-venue forest loaded'],
  meshhawk: ['pcap: 1.4k frames parsed', 'graph: 6 clusters · mesh-score 0.78', 'networkx: centrality computed'],
};

const CMDS = [
  'help', 'about', 'experience', 'projects', 'skills', 'resume', 'contact',
  'neofetch', 'clear', 'ls', 'cd', 'cat', 'pwd', 'whoami', 'uname', 'date',
  'echo', 'history', 'git', 'htop', 'ssh', 'sudo', 'project',
];

/* commands that map to a shareable #hash (deep links: site.com/#projects) */
const SECTION = new Set(['about', 'experience', 'projects', 'skills', 'resume', 'contact']);

const NAV: { cmd: string; label: string; primary?: boolean }[] = [
  { cmd: 'neofetch', label: 'neofetch' },
  { cmd: 'about', label: 'About' },
  { cmd: 'experience', label: 'Experience' },
  { cmd: 'projects', label: 'Projects' },
  { cmd: 'skills', label: 'Skills' },
  { cmd: 'resume', label: 'Résumé', primary: true },
  { cmd: 'contact', label: 'Contact' },
];

const SKILL_GROUPS: { h: string; items: string }[] = [
  { h: 'languages', items: 'Python · SQL · Bash · TypeScript' },
  { h: 'frameworks', items: 'FastAPI · Django · React' },
  { h: 'data & async', items: 'PostgreSQL · Redis · RabbitMQ · Celery' },
  { h: 'streaming / ml', items: 'MediaMTX · WebRTC · scikit-learn' },
  { h: 'infra', items: 'Docker · Linux · Nginx · AWS · Git' },
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
        <div key={i}>{row.map((c, j) => <span key={j} style={{ color: c }}>███</span>)}</div>
      ))}
    </>
  );
}

export function Terminal() {
  const [blocks, setBlocks] = useState<ReactNode[]>([]);
  const [input, setInput] = useState('');
  const [focused, setFocused] = useState(false);
  const [overlay, setOverlay] = useState<'htop' | null>(null);
  const [sshHost, setSshHost] = useState<string | null>(null);
  const [cwd, setCwd] = useState<string[]>([]);

  const idRef = useRef(0);
  const scrollMode = useRef<'top' | 'bottom'>('bottom');
  const histRef = useRef<string[]>([]);
  const histIdxRef = useRef(0);
  const bootedRef = useRef(false);
  const bootTimer = useRef<number | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const unlockedRef = useRef(false);

  const push = useCallback((node: ReactNode) => {
    setBlocks((b) => [...b, <div className="blk" key={idRef.current++}>{node}</div>]);
  }, []);

  /* prompt line for the current context (ssh host / working dir) */
  function promptSpan(): ReactNode {
    if (sshHost) {
      return (
        <span className="ps"><span className="u">akshat@{sshHost}</span><span className="c">:</span><span className="p">~</span><span className="c">$ </span></span>
      );
    }
    const path = cwd.length ? '~/' + cwd.join('/') : '~';
    return (
      <span className="ps"><span className="u">akshat@intozi</span><span className="c">:</span><span className="p">{path}</span><span className="c">$ </span></span>
    );
  }

  /* the shell dispatcher (hoisted so content builders below can call it) */
  function exec(raw: string) {
    scrollMode.current = 'bottom'; // typed commands keep the prompt in view (terminal-natural)
    const cmd = (raw ?? '').trim();
    push(<div className="cmdline">{promptSpan()}<span>{cmd}</span></div>);
    if (!cmd) return;
    histRef.current.push(cmd);
    histIdxRef.current = histRef.current.length;

    const first = cmd.split(/\s+/)[0].toLowerCase();
    const rest = cmd.slice(first.length).trim();

    // inside an ssh session: only a small set of verbs, then `exit`
    if (sshHost) {
      if (first === 'exit' || first === 'logout') {
        push(<div className="out dim">Connection to {sshHost}.prod closed.</div>);
        setSshHost(null);
      } else if (first === 'status' || first === 'uptime') {
        push(<div className="out g">● {sshHost}.prod — nominal · up 41d</div>);
      } else if (first === 'clear') {
        setBlocks([]);
      } else {
        push(<div className="out dim">{first}: on {sshHost}.prod try {L('status')} , {L('logs', 'logs')} , or {L('exit')}.</div>);
      }
      return;
    }

    switch (first) {
      case 'help': push(helpNode()); break;
      case 'about': push(aboutNode()); break;
      case 'experience': case 'work': push(experienceNode()); break;
      case 'projects': push(projectsNode()); break;
      case 'project': push(projectDetailNode(rest)); break;
      case 'skills': case 'stack': push(skillsNode()); break;
      case 'resume': case 'cv': push(resumeNode()); break;
      case 'contact': push(contactNode()); break;
      case 'neofetch': case 'fetch': push(neofetchNode()); break;
      case 'git': push(gitlogNode()); break;
      case 'htop': case 'top': setOverlay('htop'); break;
      case 'ssh': sshCmd(rest); break;
      case 'clear': case 'cls': setBlocks([]); break;
      case 'ls': case 'dir': lsCmd(); break;
      case 'cd': cdCmd(rest); break;
      case 'cat': catCmd(rest); break;
      case 'pwd': push(<div className="out">/home/akshat{cwd.length ? '/' + cwd.join('/') : ''}</div>); break;
      case 'whoami': push(<div className="out">akshat{unlockedRef.current ? <span className="faint"> (root — you escalated, respect)</span> : null}</div>); break;
      case 'uname': push(<div className="out dim">Linux intozi-akshat 6.17.0-oem #1 SMP x86_64 GNU/Linux</div>); break;
      case 'hostname': push(<div className="out">intozi-akshat</div>); break;
      case 'date': push(<div className="out dim">{new Date().toString()}</div>); break;
      case 'echo': push(<div className="out">{rest}</div>); break;
      case 'history': push(<pre className="out">{histRef.current.map((h, i) => `${String(i + 1).padStart(3)}  ${h}`).join('\n')}</pre>); break;
      case 'sudo': sudoCmd(rest); break;
      case 'exit': case 'logout': push(<div className="out dim">There's no exit — this is the whole site. Try {L('help')}.</div>); break;
      case 'open': openRepo(rest); break;
      default:
        push(<div className="out"><span className="rd">{first}: command not found</span> — try {L('help')}{nearHint(first) ? <> · did you mean {L(nearHint(first))}?</> : null}</div>);
    }
  }

  const go = (cmd: string) => {
    exec(cmd);
    scrollMode.current = 'top'; // clicking a section scrolls its heading to the top to read top-down
    const base = cmd.split(' ')[0];
    if (SECTION.has(base)) { try { history.replaceState(null, '', `#${base}`); } catch { /* ignore */ } }
    inputRef.current?.focus();
  };

  /* a clickable inline command token */
  const L = (cmd: string, label?: ReactNode): ReactNode => (
    <button type="button" className="cmd" onClick={() => go(cmd)}>{label ?? cmd}</button>
  );

  /* ── content builders (hoisted function declarations) ───────────────── */
  function frow(k: string, v: ReactNode): ReactNode {
    return <div className="frow"><span className="k">{k}</span><span className="v">{v}</span></div>;
  }
  function neofetchNode(): ReactNode {
    return (
      <div className="fetch">
        <AsciiFace art={FACE} />
        <div className="info">
          <div className="hd">akshat@intozi</div>
          <div className="rl">{'─'.repeat(22)}</div>
          {frow('Name', 'Akshat Pandey')}
          {frow('Role', <>{ROLE} @ <span className="cy">Intozi Tech</span></>)}
          {frow('Uptime', '2 yrs @ Intozi · coding since 2020')}
          {frow('Stack', 'Python · FastAPI · Django · Postgres')}
          {frow('Async', 'Celery · RabbitMQ · Redis')}
          {frow('Focus', 'video AI — streaming, MLOps')}
          {frow('Base', 'Gurugram, IN · remote-friendly')}
          {frow('Status', <span className="g">● open to work</span>)}
          <div className="blocks">{colorBlocks()}</div>
        </div>
        <aside className="hero-cta">
          <div className="hc-title">jump in</div>
          <div className="hc-btns">
            <button type="button" className="btn primary" onClick={() => go('projects')}>See projects</button>
            <button type="button" className="btn" onClick={() => go('resume')}>Résumé</button>
            <button type="button" className="btn" onClick={() => go('experience')}>Experience</button>
            <button type="button" className="btn" onClick={() => go('contact')}>Contact</button>
          </div>
          <div className="faint" style={{ fontSize: 12 }}>…or type a command below ↓</div>
        </aside>
      </div>
    );
  }
  function welcomeNode(): ReactNode {
    return (
      <div className="out">
        <span className="gh bold">Welcome.</span>{' '}
        <span className="dim">This is Akshat's résumé, as a terminal. Not into typing? Just click a button up top ↑. Curious? Try </span>
        {L('projects')}<span className="dim">, </span>{L('resume')}<span className="dim">, or </span>{L('help')}<span className="dim">.</span>
      </div>
    );
  }
  function aboutNode(): ReactNode {
    return (
      <>
        <div className="eyebrow">// about</div>
        <div className="two">
          <div className="measure">
            <p className="out">I'm <span className="g bold">Akshat</span> — I build the backend for a video-AI product at Intozi Tech.</p>
            <p className="out">Django and FastAPI services, the data models under them, and the Celery pipelines that keep live camera feeds and model inference off the request path. Mostly self-taught, with a CS degree from Bhilai Institute of Technology.</p>
            <p className="out">I take the frontend when it needs doing — this terminal is one of those times. When a project needs a tool I haven't used (Ansible, scapy, scikit-learn), I pick it up and ship with it.</p>
          </div>
          <aside className="panel">
            <div className="kv">
              <span className="k">role</span><span>{ROLE}</span>
              <span className="k">company</span><span>Intozi Tech · 2 yrs</span>
              <span className="k">base</span><span>Gurugram, IN</span>
              <span className="k">degree</span><span>B.Tech CS · BIT Durg</span>
              <span className="k">award</span><span className="am">KAVACH'23 — national hackathon, winner</span>
              <span className="k">status</span><span className="g">● open to work</span>
            </div>
            <div className="btnrow" style={{ marginTop: 16 }}>
              <button type="button" className="btn primary" onClick={() => go('resume')}>Résumé</button>
              <button type="button" className="btn" onClick={() => go('contact')}>Contact</button>
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
        className="card"
        key={p.title}
        role="button"
        tabIndex={0}
        onClick={() => go('project ' + slug(p))}
        onKeyDown={(ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); go('project ' + slug(p)); } }}
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
        <div className="eyebrow" style={{ marginTop: 18 }}>// lab · backend foundations</div>
        <div className="grid">{LAB_REPOS.map(projectCard)}</div>
      </>
    );
  }
  function projectDetailNode(q: string): ReactNode {
    const key = q.replace(/\.md$/, '').toLowerCase();
    const p = [...PROJECTS, ...LAB_REPOS].find(
      (x) => slug(x) === key || x.title.toLowerCase() === key || x.title.toLowerCase().startsWith(key),
    );
    if (!p) return <div className="out"><span className="rd">project '{q}' not found.</span> see {L('projects')}</div>;
    const isMain = PROJECTS.includes(p);
    return (
      <>
        <div className="lr"><span className="g bold"># {p.title}</span> <span className="faint">{p.year}</span> {statusTag(p.status)}</div>
        <p className="out measure" style={{ marginTop: 6 }}>{p.blurb}</p>
        <div className="lr" style={{ marginTop: 8 }}>{p.tags.map((t) => <span className="chip" key={t}>{t}</span>)}</div>
        <div className="btnrow" style={{ marginTop: 12 }}>
          <a className="btn primary" href={p.link} target="_blank" rel="noopener noreferrer">Open repo ↗</a>
        </div>
        {isMain ? <p className="out faint" style={{ marginTop: 8 }}>developers: it's live — try {L('ssh ' + slug(p), 'ssh ' + slug(p))}</p> : null}
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
        <p className="out faint" style={{ marginTop: 12 }}>no percentages — grouped by how often I actually use them. Curious what's running? try {L('htop')}.</p>
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
              <button type="button" className="card" style={{ textAlign: 'left' }} key={c.label} onClick={() => go('resume')}>
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
      <div className="panel" style={{ maxWidth: 580 }}>
        <div className="lr"><span className="g bold">Akshat-Pandey-Resume.pdf</span> <span className="chip">PDF · one page</span></div>
        <p className="out dim" style={{ marginTop: 6 }}>Open it in a new tab to read, or download a copy.</p>
        <div className="btnrow" style={{ marginTop: 12 }}>
          <a className="btn primary" href={RESUME_FILE} target="_blank" rel="noopener noreferrer">View in browser ↗</a>
          <a className="btn" href={RESUME_FILE} download={RESUME_DOWNLOAD_NAME}>Download ↓</a>
        </div>
      </div>
    );
  }
  function gitlogNode(): ReactNode {
    return (
      <pre className="out">
        {COMMITS.map((c, i) => (
          <span key={c[0]}>
            <span className="am">* </span><span className="am">{c[0]}</span>{i === 0 ? <span className="am"> (HEAD → main)</span> : null} {c[2]}{'\n'}
            <span className="faint">{'|             ' + c[1] + ' · Akshat Pandey'}</span>{'\n'}
            {i < COMMITS.length - 1 ? <><span className="am">|</span>{'\n'}</> : null}
          </span>
        ))}
      </pre>
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
        <p className="out dim">Click any button up top, or type a command. Here's the menu:</p>
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

  /* ── mini filesystem (dev delighter) ────────────────────────────────── */
  function lsCmd() {
    if (cwd[0] === 'projects') {
      push(<div className="out">{PROJECTS.map((p) => <span key={p.title} className="g">{slug(p)}.md&nbsp;&nbsp;</span>)}</div>);
    } else if (cwd[0] === 'lab') {
      push(<div className="out">{LAB_REPOS.map((p) => <span key={p.title} className="g">{slug(p)}.md&nbsp;&nbsp;</span>)}</div>);
    } else {
      push(
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
    if (!a || a === '~' || a === '/' || a === '..') { setCwd([]); return; }
    if (a === 'projects' || a === 'lab') { setCwd([a]); return; }
    push(<div className="out rd">cd: {a}: no such directory</div>);
  }
  function catCmd(arg: string) {
    const a = arg.trim().replace(/\.md$/, '').replace(/\.pdf$/, '').toLowerCase();
    const map: Record<string, string> = { about: 'about', experience: 'experience', skills: 'skills', contact: 'contact', resume: 'resume' };
    if (map[a]) { exec(map[a]); return; }
    if ([...PROJECTS, ...LAB_REPOS].some((p) => slug(p) === a)) { exec('project ' + a); return; }
    push(<div className="out rd">cat: {arg || ''}: no such file</div>);
  }
  function sudoCmd(rest: string) {
    if (/hire/.test(rest)) {
      push(<div className="out dim">[sudo] password for recruiter: <span className="faint">••••••••</span></div>);
      window.setTimeout(() => {
        unlockedRef.current = true;
        push(<div className="out"><span className="g bold">✓ access granted.</span> Email <a href={`mailto:${EMAIL}`}>{EMAIL}</a> or run {L('contact')}. I reply.</div>);
      }, 380);
    } else if (/rm\s+-rf/.test(rest)) {
      push(<div className="out rd">rm: refusing to remove '/' — I need this machine, it's open to work 🙂</div>);
    } else {
      push(<div className="out dim">akshat is not in the sudoers file. (kidding — try {L('sudo hire-me', 'sudo hire-me')})</div>);
    }
  }
  function openRepo(id: string) {
    const p = [...PROJECTS, ...LAB_REPOS].find((x) => slug(x) === id.toLowerCase());
    if (!p) { push(projectDetailNode(id)); return; }
    push(<div className="out">opening <span className="g">{p.title}</span> → <a href={p.link} target="_blank" rel="noopener noreferrer">{p.link.replace('https://', '')} ↗</a></div>);
    window.open(p.link, '_blank', 'noopener');
  }
  function sshCmd(host: string) {
    const h = host.trim().toLowerCase().replace(/.*@/, '');
    if (!SSH_LOGS[h]) {
      push(<div className="out"><span className="rd">ssh: could not resolve host '{host}'</span>. try: {Object.keys(SSH_LOGS).map((k, i) => <span key={k}>{i ? ' ' : ''}{L('ssh ' + k, k)}</span>)}</div>);
      return;
    }
    push(<div className="out dim">Connecting to {h}.prod … <span className="g">key accepted</span></div>);
    push(
      <pre className="out g">{`┌${'─'.repeat(40)}┐\n│  ${(h + '.prod').padEnd(20)}  ● all systems nominal │\n└${'─'.repeat(40)}┘`}</pre>,
    );
    push(<div className="out dim">tailing /var/log/{h}.log — type {L('exit')} to disconnect</div>);
    setSshHost(h);
  }
  function nearHint(c: string): string {
    return CMDS.find((x) => x.startsWith(c) || c.startsWith(x)) ?? '';
  }

  /* ── input handling ─────────────────────────────────────────────────── */
  function handleKey(e: ReactKeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') { e.preventDefault(); const v = input; setInput(''); exec(v); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (histIdxRef.current > 0) { histIdxRef.current--; setInput(histRef.current[histIdxRef.current] ?? ''); } }
    else if (e.key === 'ArrowDown') { e.preventDefault(); if (histIdxRef.current < histRef.current.length) { histIdxRef.current++; setInput(histRef.current[histIdxRef.current] ?? ''); } }
    else if (e.key === 'ArrowRight') {
      const lc = input.toLowerCase();
      const m = input && !/\s/.test(input) ? CMDS.find((c) => c.startsWith(lc) && c !== lc) : undefined;
      const el = e.currentTarget;
      if (m && el.selectionStart != null && el.selectionStart >= input.length) { e.preventDefault(); setInput(m); }
    }
    else if (e.key === 'Tab') { e.preventDefault(); complete(); }
    else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); setBlocks([]); }
  }
  function complete() {
    const t = input.trim();
    if (!t || /\s/.test(t)) return;
    const hits = CMDS.filter((c) => c.startsWith(t.toLowerCase()));
    if (hits.length === 1) setInput(hits[0] + ' ');
    else if (hits.length > 1) push(<div className="out dim">{hits.join('  ')}</div>);
  }

  /* ── boot sequence ──────────────────────────────────────────────────── */
  useEffect(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;
    const lines: ReactNode[] = [
      <><span className="faint">[ <span className="g">0.00</span> ] GRUB loading Zorin OS 18 …</span></>,
      <><span className="faint">[ <span className="g">0.31</span> ] kernel: waking backend engineer</span></>,
      <><span className="faint">[ <span className="g">0.58</span> ] starting services: postgres redis rabbitmq celery … <span className="g">ok</span></span></>,
      <><span className="faint">[ <span className="g">0.79</span> ] systemd: reached target <span className="g">open-to-work.service</span></span></>,
      <><span className="dim">Last login: just now on tty1 — running <span className="g">neofetch</span>…</span></>,
    ];
    const finish = () => {
      push(neofetchNode());
      push(welcomeNode());
      const h = decodeURIComponent(location.hash.replace(/^#/, '')).trim().toLowerCase();
      const first = h.split(/\s+/)[0];
      if (h && (SECTION.has(first) || CMDS.includes(first))) { exec(h); scrollMode.current = 'top'; }
      inputRef.current?.focus();
    };
    if (RM) { lines.forEach((l) => push(<div className="out">{l}</div>)); finish(); return; }
    let i = 0;
    const step = () => {
      if (i >= lines.length) { finish(); return; }
      push(<div className="out">{lines[i]}</div>);
      i += 1;
      bootTimer.current = window.setTimeout(step, 230);
    };
    step();
    return () => { if (bootTimer.current) window.clearTimeout(bootTimer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* live log tail while ssh'd in */
  useEffect(() => {
    if (!sshHost || RM) return;
    const logs = SSH_LOGS[sshHost] ?? [];
    let i = 0;
    const iv = window.setInterval(() => {
      scrollMode.current = 'bottom';
      const t = new Date().toTimeString().slice(0, 8);
      push(<div className="out"><span className="faint">{t}</span> <span className="cy">{logs[i % logs.length]}</span></div>);
      i += 1;
    }, 1500);
    return () => window.clearInterval(iv);
  }, [sshHost, push]);

  /* scroll: a run scrolls its command line to the top (read top-down);
     streaming output (ssh tail, boot) sticks to the bottom */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (scrollMode.current === 'top') {
      const cmds = el.querySelectorAll('.cmdline');
      const last = cmds[cmds.length - 1] as HTMLElement | undefined;
      if (last) { last.scrollIntoView({ block: 'start', behavior: 'auto' }); return; }
    }
    el.scrollTop = el.scrollHeight;
  }, [blocks]);

  const lc = input.toLowerCase();
  const ghostMatch = input && !/\s/.test(input) ? CMDS.find((c) => c.startsWith(lc) && c !== lc) : undefined;
  const ghost = ghostMatch ? ghostMatch.slice(input.length) : '';

  return (
    <div className="term">
      <a className="skip" href="#term-input">Skip to command input</a>

      <div className="term-top">
        <span className="dots" aria-hidden="true"><span className="dot r" /><span className="dot y" /><span className="dot g" /></span>
        <span className="term-tab"><b>akshat@intozi</b><span className="tabpath">: {sshHost ? 'ssh:' + sshHost : cwd.length ? '~/' + cwd.join('/') : '~'}</span></span>
        <span className="grow" />
        <Clock />
      </div>

      <nav className="term-nav" aria-label="sections">
        <div className="term-nav-inner">
          <span className="lead" aria-hidden="true">$</span>
          {NAV.map((n) => (
            <button
              key={n.cmd}
              type="button"
              className={'navbtn' + (n.primary ? ' primary' : '')}
              onClick={() => go(n.cmd)}
            >
              <span className="pmt" aria-hidden="true">›</span>{n.label}
            </button>
          ))}
          <button type="button" className="navbtn" onClick={() => go('help')} aria-label="show all commands">
            <span className="pmt" aria-hidden="true">›</span>help
          </button>
          <span className="hint">click a button — or type below ↓</span>
        </div>
      </nav>

      <div
        className="term-screen"
        ref={scrollRef}
        onClick={(e) => { if (!(e.target as HTMLElement).closest('button, a, input')) inputRef.current?.focus(); }}
      >
        <div className="term-inner">
          {blocks}
          <div className="inl" onClick={() => inputRef.current?.focus()}>
            {promptSpan()}
            <span className="typed">{input}</span>
            <span className={focused ? 'blk-caret' : 'blk-caret off'} aria-hidden="true" />
            {ghost && <span className="ghost" aria-hidden="true">{ghost}</span>}
            {input === '' && <span className="ph2">type a command like 'help' — or click a button above ↑</span>}
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
        </div>
      </div>

      {overlay === 'htop' && <Htop reducedMotion={RM} onExit={() => { setOverlay(null); inputRef.current?.focus(); }} />}
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
