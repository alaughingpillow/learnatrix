import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TestResult } from "@/types/results";

interface ResultCardProps {
  result: TestResult;
  isSelected: boolean;
  onViewDetails: (resultId: string, testId: string) => void;
}

export const ResultCard = ({ result, isSelected, onViewDetails }: ResultCardProps) => {
  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">{result.test?.title || "Untitled Test"}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {new Date(result.completed_at).toLocaleDateString()}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {result.test?.test_type === "typing" ? (
            <>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">WPM</span>
                <span className="font-medium">{result.wpm}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Accuracy</span>
                <span className="font-medium">{result.accuracy.toFixed(2)}%</span>
              </div>
            </>
          ) : (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Score</span>
              <span className="font-medium">{result.accuracy.toFixed(2)}%</span>
            </div>
          )}
          <Button 
            variant="outline"
            className="w-full mt-4"
            onClick={() => onViewDetails(result.id, result.test_id)}
          >
            {isSelected ? (
              <>
                Hide Details
                <ChevronUp className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                View Details
                <ChevronDown className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};