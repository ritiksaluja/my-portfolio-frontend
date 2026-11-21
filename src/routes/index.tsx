import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import projectPos from "@/assets/project-pos.jpg";
import projectErp from "@/assets/project-erp.jpg";
import projectBnpl from "@/assets/project-bnpl.jpg";
import projectStreaming from "@/assets/project-streaming.jpg";
import projectScoring from "@/assets/project-scoring.jpg";
import projectHealthcare from "@/assets/project-healthcare.jpg";
import { Reveal } from "@/components/reveal";
import { ContactForm } from "@/components/contact-form";
import { useTypewriter } from "@/hooks/use-typewriter";
import { ArrowUp, Menu, X, Smartphone } from "lucide-react";
import { CountUp } from "@/components/count-up";

const imageMap: Record<string, string> = {
  projectPos,
  projectErp,
  projectBnpl,
  projectStreaming,
  projectScoring,
  projectHealthcare,
};

const staticProjects = [
  { title: "POS System", desc: "End-to-end point of sale with real-time inventory sync, multi-outlet management, and offline-first architecture.", tags: ["REACT","NODE.JS","MONGODB"], image: "projectPos", projectUrl: "#" },
  { title: "Restaurant ERP", desc: "Full-stack ERP covering table management, KDS, inventory, payroll, and analytics for multi-chain restaurants.", tags: ["MERN","DOCKER","AWS"], image: "projectErp", projectUrl: "#" },
  { title: "BNPL Platform", desc: "Buy Now Pay Later engine with credit scoring, EMI workflows, Mollie/Adyen payment integrations, and risk dashboards.", tags: ["NODE.JS","POSTGRESQL","REDIS"], image: "projectBnpl", projectUrl: "#" },
  { title: "Live Streaming", desc: "Low-latency streaming platform with RTMP ingestion, adaptive bitrate, real-time chat, and viewer analytics.", tags: ["WEBRTC","SOCKET.IO","AWS"], image: "projectStreaming", projectUrl: "#" },
  { title: "Live Scoring App", desc: "Real-time sports scoring with sub-second ball-by-ball updates, leaderboards, and push notifications.", tags: ["WEBSOCKET","REDIS","REACT"], image: "projectScoring", projectUrl: "#" },
  { title: "Healthcare Platform", desc: "On-demand medical services with doctor booking, ambulance tracking, distance-based routing, and EHR.", tags: ["MERN","MAPS API","AWS"], image: "projectHealthcare", projectUrl: "#" }
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ritik Saluja — Senior Node.js Developer & Full Stack Engineer" },
      {
        name: "description",
        content:
          "Portfolio of Ritik Saluja — Senior Node.js Developer, Full Stack Engineer & Backend Architect with 3+ years building enterprise SaaS, real-time systems, and cloud infrastructure.",
      },
      { property: "og:title", content: "Ritik Saluja — Senior Node.js Developer & Full Stack Engineer" },
      {
        property: "og:description",
        content: "Node.js, React, PostgreSQL, MongoDB, AWS, Docker, Kubernetes — building production-grade distributed systems.",
      },
    ],
  }),
  component: Index,
});

// ─── Skill bar data ───────────────────────────────────────────────────────────
const skills = [
  { label: "Node.js / Express.js",   pct: 95 },
  { label: "React.js / Frontend",    pct: 88 },
  { label: "React Native / Mobile",  pct: 82 },
  { label: "PostgreSQL / MongoDB",   pct: 90 },
  { label: "AWS / DevOps",           pct: 82 },
  { label: "Docker / Kubernetes",    pct: 78 },
  { label: "Socket.IO / Real-time",  pct: 85 },
  { label: "System Design",          pct: 80 },
  { label: "Payment Integrations",   pct: 88 },
];

// ─── Expertise pillars ────────────────────────────────────────────────────────
const expertise = [
  {
    color: "brand",
    title: "Backend Engineering",
    items: ["Node.js · Express.js", "REST API Design", "Auth & Authorization", "Socket.IO Real-time", "Background Jobs · Cron", "AWS SES · 3rd-party APIs"],
  },
  {
    color: "accent-green",
    title: "Database & Data",
    items: ["PostgreSQL · MongoDB · DynamoDB", "Sequelize ORM", "Multi-tenant Architecture", "Query Optimization", "Complex SQL Queries", "Multi-database Systems"],
  },
  {
    color: "slate-400",
    title: "Cloud & DevOps",
    items: ["AWS Services", "Docker · Kubernetes", "PM2 Process Management", "CI/CD Pipelines", "Nginx Reverse Proxy", "Zero-downtime Deploy"],
  },
  {
    color: "brand",
    title: "Distributed Systems",
    items: ["RabbitMQ Messaging", "Event-driven Architecture", "Queue-based Design", "Multi-app Socket Sync", "Microservices Scaling", "Async Processing"],
  },
  {
    color: "accent-green",
    title: "Payment & Subscriptions",
    items: ["Mollie Integration", "Adyen Payment Gateway", "Apple Subscription Mgmt", "EMI & BNPL Workflows", "Credit Scoring Logic", "Risk Dashboards"],
  },
  {
    color: "slate-400",
    title: "Frontend & UI",
    items: ["React.js · Formik", "CKEditor Customization", "Responsive UI", "Admin Panel / Dashboard", "Multi-language (6 langs)", "Real-time UI Updates"],
  },
  {
    color: "brand",
    title: "Mobile Development",
    items: ["React Native CLI", "Expo Framework", "Cross-platform iOS & Android", "Native Modules Integration", "Push Notifications (FCM/APNs)", "Offline-first Mobile Apps"],
  },
];

// ─── Stats ────────────────────────────────────────────────────────────────────
const stats = [
  { value: "3+",  label: "Years Experience" },
  { value: "20+", label: "Projects Shipped" },
  { value: "6",   label: "Languages Supported" },
  { value: "99%", label: "Uptime SLA" },
];

function Index() {
  const [projects, setProjects] = useState<any[]>(staticProjects);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/projects");
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } catch (err) {
        console.error("Failed to load projects, using fallback", err);
      }
    };
    loadProjects();
  }, []);

  const FULL_NAME = "RITIK SALUJA";
  const { displayed, isTyping, isDeleting } = useTypewriter(FULL_NAME, {
    typeSpeed: 4,
    deleteSpeed: 6,
    pauseAfterType: 1800,
    pauseAfterDelete: 700,
    startDelay: 500,
  });

  // Split display into first / last for independent colouring
  const spaceIdx = displayed.indexOf(" ");
  const typedFirst = spaceIdx === -1 ? displayed : displayed.slice(0, spaceIdx);
  const typedLast  = spaceIdx === -1 ? ""         : displayed.slice(spaceIdx + 1);
  // Show cursor while typing or deleting
  const showCursor = isTyping || isDeleting;

  const navLinks = [
    { href: "#about", label: "About" },
    { href: "#stack", label: "Stack" },
    { href: "#work", label: "Work" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen bg-bg text-foreground font-sans selection:bg-brand/10 selection:text-brand overflow-x-hidden relative">
      {/* Background grid */}
      <div className="fixed inset-0 grid-pattern pointer-events-none" />

      {/* Ambient decorative blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-brand/5 rounded-full filter blur-[120px] pointer-events-none animate-float" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-accent-green/5 rounded-full filter blur-[120px] pointer-events-none animate-float" style={{ animationDelay: "-3s" }} />
      <div className="fixed top-[40%] right-[-5%] w-[35vw] h-[35vw] bg-brand/4 rounded-full filter blur-[100px] pointer-events-none animate-float" style={{ animationDelay: "-1.5s" }} />

      {/* ── Navigation ────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-8 py-4 border-b border-border/40 bg-bg/80 backdrop-blur-lg animate-fade-in">
        <div className="flex items-center gap-2">
          <div className="size-2.5 rounded-full bg-brand animate-cursor-blink" />
          <span className="font-mono text-sm tracking-tighter uppercase font-semibold">System.Ready</span>
        </div>
        <div className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest text-text-dim">
          {navLinks.map(l => (
            <a key={l.href} href={l.href} className="hover:text-brand transition-colors duration-200 relative group">
              {l.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-brand group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block px-4 py-1.5 border border-border/60 rounded-full text-xs font-mono backdrop-blur-sm bg-white/20 text-text-dim">EST. 2021</div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center size-9 rounded-lg border border-border/60 bg-white/20 hover:bg-white/60 transition-all duration-200"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          <div className="absolute top-[65px] left-0 right-0 bg-bg/95 backdrop-blur-xl border-b border-border shadow-xl p-6 flex flex-col gap-5" onClick={e => e.stopPropagation()}>
            {navLinks.map(l => (
              <a key={l.href} href={l.href} onClick={() => setMobileMenuOpen(false)} className="font-mono text-sm uppercase tracking-widest text-text-dim hover:text-brand transition-colors duration-200 py-1 border-b border-border/30">{l.label}</a>
            ))}
          </div>
        </div>
      )}

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <header className="relative z-10 pt-24 md:pt-32 pb-20 px-6 md:px-8 max-w-7xl mx-auto">
        <Reveal direction="up" delay={100}>
          <p className="font-mono text-brand text-sm tracking-[0.2em] uppercase mb-4">
            Senior Node.js Developer · Full Stack Engineer · Backend Architect
          </p>
        </Reveal>
        <Reveal direction="up" delay={200}>
          <h1 className="text-6xl md:text-9xl font-extrabold tracking-tighter leading-none pb-2">
            <span className="bg-gradient-to-r from-slate-900 to-brand bg-clip-text text-transparent">
              {typedFirst || <span className="opacity-0">R</span>}
            </span>
            {typedLast && <> <span className="text-slate-300 font-light select-none">{typedLast}</span></>}
            {showCursor && (
              <span className="inline-block w-[0.08em] h-[0.85em] bg-brand align-middle ml-1 animate-cursor-blink" />
            )}
          </h1>
        </Reveal>

        <div className="mt-12 flex flex-col md:flex-row gap-12 items-start">
          <Reveal direction="up" delay={300} className="max-w-xl">
            <p className="text-lg text-text-dim leading-relaxed">
              3.5+ years building enterprise-grade SaaS, healthcare, restaurant, and booking platforms.
              Focused on{" "}
              <span className="text-foreground font-semibold">scalable backend architecture</span>,{" "}
              <span className="text-foreground font-semibold">real-time systems</span>,{" "}
              <span className="text-foreground font-semibold">React Native mobile apps</span>, and automating the path from{" "}
              <span className="text-foreground font-semibold">commit</span> to{" "}
              <span className="text-foreground font-semibold">cloud</span>.
            </p>
          </Reveal>
          <Reveal direction="up" delay={400}>
            <div className="flex flex-wrap gap-2.5">
              <div className="px-3.5 py-1.5 bg-accent-green/5 border border-accent-green/30 rounded-full text-xs font-mono text-accent-green hover:bg-accent-green/10 hover:border-accent-green/60 hover:-translate-y-0.5 transition-all duration-200 cursor-default">● NODE.JS_EXPERT</div>
              <div className="px-3.5 py-1.5 bg-brand/5 border border-brand/30 rounded-full text-xs font-mono text-brand hover:bg-brand/10 hover:border-brand/60 hover:-translate-y-0.5 transition-all duration-200 cursor-default">● BACKEND_ARCHITECT</div>
              <div className="px-3.5 py-1.5 bg-slate-100 border border-slate-200/60 rounded-full text-xs font-mono text-foreground/60 hover:bg-slate-200 hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-200 cursor-default">● AWS_ENGINEER</div>
              <div className="px-3.5 py-1.5 bg-[#61DAFB]/5 border border-[#61DAFB]/30 rounded-full text-xs font-mono text-[#20A8D8] hover:bg-[#61DAFB]/10 hover:border-[#61DAFB]/60 hover:-translate-y-0.5 transition-all duration-200 cursor-default">● REACT_NATIVE_DEV</div>
            </div>
          </Reveal>
        </div>
      </header>

      {/* ── About / Bio ───────────────────────────────────────────────────── */}
      <section id="about" className="relative z-10 py-32 px-6 md:px-8 border-y border-border">
        <div className="max-w-7xl mx-auto">

          {/* Section label */}
          <Reveal direction="up">
            <div className="mb-20">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">// About Me</p>
              <div className="h-px w-24 bg-brand" />
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left — bio text + stats */}
            <Reveal direction="right" delay={100}>
              <div className="space-y-8">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                  Building systems that{" "}
                  <span className="text-brand">scale</span> and{" "}
                  <span className="text-accent-green">last</span>.
                </h2>

                <div className="space-y-4 text-text-dim leading-relaxed">
                  <p>
                    I'm a <span className="text-foreground font-semibold">Full Stack Developer</span> with
                    strong expertise in Node.js, Express.js, React.js, React Native, PostgreSQL, MongoDB, and
                    Sequelize ORM. I specialise in designing and developing scalable backend
                    systems, RESTful APIs, real-time applications, cross-platform mobile apps, and multi-tenant architectures.
                  </p>
                  <p>
                    My background spans enterprise SaaS, healthcare platforms, restaurant management
                    systems, reservation &amp; booking engines, payment integrations (Mollie, Adyen),
                    and distributed messaging with RabbitMQ. I've built production systems that
                    handle real-time Socket.IO synchronisation across multiple applications, complex
                    background job pipelines, and multi-language platforms supporting English,
                    Hindi, Japanese, Nepali, Thai, and Chinese.
                  </p>
                  <p>
                    Currently expanding into <span className="text-foreground font-semibold">cloud architecture</span>,
                    distributed systems design, and Solution Architecture — with hands-on work in
                    AWS, Docker, Kubernetes, and ServiceNow platform development.
                  </p>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                  {stats.map((s, i) => (
                    <Reveal key={s.label} direction="up" delay={i * 80} className="bg-white/40 backdrop-blur-md border border-slate-200/40 p-5 rounded-xl text-center hover:bg-white/80 hover:border-brand/20 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                      <div className="text-3xl font-extrabold text-brand font-mono">
                        <CountUp value={s.value} />
                      </div>
                      <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-1">{s.label}</div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Right — skill bars */}
            <Reveal direction="left" delay={200}>
              <div className="space-y-5">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">Core Proficiencies</p>
                {skills.map((sk, i) => (
                  <div key={sk.label} className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-mono text-foreground/70">{sk.label}</span>
                      <span className="text-xs font-mono text-brand">{sk.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <Reveal direction="right" delay={i * 60}>
                        <div
                          className="h-full bg-gradient-to-r from-brand to-brand/60 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${sk.pct}%` }}
                        />
                      </Reveal>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Expertise grid */}
          <div className="mt-24">
            <Reveal direction="up">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-10">Areas of Expertise</p>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {expertise.map((ex, i) => (
                <Reveal key={ex.title} direction="up" delay={i * 80} className="bg-white/40 backdrop-blur-md border border-slate-200/40 p-7 hover:bg-white/70 hover:border-brand/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-xl group">
                  <div className={`size-2 rounded-full bg-${ex.color} mb-4 group-hover:animate-cursor-blink`} />
                  <h3 className="font-bold text-base mb-4 group-hover:text-brand transition-colors duration-200">{ex.title}</h3>
                  <ul className="space-y-1.5">
                    {ex.items.map((item) => (
                      <li key={item} className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                        — {item}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Capabilities ─────────────────────────────────────────────────── */}
      <section id="stack" className="relative z-10 py-24 px-6 md:px-8 border-b border-border bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <Reveal direction="up">
            <div className="mb-16">
              <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Infrastructure &amp; Stack</h2>
              <div className="h-px w-24 bg-brand" />
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Reveal direction="up" delay={100} className="bg-white/50 backdrop-blur-md border border-slate-200/50 p-7 hover:bg-white/80 hover:border-brand/40 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 rounded-2xl group">
              <div className="size-11 bg-brand/10 border border-brand/20 rounded-xl flex items-center justify-center mb-6 group-hover:animate-float group-hover:bg-brand/20 transition-colors duration-300">
                <div className="size-4 bg-brand rounded-sm animate-pulse" />
              </div>
              <h3 className="text-lg font-bold mb-3 group-hover:text-brand transition-colors duration-200">Orchestration</h3>
              <p className="text-text-dim text-xs leading-relaxed mb-5 italic font-mono">Docker · Kubernetes · Helm</p>
              <ul className="space-y-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">
                <li className="flex items-center gap-2"><span className="size-1 rounded-full bg-brand/60 inline-block" />Microservices Scaling</li>
                <li className="flex items-center gap-2"><span className="size-1 rounded-full bg-brand/60 inline-block" />Cluster Management</li>
                <li className="flex items-center gap-2"><span className="size-1 rounded-full bg-brand/60 inline-block" />Resource Isolation</li>
              </ul>
            </Reveal>

            <Reveal direction="up" delay={200} className="bg-white/50 backdrop-blur-md border border-slate-200/50 p-7 hover:bg-white/80 hover:border-accent-green/40 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 rounded-2xl group">
              <div className="size-11 bg-accent-green/10 border border-accent-green/20 rounded-xl flex items-center justify-center mb-6 group-hover:animate-float group-hover:bg-accent-green/20 transition-colors duration-300">
                <div className="size-4 bg-accent-green rounded-sm animate-pulse" style={{ animationDelay: '-1s' }} />
              </div>
              <h3 className="text-lg font-bold mb-3 group-hover:text-accent-green transition-colors duration-200">Cloud &amp; CI/CD</h3>
              <p className="text-text-dim text-xs leading-relaxed mb-5 italic font-mono">AWS · Nginx · GitHub Actions</p>
              <ul className="space-y-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">
                <li className="flex items-center gap-2"><span className="size-1 rounded-full bg-accent-green/60 inline-block" />Automated Pipelines</li>
                <li className="flex items-center gap-2"><span className="size-1 rounded-full bg-accent-green/60 inline-block" />Reverse Proxy Opt</li>
                <li className="flex items-center gap-2"><span className="size-1 rounded-full bg-accent-green/60 inline-block" />Zero-Downtime Deploy</li>
              </ul>
            </Reveal>

            <Reveal direction="up" delay={300} className="bg-white/50 backdrop-blur-md border border-slate-200/50 p-7 hover:bg-white/80 hover:border-slate-400/40 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 rounded-2xl group">
              <div className="size-11 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center mb-6 group-hover:animate-float group-hover:bg-slate-200 transition-colors duration-300">
                <div className="size-4 bg-slate-400 rounded-sm" />
              </div>
              <h3 className="text-lg font-bold mb-3 group-hover:text-slate-600 transition-colors duration-200">Application Layer</h3>
              <p className="text-text-dim text-xs leading-relaxed mb-5 italic font-mono">MERN Stack · PM2 · Redis</p>
              <ul className="space-y-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">
                <li className="flex items-center gap-2"><span className="size-1 rounded-full bg-slate-400/60 inline-block" />Process Management</li>
                <li className="flex items-center gap-2"><span className="size-1 rounded-full bg-slate-400/60 inline-block" />Real-time Architecture</li>
                <li className="flex items-center gap-2"><span className="size-1 rounded-full bg-slate-400/60 inline-block" />State Optimization</li>
              </ul>
            </Reveal>

            <Reveal direction="up" delay={400} className="bg-white/50 backdrop-blur-md border border-slate-200/50 p-7 hover:bg-white/80 hover:border-[#61DAFB]/40 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 rounded-2xl group">
              <div className="size-11 bg-[#61DAFB]/10 border border-[#61DAFB]/20 rounded-xl flex items-center justify-center mb-6 group-hover:animate-float group-hover:bg-[#61DAFB]/20 transition-colors duration-300">
                <div className="size-4 bg-[#61DAFB] rounded-full animate-pulse" style={{ animationDelay: '-0.5s' }} />
              </div>
              <h3 className="text-lg font-bold mb-3 group-hover:text-[#20A8D8] transition-colors duration-200">React Native</h3>
              <p className="text-text-dim text-xs leading-relaxed mb-5 italic font-mono">iOS · Android · Expo</p>
              <ul className="space-y-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">
                <li className="flex items-center gap-2"><span className="size-1 rounded-full bg-[#61DAFB]/60 inline-block" />Cross-platform Apps</li>
                <li className="flex items-center gap-2"><span className="size-1 rounded-full bg-[#61DAFB]/60 inline-block" />Native Modules</li>
                <li className="flex items-center gap-2"><span className="size-1 rounded-full bg-[#61DAFB]/60 inline-block" />Push Notifications</li>
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Production Work ───────────────────────────────────────────────── */}
      <section id="work" className="relative z-10 py-32 px-6 md:px-8 max-w-7xl mx-auto">
        <Reveal direction="up">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-bold tracking-tight mb-2">Production Work</h2>
              <p className="text-text-dim font-mono text-sm">Real-world systems shipped to live users.</p>
            </div>
            <span className="text-brand font-mono text-xs">6_DEPLOYMENTS</span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((p, i) => (
            <Reveal key={p._id || p.title} direction="up" delay={(i % 3) * 100}>
              <article className="group bg-white/40 backdrop-blur-md border border-slate-200/40 p-5 rounded-2xl hover:bg-white/70 hover:border-brand/20 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col">
                <div className="w-full aspect-video bg-slate-50 rounded-xl mb-5 overflow-hidden ring-1 ring-slate-200/50 group-hover:ring-brand/30 transition-all duration-500">
                  <img src={imageMap[p.image] || p.image} alt={p.title} loading="lazy" width={1280} height={720} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-brand transition-colors duration-200">{p.title}</h3>
                <p className="text-text-dim text-sm mb-4 leading-relaxed">{p.desc}</p>
                <div className="flex gap-2 flex-wrap mt-auto pt-3 border-t border-slate-100">
                  {p.tags.map((t: string) => (
                    <span key={t} className="text-[10px] font-mono border border-slate-200 text-slate-600 px-2 py-1 rounded bg-slate-50/50">{t}</span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Contact ───────────────────────────────────────────────────────── */}
      <section id="contact" className="relative z-10 py-32 px-6 md:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto">

          <Reveal direction="up">
            <div className="mb-16">
              <div className="font-mono text-accent-green text-xs tracking-widest uppercase mb-3">
                <span className="size-2 inline-block rounded-full bg-accent-green mr-2 animate-cursor-blink" />
                Status: Available for Remote Work
              </div>
              <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-4">
                LET'S BUILD SOMETHING <span className="text-brand">ROBUST</span>
              </h2>
              <p className="text-text-dim max-w-xl">
                Open to full-time roles, contract projects, and architecture consulting. Backend-heavy work, distributed systems, and cloud infrastructure are my sweet spot.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">

            {/* Contact form — takes 3 cols */}
            <Reveal direction="right" delay={100} className="lg:col-span-3">
              <ContactForm />
            </Reveal>

            {/* Contact info — takes 2 cols */}
            <Reveal direction="left" delay={200} className="lg:col-span-2 space-y-8">
              <div className="space-y-3">
                <p className="font-mono text-xs text-muted-foreground/60 uppercase tracking-widest">Direct Line</p>
                <a
                  href="mailto:ritik.saluja@engineer.com"
                  className="block text-lg font-mono text-foreground hover:text-brand transition-colors break-all"
                >
                  ritik.saluja@engineer.com
                </a>
              </div>

              <div className="space-y-3">
                <p className="font-mono text-xs text-muted-foreground/60 uppercase tracking-widest">Socials</p>
                <div className="flex flex-col gap-2">
                  <a href="#" className="text-sm text-text-dim hover:text-brand transition-colors font-mono">↗ GitHub</a>
                  <a href="#" className="text-sm text-text-dim hover:text-brand transition-colors font-mono">↗ LinkedIn</a>
                </div>
              </div>

              <div className="space-y-3">
                <p className="font-mono text-xs text-muted-foreground/60 uppercase tracking-widest">Specialisation</p>
                <ul className="space-y-1.5 text-sm text-text-dim font-mono">
                  <li>— Backend Architecture</li>
                  <li>— Real-time Systems</li>
                  <li>— React Native Mobile</li>
                  <li>— Cloud Infrastructure</li>
                  <li>— Payment Integrations</li>
                  <li>— MERN Stack</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="font-mono text-xs text-muted-foreground/60 uppercase tracking-widest mb-2">System Metrics</p>
                <p className="text-xs font-mono text-text-dim">
                  Uptime: 99.98% · Latency: 12ms · Version: 2.0.4-stable
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="relative z-10 py-10 px-6 md:px-8 border-t border-border/40 bg-white/40 backdrop-blur-md text-slate-700">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            {/* Interactive Status Indicator */}
            <div className="flex items-center gap-2 group cursor-help">
              <div className="size-2 rounded-full bg-brand animate-cursor-blink group-hover:bg-accent-green transition-colors duration-300" />
              <span className="font-mono text-xs text-slate-700 uppercase tracking-widest transition-colors duration-300 group-hover:text-brand font-medium">
                Ritik Saluja · EST. 2021
              </span>
            </div>
            
            {/* Back to Top */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center justify-center size-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-brand hover:-translate-y-0.5 hover:shadow-sm active:scale-95 transition-all duration-200 cursor-pointer"
              title="Scroll to top"
            >
              <ArrowUp className="size-4" />
            </button>
          </div>

          {/* Interactive Technology Tags */}
          <div className="font-mono text-xs text-slate-500 flex items-center gap-1.5 flex-wrap">
            Built with
            <a
              href="https://react.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-700 hover:text-[#00D8FF] transition-colors duration-200 font-semibold"
            >
              React
            </a>
            ·
            <a
              href="https://tanstack.com/router"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-700 hover:text-[#FF4154] transition-colors duration-200 font-semibold"
            >
              TanStack Router
            </a>
            ·
            <a
              href="https://tailwindcss.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-700 hover:text-[#38BDF8] transition-colors duration-200 font-semibold"
            >
              Tailwind
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
