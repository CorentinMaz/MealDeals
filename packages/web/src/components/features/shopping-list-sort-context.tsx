"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type ShoppingListSortMode = "category" | "store";

const ShoppingListSortContext = createContext<{
  sortMode: ShoppingListSortMode;
  setSortMode: (mode: ShoppingListSortMode) => void;
} | null>(null);

export function ShoppingListSortProvider({ children }: { children: ReactNode }) {
  const [sortMode, setSortMode] = useState<ShoppingListSortMode>("category");

  return (
    <ShoppingListSortContext.Provider value={{ sortMode, setSortMode }}>
      {children}
    </ShoppingListSortContext.Provider>
  );
}

export function useShoppingListSort() {
  const context = useContext(ShoppingListSortContext);
  if (!context) {
    throw new Error(
      "useShoppingListSort must be used within ShoppingListSortProvider",
    );
  }
  return context;
}
