
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
    { id: 'record', label: '記録', icon: Plus },
    { id: 'history', label: '履歴', icon: Clock },
    { id: 'medication', label: '薬剤管理', icon: Pill },
  ];

  return (
    <nav className="w-64 bg-white shadow-sm border-r border-gray-200 p-4">
      <div className="space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
                "text-sm font-medium",
                isActive 
                  ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
