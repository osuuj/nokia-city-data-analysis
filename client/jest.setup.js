import '@testing-library/jest-dom';
import React from 'react';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
    };
  },
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return React.createElement('img', props);
  },
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => React.createElement('div', props, children),
    section: ({ children, ...props }) => React.createElement('section', props, children),
  },
  useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
  useTransform: () => 0,
}));

// Mock @heroui/react
jest.mock('@heroui/react', () => ({
  Avatar: ({ children, ...props }) => React.createElement('div', props, children),
  Button: ({ children, type = 'button', ...props }) =>
    React.createElement(
      'button',
      { type: type === 'button' ? 'button' : type === 'submit' ? 'submit' : 'reset', ...props },
      children,
    ),
  Card: ({ children, ...props }) => React.createElement('div', props, children),
  CardBody: ({ children, ...props }) => React.createElement('div', props, children),
  Skeleton: ({ ...props }) => React.createElement('div', props),
}));

// Mock @iconify/react
jest.mock('@iconify/react', () => ({
  Icon: ({ ...props }) => React.createElement('span', props),
}));
