import { Button } from "@/components/ui/button";
import { MCQQuestionForm } from "@/components/admin/MCQQuestionForm";

interface MCQQuestion {
  questionText: string;
  imageUrl?: string;
  options: Array<{ text: string; isCorrect: boolean }>;
}

interface MCQSectionProps {
  questions: MCQQuestion[];
  onQuestionChange: (index: number, field: string, value: any) => void;
  onRemoveQuestion: (index: number) => void;
  onAddQuestion: () => void;
}

export const MCQSection = ({
  questions,
  onQuestionChange,
  onRemoveQuestion,
  onAddQuestion,
}: MCQSectionProps) => {
  return (
    <div className="space-y-4 mt-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Questions</h3>
        <Button
          type="button"
          onClick={onAddQuestion}
          disabled={questions.length >= 30}
        >
          Add Question
        </Button>
      </div>
      {questions.map((question, index) => (
        <MCQQuestionForm
          key={index}
          index={index}
          question={question}
          onQuestionChange={onQuestionChange}
          onRemoveQuestion={onRemoveQuestion}
        />
      ))}
      {questions.length === 0 && (
        <p className="text-center text-gray-500 py-4">
          Click "Add Question" to start creating your MCQ test.
        </p>
      )}
    </div>
  );
};