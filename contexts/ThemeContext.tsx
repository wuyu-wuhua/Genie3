'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 立即从本地存储读取主题设置并应用
    const savedTheme = localStorage.getItem('genie3-theme') as Theme;
    const initialTheme = savedTheme || 'light';
    setTheme(initialTheme);
    
    // 立即应用主题到文档根元素，避免闪烁
    const root = document.documentElement;
    if (initialTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // 如果没有保存的主题，保存默认设置
    if (!savedTheme) {
      localStorage.setItem('genie3-theme', 'light');
    }
    
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // 应用主题到文档根元素
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // 保存主题设置到本地存储
    localStorage.setItem('genie3-theme', theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    // 立即保存到本地存储
    if (mounted) {
      localStorage.setItem('genie3-theme', newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 