import { useState } from "react";
import { 
  Server, BarChart3, Users, Battery, Zap, LogOut, 
  ChevronDown, ChevronRight, Thermometer, LayoutDashboard,
  Menu, X
} from "lucide-react";
import nbsLogo from "@/assets/nbs-logo.png";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  children?: { label: string; icon: React.ReactNode; id: string }[];
  id: string;
}

const navItems: NavItem[] = [
  {
    label: "Environmental State",
    icon: <Thermometer className="w-4 h-4" />,
    id: "env",
    children: [
      { label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" />, id: "env-dashboard" },
      { label: "Reports", icon: <BarChart3 className="w-4 h-4" />, id: "env-reports" },
    ],
  },
  {
    label: "Power State",
    icon: <Zap className="w-4 h-4" />,
    id: "power",
    children: [
      { label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" />, id: "power-dashboard" },
      { label: "Reports", icon: <BarChart3 className="w-4 h-4" />, id: "power-reports" },
    ],
  },
  {
    label: "System Users",
    icon: <Users className="w-4 h-4" />,
    id: "users",
    children: [
      { label: "All Users", icon: <Users className="w-4 h-4" />, id: "all-users" },
    ],
  },
  {
    label: "Battery Trends",
    icon: <Battery className="w-4 h-4" />,
    id: "battery",
  },
];

interface SidebarProps {
  activeItem: string;
  onItemClick: (id: string) => void;
}

export default function Sidebar({ activeItem, onItemClick }: SidebarProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ env: true });
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const content = (
    <div className="flex flex-col h-full">
      {/* Logo area */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <img src={nbsLogo} alt="NBS Bank" className="w-16 h-16 object-contain" />
        </div>
      </div>

      {/* User badge */}
      <div className="px-4 py-3">
        <div className="bg-primary text-primary-foreground rounded-lg px-3 py-2">
          <p className="text-xs font-medium">Yankho Nkoloma</p>
          <p className="text-[10px] opacity-80">System Administrator</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => item.children ? toggleExpand(item.id) : onItemClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all
                ${activeItem === item.id ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
            >
              {item.icon}
              <span className="flex-1 text-left">{item.label}</span>
              {item.children && (
                expanded[item.id] ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
            {item.children && expanded[item.id] && (
              <div className="ml-4 mt-0.5 space-y-0.5 border-l border-border pl-3">
                {item.children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => { onItemClick(child.id); setMobileOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs transition-all
                      ${activeItem === child.id ? "bg-primary/15 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
                  >
                    {child.icon}
                    {child.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-border">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border border-border"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-60 bg-sidebar border-r border-sidebar-border transform transition-transform lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {content}
      </aside>
    </>
  );
}
