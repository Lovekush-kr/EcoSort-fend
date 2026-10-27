/**
 * PageContainer — wraps page content with consistent padding and max-width
 */
export default function PageContainer({ children, className = '' }) {
  return (
    <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
      {children}
    </main>
  );
}

