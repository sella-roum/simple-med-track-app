
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { BottomNavigation } from '@/components/BottomNavigation';
import { SideNavigation } from '@/components/SideNavigation';
import { RecordScreen } from '@/components/screens/RecordScreen';
import { HistoryScreen } from '@/components/screens/HistoryScreen';
import { MedicationManagementScreen } from '@/components/screens/MedicationManagementScreen';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [activeTab, setActiveTab] = useState('record');
  const isMobile = useIsMobile();

  const renderScreen = () => {
    switch (activeTab) {
      case 'record':
        return <RecordScreen />;
      case 'history':
        return <HistoryScreen />;
      case 'medication':
        return <MedicationManagementScreen />;
      default:
        return <RecordScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-teal-50">
      <Header />
      
      <div className="flex h-[calc(100vh-4rem)]">
        {!isMobile && (
          <SideNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        )}
        
        <main className={`flex-1 overflow-auto ${isMobile ? 'pb-20' : 'pl-0'}`}>
          <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-4xl">
            <div className="animate-fade-in">
              {renderScreen()}
            </div>
          </div>
        </main>
      </div>
      
      {isMobile && (
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </div>
  );
};

export default Index;
