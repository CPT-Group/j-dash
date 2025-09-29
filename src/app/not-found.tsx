import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-synth-bg-primary flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-synth-text-bright mb-4">404</h1>
        <p className="text-xl text-synth-text-muted mb-8">Page not found</p>
        <Link 
          href="/" 
          className="px-6 py-3 bg-synth-neon-purple text-white rounded-lg hover:bg-synth-neon-purple/80 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
