import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import VideoUpload from '@/components/VideoUpload';
import VideoProgress from '@/components/VideoProgress';
import VideoResult from '@/components/VideoResult';

type AppState = 'upload' | 'uploading' | 'translating' | 'completed';

const VideoTranslator = () => {
  const [appState, setAppState] = useState<AppState>('upload');
  const [progress, setProgress] = useState(0);
  const [translatedVideoUrl, setTranslatedVideoUrl] = useState<string>();

  const handleUploadStart = (file: File | string) => {
    setAppState('uploading');
    setProgress(0);
    
    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          setAppState('translating');
          startTranslation();
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 500);
  };

  const startTranslation = () => {
    setProgress(0);
    
    // Simulate translation progress
    const translationInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(translationInterval);
          setAppState('completed');
          // In a real app, this would be the actual translated video URL
          setTranslatedVideoUrl('/sample-video.mp4');
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 800);
  };

  const handleNewTranslation = () => {
    setAppState('upload');
    setProgress(0);
    setTranslatedVideoUrl(undefined);
  };

  const renderContent = () => {
    switch (appState) {
      case 'upload':
        return <VideoUpload onUploadStart={handleUploadStart} />;
      case 'uploading':
        return <VideoProgress stage="uploading" progress={progress} />;
      case 'translating':
        return <VideoProgress stage="translating" progress={progress} />;
      case 'completed':
        return <VideoResult videoUrl={translatedVideoUrl} onNewTranslation={handleNewTranslation} />;
      default:
        return <VideoUpload onUploadStart={handleUploadStart} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background font-display">
      <Header />
      <main className="container mx-auto px-4 py-12">
        {renderContent()}
      </main>
    </div>
  );
};

export default VideoTranslator;