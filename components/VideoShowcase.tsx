'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, Volume2, VolumeX, X, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getTranslations, Language, detectBrowserLanguage } from '@/lib/translations';

// 精选视频数据
const featuredVideos = [
  {
    id: 1,
    title: "Genie 3 山脉地形生成",
    description: "展示Genie 3如何生成逼真的山脉地形，包含山峰、峡谷和自然纹理",
    filename: "1.mp4",
    category: "mountain"
  },
  {
    id: 2,
    title: "Genie 3 海洋场景演示",
    description: "展示Genie 3生成海洋场景的能力，包含波浪和水面效果",
    filename: "海洋2.mp4",
    category: "ocean"
  },
  {
    id: 3,
    title: "Genie 3 过山车场景1",
    description: "展示Genie 3生成过山车场景的效果",
    filename: "过山车1.mp4",
    category: "rollercoaster"
  },
  {
    id: 4,
    title: "Genie 3 复杂地形演示",
    description: "展示Genie 3处理复杂地形的能力，包含多种地貌特征",
    filename: "2.mp4",
    category: "complex"
  },
  {
    id: 5,
    title: "Genie 3 海洋深度演示",
    description: "展示Genie 3生成海洋深度场景的效果",
    filename: "海洋7.mp4",
    category: "ocean"
  }
];

export default function VideoShowcase() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [selectedVideo, setSelectedVideo] = useState<typeof featuredVideos[0] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [loadedVideos, setLoadedVideos] = useState<Set<string>>(new Set());
  const [visibleVideos, setVisibleVideos] = useState<Set<string>>(new Set());

  // 初始化时从本地存储读取语言设置，如果没有则检测浏览器语言
  useEffect(() => {
    const savedLanguage = localStorage.getItem('genie3-language') as Language;
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    } else {
      // 检测浏览器语言
      const detectedLanguage = detectBrowserLanguage();
      setCurrentLanguage(detectedLanguage);
    }

    const handleLanguageChange = (event: CustomEvent) => {
      setCurrentLanguage(event.detail.language);
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, []);

  const translations = getTranslations(currentLanguage);

  const handleVideoSelect = useCallback((video: typeof featuredVideos[0]) => {
    setSelectedVideo(video);
    setIsPlaying(true);
    setIsMuted(false);
  }, []);

  const handlePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const handleMuteToggle = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const handleVideoLoad = useCallback((filename: string) => {
    setLoadedVideos(prev => new Set(prev).add(filename));
  }, []);

  // 防抖函数
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // 使用Intersection Observer检测视频可见性
  useEffect(() => {
    const observer = new IntersectionObserver(
      debounce((entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          const filename = entry.target.getAttribute('data-filename');
          if (filename) {
            if (entry.isIntersecting) {
              setVisibleVideos(prev => new Set(prev).add(filename));
            } else {
              setVisibleVideos(prev => {
                const newSet = new Set(prev);
                newSet.delete(filename);
                return newSet;
              });
            }
          }
        });
      }, 100),
      {
        rootMargin: '50px 0px',
        threshold: 0.1
      }
    );

    const videoElements = document.querySelectorAll('[data-filename]');
    videoElements.forEach((el) => observer.observe(el));

    return () => {
      videoElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // 根据文件名获取翻译的标题和描述
  const getVideoTranslation = useCallback((filename: string) => {
    const translationMap: { [key: string]: { title: string; description: string } } = {
      '1.mp4': {
        title: translations.cases.fastTerrainGeneration,
        description: translations.cases.fastTerrainDescription
      },
      '2.mp4': {
        title: translations.cases.terrainVariationDemo,
        description: translations.cases.terrainVariationDescription
      },
      '过山车1.mp4': {
        title: translations.cases.rollercoasterScene2,
        description: translations.cases.rollercoasterScene2Description
      },
      '海洋2.mp4': {
        title: translations.cases.oceanEnvironmentGeneration,
        description: translations.cases.oceanEnvironmentDescription
      },
      '海洋7.mp4': {
        title: translations.cases.oceanEnvironment6,
        description: translations.cases.oceanEnvironment6Description
      }
    };

    return translationMap[filename] || {
      title: `Genie 3 ${filename}`,
      description: `Genie 3 demo video: ${filename}`
    };
  }, [translations]);

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {translations.cases.featuredCreations}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {translations.cases.exploreAmazing3DWorlds}
          </p>
        </div>

        {/* 第一行：3个视频 */}
        <div className="grid grid-cols-1 gap-6 sm:gap-4 mb-8 max-w-full sm:max-w-4xl lg:max-w-5xl mx-auto mobile-video-layout" style={{ willChange: 'transform' }}>
          {featuredVideos.slice(0, 3).map((video) => {
            const videoTranslation = getVideoTranslation(video.filename);
            return (
              <Card 
                key={video.id} 
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white dark:bg-gray-800 w-full mobile-video-card"
                onClick={() => handleVideoSelect(video)}
              >
                <CardHeader className="pb-3 text-center sm:text-left">
                  <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-white">{videoTranslation.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div 
                    className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 overflow-hidden relative group w-full mobile-video-container"
                    data-filename={video.filename}
                  >
                    {!loadedVideos.has(video.filename) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-600">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    )}
                    {visibleVideos.has(video.filename) && (
                      <video
                        src={`/video/${video.filename}`}
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="none"
                        onLoadedData={() => handleVideoLoad(video.filename)}
                        onMouseEnter={(e) => {
                          if (e.currentTarget.paused) {
                            e.currentTarget.play().catch(() => {
                              e.currentTarget.muted = true;
                              e.currentTarget.play();
                            });
                          }
                        }}
                        onMouseLeave={(e) => e.currentTarget.pause()}
                        onError={(e) => {
                          console.error('Video loading error:', e);
                          const target = e.target as HTMLVideoElement;
                          target.style.display = 'none';
                        }}
                      />
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Play className="w-16 h-16 text-white drop-shadow-lg" />
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      {translations.cases.autoPlay}
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base text-center sm:text-left">{videoTranslation.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 第二行：2个视频 */}
        <div className="grid grid-cols-1 gap-6 sm:gap-4 mb-8 max-w-full sm:max-w-4xl mx-auto mobile-video-layout" style={{ willChange: 'transform' }}>
          {featuredVideos.slice(3, 5).map((video) => {
            const videoTranslation = getVideoTranslation(video.filename);
            return (
              <Card 
                key={video.id} 
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white dark:bg-gray-800 w-full mobile-video-card"
                onClick={() => handleVideoSelect(video)}
              >
                <CardHeader className="pb-3 text-center sm:text-left">
                  <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-white">{videoTranslation.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div 
                    className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 overflow-hidden relative group w-full mobile-video-container"
                    data-filename={video.filename}
                  >
                    {!loadedVideos.has(video.filename) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-600">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    )}
                    {visibleVideos.has(video.filename) && (
                      <video
                        src={`/video/${video.filename}`}
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="none"
                        onLoadedData={() => handleVideoLoad(video.filename)}
                        onMouseEnter={(e) => {
                          if (e.currentTarget.paused) {
                            e.currentTarget.play().catch(() => {
                              e.currentTarget.muted = true;
                              e.currentTarget.play();
                            });
                          }
                        }}
                        onMouseLeave={(e) => e.currentTarget.pause()}
                        onError={(e) => {
                          console.error('Video loading error:', e);
                          const target = e.target as HTMLVideoElement;
                          target.style.display = 'none';
                        }}
                      />
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Play className="w-12 h-12 sm:w-16 sm:h-16 text-white drop-shadow-lg" />
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      {translations.cases.autoPlay}
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base text-center sm:text-left">{videoTranslation.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <a 
            href="/cases" 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 h-11 px-8 text-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white cursor-pointer"
          >
            <Play className="mr-2 w-5 h-5" />
            {translations.cases.viewAllCases}
          </a>
        </div>

        {/* Video Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{getVideoTranslation(selectedVideo.filename).title}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedVideo(null)}
                  >
                    ✕
                  </Button>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mt-2">{getVideoTranslation(selectedVideo.filename).description}</p>
              </div>
              
              <div className="relative">
                <video
                  src={`/video/${selectedVideo.filename}`}
                  className="w-full h-auto"
                  controls
                  autoPlay={isPlaying}
                  muted={isMuted}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
              </div>
              
              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePlayPause}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      {isPlaying ? translations.cases.pause : translations.cases.play}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleMuteToggle}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      {isMuted ? translations.cases.unmute : translations.cases.mute}
                    </Button>
                  </div>
                  <Button
                    variant="default"
                    onClick={() => window.open(`/video/${selectedVideo.filename}`, '_blank')}
                  >
                    {translations.cases.downloadVideo}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
} 