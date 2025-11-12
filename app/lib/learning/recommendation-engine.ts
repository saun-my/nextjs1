// 智能学习路径推荐算法引擎

import { 
  UserProfile, 
  Course, 
  RecommendationResult, 
  RecommendationRequest, 
  RecommendationResponse,
  SkillGap,
  RecommendationWeights,
  LearningProgress
} from './types';

export class LearningRecommendationEngine {
  private courses: Course[];
  private userProgress: Map<string, LearningProgress>;

  constructor(courses: Course[], userProgress: Map<string, LearningProgress>) {
    this.courses = courses;
    this.userProgress = userProgress;
  }

  /**
   * 主要推荐方法
   */
  async generateRecommendations(request: RecommendationRequest): Promise<RecommendationResponse> {
    const startTime = Date.now();
    
    // 获取用户画像
    const userProfile = await this.getUserProfile(request.userId);
    
    // 计算推荐分数
    const scoredCourses = this.courses
      .filter(course => this.applyFilters(course, request.filters, userProfile))
      .map(course => ({
        course,
        score: this.calculateRecommendationScore(course, userProfile, request.context),
        reasons: this.generateRecommendationReasons(course, userProfile)
      }))
      .sort((a, b) => b.score - a.score);

    // 生成技能缺口分析
    const recommendations = scoredCourses.slice(0, request.limit || 10).map(item => {
      const skillGaps = this.analyzeSkillGaps(item.course, userProfile);
      return {
        course: item.course,
        score: item.score,
        reasons: item.reasons,
        confidence: this.calculateConfidence(item.score, skillGaps),
        estimatedCompletionTime: this.estimateCompletionTime(item.course, userProfile),
        skillGapAnalysis: skillGaps
      };
    });

    return {
      recommendations,
      totalCount: scoredCourses.length,
      queryTime: Date.now() - startTime,
      hasMore: scoredCourses.length > (request.limit || 10)
    };
  }

  /**
   * 计算推荐分数
   */
  private calculateRecommendationScore(
    course: Course, 
    userProfile: UserProfile,
    context?: string
  ): number {
    const weights: RecommendationWeights = {
      skillLevel: 0.25,
      interests: 0.20,
      learningStyle: 0.15,
      difficulty: 0.15,
      popularity: 0.10,
      recency: 0.08,
      completionRate: 0.07
    };

    let totalScore = 0;

    // 1. 技能水平匹配 (25%)
    totalScore += weights.skillLevel * this.calculateSkillLevelScore(course, userProfile);
    
    // 2. 兴趣匹配 (20%)
    totalScore += weights.interests * this.calculateInterestScore(course, userProfile);
    
    // 3. 学习风格匹配 (15%)
    totalScore += weights.learningStyle * this.calculateLearningStyleScore(course, userProfile);
    
    // 4. 难度适配 (15%)
    totalScore += weights.difficulty * this.calculateDifficultyScore(course, userProfile);
    
    // 5. 受欢迎程度 (10%)
    totalScore += weights.popularity * this.calculatePopularityScore(course);
    
    // 6. 内容新鲜度 (8%)
    totalScore += weights.recency * this.calculateRecencyScore(course);
    
    // 7. 完成率 (7%)
    totalScore += weights.completionRate * this.calculateCompletionRateScore(course);

    // 上下文调整
    if (context === 'home') {
      totalScore *= 1.1; // 首页推荐稍微提高分数
    }

    return Math.min(totalScore * 100, 100); // 转换为0-100分
  }

  /**
   * 技能水平评分
   */
  private calculateSkillLevelScore(course: Course, userProfile: UserProfile): number {
    const difficultyMap = {
      'beginner': 1,
      'intermediate': 2,
      'advanced': 3,
      'expert': 4
    };

    const userLevel = difficultyMap[userProfile.skillLevel] || 1;
    const courseLevel = difficultyMap[course.difficulty] || 1;
    
    // 理想的课程应该比用户当前水平高一级
    const idealLevel = userLevel + 1;
    
    if (courseLevel === idealLevel) return 1.0;
    if (courseLevel === userLevel) return 0.8;
    if (courseLevel === userLevel + 2) return 0.6;
    if (courseLevel < userLevel) return 0.3;
    if (courseLevel > userLevel + 2) return 0.2;
    
    return 0.5;
  }

  /**
   * 兴趣匹配评分
   */
  private calculateInterestScore(course: Course, userProfile: UserProfile): number {
    const userInterests = new Set(userProfile.interests.map(i => i.toLowerCase()));
    const courseTags = new Set(course.tags.map(t => t.toLowerCase()));
    
    // 计算交集
    const intersection = new Set([...userInterests].filter(x => courseTags.has(x)));
    const union = new Set([...userInterests, ...courseTags]);
    
    if (union.size === 0) return 0.5;
    
    return intersection.size / union.size;
  }

  /**
   * 学习风格匹配评分
   */
  private calculateLearningStyleScore(course: Course, userProfile: UserProfile): number {
    // 分析课程模块的学习风格
    const styleCounts = new Map<string, number>();
    course.modules.forEach(module => {
      const style = this.getModuleLearningStyle(module);
      styleCounts.set(style, (styleCounts.get(style) || 0) + 1);
    });

    const dominantStyle = this.getDominantLearningStyle(styleCounts);
    const userStyle = userProfile.learningStyle;

    if (dominantStyle === userStyle) return 1.0;
    if (userStyle === 'mixed') return 0.8;
    if (dominantStyle === 'interactive' && userStyle === 'visual') return 0.7;
    if (dominantStyle === 'visual' && userStyle === 'interactive') return 0.7;
    
    return 0.4;
  }

  /**
   * 难度适配评分
   */
  private calculateDifficultyScore(course: Course, userProfile: UserProfile): number {
    const userPrefers = userProfile.preferredDifficulty;
    const courseDifficulty = course.difficulty;

    if (userPrefers === 'adaptive') {
      // 自适应难度：基于用户历史表现
      const userProgress = this.userProgress.get(userProfile.id);
      if (userProgress) {
        const avgScore = this.calculateAverageScore(userProgress);
        if (avgScore > 80 && courseDifficulty === 'advanced') return 1.0;
        if (avgScore > 60 && courseDifficulty === 'intermediate') return 0.9;
        if (avgScore <= 60 && courseDifficulty === 'beginner') return 1.0;
      }
      return 0.6;
    }

    const difficultyPreference = {
      'easy': ['beginner'],
      'medium': ['beginner', 'intermediate'],
      'hard': ['intermediate', 'advanced', 'expert']
    };

    const preferredDifficulties = difficultyPreference[userPrefers] || ['beginner'];
    return preferredDifficulties.includes(courseDifficulty) ? 1.0 : 0.3;
  }

  /**
   * 受欢迎程度评分
   */
  private calculatePopularityScore(course: Course): number {
    const maxEnrollment = 10000; // 假设最大注册数
    const maxRating = 5;
    
    const enrollmentScore = Math.min(course.enrollmentCount / maxEnrollment, 1);
    const ratingScore = course.rating / maxRating;
    
    return (enrollmentScore * 0.6 + ratingScore * 0.4);
  }

  /**
   * 内容新鲜度评分
   */
  private calculateRecencyScore(course: Course): number {
    const now = new Date();
    const courseDate = course.lastUpdated;
    const daysDiff = (now.getTime() - courseDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysDiff < 30) return 1.0;      // 一个月内
    if (daysDiff < 90) return 0.8;      // 三个月内
    if (daysDiff < 180) return 0.6;     // 半年内
    if (daysDiff < 365) return 0.4;     // 一年内
    return 0.2;                          // 超过一年
  }

  /**
   * 完成率评分
   */
  private calculateCompletionRateScore(course: Course): number {
    return course.completionRate / 100;
  }

  /**
   * 生成推荐理由
   */
  private generateRecommendationReasons(course: Course, userProfile: UserProfile): string[] {
    const reasons: string[] = [];

    // 技能匹配理由
    const skillScore = this.calculateSkillLevelScore(course, userProfile);
    if (skillScore > 0.8) {
      reasons.push(`完美匹配你的${userProfile.skillLevel}技能水平`);
    } else if (skillScore > 0.6) {
      reasons.push(`适合你的技能水平，有助于技能提升`);
    }

    // 兴趣匹配理由
    const interestScore = this.calculateInterestScore(course, userProfile);
    if (interestScore > 0.7) {
      const matchingInterests = userProfile.interests.filter(interest => 
        course.tags.some(tag => tag.toLowerCase().includes(interest.toLowerCase()))
      );
      reasons.push(`匹配你的兴趣：${matchingInterests.join('、')}`);
    }

    // 热门程度理由
    if (course.enrollmentCount > 1000) {
      reasons.push(`已有${course.enrollmentCount}人学习，广受欢迎`);
    }

    // 高评分理由
    if (course.rating > 4.5) {
      reasons.push(`评分高达${course.rating}分，质量优秀`);
    }

    // 学习风格理由
    const styleScore = this.calculateLearningStyleScore(course, userProfile);
    if (styleScore > 0.8) {
      reasons.push(`符合你的${userProfile.learningStyle}学习风格`);
    }

    return reasons;
  }

  /**
   * 分析技能缺口
   */
  private analyzeSkillGaps(course: Course, userProfile: UserProfile): SkillGap[] {
    const skillGaps: SkillGap[] = [];
    
    course.learningObjectives.forEach(objective => {
      const userSkillLevel = this.assessUserSkillLevel(userProfile, objective);
      const requiredLevel = this.assessRequiredSkillLevel(objective);
      
      if (userSkillLevel < requiredLevel) {
        skillGaps.push({
          skill: objective,
          currentLevel: userSkillLevel,
          requiredLevel,
          gap: requiredLevel - userSkillLevel,
          priority: this.calculateGapPriority(requiredLevel - userSkillLevel),
          recommendedCourses: this.findCoursesForSkill(objective)
        });
      }
    });

    return skillGaps.sort((a, b) => b.gap - a.gap);
  }

  /**
   * 计算置信度
   */
  private calculateConfidence(score: number, skillGaps: SkillGap[]): number {
    const baseConfidence = score / 100;
    const skillGapPenalty = Math.min(skillGaps.length * 0.1, 0.3);
    return Math.max(baseConfidence - skillGapPenalty, 0.1);
  }

  /**
   * 估算完成时间
   */
  private estimateCompletionTime(course: Course, userProfile: UserProfile): number {
    const baseHours = course.estimatedHours;
    
    // 根据用户学习速度调整
    const speedMultiplier = this.getUserLearningSpeed(userProfile);
    
    // 根据难度调整
    const difficultyMultiplier = this.getDifficultyMultiplier(course.difficulty, userProfile);
    
    return Math.round(baseHours * speedMultiplier * difficultyMultiplier);
  }

  // 辅助方法
  async getUserProfile(userId: string): Promise<UserProfile> {
    // 这里应该从数据库获取用户数据
    // 现在返回模拟数据
    return {
      id: userId,
      name: '学习者',
      email: 'learner@example.com',
      skillLevel: 'intermediate',
      interests: ['JavaScript', 'React', 'Web开发'],
      learningGoals: ['成为全栈开发者', '掌握现代前端技术'],
      completedCourses: ['course-1', 'course-2'],
      currentCourses: ['course-3'],
      learningStyle: 'interactive',
      timeAvailability: 'moderate',
      preferredDifficulty: 'adaptive'
    };
  }

  private applyFilters(course: Course, filters: any, userProfile: UserProfile): boolean {
    if (!filters) return true;

    if (filters.excludeCompleted && userProfile.completedCourses.includes(course.id)) {
      return false;
    }

    if (filters.maxDifficulty) {
      const difficultyOrder = ['beginner', 'intermediate', 'advanced', 'expert'];
      const courseLevel = difficultyOrder.indexOf(course.difficulty);
      const maxLevel = difficultyOrder.indexOf(filters.maxDifficulty);
      if (courseLevel > maxLevel) return false;
    }

    if (filters.categories && !filters.categories.includes(course.category)) {
      return false;
    }

    return true;
  }

  private getModuleLearningStyle(module: any): string {
    // 简化实现
    return 'interactive';
  }

  private getDominantLearningStyle(styleCounts: Map<string, number>): string {
    return Array.from(styleCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || 'text';
  }

  private calculateAverageScore(userProgress: LearningProgress): number {
    if (!userProgress.assessmentScores.length) return 0;
    const total = userProgress.assessmentScores.reduce((sum, score) => sum + score.score, 0);
    return total / userProgress.assessmentScores.length;
  }

  private assessUserSkillLevel(userProfile: UserProfile, skill: string): number {
    // 简化实现
    return userProfile.skillLevel === 'intermediate' ? 5 : 3;
  }

  private assessRequiredSkillLevel(objective: string): number {
    // 简化实现
    return 7;
  }

  private calculateGapPriority(gap: number): 'high' | 'medium' | 'low' {
    if (gap >= 4) return 'high';
    if (gap >= 2) return 'medium';
    return 'low';
  }

  private findCoursesForSkill(skill: string): string[] {
    // 简化实现
    return ['course-1', 'course-2'];
  }

  private getUserLearningSpeed(userProfile: UserProfile): number {
    return userProfile.timeAvailability === 'moderate' ? 1.2 : 1.0;
  }

  private getDifficultyMultiplier(difficulty: string, userProfile: UserProfile): number {
    const difficultyMap = {
      'beginner': 0.8,
      'intermediate': 1.0,
      'advanced': 1.3,
      'expert': 1.5
    };
    return difficultyMap[difficulty as keyof typeof difficultyMap] || 1.0;
  }
}

// 示例数据生成器
export function generateSampleCourses(): Course[] {
  return [
    {
      id: 'react-fundamentals',
      title: 'React 基础教程',
      description: '从零开始学习React，掌握现代前端开发的核心技能',
      category: 'Frontend',
      difficulty: 'beginner',
      estimatedHours: 20,
      prerequisites: ['html-css-basic', 'javascript-basic'],
      tags: ['React', 'JavaScript', 'Frontend', 'Web开发'],
      learningObjectives: ['掌握React组件开发', '理解状态管理', '学会使用Hooks'],
      modules: [],
      rating: 4.8,
      enrollmentCount: 15420,
      completionRate: 0.78,
      lastUpdated: new Date('2024-01-15')
    },
    {
      id: 'advanced-react-patterns',
      title: 'React 高级模式',
      description: '深入学习React高级模式和最佳实践',
      category: 'Frontend',
      difficulty: 'advanced',
      estimatedHours: 35,
      prerequisites: ['react-fundamentals', 'javascript-advanced'],
      tags: ['React', 'JavaScript', 'Design Patterns', 'Performance'],
      learningObjectives: ['掌握高级React模式', '优化应用性能', '构建可扩展应用'],
      modules: [],
      rating: 4.9,
      enrollmentCount: 8930,
      completionRate: 0.65,
      lastUpdated: new Date('2024-02-01')
    },
    {
      id: 'fullstack-nextjs',
      title: '全栈 Next.js 开发',
      description: '使用Next.js构建全栈Web应用',
      category: 'Fullstack',
      difficulty: 'intermediate',
      estimatedHours: 45,
      prerequisites: ['react-fundamentals', 'nodejs-basic'],
      tags: ['Next.js', 'React', 'Fullstack', 'TypeScript'],
      learningObjectives: ['掌握Next.js框架', '构建全栈应用', '部署生产应用'],
      modules: [],
      rating: 4.7,
      enrollmentCount: 12350,
      completionRate: 0.72,
      lastUpdated: new Date('2024-01-20')
    }
  ];
}

export function generateSampleUserProgress(): Map<string, LearningProgress> {
  const progress = new Map<string, LearningProgress>();
  
  progress.set('user-1', {
    userId: 'user-1',
    courseId: 'react-fundamentals',
    moduleProgress: [],
    overallProgress: 75,
    lastAccessed: new Date(),
    timeSpent: 900,
    assessmentScores: [
      { assessmentId: 'quiz-1', score: 85, maxScore: 100, passed: true, completedAt: new Date(), attempts: 1 }
    ],
    achievements: []
  });

  return progress;
}
