'use client';

import Image from 'next/image';
import React from 'react';

export default function JuusoProfile() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative w-32 h-32 rounded-full overflow-hidden">
              <Image
                src="/images/team/juuso.jpg"
                alt="Juuso"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Juuso</h1>
              <p className="text-gray-600 dark:text-gray-300">Software Developer</p>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Passionate about creating elegant solutions to complex problems.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">About</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Juuso is a software developer with expertise in web technologies and data
              visualization. He enjoys building user-friendly applications that solve real-world
              problems.
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {[
                'JavaScript',
                'TypeScript',
                'React',
                'Next.js',
                'Node.js',
                'Python',
                'Data Visualization',
              ].map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-800 dark:text-gray-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Contact</h2>
            <div className="flex space-x-4">
              <a
                href="https://github.com/juuso"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/juuso"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
