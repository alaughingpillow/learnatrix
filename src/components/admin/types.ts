export interface UserResult {
  profile: {
    id: string;
    email: string | null;
  };
  results: {
    test: {
      title: string;
      test_type: string;
    } | null;
    accuracy: number;
    wpm: number;
    completed_at: string;
  }[];
}

export interface TestResultWithProfile {
  user_id: string;
  accuracy: number;
  wpm: number;
  completed_at: string;
  test: {
    title: string;
    test_type: string;
  } | null;
  profile: {
    id: string;
    username: string | null;
  } | null;
}