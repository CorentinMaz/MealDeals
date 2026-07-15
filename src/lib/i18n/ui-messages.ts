/** Shared UI copy — merged into locale message catalogs. */
export const uiMessagesFr = {
  nav: {
    menu: "Menu",
    brand: "MealDeals",
    dashboard: {
      label: "Tableau de bord",
      description: "Vue d'ensemble des promotions et de votre menu.",
    },
    promotions: {
      label: "Promotions",
      description: "Circulaires synchronisées via Flipp.",
    },
    recipes: {
      label: "Générer",
      description: "Créez un menu basé sur les aubaines.",
    },
    history: {
      label: "Historique",
      description: "Menus passés, favoris et recettes régulières.",
    },
    settings: {
      label: "Paramètres",
      description: "Épiceries, localisation et préférences.",
    },
  },
  common: {
    saving: "Enregistrement...",
    save: "Enregistrer",
    saveGoals: "Enregistrer les objectifs",
    savePreferences: "Enregistrer les préférences",
    syncFlyers: "Synchroniser les circulaires",
    viewAll: "Voir tout",
    viewMenu: "Voir le menu",
    consult: "Consulter",
    enabled: "Activée",
    disabled: "Désactivée",
    favorite: "Favori",
    regular: "Régulier",
    makeAgain: "À refaire",
    onSale: "En promo",
    flyerPrice: "Prix en circulaire",
    products: "produits",
    all: "Tout",
    none: "Aucun",
    kcalPerDay: "kcal / jour",
    sessionsPerWeek: "séances / semaine",
    estimated: "(estimé)",
    manual: "(manuel)",
    protein: "protéines",
    carbs: "glucides",
    fat: "lipides",
    ingredients: "Ingrédients",
    steps: "Étapes",
    backToGeneration: "Retour à la génération",
    generateFirstMenu: "Générer votre premier menu",
  },
  pages: {
    dashboard: {
      title: "Tableau de bord",
      subtitle:
        "Recettes intelligentes basées sur les circulaires du Québec ({postalCode})",
      activeStores: "Épiceries actives",
      activeStoresOf: "sur {total} configurées",
      activePromotions: "Promotions actives",
      foodItemsInFlyers: "produits alimentaires en circulaire",
      latestMenu: "Dernier menu",
      recipesGenerated: "recettes générées",
      menuHistory: "Historique des menus",
      plansTotal: "{count} menu(x) généré(s) au total",
      plansEmpty: "Vos menus générés apparaîtront ici",
      storeStatus: "État des épiceries",
      lastSync: "Dernière synchro: {time} ({store})",
      noSync: "Aucune synchronisation effectuée",
    },
    promotions: {
      title: "Promotions",
      subtitle: "Circulaires synchronisées automatiquement via Flipp",
      emptyTitle: "Aucune promotion disponible",
      emptyDescription:
        "Cliquez sur « Synchroniser les circulaires » pour récupérer les aubaines de vos épiceries.",
      noStoreSelected: "Aucune épicerie sélectionnée",
      selectStoreHint:
        "Sélectionnez au moins une épicerie pour afficher les promotions.",
      noResults: "Aucun résultat",
      noResultsHint:
        "Aucune promotion ne correspond à votre recherche ou à vos filtres.",
      searchPlaceholder:
        "Rechercher un produit, une marque ou une épicerie…",
      searchAria: "Rechercher dans les promotions",
      clearSearchAria: "Effacer la recherche",
      filterByStore: "Filtrer par épicerie",
      selectedOf: "{selected} sur {total} sélectionnée(s)",
      foundCount: "{count} promotion(s) trouvée(s)",
      noStorePromotions: "Aucune promotion pour cette épicerie.",
    },
    recipes: {
      title: "Générer des recettes",
      subtitle:
        "L'IA crée un menu hebdomadaire en privilégiant les produits en promotion et en réutilisant les ingrédients.",
      cardTitle: "Générer votre menu de la semaine",
      promotionsAvailable:
        "{count} promotions actives seront utilisées pour créer des recettes économiques.",
      syncFirst:
        "Synchronisez d'abord les circulaires pour générer des recettes basées sur les promotions.",
      recipeCount: "Nombre de recettes",
      recipeCountOption: "{count} recettes",
      generate: "Générer les recettes",
    },
    history: {
      title: "Historique",
      subtitle:
        "Consultez vos menus passés, marquez vos recettes favorites et indiquez celles à refaire régulièrement — l'IA en tiendra compte lors des prochaines générations.",
      tabMenus: "Menus ({count})",
      tabFavorites: "Favoris ({count})",
      tabRegulars: "À refaire ({count})",
      noFavorites:
        "Aucune recette favorite. Marquez une recette avec le bouton « Favori » sur un menu généré.",
      noRegulars:
        "Aucune recette marquée à refaire. Utilisez le bouton « À refaire » pour indiquer à l'IA les plats que vous aimez refaire souvent.",
      noPlans: "Aucun menu généré pour le moment.",
      menuOf: "Menu du {date}",
      recipesGenerated: "{count} recettes générées",
      favoriteCount: "{count} favori(s)",
      regularCount: "{count} régulier(s)",
      andMore: "… et {count} autre(s)",
    },
    settings: {
      title: "Paramètres",
      subtitle:
        "Gérez vos épiceries, votre localisation et vos préférences alimentaires.",
      location: "Localisation",
      locationDescription:
        "Le code postal détermine quelles circulaires sont récupérées.",
      stores: "Épiceries",
      storesDescription:
        "Activez ou désactivez les magasins à inclure dans la synchronisation.",
      nutritionGoals: "Objectifs nutritionnels",
      nutritionGoalsDescription:
        "Définissez votre objectif (prise de masse, perte de poids, etc.), votre activité physique et optionnellement un objectif calorique. Vous pouvez aussi choisir de générer des recettes sans contrainte nutritionnelle.",
      foodPreferences: "Préférences alimentaires",
      foodPreferencesDescription:
        "Ces contraintes sont transmises à l'IA lors de la génération des recettes.",
    },
    results: {
      title: "Résultats — {count} recettes",
      generatedOn: "Menu généré le {date}",
      tabRecipes: "Recettes",
      tabShoppingList: "Liste d'épicerie",
      noShoppingList: "Aucune liste d'épicerie générée.",
      exportAll: "Menu complet (PDF)",
      exportRecipes: "Recettes (PDF)",
      exportShopping: "Liste d'épicerie (PDF)",
      nutritionSummary: "Résumé nutritionnel du menu",
      menuFrom: "Menu du {date}",
    },
  },
  forms: {
    postalCode: "Code postal",
    allergies: "Allergies",
    allergiesPlaceholder: "arachides, gluten, lactose",
    diets: "Régimes alimentaires",
    dietsPlaceholder: "végétarien, sans gluten",
    likedFoods: "Aliments aimés",
    likedFoodsPlaceholder: "poulet, brocoli, pâtes",
    dislikedFoods: "Aliments refusés",
    dislikedFoodsPlaceholder: "foie, anchois",
    maxPrepMinutes: "Temps maximal de préparation (min)",
    weeklyBudget: "Budget hebdomadaire ($)",
    nutritionWhatDoYouWant: "Que voulez-vous obtenir ?",
    nutritionRecipesOnlyHint:
      "Génération de recettes basées sur les promotions, sans contrainte calorique.",
    nutritionGuidedHint:
      "Les recettes seront adaptées à votre objectif, votre activité physique et vos calories cibles.",
    nutritionMainGoal: "Objectif principal",
    nutritionChooseGoal: "Choisir un objectif",
    nutritionPhysicalActivity: "Activité physique",
    nutritionActivityHint:
      "Indiquez vos activités pour ajuster les calories et les macros (ex. prise de masse + musculation + course).",
    nutritionGym: "Musculation",
    nutritionRunning: "Course à pied",
    nutritionDailyCalories: "Calories journalières",
    nutritionManualCalories: "Définir un objectif calorique manuel",
    nutritionCaloriePlaceholder: "ex. 3000",
    nutritionAutoEstimate:
      "Estimation automatique : ~{calories} kcal/jour selon votre objectif et votre activité.",
    nutritionChooseGoalForEstimate:
      "Choisissez un objectif pour voir l'estimation calorique.",
    nutritionActiveProfile:
      "Profil actif : {goal}{activities} · ~{calories} kcal/jour {source}",
    nutritionActivityGym: "musculation ({count}×/sem.)",
    nutritionActivityRunning: "course ({count}×/sem.)",
  },
  nutrition: {
    modes: {
      recipes_only: "Recettes seulement",
      guided: "Objectifs nutritionnels",
    },
    goals: {
      bulking: "Prise de masse",
      cutting: "Perte de poids",
      maintenance: "Maintien",
    },
    goalDescriptions: {
      bulking:
        "Repas plus caloriques, riches en protéines et glucides pour soutenir la croissance musculaire.",
      cutting:
        "Repas plus légers, rassasiants et riches en protéines pour préserver la masse musculaire.",
      maintenance: "Équilibre calorique pour maintenir votre poids actuel.",
    },
    difficulty: {
      facile: "Facile",
      moyen: "Moyen",
      difficile: "Difficile",
    },
    activity: {
      sedentary: "Sédentaire (bureau, peu de marche)",
      light: "Légèrement actif (marche, 1–3×/sem.)",
      moderate: "Modérément actif (sport 3–5×/sem.)",
      active: "Très actif (sport 6–7×/sem.)",
      veryActive: "Extrêmement actif (athlète, travail physique)",
    },
  },
} as const;

export const uiMessagesEn = {
  nav: {
    menu: "Menu",
    brand: "MealDeals",
    dashboard: {
      label: "Dashboard",
      description: "Overview of promotions and your menu.",
    },
    promotions: {
      label: "Promotions",
      description: "Flyers synced via Flipp.",
    },
    recipes: {
      label: "Generate",
      description: "Build a menu from weekly deals.",
    },
    history: {
      label: "History",
      description: "Past menus, favorites, and regular recipes.",
    },
    settings: {
      label: "Settings",
      description: "Stores, location, and preferences.",
    },
  },
  common: {
    saving: "Saving...",
    save: "Save",
    saveGoals: "Save goals",
    savePreferences: "Save preferences",
    syncFlyers: "Sync flyers",
    viewAll: "View all",
    viewMenu: "View menu",
    consult: "Open",
    enabled: "Enabled",
    disabled: "Disabled",
    favorite: "Favorite",
    regular: "Regular",
    makeAgain: "Make again",
    onSale: "On sale",
    flyerPrice: "Flyer price",
    products: "products",
    all: "All",
    none: "None",
    kcalPerDay: "kcal / day",
    sessionsPerWeek: "sessions / week",
    estimated: "(estimated)",
    manual: "(manual)",
    protein: "protein",
    carbs: "carbs",
    fat: "fat",
    ingredients: "Ingredients",
    steps: "Steps",
    backToGeneration: "Back to generation",
    generateFirstMenu: "Generate your first menu",
  },
  pages: {
    dashboard: {
      title: "Dashboard",
      subtitle: "Smart recipes based on Quebec flyers ({postalCode})",
      activeStores: "Active stores",
      activeStoresOf: "of {total} configured",
      activePromotions: "Active promotions",
      foodItemsInFlyers: "grocery items on sale",
      latestMenu: "Latest menu",
      recipesGenerated: "recipes generated",
      menuHistory: "Menu history",
      plansTotal: "{count} menu(s) generated in total",
      plansEmpty: "Your generated menus will appear here",
      storeStatus: "Store status",
      lastSync: "Last sync: {time} ({store})",
      noSync: "No sync performed yet",
    },
    promotions: {
      title: "Promotions",
      subtitle: "Flyers synced automatically via Flipp",
      emptyTitle: "No promotions available",
      emptyDescription:
        "Click « Sync flyers » to fetch deals from your grocery stores.",
      noStoreSelected: "No store selected",
      selectStoreHint: "Select at least one store to show promotions.",
      noResults: "No results",
      noResultsHint: "No promotions match your search or filters.",
      searchPlaceholder: "Search product, brand, or store…",
      searchAria: "Search promotions",
      clearSearchAria: "Clear search",
      filterByStore: "Filter by store",
      selectedOf: "{selected} of {total} selected",
      foundCount: "{count} promotion(s) found",
      noStorePromotions: "No promotions for this store.",
    },
    recipes: {
      title: "Generate recipes",
      subtitle:
        "AI builds a weekly menu prioritizing sale items and reusing ingredients.",
      cardTitle: "Generate your weekly menu",
      promotionsAvailable:
        "{count} active promotions will be used to create budget-friendly recipes.",
      syncFirst: "Sync flyers first to generate recipes based on promotions.",
      recipeCount: "Number of recipes",
      recipeCountOption: "{count} recipes",
      generate: "Generate recipes",
    },
    history: {
      title: "History",
      subtitle:
        "Browse past menus, mark favorites, and flag recipes to make regularly — AI will use this in future generations.",
      tabMenus: "Menus ({count})",
      tabFavorites: "Favorites ({count})",
      tabRegulars: "Make again ({count})",
      noFavorites:
        "No favorite recipes. Mark a recipe with the « Favorite » button on a generated menu.",
      noRegulars:
        "No recipes marked to make again. Use the « Make again » button to tell AI which meals you cook often.",
      noPlans: "No menus generated yet.",
      menuOf: "Menu from {date}",
      recipesGenerated: "{count} recipes generated",
      favoriteCount: "{count} favorite(s)",
      regularCount: "{count} regular(s)",
      andMore: "… and {count} more",
    },
    settings: {
      title: "Settings",
      subtitle: "Manage your stores, location, and food preferences.",
      location: "Location",
      locationDescription: "Postal code determines which flyers are fetched.",
      stores: "Grocery stores",
      storesDescription:
        "Enable or disable stores included in sync.",
      nutritionGoals: "Nutrition goals",
      nutritionGoalsDescription:
        "Set your goal (bulking, cutting, etc.), activity level, and optional calorie target. You can also generate recipes without nutrition constraints.",
      foodPreferences: "Food preferences",
      foodPreferencesDescription:
        "These constraints are sent to AI when generating recipes.",
    },
    results: {
      title: "Results — {count} recipes",
      generatedOn: "Menu generated on {date}",
      tabRecipes: "Recipes",
      tabShoppingList: "Shopping list",
      noShoppingList: "No shopping list generated.",
      exportAll: "Full menu (PDF)",
      exportRecipes: "Recipes (PDF)",
      exportShopping: "Shopping list (PDF)",
      nutritionSummary: "Menu nutrition summary",
      menuFrom: "Menu from {date}",
    },
  },
  forms: {
    postalCode: "Postal code",
    allergies: "Allergies",
    allergiesPlaceholder: "peanuts, gluten, lactose",
    diets: "Diets",
    dietsPlaceholder: "vegetarian, gluten-free",
    likedFoods: "Liked foods",
    likedFoodsPlaceholder: "chicken, broccoli, pasta",
    dislikedFoods: "Disliked foods",
    dislikedFoodsPlaceholder: "liver, anchovies",
    maxPrepMinutes: "Max prep time (min)",
    weeklyBudget: "Weekly budget ($)",
    nutritionWhatDoYouWant: "What do you want?",
    nutritionRecipesOnlyHint:
      "Recipe generation based on promotions, without calorie constraints.",
    nutritionGuidedHint:
      "Recipes will match your goal, activity level, and calorie targets.",
    nutritionMainGoal: "Main goal",
    nutritionChooseGoal: "Choose a goal",
    nutritionPhysicalActivity: "Physical activity",
    nutritionActivityHint:
      "Indicate your activities to adjust calories and macros (e.g. bulking + gym + running).",
    nutritionGym: "Weight training",
    nutritionRunning: "Running",
    nutritionDailyCalories: "Daily calories",
    nutritionManualCalories: "Set a manual calorie target",
    nutritionCaloriePlaceholder: "e.g. 3000",
    nutritionAutoEstimate:
      "Automatic estimate: ~{calories} kcal/day based on your goal and activity.",
    nutritionChooseGoalForEstimate:
      "Choose a goal to see the calorie estimate.",
    nutritionActiveProfile:
      "Active profile: {goal}{activities} · ~{calories} kcal/day {source}",
    nutritionActivityGym: "gym ({count}×/wk)",
    nutritionActivityRunning: "running ({count}×/wk)",
  },
  nutrition: {
    modes: {
      recipes_only: "Recipes only",
      guided: "Nutrition goals",
    },
    goals: {
      bulking: "Bulking",
      cutting: "Cutting",
      maintenance: "Maintenance",
    },
    goalDescriptions: {
      bulking:
        "Higher-calorie meals rich in protein and carbs to support muscle growth.",
      cutting:
        "Lighter, filling meals rich in protein to preserve muscle mass.",
      maintenance: "Calorie balance to maintain your current weight.",
    },
    difficulty: {
      facile: "Easy",
      moyen: "Medium",
      difficile: "Hard",
    },
    activity: {
      sedentary: "Sedentary (desk job, little walking)",
      light: "Lightly active (walking, 1–3×/wk)",
      moderate: "Moderately active (exercise 3–5×/wk)",
      active: "Very active (exercise 6–7×/wk)",
      veryActive: "Extremely active (athlete, physical job)",
    },
  },
} as const;
