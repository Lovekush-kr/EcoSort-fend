import { Clock, ScanLine } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Button from '../components/ui/Button.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { MASCOTS } from '../constants/mascots.js';

/**
 * History page — placeholder for future scan history
 *
 * STATUS: The history API endpoint is not yet documented or confirmed.
 * When unauthenticated, displays Mascot 2 (Locked Status State).
 * When authenticated, shows truthful empty state ready for backend integration.
 */
export default function History() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Mascot 2 — Locked / Restricted Status State
  if (!isAuthenticated) {
    return (
      <PageContainer>
        <div className="max-w-md mx-auto text-center py-16 space-y-6">
          <div className="w-28 h-28 mx-auto bg-amber-50 rounded-3xl border border-amber-200/80 flex items-center justify-center p-3 shadow-xs">
            <img
              src={MASCOTS.LOCKED}
              alt="Feature locked"
              className="w-20 h-20 object-contain drop-shadow-sm"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Scan History is Locked</h1>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              Authentication is required to view your personal scan history and past classifications.
            </p>
          </div>
          <Link to="/login" state={{ from: location }}>
            <Button variant="primary" size="lg">
              Sign In to Unlock
            </Button>
          </Link>
        </div>
      </PageContainer>
    );
  }
  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Scan History</h1>
            <p className="text-gray-600 mt-1">View your past waste classifications</p>
          </div>
        </div>

        <EmptyState
          icon={Clock}
          title="No Scan History Yet"
          description="The scan history feature is not yet connected to the backend. Once the history API is available, your past classifications will appear here."
          action={
            <Link to="/scanner">
              <Button variant="primary">
                <ScanLine className="w-4 h-4" />
                Scan Your First Item
              </Button>
            </Link>
          }
        />

        {/* Placeholder table structure for when backend is ready */}
        <div className="mt-8 rounded-2xl border border-dashed border-gray-300 p-8 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">
            Future: History table will display here
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Fields: Image &bull; Category &bull; Confidence &bull; Date &bull; Actions
          </p>
        </div>
      </div>
    </PageContainer>
  );
}

