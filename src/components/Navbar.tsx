import { useApp } from '../context/AppContext';
import type { AppView } from '../context/AppContext';
import { Upload, SlidersHorizontal, FileCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    activeResume, 
    settings, 
    updateSettings 
  } = useApp();

  const getViewTitle = (view: AppView) => {
    switch (view) {
      case 'dashboard': return 'Dashboard';
      case 'analysis': return 'Resume ATS Analysis';
      case 'match': return 'Job Matching & Gap Analysis';
      case 'interview': return 'Interview Preparation Coach';
      case 'history': return 'Resume History & Versions';
      case 'settings': return 'System Settings';
      default: return 'Resume Forge';
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings({ targetRole: e.target.value });
  };

  const targetRoles = [
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Fullstack Developer',
    'DevOps Engineer',
    'Data Scientist',
    'Product Manager',
    'UI/UX Designer'
  ];

  return (
    <header className="navbar-container" style={navbarStyle}>
      {/* Title */}
      <div style={titleAreaStyle}>
        <h1 style={titleStyle}>{getViewTitle(activeView)}</h1>
        <p style={subtitleStyle}>AI-powered recruitment readiness suite</p>
      </div>

      {/* Toolbar Actions */}
      <div style={toolbarStyle}>
        {/* Role Selector */}
        {activeView !== 'landing' && (
          <div style={roleSelectorContainerStyle}>
            <SlidersHorizontal size={14} color="var(--text-muted)" />
            <span style={roleLabelStyle}>Target:</span>
            <select 
              value={settings.targetRole} 
              onChange={handleRoleChange} 
              style={selectRoleStyle}
            >
              {targetRoles.map(role => (
                <option key={role} value={role} style={optionStyle}>{role}</option>
              ))}
            </select>
          </div>
        )}

        {/* Score display shortcut */}
        {activeResume && (
          <div 
            onClick={() => setActiveView('analysis')}
            style={{
              ...scoreBadgeStyle,
              borderColor: activeResume.atsScore >= 80 ? 'rgba(16, 185, 129, 0.3)' : activeResume.atsScore >= 60 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(244, 63, 94, 0.3)',
              background: activeResume.atsScore >= 80 ? 'rgba(16, 185, 129, 0.05)' : activeResume.atsScore >= 60 ? 'rgba(245, 158, 11, 0.05)' : 'rgba(244, 63, 94, 0.05)'
            }}
          >
            <FileCheck size={14} color={activeResume.atsScore >= 80 ? 'var(--accent-emerald)' : activeResume.atsScore >= 60 ? 'var(--accent-amber)' : 'var(--accent-rose)'} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>ATS: {activeResume.atsScore}</span>
          </div>
        )}

        {/* Quick Upload Button */}
        {activeView !== 'analysis' && (
          <button 
            onClick={() => setActiveView('analysis')} 
            className="btn btn-primary" 
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            <Upload size={14} />
            <span>Upload PDF</span>
          </button>
        )}
      </div>
    </header>
  );
};

// Inline CSS Styles for custom navbar details
const navbarStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '1.25rem 2.5rem',
  borderBottom: '1px solid var(--border-light)',
  backgroundColor: 'rgba(3, 0, 20, 0.4)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  zIndex: 10,
  flexShrink: 0
};

const titleAreaStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.15rem'
};

const titleStyle: React.CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 700,
  color: '#fff',
  letterSpacing: '-0.02em'
};

const subtitleStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'var(--text-muted)'
};

const toolbarStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem'
};

const roleSelectorContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
  padding: '0.45rem 0.75rem',
  borderRadius: '8px',
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid var(--border-light)',
  fontSize: '0.8rem'
};

const roleLabelStyle: React.CSSProperties = {
  color: 'var(--text-muted)',
  fontWeight: 500
};

const selectRoleStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#fff',
  fontWeight: 600,
  cursor: 'pointer',
  outline: 'none',
  fontFamily: 'var(--font-body)'
};

const optionStyle: React.CSSProperties = {
  backgroundColor: '#0a0a14',
  color: '#fff'
};

const scoreBadgeStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
  padding: '0.45rem 0.75rem',
  borderRadius: '8px',
  border: '1px solid transparent',
  cursor: 'pointer',
  transition: 'transform 0.2s ease'
};
