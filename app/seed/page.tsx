'use client';

import React, { useState } from 'react';

export default function SeedPage() {
  const [course, setCourse] = useState({
    id: 'course-dev-001',
    title: 'Web 开发基础',
    level: 'Beginner',
    description: 'HTML/CSS/JS 入门课程',
    cover_url: '',
    lessons_count: 8,
    estimated_hours: 16,
    difficulty_score: 3,
    tags: ['web', 'frontend', 'javascript'],
  });
  const [lesson, setLesson] = useState({
    id: 'lesson-dev-001',
    course_id: 'course-dev-001',
    title: 'HTML 基础',
    objective: '了解基本标签与结构',
    content: '介绍常见标签、页面结构与语义化',
    duration_min: 20,
    order_index: 1,
  });
  const [profile, setProfile] = useState({
    user_id: '',
    preferred_difficulty: 5,
    preferred_topics: ['web', 'frontend'],
    learning_style: 'interactive',
    weekly_goal_hours: 8,
    study_time_preference: 'evening',
  });

  const [status, setStatus] = useState('');

  async function callSeed() {
    setStatus('Seeding...');
    const res = await fetch('/api/seed');
    const data = await res.json();
    setStatus(JSON.stringify(data));
  }

  async function submitCourse() {
    setStatus('Importing course...');
    const res = await fetch('/api/learning/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course),
    });
    const data = await res.json();
    setStatus(JSON.stringify(data));
  }

  async function submitLesson() {
    setStatus('Importing lesson...');
    const res = await fetch('/api/learning/lessons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lesson),
    });
    const data = await res.json();
    setStatus(JSON.stringify(data));
  }

  async function submitProfile() {
    setStatus('Upserting profile...');
    const res = await fetch('/api/learning/profiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    const data = await res.json();
    setStatus(JSON.stringify(data));
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">数据库基础数据导入</h1>

        <div className="bg-white rounded-lg p-4 border space-y-3">
          <h2 className="text-lg font-semibold">触发种子数据</h2>
          <button onClick={callSeed} className="px-4 py-2 bg-blue-600 text-white rounded">运行 /seed</button>
        </div>

        <div className="bg-white rounded-lg p-4 border space-y-3">
          <h2 className="text-lg font-semibold">导入课程</h2>
          <input className="border p-2 w-full" placeholder="课程ID" value={course.id} onChange={e=>setCourse({...course,id:e.target.value})} />
          <input className="border p-2 w-full" placeholder="标题" value={course.title} onChange={e=>setCourse({...course,title:e.target.value})} />
          <input className="border p-2 w-full" placeholder="级别" value={course.level} onChange={e=>setCourse({...course,level:e.target.value})} />
          <textarea className="border p-2 w-full" placeholder="描述" value={course.description} onChange={e=>setCourse({...course,description:e.target.value})} />
          <input className="border p-2 w-full" placeholder="封面URL" value={course.cover_url} onChange={e=>setCourse({...course,cover_url:e.target.value})} />
          <div className="grid grid-cols-3 gap-2">
            <input className="border p-2" placeholder="课时数" type="number" value={course.lessons_count} onChange={e=>setCourse({...course,lessons_count:Number(e.target.value)})} />
            <input className="border p-2" placeholder="预计小时" type="number" value={course.estimated_hours} onChange={e=>setCourse({...course,estimated_hours:Number(e.target.value)})} />
            <input className="border p-2" placeholder="难度分" type="number" value={course.difficulty_score} onChange={e=>setCourse({...course,difficulty_score:Number(e.target.value)})} />
          </div>
          <input className="border p-2 w-full" placeholder="标签,逗号分隔" value={course.tags.join(',')} onChange={e=>setCourse({...course,tags:e.target.value.split(',').map(t=>t.trim()).filter(Boolean)})} />
          <button onClick={submitCourse} className="px-4 py-2 bg-green-600 text-white rounded">导入课程</button>
        </div>

        <div className="bg-white rounded-lg p-4 border space-y-3">
          <h2 className="text-lg font-semibold">导入课时</h2>
          <input className="border p-2 w-full" placeholder="课时ID" value={lesson.id} onChange={e=>setLesson({...lesson,id:e.target.value})} />
          <input className="border p-2 w-full" placeholder="课程ID" value={lesson.course_id} onChange={e=>setLesson({...lesson,course_id:e.target.value})} />
          <input className="border p-2 w-full" placeholder="标题" value={lesson.title} onChange={e=>setLesson({...lesson,title:e.target.value})} />
          <input className="border p-2 w-full" placeholder="目标" value={lesson.objective} onChange={e=>setLesson({...lesson,objective:e.target.value})} />
          <textarea className="border p-2 w-full" placeholder="内容" value={lesson.content} onChange={e=>setLesson({...lesson,content:e.target.value})} />
          <div className="grid grid-cols-2 gap-2">
            <input className="border p-2" placeholder="时长(分钟)" type="number" value={lesson.duration_min} onChange={e=>setLesson({...lesson,duration_min:Number(e.target.value)})} />
            <input className="border p-2" placeholder="顺序" type="number" value={lesson.order_index} onChange={e=>setLesson({...lesson,order_index:Number(e.target.value)})} />
          </div>
          <button onClick={submitLesson} className="px-4 py-2 bg-green-600 text-white rounded">导入课时</button>
        </div>

        <div className="bg-white rounded-lg p-4 border space-y-3">
          <h2 className="text-lg font-semibold">设置学习档案</h2>
          <input className="border p-2 w-full" placeholder="用户ID(UUID)" value={profile.user_id} onChange={e=>setProfile({...profile,user_id:e.target.value})} />
          <div className="grid grid-cols-3 gap-2">
            <input className="border p-2" placeholder="偏好难度" type="number" value={profile.preferred_difficulty} onChange={e=>setProfile({...profile,preferred_difficulty:Number(e.target.value)})} />
            <input className="border p-2" placeholder="每周目标小时" type="number" value={profile.weekly_goal_hours} onChange={e=>setProfile({...profile,weekly_goal_hours:Number(e.target.value)})} />
            <input className="border p-2" placeholder="学习风格" value={profile.learning_style} onChange={e=>setProfile({...profile,learning_style:e.target.value})} />
          </div>
          <input className="border p-2 w-full" placeholder="偏好主题,逗号分隔" value={profile.preferred_topics.join(',')} onChange={e=>setProfile({...profile,preferred_topics:e.target.value.split(',').map(t=>t.trim()).filter(Boolean)})} />
          <input className="border p-2 w-full" placeholder="学习时段" value={profile.study_time_preference} onChange={e=>setProfile({...profile,study_time_preference:e.target.value})} />
          <button onClick={submitProfile} className="px-4 py-2 bg-green-600 text-white rounded">保存档案</button>
        </div>

        <div className="bg-white rounded-lg p-4 border">
          <div className="text-sm text-gray-700">状态</div>
          <pre className="text-xs text-gray-600 whitespace-pre-wrap">{status}</pre>
        </div>
      </div>
    </div>
  );
}
