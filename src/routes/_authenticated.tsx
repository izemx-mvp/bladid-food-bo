import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/backoffice/AppSidebar";
import { TopBar } from "@/components/backoffice/TopBar";
import { getSession } from "@/lib/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  component: AuthLayout,
});

function AuthLayout() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getSession()) {
      navigate({ to: "/login" });
    } else {
      setReady(true);
    }
  }, [navigate]);

  if (!ready) {
    return <div className="min-h-screen bg-background bg-mesh flex items-center justify-center">
      <div className="text-muted-foreground text-sm">Chargement…</div>
    </div>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background bg-mesh">
        <AppSidebar />
        <SidebarInset className="bg-transparent">
          <TopBar />
          <main className="p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
