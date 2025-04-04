import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Loader2, Send, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";

interface Message {
  text: string;
  isUser: boolean;
}

export const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      console.log("Sending request to chat-completion function");
      const { data, error } = await supabase.functions.invoke('chat-completion', {
        body: { input: input }
      });

      if (error) {
        console.error("Supabase function error:", error);
        throw error;
      }

      console.log("Received response:", data);
      const botMessage = {
        text: data.generated_text || "I couldn't generate a proper response.",
        isUser: false,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      toast({
        title: "Error",
        description: "There was an error processing your request. If you're running locally, make sure you've deployed the Edge Function.",
        variant: "destructive",
      });
      const errorMessage = {
        text: "Sorry, I couldn't process your request. If you're running locally, make sure the Edge Function is deployed.",
        isUser: false,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    console.log("Chat cleared");
  };

  return (
    <Card className="border-t-0">
      <CardContent className="p-4">
        <div className="flex justify-end mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={clearChat}
            className="text-muted-foreground"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Chat
          </Button>
        </div>
        <ScrollArea className="h-[400px] mb-4 p-4 rounded-lg border bg-background">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground">
                How can I help you today?
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.isUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-accent"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-accent rounded-lg px-4 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send a message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};