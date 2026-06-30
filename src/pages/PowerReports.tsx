import { useState, useMemo } from "react";
import { rackData } from "@/data/sensorData";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";

// UPS pairs based on server racks
const upsPairs = [
  { name: "Exadata", ups1: "Exadata UPS 1", ups2: "Exadata UPS 2" },
  { name: "NBS T24 OLD", ups1: "NBS T24 Old UPS 1", ups2: "NBS T24 Old UPS 2" },
  { name: "NBS T24-1", ups1: "NBS T24-1 UPS 1", ups2: "NBS T24-1 UPS 2" },
  { name: "NBS T24-2", ups1: "NBS T24-2 UPS 1", ups2: "NBS T24-2 UPS 2" },
  { name: "NBS Cyber Backup", ups1: "Cyber Backup UPS 1", ups2: "Cyber Backup UPS 2" },
  { name: "NBS Coms. Rack", ups1: "Coms UPS 1", ups2: "Coms UPS 2" },
];

function generateUpsTimeline() {
  const data = [];
  for (let h = 0; h < 8; h++) {
    for (let m = 0; m < 60; m += 20) {
      const time = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      // mostly ON (1), occasional brief OFF (0)
      const isOn = Math.random() > 0.03 ? 1 : 0;
      data.push({ time, state: isOn });
    }
  }
  return data;
}

export default function PowerReports() {
  const [fromDate, setFromDate] = useState("2026-04-16");
  const [toDate, setToDate] = useState("2026-04-16");

  const upsData = useMemo(() => {
    const map: Record<string, ReturnType<typeof generateUpsTimeline>> = {};
    upsPairs.forEach((pair) => {
      map[pair.ups1] = generateUpsTimeline();
      map[pair.ups2] = generateUpsTimeline();
    });
    return map;
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <h2 className="font-display text-lg font-bold text-foreground tracking-wider">
        Reports - UPS Power State
      </h2>

      {/* Date filters */}
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-xs font-bold text-foreground mb-1">Select From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border border-border rounded-md px-3 py-2 text-xs bg-card text-foreground min-w-[200px]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-foreground mb-1">Select To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border border-border rounded-md px-3 py-2 text-xs bg-card text-foreground min-w-[200px]"
          />
        </div>
        <button className="bg-primary text-primary-foreground px-5 py-2 rounded-md text-xs font-bold hover:bg-primary/90 transition-colors">
          Generate
        </button>
      </div>

      {/* UPS Charts in pairs */}
      {upsPairs.map((pair) => (
        <div key={pair.name} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[pair.ups1, pair.ups2].map((upsName) => (
            <div key={upsName} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
              <div className="flex items-center gap-3 px-5 py-3 border-b border-border">
                <span className="text-sm font-medium text-foreground">{upsName}</span>
                <button className="bg-primary text-primary-foreground px-3 py-1 rounded text-xs font-bold">
                  Export
                </button>
              </div>
              <div className="p-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={upsData[upsName]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,10%,88%)" />
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 8, fill: "hsl(220,10%,45%)" }}
                      angle={-45}
                      textAnchor="end"
                      height={50}
                    />
                    <YAxis
                      domain={[0, 1]}
                      ticks={[0, 1]}
                      tickFormatter={(v) => (v === 1 ? "ON" : "OFF")}
                      tick={{ fontSize: 10, fill: "hsl(220,10%,45%)" }}
                      label={{ value: "Power State", angle: -90, position: "insideLeft", fontSize: 10, fill: "hsl(220,10%,45%)" }}
                    />
                    <Tooltip
                      formatter={(value: number) => [value === 1 ? "ON" : "OFF", "State"]}
                      contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid hsl(220,10%,88%)" }}
                    />
                    <Area
                      type="stepAfter"
                      dataKey="state"
                      stroke="hsl(50,80%,45%)"
                      fill="hsl(55,85%,80%)"
                      fillOpacity={0.8}
                      strokeWidth={1}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
