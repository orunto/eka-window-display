
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { EkaHeader } from "@/components/EkaHeader";
import { EkaFooter } from "@/components/EkaFooter";
import { AdminAuth } from "@/components/admin/AdminAuth";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Load fonts
    const loadFonts = () => {
      const link1 = document.createElement('link');
      link1.href = 'https://fonts.googleapis.com/css2?family=Mona+Sans:ital,wght@0,200..900;1,200..900&display=swap';
      link1.rel = 'stylesheet';
      document.head.appendChild(link1);

      const link2 = document.createElement('link');
      link2.href = 'https://fonts.googleapis.com/css2?family=Arapey:ital@0;1&display=swap';
      link2.rel = 'stylesheet';
      document.head.appendChild(link2);
    };
    loadFonts();

    checkUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');
      
      if (session?.user) {
        setUser(session.user);
        // Use setTimeout to avoid blocking the auth callback
        setTimeout(() => {
          checkAdminStatus(session.user.id);
        }, 0);
      } else {
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      console.log('Checking user session...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw sessionError;
      }
      
      console.log('Session:', session ? 'Found' : 'Not found');
      
      if (session?.user) {
        setUser(session.user);
        await checkAdminStatus(session.user.id);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking user:', error);
      toast({
        title: "Error",
        description: "Failed to check authentication status",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const checkAdminStatus = async (userId: string) => {
    try {
      console.log('Checking admin status for user:', userId);
      
      // Use the is_admin() function to check admin status
      const { data, error } = await supabase.rpc('is_admin');

      if (error) {
        console.error('RPC error checking admin status:', error);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      console.log('Admin status result:', data);
      setIsAdmin(data === true);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-eka-pearl text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      <EkaHeader />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        {!user ? (
          <AdminAuth />
        ) : !isAdmin ? (
          <div className="text-center">
            <div className="relative inline-block p-12 rounded-3xl bg-gradient-glass backdrop-blur-xl shadow-xl border border-eka-jade-luxury/30">
              <h1 className="text-4xl font-heading text-eka-pearl mb-4">Access Denied</h1>
              <p className="text-eka-champagne">You need admin privileges to access this dashboard.</p>
            </div>
          </div>
        ) : (
          <AdminDashboard />
        )}
      </div>

      <EkaFooter />
    </div>
  );
};

export default Admin;
