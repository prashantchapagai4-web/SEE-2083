"use client";
import { useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

const subjects = ["Science", "Compulsory Mathematics", "Optional Mathematics", "English", "Nepali", "Social Studies", "Computer Science"];

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Science");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMessage("");
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback`, data: { display_name: name.trim() } }
    });
    setBusy(false);
    if (error) setMessage(error.message);
    else setMessage("Check your email for the secure sign-in link. After signing in, return to your dashboard to complete enrollment.");
  }

  return <main>
    <Link href="/">← Home</Link><h1>Register for a mock test</h1>
    <div className="card">
      <p className="notice">Use an email address you can access. We use it for secure sign-in and to protect your private results. Do not share your sign-in link or access code.</p>
      <form onSubmit={submit}>
        <label>Display name</label><input required maxLength={50} value={name} onChange={e=>setName(e.target.value)} placeholder="Your name or chosen display name" />
        <label>Email address</label><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
        <label>First test subject</label>
        <select value={subject} onChange={e=>setSubject(e.target.value)}>{subjects.map(s=><option key={s}>{s}</option>)}</select>
        <button disabled={busy}>{busy ? "Sending secure link…" : "Continue securely"}</button>
      </form>
      {message && <p className="notice" role="status">{message}</p>}
      <p className="muted">Subject selected: {subject}. Enrollment will be finalized in the student dashboard once the test schedule is published.</p>
    </div>
  </main>;
}
