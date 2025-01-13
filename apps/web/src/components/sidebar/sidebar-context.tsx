'use client';

import React from 'react';
import { type SidebarContextType } from './sidebar-types';

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined);

export function useSidebarContext() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebarContext must be used within a SidebarProvider');
  }
  return context;
}

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function SidebarProvider({ children, defaultOpen = false }: SidebarProviderProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  const toggle = React.useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return <SidebarContext.Provider value={{ isOpen, toggle }}>{children}</SidebarContext.Provider>;
}

export { SidebarContext };
