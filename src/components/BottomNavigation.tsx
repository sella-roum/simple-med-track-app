
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
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-emerald-200 z-50 shadow-lg">
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
                "text-xs font-medium relative",
                isActive 
                  ? "text-emerald-600 bg-emerald-50" 
                  : "text-gray-500 hover:text-emerald-500 hover:bg-emerald-50"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 mb-1 transition-colors duration-200"
              )} />
              <span className={cn("font-medium", isActive && "font-semibold")}>{tab.label}</span>
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 rounded-b-full bg-emerald-600" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
