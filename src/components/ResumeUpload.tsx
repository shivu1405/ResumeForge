import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Upload, CheckCircle2, AlertTriangle, Eye, EyeOff, Check, RefreshCw } from 'lucide-react';

export const ResumeUpload: React.FC = () => {
  const { 
    handleFileUpload, 
    isAnalyzing, 
    analysisProgress, 
    uploadError, 
    activeResume,
    updateResumeText,
    settings
  } = useApp();

  const [dragActive, setDragActive] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync edited text with active resume
  React.useEffect(() => {
    if (activeResume) {
      setEditedText(activeResume.rawText);
    }
  }, [activeResume]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        await handleFileUpload(file);
      } else {
        alert("Please upload a PDF file.");
      }
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") {
        await handleFileUpload(file);
      } else {
        alert("Please upload a PDF file.");
      }
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSaveTextChanges = () => {
    updateResumeText(editedText);
    setIsEditing(false);
    setUpdateSuccess(true);
    setTimeout(() => setUpdateSuccess(false), 2000);
  };

  // Determine message to show based on progress
  const getLoaderMessage = (progress: number) => {
    if (progress < 25) return 'Loading document stream...';
    if (progress < 50) return `Invoking ${settings.selectedModel} worker...`;
    if (progress < 75) return 'Extracting text layout & parsing skills...';
    if (progress < 95) return 'Scoring ATS checks and checking alignments...';
    return 'Finalizing report compilation...';
  };

  return (
    <div style={containerStyle} className="animate-slide-up">
      {/* Upload Box */}
      <div 
        onDragEnter={handleDrag} 
        onDragLeave={handleDrag} 
        onDragOver={handleDrag} 
        onDrop={handleDrop}
        style={{
          ...dropzoneStyle,
          borderColor: dragActive ? 'var(--accent-purple)' : 'var(--border-light)',
          background: dragActive ? 'rgba(139, 92, 246, 0.04)' : 'rgba(255, 255, 255, 0.01)'
        }}
      >
        <input 
          ref={fileInputRef} 
          type="file" 
          accept=".pdf" 
          onChange={handleChange} 
          style={{ display: 'none' }} 
        />
        
        {isAnalyzing ? (
          <div style={loadingContainerStyle}>
            <div className="loading-spinner" style={{ width: '40px', height: '40px', borderWidth: '3px' }}></div>
            <h3 style={{ marginTop: '1.25rem', fontSize: '1.1rem' }}>Analyzing Document</h3>
            <p style={loaderSubtextStyle}>{getLoaderMessage(analysisProgress)}</p>
            <div style={progressBarContainerStyle}>
              <div style={{ ...progressBarFillStyle, width: `${analysisProgress}%` }}></div>
            </div>
            <span style={progressPercentStyle}>{analysisProgress}%</span>
          </div>
        ) : (
          <div style={uploadPromptStyle}>
            <div style={iconContainerStyle}>
              <Upload size={28} color="var(--accent-purple)" />
            </div>
            <h3>Upload PDF Resume</h3>
            <p style={uploadSubtextStyle}>Drag and drop your file here, or click to browse files.</p>
            <button className="btn btn-secondary" onClick={onButtonClick} style={{ marginTop: '0.5rem' }}>
              Select File
            </button>
            <span style={formatInfoStyle}>Supported Format: PDF only (Max 10MB)</span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {uploadError && (
        <div className="glass-card" style={errorCardStyle}>
          <AlertTriangle size={18} color="var(--accent-rose)" />
          <div style={{ fontSize: '0.85rem' }}>{uploadError}</div>
        </div>
      )}

      {/* Success & Preview */}
      {activeResume && !isAnalyzing && (
        <div className="glass-card" style={successCardStyle}>
          <div style={successHeaderStyle}>
            <div style={successTitleAreaStyle}>
              <CheckCircle2 size={20} color="var(--accent-emerald)" />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Successfully Analyzed!</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Active Document: <span style={{ color: '#fff', fontWeight: 500 }}>{activeResume.fileName}</span> ({activeResume.fileSize})
                </p>
              </div>
            </div>
            
            <div style={successActionsStyle}>
              <button 
                onClick={() => setShowPreview(!showPreview)} 
                className="btn btn-secondary"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
              >
                {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
                <span>{showPreview ? 'Hide Text' : 'View Text'}</span>
              </button>
            </div>
          </div>

          {/* Collapsible Content Preview */}
          {showPreview && (
            <div style={previewBoxStyle}>
              <div style={previewHeaderStyle}>
                <span style={previewTitleStyle}>Extracted Raw Metadata Preview</span>
                {isEditing ? (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={handleSaveTextChanges}
                      className="btn btn-primary"
                      style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                    >
                      <Check size={12} /> Save & Re-analyze
                    </button>
                    <button 
                      onClick={() => { setIsEditing(false); setEditedText(activeResume.rawText); }}
                      className="btn btn-secondary"
                      style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="btn btn-secondary"
                    style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                  >
                    Edit Text (Create Version)
                  </button>
                )}
              </div>
              
              {isEditing ? (
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  style={textareaStyle}
                  className="custom-textarea"
                />
              ) : (
                <pre style={preStyle}>
                  {activeResume.rawText}
                </pre>
              )}

              {updateSuccess && (
                <div style={updateSuccessStyle}>
                  <RefreshCw size={12} className="loading-spinner" style={{ animationDuration: '2s' }} />
                  <span>Resume re-analyzed! Score updated dynamically.</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Inline CSS styles
const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  width: '100%',
  maxWidth: '800px',
  margin: '0 auto'
};

const dropzoneStyle: React.CSSProperties = {
  border: '2px dashed var(--border-light)',
  borderRadius: '16px',
  padding: '3rem 2rem',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden'
};

const uploadPromptStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.75rem'
};

const iconContainerStyle: React.CSSProperties = {
  width: '56px',
  height: '56px',
  borderRadius: '12px',
  background: 'rgba(139, 92, 246, 0.1)',
  border: '1px solid rgba(139, 92, 246, 0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '0.5rem'
};

const uploadSubtextStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  color: 'var(--text-muted)',
  maxWidth: '300px',
  lineHeight: 1.4
};

const formatInfoStyle: React.CSSProperties = {
  fontSize: '0.7rem',
  color: 'var(--text-dark)',
  marginTop: '0.5rem'
};

const loadingContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '1rem 0'
};

const loaderSubtextStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  color: 'var(--text-muted)',
  marginTop: '0.35rem',
  marginBottom: '1.25rem'
};

const progressBarContainerStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '300px',
  height: '6px',
  backgroundColor: 'rgba(255,255,255,0.05)',
  borderRadius: '3px',
  overflow: 'hidden',
  marginBottom: '0.5rem'
};

const progressBarFillStyle: React.CSSProperties = {
  height: '100%',
  background: 'var(--primary-gradient)',
  borderRadius: '3px',
  transition: 'width 0.25s ease'
};

const progressPercentStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 700,
  color: 'var(--accent-purple)'
};

const errorCardStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  borderColor: 'rgba(244, 63, 94, 0.3)',
  background: 'rgba(244, 63, 94, 0.05)',
  color: 'var(--accent-rose)'
};

const successCardStyle: React.CSSProperties = {
  padding: '1rem 1.25rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};

const successHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '0.75rem'
};

const successTitleAreaStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem'
};

const successActionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.5rem'
};

const previewBoxStyle: React.CSSProperties = {
  borderTop: '1px solid var(--border-light)',
  paddingTop: '1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem'
};

const previewHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
};

const previewTitleStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 700,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

const preStyle: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '0.75rem',
  backgroundColor: 'rgba(0,0,0,0.2)',
  padding: '1rem',
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.03)',
  maxHeight: '220px',
  overflowY: 'auto',
  whiteSpace: 'pre-wrap',
  color: 'var(--text-muted)'
};

const textareaStyle: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '0.75rem',
  backgroundColor: 'rgba(0,0,0,0.3)',
  padding: '1rem',
  borderRadius: '8px',
  color: '#fff',
  maxHeight: '220px',
  height: '220px'
};

const updateSuccessStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  color: 'var(--accent-emerald)',
  fontSize: '0.75rem',
  fontWeight: 500
};
