import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HelpCircle, ChevronDown, ChevronUp, BookOpen, Lightbulb, Compass, Award } from 'lucide-react';

type QuestionCategory = 'Technical' | 'Behavioral' | 'Project-based' | 'HR';

export const InterviewPrep: React.FC = () => {
  const { activeResume, setActiveView } = useApp();
  const [activeTab, setActiveTab] = useState<QuestionCategory>('Technical');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!activeResume) {
    return (
      <div style={emptyStyle} className="glass-panel animate-slide-up">
        <div style={emptyIconStyle}>
          <HelpCircle size={36} color="var(--accent-purple)" />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Resume Required</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '400px', textAlign: 'center' }}>
          Please upload a resume first so that the interview simulator can customize your prep questions.
        </p>
        <button onClick={() => setActiveView('analysis')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Go to Upload
        </button>
      </div>
    );
  }

  // Filter questions based on active tab
  const filteredQuestions = activeResume.interviewQuestions.filter(
    q => q.category === activeTab
  );

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getCategoryIcon = (category: QuestionCategory) => {
    switch (category) {
      case 'Technical': return <BookOpen size={16} />;
      case 'Behavioral': return <Compass size={16} />;
      case 'Project-based': return <Award size={16} />;
      case 'HR': return <HelpCircle size={16} />;
    }
  };

  const tabs: QuestionCategory[] = ['Technical', 'Behavioral', 'Project-based', 'HR'];

  return (
    <div style={containerStyle} className="animate-fade">
      {/* Introduction Card */}
      <div className="glass-card" style={introCardStyle}>
        <div style={introHeaderStyle}>
          <HelpCircle size={20} color="var(--accent-purple)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>AI Interview Preparation Coach</h3>
        </div>
        <p style={introTextStyle}>
          The following questions were synthesized from your resume's technical stack, work achievements, and target profile. Select a category and review the answering guidelines.
        </p>
      </div>

      {/* Tabs Menu */}
      <div style={tabContainerStyle}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setExpandedId(null); }}
            style={{
              ...tabItemStyle,
              borderBottom: activeTab === tab ? '2px solid var(--accent-purple)' : '2px solid transparent',
              color: activeTab === tab ? '#fff' : 'var(--text-muted)',
              backgroundColor: activeTab === tab ? 'rgba(139, 92, 246, 0.04)' : 'transparent'
            }}
          >
            {getCategoryIcon(tab)}
            <span>{tab}</span>
          </button>
        ))}
      </div>

      {/* Questions list */}
      <div style={listContainerStyle}>
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((q, index) => {
            const isExpanded = expandedId === q.id;
            return (
              <div 
                key={q.id} 
                className="glass-card" 
                style={{
                  ...questionCardStyle,
                  borderColor: isExpanded ? 'rgba(139,92,246,0.3)' : 'var(--border-light)'
                }}
              >
                {/* Question Header */}
                <div style={questionHeaderStyle} onClick={() => toggleExpand(q.id)}>
                  <div style={questionTitleAreaStyle}>
                    <span style={questionNumberStyle}>Q{index + 1}</span>
                    <span style={questionTitleTextStyle}>{q.question}</span>
                  </div>
                  <button style={expandBtnStyle}>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>

                {/* Collapsible guideline content */}
                {isExpanded && (
                  <div style={guidelineContainerStyle} className="animate-fade">
                    <div style={guidelineHeaderStyle}>
                      <Lightbulb size={14} color="var(--accent-amber)" />
                      <span>Answering Guidelines & Strategy</span>
                    </div>
                    <p style={guidelineTextStyle}>{q.guideline}</p>
                    
                    <div style={starMethodTipStyle}>
                      <span style={{ fontWeight: 700, color: 'var(--accent-purple)' }}>Tip:</span> Use the <strong>STAR</strong> method (Situation, Task, Action, Result) to format your response. Quantify results with metrics whenever possible.
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div style={noQuestionsCardStyle}>
            <p>No questions generated for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Inline CSS Styles for Interview Prep Coach
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
  background: 'rgba(139, 92, 246, 0.1)',
  border: '1px solid rgba(139, 92, 246, 0.25)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 0 20px rgba(139, 92, 246, 0.15)'
};

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

const tabContainerStyle: React.CSSProperties = {
  display: 'flex',
  borderBottom: '1px solid var(--border-light)',
  gap: '0.5rem',
  width: '100%',
  overflowX: 'auto'
};

const tabItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.85rem 1.25rem',
  border: 'none',
  fontFamily: 'var(--font-heading)',
  fontSize: '0.9rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  borderRadius: '6px 6px 0 0'
};

const listContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};

const questionCardStyle: React.CSSProperties = {
  padding: '0',
  borderRadius: '10px',
  overflow: 'hidden'
};

const questionHeaderStyle: React.CSSProperties = {
  padding: '1.25rem 1.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  userSelect: 'none',
  transition: 'background-color 0.2s ease'
};

const questionTitleAreaStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '1rem',
  flex: 1,
  minWidth: 0
};

const questionNumberStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  fontWeight: 800,
  background: 'rgba(139, 92, 246, 0.1)',
  color: 'var(--accent-purple)',
  border: '1px solid rgba(139, 92, 246, 0.25)',
  padding: '0.2rem 0.5rem',
  borderRadius: '6px',
  flexShrink: 0
};

const questionTitleTextStyle: React.CSSProperties = {
  fontSize: '0.9rem',
  fontWeight: 600,
  color: '#fff',
  lineHeight: 1.4
};

const expandBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--text-muted)',
  cursor: 'pointer',
  marginLeft: '1rem',
  flexShrink: 0
};

const guidelineContainerStyle: React.CSSProperties = {
  padding: '0 1.5rem 1.5rem 1.5rem',
  borderTop: '1px solid rgba(255,255,255,0.03)',
  paddingTop: '1rem'
};

const guidelineHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
  fontSize: '0.75rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  color: 'var(--accent-amber)',
  letterSpacing: '0.04em',
  marginBottom: '0.5rem'
};

const guidelineTextStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  color: 'var(--text-muted)',
  lineHeight: 1.6,
  backgroundColor: 'rgba(0,0,0,0.15)',
  padding: '0.85rem 1rem',
  borderRadius: '6px',
  border: '1px solid rgba(255,255,255,0.02)'
};

const starMethodTipStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'var(--text-dark)',
  marginTop: '0.75rem',
  lineHeight: 1.4
};

const noQuestionsCardStyle: React.CSSProperties = {
  padding: '2rem',
  textAlign: 'center',
  color: 'var(--text-dark)'
};
