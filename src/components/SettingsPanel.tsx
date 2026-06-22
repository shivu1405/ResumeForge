import React from 'react';
import { useApp } from '../context/AppContext';
import { Cpu, Clock, RefreshCw, Database } from 'lucide-react';

export const SettingsPanel: React.FC = () => {
  const { settings, updateSettings, resetAllData } = useApp();

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings({ selectedModel: e.target.value });
  };

  const handleLatencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ simulatedLatency: parseInt(e.target.value, 10) });
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to delete all uploaded resumes, version histories, and settings? This action cannot be undone.')) {
      resetAllData();
    }
  };

  return (
    <div style={containerStyle} className="animate-fade">
      {/* Configuration Cards */}
      <div className="glass-card" style={settingsCardStyle}>
        <div style={cardHeaderStyle}>
          <Cpu size={18} color="var(--accent-purple)" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>AI Processor Configuration</h3>
        </div>
        <p style={cardDescStyle}>
          Select which large language model to emulate for parsing and interview preparation questions.
        </p>

        <div className="form-group" style={{ marginTop: '1.25rem' }}>
          <label className="form-label">Emulated AI Model</label>
          <select 
            value={settings.selectedModel}
            onChange={handleModelChange}
            className="custom-select"
          >
            <option value="Gemini 1.5 Pro">Gemini 1.5 Pro (Optimized for analysis)</option>
            <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet (Optimized for coding questions)</option>
            <option value="GPT-4o">GPT-4o (Standard ATS checking)</option>
          </select>
        </div>
      </div>

      <div className="glass-card" style={settingsCardStyle}>
        <div style={cardHeaderStyle}>
          <Clock size={18} color="var(--accent-blue)" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Simulated Analysis Latency</h3>
        </div>
        <p style={cardDescStyle}>
          Tweak the processing delay to demonstrate loading spinners and progression animations.
        </p>

        <div className="form-group" style={{ marginTop: '1.25rem' }}>
          <div style={sliderLabelAreaStyle}>
            <label className="form-label" style={{ marginBottom: 0 }}>Processing Delay</label>
            <span style={delayValueStyle}>{(settings.simulatedLatency / 1000).toFixed(1)}s</span>
          </div>
          <input
            type="range"
            min="500"
            max="4000"
            step="500"
            value={settings.simulatedLatency}
            onChange={handleLatencyChange}
            style={sliderStyle}
          />
          <div style={sliderTicksStyle}>
            <span>0.5s (Fast)</span>
            <span>2.0s</span>
            <span>4.0s (Thorough)</span>
          </div>
        </div>
      </div>

      <div className="glass-card" style={settingsCardStyle}>
        <div style={cardHeaderStyle}>
          <Database size={18} color="var(--accent-rose)" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>System Storage & Memory</h3>
        </div>
        <p style={cardDescStyle}>
          Resume Forge caches uploaded resumes and job descriptions inside browser local storage.
        </p>

        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={storageMetaRowStyle}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Location:</span>
            <span style={{ fontSize: '0.8rem', color: '#fff', fontFamily: 'monospace' }}>window.localStorage</span>
          </div>
          <button 
            onClick={handleReset}
            className="btn btn-danger"
            style={{ display: 'inline-flex', alignSelf: 'flex-start' }}
          >
            <RefreshCw size={14} />
            <span>Reset All Database Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Inline CSS Styles for Settings
const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  width: '100%',
  maxWidth: '700px',
  margin: '0 auto'
};

const settingsCardStyle: React.CSSProperties = {
  padding: '1.75rem'
};

const cardHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  marginBottom: '0.5rem'
};

const cardDescStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  color: 'var(--text-muted)',
  lineHeight: 1.4
};

const sliderLabelAreaStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '0.5rem'
};

const delayValueStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  fontWeight: 700,
  color: 'var(--accent-purple)',
  fontFamily: 'monospace'
};

const sliderStyle: React.CSSProperties = {
  width: '100%',
  height: '6px',
  backgroundColor: 'rgba(255,255,255,0.08)',
  borderRadius: '3px',
  outline: 'none',
  cursor: 'pointer'
};

const sliderTicksStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '0.7rem',
  color: 'var(--text-dark)',
  marginTop: '0.35rem'
};

const storageMetaRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0.75rem',
  background: 'rgba(0,0,0,0.15)',
  borderRadius: '6px',
  border: '1px solid rgba(255,255,255,0.02)'
};
