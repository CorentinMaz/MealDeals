/** Discrete brand accent for store identity dots — not full-color logos in lists. */
export const STORE_BRAND_DOTS: Record<string, string> = {
  maxi: "#FFCC00",
  "super-c": "#E31937",
  iga: "#C8102E",
  metro: "#ED1C24",
  provigo: "#0066B3",
  walmart: "#0071CE",
};

export function getStoreBrandDot(slug: string): string | undefined {
  return STORE_BRAND_DOTS[slug];
}
