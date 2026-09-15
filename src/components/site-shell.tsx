import { useEffect, type ReactNode } from "react";
import { getPublicSiteCopy } from "@/lib/site-copy";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartDrawer } from "@/components/cart-drawer";
import { FieldCursor } from "@/components/field-cursor";

function PublicCopyHydrator() {
  useEffect(() => {
    void getPublicSiteCopy().then((copy) => {
      for (const element of document.querySelectorAll<HTMLElement>("[data-copy-key]")) {
        const key = element.dataset.copyKey;
        if (key && copy[key] !== undefined) element.textContent = copy[key];
      }
    });
  }, []);
  return null;
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh overflow-x-hidden bg-background text-foreground">
      <SiteHeader />
      <PublicCopyHydrator />
      {children}
      <SiteFooter />
      <CartDrawer />
      <FieldCursor />
    </div>
  );
}
