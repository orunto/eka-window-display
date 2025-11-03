import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Package } from "lucide-react";

interface ClientApplication {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  status: string;
  notes: string | null;
  about_yourself: string | null;
  created_at: string;
}

export default function ClientApplicationsManager() {
  const [applications, setApplications] = useState<ClientApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<ClientApplication | null>(null);
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from("client_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateApplicationStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("client_applications")
        .update({ status, notes })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Application status updated",
      });
      
      fetchApplications();
      setSelectedApp(null);
      setNotes("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "default",
      approved: "default",
      rejected: "destructive",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "default"}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-eka-emerald-depth/20 border-eka-jade-luxury/30">
        <h2 className="text-2xl font-heading text-eka-pearl mb-4">Client Applications</h2>
        
        {applications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Package className="w-16 h-16 text-eka-jade-luxury/40" />
              <h3 className="text-xl font-heading text-eka-pearl">No applications yet</h3>
              <p className="text-eka-champagne">Applications will appear here when clients submit them</p>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow className="border-eka-jade-luxury/30">
                    <TableHead className="text-eka-champagne">Name</TableHead>
                    <TableHead className="text-eka-champagne">Email</TableHead>
                    <TableHead className="text-eka-champagne">Phone</TableHead>
                    <TableHead className="text-eka-champagne">Status</TableHead>
                    <TableHead className="text-eka-champagne">Applied</TableHead>
                    <TableHead className="text-eka-champagne">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.id} className="border-eka-jade-luxury/20">
                      <TableCell className="text-eka-pearl">{app.full_name}</TableCell>
                      <TableCell className="text-eka-champagne">{app.email}</TableCell>
                      <TableCell className="text-eka-champagne">{app.phone_number}</TableCell>
                      <TableCell>{getStatusBadge(app.status)}</TableCell>
                      <TableCell className="text-eka-champagne">
                        {new Date(app.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedApp(app);
                              setNotes(app.notes || "");
                            }}
                            className="border-eka-jade-luxury/30 text-eka-pearl hover:bg-eka-jade-luxury/20"
                          >
                            Review
                          </Button>
                          {app.status === 'approved' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const registerUrl = `${window.location.origin}/register`;
                                navigator.clipboard.writeText(registerUrl);
                                toast({
                                  title: "Link Copied",
                                  description: "Registration link copied to clipboard",
                                });
                              }}
                              className="border-eka-jade-luxury/30 text-eka-pearl hover:bg-eka-jade-luxury/20"
                            >
                              Copy Link
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="bg-eka-emerald-depth/20 backdrop-blur-sm rounded-lg border border-eka-jade-luxury/30 p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-base font-heading text-eka-pearl mb-1">{app.full_name}</h3>
                        <p className="text-sm text-eka-champagne">{app.email}</p>
                        <p className="text-sm text-eka-champagne">{app.phone_number}</p>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>
                    <div className="text-xs text-eka-champagne">
                      Applied: {new Date(app.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-eka-jade-luxury/20">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedApp(app);
                          setNotes(app.notes || "");
                        }}
                        className="border-eka-jade-luxury/30 text-eka-pearl hover:bg-eka-jade-luxury/20"
                      >
                        Review
                      </Button>
                      {app.status === 'approved' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const registerUrl = `${window.location.origin}/register`;
                            navigator.clipboard.writeText(registerUrl);
                            toast({
                              title: "Link Copied",
                              description: "Registration link copied to clipboard",
                            });
                          }}
                          className="border-eka-jade-luxury/30 text-eka-pearl hover:bg-eka-jade-luxury/20"
                        >
                          Copy Link
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      {selectedApp && (
        <Card className="p-6 bg-eka-emerald-depth/20 border-eka-jade-luxury/30">
          <h3 className="text-xl font-heading text-eka-pearl mb-4">Review Application</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-eka-champagne">Applicant</p>
              <p className="font-medium text-eka-pearl">{selectedApp.full_name}</p>
              <p className="text-sm text-eka-champagne">{selectedApp.email}</p>
              <p className="text-sm text-eka-champagne">{selectedApp.phone_number}</p>
            </div>
            
            {selectedApp.about_yourself && (
              <div>
                <p className="text-sm text-eka-champagne">About</p>
                <p className="text-sm text-eka-pearl whitespace-pre-wrap">{selectedApp.about_yourself}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-eka-pearl">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add internal notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="bg-eka-emerald-depth/20 border-eka-jade-luxury/30 text-eka-pearl"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                className="bg-eka-golden hover:bg-eka-golden/80 text-eka-emerald-depth"
                onClick={() => updateApplicationStatus(selectedApp.id, "approved")}
              >
                Approve
              </Button>
              <Button
                variant="destructive"
                onClick={() => updateApplicationStatus(selectedApp.id, "rejected")}
              >
                Reject
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedApp(null);
                  setNotes("");
                }}
                className="border-eka-jade-luxury/30 text-eka-pearl hover:bg-eka-jade-luxury/20"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
