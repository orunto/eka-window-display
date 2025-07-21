
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Shield, User } from "lucide-react";

interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'customer';
  created_at: string;
}

export const UsersManager = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch user profiles",
        variant: "destructive",
      });
    }
  };

  const updateUserRole = async (userId: string, newRole: 'admin' | 'customer') => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: `User role updated to ${newRole}`,
      });
      
      fetchProfiles();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading text-eka-pearl">Users Management</h2>
        <div className="text-sm text-eka-champagne">
          Total Users: {profiles.length}
        </div>
      </div>

      <div className="bg-eka-emerald-depth/20 rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-eka-jade-luxury/30">
              <TableHead className="text-eka-champagne">Email</TableHead>
              <TableHead className="text-eka-champagne">Full Name</TableHead>
              <TableHead className="text-eka-champagne">Role</TableHead>
              <TableHead className="text-eka-champagne">Joined</TableHead>
              <TableHead className="text-eka-champagne">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.map((profile) => (
              <TableRow key={profile.id} className="border-eka-jade-luxury/20">
                <TableCell className="text-eka-pearl">{profile.email}</TableCell>
                <TableCell className="text-eka-pearl">{profile.full_name || 'N/A'}</TableCell>
                <TableCell className="text-eka-pearl">
                  <div className="flex items-center space-x-2">
                    {profile.role === 'admin' ? (
                      <Shield className="w-4 h-4 text-eka-golden" />
                    ) : (
                      <User className="w-4 h-4 text-eka-champagne" />
                    )}
                    <span className={profile.role === 'admin' ? 'text-eka-golden' : 'text-eka-champagne'}>
                      {profile.role}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-eka-pearl">
                  {new Date(profile.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Select
                    value={profile.role}
                    onValueChange={(value: 'admin' | 'customer') => updateUserRole(profile.id, value)}
                    disabled={loading}
                  >
                    <SelectTrigger className="w-32 bg-eka-emerald-depth/20 border-eka-jade-luxury/30 text-eka-pearl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-eka-champagne/70">
        <p>
          <strong>Admin Role:</strong> Can access this dashboard and manage all site content.
        </p>
        <p>
          <strong>Customer Role:</strong> Standard site visitor with account access.
        </p>
      </div>
    </div>
  );
};
