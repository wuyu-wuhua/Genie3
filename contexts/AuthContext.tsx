'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  current_credits: number;
  total_earned_credits: number;
  current_plan: string;
  plan_status: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  manualSyncUserData: () => Promise<{ success: boolean; message: string } | undefined>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabase, setSupabase] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // 刷新用户档案信息
  const refreshUserProfile = async () => {
    if (user?.id) {
      try {
        // 直接从genie_users表获取用户信息
        const response = await fetch(`/api/user/profile?userId=${user.id}`);
        if (response.ok) {
          const profile = await response.json();
          setUserProfile(profile);
        }
      } catch (error) {

        // 即使失败也不影响用户登录状态
      }
    }
  };

  // 为新用户创建记录
  const createNewUser = async (userId: string, sessionUser: any) => {
    try {

      
      const response = await fetch('/api/user/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId,
          userEmail: sessionUser?.email,
          userName: sessionUser?.user_metadata?.name || sessionUser?.user_metadata?.full_name || sessionUser?.email?.split('@')[0] || '用户'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        return;
      }

      const data = await response.json();
      
      if (data.success) {

        // 更新本地用户档案
        if (data.user) {
          setUserProfile({
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            current_credits: data.user.current_credits,
            total_earned_credits: data.user.total_earned_credits,
            current_plan: 'free',
            plan_status: 'inactive',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      } else {

      }
    } catch (error) {

    }
  };

  // 处理用户认证状态变化
  const handleAuthStateChange = async (event: string, session: Session | null) => {

    
    setSession(session);
    setUser(session?.user ?? null);

    if (session?.user) {
      try {

        
        // 直接为新用户创建记录
        await createNewUser(session.user.id, session.user);
        
        // 获取用户档案
        const response = await fetch(`/api/user/profile?userId=${session.user.id}`);
        if (response.ok) {
          const profile = await response.json();
          setUserProfile(profile);
        }
        
      } catch (error) {

        // 即使失败也尝试获取现有档案
        try {
          const response = await fetch(`/api/user/profile?userId=${session.user.id}`);
          if (response.ok) {
            const profile = await response.json();
            setUserProfile(profile);
          }
        } catch (profileError) {

        }
      }
    } else {
      setUserProfile(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    // 动态导入supabase，避免SSR问题
    const initSupabase = async () => {
      try {
        const { supabase } = await import('@/lib/supabase');
        setSupabase(supabase);
        
        // 获取初始会话
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          await handleAuthStateChange('INITIAL_SESSION', session);
        } else {
          setLoading(false);
          setIsInitialized(true);
        }

        // 监听认证状态变化
        const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('Failed to initialize Supabase:', error);
        setLoading(false);
        setIsInitialized(true);
      }
    };

    initSupabase();
  }, []);

  // 页面可见性检测（仅用于状态跟踪，不强制刷新）
  useEffect(() => {
    if (!isInitialized || !supabase) return;

    const handleVisibilityChange = () => {
      console.log('页面可见性变化:', document.hidden ? '隐藏' : '可见');
    };

    // 监听页面可见性变化
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // 监听页面焦点变化
    const handleFocus = () => {
      console.log('页面获得焦点');
    };
    
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isInitialized, supabase]);

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
  };

  // 手动同步用户数据（供用户主动调用）
  const manualSyncUserData = async () => {
    if (!user) return;
    
    try {
      console.log('手动同步用户数据...');
      
      // 重新获取用户档案
      await refreshUserProfile();
      
      return {
        success: true,
        message: '用户数据同步成功！'
      };
    } catch (error) {
      console.error('❌ 手动同步用户数据异常:', error);
      return {
        success: false,
        message: '同步过程中发生错误，请稍后重试'
      };
    }
  };

  const value = {
    user,
    session,
    userProfile,
    loading,
    signOut,
    refreshUserProfile,
    manualSyncUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 