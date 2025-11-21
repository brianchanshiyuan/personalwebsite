import express from 'express'
import cors from 'cors'
import fs from 'node:fs'
import path from 'node:path'

const app = express()
const PORT = process.env.PORT ?? 4000

const projectFile = path.resolve(process.cwd(), 'backend', 'projects.json')
const resumeFile = path.resolve(process.cwd(), 'backend', 'resume.json')

app.use(cors())
app.use(express.json())

const loadJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf-8'))
const saveJson = (filePath, data) =>
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))

app.get('/api/projects', (_req, res) => {
  try {
    const projects = loadJson(projectFile)
    res.json({ projects })
  } catch (error) {
    console.error('Unable to load projects', error)
    res.status(500).json({ message: 'Failed to load projects' })
  }
})

app.post('/api/projects', (req, res) => {
  try {
    const projects = loadJson(projectFile)
    const next = [...projects, req.body]
    saveJson(projectFile, next)
    res.status(201).json({ message: 'Saved', projects: next })
  } catch (error) {
    console.error('Unable to save project', error)
    res.status(500).json({ message: 'Failed to save project' })
  }
})

app.get('/api/resume', (_req, res) => {
  try {
    const resume = loadJson(resumeFile)
    const projects = loadJson(projectFile)
    res.json({ ...resume, projects })
  } catch (error) {
    console.error('Unable to load resume', error)
    res.status(500).json({ message: 'Failed to load resume' })
  }
})

app.listen(PORT, () => {
  console.log(`Portfolio API listening on http://localhost:${PORT}`)
})
