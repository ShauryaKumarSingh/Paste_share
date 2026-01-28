import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)' }}>
      <div className="container-custom max-w-2xl text-center">
        <Card className="space-y-6">
          <div className="text-6xl font-bold gradient-text">404</div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
            <p className="text-gray-400 mb-6">
              The page you're looking for doesn't exist or has been removed.
            </p>
          </div>
          <Link href="/">
            <Button size="lg">← Back to Home</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
