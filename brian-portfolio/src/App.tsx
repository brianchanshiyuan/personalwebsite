// import { useCallback, useEffect, useMemo, useState } from 'react'
// import Particles from 'react-tsparticles'
// import { loadFull } from 'tsparticles'
// import type { ISourceOptions } from 'tsparticles-engine'
// import { motion } from 'framer-motion'
// import './App.css'

// type Project = {
//   id: string
//   name: string
//   description: string
//   tech?: string[]
//   githubUrl: string
//   liveUrl?: string
// }

// type SkillCategory = {
//   label: string
//   items: string[]
// }

// type Experience = {
//   company: string
//   role: string
//   start: string
//   end: string
//   logo?: string
//   bullets: string[]
// }

// type OtherExperience = {
//   company: string
//   role: string
//   details: string
// }

// type Resume = {
//   contact: {
//     name: string
//     location: string
//     phone: string
//     email: string
//     linkedin: string
//     github: string
//   }
//   summary: string
//   story?: string
//   skills: SkillCategory[]
//   experience: Experience[]
//   otherExperience?: OtherExperience[]
//   projects?: Project[]
// }

// const THEME_KEY = 'portfolio-theme'
// const isProduction = import.meta.env.PROD
// const API_BASE = isProduction 
//   ? import.meta.env.VITE_API_PRODUCTION
//   : import.meta.env.VITE_API_BASE 

// const navLinks = [
//   { id: 'story', label: 'Story' },
//   { id: 'skills', label: 'Skills' },
//   { id: 'experience', label: 'Experience' },
//   { id: 'projects', label: 'Projects' },
// ]

// const sectionMotion = {
//   initial: { opacity: 0, y: 32 },
//   whileInView: { opacity: 1, y: 0 },
//   viewport: { once: true, amount: 0.25 },
//   transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
// }

// function App() {
//   const [resume, setResume] = useState<Resume | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   const storedTheme =
//     typeof window !== 'undefined'
//       ? (window.localStorage.getItem(THEME_KEY) as 'light' | 'dark' | null)
//       : null

//   const [theme, setTheme] = useState<'light' | 'dark'>(() => {
//     if (typeof window === 'undefined') return 'dark'
//     if (storedTheme) return storedTheme
//     return window.matchMedia('(prefers-color-scheme: light)').matches
//       ? 'light'
//       : 'dark'
//   })
//   const [userThemeSet, setUserThemeSet] = useState(() => Boolean(storedTheme))

//   const toggleTheme = () => {
//     setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
//     setUserThemeSet(true)
//   }

//   useEffect(() => {
//     if (typeof window === 'undefined') return
//     document.documentElement.dataset.theme = theme
//     if (userThemeSet) {
//       window.localStorage.setItem(THEME_KEY, theme)
//     } else {
//       window.localStorage.removeItem(THEME_KEY)
//     }
//   }, [theme, userThemeSet])

//   useEffect(() => {
//     if (typeof window === 'undefined') return
//     const media = window.matchMedia('(prefers-color-scheme: light)')
//     const handleChange = (event: MediaQueryListEvent) => {
//       if (!userThemeSet) {
//         setTheme(event.matches ? 'light' : 'dark')
//       }
//     }
//     media.addEventListener('change', handleChange)
//     return () => media.removeEventListener('change', handleChange)
//   }, [userThemeSet])

//   const particlesInit = useCallback(async (engine: unknown) => {
//     await loadFull(engine as never)
//   }, [])

//   const particleOptions = useMemo<ISourceOptions>(() => {
//     const palette =
//       theme === 'dark'
//         ? ['#00E0FF', '#5AB4FF', '#7A4FFF']
//         : ['#0C63C7', '#5AB4FF', '#7A4FFF']

//     return {
//       background: { color: 'transparent' },
//       fullScreen: false,
//       fpsLimit: 60,
//       particles: {
//         number: {
//           value: 70,
//           density: { enable: true, area: 900 },
//         },
//         color: { value: palette },
//         links: {
//           enable: true,
//           color: theme === 'dark' ? '#5AB4FF' : '#0C63C7',
//           opacity: 0.18,
//           width: 1,
//         },
//         move: {
//           enable: true,
//           speed: 1.1,
//           outModes: { default: 'out' },
//         },
//         opacity: { value: 0.35 },
//         size: { value: { min: 1, max: 3 } },
//       },
//       interactivity: {
//         events: {
//           onHover: { enable: true, mode: 'repulse' },
//           onClick: { enable: true, mode: 'push' },
//         },
//         modes: {
//           repulse: { distance: 120, duration: 0.4 },
//           push: { quantity: 2 },
//         },
//       },
//     }
//   }, [theme])

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         // Fetch both resume and projects in parallel
//         const [resumeRes, projectsRes] = await Promise.all([
//           fetch(`${API_BASE}/api/resume`),
//           fetch(`${API_BASE}/api/projects`)
//         ]);
        
//         if (!resumeRes.ok) throw new Error('Failed to fetch resume');
//         if (!projectsRes.ok) throw new Error('Failed to fetch projects');

//         const [resumeData, projectsData] = await Promise.all([
//           resumeRes.json(),
//           projectsRes.json()
//         ]);

//         // Merge the data
//         setResume({
//           contact: resumeData.contact,
//           summary: resumeData.summary,
//           story: resumeData.story,
//           skills: resumeData.skills ?? [],
//           experience: resumeData.experience ?? [],
//           otherExperience: resumeData.otherExperience ?? [],
//           projects: projectsData.projects ?? [],
//         });
//       } catch (err) {
//         console.error('Error loading data:', err);
//         setError(err instanceof Error ? err.message : 'Failed to load data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, [])

//   const projects = resume?.projects ?? []
//   const storyParagraphs = resume?.story
//     ?.split('\n\n')
//     .map((chunk) => chunk.trim())
//     .filter(Boolean)

//   return (
//     <div className="page">
//       <div className="grid-overlay" aria-hidden="true" />
//       <Particles
//         id="portfolio-particles"
//         className="particle-canvas"
//         init={particlesInit}
//         options={particleOptions}
//       />
//       <div className="content">
//         <motion.nav
//           className="nav"
//           initial={{ opacity: 0, y: -16 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, ease: 'easeOut' }}
//         >
//           <a href="#hero" className="nav-logo">
//             BC
//           </a>
//           <div className="nav-links">
//             {navLinks.map((link) => (
//               <a key={link.id} href={`#${link.id}`} className="nav-link">
//                 {link.label}
//                 <span className="nav-indicator" />
//               </a>
//             ))}
//           </div>
//           <button
//             type="button"
//             className="theme-toggle"
//             onClick={toggleTheme}
//             aria-label="Toggle theme"
//           >
//             {theme === 'dark' ? '🌙' : '☀️'}
//           </button>
//         </motion.nav>

//         <main className="main">
//           <motion.section
//             id="hero"
//             className="hero-section section"
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, ease: 'easeOut' }}
//           >
//             <div className="hero_glow" aria-hidden="true" />
//             <div className="profile-container">
//               <motion.div 
//                 className="profile-image-wrapper"
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 transition={{ delay: 0.2, duration: 0.5 }}
//               >
//                 <img 
//                   src="/logos/me.jpg" 
//                   alt="Brian Chan" 
//                   className="profile-image"
//                 />
//                 <div className="profile-frame" />
//               </motion.div>
//             </div>
//             <p className="eyebrow">{resume?.contact.location ?? 'Singapore'}</p>
//             <h1>{resume?.contact.name ?? 'Brian Chan'}</h1>
//             <p className="lede">{resume?.summary}</p>
//             <div className="contact-grid">
//               <a className="contact-pill" href={`mailto:${resume?.contact.email}`}>
//                 {resume?.contact.email}
//               </a>
//               {/* <a
//                 className="contact-pill"
//                 href={resume?.contact.linkedin}
//                 target="_blank"
//                 rel="noreferrer"
//               >
//                 LinkedIn
//               </a> */}
//               <a
//                 className="contact-pill"
//                 href={resume?.contact.github}
//                 target="_blank"
//                 rel="noreferrer"
//               >
//                 GitHub
//               </a>
//             </div>
//             <div className="hero-cta-row">
//               <a
//                 className="cta"
//                 href={resume?.contact.linkedin ?? '#'}
//                 target="_blank"
//                 rel="noreferrer"
//               >
//                 View LinkedIn
//               </a>
//               <a
//                 className="ghost"
//                 href="#projects"
//               >
//                 Explore Projects
//         </a>
//       </div>
//           </motion.section>

//           {storyParagraphs && storyParagraphs.length > 0 && (
//             <motion.section
//               id="story"
//               className="story section lift-card"
//               {...sectionMotion}
//             >
//               <div className="section-heading">
//                 <p className="eyebrow">My Story</p>
//               </div>
//               <div className="story-body">
//                 {storyParagraphs.map((paragraph) => (
//                   <p key={paragraph}>{paragraph}</p>
//                 ))}
//               </div>
//             </motion.section>
//           )}

//           <motion.section
//             id="skills"
//             className="skills section"
//             {...sectionMotion}
//           >
//             <div className="section-heading">
//               <div>
//                 <p className="eyebrow">Technical Skills</p>
//                 <h2>What I work with</h2>
//               </div>
//               {loading && <span className="status">Loading…</span>}
//               {error && <span className="status error">{error}</span>}
//             </div>
//             <div className="skill-grid">
//               {resume?.skills.map((skill) => (
//                 <motion.article
//                   className="skill-card lift-card"
//                   key={skill.label}
//                   whileHover={{ scale: 1.01 }}
//                 >
//                   <p className="eyebrow">{skill.label}</p>
//                   <p>{skill.items.join(', ')}</p>
//                 </motion.article>
//               ))}
//             </div>
//           </motion.section>

//           <motion.section
//             id="experience"
//             className="experience section"
//             {...sectionMotion}
//           >
//             <div className="section-heading">
//               <div>
//                 <p className="eyebrow">Experience</p>
//                 <h2>Recent roles</h2>
//               </div>
//             </div>
//             <div className="timeline">
//               {resume?.experience.map((exp) => (
//                 <motion.article
//                   className="experience-card lift-card"
//                   key={exp.company}
//                   whileHover={{ scale: 1.01, translateY: -4 }}
//                 >
//                   <div className="experience-meta">
//                     <div className="experience-title">
//                       {exp.logo && (
//                         <img
//                           className="experience-logo"
//                           src={exp.logo}
//                           alt={`${exp.company} logo`}
//                         />
//                       )}
//                       <div>
//                         <h3>
//                           {exp.role} · {exp.company}
//                         </h3>
//                         <p className="experience-dates">
//                           {exp.start} – {exp.end}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                   <ul>
//                     {exp.bullets.map((point) => (
//                       <li key={point}>{point}</li>
//                     ))}
//                   </ul>
//                 </motion.article>
//               ))}
//             </div>
//             {!!resume?.otherExperience?.length && (
//               <div className="other-experience lift-card">
//                 <p className="eyebrow">Other Experience</p>
//                 <ul>
//                   {resume.otherExperience.map((item) => (
//                     <li key={item.company}>
//                       <strong>
//                         {item.role} · {item.company}
//                       </strong>{' '}
//                       — {item.details}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </motion.section>

//           <motion.section
//             id="projects"
//             className="projects section"
//             {...sectionMotion}
//           >
//             <div className="section-heading">
//               <div>
//                 <p className="eyebrow">Projects</p>
//                 <h2>Featured builds</h2>
//               </div>
//               {loading && <span className="status">Loading…</span>}
//             </div>

//             <div className="project-grid">
//               {error ? (
//                 <div className="error-message">
//                   <p>Failed to load projects. Please try again later.</p>
//                   <button 
//                     onClick={() => window.location.reload()}
//                     className="ghost"
//                   >
//                     Retry
//                   </button>
//                 </div>
//               ) : loading ? (
//                 <div className="loading-state">Loading projects...</div>
//               ) : projects.length > 0 ? (
//                 projects.map((project) => (
//                 <motion.article
//                   className="project-card lift-card"
//                   key={project.id}
//                   whileHover={{ scale: 1.01, translateY: -4 }}
//                 >
//                   <div>
//                     <h3>{project.name}</h3>
//                     <p>{project.description}</p>
//                   </div>
//                   {project.tech && (
//                     <ul className="tag-row">
//                       {project.tech.map((tag) => (
//                         <li key={tag}>{tag}</li>
//                       ))}
//                     </ul>
//                   )}
//                   <div className="actions">
//                     {project.id !== 'slam-robot' && (
//                       <a
//                         className="ghost"
//                         href={project.githubUrl}
//                         target="_blank"
//                         rel="noreferrer"
//                       >
//                         View on GitHub
//                       </a>
//                     )}
//                     {project.liveUrl && project.id !== 'personal-website' && (
//                       <a
//                         className="ghost"
//                         href={project.liveUrl}
//                         target="_blank"
//                         rel="noreferrer"
//                       >
//                         Live Demo
//                       </a>
//                     )}
//                   </div>
//                 </motion.article>
//                 ))
//               ) : (
//                 <p className="empty-state">
//                   No projects found yet. Add one via `POST /api/projects` or
//                   edit `backend/projects.json`.
//                 </p>
//               )}
//             </div>
//           </motion.section>
//         </main>
//       </div>
//     </div>
//   )
// }

// export default App


import { useCallback, useEffect, useMemo, useState } from 'react'
import Particles from 'react-tsparticles'
import { loadFull } from 'tsparticles'
import type { ISourceOptions } from 'tsparticles-engine'
import { motion } from 'framer-motion'
import './App.css'

// 👉 NEW: import data directly from src/data
import resumeData from './data/resume.json'
import projectsData from './data/projects.json'

type Project = {
  id: string
  name: string
  description: string
  tech?: string[]
  githubUrl: string
  liveUrl?: string
}

type SkillCategory = {
  label: string
  items: string[]
}

type Experience = {
  company: string
  role: string
  start: string
  end: string
  logo?: string
  bullets: string[]
}

type OtherExperience = {
  company: string
  role: string
  details: string
}

type Resume = {
  contact: {
    name: string
    location: string
    email: string
    linkedin: string
    github: string
    phone?: string // optional, not in your JSON but harmless
  }
  summary: string
  story?: string
  skills: SkillCategory[]
  experience: Experience[]
  otherExperience?: OtherExperience[]
  projects?: Project[]
}

const THEME_KEY = 'portfolio-theme'

const navLinks = [
  { id: 'story', label: 'Story' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
]

const sectionMotion = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
}

// Build a typed resume object from the JSON
const resume: Resume = {
  contact: resumeData.contact,
  summary: resumeData.summary,
  story: resumeData.story,
  skills: resumeData.skills ?? [],
  experience: resumeData.experience ?? [],
  otherExperience: resumeData.otherExperience ?? [],
  projects: projectsData as Project[],
}

function App() {
  // ✅ Data is now static, no async needed
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'dark'

    const stored = window.localStorage.getItem(THEME_KEY) as 'light' | 'dark' | null
    if (stored) return stored

    return window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark'
  })

  const [userThemeSet, setUserThemeSet] = useState(() => {
    if (typeof window === 'undefined') return false
    return Boolean(window.localStorage.getItem(THEME_KEY))
  })

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
    setUserThemeSet(true)
  }

  // theme → data-theme + localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    document.documentElement.dataset.theme = theme

    if (userThemeSet) {
      window.localStorage.setItem(THEME_KEY, theme)
    } else {
      window.localStorage.removeItem(THEME_KEY)
    }
  }, [theme, userThemeSet])

  // respond to system theme if user hasn’t overridden
  useEffect(() => {
    if (typeof window === 'undefined') return
    const media = window.matchMedia('(prefers-color-scheme: light)')

    const handleChange = (event: MediaQueryListEvent) => {
      if (!userThemeSet) {
        setTheme(event.matches ? 'light' : 'dark')
      }
    }

    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [userThemeSet])

  const particlesInit = useCallback(async (engine: unknown) => {
    await loadFull(engine as never)
  }, [])

  const particleOptions = useMemo<ISourceOptions>(() => {
    const palette =
      theme === 'dark'
        ? ['#00E0FF', '#5AB4FF', '#7A4FFF']
        : ['#0C63C7', '#5AB4FF', '#7A4FFF']

    return {
      background: { color: 'transparent' },
      fullScreen: false,
      fpsLimit: 60,
      particles: {
        number: {
          value: 70,
          density: { enable: true, area: 900 },
        },
        color: { value: palette },
        links: {
          enable: true,
          color: theme === 'dark' ? '#5AB4FF' : '#0C63C7',
          opacity: 0.18,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1.1,
          outModes: { default: 'out' },
        },
        opacity: { value: 0.35 },
        size: { value: { min: 1, max: 3 } },
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: 'repulse' },
          onClick: { enable: true, mode: 'push' },
        },
        modes: {
          repulse: { distance: 120, duration: 0.4 },
          push: { quantity: 2 },
        },
      },
    }
  }, [theme])

  const projects = resume.projects ?? []
  const storyParagraphs = resume.story
    ?.split('\n\n')
    .map((chunk) => chunk.trim())
    .filter(Boolean)

  return (
    <div className="page">
      <div className="grid-overlay" aria-hidden="true" />
      <Particles
        id="portfolio-particles"
        className="particle-canvas"
        init={particlesInit}
        options={particleOptions}
      />
      <div className="content">
        <motion.nav
          className="nav"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <a href="#hero" className="nav-logo">
            BC
          </a>
          <div className="nav-links">
            {navLinks.map((link) => (
              <a key={link.id} href={`#${link.id}`} className="nav-link">
                {link.label}
                <span className="nav-indicator" />
              </a>
            ))}
          </div>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
        </motion.nav>

        <main className="main">
          <motion.section
            id="hero"
            className="hero-section section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="hero_glow" aria-hidden="true" />
            <div className="profile-container">
              <motion.div
                className="profile-image-wrapper"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <img
                  src="/logos/me.jpg"
                  alt="Brian Chan"
                  className="profile-image"
                />
                <div className="profile-frame" />
              </motion.div>
            </div>
            <p className="eyebrow">{resume.contact.location ?? 'Singapore'}</p>
            <h1>{resume.contact.name ?? 'Brian Chan'}</h1>
            <p className="lede">{resume.summary}</p>
            <div className="contact-grid">
              <a className="contact-pill" href={`mailto:${resume.contact.email}`}>
                {resume.contact.email}
              </a>
              <a
                className="contact-pill"
                href={resume.contact.github}
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </div>
            <div className="hero-cta-row">
              <a
                className="cta"
                href={resume.contact.linkedin ?? '#'}
                target="_blank"
                rel="noreferrer"
              >
                View LinkedIn
              </a>
              <a className="ghost" href="#projects">
                Explore Projects
              </a>
            </div>
          </motion.section>

          {storyParagraphs && storyParagraphs.length > 0 && (
            <motion.section
              id="story"
              className="story section lift-card"
              {...sectionMotion}
            >
              <div className="section-heading">
                <p className="eyebrow">My Story</p>
              </div>
              <div className="story-body">
                {storyParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </motion.section>
          )}

          <motion.section
            id="skills"
            className="skills section"
            {...sectionMotion}
          >
            <div className="section-heading">
              <div>
                <p className="eyebrow">Technical Skills</p>
                <h2>What I work with</h2>
              </div>
            </div>
            <div className="skill-grid">
              {resume.skills.map((skill) => (
                <motion.article
                  className="skill-card lift-card"
                  key={skill.label}
                  whileHover={{ scale: 1.01 }}
                >
                  <p className="eyebrow">{skill.label}</p>
                  <p>{skill.items.join(', ')}</p>
                </motion.article>
              ))}
            </div>
          </motion.section>

          <motion.section
            id="experience"
            className="experience section"
            {...sectionMotion}
          >
            <div className="section-heading">
              <div>
                <p className="eyebrow">Experience</p>
                <h2>Recent roles</h2>
              </div>
            </div>
            <div className="timeline">
              {resume.experience.map((exp) => (
                <motion.article
                  className="experience-card lift-card"
                  key={exp.company}
                  whileHover={{ scale: 1.01, translateY: -4 }}
                >
                  <div className="experience-meta">
                    <div className="experience-title">
                      {exp.logo && (
                        <img
                          className="experience-logo"
                          src={exp.logo}
                          alt={`${exp.company} logo`}
                        />
                      )}
                      <div>
                        <h3>
                          {exp.role} · {exp.company}
                        </h3>
                        <p className="experience-dates">
                          {exp.start} – {exp.end}
                        </p>
                      </div>
                    </div>
                  </div>
                  <ul>
                    {exp.bullets.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </motion.article>
              ))}
            </div>
            {!!resume.otherExperience?.length && (
              <div className="other-experience lift-card">
                <p className="eyebrow">Other Experience</p>
                <ul>
                  {resume.otherExperience.map((item) => (
                    <li key={item.company}>
                      <strong>
                        {item.role} · {item.company}
                      </strong>{' '}
                      — {item.details}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.section>

          <motion.section
            id="projects"
            className="projects section"
            {...sectionMotion}
          >
            <div className="section-heading">
              <div>
                <p className="eyebrow">Projects</p>
                <h2>Featured builds</h2>
              </div>
            </div>

            <div className="project-grid">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <motion.article
                    className="project-card lift-card"
                    key={project.id}
                    whileHover={{ scale: 1.01, translateY: -4 }}
                  >
                    <div>
                      <h3>{project.name}</h3>
                      <p>{project.description}</p>
                    </div>
                    {project.tech && (
                      <ul className="tag-row">
                        {project.tech.map((tag) => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                    )}
                    <div className="actions">
                      {project.id !== 'slam-robot' && (
                        <a
                          className="ghost"
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View on GitHub
                        </a>
                      )}
                      {project.liveUrl && project.id !== 'personal-website' && (
                        <a
                          className="ghost"
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Live Demo
                        </a>
                      )}
                    </div>
                  </motion.article>
                ))
              ) : (
                <p className="empty-state">
                  No projects found yet. Populate src/data/projects.json to add some.
                </p>
              )}
            </div>
          </motion.section>
        </main>
      </div>
    </div>
  )
}

export default App
