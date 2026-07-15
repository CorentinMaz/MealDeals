import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ShoppingListCategory } from "@/lib/shopping-list/generator";

export function ShoppingListView({
  categories,
}: {
  categories: ShoppingListCategory[];
}) {
  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <Card key={category.category}>
          <CardHeader>
            <CardTitle className="text-lg">{category.category}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {category.items.map((item) => (
              <div
                key={`${category.category}-${item.name}`}
                className="flex flex-col gap-1 border-b pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.quantity}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{item.recommendedStore}</Badge>
                  {item.isOnSale ? (
                    <Badge variant="default">En promo</Badge>
                  ) : null}
                  {item.estimatedPrice > 0 ? (
                    <span className="text-sm font-medium">
                      ~{item.estimatedPrice.toFixed(2)}$
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
