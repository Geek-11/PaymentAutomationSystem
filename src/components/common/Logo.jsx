import { BookOpen } from 'lucide-react';

const Logo = () => {
  return (
    <div className="flex items-center">
      <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-500" />
      <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
        EduPay
      </span>
    </div>
  );
};

export default Logo;