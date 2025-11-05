import { unstable_noStore as noStore } from 'next/cache';
import type { Course, Lesson, QuizQuestion } from './learn-definitions';

const courses: Course[] = [
  {
    id: 'course-a1',
    title: 'English Foundations A1',
    level: 'Beginner',
    description:
      'Master the basics: phonetics, greetings, numbers, simple sentences.',
    cover_url: '/opengraph-image.png',
    lessons_count: 8,
  },
  {
    id: 'course-b1',
    title: 'English Conversation B1',
    level: 'Intermediate',
    description:
      'Develop everyday conversation skills and listening comprehension.',
    cover_url: '/hero-mobile.png',
    lessons_count: 12,
  },
  {
    id: 'course-c1',
    title: 'Academic English C1',
    level: 'Advanced',
    description:
      'Focus on academic writing, presentations, and critical reading.',
    cover_url: '/hero-desktop.png',
    lessons_count: 10,
  },
];

const lessons: Lesson[] = [
  {
    id: 'lesson-a1-01',
    course_id: 'course-a1',
    title: 'Alphabet & Sounds',
    objective: 'Recognize basic English letters and common sounds.',
    content:
      'Introduction to English alphabet.\nPractice phonetics.\nCommon vowel sounds.',
    duration_min: 20,
  },
  {
    id: 'lesson-a1-02',
    course_id: 'course-a1',
    title: 'Greetings & Introductions',
    objective: 'Use greetings and introduce yourself.',
    content:
      'Hi, Hello, Good morning.\nHow to introduce yourself with simple sentences.',
    duration_min: 25,
  },
  {
    id: 'lesson-b1-01',
    course_id: 'course-b1',
    title: 'Small Talk Basics',
    objective: 'Engage in small talk about weather, hobbies, and news.',
    content:
      'Small talk starters.\nPolite responses and follow-up questions.\nRole-play examples.',
    duration_min: 30,
  },
];

const quiz: QuizQuestion[] = [
  {
    id: 'q-a1-02-1',
    lesson_id: 'lesson-a1-02',
    prompt: 'Choose the correct greeting for morning.',
    choices: [
      { id: 'c1', text: 'Good morning', correct: true },
      { id: 'c2', text: 'Good night', correct: false },
      { id: 'c3', text: 'See you', correct: false },
    ],
  },
];

// 模拟延迟，便于观察 streaming
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchCourses(query = ''): Promise<Course[]> {
  noStore();
  await delay(1200);
  const q = query.trim().toLowerCase();
  return courses
    .filter((c) => {
      if (!q) return true;
      return (
        c.title.toLowerCase().includes(q) ||
        c.level.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

export async function fetchCourseById(id: string): Promise<Course | undefined> {
  noStore();
  await delay(800);
  return courses.find((c) => c.id === id);
}

export async function fetchLessonsByCourseId(
  courseId: string,
): Promise<Lesson[]> {
  noStore();
  await delay(1500);
  return lessons.filter((l) => l.course_id === courseId);
}

export async function fetchLessonById(id: string): Promise<Lesson | undefined> {
  noStore();
  await delay(1000);
  return lessons.find((l) => l.id === id);
}

export async function fetchQuizByLessonId(
  lessonId: string,
): Promise<QuizQuestion[]> {
  noStore();
  await delay(600);
  return quiz.filter((q) => q.lesson_id === lessonId);
}