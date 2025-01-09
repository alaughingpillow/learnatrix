export interface UserResult {
  profile: {
    id: string;
    username: string;
  };
  results: {
    test: {
      title: string;
      test_type: string;
    };
    accuracy: number;
    wpm: number;
    completed_at: string;
  }[];
}