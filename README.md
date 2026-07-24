# Marco Egidi — Portfolio

Professional portfolio built with React, TypeScript, Vite, and Tailwind CSS.
The homepage is English-first and includes a persistent ENG/ITA language
switch, light/dark themes, selected projects, experience, technical skills,
creative work, education, and contact details.

## Local development

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm run lint
npm test
npm run build
```

The production build also creates route-specific HTML entry points for
`/dashboard/` and `/swim-analyzer/` so direct refreshes work on GitHub Pages
and each public route ships its own title, description, canonical, and social
metadata.

## Deployment

GitHub Actions deploys the `dist` directory to GitHub Pages on pushes to
`main`, manual workflow runs, and scheduled Strava data refreshes. Required
Strava values remain configured as GitHub Actions secrets.

## Google Search Console — manual steps after deployment

1. Add `https://markegididev.github.io/` to Google Search Console.
2. Verify ownership using a real method offered by Search Console. Do not add
   placeholder verification tokens to the repository.
3. Submit `https://markegididev.github.io/sitemap.xml`.
4. Request a fresh indexing of the homepage after deployment.
5. Monitor indexing coverage, Core Web Vitals, and rich-result reports.
