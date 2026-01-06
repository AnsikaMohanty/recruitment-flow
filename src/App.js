import React, { useState, useEffect } from 'react';
import { User, Users, BarChart3, Upload, Clock, Brain, MessageSquare, FileStack, UserCheck, Play, Pause, SkipForward, SkipBack, X } from 'lucide-react';

const FlowchartNode = ({ title, icon: Icon, x, y, isHighlighted, onHover, onLeave, delay = 0, category }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  const categoryColors = {
    candidate: 'linear-gradient(135deg, #9333ea 0%, #db2777 100%)',
    recruiter: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
    process: 'linear-gradient(135deg, #16a34a 0%, #10b981 100%)',
    result: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)',
  };

  const nodeStyle = {
    position: 'absolute',
    left: `${x}px`,
    top: `${y}px`,
    padding: '14px 20px',
    borderRadius: '16px',
    border: isHighlighted ? '2px solid white' : '2px solid #4b5563',
    background: isHighlighted ? categoryColors[category] : 'rgba(31, 41, 55, 0.8)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    minWidth: '140px',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    transform: isVisible 
      ? (isHighlighted ? 'scale(1.1)' : 'scale(1)') 
      : 'translateY(-20px) scale(0.8)',
    opacity: isVisible ? 1 : 0,
    boxShadow: isHighlighted 
      ? '0 20px 60px rgba(59, 130, 246, 0.5), 0 0 30px rgba(59, 130, 246, 0.3)' 
      : '0 4px 6px rgba(0, 0, 0, 0.1)',
    animation: isHighlighted ? 'pulse 2s ease-in-out infinite' : 'none',
  };

  const iconStyle = {
    width: '18px',
    height: '18px',
    color: 'white',
    flexShrink: 0,
    animation: isHighlighted ? 'bounce 1s ease infinite' : 'none',
  };

  const textStyle = {
    fontWeight: 600,
    fontSize: '14px',
    color: isHighlighted ? 'white' : '#d1d5db',
    position: 'relative',
    zIndex: 10,
    whiteSpace: 'nowrap',
  };

  return (
    <div
      style={nodeStyle}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {isHighlighted && (
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.1)',
          animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        }} />
      )}
      {Icon && <Icon style={iconStyle} />}
      <span style={textStyle}>{title}</span>
    </div>
  );
};

const Arrow = ({ x1, y1, x2, y2, isHighlighted, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  
  const containerStyle = {
    position: 'absolute',
    left: `${x1}px`,
    top: `${y1}px`,
    width: `${length}px`,
    transform: `rotate(${angle}deg)`,
    transformOrigin: '0 0',
    transition: 'all 0.3s ease',
  };

  const lineStyle = {
    position: 'relative',
    height: '3px',
    width: isVisible ? '100%' : '0%',
    background: isHighlighted 
      ? 'linear-gradient(90deg, #60a5fa, #22d3ee)' 
      : 'rgba(75, 85, 99, 0.6)',
    borderRadius: '4px',
    transition: 'all 0.5s ease',
    boxShadow: isHighlighted ? '0 0 20px rgba(34, 211, 238, 0.5)' : 'none',
    overflow: 'hidden',
  };

  const arrowStyle = {
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: 0,
    height: 0,
    borderLeft: `8px solid ${isHighlighted ? '#22d3ee' : 'rgba(75, 85, 99, 0.6)'}`,
    borderTop: '5px solid transparent',
    borderBottom: '5px solid transparent',
    opacity: isVisible ? 1 : 0,
    transition: 'all 0.3s ease',
    filter: isHighlighted ? 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.8))' : 'none',
  };

  return (
    <div style={containerStyle}>
      <div style={lineStyle}>
        {isHighlighted && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '4px',
            animation: 'flow 2s linear infinite',
          }} />
        )}
      </div>
      <div style={arrowStyle} />
    </div>
  );
};

export default function RecruitmentPipeline() {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [showInfo, setShowInfo] = useState(true);
  const [presentationMode, setPresentationMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const connections = {
    'Candidate': ['Profile', 'Dashboard', 'Upload', 'History'],
    'Users': ['Candidate', 'Recruiter'],
    'Upload': ['AI Insights', 'Parsed Result'],
    'Recruiter': ['Candidates', 'Bulk Upload', 'Profile-R'],
    'Candidates': ['Chatbot'],
    'Bulk Upload': ['Bulk Results'],
  };

  const presentationSteps = [
    {
      title: "Step 1: User Entry Point",
      nodes: ['Users'],
      description: "The system starts here. Users can be either candidates looking for jobs or recruiters looking for talent. This module intelligently routes users to their respective workflows."
    },
    {
      title: "Step 2: Candidate Path",
      nodes: ['Users', 'Candidate'],
      description: "When a candidate logs in, they access the Candidate module. This is the central hub for all candidate activities including profile management and resume uploads."
    },
    {
      title: "Step 3: Profile & Dashboard",
      nodes: ['Candidate', 'Profile', 'Dashboard'],
      description: "Candidates can view their Profile (personal information, contact details) and Dashboard (overview of uploaded resumes, application status, and insights)."
    },
    {
      title: "Step 4: Resume Upload",
      nodes: ['Candidate', 'Upload'],
      description: "Candidates upload their resume files through the Upload module. The system accepts various formats like PDF, DOC, and DOCX for processing."
    },
    {
      title: "Step 5: Resume History",
      nodes: ['Candidate', 'History'],
      description: "The History module stores all previously uploaded resumes and their analysis results, allowing candidates to track changes and improvements over time."
    },
    {
      title: "Step 6: AI Processing - Parsing",
      nodes: ['Upload', 'Parsed Result'],
      description: "The Parsed Result extracts structured information from the resume including skills, education, work experience, certifications, and contact information using advanced parsing algorithms."
    },
    {
      title: "Step 7: AI Processing - Insights",
      nodes: ['Upload', 'AI Insights'],
      description: "AI Insights analyzes the resume content and provides smart recommendations such as skill gaps, resume strengths, formatting suggestions, and career improvement tips."
    },
    {
      title: "Step 8: Recruiter Path",
      nodes: ['Users', 'Recruiter'],
      description: "When a recruiter logs in, they access the Recruiter module. This is the command center for talent acquisition and candidate management activities."
    },
    {
      title: "Step 9: Recruiter Profile",
      nodes: ['Recruiter', 'Profile-R'],
      description: "Recruiters manage their professional profile including company information, job postings, and preferences for candidate screening."
    },
    {
      title: "Step 10: View Candidates",
      nodes: ['Recruiter', 'Candidates'],
      description: "Recruiters can browse, search, and filter through candidate profiles. They can view parsed resumes, AI insights, and make shortlisting decisions."
    },
    {
      title: "Step 11: AI Chatbot Assistant",
      nodes: ['Candidates', 'Chatbot'],
      description: "The AI Chatbot helps recruiters with queries like 'Show me top Java developers' or 'Find candidates with 5+ years in ML'. It provides intelligent search and recommendations."
    },
    {
      title: "Step 12: Bulk Upload",
      nodes: ['Recruiter', 'Bulk Upload'],
      description: "Recruiters can upload multiple resumes at once (batch processing) to quickly build their candidate database and save time on manual entries."
    },
    {
      title: "Step 13: Bulk Results",
      nodes: ['Bulk Upload', 'Bulk Results'],
      description: "All processed resumes from bulk upload are displayed here with parsed information and AI insights, ready for review and candidate shortlisting."
    },
    {
      title: "Complete Pipeline",
      nodes: ['Users', 'Candidate', 'Profile', 'Dashboard', 'Upload', 'History', 'Parsed Result', 'AI Insights', 'Recruiter', 'Profile-R', 'Candidates', 'Chatbot', 'Bulk Upload', 'Bulk Results'],
      description: "This is the complete recruitment pipeline! Candidates upload resumes that get AI-processed, while recruiters efficiently manage and search through talent using intelligent tools. The system streamlines the entire hiring process from application to selection."
    }
  ];

  useEffect(() => {
    let interval;
    if (isPlaying && presentationMode) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= presentationSteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, presentationMode, presentationSteps.length]);

  const getHighlightedNodes = (nodeId) => {
    if (presentationMode) {
      return presentationSteps[currentStep].nodes;
    }
    if (!nodeId) return [];
    const connected = connections[nodeId] || [];
    const connectedTo = Object.keys(connections).filter(key => 
      connections[key].includes(nodeId)
    );
    return [nodeId, ...connected, ...connectedTo];
  };

  const highlightedNodes = getHighlightedNodes(hoveredNode);

  const isConnectionHighlighted = (from, to) => {
    return highlightedNodes.includes(from) && highlightedNodes.includes(to);
  };

  const nodes = [
    { id: 'Profile', title: 'Profile', icon: User, x: 50, y: 30, delay: 0, category: 'candidate' },
    { id: 'Dashboard', title: 'Dashboard', icon: BarChart3, x: 50, y: 140, delay: 0.1, category: 'candidate' },
    { id: 'Candidate', title: 'Candidate', icon: UserCheck, x: 320, y: 85, delay: 0.3, category: 'candidate' },
    { id: 'Users', title: 'Users', icon: Users, x: 600, y: 70, delay: 0.2, category: 'process' },
    { id: 'Upload', title: 'Upload', icon: Upload, x: 200, y: 250, delay: 0.4, category: 'process' },
    { id: 'History', title: 'History', icon: Clock, x: 420, y: 250, delay: 0.4, category: 'process' },
    { id: 'Parsed Result', title: 'Parsed Result', icon: FileStack, x: 30, y: 400, delay: 0.5, category: 'result' },
    { id: 'AI Insights', title: 'AI Insights', icon: Brain, x: 340, y: 400, delay: 0.5, category: 'result' },
    { id: 'Recruiter', title: 'Recruiter', icon: Users, x: 900, y: 85, delay: 0.6, category: 'recruiter' },
    { id: 'Candidates', title: 'Candidates', icon: Users, x: 700, y: 250, delay: 0.7, category: 'recruiter' },
    { id: 'Bulk Upload', title: 'Bulk Upload', icon: Upload, x: 900, y: 250, delay: 0.7, category: 'recruiter' },
    { id: 'Profile-R', title: 'Profile', icon: User, x: 1100, y: 250, delay: 0.7, category: 'recruiter' },
    { id: 'Chatbot', title: 'Chatbot', icon: MessageSquare, x: 700, y: 400, delay: 0.8, category: 'result' },
    { id: 'Bulk Results', title: 'Bulk Results', icon: FileStack, x: 900, y: 400, delay: 0.8, category: 'result' },
  ];

  const arrows = [
    { from: 'Candidate', to: 'Profile', x1: 320, y1: 110, x2: 190, y2: 55, delay: 0.3 },
    { from: 'Candidate', to: 'Dashboard', x1: 320, y1: 135, x2: 190, y2: 165, delay: 0.3 },
    { from: 'Users', to: 'Candidate', x1: 600, y1: 95, x2: 460, y2: 100, delay: 0.3 },
    { from: 'Users', to: 'Recruiter', x1: 740, y1: 95, x2: 900, y2: 100, delay: 0.6 },
    { from: 'Candidate', to: 'Upload', x1: 340, y1: 135, x2: 290, y2: 250, delay: 0.4 },
    { from: 'Candidate', to: 'History', x1: 420, y1: 135, x2: 465, y2: 250, delay: 0.4 },
    { from: 'Upload', to: 'Parsed Result', x1: 250, y1: 300, x2: 130, y2: 400, delay: 0.5 },
    { from: 'Upload', to: 'AI Insights', x1: 310, y1: 300, x2: 385, y2: 400, delay: 0.5 },
    { from: 'Recruiter', to: 'Candidates', x1: 910, y1: 135, x2: 760, y2: 250, delay: 0.7 },
    { from: 'Recruiter', to: 'Bulk Upload', x1: 960, y1: 135, x2: 960, y2: 250, delay: 0.7 },
    { from: 'Recruiter', to: 'Profile-R', x1: 1010, y1: 135, x2: 1150, y2: 250, delay: 0.7 },
    { from: 'Candidates', to: 'Chatbot', x1: 750, y1: 300, x2: 750, y2: 400, delay: 0.8 },
    { from: 'Bulk Upload', to: 'Bulk Results', x1: 960, y1: 300, x2: 960, y2: 400, delay: 0.8 },
  ];

  const buttonStyle = {
    background: 'rgba(59, 130, 246, 0.9)',
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    fontWeight: 600,
    transition: 'all 0.2s',
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f3a 50%, #0f1729 100%)',
      padding: '32px',
      overflow: 'auto',
      position: 'relative',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes flow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(1.1);
            opacity: 0;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.05,
        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }} />
      
      <div style={{
        position: 'relative',
        width: '100%',
        minHeight: '600px',
        paddingBottom: '100px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px',
          }}>Recruitment Pipeline Workflow</h1>
        </div>

        {/* Presentation Mode Button */}
        {!presentationMode && (
          <button
            onClick={() => {
              setPresentationMode(true);
              setCurrentStep(0);
            }}
            style={{
              ...buttonStyle,
              position: 'absolute',
              top: '20px',
              right: '32px',
              zIndex: 100,
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(37, 99, 235, 1)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(59, 130, 246, 0.9)'}
          >
            <Play size={16} />
            Start Presentation
          </button>
        )}

        {/* Presentation Controls - Right Bottom Corner */}
        {presentationMode && (
  <div style={{
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    background: 'rgba(17, 24, 39, 0.95)',
    padding: '16px 20px',
    borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
    border: '1px solid #374151',
    zIndex: 100,
    width: '360px',  // slightly smaller
    maxHeight: '50vh', // limit height
    overflowY: 'auto', // scroll if content too big
    animation: 'slideInRight 0.3s ease',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
      <div style={{ flex: 1 }}>
        <h3 style={{ color: '#60a5fa', fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>
          {presentationSteps[currentStep].title}
        </h3>
        <p style={{ color: '#d1d5db', fontSize: '12px', lineHeight: '1.4', margin: 0 }}>
          {presentationSteps[currentStep].description}
        </p>
      </div>
      <button
        onClick={() => {
          setPresentationMode(false);
          setIsPlaying(false);
          setCurrentStep(0);
        }}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#9ca3af',
          cursor: 'pointer',
          padding: '4px',
          marginLeft: '8px',
        }}
      >
        <X size={18} />
      </button>
    </div>

    {/* Progress Bar */}
    <div style={{ marginTop: '12px', marginBottom: '8px' }}>
      <div style={{ 
        height: '4px', 
        background: 'rgba(75, 85, 99, 0.5)', 
        borderRadius: '2px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
          width: `${((currentStep + 1) / presentationSteps.length) * 100}%`,
          transition: 'width 0.3s ease',
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
        <span style={{ color: '#9ca3af', fontSize: '11px' }}>
          Step {currentStep + 1} of {presentationSteps.length}
        </span>
        <span style={{ color: '#9ca3af', fontSize: '11px' }}>
          {Math.round(((currentStep + 1) / presentationSteps.length) * 100)}%
        </span>
      </div>
    </div>

    {/* Controls */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px' }}>
      <button
        onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
        disabled={currentStep === 0}
        style={{
          ...buttonStyle,
          opacity: currentStep === 0 ? 0.5 : 1,
          cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
          flex: 1,
          justifyContent: 'center',
          padding: '8px 10px',
          fontSize: '12px',
        }}
      >
        <SkipBack size={14} /> Prev
      </button>

      <button
        onClick={() => setIsPlaying(!isPlaying)}
        style={{
          ...buttonStyle,
          flex: 1,
          justifyContent: 'center',
          padding: '8px 10px',
          fontSize: '12px',
        }}
      >
        {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        {isPlaying ? 'Pause' : 'Play'}
      </button>

      <button
        onClick={() => setCurrentStep(Math.min(presentationSteps.length - 1, currentStep + 1))}
        disabled={currentStep === presentationSteps.length - 1}
        style={{
          ...buttonStyle,
          opacity: currentStep === presentationSteps.length - 1 ? 0.5 : 1,
          cursor: currentStep === presentationSteps.length - 1 ? 'not-allowed' : 'pointer',
          flex: 1,
          justifyContent: 'center',
          padding: '8px 10px',
          fontSize: '12px',
        }}
      >
        Next <SkipForward size={14} />
      </button>
    </div>
  </div>
)}

        
        {showInfo && !presentationMode && (
          <div style={{
            position: 'absolute',
            top: '120px',
            left: '32px',
            background: 'rgba(31, 41, 55, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid #374151',
            borderRadius: '12px',
            padding: '16px',
            maxWidth: '280px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            zIndex: 50,
          }}>
            <button 
              onClick={() => setShowInfo(false)}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                color: '#9ca3af',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              ✕
            </button>
            <h3 style={{ color: 'white', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>💡 How to Use</h3>
            <ul style={{ color: '#d1d5db', fontSize: '13px', listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '4px' }}>• Hover over nodes to see connections</li>
              <li style={{ marginBottom: '4px' }}>• Watch the animated data flow</li>
              <li style={{ marginBottom: '4px' }}>• Color-coded by category</li>
              <li>• Click "Start Presentation" for guided tour</li>
            </ul>
          </div>
        )}
        
        <div style={{
          position: 'absolute',
          top: '120px',
          right: '32px',
          background: 'rgba(31, 41, 55, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid #374151',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}>
          <h3 style={{ color: 'white', fontWeight: 600, marginBottom: '12px', fontSize: '14px' }}>Legend</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '12px', borderRadius: '4px', background: 'linear-gradient(90deg, #9333ea, #db2777)' }}></div>
              <span style={{ color: '#d1d5db' }}>Candidate</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '12px', borderRadius: '4px', background: 'linear-gradient(90deg, #2563eb, #06b6d4)' }}></div>
              <span style={{ color: '#d1d5db' }}>Recruiter</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '12px', borderRadius: '4px', background: 'linear-gradient(90deg, #16a34a, #10b981)' }}></div>
              <span style={{ color: '#d1d5db' }}>Process</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '12px', borderRadius: '4px', background: 'linear-gradient(90deg, #ea580c, #dc2626)' }}></div>
              <span style={{ color: '#d1d5db' }}>Result</span>
            </div>
          </div>
        </div>
        
        {arrows.map((arrow, idx) => (
          <Arrow
            key={idx}
            {...arrow}
            isHighlighted={isConnectionHighlighted(arrow.from, arrow.to)}
          />
        ))}
        
        {nodes.map((node) => (
          <FlowchartNode
            key={node.id}
            {...node}
            isHighlighted={highlightedNodes.includes(node.id)}
            onHover={() => !presentationMode && setHoveredNode(node.id)}
            onLeave={() => !presentationMode && setHoveredNode(null)}
          />
        ))}
      </div>
    </div>
  );
}