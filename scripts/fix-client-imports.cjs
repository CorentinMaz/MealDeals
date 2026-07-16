const fs = require("fs");
const path = require("path");

function walk(dir) {
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (!/\.(ts|tsx)$/.test(file)) {
      continue;
    }

    const content = fs.readFileSync(fullPath, "utf8");
    const updated = content
      .replaceAll('from "@mealdeals/api"', 'from "@mealdeals/api/client"')
      .replaceAll("from '@mealdeals/api'", "from '@mealdeals/api/client'");

    if (updated !== content) {
      fs.writeFileSync(fullPath, updated);
    }
  }
}

walk(path.join("packages", "web", "src", "components"));
walk(path.join("packages", "web", "src", "lib", "pdf"));
