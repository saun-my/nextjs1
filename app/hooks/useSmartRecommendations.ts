'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  LearningRecommendationEngine, 
  generateSampleCourses, 
  generateSampleUserProgress 
} from '@/app/lib/learning/recommendation-engine';
import { 
  RecommendationRequest, 
  RecommendationResponse, 
  RecommendationResult,
  UserProfile 
} from '@/app/lib/learning/types';

interface UseSmartRecommendationsProps {
  userId: string;
  context?: 'home' | 'course-detail' | 'learning-path' | 'search';
  limit?: number;
  filters?: any;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseSmartRecommendationsReturn {
  recommendations: RecommendationResult[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  hasMore: boolean;
  totalCount: number;
  userProfile: UserProfile | null;
}

export function useSmartRecommendations({
  userId,
  context = 'home',
  limit = 6,
  filters = {},
  autoRefresh = false,
  refreshInterval = 300000
}: UseSmartRecommendationsProps): UseSmartRecommendationsReturn {
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [engine] = useState(() => {
    const courses = generateSampleCourses();
    const userProgress = generateSampleUserProgress();
    return new LearningRecommendationEngine(courses, userProgress);
  });

  const fetchRecommendations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const request: RecommendationRequest = {
        userId,
        context,
        limit,
        includeExplanations: true,
        filters
      };

      const response: RecommendationResponse = await engine.generateRecommendations(request);
      
      setRecommendations(response.recommendations);
      setHasMore(response.hasMore);
      setTotalCount(response.totalCount);
      
      const profile = await engine.getUserProfile(userId);
      setUserProfile(profile);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取推荐失败');
      console.error('Failed to fetch recommendations:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, context, limit, filters, engine]);

  const refresh = useCallback(async () => {
    await fetchRecommendations();
  }, [fetchRecommendations]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchRecommendations();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchRecommendations]);

  return {
    recommendations,
    loading,
    error,
    refresh,
    hasMore,
    totalCount,
    userProfile
  };
}

export function useDemoRecommendations() {
  return useSmartRecommendations({
    userId: 'demo-user',
    context: 'home',
    limit: 6,
    filters: {
      excludeCompleted: true,
      maxDifficulty: 'advanced'
    }
  });
}