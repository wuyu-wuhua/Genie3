'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Volume2, VolumeX, Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getTranslations, Language, detectBrowserLanguage } from '@/lib/translations';

// 视频数据
const videoData = [
  {
    id: 1,
    title: "Genie 3 沙漠环境生成",
    description: "展示Genie 3生成沙漠环境的效果，包含沙丘和岩石",
    filename: "3.mp4",
    category: "desert"
  },
  {
    id: 2,
    title: "Genie 3 海洋环境生成",
    description: "展示Genie 3生成海洋环境的详细过程",
    filename: "海洋3.mp4",
    category: "ocean"
  },
  {
    id: 3,
    title: "Genie 3 地形细节展示",
    description: "展示Genie 3生成地形的细节和纹理质量",
    filename: "6.mp4",
    category: "detail"
  },
  {
    id: 4,
    title: "Genie 3 快速地形生成",
    description: "展示Genie 3快速生成地形的能力",
    filename: "7.mp4",
    category: "speed"
  },
  {
    id: 5,
    title: "Genie 3 过山车场景2",
    description: "展示Genie 3生成过山车场景的另一个角度",
    filename: "过山车2.mp4",
    category: "rollercoaster"
  },
  {
    id: 6,
    title: "Genie 3 地形变化演示",
    description: "展示Genie 3在不同参数下生成的地形变化",
    filename: "10.mp4",
    category: "variation"
  },
  {
    id: 7,
    title: "Genie 3 环境模板展示",
    description: "展示Genie 3预设环境模板的效果",
    filename: "12.mp4",
    category: "template"
  },
  {
    id: 8,
    title: "Genie 3 高级地形生成",
    description: "展示Genie 3生成高级地形的能力",
    filename: "14.mp4",
    category: "advanced"
  },
  {
    id: 9,
    title: "Genie 3 过山车场景3",
    description: "展示Genie 3生成过山车场景的第三个视角",
    filename: "过山车3.mp4",
    category: "rollercoaster"
  },
  {
    id: 10,
    title: "Genie 3 海洋环境6",
    description: "展示Genie 3生成海洋环境的第六个演示",
    filename: "海洋6.mp4",
    category: "ocean"
  },
  {
    id: 11,
    title: "Genie 3 海洋环境5",
    description: "展示Genie 3生成海洋环境的第五个演示",
    filename: "海洋5.mp4",
    category: "ocean"
  },
  {
    id: 12,
    title: "Genie 3 海洋环境4",
    description: "展示Genie 3生成海洋环境的第四个演示",
    filename: "海洋4.mp4",
    category: "ocean"
  },
  {
    id: 13,
    title: "Genie 3 海洋环境1",
    description: "展示Genie 3生成海洋环境的第一个演示",
    filename: "海洋1.mp4",
    category: "ocean"
  }
];

export default function CasesPage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
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

  const categories = [
    { id: 'all', name: translations.cases?.allCategories || "All Categories" },
    { id: 'ocean', name: translations.cases?.ocean || "Ocean" },
    { id: 'desert', name: translations.cases?.desert || "Desert" },
    { id: 'rollercoaster', name: translations.cases?.rollercoaster || "Rollercoaster" },
    { id: 'detail', name: translations.cases?.detail || "Detail" },
    { id: 'speed', name: translations.cases?.speed || "Speed" },
    { id: 'variation', name: translations.cases?.variation || "Variation" },
    { id: 'template', name: translations.cases?.template || "Template" },
    { id: 'advanced', name: translations.cases?.advanced || "Advanced" }
  ];

  const filteredVideos = selectedCategory === 'all' 
    ? videoData 
    : videoData.filter(video => video.category === selectedCategory);

  const handleVideoSelect = useCallback((video: typeof videoData[0]) => {
    setSelectedVideo(video);
    setIsPlaying(false);
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
      }, 100), // 100ms防抖
      {
        rootMargin: '50px 0px', // 提前50px开始加载
        threshold: 0.1
      }
    );

    // 观察所有视频元素
    const videoElements = document.querySelectorAll('[data-filename]');
    videoElements.forEach((el) => observer.observe(el));

    return () => {
      videoElements.forEach((el) => observer.unobserve(el));
    };
  }, [filteredVideos]);

  // 根据文件名获取翻译的标题和描述
  const getVideoTranslation = useCallback((filename: string) => {
    const translationMap: { [key: string]: { title: string; description: string } } = {
      '3.mp4': {
        title: translations.cases.desertEnvironmentGeneration,
        description: translations.cases.desertEnvironmentDescription
      },
      '6.mp4': {
        title: translations.cases.terrainDetailDisplay,
        description: translations.cases.terrainDetailDescription
      },
      '7.mp4': {
        title: translations.cases.fastTerrainGeneration,
        description: translations.cases.fastTerrainDescription
      },
      '10.mp4': {
        title: translations.cases.terrainVariationDemo,
        description: translations.cases.terrainVariationDescription
      },
      '12.mp4': {
        title: translations.cases.environmentTemplateDisplay,
        description: translations.cases.environmentTemplateDescription
      },
      '14.mp4': {
        title: translations.cases.advancedTerrainGeneration,
        description: translations.cases.advancedTerrainDescription
      },
      '过山车2.mp4': {
        title: translations.cases.rollercoasterScene2,
        description: translations.cases.rollercoasterScene2Description
      },
      '过山车3.mp4': {
        title: translations.cases.rollercoasterScene3,
        description: translations.cases.rollercoasterScene3Description
      },
      '海洋1.mp4': {
        title: translations.cases.oceanEnvironment1,
        description: translations.cases.oceanEnvironment1Description
      },
      '海洋3.mp4': {
        title: translations.cases.oceanEnvironmentGeneration,
        description: translations.cases.oceanEnvironmentDescription
      },
      '海洋4.mp4': {
        title: translations.cases.oceanEnvironment4,
        description: translations.cases.oceanEnvironment4Description
      },
      '海洋5.mp4': {
        title: translations.cases.oceanEnvironment5,
        description: translations.cases.oceanEnvironment5Description
      },
      '海洋6.mp4': {
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {translations.cases.title}
          </h1>
          <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-300">
            {translations.cases.subtitle}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Category Filter */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
            {translations.cases.filterByCategory}
          </h2>
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                className="text-xs sm:text-sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

                 {/* Video Grid */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-4 mb-8 max-w-full sm:max-w-4xl lg:max-w-5xl mx-auto mobile-video-layout" style={{ willChange: 'transform' }}>
           {filteredVideos.map((video) => {
             const videoTranslation = getVideoTranslation(video.filename);
             return (
               <Card 
                 key={video.id} 
                 className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 dark:bg-gray-800 dark:border-gray-700 w-full mobile-video-card"
                 onClick={() => handleVideoSelect(video)}
               >
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
                               // 如果自动播放失败，静音后重试
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
                       {currentLanguage === 'zh' ? '自动播放' : 'Auto Play'}
                     </div>
                   </div>
                   <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base text-center sm:text-left">{videoTranslation.description}</p>
                 </CardContent>
               </Card>
             );
           })}
         </div>

                 {/* Video Modal */}
         {selectedVideo && (
           <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
             <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
               <div className="p-4 sm:p-6 border-b dark:border-gray-700">
                 <div className="flex items-center justify-between">
                   <h3 className="text-lg sm:text-xl font-semibold dark:text-white">{getVideoTranslation(selectedVideo.filename).title}</h3>
                   <Button
                     variant="ghost"
                     size="sm"
                     className="text-sm sm:text-base"
                     onClick={() => setSelectedVideo(null)}
                   >
                     ✕
                   </Button>
                 </div>
                 <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2">{getVideoTranslation(selectedVideo.filename).description}</p>
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
              
              <div className="p-6 border-t dark:border-gray-700">
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

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-0">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">
                {translations.cases.readyToCreate}
              </h2>
              <p className="text-blue-100 mb-6">
                {translations.cases.joinCreators}
              </p>
              <Link href="/generator">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  {translations.cases.startCreating}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 