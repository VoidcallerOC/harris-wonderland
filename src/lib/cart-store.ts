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
  maxQty?: number;
  tag?: string;
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
        const max = item.maxQty ?? 12;
        const existing = get().items.find((row) => row.id === item.id);
        const next = existing
          ? get().items.map((row) =>
              row.id === item.id ? { ...row, qty: Math.min(row.qty + 1, row.maxQty ?? max) } : row,
            )
          : [...get().items, { ...item, qty: 1, maxQty: max }];
        set({ items: next, open: true });
      },
      remove: (id) => set({ items: get().items.filter((row) => row.id !== id) }),
      setQty: (id, qty) => {
        const row = get().items.find((item) => item.id === id);
        if (!row) return;
        const max = row.maxQty ?? 12;
        if (qty < 1) {
          set({ items: get().items.filter((item) => item.id !== id) });
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, qty: Math.min(qty, max) } : item,
          ),
        });
      },
      clear: () => set({ items: [] }),
    }),
    { name: "hiw-cart", partialize: (state) => ({ items: state.items }) },
  ),
);

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.qty, 0);
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}
