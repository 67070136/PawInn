# PawInn

PawInn is a customer-facing pet hotel portal web app.

## Project status

The eight-page frontend is implemented with HTML, Tailwind CSS and Alpine.js. It runs independently using sample browser-local data. The backend services, database migrations and deployment pipelines are still scaffolds.

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

The planned backend has account, room and booking services, each with its own PostgreSQL database. The frontend's API adapter modules currently call the local demo model; they can later be replaced with service requests using `api/client.js`. Demo role checks and availability are not production security or cross-client concurrency guarantees. Real authentication, authorization, atomic booking constraints, payments and audit persistence must be enforced by the backend.

Shared HTML fragments live in `frontend/src/partials/` and are expanded during the build. Alpine components live in `frontend/src/js/pages/`; global state lives in `stores/`. All illustrations are original local SVG assets. Tailwind and Alpine are bundled locally, so the built frontend needs no CDN.

See [the local demo walkthrough](docs/local-demo.md) for the customer-to-staff review flow.
