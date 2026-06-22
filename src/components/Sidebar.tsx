import { useApp } from '../context/AppContext';
import type { AppView } from '../context/AppContext';
import { 
  LayoutDashboard, 
  FileSearch, 
  Target, 
  HelpCircle, 
  Settings, 
  History, 
  FileText, 
  Upload, 
  Trash2,
  Cpu
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    resumes, 
    activeResume, 
    selectResume, 
    deleteResume 
  } = useApp();

  const menuItems = [
    { id: 'dashboard' as AppView, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analysis' as AppView, label: 'Resume Analysis', icon: FileSearch },
    { id: 'match' as AppView, label: 'Job Matching', icon: Target },
    { id: 'interview' as AppView, label: 'Interview Prep', icon: HelpCircle },
    { id: 'history' as AppView, label: 'Resume History', icon: History },
    { id: 'settings' as AppView, label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="sidebar-container" style={sidebarStyle}>
      {/* Brand Header */}
      <div className="brand-header" style={brandHeaderStyle} onClick={() => setActiveView('landing')}>
        <div className="logo-glow" style={logoGlowStyle}>
          <Cpu size={22} color="#a78bfa" />
        </div>
        <span className="brand-name" style={brandNameStyle}>Resume<span style={{ color: '#60a5fa' }}>Forge</span></span>
      </div>

      {/* Main Navigation */}
      <nav className="nav-menu" style={navMenuStyle}>
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`nav-item ${isActive ? 'active' : ''}`}
              style={{
                ...navItemStyle,
                backgroundColor: isActive ? 'rgba(139, 92, 246, 0.12)' : 'transparent',
                borderColor: isActive ? 'rgba(139, 92, 246, 0.3)' : 'transparent',
                color: isActive ? '#fff' : 'var(--text-muted)'
              }}
            >
              <Icon size={18} style={{ color: isActive ? '#a78bfa' : 'currentColor' }} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Active Resume Panel */}
      <div className="active-resume-sidebar" style={activeResumeSidebarStyle}>
        <div style={sidebarSectionHeaderStyle}>Active Document</div>
        {activeResume ? (
          <div className="active-doc-card" style={docCardStyle}>
            <div style={docCardMetaStyle}>
              <FileText size={16} color="#60a5fa" style={{ flexShrink: 0 }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={docCardNameStyle} title={activeResume.fileName}>{activeResume.fileName}</div>
                <div style={docCardSizeStyle}>{activeResume.fileSize}</div>
              </div>
            </div>
            
            <div style={docCardMetricsStyle}>
              <div>
                <span style={docCardLabelStyle}>ATS Score:</span>
                <span style={{ 
                  fontWeight: 700, 
                  color: activeResume.atsScore >= 80 ? 'var(--accent-emerald)' : activeResume.atsScore >= 60 ? 'var(--accent-amber)' : 'var(--accent-rose)'
                }}> {activeResume.atsScore}</span>
              </div>
              <span className={`badge ${
                activeResume.atsScore >= 80 ? 'badge-success' : activeResume.atsScore >= 60 ? 'badge-warning' : 'badge-danger'
              }`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                {activeResume.grade}
              </span>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => setActiveView('analysis')}
            className="sidebar-upload-trigger" 
            style={uploadTriggerStyle}
          >
            <Upload size={16} color="var(--text-muted)" />
            <span>Upload Resume</span>
          </div>
        )}
      </div>

      {/* History Checklist Panel */}
      {resumes.length > 1 && (
        <div className="sidebar-recent-resumes" style={recentResumesContainerStyle}>
          <div style={sidebarSectionHeaderStyle}>Documents</div>
          <div style={recentListStyle}>
            {resumes.map(res => (
              <div key={res.id} style={recentItemRowStyle}>
                <button
                  onClick={() => selectResume(res.id)}
                  style={{
                    ...recentItemBtnStyle,
                    color: activeResume?.id === res.id ? '#fff' : 'var(--text-muted)',
                    fontWeight: activeResume?.id === res.id ? 600 : 400
                  }}
                >
                  <FileText size={12} />
                  <span style={recentItemNameStyle}>{res.fileName}</span>
                </button>
                <button 
                  onClick={() => deleteResume(res.id)}
                  style={recentDeleteBtnStyle}
                  title="Remove document"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Profile info */}
      <div className="sidebar-footer" style={sidebarFooterStyle}>
        <div style={profileContainerStyle}>
          <div style={avatarStyle}>RF</div>
          <div>
            <div style={profileNameStyle}>Professional Dev</div>
            <div style={profileRoleStyle}>Active Member</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

// Inline CSS Styles for custom design details
const sidebarStyle: React.CSSProperties = {
  width: '260px',
  backgroundColor: 'var(--bg-sidebar)',
  borderRight: '1px solid var(--border-light)',
  display: 'flex',
  flexDirection: 'column',
  padding: '1.5rem 1rem',
  height: '100vh',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  flexShrink: 0
};

const brandHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  marginBottom: '2rem',
  cursor: 'pointer',
  padding: '0 0.5rem'
};

const logoGlowStyle: React.CSSProperties = {
  width: '32px',
  height: '32px',
  borderRadius: '8px',
  background: 'rgba(139, 92, 246, 0.15)',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 0 15px rgba(139, 92, 246, 0.2)'
};

const brandNameStyle: React.CSSProperties = {
  fontFamily: 'var(--font-heading)',
  fontSize: '1.2rem',
  fontWeight: 800,
  letterSpacing: '-0.03em',
  color: '#fff'
};

const navMenuStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem',
  marginBottom: '1.5rem'
};

const navItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.7rem 0.85rem',
  borderRadius: '8px',
  border: '1px solid transparent',
  fontFamily: 'var(--font-body)',
  fontSize: '0.9rem',
  fontWeight: 500,
  textAlign: 'left',
  cursor: 'pointer',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
};

const activeResumeSidebarStyle: React.CSSProperties = {
  marginTop: 'auto',
  padding: '1rem 0.25rem 0.5rem 0.25rem',
  borderTop: '1px solid rgba(255,255,255,0.05)'
};

const sidebarSectionHeaderStyle: React.CSSProperties = {
  fontSize: '0.7rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  color: 'var(--text-dark)',
  letterSpacing: '0.05em',
  marginBottom: '0.75rem'
};

const docCardStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid var(--border-light)',
  borderRadius: '10px',
  padding: '0.75rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
};

const docCardMetaStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem'
};

const docCardNameStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  fontWeight: 600,
  color: '#fff',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
};

const docCardSizeStyle: React.CSSProperties = {
  fontSize: '0.7rem',
  color: 'var(--text-muted)'
};

const docCardMetricsStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: '0.75rem',
  borderTop: '1px solid rgba(255,255,255,0.05)',
  paddingTop: '0.5rem',
  marginTop: '0.2rem'
};

const docCardLabelStyle: React.CSSProperties = {
  color: 'var(--text-muted)'
};

const uploadTriggerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  padding: '0.8rem',
  border: '1px dashed var(--border-light)',
  borderRadius: '10px',
  cursor: 'pointer',
  fontSize: '0.8rem',
  color: 'var(--text-muted)',
  transition: 'all 0.2s ease',
  backgroundColor: 'rgba(255, 255, 255, 0.01)'
};

const recentResumesContainerStyle: React.CSSProperties = {
  padding: '0.75rem 0.25rem',
  maxHeight: '160px',
  overflowY: 'auto'
};

const recentListStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem'
};

const recentItemRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderRadius: '6px',
  padding: '0.15rem 0.25rem',
  transition: 'background-color 0.2s ease'
};

const recentItemBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  background: 'none',
  border: 'none',
  textAlign: 'left',
  cursor: 'pointer',
  fontSize: '0.75rem',
  flex: 1,
  minWidth: 0
};

const recentItemNameStyle: React.CSSProperties = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  width: '100%'
};

const recentDeleteBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--text-dark)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  padding: '0.25rem',
  borderRadius: '4px',
  transition: 'color 0.2s ease'
};

const sidebarFooterStyle: React.CSSProperties = {
  marginTop: '0.5rem',
  paddingTop: '1rem',
  borderTop: '1px solid rgba(255, 255, 255, 0.05)'
};

const profileContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.65rem'
};

const avatarStyle: React.CSSProperties = {
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  background: 'var(--primary-gradient)',
  color: '#fff',
  fontSize: '0.8rem',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const profileNameStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  fontWeight: 600,
  color: '#fff'
};

const profileRoleStyle: React.CSSProperties = {
  fontSize: '0.7rem',
  color: 'var(--text-dark)'
};
