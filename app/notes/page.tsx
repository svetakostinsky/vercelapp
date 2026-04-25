import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { NoteForm } from "./note-form";
import { DeleteButton } from "./delete-button";

async function NotesContent() {
  const supabase = await createClient();
  const [{ data: notes }, { data: claims }] = await Promise.all([
    supabase
      .from("notes")
      .select("id, title, user_id, created_at")
      .order("id", { ascending: false }),
    supabase.auth.getClaims(),
  ]);

  const userId = claims?.claims?.sub ?? null;

  return (
    <>
      <p className="text-sm text-muted-foreground">
        {userId
          ? "Signed in — you can create and delete your own notes."
          : "Not signed in — read-only view."}
      </p>

      {userId && <NoteForm />}

      <ul className="flex flex-col gap-3">
        {notes?.map((note) => (
          <li
            key={note.id}
            className="border rounded-md p-4 flex justify-between items-start gap-4"
          >
            <div className="flex-1">
              <p className="font-medium">{note.title}</p>
              <p className="text-xs text-muted-foreground mt-1">
                #{note.id} · {new Date(note.created_at).toLocaleString()}
                {note.user_id && ` · author: ${note.user_id.slice(0, 8)}…`}
              </p>
            </div>
            {userId && note.user_id === userId && (
              <DeleteButton id={note.id} />
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

export default function NotesPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-8 max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Notes</h1>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
        <NotesContent />
      </Suspense>
    </div>
  );
}
