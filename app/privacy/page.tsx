'use client';

import React, { useState, useEffect } from 'react';
import { Shield, ArrowLeft, Languages, Calendar, CheckCircle, AlertTriangle, Users, Eye, Lock, Zap, Heart, Star, Award, Scale, BookOpen, Globe, Mail, Phone, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getTranslations, Language, detectBrowserLanguage } from '@/lib/translations';
import type { PrivacyTranslations } from '@/lib/translations/types';

export default function PrivacyPolicyPage() {
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
      localStorage.setItem('genie3-language', detectedLanguage);
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
  const privacyTranslations = translations.privacy as PrivacyTranslations;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 dark:bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/30 dark:bg-purple-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <div className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <Shield className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            {privacyTranslations?.title || "Privacy Policy"}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {privacyTranslations?.subtitle || "Your privacy is our priority. Learn how we protect your data."}
          </p>
          <div className="flex items-center justify-center mt-6 space-x-3 text-sm text-gray-500 dark:text-gray-400 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
            <Calendar className="h-5 w-5 text-blue-500" />
                            <span>{privacyTranslations?.lastUpdated || "Last updated"}: {privacyTranslations?.updateDate || "August 6, 2025"}</span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Introduction */}
          <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mr-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              {privacyTranslations?.introduction || "Introduction"}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {privacyTranslations?.introductionText || "At Genie 3, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our AI-powered 3D world generation platform."}
            </p>
          </section>

          {/* Information We Collect */}
          <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl mr-4">
                <Eye className="h-8 w-8 text-white" />
              </div>
              {privacyTranslations?.informationWeCollect || "Information We Collect"}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl border border-blue-200/50 dark:border-blue-700/50 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-blue-500 rounded-lg mr-3">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-300">
                    {privacyTranslations?.accountInformation || "Account Information"}
                  </h3>
                </div>
                <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                  {privacyTranslations?.accountInformationText || "Email address, username, and profile information when you create an account."}
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl border border-green-200/50 dark:border-green-700/50 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-green-500 rounded-lg mr-3">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-green-900 dark:text-green-300">
                    {privacyTranslations?.usageData || "Usage Data"}
                  </h3>
                </div>
                <p className="text-green-800 dark:text-green-200 text-sm leading-relaxed">
                  {privacyTranslations?.usageDataText || "Information about how you use our platform, including generated worlds and preferences."}
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl border border-purple-200/50 dark:border-purple-700/50 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-purple-500 rounded-lg mr-3">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-purple-900 dark:text-purple-300">
                    {privacyTranslations?.technicalData || "Technical Data"}
                  </h3>
                </div>
                <p className="text-purple-800 dark:text-purple-200 text-sm leading-relaxed">
                  {privacyTranslations?.technicalDataText || "Device information, IP address, and browser data for security and optimization."}
                </p>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl mr-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              {privacyTranslations?.howWeUse || "How We Use Your Information"}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-800/30 rounded-xl border border-blue-200/50 dark:border-blue-700/50 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-blue-500 rounded-lg mr-3">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-300">
                    {privacyTranslations?.serviceProvision || "Service Provision"}
                  </h3>
                </div>
                <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                  {privacyTranslations?.serviceProvisionText || "To provide and improve our AI-powered 3D world generation services."}
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-800/30 rounded-xl border border-green-200/50 dark:border-green-700/50 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-green-500 rounded-lg mr-3">
                    <Mail className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-green-900 dark:text-green-300">
                    {privacyTranslations?.communication || "Communication"}
                  </h3>
                </div>
                <p className="text-green-800 dark:text-green-200 text-sm leading-relaxed">
                  {privacyTranslations?.communicationText || "To communicate with you about your account and our services."}
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/30 dark:to-violet-800/30 rounded-xl border border-purple-200/50 dark:border-purple-700/50 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-purple-500 rounded-lg mr-3">
                    <Lock className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-purple-900 dark:text-purple-300">
                    {privacyTranslations?.security || "Security"}
                  </h3>
                </div>
                <p className="text-purple-800 dark:text-purple-200 text-sm leading-relaxed">
                  {privacyTranslations?.securityText || "To protect against fraud and ensure platform security."}
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/30 dark:to-amber-800/30 rounded-xl border border-orange-200/50 dark:border-orange-700/50 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-orange-500 rounded-lg mr-3">
                    <Scale className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-orange-900 dark:text-orange-300">
                    {privacyTranslations?.analytics || "Analytics"}
                  </h3>
                </div>
                <p className="text-orange-800 dark:text-orange-200 text-sm leading-relaxed">
                  {privacyTranslations?.analyticsText || "To analyze usage patterns and improve user experience."}
                </p>
              </div>
            </div>
          </section>

          {/* Data Protection */}
          <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
              <div className="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl mr-4">
                <Lock className="h-8 w-8 text-white" />
              </div>
              {privacyTranslations?.dataProtection || "Data Protection"}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-800/30 rounded-xl border border-blue-200/50 dark:border-blue-700/50 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-blue-500 rounded-lg mr-3">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-300">
                    {privacyTranslations?.encryption || "Encryption"}
                  </h3>
                </div>
                <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                  {privacyTranslations?.encryptionText || "All data is encrypted using industry-standard protocols during transmission and storage."}
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-green-50 to-teal-100 dark:from-green-900/30 dark:to-teal-800/30 rounded-xl border border-green-200/50 dark:border-green-700/50 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-green-500 rounded-lg mr-3">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-green-900 dark:text-green-300">
                    {privacyTranslations?.accessControl || "Access Control"}
                  </h3>
                </div>
                <p className="text-green-800 dark:text-green-200 text-sm leading-relaxed">
                  {privacyTranslations?.accessControlText || "Strict access controls ensure only authorized personnel can access your data."}
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-900/30 dark:to-orange-800/30 rounded-xl border border-yellow-200/50 dark:border-yellow-700/50 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-yellow-500 rounded-lg mr-3">
                    <AlertTriangle className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-yellow-900 dark:text-yellow-300">
                    {privacyTranslations?.monitoring || "Monitoring"}
                  </h3>
                </div>
                <p className="text-yellow-800 dark:text-yellow-200 text-sm leading-relaxed">
                  {privacyTranslations?.monitoringText || "Continuous monitoring and regular security audits to protect your information."}
                </p>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
              <div className="p-3 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl mr-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              {privacyTranslations?.yourRights || "Your Rights"}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-800/30 rounded-xl border border-blue-200/50 dark:border-blue-700/50 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-blue-500 rounded-lg mr-3">
                    <Eye className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-300">
                    {privacyTranslations?.access || "Access"}
                  </h3>
                </div>
                <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                  {privacyTranslations?.accessText || "Request access to your personal data and information about how it's used."}
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-800/30 rounded-xl border border-green-200/50 dark:border-green-700/50 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-green-500 rounded-lg mr-3">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-green-900 dark:text-green-300">
                    {privacyTranslations?.correction || "Correction"}
                  </h3>
                </div>
                <p className="text-green-800 dark:text-green-200 text-sm leading-relaxed">
                  {privacyTranslations?.correctionText || "Request correction of inaccurate or incomplete personal data."}
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/30 dark:to-violet-800/30 rounded-xl border border-purple-200/50 dark:border-purple-700/50 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-purple-500 rounded-lg mr-3">
                    <AlertTriangle className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-purple-900 dark:text-purple-300">
                    {privacyTranslations?.deletion || "Deletion"}
                  </h3>
                </div>
                <p className="text-purple-800 dark:text-purple-200 text-sm leading-relaxed">
                  {privacyTranslations?.deletionText || "Request deletion of your personal data in certain circumstances."}
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/30 dark:to-amber-800/30 rounded-xl border border-orange-200/50 dark:border-orange-700/50 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-orange-500 rounded-lg mr-3">
                    <Globe className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-orange-900 dark:text-orange-300">
                    {privacyTranslations?.portability || "Portability"}
                  </h3>
                </div>
                <p className="text-orange-800 dark:text-orange-200 text-sm leading-relaxed">
                  {privacyTranslations?.portabilityText || "Request a copy of your data in a portable format."}
                </p>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
              <div className="p-3 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl mr-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              {privacyTranslations?.contactUs || "Contact Us"}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              {privacyTranslations?.contactText || "If you have any questions about this Privacy Policy or our data practices, please contact us:"}
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl border border-blue-200/50 dark:border-blue-700/50 text-center hover:scale-105 transition-transform duration-300">
                <div className="p-3 bg-blue-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                  {privacyTranslations?.email || "Email"}
                </h3>
                <a 
                  href="https://mail.google.com/mail/u/0/#inbox?compose=DmwnWrRnZVjzVvbNhXkwfrZcXXgmtzsFKKvrcWMCLvPXcvKwkdbpSpQNVtzMstNLRJbTWjmNSDkL" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-800 dark:text-blue-200 text-sm hover:underline hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
                >
                  media@aigenie3.net
                </a>
              </div>
              <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl border border-purple-200/50 dark:border-purple-700/50 text-center hover:scale-105 transition-transform duration-300">
                <div className="p-3 bg-purple-500 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">
                  {privacyTranslations?.workingHours || "Working Hours"}
                </h3>
                <p className="text-purple-800 dark:text-purple-200 text-sm">{privacyTranslations?.workingHoursText || "Weekdays 9:00-18:00"}</p>
              </div>
            </div>
          </section>
        </div>

        {/* Back Button */}
        <div className="mt-16 text-center">
          <Button asChild variant="outline" className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <Link href="/">
              <ArrowLeft className="h-5 w-5 mr-3 group-hover:-translate-x-1 transition-transform duration-300" />
              {privacyTranslations?.backToHome || "Back to Home"}
            </Link>
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/50">
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {privacyTranslations?.footerText || "This Privacy Policy is effective as of the date listed above and may be updated periodically."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 
