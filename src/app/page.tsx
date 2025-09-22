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
    "Hi! I'm currently a junior at Harvard pursuing a double major in Computer Science and Physics. I'm passionate about all different kinds of software and engineering, from AI to web development to robotics to game development! In my free time, I love dancing, playing instruments, running, playing frisbee, travelling, trying new restaurants and more!",
  email: "kevinmcleod@college.harvard.edu",
  resumeUrl: "/Kevin McLeod Resume.pdf",
  social: {
    github: "https://github.com/night5kies",
    linkedin: "https://linkedin.com/in/kevin-jh-mcleod",
    email: "mailto:kevinmcleod@college.harvard.edu",
  },
};



const EXPERIENCE = [
  {
    role: "Cofounder & Full-Stack Engineer",
    org: "AI Stealth Startup",
    date: "Jan 2025 — Present",
    loc: "Cambridge, MA",
    bullets: [
      "Co-founded an AI startup; conducted market research, product strategy, and user surveys of 100+ early users to align technical development with customer needs",
      "Led product design and full-stack development (React/Next.js/Tailwind, backend + AI models), delivering a modern web app adopted by early users",
      "Established agile processes for rapid iteration and oversaw product lifecycle from ideation through deployment, coordinating design, engineering, and user feedback",
    ],
    tags: ["Javascript", "React", "Next.js", "CSS", "AI", "Django"],
  },
  {
    role: "Full-Stack Software Engineering Intern",
    org: "GP Enterprise Solutions",
    date: "Jun 2025 — Aug 2025",
    loc: "Albany, NY",
    bullets: [
      "Fixed critical platform bugs and optimized workflows, reducing user-reported errors by 40% and improving retention",
      "Restructured SQL queries and filter logic, cutting database response times by 20% and enabling faster access to high-volume financial data",
      "Shipped high-demand features (file downloads, form management) and collaborated across teams to refine APIs and frontend UX",
    ],
    tags: ["Javascript", "React", "Next.js", "CSS", "MySQL"],
  },
  {
    role: "Research Assistant (with Prof. Yilun Du)",
    org: "Harvard AI Research Lab",
    date: "May 2025 — Aug 2025",
    loc: "Cambridge, MA",
    bullets: [
      "Developed a PyTorch pipeline combining Mask R-CNN and MiDaS to extract per-object 3D centroids from RGB data",
      "Designed energy-based compositional models to evaluate and optimize scene plausibility for embodied AI agents",
      "Benchmarked performance on novel indoor layouts and released open-source tooling to support reproducible research",
    ],
    tags: ["Python", "PyTorch", "Tensorflow", "Computer Vision", "Energy-Based Compositional Models", "AI Research"],
  },
  {
    role: "Web Developer",
    org: "Harvard Datamatch",
    date: "Sep 2024 — Present",
    loc: "Cambridge, MA",
    bullets: [
      "Redesigned the Datamatch UI in Next.js with a cross-functional team, improving clarity and UX for 22,000+ annual users",
      "Implemented new features for event promotion and user engagement while maintaining a consistent visual identity and brand tone",
    ],
    tags: ["TypeScript", "Next.js", "React", "CSS", "UX"],
  },
  {
    role: "Head of Electrical & Programming, Pit Chief, Outreach Lead",
    org: "FIRST Robotics Team 1493",
    date: "Sep 2019 — Jun 2023",
    loc: "Troy, NY",
    bullets: [
      "Led electrical and programming subteams, building competition-ready robot control systems and reliable codebases",
      "Directed pit operations at high-stakes competitions, adaptively troubleshooting hardware/software issues under strict time constraints and pressure",
      "Placed 23rd at the 2022 FIRST Robotics World Championship (Houston, TX); organized STEM outreach programs and community initiatives",
      "Built an automated computer vision aiming system that aligned the shooter in real time, boosting scoring accuracy  90% and reducing the need for manual adjustments during matches",
    ],
    tags: ["Java", "Robotics", "Electrical Engineering", "Leadership", "Computer Vision", "Python", "OpenCV", "STEM Outreach"],
  },
];



const PROJECTS = [
  {
    title: "College Spreadsheets",
    desc: "Created a Python/Pandas + Google APIs platform to compare 4,000+ colleges across hundreds of criteria. Enabled real-time filtering, multi-dimensional search, and automated updates through integrated APIs.",
    purpose: "Personal Project",
    tags: ["Python", "Pandas", "Google APIs", "Data Science"],
    image: "College Sheets.png",
    links: {source: "https://github.com/Night5kies/College-Sheets"},
  },
  {
    title: "Negotiation Club Website",
    desc: "Launched the Harvard Undergraduate Negotiation Club’s first website with React/Next.js. Delivered a mobile-friendly platform with event announcements, member bios, and recruitment resources.",
    purpose: "Harvard Negotiation Club",
    tags: ["JavaScript", "React", "Next.js", "Tailwind", "Web Development"],
    image: "HUNC.png",
    links: { live: "https://www.harvardundergradnegotiation.org/", source: "https://github.com/Night5kies/hunc" },
  },
  {
    title: "Energy-Based Compositional Modeling (EBCM) Research",
    desc: "Researched modular 3D scene understanding using energy-based models for embodied agents. Built PyTorch pipelines combining Mask R-CNN and MiDaS to extract object-level 3D centroids and optimize scene plausibility.",
    purpose: "Academic research in computer vision and robotics",
    tags: ["Python", "PyTorch", "Computer Vision", "Energy-Based Models", "Research"],
    image: "EBCM.png",
    links: { source: "https://github.com/Night5kies/EBCM-prototype" },
  },
  {
    title: "Harvard Datamatch",
    desc: "Redesigned Datamatch’s website in Next.js with a cross-functional team, improving clarity and UX for 22,000+ annual users. Enhanced accessibility and performance while adding event features to boost engagement.",
    purpose: "Campus matchmaking & event platform",
    tags: ["Next.js", "React", "Accessibility", "Web Performance", "UX"],
    image: "Datamatch.png",
    links: { live: "https://datamatch.me/" },
  },
  {
    title: "Light in the Dark (3D RPG)",
    desc: "Directed a 10-person team to design and build a 3D RPG game with Unity. Developed modular combat, dialogue, cutscene, and animation systems, ensuring smooth gameplay and cross-functional collaboration.",
    purpose: "Personal Group Project",
    tags: ["Unity", "C#", "Game Dev", "Team Leadership"],
    image: "Light in the Dark.png",
    links: { source: "https://github.com/Night5kies/Light-in-the-Dark" },
  },
  {
    title: "2D-in-3D Game",
    desc: "Developed a Unity game blending Space Invaders, Breakout, and Flappy Bird mechanics. Players shoot meteors to stay afloat via recoil, balancing survival and offense in a retro 2D-in-3D style.",
    purpose: "Personal Project/Hackathon",
    tags: ["Python", "Pygame", "Game Dev"],
    image: "2D in 3D.png",
    links: { live: "https://devpost.com/software/2d-in-3d-10i3ma", source: "https://github.com/Night5kies/2D-in-3D" },
  },
  {
    title: "Operating Systems Project",
    desc: "Built a minimal OS in C++ with a custom heap allocator, virtual memory, and syscall interface. Added thread-safe I/O and a preemptive scheduler to simulate multitasking and safe concurrent file access.",
    purpose: "OS Class",
    tags: ["C++", "Operating Systems"],
    image: "https://picsum.photos/seed/osproject/800/500",
    links: { source: "https://github.com/Night5kies/CS-61" },
  },
  {
    title: "C1 Terminal Competition Algorithm",
    desc: "Led a 3-person team to build an agent for Correlation One’s Tower Defense competition. Ranked 75th of 66,265 players and achieved a 60% win rate across 7,425 matches with adaptive offensive/defensive strategies.",
    purpose: "Competition Entry",
    tags: ["Python", "Algorithms", "Game AI"],
    image: "C1 Terminal.png",
    links: { live: "https://terminal.c1games.com/home", source: "https://github.com/Night5kies/C1-Terminal-NightShade" },
  },
  {
    title: "Biodiversity Hub Website",
    desc: "Built a React/Next.js + Supabase web app with fuzzy search, real-time updates, and adaptive UI. Designed responsive Tailwind interfaces to support mobile and low-latency use for biodiversity researchers.",
    purpose: "Tech for Social Good Club Project",
    tags: ["TypeScript", "React", "Next.js", "Supabase"],
    image: "https://picsum.photos/seed/lightdark/800/500",
    links: { source: "https://github.com/Night5kies/f24-eng-r2-deliverable" },
  },
  {
    title: "Dino Game",
    desc: "Recreated the classic Chrome Dino game in Python with Pygame. Implemented obstacle spawning, collision detection, and increasing difficulty for an endless runner experience.",
    purpose: "Personal Project",
    tags: ["Python", "Pygame", "Game Dev"],
    image: "Dino Game.png",
    links: { source: "https://github.com/Night5kies/Dino-Game" },
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
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-sky-500/30" suppressHydrationWarning>
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
        <Sparkles className="h-5 w-5 text-sky-400" />
        <span className="font-semibold text-sky-600 dark:text-sky-400">{PROFILE.name}</span>
        <nav className="ml-auto hidden md:flex items-center gap-1">
          {sections.map((s) => (
            <Button
              key={s.id}
              variant="ghost"
              className="text-sm hover:text-sky-500"
              onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" })}
            >
              {s.label}
            </Button>
          ))}
        </nav>
        <div className="ml-auto md:ml-2 flex items-center gap-2">
          {/* Render theme icon only after mount to avoid SSR mismatch */}
          {mounted && (
            <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="text-sky-500"> 
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />} 
            </Button>
          )}
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
      <div className="absolute inset-0 -z-10 opacity-30 dark:opacity-40 bg-gradient-to-b from-sky-100/20 to-transparent dark:from-sky-900/20"/>
      <SparkleField />
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center ">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 ">
          <div className="relative">
            {/* translucent background card behind the text */}
            <div className="absolute inset-0 -z-10 rounded-3xl bg-white/60 dark:bg-black/40 backdrop-blur-sm shadow-lg transform -translate-y-2 md:-translate-y-4 mx-0 md:mx-0" />
            <div className="relative px-4 py-6 md:py-8 md:px-8 rounded-2xl">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text bg-[linear-gradient(90deg,theme(colors.foreground),theme(colors.primary))]">
            {PROFILE.name}
          </h1>
              <p className="text-lg text-sky-800 dark:text-sky-200 mt-1">{PROFILE.title}</p>
              <p className="text-sky-800 dark:text-sky-200 max-w-prose mt-3">{PROFILE.blurb}</p>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })} className='bg-sky-500 hover:bg-sky-600 text-white'>
              See my work <ArrowRight className="ml-2 h-4 w-4"/>
            </Button>
            <Button variant="secondary" onClick={() => window.open(PROFILE.resumeUrl, "_blank")} className="border-sky-500 text-sky-600 dark:text-sky-400">
              Resume <Download className="ml-2 h-4 w-4"/>
            </Button>
          </div>
              <div className="flex flex-col items-start gap-2 pt-4">
                <div className="text-sm text-gray-700 dark:text-gray-300">Contact me</div>
                <div className="flex items-center gap-3">
                  <a aria-label="GitHub" href={PROFILE.social.github} target="_blank" rel="noreferrer" className="opacity-80 hover:text-sky-500"><Github/></a>
                  <a aria-label="LinkedIn" href={PROFILE.social.linkedin} target="_blank" rel="noreferrer" className="opacity-80 hover:text-sky-500"><Linkedin/></a>
                  <a aria-label="Email" href={PROFILE.social.email} className="opacity-80 hover:text-sky-500"><Mail/></a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden border shadow-xl bg-gradient-to-br from-sky-50 to-background dark:from-sky-950/30">
            <img src="kevin.jpeg" alt="Portrait" className="h-full w-full object-cover"/>
          </div>
          <div className="absolute -bottom-4 -right-4 hidden md:block">
            <Card className="rounded-2xl shadow-lg border-sky-200 dark:border-sky-800">
              <CardContent className="p-3 text-sm flex items-center gap-2 text-sky-700 dark:text-sky-300">
                <MapPin className="h-4 w-4 text-sky-500"/>
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
  // Simpler micro-interaction: scale up slightly on hover instead of complex tilt
  return (
    <motion.div className="h-full flex-1" whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }} style={{ transformStyle: 'preserve-3d' }}>
      <div className="h-full">{children}</div>
    </motion.div>
  );
}

function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-6xl px-4 py-16">
      <motion.div initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">Experience</h2>
      </motion.div>
      <div className="relative pl-6">
        <div className="absolute left-2 top-0 bottom-0 w-px bg-border"/>
        <div className="space-y-6">
          {EXPERIENCE.map((e, i) => (
            <motion.div key={e.role} initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }}>
              <div key={e.role} className="relative">
                <div className="absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full bg-sky-700  dark:bg-sky-300 "/>
                <Card className="rounded-xl">
                  <CardHeader className="pb-2">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <CardTitle className="text-lg">{e.role}</CardTitle>
                        <p className="text-md text-muted-foreground mt-1">{e.org}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-sky-800 dark:text-sky-200"><Calendar className="h-4 w-4"/>{e.date}</div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-sky-800 dark:text-sky-200"><MapPin className="h-4 w-4"/>{e.loc}</div>
                  </CardHeader>
                  <CardContent className="pt-0 pb-4">
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      {e.bullets.map((b) => <li key={b}>{b}</li>)}
                    </ul>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {(e.tags || []).map(t => <Badge key={t} variant="secondary" className="text-sky-700 dark:text-sky-300">{t}</Badge>)}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects() {
  const [active, setActive] = useState<string>("All");
  const tags = useMemo(() => ["All", ...Array.from(new Set(PROJECTS.flatMap(p => p.tags)))], []);
  const filtered = useMemo(() => active === "All" ? PROJECTS : PROJECTS.filter(p => p.tags.includes(active)), [active]);

  return (
    <section id="projects" className="mx-auto max-w-6xl px-4 py-16">
      <div className="flex items-end justify-between gap-4 mb-6">
        <motion.div initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Projects</h2>
            <p className="text-sm text-muted-foreground">A few things I’ve shipped recently.</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <Badge key={tag} onClick={() => setActive(tag)} className={`cursor-pointer ${active === tag ? "bg-primary text-primary-foreground" : "opacity-70 hover:opacity-100"}`}>{tag}</Badge>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p, i) => (
          <motion.div layout key={p.title} className="h-full flex" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }}>
            <TiltCard>
              <Card className="h-full flex-1 flex flex-col group overflow-hidden rounded-2xl border shadow-sm hover:shadow-2xl transition-shadow">
                <CardHeader className="p-0">
                  <div className="overflow-hidden">
                    <img src={p.image} alt={p.title} className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                  </div>
                  <div className="px-4 pt-4">
                    <CardTitle className="text-lg">{p.title}</CardTitle>
                    {p.purpose ? <p className="text-medium text-gray-600  mt-1 dark:text-gray-300">{p.purpose}</p> : null}
                  </div>
                </CardHeader>
                <CardContent className="px-4 pt-2 pb-0 space-y-3 flex-1">
                  <p className="text-sm text-muted-foreground min-h-[48px]">{p.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map(t => <Badge key={t} variant="secondary" className="text-sky-700 dark:text-sky-300 bg-gray-400/30 dark:bg-gray-600/20">{t}</Badge>)}
                  </div>
                </CardContent>
                <CardFooter className="flex items-center gap-2">
                  {p.links.live && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex items-center bg-sky-100 hover:bg-sky-200 dark:bg-gray-800 dark:hover:bg-sky-700/40 transition-colors hover:[&>svg]:-translate-y-0.5"
                      onClick={() => window.open(p.links.live, "_blank")}
                    >
                      Live
                      <ExternalLink className="ml-1 h-3.5 w-3.5 transition-transform transform" />
                    </Button>
                  )}
                  {p.links.source && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center bg-sky-100 hover:bg-sky-200 dark:bg-gray-800 dark:hover:bg-sky-700/40 transition-colors hover:[&>svg]:-translate-y-0.5"
                      onClick={() => window.open(p.links.source, "_blank")}
                    >
                      Source
                      <Github className="ml-1 h-3.5 w-3.5 transition-transform transform" />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </TiltCard>
          </motion.div>
        ))}
      </motion.div>
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


export default function PortfolioSite() {  

  return (
    <div className="relative bg-background text-foreground min-h-dvh selection:bg-sky-200/40 dark:selection:bg-sky-600/30">
      {/* Background layer */}
      <ShardBackground />

      {/* Foreground content */}
      <div className="relative z-10">
        <ProgressBar />
        <Header />
        <main>
          <Hero />
          {/* <Skills /> */}
          <Experience />
          <Projects />
          <section id="contact" className="mx-auto max-w-6xl px-4 py-12">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-3">Get in touch</h2>
              <p className="text-sm text-muted-foreground mb-4">Feel free to reach out — I&apos;m always open to collaborating or chatting about interesting projects.</p>
              <div className="flex items-center justify-center gap-6">
                <a aria-label="GitHub" href={PROFILE.social.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-sky-500">
                  <Github />
                  <span className="text-sm">GitHub</span>
                </a>
                <a aria-label="LinkedIn" href={PROFILE.social.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-sky-500">
                  <Linkedin />
                  <span className="text-sm">LinkedIn</span>
                </a>
                <a aria-label="Email" href={PROFILE.social.email} className="flex items-center gap-2 hover:text-sky-500">
                  <Mail />
                  <span className="text-sm">Email</span>
                </a>
              </div>
            </div>
          </section>
        </main>
        <footer className="border-t border-sky-200 dark:border-sky-800">
          <div className="mx-auto max-w-6xl px-4 py-8 text-xs text-muted-foreground flex items-center justify-center text-sky-700 dark:text-sky-300">
            © 2025 {PROFILE.name}
          </div>
        </footer>
      </div>
    </div>
  );
}
