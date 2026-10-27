import { CheckCircle, AlertTriangle, XCircle, RefreshCw, Recycle, Trash2, Info } from 'lucide-react';
import Button from '../ui/Button.jsx';
import { MASCOTS } from '../../constants/mascots.js';

/**
 * ClassificationResult — displays the actual classification response
 *
 * Response mapping assumptions (update after verifying backend schema):
 * The component tries multiple field names for resilience.
 */
function getField(data, ...keys) {
  for (const key of keys) {
    if (data[key] !== undefined && data[key] !== null) return data[key];
  }
  return null;
}

/**
 * Determine confidence level for visual styling
 */
function getConfidenceLevel(confidence) {
  if (confidence >= 0.8) return { level: 'high', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle, label: 'High Confidence' };
  if (confidence >= 0.5) return { level: 'medium', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', icon: AlertTriangle, label: 'Medium Confidence' };
  return { level: 'low', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: XCircle, label: 'Low Confidence' };
}

/**
 * Category styling
 */
const categoryStyles = {
  plastic: { emoji: '♻️', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
  paper: { emoji: '📄', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  glass: { emoji: '🪟', color: 'text-cyan-700', bg: 'bg-cyan-50', border: 'border-cyan-200' },
  metal: { emoji: '🔩', color: 'text-gray-700', bg: 'bg-gray-100', border: 'border-gray-300' },
  organic: { emoji: '🌿', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
  'e-waste': { emoji: '🔌', color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200' },
};

function getCategoryStyle(category) {
  const key = category?.toLowerCase?.()?.trim?.();
  return categoryStyles[key] || { emoji: '🗑️', color: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200' };
}

export default function ClassificationResult({ result, imagePreview, onScanAgain }) {
  if (!result) return null;

  // Extract fields — try multiple possible field names
  const category = getField(result, 'category', 'prediction', 'class', 'label', 'waste_type', 'wasteType');
  const confidence = getField(result, 'confidence', 'confidence_score', 'score', 'probability');
  const guidance = getField(result, 'guidance', 'disposal_guidance', 'disposalGuidance', 'disposal', 'recommendation');
  const steps = getField(result, 'steps', 'disposal_steps', 'disposalSteps', 'instructions');
  const description = getField(result, 'description', 'details', 'info');
  const modelUnavailable = result.model_unavailable || result.modelUnavailable;

  // Handle model unavailable
  if (modelUnavailable) {
    return (
      <div className="rounded-2xl border-2 border-yellow-200 bg-yellow-50 p-6 text-center">
        <AlertTriangle className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">ML Model Unavailable</h3>
        <p className="text-sm text-yellow-700 mb-4">
          The classification model is temporarily unavailable. Please try again shortly.
        </p>
        <Button variant="secondary" onClick={onScanAgain}>
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      </div>
    );
  }

  // Handle missing category
  if (!category) {
    return (
      <div className="rounded-2xl border-2 border-gray-200 bg-gray-50 p-6 text-center">
        <Info className="w-10 h-10 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Classification Result</h3>
        <p className="text-sm text-gray-500 mb-4">
          The server returned a response but no waste category was identified.
        </p>
        <Button variant="secondary" onClick={onScanAgain}>
          <RefreshCw className="w-4 h-4" />
          Try Another Image
        </Button>
      </div>
    );
  }

  const catStyle = getCategoryStyle(category);
  const confidenceNum = typeof confidence === 'number' ? confidence : parseFloat(confidence);
  const hasConfidence = !isNaN(confidenceNum);
  const confidencePercent = hasConfidence ? Math.round(confidenceNum * (confidenceNum <= 1 ? 100 : 1)) : null;
  const confLevel = hasConfidence ? getConfidenceLevel(confidenceNum <= 1 ? confidenceNum : confidenceNum / 100) : null;

  return (
    <div className="space-y-6">
      {/* Main Result Card */}
      <div className={`rounded-2xl border-2 ${catStyle.border} ${catStyle.bg} overflow-hidden`}>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Image preview */}
            {imagePreview && (
              <div className="w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 border border-white/50 shadow-sm">
                <img src={imagePreview} alt="Scanned waste" className="w-full h-full object-cover" />
              </div>
            )}

            {/* Result info */}
            <div className="flex-1 text-center sm:text-left">
              <p className="text-sm font-medium text-gray-500 mb-1">Identified as</p>
              <h2 className={`text-3xl font-bold ${catStyle.color} capitalize flex items-center justify-center sm:justify-start gap-3`}>
                <span className="text-4xl">{catStyle.emoji}</span>
                {category}
              </h2>

              {/* Confidence */}
              {hasConfidence && confLevel && (
                <div className="mt-3 flex items-center justify-center sm:justify-start gap-2">
                  <confLevel.icon className={`w-4 h-4 ${confLevel.color}`} />
                  <span className={`text-sm font-semibold ${confLevel.color}`}>
                    {confidencePercent}% — {confLevel.label}
                  </span>
                </div>
              )}

              {hasConfidence && (
                <div className="mt-2 w-full max-w-xs">
                  <div className="h-2 bg-white/70 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        confidencePercent >= 80 ? 'bg-green-500' : confidencePercent >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${confidencePercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Mascot 4 — Successful Classification Mascot */}
            <div className="flex-shrink-0 flex items-center justify-center p-2 bg-white/60 rounded-2xl border border-white/80 shadow-xs">
              <img
                src={MASCOTS.SUCCESS}
                alt="Confirmed classification mascot"
                className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Disposal Guidance */}
      {guidance && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
            <Recycle className="w-5 h-5 text-primary-600" />
            Disposal Guidance
          </h3>
          <p className="text-gray-600 leading-relaxed">{guidance}</p>
        </div>
      )}

      {/* Disposal Steps */}
      {steps && Array.isArray(steps) && steps.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
            <Trash2 className="w-5 h-5 text-primary-600" />
            How to Dispose
          </h3>
          <ol className="space-y-3">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold text-xs">
                  {i + 1}
                </span>
                <span className="text-gray-600 pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Description */}
      {description && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
            <Info className="w-5 h-5 text-primary-600" />
            Details
          </h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
      )}

      {/* Low confidence warning */}
      {confLevel && confLevel.level === 'low' && (
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-700">
            The model has low confidence in this classification. The image may not clearly show a single waste item, or it may be a type not well-represented in the training data. Consider trying a clearer photo.
          </p>
        </div>
      )}

      {/* Scan Again */}
      <div className="text-center pt-2">
        <Button variant="primary" size="lg" onClick={onScanAgain}>
          <RefreshCw className="w-5 h-5" />
          Scan Another Item
        </Button>
      </div>
    </div>
  );
}

