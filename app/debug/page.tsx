'use client';

import { useState, useEffect } from 'react';
import { getTranslations, Language, detectBrowserLanguage } from '@/lib/translations';

export default function DebugPage() {
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

  // 多语言内容
  const content = {
    zh: {
      title: "环境变量调试页面",
      supabaseConfig: "Supabase 配置",
      notSet: "未设置",
      envVarsNeeded: "需要配置的环境变量",
      envVarsDescription: "请确保在项目根目录的 .env.local 文件中包含以下配置：",
      supabaseConfigComment: "# Supabase Configuration",
      googleOAuthComment: "# Google OAuth Configuration"
    },
    en: {
      title: "Environment Variables Debug Page",
      supabaseConfig: "Supabase Configuration",
      notSet: "Not Set",
      envVarsNeeded: "Required Environment Variables",
      envVarsDescription: "Please ensure the following configuration is included in the .env.local file in the project root directory:",
      supabaseConfigComment: "# Supabase Configuration",
      googleOAuthComment: "# Google OAuth Configuration"
    },
    ru: {
      title: "Страница отладки переменных окружения",
      supabaseConfig: "Конфигурация Supabase",
      notSet: "Не установлено",
      envVarsNeeded: "Требуемые переменные окружения",
      envVarsDescription: "Убедитесь, что следующая конфигурация включена в файл .env.local в корневой директории проекта:",
      supabaseConfigComment: "# Конфигурация Supabase",
      googleOAuthComment: "# Конфигурация Google OAuth"
    },
    fr: {
      title: "Page de débogage des variables d'environnement",
      supabaseConfig: "Configuration Supabase",
      notSet: "Non défini",
      envVarsNeeded: "Variables d'environnement requises",
      envVarsDescription: "Assurez-vous que la configuration suivante est incluse dans le fichier .env.local dans le répertoire racine du projet :",
      supabaseConfigComment: "# Configuration Supabase",
      googleOAuthComment: "# Configuration Google OAuth"
    },
    ja: {
      title: "環境変数デバッグページ",
      supabaseConfig: "Supabase設定",
      notSet: "設定されていません",
      envVarsNeeded: "必要な環境変数",
      envVarsDescription: "プロジェクトのルートディレクトリの.env.localファイルに以下の設定が含まれていることを確認してください：",
      supabaseConfigComment: "# Supabase設定",
      googleOAuthComment: "# Google OAuth設定"
    },
    it: {
      title: "Pagina di debug delle variabili d'ambiente",
      supabaseConfig: "Configurazione Supabase",
      notSet: "Non impostato",
      envVarsNeeded: "Variabili d'ambiente richieste",
      envVarsDescription: "Assicurati che la seguente configurazione sia inclusa nel file .env.local nella directory root del progetto:",
      supabaseConfigComment: "# Configurazione Supabase",
      googleOAuthComment: "# Configurazione Google OAuth"
    },
    ko: {
      title: "환경 변수 디버그 페이지",
      supabaseConfig: "Supabase 설정",
      notSet: "설정되지 않음",
      envVarsNeeded: "필요한 환경 변수",
      envVarsDescription: "프로젝트 루트 디렉토리의 .env.local 파일에 다음 구성이 포함되어 있는지 확인하세요:",
      supabaseConfigComment: "# Supabase 설정",
      googleOAuthComment: "# Google OAuth 설정"
    },
    de: {
      title: "Umgebungsvariablen-Debug-Seite",
      supabaseConfig: "Supabase-Konfiguration",
      notSet: "Nicht gesetzt",
      envVarsNeeded: "Erforderliche Umgebungsvariablen",
      envVarsDescription: "Stellen Sie sicher, dass die folgende Konfiguration in der .env.local-Datei im Projektstammverzeichnis enthalten ist:",
      supabaseConfigComment: "# Supabase-Konfiguration",
      googleOAuthComment: "# Google OAuth-Konfiguration"
    },
    es: {
      title: "Página de depuración de variables de entorno",
      supabaseConfig: "Configuración de Supabase",
      notSet: "No establecido",
      envVarsNeeded: "Variables de entorno requeridas",
      envVarsDescription: "Asegúrese de que la siguiente configuración esté incluida en el archivo .env.local en el directorio raíz del proyecto:",
      supabaseConfigComment: "# Configuración de Supabase",
      googleOAuthComment: "# Configuración de Google OAuth"
    }
  };

  const currentContent = content[currentLanguage] || content.en;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{currentContent.title}</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{currentContent.supabaseConfig}</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                NEXT_PUBLIC_SUPABASE_URL
              </label>
              <div className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 p-3 rounded border">
                {process.env.NEXT_PUBLIC_SUPABASE_URL || currentContent.notSet}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                NEXT_PUBLIC_SUPABASE_ANON_KEY
              </label>
              <div className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 p-3 rounded border">
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
                  ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 50)}...` 
                  : currentContent.notSet
                }
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                GOOGLE_CLIENT_ID
              </label>
              <div className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 p-3 rounded border">
                {process.env.GOOGLE_CLIENT_ID || currentContent.notSet}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                GOOGLE_CLIENT_SECRET
              </label>
              <div className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 p-3 rounded border">
                {process.env.GOOGLE_CLIENT_SECRET 
                  ? `${process.env.GOOGLE_CLIENT_SECRET.substring(0, 20)}...` 
                  : currentContent.notSet
                }
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                SUPABASE_SERVICE_ROLE_KEY
              </label>
              <div className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 p-3 rounded border">
                {process.env.SUPABASE_SERVICE_ROLE_KEY 
                  ? `${process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 50)}...` 
                  : currentContent.notSet
                }
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">{currentContent.envVarsNeeded}</h3>
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              {currentContent.envVarsDescription}
            </p>
            <pre className="mt-2 text-xs bg-blue-100 dark:bg-blue-800 p-3 rounded overflow-x-auto text-gray-900 dark:text-gray-200">
{`${currentContent.supabaseConfigComment}
NEXT_PUBLIC_SUPABASE_URL=https://knyoenbremxbmdxeiuts.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtueW9lbmJyZW14Ym1keGVpdXRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NDg2OTEsImV4cCI6MjA3MDEyNDY5MX0.Bbbhw669TH2cT-Eq2E2BS1DtN2IXhT9QpG4PdTGOSoM
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtueW9lbmJyZW14Ym1keGVpdXRzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDU0ODY5MSwiZXhwIjoyMDcwMTI0NjkxfQ.-q6JjHBEmqfpSJe793Klaajb2Ovm1Ed8VFkK5VCby1E

${currentContent.googleOAuthComment}
GOOGLE_CLIENT_ID=1036841007624-ulij16rrf4gub0n2b1ct3mrdv7bapnvg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
} 