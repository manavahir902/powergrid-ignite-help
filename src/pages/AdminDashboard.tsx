import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Users, Ticket, BookOpen, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import KnowledgeBase from "@/components/KnowledgeBase";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTickets: 0,
    openTickets: 0,
    resolvedTickets: 0,
    kbArticles: 0
  });

  useEffect(() => {
    checkAuth();
    loadStats();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    // Check if user has admin role
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    const isAdmin = roles?.some(r => r.role === "admin");
    if (!isAdmin) {
      toast.error("Access denied. Admin role required.");
      navigate("/dashboard");
    }
  };

  const loadStats = async () => {
    // Load statistics
    const [profilesRes, ticketsRes, kbRes] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("tickets").select("status", { count: "exact" }),
      supabase.from("knowledge_base").select("id", { count: "exact", head: true })
    ]);

    const openTickets = ticketsRes.data?.filter(t => t.status === "open").length || 0;
    const resolvedTickets = ticketsRes.data?.filter(t => t.status === "resolved").length || 0;

    setStats({
      totalUsers: profilesRes.count || 0,
      totalTickets: ticketsRes.data?.length || 0,
      openTickets,
      resolvedTickets,
      kbArticles: kbRes.count || 0
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">System management and analytics</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-5 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Ticket className="w-4 h-4" />
                Total Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTickets}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{stats.openTickets}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{stats.resolvedTickets}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                KB Articles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.kbArticles}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="kb" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="kb">Knowledge Base</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="kb">
            <Card>
              <CardHeader>
                <CardTitle>Knowledge Base Management</CardTitle>
                <CardDescription>
                  Manage articles that help users solve common issues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <KnowledgeBase />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>System Analytics</CardTitle>
                <CardDescription>
                  Overview of system performance and usage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Ticket Resolution Rate</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-4 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{
                            width: `${stats.totalTickets ? (stats.resolvedTickets / stats.totalTickets) * 100 : 0}%`
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {stats.totalTickets ? Math.round((stats.resolvedTickets / stats.totalTickets) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-4 border rounded-lg">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        AI Resolution Rate
                      </h4>
                      <div className="text-2xl font-bold">65%</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Issues resolved by AI without ticket creation
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Avg. Response Time
                      </h4>
                      <div className="text-2xl font-bold">2.5h</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Average time to first IT response
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;