import { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Zap, LogIn } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer.jsx';
import ImageUploader from '../components/scanner/ImageUploader.jsx';
import ClassificationResult from '../components/scanner/ClassificationResult.jsx';
import Button from '../components/ui/Button.jsx';
import { classifyImage } from '../services/classificationService.js';
import { MASCOTS } from '../constants/mascots.js';

export default function Scanner() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const handleFileSelect = useCallback((file) => {
    setSelectedFile(file);
    setResult(null);
    setError(null);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }, []);

  async function handleClassify() {
    if (!selectedFile || loading) return;

    setError(null);
    setResult(null);
    setLoading(true);

    // Create abort controller for cancellation
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const data = await classifyImage(selectedFile, controller.signal);
      setResult(data);
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err.message || 'Classification failed. Please try again.');
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  function handleScanAgain() {
    setSelectedFile(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
  }

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 border border-primary-100 rounded-3xl mb-4 shadow-sm p-3">
            <img src="/assets/Group 6.svg" alt="EcoSort AI" className="w-10 h-10 object-contain" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Waste Scanner</h1>
          <p className="mt-2 text-gray-600 text-sm sm:text-base">
            Upload an image of waste to identify its category and get disposal guidance.
          </p>
        </div>

        {/* Show result or upload interface */}
        {result ? (
          <ClassificationResult
            result={result}
            imagePreview={imagePreview}
            onScanAgain={handleScanAgain}
          />
        ) : (
          <div className="space-y-6">
            {/* Image Upload */}
            <ImageUploader
              onFileSelect={handleFileSelect}
              disabled={loading}
            />

            {/* Error States */}
            {error && (
              <div className="space-y-4">
                {error.toLowerCase().includes('token') ? (
                  /* Mascot 2 — Locked / Restricted Status State */
                  <div className="p-5 bg-amber-50 border border-amber-200 rounded-3xl flex flex-col sm:flex-row items-center gap-4">
                    <img
                      src={MASCOTS.LOCKED}
                      alt="Feature locked"
                      className="w-16 h-16 object-contain flex-shrink-0"
                    />
                    <div className="flex-1 text-center sm:text-left">
                      <h4 className="text-sm font-bold text-amber-900">Sign-in Required</h4>
                      <p className="text-xs text-amber-800 mt-0.5">
                        The classification endpoint requires an active session. Please sign in to scan items.
                      </p>
                    </div>
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors shadow-sm whitespace-nowrap"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      Sign In to Scan
                    </Link>
                  </div>
                ) : (
                  /* Mascot 6 — Error State (Red error badge) */
                  <div className="p-5 bg-red-50 border border-red-200 rounded-3xl flex items-center gap-4">
                    <img
                      src={MASCOTS.ERROR}
                      alt="Classification error"
                      className="w-14 h-14 object-contain flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-red-900">Classification Error</h4>
                      <p className="text-xs text-red-700 mt-0.5">{error}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mascot 5 — Loading State (Active Classification Only) */}
            {loading && (
              <div className="rounded-3xl border border-primary-200 bg-primary-50/80 p-8 text-center space-y-4">
                <div className="flex justify-center items-center">
                  <img
                    src={MASCOTS.LOADING}
                    alt="EcoSort AI analyzing waste image"
                    className="w-20 h-20 sm:w-24 sm:h-24 object-contain animate-pulse"
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Analyzing Your Waste Image...</h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                    Please wait while our deep learning model identifies the waste category and determines proper recycling steps.
                  </p>
                </div>
              </div>
            )}

            {/* Classify Button */}
            {selectedFile && !loading && (
              <Button
                variant="primary"
                size="lg"
                onClick={handleClassify}
                className="w-full"
              >
                <Zap className="w-5 h-5" />
                Classify Waste
              </Button>
            )}
          </div>
        )}
      </div>
    </PageContainer>
  );
}

