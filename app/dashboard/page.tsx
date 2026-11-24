import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export default async function Dashboard() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("display_name, student_code").eq("id", user.id).maybeSingle();
  const { data: enrollments } = await supabase.from("enrollments").select("id, status, access_code, exams(title, subject, starts_at)").eq("student_id", user.id).order("created_at", { ascending: false });
  return <main><Link href="/">← Home</Link><h1>Student dashboard</h1>
    <section className="card"><h2>Welcome, {profile?.display_name || "student"}</h2>
      <p className="muted">Student ID: {profile?.student_code || "Being assigned"}</p>
      <p>Your private test registrations and published results will appear here.</p>
    </section>
    <section className="card"><h2>Your registrations</h2>
      {!enrollments?.length ? <p className="muted">No registrations yet. Published mock tests will appear here.</p> :
        enrollments.map((item:any)=><div className="notice" key={item.id}>
          <strong>{item.exams?.title || "Mock test"}</strong><br/>{item.exams?.subject || ""}<br/>
          Status: {item.status}<br/>Access code: <strong>{item.access_code || "Not issued"}</strong>
        </div>)}
    </section>
    <form action="/auth/signout" method="post"><button>Sign out</button></form>
  </main>;
}
