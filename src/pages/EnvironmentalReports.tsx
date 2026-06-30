import { useState, useMemo } from "react";
import { rackData } from "@/data/sensorData";
import { Download } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine,
} from "recharts";

const serverRacks = rackData.filter((r) => r.category === "server");

// Generate mock time-series data
function generateTrendData(baseTemp: number, baseHumidity: number) {
  const data = [];
  for (let h = 0; h < 9; h++) {
    for (let m = 0; m < 60; m += 10) {
      const time = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      data.push({
        time,
        temperature: +(baseTemp + (Math.random() - 0.4) * 4).toFixed(1),
        humidity: +(baseHumidity + (Math.random() - 0.3) * 12).toFixed(1),
      });
    }
  }
  return data;
}

export default function EnvironmentalReports() {
  const [selectedRack, setSelectedRack] = useState(serverRacks[0]?.name ?? "");
  const [selectedAisle, setSelectedAisle] = useState("Cold Aisle");
  const [fromDate, setFromDate] = useState("2026-04-16");
  const [toDate, setToDate] = useState("2026-04-16");

  const rack = rackData.find((r) => r.name === selectedRack);
  const sensor = rack?.sensors.find((s) => s.label === selectedAisle);

  const trendData = useMemo(
    () => generateTrendData(sensor?.temperature ?? 22, rack?.humidity ?? 30),
    [selectedRack, selectedAisle]
  );

  const tempLower = sensor?.range[0] ?? 17;
  const tempUpper = sensor?.range[1] ?? 25;
  const humidityLower = 25;
  const humidityUpper = 44;

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <h2 className="font-display text-lg font-bold text-foreground tracking-wider">
        Reports - Headquarters Data Center
      </h2>

      {/* Filters row */}
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-xs font-bold text-primary mb-1">Select Rack</label>
          <select
            value={selectedRack}
            onChange={(e) => setSelectedRack(e.target.value)}
            className="border border-border rounded-md px-3 py-2 text-xs bg-card text-foreground min-w-[160px]"
          >
            {serverRacks.map((r) => (
              <option key={r.name} value={r.name}>{r.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-primary mb-1">Select Aisle</label>
          <select
            value={selectedAisle}
            onChange={(e) => setSelectedAisle(e.target.value)}
            className="border border-border rounded-md px-3 py-2 text-xs bg-card text-foreground min-w-[140px]"
          >
            <option>Cold Aisle</option>
            <option>Hot Aisle</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-primary mb-1">Select From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border border-border rounded-md px-3 py-2 text-xs bg-card text-foreground"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-primary mb-1">Select To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border border-border rounded-md px-3 py-2 text-xs bg-card text-foreground"
          />
        </div>
        <button className="bg-primary text-primary-foreground px-5 py-2 rounded-md text-xs font-bold hover:bg-primary/90 transition-colors">
          Generate
        </button>
      </div>

      {/* Temperature Trends */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="flex items-center gap-3 px-5 py-3 border-b border-border">
          <span className="text-sm font-medium text-foreground">Temperature Trends</span>
          <button className="bg-[hsl(220,60%,35%)] text-white px-3 py-1 rounded text-xs font-medium">
            Export
          </button>
        </div>
        <div className="p-5 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,10%,88%)" />
              <XAxis dataKey="time" tick={{ fontSize: 9, fill: "hsl(220,10%,45%)" }} />
              <YAxis domain={[0, 60]} tick={{ fontSize: 10, fill: "hsl(220,10%,45%)" }} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid hsl(220,10%,88%)" }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine y={tempUpper} stroke="hsl(0,80%,50%)" strokeWidth={2} label={{ value: "Upper Threshold", position: "right", fontSize: 9, fill: "hsl(0,80%,50%)" }} />
              <ReferenceLine y={tempLower} stroke="hsl(140,60%,40%)" strokeWidth={2} label={{ value: "Lower Threshold", position: "right", fontSize: 9, fill: "hsl(140,60%,40%)" }} />
              <Area
                type="monotone"
                dataKey="temperature"
                name="Temperature (C)"
                stroke="hsl(50,80%,50%)"
                fill="hsl(50,80%,80%)"
                fillOpacity={0.6}
                strokeWidth={1.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Humidity Trends */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="flex items-center gap-3 px-5 py-3 border-b border-border">
          <span className="text-sm font-medium text-foreground">Humidity Trends</span>
          <button className="bg-[hsl(220,60%,35%)] text-white px-3 py-1 rounded text-xs font-medium">
            Export
          </button>
        </div>
        <div className="p-5 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,10%,88%)" />
              <XAxis dataKey="time" tick={{ fontSize: 9, fill: "hsl(220,10%,45%)" }} />
              <YAxis domain={[0, 90]} tick={{ fontSize: 10, fill: "hsl(220,10%,45%)" }} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid hsl(220,10%,88%)" }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine y={humidityUpper} stroke="hsl(0,80%,50%)" strokeWidth={2} label={{ value: "Upper Threshold", position: "right", fontSize: 9, fill: "hsl(0,80%,50%)" }} />
              <ReferenceLine y={humidityLower} stroke="hsl(140,60%,40%)" strokeWidth={2} label={{ value: "Lower Threshold", position: "right", fontSize: 9, fill: "hsl(140,60%,40%)" }} />
              <Area
                type="monotone"
                dataKey="humidity"
                name="Humidity (%)"
                stroke="hsl(199,80%,48%)"
                fill="hsl(199,80%,80%)"
                fillOpacity={0.5}
                strokeWidth={1.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
