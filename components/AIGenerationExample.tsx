"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GenieCreditDisplay } from "./GenieCreditDisplay";
import { GenieCreditConsumptionDialog } from "./GenieCreditConsumptionDialog";
import { useGenieCredits } from "@/hooks/useGenieCredits";
import { Zap, Sparkles, Image, Video, Music } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AIGenerationExampleProps {
  userId: string;
  className?: string;
}

export function AIGenerationExample({ userId, className }: AIGenerationExampleProps) {
  const [prompt, setPrompt] = useState("");
  const [generationType, setGenerationType] = useState("image");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCreditDialog, setShowCreditDialog] = useState(false);
  const { checkCredits, creditUsage } = useGenieCredits();

  // 不同生成类型的积分消耗
  const creditCosts = {
    image: 5,
    video: 20,
    music: 10,
    text: 2,
  };

  const generationTypes = [
    { value: "image", label: "图像生成", icon: Image, description: "AI生成高质量图像" },
    { value: "video", label: "视频生成", icon: Video, description: "AI生成短视频" },
    { value: "music", label: "音乐生成", icon: Music, description: "AI生成背景音乐" },
    { value: "text", label: "文本生成", icon: Sparkles, description: "AI生成创意文本" },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert("请输入生成提示");
      return;
    }

    // 检查积分是否足够
    if (!checkCredits(creditCosts[generationType as keyof typeof creditCosts])) {
      setShowCreditDialog(true);
      return;
    }

    // 开始生成
    await startGeneration();
  };

  const startGeneration = async () => {
    try {
      setIsGenerating(true);
      
      // 模拟AI生成过程
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 这里应该调用实际的AI生成API

      
      // 清空提示词
      setPrompt("");
      
      alert("生成完成！");
    } catch (error) {

      alert("生成失败，请重试");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreditConfirm = () => {
    setShowCreditDialog(false);
    startGeneration();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 积分显示 */}
      <GenieCreditDisplay />
      
      {/* AI生成表单 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <span>AI 内容生成</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 生成类型选择 */}
          <div className="space-y-2">
            <Label>生成类型</Label>
            <Select value={generationType} onValueChange={setGenerationType}>
              <SelectTrigger>
                <SelectValue placeholder="选择生成类型" />
              </SelectTrigger>
              <SelectContent>
                {generationTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center space-x-2">
                      <type.icon className="h-4 w-4" />
                      <span>{type.label}</span>
                      <span className="text-xs text-muted-foreground">
                        ({creditCosts[type.value as keyof typeof creditCosts]} 积分)
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 提示词输入 */}
          <div className="space-y-2">
            <Label>生成提示</Label>
            <Textarea
              placeholder="描述您想要生成的内容..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
            />
          </div>

          {/* 积分消耗提示 */}
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800">本次生成将消耗</span>
            </div>
            <Badge variant="default">
              {creditCosts[generationType as keyof typeof creditCosts]} 积分
            </Badge>
          </div>

          {/* 生成按钮 */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                生成中...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                开始生成
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* 积分消耗确认对话框 */}
      {showCreditDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">确认积分消耗</h3>
            <p className="text-gray-600 mb-6">
              您即将进行 {generationTypes.find(t => t.value === generationType)?.label} 操作，
              需要消耗 {creditCosts[generationType as keyof typeof creditCosts]} 积分。
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowCreditDialog(false)}
                className="flex-1"
              >
                取消
              </Button>
              <Button
                onClick={handleCreditConfirm}
                className="flex-1"
              >
                确认
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
