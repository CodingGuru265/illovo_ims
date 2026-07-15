import { useState, useEffect } from "react";
/*import Sidebar from "@/components/dashboard/Sidebar";*/
import AppLayout from "@/components/layout/AppLayout";
import StatsBar from "@/components/dashboard/StatsBar";
import TemperatureCard from "@/components/dashboard/TemperatureCard";
import TemperatureChart from "@/components/dashboard/TemperatureChart";
import { rackData as defaultRackData, type RackData } from "@/data/sensorData";
import { api, type DashboardData } from "@/lib/api";
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
] as const;

function mapDashboardToRacks(data: DashboardData): RackData[] {
  const timestamp = data.last_posted_data ?? "--";

  const buildRack = (
    name: string,
    defaultRack: RackData,
    coldTemp: number | null,
    hotTemp: number | null,
    coldHumi: number | null,
    hotHumi: number | null,
    lowerThreshold: number | null,
    upperThreshold: number | null
  ): RackData => {
    const defaultCold = defaultRack.sensors.find((s) => s.label === "Cold Aisle")?.temperature ?? 0;
    const defaultHot = defaultRack.sensors.find((s) => s.label === "Hot Aisle")?.temperature ?? 0;
    const defaultColdRange = defaultRack.sensors.find((s) => s.label === "Cold Aisle")?.range ?? [17, 24];
    const defaultHotRange = defaultRack.sensors.find((s) => s.label === "Hot Aisle")?.range ?? [35, 43];
    const defaultHumidity = defaultRack.humidity ?? 0;

    const hasApiThresholds = lowerThreshold !== null && upperThreshold !== null;
    const coldRange: [number, number] = hasApiThresholds
      ? [lowerThreshold, upperThreshold]
      : defaultColdRange;
    const hotRange: [number, number] = hasApiThresholds
      ? [lowerThreshold, upperThreshold]
      : defaultHotRange;

    return {
      ...defaultRack,
      name,
      sensors: [
        { label: "Cold Aisle", temperature: coldTemp ?? defaultCold, range: coldRange },
        { label: "Hot Aisle", temperature: hotTemp ?? defaultHot, range: hotRange },
      ],
      humidity: coldHumi ?? hotHumi ?? defaultHumidity,
      lastPosted: timestamp,
      timestamp,
    };
  };

  return [
    buildRack(
      "Server Rack 1",
      defaultRackData[0],
      data.server_rack_1_temp_cold_aisle,
      data.server_rack_1_temp_hot_aisle,
      data.server_rack_1_humi_cold_aisle,
      data.server_rack_1_humi_hot_aisle,
      data.server_rack_1_temp_lower_threshold,
      data.server_rack_1_temp_upper_threshold
    ),
    buildRack(
      "Server Rack 2",
      defaultRackData[1],
      data.server_rack_2_temp_cold_aisle,
      data.server_rack_2_temp_hot_aisle,
      data.server_rack_2_humi_cold_aisle,
      data.server_rack_2_humi_hot_aisle,
      data.server_rack_2_temp_lower_threshold,
      data.server_rack_2_temp_upper_threshold
    ),
  ];
}

export default function Index() {
  const [activeNav, setActiveNav] = useState("env-dashboard");
  const [filter, setFilter] = useState<string>("all");
  const [racks, setRacks] = useState<RackData[]>(defaultRackData);

  useEffect(() => {
    let mounted = true;

    api.getDashboard().then((data) => {
      if (mounted && data) {
        setRacks(mapDashboardToRacks(data));
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = filter === "all" ? racks : racks.filter((r) => r.category === filter);

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
            <StatsBar racks={racks} />

            {/* Layout images */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="bg-[#006738]/10 px-4 py-2">
                  <h3 className="font-display text-sm font-bold text-foreground text-center tracking-wider">DATA CENTER LAYOUT</h3>
                </div>
                <img src={datacenterLayout} alt="Data Center Layout" className="w-full h-64 object-cover" />
              </div>
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="bg-[#006738]/10 px-4 py-2">
                  <h3 className="font-display text-sm font-bold text-foreground text-center tracking-wider">LIVE READINGS</h3>
                </div>
                  
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 px-2 py-2">
                  {filtered.map((rack, i) => (
                    <TemperatureCard key={rack.name} rack={rack} index={i} />
                  ))}
                </div>
              </div>
              {/*<div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="bg-[#006738]/10 px-4 py-2">
                  <h3 className="font-display text-sm font-bold text-foreground text-center tracking-wider">UPS ROOM LAYOUT</h3>
                </div>
                <img src={powerroomLayout} alt="Power Room Layout" className="w-full h-64 object-cover" />
              </div>*/}
            </div>

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
