'use client';

import React, { useState, useEffect } from 'react';
import { Shield, ArrowLeft, Languages, Calendar, CheckCircle, AlertTriangle, Users, Eye, Lock, Zap, Heart, Star, Award, Scale, BookOpen, Globe } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full">
              <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {privacyTranslations?.title || "Privacy Policy"}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {privacyTranslations?.subtitle || "Your privacy is our priority. Learn how we protect your data."}
          </p>
          <div className="flex items-center justify-center mt-4 space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>{privacyTranslations?.lastUpdated || "Last updated"}: {privacyTranslations?.updateDate || "January 15, 2024"}</span>
          </div>
        </div>

        {/* Back Button */}
        <div className="mb-8">
          <Button asChild variant="outline" className="group">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              {privacyTranslations?.backToHome || "Back to Home"}
            </Link>
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Introduction */}
          <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Shield className="h-6 w-6 mr-3 text-blue-600 dark:text-blue-400" />
              {privacyTranslations?.introduction || "Introduction"}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {privacyTranslations?.introductionText || "At Genie 3, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our AI-powered 3D world generation platform."}
            </p>
          </section>

          {/* Information We Collect */}
          <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Eye className="h-6 w-6 mr-3 text-green-600 dark:text-green-400" />
              {privacyTranslations?.informationWeCollect || "Information We Collect"}
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {privacyTranslations?.accountInformation || "Account Information"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {privacyTranslations?.accountInformationText || "Email address, username, and profile information when you create an account."}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {privacyTranslations?.usageData || "Usage Data"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {privacyTranslations?.usageDataText || "Information about how you use our platform, including generated worlds and preferences."}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {privacyTranslations?.technicalData || "Technical Data"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {privacyTranslations?.technicalDataText || "Device information, IP address, and browser data for security and optimization."}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Zap className="h-6 w-6 mr-3 text-yellow-600 dark:text-yellow-400" />
              {privacyTranslations?.howWeUse || "How We Use Your Information"}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
                  {privacyTranslations?.serviceProvision || "Service Provision"}
                </h3>
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  {privacyTranslations?.serviceProvisionText || "To provide and improve our AI-powered 3D world generation services."}
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h3 className="font-medium text-green-900 dark:text-green-300 mb-2">
                  {privacyTranslations?.communication || "Communication"}
                </h3>
                <p className="text-green-800 dark:text-green-200 text-sm">
                  {privacyTranslations?.communicationText || "To communicate with you about your account and our services."}
                </p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h3 className="font-medium text-purple-900 dark:text-purple-300 mb-2">
                  {privacyTranslations?.security || "Security"}
                </h3>
                <p className="text-purple-800 dark:text-purple-200 text-sm">
                  {privacyTranslations?.securityText || "To protect against fraud and ensure platform security."}
                </p>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <h3 className="font-medium text-orange-900 dark:text-orange-300 mb-2">
                  {privacyTranslations?.analytics || "Analytics"}
                </h3>
                <p className="text-orange-800 dark:text-orange-200 text-sm">
                  {privacyTranslations?.analyticsText || "To analyze usage patterns and improve user experience."}
                </p>
              </div>
            </div>
          </section>

          {/* Data Protection */}
          <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Lock className="h-6 w-6 mr-3 text-red-600 dark:text-red-400" />
              {privacyTranslations?.dataProtection || "Data Protection"}
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {privacyTranslations?.encryption || "Encryption"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {privacyTranslations?.encryptionText || "All data is encrypted using industry-standard protocols during transmission and storage."}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Users className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {privacyTranslations?.accessControl || "Access Control"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {privacyTranslations?.accessControlText || "Strict access controls ensure only authorized personnel can access your data."}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {privacyTranslations?.monitoring || "Monitoring"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {privacyTranslations?.monitoringText || "Continuous monitoring and regular security audits to protect your information."}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Star className="h-6 w-6 mr-3 text-yellow-600 dark:text-yellow-400" />
              {privacyTranslations?.yourRights || "Your Rights"}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
                  {privacyTranslations?.access || "Access"}
                </h3>
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  {privacyTranslations?.accessText || "Request access to your personal data and information about how it's used."}
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h3 className="font-medium text-green-900 dark:text-green-300 mb-2">
                  {privacyTranslations?.correction || "Correction"}
                </h3>
                <p className="text-green-800 dark:text-green-200 text-sm">
                  {privacyTranslations?.correctionText || "Request correction of inaccurate or incomplete personal data."}
                </p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h3 className="font-medium text-purple-900 dark:text-purple-300 mb-2">
                  {privacyTranslations?.deletion || "Deletion"}
                </h3>
                <p className="text-purple-800 dark:text-purple-200 text-sm">
                  {privacyTranslations?.deletionText || "Request deletion of your personal data in certain circumstances."}
                </p>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <h3 className="font-medium text-orange-900 dark:text-orange-300 mb-2">
                  {privacyTranslations?.portability || "Portability"}
                </h3>
                <p className="text-orange-800 dark:text-orange-200 text-sm">
                  {privacyTranslations?.portabilityText || "Request a copy of your data in a portable format."}
                </p>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Heart className="h-6 w-6 mr-3 text-red-600 dark:text-red-400" />
              {privacyTranslations?.contactUs || "Contact Us"}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {privacyTranslations?.contactText || "If you have any questions about this Privacy Policy or our data practices, please contact us:"}
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <p><strong>{privacyTranslations?.email || "Email"}:</strong> q9425916@gmail.com</p>
              <p><strong>{privacyTranslations?.phone || "Phone"}:</strong> +023 6287 2229</p>
              <p><strong>{privacyTranslations?.workingHours || "Working Hours"}:</strong> {privacyTranslations?.workingHoursText || "Weekdays 9:00-18:00"}</p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {privacyTranslations?.footerText || "This Privacy Policy is effective as of the date listed above and may be updated periodically."}
          </p>
        </div>
      </div>
    </div>
  );
} 
