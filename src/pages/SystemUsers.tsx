import { Users, Shield, UserPlus, Search } from "lucide-react";
import { useState } from "react";

const usersData = [
  { name: "Yankho Nkoloma", email: "y.nkoloma@nbsbank.com", role: "System Administrator", status: "Active", lastLogin: "16-04-2026 08:30" },
  { name: "Grace Banda", email: "g.banda@nbsbank.com", role: "IT Manager", status: "Active", lastLogin: "16-04-2026 07:45" },
  { name: "James Phiri", email: "j.phiri@nbsbank.com", role: "Network Engineer", status: "Active", lastLogin: "15-04-2026 17:20" },
  { name: "Mary Chirwa", email: "m.chirwa@nbsbank.com", role: "Data Center Technician", status: "Active", lastLogin: "16-04-2026 06:15" },
  { name: "Peter Kamanga", email: "p.kamanga@nbsbank.com", role: "Security Officer", status: "Inactive", lastLogin: "10-04-2026 14:30" },
  { name: "Ruth Mwale", email: "r.mwale@nbsbank.com", role: "Operations Manager", status: "Active", lastLogin: "16-04-2026 09:00" },
];

export default function SystemUsers() {
  const [search, setSearch] = useState("");
  const filtered = usersData.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="font-display text-lg font-bold text-foreground tracking-wider">System Users</h2>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-medium hover:bg-primary/90 transition-all">
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-primary">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Users</p>
            <p className="text-xl font-display font-bold text-foreground">{usersData.length}</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-success">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Active</p>
            <p className="text-xl font-display font-bold text-foreground">{usersData.filter(u => u.status === "Active").length}</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-accent">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Admins</p>
            <p className="text-xl font-display font-bold text-foreground">{usersData.filter(u => u.role.includes("Administrator")).length}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="text-left px-5 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
              <th className="text-left px-5 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Email</th>
              <th className="text-left px-5 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Role</th>
              <th className="text-left px-5 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="text-left px-5 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Last Login</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user, i) => (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                <td className="px-5 py-3 text-xs font-medium text-foreground">{user.name}</td>
                <td className="px-5 py-3 text-xs text-muted-foreground">{user.email}</td>
                <td className="px-5 py-3 text-xs text-muted-foreground">{user.role}</td>
                <td className="px-5 py-3">
                  <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${
                    user.status === "Active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-xs text-muted-foreground">{user.lastLogin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
