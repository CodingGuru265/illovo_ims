import { useState, useEffect, useCallback } from "react";
import { rackData } from "@/data/sensorData";
import { Loader2 } from "lucide-react";
import { api, type ReportsResponse } from "@/lib/api";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine,
} from "recharts";

const serverRacks = rackData.filter((r) => r.category === "server");

const defaultThresholds: ReportsResponse["thresholds"] = {
  temp_upper: 25,
  temp_lower: 17,
  humi_upper: 44,
  humi_lower: 25,
};

export default function EnvironmentalReports() {
  const today = new Date().toISOString().split("T")[0];

  const [selectedRack, setSelectedRack] = useState(serverRacks[0]?.name ?? "");
  const [selectedAisle, setSelectedAisle] = useState("Cold Aisle");
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [reportData, setReportData] = useState<ReportsResponse["data"]>([]);
  const [thresholds, setThresholds] = useState<ReportsResponse["thresholds"]>(defaultThresholds);
  const [loading, setLoading] = useState(false);

  const loadReports = useCallback(async () => {
    if (!selectedRack || !selectedAisle || !fromDate || !toDate) return;

    setLoading(true);
    const response = await api.getReports({
      rack: selectedRack,
      aisle: selectedAisle,
      from_date: fromDate,
      to_date: toDate,
    });

    if (response) {
      setReportData(response.data);
      setThresholds(response.thresholds);
    }
    setLoading(false);
  }, [selectedRack, selectedAisle, fromDate, toDate]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

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
        <button
          onClick={loadReports}
          disabled={loading}
          className="bg-primary text-primary-foreground px-5 py-2 rounded-md text-xs font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate"}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span className="text-sm">Loading report data...</span>
        </div>
      ) : reportData.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
          <p className="text-sm">No data available for the selected filters.</p>
        </div>
      ) : (
        <>
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
                <AreaChart data={reportData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,10%,88%)" />
                  <XAxis dataKey="time" tick={{ fontSize: 9, fill: "hsl(220,10%,45%)" }} />
                  <YAxis domain={[0, 60]} tick={{ fontSize: 10, fill: "hsl(220,10%,45%)" }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid hsl(220,10%,88%)" }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <ReferenceLine y={thresholds.temp_upper} stroke="hsl(0,80%,50%)" strokeWidth={2} label={{ value: "Upper Threshold", position: "right", fontSize: 9, fill: "hsl(0,80%,50%)" }} />
                  <ReferenceLine y={thresholds.temp_lower} stroke="hsl(140,60%,40%)" strokeWidth={2} label={{ value: "Lower Threshold", position: "right", fontSize: 9, fill: "hsl(140,60%,40%)" }} />
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
                <AreaChart data={reportData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,10%,88%)" />
                  <XAxis dataKey="time" tick={{ fontSize: 9, fill: "hsl(220,10%,45%)" }} />
                  <YAxis domain={[0, 90]} tick={{ fontSize: 10, fill: "hsl(220,10%,45%)" }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid hsl(220,10%,88%)" }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <ReferenceLine y={thresholds.humi_upper} stroke="hsl(0,80%,50%)" strokeWidth={2} label={{ value: "Upper Threshold", position: "right", fontSize: 9, fill: "hsl(0,80%,50%)" }} />
                  <ReferenceLine y={thresholds.humi_lower} stroke="hsl(140,60%,40%)" strokeWidth={2} label={{ value: "Lower Threshold", position: "right", fontSize: 9, fill: "hsl(140,60%,40%)" }} />
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
        </>
      )}
    </div>
  );
}
