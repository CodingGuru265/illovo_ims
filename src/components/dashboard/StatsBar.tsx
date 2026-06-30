import { useState } from "react";
import { Thermometer, AlertTriangle, Server, Droplets, X } from "lucide-react";
import { rackData } from "@/data/sensorData";

export default function StatsBar() {
  const [showAlerts, setShowAlerts] = useState(false);

  const totalRacks = rackData.length;
  const allSensors = rackData.flatMap((r) => r.sensors.map((s) => ({ rack: r.name, ...s })));
  const outOfRangeSensors = allSensors.filter((s) => s.temperature < s.range[0] || s.temperature > s.range[1]);
  const alertCount = outOfRangeSensors.length;
  const avgTemp = (allSensors.reduce((sum, s) => sum + s.temperature, 0) / allSensors.length).toFixed(1);
  const avgHumidity = (rackData.filter((r) => r.humidity).reduce((sum, r) => sum + (r.humidity ?? 0), 0) / rackData.filter((r) => r.humidity).length).toFixed(0);

  const stats = [
    { label: "Active Racks", value: totalRacks.toString(), icon: Server, color: "text-primary", clickable: false },
    { label: "Avg Temperature", value: `${avgTemp}°C`, icon: Thermometer, color: "text-primary", clickable: false },
    { label: "Avg Humidity", value: `${avgHumidity}%`, icon: Droplets, color: "text-accent", clickable: false },
    { label: "Alerts", value: alertCount.toString(), icon: AlertTriangle, color: alertCount > 0 ? "text-destructive" : "text-success", clickable: alertCount > 0 },
  ];

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            onClick={stat.clickable ? () => setShowAlerts(true) : undefined}
            className={`bg-card border border-border rounded-xl p-4 flex items-center gap-4 shadow-sm ${stat.clickable ? "cursor-pointer hover:border-primary/50 transition-colors" : ""} ${stat.label === "Alerts" && alertCount > 0 ? "animate-glow-pulse" : ""}`}
          >
            <div className={`w-10 h-10 rounded-lg bg-secondary flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-display font-bold text-foreground">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts modal */}
      {showAlerts && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAlerts(false)}>
          <div className="bg-card border border-border rounded-xl shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="font-display text-sm font-bold text-foreground">Active Alerts ({alertCount})</h3>
              <button onClick={() => setShowAlerts(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-3 max-h-[60vh] overflow-auto">
              {outOfRangeSensors.map((s, i) => {
                const isAbove = s.temperature > s.range[1];
                return (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-primary/30 bg-primary/5">
                    <div>
                      <p className="text-xs font-bold text-foreground">{s.rack}</p>
                      <p className="text-[10px] text-muted-foreground">{s.label}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">{s.temperature}°C</p>
                      <p className="text-[10px] text-muted-foreground">
                        {isAbove ? "Above" : "Below"} range ({s.range[0]}–{s.range[1]}°C)
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
