'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/LoginModal';
import SurveyModal from '@/components/SurveyModal';
import { Language, getTranslations } from '@/lib/translations';

// Utility functions - Based on procedural-terrains-main
const createMap = (image: string) => {
  const map = new THREE.TextureLoader().load(image);
  return map;
};

const monkeyPatch = (
  shader: string,
  { defines = "", header = "", main = "", ...replaces }: any
) => {
  let patchedShader = shader;

  const replaceAll = (str: string, find: string, rep: string) => str.split(find).join(rep);
  Object.keys(replaces).forEach((key) => {
    patchedShader = replaceAll(patchedShader, key, replaces[key]);
  });

  patchedShader = patchedShader.replace(
    "void main() {",
    `
    ${header}
    void main() {
      ${main}
    `
  );

  return `
    ${defines}
    ${patchedShader}
  `;
};

const createSky = (renderer: THREE.WebGLRenderer) => {
  const sky = new Sky();
  sky.scale.setScalar(450000);

  const turbidity = 10;
  const rayleigh = 3;
  const mieCoefficient = 0.005;
  const mieDirectionalG = 0.7;
  const elevation = 2;
  const azimuth = 180;
  const exposure = renderer.toneMappingExposure;

  const sun = new THREE.Vector3();
  const uniforms = sky.material.uniforms;
  uniforms["turbidity"].value = turbidity;
  uniforms["rayleigh"].value = rayleigh;
  uniforms["mieCoefficient"].value = mieCoefficient;
  uniforms["mieDirectionalG"].value = mieDirectionalG;

  const phi = THREE.MathUtils.degToRad(90 - elevation);
  const theta = THREE.MathUtils.degToRad(azimuth);

  sun.setFromSphericalCoords(1, phi, theta);

  uniforms["sunPosition"].value.copy(sun);

  renderer.toneMappingExposure = exposure;

  return sky;
};

// Create terrain - Based on procedural-terrains-main
const createTerrain = (time: number, terrainType: string = "default", params?: {
  materialBlend?: {
    grass?: number;
    rock?: number;
    snow?: number;
  };
  modelColor?: string;
  texture?: string;
  noiseParams?: {
    octaves?: number;
    frequency?: number;
    amplitude?: number;
  };
}) => {
  // Use real heightmaps - Select different heightmaps based on terrain type
  const getHeightmapPath = () => {
    const heightmaps = {
      mountain: ['/heightmaps/real2.png', '/heightmaps/real3.png', '/heightmaps/real4.png'],
      desert: ['/heightmaps/real7.png', '/heightmaps/real8.png', '/heightmaps/real9.png'],
      ocean: ['/heightmaps/island.png', '/heightmaps/island2.png', '/heightmaps/river.png'],
      forest: ['/heightmaps/real11.png', '/heightmaps/real12.png', '/heightmaps/real13.png'],
      valley: ['/heightmaps/real15.png', '/heightmaps/real16.png', '/heightmaps/lala.png'],
      island: ['/heightmaps/island.png', '/heightmaps/island2.png', '/heightmaps/real18.png'],
      plateau: ['/heightmaps/real5.png', '/heightmaps/real6.png', '/heightmaps/real20.png'],
      canyon: ['/heightmaps/real10.png', '/heightmaps/real14.png', '/heightmaps/real21.png'],
      hills: ['/heightmaps/real17.png', '/heightmaps/real19.png', '/heightmaps/real22.png'],
      plains: ['/heightmaps/real23.png', '/heightmaps/lala.png', '/heightmaps/river.png'],
      volcanic: ['/heightmaps/real4.png', '/heightmaps/real6.png', '/heightmaps/real8.png'],
      arctic: ['/heightmaps/real9.png', '/heightmaps/real11.png', '/heightmaps/real13.png'],
      tropical: ['/heightmaps/island.png', '/heightmaps/real12.png', '/heightmaps/real16.png'],
      badlands: ['/heightmaps/real7.png', '/heightmaps/real10.png', '/heightmaps/real15.png'],
      mesa: ['/heightmaps/real20.png', '/heightmaps/real21.png', '/heightmaps/real22.png']
    };

    const typeHeightmaps = heightmaps[terrainType as keyof typeof heightmaps] || heightmaps.mountain;
    const randomIndex = Math.floor(Math.random() * typeHeightmaps.length);
    return typeHeightmaps[randomIndex];
  };

  const heightMap = new THREE.TextureLoader().load(getHeightmapPath());

  // 根据选择的纹理加载对应的纹理图片
  const getTextureMap = () => {
    const texturePaths = {
      grass: '/textures/grass.jpg',
      sand: '/textures/sand.jpg', 
      rock: '/textures/rock.png',
      snow: '/textures/snow.jpg',
      water: '/textures/water1.jpg',
      stone: '/textures/stone.jpg'
    };
    const selectedPath = texturePaths[params?.texture as keyof typeof texturePaths] || texturePaths.grass;
    return new THREE.TextureLoader().load(selectedPath);
  };

  const textureMap = getTextureMap();
  textureMap.wrapS = textureMap.wrapT = THREE.RepeatWrapping;
  textureMap.repeat.set(4, 4); // 重复纹理以获得更好的效果

  const terrainUniforms = {
    u_time: {
      value: time,
    },
    u_heightmap: {
      value: heightMap,
    },
    u_textureMap: {
      value: textureMap,
    },
    u_grassBlend: {
      value: params?.materialBlend?.grass || 0.6,
    },
    u_rockBlend: {
      value: params?.materialBlend?.rock || 0.3,
    },
    u_snowBlend: {
      value: params?.materialBlend?.snow || 0.1,
    },
    ...THREE.ShaderLib.physical.uniforms,
  };

  const SIZE = 4;
  const RESOLUTION = 500;

  const material = new THREE.ShaderMaterial({
    lights: true,
    defines: {
      STANDARD: "",
      PHYSICAL: "",
    },
    uniforms: terrainUniforms,
    vertexShader: monkeyPatch(THREE.ShaderChunk.meshphysical_vert, {
      header: `
        uniform sampler2D u_heightmap;
        varying vec2 vUv;
        
        // the function which defines the displacement
        float displace(vec2 point) {
          vec3 heightData = texture2D(u_heightmap, vec2(point.x, point.y)).rgb;
          return 0.5 * (heightData.x + heightData.y + heightData.z);
        }
      `,
      main: `
        vUv = uv;
        vec3 displacedPosition = position + normal * displace(uv);
        
        //https://github.com/mrdoob/three.js/blob/c10eb1e1b3a71ee70ccbb21aad589499d92f09f4/examples/jsm/shaders/OceanShaders.js#L292-L308
        float texel = 1.0 / 1000.0;
        float texelSize = 4.0 / 1000.0;

        vec3 center = texture2D(u_heightmap, uv).rgb;
        vec3 right = vec3(texelSize, 0.0, 0.0) + texture2D(u_heightmap, uv + vec2(texel, 0.0)).rgb - center;
        vec3 left = vec3(-texelSize, 0.0, 0.0) + texture2D(u_heightmap, uv + vec2(-texel, 0.0)).rgb - center;
        vec3 top = vec3(0.0, 0.0, -texelSize) + texture2D(u_heightmap, uv + vec2(0.0, -texel)).rgb - center;
        vec3 bottom = vec3(0.0, 0.0, texelSize) + texture2D(u_heightmap, uv + vec2(0.0, texel)).rgb - center;

        vec3 topRight = cross(right, top);
        vec3 topLeft = cross(top, left);
        vec3 bottomLeft = cross(left, bottom);
        vec3 bottomRight = cross(bottom, right);

        vec3 displacedNormal = normalize(topRight + topLeft + bottomLeft + bottomRight);
      `,

      "#include <defaultnormal_vertex>":
        THREE.ShaderChunk.defaultnormal_vertex.replace(
          // transformedNormal will be used in the lighting calculations
          "vec3 transformedNormal = objectNormal;",
          `vec3 transformedNormal = displacedNormal;`
        ),

      // transformed is the output position
      "#include <displacementmap_vertex>": `
        transformed = displacedPosition;
      `,
    }),
    fragmentShader: monkeyPatch(THREE.ShaderChunk.meshphysical_frag, {
      header: `
        uniform sampler2D u_heightmap;
        uniform sampler2D u_textureMap;
        uniform float u_grassBlend;
        uniform float u_rockBlend;
        uniform float u_snowBlend;
        varying vec2 vUv;
      `,
      main: `
        // 采样纹理和高度图
        vec3 textureColor = texture2D(u_textureMap, vUv * 4.0).rgb;
        vec3 heightData = texture2D(u_heightmap, vUv).rgb;
        float height = (heightData.r + heightData.g + heightData.b) / 3.0;
        
        // 计算材质权重
        float grassWeight = u_grassBlend * (1.0 - smoothstep(0.3, 0.7, height));
        float rockWeight = u_rockBlend * smoothstep(0.2, 0.8, height) * (1.0 - smoothstep(0.7, 0.9, height));
        float snowWeight = u_snowBlend * smoothstep(0.6, 1.0, height);
        
        // 基础材质颜色
        vec3 grassColor = vec3(0.3, 0.6, 0.2);
        vec3 rockColor = vec3(0.5, 0.4, 0.3);
        vec3 snowColor = vec3(0.9, 0.95, 1.0);
        
        // 混合材质颜色和纹理
        vec3 blendedColor = grassColor * grassWeight + rockColor * rockWeight + snowColor * snowWeight;
        vec3 finalColor = mix(textureColor, blendedColor, 0.4); // 纹理与材质混合
        finalColor = mix(diffuse.rgb, finalColor, 0.7); // 与基础颜色混合
      `,
      "vec4 diffuseColor = vec4( diffuse, opacity );": `
        vec4 diffuseColor = vec4( finalColor, opacity );
      `
    }),
  });

  const geometry = new THREE.PlaneGeometry(SIZE, SIZE, RESOLUTION, RESOLUTION);
  const plane = new THREE.Mesh(geometry, material);
  
  // 设置材质颜色 - 使用标准Three.js颜色属性
  if (params?.modelColor) {
    material.uniforms.diffuse.value = new THREE.Color(parseInt(params.modelColor.replace('#', '0x')));
  }
  
  return plane;
};

export default function WorldGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    terrain: THREE.Mesh | null;
    clock: THREE.Clock;
  } | null>(null);

  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [description, setDescription] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [selectedTerrainType, setSelectedTerrainType] = useState('mountain');
  const [selectedTexture, setSelectedTexture] = useState('grass');
  
  // Model color settings
  const [modelColor, setModelColor] = useState('#8B4513');

  // Read language settings from local storage on initialization
  useEffect(() => {
    const savedLanguage = localStorage.getItem('genie3-language') as Language;
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Listen for language changes from other components
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      setCurrentLanguage(event.detail.language);
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, []);

  // Real-time terrain update - Separate color update and terrain reconstruction
  useEffect(() => {
    if (sceneRef.current) {
      updateTerrain();
    }
  }, [selectedTerrainType, selectedTexture]);

  // Handle model color updates separately to avoid rebuilding the entire terrain
  useEffect(() => {
    if (sceneRef.current && sceneRef.current.terrain) {
      const material = sceneRef.current.terrain.material as THREE.ShaderMaterial;
      if (material.uniforms && material.uniforms.diffuse) {
        material.uniforms.diffuse.value = new THREE.Color(parseInt(modelColor.replace('#', '0x')));
      }
    }
  }, [modelColor]);



  // Get translations using the unified system
  const translations = getTranslations(currentLanguage);
  
  // Debug logging
  
  
  // Define the type for our translations
  type WorldGeneratorTranslations = {
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
  
  // Safe fallback for currentLang with additional safety checks
  let currentLang: WorldGeneratorTranslations;
  if (translations && translations.worldGenerator && Array.isArray((translations.worldGenerator as any).examples)) {
    currentLang = translations.worldGenerator as WorldGeneratorTranslations;

  } else {
    
    // 根据当前语言选择相应的fallback翻译
    if (currentLanguage === 'ja') {
      currentLang = {
        title: "あなたが望む世界を説明してください",
        placeholder: "例：雪山、森、湖のある美しい谷を作成する...",
        generating: "生成中...",
        generateWorld: "世界を生成",
        inspiration: "インスピレーション例",
        terrainType: "地形タイプ",
        texture: "マテリアルテクスチャ",
        examples: [
          "川が流れる豊かな谷、遠くに城",
          "高層ビルとネオンライトのある未来のテックシティ",
          "海辺の白い家々のある平和な海岸都市",
          "古いオークと妖精の輪のある神秘的な森の奥",
          "ヤシの木と澄んだ湖水のある砂漠のオアシス"
        ],
        preview: "3Dプレビュー",
        controls: {
          drag: "ドラッグしてビューを回転",
          zoom: "スクロールしてズーム",
          reset: "ビューをリセット",
          share: "世界を共有"
        },
        terrainTypes: {
          mountain: "山",
          desert: "砂漠",
          ocean: "海",
          forest: "森",
          valley: "谷",
          island: "島",
          plateau: "高原",
          canyon: "峡谷",
          hills: "丘",
          plains: "平原",
          volcanic: "火山",
          arctic: "北極",
          tropical: "熱帯",
          badlands: "荒地",
          mesa: "メサ"
        },
        textures: {
          grass: "草",
          sand: "砂",
          rock: "岩",
          snow: "雪",
          water: "水",
          stone: "石"
        },
        lighting: "照明設定",
        ambientLight: "環境光",
        directionalLight: "指向性光",
        lightPosition: "光源位置",
        lightIntensity: "光の強度",
        terrainParams: "地形パラメータ",
        resolution: "解像度",
        terrainSize: "地形サイズ",
        noiseParams: "ノイズパラメータ",
        octaves: "オクターブ",
        frequency: "周波数",
        amplitude: "振幅",
        materialBlend: "マテリアルブレンド",
        grassBlend: "草ブレンド",
        rockBlend: "岩ブレンド",
        snowBlend: "雪ブレンド",
        basicWorldParameters: "基本世界パラメータ",
        modelColorThemes: "モデルカラーテーマ",
        modelColor: "モデルカラー",
        brown: "茶色",
        green: "緑",
        blue: "青",
        describeWorld: "あなたが望む世界を説明してください",
        describeWorldPlaceholder: "例：川と森のある平和な谷...",
        describeWorldInstruction: "地形、建物、植生などの要素を含め、できるだけ詳細に望むシーンを説明してください。",
        inspirationExamples: "インスピレーション例",
        selectInspiration: "インスピレーション例を選択",
        preview3D: "3Dプレビュー",
        controlHints: "操作ヒント",
        downloadModel: "モデルをダウンロード",
        loginToDownload: "ダウンロードするにはログイン",
        pleaseGenerateFirst: "まず世界を生成してください！",
        modelDownloadSuccess: "モデルのダウンロードが完了しました！",
        exportFailed: "エクスポートに失敗しました。もう一度お試しください。",
        shareFeatureComingSoon: "共有機能がまもなく登場します！",
        downloadFeatureNotAvailable: "ダウンロード機能はまだ利用できません。",
        downloadFailed: "ダウンロードに失敗しました。もう一度お試しください。",
        advancedWorldParameters: "高度な世界パラメータ",
        worldDescription: "世界の説明",
        downloadGLB: "GLBモデルをダウンロード",
        updateFailed: "更新に失敗しました",
        shareComingSoon: "共有機能がまもなく登場します"
      };
    } else if (currentLanguage === 'zh') {
      currentLang = {
        title: "描述你想要的世界",
        placeholder: "例如：创建一个有雪山、森林和湖泊的美丽山谷...",
        generating: "生成中...",
        generateWorld: "生成世界",
        inspiration: "灵感示例",
        terrainType: "地形类型",
        texture: "材质纹理",
        examples: [
          "有河流流过的富饶山谷，远处有城堡",
          "有高耸建筑和霓虹灯的未来科技城市",
          "海边有白色房屋的宁静沿海小镇",
          "有古老橡树和仙女环的神秘森林深处",
          "有棕榈树和清澈湖水的沙漠绿洲"
        ],
        preview: "3D预览",
        controls: {
          drag: "拖拽旋转视角",
          zoom: "滚轮缩放",
          reset: "重置视角",
          share: "分享世界"
        },
        terrainTypes: {
          mountain: "山脉",
          desert: "沙漠",
          ocean: "海洋",
          forest: "森林",
          valley: "山谷",
          island: "岛屿",
          plateau: "高原",
          canyon: "峡谷",
          hills: "丘陵",
          plains: "平原",
          volcanic: "火山",
          arctic: "北极",
          tropical: "热带",
          badlands: "荒地",
          mesa: "台地"
        },
        textures: {
          grass: "草地",
          sand: "沙漠",
          rock: "岩石",
          snow: "雪地",
          water: "水域",
          stone: "石头"
        },
        lighting: "光照设置",
        ambientLight: "环境光",
        directionalLight: "方向光",
        lightPosition: "光源位置",
        lightIntensity: "光照强度",
        terrainParams: "地形参数",
        resolution: "分辨率",
        terrainSize: "地形大小",
        noiseParams: "噪声参数",
        octaves: "八度音",
        frequency: "频率",
        amplitude: "振幅",
        materialBlend: "材质混合",
        grassBlend: "草地混合",
        rockBlend: "岩石混合",
        snowBlend: "雪地混合",
        basicWorldParameters: "基本世界参数",
        modelColorThemes: "模型颜色主题",
        modelColor: "模型颜色",
        brown: "棕色",
        green: "绿色",
        blue: "蓝色",
        describeWorld: "描述你想要的世界",
        describeWorldPlaceholder: "例如：有河流和森林的宁静山谷...",
        describeWorldInstruction: "尽可能详细地描述你想要的场景，包括地形、建筑和植被等元素。",
        inspirationExamples: "灵感示例",
        selectInspiration: "选择灵感示例",
        preview3D: "3D预览",
        controlHints: "操作提示",
        downloadModel: "下载模型",
        loginToDownload: "登录下载",
        pleaseGenerateFirst: "请先生成世界！",
        modelDownloadSuccess: "模型下载成功！",
        exportFailed: "导出失败，请重试。",
        shareFeatureComingSoon: "分享功能即将推出！",
        downloadFeatureNotAvailable: "下载功能尚未可用。",
        downloadFailed: "下载失败，请重试。",
        advancedWorldParameters: "高级世界参数",
        worldDescription: "世界描述",
        downloadGLB: "下载GLB模型",
        updateFailed: "更新失败",
        shareComingSoon: "分享功能即将推出"
      };
    } else {
      // 默认英文fallback
      currentLang = {
        title: "Describe the world you want",
        placeholder: "e.g., A peaceful valley with rivers and forests...",
        generating: "Generating...",
        generateWorld: "Generate World",
        inspiration: "Inspiration Examples",
        terrainType: "Terrain Type",
        texture: "Material Texture",
        examples: [
          "A lush valley with a river flowing through, castle in the distance",
          "Futuristic tech city with towering buildings and neon lights",
          "Peaceful coastal town with white houses by the sea",
          "Mysterious forest depths with ancient oaks and fairy rings",
          "Desert oasis with palm trees and clear lake water"
        ],
        preview: "3D Preview",
        controls: {
          drag: "Drag to rotate view",
          zoom: "Scroll to zoom",
          reset: "Reset View",
          share: "Share World"
        },
        terrainTypes: {
          mountain: "Mountain",
          desert: "Desert",
          ocean: "Ocean",
          forest: "Forest",
          valley: "Valley",
          island: "Island",
          plateau: "Plateau",
          canyon: "Canyon",
          hills: "Hills",
          plains: "Plains",
          volcanic: "Volcanic",
          arctic: "Arctic",
          tropical: "Tropical",
          badlands: "Badlands",
          mesa: "Mesa"
        },
        textures: {
          grass: "Grass",
          sand: "Sand",
          rock: "Rock",
          snow: "Snow",
          water: "Water",
          stone: "Stone"
        },
        lighting: "Lighting Settings",
        ambientLight: "Ambient Light",
        directionalLight: "Directional Light",
        lightPosition: "Light Position",
        lightIntensity: "Light Intensity",
        terrainParams: "Terrain Parameters",
        resolution: "Resolution",
        terrainSize: "Terrain Size",
        noiseParams: "Noise Parameters",
        octaves: "Octaves",
        frequency: "Frequency",
        amplitude: "Amplitude",
        materialBlend: "Material Blend",
        grassBlend: "Grass Blend",
        rockBlend: "Rock Blend",
        snowBlend: "Snow Blend",
        basicWorldParameters: "Basic World Parameters",
        modelColorThemes: "Model Color Themes",
        modelColor: "Model Color",
        brown: "Brown",
        green: "Green",
        blue: "Blue",
        describeWorld: "Describe the world you want",
        describeWorldPlaceholder: "e.g., A peaceful valley with rivers and forests...",
        describeWorldInstruction: "Describe the scene you want in as much detail as possible, including elements such as terrain, buildings, and vegetation.",
        inspirationExamples: "Inspiration Examples",
        selectInspiration: "Select Inspiration Example",
        preview3D: "3D Preview",
        controlHints: "Control Hints",
        downloadModel: "Download Model",
        loginToDownload: "Login to Download",
        pleaseGenerateFirst: "Please generate a world first!",
        modelDownloadSuccess: "Model downloaded successfully!",
        exportFailed: "Export failed. Please try again.",
        shareFeatureComingSoon: "Share feature coming soon!",
        downloadFeatureNotAvailable: "Download feature not available yet.",
        downloadFailed: "Download failed. Please try again.",
        advancedWorldParameters: "Advanced World Parameters",
        worldDescription: "World Description",
        downloadGLB: "Download GLB Model",
        updateFailed: "Update Failed",
        shareComingSoon: "Share feature coming soon"
      };
    }
  }

  // Additional safety check - ensure examples array exists
  if (!currentLang.examples || !Array.isArray(currentLang.examples)) {
    
    currentLang.examples = [
      "A lush valley with a river flowing through, castle in the distance",
      "Futuristic tech city with towering buildings and neon lights",
      "Peaceful coastal town with white houses by the sea",
      "Mysterious forest depths with ancient oaks and fairy rings",
      "Desert oasis with palm trees and clear lake water"
    ];
  }

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera - Based on procedural-terrains-main
    const camera = new THREE.PerspectiveCamera(
      35,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 5, 5);

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      antialias: true 
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Adjust renderer settings - Maintain original style but moderately increase brightness
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2; // Moderately increase exposure
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Create OrbitControls - Based on procedural-terrains-main
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 2;
    controls.maxDistance = 15;
    controls.maxPolarAngle = Math.PI;
    controls.target.set(0, 0, 0); // Ensure controller target is at center

    // Create terrain
    const terrain = createTerrain(0);
    terrain.rotation.x = -Math.PI / 2;
    terrain.position.set(0, 0, 0); // Ensure terrain is at center
    scene.add(terrain);

    // Create sky
    const sky = createSky(renderer);
    scene.add(sky);

    // Add light sources - Based on procedural-terrains-main original settings
    const ambientLight = new THREE.AmbientLight(0x3c2515, 1.0); // Original warm-toned ambient light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x87532c, 2.0); // Original warm-toned directional light
    directionalLight.position.set(0.1, 2, 0.1);
    directionalLight.target = terrain;
    scene.add(directionalLight);

    // Add subtle fill light to improve visibility while maintaining original style
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(-1, 1, -1);
    fillLight.target = terrain;
    scene.add(fillLight);

    // Set sceneRef
    const clock = new THREE.Clock();
    sceneRef.current = { scene, camera, renderer, controls, terrain, clock };

    // Animation loop - Based on procedural-terrains-main
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      // Update controls
      controls.update(clock.getDelta());
      
      // Render scene
      renderer.render(scene, camera);
    };

    // Window resize handling
    const handleResize = () => {
      if (!canvasRef.current) return;
      
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
    animate();

    // 清理函数
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      renderer.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const updateTerrain = () => {
    if (!sceneRef.current) return;
    
    try {
  
      
      // 移除旧地形
      if (sceneRef.current.terrain) {
        sceneRef.current.scene.remove(sceneRef.current.terrain);
      }
      
      // 创建新地形
      const newTerrain = createTerrain(
        sceneRef.current.clock.getElapsedTime(), 
        selectedTerrainType,
        {
          modelColor: modelColor,
          texture: selectedTexture
        }
      );
      newTerrain.rotation.x = -Math.PI / 2;
      newTerrain.position.set(0, 0, 0); // 确保新地形也在中心
      sceneRef.current.scene.add(newTerrain);
      sceneRef.current.terrain = newTerrain;
      
    } catch (error) {
        
    }
  };

  const resetScene = () => {
    if (!sceneRef.current) return;
    
    // 重置相机位置
    sceneRef.current.camera.position.set(0, 5, 5);
    sceneRef.current.controls.target.set(0, 0, 0);
    sceneRef.current.controls.reset();
  };

  const shareWorld = () => {
    // Share feature implementation
    alert(currentLang.shareFeatureComingSoon);
  };

  const downloadModel = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (!sceneRef.current || !sceneRef.current.terrain) {
      alert(currentLang.pleaseGenerateFirst);
      return;
    }

    try {
      // Dynamically import GLTF exporter
      import('three/examples/jsm/exporters/GLTFExporter.js').then(({ GLTFExporter }) => {
        const exporter = new GLTFExporter();
        
        const scene = new THREE.Scene();
        scene.add(sceneRef.current!.terrain!.clone());
        
        const options = {
          binary: true,
          includeCustomExtensions: true
        };

        exporter.parse(scene, (gltf: any) => {
          const blob = new Blob([gltf], { type: 'application/octet-stream' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `genie3-world-${Date.now()}.glb`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          
          alert(currentLang.modelDownloadSuccess);
        }, (error: any) => {
    
          alert(currentLang.exportFailed);
        }, options);
      }).catch((error) => {
  
        alert(currentLang.downloadFeatureNotAvailable);
      });
    } catch (error) {

              alert(currentLang.downloadFailed);
    }
  };

  return (
    <div className="min-h-screen bg-gray-25 dark:bg-gray-900">
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => {
          setShowLoginModal(false);
          downloadModel();
        }}
      />
      <SurveyModal
        isOpen={showSurveyModal}
        onClose={() => setShowSurveyModal(false)}
        currentLanguage={currentLanguage}
      />
      <div className="container mx-auto px-2 py-8 max-w-screen-2xl">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-2">
          {/* Left Control Panel - Basic Parameters and Description */}
          <div className="xl:col-span-4 space-y-3">
            {/* Basic World Parameters Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 border border-gray-100 dark:border-gray-700">
                              <h3 className="text-lg font-semibold mb-2 flex items-center text-gray-900 dark:text-white">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  🌍 {currentLang.basicWorldParameters}
                </h3>

              {/* Terrain Type and Material Texture - Horizontal Layout */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                {/* Terrain Type Dropdown Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{currentLang.terrainType}</label>
                  <select
                    value={selectedTerrainType}
                    onChange={(e) => setSelectedTerrainType(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {Object.entries(currentLang.terrainTypes).map(([key, value]) => {
                      const icons = {
                        mountain: "🏔️",
                        desert: "🏜️",
                        ocean: "🌊",
                        forest: "🌲",
                        valley: "🏞️",
                        island: "🏝️",
                        plateau: "🏔️",
                        canyon: "🏕️",
                        hills: "⛰️",
                        plains: "🌾",
                        volcanic: "🌋",
                        arctic: "🧊",
                        tropical: "🌴",
                        badlands: "🏜️",
                        mesa: "🪨"
                      };
                      return (
                        <option key={key} value={key}>
                          {icons[key as keyof typeof icons]} {value}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Material Texture Dropdown Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{currentLang.texture}</label>
                  <select
                    value={selectedTexture}
                    onChange={(e) => setSelectedTexture(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {Object.entries(currentLang.textures).map(([key, value]) => {
                      const icons = {
                        grass: "🌱",
                        sand: "🏖️",
                        rock: "🪨",
                        snow: "❄️",
                        water: "💧",
                        stone: "🪨"
                      };
                      return (
                        <option key={key} value={key}>
                          {icons[key as keyof typeof icons]} {value}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Model Color Themes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{currentLang.modelColorThemes}</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setModelColor('#8B4513')}
                      className="px-3 py-2 text-xs bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900 transition-colors border border-amber-300 dark:border-amber-600"
                    >
                      {currentLang.brown}
                    </button>
                    <button
                      onClick={() => setModelColor('#228B22')}
                      className="px-3 py-2 text-xs bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 rounded-lg hover:bg-green-200 dark:hover:bg-green-900 transition-colors border border-green-300 dark:border-green-600"
                    >
                      {currentLang.green}
                    </button>
                    <button
                      onClick={() => setModelColor('#4682B4')}
                      className="px-3 py-2 text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors border border-blue-300 dark:border-blue-600"
                    >
                      {currentLang.blue}
                    </button>
                  </div>
                </div>

                {/* Model Color Control */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{currentLang.modelColor}</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={modelColor}
                      onChange={(e) => setModelColor(e.target.value)}
                      className="w-12 h-8 rounded border border-gray-300 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{modelColor}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Input */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-2 flex items-center text-gray-900 dark:text-white">
                <span className="text-red-500 mr-2">※</span>
                {currentLang.describeWorld}
              </h2>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={currentLang.describeWorldPlaceholder}
                className="w-full h-32 p-4 border border-gray-200 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <div className="mt-2">
                <button
                  onClick={() => setShowSurveyModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {translations.survey?.title || "调查问卷"}
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  点击按钮参与我们的用户调研，帮助我们改进产品
                </p>
              </div>

              {/* Inspiration Examples - Mobile Dropdown List, Desktop Waterfall Layout */}
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{currentLang.inspirationExamples}</label>
                                  {/* Mobile Dropdown List */}
                <div className="md:hidden">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        setDescription(e.target.value);
                      }
                    }}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">{currentLang.selectInspiration}</option>
                    {currentLang.examples.map((example, index) => (
                      <option key={index} value={example}>
                        {example.length > 50 ? example.substring(0, 50) + '...' : example}
                      </option>
                    ))}
                  </select>
                </div>
                                  {/* Desktop Waterfall Layout */}
                <div className="hidden md:flex flex-wrap gap-2">
                  {currentLang.examples.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setDescription(example)}
                      className={`text-left p-2 text-sm bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors whitespace-nowrap ${
                        index === 0 ? 'w-full' : 
                        index === 1 ? 'w-2/3' : 
                        index === 2 ? 'w-1/2' : 
                        index === 3 ? 'w-3/4' : 
                        'w-full'
                      }`}
                    >
                      {example.length > 40 ? example.substring(0, 40) + '...' : example}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Middle 3D Preview */}
          <div className="xl:col-span-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{currentLang.preview}</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={resetScene}
                    className="bg-gray-600 dark:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                  >
                    {currentLang.controls.reset}
                  </button>
                  <button 
                    onClick={shareWorld}
                    className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                  >
                    {currentLang.controls.share}
                  </button>
                </div>
              </div>
              <div className="relative bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden" style={{ width: '100%', height: '600px' }}>
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full"
                  style={{ display: 'block' }}
                />
                
                {/* Control Hints */}
                <div className="absolute bottom-4 left-4 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 px-3 py-2 rounded-lg shadow-sm z-10">
                  {currentLang.controls.drag}
                </div>
                <div className="absolute bottom-4 left-44 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 px-3 py-2 rounded-lg shadow-sm z-10">
                  {currentLang.controls.zoom}
                </div>

                {/* Bottom Right Download Button */}
                <div className="absolute bottom-4 right-4 z-10">
                  <button
                    onClick={downloadModel}
                    className="bg-green-600 dark:bg-green-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 dark:hover:bg-green-600 transition-colors flex items-center space-x-2 shadow-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>
                      {user 
                        ? currentLang.downloadModel
                        : currentLang.loginToDownload
                      }
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}