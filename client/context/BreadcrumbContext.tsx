'use client';

import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface BreadcrumbContextType {
  currentPageTitle: string;
  setCurrentPageTitle: (title: string) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [currentPageTitle, setCurrentPageTitle] = useState<string>('');

  return (
    <BreadcrumbContext.Provider value={{ currentPageTitle, setCurrentPageTitle }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext);
  if (context === undefined) {
    throw new Error('useBreadcrumb must be used within a BreadcrumbProvider');
  }
  return context;
}
