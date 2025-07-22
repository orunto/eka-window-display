
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { EkaHeader } from "@/components/EkaHeader";
import { EkaFooter } from "@/components/EkaFooter";
import { AdminAuth } from "@/components/admin/AdminAuth";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(true); // Temporarily set to true for testing
  const [loading, setLoading] = useState(false); // Set to false to skip loading
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

    // Temporarily bypass authentication for testing
    // Uncomment the code below to restore authentication:
    
    // checkUser();
    // const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
    //   if (session?.user) {
    //     setUser(session.user);
    //     await checkAdminStatus(session.user.id);
    //   } else {
    //     setUser(null);
    //     setIsAdmin(false);
    //   }
    //   setLoading(false);
    // });
    // return () => subscription.unsubscribe();
  }, []);

  // Commented out for testing - uncomment to restore auth functionality
  /*
  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await checkAdminStatus(session.user.id);
      }
    } catch (error) {
      console.error('Error checking user:', error);
      toast({
        title: "Error",
        description: "Failed to check authentication status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error checking admin status:', error);
        return;
      }

      setIsAdmin(data?.role === 'admin');
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };
  */

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
        {/* Temporarily bypass auth check - uncomment below to restore:
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
        */}
        
        {/* Direct access to admin dashboard for testing */}
        <AdminDashboard />
      </div>

      <EkaFooter />
    </div>
  );
};

export default Admin;
