import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Message {
  role: "user" | "assistant";
  content: string;
  classification?: any;
  kbArticles?: any[];
}

const ChatInterface = ({ userId }: { userId: string }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

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

      const assistantMessage: Message = {
        role: "assistant",
        content: data.solution || "I'm analyzing your issue...",
        classification: data.classification,
        kbArticles: data.kbArticles,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // If suggested to create ticket
      if (data.suggestedAction === "create_ticket") {
        toast.info("This issue requires a support ticket. Would you like to create one?");
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      toast.error(error.message || "Failed to send message");
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

  return (
    <div className="space-y-4">
      <div className="h-[500px] overflow-y-auto space-y-4 p-4 rounded-lg border bg-muted/30">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div className="space-y-2">
              <Bot className="w-12 h-12 mx-auto text-primary" />
              <h3 className="font-semibold text-lg">How can I help you today?</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Describe your IT issue and I'll either help you resolve it instantly or create a support ticket
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
    </div>
  );
};

export default ChatInterface;