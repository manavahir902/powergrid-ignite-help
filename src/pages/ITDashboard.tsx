import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LogOut, Ticket, Clock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type Ticket = Database["public"]["Tables"]["tickets"]["Row"] & {
  profiles: Database["public"]["Tables"]["profiles"]["Row"];
};

const ITDashboard = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    checkAuth();
    loadTickets();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    // Check if user has IT support role
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    const hasITRole = roles?.some(r => r.role === "it_support" || r.role === "admin");
    if (!hasITRole) {
      toast.error("Access denied. IT Support role required.");
      navigate("/dashboard");
    }
  };

  const loadTickets = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("tickets")
      .select(`
        *,
        profiles:user_id (*)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load tickets");
      console.error(error);
    } else {
      setTickets(data as Ticket[]);
    }
    setLoading(false);
  };

  const updateTicketStatus = async (ticketId: string, newStatus: string) => {
    const { error } = await supabase
      .from("tickets")
      .update({ status: newStatus })
      .eq("id", ticketId);

    if (error) {
      toast.error("Failed to update ticket");
    } else {
      toast.success("Ticket updated successfully");
      loadTickets();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-yellow-500";
      case "in_progress": return "bg-blue-500";
      case "resolved": return "bg-green-500";
      case "closed": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const filterTickets = (status?: string) => {
    if (!status) return tickets;
    return tickets.filter(t => t.status === status);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Ticket className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">IT Support Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage and resolve tickets</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filterTickets("open").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filterTickets("in_progress").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filterTickets("resolved").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tickets.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Tickets</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>

          {["all", "open", "in_progress", "resolved"].map((tabValue) => (
            <TabsContent key={tabValue} value={tabValue}>
              <Card>
                <CardHeader>
                  <CardTitle>
                    {tabValue === "all" ? "All Tickets" : `${tabValue.replace("_", " ").toUpperCase()} Tickets`}
                  </CardTitle>
                  <CardDescription>
                    Click on a ticket to view details and take action
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">Loading tickets...</div>
                  ) : (
                    <div className="space-y-4">
                      {filterTickets(tabValue === "all" ? undefined : tabValue).map((ticket) => (
                        <div
                          key={ticket.id}
                          className="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{ticket.title}</h3>
                                <Badge className={getPriorityColor(ticket.priority)}>
                                  {ticket.priority}
                                </Badge>
                                <Badge className={getStatusColor(ticket.status)}>
                                  {ticket.status.replace("_", " ")}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {ticket.description}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                                <span>Reporter: {ticket.profiles?.full_name}</span>
                                <span>Category: {ticket.category}</span>
                                <span>
                                  <Clock className="w-3 h-3 inline mr-1" />
                                  {new Date(ticket.created_at!).toLocaleString()}
                                </span>
                              </div>
                            </div>
                            {ticket.status === "open" && (
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateTicketStatus(ticket.id, "in_progress");
                                }}
                              >
                                Start Working
                              </Button>
                            )}
                            {ticket.status === "in_progress" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateTicketStatus(ticket.id, "resolved");
                                }}
                              >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Mark Resolved
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                      {filterTickets(tabValue === "all" ? undefined : tabValue).length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          No tickets found
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default ITDashboard;