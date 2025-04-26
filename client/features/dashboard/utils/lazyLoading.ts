import React, { lazy, Suspense } from 'react';

interface LazyComponentConfig {
  path: string;
  componentName: string;
}

export const createLazyComponent = ({ path, componentName }: LazyComponentConfig) => {
  const Component = lazy(() => import(`../views/${path}`));
  Component.displayName = componentName;
  return Component;
};

export const preloadComponents = (components: LazyComponentConfig[]) => {
  for (const { path } of components) {
    const componentPath = `../views/${path}`;
    import(/* webpackPrefetch: true */ componentPath);
  }
};
