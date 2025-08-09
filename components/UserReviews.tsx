'use client';

import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import { useState, useEffect } from 'react';
import { getTranslations, Language, detectBrowserLanguage } from "@/lib/translations";

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
  };

  return (
    <figure
      className={cn(
        "relative h-full w-80 cursor-pointer overflow-hidden rounded-xl border p-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300",
        "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-400",
      )}
    >
      <div className="flex flex-row items-center gap-3 mb-3">
        {!imageError ? (
          <img 
            className="rounded-full w-10 h-10 object-cover border-2 border-gray-100 dark:border-gray-600" 
            width="40" 
            height="40" 
            alt={name} 
            src={img} 
            onError={handleImageError}
          />
        ) : (
          <div className="rounded-full w-10 h-10 border-2 border-gray-100 dark:border-gray-600 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
            {getInitials(name)}
          </div>
        )}
        <div className="flex flex-col">
          <figcaption className="text-sm font-semibold text-gray-900 dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs text-gray-500 dark:text-gray-400">{username}</p>
        </div>
      </div>
      <blockquote className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{body}</blockquote>
    </figure>
  );
};

export function UserReviews() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

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
  const currentReviews = translations.userReviews.reviews;
  const currentFirstRow = currentReviews.slice(0, currentReviews.length / 2);
  const currentSecondRow = currentReviews.slice(currentReviews.length / 2);

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {translations.userReviews.title}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {translations.userReviews.subtitle}
          </p>
        </div>
        
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <div className="w-full overflow-hidden group">
            <Marquee
              className="py-4"
              pauseOnHover
              style={{
                "--duration": "20s",
                "--gap": "1.5rem",
              } as React.CSSProperties}
            >
              {currentFirstRow.map((review) => (
                <ReviewCard key={review.username} {...review} />
              ))}
            </Marquee>
          </div>
          <div className="w-full overflow-hidden group">
            <Marquee 
              reverse 
              pauseOnHover 
              className="py-4"
              style={{
                "--duration": "20s",
                "--gap": "1.5rem",
              } as React.CSSProperties}
            >
              {currentSecondRow.map((review) => (
                <ReviewCard key={review.username} {...review} />
              ))}
            </Marquee>
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white dark:from-gray-900 via-white/50 dark:via-gray-900/50 to-transparent"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white dark:from-gray-900 via-white/50 dark:via-gray-900/50 to-transparent"></div>
        </div>
      </div>
    </section>
  );
}
