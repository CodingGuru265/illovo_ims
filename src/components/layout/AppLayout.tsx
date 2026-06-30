import type { ReactNode } from "react";
import SidebarWrapper from "@/components/layout/SidebarWrapper";

type AppLayoutProps = {
  activeNav: string;
  onNavChange: (item: string) => void;
  children: ReactNode;
};

function getPageBanner(activeNav: string) {
  if (activeNav.startsWith("power")) {
    return "HEADQUARTERS DATA CENTER - POWER STATUS";
  }

  if (activeNav === "env-reports") {
    return "HEADQUARTERS DATA CENTER - REPORTS";
  }

  if (activeNav === "all-users") {
    return "SYSTEM ADMINISTRATION";
  }

  if (activeNav === "battery") {
    return "BATTERY MONITORING";
  }

  return "HEADQUARTERS DATA CENTER - ENVIRONMENTAL STATUS";
}

export default function AppLayout({
  activeNav,
  onNavChange,
  children,
}: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarWrapper
        activeItem={activeNav}
        onItemClick={onNavChange}
      />

      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-xl border-b border-border px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="lg:pl-0 pl-12">
              <h1 className="font-display text-lg font-bold text-[#006738] tracking-wider">
                Infrastructure Management System
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-[10px] text-muted-foreground font-display">
                LIVE
              </span>
            </div>
          </div>
        </header>

        <div className="bg-[#006738] text-primary-foreground text-center py-5">
          <p className="text-md font-medium tracking-wide">
            {getPageBanner(activeNav)}
          </p>
        </div>

        {children}
      </main>
    </div>
  );
}