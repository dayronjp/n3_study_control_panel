# ⛩️ KotoJun (コト順)

Interactive dashboard for JLPT N3 weekly study tracking and progress monitoring.

![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?style=flat-square&logo=next.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-teal?style=flat-square&logo=postgresql)
![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

---

## ✨ Features

### Core
- ✅ Fixed weekly schedule (Monday → Saturday)
- ✅ Auto-saving task checkboxes with optimistic UI
- ✅ Daily and weekly progress tracking
- ✅ Streak counter for completed days
- ✅ Highlighted current day card
- ✅ Undo task completion (6-second window)
- ✅ Dark mode with subtle Japanese-inspired gradient

### Internationalization
- 🌐 Bilingual UI (Japanese 日本語 / Portuguese PT)
- 🔄 Instant language switching
- 📝 Fully translated task names and interface

### Security & Session
- 🔐 Password-based authentication (scrypt + iron-session)
- ⏱️ 2-hour session timeout with warning
- 🚪 Auto-logout after inactivity

### API
- 🔌 RESTful API endpoints (`/api/today`, `/api/week`)
- 📊 JSON responses with full schedule data
- 🔓 Public read-only access (authentication coming soon)

### Performance
- ⚡ Server Components for fast initial load
- 🎯 Optimistic UI updates (instant feedback)
- 🔄 Smart caching with Neon cold-start retry logic
- 📦 Minimal bundle size with tree-shaking

---

## 🏗️ Project Structure

```
kotojun/
├── app/
│   ├── api/
│   │   ├── today/route.ts       # GET /api/today
│   │   └── week/route.ts        # GET /api/week
│   ├── login/
│   │   └── page.tsx             # Login page
│   ├── globals.css              # Global styles + Tailwind
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Dashboard (Server Component)
│   ├── loading.tsx              # Loading skeleton
│   └── error.tsx                # Error boundary
├── components/
│   ├── ui/                      # shadcn/ui primitives
│   │   ├── card.tsx
│   │   ├── progress.tsx
│   │   ├── badge.tsx
│   │   └── checkbox.tsx
│   ├── Dashboard.tsx            # Main client component with state
│   ├── DayCard.tsx              # Individual day card
│   ├── TaskItem.tsx             # Task checkbox item
│   ├── WeekHeader.tsx           # Stats header
│   ├── SessionGuard.tsx         # 2hr timeout modal
│   ├── LangContext.tsx          # i18n context provider
│   └── LangToggle.tsx           # Language switch button
├── lib/
│   ├── db.ts                    # Neon connection with retry
│   ├── actions.ts               # Server Actions
│   ├── auth.ts                  # Login/logout handlers
│   ├── session.ts               # iron-session config
│   ├── i18n.ts                  # Translation strings
│   ├── study-plan.ts            # Fixed weekly plan
│   ├── types.ts                 # TypeScript types
│   └── utils.ts                 # Utilities
├── schema.sql                   # PostgreSQL schema
├── .env.example
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18.17+ or 20.0+
- npm or yarn
- PostgreSQL database (we recommend [Neon](https://neon.tech) free tier)

### 1. Clone and Install

```bash
git clone <your-repo>
cd kotojun
npm install
```

### 2. Database Setup (Neon)

1. Create a free account at [neon.tech](https://neon.tech)
2. Create a new project (e.g., `kotojun-db`)
3. Copy your **Connection String**:
   ```
   postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. Open the **SQL Editor** in Neon and run the entire `schema.sql` file
5. Create your user with a hashed password:
   ```sql
   -- Generate password hash using Node.js
   node -e "const crypto = require('crypto'); const salt = crypto.randomBytes(16).toString('hex'); const hash = crypto.scryptSync('YOUR_PASSWORD', salt, 64).toString('hex'); console.log(salt + ':' + hash);"
   
   -- Insert into database (replace the hash)
   INSERT INTO users (name, password_hash) 
   VALUES ('your.username', 'GENERATED_HASH_HERE');
   ```

### 3. Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
SESSION_SECRET="your-32-character-secret-minimum-length"
```

> **Important:** `SESSION_SECRET` must be at least 32 characters long.

### 4. Add Unique Constraint (Important!)

Run this in Neon SQL Editor to prevent duplicate weeks:

```sql
ALTER TABLE study_weeks 
ADD CONSTRAINT study_weeks_user_week_unique 
UNIQUE (user_id, week_start);
```

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

On first visit:
- Week is auto-created for current Monday
- All tasks are auto-populated from the fixed plan
- Login with credentials you created in step 2

---

## 🌐 Deploy to Vercel

### Option 1 — GitHub Integration (Recommended)

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your GitHub repository
4. Add environment variables:
   - `DATABASE_URL` → Your Neon connection string
   - `SESSION_SECRET` → 32+ character secret
5. Click **Deploy**

### Option 2 — Vercel CLI

```bash
npm i -g vercel
vercel
```

Follow prompts and add environment variables when asked.

---

## 📅 Weekly Study Plan

| Day       | Focus                    | Time   | Tasks                                      |
|-----------|--------------------------|--------|--------------------------------------------|
| Monday    | Understanding Grammar    | 1h30   | Kyoto, JapaLab, Anki, Kanji, Review        |
| Tuesday   | Practice & Production    | 1h30   | JapaLab, Active Writing, Anki, Kanji       |
| Wednesday | Reading                  | 1h30   | Long Reading, Text Analysis, Anki, Kanji   |
| Thursday  | Listening                | 1h30   | N3 Listening, Review, Shadowing, Re-listen |
| Friday    | Test Day                 | 1h30   | Mini Mock Test, Correction, Focused Review |
| Saturday  | Intensive Training       | 2h30   | Review, Minna Intermediate, Reading, Anki  |

**Weekly Total:** 10 hours

---

## 🔌 API Documentation

KotoJun exposes two public REST endpoints for external integrations.

### `GET /api/today`

Returns the current day's schedule (Monday-Saturday only).

**Example Request:**
```bash
curl https://your-app.vercel.app/api/today
```

**Example Response:**
```json
{
  "day": "Monday",
  "focus": "Understanding Grammar",
  "date": "2026-02-16",
  "weekStart": "2026-02-16",
  "stats": {
    "totalMinutes": 90,
    "completedMinutes": 40,
    "progress": 44,
    "completedTasks": 2,
    "totalTasks": 5,
    "isCompleted": false
  },
  "tasks": [
    {
      "id": "123",
      "title": "Kyoto",
      "minutes": 20,
      "completed": true
    },
    ...
  ]
}
```

**Sunday Response:**
```json
{
  "error": "No schedule for Sundays",
  "message": "O cronograma semanal vai de segunda a sábado"
}
```

---

### `GET /api/week`

Returns the complete week schedule (Monday-Saturday).

**Example Request:**
```bash
curl https://your-app.vercel.app/api/week
```

**Example Response:**
```json
{
  "weekStart": "2026-02-16",
  "weekEnd": "2026-02-21",
  "stats": {
    "totalMinutes": 630,
    "completedMinutes": 180,
    "weekProgress": 29,
    "completedDays": 1,
    "totalDays": 6,
    "streak": 1
  },
  "schedule": [
    {
      "day": "Monday",
      "focus": "Understanding Grammar",
      "stats": {
        "totalMinutes": 90,
        "completedMinutes": 90,
        "progress": 100,
        "completedTasks": 5,
        "totalTasks": 5,
        "isCompleted": true
      },
      "tasks": [...]
    },
    ...
  ]
}
```

---

### API Usage Examples

#### JavaScript/TypeScript (Next.js)
```typescript
// In another Next.js app
export async function getTodaySchedule() {
  const res = await fetch('https://your-app.vercel.app/api/today');
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

// Usage in Server Component
export default async function Page() {
  const schedule = await getTodaySchedule();
  return (
    <div>
      <h1>Today: {schedule.day}</h1>
      <p>Progress: {schedule.stats.progress}%</p>
      <ul>
        {schedule.tasks.map(task => (
          <li key={task.id}>
            {task.completed ? '✓' : '○'} {task.title} ({task.minutes}min)
          </li>
        ))}
      </ul>
    </div>
  );
}
```

#### Python
```python
import requests

response = requests.get('https://your-app.vercel.app/api/today')
data = response.json()

if response.status_code == 200:
    print(f"Today: {data['day']} - {data['focus']}")
    print(f"Progress: {data['stats']['progress']}%")
    for task in data['tasks']:
        status = '✓' if task['completed'] else '○'
        print(f"{status} {task['title']} ({task['minutes']}min)")
```

#### cURL
```bash
# Get today's schedule
curl https://your-app.vercel.app/api/today | jq

# Get week schedule
curl https://your-app.vercel.app/api/week | jq

# Extract only tasks
curl https://your-app.vercel.app/api/today | jq '.tasks'

# Get weekly progress percentage
curl https://your-app.vercel.app/api/week | jq '.stats.weekProgress'
```

---

### API Status Codes

| Code | Meaning                                      |
|------|----------------------------------------------|
| 200  | Success                                      |
| 404  | Day/week not found or it's Sunday            |
| 500  | Internal server error                        |

---

### API Roadmap

- [ ] Authentication via API key header
- [ ] POST endpoint to mark tasks as complete
- [ ] Webhook support for progress notifications
- [ ] Rate limiting
- [ ] GraphQL endpoint

---

## 🛠️ Tech Stack

| Technology    | Purpose                          |
|---------------|----------------------------------|
| Next.js 16    | Full-stack React framework       |
| React 18      | UI library                       |
| TypeScript    | Type safety                      |
| Tailwind CSS  | Utility-first styling            |
| shadcn/ui     | Headless UI components           |
| Neon          | Serverless PostgreSQL            |
| iron-session  | Encrypted session cookies        |
| Vercel        | Hosting & deployment             |

---

## 🔒 Security Features

- **Password Hashing:** scrypt with salt (OWASP recommended)
- **Timing Attack Protection:** `timingSafeEqual` for hash comparison
- **Session Encryption:** AES-256-GCM via iron-session
- **Session Timeout:** 2 hours with 5-minute warning
- **HttpOnly Cookies:** Prevent XSS attacks
- **Secure Flag:** Enabled in production (HTTPS only)

---

## 🌍 Internationalization

KotoJun supports two languages with instant switching:

- **Japanese (日本語)** — Default
- **Portuguese (PT)**

All UI elements, day names, task titles, and system messages are fully translated.

**How it works:**
- Client-side i18n using React Context
- No server round-trip on language switch
- Translations stored in `lib/i18n.ts`
- Preference is session-based (resets on page reload)

---

## 📊 Database Schema

### Tables

#### `users`
| Column         | Type      | Description                |
|----------------|-----------|----------------------------|
| id             | SERIAL    | Primary key                |
| name           | TEXT      | Username (unique)          |
| password_hash  | TEXT      | scrypt hash (salt:hash)    |
| created_at     | TIMESTAMP | Account creation date      |

#### `study_weeks`
| Column      | Type      | Description                    |
|-------------|-----------|--------------------------------|
| id          | SERIAL    | Primary key                    |
| user_id     | INTEGER   | Foreign key → users(id)        |
| week_start  | DATE      | Monday of the week             |
| streak      | INTEGER   | Consecutive completed days     |
| created_at  | TIMESTAMP | Week creation timestamp        |

**Unique constraint:** `(user_id, week_start)` prevents duplicate weeks.

#### `study_days`
| Column        | Type      | Description                       |
|---------------|-----------|-----------------------------------|
| id            | SERIAL    | Primary key                       |
| week_id       | INTEGER   | Foreign key → study_weeks(id)     |
| day_name      | TEXT      | Segunda, Terça, Quarta, etc.      |
| focus         | TEXT      | Day's main focus area             |
| total_minutes | INTEGER   | Planned minutes for the day       |
| completed     | BOOLEAN   | All tasks completed?              |

#### `tasks`
| Column        | Type      | Description                       |
|---------------|-----------|-----------------------------------|
| id            | SERIAL    | Primary key                       |
| study_day_id  | INTEGER   | Foreign key → study_days(id)      |
| title         | TEXT      | Task name (e.g., "Kyoto")         |
| minutes       | INTEGER   | Planned duration                  |
| completed     | BOOLEAN   | Task completion status            |

---

## 🔄 How It Works

1. **First Access:**
   - User is redirected to `/login`
   - After login, a new week is auto-created if it doesn't exist
   - All 6 days (Monday-Saturday) are inserted with their tasks

2. **Checking Tasks:**
   - Click checkbox → optimistic UI update (instant)
   - Server Action saves to database in background
   - Progress bars recalculate immediately
   - "Undo" toast appears for 6 seconds

3. **Day Completion:**
   - Calculated when all tasks are marked as done
   - Triggers visual changes (green badge, check icon)
   - Updates streak counter

4. **Weekly Rollover:**
   - Every Monday, a new week is auto-created on first access
   - Previous week's data is preserved
   - Streak carries over if previous week had completed days

5. **Session Management:**
   - User activity is tracked via localStorage
   - After 115 minutes of inactivity → warning modal
   - After 120 minutes → forced logout
   - Cookie expires at the same time

---

## 📦 Environment Variables

| Variable         | Description                              | Required |
|------------------|------------------------------------------|----------|
| `DATABASE_URL`   | Neon PostgreSQL connection string        | ✅ Yes   |
| `SESSION_SECRET` | Encryption key for sessions (32+ chars)  | ✅ Yes   |

---

## 🐛 Troubleshooting

### "Error connecting to database: fetch failed"
- **Cause:** Neon database is hibernating (cold start)
- **Solution:** Built-in retry logic handles this automatically (3 attempts with backoff)

### "cookieHandler.get is not a function"
- **Cause:** Next.js 15+ requires `await cookies()`
- **Solution:** Update to `iron-session@8.0.0+` and use the updated `session.ts` from this repo

### "Parsing CSS source code failed"
- **Cause:** `@import` must be at the top of CSS files
- **Solution:** Move Google Fonts `@import` to line 1 of `globals.css`

### Tasks not saving / stale data
- **Cause:** Next.js dev cache
- **Solution:** `rm -rf .next && npm run dev`

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

---

## 🙏 Acknowledgments

- **shadcn/ui** for the beautiful component primitives
- **Neon** for generous free tier and excellent DX
- **Vercel** for seamless deployment
- **JLPT Resources** that inspired the study plan structure

---

**Built with ❤️ for Japanese learners**

コト順 — Order your learning, one task at a time.