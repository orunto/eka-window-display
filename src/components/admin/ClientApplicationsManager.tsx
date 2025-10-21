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

interface ClientApplication {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  status: string;
  notes: string | null;
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
      <Card className="p-6">
        <h2 className="text-2xl font-light mb-4">Client Applications</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell>{app.full_name}</TableCell>
                <TableCell>{app.email}</TableCell>
                <TableCell>{app.phone_number}</TableCell>
                <TableCell>{getStatusBadge(app.status)}</TableCell>
                <TableCell>
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
      </Card>

      {selectedApp && (
        <Card className="p-6">
          <h3 className="text-xl font-light mb-4">Review Application</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Applicant</p>
              <p className="font-medium">{selectedApp.full_name}</p>
              <p className="text-sm">{selectedApp.email}</p>
              <p className="text-sm">{selectedApp.phone_number}</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add internal notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="default"
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
