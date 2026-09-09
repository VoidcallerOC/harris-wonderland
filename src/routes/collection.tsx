import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/collection")({
  component: CollectionLayout,
});

function CollectionLayout() {
  return (
    <SiteShell>
      <main>
        <Outlet />
      </main>
    </SiteShell>
  );
}
