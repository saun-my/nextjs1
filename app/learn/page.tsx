import Link from 'next/link';
import LearnNavGridEnhanced from '../ui/learn/nav-grid-enhanced';
import SmartRecommendation from '../ui/learn/smart-recommendation';

export const dynamic = 'force-dynamic';

export default async function Page() {
  // 暂时使用固定用户ID，实际项目中应该从session获取
  const userId = 'demo_user';
  
  return (
    <div className="space-y-8">
      {/* 欢迎区域 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-xl">
        <h1 className="text-3xl font-bold mb-2">欢迎回来！</h1>
        <p className="text-blue-100">继续你的学习之旅，探索新的知识领域</p>
      </div>

      {/* 智能推荐区域 */}
      <SmartRecommendation userId={userId} />

      {/* 增强版学习导航 */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">学习导航</h2>
          <Link 
            href="/learn/progress" 
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            查看全部进度 →
          </Link>
        </div>
        <LearnNavGridEnhanced userId={userId} />
      </div>
    </div>
  );
}