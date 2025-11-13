module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/perf_hooks [external] (perf_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("perf_hooks", () => require("perf_hooks"));

module.exports = mod;
}),
"[project]/nextjs1/app/lib/placeholder-data.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data
__turbopack_context__.s([
    "customers",
    ()=>customers,
    "invoices",
    ()=>invoices,
    "revenue",
    ()=>revenue,
    "users",
    ()=>users
]);
const users = [
    {
        id: '410544b2-4001-4271-9855-fec4b6a6442a',
        name: 'User',
        email: 'user@nextmail.com',
        password: '123456'
    }
];
const customers = [
    {
        id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
        name: 'Evil Rabbit',
        email: 'evil@rabbit.com',
        image_url: '/customers/evil-rabbit.png'
    },
    {
        id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
        name: 'Delba de Oliveira',
        email: 'delba@oliveira.com',
        image_url: '/customers/delba-de-oliveira.png'
    },
    {
        id: '3958dc9e-742f-4377-85e9-fec4b6a6442a',
        name: 'Lee Robinson',
        email: 'lee@robinson.com',
        image_url: '/customers/lee-robinson.png'
    },
    {
        id: '76d65c26-f784-44a2-ac19-586678f7c2f2',
        name: 'Michael Novotny',
        email: 'michael@novotny.com',
        image_url: '/customers/michael-novotny.png'
    },
    {
        id: 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9',
        name: 'Amy Burns',
        email: 'amy@burns.com',
        image_url: '/customers/amy-burns.png'
    },
    {
        id: '13D07535-C59E-4157-A011-F8D2EF4E0CBB',
        name: 'Balazs Orban',
        email: 'balazs@orban.com',
        image_url: '/customers/balazs-orban.png'
    }
];
const invoices = [
    {
        customer_id: customers[0].id,
        amount: 15795,
        status: 'pending',
        date: '2022-12-06'
    },
    {
        customer_id: customers[1].id,
        amount: 20348,
        status: 'pending',
        date: '2022-11-14'
    },
    {
        customer_id: customers[4].id,
        amount: 3040,
        status: 'paid',
        date: '2022-10-29'
    },
    {
        customer_id: customers[3].id,
        amount: 44800,
        status: 'paid',
        date: '2023-09-10'
    },
    {
        customer_id: customers[5].id,
        amount: 34577,
        status: 'pending',
        date: '2023-08-05'
    },
    {
        customer_id: customers[2].id,
        amount: 54246,
        status: 'pending',
        date: '2023-07-16'
    },
    {
        customer_id: customers[0].id,
        amount: 666,
        status: 'pending',
        date: '2023-06-27'
    },
    {
        customer_id: customers[3].id,
        amount: 32545,
        status: 'paid',
        date: '2023-06-09'
    },
    {
        customer_id: customers[4].id,
        amount: 1250,
        status: 'paid',
        date: '2023-06-17'
    },
    {
        customer_id: customers[5].id,
        amount: 8546,
        status: 'paid',
        date: '2023-06-07'
    },
    {
        customer_id: customers[1].id,
        amount: 500,
        status: 'paid',
        date: '2023-08-19'
    },
    {
        customer_id: customers[5].id,
        amount: 8945,
        status: 'paid',
        date: '2023-06-03'
    },
    {
        customer_id: customers[2].id,
        amount: 1000,
        status: 'paid',
        date: '2022-06-05'
    }
];
const revenue = [
    {
        month: 'Jan',
        revenue: 2000
    },
    {
        month: 'Feb',
        revenue: 1800
    },
    {
        month: 'Mar',
        revenue: 2200
    },
    {
        month: 'Apr',
        revenue: 2500
    },
    {
        month: 'May',
        revenue: 2300
    },
    {
        month: 'Jun',
        revenue: 3200
    },
    {
        month: 'Jul',
        revenue: 3500
    },
    {
        month: 'Aug',
        revenue: 3700
    },
    {
        month: 'Sep',
        revenue: 2500
    },
    {
        month: 'Oct',
        revenue: 2800
    },
    {
        month: 'Nov',
        revenue: 3000
    },
    {
        month: 'Dec',
        revenue: 4800
    }
];
;
}),
"[project]/nextjs1/app/lib/learn-data.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
                    reason: `基于你完成的《${completedCourse.title}》`,
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
                        reason: `进阶学习：${nextLevel}级别`,
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
        duration_min: 20,
        order_index: 1
    },
    {
        id: 'lesson-a1-02',
        course_id: 'course-a1',
        title: 'Greetings & Introductions',
        objective: 'Use greetings and introduce yourself.',
        content: 'Hi, Hello, Good morning.\nHow to introduce yourself with simple sentences.',
        duration_min: 25,
        order_index: 2
    },
    {
        id: 'lesson-b1-01',
        course_id: 'course-b1',
        title: 'Small Talk Basics',
        objective: 'Engage in small talk about weather, hobbies, and news.',
        content: 'Small talk starters.\nPolite responses and follow-up questions.\nRole-play examples.',
        duration_min: 30,
        order_index: 1
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
async function fetchCourses(query = '') {
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
}),
"[project]/nextjs1/app/api/seed/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f2e$pnpm$2f$bcryptjs$40$3$2e$0$2e$3$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/nextjs1/node_modules/.pnpm/bcryptjs@3.0.3/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f2e$pnpm$2f$postgres$40$3$2e$4$2e$7$2f$node_modules$2f$postgres$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/nextjs1/node_modules/.pnpm/postgres@3.4.7/node_modules/postgres/src/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$app$2f$lib$2f$placeholder$2d$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/nextjs1/app/lib/placeholder-data.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$app$2f$lib$2f$learn$2d$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/nextjs1/app/lib/learn-data.ts [app-route] (ecmascript)");
;
;
;
;
const sql = (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f2e$pnpm$2f$postgres$40$3$2e$4$2e$7$2f$node_modules$2f$postgres$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING, {
    ssl: process.env.POSTGRES_SSL === 'require' ? 'require' : undefined
});
async function seedUsers() {
    await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      is_vip BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_vip BOOLEAN NOT NULL DEFAULT FALSE`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`;
    const insertedUsers = await Promise.all(__TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$app$2f$lib$2f$placeholder$2d$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["users"].map(async (user)=>{
        const hashedPassword = await __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$node_modules$2f2e$pnpm$2f$bcryptjs$40$3$2e$0$2e$3$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash(user.password, 10);
        return sql`
        INSERT INTO users (id, name, email, password, is_vip)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword}, ${false})
        ON CONFLICT (id) DO NOTHING;
      `;
    }));
    await sql`
    CREATE TABLE IF NOT EXISTS profiles (
      user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      avatar_url TEXT,
      phone TEXT,
      bio TEXT
    );
  `;
    return insertedUsers;
}
async function seedRoles() {
    await sql`
    CREATE TABLE IF NOT EXISTS roles (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    );
  `;
    await Promise.all([
        sql`INSERT INTO roles (name) VALUES ('user') ON CONFLICT (name) DO NOTHING`,
        sql`INSERT INTO roles (name) VALUES ('vip') ON CONFLICT (name) DO NOTHING`,
        sql`INSERT INTO roles (name) VALUES ('admin') ON CONFLICT (name) DO NOTHING`
    ]);
}
async function seedPermissions() {
    await sql`
    CREATE TABLE IF NOT EXISTS permissions (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      description TEXT
    );
  `;
    const inserts = [
        [
            'view_courses',
            '查看课程'
        ],
        [
            'access_vip_content',
            '访问 VIP 内容'
        ],
        [
            'view_dashboard',
            '查看后台仪表盘'
        ],
        [
            'edit_customers',
            '编辑客户'
        ],
        [
            'edit_invoices',
            '编辑账单'
        ],
        [
            'manage_users',
            '管理用户与权限'
        ]
    ];
    await Promise.all(inserts.map(([name, desc])=>sql`INSERT INTO permissions (name, description) VALUES (${name}, ${desc}) ON CONFLICT (name) DO NOTHING`));
}
async function seedRolePermissionMappings() {
    await sql`
    CREATE TABLE IF NOT EXISTS role_permissions (
      role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
      permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
      PRIMARY KEY (role_id, permission_id)
    );
  `;
    const map = async (role, perm)=>sql`
      INSERT INTO role_permissions (role_id, permission_id)
      VALUES (
        (SELECT id FROM roles WHERE name=${role}),
        (SELECT id FROM permissions WHERE name=${perm})
      )
      ON CONFLICT DO NOTHING
    `;
    await map('user', 'view_courses');
    await map('vip', 'view_courses');
    await map('vip', 'access_vip_content');
    await map('admin', 'view_courses');
    await map('admin', 'access_vip_content');
    await map('admin', 'view_dashboard');
    await map('admin', 'edit_customers');
    await map('admin', 'edit_invoices');
    await map('admin', 'manage_users');
}
async function seedUserRoles() {
    await sql`
    CREATE TABLE IF NOT EXISTS user_roles (
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
      PRIMARY KEY (user_id, role_id)
    );
  `;
    await sql`
    INSERT INTO user_roles (user_id, role_id)
    VALUES (
      ${__TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$app$2f$lib$2f$placeholder$2d$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["users"][0].id},
      (SELECT id FROM roles WHERE name='user')
    )
    ON CONFLICT DO NOTHING
  `;
}
async function seedInvoices() {
    await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;
    await Promise.all(__TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$app$2f$lib$2f$placeholder$2d$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["invoices"].map((invoice)=>sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `));
}
async function seedCustomers() {
    await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;
    await Promise.all(__TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$app$2f$lib$2f$placeholder$2d$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["customers"].map((customer)=>sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `));
}
async function seedRevenue() {
    await sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;
    await Promise.all(__TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$app$2f$lib$2f$placeholder$2d$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["revenue"].map((rev)=>sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `));
}
async function seedLearningSchema() {
    await sql`
    CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      level TEXT NOT NULL,
      description TEXT NOT NULL,
      cover_url TEXT,
      lessons_count INT NOT NULL,
      estimated_hours INT NOT NULL,
      difficulty_score INT NOT NULL,
      tags TEXT[] DEFAULT '{}',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
    await sql`
    CREATE TABLE IF NOT EXISTS lessons (
      id TEXT PRIMARY KEY,
      course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      objective TEXT,
      content TEXT,
      duration_min INT NOT NULL,
      order_index INT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
    await sql`
    CREATE TABLE IF NOT EXISTS quiz_questions (
      id TEXT PRIMARY KEY,
      lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
      prompt TEXT NOT NULL,
      choices JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
    await sql`
    CREATE TABLE IF NOT EXISTS user_learning_profiles (
      user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      preferred_difficulty INT,
      preferred_topics TEXT[] DEFAULT '{}',
      learning_style TEXT,
      weekly_goal_hours INT,
      study_time_preference TEXT,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
    await sql`
    CREATE TABLE IF NOT EXISTS user_course_progress (
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      completed_lessons TEXT[] DEFAULT '{}',
      total_score INT DEFAULT 0,
      time_spent_minutes INT DEFAULT 0,
      completion_percentage REAL DEFAULT 0,
      last_accessed TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      is_completed BOOLEAN NOT NULL DEFAULT FALSE,
      certificate_earned BOOLEAN NOT NULL DEFAULT FALSE,
      PRIMARY KEY (user_id, course_id)
    );
  `;
    await sql`
    CREATE TABLE IF NOT EXISTS achievements (
      id TEXT PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT,
      icon_url TEXT,
      earned_date TIMESTAMPTZ NOT NULL,
      category TEXT
    );
  `;
    await sql`
    CREATE TABLE IF NOT EXISTS learning_activities (
      id TEXT PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      lesson_id TEXT,
      activity_type TEXT NOT NULL,
      timestamp TIMESTAMPTZ NOT NULL,
      score INT,
      time_spent INT
    );
  `;
    await sql`
    CREATE TABLE IF NOT EXISTS investments (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      fund_code TEXT NOT NULL,
      amount NUMERIC NOT NULL,
      price NUMERIC NOT NULL,
      trade_date DATE NOT NULL,
      note TEXT
    );
  `;
}
async function seedLearningData() {
    const courses = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$app$2f$lib$2f$learn$2d$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchCourses"])('');
    for (const c of courses){
        await sql`
      INSERT INTO courses (id, title, level, description, cover_url, lessons_count, estimated_hours, difficulty_score, tags)
      VALUES (${c.id}, ${c.title}, ${c.level}, ${c.description}, ${c.cover_url}, ${c.lessons_count}, ${c.estimated_hours}, ${c.difficulty_score}, ${sql.array(c.tags)})
      ON CONFLICT (id) DO NOTHING;
    `;
        const lessons = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$app$2f$lib$2f$learn$2d$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchLessonsByCourseId"])(c.id);
        for (const l of lessons){
            await sql`
        INSERT INTO lessons (id, course_id, title, objective, content, duration_min, order_index)
        VALUES (${l.id}, ${l.course_id}, ${l.title}, ${l.objective}, ${l.content}, ${l.duration_min}, ${l.order_index})
        ON CONFLICT (id) DO NOTHING;
      `;
            const quiz = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$app$2f$lib$2f$learn$2d$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchQuizByLessonId"])(l.id);
            for (const q of quiz){
                await sql`
          INSERT INTO quiz_questions (id, lesson_id, prompt, choices)
          VALUES (${q.id}, ${q.lesson_id}, ${q.prompt}, ${sql.json(q.choices)})
          ON CONFLICT (id) DO NOTHING;
        `;
            }
        }
    }
    const defaultUserId = __TURBOPACK__imported__module__$5b$project$5d2f$nextjs1$2f$app$2f$lib$2f$placeholder$2d$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["users"][0]?.id;
    if (defaultUserId) {
        await sql`
      INSERT INTO user_learning_profiles (user_id, preferred_difficulty, preferred_topics, learning_style, weekly_goal_hours, study_time_preference)
      VALUES (${defaultUserId}, ${5}, ${sql.array([
            'programming',
            'web development'
        ])}, ${'interactive'}, ${10}, ${'flexible'})
      ON CONFLICT (user_id) DO NOTHING;
    `;
        await sql`
      INSERT INTO user_course_progress (user_id, course_id, completed_lessons, total_score, time_spent_minutes, completion_percentage, is_completed, certificate_earned)
      VALUES (${defaultUserId}, ${'course-a1'}, ${sql.array([
            'lesson-a1-01'
        ])}, ${85}, ${20}, ${12.5}, ${false}, ${false})
      ON CONFLICT (user_id, course_id) DO NOTHING;
    `;
        await sql`
      INSERT INTO achievements (id, user_id, title, description, icon_url, earned_date, category)
      VALUES (${`init-achievement-${Date.now()}`}, ${defaultUserId}, ${'首次学习'}, ${'完成第一个课时'}, ${'/achievements/first-lesson.png'}, ${new Date()}, ${'completion'})
      ON CONFLICT (id) DO NOTHING;
    `;
        await sql`
      INSERT INTO investments (user_id, fund_code, amount, price, trade_date, note)
      VALUES (${defaultUserId}, ${'110022'}, ${1000}, ${1.25}, ${new Date()}, ${'首次买入示例'})
      ON CONFLICT DO NOTHING;
    `;
    }
}
async function GET() {
    try {
        await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`;
        await seedUsers();
        await seedRoles();
        await seedPermissions();
        await seedRolePermissionMappings();
        await seedUserRoles();
        await seedCustomers();
        await seedInvoices();
        await seedRevenue();
        await seedLearningSchema();
        await seedLearningData();
        return Response.json({
            message: 'Database seeded successfully'
        });
    } catch (error) {
        return Response.json({
            error
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c77be811._.js.map