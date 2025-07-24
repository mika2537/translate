// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Download, RotateCcw, Play } from 'lucide-react';
// import { useTranslation } from './hooks/useTranslation';
// import sunsetOcean from '@/assets/sunset-ocean.jpg';

// interface VideoResultProps {
//   videoUrl?: string;
//   onNewTranslation: () => void;
// }

// const VideoResult = ({ videoUrl, onNewTranslation }: VideoResultProps) => {
//   const { t } = useTranslation();

//   return (
//     <div className="max-w-4xl mx-auto space-y-6">
//       <div className="text-center space-y-2">
//         <h2 className="text-3xl font-bold text-foreground">Translated Video</h2>
//         <p className="text-muted-foreground">Your video has been successfully translated</p>
//       </div>

//       <Card className="border-border shadow-lg overflow-hidden">
//         <CardContent className="p-0">
//           {/* Video Player */}
//           <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
//             {videoUrl ? (
//               <video
//                 src={videoUrl}
//                 controls
//                 className="w-full h-full object-cover"
//                 poster="/lovable-uploads/93393579-8422-43c6-9a39-75907cfb2c09.png"
//               />
//             ) : (
//               <div
//                 className="w-full h-full bg-cover bg-center relative flex items-center justify-center"
//                 style={{
//                   backgroundImage: `url(${sunsetOcean})`,
//                 }}
//               >
//                 <div className="absolute inset-0 bg-black/20"></div>
//                 <Button
//                   size="lg"
//                   variant="secondary"
//                   className="relative z-10 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
//                 >
//                   <Play className="w-6 h-6" />
//                   Play Video
//                 </Button>
//               </div>
//             )}
//           </div>

//           {/* Controls */}
//           <div className="p-6 space-y-4">
//             <div className="flex flex-col sm:flex-row gap-3">
//               <Button variant="default" size="lg" className="flex-1">
//                 <Download className="w-5 h-5" />
//                 {t('translate.download')}
//               </Button>
              
//               <Button variant="outline" size="lg" className="flex-1">
//                 <RotateCcw className="w-5 h-5" />
//                 {t('translate.switchAudio')}
//               </Button>
//             </div>

//             <Button
//               variant="ghost"
//               onClick={onNewTranslation}
//               className="w-full text-muted-foreground hover:text-foreground"
//             >
//               Translate Another Video
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default VideoResult;
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react'; // Settings icon from lucide-react

const VideoWithSubtitles = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showMenu, setShowMenu] = useState(false);

  const downloadVideo = () => {
    window.location.href = '/videos/ted_video_en.mp4';
  };

  const switchSubtitle = (lang: 'en' | 'mn' | 'off') => {
    const video = videoRef.current;
    if (!video) return;

    for (let i = 0; i < video.textTracks.length; i++) {
      const track = video.textTracks[i];
      if (lang === 'off') {
        track.mode = 'disabled';
      } else {
        track.mode = track.language === lang ? 'showing' : 'disabled';
      }
    }

    setShowMenu(false); // Close menu after selection
  };

  return (
    <div className="p-6 space-y-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold">Video with Subtitle Settings</h2>

      <div className="relative w-full">
        {/* Video */}
        <video ref={videoRef} width="100%" controls className="w-full rounded-lg shadow-md">
          <source src="/videos/ted_video_en.mp4" type="video/mp4" />
          <track
            src="/subs/ted_video.en.vtt"
            kind="subtitles"
            srcLang="en"
            label="English"
            default
          />
          <track
            src="/subs/ted_video.mn.vtt"
            kind="subtitles"
            srcLang="mn"
            label="Монгол"
          />
          Your browser does not support the video tag.
        </video>

        {/* Settings Button with Dropdown */}
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-white bg-black/50 p-2 rounded-full hover:bg-black/70"
            aria-label="Settings"
          >
            <Settings size={18} />
          </button>

          {showMenu && (
            <div className="mt-2 absolute right-0 bg-black/70 text-white text-sm rounded-md shadow-lg">
              <button
                onClick={() => switchSubtitle('en')}
                className="block px-4 py-2 hover:bg-white/10 w-full text-left"
              >
                English Subtitles
              </button>
              <button
                onClick={() => switchSubtitle('mn')}
                className="block px-4 py-2 hover:bg-white/10 w-full text-left"
              >
                Монгол хадмал
              </button>
              <button
                onClick={() => switchSubtitle('off')}
                className="block px-4 py-2 hover:bg-white/10 w-full text-left"
              >
                Turn Off Subtitles
              </button>
            </div>
          )}
        </div>
      </div>

      <Button onClick={downloadVideo}>Download Video</Button>
    </div>
  );
};

export default VideoWithSubtitles;