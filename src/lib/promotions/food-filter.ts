const NON_FOOD_KEYWORDS = [
  "détergent",
  "detergent",
  "lessive",
  "shampooing",
  "shampoing",
  "savon",
  "papier hygiénique",
  "essuie-tout",
  "couches",
  "batterie",
  "ampoule",
  "décor",
  "jardin",
  "patio",
  "meuble",
  "sectional",
  "matelas",
  "télévision",
  "television",
  "ordinateur",
  "jouet",
  "vêtement",
  "vetement",
  "chaussure",
  "parfum",
  "maquillage",
  "rasoir",
  "coupon",
  "coupons",
];

const FOOD_KEYWORDS = [
  "poulet",
  "boeuf",
  "bœuf",
  "porc",
  "saumon",
  "poisson",
  "crevette",
  "lait",
  "fromage",
  "yogourt",
  "yaourt",
  "oeuf",
  "œuf",
  "pain",
  "pâtes",
  "pates",
  "riz",
  "légume",
  "legume",
  "fruit",
  "tomate",
  "pomme",
  "banane",
  "brocoli",
  "salade",
  "soupe",
  "sauce",
  "beurre",
  "huile",
  "farine",
  "sucre",
  "café",
  "cafe",
  "thé",
  "the",
  "jus",
  "eau",
  "viande",
  "saucisse",
  "bacon",
  "jambon",
  "tofu",
  "haricot",
  "lentille",
  "céréale",
  "cereale",
  "granola",
  "barre",
  "chips",
  "biscuit",
  "chocolat",
  "glace",
  "surgelé",
  "surgele",
  "congelé",
  "congele",
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export function isLikelyFoodItem(name: string): boolean {
  const normalized = normalize(name);

  if (NON_FOOD_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return false;
  }

  if (FOOD_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return true;
  }

  // Flyer items with a price and no obvious non-food signal are treated as food.
  return !normalized.includes("coupon");
}

export function parsePrice(value?: string): number | undefined {
  if (!value) return undefined;
  const match = value.replace(/\s/g, "").match(/(\d+[,.]?\d*)/);
  if (!match) return undefined;
  return Number.parseFloat(match[1].replace(",", "."));
}

export function extractUnit(name: string): string | undefined {
  const match = name.match(/,\s*([\d,.]+\s*(?:g|kg|ml|l|un\.?|unités?|lb|oz|pack))/i);
  return match?.[1];
}
