'use client';

import { useRef, useState } from 'react';

export default function ThumbnailClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    setLoading(true);
    const res = await fetch('/api/generate_thumbnail', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    setImageSrc(data.url);
    setLoading(false);
  };

  const drawOnCanvas = () => {
    if (!canvasRef.current || !imageSrc) return;

    const ctx = canvasRef.current.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;

    img.onload = () => {
      ctx!.clearRect(0, 0, 1280, 720);
      ctx!.fillStyle = 'white';
      ctx!.fillRect(0, 0, 1280, 720);

      const scale = Math.max(1280 / img.width, 720 / img.height);
      const drawWidth = img.width * scale;
      const drawHeight = img.height * scale;
      const offsetX = (1280 - drawWidth) / 2;
      const offsetY = (720 - drawHeight) / 2;

      ctx!.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

      ctx!.fillStyle = 'black';
      ctx!.font = 'bold 48px sans-serif';
      ctx!.fillText('Generated Thumbnail', 50, 100);
    };
  };

  const downloadImage = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'thumbnail.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter your thumbnail prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="p-2 border w-full"
      />
      <div className="flex gap-4 mt-4">
        <button
          onClick={generateImage}
          disabled={loading}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          {loading ? 'Generating...' : 'Generate Image'}
        </button>
        <button
          onClick={drawOnCanvas}
          disabled={!imageSrc}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Draw on Canvas
        </button>
        <button
          onClick={downloadImage}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Download
        </button>
      </div>
      {imageSrc && (
        <img src={imageSrc} alt="Generated thumbnail" className="mt-4 border max-w-full h-auto" />
      )}
      {/* Keeping the canvas for now, but it won't be used */}
      <canvas ref={canvasRef} width={1280} height={720} className="hidden" />
    </div>
  );
}
