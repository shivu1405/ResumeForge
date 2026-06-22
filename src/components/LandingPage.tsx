import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Cpu, 
  Sparkles, 
  Target, 
  HelpCircle, 
  CheckCircle, 
  ArrowRight, 
  ChevronDown, 
  Star 
} from 'lucide-react';
import { analyzeResume } from '../services/analyzerEngine';

export const LandingPage: React.FC = () => {
  const { setActiveView, selectResume, resumes } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Pre-load a demo resume for the user to try instantly
  const loadDemoResume = () => {
    const demoFileName = 'Jane_Doe_Fullstack_Engineer_Resume.pdf';
    const demoSize = 348201; // ~340KB
    const demoText = `
      JANE DOE
      San Francisco, CA | jane.doe@email.com | (555) 019-2834 | github.com/janedoe | linkedin.com/in/janedoe

      PROFESSIONAL SUMMARY
      Highly innovative Senior Fullstack Engineer with 5+ years of experience engineering scalable web applications. Spearheaded cloud-native migrations, designed modular micro-frontends, and optimized query performance. Passionate about robust testing, clean code, and mentoring junior engineers.

      EDUCATION
      B.S. in Computer Science - Stanford University (2018 - 2022)

      TECHNICAL SKILLS
      Programming Languages: JavaScript, TypeScript, Python, Go, SQL, HTML5, CSS3
      Frameworks & Libraries: React, Next.js, Express, Node.js, Spring Boot, Tailwind CSS, Redux
      Databases: PostgreSQL, MongoDB, Redis, SQLite
      Cloud & Devops: AWS, Docker, Kubernetes, Terraform, CI/CD pipelines (GitHub Actions)
      Tools & Version Control: Git, GitHub, GitLab, Postman, Figma, Jira, ESLint

      PROFESSIONAL EXPERIENCE
      Senior Software Engineer | Vercel Inc. | 2023 - Present
      - Spearheaded redesign of core dashboard metrics page using React, Next.js, and TypeScript, reducing time-to-interactive by 40%.
      - Created automated CI/CD workflows using GitHub Actions and Docker, streamlining deployment times by 25%.
      - Optimized PostgreSQL database configurations and query performance, saving $12,000 in monthly database compute costs.
      - Guided a team of 4 software engineering interns, mentoring them in clean testing practices.

      Software Developer | Stripe | 2022 - 2023
      - Implemented responsive payment integration widgets, boosting check-out conversions by 15% across 200+ partner storefronts.
      - Developed backend microservices using Node.js, Express, and Docker, handling 5M+ daily requests with 99.99% uptime.
      - Managed migration of local cache databases to Redis clusters, decreasing API response latency by 80ms.
      - Coordinated with product management to deliver analytics panels using Tailwind CSS.
    `;

    // Process using our engine
    const analysis = analyzeResume(demoFileName, demoSize, demoText, 'Fullstack Developer');
    
    // Check if demo already exists in active list, if not add it
    const existing = resumes.find(r => r.fileName === demoFileName);
    if (!existing) {
      // Trigger context state updates manually by mimicking file upload or directly placing
      // We can use a trick: save to localstorage and reload, or use local state since resumes is backed by it.
      const currentList = [...resumes];
      const index = currentList.findIndex(r => r.fileName === demoFileName);
      if (index >= 0) {
        currentList[index] = analysis;
      } else {
        currentList.unshift(analysis);
      }
      localStorage.setItem('rf_resumes', JSON.stringify(currentList));
      localStorage.setItem('rf_active_id', analysis.id);
      
      // Force reload page or dispatch window event to trigger Context sync, or just select it
      // Let's do selectResume which works if the list updates. 
      // The easiest way is to trigger a reload or simply call window.location.reload() to boot context with new localStorage.
      window.location.reload();
    } else {
      selectResume(existing.id);
      setActiveView('dashboard');
    }
  };

  const features = [
    {
      title: 'ATS Scoring Algorithm',
      desc: 'Receive an instant scoring breakdown evaluating word count, contact details, standard headings, and action verb density.',
      icon: Cpu,
      color: '#8b5cf6'
    },
    {
      title: 'Semantic Job Matching',
      desc: 'Paste any target job description and get a complete skill-gap report with matching and missing keywords.',
      icon: Target,
      color: '#3b82f6'
    },
    {
      title: 'AI Interview Coach',
      desc: 'Get highly tailored technical, project-based, behavioral, and HR questions based on your actual work history.',
      icon: HelpCircle,
      color: '#10b981'
    },
    {
      title: 'Dynamic Roadmap & Checklist',
      desc: 'Work through an interactive checkoff list and step-by-step career path to optimize your document for hiring pipelines.',
      icon: Sparkles,
      color: '#f59e0b'
    }
  ];

  const steps = [
    { step: '01', title: 'Upload Resume', desc: 'Drag and drop your resume in PDF format. Our parser extracts all text metadata instantly.' },
    { step: '02', title: 'ATS Analysis', desc: 'Scan structures, formatting gaps, vocabulary, and keywords to calculate your overall score.' },
    { step: '03', title: 'Job Tailoring', desc: 'Compare against specific job requirements to reveal missing terms and semantic mismatches.' },
    { step: '04', title: 'Prepare & Forge', desc: 'Review custom interview guidelines and checklist tasks to lock down your target interview.' }
  ];

  const faqs = [
    { q: 'How does the ATS score work?', a: 'Our analyzer evaluates your document against standard recruiting formats, contact information existence, section structure (Education, Experience, Skills, Projects), overall word density, and keyword usage. This mirrors the automated parsers used by Fortune 500 companies.' },
    { q: 'Is my resume data secure?', a: 'Yes, 100%. Resume Forge performs all parsing and analysis directly in your browser. Your files and extracted texts are saved exclusively in your local storage. No data is sent or saved on external servers.' },
    { q: 'Can I track multiple resumes?', a: 'Yes! You can upload different files, and they will accumulate in your local sidebar history. You can swap between files, delete old versions, or re-parse updated copies as you optimize.' },
    { q: 'Does it support formats other than PDF?', a: 'Currently, Resume Forge focuses on standard PDF uploads to ensure formatting and layout structures remain intact for extraction. We recommend exporting Word documents to PDF before upload.' }
  ];

  return (
    <div style={landingStyle}>
      {/* Background Gradients */}
      <div style={glowTopStyle}></div>
      <div style={glowBottomStyle}></div>

      {/* Header / Nav */}
      <header style={headerStyle}>
        <div style={logoStyle}>
          <div style={iconBoxStyle}><Cpu size={18} color="#a78bfa" /></div>
          <span style={logoTextStyle}>Resume<span style={{ color: '#60a5fa' }}>Forge</span></span>
        </div>
        <div>
          <button onClick={loadDemoResume} className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
            Launch Demo
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={heroSectionStyle}>
        <div style={heroBadgeStyle}>
          <Sparkles size={12} color="#a78bfa" />
          <span>The Ultimate ATS Optimization Suite</span>
        </div>
        <h1 style={heroHeadlineStyle}>
          Forge Resumes That <br />
          <span style={heroGradientStyle}>Get Hired.</span>
        </h1>
        <p style={heroSubheadStyle}>
          AI-powered ATS analysis, job matching, and interview preparation in one premium dashboard. Unlock recruiter callbacks in minutes.
        </p>
        <div style={ctaGroupStyle}>
          <button 
            onClick={() => setActiveView('analysis')} 
            className="btn btn-primary"
            style={{ padding: '0.9rem 2.2rem', fontSize: '1rem', borderRadius: '10px' }}
          >
            Analyze Resume <ArrowRight size={18} />
          </button>
          <button 
            onClick={loadDemoResume} 
            className="btn btn-secondary"
            style={{ padding: '0.9rem 2.2rem', fontSize: '1rem', borderRadius: '10px' }}
          >
            View Demo Profile
          </button>
        </div>
        
        {/* Animated mockup container */}
        <div style={mockupContainerStyle}>
          <div style={mockupHeaderStyle}>
            <div style={dotStyle('#f43f5e')}></div>
            <div style={dotStyle('#f59e0b')}></div>
            <div style={dotStyle('#10b981')}></div>
            <div style={mockupTitleStyle}>app.resumeforge.co/dashboard</div>
          </div>
          <div style={mockupContentStyle}>
            <div style={mockupSidebarStyle}>
              <div style={mockupItemStyle(true)}></div>
              <div style={mockupItemStyle()}></div>
              <div style={mockupItemStyle()}></div>
              <div style={mockupItemStyle()}></div>
            </div>
            <div style={mockupBodyStyle}>
              <div style={mockupGridStyle}>
                <div style={mockupCardStyle(true)}>
                  <div style={cardGlowStyle}></div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ATS SCORE</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', margin: '0.5rem 0' }}>88<span style={{ fontSize: '1rem', color: 'var(--accent-purple)' }}>/100</span></div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: '88%', height: '100%', background: 'var(--primary-gradient)' }}></div>
                  </div>
                </div>
                <div style={mockupCardStyle()}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MATCH RATING</div>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-blue)', margin: '0.65rem 0' }}>74%</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--accent-amber)' }}>⚠️ 4 skills missing</div>
                </div>
                <div style={mockupCardStyle()}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ROADMAP STEPS</div>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-emerald)', margin: '0.65rem 0' }}>2 / 5</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Next: Quantify results</div>
                </div>
              </div>
              <div style={{ ...mockupCardStyle(), height: '120px', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ width: '30%', height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
                <div style={{ width: '80%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}></div>
                <div style={{ width: '90%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}></div>
                <div style={{ width: '60%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>Engineered for Impact</h2>
          <p style={sectionSubtitleStyle}>We built Resume Forge to give job seekers an edge in competitive recruiting pipelines.</p>
        </div>
        <div style={featuresGridStyle}>
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div key={i} className="glass-card" style={featureCardStyle}>
                <div style={featureIconBoxStyle(feat.color)}>
                  <Icon size={20} color={feat.color} />
                </div>
                <h3 style={featureTitleStyle}>{feat.title}</h3>
                <p style={featureDescStyle}>{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it Works */}
      <section style={howItWorksSectionStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>Simple, Repeatable Optimization</h2>
          <p style={sectionSubtitleStyle}>Go from raw draft to recruiter-ready in four automated steps.</p>
        </div>
        <div style={stepsContainerStyle}>
          {steps.map((st, i) => (
            <div key={i} style={stepCardStyle}>
              <div style={stepNumberStyle}>{st.step}</div>
              <h3 style={stepTitleStyle}>{st.title}</h3>
              <p style={stepDescStyle}>{st.desc}</p>
              {i < steps.length - 1 && <div style={stepConnectorStyle}></div>}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>Success Stories</h2>
          <p style={sectionSubtitleStyle}>Hear from engineers and developers who used Resume Forge to unlock interviews.</p>
        </div>
        <div style={testimonialsGridStyle}>
          <div className="glass-card" style={testimonialCardStyle}>
            <div style={starsStyle}><Star size={14} color="#f59e0b" fill="#f59e0b" /><Star size={14} color="#f59e0b" fill="#f59e0b" /><Star size={14} color="#f59e0b" fill="#f59e0b" /><Star size={14} color="#f59e0b" fill="#f59e0b" /><Star size={14} color="#f59e0b" fill="#f59e0b" /></div>
            <p style={testiTextStyle}>"I was applying to 50+ roles with no callbacks. I ran my resume through Resume Forge, saw my ATS score was 42, and realized I lacked critical cloud keywords. After addressing the suggestions, my score hit 85, and I landed interviews at Vercel and Amazon!"</p>
            <div style={testiUserStyle}>
              <div style={userAvatarStyle('var(--accent-purple)')}>AM</div>
              <div>
                <div style={userNameStyle}>Alex Miller</div>
                <div style={userRoleStyle}>Frontend Engineer at Vercel</div>
              </div>
            </div>
          </div>
          <div className="glass-card" style={testimonialCardStyle}>
            <div style={starsStyle}><Star size={14} color="#f59e0b" fill="#f59e0b" /><Star size={14} color="#f59e0b" fill="#f59e0b" /><Star size={14} color="#f59e0b" fill="#f59e0b" /><Star size={14} color="#f59e0b" fill="#f59e0b" /><Star size={14} color="#f59e0b" fill="#f59e0b" /></div>
            <p style={testiTextStyle}>"The interview prep questions were scary accurate. It extracted specific Redis caches from my projects and grilled me on data consistency and cluster modes. When the hiring manager asked the same questions in the round, I nailed it."</p>
            <div style={testiUserStyle}>
              <div style={userAvatarStyle('var(--accent-blue)')}>SK</div>
              <div>
                <div style={userNameStyle}>Sarah K.</div>
                <div style={userRoleStyle}>Backend Engineer at Stripe</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>Simple, Transparent Pricing</h2>
          <p style={sectionSubtitleStyle}>Choose the tier that fits your job search timeline.</p>
        </div>
        <div style={pricingGridStyle}>
          {/* Free Tier */}
          <div className="glass-card" style={pricingCardStyle(false)}>
            <div style={tierNameStyle}>Basic</div>
            <div style={priceStyle}>$0<span style={pricePeriodStyle}>/month</span></div>
            <p style={priceDescStyle}>Everything you need to scan formatting and verify basics.</p>
            <ul style={featuresListStyle}>
              <li style={featureItemStyle}><CheckCircle size={14} color="var(--accent-emerald)" /> 3 ATS Score Audits</li>
              <li style={featureItemStyle}><CheckCircle size={14} color="var(--accent-emerald)" /> Basic Skill Tagging</li>
              <li style={featureItemStyle}><CheckCircle size={14} color="var(--accent-emerald)" /> In-browser Text Extraction</li>
              <li style={featureItemStyle}><CheckCircle size={14} color="var(--accent-emerald)" /> Local Storage Save</li>
            </ul>
            <button onClick={() => setActiveView('analysis')} className="btn btn-secondary" style={{ width: '100%', marginTop: 'auto' }}>
              Get Started
            </button>
          </div>
          {/* Pro Tier */}
          <div className="glass-card" style={pricingCardStyle(true)}>
            <div style={ribbonStyle}>POPULAR</div>
            <div style={tierNameStyle}>Pro Forge</div>
            <div style={priceStyle}>$12<span style={pricePeriodStyle}>/month</span></div>
            <p style={priceDescStyle}>For serious job seekers active in multiple application queues.</p>
            <ul style={featuresListStyle}>
              <li style={featureItemStyle}><CheckCircle size={14} color="var(--accent-emerald)" /> Unlimited ATS Score Audits</li>
              <li style={featureItemStyle}><CheckCircle size={14} color="var(--accent-emerald)" /> Deep-Match Job Matching</li>
              <li style={featureItemStyle}><CheckCircle size={14} color="var(--accent-emerald)" /> AI Interview prep generator</li>
              <li style={featureItemStyle}><CheckCircle size={14} color="var(--accent-emerald)" /> Dynamic Career Roadmap</li>
              <li style={featureItemStyle}><CheckCircle size={14} color="var(--accent-emerald)" /> PDF Report Export</li>
            </ul>
            <button onClick={loadDemoResume} className="btn btn-primary" style={{ width: '100%', marginTop: 'auto' }}>
              Try Pro Demo
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ ...sectionStyle, marginBottom: '6rem' }}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>Frequently Asked Questions</h2>
          <p style={sectionSubtitleStyle}>Everything you need to know about the platform.</p>
        </div>
        <div style={faqContainerStyle}>
          {faqs.map((faq, idx) => (
            <div key={idx} style={faqItemStyle} onClick={() => toggleFaq(idx)}>
              <div style={faqQuestionStyle}>
                <span>{faq.q}</span>
                <ChevronDown 
                  size={16} 
                  style={{ 
                    transform: openFaq === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease'
                  }} 
                />
              </div>
              {openFaq === idx && (
                <div style={faqAnswerStyle} className="animate-fade">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={footerStyle}>
        <div style={footerMainStyle}>
          <div>
            <div style={{ ...logoStyle, marginBottom: '0.75rem' }}>
              <div style={iconBoxStyle}><Cpu size={16} color="#a78bfa" /></div>
              <span style={logoTextStyle}>ResumeForge</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '280px' }}>
              Building premium tools to accelerate your engineering career and beat automated filters.
            </p>
          </div>
          <div style={footerLinksContainerStyle}>
            <div style={footerColumnStyle}>
              <div style={footerColTitleStyle}>Product</div>
              <span style={footerLinkStyle} onClick={() => setActiveView('analysis')}>ATS Analysis</span>
              <span style={footerLinkStyle} onClick={() => setActiveView('match')}>Job Matching</span>
              <span style={footerLinkStyle} onClick={() => setActiveView('interview')}>Interview Coach</span>
            </div>
            <div style={footerColumnStyle}>
              <div style={footerColTitleStyle}>Resources</div>
              <span style={footerLinkStyle}>Blog</span>
              <span style={footerLinkStyle}>Resume Templates</span>
              <span style={footerLinkStyle}>API Docs</span>
            </div>
            <div style={footerColumnStyle}>
              <div style={footerColTitleStyle}>Legal</div>
              <span style={footerLinkStyle}>Privacy Policy</span>
              <span style={footerLinkStyle}>Terms of Service</span>
            </div>
          </div>
        </div>
        <div style={footerBottomStyle}>
          <span>&copy; {new Date().getFullYear()} Resume Forge. Built for software portfolios.</span>
          <span>Designed with Vercel aesthetic.</span>
        </div>
      </footer>
    </div>
  );
};

// Inline styles for Landing page
const landingStyle: React.CSSProperties = {
  backgroundColor: 'var(--bg-dark)',
  position: 'relative',
  minHeight: '100vh',
  width: '100%',
  fontFamily: 'var(--font-body)',
  color: 'var(--text-main)',
  overflowX: 'hidden'
};

const glowTopStyle: React.CSSProperties = {
  position: 'absolute',
  top: '-150px',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '600px',
  height: '400px',
  background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
  zIndex: 0,
  pointerEvents: 'none'
};

const glowBottomStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: '100px',
  left: '10%',
  width: '500px',
  height: '500px',
  background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 60%)',
  zIndex: 0,
  pointerEvents: 'none'
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '1.5rem 6%',
  borderBottom: '1px solid var(--border-light)',
  backdropFilter: 'blur(8px)',
  position: 'sticky',
  top: 0,
  zIndex: 100,
  backgroundColor: 'rgba(3, 0, 20, 0.6)'
};

const logoStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  cursor: 'pointer'
};

const iconBoxStyle: React.CSSProperties = {
  padding: '0.4rem',
  borderRadius: '6px',
  background: 'rgba(139, 92, 246, 0.15)',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  display: 'flex'
};

const logoTextStyle: React.CSSProperties = {
  fontFamily: 'var(--font-heading)',
  fontWeight: 800,
  fontSize: '1.1rem',
  color: '#fff',
  letterSpacing: '-0.02em'
};

const heroSectionStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: '6rem 1.5rem 4rem 1.5rem',
  maxWidth: '900px',
  margin: '0 auto',
  position: 'relative',
  zIndex: 1
};

const heroBadgeStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.35rem 0.85rem',
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(139, 92, 246, 0.25)',
  borderRadius: '9999px',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: '#c084fc',
  marginBottom: '1.5rem'
};

const heroHeadlineStyle: React.CSSProperties = {
  fontSize: '3.75rem',
  lineHeight: 1.15,
  fontWeight: 800,
  color: '#fff',
  fontFamily: 'var(--font-heading)',
  marginBottom: '1.5rem',
  letterSpacing: '-0.03em'
};

const heroGradientStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #a78bfa 20%, #60a5fa 80%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent'
};

const heroSubheadStyle: React.CSSProperties = {
  fontSize: '1.15rem',
  color: 'var(--text-muted)',
  lineHeight: 1.6,
  marginBottom: '2.5rem',
  maxWidth: '650px'
};

const ctaGroupStyle: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
  marginBottom: '4rem',
  flexWrap: 'wrap',
  justifyContent: 'center'
};

const mockupContainerStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '750px',
  background: 'rgba(5, 5, 15, 0.8)',
  border: '1px solid var(--border-light)',
  borderRadius: '12px',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(139, 92, 246, 0.08)',
  overflow: 'hidden'
};

const mockupHeaderStyle: React.CSSProperties = {
  padding: '0.75rem 1rem',
  background: 'rgba(255, 255, 255, 0.02)',
  borderBottom: '1px solid var(--border-light)',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem'
};

const dotStyle = (color: string): React.CSSProperties => ({
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  backgroundColor: color
});

const mockupTitleStyle: React.CSSProperties = {
  fontSize: '0.7rem',
  color: 'var(--text-dark)',
  marginLeft: 'auto',
  marginRight: 'auto',
  fontFamily: 'monospace'
};

const mockupContentStyle: React.CSSProperties = {
  display: 'flex',
  height: '240px'
};

const mockupSidebarStyle: React.CSSProperties = {
  width: '60px',
  borderRight: '1px solid var(--border-light)',
  padding: '1rem 0.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  alignItems: 'center'
};

const mockupItemStyle = (active = false): React.CSSProperties => ({
  width: '28px',
  height: '8px',
  borderRadius: '2px',
  background: active ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.05)'
});

const mockupBodyStyle: React.CSSProperties = {
  flex: 1,
  padding: '1.25rem'
};

const mockupGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '1rem'
};

const mockupCardStyle = (hasGlow = false): React.CSSProperties => ({
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid var(--border-light)',
  borderRadius: '8px',
  padding: '0.75rem',
  textAlign: 'left',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: hasGlow ? 'inset 0 0 15px rgba(139,92,246,0.1)' : 'none'
});

const cardGlowStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
  pointerEvents: 'none'
};

const sectionStyle: React.CSSProperties = {
  padding: '6rem 8%',
  maxWidth: '1200px',
  margin: '0 auto',
  zIndex: 1,
  position: 'relative'
};

const howItWorksSectionStyle: React.CSSProperties = {
  padding: '6rem 8%',
  maxWidth: '1200px',
  margin: '0 auto',
  zIndex: 1,
  position: 'relative',
  borderTop: '1px solid rgba(255, 255, 255, 0.03)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.03)'
};

const sectionHeaderStyle: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '4rem'
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '2.25rem',
  fontWeight: 800,
  marginBottom: '1rem'
};

const sectionSubtitleStyle: React.CSSProperties = {
  fontSize: '1rem',
  color: 'var(--text-muted)',
  maxWidth: '600px',
  margin: '0 auto',
  lineHeight: 1.5
};

const featuresGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '1.75rem'
};

const featureCardStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '2rem 1.75rem'
};

const featureIconBoxStyle = (color: string): React.CSSProperties => ({
  width: '40px',
  height: '40px',
  borderRadius: '8px',
  background: `rgba(${color === '#8b5cf6' ? '139, 92, 246' : color === '#3b82f6' ? '59, 130, 246' : color === '#10b981' ? '16, 185, 129' : '245, 158, 11'}, 0.15)`,
  border: `1px solid rgba(${color === '#8b5cf6' ? '139, 92, 246' : color === '#3b82f6' ? '59, 130, 246' : color === '#10b981' ? '16, 185, 129' : '245, 158, 11'}, 0.3)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '1.25rem'
});

const featureTitleStyle: React.CSSProperties = {
  fontSize: '1.15rem',
  fontWeight: 700,
  marginBottom: '0.5rem'
};

const featureDescStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  color: 'var(--text-muted)',
  lineHeight: 1.5
};

const stepsContainerStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '2rem',
  position: 'relative'
};

const stepCardStyle: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: '1rem'
};

const stepNumberStyle: React.CSSProperties = {
  fontSize: '2.5rem',
  fontFamily: 'monospace',
  fontWeight: 900,
  background: 'linear-gradient(135deg, rgba(139,92,246,0.3) 0%, rgba(59,130,246,0.3) 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: '0.5rem'
};

const stepTitleStyle: React.CSSProperties = {
  fontSize: '1.1rem',
  fontWeight: 700,
  marginBottom: '0.5rem'
};

const stepDescStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  color: 'var(--text-muted)',
  lineHeight: 1.5
};

const stepConnectorStyle: React.CSSProperties = {
  position: 'absolute',
  top: '30px',
  right: '-30px',
  width: '40px',
  height: '1px',
  background: 'linear-gradient(90deg, rgba(139,92,246,0.2) 0%, transparent 100%)',
  zIndex: 0
};

const testimonialsGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '2rem'
};

const testimonialCardStyle: React.CSSProperties = {
  padding: '2.25rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: '1.5rem'
};

const starsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.2rem',
  marginBottom: '0.5rem'
};

const testiTextStyle: React.CSSProperties = {
  fontSize: '0.9rem',
  lineHeight: 1.6,
  color: 'var(--text-main)',
  fontStyle: 'italic'
};

const testiUserStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem'
};

const userAvatarStyle = (bg: string): React.CSSProperties => ({
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  background: bg,
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: '0.85rem'
});

const userNameStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  fontWeight: 600,
  color: '#fff'
};

const userRoleStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'var(--text-dark)'
};

const pricingGridStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: '2.5rem',
  flexWrap: 'wrap',
  maxWidth: '850px',
  margin: '0 auto'
};

const pricingCardStyle = (isPopular: boolean): React.CSSProperties => ({
  flex: '1 1 350px',
  padding: '2.5rem 2rem',
  display: 'flex',
  flexDirection: 'column',
  border: isPopular ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid var(--border-light)',
  boxShadow: isPopular ? '0 10px 30px rgba(139, 92, 246, 0.15)' : 'none',
  transform: isPopular ? 'scale(1.03)' : 'none'
});

const ribbonStyle: React.CSSProperties = {
  position: 'absolute',
  top: '12px',
  right: '12px',
  background: 'var(--primary-gradient)',
  fontSize: '0.65rem',
  fontWeight: 700,
  padding: '0.2rem 0.5rem',
  borderRadius: '4px',
  letterSpacing: '0.05em'
};

const tierNameStyle: React.CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 700,
  color: '#fff',
  marginBottom: '0.5rem'
};

const priceStyle: React.CSSProperties = {
  fontSize: '2.5rem',
  fontWeight: 800,
  color: '#fff',
  marginBottom: '0.75rem'
};

const pricePeriodStyle: React.CSSProperties = {
  fontSize: '1rem',
  color: 'var(--text-muted)',
  fontWeight: 500
};

const priceDescStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  color: 'var(--text-muted)',
  lineHeight: 1.4,
  marginBottom: '1.5rem'
};

const featuresListStyle: React.CSSProperties = {
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  marginBottom: '2rem'
};

const featureItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '0.85rem',
  color: 'var(--text-main)'
};

const faqContainerStyle: React.CSSProperties = {
  maxWidth: '750px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};

const faqItemStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid var(--border-light)',
  borderRadius: '8px',
  cursor: 'pointer',
  padding: '1.25rem',
  transition: 'border-color 0.2s ease'
};

const faqQuestionStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontWeight: 600,
  fontSize: '0.95rem'
};

const faqAnswerStyle: React.CSSProperties = {
  marginTop: '0.75rem',
  fontSize: '0.85rem',
  color: 'var(--text-muted)',
  lineHeight: 1.5,
  borderTop: '1px solid rgba(255,255,255,0.05)',
  paddingTop: '0.75rem'
};

const footerStyle: React.CSSProperties = {
  borderTop: '1px solid var(--border-light)',
  padding: '4rem 6% 2rem 6%',
  backgroundColor: '#02000c',
  position: 'relative',
  zIndex: 1
};

const footerMainStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '3rem',
  marginBottom: '3rem',
  maxWidth: '1200px',
  margin: '0 auto 3rem auto'
};

const footerLinksContainerStyle: React.CSSProperties = {
  display: 'flex',
  gap: '4rem',
  flexWrap: 'wrap'
};

const footerColumnStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem'
};

const footerColTitleStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  color: '#fff',
  letterSpacing: '0.05em',
  marginBottom: '0.25rem'
};

const footerLinkStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  color: 'var(--text-muted)',
  cursor: 'pointer',
  transition: 'color 0.2s ease'
};

const footerBottomStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '1rem',
  fontSize: '0.75rem',
  color: 'var(--text-dark)',
  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  paddingTop: '1.5rem',
  maxWidth: '1200px',
  margin: '0 auto'
};
