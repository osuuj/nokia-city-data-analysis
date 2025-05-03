import { motion } from 'framer-motion';
import type React from 'react';
import { ReactTyped } from 'react-typed';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  type?: 'heading' | 'paragraph' | 'typed';
  typedStrings?: string[];
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className = '',
  delay = 0,
  type = 'heading',
  typedStrings,
}) => {
  if (type === 'typed' && typedStrings) {
    return (
      <div className={className}>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay }}
        >
          <ReactTyped
            strings={typedStrings}
            typeSpeed={50}
            backSpeed={30}
            backDelay={2000}
            loop
            smartBackspace
          />
        </motion.span>
      </div>
    );
  }

  if (type === 'paragraph') {
    return (
      <motion.p
        className={className}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: delay,
        }}
        viewport={{ once: true }}
      >
        {text}
      </motion.p>
    );
  }

  // For headings, animate each word
  const words = text.split(' ');

  return (
    <div className={`flex flex-wrap ${className}`}>
      {words.map((word) => (
        <motion.span
          key={word}
          className="mr-1.5"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + words.indexOf(word) * 0.1,
          }}
          viewport={{ once: true }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};

export default AnimatedText;
