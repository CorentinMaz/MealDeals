import { PreferencesForm } from "@/components/features/preferences-form";
import {
  NutritionGoalsForm,
  NutritionGoalsSummary,
} from "@/components/features/nutrition-goals-form";
import { PostalCodeForm } from "@/components/features/postal-code-form";
import { StoreToggle } from "@/components/features/store-toggle";
import { PageShell } from "@/components/layout/page-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSettingsData } from "@/server/queries";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { stores, household } = await getSettingsData();
  const preferences = household?.preferences;

  return (
    <PageShell width="lg">
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Paramètres</h1>
          <p className="text-sm text-muted-foreground">
            Gérez vos épiceries, votre localisation et vos préférences
            alimentaires.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Localisation</CardTitle>
            <CardDescription>
              Le code postal détermine quelles circulaires sont récupérées.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PostalCodeForm postalCode={household?.postalCode ?? "G1V4P3"} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Épiceries</CardTitle>
            <CardDescription>
              Activez ou désactivez les magasins à inclure dans la
              synchronisation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {stores.map((store) => {
              const config = store.config as { note?: string };
              return (
                <StoreToggle
                  key={store.id}
                  storeId={store.id}
                  name={store.name}
                  enabled={store.enabled}
                  note={config.note}
                />
              );
            })}
          </CardContent>
        </Card>

        {preferences ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Objectifs nutritionnels</CardTitle>
                <CardDescription>
                  Définissez votre objectif (prise de masse, perte de poids,
                  etc.), votre activité physique et optionnellement un objectif
                  calorique. Vous pouvez aussi choisir de générer des recettes
                  sans contrainte nutritionnelle.
                </CardDescription>
                <NutritionGoalsSummary preferences={preferences} />
              </CardHeader>
              <CardContent>
                <NutritionGoalsForm preferences={preferences} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Préférences alimentaires</CardTitle>
                <CardDescription>
                  Ces contraintes sont transmises à l&apos;IA lors de la
                  génération des recettes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PreferencesForm preferences={preferences} />
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
    </PageShell>
  );
}
