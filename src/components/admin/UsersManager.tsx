
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
  tier: string | null;
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

  const updateUserTier = async (userId: string, tier: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ tier })
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `User tier updated to ${tier}`,
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
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-heading text-eka-pearl">Users Management</h2>
        <p className="text-sm text-eka-champagne">
          Tier A = Luxe, Tier B = Premium, Tier C = Regular
        </p>
      </div>

      {profiles.length === 0 ? (
        <div className="bg-eka-emerald-depth/20 backdrop-blur-sm rounded-lg border border-eka-jade-luxury/30 p-12 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <UserCheck className="w-16 h-16 text-eka-jade-luxury/40" />
            <h3 className="text-xl font-heading text-eka-pearl">No users yet</h3>
            <p className="text-eka-champagne">Users will appear here when they register</p>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-eka-emerald-depth/20 backdrop-blur-sm rounded-lg border border-eka-jade-luxury/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-eka-jade-luxury/20">
                  <tr>
                    <th className="px-4 py-3 text-left text-eka-pearl">Email</th>
                    <th className="px-4 py-3 text-left text-eka-pearl">Full Name</th>
                    <th className="px-4 py-3 text-left text-eka-pearl">Role</th>
                    <th className="px-4 py-3 text-left text-eka-pearl">Tier</th>
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
                        <td className="px-4 py-3">
                          <Select
                            value={profile.tier || "C"}
                            onValueChange={(value) => updateUserTier(profile.id, value)}
                          >
                            <SelectTrigger className="w-24 bg-eka-emerald-depth/20 border-eka-jade-luxury/30 text-eka-pearl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A">Tier A (Luxe)</SelectItem>
                              <SelectItem value="B">Tier B (Premium)</SelectItem>
                              <SelectItem value="C">Tier C (Regular)</SelectItem>
                            </SelectContent>
                          </Select>
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

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {profiles.map((profile) => {
              const currentRole = userRoles[profile.id] || 'customer';
              return (
                <div key={profile.id} className="bg-eka-emerald-depth/20 backdrop-blur-sm rounded-lg border border-eka-jade-luxury/30 p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-base font-heading text-eka-pearl mb-1">
                        {profile.full_name || 'No name'}
                      </h3>
                      <p className="text-sm text-eka-champagne">{profile.email || 'No email'}</p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-eka-champagne">Role:</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          currentRole === 'admin' 
                            ? 'bg-eka-golden/20 text-eka-golden' 
                            : 'bg-eka-sage-whisper/20 text-eka-champagne'
                        }`}>
                          {currentRole}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-eka-champagne">Tier:</span>
                        <Select
                          value={profile.tier || "C"}
                          onValueChange={(value) => updateUserTier(profile.id, value)}
                        >
                          <SelectTrigger className="w-24 bg-eka-emerald-depth/20 border-eka-jade-luxury/30 text-eka-pearl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">Tier A (Luxe)</SelectItem>
                            <SelectItem value="B">Tier B (Premium)</SelectItem>
                            <SelectItem value="C">Tier C (Regular)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-eka-champagne">Change Role:</span>
                        <Select
                          value={currentRole}
                          onValueChange={(value: "admin" | "customer") => updateUserRole(profile.id, value)}
                        >
                          <SelectTrigger className="w-32 bg-eka-emerald-depth/20 border-eka-jade-luxury/30 text-eka-pearl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="customer">Customer</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-eka-champagne">Joined:</span>
                        <span className="text-eka-pearl">{new Date(profile.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
