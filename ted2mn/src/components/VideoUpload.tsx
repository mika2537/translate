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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);

    if (file) {
      console.log("File selected:", {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified).toLocaleString(),
      });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    if (!originalLanguage || !targetLanguage) {
      alert("Please select both original and target languages.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("source_lang", originalLanguage);
    formData.append("target_lang", targetLanguage);

    console.log("FormData contents:");
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    onUploadStart(selectedFile);
    setUploading(true);
    setProcessing(false);
    setUploadProgress(0);

    try {
      const response = await axios.post("http://127.0.0.1:8002/analyze", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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
      alert("Upload complete! Starting translation...");
      
    } catch (error) {
      console.error("Upload failed:", error);
      if (axios.isAxiosError(error)) {
        console.error("Response data:", error.response?.data);
        console.error("Response status:", error.response?.status);
        console.error("Response headers:", error.response?.headers);
        alert(`Upload failed: ${error.response?.data?.detail || error.message}`);
      } else {
        alert("Upload failed. Please try again.");
      }
    } finally {
      setUploading(false);
      setProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setSelectedFile(null);
    }
  };

  const handleFileInputClick = () => {
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
          {/* File Selection */}
          <div className="text-center space-y-4">
            <Button
              variant="upload"
              size="lg"
              onClick={handleFileInputClick}
              className="w-full sm:w-auto"
            >
              <Upload className="w-5 h-5" />
              {selectedFile ? selectedFile.name : t("translate.uploadButton")}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".mp4,video/mp4"
              onChange={handleFileSelect}
              className="hidden"
            />
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                File size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            )}
          </div>

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
                    <SelectItem key={lang.code} value={lang.value}>
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
                    <SelectItem key={lang.code} value={lang.value}>
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

          {/* Upload Progress */}
          {uploading && (
            <div className="w-full text-center">
              <p className="text-sm text-muted-foreground mb-2">Uploading... {uploadProgress}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
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

          {/* Translate Button */}
          <Button 
            variant="hero" 
            size="lg" 
            className="w-full" 
            onClick={handleUpload}
            disabled={!selectedFile || !originalLanguage || !targetLanguage || uploading}
          >
            <Sparkles className="w-5 h-5" />
            {uploading ? "Uploading..." : t("translate.translateButton")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoUpload;
