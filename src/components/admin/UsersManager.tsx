
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { UserCheck, UserX } from "lucide-react";

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

interface UserRole {
  role: "admin" | "customer";
}

export const UsersManager = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [userRoles, setUserRoles] = useState<Record<string, "admin" | "customer">>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;
      setProfiles(profilesData || []);

      // Fetch user roles separately
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Create a map of user_id to role (prioritize admin role)
      const rolesMap: Record<string, "admin" | "customer"> = {};
      (rolesData || []).forEach((roleEntry: any) => {
        if (!rolesMap[roleEntry.user_id] || roleEntry.role === 'admin') {
          rolesMap[roleEntry.user_id] = roleEntry.role;
        }
      });

      setUserRoles(rolesMap);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateUserRole = async (userId: string, newRole: "admin" | "customer") => {
    try {
      // Delete existing roles for this user
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Insert new role
      const { error } = await supabase
        .from('user_roles')
        .insert([{ user_id: userId, role: newRole }]);

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
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading text-eka-pearl">Users Management</h2>
      </div>

      <div className="bg-eka-emerald-depth/20 backdrop-blur-sm rounded-lg border border-eka-jade-luxury/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-eka-jade-luxury/20">
              <tr>
                <th className="px-4 py-3 text-left text-eka-pearl">Email</th>
                <th className="px-4 py-3 text-left text-eka-pearl">Full Name</th>
                <th className="px-4 py-3 text-left text-eka-pearl">Role</th>
                <th className="px-4 py-3 text-left text-eka-pearl">Created</th>
                <th className="px-4 py-3 text-left text-eka-pearl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-eka-jade-luxury/20">
              {profiles.map((profile) => {
                const currentRole = userRoles[profile.id] || 'customer';
                return (
                  <tr key={profile.id} className="hover:bg-eka-jade-luxury/10">
                    <td className="px-4 py-3 text-eka-pearl">{profile.email || 'No email'}</td>
                    <td className="px-4 py-3 text-eka-champagne">{profile.full_name || 'No name'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        currentRole === 'admin' 
                          ? 'bg-eka-golden/20 text-eka-golden' 
                          : 'bg-eka-sage-whisper/20 text-eka-champagne'
                      }`}>
                        {currentRole}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-eka-champagne">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Select
                        value={currentRole}
                        onValueChange={(value: "admin" | "customer") => updateUserRole(profile.id, value)}
                      >
                      <SelectTrigger className="w-32 bg-eka-emerald-depth/20 border-eka-jade-luxury/30 text-eka-pearl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">
                          <div className="flex items-center space-x-2">
                            <UserX className="w-4 h-4" />
                            <span>Customer</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="admin">
                          <div className="flex items-center space-x-2">
                            <UserCheck className="w-4 h-4" />
                            <span>Admin</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
