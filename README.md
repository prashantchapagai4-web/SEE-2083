# SEE 2083 Saturday Mock Test — app starter

This is the first cross-device app foundation. It is a responsive Next.js website and includes a PWA manifest, Supabase email-link sign-in, a student dashboard, and an initial database schema.

## Important status

**This is a development starter, not a production-ready exam system. Do not invite students or run real exams on it yet.** The exam-taking flow, server-side timer, protected answer key, secure grading, admin panel, abuse protection, and full RLS/admin policies still need to be completed and tested.

## Requirements

- Node.js 20+
- A Supabase project
- A Vercel account (free tier may be suitable for a small pilot; check current limits)

## Setup

1. Create a Supabase project.
2. In Supabase SQL Editor, run `supabase/schema.sql`.
3. In Supabase Authentication settings, enable email OTP/magic-link sign-in and configure the allowed redirect URLs for local development and the deployed domain.
4. Copy `.env.example` to `.env.local` and fill in the Supabase project URL and anon key.
5. Keep any service-role key server-side only. Never paste it into public code or chat.
6. Install and run:
   - `npm install`
   - `npm run dev`
7. Open `http://localhost:3000`.
8. Deploy the repository to Vercel and set the same environment variables in Vercel project settings.

## Privacy and safety

- Collect only information needed to operate the tests.
- Consider using a display name instead of full legal names.
- Do not publish a public leaderboard containing student identities or scores.
- Keep student results private.
- Have a responsible adult/administrator review privacy, account access, and data handling before inviting students.
- Never share passwords, email sign-in links, Supabase service-role keys, or other secrets in ChatGPT.

## Next build milestones

1. Add secure profile creation after first sign-in.
2. Add enrollment with a unique private access code generated on the server.
3. Add admin-only exam/question management.
4. Keep answer keys private; grade only on the server after submission.
5. Enforce the 45-minute limit on the server.
6. Add the complete responsive exam UI and individual result page.
7. Add PWA icons and test installation on Android, iOS, Windows, and macOS.
8. Run security tests before public launch.
