import React, { createContext, useContext, useState, useEffect } from 'react';
import { analyzeResume, matchJobDescription } from '../services/analyzerEngine';
import type { ResumeAnalysisResult, JobMatchResult } from '../services/analyzerEngine';
import { extractTextFromPDF } from '../services/pdfParser';

export type AppView = 'landing' | 'dashboard' | 'analysis' | 'match' | 'interview' | 'settings' | 'history';

export interface AppSettings {
  selectedModel: string;
  simulatedLatency: number; // in ms
  targetRole: string;
  theme: 'dark';
}

interface AppContextType {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  resumes: ResumeAnalysisResult[];
  activeResume: ResumeAnalysisResult | null;
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  isAnalyzing: boolean;
  analysisProgress: number;
  uploadError: string | null;
  handleFileUpload: (file: File) => Promise<void>;
  updateResumeText: (text: string) => void;
  deleteResume: (id: string) => void;
  selectResume: (id: string) => void;
  jobDescription: string;
  setJobDescription: (jd: string) => void;
  jobMatchResult: JobMatchResult | null;
  isMatching: boolean;
  runJobMatch: (jd: string) => Promise<void>;
  toggleChecklistItem: (itemId: string) => void;
  resetAllData: () => void;
}

const defaultSettings: AppSettings = {
  selectedModel: 'Gemini 1.5 Pro',
  simulatedLatency: 1500,
  targetRole: 'Fullstack Developer',
  theme: 'dark'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<AppView>('landing');
  const [resumes, setResumes] = useState<ResumeAnalysisResult[]>([]);
  const [activeResumeId, setActiveResumeId] = useState<string | null>(null);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const [jobDescription, setJobDescription] = useState('');
  const [jobMatchResult, setJobMatchResult] = useState<JobMatchResult | null>(null);
  const [isMatching, setIsMatching] = useState(false);

  // Load initial state from localStorage
  useEffect(() => {
    try {
      const storedResumes = localStorage.getItem('rf_resumes');
      const storedSettings = localStorage.getItem('rf_settings');
      const storedActiveId = localStorage.getItem('rf_active_id');
      const storedJd = localStorage.getItem('rf_job_description');

      if (storedResumes) {
        const parsed = JSON.parse(storedResumes);
        setResumes(parsed);
      }
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
      if (storedActiveId) {
        setActiveResumeId(storedActiveId);
      }
      if (storedJd) {
        setJobDescription(storedJd);
      }
    } catch (e) {
      console.error('Failed to load local storage state:', e);
    }
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    if (resumes.length > 0) {
      localStorage.setItem('rf_resumes', JSON.stringify(resumes));
    } else {
      localStorage.removeItem('rf_resumes');
    }
  }, [resumes]);

  useEffect(() => {
    localStorage.setItem('rf_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (activeResumeId) {
      localStorage.setItem('rf_active_id', activeResumeId);
    } else {
      localStorage.removeItem('rf_active_id');
    }
  }, [activeResumeId]);

  useEffect(() => {
    localStorage.setItem('rf_job_description', jobDescription);
  }, [jobDescription]);

  const activeResume = resumes.find(r => r.id === activeResumeId) || null;

  // Recalculate job match if active resume or target job description changes
  useEffect(() => {
    if (activeResume && jobDescription.trim()) {
      const res = matchJobDescription(activeResume.skills, jobDescription);
      setJobMatchResult(res);
    } else {
      setJobMatchResult(null);
    }
  }, [activeResumeId, jobDescription]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    
    setIsAnalyzing(true);
    setUploadError(null);
    setAnalysisProgress(10);
    
    try {
      // Simulate reading setup
      await new Promise(r => setTimeout(r, 200));
      setAnalysisProgress(30);
      
      const text = await extractTextFromPDF(file);
      setAnalysisProgress(60);
      
      // Simulate processing latency based on settings
      await new Promise(r => setTimeout(r, settings.simulatedLatency));
      setAnalysisProgress(95);
      
      const analysis = analyzeResume(file.name, file.size, text, settings.targetRole);
      
      setResumes(prev => {
        const index = prev.findIndex(r => r.fileName === file.name);
        if (index >= 0) {
          // If overwriting or uploading same file, replace it
          const updated = [...prev];
          updated[index] = analysis;
          return updated;
        }
        return [analysis, ...prev];
      });
      
      setActiveResumeId(analysis.id);
      setAnalysisProgress(100);
      
      // Wait for progress animation to complete
      await new Promise(r => setTimeout(r, 300));
      setIsAnalyzing(false);
      setActiveView('dashboard');
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || 'An error occurred during resume analysis.');
      setIsAnalyzing(false);
    }
  };

  const updateResumeText = (newText: string) => {
    if (!activeResume) return;

    // Create a new analysis version based on updated text
    const reAnalyzed = analyzeResume(
      activeResume.fileName,
      new Blob([newText]).size,
      newText,
      settings.targetRole
    );

    // Keep the same ID or create version history?
    // Let's replace the active one in history but keep track
    setResumes(prev => prev.map(r => r.id === activeResume.id ? { ...reAnalyzed, id: r.id, timestamp: Date.now() } : r));
  };

  const deleteResume = (id: string) => {
    setResumes(prev => prev.filter(r => r.id !== id));
    if (activeResumeId === id) {
      const remaining = resumes.filter(r => r.id !== id);
      setActiveResumeId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const selectResume = (id: string) => {
    setActiveResumeId(id);
  };

  const runJobMatch = async (jd: string) => {
    if (!activeResume || !jd.trim()) return;
    
    setIsMatching(true);
    setJobDescription(jd);
    
    // Simulate AI match loading
    await new Promise(r => setTimeout(r, 800));
    
    const result = matchJobDescription(activeResume.skills, jd);
    setJobMatchResult(result);
    setIsMatching(false);
  };

  const toggleChecklistItem = (itemId: string) => {
    if (!activeResume) return;
    
    setResumes(prev => prev.map(r => {
      if (r.id === activeResume.id) {
        return {
          ...r,
          checklist: r.checklist.map(item => 
            item.id === itemId ? { ...item, done: !item.done } : item
          )
        };
      }
      return r;
    }));
  };

  const resetAllData = () => {
    setResumes([]);
    setActiveResumeId(null);
    setJobDescription('');
    setJobMatchResult(null);
    setSettings(defaultSettings);
    localStorage.clear();
    setActiveView('landing');
  };

  return (
    <AppContext.Provider value={{
      activeView,
      setActiveView,
      resumes,
      activeResume,
      settings,
      updateSettings,
      isAnalyzing,
      analysisProgress,
      uploadError,
      handleFileUpload,
      updateResumeText,
      deleteResume,
      selectResume,
      jobDescription,
      setJobDescription,
      jobMatchResult,
      isMatching,
      runJobMatch,
      toggleChecklistItem,
      resetAllData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
