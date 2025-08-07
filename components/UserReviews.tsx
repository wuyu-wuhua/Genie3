'use client';

import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import { useState, useEffect } from 'react';
import { getTranslations, Language } from "@/lib/translations";

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
  return (
    <figure
      className={cn(
        "relative h-full w-80 cursor-pointer overflow-hidden rounded-xl border p-4 bg-white shadow-sm hover:shadow-md transition-all duration-300",
        "border-gray-200 hover:border-blue-300",
      )}
    >
      <div className="flex flex-row items-center gap-3 mb-3">
        <img 
          className="rounded-full w-10 h-10 object-cover border-2 border-gray-100" 
          width="40" 
          height="40" 
          alt={name} 
          src={img} 
        />
        <div className="flex flex-col">
          <figcaption className="text-sm font-semibold text-gray-900">
            {name}
          </figcaption>
          <p className="text-xs text-gray-500">{username}</p>
        </div>
      </div>
      <blockquote className="text-sm text-gray-700 leading-relaxed">{body}</blockquote>
    </figure>
  );
};

export function UserReviews() {
  const [isEnglish, setIsEnglish] = useState(true);

  // 监听语言切换事件
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      setIsEnglish(event.detail.isEnglish);
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, []);

  const currentLanguage: Language = isEnglish ? 'en' : 'zh';
  const translations = getTranslations(currentLanguage);
  const currentReviews = translations.userReviews.reviews;
  const currentFirstRow = currentReviews.slice(0, currentReviews.length / 2);
  const currentSecondRow = currentReviews.slice(currentReviews.length / 2);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {translations.userReviews.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
              } as React.CSSProperties}
            >
              {currentSecondRow.map((review) => (
                <ReviewCard key={review.username} {...review} />
              ))}
            </Marquee>
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white"></div>
        </div>
      </div>
    </section>
  );
}
