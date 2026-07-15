import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  profile,
  skills,
  socials,
  projects,
  certifications,
  posts,
} from "@data"; // mapped to ./src/data.js via the import map in index.html

/* ------------------------------------------------------------------ icons -- */
const Icon = ({ name, size = 18 }) => {
  const p = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  switch (name) {
    case "github":
      return (
        <svg {...p} fill="currentColor" stroke="none">
          <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.85 9.73.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.79.62-3.38-1.22-3.38-1.22-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.34 1.12 2.91.86.09-.66.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...p} fill="currentColor" stroke="none">
          <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.75v20.5C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.75V1.75C24 .78 23.2 0 22.22 0Z" />
        </svg>
      );
    case "x":
      return (
        <svg {...p} fill="currentColor" stroke="none">
          <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.22-6.82-5.97 6.82H1.66l7.73-8.84L1.24 2.25h6.83l4.71 6.23 5.46-6.23Zm-1.16 17.52h1.83L7.01 4.13H5.04l12.04 15.64Z" />
        </svg>
      );
    case "mail":
      return (
        <svg {...p}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      );
    case "external":
      return (
        <svg {...p}>
          <path d="M15 3h6v6" />
          <path d="M10 14 21 3" />
          <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...p}>
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      );
    case "folder":
      return (
        <svg {...p} width={28} height={28}>
          <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
        </svg>
      );
    case "cert":
      return (
        <svg {...p} width={22} height={22}>
          <circle cx="12" cy="8" r="6" />
          <path d="M8.21 13.89 7 22l5-3 5 3-1.21-8.11" />
        </svg>
      );
    case "pin":
      return (
        <svg {...p} width={15} height={15}>
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case "menu":
      return (
        <svg {...p} width={22} height={22}>
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      );
    case "close":
      return (
        <svg {...p} width={22} height={22}>
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      );
    default:
      return null;
  }
};

/* --------------------------------------------------------------- motion ---- */
const ease = [0.22, 1, 0.36, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const Reveal = ({ children, className, style }) => (
  <motion.div
    className={className}
    style={style}
    variants={fadeUp}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.2 }}
  >
    {children}
  </motion.div>
);

const SectionHead = ({ n, label, title, subtitle }) => (
  <Reveal className="section-head">
    <span className="eyebrow">
      <span className="n">{n}</span> // {label}
    </span>
    <h2 className="section-title">{title}</h2>
    {subtitle && <p>{subtitle}</p>}
  </Reveal>
);

/* ----------------------------------------------------------------- nav ----- */
const NAV = [
  ["About", "#about"],
  ["Experience", "#projects"],
  ["Certs", "#certifications"],
  ["Blog", "#blog"],
];

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const initials = profile.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <motion.nav
      className={"nav" + (scrolled ? " scrolled" : "")}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease }}
    >
      <div className="container nav-inner">
        <a href="#top" className="brand">
          <span className="logo">{initials}</span>
          {profile.name}
        </a>
        <div className={"nav-links" + (open ? " open" : "")} onClick={() => setOpen(false)}>
          {NAV.map(([label, href]) => (
            <a key={href} href={href}>{label}</a>
          ))}
          <a className="nav-cta" href="#contact">Let's talk</a>
        </div>
        <button className="nav-toggle" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>
    </motion.nav>
  );
}

/* ---------------------------------------------------------------- hero ----- */
function Avatar() {
  const [err, setErr] = useState(false);
  const initials = profile.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <motion.div
      className="avatar-wrap"
      initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.8, ease, delay: 0.15 }}
    >
      <motion.div
        className="avatar-ring"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        {!err && profile.photo ? (
          <img className="avatar" src={profile.photo} alt={profile.name} onError={() => setErr(true)} />
        ) : (
          <div className="avatar-fallback"><span>{initials}</span></div>
        )}
      </motion.div>
      <div className="avatar-badge"><span className="prompt">$</span> whoami</div>
    </motion.div>
  );
}

function Hero() {
  return (
    <header className="hero container" id="top">
      <div className="hero-grid">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.span className="badge-avail" variants={fadeUp}>
            <span className="pin"><Icon name="pin" /></span> {profile.location}
          </motion.span>
          <motion.h1 variants={fadeUp}>
            {profile.name.split(" ")[0]}
            {profile.name.includes(" ") && (
              <>
                {" "}
                <span className="grad">{profile.name.split(" ").slice(1).join(" ")}</span>
              </>
            )}
          </motion.h1>
          <motion.div className="role" variants={fadeUp}>{profile.role}</motion.div>
          <motion.p className="tagline" variants={fadeUp}>{profile.tagline}</motion.p>
          <motion.div className="hero-actions" variants={fadeUp}>
            <a className="btn btn-primary" href="#projects">View my work <Icon name="arrow" /></a>
            {profile.resume && (
              <a className="btn btn-ghost" href={profile.resume} target="_blank" rel="noreferrer">
                Résumé <Icon name="external" size={16} />
              </a>
            )}
          </motion.div>
          <motion.div className="hero-socials" variants={fadeUp}>
            {socials.map((s) => (
              <a key={s.label} className="icon-btn" href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}>
                <Icon name={s.icon} />
              </a>
            ))}
          </motion.div>
          <motion.div className="stats" variants={fadeUp}>
            {profile.stats.map((st) => (
              <div className="stat" key={st.label}>
                <div className="v grad">{st.value}</div>
                <div className="l">{st.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
        <Avatar />
      </div>
    </header>
  );
}

/* --------------------------------------------------------------- about ----- */
function About() {
  return (
    <section id="about">
      <div className="container">
        <SectionHead n="01" label="about" title="A bit about me" />
        <div className="about-grid">
          <Reveal>
            <p className="about-lead">{profile.about}</p>
            <div className="chips" style={{ marginTop: 26 }}>
              {skills.map((s) => (
                <motion.span
                  className="chip"
                  key={s}
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                >
                  {s}
                </motion.span>
              ))}
            </div>
          </Reveal>
          <Reveal className="about-card">
            <h3>// details</h3>
            <div className="info-row"><span className="k">name</span><span>{profile.name}</span></div>
            <div className="info-row"><span className="k">role</span><span>{profile.role}</span></div>
            <div className="info-row"><span className="k">location</span><span>{profile.location}</span></div>
            <div className="info-row"><span className="k">email</span><a href={`mailto:${profile.email}`} className="grad">{profile.email}</a></div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- projects ---- */
function Projects() {
  return (
    <section id="projects">
      <div className="container">
        <SectionHead
          n="02"
          label="experience"
          title="Where I've worked"
          subtitle="Roles where I've designed, shipped, and secured systems end to end."
        />
        <motion.div
          className="grid projects"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {projects.map((p) => (
            <motion.article
              key={p.title}
              className={"card" + (p.featured ? " span-2" : "")}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              <div className="card-top">
                <span className="folder"><Icon name="folder" /></span>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {(p.badge || p.featured) && <span className="featured-flag">{p.badge || "featured"}</span>}
                  <div className="card-links">
                    {p.repo && <a href={p.repo} target="_blank" rel="noreferrer" aria-label="Repository"><Icon name="github" /></a>}
                    {p.demo && <a href={p.demo} target="_blank" rel="noreferrer" aria-label="Live demo"><Icon name="external" /></a>}
                  </div>
                </div>
              </div>
              <h3>{p.title}</h3>
              {(p.org || p.period) && (
                <div className="card-meta">
                  {p.org}{p.org && p.period ? " · " : ""}{p.period}
                </div>
              )}
              <p>{p.description}</p>
              <div className="tags">
                {p.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------- certifications --- */
function Certifications() {
  return (
    <section id="certifications">
      <div className="container">
        <SectionHead
          n="03"
          label="certifications"
          title="Credentials & certs"
          subtitle="Verified certifications and the skills behind them."
        />
        <motion.div
          className="grid certs"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {certifications.map((c) => (
            <motion.article key={c.title} className="card" variants={fadeUp} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}>
              <div className="cert-icon"><Icon name="cert" /></div>
              <h3 style={{ fontSize: "1.08rem" }}>{c.title}</h3>
              <div className="cert-meta">{c.issuer}{c.date ? ` · ${c.date}` : ""}</div>
              {c.credential && (
                <a className="cert-link" href={c.credential} target="_blank" rel="noreferrer">
                  Verify credential <Icon name="external" size={15} />
                </a>
              )}
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- blog ---- */
function Blog() {
  const fmt = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return (
    <section id="blog">
      <div className="container">
        <SectionHead
          n="04"
          label="blog"
          title="Writing & notes"
          subtitle="I write about performance, architecture, and the craft of building software."
        />
        <motion.div
          className="grid blog"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {posts.map((post) => (
            <motion.a
              key={post.title}
              className="card blog-card"
              href={post.href}
              target="_blank"
              rel="noreferrer"
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              <div className="blog-meta">
                <span className="blog-tag">{post.tag}</span>
                <span>·</span>
                <span>{fmt(post.date)}</span>
                <span>·</span>
                <span>{post.readingTime}</span>
              </div>
              <h3 style={{ fontSize: "1.14rem" }}>{post.title}</h3>
              <p>{post.excerpt}</p>
              <span className="arrow">Read post <Icon name="arrow" size={16} /></span>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- contact ---- */
function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="container">
        <Reveal className="contact-card">
          <span className="eyebrow" style={{ justifyContent: "center", display: "flex" }}>
            <span className="n">05</span> // contact
          </span>
          <h2>Let's build something <span className="grad">great</span>.</h2>
          <p>Have a project, an idea, or a question? The fastest way to reach me is email — I usually reply within a day.</p>
          <div className="hero-actions" style={{ justifyContent: "center" }}>
            <a className="btn btn-primary" href={`mailto:${profile.email}`}>
              <Icon name="mail" /> {profile.email}
            </a>
            {socials[0] && (
              <a className="btn btn-ghost" href={socials[0].href} target="_blank" rel="noreferrer">
                <Icon name={socials[0].icon} /> {socials[0].label}
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="container foot-inner">
        <span className="mono">© {new Date().getFullYear()} {profile.name}</span>
        <span className="mono" style={{ opacity: 0.7 }}>Built with React + Framer Motion</span>
        <div className="foot-socials">
          {socials.map((s) => (
            <a key={s.label} className="icon-btn" href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} style={{ width: 38, height: 38 }}>
              <Icon name={s.icon} size={16} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ----------------------------------------------------- reactive bg -------- */
function Background() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return; // skip on touch / reduced-motion
    let raf = 0, x = 0, y = 0;
    const onMove = (e) => {
      x = e.clientX; y = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          el.style.setProperty("--mx", x + "px");
          el.style.setProperty("--my", y + "px");
        });
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => { window.removeEventListener("mousemove", onMove); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return (
    <div className="bg" aria-hidden="true" ref={ref}>
      <span className="orb a" />
      <span className="orb b" />
      <div className="grid-reveal" />
      <div className="spotlight" />
    </div>
  );
}

/* ---------------------------------------------------------- scroll bar ----- */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return (
    <motion.div
      style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 3, transformOrigin: "0%",
        background: "linear-gradient(90deg,#dd8b3d,#c05621,#9a3d10)", zIndex: 60, scaleX,
      }}
    />
  );
}

/* ----------------------------------------------------------------- app ----- */
function App() {
  return (
    <>
      <Background />
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <About />
        <Projects />
        <Certifications />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
