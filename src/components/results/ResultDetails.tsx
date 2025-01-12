import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, X } from "lucide-react";
import { TestResult, Question } from "@/types/results";

interface ResultDetailsProps {
  result: TestResult;
  questions: Question[];
}

export const ResultDetails = ({ result, questions }: ResultDetailsProps) => {
  return (
    <Card className="mt-4 lg:mt-0">
      <CardHeader>
        <CardTitle>Detailed Results</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] rounded-md border p-4">
          {result.test?.test_type === "typing" ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Typing Test Results</h3>
              <div className="bg-muted p-4 rounded-lg">
                {result.test.content?.split("").map((char, index) => {
                  const typedChar = result.raw_data?.[index];
                  const isCorrect = typedChar === char;
                  const className = typedChar
                    ? isCorrect
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                    : "text-muted-foreground";
                  return (
                    <span key={index} className={className}>
                      {char}
                    </span>
                  );
                })}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">WPM</p>
                  <p className="text-2xl font-bold">{result.wpm}</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Accuracy</p>
                  <p className="text-2xl font-bold">{result.accuracy.toFixed(2)}%</p>
                </div>
              </div>
            </div>
          ) : (
            questions.map((question, index) => {
              const selectedAnswer = result.raw_data?.[question.id];
              const selectedOption = question.question_options.find(
                opt => opt.id === selectedAnswer
              );
              const correctOption = question.question_options.find(
                opt => opt.is_correct
              );

              return (
                <div key={question.id} className="mb-6 p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">
                    Question {index + 1}: {question.question_text}
                  </h3>
                  {question.image_url && (
                    <img
                      src={question.image_url}
                      alt="Question"
                      className="mb-4 max-w-full h-auto rounded-lg"
                    />
                  )}
                  <div className="space-y-2">
                    {question.question_options.map((option) => (
                      <div
                        key={option.id}
                        className={`p-3 rounded-lg ${
                          option.is_correct
                            ? "bg-green-100 dark:bg-green-900/20 border-green-500"
                            : option.id === selectedAnswer && !option.is_correct
                            ? "bg-red-100 dark:bg-red-900/20 border-red-500"
                            : "bg-muted"
                        } border`}
                      >
                        <div className="flex items-center">
                          {option.is_correct ? (
                            <Check className="h-5 w-5 text-green-500 mr-2" />
                          ) : option.id === selectedAnswer && !option.is_correct ? (
                            <X className="h-5 w-5 text-red-500 mr-2" />
                          ) : null}
                          <span>{option.option_text}</span>
                        </div>
                        {option.is_correct && option.explanation && (
                          <p className="text-sm text-green-600 dark:text-green-400 mt-2 pl-7">
                            <strong>Explanation:</strong> {option.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};