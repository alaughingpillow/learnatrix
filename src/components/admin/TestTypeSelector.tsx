import { Button } from "@/components/ui/button";
import { FileText, ListChecks } from "lucide-react";

interface TestTypeSelectorProps {
  selectedType: "typing" | "mcq";
  onTypeSelect: (type: "typing" | "mcq") => void;
}

export const TestTypeSelector = ({
  selectedType,
  onTypeSelect,
}: TestTypeSelectorProps) => {
  return (
    <div className="flex space-x-4 mb-6">
      <Button
        variant={selectedType === "typing" ? "default" : "outline"}
        onClick={() => onTypeSelect("typing")}
        className="flex-1"
      >
        <FileText className="h-4 w-4 mr-2" />
        Typing Test
      </Button>
      <Button
        variant={selectedType === "mcq" ? "default" : "outline"}
        onClick={() => onTypeSelect("mcq")}
        className="flex-1"
      >
        <ListChecks className="h-4 w-4 mr-2" />
        MCQ Test
      </Button>
    </div>
  );
};