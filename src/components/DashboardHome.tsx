import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  Target, 
  Layers, 
  Activity, 
  ArrowRight, 
  CheckSquare, 
  Sparkles
} from 'lucide-react';

export const DashboardHome: React.FC = () => {
  const { 
    activeResume, 
    jobMatchResult, 
    setActiveView, 
    toggleChecklistItem 
  } = useApp();

  // If no resume uploaded, render beautiful empty state
  if (!activeResume) {
    return (
      <div style={emptyStateStyle} className="glass-panel animate-slide-up">
        <div style={emptyIconContainerStyle}>
          <FileText size={36} color="var(--accent-purple)" />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>Welcome to Resume Forge</h2>
        <p style={emptyTextStyle}>
          Your resume is the key to passing automated applicant tracking systems (ATS). Upload your resume in PDF format to view ATS scores, map skills against job descriptions, and prepare for interviews.
        </p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button 
            onClick={() => setActiveView('analysis')} 
            className="btn btn-primary"
          >
            Upload Resume <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  // Calculate checklist completion percentage
  const totalCheckItems = activeResume.checklist.length;
  const completedCheckItems = activeResume.checklist.filter(c => c.done).length;
  const checklistPercent = totalCheckItems > 0 
    ? Math.round((completedCheckItems / totalCheckItems) * 100) 
    : 0;

  const totalSkillsCount = 
    activeResume.skills.languages.length +
    activeResume.skills.frameworks.length +
    activeResume.skills.databases.length +
    activeResume.skills.cloud.length +
    activeResume.skills.tools.length +
    activeResume.skills.softSkills.length;

  // SVG parameters for ATS Score Circle
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (activeResume.atsScore / 100) * circumference;

  return (
    <div style={containerStyle} className="animate-fade">
      {/* Top Metrics Grid */}
      <div className="metrics-grid">
        {/* ATS Score Card */}
        <div className="glass-card" style={metricCardStyle} onClick={() => setActiveView('analysis')}>
          <div style={metricHeaderStyle}>
            <span style={metricLabelStyle}>ATS Score</span>
            <Activity size={16} color="var(--accent-purple)" />
          </div>
          <div style={metricMainStyle}>
            {/* SVG Circle Loader */}
            <div style={svgContainerStyle}>
              <svg width="90" height="90" viewBox="0 0 90 90">
                <circle 
                  cx="45" cy="45" r={radius} 
                  fill="transparent" 
                  stroke="rgba(255,255,255,0.03)" 
                  strokeWidth="8" 
                />
                <circle 
                  cx="45" cy="45" r={radius} 
                  fill="transparent" 
                  stroke="url(#atsGrad)" 
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.8s ease' }}
                />
                <defs>
                  <linearGradient id="atsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              <div style={atsTextOverlayStyle}>{activeResume.atsScore}</div>
            </div>
            <div>
              <div style={metricSubtextStyle}>Grade: <span style={{ color: '#fff', fontWeight: 600 }}>{activeResume.grade}</span></div>
              <div style={metricLinkStyle}>View breakdown <ArrowRight size={10} /></div>
            </div>
          </div>
        </div>

        {/* Job Match Card */}
        <div className="glass-card" style={metricCardStyle} onClick={() => setActiveView('match')}>
          <div style={metricHeaderStyle}>
            <span style={metricLabelStyle}>Job Match Score</span>
            <Target size={16} color="var(--accent-blue)" />
          </div>
          <div style={metricMainValueStyle}>
            {jobMatchResult ? (
              <span style={{ color: jobMatchResult.matchScore >= 80 ? 'var(--accent-emerald)' : jobMatchResult.matchScore >= 50 ? 'var(--accent-amber)' : 'var(--accent-rose)' }}>
                {jobMatchResult.matchScore}%
              </span>
            ) : (
              <span style={{ color: 'var(--text-dark)', fontSize: '1.25rem' }}>No Job Matched</span>
            )}
          </div>
          <div style={{ marginTop: 'auto' }}>
            <div style={metricSubtextStyle}>
              {jobMatchResult 
                ? `${jobMatchResult.matchingSkills.length} matching / ${jobMatchResult.missingSkills.length} missing`
                : 'Paste a description in job matching'
              }
            </div>
            <div style={metricLinkStyle}>{jobMatchResult ? 'View analysis' : 'Match resume'} <ArrowRight size={10} /></div>
          </div>
        </div>

        {/* Skills Card */}
        <div className="glass-card" style={metricCardStyle}>
          <div style={metricHeaderStyle}>
            <span style={metricLabelStyle}>Skills Identified</span>
            <Layers size={16} color="var(--accent-emerald)" />
          </div>
          <div style={metricMainValueStyle}>{totalSkillsCount}</div>
          <div style={{ marginTop: 'auto' }}>
            <div style={metricSubtextStyle}>Across 6 distinct categories</div>
            <div style={metricSubtextExtraStyle}>
              {activeResume.skills.languages.length} languages, {activeResume.skills.frameworks.length} frameworks
            </div>
          </div>
        </div>

        {/* Checklist Progress Card */}
        <div className="glass-card" style={metricCardStyle}>
          <div style={metricHeaderStyle}>
            <span style={metricLabelStyle}>Checklist Completeness</span>
            <CheckSquare size={16} color="var(--accent-amber)" />
          </div>
          <div style={metricMainValueStyle}>{checklistPercent}%</div>
          <div style={{ marginTop: 'auto', width: '100%' }}>
            <div style={checklistProgressOuterStyle}>
              <div style={{ ...checklistProgressInnerStyle, width: `${checklistPercent}%` }}></div>
            </div>
            <div style={metricSubtextStyle}>{completedCheckItems} of {totalCheckItems} tasks completed</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Overview & Timeline */}
      <div className="dashboard-layout">
        {/* Left Side: Summary & Skills */}
        <div style={leftColumnStyle}>
          {/* Resume Overview */}
          <div className="glass-card" style={detailCardStyle}>
            <h3 style={cardTitleStyle}>Resume Summary</h3>
            <p style={summaryParagraphStyle}>{activeResume.summary}</p>
            <div style={recruiterQuoteStyle}>
              <div style={recruiterHeaderStyle}>
                <Sparkles size={12} color="var(--accent-purple)" />
                <span>Recruiter Insight</span>
              </div>
              <p style={recruiterTextStyle}>"{activeResume.recruiterFeedback}"</p>
            </div>
          </div>

          {/* Skill Tag Category Breakdown */}
          <div className="glass-card" style={detailCardStyle}>
            <h3 style={cardTitleStyle}>Extracted Technical Capabilities</h3>
            <div style={skillsGridStyle}>
              {Object.entries(activeResume.skills).map(([category, tags]) => {
                if (tags.length === 0) return null;
                const formattedName = category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1');
                return (
                  <div key={category} style={skillCategoryStyle}>
                    <div style={skillCatTitleStyle}>{formattedName}</div>
                    <div style={tagCloudStyle}>
                      {tags.map((tag: string) => (
                        <span key={tag} className="badge badge-purple" style={skillTagStyle}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Roadmap Checklist */}
        <div style={rightColumnStyle}>
          {/* Optimization Checklist */}
          <div className="glass-card" style={detailCardStyle}>
            <h3 style={cardTitleStyle}>Optimization Checklist</h3>
            <p style={cardSubtitleStyle}>Fix formatting and tag density in your raw document.</p>
            <div style={checklistContainerStyle}>
              {activeResume.checklist.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => toggleChecklistItem(item.id)}
                  style={{
                    ...checkItemStyle,
                    opacity: item.done ? 0.65 : 1,
                    textDecoration: item.done ? 'line-through' : 'none'
                  }}
                >
                  <div style={{
                    ...checkboxStyle,
                    backgroundColor: item.done ? 'var(--accent-purple)' : 'transparent',
                    borderColor: item.done ? 'var(--accent-purple)' : 'var(--border-light)'
                  }}>
                    {item.done && <span style={checkCheckmarkStyle}>✓</span>}
                  </div>
                  <span style={checkTextStyle}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Improvement Roadmap */}
          <div className="glass-card" style={detailCardStyle}>
            <h3 style={cardTitleStyle}>Improvement Roadmap</h3>
            <p style={cardSubtitleStyle}>Follow these steps to boost response rates.</p>
            <div style={timelineStyle}>
              {activeResume.roadmap.map((step, idx) => (
                <div key={step.step} style={timelineStepStyle}>
                  <div style={timelineNodeContainerStyle}>
                    <div style={{
                      ...timelineNodeStyle,
                      backgroundColor: step.status === 'completed' ? 'var(--accent-emerald)' : step.status === 'in-progress' ? 'var(--accent-purple)' : 'rgba(255,255,255,0.05)',
                      borderColor: step.status === 'completed' ? 'var(--accent-emerald)' : step.status === 'in-progress' ? 'var(--accent-purple)' : 'var(--border-light)'
                    }}>
                      {step.status === 'completed' ? '✓' : step.step}
                    </div>
                    {idx < activeResume.roadmap.length - 1 && <div style={timelineConnectorStyle}></div>}
                  </div>
                  <div style={timelineContentStyle}>
                    <div style={{
                      ...timelineStepTitleStyle,
                      color: step.status === 'completed' ? 'var(--text-muted)' : '#fff'
                    }}>
                      {step.title}
                    </div>
                    <div style={timelineStepDescStyle}>{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Inline CSS Styles for Dashboard Home
const emptyStateStyle: React.CSSProperties = {
  padding: '4rem 2rem',
  textAlign: 'center',
  maxWidth: '650px',
  margin: '4rem auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem'
};

const emptyIconContainerStyle: React.CSSProperties = {
  width: '72px',
  height: '72px',
  borderRadius: '16px',
  background: 'rgba(139, 92, 246, 0.1)',
  border: '1px solid rgba(139, 92, 246, 0.25)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 0 25px rgba(139, 92, 246, 0.15)',
  marginBottom: '0.75rem'
};

const emptyTextStyle: React.CSSProperties = {
  fontSize: '0.9rem',
  color: 'var(--text-muted)',
  lineHeight: 1.6,
  maxWidth: '450px'
};

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  width: '100%'
};

const metricCardStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  padding: '1.25rem',
  minHeight: '145px',
  cursor: 'pointer'
};

const metricHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  marginBottom: '0.5rem'
};

const metricLabelStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  letterSpacing: '0.05em'
};

const metricMainStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  marginTop: '0.25rem'
};

const svgContainerStyle: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '80px',
  height: '80px'
};

const atsTextOverlayStyle: React.CSSProperties = {
  position: 'absolute',
  fontSize: '1.35rem',
  fontWeight: 800,
  color: '#fff',
  fontFamily: 'var(--font-heading)'
};

const metricMainValueStyle: React.CSSProperties = {
  fontSize: '2.25rem',
  fontWeight: 800,
  color: '#fff',
  fontFamily: 'var(--font-heading)',
  margin: '0.25rem 0'
};

const metricSubtextStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'var(--text-muted)'
};

const metricSubtextExtraStyle: React.CSSProperties = {
  fontSize: '0.7rem',
  color: 'var(--text-dark)',
  marginTop: '0.15rem'
};

const metricLinkStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
  fontSize: '0.7rem',
  color: 'var(--accent-purple)',
  fontWeight: 600,
  marginTop: '0.35rem',
  textTransform: 'uppercase',
  letterSpacing: '0.03em'
};

const checklistProgressOuterStyle: React.CSSProperties = {
  width: '100%',
  height: '6px',
  background: 'rgba(255, 255, 255, 0.04)',
  borderRadius: '3px',
  overflow: 'hidden',
  margin: '0.5rem 0'
};

const checklistProgressInnerStyle: React.CSSProperties = {
  height: '100%',
  background: 'linear-gradient(90deg, #f59e0b, #d97706)',
  borderRadius: '3px',
  transition: 'width 0.5s ease'
};

const leftColumnStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  minWidth: 0
};

const rightColumnStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  minWidth: 0
};

const detailCardStyle: React.CSSProperties = {
  padding: '1.75rem'
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: '1.1rem',
  fontWeight: 700,
  marginBottom: '0.5rem',
  color: '#fff',
  letterSpacing: '-0.01em'
};

const cardSubtitleStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
  marginBottom: '1.25rem'
};

const summaryParagraphStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  color: 'var(--text-muted)',
  lineHeight: 1.6,
  marginBottom: '1rem'
};

const recruiterQuoteStyle: React.CSSProperties = {
  backgroundColor: 'rgba(139, 92, 246, 0.03)',
  border: '1px solid rgba(139, 92, 246, 0.12)',
  borderRadius: '10px',
  padding: '1rem',
  position: 'relative'
};

const recruiterHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
  fontSize: '0.7rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  color: '#c084fc',
  letterSpacing: '0.05em',
  marginBottom: '0.4rem'
};

const recruiterTextStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  color: '#e4e4e7',
  fontStyle: 'italic',
  lineHeight: 1.5
};

const skillsGridStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
  marginTop: '1rem'
};

const skillCategoryStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
};

const skillCatTitleStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  letterSpacing: '0.04em'
};

const tagCloudStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.4rem'
};

const skillTagStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  padding: '0.3rem 0.65rem',
  borderRadius: '6px',
  cursor: 'default'
};

const checklistContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.65rem'
};

const checkItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '0.65rem',
  cursor: 'pointer',
  padding: '0.5rem',
  borderRadius: '6px',
  transition: 'background-color 0.2s ease',
  userSelect: 'none'
};

const checkboxStyle: React.CSSProperties = {
  width: '15px',
  height: '15px',
  borderRadius: '4px',
  border: '1px solid var(--border-light)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  marginTop: '0.1rem',
  transition: 'all 0.15s ease'
};

const checkCheckmarkStyle: React.CSSProperties = {
  color: '#fff',
  fontSize: '0.65rem',
  fontWeight: 800
};

const checkTextStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  color: '#e4e4e7',
  lineHeight: 1.4
};

const timelineStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  marginTop: '0.5rem'
};

const timelineStepStyle: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
  position: 'relative'
};

const timelineNodeContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

const timelineNodeStyle: React.CSSProperties = {
  width: '22px',
  height: '22px',
  borderRadius: '50%',
  border: '1px solid var(--border-light)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.65rem',
  fontWeight: 700,
  color: '#fff',
  zIndex: 1,
  backgroundColor: 'var(--bg-dark)',
  transition: 'all 0.3s ease'
};

const timelineConnectorStyle: React.CSSProperties = {
  width: '1px',
  flex: 1,
  backgroundColor: 'var(--border-light)',
  margin: '4px 0'
};

const timelineContentStyle: React.CSSProperties = {
  paddingBottom: '1.5rem',
  flex: 1
};

const timelineStepTitleStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  fontWeight: 600,
  marginBottom: '0.2rem',
  transition: 'color 0.2s ease'
};

const timelineStepDescStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
  lineHeight: 1.4
};
