
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
  role: "admin" | "customer";
  created_at: string;
  updated_at: string;
}

export const UsersManager = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
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
      
      // Cast the data to ensure proper typing
      const typedProfiles: Profile[] = (data || []).map(profile => ({
        ...profile,
        role: (profile.role as "admin" | "customer") || "customer"
      }));
      
      setProfiles(typedProfiles);
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
              {profiles.map((profile) => (
                <tr key={profile.id} className="hover:bg-eka-jade-luxury/10">
                  <td className="px-4 py-3 text-eka-pearl">{profile.email || 'No email'}</td>
                  <td className="px-4 py-3 text-eka-champagne">{profile.full_name || 'No name'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      profile.role === 'admin' 
                        ? 'bg-eka-golden/20 text-eka-golden' 
                        : 'bg-eka-sage-whisper/20 text-eka-champagne'
                    }`}>
                      {profile.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-eka-champagne">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Select
                      value={profile.role}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
