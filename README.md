# MediGuide

**24b0003** — WnCC (IIT Bombay) Web Development Learners' Space 2026, Week 4 capstone: *build a website for a hospital.*

A full-stack hospital website where a first-time visitor never has to guess where to go. You describe how you're feeling in plain language, MediGuide points you to the right department and an available doctor, and you book a real slot — no walking in blind, no calling around, no double-booked appointments.

---

## Why this, specifically

The brief was fixed (a hospital website), but the angle wasn't. Most "hospital site" submissions end up as a static list of departments and a contact form. The actual friction in a real hospital visit isn't "does a departments page exist" — it's **not knowing which department to go to in the first place**, and then **not knowing if a doctor is actually free** when you show up. Those are the two problems this project solves, deliberately, instead of spreading effort across a long feature list.

## The two features this project actually stands on

**1. A deterministic symptom → department guide — not a chatbot.**
Type "chest pain" or "tooth pain" and get pointed to the matching department and its doctors, via a curated keyword lookup (`24b0003/src/data/symptomMap.js`), not a generative model. This was a deliberate choice, not a shortcut: for something safety-adjacent like routing a sick person to the right department, a predictable rule engine beats a fluent-but-occasionally-wrong chatbot, and it costs nothing to run. The UI says exactly this to the user — it's labelled a simple guide, not a diagnosis, with a link to the Emergency page for anything urgent.

**2. Real booking integrity, enforced at the database level.**
Two patients can never end up double-booked with the same doctor at the same time — not because the frontend disables an option, but because of a **conditional unique constraint** on the `Appointment` model:

```python
models.UniqueConstraint(
    fields=['doctor', 'date', 'time_slot'],
    condition=models.Q(status='scheduled'),
    name='unique_active_doctor_slot',
)
```

A cancelled appointment frees its slot (the condition only applies to `status='scheduled'`); two *active* bookings for the same doctor/date/slot can never coexist, even under concurrent requests, because the database itself rejects the second write — not just an application-level check that a race condition could slip past. The API also does a friendly pre-check first (so a normal user sees "this slot is no longer available" instead of a raw error), but the DB constraint is the actual guarantee.

Everything else on the site — the hospital map, the emergency page, doctor profiles — is intentionally "cheap" scope: static content and straightforward CRUD that rounds out a real hospital site without diluting time spent on the two features above.

---

## Features

- **Symptom Guide** — type a symptom or pick from a common list, get matched to a department + doctors
- **Departments & Doctors** — browse by department, view doctor bios/specialty/experience/rating
- **Book Appointment** — pick a doctor + date, see only genuinely available slots, book with an optional note for the doctor
- **My Appointments** — view and cancel your own bookings (ownership-checked — you cannot see or touch anyone else's)
- **Hospital Map** — an inline SVG schematic floor plan with clickable department zones
- **Emergency** — click-to-call emergency number, nearest emergency entrance, first-aid basics — informational only, not a dispatch system
- **Accounts** — JWT-based register/login, tokens auto-refresh on expiry

## What staff/admin management looks like

There's deliberately **no separate custom staff dashboard.** Hospital staff manage doctors, departments, and appointments through Django's built-in admin panel at `/admin/`. Building a second custom frontend just to re-implement CRUD that Django already gives for free wasn't worth the time — the patient-facing app is where the actual design effort went.

---

## Architecture

```
Browser
  ├── Netlify   — React (Vite) frontend, static build, global CDN
  ├── Render    — Django + DRF backend, free tier (spins down after 15 min idle)
  └── Supabase  — PostgreSQL database, free tier
```

**Backend:** Django + Django REST Framework, JWT auth (`djangorestframework-simplejwt`), SQLite for local dev / PostgreSQL (Supabase) in production via a single `DATABASE_URL` environment variable — no local Postgres install needed to develop.

**Frontend:** React (Vite, plain JavaScript), React Router, Tailwind CSS, Context + hooks for state (no Redux) — kept deliberately simple since this is a project I need to be able to explain end-to-end, not just ship.

### API endpoints

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/api/auth/register/` | — | create account |
| POST | `/api/auth/login/` | — | returns access + refresh JWT |
| POST | `/api/auth/refresh/` | — | refresh access token |
| GET | `/api/departments/` | — | list all |
| GET | `/api/departments/<slug>/` | — | detail |
| GET | `/api/doctors/?department=<slug>` | — | list, optional filter |
| GET | `/api/doctors/<id>/` | — | detail |
| GET | `/api/doctors/<id>/available-slots/?date=YYYY-MM-DD` | — | free slots for that doctor/date |
| GET | `/api/appointments/` | ✓ | your own appointments only |
| POST | `/api/appointments/` | ✓ | book (owner forced server-side) |
| GET/PATCH/DELETE | `/api/appointments/<id>/` | ✓ + ownership | view/cancel/delete your own |

---

## Local setup

**Backend**
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_hospital_data
python manage.py createsuperuser
python manage.py runserver
```

**Frontend**
```bash
cd 24b0003
npm install
npm run dev
```

Copy `.env.example` → `.env` in both folders and fill in local values (defaults already point at `127.0.0.1:8000` / `localhost:5173`).

## Deployment

Deployed per the course's own Render + Netlify + Supabase guide (`Week-4/01-Deployment/free_deployment_guide_Windows.md` in the course repo): Supabase for PostgreSQL, Render for the Django backend, Netlify for the built React frontend. `build.sh`, `Procfile`, `runtime.txt`, and `_redirects` are already in place for this.

**Live site:** _add the deployed Netlify URL here once live._

---

## Known limitations

Being upfront about scope, since this was built with a fixed set of priorities rather than trying to cover everything:

| Limitation | What it would take to fix |
|---|---|
| Doctor availability is the same every day (no day-of-week schedules) | Add a `DoctorAvailability` model keyed by weekday |
| Doctor ratings are seeded/static, not real patient reviews | Add a `Review` model + moderation before allowing patient-submitted ratings |
| No email/SMS confirmation on booking | Add a notification service (e.g. SendGrid/Twilio) — deliberately out of scope for a free-tier student deployment |
| Symptom guide is a fixed keyword list, not natural-language understanding | Could plug in an LLM, but was a deliberate choice not to (see the "why" above) |
| No file uploads (e.g. medical documents, prescriptions) | Would need cloud storage (S3/Cloudinary) — not needed for the current feature set |
| Render's free tier cold-starts (~30-50s) after 15 minutes idle | Upgrade to a paid tier, or ping it with a free uptime monitor |

---

## Notable issue found & fixed during development

DRF's `ModelSerializer` auto-detects a model's conditional `UniqueConstraint` and attaches its own generic `UniqueTogetherValidator` — which fired first with a vague "must make a unique set" error, masking the intended friendly "This slot is no longer available" message. Fixed by disabling the auto-validator (`validators = []` in the serializer) and relying on an explicit `validate()` check, with the view's `perform_create` still catching the underlying `IntegrityError` as defense-in-depth against genuine concurrent-request races.
