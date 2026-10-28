import { useEffect, useState } from 'react';
import { Clock, Eye, EyeOff, RefreshCw, ScanLine, Trash2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Button from '../components/ui/Button.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { MASCOTS } from '../constants/mascots.js';
import {
  deleteScanHistoryItem,
  getScanHistory,
  getScanHistoryItem,
} from '../services/historyService.js';

function getConfidencePercent(confidence) {
  if (confidence == null || confidence === '') return null;
  const value = Number(confidence);
  if (!Number.isFinite(value)) return null;
  return Math.round(value <= 1 ? value * 100 : value);
}

function formatCreatedAt(createdAt) {
  if (!createdAt) return 'Date unavailable';
  const date = new Date(createdAt);
  return Number.isNaN(date.getTime()) ? String(createdAt) : date.toLocaleString();
}

function ScanDetails({ scan }) {
  const confidence = getConfidencePercent(scan.confidence);

  return (
    <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
      {scan.imageUrl && (
        <img
          src={scan.imageUrl}
          alt={scan.category ? `Scanned ${scan.category}` : 'Scanned item'}
          className="mb-4 max-h-64 w-full rounded-lg object-contain"
        />
      )}
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-medium text-gray-500">Category</dt>
          <dd className="mt-1 capitalize text-gray-900">{scan.category || 'Unclassified'}</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-500">Confidence</dt>
          <dd className="mt-1 text-gray-900">{confidence === null ? '—' : `${confidence}%`}</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-500">Status</dt>
          <dd className="mt-1 text-gray-900">{scan.status || '—'}</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-500">Scanned</dt>
          <dd className="mt-1 text-gray-900">{formatCreatedAt(scan.createdAt)}</dd>
        </div>
      </dl>
      {scan.guidance && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <h3 className="font-semibold text-gray-900">Disposal guidance</h3>
          {scan.guidance.summary && (
            <p className="mt-1 text-sm leading-relaxed text-gray-600">{scan.guidance.summary}</p>
          )}
          {Array.isArray(scan.guidance.steps) && scan.guidance.steps.length > 0 && (
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
              {scan.guidance.steps.map((step, index) => <li key={`${index}-${step}`}>{step}</li>)}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default function History() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const location = useLocation();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [details, setDetails] = useState({});
  const [detailsLoadingId, setDetailsLoadingId] = useState(null);
  const [detailsErrors, setDetailsErrors] = useState({});
  const [deletingId, setDeletingId] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    if (authLoading) return undefined;
    if (!isAuthenticated) return undefined;

    const controller = new AbortController();
    async function loadHistory() {
      await Promise.resolve();
      if (controller.signal.aborted) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getScanHistory(controller.signal);
        if (!Array.isArray(data.scans) || data.scans.some((scan) => !scan || scan._id == null)) {
          throw new Error('The server returned an invalid scan history response.');
        }
        setScans(data.scans);
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadHistory();

    return () => controller.abort();
  }, [authLoading, isAuthenticated, refreshCount]);

  async function fetchDetails(id) {
    setDetailsLoadingId(id);
    setDetailsErrors((current) => ({ ...current, [id]: null }));
    try {
      const data = await getScanHistoryItem(id);
      const scan = data.scan || data;
      if (!scan || typeof scan !== 'object') {
        throw new Error('The server returned an invalid scan detail response.');
      }
      setDetails((current) => ({ ...current, [id]: scan }));
    } catch (requestError) {
      setDetailsErrors((current) => ({ ...current, [id]: requestError }));
    } finally {
      setDetailsLoadingId(null);
    }
  }

  async function toggleDetails(id) {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }

    setExpandedId(id);
    if (details[id]) return;
    await fetchDetails(id);
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this scan from your history?')) return;

    setDeletingId(id);
    setError(null);
    try {
      await deleteScanHistoryItem(id);
      setScans((current) => current.filter((scan) => String(scan._id) !== id));
      setExpandedId((current) => current === id ? null : current);
      setDetails((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      });
    } catch (requestError) {
      setError(requestError);
    } finally {
      setDeletingId(null);
    }
  }

  if (authLoading) {
    return (
      <PageContainer>
        <p className="py-16 text-center text-sm text-gray-500" role="status">Checking your sign-in status...</p>
      </PageContainer>
    );
  }

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
            <Button variant="primary" size="lg">Sign In to Unlock</Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  const authenticationError = error?.status === 401;

  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Scan History</h1>
            <p className="text-gray-600 mt-1">View your past waste classifications</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
            <p>{authenticationError ? 'Your session has expired. Please sign in again.' : error.message}</p>
            {authenticationError ? (
              <Link className="mt-3 inline-block font-semibold underline" to="/login" state={{ from: location }}>
                Sign in again
              </Link>
            ) : (
              <Button
                variant="secondary"
                className="mt-3"
                onClick={() => {
                  setLoading(true);
                  setRefreshCount((count) => count + 1);
                }}
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
            )}
          </div>
        )}

        {loading ? (
          <p className="py-16 text-center text-sm text-gray-500" role="status">Loading your scan history...</p>
        ) : !error && scans.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="No Scan History Yet"
            description="Your past waste classifications will appear here."
            action={
              <Link to="/scanner">
                <Button variant="primary">
                  <ScanLine className="w-4 h-4" />
                  Scan Your First Item
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {scans.map((scan) => {
              const id = String(scan._id);
              const confidence = getConfidencePercent(scan.confidence);
              const isExpanded = expandedId === id;

              return (
                <article key={id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    {scan.imageUrl ? (
                      <img
                        src={scan.imageUrl}
                        alt={scan.category ? `Scanned ${scan.category}` : 'Scanned item'}
                        className="h-20 w-20 rounded-xl border border-gray-100 object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                        <ScanLine className="h-7 w-7" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg font-semibold capitalize text-gray-900">
                        {scan.category || 'Unclassified'}
                      </h2>
                      <p className="mt-1 text-sm text-gray-600">
                        {confidence === null ? 'Confidence unavailable' : `${confidence}% confidence`}
                        {scan.status ? ` · ${scan.status}` : ''}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">{formatCreatedAt(scan.createdAt)}</p>
                    </div>
                    <div className="flex gap-2 sm:flex-col">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => toggleDetails(id)}
                        disabled={detailsLoadingId === id}
                        aria-expanded={isExpanded}
                      >
                        {isExpanded ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        {isExpanded ? 'Hide details' : 'Details'}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(id)}
                        loading={deletingId === id}
                        aria-label={`Delete ${scan.category || 'scan'} from history`}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>

                  {isExpanded && (
                    detailsLoadingId === id ? (
                      <p className="mt-4 text-sm text-gray-500" role="status">Loading scan details...</p>
                    ) : detailsErrors[id] ? (
                      <div className="mt-4 text-sm text-red-700" role="alert">
                        <p>{detailsErrors[id].status === 401
                          ? 'Your session has expired. Please sign in again.'
                          : detailsErrors[id].message}</p>
                        {detailsErrors[id].status === 401 ? (
                          <Link className="mt-2 inline-block font-semibold underline" to="/login" state={{ from: location }}>
                            Sign in again
                          </Link>
                        ) : (
                          <button
                            type="button"
                            className="mt-2 font-semibold underline"
                            onClick={() => fetchDetails(id)}
                          >
                            Retry
                          </button>
                        )}
                      </div>
                    ) : details[id] ? (
                      <ScanDetails scan={details[id]} />
                    ) : null
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
