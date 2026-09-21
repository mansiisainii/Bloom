import { useRef } from 'react';
import { toPng } from 'html-to-image';
import { Droplet, Download, Share2 } from 'lucide-react';

export default function ProgressCard({ streak, glasses, goal }) {
  const cardRef = useRef();

  const handleDownload = async () => {
    const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 });
    const link = document.createElement('a');
    link.download = 'bloom-progress.png';
    link.href = dataUrl;
    link.click();
  };

  const handleShare = async () => {
    const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 });
    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], 'bloom-progress.png', { type: 'image/png' });

    if (navigator.share && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: 'My Bloom progress' });
    } else {
      handleDownload(); // fallback for desktop
    }
  };

  return (
    <div className="max-w-sm">
      <div
        ref={cardRef}
        className="bg-primary rounded-2xl p-6 text-white"
        style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-soft))' }}
      >
        <p className="text-sm opacity-90 mb-1">Bloom 🌸</p>
        <div className="flex items-center gap-2 mb-3">
          <Droplet size={28} />
          <span className="text-3xl font-bold">{streak} day streak</span>
        </div>
        <p className="text-sm opacity-90">{glasses}/{goal} glasses today</p>
      </div>

      <div className="flex gap-2 mt-3">
        <button onClick={handleDownload} className="flex-1 bg-surface border border-border text-text py-2 rounded-lg text-sm flex items-center justify-center gap-2">
          <Download size={14} /> Download
        </button>
        <button onClick={handleShare} className="flex-1 bg-primary text-white py-2 rounded-lg text-sm flex items-center justify-center gap-2">
          <Share2 size={14} /> Share
        </button>
      </div>
    </div>
  );
}