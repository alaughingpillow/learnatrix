import { Card } from "@/components/ui/card";
import { ChatBot } from "@/components/ChatBot";

const suggestedPrompts = [
  {
    title: "Overcome procrastination",
    description: "give me tips",
  },
  {
    title: "Show me a code snippet",
    description: "of a website's sticky header",
  },
  {
    title: "Grammar check",
    description: "rewrite it for better readability",
  },
  {
    title: "Tell me a fun fact",
    description: "about the Roman Empire",
  },
];

export const Learning = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold">UPSC Learning Assistant</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {suggestedPrompts.map((prompt, index) => (
            <Card
              key={index}
              className="p-4 hover:bg-accent cursor-pointer transition-colors"
            >
              <h3 className="font-medium mb-1">{prompt.title}</h3>
              <p className="text-sm text-muted-foreground">{prompt.description}</p>
            </Card>
          ))}
        </div>

        <ChatBot />
      </div>
    </div>
  );
};