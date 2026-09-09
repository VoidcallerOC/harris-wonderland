import type { ReactNode } from "react";
import type { Permission, RbacRole } from "@/lib/auth/rbac";
import { Display, Kicker } from "@/components/type";
import { cn } from "@/lib/utils";

export type AdminAccess = {
  userId: string;
  role: RbacRole | null;
  permissions: readonly Permission[];
};

export function Can({ access, permission, children }: { access: AdminAccess; permission: Permission; children: ReactNode }) {
  return access.permissions.includes(permission) ? <>{children}</> : null;
}

const roleLabels: Record<RbacRole, string> = {
  owner: "Owner",
  manager: "Manager",
  animal_manager: "Animal Manager",
  staff: "Staff",
  admin_developer: "Admin / Developer",
};

export function AdminPanel({ access, title, description, children }: { access: AdminAccess; title: string; description: string; children?: ReactNode }) {
  const items = [
    { href: "/admin", label: "Dashboard", permission: "dashboard.view" as const },
    { href: "/admin/animals", label: "Animals", permission: "animals.view" as const },
    { href: "/admin/holds", label: "Holds", permission: "holds.view" as const },
    { href: "/admin/payments", label: "Payments", permission: "payments.view" as const },
    { href: "/admin/users", label: "Users", permission: "users.view" as const },
    { href: "/admin/audit-log", label: "Audit log", permission: "system.logs" as const },
    { href: "/admin/settings", label: "Settings", permission: "system.database" as const },
  ];
  return (
    <main className="py-14 sm:py-20">
      <div className="wrap">
        <div className="mb-8 border-b border-border pb-6">
          <Kicker>Harris administration{access.role ? ` · ${roleLabels[access.role]}` : ""}</Kicker>
          <Display as="h1" className="mt-2 text-display">{title}</Display>
          <p className="mt-4 max-w-3xl text-fg-soft">{description}</p>
          <nav aria-label="Administration" className="mt-6 flex flex-wrap gap-2">
            {items.map((item) => access.permissions.includes(item.permission) ? (
              <a key={item.href} href={item.href} className={cn("border border-border px-3 py-2 font-ui text-kicker font-bold uppercase tracking-kicker text-muted-foreground no-underline hover:border-brass hover:text-brass")}>
                {item.label}
              </a>
            ) : null)}
          </nav>
        </div>
        {children}
      </div>
    </main>
  );
}
