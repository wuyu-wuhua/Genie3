export interface PrivacyTranslations {
  title: string;
  subtitle: string;
  lastUpdated: string;
  updateDate: string;
  backToHome: string;
  introduction: string;
  introductionText: string;
  informationWeCollect: string;
  accountInformation: string;
  accountInformationText: string;
  usageData: string;
  usageDataText: string;
  technicalData: string;
  technicalDataText: string;
  howWeUse: string;
  serviceProvision: string;
  serviceProvisionText: string;
  communication: string;
  communicationText: string;
  analytics: string;
  analyticsText: string;
  security: string;
  securityText: string;
  dataSharing: string;
  dataSharingText: string;
  serviceProviders: string;
  serviceProvidersText: string;
  legalRequirements: string;
  legalRequirementsText: string;
  businessTransfers: string;
  businessTransfersText: string;
  dataSecurity: string;
  dataSecurityText: string;
  encryption: string;
  encryptionText: string;
  accessControl: string;
  accessControlText: string;
  regularAudits: string;
  regularAuditsText: string;
  monitoring: string;
  monitoringText: string;
  yourRights: string;
  yourRightsText: string;
  accessData: string;
  accessDataText: string;
  updateData: string;
  updateDataText: string;
  deleteData: string;
  deleteDataText: string;
  optOut: string;
  optOutText: string;
  cookies: string;
  cookiesText: string;
  essentialCookies: string;
  essentialCookiesText: string;
  analyticsCookies: string;
  analyticsCookiesText: string;
  preferenceCookies: string;
  preferenceCookiesText: string;
  childrenPrivacy: string;
  childrenPrivacyText: string;
  internationalTransfers: string;
  internationalTransfersText: string;
  changesToPolicy: string;
  changesToPolicyText: string;
  contactUs: string;
  contactUsText: string;
  email: string;
  emailAddress: string;
  address: string;
  physicalAddress: string;
  workingHours: string;
  workingHoursText: string;
  dataProtection: string;
  access: string;
  accessText: string;
  correction: string;
  correctionText: string;
  deletion: string;
  deletionText: string;
  portability: string;
  portabilityText: string;
  contactText: string;
  footerText: string;
}

export interface TermsTranslations {
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: Array<{
    title: string;
    content: string;
  }>;
  contact: string;
  backButton: string;
  getInTouch: string;
}

export interface PricingTranslations {
  title: string;
  subtitle: string;
  pageTitle: string;
  pageSubtitle: string;
  currentUser: string;
  monthly: string;
  annual: string;
  save: string;
  popular: string;
  recommended: string;
  perfectForBeginners: string;
  mostPopularChoice: string;
  bestValueForCreators: string;
  forPowerUsers: string;
  creditsPerMonth: string;
  creditsPerYear: string;
  perMonth: string;
  perYear: string;
  perMonthText: string;
  billedAnnually: string;
  basicWorldGeneration: string;
  standardSupport: string;
  exportInCommonFormats: string;
  advancedWorldGeneration: string;
  prioritySupport: string;
  allExportFormats: string;
  customTextures: string;
  allWorldGenerationFeatures: string;
  premiumSupport: string;
  unlimitedExports: string;
  customAssetsLibrary: string;
  monthsFree: string;
  allPremiumFeatures: string;
  prioritySupport247: string;
  unlimitedEverything: string;
  exclusiveAssets: string;
  apiAccess: string;
  startFreeTrial: string;
  choosePlan: string;
  contactSales: string;
  // Plan names
  basicPlan: string;
  proPlan: string;
  // Feature descriptions
  aiWorldGeneration: string;
  basicTerrainTextures: string;
  oneClickGeneration: string;
  standardResolution: string;
  basicSceneEditing: string;
  advancedTerrainTextures: string;
  complexWorldGeneration: string;
  highResolution4K: string;
  advancedSceneEditing: string;
  // Button text
  subscribe: string;
  processing: string;
  // Billing cycles
  monthlyBilling: string;
  yearlyBilling: string;
}

// 主要的翻译接口
export interface Translations {
  nav: {
    home: string;
    generator: string;
    cases: string;
    pricing: string;
    about: string;
  };
  features: {
    title: string;
    subtitle: string;
    features: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
    cta: {
      title: string;
      description: string;
      button: string;
    };
  };
  userReviews: {
    title: string;
    subtitle: string;
    reviews: Array<{
      name: string;
      username: string;
      body: string;
      img: string;
    }>;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: {
      primary: string;
      secondary: string;
    };
    badge: string;
    demo: string;
    stats: {
      worlds: string;
      templates: string;
      satisfaction: string;
    };
    preview: {
      title: string;
      features: Array<{
        title: string;
        description: string;
      }>;
      example: {
        label: string;
        text: string;
      };
      generating: string;
    };
  };
  home: {
    features: {
      title: string;
      subtitle: string;
      features: Array<{
        title: string;
        description: string;
      }>;
    };
    examples: {
      title: string;
      subtitle: string;
      examples: string[];
      cta: string;
    };
    faq: {
      title: string;
      subtitle: string;
      faqs: Array<{
        question: string;
        answer: string;
      }>;
      contact: string;
    };
    cta: {
      title: string;
      subtitle: string;
      primary: string;
      secondary: string;
    };
  };
  cases: {
    title: string;
    subtitle: string;
    backToHome: string;
    filterByCategory: string;
    allCategories: string;
    mountain: string;
    ocean: string;
    desert: string;
    rollercoaster: string;
    complex: string;
    detail: string;
    speed: string;
    variation: string;
    template: string;
    advanced: string;
    clickToPlay: string;
    play: string;
    pause: string;
    mute: string;
    unmute: string;
    downloadVideo: string;
    readyToCreate: string;
    joinCreators: string;
    startCreating: string;
    featuredCreations: string;
    exploreAmazing3DWorlds: string;
    autoPlay: string;
    viewAllCases: string;
    desertEnvironmentGeneration: string;
    desertEnvironmentDescription: string;
    terrainDetailDisplay: string;
    terrainDetailDescription: string;
    fastTerrainGeneration: string;
    fastTerrainDescription: string;
    terrainVariationDemo: string;
    terrainVariationDescription: string;
    environmentTemplateDisplay: string;
    environmentTemplateDescription: string;
    advancedTerrainGeneration: string;
    advancedTerrainDescription: string;
    rollercoasterScene2: string;
    rollercoasterScene2Description: string;
    rollercoasterScene3: string;
    rollercoasterScene3Description: string;
    oceanEnvironment1: string;
    oceanEnvironment1Description: string;
    oceanEnvironmentGeneration: string;
    oceanEnvironmentDescription: string;
    oceanEnvironment4: string;
    oceanEnvironment4Description: string;
    oceanEnvironment5: string;
    oceanEnvironment5Description: string;
    oceanEnvironment6: string;
    oceanEnvironment6Description: string;
  };
  pricing: PricingTranslations;
  profile: {
    pleaseLogin: string;
    goToLogin: string;
    user: string;
    activeUser: string;
    premium: string;
    worldsCreated: string;
    totalLikes: string;
    downloads: string;
    templates: string;
    recentActivity: string;
    createdWorld: string;
    mountainLandscape: string;
    hoursAgo: string;
    receivedLike: string;
    oceanScene: string;
    downloadedTemplate: string;
    forestTemplate: string;
    dayAgo: string;
    accountSettings: string;
    manageAccount: string;
    editProfile: string;
    privacySettings: string;
    notificationSettings: string;
    title: string;
    subtitle: string;
    pleaseLoginFirst: string;
    loginToViewProfile: string;
    userInfo: string;
    creditBalance: string;
    currentAvailableCredits: string;
    totalEarnedCredits: string;
    usedCredits: string;
    accountInfo: string;
    userID: string;
    emailAddress: string;
    registrationTime: string;
    unknown: string;
    quickActions: string;
    syncData: string;
    syncing: string;
    memberStatus: string;
    premiumMember: string;
    freeUser: string;
    premiumMemberDescription: string;
    upgradeToPremium: string;
    manageSubscription: string;
    upgradeMembership: string;
    signOut: string;
    syncFailed: string;
  };
  worldGenerator: {
    title: string;
    placeholder: string;
    generating: string;
    generateWorld: string;
    inspiration: string;
    terrainType: string;
    texture: string;
    examples: string[];
    preview: string;
    controls: {
      drag: string;
      zoom: string;
      reset: string;
      share: string;
    };
    terrainTypes: {
      mountain: string;
      desert: string;
      ocean: string;
      forest: string;
      valley: string;
      island: string;
      plateau: string;
      canyon: string;
      hills: string;
      plains: string;
      volcanic: string;
      arctic: string;
      tropical: string;
      badlands: string;
      mesa: string;
    };
    textures: {
      grass: string;
      sand: string;
      rock: string;
      snow: string;
      water: string;
      stone: string;
    };
    lighting: string;
    ambientLight: string;
    directionalLight: string;
    lightPosition: string;
    lightIntensity: string;
    terrainParams: string;
    resolution: string;
    terrainSize: string;
    noiseParams: string;
    octaves: string;
    frequency: string;
    amplitude: string;
    materialBlend: string;
    grassBlend: string;
    rockBlend: string;
    snowBlend: string;
    basicWorldParameters: string;
    modelColorThemes: string;
    modelColor: string;
    brown: string;
    green: string;
    blue: string;
    describeWorld: string;
    describeWorldPlaceholder: string;
    describeWorldInstruction: string;
    inspirationExamples: string;
    selectInspiration: string;
    preview3D: string;
    controlHints: string;
    downloadModel: string;
    loginToDownload: string;
    pleaseGenerateFirst: string;
    modelDownloadSuccess: string;
    exportFailed: string;
    shareFeatureComingSoon: string;
    downloadFeatureNotAvailable: string;
    downloadFailed: string;
    advancedWorldParameters: string;
    worldDescription: string;
    downloadGLB: string;
    updateFailed: string;
    shareComingSoon: string;
  };
  technology: {
    title: string;
    subtitle: string;
    genie3AdvancedAI: string;
    genie3AdvancedAIDescription: string;
    genie3RealTimeRendering: string;
    genie3RealTimeRenderingDescription: string;
    genie3ProceduralGeneration: string;
    genie3ProceduralGenerationDescription: string;
    genie3CrossPlatformSupport: string;
    genie3CrossPlatformSupportDescription: string;
  };
  timeline: {
    title: string;
    subtitle: string;
    currentPhase: string;
    inDevelopment: string;
    planned: string;
    futurePlan: string;
    genie3ProofOfConcept: string;
    genie3ProofOfConceptDescription: string;
    genie3FeatureExpansion: string;
    genie3FeatureExpansionDescription: string;
    genie3InteractionEnhancement: string;
    genie3InteractionEnhancementDescription: string;
    genie3AIOptimization: string;
    genie3AIOptimizationDescription: string;
  };
  auth: {
    processingAuthentication: string;
    authenticationSuccess: string;
    authenticationFailed: string;
    redirectingToHome: string;
    loginToDownload: string;
    continueWithGoogle: string;
    orContinueWithEmail: string;
    email: string;
    enterYourEmail: string;
    password: string;
    enterYourPassword: string;
    signIn: string;
    createAccount: string;
    loading: string;
    pleaseFillInAllFields: string;
    loginFailed: string;
    signUpFailed: string;
    pleaseCheckEmail: string;
  };
  privacy: PrivacyTranslations;
  about: {
    hero: {
      title: string;
      subtitle: string;
    };
    mission: {
      title: string;
      description1: string;
      description2: string;
      stats: {
        worlds: string;
        satisfaction: string;
      };
    };
    technology: {
      title: string;
      subtitle: string;
      genie3AdvancedAI: string;
      genie3AdvancedAIDescription: string;
      genie3RealTimeRendering: string;
      genie3RealTimeRenderingDescription: string;
      genie3ProceduralGeneration: string;
      genie3ProceduralGenerationDescription: string;
      genie3CrossPlatformSupport: string;
      genie3CrossPlatformSupportDescription: string;
    };
    timeline: {
      title: string;
      subtitle: string;
      currentPhase: string;
      inDevelopment: string;
      planned: string;
      futurePlan: string;
      genie3ProofOfConcept: string;
      genie3ProofOfConceptDescription: string;
      genie3FeatureExpansion: string;
      genie3FeatureExpansionDescription: string;
      genie3InteractionEnhancement: string;
      genie3InteractionEnhancementDescription: string;
      genie3AIOptimization: string;
      genie3AIOptimizationDescription: string;
    };
    disclaimer: {
      title: string;
      description: string;
    };
    cta: {
      title: string;
      subtitle: string;
      button: string;
    };
  };
  terms: TermsTranslations;
  survey: {
    title: string;
    subtitle: string;
    progress: string;
    interestScore: string;
    outOf20: string;
    strongInterest: string;
    required: string;
    cancel: string;
    submit: string;
    questions: {
      role: {
        title: string;
        options: string[];
      };
      usecases: {
        title: string;
        options: string[];
      };
      experience: {
        title: string;
        options: string[];
      };
      interest: {
        title: string;
        current: string;
      };
      selling: {
        title: string;
        options: string[];
      };
      concerns: {
        title: string;
        options: string[];
      };
      freq: {
        title: string;
        options: string[];
      };
      price: {
        title: string;
        options: string[];
      };
      fallback: {
        title: string;
        options: string[];
      };
      integration: {
        title: string;
        options: string[];
      };
      env: {
        title: string;
        options: string[];
      };
      latency: {
        title: string;
        options: string[];
      };
      magic: {
        title: string;
        placeholder: string;
      };
      beta: {
        title: string;
        options: string[];
      };
      contact: {
        title: string;
        email: string;
        wechat: string;
        telegram: string;
        consent: string;
        note: string;
      };
      region: {
        title: string;
        regionLabel: string;
        langLabel: string;
        regions: {
          [key: string]: string;
        };
        languages: {
          [key: string]: string;
        };
      };
    };
    messages: {
      fillRequired: string;
      consentRequired: string;
      submitSuccess: string;
      submitFailed: string;
      tryAgainLater: string;
      serverError: string;
    };
  };
  footer: {
    description: string;
    quickLinksTitle: string;
    home: string;
    worldGenerator: string;
    aboutUs: string;
    helpCenterTitle: string;
    termsOfService: string;
    privacyPolicy: string;
    contactUs: string;
    friendsAndPartnersTitle: string;
    allRightsReserved: string;
    terms: string;
    privacy: string;
    pricing: string;
  };
} 