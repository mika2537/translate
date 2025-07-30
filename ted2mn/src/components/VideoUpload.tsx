import axios from "axios";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Languages, Sparkles } from "lucide-react";
import { useTranslation } from "./hooks/useTranslation";

interface VideoUploadProps {
  onUploadStart: (file: File | string) => void;
  onUploadProgress?: (progress: number) => void;
}

const VideoUpload = ({ onUploadStart, onUploadProgress }: VideoUploadProps) => {
  const { t, languages } = useTranslation();
  const [videoUrl, setVideoUrl] = useState("");
  const [originalLanguage, setOriginalLanguage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processing, setProcessing] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);

    if (file) {
      console.log("File selected:", {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified).toLocaleString(),
      });
      console.log("source_lang", originalLanguage);
      console.log("target_lang", targetLanguage);
    }

    if (file && originalLanguage && targetLanguage) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("source_lang", originalLanguage); // Assuming these are language codes
      formData.append("target_lang", targetLanguage);

      onUploadStart(file);
      setUploading(true);
      setProcessing(false);
      setUploadProgress(0);

      try {
        const response = await axios.post("http://127.0.0.1:8002/analyze", formData, {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percent);
              onUploadProgress?.(percent);
              console.log("Upload progress:", percent);
            }
          },
        });

        setProcessing(true);
        console.log("Server response:", response.data);
        alert("Upload complete. Starting translation...");
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Upload or analysis failed. Please try again.");
      } finally {
        setUploading(false);
        setProcessing(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } else {
      alert("Please select file and both languages before uploading.");
    }
  };

  const handleUploadClick = () => {
    if (!originalLanguage || !targetLanguage) {
      alert("Please select both original and target languages.");
      return;
    }
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4">
          <Languages className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-foreground font-display">{t("translate.title")}</h1>
        <p className="text-lg text-muted-foreground">
          AI-powered video translation with natural voice cloning
        </p>
      </div>

      <Card className="border-border shadow-lg">
        <CardContent className="p-8 space-y-6">
          {/* Upload Button */}
          <div className="text-center">
            <Button
              variant="upload"
              size="lg"
              onClick={handleUploadClick}
              className="w-full sm:w-auto"
              disabled={!originalLanguage || !targetLanguage}
            >
              <Upload className="w-5 h-5" />
              {t("translate.uploadButton")}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".mp4,video/mp4"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {uploading && (
            <div className="w-full text-center">
              <p className="text-sm text-muted-foreground mb-2">Uploading... {uploadProgress}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {processing && (
            <div className="w-full text-center mt-4">
              <p className="text-sm text-muted-foreground">Processing with AI model...</p>
              <div className="w-full bg-gray-100 rounded-full h-2 animate-pulse mt-1">
                <div className="bg-green-400 h-2 rounded-full w-1/2" />
              </div>
            </div>
          )}

          {/* Language Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {t("translate.originalLanguage")}
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
                {t("translate.targetLanguage")}
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

          {/* Translate Button (disabled and informational) */}
          <Button variant="hero" size="lg" className="w-full" disabled>
            <Sparkles className="w-5 h-5" />
            {t("translate.translateButton")} (Coming Soon)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoUpload;