"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updatePostalCodeAction } from "@/server/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PostalCodeForm({ postalCode }: { postalCode: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const value = String(formData.get("postalCode") ?? "");

        startTransition(async () => {
          try {
            await updatePostalCodeAction(value);
            toast.success("Code postal mis à jour");
          } catch (error) {
            toast.error(
              error instanceof Error ? error.message : "Erreur de mise à jour",
            );
          }
        });
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="postalCode">Code postal</Label>
        <Input
          id="postalCode"
          name="postalCode"
          defaultValue={postalCode}
          placeholder="G1V4P3"
          className="max-w-xs uppercase"
        />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  );
}
