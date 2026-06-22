import React from 'react';
import { useApp } from '../context/AppContext';
import { FileText, Trash2, Calendar, HardDrive, Check, Printer } from 'lucide-react';

export const HistoryPanel: React.FC = () => {
  const { resumes, activeResume, selectResume, deleteResume } = useApp();

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={containerStyle} className="animate-fade">
      {/* Intro */}
      <div className="glass-card" style={introCardStyle}>
        <div style={introHeaderStyle}>
          <FileText size={20} color="var(--accent-purple)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Resume Database & Versioning</h3>
        </div>
        <p style={introTextStyle}>
          Manage your uploaded resumes, swap between versions, and export complete ATS audit reports to PDF. All data is saved on your device.
        </p>
      </div>

      {resumes.length === 0 ? (
        <div className="glass-panel" style={emptyPanelStyle}>
          <FileText size={32} color="var(--text-dark)" />
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No resumes stored in local cache history.</p>
        </div>
      ) : (
        <div style={historySplitStyle}>
          {/* Left Side: Document List */}
          <div style={listAreaStyle}>
            {resumes.map(res => {
              const isActive = activeResume?.id === res.id;
              return (
                <div 
                  key={res.id} 
                  className="glass-card"
                  onClick={() => selectResume(res.id)}
                  style={{
                    ...itemCardStyle,
                    borderColor: isActive ? 'var(--accent-purple)' : 'var(--border-light)',
                    background: isActive ? 'rgba(139, 92, 246, 0.03)' : 'rgba(255, 255, 255, 0.01)'
                  }}
                >
                  <div style={itemHeaderStyle}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <h4 style={itemTitleStyle} title={res.fileName}>{res.fileName}</h4>
                      <div style={metaRowStyle}>
                        <span style={metaItemStyle}><Calendar size={12} /> {formatDate(res.timestamp)}</span>
                        <span style={metaItemStyle}><HardDrive size={12} /> {res.fileSize}</span>
                      </div>
                    </div>
                    
                    <div style={badgeContainerStyle}>
                      <span style={{ 
                        fontSize: '1.25rem', 
                        fontWeight: 800, 
                        color: res.atsScore >= 80 ? 'var(--accent-emerald)' : res.atsScore >= 60 ? 'var(--accent-amber)' : 'var(--accent-rose)'
                      }}>
                        {res.atsScore}
                      </span>
                    </div>
                  </div>

                  <div style={cardActionsStyle}>
                    {isActive ? (
                      <span style={activeIndicatorStyle}><Check size={12} /> Active</span>
                    ) : (
                      <span style={inactiveIndicatorStyle}>Click to activate</span>
                    )}

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteResume(res.id);
                      }}
                      style={deleteBtnStyle}
                      title="Delete resume from history"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Side: Print Preview Actions */}
          <div className="glass-card" style={reportActionsStyle}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Print / Export Analysis</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '1.25rem' }}>
              Generate a clean, print-formatted page of the current ATS analysis card to save as a local PDF or send to reviewers.
            </p>
            {activeResume ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={reportMetaCardStyle}>
                  <div style={reportMetaLabelStyle}>Selected Report:</div>
                  <div style={reportMetaValueStyle}>{activeResume.fileName}</div>
                  <div style={reportMetaLabelStyle}>Current ATS Score:</div>
                  <div style={reportMetaValueStyle}>{activeResume.atsScore} / 100</div>
                </div>
                <button onClick={handlePrint} className="btn btn-primary" style={{ width: '100%' }}>
                  <Printer size={16} />
                  <span>Print / Save as PDF</span>
                </button>
              </div>
            ) : (
              <div style={noSelectionReportStyle}>Select a document from the list to export reports.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Inline CSS Styles for History panel
const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  width: '100%'
};

const introCardStyle: React.CSSProperties = {
  padding: '1.5rem'
};

const introHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  marginBottom: '0.5rem'
};

const introTextStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  color: 'var(--text-muted)',
  lineHeight: 1.5
};

const emptyPanelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '3rem',
  gap: '0.75rem',
  textAlign: 'center'
};

const historySplitStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1.5fr 1fr',
  gap: '1.5rem',
  alignItems: 'start'
};

const listAreaStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};

const itemCardStyle: React.CSSProperties = {
  padding: '1.25rem',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};

const itemHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '1rem'
};

const itemTitleStyle: React.CSSProperties = {
  fontSize: '0.9rem',
  fontWeight: 700,
  color: '#fff',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
};

const metaRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
  marginTop: '0.25rem',
  flexWrap: 'wrap'
};

const metaItemStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem',
  fontSize: '0.75rem',
  color: 'var(--text-muted)'
};

const badgeContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.25rem 0.5rem',
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid var(--border-light)',
  borderRadius: '8px',
  minWidth: '45px',
  height: '40px'
};

const cardActionsStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderTop: '1px solid rgba(255,255,255,0.03)',
  paddingTop: '0.75rem'
};

const activeIndicatorStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'var(--accent-purple)',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem'
};

const inactiveIndicatorStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'var(--text-dark)'
};

const deleteBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--text-dark)',
  cursor: 'pointer',
  display: 'flex',
  padding: '0.25rem',
  borderRadius: '4px',
  transition: 'all 0.2s ease'
};

const reportActionsStyle: React.CSSProperties = {
  padding: '1.75rem'
};

const reportMetaCardStyle: React.CSSProperties = {
  padding: '1rem',
  background: 'rgba(0,0,0,0.15)',
  border: '1px solid rgba(255,255,255,0.02)',
  borderRadius: '8px',
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  gap: '0.5rem 1rem',
  marginBottom: '0.5rem'
};

const reportMetaLabelStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'var(--text-muted)'
};

const reportMetaValueStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 600,
  color: '#fff',
  textAlign: 'right',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
};

const noSelectionReportStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  color: 'var(--text-dark)',
  fontStyle: 'italic',
  textAlign: 'center',
  padding: '1rem'
};
