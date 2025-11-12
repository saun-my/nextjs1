export type Course = {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  cover_url: string;
  lessons_count: number;
  prerequisites: string[]; // 先修课程ID数组
  tags: string[]; // 课程标签，用于推荐
  estimated_hours: number; // 预计学习时长
  difficulty_score: number; // 难度评分 1-10
};

export type Lesson = {
  id: string;
  course_id: string;
  title: string;
  objective: string;
  content: string; // markdown 或纯文本
  duration_min: number;
  order_index: number; // 课程顺序
  interactive_elements?: InteractiveElement[]; // 交互式元素
};

export type InteractiveElement = {
  id: string;
  type: 'code_editor' | 'quiz' | 'drag_drop' | 'simulation';
  content: any; // 根据类型变化的配置数据
  title?: string;
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

// 学习路径相关类型
export type LearningPath = {
  id: string;
  title: string;
  description: string;
  courses: string[]; // 课程ID数组，按顺序
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_total_hours: number;
  tags: string[];
  completion_badge: string; // 完成徽章URL
};

// 用户学习进度
export type UserLearningProgress = {
  user_id: string;
  course_progress: CourseProgress[];
  overall_stats: LearningStats;
  achievements: Achievement[];
  learning_streak: number; // 连续学习天数
  last_study_date: Date;
};

export type CourseProgress = {
  course_id: string;
  completed_lessons: string[]; // 已完成课程ID
  total_score: number; // 总得分
  time_spent_minutes: number; // 学习时长
  completion_percentage: number; // 完成百分比
  last_accessed: Date;
  is_completed: boolean;
  certificate_earned: boolean;
};

export type LearningStats = {
  total_courses_completed: number;
  total_lessons_completed: number;
  total_study_time_hours: number;
  average_score: number;
  current_streak: number;
  longest_streak: number;
};

// 成就系统
export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon_url: string;
  earned_date: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'completion' | 'streak' | 'score' | 'speed' | 'exploration';
};

// 推荐系统相关
export type LearningRecommendation = {
  course_id: string;
  score: number; // 推荐分数 0-100
  reason: string; // 推荐理由
  type: 'continue' | 'next_level' | 'related' | 'trending';
};

export type UserLearningProfile = {
  user_id: string;
  preferred_difficulty: number; // 偏好难度 1-10
  preferred_topics: string[]; // 偏好主题
  learning_style: 'visual' | 'interactive' | 'reading' | 'hands_on';
  weekly_goal_hours: number;
  study_time_preference: 'morning' | 'afternoon' | 'evening' | 'flexible';
};

// 学习活动日志
export type LearningActivity = {
  id: string;
  user_id: string;
  course_id: string;
  lesson_id?: string;
  activity_type: 'course_started' | 'lesson_completed' | 'quiz_submitted' | 'course_completed';
  timestamp: Date;
  score?: number;
  time_spent?: number;
}