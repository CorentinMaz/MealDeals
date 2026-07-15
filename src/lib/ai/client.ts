import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { z } from "zod";

export type AiProvider = "anthropic" | "openai";

export interface AiClientConfig {
  provider?: AiProvider;
  model?: string;
  apiKey?: string;
}

const SYSTEM_PROMPT =
  "Tu es un chef et nutritionniste québécois. Réponds uniquement en JSON valide selon le schéma demandé. Privilégie les produits en promotion, réutilise les ingrédients entre recettes, et respecte les contraintes alimentaires.";

const DEFAULT_MODELS: Record<AiProvider, string> = {
  anthropic: "claude-sonnet-4-6",
  openai: "gpt-4o-mini",
};

const recipeIngredientSchema = z.object({
  name: z.string(),
  quantity: z.string(),
  isOnSale: z.boolean(),
  storeSlug: z.string().optional(),
  estimatedPrice: z.number().optional(),
});

export const generatedRecipeSchema = z.object({
  name: z.string(),
  description: z.string(),
  prepMinutes: z.number().int().positive(),
  difficulty: z.enum(["facile", "moyen", "difficile"]),
  estimatedCost: z.number().positive(),
  calories: z.number().int().positive().optional(),
  proteinG: z.number().optional(),
  carbsG: z.number().optional(),
  fatG: z.number().optional(),
  ingredients: z.array(recipeIngredientSchema).min(3),
  steps: z.array(z.string()).min(2),
});

export const recipeGenerationSchema = z.object({
  recipes: z.array(generatedRecipeSchema).min(1),
  sharedIngredients: z.array(z.string()).default([]),
});

export type GeneratedRecipe = z.infer<typeof generatedRecipeSchema>;
export type RecipeGenerationResult = z.infer<typeof recipeGenerationSchema>;

function resolveProvider(config: AiClientConfig): AiProvider {
  const fromEnv = process.env.AI_PROVIDER;
  if (fromEnv === "anthropic" || fromEnv === "openai") {
    return fromEnv;
  }
  return config.provider ?? "anthropic";
}

function resolveApiKey(provider: AiProvider, config: AiClientConfig): string {
  const apiKey =
    config.apiKey ??
    (provider === "anthropic"
      ? process.env.ANTHROPIC_API_KEY
      : process.env.OPENAI_API_KEY);

  if (!apiKey) {
    throw new Error(
      provider === "anthropic"
        ? "La clé ANTHROPIC_API_KEY est requise pour générer des recettes."
        : "La clé OPENAI_API_KEY est requise pour générer des recettes.",
    );
  }

  return apiKey;
}

function extractJsonPayload(content: string): string {
  const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const start = content.indexOf("{");
  const end = content.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    return content.slice(start, end + 1);
  }

  return content.trim();
}

function parseRecipeGeneration(content: string): RecipeGenerationResult {
  try {
    const parsed = JSON.parse(extractJsonPayload(content)) as unknown;
    return recipeGenerationSchema.parse(parsed);
  } catch {
    throw new Error(
      "Réponse IA invalide — format inattendu. Veuillez réessayer.",
    );
  }
}

export function createAiClient(config: AiClientConfig = {}) {
  const provider = resolveProvider(config);
  const model =
    config.model ?? process.env.AI_MODEL ?? DEFAULT_MODELS[provider];
  const apiKey = resolveApiKey(provider, config);

  const anthropic =
    provider === "anthropic" ? new Anthropic({ apiKey }) : null;
  const openai = provider === "openai" ? new OpenAI({ apiKey }) : null;

  return {
    provider,
    model,
    async generateRecipes(prompt: string): Promise<RecipeGenerationResult> {
      if (anthropic) {
        const response = await anthropic.messages.create({
          model,
          max_tokens: 16_384,
          temperature: 0.7,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: prompt }],
        });

        const textBlock = response.content.find(
          (block) => block.type === "text",
        );
        if (!textBlock || textBlock.type !== "text") {
          throw new Error("Réponse IA vide — aucun contenu reçu.");
        }

        return parseRecipeGeneration(textBlock.text);
      }

      if (openai) {
        const response = await openai.chat.completions.create({
          model,
          temperature: 0.7,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: prompt },
          ],
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
          throw new Error("Réponse IA vide — aucun contenu reçu.");
        }

        return parseRecipeGeneration(content);
      }

      throw new Error(`Fournisseur IA non pris en charge : ${provider}`);
    },
  };
}
