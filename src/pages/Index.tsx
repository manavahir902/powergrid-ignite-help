import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Zap, Shield, BarChart3, Award, Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered IT Support</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              POWERGRID AI Helpdesk
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Enterprise IT support system with intelligent chatbot, automated ticketing, and real-time analytics
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="bg-white text-primary hover:bg-white/90 shadow-glow"
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/auth")}
                className="border-white text-white hover:bg-white/10"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Intelligent IT Support</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Streamline your IT operations with AI-powered assistance and automated workflows
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="gradient-card shadow-md hover:shadow-lg transition-smooth">
              <CardContent className="pt-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">AI Chat Assistant</h3>
                <p className="text-sm text-muted-foreground">
                  Get instant solutions from our intelligent chatbot that understands your IT issues
                </p>
              </CardContent>
            </Card>

            <Card className="gradient-card shadow-md hover:shadow-lg transition-smooth">
              <CardContent className="pt-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold text-lg">Smart Ticketing</h3>
                <p className="text-sm text-muted-foreground">
                  Automated ticket creation, routing, and priority assignment based on AI analysis
                </p>
              </CardContent>
            </Card>

            <Card className="gradient-card shadow-md hover:shadow-lg transition-smooth">
              <CardContent className="pt-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-success" />
                </div>
                <h3 className="font-semibold text-lg">Knowledge Base</h3>
                <p className="text-sm text-muted-foreground">
                  Searchable repository of solutions and troubleshooting guides for self-service
                </p>
              </CardContent>
            </Card>

            <Card className="gradient-card shadow-md hover:shadow-lg transition-smooth">
              <CardContent className="pt-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Analytics & Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Track ticket trends, resolution times, and team performance metrics
                </p>
              </CardContent>
            </Card>

            <Card className="gradient-card shadow-md hover:shadow-lg transition-smooth">
              <CardContent className="pt-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold text-lg">Gamification</h3>
                <p className="text-sm text-muted-foreground">
                  Reward system for employees who resolve issues independently
                </p>
              </CardContent>
            </Card>

            <Card className="gradient-card shadow-md hover:shadow-lg transition-smooth">
              <CardContent className="pt-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-success" />
                </div>
                <h3 className="font-semibold text-lg">IT Dashboard</h3>
                <p className="text-sm text-muted-foreground">
                  Comprehensive view for IT teams to manage and resolve tickets efficiently
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <Card className="gradient-hero max-w-4xl mx-auto shadow-glow">
            <CardContent className="p-12 text-center text-white space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Transform Your IT Support?
              </h2>
              <p className="text-white/90 text-lg max-w-2xl mx-auto">
                Join POWERGRID's intelligent helpdesk platform and experience faster resolutions
              </p>
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="bg-white text-primary hover:bg-white/90"
              >
                Get Started Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 POWERGRID AI Helpdesk. Built with Lovable.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
