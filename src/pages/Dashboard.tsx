import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Ticket, BookOpen, BarChart3, LogOut, Award, Database } from "lucide-react";
import ChatInterface from "@/components/ChatInterface";
import TicketList from "@/components/TicketList";
import KnowledgeBase from "@/components/KnowledgeBase";
import { toast } from "sonner";
import { insertSampleData } from "@/utils/sampleData";
import { Database as SupabaseDatabase } from "@/integrations/supabase/types";

type Profile = SupabaseDatabase["public"]["Tables"]["profiles"]["Row"];

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      } else {
        loadProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (profile && user) {
      checkRoleAndRedirect();
    }
  }, [profile, user]);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        navigate("/auth");
      } else {
        await loadProfile(session.user.id);
      }
    } catch (error) {
      console.error("Error checking user:", error);
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const checkRoleAndRedirect = async () => {
    if (!user) return;

    // Check user roles
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    if (roles) {
      // Admin gets redirected to admin dashboard
      if (roles.some(r => r.role === "admin")) {
        navigate("/admin-dashboard");
        return;
      }
      // IT support gets redirected to IT dashboard
      if (roles.some(r => r.role === "it_support")) {
        navigate("/it-dashboard");
        return;
      }
      // Employees stay on regular dashboard
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  const handleInsertSampleData = async () => {
    try {
      await insertSampleData();
      toast.success("Sample data inserted successfully!");
    } catch (error) {
      console.error("Error inserting sample data:", error);
      toast.error("Failed to insert sample data");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">POWERGRID AI Helpdesk</h1>
              <p className="text-sm text-muted-foreground">Welcome, {profile?.full_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary">
              <Award className="w-4 h-4 text-accent" />
              <span className="font-semibold">{profile?.gamification_points || 0} pts</span>
            </div>
            {/* Show sample data button for admins */}
            {profile?.role === "it_admin" && (
              <Button variant="outline" size="sm" onClick={handleInsertSampleData}>
                <Database className="w-4 h-4 mr-2" />
                Insert Sample Data
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="chat" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="tickets" className="flex items-center gap-2">
              <Ticket className="w-4 h-4" />
              My Tickets
            </TabsTrigger>
            <TabsTrigger value="kb" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Knowledge Base
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>AI Support Assistant</CardTitle>
                <CardDescription>
                  Describe your issue and I'll help you resolve it instantly or create a ticket
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChatInterface userId={user?.id || ""} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tickets">
            <TicketList userId={user?.id || ""} />
          </TabsContent>

          <TabsContent value="kb">
            <KnowledgeBase />
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Your Activity</CardTitle>
                <CardDescription>Track your support interactions and achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border bg-card p-6">
                    <div className="text-2xl font-bold text-primary">
                      {profile?.gamification_points || 0}
                    </div>
                    <p className="text-sm text-muted-foreground">Total Points</p>
                  </div>
                  <div className="rounded-lg border bg-card p-6">
                    <div className="text-2xl font-bold text-accent">0</div>
                    <p className="text-sm text-muted-foreground">Tickets Resolved</p>
                  </div>
                  <div className="rounded-lg border bg-card p-6">
                    <div className="text-2xl font-bold text-success">0</div>
                    <p className="text-sm text-muted-foreground">KB Articles Used</p>
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

export default Dashboard;