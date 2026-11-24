import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return <>
    <header><strong>SEE 2083 · SATURDAY MOCK TEST</strong></header>
    <main>
      <h1>Prepare consistently. Improve confidently.</h1>
      <p>Weekly subject-wise mock tests for SEE 2083 aspirants. One test, one subject, 30 MCQs and 45 minutes.</p>
      <section className="card">
        <h2>Student portal</h2>
        <p>Register for a mock test or sign in to see your personal dashboard and results.</p>
        <div className="grid">
          <Link className="button" href="/login">Student sign in</Link>
          <Link className="button" href="/register">Register for a test</Link>
        </div>
        {user && <p className="notice">You are signed in. <Link href="/dashboard">Open your dashboard</Link>.</p>}
      </section>
      <section className="card">
        <h2>Test format</h2>
        <div className="grid">
          <div><strong>30 MCQs</strong><p className="muted">Objective questions</p></div>
          <div><strong>45 minutes</strong><p className="muted">Timed test session</p></div>
          <div><strong>Private results</strong><p className="muted">Only you can view your result</p></div>
        </div>
      </section>
      <p className="muted">This is the initial app scaffold. The live exam schedule and question bank will be configured before launch.</p>
    </main>
    <footer>SEE 2083 Mock Test · Student practice platform</footer>
  </>;
}
