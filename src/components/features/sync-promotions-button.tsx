"use client";

import { useTransition } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useTranslate } from "@/components/providers/locale-provider";
import { getErrorMessage } from "@/lib/errors";
import { syncPromotionsAction } from "@/server/actions/settings";
import { Button } from "@/components/ui/button";

export function SyncPromotionsButton() {
  const [isPending, startTransition] = useTransition();
  const t = useTranslate();

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
              t("success.SYNC_SUCCESS", {
                successCount,
                total: results.length,
                totalItems,
              }),
            );
          } catch (error) {
            toast.error(getErrorMessage(error, t, "SYNC_ERROR"));
          }
        })
      }
    >
      {isPending ? (
        <Loader2 className="mr-2 size-4 animate-spin" />
      ) : (
        <RefreshCw className="mr-2 size-4" />
      )}
      {t("common.syncFlyers")}
    </Button>
  );
}
