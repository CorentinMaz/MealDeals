"use client";

import { useTransition } from "react";
import { toggleStoreAction } from "@/server/actions/settings";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface StoreToggleProps {
  storeId: string;
  name: string;
  enabled: boolean;
  note?: string;
}

export function StoreToggle({
  storeId,
  name,
  enabled,
  note,
}: StoreToggleProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div>
        <Label htmlFor={storeId} className="text-base font-medium">
          {name}
        </Label>
        {note ? (
          <p className="mt-1 text-sm text-muted-foreground">{note}</p>
        ) : null}
      </div>
      <Switch
        id={storeId}
        checked={enabled}
        disabled={isPending}
        onCheckedChange={(checked) =>
          startTransition(async () => {
            await toggleStoreAction(storeId, checked);
          })
        }
      />
    </div>
  );
}
