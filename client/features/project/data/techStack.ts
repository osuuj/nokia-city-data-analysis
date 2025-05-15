/**
 * Technology categories organized by domain
 */
export const TECH_CATEGORIES = {
  frontend: [
    'React',
    'Vue.js',
    'Angular',
    'TypeScript',
    'JavaScript',
    'HTML',
    'CSS',
    'Tailwind CSS',
    'SASS',
    'Redux',
    'Figma',
    'UI/UX',
  ],
  backend: [
    'Node.js',
    'Express',
    'Django',
    'Flask',
    'Ruby on Rails',
    'PHP',
    'Java',
    'Spring',
    'ASP.NET',
    'Go',
  ],
  database: [
    'MongoDB',
    'PostgreSQL',
    'MySQL',
    'Redis',
    'Firebase',
    'DynamoDB',
    'Cassandra',
    'SQLite',
  ],
  devops: [
    'AWS',
    'Azure',
    'Google Cloud',
    'Docker',
    'Kubernetes',
    'Jenkins',
    'GitHub Actions',
    'CircleCI',
  ],
  mobile: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Android', 'iOS', 'Expo'],
  ai: ['TensorFlow', 'PyTorch', 'Machine Learning', 'NLP', 'Computer Vision', 'BERT', 'OpenAI'],
};

/**
 * Mapping of tech names to icon identifiers
 */
export const TECH_ICONS: Record<string, string> = {
  React: 'logos:react',
  'Vue.js': 'logos:vue',
  Angular: 'logos:angular-icon',
  'Node.js': 'logos:nodejs-icon',
  MongoDB: 'logos:mongodb-icon',
  PostgreSQL: 'logos:postgresql',
  Firebase: 'logos:firebase',
  TypeScript: 'logos:typescript-icon',
  JavaScript: 'logos:javascript',
  Python: 'logos:python',
  TensorFlow: 'logos:tensorflow',
  AWS: 'logos:aws',
  Docker: 'logos:docker-icon',
  Kubernetes: 'logos:kubernetes',
  Redux: 'logos:redux',
  'Tailwind CSS': 'logos:tailwindcss-icon',
  GraphQL: 'logos:graphql',
  MySQL: 'logos:mysql',
  Git: 'logos:git-icon',
  HTML: 'logos:html-5',
  CSS: 'logos:css-3',
  SASS: 'logos:sass',
  Java: 'logos:java',
  Spring: 'logos:spring-icon',
  PHP: 'logos:php',
  Swift: 'logos:swift',
  Kotlin: 'logos:kotlin-icon',
  Flutter: 'logos:flutter',
  'React Native': 'logos:react',
  Ruby: 'logos:ruby',
  'Ruby on Rails': 'logos:rails',
  Go: 'logos:go',
  Redis: 'logos:redis',
  Jenkins: 'logos:jenkins',
  GitHub: 'logos:github-icon',
  Android: 'logos:android-icon',
  iOS: 'logos:ios',
  Azure: 'logos:microsoft-azure',
  'Google Cloud': 'logos:google-cloud',
  CircleCI: 'logos:circleci',
  Django: 'logos:django-icon',
  Flask: 'logos:flask',
  'ASP.NET': 'logos:dotnet',
  PyTorch: 'logos:pytorch-icon',
};

/**
 * Get the icon identifier for a technology
 */
export function getTechIcon(tech: string): string {
  return TECH_ICONS[tech] || 'lucide:code';
}

/**
 * Get the category for a technology
 */
export function getCategoryForTech(tech: string): string {
  for (const [category, list] of Object.entries(TECH_CATEGORIES)) {
    if (list.includes(tech)) return category;
  }
  return 'other';
}
