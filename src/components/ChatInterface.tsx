import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Send, Bot, User, Loader2, Ticket } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Database } from "@/integrations/supabase/types";

interface Message {
  role: "user" | "assistant";
  content: string;
  classification?: {
    category: string;
    priority: string;
    isCommon: boolean;
    solution: string;
    kbQuery: string;
  };
  kbArticles?: Database["public"]["Tables"]["knowledge_base"]["Row"][];
}

interface TicketData {
  title: string;
  description: string;
  category: Database["public"]["Enums"]["ticket_category"];
  priority: Database["public"]["Enums"]["ticket_priority"];
  location: string;
}

const ChatInterface = ({ userId }: { userId: string }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your IT Support Assistant. I can help you troubleshoot common issues or create support tickets for complex problems. What can I help you with today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTicketDialog, setShowTicketDialog] = useState(false);
  const [ticketData, setTicketData] = useState<TicketData>({
    title: "",
    description: "",
    category: "other",
    priority: "medium",
    location: "",
  });

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: { message: userMessage, userId },
      });

      if (error) throw error;

      // Format the assistant response based on the AI analysis
      let assistantContent = "";
      if (data.solution) {
        assistantContent = data.solution;
      } else if (data.suggestedAction === "create_ticket") {
        assistantContent = "I'll need to create a support ticket for this issue so our IT team can help you. Let me prepare that for you.";
      } else {
        assistantContent = "I'm analyzing your issue...";
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: assistantContent,
        classification: data.classification,
        kbArticles: data.kbArticles,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // If suggested to create ticket, auto-fill the ticket form
      if (data.suggestedAction === "create_ticket") {
        setTicketData({
          title: userMessage.substring(0, 50) + (userMessage.length > 50 ? "..." : ""),
          description: `User reported: ${userMessage}

AI Analysis:
Category: ${data.classification?.category || "N/A"}
Priority: ${data.classification?.priority || "medium"}`,
          category: (data.classification?.category as Database["public"]["Enums"]["ticket_category"]) || "other",
          priority: (data.classification?.priority as Database["public"]["Enums"]["ticket_priority"]) || "medium",
          location: "",
        });
        
        // Add a small delay before showing the ticket dialog for better UX
        setTimeout(() => {
          setShowTicketDialog(true);
        }, 1000);
      }
    } catch (error: unknown) {
      console.error("Chat error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to send message"
      );
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having trouble processing your request. Please try creating a ticket directly.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const createTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase.from("tickets").insert([{
        user_id: userId,
        title: ticketData.title,
        description: ticketData.description,
        category: ticketData.category,
        priority: ticketData.priority,
        location: ticketData.location,
      }]);

      if (error) throw error;

      toast.success("Ticket created successfully!");
      setShowTicketDialog(false);
      setTicketData({
        title: "",
        description: "",
        category: "other",
        priority: "medium",
        location: "",
      });
      
      // Add confirmation message to chat
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "I've created a support ticket for your issue. Our IT team will look into it shortly. You can check the status of your ticket in the 'My Tickets' tab.",
      }]);
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create ticket. Please try again."
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="h-[500px] overflow-y-auto space-y-4 p-4 rounded-lg border bg-muted/30">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div className="space-y-2">
              <Bot className="w-12 h-12 mx-auto text-primary" />
              <h3 className="font-semibold text-lg">Hello! I'm your IT Assistant</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Describe your IT issue and I'll either help you resolve it instantly with step-by-step instructions or create a support ticket if needed.
              </p>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInput("VPN is not connecting")}
                >
                  VPN not connecting
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInput("Password reset needed")}
                >
                  Password reset
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInput("Printer not working")}
                >
                  Printer issue
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInput("Email setup help")}
                >
                  Email configuration
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInput("Software installation issue")}
                >
                  Software problem
                </Button>
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
              <Card
                className={`p-4 max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                {msg.kbArticles && msg.kbArticles.length > 0 && (
                  <div className="mt-3 pt-3 border-t space-y-2">
                    <p className="text-xs font-semibold">Related Articles:</p>
                    {msg.kbArticles.map((article) => (
                      <Button
                        key={article.id}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-left h-auto py-2"
                        onClick={() => navigate("/dashboard?tab=kb")}
                      >
                        <span className="text-xs">{article.title}</span>
                      </Button>
                    ))}
                  </div>
                )}
                {msg.classification?.isCommon && msg.classification?.solution && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs font-semibold mb-2">Suggested Solution:</p>
                    <div className="text-xs bg-secondary p-3 rounded">
                      <p className="whitespace-pre-wrap">{msg.classification.solution}</p>
                    </div>
                  </div>
                )}
              </Card>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-accent-foreground" />
                </div>
              )}
            </div>
          ))
        )}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            <Card className="p-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              <p className="text-sm mt-2">Analyzing your issue...</p>
            </Card>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Describe your issue... (Press Enter to send, Shift+Enter for new line)"
          className="min-h-[60px] resize-none"
          disabled={loading}
        />
        <Button onClick={sendMessage} disabled={loading || !input.trim()} size="lg">
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* Ticket Creation Dialog */}
      <Dialog open={showTicketDialog} onOpenChange={setShowTicketDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Support Ticket</DialogTitle>
            <DialogDescription>
              I've pre-filled this form based on our conversation. Please review and submit.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={createTicket} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Issue Title *</Label>
              <Input
                id="title"
                placeholder="Brief description of the issue"
                value={ticketData.title}
                onChange={(e) => setTicketData({ ...ticketData, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description *</Label>
              <Textarea
                id="description"
                placeholder="Provide as much detail as possible..."
                value={ticketData.description}
                onChange={(e) => setTicketData({ ...ticketData, description: e.target.value })}
                rows={4}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={ticketData.category}
                  onValueChange={(value) => setTicketData({ ...ticketData, category: value as Database["public"]["Enums"]["ticket_category"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="network">Network</SelectItem>
                    <SelectItem value="account">Account</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="hardware">Hardware</SelectItem>
                    <SelectItem value="software">Software</SelectItem>
                    <SelectItem value="printer">Printer</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={ticketData.priority}
                  onValueChange={(value) => setTicketData({ ...ticketData, priority: value as Database["public"]["Enums"]["ticket_priority"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location/Site</Label>
              <Input
                id="location"
                placeholder="Building/Floor/Office"
                value={ticketData.location}
                onChange={(e) => setTicketData({ ...ticketData, location: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowTicketDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <Ticket className="w-4 h-4 mr-2" />
                Submit Ticket
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatInterface;