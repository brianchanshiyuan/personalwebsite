import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express()
const PORT = process.env.PORT ?? 4000

// In Vercel, __dirname points to the directory containing the current module
const projectFile = join(__dirname, 'projects.json')
const resumeFile = join(__dirname, 'resume.json')

app.use(cors())
app.use(express.json())

const loadJson = (filePath) => JSON.parse(readFileSync(filePath, 'utf-8'))
const saveJson = (filePath, data) =>
  writeFileSync(filePath, JSON.stringify(data, null, 2))

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

// Export the Express API for Vercel
// Export the Express API for Vercel
export default app

// Only start the server when running locally
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Portfolio API listening on http://localhost:${PORT}`)
  })
}
