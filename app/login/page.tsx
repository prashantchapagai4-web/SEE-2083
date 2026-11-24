"use client";
import { useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function Login() {
  const [email,setEmail] = useState(""); const [message,setMessage] = useState(""); const [busy,setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMessage("");
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${location.origin}/auth/callback` } });
    setBusy(false); setMessage(error ? error.message : "A secure sign-in link has been sent if the address is eligible.");
  }
  return <main><Link href="/">← Home</Link><h1>Student sign in</h1><div className="card">
    <form onSubmit={submit}><label>Email address</label><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
    <button disabled={busy}>{busy ? "Sending…" : "Send sign-in link"}</button></form>
    {message && <p className="notice">{message}</p>}
  </div></main>;
}
