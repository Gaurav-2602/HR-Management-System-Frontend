import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, Home } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';

/**
 * Placeholder NotFoundPage.
 * Displays when route doesn't match any path.
 */
export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <EmptyState
          title="404 - Page Not Found"
          description="The page you are looking for does not exist, has been removed, or is temporarily unavailable."
          icon={HelpCircle}
          action={
            <Button
              variant="primary"
              icon={Home}
              onClick={() => navigate('/login')}
            >
              Go to Login
            </Button>
          }
        />
      </div>
    </div>
  );
}
