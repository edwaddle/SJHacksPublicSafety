import React, { useState, useRef, useEffect } from "react";
import { Camera, Image as ImageIcon, RefreshCw, Send, AlertCircle, Loader } from "lucide-react";

const CameraComponent = () => {
  const [stream, setStream] = useState(null);
  const [screenshot, setScreenshot] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    return () => {
      // Clean up the stream when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    setError(null);
    try {
      const userMedia = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "environment" // Prefer rear camera on mobile
        }
      });
      
      setStream(userMedia);
      
      if (videoRef.current) {
        videoRef.current.srcObject = userMedia;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const takeScreenshot = () => {
    if (!videoRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob/data URL
    canvas.toBlob((blob) => {
      setScreenshot(blob);
      stopCamera();
    }, 'image/jpeg', 0.95);
  };

  const resetCamera = () => {
    setScreenshot(null);
    setAnalysisResult(null);
    startCamera();
  };

  const analyzeImage = async () => {
    if (!screenshot) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('image', screenshot);
      
      const response = await fetch('http://localhost:4000/api/upload/analyze', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }
      
      const result = await response.json();
      setAnalysisResult(result);
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError('Failed to analyze image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskLevelClass = (level) => {
    switch (level) {
      case 'Low': return 'bg-green-600/20 text-green-400 border-green-600';
      case 'Moderate': return 'bg-yellow-600/20 text-yellow-400 border-yellow-600';
      case 'High': return 'bg-orange-600/20 text-orange-400 border-orange-600';
      case 'Extreme': return 'bg-red-600/20 text-red-400 border-red-600';
      default: return 'bg-slate-600/20 text-slate-400 border-slate-600';
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-xl font-semibold text-white">Wildfire Camera Analysis</h2>
      </div>
      
      <div className="p-4">
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} className="text-red-400" />
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        )}
        
        {!stream && !screenshot ? (
          <div className="flex justify-center">
            <button
              onClick={startCamera}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center gap-2"
            >
              <Camera size={18} />
              Start Camera
            </button>
          </div>
        ) : null}
        
        {stream && !screenshot ? (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={takeScreenshot}
                className="p-4 bg-amber-600 hover:bg-amber-700 rounded-full text-white"
              >
                <Camera size={24} />
              </button>
            </div>
          </div>
        ) : null}
        
        {screenshot && !analysisResult ? (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
              <img 
                src={URL.createObjectURL(screenshot)} 
                alt="Screenshot" 
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={resetCamera}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center gap-2"
              >
                <RefreshCw size={18} />
                Retake
              </button>
              
              <button
                onClick={analyzeImage}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 ${
                  isLoading ? 'bg-slate-600' : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Analyze
                  </>
                )}
              </button>
            </div>
          </div>
        ) : null}
        
        {analysisResult && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg overflow-hidden bg-black aspect-video">
                <img 
                  src={URL.createObjectURL(screenshot)} 
                  alt="Analyzed" 
                  className="w-full h-full object-contain"
                />
              </div>
              
              <div className="space-y-3">
                <div className={`p-3 border rounded-lg ${getRiskLevelClass(analysisResult.riskLevel)}`}>
                  <h3 className="font-semibold mb-1">Risk Assessment</h3>
                  <div className="flex justify-between">
                    <span>Detection:</span>
                    <span className="font-medium">{analysisResult.detection}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Risk Level:</span>
                    <span className="font-medium">{analysisResult.riskLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Risk Score:</span>
                    <span className="font-medium">{analysisResult.riskScore}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Confidence:</span>
                    <span className="font-medium">{analysisResult.confidence}</span>
                  </div>
                </div>
                
                <div className="p-3 bg-slate-700 rounded-lg">
                  <h3 className="font-semibold mb-1">Analysis</h3>
                  <p className="text-sm text-slate-300">{analysisResult.analysis}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={resetCamera}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center gap-2"
              >
                <Camera size={18} />
                Take Another Photo
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Hidden canvas for taking screenshots */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraComponent; 