import React from 'react';
import { Link } from 'wouter';
import { useLanguage } from '../contexts/LanguageContext';

export function Navigation() {
  const { t } = useLanguage();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <a className="text-xl font-bold">Honor Gold</a>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/">
                <a className="text-gray-900 dark:text-white hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium">
                  {t('common.home')}
                </a>
              </Link>
              <Link href="/settings">
                <a className="text-gray-900 dark:text-white hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium">
                  {t('settings.title')}
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}