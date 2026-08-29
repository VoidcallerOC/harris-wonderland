import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  url: string;
  siteProductId: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (item: Omit<CartItem, "qty">) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      open: false,
      setOpen: (open) => set({ open }),
      add: (item) => {
        const existing = get().items.find((row) => row.id === item.id);
        const next = existing
          ? get().items.map((row) =>
              row.id === item.id ? { ...row, qty: Math.min(row.qty + 1, 12) } : row,
            )
          : [...get().items, { ...item, qty: 1 }];
        set({ items: next, open: true });
      },
      remove: (id) => set({ items: get().items.filter((row) => row.id !== id) }),
      setQty: (id, qty) => {
        if (qty < 1) {
          set({ items: get().items.filter((row) => row.id !== id) });
          return;
        }
        set({
          items: get().items.map((row) => (row.id === id ? { ...row, qty } : row)),
        });
      },
      clear: () => set({ items: [] }),
    }),
    { name: "hiw-cart" },
  ),
);

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.qty, 0);
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}