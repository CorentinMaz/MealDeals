/** Shared UI copy — merged into locale message catalogs. */
export const uiMessagesFr = {
  nav: {
    menu: "Menu",
    brand: "mealdeals.",
    dashboard: {
      label: "Accueil",
      description: "Tes promos, ton menu et tes économies — tout en un coup d'œil.",
    },
    promotions: {
      label: "Rabais",
      description: "Les circulaires de tes épiceries, à jour.",
    },
    recipes: {
      label: "Mon menu",
      description: "On crée ton menu à partir des aubaines du moment.",
    },
    history: {
      label: "Historique",
      description: "Tes menus passés, tes coups de cœur et tes classiques.",
    },
    settings: {
      label: "Mes préférences",
      description: "Ton frigo, tes épiceries et ce que tu veux atteindre.",
    },
  },
  common: {
    saving: "On enregistre…",
    save: "Enregistrer",
    saveGoals: "Enregistrer mes objectifs",
    savePreferences: "Enregistrer",
    syncFlyers: "Actualiser les circulaires",
    viewAll: "Tout voir",
    viewMenu: "Voir le menu",
    consult: "Ouvrir",
    enabled: "Activée",
    disabled: "Désactivée",
    favorite: "Coup de cœur",
    regular: "Classique",
    makeAgain: "À refaire",
    onSale: "En promo",
    flyerPrice: "Prix en circulaire",
    products: "produits",
    all: "Tout",
    none: "Aucune",
    kcalPerDay: "kcal / jour",
    sessionsPerWeek: "séances / semaine",
    estimated: "(estimé)",
    manual: "(manuel)",
    protein: "protéines",
    carbs: "glucides",
    fat: "lipides",
    ingredients: "Ingrédients",
    steps: "Étapes",
    backToGeneration: "Retour au menu",
    generateFirstMenu: "Créer mon premier menu",
  },
  notifications: {
    budgetSaved:
      "Bonne nouvelle ! Ton menu de la semaine te coûte {amount}$ de moins que prévu.",
  },
  pages: {
    dashboard: {
      title: "Accueil",
      subtitle:
        "Des recettes malines selon les circulaires du Québec ({postalCode})",
      activeStores: "Épiceries actives",
      activeStoresOf: "sur {total} au total",
      activePromotions: "Rabais en cours",
      foodItemsInFlyers: "produits en promo cette semaine",
      latestMenu: "Dernier menu",
      recipesGenerated: "recettes",
      menuHistory: "Menus récents",
      plansTotal: "{count} menu(x) créé(s) jusqu'ici",
      plansEmpty:
        "Tu n'as pas encore choisi de recettes. On regarde ce qui est en rabais ?",
      storeStatus: "Tes épiceries",
      lastSync: "Dernière mise à jour : {time} ({store})",
      noSync: "Pas encore de circulaires — on actualise ?",
    },
    promotions: {
      title: "Rabais",
      subtitle: "Les circulaires de tes épiceries, mises à jour automatiquement",
      emptyTitle: "Aucun rabais pour l'instant",
      emptyDescription:
        "Appuie sur « Actualiser les circulaires » pour voir ce qui est en promo près de chez toi.",
      noStoreSelected: "Aucune épicerie sélectionnée",
      selectStoreHint:
        "Choisis au moins une épicerie pour afficher les rabais.",
      noResults: "Rien trouvé",
      noResultsHint:
        "Aucun rabais ne correspond à ta recherche ou à tes filtres.",
      searchPlaceholder:
        "Chercher un produit, une marque ou une épicerie…",
      searchAria: "Rechercher dans les rabais",
      clearSearchAria: "Effacer la recherche",
      filterByStore: "Filtrer par épicerie",
      selectedOf: "{selected} sur {total} sélectionnée(s)",
      foundCount: "{count} rabais trouvé(s)",
      noStorePromotions: "Aucun rabais pour cette épicerie en ce moment.",
    },
    recipes: {
      title: "Mon menu",
      subtitle:
        "On compose ton menu de la semaine avec les produits en rabais — et on réutilise les ingrédients pour limiter le gaspillage.",
      cardTitle: "Créer mon menu de la semaine",
      promotionsAvailable:
        "{count} rabais actifs serviront de base pour des recettes économiques.",
      syncFirst:
        "Actualise d'abord les circulaires pour qu'on puisse cuisiner selon les promos.",
      recipeCount: "Combien de recettes ?",
      recipeCountOption: "{count} recettes",
      generate: "Créer mon menu",
      emptySelection:
        "Tu n'as pas encore choisi de recettes. On regarde ce qui est en rabais ?",
    },
    history: {
      title: "Historique",
      subtitle:
        "Retrouve tes menus passés, marque tes coups de cœur et tes classiques — on s'en souviendra pour la prochaine fois.",
      tabMenus: "Menus ({count})",
      tabFavorites: "Coups de cœur ({count})",
      tabRegulars: "À refaire ({count})",
      noFavorites:
        "Pas encore de coup de cœur. Appuie sur « Coup de cœur » sur une recette que tu adores.",
      noRegulars:
        "Pas encore de classique. Marque « À refaire » sur les plats que tu cuisines souvent.",
      noPlans: "Tu n'as pas encore créé de menu. On commence ?",
      menuOf: "Menu du {date}",
      recipesGenerated: "{count} recettes",
      favoriteCount: "{count} coup(s) de cœur",
      regularCount: "{count} classique(s)",
      andMore: "… et {count} autre(s)",
    },
    settings: {
      title: "Mes préférences",
      subtitle:
        "Dis-nous où tu fais tes courses, ce qu'il y a dans ton frigo et combien tu veux dépenser.",
      location: "Où tu habites",
      locationDescription:
        "Ton code postal nous indique quelles circulaires aller chercher.",
      stores: "Mes épiceries",
      storesDescription:
        "Choisis les magasins dont tu veux voir les rabais.",
      savings: "Mes économies",
      savingsDescription:
        "Ton budget hebdo — pour qu'on t'aide à bien manger sans te ruiner.",
      nutritionGoals: "Mes objectifs",
      nutritionGoalsDescription:
        "Prise de masse, perte de poids, maintien… ou juste de bonnes recettes, sans prise de tête.",
      foodPreferences: "Mon frigo",
      foodPreferencesDescription:
        "Allergies, régimes, ce que tu aimes et ce que tu évites — pour des recettes qui te ressemblent.",
    },
    results: {
      title: "Ton menu — {count} recettes",
      generatedOn: "Menu créé le {date}",
      tabRecipes: "Recettes",
      tabShoppingList: "Liste d'épicerie",
      noShoppingList: "Pas encore de liste d'épicerie.",
      exportAll: "Menu complet (PDF)",
      exportRecipes: "Recettes (PDF)",
      exportShopping: "Liste d'épicerie (PDF)",
      nutritionSummary: "Résumé nutritionnel",
      menuFrom: "Menu du {date}",
    },
  },
  forms: {
    postalCode: "Code postal",
    allergies: "Allergies",
    allergiesPlaceholder: "arachides, gluten, lactose…",
    diets: "Régimes",
    dietsPlaceholder: "végétarien, sans gluten…",
    likedFoods: "Ce que j'aime",
    likedFoodsPlaceholder: "poulet, brocoli, pâtes…",
    dislikedFoods: "Ce que j'évite",
    dislikedFoodsPlaceholder: "foie, anchois…",
    maxPrepMinutes: "Temps max en cuisine (min)",
    weeklyBudget: "Budget de la semaine ($)",
    nutritionWhatDoYouWant: "Qu'est-ce que tu cherches ?",
    nutritionRecipesOnlyHint:
      "De bonnes recettes basées sur les rabais — sans compter les calories.",
    nutritionGuidedHint:
      "Des recettes adaptées à ton objectif, ton niveau d'activité et tes calories cibles.",
    nutritionMainGoal: "Mon objectif",
    nutritionChooseGoal: "Choisir un objectif",
    nutritionPhysicalActivity: "Mon activité",
    nutritionActivityHint:
      "Dis-nous comment tu bouges — on ajuste les calories et les macros en conséquence.",
    nutritionGym: "Musculation",
    nutritionRunning: "Course à pied",
    nutritionDailyCalories: "Calories par jour",
    nutritionManualCalories: "Fixer mes calories moi-même",
    nutritionCaloriePlaceholder: "ex. 3000",
    nutritionAutoEstimate:
      "Estimation : ~{calories} kcal/jour selon ton objectif et ton activité.",
    nutritionChooseGoalForEstimate:
      "Choisis un objectif pour voir l'estimation.",
    nutritionActiveProfile:
      "Profil actif : {goal}{activities} · ~{calories} kcal/jour {source}",
    nutritionActivityGym: "muscu ({count}×/sem.)",
    nutritionActivityRunning: "course ({count}×/sem.)",
    calorieCalculatorTitle: "Calculateur de calories",
    calorieCalculatorDescription:
      "Une estimation de tes besoins selon ton profil et ton objectif — pour t'aider à te fixer une cible.",
    calorieCalculatorSex: "Sexe biologique",
    calorieCalculatorSexMale: "Homme",
    calorieCalculatorSexFemale: "Femme",
    calorieCalculatorAge: "Âge",
    calorieCalculatorWeight: "Poids (kg)",
    calorieCalculatorHeight: "Taille (cm)",
    calorieCalculatorActivityLevel: "Niveau d'activité au quotidien",
    calorieCalculatorGymSessions: "Musculation (séances / semaine)",
    calorieCalculatorRunningSessions: "Course (séances / semaine)",
    calorieCalculatorRecommended: "Calories recommandées",
    calorieCalculatorUseTarget: "Utiliser cette cible",
    calorieCalculatorBmr: "Métabolisme de base",
    calorieCalculatorActivityBonus: "Activité (niveau)",
    calorieCalculatorGymBonus: "Bonus muscu",
    calorieCalculatorRunningBonus: "Bonus course",
    calorieCalculatorTdee: "Dépense totale",
    calorieCalculatorAdjustment: "Ajustement",
    calorieCalculatorDisclaimer:
      "Chiffre indicatif seulement. Pour un plan sur mesure, parle à un pro de la santé. Minimum : 1200 kcal/jour.",
    calorieCalculatorChooseGoal:
      "Choisis d'abord un objectif principal pour voir l'estimation.",
    calorieCalculatorInvalidValues:
      "Entre des valeurs valides (âge 14–100, poids 30–300 kg, taille 120–230 cm).",
  },
  nutrition: {
    modes: {
      recipes_only: "Recettes seulement",
      guided: "Avec mes objectifs",
    },
    goals: {
      bulking: "Prise de masse",
      cutting: "Perte de poids",
      maintenance: "Maintien",
    },
    goalDescriptions: {
      bulking:
        "Des repas plus copieux, riches en protéines et glucides pour soutenir ta progression.",
      cutting:
        "Des repas légers et rassasiants, riches en protéines pour préserver tes muscles.",
      maintenance: "Un équilibre pour maintenir ton poids actuel.",
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
    brand: "mealdeals.",
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
  notifications: {
    budgetSaved:
      "Good news! Your weekly menu costs {amount}$ less than expected.",
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
      emptySelection:
        "You haven't picked any recipes yet. Want to see what's on sale?",
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
      savings: "My savings",
      savingsDescription:
        "Your weekly budget — so we can help you eat well without overspending.",
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
    calorieCalculatorTitle: "Calorie calculator",
    calorieCalculatorDescription:
      "Estimate your daily needs from your profile and goal.",
    calorieCalculatorSex: "Biological sex",
    calorieCalculatorSexMale: "Male",
    calorieCalculatorSexFemale: "Female",
    calorieCalculatorAge: "Age",
    calorieCalculatorWeight: "Weight (kg)",
    calorieCalculatorHeight: "Height (cm)",
    calorieCalculatorActivityLevel: "General activity level",
    calorieCalculatorGymSessions: "Weight training (sessions / week)",
    calorieCalculatorRunningSessions: "Running (sessions / week)",
    calorieCalculatorRecommended: "Recommended calories",
    calorieCalculatorUseTarget: "Use this target",
    calorieCalculatorBmr: "Basal metabolic rate",
    calorieCalculatorActivityBonus: "Activity (level)",
    calorieCalculatorGymBonus: "Gym bonus",
    calorieCalculatorRunningBonus: "Running bonus",
    calorieCalculatorTdee: "Total expenditure",
    calorieCalculatorAdjustment: "Adjustment",
    calorieCalculatorDisclaimer:
      "Indicative estimate only. Consult a health professional for a personalized plan. Minimum: 1200 kcal/day.",
    calorieCalculatorChooseGoal:
      "Choose a main goal first to see the estimate.",
    calorieCalculatorInvalidValues:
      "Enter valid values (age 14–100, weight 30–300 kg, height 120–230 cm).",
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
