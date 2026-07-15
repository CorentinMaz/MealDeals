"use client";

import { useTransition } from "react";
import { Heart, RotateCcw } from "lucide-react";
import { toast } from "sonner";
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
                  ? "Recette ajoutée aux favoris"
                  : "Recette retirée des favoris",
              );
            } catch (error) {
              toast.error(
                error instanceof Error ? error.message : "Erreur de sauvegarde",
              );
            }
          })
        }
      >
        <Heart
          className={cn("mr-1.5 size-3.5", isFavorite && "fill-current")}
        />
        Favori
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
                  ? "Recette marquée à refaire régulièrement — l'IA en tiendra compte"
                  : "Recette retirée des plats réguliers",
              );
            } catch (error) {
              toast.error(
                error instanceof Error ? error.message : "Erreur de sauvegarde",
              );
            }
          })
        }
      >
        <RotateCcw className="mr-1.5 size-3.5" />
        À refaire
      </Button>
    </div>
  );
}
