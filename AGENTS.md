# Repository guidance

## Project and source map

This is Maxim Maslov's Russian-language portfolio and resume: a static React 19,
TypeScript, and Vite application deployed to GitHub Pages. It has no backend.

- `src/profile.ts` is the shared content source for the website and exported resumes;
  its interfaces live in `src/types/portfolio.ts`.
- `src/App.tsx` defines the rendered sections. Some components in
  `src/components/` are currently unused; check the imports before editing them.
- `src/hooks/` contains theme, navigation, reveal animation, and clipboard behavior.
- `src/styles.css` imports the active styles from `src/styles/`, including responsive
  and print rules. Adding a CSS file requires importing it.
- `scripts/export-resume.mjs` and `scripts/write-resume-docx.py` generate PDF/DOCX files.
- `playwright/`, `playwright_python/`, and `selenim/` contain the TypeScript,
  Python, and Java browser test suites. Keep the existing `selenim` directory name.
- `.github/workflows/` defines builds, browser tests, and GitHub Pages deployment.

Read `README.md` and the relevant test suite's README for detailed workflows.

## Setup and commands

Use Node.js 24 (`.nvmrc`) and npm with the committed `package-lock.json`.
Run commands from the repository root unless specified otherwise. On Windows,
use `npm.cmd` if PowerShell blocks the `npm.ps1` launcher.

| Purpose | Command |
| --- | --- |
| Install dependencies | `npm ci` |
| Start development server | `npm run dev` |
| Typecheck app and build into `dist/` | `npm run build` |
| Serve production build | `npm run preview` |
| Install Playwright Chromium | `npm run test:ui:install` |
| Typecheck TypeScript tests | `npm run test:ui:typecheck` |
| Run TypeScript browser tests | `npm run test:ui` |
| Run desktop browser tests only | `npm run test:ui -- --project=desktop-chromium` |
| View browser test report | `npm run test:ui:report` |
| Regenerate resumes | `npm run resume:export` |

There is no configured lint command or generic `npm test` command.

## Implementation conventions

- Follow the existing TypeScript style: two-space indentation, single quotes,
  no semicolons, functional React components, and relative imports. TypeScript
  enables strict checking and rejects unused locals and parameters.
- Keep profile content in `src/profile.ts`; preserve Russian text and UTF-8
  encoding. In PowerShell, read text with `Get-Content -Encoding UTF8`.
- Preserve semantic headings, accessible labels, keyboard navigation, the skip
  link, both themes, and `prefers-reduced-motion` support when changing the UI.
- Check layouts at 1440, 390, and 320 pixels. Print styles must show complete
  experience on a white A4 page, including when printing from the dark theme
  without scrolling first.
- Keep asset URLs compatible with Vite's relative `base: './'` and deployment
  under `/portfolio/`.

## Verification and browser suites

- For application changes, run `npm run build` and the relevant browser tests.
  For TypeScript test changes, also run `npm run test:ui:typecheck`.
  Documentation-only edits do not need browser tests.
- TypeScript Playwright starts and stops Vite on port **4177**; leave that port
  free and do not run the Java suite against it concurrently.
- Follow the existing composition of locators, actions, assertions, and the
  `openPage()` fixture. Resume tests may use browser APIs directly. Prefer
  semantic locators and retrying assertions over fixed sleeps or forced clicks.
- Expected profile data in tests is intentionally independent of the application.
  Review corresponding expectations in all three suites when changing content;
  do not import `src/profile.ts` to compute test expectations.
- Python: install `playwright_python/requirements.txt` and Chromium for the Python
  interpreter, then run `python -m pytest` (Windows local environment:
  `.\.venv\Scripts\python.exe -m pytest`). Its fixture starts Vite on port **4178**;
  `--base-url` selects an already running site.
- Java: requires JDK 21+ and Chrome (CI uses JDK 25). First start the website with
  `npm run dev -- --port 4177 --strictPort`, then run `.\mvnw.cmd test` from
  `selenim/` (`sh ./mvnw test` on Linux/macOS). Maven does not start the website.

## Resume artifacts and working tree

After changing resume content or print layout, run `npm run resume:export`, then
`npm run build` so the generated download is included in the build. Export needs
Playwright Chromium and Python 3's standard library. It uses
`.venv/Scripts/python.exe` when present, otherwise `python`; `CV_PYTHON` overrides it.

The exporter updates `public/resume-maxim-maslov.pdf` and the three root resume
files (`Маслов Максим — резюме.pdf`, `Маслов Максим — резюме ATS.pdf`, and
`Маслов Максим — резюме ATS.docx`). Regenerate these from source rather than
editing the binaries manually.

Preserve unrelated staged and unstaged changes. Generated build directories,
dependency directories, local virtual environments, `.qa/`, and test reports
are ignored; do not commit them.
