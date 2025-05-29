
import React from 'react';
import { Plus, Clock, Pill } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SideNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const SideNavigation: React.FC<SideNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: 'record', label: '記録', icon: Plus, color: 'indigo' },
    { id: 'history', label: '履歴', icon: Clock, color: 'indigo' },
    { id: 'medication', label: '薬剤管理', icon: Pill, color: 'indigo' },
  ];

  return (
    <nav className="w-64 bg-gradient-to-b from-white to-indigo-50 shadow-lg border-r border-indigo-100 p-4">
      <div className="space-y-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-4 rounded-xl text-left transition-all duration-300 transform hover:scale-105",
                "text-sm font-medium shadow-sm",
                isActive 
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg border-l-4 border-indigo-700" 
                  : "text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-md bg-indigo-50 hover:border-l-4 hover:border-l-indigo-300"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "animate-pulse")} />
              <span className="font-semibold">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
