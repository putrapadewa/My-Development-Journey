import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  User,
  Shield,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Plus,
  RefreshCw,
  Zap,
  Lock,
  Compass,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';
import {
  UserProfile,
  AICoachSession,
  AICoachMessage,
  IndividualDevelopmentPlan,
  DevelopmentActivity,
} from '../../types';
import { triggerMilestoneCelebration } from '../../utils/confetti';

interface AICoachViewProps {
  currentUser: UserProfile;
  activeIdp: IndividualDevelopmentPlan;
  onAddActivityToIdp: (activity: Partial<DevelopmentActivity>) => void;
}

export const AICoachView: React.FC<AICoachViewProps> = ({
  currentUser,
  activeIdp,
  onAddActivityToIdp,
}) => {
  const [mode, setMode] = useState<'COACH' | 'MENTOR'>('COACH');
  const [topic, setTopic] = useState('Transitioning from Technical Architecture to Executive Influence');
  const [showTransparencyNotice, setShowTransparencyNotice] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentGrowStage, setCurrentGrowStage] = useState<'G' | 'R' | 'O' | 'W'>('G');

  const [messages, setMessages] = useState<AICoachMessage[]>([
    {
      id: 'init-msg-1',
      sender: 'assistant',
      timestamp: '10:00 AM',
      content: `Hello ${currentUser.name}! I am your personalized AI ${mode === 'COACH' ? 'Coach' : 'Mentor'}. I have reviewed your current profile as **${currentUser.position}** aiming for **Head of Enterprise Architecture**.

${mode === 'COACH' 
  ? '**[GROW - Goal Stage]**: What specific challenge, decision, or leadership inflection point would you like to explore today? What outcome would make this session a success?' 
  : '**[Mentor Guidance Ready]**: I can provide proven architectural frameworks, C-suite communication templates, and organizational influence strategies. What topic would you like to dive into?'
}`,
      growStage: 'G',
    },
  ]);

  const [keyReflections, setKeyReflections] = useState<string[]>([
    'Executive communication requires translating architectural trade-offs into business risk, velocity, and dollar ROI.',
  ]);
  const [actionCommitments, setActionCommitments] = useState<string[]>([
    'Draft a 1-page executive memo for the Group CTO before the steering committee.',
  ]);
  const [suggestedActivity, setSuggestedActivity] = useState<Partial<DevelopmentActivity> | null>({
    goal: 'Deliver high-impact executive presentation and secure stakeholder sign-off',
    programName: 'Executive Presentation & Strategic Steering Simulation',
    frameworkType: '20_EXPOSURE',
    measurement: 'Successful executive sign-off on quarterly initiative with positive sponsor feedback.',
    learningHours: 10,
    xpValue: 180,
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMsg: AICoachMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: inputMessage,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          userMessage: userMsg.content,
          currentStage: currentGrowStage,
          chatHistory: messages,
          contextData: {
            name: currentUser.name,
            position: currentUser.position,
            level: currentUser.level,
            businessUnit: currentUser.businessUnit,
            aspiration: 'Head of Enterprise Architecture',
            currentIdpObjective: activeIdp.primaryObjective,
          },
        }),
      });

      const data = await response.json();

      const botMsg: AICoachMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: data.response || 'Thank you for your reflection. Let us continue to build towards concrete action.',
        growStage: data.growStage || currentGrowStage,
      };

      setMessages((prev) => [...prev, botMsg]);
      if (data.growStage) setCurrentGrowStage(data.growStage);
      if (data.keyReflections?.length) setKeyReflections(data.keyReflections);
      if (data.actionCommitments?.length) setActionCommitments(data.actionCommitments);
      if (data.suggestedActivity) setSuggestedActivity(data.suggestedActivity);
    } catch (err) {
      console.error('Error in coach message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToIDP = () => {
    if (suggestedActivity) {
      onAddActivityToIdp(suggestedActivity);
      triggerMilestoneCelebration();
      alert('Action commitment successfully added to your active Individual Development Plan (IDP)!');
    }
  };

  const promptSuggestions = [
    'How do I pitch our $200k Agentic AI initiative to the CFO without jargon?',
    'I want to improve my 1-on-1 coaching style for senior engineers in my team.',
    'How do I balance urgent operational firefighting with strategic architecture roadmaps?',
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner (Bento Hero) */}
      <div className="rounded-3xl bg-indigo-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-indigo-400/20 text-amber-300 border border-indigo-400/30">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">
                Enterprise AI Growth Companion
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI Coach & Mentor
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200/90 max-w-2xl leading-relaxed">
              "How should I think, decide, and act?" Personalized guidance grounded in your role context and GROW framework.
            </p>
          </div>

          {/* Mode Selector Bento Switcher */}
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20">
            <button
              onClick={() => setMode('COACH')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mode === 'COACH'
                  ? 'bg-white text-indigo-950 shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Coach Mode (GROW)
            </button>
            <button
              onClick={() => setMode('MENTOR')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mode === 'MENTOR'
                  ? 'bg-white text-indigo-950 shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Mentor Mode (Advice)
            </button>
          </div>
        </div>

        {/* Privacy Notice & Transparency Accordion */}
        <div className="relative z-10 mt-6 pt-4 border-t border-white/15">
          <button
            onClick={() => setShowTransparencyNotice(!showTransparencyNotice)}
            className="flex items-center justify-between w-full text-left text-xs text-indigo-200 hover:text-white transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span><strong>Privacy & Context Transparency Notice:</strong> Conversations are strictly confidential and not used for manager ratings.</span>
            </div>
            {showTransparencyNotice ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showTransparencyNotice && (
            <div className="mt-3 p-4 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 text-xs text-indigo-100 space-y-2 animate-in fade-in">
              <p className="font-semibold text-white">Data Context Read by AI in this Session:</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] list-disc list-inside text-slate-300">
                <li>Current Role: {currentUser.position} (Level: {currentUser.level})</li>
                <li>Target Position: Head of Enterprise Architecture</li>
                <li>Strategic Objective: {activeIdp.primaryObjective}</li>
                <li>Identified Priority Gaps: Strategic Architecture, Executive Persuasion</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Main Split: Chat Area vs. Session Outputs Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Chat Stream Bento Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col h-[650px] overflow-hidden">
          
          {/* GROW Stage Bar (When Coach Mode) */}
          {mode === 'COACH' && (
            <div className="p-3.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">GROW Stage Progression:</span>
              <div className="flex items-center gap-1.5">
                {[
                  { code: 'G', label: 'Goal' },
                  { code: 'R', label: 'Reality' },
                  { code: 'O', label: 'Options' },
                  { code: 'W', label: 'Way Forward' },
                ].map((st) => (
                  <span
                    key={st.code}
                    className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
                      currentGrowStage === st.code
                        ? 'bg-indigo-900 text-white shadow-xs'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {st.code} - {st.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Messages Container */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 text-white ${
                      isUser
                        ? 'bg-indigo-900'
                        : 'bg-indigo-800 shadow-sm'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
                  </div>

                  <div
                    className={`max-w-[82%] p-4 rounded-3xl text-xs leading-relaxed space-y-2 ${
                      isUser
                        ? 'bg-indigo-900 text-white rounded-tr-xs shadow-xs'
                        : 'bg-slate-100/90 text-slate-900 rounded-tl-xs border border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-[10px] opacity-75 font-semibold">
                      <span>{isUser ? 'You' : mode === 'COACH' ? 'MDJ Coach (GROW)' : 'MDJ Mentor'}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <div className="whitespace-pre-line font-medium">{msg.content}</div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-2xl bg-indigo-900 flex items-center justify-center text-white shrink-0">
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                </div>
                <div className="p-4 rounded-3xl bg-slate-100 text-slate-700 text-xs border border-slate-200 font-medium">
                  Formulating reflective coaching inquiry...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Prompt Suggestions */}
          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex gap-2 overflow-x-auto">
            {promptSuggestions.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => setInputMessage(prompt)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-700 whitespace-nowrap transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              placeholder={mode === 'COACH' ? 'Share your situation or thinking...' : 'Ask for frameworks, advice, or best practices...'}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/70 text-slate-800 text-xs focus:ring-1 focus:ring-indigo-500 focus:bg-white focus:outline-hidden transition-all"
            />
            <button
              id="coach-send-message-btn"
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="px-4 py-2.5 rounded-2xl bg-indigo-900 hover:bg-indigo-800 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>

        </div>

        {/* Right Col: Live Session Outputs Bento Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs flex flex-col justify-between space-y-5">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-900 border border-indigo-100">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">Session Output & Commitments</h3>
                <p className="text-[11px] text-slate-500 font-medium">Live synthesis from conversation</p>
              </div>
            </div>

            {/* Key Reflections */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                Key Reflection / Mindset Shift:
              </h4>
              <div className="space-y-1.5">
                {keyReflections.map((ref, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-medium">
                    "{ref}"
                  </div>
                ))}
              </div>
            </div>

            {/* Action Commitments */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Action Commitments (Way Forward):
              </h4>
              <div className="space-y-1.5">
                {actionCommitments.map((act, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 font-semibold leading-relaxed">
                    &bull; {act}
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested IDP Activity */}
            {suggestedActivity && (
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-900 text-white">
                    Proposed 20% Exposure Activity
                  </span>
                  <span className="font-bold text-indigo-950">+{suggestedActivity.xpValue} XP</span>
                </div>
                <h5 className="font-bold text-indigo-950">{suggestedActivity.programName}</h5>
                <p className="text-slate-600 text-[11px] font-medium">{suggestedActivity.measurement}</p>
              </div>
            )}
          </div>

          {/* 1-Click Add to IDP Action Button */}
          <div className="pt-4 border-t border-slate-100">
            <button
              id="coach-save-idp-action-btn"
              onClick={handleSaveToIDP}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-indigo-900 hover:bg-indigo-800 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Save Action into My Development Journey</span>
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-2 font-medium">
              Automatically creates a traceable milestone in your active IDP.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
