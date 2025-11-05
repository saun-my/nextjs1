export type Course = {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  cover_url: string;
  lessons_count: number;
};

export type Lesson = {
  id: string;
  course_id: string;
  title: string;
  objective: string;
  content: string; // markdown 或纯文本
  duration_min: number;
};

export type QuizChoice = {
  id: string;
  text: string;
  correct: boolean;
};

export type QuizQuestion = {
  id: string;
  lesson_id: string;
  prompt: string;
  choices: QuizChoice[];
};