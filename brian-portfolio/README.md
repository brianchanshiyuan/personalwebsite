# Brian Portfolio

This project pairs a Vite + React frontend with a lightweight Express API so you can showcase personal projects and link directly to their GitHub repositories.

## Getting started

```bash
npm install
```

### Run the frontend only

```bash
npm run dev
```

The site will be available at [http://localhost:5173](http://localhost:5173).

### Run the backend only

```bash
npm run server
```

The API serves project data from `backend/projects.json` at `http://localhost:4000/api/projects` and resume data (contact, summary, skills, experience) from `backend/resume.json` via `http://localhost:4000/api/resume`.

### Run both together

```bash
npm run dev:all
```

This uses `concurrently` to boot the backend and Vite dev server in a single terminal.

## Customizing resume + project data

### Resume

Update `backend/resume.json` to reflect your summary, contact info, skills, and experience timeline. The frontend consumes whatever is in this JSON, so you can add/remove skill categories or experience entries freely.

### Projects

Project cards are sourced from `backend/projects.json`. Each entry supports:

```jsonc
{
  "id": "portfolio",
  "name": "Personal Portfolio",
  "description": "Short blurb that will show on the card.",
  "tech": ["React", "TypeScript", "Vite"],
  "githubUrl": "https://github.com/your-user/portfolio",
  "liveUrl": "https://your-hosted-site.example.com"
}
```

Update the JSON file manually or send a `POST` request to `/api/projects` with the same shape to append data. The frontend automatically fetches from the API when the page loads and renders each repo link as a button.

## Environment configuration

The frontend defaults to `http://localhost:4000` for API calls. Set `VITE_API_BASE` in a `.env` file if you deploy the backend elsewhere:

```
VITE_API_BASE=https://portfolio-api.example.com
```

## Linting and builds

```bash
npm run lint   # ESLint
npm run build  # Type-check + production build
npm run preview
```
