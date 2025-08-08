'use client';

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">环境变量调试页面</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Supabase 配置</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                NEXT_PUBLIC_SUPABASE_URL
              </label>
              <div className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 p-3 rounded border">
                {process.env.NEXT_PUBLIC_SUPABASE_URL || '未设置'}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                NEXT_PUBLIC_SUPABASE_ANON_KEY
              </label>
              <div className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 p-3 rounded border">
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
                  ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 50)}...` 
                  : '未设置'
                }
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                GOOGLE_CLIENT_ID
              </label>
              <div className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 p-3 rounded border">
                {process.env.GOOGLE_CLIENT_ID || '未设置'}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                GOOGLE_CLIENT_SECRET
              </label>
              <div className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 p-3 rounded border">
                {process.env.GOOGLE_CLIENT_SECRET 
                  ? `${process.env.GOOGLE_CLIENT_SECRET.substring(0, 20)}...` 
                  : '未设置'
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
                  : '未设置'
                }
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">需要配置的环境变量</h3>
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              请确保在项目根目录的 <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">.env.local</code> 文件中包含以下配置：
            </p>
            <pre className="mt-2 text-xs bg-blue-100 dark:bg-blue-800 p-3 rounded overflow-x-auto text-gray-900 dark:text-gray-200">
{`# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://knyoenbremxbmdxeiuts.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtueW9lbmJyZW14Ym1keGVpdXRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NDg2OTEsImV4cCI6MjA3MDEyNDY5MX0.Bbbhw669TH2cT-Eq2E2BS1DtN2IXhT9QpG4PdTGOSoM
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtueW9lbmJyZW14Ym1keGVpdXRzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDU0ODY5MSwiZXhwIjoyMDcwMTI0NjkxfQ.-q6JjHBEmqfpSJe793Klaajb2Ovm1Ed8VFkK5VCby1E

# Google OAuth Configuration
GOOGLE_CLIENT_ID=1036841007624-ulij16rrf4gub0n2b1ct3mrdv7bapnvg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
} 