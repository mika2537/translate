import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Link, Languages, Sparkles } from 'lucide-react';
import { useTranslation } from './hooks/useTranslation';

interface VideoUploadProps {
  onUploadStart: (file: File | string) => void;
}

const VideoUpload = ({ onUploadStart }: VideoUploadProps) => {
  const { t, languages } = useTranslation();
  const [videoUrl, setVideoUrl] = useState('');
  const [originalLanguage, setOriginalLanguage] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUploadStart(file);
    }
  };

  const handleUrlSubmit = () => {
    if (videoUrl && originalLanguage && targetLanguage) {
      onUploadStart(videoUrl);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4">
          <Languages className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-foreground font-display">
          {t('translate.title')}
        </h1>
        <p className="text-lg text-muted-foreground">
          AI-powered video translation with natural voice cloning
        </p>
      </div>

      <Card className="border-border shadow-lg">
        <CardContent className="p-8 space-y-6">
          {/* URL Input */}
          <div className="space-y-3">
            <div className="relative">
              <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder={t('translate.urlPlaceholder')}
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="pl-10 h-14 text-base border-border bg-background"
              />
            </div>
          </div>

          {/* Upload Button */}
          <div className="text-center">
            <Button
              variant="upload"
              size="lg"
              onClick={handleUploadClick}
              className="w-full sm:w-auto"
            >
              <Upload className="w-5 h-5" />
              {t('translate.uploadButton')}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Language Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {t('translate.originalLanguage')}
              </label>
              <Select value={originalLanguage} onValueChange={setOriginalLanguage}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {t('translate.targetLanguage')}
              </label>
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Translate Button */}
          <Button
            variant="hero"
            size="lg"
            className="w-full"
            onClick={handleUrlSubmit}
            disabled={!((videoUrl || fileInputRef.current?.files?.[0]) && originalLanguage && targetLanguage)}
          >
            <Sparkles className="w-5 h-5" />
            {t('translate.translateButton')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoUpload;