import { PreferencesForm } from "@/components/features/preferences-form";
import { NutritionGoalsForm } from "@/components/features/nutrition-goals-form";
import { NutritionGoalsSummary } from "@/components/features/nutrition-goals-summary";
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
import { getServerTranslator } from "@/lib/i18n/server";
import { getSettingsData } from "@mealdeals/api";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { stores, household } = await getSettingsData();
  const preferences = household?.preferences;
  const t = await getServerTranslator();

  return (
    <PageShell width="lg">
      <div className="space-y-6">
        <div>
          <h1>{t("pages.settings.title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("pages.settings.subtitle")}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("pages.settings.location")}</CardTitle>
            <CardDescription>
              {t("pages.settings.locationDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PostalCodeForm postalCode={household?.postalCode ?? "G1V4P3"} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("pages.settings.stores")}</CardTitle>
            <CardDescription>
              {t("pages.settings.storesDescription")}
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
                <CardTitle>{t("pages.settings.nutritionGoals")}</CardTitle>
                <CardDescription>
                  {t("pages.settings.nutritionGoalsDescription")}
                </CardDescription>
                <NutritionGoalsSummary preferences={preferences} />
              </CardHeader>
              <CardContent>
                <NutritionGoalsForm preferences={preferences} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("pages.settings.foodPreferences")}</CardTitle>
                <CardDescription>
                  {t("pages.settings.foodPreferencesDescription")}
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
