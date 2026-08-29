import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartDrawer } from "@/components/cart-drawer";
import { FieldCursor } from "@/components/field-cursor";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh overflow-x-hidden bg-background text-foreground">
      <SiteHeader />
      {children}
      <SiteFooter />
      <CartDrawer />
      <FieldCursor />
    </div>
  );
}
