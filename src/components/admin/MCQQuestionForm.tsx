import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface MCQQuestionFormProps {
  index: number;
  question: {
    questionText: string;
    imageUrl?: string;
    options: Array<{ text: string; isCorrect: boolean }>;
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
            <input
              type="radio"
              name={`correct-${index}`}
              checked={option.isCorrect}
              onChange={() => {
                const newOptions = question.options.map((opt, i) => ({
                  ...opt,
                  isCorrect: i === optionIndex,
                }));
                onQuestionChange(index, 'options', newOptions);
              }}
              className="ml-2"
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
      </div>
    </div>
  );
};