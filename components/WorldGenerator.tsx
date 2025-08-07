'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

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
    color: 0xe6f3ff, // 更亮的天空蓝色
    side: THREE.BackSide
  });
  const sky = new THREE.Mesh(skyGeometry, skyMaterial);
  return sky;
};

// 创建地形 - 基于procedural-terrains-main
const createTerrain = (time: number, terrainType: string = "default") => {
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

  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
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
      }
    },
    en: {
      title: "Describe the world you want",
      placeholder: "e.g., A peaceful valley with rivers and forests...",
      generating: "Generating...",
      generateWorld: "Generate World",
      inspiration: "Inspiration Examples",
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
      }
    }
  };

  const currentLang = isEnglish ? translations.en : translations.zh;

  useEffect(() => {
    if (!canvasRef.current) return;

    // 创建场景
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0); // 设置浅灰色背景
    
    // 创建相机 - 基于procedural-terrains-main
    const camera = new THREE.PerspectiveCamera(
      35,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 5, 5);

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
    controls.minDistance = 1;
    controls.maxDistance = 50;
    controls.maxPolarAngle = Math.PI;

    // 创建地形
    const terrain = createTerrain(0);
    terrain.rotation.x = -Math.PI / 2;
    scene.add(terrain);

    // 创建天空
    const sky = createSky(renderer);
    scene.add(sky);

    // 添加光源 - 基于procedural-terrains-main
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // 更亮的白色环境光
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // 更亮的白色方向光
    directionalLight.position.set(1, 3, 1);
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

  const handleGenerate = async () => {
    if (!description.trim() || !sceneRef.current) return;
    
    setIsGenerating(true);
    
    try {
      // 根据描述生成不同地形
      const keywords = description.toLowerCase();
      let terrainType = "default";
      
      if (keywords.includes('山') || keywords.includes('mountain') || keywords.includes('峰')) {
        terrainType = "mountain";
      } else if (keywords.includes('沙漠') || keywords.includes('desert') || keywords.includes('沙')) {
        terrainType = "desert";
      } else if (keywords.includes('海') || keywords.includes('ocean') || keywords.includes('水')) {
        terrainType = "ocean";
      }
      
      console.log(isEnglish ? 'Generating terrain:' : '生成地形:', terrainType, description);
      
      // 移除旧地形
      if (sceneRef.current.terrain) {
        sceneRef.current.scene.remove(sceneRef.current.terrain);
      }
      
      // 创建新地形
      const newTerrain = createTerrain(sceneRef.current.clock.getElapsedTime(), terrainType);
      newTerrain.rotation.x = -Math.PI / 2;
      sceneRef.current.scene.add(newTerrain);
      sceneRef.current.terrain = newTerrain;
      
      // 更新光源目标
      const directionalLight = sceneRef.current.scene.children.find(
        child => child instanceof THREE.DirectionalLight
      ) as THREE.DirectionalLight;
      if (directionalLight) {
        directionalLight.target = newTerrain;
      }
      
      // 模拟生成过程
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(isEnglish ? 'Generation failed:' : '生成失败:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const resetScene = () => {
    if (!sceneRef.current) return;
    
    // 重置相机位置
    sceneRef.current.camera.position.set(0, 5, 5);
    sceneRef.current.controls.reset();
  };

  return (
    <div className="min-h-screen bg-gray-25">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧控制面板 */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">※ {currentLang.title}</h2>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={currentLang.placeholder}
                className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-600 mt-2">
                {isEnglish 
                  ? "Describe the scene you want in as much detail as possible, including terrain, buildings, vegetation and other elements."
                  : "尽可能详细地描述您想要的场景，包括地形、建筑、植被等元素。"
                }
              </p>
              
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !description.trim()}
                className="mt-4 w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-md hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {currentLang.generating}
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {currentLang.generateWorld}
                  </>
                )}
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">{currentLang.inspiration}</h2>
              <div className="space-y-2">
                {currentLang.examples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setDescription(example)}
                    className="block w-full text-left p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧3D预览 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">{currentLang.preview}</h2>
            <div className="relative bg-gray-50 rounded-lg overflow-hidden" style={{ height: '500px' }}>
              <canvas
                ref={canvasRef}
                className="w-full h-full"
                style={{ display: 'block' }}
              />
              
              {/* 控制提示 */}
              <div className="absolute bottom-4 left-4 text-sm text-gray-600 bg-white bg-opacity-80 px-3 py-1 rounded">
                {currentLang.controls.drag}
              </div>
              <div className="absolute bottom-4 left-32 text-sm text-gray-600 bg-white bg-opacity-80 px-3 py-1 rounded">
                {currentLang.controls.zoom}
              </div>
              
              {/* 操作按钮 */}
              <div className="absolute bottom-4 right-4 space-x-2">
                <button
                  onClick={resetScene}
                  className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors"
                >
                  {currentLang.controls.reset}
                </button>
                <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                  {currentLang.controls.share}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}