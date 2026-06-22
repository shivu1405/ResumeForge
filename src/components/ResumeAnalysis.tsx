import React from 'react';
import { useApp } from '../context/AppContext';
import { ResumeUpload } from './ResumeUpload';
import { CheckCircle2, AlertCircle, ArrowUpRight, Activity, ChevronRight } from 'lucide-react';

export const ResumeAnalysis: React.FC = () => {
  const { activeResume } = useApp();

  return (
    <div style={containerStyle} className="animate-fade">
      {/* Upload Wrapper */}
      <ResumeUpload />

      {activeResume && (
        <div style={resultsGridStyle} className="animate-slide-up">
          {/* Header Analysis Summary */}
          <div className="glass-card" style={fullWidthCardStyle}>
            <div style={summaryHeaderStyle}>
              <div style={circleBadgeStyle(activeResume.atsScore)}>
                {activeResume.atsScore}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>ATS Calibration Report</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  Document: <span style={{ color: '#fff' }}>{activeResume.fileName}</span> &bull; Scanned with {activeResume.grade} status.
                </p>
              </div>
            </div>
          </div>

          {/* Strengths Card */}
          <div className="glass-card" style={analysisCardStyle}>
            <div style={cardHeaderStyle('var(--accent-emerald)')}>
              <CheckCircle2 size={18} />
              <h4 style={cardTitleStyle}>Key Strengths ({activeResume.strengths.length})</h4>
            </div>
            <div style={listStyle}>
              {activeResume.strengths.map((str: string, idx: number) => (
                <div key={idx} style={itemStyle}>
                  <ChevronRight size={14} color="var(--accent-emerald)" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                  <span style={itemTextStyle}>{str}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weaknesses Card */}
          <div className="glass-card" style={analysisCardStyle}>
            <div style={cardHeaderStyle('var(--accent-rose)')}>
              <AlertCircle size={18} />
              <h4 style={cardTitleStyle}>Areas for Improvement ({activeResume.weaknesses.length})</h4>
            </div>
            <div style={listStyle}>
              {activeResume.weaknesses.map((weak: string, idx: number) => (
                <div key={idx} style={itemStyle}>
                  <AlertCircle size={14} color="var(--accent-rose)" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                  <span style={itemTextStyle}>{weak}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recruiter Feedback */}
          <div className="glass-card" style={fullWidthCardStyle}>
            <div style={feedbackHeaderStyle}>
              <Activity size={18} color="var(--accent-purple)" />
              <h4 style={cardTitleStyle}>Recruiter Alignment Analysis</h4>
            </div>
            <p style={feedbackTextStyle}>{activeResume.recruiterFeedback}</p>
          </div>

          {/* Optimization Suggestions */}
          <div className="glass-card" style={fullWidthCardStyle}>
            <div style={feedbackHeaderStyle}>
              <ArrowUpRight size={18} color="var(--accent-amber)" />
              <h4 style={cardTitleStyle}>Actionable Optimizations</h4>
            </div>
            <div style={suggestionsGridStyle}>
              {activeResume.suggestions.map((sug: string, idx: number) => (
                <div key={idx} style={suggestionItemStyle}>
                  <div style={numBadgeStyle}>{idx + 1}</div>
                  <div style={{ flex: 1 }}>
                    <p style={sugTextStyle}>{sug}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Inline CSS Styles for Resume Analysis Report
const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
  width: '100%'
};

const resultsGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '1.5rem',
  width: '100%'
};

const fullWidthCardStyle: React.CSSProperties = {
  gridColumn: '1 / -1',
  padding: '1.75rem'
};

const analysisCardStyle: React.CSSProperties = {
  padding: '1.75rem'
};

const summaryHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1.5rem'
};

const circleBadgeStyle = (score: number): React.CSSProperties => {
  const isGood = score >= 80;
  const isOk = score >= 60;
  const color = isGood ? 'var(--accent-emerald)' : isOk ? 'var(--accent-amber)' : 'var(--accent-rose)';
  return {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.01)',
    border: `3px solid ${color}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#fff',
    boxShadow: `0 0 20px rgba(${isGood ? '16, 185, 129' : isOk ? '245, 158, 11' : '244, 63, 94'}, 0.15)`
  };
};

const cardHeaderStyle = (color: string): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  color: color,
  marginBottom: '1.25rem',
  borderBottom: '1px solid rgba(255,255,255,0.04)',
  paddingBottom: '0.75rem'
});

const cardTitleStyle: React.CSSProperties = {
  fontSize: '1rem',
  fontWeight: 700,
  color: '#fff'
};

const listStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.85rem'
};

const itemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '0.5rem'
};

const itemTextStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  color: 'var(--text-muted)',
  lineHeight: 1.5
};

const feedbackHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  marginBottom: '1rem'
};

const feedbackTextStyle: React.CSSProperties = {
  fontSize: '0.9rem',
  color: 'var(--text-muted)',
  lineHeight: 1.6,
  backgroundColor: 'rgba(0,0,0,0.15)',
  padding: '1rem',
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.02)'
};

const suggestionsGridStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  marginTop: '0.5rem'
};

const suggestionItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  background: 'rgba(255,255,255,0.01)',
  border: '1px solid var(--border-light)',
  padding: '1rem',
  borderRadius: '10px'
};

const numBadgeStyle: React.CSSProperties = {
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  background: 'rgba(245, 158, 11, 0.1)',
  border: '1px solid rgba(245, 158, 11, 0.3)',
  color: 'var(--accent-amber)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.85rem',
  fontWeight: 700,
  flexShrink: 0
};

const sugTextStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  color: '#e4e4e7',
  lineHeight: 1.4
};
