import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './components/LandingPage';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DashboardHome } from './components/DashboardHome';
import { ResumeAnalysis } from './components/ResumeAnalysis';
import { JobMatcher } from './components/JobMatcher';
import { InterviewPrep } from './components/InterviewPrep';
import { SettingsPanel } from './components/SettingsPanel';
import { HistoryPanel } from './components/HistoryPanel';

const AppContent: React.FC = () => {
  const { activeView } = useApp();

  // Show Landing Page standalone if active
  if (activeView === 'landing') {
    return <LandingPage />;
  }

  // Render Dashboard Layout for all other views
  return (
    <div className="app-container">
      {/* Navigation sidebar */}
      <Sidebar />

      {/* Main content viewport */}
      <main className="main-content">
        <Navbar />
        
        {/* Page body content */}
        <div className="scroll-container">
          {activeView === 'dashboard' && <DashboardHome />}
          {activeView === 'analysis' && <ResumeAnalysis />}
          {activeView === 'match' && <JobMatcher />}
          {activeView === 'interview' && <InterviewPrep />}
          {activeView === 'settings' && <SettingsPanel />}
          {activeView === 'history' && <HistoryPanel />}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
