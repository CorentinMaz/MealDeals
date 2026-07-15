"use client";

import { useTransition } from "react";
import { Heart, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useTranslate } from "@/components/providers/locale-provider";
import { getErrorMessage } from "@/lib/errors";
import {
  toggleRecipeFavoriteAction,
  toggleRecipeMakeRegularlyAction,
} from "@/server/actions/recipes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RecipeFeedbackButtonsProps {
  recipeId: string;
  isFavorite: boolean;
  makeRegularly: boolean;
  size?: "sm" | "default";
}

export function RecipeFeedbackButtons({
  recipeId,
  isFavorite,
  makeRegularly,
  size = "default",
}: RecipeFeedbackButtonsProps) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslate();

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant={isFavorite ? "default" : "outline"}
        size={size}
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            try {
              await toggleRecipeFavoriteAction(recipeId, !isFavorite);
              toast.success(
                !isFavorite
                  ? t("success.RECIPE_FAVORITE_ADDED")
                  : t("success.RECIPE_FAVORITE_REMOVED"),
              );
            } catch (error) {
              toast.error(getErrorMessage(error, t, "SAVE_ERROR"));
            }
          })
        }
      >
        <Heart
          className={cn("mr-1.5 size-3.5", isFavorite && "fill-current")}
        />
        {t("common.favorite")}
      </Button>

      <Button
        type="button"
        variant={makeRegularly ? "secondary" : "outline"}
        size={size}
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            try {
              await toggleRecipeMakeRegularlyAction(
                recipeId,
                !makeRegularly,
              );
              toast.success(
                !makeRegularly
                  ? t("success.RECIPE_REGULAR_ADDED")
                  : t("success.RECIPE_REGULAR_REMOVED"),
              );
            } catch (error) {
              toast.error(getErrorMessage(error, t, "SAVE_ERROR"));
            }
          })
        }
      >
        <RotateCcw className="mr-1.5 size-3.5" />
        {t("common.makeAgain")}
      </Button>
    </div>
  );
}
