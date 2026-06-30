export interface SensorReading {
  label: string;
  temperature: number;
  range: [number, number];
}

export interface RackData {
  name: string;
  category: "server" | "ups" | "battery";
  sensors: SensorReading[];
  lastPosted: string;
  timestamp: string;
  status: "normal" | "warning" | "critical";
  humidity?: number;
}

export const rackData: RackData[] = [
  {
    name: "Exadata",
    category: "server",
    sensors: [
      { label: "Cold Aisle", temperature: 21.5, range: [17, 24] },
      { label: "Hot Aisle", temperature: 40.3, range: [35, 43] },
    ],
    lastPosted: "2 minutes ago",
    timestamp: "08:43 on 16-04-2026",
    status: "warning",
    humidity: 45,
  },
  {
    name: "NBS T24 OLD",
    category: "server",
    sensors: [
      { label: "Cold Aisle", temperature: 23.4, range: [25, 43] },
      { label: "Hot Aisle", temperature: 39.2, range: [31, 38] },
    ],
    lastPosted: "2 minutes ago",
    timestamp: "08:43 on 16-04-2026",
    status: "critical",
    humidity: 42,
  },
  {
    name: "NBS T24-1",
    category: "server",
    sensors: [
      { label: "Cold Aisle", temperature: 22.9, range: [17, 24] },
      { label: "Hot Aisle", temperature: 37.4, range: [31, 38] },
    ],
    lastPosted: "2 minutes ago",
    timestamp: "08:43 on 16-04-2026",
    status: "normal",
    humidity: 48,
  },
  {
    name: "NBS T24-2",
    category: "server",
    sensors: [
      { label: "Cold Aisle", temperature: 22.5, range: [25, 31] },
      { label: "Hot Aisle", temperature: 29.8, range: [25, 31] },
    ],
    lastPosted: "2 minutes ago",
    timestamp: "08:43 on 16-04-2026",
    status: "normal",
    humidity: 50,
  },
  {
    name: "NBS Cyber Backup",
    category: "server",
    sensors: [
      { label: "Cold Aisle", temperature: 18.8, range: [17, 24] },
      { label: "Hot Aisle", temperature: 28.5, range: [25, 31] },
    ],
    lastPosted: "2 minutes ago",
    timestamp: "08:43 on 16-04-2026",
    status: "normal",
    humidity: 52,
  },
  {
    name: "NBS Coms. Rack",
    category: "server",
    sensors: [
      { label: "Cold Aisle", temperature: 19.8, range: [17, 24] },
      { label: "Hot Aisle", temperature: 20.3, range: [20, 27] },
    ],
    lastPosted: "2 minutes ago",
    timestamp: "08:43 on 16-04-2026",
    status: "normal",
    humidity: 47,
  },
  {
    name: "NICO Tech 1",
    category: "server",
    sensors: [
      { label: "Cold Aisle", temperature: 18.0, range: [17, 24] },
      { label: "Hot Aisle", temperature: 24.5, range: [23, 29] },
    ],
    lastPosted: "2 minutes ago",
    timestamp: "08:43 on 16-04-2026",
    status: "normal",
    humidity: 44,
  },
  {
    name: "NICO Tech 2",
    category: "server",
    sensors: [
      { label: "Cold Aisle", temperature: 17.6, range: [15, 23] },
      { label: "Hot Aisle", temperature: 23.0, range: [20, 27] },
    ],
    lastPosted: "2 minutes ago",
    timestamp: "08:43 on 16-04-2026",
    status: "normal",
    humidity: 46,
  },
  {
    name: "UPS 1",
    category: "ups",
    sensors: [
      { label: "Front Panel", temperature: 17.8, range: [25, 28] },
      { label: "Back Panel", temperature: 22.3, range: [25, 28] },
    ],
    lastPosted: "6 hours ago",
    timestamp: "01:58 on 16-04-2026",
    status: "normal",
    humidity: 40,
  },
  {
    name: "UPS 2",
    category: "ups",
    sensors: [
      { label: "Front Panel", temperature: 18.5, range: [25, 28] },
      { label: "Back Panel", temperature: 22.8, range: [25, 28] },
    ],
    lastPosted: "6 hours ago",
    timestamp: "01:58 on 16-04-2026",
    status: "normal",
    humidity: 41,
  },
  {
    name: "Battery Bank 1",
    category: "battery",
    sensors: [
      { label: "Front Panel", temperature: 17.9, range: [25, 28] },
    ],
    lastPosted: "6 hours ago",
    timestamp: "01:58 on 16-04-2026",
    status: "normal",
    humidity: 38,
  },
  {
    name: "Battery Bank 2",
    category: "battery",
    sensors: [
      { label: "Front Panel", temperature: 17.4, range: [25, 28] },
    ],
    lastPosted: "6 hours ago",
    timestamp: "01:58 on 16-04-2026",
    status: "normal",
    humidity: 39,
  },
  {
    name: "Battery Bank 3",
    category: "battery",
    sensors: [
      { label: "Front Panel", temperature: 14.9, range: [25, 28] },
    ],
    lastPosted: "6 hours ago",
    timestamp: "01:58 on 16-04-2026",
    status: "normal",
    humidity: 37,
  },
  {
    name: "Battery Bank 4",
    category: "battery",
    sensors: [
      { label: "Front Panel", temperature: 17.6, range: [25, 28] },
    ],
    lastPosted: "6 hours ago",
    timestamp: "01:58 on 16-04-2026",
    status: "normal",
    humidity: 40,
  },
];

export const temperatureHistory = [
  { time: "00:00", exadata: 20.1, t24Old: 22.8, t241: 21.5, t242: 21.0 },
  { time: "02:00", exadata: 19.8, t24Old: 22.5, t241: 21.2, t242: 20.8 },
  { time: "04:00", exadata: 20.3, t24Old: 23.0, t241: 22.0, t242: 21.5 },
  { time: "06:00", exadata: 20.8, t24Old: 23.2, t241: 22.5, t242: 22.0 },
  { time: "08:00", exadata: 21.5, t24Old: 23.4, t241: 22.9, t242: 22.5 },
  { time: "10:00", exadata: 21.2, t24Old: 23.1, t241: 22.6, t242: 22.2 },
  { time: "12:00", exadata: 21.8, t24Old: 23.6, t241: 23.1, t242: 22.8 },
  { time: "14:00", exadata: 22.1, t24Old: 24.0, t241: 23.4, t242: 23.0 },
  { time: "16:00", exadata: 21.9, t24Old: 23.8, t241: 23.2, t242: 22.7 },
  { time: "18:00", exadata: 21.4, t24Old: 23.3, t241: 22.8, t242: 22.3 },
  { time: "20:00", exadata: 21.0, t24Old: 23.0, t241: 22.4, t242: 21.8 },
  { time: "22:00", exadata: 20.5, t24Old: 22.6, t241: 21.8, t242: 21.3 },
];
