import { useState } from "react";
import { pipeline } from "@huggingface/transformers";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Loader2, Send } from "lucide-react";

interface Message {
  text: string;
  isUser: boolean;
}

export const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Initialize the pipeline with your model
      const generator = await pipeline(
        "text-generation",
        "your-huggingface-model-name",
        { device: "webgpu" }
      );

      // Generate response
      const response = await generator(input, {
        max_length: 100,
        temperature: 0.7,
      });

      // Handle both TextGenerationOutput and TextGenerationSingle types
      const generatedText = Array.isArray(response) 
        ? response[0].generated_text 
        : response.generated_text || "I couldn't generate a proper response.";

      const botMessage = {
        text: generatedText,
        isUser: false,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage = {
        text: "Sorry, I couldn't process your request. Please try again.",
        isUser: false,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-t-0">
      <CardContent className="p-4">
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