import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api, type CreateUserPayload } from "@/lib/api";
import { toast } from "sonner";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserCreated: () => void;
}

const ROLES = ["Administrator", "User", "Viewer"];

const initialForm = {
  name: "",
  email: "",
  user_role: "User",
  phone_number: "",
  password: "",
  password_confirmation: "",
};

export default function AddUserDialog({ open, onOpenChange, onUserCreated }: AddUserDialogProps) {
  const [form, setForm] = useState({ ...initialForm });
  const [loading, setLoading] = useState(false);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.password_confirmation) {
      toast.error("Passwords do not match");
      return;
    }

    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    const payload: CreateUserPayload = {
      name: form.name.trim(),
      email: form.email.trim(),
      user_role: form.user_role,
      phone_number: form.phone_number.trim() || null,
      password: form.password,
      password_confirmation: form.password_confirmation,
    };

    const result = await api.createUser(payload);

    setLoading(false);

    if (!result.success) {
      toast.error(result.error || "Failed to create user");
      return;
    }

    toast.success("User created successfully");
    setForm({ ...initialForm });
    onUserCreated();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Enter the details for the new system user.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={form.user_role}
              onValueChange={(value) => updateField("user_role", value)}
              disabled={loading}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+265 999 123 456"
              value={form.phone_number}
              onChange={(e) => updateField("phone_number", e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password_confirmation">Confirm Password</Label>
            <Input
              id="password_confirmation"
              type="password"
              value={form.password_confirmation}
              onChange={(e) => updateField("password_confirmation", e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-[#006738] hover:bg-[#004d2a]">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
