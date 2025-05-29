
import React from 'react';
import { Plus, Clock, Pill } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: 'record', label: '記録', icon: Plus },
    { id: 'history', label: '履歴', icon: Clock },
    { id: 'medication', label: '薬剤管理', icon: Pill },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-3 px-2 transition-all duration-200",
                "text-xs font-medium border-t-2 border-transparent",
                isActive 
                  ? "text-blue-600 border-blue-600 bg-blue-50" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              )}
            >
              <Icon className={cn("w-5 h-5 mb-1", isActive && "scale-110")} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
