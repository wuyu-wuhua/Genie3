import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 优化Unsplash图片URL，添加WebP格式支持和更好的压缩参数
 * @param originalUrl 原始的Unsplash图片URL
 * @returns 优化后的图片URL
 */
export function optimizeUnsplashImage(originalUrl: string): string {
  if (!originalUrl.includes('unsplash.com')) {
    return originalUrl;
  }
  
  // 解析原始URL
  const url = new URL(originalUrl);
  
  // 设置优化的参数
  url.searchParams.set('w', '64');
  url.searchParams.set('h', '64');
  url.searchParams.set('fit', 'crop');
  url.searchParams.set('crop', 'face');
  url.searchParams.set('fm', 'webp'); // 强制使用WebP格式
  url.searchParams.set('q', '80'); // 设置质量为80%，在文件大小和质量间取得平衡
  url.searchParams.set('auto', 'format'); // 启用自动格式优化
  
  return url.toString();
}
