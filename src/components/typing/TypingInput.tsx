import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface TypingInputProps {
  originalText: string;
  typedText: string;
  onChange: (value: string) => void;
  onComplete: () => void;
}

export const TypingInput = ({ originalText, typedText, onChange, onComplete }: TypingInputProps) => {
  const { toast } = useToast();
  
  const getCharacterClass = (index: number) => {
    if (index >= typedText.length) return "text-gray-800";
    
    return typedText[index] === originalText[index]
      ? "text-green-600"
      : "text-red-600";
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    toast({
      title: "bro u serious",
      variant: "destructive",
    });
  };

  const isTestComplete = () => {
    return typedText.length > 0 && 
           (typedText.length >= originalText.length || 
            typedText.split(/\s+/).length >= originalText.split(/\s+/).length);
  };

  return (
    <div className="space-y-4">
      <div className="bg-background p-6 rounded-lg shadow-inner border border-primary-300">
        <p className="text-lg leading-relaxed font-mono">
          {originalText.split("").map((char, index) => (
            <span key={index} className={getCharacterClass(index)}>
              {char}
            </span>
          ))}
        </p>
      </div>
      <Textarea
        className="w-full h-40 p-4 rounded-lg shadow-inner focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background border-primary-300"
        placeholder="Start typing here..."
        value={typedText}
        onChange={(e) => onChange(e.target.value)}
        onPaste={handlePaste}
        autoFocus
      />
      {isTestComplete() && (
        <Button
          onClick={onComplete}
          className="w-full bg-primary hover:bg-primary-600 text-primary-foreground"
        >
          Submit Test
        </Button>
      )}
    </div>
  );
};