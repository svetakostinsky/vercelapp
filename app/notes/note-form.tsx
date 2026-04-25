"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NoteForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.from("notes").insert({ title });
    if (error) {
      setError(error.message);
      return;
    }
    setTitle("");
    startTransition(() => router.refresh());
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2 items-start">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Write a note…"
        className="flex-1"
        required
      />
      <Button type="submit" disabled={pending || !title.trim()}>
        {pending ? "Adding…" : "Add"}
      </Button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </form>
  );
}
