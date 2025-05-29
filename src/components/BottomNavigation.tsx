
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
    { id: 'record', label: '記録', icon: Plus, color: 'blue' },
    { id: 'history', label: '履歴', icon: Clock, color: 'green' },
    { id: 'medication', label: '薬剤管理', icon: Pill, color: 'purple' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-2xl">
      <div className="flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-3 px-2 transition-all duration-300",
                "text-xs font-medium border-t-2 border-transparent relative",
                isActive 
                  ? `text-${tab.color}-600 border-${tab.color}-600 bg-${tab.color}-50` 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 mb-1 transition-all duration-200", 
                isActive && "scale-110 animate-pulse"
              )} />
              <span className={cn("font-semibold", isActive && "font-bold")}>{tab.label}</span>
              {isActive && (
                <div className={cn(
                  "absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-8 h-1 rounded-full",
                  `bg-${tab.color}-600`
                )} />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
