export interface TestResult {
  id: string;
  test_id: string;
  wpm: number;
  accuracy: number;
  completed_at: string;
  raw_data: any;
  test: {
    title: string;
    test_type: string;
    content?: string;
    category_id?: string;
  };
}

export interface Question {
  id: string;
  question_text: string;
  image_url?: string;
  question_options: {
    id: string;
    option_text: string;
    is_correct: boolean;
    explanation?: string;
  }[];
}