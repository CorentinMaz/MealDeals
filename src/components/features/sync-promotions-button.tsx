"use client";

import { useTransition } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { syncPromotionsAction } from "@/server/actions/settings";
import { Button } from "@/components/ui/button";

export function SyncPromotionsButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          try {
            const results = await syncPromotionsAction();
            const successCount = results.filter(
              (result) => result.status === "success",
            ).length;
            const totalItems = results.reduce(
              (sum, result) => sum + result.itemCount,
              0,
            );

            toast.success(
              `${successCount}/${results.length} épiceries synchronisées (${totalItems} promotions)`,
            );
          } catch (error) {
            toast.error(
              error instanceof Error
                ? error.message
                : "Erreur lors de la synchronisation",
            );
          }
        })
      }
    >
      {isPending ? (
        <Loader2 className="mr-2 size-4 animate-spin" />
      ) : (
        <RefreshCw className="mr-2 size-4" />
      )}
      Synchroniser les circulaires
    </Button>
  );
}
