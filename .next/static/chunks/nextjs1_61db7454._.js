(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/nextjs1/app/lib/learn-data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchCourseById",
    ()=>fetchCourseById,
    "fetchCourses",
    ()=>fetchCourses,
    "fetchLessonById",
    ()=>fetchLessonById,
    "fetchLessonsByCourseId",
    ()=>fetchLessonsByCourseId,
    "fetchQuizByLessonId",
    ()=>fetchQuizByLessonId,
    "getLearningRecommendations",
    ()=>getLearningRecommendations,
    "getLearningStats",
    ()=>getLearningStats,
    "getUserAchievements",
    ()=>getUserAchievements,
    "getUserLearningProfile",
    ()=>getUserLearningProfile,
    "getUserLearningProgress",
    ()=>getUserLearningProgress,
    "recordLearningActivity",
    ()=>recordLearningActivity,
    "updateCourseProgress",
    ()=>updateCourseProgress,
    "updateUserLearningProfile",
    ()=>updateUserLearningProfile
]);
// 模拟用户数据存储（实际项目中应该使用数据库）
let userProgress = {};
let userProfiles = {};
let learningActivities = [];
async function getUserLearningProgress(userId) {
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
async function updateCourseProgress(userId, courseId, lessonId, score, timeSpent) {
    const progress = await getUserLearningProgress(userId);
    let courseProgress = progress.course_progress.find((cp)=>cp.course_id === courseId);
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
        courseProgress.completion_percentage = courseProgress.completed_lessons.length / course.lessons_count * 100;
        courseProgress.is_completed = courseProgress.completion_percentage >= 100;
        if (courseProgress.is_completed && !courseProgress.certificate_earned) {
            courseProgress.certificate_earned = true;
            // 添加完成成就
            await addAchievement(userId, {
                id: "course_complete_".concat(courseId),
                title: "完成课程：".concat(course.title),
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
async function getLearningRecommendations(userId) {
    const progress = await getUserLearningProgress(userId);
    const userProfile = await getUserLearningProfile(userId);
    const allCourses = await getAllCourses();
    const recommendations = [];
    // 1. 继续学习推荐
    const inProgressCourse = progress.course_progress.find((cp)=>cp.completion_percentage > 0 && cp.completion_percentage < 100);
    if (inProgressCourse) {
        recommendations.push({
            course_id: inProgressCourse.course_id,
            score: 95,
            reason: '继续你的学习进度',
            type: 'continue'
        });
    }
    // 2. 下一级别推荐
    const completedCourses = progress.course_progress.filter((cp)=>cp.is_completed).map((cp)=>cp.course_id);
    for (const completedCourseId of completedCourses){
        const completedCourse = allCourses.find((c)=>c.id === completedCourseId);
        if (completedCourse) {
            // 推荐同一级别的相关课程
            const relatedCourses = allCourses.filter((c)=>c.id !== completedCourseId && !completedCourses.includes(c.id) && c.level === completedCourse.level && c.tags.some((tag)=>completedCourse.tags.includes(tag)));
            relatedCourses.forEach((course)=>{
                recommendations.push({
                    course_id: course.id,
                    score: calculateRecommendationScore(course, userProfile, progress),
                    reason: "基于你完成的《".concat(completedCourse.title, "》"),
                    type: 'related'
                });
            });
            // 推荐下一级别的课程
            const nextLevel = getNextLevel(completedCourse.level);
            if (nextLevel) {
                const nextLevelCourses = allCourses.filter((c)=>!completedCourses.includes(c.id) && c.level === nextLevel && (c.prerequisites.length === 0 || c.prerequisites.some((prereq)=>completedCourses.includes(prereq))));
                nextLevelCourses.forEach((course)=>{
                    recommendations.push({
                        course_id: course.id,
                        score: calculateRecommendationScore(course, userProfile, progress) + 10,
                        reason: "进阶学习：".concat(nextLevel, "级别"),
                        type: 'next_level'
                    });
                });
            }
        }
    }
    // 3. 热门课程推荐
    const trendingCourses = await getTrendingCourses();
    trendingCourses.forEach((course)=>{
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
    const uniqueRecommendations = recommendations.reduce((acc, rec)=>{
        const existing = acc.find((r)=>r.course_id === rec.course_id);
        if (!existing || existing.score < rec.score) {
            return [
                ...acc.filter((r)=>r.course_id !== rec.course_id),
                rec
            ];
        }
        return acc;
    }, []);
    return uniqueRecommendations.sort((a, b)=>b.score - a.score).slice(0, 6); // 返回前6个推荐
}
// 计算推荐分数
function calculateRecommendationScore(course, userProfile, progress) {
    let score = 50; // 基础分数
    // 难度匹配度
    const difficultyMatch = 10 - Math.abs(course.difficulty_score - userProfile.preferred_difficulty);
    score += difficultyMatch * 2;
    // 主题匹配度
    const topicMatches = course.tags.filter((tag)=>userProfile.preferred_topics.includes(tag)).length;
    score += topicMatches * 5;
    // 学习风格匹配
    if (userProfile.learning_style === 'interactive' && course.level === 'Beginner') {
        score += 10;
    }
    // 完成率考虑
    const courseProgress = progress.course_progress.find((cp)=>cp.course_id === course.id);
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
function getNextLevel(currentLevel) {
    switch(currentLevel){
        case 'Beginner':
            return 'Intermediate';
        case 'Intermediate':
            return 'Advanced';
        default:
            return null;
    }
}
async function getUserLearningProfile(userId) {
    if (!userProfiles[userId]) {
        // 默认档案
        userProfiles[userId] = {
            user_id: userId,
            preferred_difficulty: 5,
            preferred_topics: [
                'programming',
                'web development'
            ],
            learning_style: 'interactive',
            weekly_goal_hours: 10,
            study_time_preference: 'flexible'
        };
    }
    return userProfiles[userId];
}
async function updateUserLearningProfile(userId, profile) {
    const currentProfile = await getUserLearningProfile(userId);
    userProfiles[userId] = {
        ...currentProfile,
        ...profile
    };
}
async function recordLearningActivity(userId, courseId, lessonId, activityType, score, timeSpent) {
    const activity = {
        id: "".concat(userId, "_").concat(Date.now()),
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
async function updateLearningStreak(userId) {
    const progress = await getUserLearningProgress(userId);
    const today = new Date();
    const lastStudy = new Date(progress.last_study_date);
    const daysDiff = Math.floor((today.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff === 1) {
        // 连续学习
        progress.learning_streak += 1;
        progress.overall_stats.current_streak += 1;
        progress.overall_stats.longest_streak = Math.max(progress.overall_stats.longest_streak, progress.overall_stats.current_streak);
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
async function addAchievement(userId, achievement) {
    const progress = await getUserLearningProgress(userId);
    const existing = progress.achievements.find((a)=>a.id === achievement.id);
    if (!existing) {
        progress.achievements.push(achievement);
    }
}
// 更新总体统计
function updateOverallStats(progress) {
    const stats = progress.overall_stats;
    stats.total_courses_completed = progress.course_progress.filter((cp)=>cp.is_completed).length;
    stats.total_lessons_completed = progress.course_progress.reduce((total, cp)=>total + cp.completed_lessons.length, 0);
    stats.total_study_time_hours = progress.course_progress.reduce((total, cp)=>total + cp.time_spent_minutes / 60, 0);
    // 计算平均分
    const totalScore = progress.course_progress.reduce((total, cp)=>total + cp.total_score, 0);
    const totalLessons = progress.course_progress.reduce((total, cp)=>total + cp.completed_lessons.length, 0);
    stats.average_score = totalLessons > 0 ? totalScore / totalLessons : 0;
}
// 模拟数据获取函数（实际项目中应该连接真实数据库）
async function getAllCourses() {
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
            tags: [
                'react',
                'javascript',
                'frontend'
            ],
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
            prerequisites: [
                'course_1'
            ],
            tags: [
                'nextjs',
                'react',
                'fullstack'
            ],
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
            prerequisites: [
                'course_1',
                'course_2'
            ],
            tags: [
                'typescript',
                'javascript',
                'type-safety'
            ],
            estimated_hours: 25,
            difficulty_score: 8
        }
    ];
}
async function getCourseById(courseId) {
    const courses = await getAllCourses();
    return courses.find((c)=>c.id === courseId);
}
async function getTrendingCourses() {
    const courses = await getAllCourses();
    // 模拟热门课程（基于最近活动）
    const recentActivities = learningActivities.filter((activity)=>activity.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    const coursePopularity = new Map();
    recentActivities.forEach((activity)=>{
        const count = coursePopularity.get(activity.course_id) || 0;
        coursePopularity.set(activity.course_id, count + 1);
    });
    return courses.filter((course)=>coursePopularity.has(course.id)).sort((a, b)=>(coursePopularity.get(b.id) || 0) - (coursePopularity.get(a.id) || 0)).slice(0, 3);
}
async function getLearningStats(userId) {
    const progress = await getUserLearningProgress(userId);
    return progress.overall_stats;
}
async function getUserAchievements(userId) {
    const progress = await getUserLearningProgress(userId);
    return progress.achievements.sort((a, b)=>b.earned_date.getTime() - a.earned_date.getTime());
}
// 英语课程数据（用于传统课程页面）
const englishCourses = [
    {
        id: 'course-a1',
        title: 'English Foundations A1',
        level: 'Beginner',
        description: 'Master the basics: phonetics, greetings, numbers, simple sentences.',
        cover_url: '/opengraph-image.png',
        lessons_count: 8,
        prerequisites: [],
        tags: [
            'english',
            'beginner',
            'foundation'
        ],
        estimated_hours: 20,
        difficulty_score: 2
    },
    {
        id: 'course-b1',
        title: 'English Conversation B1',
        level: 'Intermediate',
        description: 'Develop everyday conversation skills and listening comprehension.',
        cover_url: '/hero-mobile.png',
        lessons_count: 12,
        prerequisites: [
            'course-a1'
        ],
        tags: [
            'english',
            'conversation',
            'intermediate'
        ],
        estimated_hours: 30,
        difficulty_score: 5
    },
    {
        id: 'course-c1',
        title: 'Academic English C1',
        level: 'Advanced',
        description: 'Focus on academic writing, presentations, and critical reading.',
        cover_url: '/hero-desktop.png',
        lessons_count: 10,
        prerequisites: [
            'course-b1'
        ],
        tags: [
            'english',
            'academic',
            'advanced'
        ],
        estimated_hours: 25,
        difficulty_score: 8
    }
];
const englishLessons = [
    {
        id: 'lesson-a1-01',
        course_id: 'course-a1',
        title: 'Alphabet & Sounds',
        objective: 'Recognize basic English letters and common sounds.',
        content: 'Introduction to English alphabet.\nPractice phonetics.\nCommon vowel sounds.',
        duration_min: 20
    },
    {
        id: 'lesson-a1-02',
        course_id: 'course-a1',
        title: 'Greetings & Introductions',
        objective: 'Use greetings and introduce yourself.',
        content: 'Hi, Hello, Good morning.\nHow to introduce yourself with simple sentences.',
        duration_min: 25
    },
    {
        id: 'lesson-b1-01',
        course_id: 'course-b1',
        title: 'Small Talk Basics',
        objective: 'Engage in small talk about weather, hobbies, and news.',
        content: 'Small talk starters.\nPolite responses and follow-up questions.\nRole-play examples.',
        duration_min: 30
    }
];
const englishQuiz = [
    {
        id: 'q-a1-02-1',
        lesson_id: 'lesson-a1-02',
        prompt: 'Choose the correct greeting for morning.',
        choices: [
            {
                id: 'c1',
                text: 'Good morning',
                correct: true
            },
            {
                id: 'c2',
                text: 'Good night',
                correct: false
            },
            {
                id: 'c3',
                text: 'See you',
                correct: false
            }
        ]
    }
];
async function fetchCourses() {
    let query = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : '';
    const q = query.trim().toLowerCase();
    return englishCourses.filter((c)=>{
        if (!q) return true;
        return c.title.toLowerCase().includes(q) || c.level.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
    }).sort((a, b)=>a.title.localeCompare(b.title));
}
async function fetchCourseById(id) {
    return englishCourses.find((c)=>c.id === id);
}
async function fetchLessonsByCourseId(courseId) {
    return englishLessons.filter((l)=>l.course_id === courseId);
}
async function fetchLessonById(id) {
    return englishLessons.find((l)=>l.id === id);
}
async function fetchQuizByLessonId(lessonId) {
    return englishQuiz.filter((q)=>q.lesson_id === lessonId);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/nextjs1/app/ui/learn/nav-grid-enhanced.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LearnNavGridEnhanced
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/nextjs1/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/nextjs1/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/nextjs1/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$BookOpenIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpenIcon$3e$__ = __turbopack_context__.i("[project]/nextjs1/node_modules/@heroicons/react/24/outline/esm/BookOpenIcon.js [app-client] (ecmascript) <export default as BookOpenIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$AcademicCapIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AcademicCapIcon$3e$__ = __turbopack_context__.i("[project]/nextjs1/node_modules/@heroicons/react/24/outline/esm/AcademicCapIcon.js [app-client] (ecmascript) <export default as AcademicCapIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ChartBarIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChartBarIcon$3e$__ = __turbopack_context__.i("[project]/nextjs1/node_modules/@heroicons/react/24/outline/esm/ChartBarIcon.js [app-client] (ecmascript) <export default as ChartBarIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$MagnifyingGlassIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MagnifyingGlassIcon$3e$__ = __turbopack_context__.i("[project]/nextjs1/node_modules/@heroicons/react/24/outline/esm/MagnifyingGlassIcon.js [app-client] (ecmascript) <export default as MagnifyingGlassIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$TrophyIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrophyIcon$3e$__ = __turbopack_context__.i("[project]/nextjs1/node_modules/@heroicons/react/24/outline/esm/TrophyIcon.js [app-client] (ecmascript) <export default as TrophyIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$FireIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FireIcon$3e$__ = __turbopack_context__.i("[project]/nextjs1/node_modules/@heroicons/react/24/outline/esm/FireIcon.js [app-client] (ecmascript) <export default as FireIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ClockIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClockIcon$3e$__ = __turbopack_context__.i("[project]/nextjs1/node_modules/@heroicons/react/24/outline/esm/ClockIcon.js [app-client] (ecmascript) <export default as ClockIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ChartPieIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChartPieIcon$3e$__ = __turbopack_context__.i("[project]/nextjs1/node_modules/@heroicons/react/24/outline/esm/ChartPieIcon.js [app-client] (ecmascript) <export default as ChartPieIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$CogIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CogIcon$3e$__ = __turbopack_context__.i("[project]/nextjs1/node_modules/@heroicons/react/24/outline/esm/CogIcon.js [app-client] (ecmascript) <export default as CogIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$SparklesIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SparklesIcon$3e$__ = __turbopack_context__.i("[project]/nextjs1/node_modules/@heroicons/react/24/outline/esm/SparklesIcon.js [app-client] (ecmascript) <export default as SparklesIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$UserGroupIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserGroupIcon$3e$__ = __turbopack_context__.i("[project]/nextjs1/node_modules/@heroicons/react/24/outline/esm/UserGroupIcon.js [app-client] (ecmascript) <export default as UserGroupIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$app$2f$lib$2f$learn$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/nextjs1/app/lib/learn-data.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function LearnNavGridEnhanced(param) {
    let { userId } = param;
    var _userProgress_course_progress, _userProgress_course_progress1, _userProgress_course_progress2, _userProgress_achievements;
    _s();
    const [userProgress, setUserProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [stats, setStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LearnNavGridEnhanced.useEffect": ()=>{
            async function loadProgress() {
                try {
                    const [progress, statsData] = await Promise.all([
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$app$2f$lib$2f$learn$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUserLearningProgress"])(userId),
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$app$2f$lib$2f$learn$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLearningStats"])(userId)
                    ]);
                    setUserProgress(progress);
                    setStats(statsData);
                } catch (error) {
                    console.error('Failed to load user progress:', error);
                } finally{
                    setLoading(false);
                }
            }
            loadProgress();
        }
    }["LearnNavGridEnhanced.useEffect"], [
        userId
    ]);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
            children: [
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11
            ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-xl border bg-white p-4 shadow-sm animate-pulse",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200 mb-3"
                        }, void 0, false, {
                            fileName: "[project]/nextjs1/app/ui/learn/nav-grid-enhanced.tsx",
                            lineNumber: 66,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-4 bg-gray-200 rounded w-3/4 mb-2"
                        }, void 0, false, {
                            fileName: "[project]/nextjs1/app/ui/learn/nav-grid-enhanced.tsx",
                            lineNumber: 67,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-3 bg-gray-200 rounded w-1/2"
                        }, void 0, false, {
                            fileName: "[project]/nextjs1/app/ui/learn/nav-grid-enhanced.tsx",
                            lineNumber: 68,
                            columnNumber: 13
                        }, this)
                    ]
                }, i, true, {
                    fileName: "[project]/nextjs1/app/ui/learn/nav-grid-enhanced.tsx",
                    lineNumber: 65,
                    columnNumber: 11
                }, this))
        }, void 0, false, {
            fileName: "[project]/nextjs1/app/ui/learn/nav-grid-enhanced.tsx",
            lineNumber: 63,
            columnNumber: 7
        }, this);
    }
    var _userProgress_course_progress_length, _userProgress_course_progress_reduce, _userProgress_course_progress_length1;
    // 计算总体进度
    const overallProgress = ((_userProgress_course_progress_length = userProgress === null || userProgress === void 0 ? void 0 : (_userProgress_course_progress = userProgress.course_progress) === null || _userProgress_course_progress === void 0 ? void 0 : _userProgress_course_progress.length) !== null && _userProgress_course_progress_length !== void 0 ? _userProgress_course_progress_length : 0) > 0 ? Math.round(((_userProgress_course_progress_reduce = userProgress === null || userProgress === void 0 ? void 0 : (_userProgress_course_progress1 = userProgress.course_progress) === null || _userProgress_course_progress1 === void 0 ? void 0 : _userProgress_course_progress1.reduce((sum, cp)=>sum + cp.completion_percentage, 0)) !== null && _userProgress_course_progress_reduce !== void 0 ? _userProgress_course_progress_reduce : 0) / ((_userProgress_course_progress_length1 = userProgress === null || userProgress === void 0 ? void 0 : (_userProgress_course_progress2 = userProgress.course_progress) === null || _userProgress_course_progress2 === void 0 ? void 0 : _userProgress_course_progress2.length) !== null && _userProgress_course_progress_length1 !== void 0 ? _userProgress_course_progress_length1 : 1)) : 0;
    // 获取正在学习的课程数量
    const activeCourses = (userProgress === null || userProgress === void 0 ? void 0 : userProgress.course_progress) ? userProgress.course_progress.filter((cp)=>cp.completion_percentage > 0 && cp.completion_percentage < 100).length : 0;
    var _userProgress_achievements_slice;
    // 获取最近获得的成就
    const recentAchievements = (_userProgress_achievements_slice = userProgress === null || userProgress === void 0 ? void 0 : (_userProgress_achievements = userProgress.achievements) === null || _userProgress_achievements === void 0 ? void 0 : _userProgress_achievements.slice(0, 2)) !== null && _userProgress_achievements_slice !== void 0 ? _userProgress_achievements_slice : [];
    var _stats_current_streak, _stats_total_lessons_completed, _stats_total_courses_completed, _stats_total_courses_completed1, _stats_total_study_time_hours;
    const cards = [
        {
            title: 'Browse Courses',
            desc: 'Explore curated English courses by level and topic.',
            href: '/learn/courses',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$BookOpenIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpenIcon$3e$__["BookOpenIcon"],
            color: 'bg-blue-50',
            progress: overallProgress,
            badge: activeCourses > 0 ? "".concat(activeCourses, " active") : undefined,
            badgeColor: 'bg-blue-100 text-blue-800'
        },
        {
            title: 'Continue Learning',
            desc: 'Pick up where you left off in your current courses.',
            href: '/learn/courses?filter=active',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$FireIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FireIcon$3e$__["FireIcon"],
            color: 'bg-orange-50',
            badge: ((_stats_current_streak = stats === null || stats === void 0 ? void 0 : stats.current_streak) !== null && _stats_current_streak !== void 0 ? _stats_current_streak : 0) > 0 ? "".concat(stats.current_streak, " day streak") : undefined,
            badgeColor: 'bg-orange-100 text-orange-800'
        },
        {
            title: 'Smart Path',
            desc: 'AI-powered personalized learning recommendations.',
            href: '/learn/smart-path',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$SparklesIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SparklesIcon$3e$__["SparklesIcon"],
            color: 'bg-purple-50',
            badge: 'AI推荐',
            badgeColor: 'bg-purple-100 text-purple-800'
        },
        {
            title: 'Interactive Learning',
            desc: 'Hands-on coding exercises and interactive lessons.',
            href: '/learn/interactive',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$AcademicCapIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AcademicCapIcon$3e$__["AcademicCapIcon"],
            color: 'bg-yellow-50',
            badge: 'New',
            badgeColor: 'bg-green-100 text-green-800'
        },
        {
            title: 'Collaborative Learning',
            desc: 'Learn together with real-time collaboration and chat.',
            href: '/learn/collaborate',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$UserGroupIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserGroupIcon$3e$__["UserGroupIcon"],
            color: 'bg-blue-50',
            badge: '协作',
            badgeColor: 'bg-blue-100 text-blue-800'
        },
        {
            title: 'AI Insights',
            desc: 'Get AI-powered recommendations and predictions.',
            href: '/learn/ai-insights',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ChartPieIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChartPieIcon$3e$__["ChartPieIcon"],
            color: 'bg-indigo-50',
            badge: 'AI',
            badgeColor: 'bg-indigo-100 text-indigo-800'
        },
        {
            title: 'Dashboard Builder',
            desc: 'Create custom learning dashboards with drag-and-drop.',
            href: '/learn/dashboard-builder',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$CogIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CogIcon$3e$__["CogIcon"],
            color: 'bg-teal-50',
            badge: 'Custom',
            badgeColor: 'bg-teal-100 text-teal-800'
        },
        {
            title: 'Practice',
            desc: 'Quick exercises to reinforce what you learned.',
            href: '/learn/practice',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$AcademicCapIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AcademicCapIcon$3e$__["AcademicCapIcon"],
            color: 'bg-yellow-50',
            badge: ((_stats_total_lessons_completed = stats === null || stats === void 0 ? void 0 : stats.total_lessons_completed) !== null && _stats_total_lessons_completed !== void 0 ? _stats_total_lessons_completed : 0) > 0 ? "".concat(stats.total_lessons_completed, " completed") : undefined,
            badgeColor: 'bg-yellow-100 text-yellow-800'
        },
        {
            title: 'My Progress',
            desc: 'Track completed lessons and scores.',
            href: '/learn/progress',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ChartBarIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChartBarIcon$3e$__["ChartBarIcon"],
            color: 'bg-purple-50',
            progress: ((_stats_total_courses_completed = stats === null || stats === void 0 ? void 0 : stats.total_courses_completed) !== null && _stats_total_courses_completed !== void 0 ? _stats_total_courses_completed : 0) > 0 ? 100 : 0,
            badge: "".concat((_stats_total_courses_completed1 = stats === null || stats === void 0 ? void 0 : stats.total_courses_completed) !== null && _stats_total_courses_completed1 !== void 0 ? _stats_total_courses_completed1 : 0, " courses done"),
            badgeColor: 'bg-purple-100 text-purple-800'
        },
        {
            title: 'Achievements',
            desc: 'View your earned badges and milestones.',
            href: '/learn/progress?tab=achievements',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$TrophyIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrophyIcon$3e$__["TrophyIcon"],
            color: 'bg-yellow-50',
            badge: recentAchievements.length > 0 ? "".concat(recentAchievements.length, " new") : undefined,
            badgeColor: 'bg-yellow-100 text-yellow-800'
        },
        {
            title: 'Study Time',
            desc: 'Manage your learning schedule and goals.',
            href: '/learn/progress?tab=schedule',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ClockIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClockIcon$3e$__["ClockIcon"],
            color: 'bg-green-50',
            badge: ((_stats_total_study_time_hours = stats === null || stats === void 0 ? void 0 : stats.total_study_time_hours) !== null && _stats_total_study_time_hours !== void 0 ? _stats_total_study_time_hours : 0) > 0 ? "".concat(Math.round(stats.total_study_time_hours), "h total") : undefined,
            badgeColor: 'bg-green-100 text-green-800'
        },
        {
            title: 'Smart Path',
            desc: 'AI-powered personalized learning recommendations.',
            href: '/learn/smart-path',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ChartPieIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChartPieIcon$3e$__["ChartPieIcon"],
            color: 'bg-purple-50',
            badge: 'AI推荐',
            badgeColor: 'bg-purple-100 text-purple-800'
        },
        {
            title: 'Search Courses',
            desc: 'Find specific topics or skills to learn.',
            href: '/learn/search',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$MagnifyingGlassIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MagnifyingGlassIcon$3e$__["MagnifyingGlassIcon"],
            color: 'bg-gray-50',
            badge: 'Search',
            badgeColor: 'bg-gray-100 text-gray-800'
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        children: cards.map((param)=>{
            let { title, desc, href, icon: Icon, color, progress, badge, badgeColor } = param;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: href,
                className: "rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md hover:scale-105 group",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start justify-between mb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex h-12 w-12 items-center justify-center rounded-lg ".concat(color, " group-hover:scale-110 transition-transform"),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                    className: "h-6 w-6 text-gray-700"
                                }, void 0, false, {
                                    fileName: "[project]/nextjs1/app/ui/learn/nav-grid-enhanced.tsx",
                                    lineNumber: 223,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/nextjs1/app/ui/learn/nav-grid-enhanced.tsx",
                                lineNumber: 222,
                                columnNumber: 13
                            }, this),
                            badge && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "px-2 py-1 rounded-full text-xs font-medium ".concat(badgeColor),
                                children: badge
                            }, void 0, false, {
                                fileName: "[project]/nextjs1/app/ui/learn/nav-grid-enhanced.tsx",
                                lineNumber: 226,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/nextjs1/app/ui/learn/nav-grid-enhanced.tsx",
                        lineNumber: 221,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-semibold text-gray-900 mb-1",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/nextjs1/app/ui/learn/nav-grid-enhanced.tsx",
                        lineNumber: 232,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-600 mb-3",
                        children: desc
                    }, void 0, false, {
                        fileName: "[project]/nextjs1/app/ui/learn/nav-grid-enhanced.tsx",
                        lineNumber: 233,
                        columnNumber: 11
                    }, this),
                    progress !== undefined && progress > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between text-xs text-gray-500 mb-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "进度"
                                    }, void 0, false, {
                                        fileName: "[project]/nextjs1/app/ui/learn/nav-grid-enhanced.tsx",
                                        lineNumber: 238,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            progress,
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/nextjs1/app/ui/learn/nav-grid-enhanced.tsx",
                                        lineNumber: 239,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/nextjs1/app/ui/learn/nav-grid-enhanced.tsx",
                                lineNumber: 237,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full bg-gray-200 rounded-full h-2",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300",
                                    style: {
                                        width: "".concat(progress, "%")
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/nextjs1/app/ui/learn/nav-grid-enhanced.tsx",
                                    lineNumber: 242,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/nextjs1/app/ui/learn/nav-grid-enhanced.tsx",
                                lineNumber: 241,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/nextjs1/app/ui/learn/nav-grid-enhanced.tsx",
                        lineNumber: 236,
                        columnNumber: 13
                    }, this),
                    title === 'Achievements' && recentAchievements.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-3 flex space-x-2",
                        children: recentAchievements.map((achievement, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-lg",
                                title: achievement.title,
                                children: achievement.icon_url
                            }, index, false, {
                                fileName: "[project]/nextjs1/app/ui/learn/nav-grid-enhanced.tsx",
                                lineNumber: 254,
                                columnNumber: 17
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/nextjs1/app/ui/learn/nav-grid-enhanced.tsx",
                        lineNumber: 252,
                        columnNumber: 13
                    }, this)
                ]
            }, title, true, {
                fileName: "[project]/nextjs1/app/ui/learn/nav-grid-enhanced.tsx",
                lineNumber: 216,
                columnNumber: 9
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/nextjs1/app/ui/learn/nav-grid-enhanced.tsx",
        lineNumber: 214,
        columnNumber: 5
    }, this);
}
_s(LearnNavGridEnhanced, "K1kuszO9u5F+JIfPYEPmVAahlq8=");
_c = LearnNavGridEnhanced;
var _c;
__turbopack_context__.k.register(_c, "LearnNavGridEnhanced");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/nextjs1/app/ui/learn/smart-recommendation.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SmartRecommendation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/nextjs1/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/nextjs1/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$app$2f$lib$2f$learn$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/nextjs1/app/lib/learn-data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/nextjs1/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function SmartRecommendation(param) {
    let { userId } = param;
    _s();
    const [recommendations, setRecommendations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [stats, setStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [achievements, setAchievements] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SmartRecommendation.useEffect": ()=>{
            async function loadData() {
                try {
                    const [recs, statsData, achievementsData] = await Promise.all([
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$app$2f$lib$2f$learn$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLearningRecommendations"])(userId),
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$app$2f$lib$2f$learn$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLearningStats"])(userId),
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$app$2f$lib$2f$learn$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUserAchievements"])(userId)
                    ]);
                    setRecommendations(recs);
                    setStats(statsData);
                    setAchievements(achievementsData.slice(0, 3)); // 只显示最近3个成就
                } catch (error) {
                    console.error('Failed to load recommendation data:', error);
                } finally{
                    setLoading(false);
                }
            }
            loadData();
        }
    }["SmartRecommendation.useEffect"], [
        userId
    ]);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "animate-pulse",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-4 bg-gray-200 rounded w-1/4 mb-4"
                }, void 0, false, {
                    fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                    lineNumber: 44,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3",
                    children: [
                        1,
                        2,
                        3
                    ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white p-6 rounded-lg shadow-sm border",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-4 bg-gray-200 rounded w-3/4 mb-2"
                                }, void 0, false, {
                                    fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                                    lineNumber: 48,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-3 bg-gray-200 rounded w-1/2 mb-4"
                                }, void 0, false, {
                                    fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                                    lineNumber: 49,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-8 bg-gray-200 rounded w-full"
                                }, void 0, false, {
                                    fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                                    lineNumber: 50,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, i, true, {
                            fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                            lineNumber: 47,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                    lineNumber: 45,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
            lineNumber: 43,
            columnNumber: 7
        }, this);
    }
    const getRecommendationTypeColor = (type)=>{
        switch(type){
            case 'continue':
                return 'bg-blue-100 text-blue-800';
            case 'next_level':
                return 'bg-purple-100 text-purple-800';
            case 'related':
                return 'bg-green-100 text-green-800';
            case 'trending':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    const getRecommendationTypeIcon = (type)=>{
        switch(type){
            case 'continue':
                return '🎯';
            case 'next_level':
                return '🚀';
            case 'related':
                return '🔗';
            case 'trending':
                return '🔥';
            default:
                return '💡';
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-8",
        children: [
            stats && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-semibold text-gray-900 mb-4",
                        children: "学习概览"
                    }, void 0, false, {
                        fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                        lineNumber: 83,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 md:grid-cols-4 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-2xl font-bold text-blue-600",
                                        children: stats.total_courses_completed
                                    }, void 0, false, {
                                        fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                                        lineNumber: 86,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-gray-600",
                                        children: "完成课程"
                                    }, void 0, false, {
                                        fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                                        lineNumber: 87,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                                lineNumber: 85,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-2xl font-bold text-green-600",
                                        children: stats.total_lessons_completed
                                    }, void 0, false, {
                                        fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                                        lineNumber: 90,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-gray-600",
                                        children: "完成课时"
                                    }, void 0, false, {
                                        fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                                        lineNumber: 91,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                                lineNumber: 89,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-2xl font-bold text-purple-600",
                                        children: [
                                            stats.total_study_time_hours,
                                            "h"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                                        lineNumber: 94,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-gray-600",
                                        children: "学习时长"
                                    }, void 0, false, {
                                        fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                                        lineNumber: 95,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                                lineNumber: 93,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-2xl font-bold text-orange-600",
                                        children: stats.current_streak
                                    }, void 0, false, {
                                        fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                                        lineNumber: 98,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-gray-600",
                                        children: "连续天数"
                                    }, void 0, false, {
                                        fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                                        lineNumber: 99,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                                lineNumber: 97,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                        lineNumber: 84,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                lineNumber: 82,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold text-gray-900",
                                children: "为你推荐"
                            }, void 0, false, {
                                fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                                lineNumber: 108,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm text-gray-500",
                                children: "基于你的学习历史"
                            }, void 0, false, {
                                fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                                lineNumber: 109,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                        lineNumber: 107,
                        columnNumber: 9
                    }, this),
                    recommendations.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center py-8 text-gray-500",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-4xl mb-2",
                                children: "🎓"
                            }, void 0, false, {
                                fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                                lineNumber: 114,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "开始你的学习之旅吧！"
                            }, void 0, false, {
                                fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                                lineNumber: 115,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                        lineNumber: 113,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3",
                        children: recommendations.map((rec)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start justify-between mb-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center space-x-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-lg",
                                                        children: getRecommendationTypeIcon(rec.type)
                                                    }, void 0, false, {
                                                        fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                                                        lineNumber: 123,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "px-2 py-1 rounded-full text-xs font-medium ".concat(getRecommendationTypeColor(rec.type)),
                                                        children: [
                                                            rec.type === 'continue' && '继续学习',
                                                            rec.type === 'next_level' && '进阶课程',
                                                            rec.type === 'related' && '相关课程',
                                                            rec.type === 'trending' && '热门课程'
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                                                        lineNumber: 124,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                                                lineNumber: 122,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm font-medium text-gray-500",
                                                children: [
                                                    rec.score,
                                                    "%"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                                                lineNumber: 131,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                                        lineNumber: 121,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "font-semibold text-gray-900 mb-2",
                                        children: "课程标题"
                                    }, void 0, false, {
                                        fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                                        lineNumber: 136,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-600 mb-4",
                                        children: rec.reason
                                    }, void 0, false, {
                                        fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                                        lineNumber: 137,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/learn/courses/".concat(rec.course_id),
                                        className: "inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors",
                                        children: [
                                            "开始学习",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "ml-2 w-4 h-4",
                                                fill: "none",
                                                stroke: "currentColor",
                                                viewBox: "0 0 24 24",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M9 5l7 7-7 7"
                                                }, void 0, false, {
                                                    fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                                                    lineNumber: 145,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                                                lineNumber: 144,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                                        lineNumber: 139,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, rec.course_id, true, {
                                fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                                lineNumber: 120,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                        lineNumber: 118,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                lineNumber: 106,
                columnNumber: 7
            }, this),
            achievements.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-semibold text-gray-900",
                        children: "最新成就"
                    }, void 0, false, {
                        fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                        lineNumber: 157,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid gap-3 md:grid-cols-3",
                        children: achievements.map((achievement)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white p-4 rounded-lg shadow-sm border",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center space-x-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-2xl",
                                            children: achievement.icon_url
                                        }, void 0, false, {
                                            fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                                            lineNumber: 162,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "font-medium text-gray-900",
                                                    children: achievement.title
                                                }, void 0, false, {
                                                    fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                                                    lineNumber: 164,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-gray-600",
                                                    children: achievement.description
                                                }, void 0, false, {
                                                    fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                                                    lineNumber: 165,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ".concat(achievement.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' : achievement.rarity === 'epic' ? 'bg-purple-100 text-purple-800' : achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'),
                                                    children: [
                                                        achievement.rarity === 'legendary' && '传说',
                                                        achievement.rarity === 'epic' && '史诗',
                                                        achievement.rarity === 'rare' && '稀有',
                                                        achievement.rarity === 'common' && '普通'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                                                    lineNumber: 166,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                                            lineNumber: 163,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                                    lineNumber: 161,
                                    columnNumber: 17
                                }, this)
                            }, achievement.id, false, {
                                fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                                lineNumber: 160,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                        lineNumber: 158,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
                lineNumber: 156,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/nextjs1/app/ui/learn/smart-recommendation.tsx",
        lineNumber: 79,
        columnNumber: 5
    }, this);
}
_s(SmartRecommendation, "CxPJsaBQ7D5BqPygMmKs86pNzqg=");
_c = SmartRecommendation;
var _c;
__turbopack_context__.k.register(_c, "SmartRecommendation");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/nextjs1/node_modules/@heroicons/react/24/outline/esm/MagnifyingGlassIcon.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/nextjs1/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
function MagnifyingGlassIcon(param, svgRef) {
    let { title, titleId, ...props } = param;
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("svg", Object.assign({
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.5,
        stroke: "currentColor",
        "aria-hidden": "true",
        "data-slot": "icon",
        ref: svgRef,
        "aria-labelledby": titleId
    }, props), title ? /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("title", {
        id: titleId
    }, title) : null, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
    }));
}
const ForwardRef = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](MagnifyingGlassIcon);
const __TURBOPACK__default__export__ = ForwardRef;
}),
"[project]/nextjs1/node_modules/@heroicons/react/24/outline/esm/MagnifyingGlassIcon.js [app-client] (ecmascript) <export default as MagnifyingGlassIcon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MagnifyingGlassIcon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$MagnifyingGlassIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$MagnifyingGlassIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/nextjs1/node_modules/@heroicons/react/24/outline/esm/MagnifyingGlassIcon.js [app-client] (ecmascript)");
}),
"[project]/nextjs1/node_modules/@heroicons/react/24/outline/esm/TrophyIcon.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/nextjs1/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
function TrophyIcon(param, svgRef) {
    let { title, titleId, ...props } = param;
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("svg", Object.assign({
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.5,
        stroke: "currentColor",
        "aria-hidden": "true",
        "data-slot": "icon",
        ref: svgRef,
        "aria-labelledby": titleId
    }, props), title ? /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("title", {
        id: titleId
    }, title) : null, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"
    }));
}
const ForwardRef = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](TrophyIcon);
const __TURBOPACK__default__export__ = ForwardRef;
}),
"[project]/nextjs1/node_modules/@heroicons/react/24/outline/esm/TrophyIcon.js [app-client] (ecmascript) <export default as TrophyIcon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TrophyIcon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$TrophyIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$TrophyIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/nextjs1/node_modules/@heroicons/react/24/outline/esm/TrophyIcon.js [app-client] (ecmascript)");
}),
"[project]/nextjs1/node_modules/@heroicons/react/24/outline/esm/FireIcon.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/nextjs1/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
function FireIcon(param, svgRef) {
    let { title, titleId, ...props } = param;
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("svg", Object.assign({
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.5,
        stroke: "currentColor",
        "aria-hidden": "true",
        "data-slot": "icon",
        ref: svgRef,
        "aria-labelledby": titleId
    }, props), title ? /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("title", {
        id: titleId
    }, title) : null, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
    }), /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
    }));
}
const ForwardRef = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](FireIcon);
const __TURBOPACK__default__export__ = ForwardRef;
}),
"[project]/nextjs1/node_modules/@heroicons/react/24/outline/esm/FireIcon.js [app-client] (ecmascript) <export default as FireIcon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FireIcon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$FireIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$FireIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/nextjs1/node_modules/@heroicons/react/24/outline/esm/FireIcon.js [app-client] (ecmascript)");
}),
"[project]/nextjs1/node_modules/@heroicons/react/24/outline/esm/ClockIcon.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/nextjs1/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
function ClockIcon(param, svgRef) {
    let { title, titleId, ...props } = param;
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("svg", Object.assign({
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.5,
        stroke: "currentColor",
        "aria-hidden": "true",
        "data-slot": "icon",
        ref: svgRef,
        "aria-labelledby": titleId
    }, props), title ? /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("title", {
        id: titleId
    }, title) : null, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    }));
}
const ForwardRef = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](ClockIcon);
const __TURBOPACK__default__export__ = ForwardRef;
}),
"[project]/nextjs1/node_modules/@heroicons/react/24/outline/esm/ClockIcon.js [app-client] (ecmascript) <export default as ClockIcon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClockIcon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ClockIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ClockIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/nextjs1/node_modules/@heroicons/react/24/outline/esm/ClockIcon.js [app-client] (ecmascript)");
}),
"[project]/nextjs1/node_modules/@heroicons/react/24/outline/esm/CogIcon.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/nextjs1/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
function CogIcon(param, svgRef) {
    let { title, titleId, ...props } = param;
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("svg", Object.assign({
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.5,
        stroke: "currentColor",
        "aria-hidden": "true",
        "data-slot": "icon",
        ref: svgRef,
        "aria-labelledby": titleId
    }, props), title ? /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("title", {
        id: titleId
    }, title) : null, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077 1.41-.513m14.095-5.13 1.41-.513M5.106 17.785l1.15-.964m11.49-9.642 1.149-.964M7.501 19.795l.75-1.3m7.5-12.99.75-1.3m-6.063 16.658.26-1.477m2.605-14.772.26-1.477m0 17.726-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205 12 12m6.894 5.785-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"
    }));
}
const ForwardRef = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](CogIcon);
const __TURBOPACK__default__export__ = ForwardRef;
}),
"[project]/nextjs1/node_modules/@heroicons/react/24/outline/esm/CogIcon.js [app-client] (ecmascript) <export default as CogIcon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CogIcon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$CogIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$CogIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/nextjs1/node_modules/@heroicons/react/24/outline/esm/CogIcon.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=nextjs1_61db7454._.js.map