
import React from 'react';
import { Pill, Heart } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-xl shadow-lg">
            <Pill className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              シンプル服薬記録
            </h1>
            <Heart className="w-4 h-4 text-red-400" />
          </div>
        </div>
      </div>
    </header>
  );
};
