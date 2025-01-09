import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MCQQuestionFormProps {
  index: number;
  question: {
    questionText: string;
    imageUrl?: string;
    options: Array<{ text: string; isCorrect: boolean; explanation?: string }>;
  };
  onQuestionChange: (index: number, field: string, value: any) => void;
  onRemoveQuestion: (index: number) => void;
}

export const MCQQuestionForm = ({
  index,
  question,
  onQuestionChange,
  onRemoveQuestion,
}: MCQQuestionFormProps) => {
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('question_images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('question_images')
        .getPublicUrl(filePath);

      onQuestionChange(index, 'imageUrl', publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const addOption = () => {
    const newOptions = [...question.options, { text: '', isCorrect: false }];
    onQuestionChange(index, 'options', newOptions);
  };

  const removeOption = (optionIndex: number) => {
    const newOptions = question.options.filter((_, i) => i !== optionIndex);
    onQuestionChange(index, 'options', newOptions);
  };

  const handleCorrectOptionChange = (optionIndex: string) => {
    const newOptions = question.options.map((opt, i) => ({
      ...opt,
      isCorrect: i === parseInt(optionIndex),
    }));
    onQuestionChange(index, 'options', newOptions);
  };

  const handleExplanationChange = (explanation: string) => {
    const correctOptionIndex = question.options.findIndex(opt => opt.isCorrect);
    if (correctOptionIndex !== -1) {
      const newOptions = [...question.options];
      newOptions[correctOptionIndex] = {
        ...newOptions[correctOptionIndex],
        explanation
      };
      onQuestionChange(index, 'options', newOptions);
    }
  };

  const correctOptionIndex = question.options.findIndex((opt) => opt.isCorrect);
  const correctOption = question.options[correctOptionIndex];

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Question {index + 1}</h3>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onRemoveQuestion(index)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <Textarea
        value={question.questionText}
        onChange={(e) => onQuestionChange(index, 'questionText', e.target.value)}
        placeholder="Enter question text"
        className="min-h-[100px]"
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Question Image (optional)
        </label>
        <div className="flex items-center space-x-2">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id={`image-upload-${index}`}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById(`image-upload-${index}`)?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Image
          </Button>
          {question.imageUrl && (
            <img
              src={question.imageUrl}
              alt="Question"
              className="h-10 w-10 object-cover rounded"
            />
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium">Options</h4>
          <Button type="button" variant="outline" size="sm" onClick={addOption}>
            <Plus className="h-4 w-4 mr-2" />
            Add Option
          </Button>
        </div>

        {question.options.map((option, optionIndex) => (
          <div key={optionIndex} className="flex items-center space-x-2">
            <Input
              value={option.text}
              onChange={(e) => {
                const newOptions = [...question.options];
                newOptions[optionIndex] = {
                  ...option,
                  text: e.target.value,
                };
                onQuestionChange(index, 'options', newOptions);
              }}
              placeholder={`Option ${optionIndex + 1}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeOption(optionIndex)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Correct Option
          </label>
          <Select
            value={correctOptionIndex.toString()}
            onValueChange={handleCorrectOptionChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select correct option" />
            </SelectTrigger>
            <SelectContent>
              {question.options.map((option, i) => (
                <SelectItem key={i} value={i.toString()}>
                  Option {i + 1}: {option.text}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {correctOptionIndex !== -1 && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Explanation for Correct Answer
            </label>
            <Textarea
              value={correctOption?.explanation || ""}
              onChange={(e) => handleExplanationChange(e.target.value)}
              placeholder="Explain why this is the correct answer..."
              className="min-h-[100px]"
            />
          </div>
        )}
      </div>
    </div>
  );
};