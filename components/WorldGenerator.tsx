'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/LoginModal';

// 工具函数 - 基于procedural-terrains-main
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
  const skyGeometry = new THREE.SphereGeometry(450000, 32, 32);
  const skyMaterial = new THREE.MeshBasicMaterial({
    color: 0x87ceeb, // 使用procedural-terrains-main的天空蓝色
    side: THREE.BackSide
  });
  const sky = new THREE.Mesh(skyGeometry, skyMaterial);
  return sky;
};

// 创建地形 - 基于procedural-terrains-main
const createTerrain = (time: number, terrainType: string = "default", params?: {
  materialBlend?: {
    grass?: number;
    rock?: number;
    snow?: number;
  };
  modelColor?: string;
}) => {
  // 创建高度图纹理
  const createHeightmapTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;
    
    // 填充背景
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 1024, 1024);
    
    if (terrainType === "mountain") {
      // 山脉 - 创建真实的山峰
      const gradient = ctx.createRadialGradient(512, 512, 0, 512, 512, 512);
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(0.2, '#dddddd');
      gradient.addColorStop(0.4, '#bbbbbb');
      gradient.addColorStop(0.6, '#999999');
      gradient.addColorStop(0.8, '#666666');
      gradient.addColorStop(1, '#000000');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1024, 1024);
      
      // 添加多个山峰
      for (let i = 0; i < 8; i++) {
        const x = 200 + Math.random() * 624;
        const y = 200 + Math.random() * 624;
        const radius = 100 + Math.random() * 200;
        const gradient2 = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient2.addColorStop(0, '#ffffff');
        gradient2.addColorStop(0.3, '#cccccc');
        gradient2.addColorStop(0.6, '#888888');
        gradient2.addColorStop(1, '#000000');
        ctx.fillStyle = gradient2;
        ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
      }
    } else if (terrainType === "desert") {
      // 沙漠 - 创建沙丘
      for (let y = 0; y < 1024; y += 2) {
        for (let x = 0; x < 1024; x += 2) {
          const noise1 = Math.sin(x * 0.02) * Math.cos(y * 0.02);
          const noise2 = Math.sin(x * 0.04) * Math.cos(y * 0.04) * 0.5;
          const noise = (noise1 + noise2 + 1) * 0.5;
          const value = Math.floor(noise * 200 + 55);
          ctx.fillStyle = `rgb(${value}, ${value}, ${value})`;
          ctx.fillRect(x, y, 2, 2);
        }
      }
    } else if (terrainType === "ocean") {
      // 海洋 - 创建波浪
      for (let y = 0; y < 1024; y += 1) {
        for (let x = 0; x < 1024; x += 1) {
          const wave1 = Math.sin(x * 0.03 + y * 0.02) * 0.4;
          const wave2 = Math.sin(x * 0.02 + y * 0.03) * 0.3;
          const wave3 = Math.sin(x * 0.01 + y * 0.01) * 0.2;
          const noise = (wave1 + wave2 + wave3 + 1) * 0.5;
          const value = Math.floor(noise * 100 + 50);
          ctx.fillStyle = `rgb(${value}, ${value}, ${value + 30})`;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    } else {
      // 默认 - 丘陵地形
      for (let y = 0; y < 1024; y += 4) {
        for (let x = 0; x < 1024; x += 4) {
          const noise1 = Math.sin(x * 0.01) * Math.cos(y * 0.01);
          const noise2 = Math.sin(x * 0.02) * Math.cos(y * 0.02) * 0.5;
          const noise3 = Math.sin(x * 0.005) * Math.cos(y * 0.005) * 0.3;
          const noise = (noise1 + noise2 + noise3 + 1) * 0.5;
          const value = Math.floor(noise * 255);
          ctx.fillStyle = `rgb(${value}, ${value}, ${value})`;
          ctx.fillRect(x, y, 4, 4);
        }
      }
    }
    
    return new THREE.CanvasTexture(canvas);
  };

  const heightMap = createHeightmapTexture();

  const terrainUniforms = {
    u_time: {
      value: time,
    },
    u_heightmap: {
      value: heightMap,
    },
    u_modelColor: {
      value: new THREE.Color(params?.modelColor ? parseInt(params.modelColor.replace('#', '0x')) : 0x8B4513),
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
        
        // 位移函数
        float displace(vec2 point) {
          vec3 heightData = texture2D(u_heightmap, vec2(point.x, point.y)).rgb;
          return 0.5 * (heightData.x + heightData.y + heightData.z);
        }
      `,
      main: `
        vec3 displacedPosition = position + normal * displace(uv);
        
        // 计算法线
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
          "vec3 transformedNormal = objectNormal;",
          `vec3 transformedNormal = displacedNormal;`
        ),

      "#include <displacementmap_vertex>": `
        transformed = displacedPosition;
      `,
    }),
    fragmentShader: THREE.ShaderChunk.meshphysical_frag,
  });

  const geometry = new THREE.PlaneGeometry(SIZE, SIZE, RESOLUTION, RESOLUTION);
  const plane = new THREE.Mesh(geometry, material);
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
  const [description, setDescription] = useState('');
  const [isEnglish, setIsEnglish] = useState(true);
  const [selectedTerrainType, setSelectedTerrainType] = useState('mountain');
  const [selectedTexture, setSelectedTexture] = useState('grass');
  
  // 光照设置 - 基于procedural-terrains-main的颜色
  const [ambientLightColor, setAmbientLightColor] = useState('#3c2515');
  const [ambientLightIntensity, setAmbientLightIntensity] = useState(1.0);
  const [directionalLightColor, setDirectionalLightColor] = useState('#87532c');
  const [directionalLightIntensity, setDirectionalLightIntensity] = useState(2.0);
  const [lightPositionX, setLightPositionX] = useState(0.1);
  const [lightPositionY, setLightPositionY] = useState(2);
  const [lightPositionZ, setLightPositionZ] = useState(0.1);
  
  // 模型颜色设置
  const [modelColor, setModelColor] = useState('#8B4513');
  
  // 噪声参数
  const [octaves, setOctaves] = useState(4);
  const [frequency, setFrequency] = useState(1.0);
  const [amplitude, setAmplitude] = useState(1.0);
  

  
  // 材质混合
  const [grassBlend, setGrassBlend] = useState(0.6);
  const [rockBlend, setRockBlend] = useState(0.3);
  const [snowBlend, setSnowBlend] = useState(0.1);

  // 初始化时从本地存储读取语言设置
  useEffect(() => {
    const savedLanguage = localStorage.getItem('genie3-language');
    if (savedLanguage) {
      const isEnglishSaved = savedLanguage === 'en';
      setIsEnglish(isEnglishSaved);
    }

    const handleLanguageChange = (event: CustomEvent) => {
      setIsEnglish(event.detail.isEnglish);
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, []);

  // 实时更新地形
  useEffect(() => {
    if (sceneRef.current) {
      updateTerrain();
    }
  }, [selectedTerrainType, selectedTexture, modelColor, ambientLightColor, ambientLightIntensity, directionalLightColor, directionalLightIntensity, lightPositionX, lightPositionY, lightPositionZ, grassBlend, rockBlend, snowBlend]);

  const toggleLanguage = () => {
    const newLanguage = !isEnglish;
    setIsEnglish(newLanguage);
    
    // 触发自定义事件，通知其他组件语言已切换
    window.dispatchEvent(new CustomEvent('languageChange', {
      detail: { isEnglish: newLanguage }
    }));
  };

  // 翻译文本
  const translations = {
    zh: {
      title: "描述您想要的世界",
      placeholder: "例如：一个宁静的山谷，有河流和森林...",
      generating: "生成中...",
      generateWorld: "生成世界",
      inspiration: "灵感示例",
      terrainType: "地形类型",
      texture: "材质纹理",
      examples: [
        "郁郁葱葱的山谷，一条河流穿过，远处有城堡",
        "未来科技城市，高楼林立，霓虹灯闪烁",
        "宁静的海滨小镇，白色房屋依山傍海",
        "神秘的森林深处，古老的橡树和仙女环",
        "沙漠中的绿洲，棕榈树和清澈的湖水"
      ],
      preview: "3D 预览",
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
        island: "岛屿"
      },
      textures: {
        grass: "草地",
        sand: "沙地",
        rock: "岩石",
        snow: "雪地",
        water: "水面",
        stone: "石头"
      },
      // 新增参数翻译
      lighting: "光照设置",
      ambientLight: "环境光",
      directionalLight: "方向光",
      lightPosition: "光源位置",
      lightIntensity: "光照强度",
      terrainParams: "地形参数",
      resolution: "分辨率",
      terrainSize: "地形大小",
      noiseParams: "噪声参数",
      octaves: "八度数量",
      frequency: "频率",
      amplitude: "振幅",
      materialBlend: "材质混合",
      grassBlend: "草地混合",
      rockBlend: "岩石混合",
      snowBlend: "雪地混合"
    },
    en: {
      title: "Describe the world you want",
      placeholder: "e.g., A peaceful valley with rivers and forests...",
      generating: "Generating...",
      generateWorld: "Generate World",
      inspiration: "Inspiration Examples",
      terrainType: "Terrain Type",
      texture: "Texture",
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
        island: "Island"
      },
      textures: {
        grass: "Grass",
        sand: "Sand",
        rock: "Rock",
        snow: "Snow",
        water: "Water",
        stone: "Stone"
      },
      // 新增参数翻译
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
      snowBlend: "Snow Blend"
    }
  };

  const currentLang = isEnglish ? translations.en : translations.zh;

  useEffect(() => {
    if (!canvasRef.current) return;

    // 创建场景
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb); // 使用procedural-terrains-main的天空蓝色背景
    
    // 创建相机 - 基于procedural-terrains-main
    const camera = new THREE.PerspectiveCamera(
      35,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 8, 8);

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      antialias: true 
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 创建OrbitControls - 基于procedural-terrains-main
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 3;
    controls.maxDistance = 20;
    controls.maxPolarAngle = Math.PI;
    controls.target.set(0, 0, 0); // 确保控制器目标在中心

    // 创建地形
    const terrain = createTerrain(0);
    terrain.rotation.x = -Math.PI / 2;
    terrain.position.set(0, 0, 0); // 确保地形在中心
    scene.add(terrain);

    // 创建天空
    const sky = createSky(renderer);
    scene.add(sky);

    // 添加光源 - 基于procedural-terrains-main
    const ambientLight = new THREE.AmbientLight(0x3c2515, 1.0); // 暖色调环境光
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x87532c, 2.0); // 暖色调方向光
    directionalLight.position.set(0.1, 2, 0.1);
    directionalLight.target = terrain;
    scene.add(directionalLight);

    // 设置sceneRef
    const clock = new THREE.Clock();
    sceneRef.current = { scene, camera, renderer, controls, terrain, clock };

    // 动画循环 - 基于procedural-terrains-main
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      // 更新controls
      controls.update(clock.getDelta());
      
      // 渲染场景
      renderer.render(scene, camera);
    };

    // 窗口大小调整
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
      console.log(isEnglish ? 'Updating terrain:' : '更新地形:', selectedTerrainType);
      
      // 移除旧地形
      if (sceneRef.current.terrain) {
        sceneRef.current.scene.remove(sceneRef.current.terrain);
      }
      
      // 创建新地形
      const newTerrain = createTerrain(
        sceneRef.current.clock.getElapsedTime(), 
        selectedTerrainType,
        {
          materialBlend: {
            grass: grassBlend,
            rock: rockBlend,
            snow: snowBlend
          },
          modelColor: modelColor
        }
      );
      newTerrain.rotation.x = -Math.PI / 2;
      newTerrain.position.set(0, 0, 0); // 确保新地形也在中心
      sceneRef.current.scene.add(newTerrain);
      sceneRef.current.terrain = newTerrain;
      
      // 更新光照设置
      const ambientLight = sceneRef.current.scene.children.find(
        child => child instanceof THREE.AmbientLight
      ) as THREE.AmbientLight;
      if (ambientLight) {
        ambientLight.color.setHex(parseInt(ambientLightColor.replace('#', '0x')));
        ambientLight.intensity = ambientLightIntensity;
      }
      
      // 更新模型颜色
      if (sceneRef.current.terrain && sceneRef.current.terrain.material) {
        const material = sceneRef.current.terrain.material as THREE.ShaderMaterial;
        if (material.uniforms && material.uniforms.u_modelColor) {
          material.uniforms.u_modelColor.value = new THREE.Color(parseInt(modelColor.replace('#', '0x')));
        }
      }
      
      const directionalLight = sceneRef.current.scene.children.find(
        child => child instanceof THREE.DirectionalLight
      ) as THREE.DirectionalLight;
      if (directionalLight) {
        directionalLight.color.setHex(parseInt(directionalLightColor.replace('#', '0x')));
        directionalLight.intensity = directionalLightIntensity;
        directionalLight.position.set(lightPositionX, lightPositionY, lightPositionZ);
        directionalLight.target = newTerrain;
      }
      
    } catch (error) {
      console.error(isEnglish ? 'Update failed:' : '更新失败:', error);
    }
  };

  const resetScene = () => {
    if (!sceneRef.current) return;
    
    // 重置相机位置
    sceneRef.current.camera.position.set(0, 8, 8);
    sceneRef.current.controls.target.set(0, 0, 0);
    sceneRef.current.controls.reset();
  };

  const shareWorld = () => {
    // 分享功能实现
    alert(isEnglish ? "Share feature coming soon!" : "分享功能即将推出！");
  };

  const downloadModel = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (!sceneRef.current || !sceneRef.current.terrain) {
      alert(isEnglish ? "Please generate a world first!" : "请先生成一个世界！");
      return;
    }

    try {
      // 动态导入GLTF导出器
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
          
          alert(isEnglish ? "Model downloaded successfully!" : "模型下载成功！");
        }, (error: any) => {
          console.error('Export failed:', error);
          alert(isEnglish ? "Export failed. Please try again." : "导出失败，请重试。");
        }, options);
      }).catch((error) => {
        console.error('GLTFExporter import failed:', error);
        alert(isEnglish ? "Download feature not available yet." : "下载功能暂不可用。");
      });
    } catch (error) {
      console.error('Download failed:', error);
      alert(isEnglish ? "Download failed. Please try again." : "下载失败，请重试。");
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
      <div className="container mx-auto px-2 py-8 max-w-screen-2xl">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-2">
          {/* 左侧控制面板 - 描述和基础参数 */}
          <div className="xl:col-span-3 space-y-3">
            {/* 描述输入 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-2 flex items-center text-gray-900 dark:text-white">
                <span className="text-red-500 mr-2">※</span>
                {currentLang.title}
              </h2>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={currentLang.placeholder}
                className="w-full h-32 p-4 border border-gray-200 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {isEnglish 
                  ? "Describe the scene you want in as much detail as possible, including terrain, buildings, vegetation and other elements."
                  : "尽可能详细地描述您想要的场景，包括地形、建筑、植被等元素。"
                }
              </p>

              {/* 灵感提示下拉选择 */}
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{currentLang.inspiration}</label>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      setDescription(e.target.value);
                    }
                  }}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">{isEnglish ? "Select an inspiration example..." : "选择灵感示例..."}</option>
                  {currentLang.examples.map((example, index) => (
                    <option key={index} value={example}>
                      {isEnglish ? `Example ${index + 1}` : `示例 ${index + 1}`}: {example.length > 50 ? example.substring(0, 50) + '...' : example}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 基础世界参数设置 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-2 flex items-center text-gray-900 dark:text-white">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {isEnglish ? "🌍 Basic World Parameters" : "🌍 基础世界参数"}
              </h3>

              {/* 地形类型和材质纹理 */}
              <div className="space-y-3">
                {/* 地形类型下拉选择 */}
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
                        island: "🏝️"
                      };
                      return (
                        <option key={key} value={key}>
                          {icons[key as keyof typeof icons]} {value}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* 材质纹理下拉选择 */}
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

                {/* 模型颜色主题 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{isEnglish ? "Model Color Themes" : "模型颜色主题"}</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setModelColor('#8B4513')}
                      className="px-3 py-2 text-xs bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900 transition-colors border border-amber-300 dark:border-amber-600"
                    >
                      {isEnglish ? "Brown" : "棕色"}
                    </button>
                    <button
                      onClick={() => setModelColor('#228B22')}
                      className="px-3 py-2 text-xs bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 rounded-lg hover:bg-green-200 dark:hover:bg-green-900 transition-colors border border-green-300 dark:border-green-600"
                    >
                      {isEnglish ? "Green" : "绿色"}
                    </button>
                    <button
                      onClick={() => setModelColor('#4682B4')}
                      className="px-3 py-2 text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors border border-blue-300 dark:border-blue-600"
                    >
                      {isEnglish ? "Blue" : "蓝色"}
                    </button>
                  </div>
                </div>

                {/* 模型颜色控制 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{isEnglish ? "Model Color" : "模型颜色"}</label>
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
          </div>

          {/* 中间3D预览 */}
          <div className="xl:col-span-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-100 dark:border-gray-700">
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
              <div className="relative bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden" style={{ width: '100%', height: '0', paddingBottom: '100%' }}>
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full"
                  style={{ display: 'block' }}
                />
                
                {/* 控制提示 */}
                <div className="absolute bottom-4 left-4 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 px-3 py-2 rounded-lg shadow-sm z-10">
                  {currentLang.controls.drag}
                </div>
                <div className="absolute bottom-4 left-48 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 px-3 py-2 rounded-lg shadow-sm z-10">
                  {currentLang.controls.zoom}
                </div>

                {/* 右下角下载按钮 */}
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
                        ? (isEnglish ? "Download GLB" : "下载模型")
                        : (isEnglish ? "Login to Download" : "登录下载")
                      }
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧控制面板 - 光照、噪声和材质混合 */}
          <div className="xl:col-span-3 space-y-3">
            {/* 光照设置 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-2 flex items-center text-gray-900 dark:text-white">
                <svg className="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                {currentLang.lighting}
              </h3>
              
              {/* 环境光 */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{currentLang.ambientLight}</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={ambientLightColor}
                    onChange={(e) => setAmbientLightColor(e.target.value)}
                    className="w-12 h-8 rounded border border-gray-300 dark:border-gray-600"
                  />
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={ambientLightIntensity}
                    onChange={(e) => setAmbientLightIntensity(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-center">{ambientLightIntensity}</span>
                </div>
              </div>

              {/* 方向光 */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{currentLang.directionalLight}</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={directionalLightColor}
                    onChange={(e) => setDirectionalLightColor(e.target.value)}
                    className="w-12 h-8 rounded border border-gray-300 dark:border-gray-600"
                  />
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.1"
                    value={directionalLightIntensity}
                    onChange={(e) => setDirectionalLightIntensity(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-center">{directionalLightIntensity}</span>
                </div>
              </div>

              {/* 光源位置 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{currentLang.lightPosition}</label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">X</label>
                    <input
                      type="range"
                      min="-10"
                      max="10"
                      step="0.5"
                      value={lightPositionX}
                      onChange={(e) => setLightPositionX(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400">{lightPositionX}</span>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Y</label>
                    <input
                      type="range"
                      min="-10"
                      max="10"
                      step="0.5"
                      value={lightPositionY}
                      onChange={(e) => setLightPositionY(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400">{lightPositionY}</span>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Z</label>
                    <input
                      type="range"
                      min="-10"
                      max="10"
                      step="0.5"
                      value={lightPositionZ}
                      onChange={(e) => setLightPositionZ(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400">{lightPositionZ}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 噪声参数 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-2 flex items-center text-gray-900 dark:text-white">
                <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                {currentLang.noiseParams}
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{currentLang.octaves}</label>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    step="1"
                    value={octaves}
                    onChange={(e) => setOctaves(parseInt(e.target.value))}
                    className="w-full h-2 bg-purple-200 dark:bg-purple-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
                    <span>1</span>
                    <span className="font-medium">{octaves}</span>
                    <span>8</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{currentLang.frequency}</label>
                  <input
                    type="range"
                    min="0.1"
                    max="5.0"
                    step="0.1"
                    value={frequency}
                    onChange={(e) => setFrequency(parseFloat(e.target.value))}
                    className="w-full h-2 bg-purple-200 dark:bg-purple-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
                    <span>0.1</span>
                    <span className="font-medium">{frequency}</span>
                    <span>5.0</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{currentLang.amplitude}</label>
                  <input
                    type="range"
                    min="0.1"
                    max="3.0"
                    step="0.1"
                    value={amplitude}
                    onChange={(e) => setAmplitude(parseFloat(e.target.value))}
                    className="w-full h-2 bg-purple-200 dark:bg-purple-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
                    <span>0.1</span>
                    <span className="font-medium">{amplitude}</span>
                    <span>3.0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 材质混合 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-2 flex items-center text-gray-900 dark:text-white">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                {currentLang.materialBlend}
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{currentLang.grassBlend}</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={grassBlend}
                    onChange={(e) => setGrassBlend(parseFloat(e.target.value))}
                    className="w-full h-2 bg-green-200 dark:bg-green-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
                    <span>0</span>
                    <span className="font-medium">{grassBlend}</span>
                    <span>1</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{currentLang.rockBlend}</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={rockBlend}
                    onChange={(e) => setRockBlend(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
                    <span>0</span>
                    <span className="font-medium">{rockBlend}</span>
                    <span>1</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{currentLang.snowBlend}</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={snowBlend}
                    onChange={(e) => setSnowBlend(parseFloat(e.target.value))}
                    className="w-full h-2 bg-blue-200 dark:bg-blue-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
                    <span>0</span>
                    <span className="font-medium">{snowBlend}</span>
                    <span>1</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}