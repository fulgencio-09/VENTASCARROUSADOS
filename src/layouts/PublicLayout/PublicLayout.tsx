/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Layout Shell Público
 */

import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface PublicLayoutProps {
  children: React.ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenPublish: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  comparisonCount: number;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({
  children,
  currentView,
  onNavigate,
  onOpenPublish,
  onOpenAuth,
  comparisonCount,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header
        currentView={currentView}
        onNavigate={onNavigate}
        onOpenPublish={onOpenPublish}
        onOpenAuth={onOpenAuth}
        comparisonCount={comparisonCount}
      />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
};
