
import React from 'react';
import { Pill } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg">
            <Pill className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">シンプル服薬記録</h1>
        </div>
      </div>
    </header>
  );
};
