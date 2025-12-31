import React, { useState, useRef, useEffect } from 'react';

const VideoGenerator = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [script, setScript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState(null);
  const [settings, setSettings] = useState({
    duration: 15,
    effect: 'zoomIn',
    textPosition: 'bottom',
    textStyle: 'modern',
    addVoice: false
  });

  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      setVideoUrl(null);
    }
  };

  const effects = {
    zoomIn: (ctx, img, canvas, progress) => {
      const scale = 1 + (progress * 0.3);
      const x = (canvas.width - canvas.width * scale) / 2;
      const y = (canvas.height - canvas.height * scale) / 2;
      ctx.drawImage(img, x, y, canvas.width * scale, canvas.height * scale);
    },
    zoomOut: (ctx, img, canvas, progress) => {
      const scale = 1.3 - (progress * 0.3);
      const x = (canvas.width - canvas.width * scale) / 2;
      const y = (canvas.height - canvas.height * scale) / 2;
      ctx.drawImage(img, x, y, canvas.width * scale, canvas.height * scale);
    },
    panLeft: (ctx, img, canvas, progress) => {
      const scale = 1.2;
      const x = -progress * canvas.width * 0.2;
      const y = (canvas.height - canvas.height * scale) / 2;
      ctx.drawImage(img, x, y, canvas.width * scale, canvas.height * scale);
    },
    panRight: (ctx, img, canvas, progress) => {
      const scale = 1.2;
      const x = -(1 - progress) * canvas.width * 0.2;
      const y = (canvas.height - canvas.height * scale) / 2;
      ctx.drawImage(img, x, y, canvas.width * scale, canvas.height * scale);
    },
    kenBurns: (ctx, img, canvas, progress) => {
      const scale = 1 + (progress * 0.2);
      const x = (canvas.width - canvas.width * scale) / 2 - (progress * 50);
      const y = (canvas.height - canvas.height * scale) / 2 - (progress * 30);
      ctx.drawImage(img, x, y, canvas.width * scale, canvas.height * scale);
    }
  };

  const drawText = (ctx, canvas, text, position, style, progress) => {
    const lines = text.split('\n').filter(line => line.trim());
    const maxChars = Math.floor(progress * text.length);
    let currentChars = 0;
    const visibleLines = [];
    
    for (const line of lines) {
      if (currentChars + line.length <= maxChars) {
        visibleLines.push(line);
        currentChars += line.length;
      } else {
        const remainingChars = maxChars - currentChars;
        if (remainingChars > 0) {
          visibleLines.push(line.substring(0, remainingChars));
        }
        break;
      }
    }

    const fontSize = style === 'cinematic' ? 32 : 28;
    const lineHeight = fontSize * 1.4;
    const padding = 40;
    
    ctx.font = `bold ${fontSize}px 'Segoe UI', Arial, sans-serif`;
    ctx.textAlign = 'center';

    let startY;
    if (position === 'top') {
      startY = padding + fontSize;
    } else if (position === 'center') {
      startY = (canvas.height - (visibleLines.length * lineHeight)) / 2;
    } else {
      startY = canvas.height - padding - (visibleLines.length * lineHeight);
    }

    // Draw background for text
    if (visibleLines.length > 0) {
      const maxWidth = Math.max(...visibleLines.map(line => ctx.measureText(line).width));
      const bgHeight = visibleLines.length * lineHeight + 20;
      const bgY = startY - fontSize - 10;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.beginPath();
      ctx.roundRect(
        (canvas.width - maxWidth) / 2 - 20,
        bgY,
        maxWidth + 40,
        bgHeight,
        10
      );
      ctx.fill();
    }

    // Draw text with shadow
    visibleLines.forEach((line, index) => {
      const y = startY + (index * lineHeight);
      
      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillText(line, canvas.width / 2 + 2, y + 2);
      
      // Main text
      if (style === 'cinematic') {
        ctx.fillStyle = '#FFD700';
      } else if (style === 'modern') {
        ctx.fillStyle = '#FFFFFF';
      } else {
        ctx.fillStyle = '#00FF88';
      }
      ctx.fillText(line, canvas.width / 2, y);
    });
  };

  const drawWatermark = (ctx, canvas) => {
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.textAlign = 'right';
    ctx.fillText('🎬 MovieBuzz', canvas.width - 20, canvas.height - 20);
  };

  const generateVideo = async () => {
    if (!image || !script.trim()) {
      alert('Please add an image and script first!');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setVideoUrl(null);
    chunksRef.current = [];

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size (1080p aspect ratio)
    canvas.width = 1280;
    canvas.height = 720;

    // Load image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imagePreview;
    });

    // Setup MediaRecorder
    const stream = canvas.captureStream(30);
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: 5000000
    });
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      setIsGenerating(false);
      setProgress(100);
    };

    // Start recording
    mediaRecorder.start();

    // Text-to-speech (optional)
    if (settings.addVoice && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(script);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }

    // Animation loop
    const totalFrames = settings.duration * 30; // 30 FPS
    let currentFrame = 0;

    const animate = () => {
      if (currentFrame >= totalFrames) {
        mediaRecorder.stop();
        if (settings.addVoice) {
          window.speechSynthesis.cancel();
        }
        return;
      }

      const progress = currentFrame / totalFrames;
      setProgress(Math.round(progress * 100));

      // Clear canvas
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Apply effect
      const effectFn = effects[settings.effect] || effects.zoomIn;
      effectFn(ctx, img, canvas, progress);

      // Add vignette effect
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, canvas.width * 0.3,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.8
      );
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.5)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw text with typewriter effect
      const textProgress = Math.min(progress * 1.5, 1); // Text appears faster
      drawText(ctx, canvas, script, settings.textPosition, settings.textStyle, textProgress);

      // Draw watermark
      drawWatermark(ctx, canvas);

      currentFrame++;
      requestAnimationFrame(animate);
    };

    animate();
  };

  const downloadVideo = () => {
    if (videoUrl) {
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = `moviebuzz-promo-${Date.now()}.webm`;
      a.click();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-6 md:p-8 shadow-2xl border border-purple-700">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            🎬 Auto Video Generator
          </h2>
          <p className="text-gray-400 text-sm">
            Create promotional videos from image + script instantly
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Input Section */}
          <div className="space-y-4">
            {/* Image Upload */}
            <div>
              <label className="block text-white font-semibold mb-2">
                📷 Upload Image
              </label>
              <div 
                className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                  imagePreview ? 'border-green-500 bg-green-900/20' : 'border-gray-600 hover:border-purple-500'
                }`}
                onClick={() => document.getElementById('video-image-input').click()}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="max-h-40 mx-auto rounded-lg" />
                ) : (
                  <div className="py-8">
                    <div className="text-4xl mb-2">📁</div>
                    <p className="text-gray-400">Click to upload image</p>
                  </div>
                )}
                <input
                  id="video-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Script Input */}
            <div>
              <label className="block text-white font-semibold mb-2">
                📝 Script / Text
              </label>
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Enter your movie description or promotional text here...

Example:
🎬 DHURANDHAR
A high-intensity spy thriller
Starring Ranveer Singh
Coming Soon!"
                className="w-full h-40 px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            {/* Settings */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Duration</label>
                <select
                  value={settings.duration}
                  onChange={(e) => setSettings({...settings, duration: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm"
                >
                  <option value={10}>10 seconds</option>
                  <option value={15}>15 seconds</option>
                  <option value={20}>20 seconds</option>
                  <option value={30}>30 seconds</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Effect</label>
                <select
                  value={settings.effect}
                  onChange={(e) => setSettings({...settings, effect: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm"
                >
                  <option value="zoomIn">Zoom In</option>
                  <option value="zoomOut">Zoom Out</option>
                  <option value="panLeft">Pan Left</option>
                  <option value="panRight">Pan Right</option>
                  <option value="kenBurns">Ken Burns</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Text Position</label>
                <select
                  value={settings.textPosition}
                  onChange={(e) => setSettings({...settings, textPosition: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm"
                >
                  <option value="bottom">Bottom</option>
                  <option value="center">Center</option>
                  <option value="top">Top</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Text Style</label>
                <select
                  value={settings.textStyle}
                  onChange={(e) => setSettings({...settings, textStyle: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm"
                >
                  <option value="modern">Modern (White)</option>
                  <option value="cinematic">Cinematic (Gold)</option>
                  <option value="neon">Neon (Green)</option>
                </select>
              </div>
            </div>

            {/* Voice Option */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.addVoice}
                onChange={(e) => setSettings({...settings, addVoice: e.target.checked})}
                className="w-5 h-5 rounded bg-gray-800 border-gray-600 text-purple-500 focus:ring-purple-500"
              />
              <span className="text-white">🔊 Add Voice Narration (Browser TTS)</span>
            </label>

            {/* Generate Button */}
            <button
              onClick={generateVideo}
              disabled={isGenerating || !image || !script.trim()}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating... {progress}%
                </>
              ) : (
                <>🎬 Generate Video</>
              )}
            </button>
          </div>

          {/* Right: Preview & Output */}
          <div className="space-y-4">
            <label className="block text-white font-semibold mb-2">
              👁️ Preview & Output
            </label>
            
            {/* Canvas (hidden during generation, shown as preview) */}
            <div className="bg-black rounded-xl overflow-hidden aspect-video flex items-center justify-center">
              {videoUrl ? (
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  loop
                  className="w-full h-full object-contain"
                />
              ) : isGenerating ? (
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-white">Creating your video...</p>
                  <p className="text-purple-400 text-2xl font-bold">{progress}%</p>
                </div>
              ) : imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain opacity-50" />
              ) : (
                <div className="text-gray-500 text-center">
                  <div className="text-6xl mb-2">🎥</div>
                  <p>Video preview will appear here</p>
                </div>
              )}
            </div>

            {/* Hidden canvas for rendering */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Download Button */}
            {videoUrl && (
              <button
                onClick={downloadVideo}
                className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                ⬇️ Download Video (.webm)
              </button>
            )}

            {/* Info */}
            <div className="bg-gray-800/50 rounded-lg p-4 text-sm text-gray-400">
              <p className="font-semibold text-white mb-2">💡 Tips:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Use high-quality images for best results</li>
                <li>Keep script short for better readability</li>
                <li>Ken Burns effect works great for posters</li>
                <li>Video is rendered at 720p quality</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoGenerator;

