import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface TypingInputProps {
  originalText: string;
  typedText: string;
  onChange: (value: string) => void;
  onComplete: () => void;
}

export const TypingInput = ({ originalText, typedText, onChange, onComplete }: TypingInputProps) => {
  const getCharacterClass = (index: number) => {
    if (index >= typedText.length) return "text-gray-800";
    
    return typedText[index] === originalText[index]
      ? "text-green-600"
      : "text-red-600";
  };

  const isTestComplete = () => {
    return typedText.length > 0 && 
           (typedText.length >= originalText.length || 
            typedText.split(/\s+/).length >= originalText.split(/\s+/).length);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg shadow-inner">
        <p className="text-lg leading-relaxed font-mono">
          {originalText.split("").map((char, index) => (
            <span key={index} className={getCharacterClass(index)}>
              {char}
            </span>
          ))}
        </p>
      </div>
      <Textarea
        className="w-full h-40 p-4 border rounded-lg shadow-inner focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        placeholder="Start typing here..."
        value={typedText}
        onChange={(e) => onChange(e.target.value)}
        autoFocus
      />
      {isTestComplete() && (
        <Button
          onClick={onComplete}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        >
          Submit Test
        </Button>
      )}
    </div>
  );
};