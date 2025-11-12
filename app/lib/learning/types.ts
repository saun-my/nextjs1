// 智能学习路径推荐系统类型定义

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  interests: string[];
  learningGoals: string[];
  completedCourses: string[];
  currentCourses: string[];
  learningStyle: 'visual' | 'text' | 'interactive' | 'mixed';
  timeAvailability: 'limited' | 'moderate' | 'extensive';
  preferredDifficulty: 'easy' | 'medium' | 'hard' | 'adaptive';
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedHours: number;
  prerequisites: string[];
  tags: string[];
  learningObjectives: string[];
  modules: Module[];
  rating: number;
  enrollmentCount: number;
  completionRate: number;
  lastUpdated: Date;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  estimatedHours: number;
  type: 'video' | 'text' | 'interactive' | 'quiz' | 'project';
  content: ModuleContent[];
  assessments: Assessment[];
}

export interface ModuleContent {
  id: string;
  type: 'video' | 'text' | 'code' | 'image' | 'interactive';
  title: string;
  content: string;
  duration?: number;
  interactiveElements?: InteractiveElement[];
}

export interface InteractiveElement {
  id: string;
  type: 'code-editor' | 'quiz' | 'drag-drop' | 'simulation';
  content: any;
  solution?: any;
  hints?: string[];
}

export interface Assessment {
  id: string;
  type: 'quiz' | 'project' | 'peer-review';
  questions: Question[];
  passingScore: number;
  timeLimit?: number;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'code';
  question: string;
  options?: string[];
  correctAnswer: any;
  explanation?: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  courses: string[]; // Course IDs
  totalHours: number;
  difficultyProgression: 'gradual' | 'steep' | 'mixed';
  targetSkills: string[];
  careerTracks: string[];
  completionCertificate?: string;
}

export interface RecommendationEngine {
  id: string;
  name: string;
  algorithm: 'collaborative-filtering' | 'content-based' | 'hybrid' | 'knowledge-graph';
  weights: RecommendationWeights;
  filters: RecommendationFilters;
}

export interface RecommendationWeights {
  skillLevel: number;      // 0-1, 用户技能水平权重
  interests: number;       // 0-1, 兴趣匹配权重
  learningStyle: number;   // 0-1, 学习风格匹配权重
  difficulty: number;      // 0-1, 难度适配权重
  popularity: number;    // 0-1, 受欢迎程度权重
  recency: number;       // 0-1, 内容新鲜度权重
  completionRate: number; // 0-1, 完成率权重
}

export interface RecommendationFilters {
  maxDifficulty?: string;
  minDifficulty?: string;
  categories?: string[];
  excludeCompleted?: boolean;
  maxDuration?: number;
  tags?: string[];
}

export interface RecommendationResult {
  course: Course;
  score: number;          // 0-100, 推荐分数
  reasons: string[];      // 推荐理由
  confidence: number;     // 0-1, 置信度
  estimatedCompletionTime: number;
  skillGapAnalysis: SkillGap[];
}

export interface SkillGap {
  skill: string;
  currentLevel: number;   // 0-10
  requiredLevel: number;  // 0-10
  gap: number;            // required - current
  priority: 'high' | 'medium' | 'low';
  recommendedCourses: string[];
}

export interface LearningProgress {
  userId: string;
  courseId: string;
  moduleProgress: ModuleProgress[];
  overallProgress: number; // 0-100
  lastAccessed: Date;
  timeSpent: number;      // 分钟
  assessmentScores: AssessmentScore[];
  achievements: Achievement[];
}

export interface ModuleProgress {
  moduleId: string;
  completed: boolean;
  score?: number;
  timeSpent: number;
  completedAt?: Date;
  attempts: number;
}

export interface AssessmentScore {
  assessmentId: string;
  score: number;
  maxScore: number;
  passed: boolean;
  completedAt: Date;
  attempts: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: 'completion' | 'performance' | 'consistency' | 'mastery';
}

export interface RecommendationRequest {
  userId: string;
  context?: 'home' | 'course-detail' | 'learning-path' | 'search';
  limit?: number;
  includeExplanations?: boolean;
  filters?: RecommendationFilters;
}

export interface RecommendationResponse {
  recommendations: RecommendationResult[];
  totalCount: number;
  queryTime: number;
  hasMore: boolean;
  nextCursor?: string;
}

export interface LearningAnalytics {
  userId: string;
  totalLearningTime: number;
  coursesCompleted: number;
  averageScore: number;
  streakDays: number;
  skillProgress: SkillProgress[];
  learningEfficiency: number; // 0-100
  preferredLearningTime: string[];
}

export interface SkillProgress {
  skill: string;
  level: number;      // 0-10
  progress: number;   // 0-100
  lastImproved: Date;
}

// 枚举定义
export enum LearningStyle {
  VISUAL = 'visual',
  TEXT = 'text',
  INTERACTIVE = 'interactive',
  MIXED = 'mixed'
}

export enum Difficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

export enum CourseType {
  VIDEO = 'video',
  TEXT = 'text',
  INTERACTIVE = 'interactive',
  QUIZ = 'quiz',
  PROJECT = 'project'
}

export enum RecommendationAlgorithm {
  COLLABORATIVE = 'collaborative-filtering',
  CONTENT_BASED = 'content-based',
  HYBRID = 'hybrid',
  KNOWLEDGE_GRAPH = 'knowledge-graph'
}