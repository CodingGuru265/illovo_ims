import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, X } from "lucide-react";
import type { RackData } from "@/data/sensorData";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";

function getTempStatus(temp: number, range: [number, number]): "normal" | "warning" | "critical" {
  //if (temp < range[0] * 0.9 || temp > range[1] * 1.1) return "critical";
  //if (temp < range[0] || temp > range[1]) return "warning";
  if ( temp > range[1] * 1.1) return "critical";
  if ( temp > range[1]) return "warning";
  return "normal";
}

function sensorBorderColor(status: string) {
  switch (status) {
    case "critical": return "border-primary";
    case "warning": return "border-primary";
    default: return "border-accent";
  }
}

function sensorTextColor(status: string) {
  switch (status) {
    case "critical": return "text-primary";
    case "warning": return "text-primary";
    default: return "text-accent";
  }
}

function rangeBgColor(status: string) {
  switch (status) {
    case "critical": return "bg-primary text-primary-foreground";
    case "warning": return "bg-primary text-primary-foreground";
    default: return "bg-accent text-accent-foreground";
  }
}

function isOutOfRange(temp: number, range: [number, number]) {
  //return temp < range[0] || temp > range[1];
  return temp > range[1];
}

// Generate 30 mock records for modal
function generateTrendRecords(baseTemp: number) {
  const records = [];
  for (let i = 29; i >= 0; i--) {
    const time = `${String(Math.floor((8 * 60 - i * 10) / 60)).padStart(2, "0")}:${String((8 * 60 - i * 10) % 60).padStart(2, "0")}`;
    records.push({
      time,
      temperature: +(baseTemp + (Math.random() - 0.4) * 4).toFixed(1),
    });
  }
  return records;
}

interface Props {
  rack: RackData;
  index: number;
}

export default function TemperatureCard({ rack, index }: Props) {
  const [modalSensor, setModalSensor] = useState<null | { label: string; temperature: number; range: [number, number] }>(null);

  const hasOutOfRange = rack.sensors.some((s) => isOutOfRange(s.temperature, s.range));

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y:20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.4 }}
        className={`bg-card border border-border rounded-xl overflow-hidden shadow-sm ${hasOutOfRange ? "animate-glow-pulse" : ""}`}
      >
        {/* Header */}
        <div className="bg-[#006738]/90 px-4 py-3">
          <h3 className="font-display text-sm font-semibold text-[#ffffff] tracking-wide text-center">{rack.name}</h3>
        </div>

        {/* Sensors */}
        <div className="p-4 space-y-3">
          <div className={`grid gap-3 ${rack.sensors.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
            {rack.sensors.map((sensor) => {
              const sStatus = getTempStatus(sensor.temperature, sensor.range);
              const outOfRange = isOutOfRange(sensor.temperature, sensor.range);
              return (
                <div
                  key={sensor.label}
                  onClick={() => setModalSensor(sensor)}
                  className={`rounded-xl border-2 p-3 text-center cursor-pointer hover:shadow-md transition-shadow ${sensorBorderColor(sStatus)} ${outOfRange ? "animate-glow-pulse" : ""}`}
                >
                  <p className={`text-[11px] font-semibold ${sensorTextColor(sStatus)}`}>
                    {sensor.label}
                  </p>
                  <p className="text-2xl font-display font-bold mt-1 text-foreground">
                    {sensor.temperature}°C
                  </p>
                  <div className={`inline-block rounded-full px-3 py-0.5 mt-2 text-[10px] font-bold ${rangeBgColor(sStatus)}`}>
                    {sensor.range[0]}°C - {sensor.range[1]}°C
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer info */}
          <div className="text-center pt-2 border-t border-border">
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span className="text-[10px]">Last Posted: {rack.lastPosted}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Timestamp: {rack.timestamp}</p>
          </div>
        </div>
      </motion.div>

      {/* Modal for last 30 records */}
      {modalSensor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setModalSensor(null)}>
          <div className="bg-card border border-border rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div>
                <h3 className="font-display text-sm font-bold text-foreground">{rack.name} — {modalSensor.label}</h3>
                <p className="text-[10px] text-muted-foreground">Last 30 readings trend</p>
              </div>
              <button onClick={() => setModalSensor(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={generateTrendRecords(modalSensor.temperature)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,10%,88%)" />
                  <XAxis dataKey="time" tick={{ fontSize: 8, fill: "hsl(220,10%,45%)" }} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(220,10%,45%)" }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <ReferenceLine y={modalSensor.range[1]} stroke="hsl(0,80%,50%)" strokeWidth={2} label={{ value: "Upper", position: "right", fontSize: 9, fill: "hsl(0,80%,50%)" }} />
                  <ReferenceLine y={modalSensor.range[0]} stroke="hsl(140,60%,40%)" strokeWidth={2} label={{ value: "Lower", position: "right", fontSize: 9, fill: "hsl(140,60%,40%)" }} />
                  <Area type="monotone" dataKey="temperature" stroke="hsl(348,72%,52%)" fill="hsl(348,72%,80%)" fillOpacity={0.5} strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
