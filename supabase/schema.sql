-- Run this in Supabase SQL Editor. Review with an adult/administrator before collecting student data.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 50),
  student_code text unique not null default ('S83-' || upper(substr(encode(gen_random_bytes(6),'hex'),1,8))),
  role text not null default 'student' check (role in ('student','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.exams (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subject text not null,
  starts_at timestamptz not null,
  registration_closes_at timestamptz not null,
  duration_minutes integer not null default 45 check (duration_minutes = 45),
  question_count integer not null default 30 check (question_count = 30),
  status text not null default 'draft' check (status in ('draft','published','closed','completed')),
  created_at timestamptz not null default now()
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references public.exams(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'registered' check (status in ('registered','started','submitted','graded')),
  access_code text unique not null default upper(encode(gen_random_bytes(5),'hex')),
  score integer,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  unique(exam_id, student_id)
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references public.exams(id) on delete cascade,
  question_number integer not null check (question_number between 1 and 30),
  prompt text not null,
  options jsonb not null check (jsonb_typeof(options) = 'array' and jsonb_array_length(options) = 4),
  correct_option integer not null check (correct_option between 0 and 3),
  explanation text,
  unique(exam_id, question_number)
);

create table if not exists public.answers (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  selected_option integer check (selected_option between 0 and 3),
  unique(enrollment_id, question_id)
);

alter table public.profiles enable row level security;
alter table public.exams enable row level security;
alter table public.enrollments enable row level security;
alter table public.questions enable row level security;
alter table public.answers enable row level security;

create policy "students read own profile" on public.profiles for select to authenticated using (id = auth.uid());
create policy "students create own profile" on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "students update own profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "students see published exams" on public.exams for select to authenticated using (status = 'published');
create policy "students see own enrollments" on public.enrollments for select to authenticated using (student_id = auth.uid());
create policy "students create own enrollment" on public.enrollments for insert to authenticated with check (student_id = auth.uid());
create policy "students see questions for published exams" on public.questions for select to authenticated using (
  exists (select 1 from public.exams e where e.id = exam_id and e.status = 'published')
);
create policy "students see own answers" on public.answers for select to authenticated using (
  exists (select 1 from public.enrollments en where en.id = enrollment_id and en.student_id = auth.uid())
);
create policy "students write own answers" on public.answers for insert to authenticated with check (
  exists (select 1 from public.enrollments en where en.id = enrollment_id and en.student_id = auth.uid())
);
create policy "students update own answers" on public.answers for update to authenticated using (
  exists (select 1 from public.enrollments en where en.id = enrollment_id and en.student_id = auth.uid())
) with check (
  exists (select 1 from public.enrollments en where en.id = enrollment_id and en.student_id = auth.uid())
);

-- IMPORTANT:
-- Before a real exam, do NOT expose correct_option through the student-facing questions query.
-- Move answer keys to a private table and grade with a server-side function after submission.
-- Add administrator-only policies and server-side enrollment/timer/grading functions before launch.
-- Never put the service-role key in browser code or commit it to Git.
