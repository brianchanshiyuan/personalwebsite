import { useEffect, useState } from 'react'
import './App.css'

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
    phone: string
    email: string
    linkedin: string
    github: string
  }
  summary: string
  skills: SkillCategory[]
  experience: Experience[]
  otherExperience?: OtherExperience[]
  projects?: Project[]
}

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:4000'

function App() {
  const [resume, setResume] = useState<Resume | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadResume = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_BASE}/api/resume`)
        if (!response.ok) throw new Error('Unable to fetch resume')
        const data = await response.json()
        setResume({
          contact: data.contact,
          summary: data.summary,
          skills: data.skills ?? [],
          experience: data.experience ?? [],
          otherExperience: data.otherExperience ?? [],
          projects: data.projects ?? [],
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    loadResume()
  }, [])

  const projects = resume?.projects ?? []

  return (
    <div className="page">
      <header className="hero">
        <p className="eyebrow">{resume?.contact.location ?? 'Singapore'}</p>
        <h1>{resume?.contact.name ?? 'Brian Chan'}</h1>
        <p className="lede">{resume?.summary}</p>
        <div className="contact-grid">
          <a className="contact-pill" href={`tel:${resume?.contact.phone}`}>
            {resume?.contact.phone}
          </a>
          <a
            className="contact-pill"
            href={`mailto:${resume?.contact.email}`}
          >
            {resume?.contact.email}
          </a>
          <a
            className="contact-pill"
            href={resume?.contact.linkedin}
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
          <a
            className="contact-pill"
            href={resume?.contact.github}
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </header>

      <section className="skills">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Technical Skills</p>
            <h2>What I work with</h2>
          </div>
          {loading && <span className="status">Loading…</span>}
          {error && <span className="status error">{error}</span>}
        </div>
        <div className="skill-grid">
          {resume?.skills.map((skill) => (
            <article className="skill-card" key={skill.label}>
              <p className="eyebrow">{skill.label}</p>
              <p>{skill.items.join(', ')}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="experience">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Experience</p>
            <h2>Recent roles</h2>
          </div>
        </div>
        <div className="timeline">
          {resume?.experience.map((exp) => (
            <article className="experience-card" key={exp.company}>
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
            </article>
          ))}
        </div>
        {!!resume?.otherExperience?.length && (
          <div className="other-experience">
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
      </section>

      <section className="projects">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Projects</p>
            <h2>Featured builds</h2>
          </div>
          {loading && <span className="status">Loading…</span>}
        </div>

        <div className="project-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.id}>
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
                <a
                  className="ghost"
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View on GitHub
                </a>
                {project.liveUrl && (
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
            </article>
          ))}
          {!loading && !projects.length && (
            <p className="empty-state">
              No projects found yet. Add one via `POST /api/projects` or edit
              `backend/projects.json`.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

export default App
