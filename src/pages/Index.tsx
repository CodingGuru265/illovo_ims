import { useState } from "react";
/*import Sidebar from "@/components/dashboard/Sidebar";*/
import AppLayout from "@/components/layout/AppLayout";
import StatsBar from "@/components/dashboard/StatsBar";
import TemperatureCard from "@/components/dashboard/TemperatureCard";
import TemperatureChart from "@/components/dashboard/TemperatureChart";
import { rackData } from "@/data/sensorData";
import { Server, Zap, Battery } from "lucide-react";
import datacenterLayout from "@/assets/datacenter-layout.jpg";
import powerroomLayout from "@/assets/powerroom-layout.jpg";
import EnvironmentalReports from "@/pages/EnvironmentalReports";
import PowerDashboard from "@/pages/PowerDashboard";
import PowerReports from "@/pages/PowerReports";
import SystemUsers from "@/pages/SystemUsers";
import BatteryTrends from "@/pages/BatteryTrends";

const categories = [
  { key: "all", label: "All Equipment" },
  { key: "server", label: "Server Racks", icon: Server },
  { key: "ups", label: "UPS Units", icon: Zap },
  { key: "battery", label: "Battery Banks", icon: Battery },
] as const;

export default function Index() {
  const [activeNav, setActiveNav] = useState("env-dashboard");
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? rackData : rackData.filter((r) => r.category === filter);

  const renderContent = () => {
    switch (activeNav) {
      case "env-reports":
        return <EnvironmentalReports />;
      case "power-dashboard":
        return <PowerDashboard />;
      case "power-reports":
        return <PowerReports />;
      case "all-users":
        return <SystemUsers />;
      case "battery":
        return <BatteryTrends />;
      default:
        return (
          <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
            <StatsBar />

            {/* Layout images */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="bg-primary/10 px-4 py-2">
                  <h3 className="font-display text-sm font-bold text-foreground tracking-wider">DATA CENTER LAYOUT</h3>
                </div>
                <img src={datacenterLayout} alt="Data Center Layout" className="w-full h-64 object-cover" />
              </div>
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="bg-primary/10 px-4 py-2">
                  <h3 className="font-display text-sm font-bold text-foreground tracking-wider">POWER ROOM LAYOUT</h3>
                </div>
                <img src={powerroomLayout} alt="Power Room Layout" className="w-full h-64 object-cover" />
              </div>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setFilter(cat.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all border ${
                    filter === cat.key
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                  }`}
                >
                  {"icon" in cat && cat.icon && <cat.icon className="w-3.5 h-3.5" />}
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filtered.map((rack, i) => (
                <TemperatureCard key={rack.name} rack={rack} index={i} />
              ))}
            </div>

            <TemperatureChart />
          </div>
        );
    }
  };

  return (
    <AppLayout activeNav={activeNav} onNavChange={setActiveNav}>
      {renderContent()}
    </AppLayout>
  );
}
