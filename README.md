# MONITORING SITE // REAL-TIME SYNTHETIC UPTIME & API RELIABILITY PLATFORM

A high-performance Website and API Synthetic Monitoring Platform built with Next.js 16 (App Router), TypeScript, and Tailwind CSS. Designed in accordance with the **RawBlock Brutalist Design System** (0px border-radius, zero box-shadows, 3px/5px high-contrast solid borders, Archivo Black, Work Sans, and Space Mono typography).

---

## Key Features

- **Real-Time Synthetic Probing:** Inspect any public web service or REST endpoint on-demand. Measures DNS lookup, TCP connect, TLS handshake, Time to First Byte (TTFB), and payload transfer times.
- **SSL/TLS Certificate Intelligence:** Validates certificate validity, issuer authority, expiration countdown, protocol versions (TLSv1.3), cipher suites, and Subject Alternative Names (SANs).
- **Global Consensus Engine:** Multi-region probe simulation (Singapore, Tokyo, Frankfurt, N. Virginia, Sydney) to eliminate false-positive outage alerts.
- **90-Day SLA Timeline & Apdex Score:** Visual 90-segment daily availability grid alongside Apdex (Application Performance Index) user experience scoring.
- **Incident History & MTTR Analytics:** Tracks MTTR (Mean Time to Resolution), MTBF (Mean Time Between Failures), and total accumulated downtime with root-cause diagnostic logs.
- **Vercel-Ready Persistence:** Monitored endpoints are saved in persistent storage with automatic client-side rehydration, so added endpoints persist across page reloads and deployments.
- **Service Management:** Add new endpoints with customizable check intervals (30s, 1m, 3m, 5m), pause/resume active monitoring, trigger instant re-checks, and permanently remove decommissioned services.
- **Enterprise SSRF Protection:** Prevents server-side request forgery by disallowing probes targeting loopback (`127.0.0.1`, `localhost`) and private RFC1918 IPv4/IPv6 subnets.
- **Secure Authentication Gate:** Protected dashboard access powered by server-side environment variables with cookie-based session management.

---

## Technology Stack

- **Framework:** Next.js 16 (Turbopack, App Router, React Server Components)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS with RawBlock Brutalist Design tokens
- **Typography:** Archivo Black (Headlines), Work Sans (Body), Space Mono (Code & Metrics)
- **Deployment:** Vercel

---

## Authentication & Environment Variables

Monitoring Site enforces a **Zero-Leak Security Policy**: administrative credentials are never committed to Git. Instead, they are resolved via server-side environment variables.

### Environment Variable Names

| Variable | Description | Example |
| :--- | :--- | :--- |
| `ADMIN_USERNAME` | Username for dashboard login | `your_username` |
| `ADMIN_PASSWORD` | Password for dashboard login | `your_password` |

### Local Development Setup

1. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```
2. Open `.env.local` and define your desired credentials:
   ```env
   ADMIN_USERNAME=your_username
   ADMIN_PASSWORD=your_password
   ```
   *(Note: `.env.local` is listed in `.gitignore` and will never be tracked or pushed to GitHub).*

---

## Getting Started

### Prerequisites

- Node.js 18.18+ or 20+
- npm, yarn, or pnpm

### Installation

```bash
# 1. Clone repository
git clone https://github.com/achaii/monitoring-site.git
cd monitoring-site

# 2. Install dependencies
npm install

# 3. Create local environment file
cp .env.example .env.local

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Log in using the credentials defined in `.env.local`.

### Production Build

```bash
npm run build
npm run start
```

---

## Deploying to Vercel

Monitoring Site is optimized for seamless zero-configuration deployment on Vercel:

1. **Push your code to GitHub:**
   ```bash
   git push origin main
   ```
2. **Import Project on Vercel:**
   - Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
   - Select the `achaii/monitoring-site` repository.
3. **Configure Environment Variables in Vercel:**
   - In the project configuration screen, open the **Environment Variables** section.
   - Add the following two variables:
     - **Name:** `ADMIN_USERNAME` | **Value:** `your_username`
     - **Name:** `ADMIN_PASSWORD` | **Value:** `your_password`
4. **Deploy:**
   - Click **"Deploy"**.
   - Once deployed, visit your Vercel deployment URL and log in using the credentials you configured.

---

## Architecture & Directory Structure

```
monitoring-site/
├── app/
│   ├── api/
│   │   ├── auth/login/       # Session login verification route
│   │   ├── auth/logout/      # Session invalidation route
│   │   ├── auth/me/          # Client session checking route
│   │   └── check/            # Live synthetic socket prober endpoint
│   ├── globals.css           # Brutalist styles and CSS variables
│   ├── layout.tsx            # Global font loader & HTML shell
│   └── page.tsx              # Main dashboard view
├── components/
│   ├── auth/
│   │   └── login-view.tsx    # RawBlock brutalist login screen
│   ├── charts/
│   │   ├── apdex-gauge.tsx            # Apdex user satisfaction gauge
│   │   ├── global-probe-map.tsx       # Multi-region consensus cards
│   │   ├── latency-waterfall-chart.tsx # DNS/TCP/TLS/TTFB breakdown
│   │   ├── ssl-countdown-widget.tsx   # SSL validity & expiry countdown
│   │   ├── status-code-donut.tsx      # HTTP status distribution bar
│   │   └── uptime-history-bar.tsx     # 90-day availability timeline
│   ├── monitors/
│   │   ├── delete-monitor-modal.tsx   # Confirmation dialog for removal
│   │   ├── incidents-log.tsx          # MTTR/MTBF metrics & incident table
│   │   ├── live-check-drawer.tsx      # Real-time URL tester drawer
│   │   └── new-monitor-modal.tsx      # New target creation modal
│   └── ui/
│       ├── raw-badge.tsx              # High-contrast status badges
│       ├── raw-button.tsx             # 0px radius brutalist buttons
│       └── raw-input.tsx              # Industrial brutalist input fields
├── lib/
│   ├── auth/
│   │   └── auth-constants.ts          # Environment-driven credential getters
│   ├── data/
│   │   └── mock-monitors.ts           # Initial seed datasets & probes
│   ├── services/
│   │   └── synthetic-checker.ts       # Low-level socket latency probe & TLS inspector
│   └── storage/
│       └── monitors-storage.ts        # Client-side persistent storage engine
├── types/
│   └── monitor.ts                     # TypeScript data interfaces
├── .env.example                       # Template for environment variables
├── .gitignore                         # Strict exclusion of .env* and .agents/
└── package.json
```

---

## Security Highlights

- **No Secrets in Git:** All secrets and authentication credentials reside strictly in uncommitted environment variables.
- **SSRF Hardening:** Private subnets, loopbacks, and RFC1918 IP addresses are validated and rejected before any TCP handshake is initiated.
- **Protected Cookie Sessions:** Auth cookies use `httpOnly: true`, `sameSite: 'lax'`, and configurable max-age.
- **Agent Skill Isolation:** Local assistant skills in `.agents/` are strictly ignored by `.gitignore` to keep the public repository clean and lean.

---

## License

MIT © 2026 Monitoring Site. Architected by [achaii](https://github.com/achaii).
