import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Target, CheckCircle2, AlertTriangle, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

export const JobMatcher: React.FC = () => {
  const { 
    activeResume, 
    jobDescription, 
    jobMatchResult, 
    isMatching, 
    runJobMatch, 
    setActiveView 
  } = useApp();

  const [inputJd, setInputJd] = useState(jobDescription);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputJd.trim()) {
      runJobMatch(inputJd);
    }
  };

  if (!activeResume) {
    return (
      <div style={emptyStyle} className="glass-panel animate-slide-up">
        <div style={emptyIconStyle}>
          <Target size={36} color="var(--accent-blue)" />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Resume Required</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '400px', textAlign: 'center' }}>
          You must upload a resume before you can perform job description matching.
        </p>
        <button onClick={() => setActiveView('analysis')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Go to Upload
        </button>
      </div>
    );
  }

  return (
    <div style={containerStyle} className="animate-fade">
      {/* Input Box */}
      <div className="glass-card" style={inputCardStyle}>
        <div style={inputHeaderStyle}>
          <Target size={18} color="var(--accent-blue)" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Paste Target Job Description</h3>
        </div>
        <form onSubmit={handleSubmit} style={formStyle}>
          <textarea
            value={inputJd}
            onChange={(e) => setInputJd(e.target.value)}
            placeholder="Paste the full job description text here (including duties, requirements, and stacks)..."
            style={textareaStyle}
            className="custom-textarea"
            required
          />
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={isMatching || !inputJd.trim()}
            style={{ alignSelf: 'flex-end', marginTop: '0.5rem' }}
          >
            {isMatching ? (
              <>
                <span className="loading-spinner" style={{ width: '14px', height: '14px' }}></span>
                <span>Calculating Alignments...</span>
              </>
            ) : (
              <>
                <span>Match Resume</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results View */}
      {isMatching && (
        <div className="glass-card animate-fade" style={matchingLoaderStyle}>
          <div className="loading-spinner" style={{ width: '32px', height: '32px', borderWidth: '3px' }}></div>
          <h4 style={{ fontSize: '0.95rem', marginTop: '1rem' }}>Mapping Technology Alignments</h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Evaluating Jaccard overlaps and filtering keyword matches...
          </p>
        </div>
      )}

      {jobMatchResult && !isMatching && (
        <div style={resultsContainerStyle} className="animate-slide-up">
          {/* Main Score & Gap Analysis */}
          <div className="glass-card" style={scoreCardStyle}>
            <div style={scoreGlowStyle(jobMatchResult.matchScore)}></div>
            <div style={scoreValueStyle(jobMatchResult.matchScore)}>
              {jobMatchResult.matchScore}%
            </div>
            <div style={scoreInfoAreaStyle}>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Role Compatibility Rating</h4>
              <p style={scoreDescStyle}>
                Based on technical terms, tools, databases, and programming languages identified.
              </p>
              <div style={gapAlertStyle(jobMatchResult.matchScore)}>
                <ShieldAlert size={16} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                <div>
                  <h5 style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.15rem' }}>Gap Analysis</h5>
                  <p style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>{jobMatchResult.gapAnalysis}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Skill Tag Overlaps */}
          <div className="glass-card" style={skillsCardStyle}>
            <h4 style={subSectionTitleStyle}>Matching Keywords ({jobMatchResult.matchingSkills.length})</h4>
            <p style={subSectionSubtitleStyle}>Keywords found in both the resume and the job listing.</p>
            <div style={tagCloudStyle}>
              {jobMatchResult.matchingSkills.length > 0 ? (
                jobMatchResult.matchingSkills.map(tag => (
                  <span key={tag} className="badge badge-success" style={tagStyle}>
                    <CheckCircle2 size={10} /> {tag}
                  </span>
                ))
              ) : (
                <span style={noSkillsTextStyle}>No technical keywords matched.</span>
              )}
            </div>
          </div>

          <div className="glass-card" style={skillsCardStyle}>
            <h4 style={subSectionTitleStyle}>Missing Keywords ({jobMatchResult.missingSkills.length})</h4>
            <p style={subSectionSubtitleStyle}>Technologies requested by the job post but missing from your document.</p>
            <div style={tagCloudStyle}>
              {jobMatchResult.missingSkills.length > 0 ? (
                jobMatchResult.missingSkills.map(tag => (
                  <span key={tag} className="badge badge-danger" style={tagStyle}>
                    <AlertTriangle size={10} /> {tag}
                  </span>
                ))
              ) : (
                <span style={noSkillsTextStyle}>No critical keywords missing! You have full coverage.</span>
              )}
            </div>
          </div>

          {/* Tailoring Recommendations */}
          <div className="glass-card" style={adjustmentsCardStyle}>
            <div style={adjustHeaderStyle}>
              <Sparkles size={16} color="var(--accent-amber)" />
              <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Tailoring Recommendations</h4>
            </div>
            <div style={adjustListStyle}>
              {jobMatchResult.improvements.map((imp, idx) => (
                <div key={idx} style={adjustRowStyle}>
                  <div style={adjustNumStyle}>{idx + 1}</div>
                  <span style={adjustTextStyle}>{imp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Inline CSS Styles for Job Description Matcher
const emptyStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4rem 2rem',
  gap: '1rem',
  maxWidth: '500px',
  margin: '4rem auto'
};

const emptyIconStyle: React.CSSProperties = {
  width: '64px',
  height: '64px',
  borderRadius: '14px',
  background: 'rgba(59, 130, 246, 0.1)',
  border: '1px solid rgba(59, 130, 246, 0.25)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 0 20px rgba(59, 130, 246, 0.15)'
};

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  width: '100%'
};

const inputCardStyle: React.CSSProperties = {
  padding: '1.5rem'
};

const inputHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  marginBottom: '1rem',
  borderBottom: '1px solid rgba(255,255,255,0.04)',
  paddingBottom: '0.5rem'
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem'
};

const textareaStyle: React.CSSProperties = {
  minHeight: '140px',
  fontSize: '0.85rem',
  backgroundColor: 'rgba(0,0,0,0.2)'
};

const matchingLoaderStyle: React.CSSProperties = {
  padding: '2.5rem',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

const resultsContainerStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '1.5rem',
  width: '100%'
};

const scoreCardStyle: React.CSSProperties = {
  gridColumn: '1 / -1',
  padding: '2rem',
  display: 'flex',
  alignItems: 'center',
  gap: '2.5rem',
  position: 'relative',
  overflow: 'hidden'
};

const scoreGlowStyle = (score: number): React.CSSProperties => {
  const isGood = score >= 80;
  const isOk = score >= 50;
  const color = isGood ? 'rgba(16, 185, 129, 0.05)' : isOk ? 'rgba(245, 158, 11, 0.05)' : 'rgba(244, 63, 94, 0.05)';
  return {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '240px',
    height: '100%',
    background: `linear-gradient(90deg, ${color} 0%, transparent 100%)`,
    pointerEvents: 'none'
  };
};

const scoreValueStyle = (score: number): React.CSSProperties => {
  const isGood = score >= 80;
  const isOk = score >= 50;
  const color = isGood ? 'var(--accent-emerald)' : isOk ? 'var(--accent-amber)' : 'var(--accent-rose)';
  return {
    fontSize: '4.5rem',
    fontWeight: 900,
    color: color,
    fontFamily: 'var(--font-heading)',
    lineHeight: 1,
    textShadow: `0 0 25px rgba(${isGood ? '16, 185, 129' : isOk ? '245, 158, 11' : '244, 63, 94'}, 0.2)`
  };
};

const scoreInfoAreaStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem'
};

const scoreDescStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  color: 'var(--text-muted)'
};

const gapAlertStyle = (score: number): React.CSSProperties => {
  const isGood = score >= 80;
  const isOk = score >= 50;
  const border = isGood ? 'rgba(16, 185, 129, 0.12)' : isOk ? 'rgba(245, 158, 11, 0.12)' : 'rgba(244, 63, 94, 0.12)';
  const bg = isGood ? 'rgba(16, 185, 129, 0.03)' : isOk ? 'rgba(245, 158, 11, 0.03)' : 'rgba(244, 63, 94, 0.03)';
  const color = isGood ? 'var(--accent-emerald)' : isOk ? 'var(--accent-amber)' : 'var(--accent-rose)';
  return {
    marginTop: '0.85rem',
    border: `1px solid ${border}`,
    backgroundColor: bg,
    color: color,
    padding: '0.85rem',
    borderRadius: '8px',
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'flex-start'
  };
};

const skillsCardStyle: React.CSSProperties = {
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
};

const subSectionTitleStyle: React.CSSProperties = {
  fontSize: '0.95rem',
  fontWeight: 700,
  color: '#fff'
};

const subSectionSubtitleStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
  marginBottom: '0.5rem'
};

const tagCloudStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  marginTop: '0.25rem'
};

const tagStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  padding: '0.35rem 0.75rem',
  borderRadius: '6px',
  cursor: 'default'
};

const noSkillsTextStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  color: 'var(--text-dark)',
  fontStyle: 'italic',
  padding: '0.5rem 0'
};

const adjustmentsCardStyle: React.CSSProperties = {
  gridColumn: '1 / -1',
  padding: '1.75rem'
};

const adjustHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  marginBottom: '1.25rem',
  borderBottom: '1px solid rgba(255,255,255,0.04)',
  paddingBottom: '0.75rem'
};

const adjustListStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.85rem'
};

const adjustRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.85rem',
  background: 'rgba(255,255,255,0.01)',
  border: '1px solid var(--border-light)',
  padding: '0.85rem 1rem',
  borderRadius: '8px'
};

const adjustNumStyle: React.CSSProperties = {
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  background: 'rgba(245, 158, 11, 0.1)',
  border: '1px solid rgba(245, 158, 11, 0.25)',
  color: 'var(--accent-amber)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.75rem',
  fontWeight: 700,
  flexShrink: 0
};

const adjustTextStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  color: '#e4e4e7',
  lineHeight: 1.4
};
