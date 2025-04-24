import { cn } from '@/shared/utils/cn';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ProfileHeaderProps {
  name: string;
  role: string;
  image: string;
  description: string;
  className?: string;
}

export function ProfileHeader({
  name,
  role,
  image,
  description,
  className = '',
}: ProfileHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn('flex flex-col items-center text-center space-y-4', className)}
    >
      <div className="relative w-32 h-32 rounded-full overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{name}</h3>
        <p className="text-lg text-gray-600 dark:text-gray-300">{role}</p>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">{description}</p>
      </div>
    </motion.div>
  );
}
