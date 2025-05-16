import { useNavigate } from 'react-router-dom';
import { FileWarning, ArrowLeft } from 'lucide-react';
import Button from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';

const NotFound = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  const handleGoHome = () => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/mentor');
    } else {
      navigate('/login');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center">
        <div className="flex justify-center">
          <FileWarning className="h-20 w-20 text-gray-400 dark:text-gray-500" />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">Page Not Found</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            variant="outline" 
            onClick={handleGoBack}
            leftIcon={<ArrowLeft size={16} />}
          >
            Go Back
          </Button>
          <Button onClick={handleGoHome}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;