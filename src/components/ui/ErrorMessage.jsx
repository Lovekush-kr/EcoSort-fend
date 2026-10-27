import { AlertCircle, X } from 'lucide-react';
import { useState } from 'react';

/**
 * Error message display component
 */
export default function ErrorMessage({ message, onDismiss, className = '' }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !message) return null;

  function handleDismiss() {
    setDismissed(true);
    onDismiss?.();
  }

  return (
    <div className={`flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 ${className}`} role="alert">
      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <p className="text-sm flex-1">{message}</p>
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors"
        aria-label="Dismiss error"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

