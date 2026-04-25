import { Suspense } from "react";
import Link from "next/link";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { hasEnvVars } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

async function RecentNotes() {
  const supabase = await createClient();
  const { data: notes } = await supabase
    .from("notes")
    .select("id, title, created_at")
    .order("id", { ascending: false })
    .limit(5);

  return (
    <ul className="flex flex-col gap-2">
      {notes?.length ? (
        notes.map((n) => (
          <li
            key={n.id}
            className="border rounded-md p-3 flex justify-between items-center"
          >
            <span>{n.title}</span>
            <span className="text-xs text-muted-foreground">#{n.id}</span>
          </li>
        ))
      ) : (
        <li className="text-sm text-muted-foreground">No notes yet.</li>
      )}
    </ul>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <Link href={"/"} className="font-semibold">
              my-app
            </Link>
            {!hasEnvVars ? (
              <EnvVarWarning />
            ) : (
              <Suspense>
                <AuthButton />
              </Suspense>
            )}
          </div>
        </nav>

        <div className="flex-1 w-full max-w-3xl flex flex-col gap-12 p-6 py-16">
          <section className="flex flex-col gap-3">
            <h1 className="text-4xl font-bold tracking-tight">Notes</h1>
            <p className="text-muted-foreground">
              A tiny multi-user notes app. Sign in to add your own.
            </p>
            <div className="flex gap-3 mt-2">
              <Button asChild>
                <Link href="/notes">Open notes app</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/protected">View account</Link>
              </Button>
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold">Recent notes</h2>
            <Suspense
              fallback={
                <p className="text-sm text-muted-foreground">Loading…</p>
              }
            >
              <RecentNotes />
            </Suspense>
          </section>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-8">
          <p>Built on Next.js + Supabase</p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
