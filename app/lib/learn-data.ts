import { 
  Course, 
  Lesson, 
  LearningPath, 
  UserLearningProgress, 
  LearningRecommendation, 
  UserLearningProfile,
  LearningActivity,
  CourseProgress,
  LearningStats,
  Achievement,
  QuizQuestion
} from './learn-definitions';

// 模拟用户数据存储（实际项目中应该使用数据库）
let userProgress: Record<string, UserLearningProgress> = {};
let userProfiles: Record<string, UserLearningProfile> = {};
let learningActivities: LearningActivity[] = [];

// 获取用户学习进度
export async function getUserLearningProgress(userId: string): Promise<UserLearningProgress> {
  if (!userProgress[userId]) {
    // 初始化用户进度
    userProgress[userId] = {
      user_id: userId,
      course_progress: [],
      overall_stats: {
        total_courses_completed: 0,
        total_lessons_completed: 0,
        total_study_time_hours: 0,
        average_score: 0,
        current_streak: 0,
        longest_streak: 0
      },
      achievements: [],
      learning_streak: 0,
      last_study_date: new Date()
    };
  }
  return userProgress[userId];
}

// 更新课程进度
export async function updateCourseProgress(
  userId: string, 
  courseId: string, 
  lessonId: string,
  score: number,
  timeSpent: number
): Promise<void> {
  const progress = await getUserLearningProgress(userId);
  let courseProgress = progress.course_progress.find(cp => cp.course_id === courseId);
  
  if (!courseProgress) {
    courseProgress = {
      course_id: courseId,
      completed_lessons: [],
      total_score: 0,
      time_spent_minutes: 0,
      completion_percentage: 0,
      last_accessed: new Date(),
      is_completed: false,
      certificate_earned: false
    };
    progress.course_progress.push(courseProgress);
  }
  
  if (!courseProgress.completed_lessons.includes(lessonId)) {
    courseProgress.completed_lessons.push(lessonId);
  }
  
  courseProgress.total_score += score;
  courseProgress.time_spent_minutes += timeSpent;
  courseProgress.last_accessed = new Date();
  
  // 更新完成百分比
  const course = await getCourseById(courseId);
  if (course) {
    courseProgress.completion_percentage = (courseProgress.completed_lessons.length / course.lessons_count) * 100;
    courseProgress.is_completed = courseProgress.completion_percentage >= 100;
    
    if (courseProgress.is_completed && !courseProgress.certificate_earned) {
      courseProgress.certificate_earned = true;
      // 添加完成成就
      await addAchievement(userId, {
        id: `course_complete_${courseId}`,
        title: `完成课程：${course.title}`,
        description: '恭喜完成整个课程！',
        icon_url: '/achievements/course-complete.png',
        earned_date: new Date(),
        rarity: 'rare',
        category: 'completion'
      });
    }
  }
  
  // 更新总体统计
  updateOverallStats(progress);
  
  // 记录学习活动
  await recordLearningActivity(userId, courseId, lessonId, 'lesson_completed', score, timeSpent);
}

// 智能学习推荐算法
export async function getLearningRecommendations(userId: string): Promise<LearningRecommendation[]> {
  const progress = await getUserLearningProgress(userId);
  const userProfile = await getUserLearningProfile(userId);
  const allCourses = await getAllCourses();
  
  const recommendations: LearningRecommendation[] = [];
  
  // 1. 继续学习推荐
  const inProgressCourse = progress.course_progress.find(cp => 
    cp.completion_percentage > 0 && cp.completion_percentage < 100
  );
  
  if (inProgressCourse) {
    recommendations.push({
      course_id: inProgressCourse.course_id,
      score: 95, // 最高优先级
      reason: '继续你的学习进度',
      type: 'continue'
    });
  }
  
  // 2. 下一级别推荐
  const completedCourses = progress.course_progress
    .filter(cp => cp.is_completed)
    .map(cp => cp.course_id);
  
  for (const completedCourseId of completedCourses) {
    const completedCourse = allCourses.find(c => c.id === completedCourseId);
    if (completedCourse) {
      // 推荐同一级别的相关课程
      const relatedCourses = allCourses.filter(c => 
        c.id !== completedCourseId &&
        !completedCourses.includes(c.id) &&
        c.level === completedCourse.level &&
        c.tags.some(tag => completedCourse.tags.includes(tag))
      );
      
      relatedCourses.forEach(course => {
        recommendations.push({
          course_id: course.id,
          score: calculateRecommendationScore(course, userProfile, progress),
          reason: `基于你完成的《${completedCourse.title}》`,
          type: 'related'
        });
      });
      
      // 推荐下一级别的课程
      const nextLevel = getNextLevel(completedCourse.level);
      if (nextLevel) {
        const nextLevelCourses = allCourses.filter(c => 
          !completedCourses.includes(c.id) &&
          c.level === nextLevel &&
          (c.prerequisites.length === 0 || c.prerequisites.some(prereq => completedCourses.includes(prereq)))
        );
        
        nextLevelCourses.forEach(course => {
          recommendations.push({
            course_id: course.id,
            score: calculateRecommendationScore(course, userProfile, progress) + 10, // 稍高分数
            reason: `进阶学习：${nextLevel}级别`,
            type: 'next_level'
          });
        });
      }
    }
  }
  
  // 3. 热门课程推荐
  const trendingCourses = await getTrendingCourses();
  trendingCourses.forEach(course => {
    if (!completedCourses.includes(course.id)) {
      recommendations.push({
        course_id: course.id,
        score: calculateRecommendationScore(course, userProfile, progress) + 5,
        reason: '热门课程',
        type: 'trending'
      });
    }
  });
  
  // 去重并按分数排序
  const uniqueRecommendations = recommendations.reduce((acc, rec) => {
    const existing = acc.find(r => r.course_id === rec.course_id);
    if (!existing || existing.score < rec.score) {
      return [...acc.filter(r => r.course_id !== rec.course_id), rec];
    }
    return acc;
  }, [] as LearningRecommendation[]);
  
  return uniqueRecommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, 6); // 返回前6个推荐
}

// 计算推荐分数
function calculateRecommendationScore(
  course: Course, 
  userProfile: UserLearningProfile, 
  progress: UserLearningProgress
): number {
  let score = 50; // 基础分数
  
  // 难度匹配度
  const difficultyMatch = 10 - Math.abs(course.difficulty_score - userProfile.preferred_difficulty);
  score += difficultyMatch * 2;
  
  // 主题匹配度
  const topicMatches = course.tags.filter(tag => 
    userProfile.preferred_topics.includes(tag)
  ).length;
  score += topicMatches * 5;
  
  // 学习风格匹配
  if (userProfile.learning_style === 'interactive' && course.level === 'Beginner') {
    score += 10;
  }
  
  // 完成率考虑
  const courseProgress = progress.course_progress.find(cp => cp.course_id === course.id);
  if (courseProgress) {
    if (courseProgress.is_completed) {
      score = 0; // 已完成的不推荐
    } else {
      score += 20; // 已开始但未完成的增加分数
    }
  }
  
  return Math.min(100, Math.max(0, score));
}

// 获取下一级别
function getNextLevel(currentLevel: string): string | null {
  switch (currentLevel) {
    case 'Beginner': return 'Intermediate';
    case 'Intermediate': return 'Advanced';
    default: return null;
  }
}

// 获取用户学习档案
export async function getUserLearningProfile(userId: string): Promise<UserLearningProfile> {
  if (!userProfiles[userId]) {
    // 默认档案
    userProfiles[userId] = {
      user_id: userId,
      preferred_difficulty: 5,
      preferred_topics: ['programming', 'web development'],
      learning_style: 'interactive',
      weekly_goal_hours: 10,
      study_time_preference: 'flexible'
    };
  }
  return userProfiles[userId];
}

// 更新学习档案
export async function updateUserLearningProfile(
  userId: string, 
  profile: Partial<UserLearningProfile>
): Promise<void> {
  const currentProfile = await getUserLearningProfile(userId);
  userProfiles[userId] = { ...currentProfile, ...profile };
}

// 记录学习活动
export async function recordLearningActivity(
  userId: string,
  courseId: string,
  lessonId: string | undefined,
  activityType: LearningActivity['activity_type'],
  score?: number,
  timeSpent?: number
): Promise<void> {
  const activity: LearningActivity = {
    id: `${userId}_${Date.now()}`,
    user_id: userId,
    course_id: courseId,
    lesson_id: lessonId,
    activity_type: activityType,
    timestamp: new Date(),
    score,
    time_spent: timeSpent
  };
  
  learningActivities.push(activity);
  
  // 更新学习连击
  await updateLearningStreak(userId);
}

// 更新学习连击
async function updateLearningStreak(userId: string): Promise<void> {
  const progress = await getUserLearningProgress(userId);
  const today = new Date();
  const lastStudy = new Date(progress.last_study_date);
  
  const daysDiff = Math.floor((today.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === 1) {
    // 连续学习
    progress.learning_streak += 1;
    progress.overall_stats.current_streak += 1;
    progress.overall_stats.longest_streak = Math.max(
      progress.overall_stats.longest_streak,
      progress.overall_stats.current_streak
    );
  } else if (daysDiff > 1) {
    // 中断，重置连击
    progress.learning_streak = 1;
    progress.overall_stats.current_streak = 1;
  }
  
  progress.last_study_date = today;
  
  // 检查连击成就
  if (progress.learning_streak === 7) {
    await addAchievement(userId, {
      id: 'streak_7',
      title: '学习达人',
      description: '连续学习7天！',
      icon_url: '/achievements/streak-7.png',
      earned_date: new Date(),
      rarity: 'rare',
      category: 'streak'
    });
  }
}

// 添加成就
async function addAchievement(userId: string, achievement: Achievement): Promise<void> {
  const progress = await getUserLearningProgress(userId);
  const existing = progress.achievements.find(a => a.id === achievement.id);
  
  if (!existing) {
    progress.achievements.push(achievement);
  }
}

// 更新总体统计
function updateOverallStats(progress: UserLearningProgress): void {
  const stats = progress.overall_stats;
  
  stats.total_courses_completed = progress.course_progress.filter(cp => cp.is_completed).length;
  stats.total_lessons_completed = progress.course_progress.reduce((total, cp) => 
    total + cp.completed_lessons.length, 0
  );
  stats.total_study_time_hours = progress.course_progress.reduce((total, cp) => 
    total + (cp.time_spent_minutes / 60), 0
  );
  
  // 计算平均分
  const totalScore = progress.course_progress.reduce((total, cp) => total + cp.total_score, 0);
  const totalLessons = progress.course_progress.reduce((total, cp) => 
    total + cp.completed_lessons.length, 0
  );
  stats.average_score = totalLessons > 0 ? totalScore / totalLessons : 0;
}

// 模拟数据获取函数（实际项目中应该连接真实数据库）
async function getAllCourses(): Promise<Course[]> {
  // 这里应该从数据库获取，现在返回模拟数据
  return [
    {
      id: 'course_1',
      title: 'React 基础教程',
      level: 'Beginner',
      description: '学习 React 基础知识',
      cover_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=React+programming+course+cover+modern+colorful+design&image_size=landscape_4_3',
      lessons_count: 10,
      prerequisites: [],
      tags: ['react', 'javascript', 'frontend'],
      estimated_hours: 15,
      difficulty_score: 3
    },
    {
      id: 'course_2',
      title: 'Next.js 进阶',
      level: 'Intermediate',
      description: '深入学习 Next.js 框架',
      cover_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Next.js+advanced+course+cover+sleek+modern+design&image_size=landscape_4_3',
      lessons_count: 12,
      prerequisites: ['course_1'],
      tags: ['nextjs', 'react', 'fullstack'],
      estimated_hours: 20,
      difficulty_score: 6
    },
    {
      id: 'course_3',
      title: 'TypeScript 实战',
      level: 'Advanced',
      description: 'TypeScript 高级特性和最佳实践',
      cover_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=TypeScript+advanced+course+cover+professional+design&image_size=landscape_4_3',
      lessons_count: 15,
      prerequisites: ['course_1', 'course_2'],
      tags: ['typescript', 'javascript', 'type-safety'],
      estimated_hours: 25,
      difficulty_score: 8
    }
  ];
}

async function getCourseById(courseId: string): Promise<Course | undefined> {
  const courses = await getAllCourses();
  return courses.find(c => c.id === courseId);
}

async function getTrendingCourses(): Promise<Course[]> {
  const courses = await getAllCourses();
  // 模拟热门课程（基于最近活动）
  const recentActivities = learningActivities.filter(
    activity => activity.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );
  
  const coursePopularity = new Map<string, number>();
  recentActivities.forEach(activity => {
    const count = coursePopularity.get(activity.course_id) || 0;
    coursePopularity.set(activity.course_id, count + 1);
  });
  
  return courses
    .filter(course => coursePopularity.has(course.id))
    .sort((a, b) => (coursePopularity.get(b.id) || 0) - (coursePopularity.get(a.id) || 0))
    .slice(0, 3);
}

// 获取学习统计
export async function getLearningStats(userId: string): Promise<LearningStats> {
  const progress = await getUserLearningProgress(userId);
  return progress.overall_stats;
}

// 获取用户成就
export async function getUserAchievements(userId: string): Promise<Achievement[]> {
  const progress = await getUserLearningProgress(userId);
  return progress.achievements.sort((a, b) => 
    b.earned_date.getTime() - a.earned_date.getTime()
  );
}

// 英语课程数据（用于传统课程页面）
const englishCourses: Course[] = [
  {
    id: 'course-a1',
    title: 'English Foundations A1',
    level: 'Beginner',
    description:
      'Master the basics: phonetics, greetings, numbers, simple sentences.',
    cover_url: '/opengraph-image.png',
    lessons_count: 8,
    prerequisites: [],
    tags: ['english', 'beginner', 'foundation'],
    estimated_hours: 20,
    difficulty_score: 2
  },
  {
    id: 'course-b1',
    title: 'English Conversation B1',
    level: 'Intermediate',
    description:
      'Develop everyday conversation skills and listening comprehension.',
    cover_url: '/hero-mobile.png',
    lessons_count: 12,
    prerequisites: ['course-a1'],
    tags: ['english', 'conversation', 'intermediate'],
    estimated_hours: 30,
    difficulty_score: 5
  },
  {
    id: 'course-c1',
    title: 'Academic English C1',
    level: 'Advanced',
    description:
      'Focus on academic writing, presentations, and critical reading.',
    cover_url: '/hero-desktop.png',
    lessons_count: 10,
    prerequisites: ['course-b1'],
    tags: ['english', 'academic', 'advanced'],
    estimated_hours: 25,
    difficulty_score: 8
  },
];

const englishLessons: Lesson[] = [
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

const englishQuiz: QuizQuestion[] = [
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

// 英语课程相关函数（用于传统课程页面）
export async function fetchCourses(query = ''): Promise<Course[]> {
  const q = query.trim().toLowerCase();
  return englishCourses
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
  return englishCourses.find((c) => c.id === id);
}

export async function fetchLessonsByCourseId(
  courseId: string,
): Promise<Lesson[]> {
  return englishLessons.filter((l) => l.course_id === courseId);
}

export async function fetchLessonById(id: string): Promise<Lesson | undefined> {
  return englishLessons.find((l) => l.id === id);
}

export async function fetchQuizByLessonId(
  lessonId: string,
): Promise<QuizQuestion[]> {
  return englishQuiz.filter((q) => q.lesson_id === lessonId);
}