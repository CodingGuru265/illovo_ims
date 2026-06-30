import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { temperatureHistory } from "@/data/sensorData";

const coldLines = [
  { key: "serverRack1", name: "Server Rack 1", color: "hsl(348, 72%, 52%)" },
  { key: "serverRack2", name: "Server Rack 2", color: "hsl(199, 80%, 48%)" },
];

// Generate hot aisle history data
const hotAisleHistory = temperatureHistory.map((entry) => ({
  time: entry.time,
  exadata: +(entry.exadata + 18 + (Math.random() - 0.5) * 2).toFixed(1),
  t24Old: +(entry.t24Old + 16 + (Math.random() - 0.5) * 2).toFixed(1),
  t241: +(entry.t241 + 15 + (Math.random() - 0.5) * 2).toFixed(1),
  t242: +(entry.t242 + 8 + (Math.random() - 0.5) * 2).toFixed(1),
}));

const hotLines = [
  { key: "serverRack1", name: "Server Rack 1", color: "hsl(0, 80%, 50%)" },
  { key: "serverRack2", name: "Server Rack 2", color: "hsl(30, 90%, 50%)" },
  { key: "t241", name: "T24-1", color: "hsl(280, 60%, 55%)" },
  { key: "t242", name: "T24-2", color: "hsl(180, 60%, 45%)" },
];

function ChartCard({ title, data, lines, domainMin, domainMax }: { title: string; data: typeof temperatureHistory; lines: typeof coldLines; domainMin: number; domainMax: number }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex-1 min-w-0">
      <h3 className="font-display text-sm font-semibold text-foreground mb-4 tracking-wide">
        {title}
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 10%, 88%)" />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(220, 10%, 45%)" }} stroke="hsl(220, 10%, 88%)" />
            <YAxis tick={{ fontSize: 10, fill: "hsl(220, 10%, 45%)" }} stroke="hsl(220, 10%, 88%)" domain={[domainMin, domainMax]} />
            <Tooltip
              contentStyle={{ backgroundColor: "hsl(0, 0%, 100%)", border: "1px solid hsl(220, 10%, 88%)", borderRadius: "8px", fontSize: 11 }}
              labelStyle={{ color: "hsl(220, 15%, 20%)" }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {lines.map((l) => (
              <Line key={l.key} type="monotone" dataKey={l.key} name={l.name} stroke={l.color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function TemperatureChart() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <ChartCard title="24h Temperature Trend — Cold Aisle" data={temperatureHistory} lines={coldLines} domainMin={14} domainMax={26} />
      <ChartCard title="24h Temperature Trend — Hot Aisle" data={hotAisleHistory} lines={hotLines} domainMin={25} domainMax={45} />
    </div>
  );
}
