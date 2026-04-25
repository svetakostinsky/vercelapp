"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function DeleteButton({ id }: { id: number }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  async function onClick() {
    const supabase = createClient();
    await supabase.from("notes").delete().eq("id", id);
    startTransition(() => router.refresh());
  }

  return (
    <Button variant="outline" size="sm" onClick={onClick} disabled={pending}>
      {pending ? "…" : "Delete"}
    </Button>
  );
}
