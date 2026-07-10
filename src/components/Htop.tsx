import { useEffect, useRef, useState } from 'react';

/*
  A live process monitor — a hidden delighter for developers who type `htop`.
  The "processes" are the real services a video-AI backend runs, which quietly
  makes the case for the role better than a paragraph could.
*/
type Proc = { pid: number; user: string; name: string; cpu: number; mem: number; note: string };

const BASE: Proc[] = [
  { pid: 1337, user: 'akshat', name: 'ikshana', cpu: 34, mem: 18, note: 'analytics engine (video AI)' },
  { pid: 1401, user: 'akshat', name: 'mediamtx', cpu: 22, mem: 9, note: 'RTSP / WebRTC gateway' },
  { pid: 1444, user: 'akshat', name: 'gunicorn·fastapi', cpu: 12, mem: 7, note: 'API workers' },
  { pid: 1502, user: 'akshat', name: 'celery·worker', cpu: 28, mem: 11, note: 'off-request pipeline' },
  { pid: 1503, user: 'akshat', name: 'celery·worker', cpu: 19, mem: 10, note: 'off-request pipeline' },
  { pid: 1560, user: 'rabbit', name: 'rabbitmq', cpu: 6, mem: 5, note: 'message broker' },
  { pid: 1590, user: 'postgres', name: 'postgres', cpu: 9, mem: 14, note: 'the source of truth' },
  { pid: 1610, user: 'redis', name: 'redis', cpu: 3, mem: 3, note: 'cache + results' },
  { pid: 1701, user: 'akshat', name: 'mlops-trainer', cpu: 41, mem: 22, note: 'dataset → retrain loop' },
  { pid: 2010, user: 'akshat', name: 'vite', cpu: 7, mem: 4, note: 'this website' },
  { pid: 2050, user: 'akshat', name: 'htop', cpu: 2, mem: 1, note: 'you are here' },
];

const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

function Meter({ lab, v, mem }: { lab: string; v: number; mem?: boolean }) {
  return (
    <div className="hmeter">
      <span className="lab">{lab}</span>
      <span className={'hbar' + (mem ? ' mem' : '')}><i style={{ width: `${v.toFixed(0)}%` }} /></span>
      <span className="hpct">{v.toFixed(1)}%</span>
    </div>
  );
}

export function Htop({ reducedMotion, onExit }: { reducedMotion: boolean; onExit: () => void }) {
  const [cores, setCores] = useState<number[]>(() => Array.from({ length: 8 }, () => rnd(8, 55)));
  const [procs, setProcs] = useState<Proc[]>(BASE);
  const [mem, setMem] = useState(() => rnd(46, 58));
  const [elapsed, setElapsed] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // move focus into the dialog so keystrokes don't leak to the input behind it
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'q' || e.key === 'Escape' || (e.ctrlKey && e.key === 'c')) {
        e.preventDefault();
        onExit();
      }
    };
    window.addEventListener('keydown', onKey);
    let iv: number | undefined;
    if (!reducedMotion) {
      iv = window.setInterval(() => {
        setCores((cs) => cs.map((c) => clamp(c + rnd(-14, 14), 2, 99)));
        setMem((m) => clamp(m + rnd(-3, 3), 30, 74));
        setProcs((ps) => ps.map((p) => ({ ...p, cpu: clamp(p.cpu + rnd(-6, 6), 0, 99), mem: clamp(p.mem + rnd(-2, 2), 0, 99) })));
        setElapsed((s) => s + 1);
      }, 1100);
    }
    return () => { window.removeEventListener('keydown', onKey); if (iv) window.clearInterval(iv); };
  }, [reducedMotion, onExit]);

  const load = (cores.reduce((a, c) => a + c, 0) / cores.length / 100) * 4;
  const up = elapsed;
  const sorted = [...procs].sort((a, b) => b.cpu - a.cpu);

  return (
    <div className="ov" role="dialog" aria-modal="true" aria-label="htop process monitor">
      <div className="ov-head">
        <span>htop — akshat@intozi</span>
        <button ref={closeRef} type="button" onClick={onExit} style={{ color: 'inherit', fontWeight: 700 }}>press q to quit ✕</button>
      </div>
      <div className="ov-body">
        {cores.map((v, i) => <Meter key={i} lab={String(i + 1)} v={v} />)}
        <Meter lab="Mem" v={mem} mem />
        <div className="out faint" style={{ margin: '6px 0 2px' }}>
          Tasks: 213, 41 running · Load avg: {load.toFixed(2)} {(load * 0.9).toFixed(2)} {(load * 0.8).toFixed(2)} · Uptime: 2y {Math.floor(up / 60)}m {up % 60}s
        </div>
        <table className="htab">
          <thead>
            <tr><th>PID</th><th>USER</th><th>CPU%</th><th>MEM%</th><th>COMMAND</th><th>note</th></tr>
          </thead>
          <tbody>
            {sorted.map((p) => (
              <tr key={p.pid}>
                <td>{p.pid}</td>
                <td className={p.user === 'akshat' ? 'g' : ''}>{p.user}</td>
                <td>{p.cpu.toFixed(1)}</td>
                <td>{p.mem.toFixed(1)}</td>
                <td className="cc">{p.name}</td>
                <td className="faint">{p.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="ov-foot">these are the services a video-AI backend actually runs · press q, Esc, or the button to exit</div>
    </div>
  );
}
