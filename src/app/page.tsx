'use client';

// Disable SSR hydration mismatch by making whole page render only on client
import dynamic from 'next/dynamic';

// Wrap PortfolioSite in dynamic with ssr:false at export

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useSpring, useMotionValue, useTransform } from "framer-motion";
import { ArrowUpRight, Download, Github, Linkedin, Mail, Moon, Sun, Sparkles, ArrowRight, ExternalLink, Calendar, MapPin, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

/**
 * One-file advanced portfolio site (v2)
 * Additions:
 *  - Animated shard background with cursor glow along lines (Canvas2D, no deps)
 *  - Extra micro-interactions (parallax cards, hero sparkle field, subtle entrance)
 *  - Theme-aware, subtle line contrast using HSL from Tailwind CSS variables
 *
 * Drop this in a React/Next app with Tailwind + shadcn installed.
 * If you already used the previous version, you can replace it entirely with this file.
 */

// ---------- Demo Data (replace with yours) ----------
const PROFILE = {
  name: "Kevin McLeod",
  title: "Software Engineer @ Harvard",
  location: "Cambridge, MA",
  blurb:
    "I build clean, performant products at the intersection of AI and delightful UX.",
  email: "kevinmcleod@college.harvard.edu",
  resumeUrl: "/Kevin McLeod Resume.pdf", // drop a file at public/resume.pdf
  social: {
    github: "https://github.com/night5kies",
    linkedin: "https://linkedin.com/in/kevin-jh-mcleod",
    email: "mailto:kevinmcleod@college.harvard.edu",
  },
};

const PROJECTS = [
  {
    title: "Orion – Unified Inbox & Tasks",
    desc:
      "AI productivity assistant that organizes email, calendar, and tasks with realtime copilots.",
    tags: ["AI", "Next.js", "Postgres", "WebSockets"],
    image: "https://picsum.photos/seed/orion/800/500",
    links: {
      live: "#",
      source: "#",
    },
    impact: "Cut triage time by 62% across a 1k user beta.",
  },
  {
    title: "Strassen — Fast Matrix Multiply",
    desc:
      "Educational implementation with diagonal‑only output optimization and CLI runner.",
    tags: ["Python", "Algorithms"],
    image: "https://picsum.photos/seed/strassen/800/500",
    links: { live: "#", source: "#" },
    impact: "3.1× speedup over naive n³ on 1024×1024 inputs.",
  },
  {
    title: "WearSense — Head‑Trauma Monitor",
    desc:
      "Wearable IMU + on‑edge anomaly detection for athletes and first responders.",
    tags: ["Edge AI", "Embedded", "Signal Processing"],
    image: "https://picsum.photos/seed/wearsense/800/500",
    links: { live: "#", source: "#" },
    impact: "Detected 94% of high‑G events in field trials.",
  },
  {
    title: "Robodog Walker",
    desc:
      "Embodied agent for modular scene understanding with energy‑based compositional models.",
    tags: ["Robotics", "3D", "Energy Models"],
    image: "https://picsum.photos/seed/robodog/800/500",
    links: { live: "#", source: "#" },
    impact: "Generalized to unseen indoor layouts with zero map priors.",
  },
];

const EXPERIENCE = [
  {
    role: "Cofounder & Full‑Stack Engineer",
    org: "SYZY",
    date: "2024 — Present",
    loc: "Boston, MA",
    bullets: [
      "Designed and shipped real‑time inference pipeline with <100ms p95 latency.",
      "Led product design system adopting Tailwind + shadcn for velocity.",
    ],
  },
  {
    role: "Research Assistant",
    org: "Embodied AI Lab",
    date: "2023 — 2024",
    loc: "Cambridge, MA",
    bullets: [
      "Prototyped energy‑based compositional scene models for manipulation tasks.",
      "Co‑authored workshop paper; open‑sourced dataset tools.",
    ],
  },
];

const SKILLS = [
  "TypeScript", "React", "Next.js", "Tailwind", "Node.js", "Python", "PyTorch", "Postgres", "Redis", "WebRTC", "gRPC", "AWS" , "Docker", "Kubernetes"
];

const BLOG = [
  {
    title: "A tiny guide to production‑ready AI features",
    date: "2025‑08‑12",
    href: "#",
  },
  {
    title: "Energy‑based models as building blocks for 3D scene understanding",
    date: "2025‑07‑13",
    href: "#",
  },
];

// ---------- Utilities ----------
const sections = [
  { id: "home", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "blog", label: "Writing" },
  { id: "contact", label: "Contact" },
];

function useTheme() {
  // Avoid SSR mismatch by not reading localStorage during initial render
  const [theme, setTheme] = useState<'light'|'dark'>('dark');
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('theme') as 'light'|'dark'|null : null;
    const initial = saved ?? 'dark';
    setTheme(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');
    setMounted(true);
  }, []);
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem('theme', theme);
  }, [theme, mounted]);
  return { theme, setTheme, mounted } as const;
}

const containerVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

function Header() {
  const { theme, setTheme, mounted } = useTheme();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b" suppressHydrationWarning>
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
        <Sparkles className="h-5 w-5" />
        <span className="font-semibold">{PROFILE.name}</span>
        <nav className="ml-auto hidden md:flex items-center gap-1">
          {sections.map((s) => (
            <Button
              key={s.id}
              variant="ghost"
              className="text-sm"
              onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" })}
            >
              {s.label}
            </Button>
          ))}
        </nav>
        <div className="ml-auto md:ml-2 flex items-center gap-2">
          {/* Render theme icon only after mount to avoid SSR mismatch */}
          {mounted && (
            <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}> 
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />} 
            </Button>
          )}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2"><Command className="h-4 w-4"/>Search</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Quick Jump</DialogTitle>
              </DialogHeader>
              <div className="grid gap-2">
                {sections.map((s) => (
                  <Button key={s.id} variant="ghost" className="justify-start" onClick={() => { setOpen(false); document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" }); }}>
                    {s.label}
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}

function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div style={{ scaleX }} className="fixed left-0 right-0 top-0 h-1 origin-left bg-gradient-to-r from-primary to-foreground/70 z-[60]"/>
  );
}


// ---------- Background: Shard field with cursor glow ----------
function ShardBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const linesRef = useRef<{x1:number,y1:number,x2:number,y2:number}[]>([]);
  const dpr = Math.max(1, typeof window !== 'undefined' ? window.devicePixelRatio : 1);

  const generate = (w:number, h:number) => {
    const pts: {x:number,y:number}[] = [];
    const count = Math.round((w*h) / 14000);
    for (let i=0;i<count;i++) pts.push({ x: Math.random()*w, y: Math.random()*h });
    for (let i=0;i<24;i++) {
      const t=i/24; pts.push({x: t*w, y: 0},{x: t*w, y: h},{x: 0, y: t*h},{x: w, y: t*h});
    }
    const k = 3; const lines: {x1:number,y1:number,x2:number,y2:number}[] = [];
    for (let i=0;i<pts.length;i++) {
      const a = pts[i];
      const nearest = pts.map((b,j)=>({j, d:(a.x-b.x)**2+(a.y-b.y)**2}))
        .filter(o=>o.d>0).sort((u,v)=>u.d-v.d).slice(0, k + Math.floor(Math.random()*2));
      for (const n of nearest) if (i < n.j) { const b = pts[n.j]; lines.push({ x1:a.x, y1:a.y, x2:b.x, y2:b.y }); }
    }
    linesRef.current = lines;
  };

  useEffect(() => {
    const c = canvasRef.current!; const ctx = c.getContext('2d')!;
    const onResize = () => {
      const w = window.innerWidth; const h = window.innerHeight;
      c.width = Math.floor(w*dpr); c.height = Math.floor(h*dpr);
      c.style.width = w+"px"; c.style.height = h+"px";
      ctx.setTransform(dpr,0,0,dpr,0,0);
      generate(w,h);
    };
    const onMove = (e: MouseEvent) => {
      const r = c.getBoundingClientRect();
      mouse.current.x = e.clientX - r.left;
      mouse.current.y = e.clientY - r.top;
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMove);
    onResize();

    let raf = 0; const render = () => {
      const w = c.width/dpr, h = c.height/dpr;
      ctx.clearRect(0,0,w,h);

      // fallback theme-aware colors (no color-mix reliance)
      const isDark = document.documentElement.classList.contains('dark');
      const base = isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.25)';
      ctx.strokeStyle = base; ctx.lineWidth = 1; ctx.globalAlpha = 1;

      ctx.beginPath();
      for (const L of linesRef.current) { ctx.moveTo(L.x1,L.y1); ctx.lineTo(L.x2,L.y2); }
      ctx.stroke();

      // cursor glow
      const mx = mouse.current.x, my = mouse.current.y;
      if (mx > -1) {
        const radius = 120; ctx.save();
        ctx.globalAlpha = 1; ctx.shadowBlur = 24; ctx.shadowColor = isDark ? '#fff' : '#000';
        ctx.lineWidth = 2; ctx.strokeStyle = isDark ? '#fff' : '#000';
        ctx.beginPath();
        for (const L of linesRef.current) {
          const dx=L.x2-L.x1, dy=L.y2-L.y1, len2=dx*dx+dy*dy || 1;
          let t=((mx-L.x1)*dx+(my-L.y1)*dy)/len2; t=Math.max(0,Math.min(1,t));
          const px=L.x1+t*dx, py=L.y1+t*dy; const dist=Math.hypot(mx-px,my-py);
          if (dist < radius) { ctx.moveTo(L.x1,L.y1); ctx.lineTo(L.x2,L.y2); }
        }
        ctx.stroke(); ctx.restore();
      }
      raf = requestAnimationFrame(render);
    }; raf = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); window.removeEventListener('mousemove', onMove); };
  }, []);

  return (
    <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 z-0" />
  );
}

// floating sparkles in hero
function SparkleField() {
  // Avoid SSR randomness: render only after mount with stable positions
  const [mounted, setMounted] = useState(false);
  const [dots, setDots] = useState<{x:number;y:number;size:number;delay:number}[]>([]);
  useEffect(() => {
    setMounted(true);
    const N = 28;
    const arr = Array.from({ length: N }).map(() => ({
      x: Math.random() * 90 + 5,
      y: Math.random() * 70 + 10,
      size: Math.random() * 2 + 1,
      delay: (Math.floor(Math.random() * 7)) * 0.3,
    }));
    setDots(arr);
  }, []);
  if (!mounted) return null;
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden" suppressHydrationWarning>
      {dots.map((d, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0.1, scale: 0.6 }}
          animate={{ opacity: [0.1, 0.6, 0.1], scale: [0.6, 1, 0.6] }}
          transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: d.delay }}
          className="absolute rounded-full bg-foreground/30 shadow-[0_0_8px_var(--tw-shadow-color)]"
          style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.size, height: d.size, boxShadow: '0 0 10px currentColor' }}
        />
      ))}
    </div>
  );
}

function Hero() {
  return (
    <section id="home" className="relative overflow-hidden h-screen flex items-center justify-center mt-[-10vh]">
      <div className="absolute inset-0 -z-10 opacity-30 dark:opacity-40"/>
      <SparkleField />
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text bg-[linear-gradient(90deg,theme(colors.foreground),theme(colors.primary))]">
            {PROFILE.name}
          </h1>
          <p className="text-lg text-foreground">{PROFILE.title}</p>
          <p className="text-foreground max-w-prose">{PROFILE.blurb}</p>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })} className='cursor-pointer hover:cursor-click' >
              See my work <ArrowRight className="ml-2 h-4 w-4"/>
            </Button>
            <Button variant="secondary" onClick={() => window.open(PROFILE.resumeUrl, "_blank")} className="cursor-pointer hover:cursor-click">
              Resume <Download className="ml-2 h-4 w-4"/>
            </Button>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <a aria-label="GitHub" href={PROFILE.social.github} target="_blank" rel="noreferrer" className="opacity-80 hover:opacity-100"><Github/></a>
            <a aria-label="LinkedIn" href={PROFILE.social.linkedin} target="_blank" rel="noreferrer" className="opacity-80 hover:opacity-100"><Linkedin/></a>
            <a aria-label="Email" href={PROFILE.social.email} className="opacity-80 hover:opacity-100"><Mail/></a>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden border shadow-xl bg-gradient-to-br from-muted to-background">
            <img src="https://picsum.photos/seed/portrait/1200/900" alt="Portrait" className="h-full w-full object-cover"/>
          </div>
          <div className="absolute -bottom-4 -right-4 hidden md:block">
            <Card className="rounded-2xl shadow-lg">
              <CardContent className="p-3 text-sm flex items-center gap-2">
                <MapPin className="h-4 w-4"/>
                {PROFILE.location}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// parallax tilt for project cards
function TiltCard({ children }: {children: React.ReactNode}) {
  const ref = useRef<HTMLDivElement|null>(null);
  const rx = useMotionValue(0); const ry = useMotionValue(0);
  const tX = useTransform(ry, [-1,1], [-6,6]);
  const tY = useTransform(rx, [-1,1], [6,-6]);
  useEffect(()=>{
    const el = ref.current!;
    const onMove = (e: MouseEvent)=>{
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left)/r.width*2-1;
      const y = (e.clientY - r.top)/r.height*2-1;
      rx.set(y); ry.set(x);
    };
    const onLeave = ()=>{rx.set(0); ry.set(0);};
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return ()=>{el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave);};
  },[]);
  return (
    <motion.div ref={ref} style={{ rotateX: tY, rotateY: tX, transformStyle: 'preserve-3d' }}>
      {children}
    </motion.div>
  );
}

function Projects() {
  const [active, setActive] = useState<string>("All");
  const tags = useMemo(() => ["All", ...Array.from(new Set(PROJECTS.flatMap(p => p.tags)))], []);
  const filtered = useMemo(() => active === "All" ? PROJECTS : PROJECTS.filter(p => p.tags.includes(active)), [active]);

  return (
    <section id="projects" className="mx-auto max-w-6xl px-4 py-16">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Selected Projects</h2>
          <p className="text-sm text-muted-foreground">A few things I’ve shipped recently.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <Badge key={tag} onClick={() => setActive(tag)} className={`cursor-pointer ${active === tag ? "bg-primary text-primary-foreground" : "opacity-70 hover:opacity-100"}`}>{tag}</Badge>
          ))}
        </div>
      </div>

      <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p, i) => (
          <motion.div layout key={p.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}>
            <TiltCard>
              <Card className="group overflow-hidden rounded-2xl border shadow-sm hover:shadow-2xl transition-shadow">
                <CardHeader className="p-0">
                  <div className="overflow-hidden">
                    <img src={p.image} alt={p.title} className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                  </div>
                  <CardTitle className="px-4 pt-4 text-lg">{p.title}</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pt-2 pb-0 space-y-3">
                  <p className="text-sm text-muted-foreground min-h-[48px]">{p.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map(t => <Badge key={t} variant="secondary">{t}</Badge>)}
                  </div>
                  <p className="text-xs text-muted-foreground">{p.impact}</p>
                </CardContent>
                <CardFooter className="p-4 flex items-center gap-2">
                  <Button variant="secondary" size="sm" onClick={() => window.open(p.links.live, "_blank")}>Live <ExternalLink className="ml-1 h-3.5 w-3.5"/></Button>
                  <Button variant="ghost" size="sm" onClick={() => window.open(p.links.source, "_blank")}>Source <Github className="ml-1 h-3.5 w-3.5"/></Button>
                </CardFooter>
              </Card>
            </TiltCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">Experience</h2>
      <div className="relative pl-6">
        <div className="absolute left-2 top-0 bottom-0 w-px bg-border"/>
        <div className="space-y-6">
          {EXPERIENCE.map((e) => (
            <div key={e.role} className="relative">
              <div className="absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full bg-primary"/>
              <Card className="rounded-xl">
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <CardTitle className="text-lg">{e.role} — {e.org}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><Calendar className="h-4 w-4"/>{e.date}</div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4"/>{e.loc}</div>
                </CardHeader>
                <CardContent className="pt-0 pb-4">
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {e.bullets.map((b) => <li key={b}>{b}</li>)}
                  </ul>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center gap-2">
        {SKILLS.map(s => <Badge key={s} variant="outline" className="px-3 py-1 text-sm">{s}</Badge>)}
      </div>
    </section>
  );
}

function Blog() {
  return (
    <section id="blog" className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">Writing</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {BLOG.map(post => (
          <Card key={post.title} className="rounded-xl hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{post.title}</CardTitle>
            </CardHeader>
            <CardFooter className="flex items-center justify-between px-6 pb-6">
              <span className="text-sm text-muted-foreground">{new Date(post.date).toLocaleDateString()}</span>
              <Button size="sm" onClick={() => window.open(post.href, "_blank")}>
                Read <ArrowUpRight className="ml-2 h-4 w-4"/>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}


export default function PortfolioSite() {  

  return (
    <div className="relative bg-background text-foreground min-h-dvh selection:bg-primary/20">
      {/* Background layer */}
      <ShardBackground />

      {/* Foreground content */}
      <div className="relative z-10">
        <ProgressBar />
        <Header />
        <main>
          <Hero />
          <Projects />
          <Skills />
          <Experience />
          <Blog />
        </main>
        <footer className="border-t">
          <div className="mx-auto max-w-6xl px-4 py-8 text-xs text-muted-foreground flex items-center justify-center">
            © 2025 {PROFILE.name}
          </div>
        </footer>
      </div>
    </div>
  );
}
