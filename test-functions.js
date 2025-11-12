// 测试我们添加的函数
const { fetchCourses, fetchCourseById, fetchLessonById } = require('./app/lib/learn-data.ts');

async function testFunctions() {
  try {
    console.log('Testing fetchCourses...');
    const courses = await fetchCourses();
    console.log('Courses found:', courses.length);
    
    console.log('Testing fetchCourseById...');
    const course = await fetchCourseById('course-a1');
    console.log('Course found:', course ? course.title : 'Not found');
    
    console.log('Testing fetchLessonById...');
    const lesson = await fetchLessonById('lesson-a1-01');
    console.log('Lesson found:', lesson ? lesson.title : 'Not found');
    
    console.log('All tests passed!');
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testFunctions();