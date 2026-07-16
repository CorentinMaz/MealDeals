"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { useTranslate } from "@/components/providers/locale-provider";
import { getErrorMessage } from "@/lib/errors";
import { updatePostalCodeAction } from "@/server/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PostalCodeForm({ postalCode }: { postalCode: string }) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslate();

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
            toast.success(t("success.POSTAL_CODE_UPDATED"));
          } catch (error) {
            toast.error(getErrorMessage(error, t, "UPDATE_ERROR"));
          }
        });
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="postalCode">{t("forms.postalCode")}</Label>
        <Input
          id="postalCode"
          name="postalCode"
          defaultValue={postalCode}
          placeholder="G1V4P3"
          className="max-w-xs uppercase"
        />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? t("common.saving") : t("common.save")}
      </Button>
    </form>
  );
}
