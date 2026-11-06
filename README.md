# PawInn

PawInn is a customer-facing pet hotel portal web app.

## Project status

The eight-page frontend is implemented with HTML, Tailwind CSS and Alpine.js. It runs independently using sample browser-local data. Compose can start one PostgreSQL instance containing one shared application database, `pawinn`. Backend services, table/seed SQL and deployment pipelines remain TODO scaffolds. The full application is not integrated yet.

## Team of four: start here

Read [the team work plan](docs/team.md) for assignments, implementation order and the pull request workflow. Use [the API agreement](docs/api.md) before connecting services.

| Person | Main work |
| --- | --- |
| You / Member 1 | Frontend integration, customer/staff journeys, README and demo |
| Member 2 | Account service: login, users and pets |
| Member 3 | Room service, Docker Compose, GitHub Actions and Jenkins |
| Member 4 | Booking service: availability, reservations, mock payment and cancellations |

Replace these labels with your names. Everyone writes tests for their own work and helps with final integration.

## Simple folder structure

```text
PawInn/
├── frontend/                # Existing HTML, Tailwind and Alpine website
├── services/
│   ├── account/             # Member 2
│   ├── room/                # Member 3
│   └── booking/             # Member 4
├── database/                # Shared pawinn database; SQL grouped by table owner
├── infra/                   # Planned Nginx API proxy
├── .github/workflows/       # Member 3 adds one CI workflow here
├── docs/                    # Team plan, API agreement, architecture and diagrams
├── tests/                   # Whole-project integration checklist
├── compose.yaml             # Runnable shared PostgreSQL; API containers come later
├── Jenkinsfile              # TODO: local deployment pipeline
└── .env.example             # Safe sample configuration
```

Each backend service starts flat: `server.js`, `routes.js`, `db.js`, `package.json`, `Dockerfile` and `tests/`. Its SQL lives in `database/<service>/schema.sql` and `seed.sql`. Each has a README explaining its tasks. Add files only when working code needs them; generate lockfiles with npm when dependencies are installed.

## Start the shared PostgreSQL instance

From the root in PowerShell, copy the template only if you do not already have `.env`, set your local password, then start PostgreSQL:

```powershell
Copy-Item .env.example .env
docker compose up -d postgres
docker compose ps
```

All three Express services connect to the same `pawinn` database using `POSTGRES_DB` from `.env`. Its seven planned tables can use normal foreign keys and SQL joins. SQL files are still starter notes, so no application tables are created yet. Each teammate runs this setup locally. See [database setup and connections](database/README.md) for ports, credentials, SQL ownership and applying later changes.

## Product direction

Help pet owners explore hotel services, plan their pets' stays, and manage bookings through a customer portal.

## Run the frontend

Use Node.js 24 LTS and npm:

```sh
cd frontend
npm ci
npm run dev
```

Open http://127.0.0.1:4173. The dev command builds once and starts the preview server; after source edits, run `npm run build` and refresh the browser. `npm start` serves an existing build. The built site is in `frontend/dist/` and must be served from a web root, not opened as a local HTML file.

```sh
npm run build
npm test
```

The tests cover booking overlap, room capacity, pet ownership, checkout retries/idempotency, cancellation review and built navigation/assets. Build before running tests.

## Pages

| Page | Path |
| --- | --- |
| Home | `/` |
| Sign in | `/pages/login.html` |
| Register | `/pages/register.html` |
| Pet profiles | `/pages/pets.html` |
| Rooms and availability | `/pages/rooms.html` |
| Bookings, history and cancellation requests | `/pages/bookings.html` |
| Mock payment checkout | `/pages/checkout.html?booking=PW-…` |
| Staff dashboard and cancellation review | `/pages/staff-dashboard.html` |

Use **Customer demo** or **Staff demo** on the sign-in page. Registration creates another local demo customer. No passwords are stored or verified, no payment details are collected, and no real reservations are made. Use invented details only. Data is stored under `pawinn.demo.v1` and the selected account under `pawinn.session.v1` in localStorage. Clear those keys to reset the demo. Data persists per browser and origin, not across devices.

## Frontend container

From the repository root:

```sh
docker build -t pawinn-frontend ./frontend
docker run --rm -p 8080:80 pawinn-frontend
```

Open http://localhost:8080. The image builds the static assets and serves them with Nginx.

## Architecture

The backend plan has three separately running services (account, room and booking) sharing one PostgreSQL container and one `pawinn` database. Each service primarily writes its own tables; shared reads/joins and real foreign keys keep this college project simple. Database changes must be coordinated because the services share its structure. The frontend's API adapter modules currently call the local demo model; replace them with service requests using `api/client.js`, and update the stores/page code that still reads demo data. The backend will enforce login, ownership, roles and booking rules; payment and refunds stay simulated for the course.

Shared HTML fragments live in `frontend/src/partials/` and are expanded during the build. Alpine components live in `frontend/src/js/pages/`; global state lives in `stores/`. All illustrations are original local SVG assets. Tailwind and Alpine are bundled locally, so the built frontend needs no CDN.

See [the architecture notes](docs/architecture.md), [local demo walkthrough](docs/local-demo.md) and [integration checklist](tests/README.md).
