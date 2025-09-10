
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Prediction, loadModel, predict } from './services/mnistService';
import { Canvas, CanvasHandle } from './components/Canvas';
import { Loader } from './components/Loader';
import { GithubIcon } from './components/icons/GithubIcon';
import { PredictionResult } from './components/PredictionResult';

const App: React.FC = () => {
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<CanvasHandle>(null);

  useEffect(() => {
    const initializeModel = async () => {
      try {
        setError(null);
        const loadedModel = await loadModel();
        setModel(loadedModel);
      } catch (err) {
        console.error("Error loading model:", err);
        setError("Failed to load the AI model. Please refresh the page to try again.");
      } finally {
        setIsLoading(false);
      }
    };
    initializeModel();
  }, []);

  const handleRecognize = useCallback(async () => {
    if (!model || !canvasRef.current) return;
    
    const canvas = canvasRef.current.getCanvas();
    if (!canvas || canvasRef.current.isCanvasEmpty()) {
        alert("Please draw a digit first!");
        return;
    }

    setIsPredicting(true);
    setPrediction(null);
    try {
      const imageData = canvas.getContext('2d')?.getImageData(0, 0, canvas.width, canvas.height);
      if (imageData) {
        const result = await predict(model, imageData);
        setPrediction(result);
      }
    } catch (err) {
      console.error("Prediction error:", err);
      setError("An error occurred during recognition.");
    } finally {
      setIsPredicting(false);
    }
  }, [model]);

  const handleClear = () => {
    canvasRef.current?.clearCanvas();
    setPrediction(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        <header className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            Handwritten Digit Recognizer
          </h1>
          <p className="text-slate-400 mt-2 text-lg">
            Draw a digit (0-9) and let the AI guess what it is!
          </p>
        </header>

        <main className="w-full flex flex-col lg:flex-row gap-8 items-center justify-center">
          <div className="relative w-full max-w-md aspect-square p-2 bg-slate-800 rounded-xl shadow-2xl shadow-indigo-500/10 border border-slate-700">
            {isLoading && (
              <div className="absolute inset-0 bg-slate-800/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl z-10">
                <Loader />
                <p className="mt-4 text-slate-300">Loading AI Model...</p>
              </div>
            )}
            <Canvas ref={canvasRef} width={280} height={280} />
          </div>
          
          <div className="w-full lg:w-80 flex flex-col items-center lg:items-start gap-6">
            <div className="w-full flex flex-row lg:flex-col gap-4">
              <button
                onClick={handleRecognize}
                disabled={isLoading || isPredicting}
                className="w-full flex-1 text-lg font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
              >
                {isPredicting ? 'Recognizing...' : 'Recognize'}
              </button>
              <button
                onClick={handleClear}
                disabled={isLoading || isPredicting}
                className="w-full flex-1 text-lg font-semibold bg-slate-600 hover:bg-slate-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-slate-500/50"
              >
                Clear
              </button>
            </div>
            
            <div className="w-full h-48 bg-slate-800 rounded-lg p-4 border border-slate-700 flex items-center justify-center">
              {isPredicting && <Loader />}
              {!isPredicting && prediction && <PredictionResult prediction={prediction} />}
              {!isPredicting && !prediction && !error && <p className="text-slate-400 text-center">Prediction will appear here.</p>}
              {!isPredicting && error && <p className="text-red-400 text-center">{error}</p>}
            </div>
          </div>
        </main>
        
        <footer className="mt-10 text-center text-slate-500">
          <p>Powered by TensorFlow.js and React</p>
          <a
            href="https://github.com/google/generative-ai-docs/tree/main/site/en/gemini-api/docs/applications/prompt_gallery"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-indigo-400 transition-colors mt-2"
          >
            <GithubIcon className="w-5 h-5" />
            <span>View on GitHub</span>
          </a>
        </footer>
      </div>
    </div>
  );
};

export default App;
