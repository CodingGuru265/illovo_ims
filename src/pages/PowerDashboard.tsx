import { useState } from "react";
import { rackData } from "@/data/sensorData";
import serverRackImg from "@/assets/server-rack.png";

interface UpsState {
  [rackName: string]: { ups1: boolean; ups2: boolean };
}

// Group racks in pairs for display cards
const rackPairs = [
  ["Exadata", "NBS T24 OLD"],
  ["NBS T24-1", "NBS T24-2"],
  ["NBS Cyber Backup", "NBS Coms. Rack"],
  ["NICO Tech 1", "NICO Tech 2"],
];

export default function PowerDashboard() {
  const [upsStates, setUpsStates] = useState<UpsState>(() => {
    const initial: UpsState = {};
    rackData.forEach((r) => {
      initial[r.name] = { ups1: true, ups2: true };
    });
    return initial;
  });

  const toggleUps = (rackName: string, ups: "ups1" | "ups2") => {
    setUpsStates((prev) => ({
      ...prev,
      [rackName]: { ...prev[rackName], [ups]: !prev[rackName]?.[ups] },
    }));
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {rackPairs.map((pair) => {
          const rack1 = rackData.find((r) => r.name === pair[0]);
          const rack2 = rackData.find((r) => r.name === pair[1]);
          if (!rack1) return null;

          return (
            <div
              key={pair.join("-")}
              className="bg-card border-2 border-primary/30 rounded-xl overflow-hidden shadow-sm"
            >
              {/* Timestamp header */}
              <div className="text-center py-2 text-xs text-muted-foreground">
                Last Posted: {rack1.timestamp}
              </div>

              {/* Rack names */}
              <div className="flex justify-around px-4 mb-2">
                <h3 className="font-display text-sm font-bold text-foreground">{rack1.name}</h3>
                {rack2 && <h3 className="font-display text-sm font-bold text-foreground">{rack2.name}</h3>}
              </div>

              {/* Rack images */}
              <div className="flex justify-around items-end px-4 pb-4">
                <img
                  src={serverRackImg}
                  alt={rack1.name}
                  className="h-48 object-contain"
                  loading="lazy"
                />
                {rack2 && (
                  <img
                    src={serverRackImg}
                    alt={rack2.name}
                    className="h-48 object-contain"
                    loading="lazy"
                  />
                )}
              </div>

              {/* UPS toggles */}
              <div className="flex justify-around border-t border-border px-4 py-3">
                {/* Rack 1 toggles */}
                <div className="flex items-center gap-4">
                  <ToggleSwitch
                    label="UPS 1"
                    on={upsStates[rack1.name]?.ups1 ?? true}
                    onToggle={() => toggleUps(rack1.name, "ups1")}
                  />
                  <ToggleSwitch
                    label="UPS 2"
                    on={upsStates[rack1.name]?.ups2 ?? true}
                    onToggle={() => toggleUps(rack1.name, "ups2")}
                  />
                </div>
                {rack2 && (
                  <div className="flex items-center gap-4">
                    <ToggleSwitch
                      label="UPS 1"
                      on={upsStates[rack2.name]?.ups1 ?? true}
                      onToggle={() => toggleUps(rack2.name, "ups1")}
                    />
                    <ToggleSwitch
                      label="UPS 2"
                      on={upsStates[rack2.name]?.ups2 ?? true}
                      onToggle={() => toggleUps(rack2.name, "ups2")}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ToggleSwitch({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-14 items-center rounded-full transition-colors ${
          on ? "bg-success" : "bg-muted"
        }`}
      >
        <span className={`absolute left-1 text-[9px] font-bold ${on ? "text-white" : "text-transparent"}`}>
          ON
        </span>
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
            on ? "translate-x-8" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
