
'use client';

import React, { useState, useEffect } from 'react';
import { Language, getTranslations } from '@/lib/translations';

interface SurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
}

export default function SurveyModal({ isOpen, onClose, currentLanguage }: SurveyModalProps) {
  const [formData, setFormData] = useState({
    role: '',
    usecases: [] as string[],
    experience: '',
    interest: 0,
    selling: [] as string[],
    concerns: [] as string[],
    freq: '',
    price: '',
    fallback: '',
    integration: [] as string[],
    env: [] as string[],
    latency: '',
    magic: '',
    beta: [] as string[],
    email: '',
    wechat: '',
    telegram: '',
    consent: false,
    region: '',
    lang: ''
  });

  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const translations = getTranslations(currentLanguage);

  // 计算进度
  useEffect(() => {
    let done = 0;
    const total = 5;
    if (formData.role) done++;
    if (formData.usecases.length > 0) done++;
    if (formData.interest >= 0) done++; // 修改：只要选择了兴趣值就算完成
    if (formData.freq) done++;
    if (formData.fallback) done++;
    setProgress(Math.round((done / total) * 100));
  }, [formData]);

  // 计算兴趣分
  useEffect(() => {
    let s = Math.max(0, Math.min(10, formData.interest));
    const sellingHit = formData.selling.includes('无需建模直接生成') || formData.selling.includes('浏览器运行免安装');
    if (sellingHit) s += 2;
    if (['每天', '每周多次', '每周一次'].includes(formData.freq)) s += 2;
    if (['¥69–99/月', '¥199+/月', '按量计费'].includes(formData.price)) s += 3;
    if (formData.beta.length > 0) s += 3;
    setScore(Math.max(0, Math.min(20, s)));
  }, [formData]);

  const handleInputChange = (name: string, value: any) => {
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, value: string, checked: boolean) => {
    setFormData(prev => {
      const current = prev[name as keyof typeof prev] as string[];
      if (checked) {
        // 限制多选数量
        if (name === 'usecases' && current.length >= 3) return prev;
        if (name === 'selling' && current.length >= 3) return prev;
        return { ...prev, [name]: [...current, value] };
      } else {
        return { ...prev, [name]: current.filter(item => item !== value) };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证必填字段
    if (!formData.role || formData.usecases.length === 0 || !formData.freq || !formData.fallback) {
      setMessage(translations.survey?.messages?.fillRequired || '请填写所有必填字段');
      setMessageType('error');
      return;
    }

    // 验证联系方式同意（只有填写了联系方式才需要勾选同意）
    if ((formData.email || formData.wechat || formData.telegram) && !formData.consent) {
      setMessage(translations.survey?.messages?.consentRequired || '若填写联系方式，请勾选同意条款');
      setMessageType('error');
      return;
    }

    try {
      const response = await fetch('/api/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(translations.survey?.messages?.submitSuccess || '提交成功！感谢您的反馈，我们将优先通知内测。');
        setMessageType('success');
        setFormData({
          role: '',
          usecases: [],
          experience: '',
          interest: 0,
          selling: [],
          concerns: [],
          freq: '',
          price: '',
          fallback: '',
          integration: [],
          env: [],
          latency: '',
          magic: '',
          beta: [],
          email: '',
          wechat: '',
          telegram: '',
          consent: false,
          region: '',
          lang: ''
        });
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        const errorData = await response.json().catch(() => ({}));

        throw new Error(errorData.error || `${translations.survey?.messages?.submitFailed || '提交失败'} (${response.status})`);
      }
    } catch (error) {
      
      setMessage(`${translations.survey?.messages?.submitFailed || '提交失败'}：${error instanceof Error ? error.message : (translations.survey?.messages?.tryAgainLater || '请稍后再试')}`);
      setMessageType('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <style jsx>{`
        .slider {
          -webkit-appearance: none;
          appearance: none;
          outline: none;
        }
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          border: none;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider::-webkit-slider-track {
          height: 8px;
          border-radius: 4px;
          background: transparent;
        }
        .slider::-moz-range-track {
          height: 8px;
          border-radius: 4px;
          background: transparent;
        }
        .slider:focus {
          outline: none;
        }
      `}</style>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {translations.survey?.title || "调查问卷"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {translations.survey?.subtitle || "预计 1–2 分钟完成。我们仅用于改进与内测邀请。"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 进度与综合兴趣分 */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {translations.survey?.progress || "完成进度"} <span className="font-semibold text-blue-600">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {translations.survey?.interestScore || "即时兴趣分："}<span className="font-semibold text-blue-600">{score}</span> {translations.survey?.outOf20 || "/ 20"}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {translations.survey?.strongInterest || "≥14 视为强兴趣，将优先邀测"}
                </div>
              </div>
            </div>
          </div>

          {/* Q1 角色 */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              1) {translations.survey?.questions?.role?.title || "你在项目中的角色？"} <span className="text-red-500">{translations.survey?.required || "*"}</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(translations.survey?.questions?.role?.options || ['开发者', '技术美术', '设计师', '产品/运营', '创作者', '学生', '其他']).map((role) => (
                <label key={role} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={formData.role === role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{role}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q2 应用场景 */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              2) {translations.survey?.questions?.usecases?.title || "你最想把'文本→可交互3D场景'用在？（可多选≤3）"} <span className="text-red-500">{translations.survey?.required || "*"}</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(translations.survey?.questions?.usecases?.options || [
                '游戏原型', '关卡设计', '教学演示', '营销与广告', 
                '影视分镜', 'AR/VR 内容', '机器人/自动驾驶仿真', '其他'
              ]).map((usecase) => (
                <label key={usecase} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="usecases"
                    value={usecase}
                    checked={formData.usecases.includes(usecase)}
                    onChange={(e) => handleCheckboxChange('usecases', usecase, e.target.checked)}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{usecase}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q3 经验 */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              3) {translations.survey?.questions?.experience?.title || "你是否用过类似工具？"}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(translations.survey?.questions?.experience?.options || ['深度使用', '试过体验版或看过演示', '听说过但没用过', '完全不了解']).map((exp) => (
                <label key={exp} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="experience"
                    value={exp}
                    checked={formData.experience === exp}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{exp}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q4 兴趣滑条 */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              4) {translations.survey?.questions?.interest?.title || "看完我们的一句话概念后，你的兴趣有多大？（0–10）"} <span className="text-red-500">{translations.survey?.required || "*"}</span>
            </h3>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={formData.interest}
                onChange={(e) => handleInputChange('interest', parseInt(e.target.value))}
                onInput={(e) => handleInputChange('interest', parseInt(e.currentTarget.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(formData.interest / 10) * 100}%, #e5e7eb ${(formData.interest / 10) * 100}%, #e5e7eb 100%)`
                }}
              />
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {translations.survey?.questions?.interest?.current || "当前："}<span className="font-semibold text-blue-600">{formData.interest}</span>
                <button
                  type="button"
                  onClick={() => handleInputChange('interest', Math.min(10, formData.interest + 1))}
                  className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                >
                  +1
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('interest', Math.max(0, formData.interest - 1))}
                  className="ml-1 px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200"
                >
                  -1
                </button>
              </div>
            </div>
          </div>

          {/* Q5 卖点 */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              5) {translations.survey?.questions?.selling?.title || "哪些卖点最打动你？（可多选≤3）"}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(translations.survey?.questions?.selling?.options || [
                '无需建模直接生成', '边玩边改天气/物体/规则', '浏览器运行免安装',
                '可导出到Unity/Unreal/GLTF', '多人协作', '可录制成视频', '版权与隐私保障'
              ]).map((point) => (
                <label key={point} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="selling"
                    value={point}
                    checked={formData.selling.includes(point)}
                    onChange={(e) => handleCheckboxChange('selling', point, e.target.checked)}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{point}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q6 顾虑 */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              6) {translations.survey?.questions?.concerns?.title || "你最担心什么？（可多选）"}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(translations.survey?.questions?.concerns?.options || [
                '画质不够', '延迟与流畅度', '操作手感', '浏览器兼容', '稳定性',
                '成本太高', '学习成本', '内容版权/合规', '其他'
              ]).map((concern) => (
                <label key={concern} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="concerns"
                    value={concern}
                    checked={formData.concerns.includes(concern)}
                    onChange={(e) => handleCheckboxChange('concerns', concern, e.target.checked)}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{concern}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q7 频率 */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              7) {translations.survey?.questions?.freq?.title || "你理想的使用频率？"} <span className="text-red-500">{translations.survey?.required || "*"}</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {(translations.survey?.questions?.freq?.options || ['每天', '每周多次', '每周一次', '偶尔需要', '仅尝鲜']).map((freq) => (
                <label key={freq} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="freq"
                    value={freq}
                    checked={formData.freq === freq}
                    onChange={(e) => handleInputChange('freq', e.target.value)}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{freq}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q8 价格 */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              8) {translations.survey?.questions?.price?.title || "个人/小团队价格可接受范围？"}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(translations.survey?.questions?.price?.options || [
                '免费+水印', '¥29–49/月', '¥69–99/月', '¥199+/月', '按量计费', '试用后再考虑'
              ]).map((price) => (
                <label key={price} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="price"
                    value={price}
                    checked={formData.price === price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{price}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q9 替代方案态度 */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              9) {translations.survey?.questions?.fallback?.title || "若短期无官方接口，仅提供'代码/提示词生成 3D 场景'的替代方案，你会？"} <span className="text-red-500">{translations.survey?.required || "*"}</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(translations.survey?.questions?.fallback?.options || ['愿意先用替代方案', '只等官方接口', '看演示后再决定']).map((fallback) => (
                <label key={fallback} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="fallback"
                    value={fallback}
                    checked={formData.fallback === fallback}
                    onChange={(e) => handleInputChange('fallback', e.target.value)}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{fallback}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q10-12 技术接入（开发者/技术美术优先显示） */}
          {(formData.role === '开发者' || formData.role === '技术美术') && (
            <>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  10) {translations.survey?.questions?.integration?.title || "你希望的接入方式是？（可多选）"}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {(translations.survey?.questions?.integration?.options || [
                    'Web SDK', 'REST API', 'Unity 插件', 'Unreal 插件', '无代码工作流', '仅成品网站'
                  ]).map((integration) => (
                    <label key={integration} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="integration"
                        value={integration}
                        checked={formData.integration.includes(integration)}
                        onChange={(e) => handleCheckboxChange('integration', integration, e.target.checked)}
                        className="text-blue-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{integration}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  11) {translations.survey?.questions?.env?.title || "你的设备与环境？（可多选）"}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {(translations.survey?.questions?.env?.options || [
                    'Windows', 'macOS', 'iPad/Android 平板', '独显或云GPU', 'Chrome', 'Safari', 'Edge'
                  ]).map((env) => (
                    <label key={env} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="env"
                        value={env}
                        checked={formData.env.includes(env)}
                        onChange={(e) => handleCheckboxChange('env', env, e.target.checked)}
                        className="text-blue-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{env}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  12) {translations.survey?.questions?.latency?.title || "可接受的端到端延迟？"}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(translations.survey?.questions?.latency?.options || ['<100ms', '100–300ms', '300–600ms', '只要稳定即可']).map((latency) => (
                    <label key={latency} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="latency"
                        value={latency}
                        checked={formData.latency === latency}
                        onChange={(e) => handleInputChange('latency', e.target.value)}
                        className="text-blue-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{latency}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Q13 开放题 */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              13) {translations.survey?.questions?.magic?.title || "你最希望它立刻能做到的一条\"魔法指令\"？"}
            </h3>
            <textarea
              name="magic"
              value={formData.magic}
              onChange={(e) => handleInputChange('magic', e.target.value)}
              placeholder={translations.survey?.questions?.magic?.placeholder || "例如：把这间房改成赛博朋克风并下雨，生成两名会巡逻的敌人……"}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              rows={3}
            />
          </div>

          {/* Q14 内测 */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              14) {translations.survey?.questions?.beta?.title || "愿意加入内测或等候名单吗？"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(translations.survey?.questions?.beta?.options || ['等候名单', '访谈', '提供测试素材']).map((beta) => (
                <label key={beta} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="beta"
                    value={beta}
                    checked={formData.beta.includes(beta)}
                    onChange={(e) => handleCheckboxChange('beta', beta, e.target.checked)}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{beta}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q15 联系方式 + 同意 */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              15) {translations.survey?.questions?.contact?.title || "留个联系方式（可选）"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder={translations.survey?.questions?.contact?.email || "邮箱（可选）"}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <input
                type="text"
                name="wechat"
                value={formData.wechat}
                onChange={(e) => handleInputChange('wechat', e.target.value)}
                placeholder={translations.survey?.questions?.contact?.wechat || "微信（可选）"}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="telegram"
                value={formData.telegram}
                onChange={(e) => handleInputChange('telegram', e.target.value)}
                placeholder={translations.survey?.questions?.contact?.telegram || "Telegram（可选）"}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="consent"
                  name="consent"
                  checked={formData.consent}
                  onChange={(e) => handleInputChange('consent', e.target.checked)}
                  className="text-blue-600"
                />
                <label htmlFor="consent" className="text-sm text-gray-700 dark:text-gray-300">
                  {translations.survey?.questions?.contact?.consent || "我同意用于产品联络与内测通知"}
                </label>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {translations.survey?.questions?.contact?.note || "若填写联系方式，请勾选同意"}
            </div>
          </div>

          {/* Q16 地区/语言 */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              16) {translations.survey?.questions?.region?.title || "你的地区与语言偏好？"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                name="region"
                value={formData.region}
                onChange={(e) => handleInputChange('region', e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">{translations.survey?.questions?.region?.regionLabel || "选择地区"}</option>
                {Object.entries(translations.survey?.questions?.region?.regions || {'中国大陆': '中国大陆', '港澳台': '港澳台', '北美': '北美', '欧洲': '欧洲', '其他': '其他'}).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>
              <select
                name="lang"
                value={formData.lang}
                onChange={(e) => handleInputChange('lang', e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">{translations.survey?.questions?.region?.langLabel || "选择语言"}</option>
                {Object.entries(translations.survey?.questions?.region?.languages || {'中文': '中文', '英文': '英文', '其他': '其他'}).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 消息提示 */}
          {message && (
            <div className={`p-4 rounded-lg ${
              messageType === 'success' 
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
            }`}>
              {message}
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {translations.survey?.cancel || "取消"}
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {translations.survey?.submit || "提交调查问卷"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
