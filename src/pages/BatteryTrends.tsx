import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from "recharts";
import { rackData } from "@/data/sensorData";
import { Battery, Thermometer, Activity } from "lucide-react";

const batteryData = rackData.filter((r) => r.category === "battery");

const batteryTrendData = [
  { time: "00:00", bank1: 17.2, bank2: 16.8, bank3: 14.5, bank4: 17.0 },
  { time: "04:00", bank1: 17.5, bank2: 17.0, bank3: 14.7, bank4: 17.2 },
  { time: "08:00", bank1: 17.9, bank2: 17.4, bank3: 14.9, bank4: 17.6 },
  { time: "12:00", bank1: 18.3, bank2: 17.8, bank3: 15.2, bank4: 18.0 },
  { time: "16:00", bank1: 18.1, bank2: 17.6, bank3: 15.0, bank4: 17.8 },
  { time: "20:00", bank1: 17.7, bank2: 17.2, bank3: 14.8, bank4: 17.4 },
];

const voltageData = [
  { time: "00:00", voltage: 54.2, current: 12.5 },
  { time: "04:00", voltage: 54.0, current: 12.3 },
  { time: "08:00", voltage: 53.8, current: 13.1 },
  { time: "12:00", voltage: 53.5, current: 13.8 },
  { time: "16:00", voltage: 53.7, current: 13.4 },
  { time: "20:00", voltage: 54.0, current: 12.8 },
];

export default function BatteryTrends() {
  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <h2 className="font-display text-lg font-bold text-foreground tracking-wider">Battery Trends</h2>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-primary">
            <Battery className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Battery Banks</p>
            <p className="text-xl font-display font-bold text-foreground">{batteryData.length}</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-accent">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Avg Temp</p>
            <p className="text-xl font-display font-bold text-foreground">
              {(batteryData.reduce((sum, b) => sum + b.sensors[0].temperature, 0) / batteryData.length).toFixed(1)}°C
            </p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-success">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Health Status</p>
            <p className="text-xl font-display font-bold text-success">Good</p>
          </div>
        </div>
      </div>

      {/* Temperature Trends */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <h3 className="font-display text-sm font-semibold text-foreground mb-4">Battery Temperature Trends (24h)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={batteryTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 10%, 88%)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(220, 10%, 45%)" }} stroke="hsl(220, 10%, 88%)" />
              <YAxis tick={{ fontSize: 10, fill: "hsl(220, 10%, 45%)" }} stroke="hsl(220, 10%, 88%)" domain={[13, 20]} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(0, 0%, 100%)", border: "1px solid hsl(220, 10%, 88%)", borderRadius: "8px", fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="bank1" name="Bank 1" stroke="hsl(348, 72%, 52%)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="bank2" name="Bank 2" stroke="hsl(199, 80%, 48%)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="bank3" name="Bank 3" stroke="hsl(152, 60%, 45%)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="bank4" name="Bank 4" stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Voltage/Current */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <h3 className="font-display text-sm font-semibold text-foreground mb-4">Battery Voltage & Current (24h)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={voltageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 10%, 88%)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(220, 10%, 45%)" }} stroke="hsl(220, 10%, 88%)" />
              <YAxis tick={{ fontSize: 10, fill: "hsl(220, 10%, 45%)" }} stroke="hsl(220, 10%, 88%)" />
              <Tooltip contentStyle={{ backgroundColor: "hsl(0, 0%, 100%)", border: "1px solid hsl(220, 10%, 88%)", borderRadius: "8px", fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="voltage" name="Voltage (V)" stroke="hsl(348, 72%, 52%)" fill="hsl(348, 72%, 52%, 0.1)" strokeWidth={2} />
              <Area type="monotone" dataKey="current" name="Current (A)" stroke="hsl(199, 80%, 48%)" fill="hsl(199, 80%, 48%, 0.1)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
