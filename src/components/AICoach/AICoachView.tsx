import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles, Send, BookOpen, CheckCircle2,
  ChevronDown, ChevronUp, Plus, RefreshCw, Zap, Lock,
  Mic, MicOff, Globe, ArrowRight, X, Edit3,
  Trophy, History,
} from 'lucide-react';
import {
  UserProfile, AICoachMessage, IndividualDevelopmentPlan, DevelopmentActivity,
} from '../../types';
import { triggerMilestoneCelebration } from '../../utils/confetti';

interface AICoachViewProps {
  currentUser: UserProfile;
  activeIdp: IndividualDevelopmentPlan;
  onAddActivityToIdp: (activity: Partial<DevelopmentActivity>) => void;
}

type SetupStep = 'mode' | 'language' | 'topic' | 'context' | 'chatting' | 'end-session';

interface SessionRecord {
  id: string;
  date: string;
  mode: 'COACH' | 'MENTOR';
  language: 'id' | 'en';
  topic: string;
  contextGoal: string;
  messageCount: number;
  messages: AICoachMessage[];
  sessionOutput: string;
  actionCommitments: string[];
  exposureActivity: string;
  progress: string;
}

export const AICoachView: React.FC<AICoachViewProps> = ({
  currentUser,
  activeIdp,
  onAddActivityToIdp,
}) => {
  const [setupStep, setSetupStep] = useState<SetupStep>('mode');
  const [mode, setMode] = useState<'COACH' | 'MENTOR'>('COACH');
  const [language, setLanguage] = useState<'id' | 'en'>('id');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [contextGoal, setContextGoal] = useState('');
  const [messages, setMessages] = useState<AICoachMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentGrowStage, setCurrentGrowStage] = useState<'G' | 'R' | 'O' | 'W'>('G');
  const [isRecording, setIsRecording] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  // End-session editable fields
  const [sessionOutput, setSessionOutput] = useState('');
  const [commitments, setCommitments] = useState<string[]>(['', '']);
  const [exposureActivity, setExposureActivity] = useState('');
  // History
  const [sessionHistory, setSessionHistory] = useState<SessionRecord[]>([]);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);

  const wizardRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const topicSuggestions = [
    { id: 'role',       label: language === 'id' ? 'Peran Saat Ini & Target Karir' : 'Current & Future Role',    icon: '🎯' },
    { id: 'skill-gap',  label: language === 'id' ? 'Skill GAP & Kompetensi'         : 'Skill GAP & Competency',   icon: '📊' },
    { id: 'techsoft',   label: language === 'id' ? 'Technical & Soft Skill'          : 'Technical & Soft Skills',  icon: '🔧' },
    { id: 'leadership', label: language === 'id' ? 'Leadership & Kepemimpinan'       : 'Leadership & Influence',   icon: '👑' },
    { id: 'kpi',        label: language === 'id' ? 'KPI & Target Kinerja'            : 'KPI & My Goals',           icon: '📈' },
    { id: 'other',      label: language === 'id' ? 'Topik Lainnya'                   : 'Other Topic',              icon: '💬' },
  ];

  const effectiveTopic =
    selectedTopic === 'other'
      ? customTopic
      : topicSuggestions.find(t => t.id === selectedTopic)?.label ?? '';

  // ── Audio recording ──────────────────────────────────────────────────────
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      recorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        setInputMessage(language === 'id' ? '[Pesan Suara]' : '[Voice Message]');
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch {
      alert(language === 'id' ? 'Izin mikrofon diperlukan.' : 'Microphone permission required.');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  // ── Session start ────────────────────────────────────────────────────────
  const handleStartSession = () => {
    const greeting = language === 'id'
      ? `Halo ${currentUser.name}! Saya ${mode === 'COACH' ? 'AI Coach' : 'AI Mentor'} Anda.\n\nSaya sudah membaca profil Anda sebagai **${currentUser.position}**.\nTopik sesi ini: **${effectiveTopic}**\n\nKonteks Anda: "${contextGoal}"\n\n${mode === 'COACH'
          ? '**[GROW – Goal Stage]**: Outcome spesifik apa yang ingin Anda capai dari sesi ini?'
          : '**[Mentor Mode]**: Saya siap berbagi insight, framework, dan rekomendasi langsung untuk situasi Anda.'}`
      : `Hello ${currentUser.name}! I am your AI ${mode === 'COACH' ? 'Coach' : 'Mentor'}.\n\nI have reviewed your profile as **${currentUser.position}**.\nToday's topic: **${effectiveTopic}**\n\nYour context: "${contextGoal}"\n\n${mode === 'COACH'
          ? '**[GROW – Goal Stage]**: What specific outcome would make this session a success for you?'
          : '**[Mentor Mode]**: I am ready to share insights, frameworks, and direct recommendations for your situation.'}`;

    setMessages([{
      id: 'init-1',
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: greeting,
      growStage: 'G',
    }]);
    setCurrentGrowStage('G');
    setSetupStep('chatting');
  };

  // ── Send message ─────────────────────────────────────────────────────────
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    const userMsg: AICoachMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: inputMessage,
    };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);
    try {
      const res = await fetch('/api/claude/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode, language, topic: effectiveTopic, contextGoal,
          userMessage: userMsg.content,
          currentStage: currentGrowStage,
          chatHistory: messages,
          contextData: {
            name: currentUser.name,
            position: currentUser.position,
            level: currentUser.level,
            businessUnit: currentUser.businessUnit,
            currentIdpObjective: activeIdp.primaryObjective,
          },
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: data.response ?? (language === 'id' ? 'Terima kasih atas refleksi Anda.' : 'Thank you for your reflection.'),
        growStage: data.growStage ?? currentGrowStage,
      }]);
      if (data.growStage) setCurrentGrowStage(data.growStage);
    } catch {
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: language === 'id' ? 'Maaf, terjadi kesalahan koneksi. Silakan coba lagi.' : 'Sorry, a connection error occurred. Please try again.',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // ── End session ──────────────────────────────────────────────────────────
  const handleEndSession = () => {
    setSessionOutput(
      language === 'id'
        ? `Sesi ${mode === 'COACH' ? 'coaching' : 'mentoring'} mengenai "${effectiveTopic}" selesai. ${messages.length} pesan dipertukarkan.`
        : `${mode === 'COACH' ? 'Coaching' : 'Mentoring'} session on "${effectiveTopic}" completed. ${messages.length} messages exchanged.`
    );
    setCommitments(['', '']);
    setExposureActivity('');
    setSetupStep('end-session');
  };

  // ── Save session ─────────────────────────────────────────────────────────
  const handleSaveSession = () => {
    const validCommitments = commitments.filter(c => c.trim());
    const record: SessionRecord = {
      id: `session-${Date.now()}`,
      date: new Date().toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      mode, language,
      topic: effectiveTopic,
      contextGoal,
      messageCount: messages.length,
      messages: [...messages],
      sessionOutput,
      actionCommitments: validCommitments,
      exposureActivity,
      progress: '',
    };
    setSessionHistory(prev => [record, ...prev]);
    if (exposureActivity.trim()) {
      onAddActivityToIdp({
        goal: effectiveTopic,
        programName: exposureActivity,
        frameworkType: '20_EXPOSURE',
        measurement: validCommitments.join('; '),
        learningHours: 2,
        xpValue: 100,
      });
    }
    triggerMilestoneCelebration();
    // Reset for new session
    setSetupStep('mode');
    setSelectedTopic('');
    setCustomTopic('');
    setContextGoal('');
    setMessages([]);
    setCurrentGrowStage('G');
  };

  // ── Continue session ─────────────────────────────────────────────────────
  const handleContinueSession = (rec: SessionRecord) => {
    setMode(rec.mode);
    setLanguage(rec.language);
    setSelectedTopic('other');
    setCustomTopic(rec.topic);
    setContextGoal(rec.contextGoal);
    setMessages(rec.messages);
    setSetupStep('chatting');
    setTimeout(() => wizardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200);
  };

  // ── Render ───────────────────────────────────────────────────────────────
  const growLabels: Record<string, string> = { G: 'Goal', R: 'Reality', O: 'Options', W: 'Way Forward' };

  return (
    <div className="space-y-6 pb-12">

      {/* ── Header Banner ── */}
      <div className="rounded-3xl bg-indigo-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-indigo-400/20 text-amber-300 border border-indigo-400/30">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Enterprise AI Growth Companion</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">AI Coach & Mentor</h1>
            <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed">
              "How should I think, decide, and act?" — Personalized guidance grounded in your role context and GROW framework.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-200 shrink-0">
            <Globe className="w-4 h-4" />
            <span>{language === 'id' ? '🇮🇩 Bahasa Indonesia' : '🇬🇧 English'}</span>
            {setupStep !== 'mode' && (
              <span className="px-3 py-1 rounded-xl bg-white/10 text-white">
                {mode === 'COACH' ? '🧭 Coach' : '🏛️ Mentor'}
              </span>
            )}
          </div>
        </div>
        {/* Privacy notice */}
        <div className="relative z-10 mt-5 pt-4 border-t border-white/15">
          <button
            onClick={() => setShowPrivacy(!showPrivacy)}
            className="flex items-center justify-between w-full text-left text-xs text-indigo-200 hover:text-white transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span><strong>Privacy & Transparency:</strong> Percakapan bersifat rahasia dan tidak digunakan untuk penilaian manajer.</span>
            </div>
            {showPrivacy ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showPrivacy && (
            <div className="mt-3 p-4 rounded-2xl bg-black/30 border border-white/10 text-xs text-indigo-100">
              <p className="font-semibold text-white mb-2">Data yang dibaca AI dalam sesi ini:</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] list-disc list-inside text-slate-300">
                <li>Jabatan: {currentUser.position} (Level: {currentUser.level})</li>
                <li>Unit Bisnis: {currentUser.businessUnit}</li>
                <li>Objektif IDP: {activeIdp.primaryObjective}</li>
                <li>Topik Sesi: {effectiveTopic || '—'}</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* ── Wizard Area ── */}
      <div ref={wizardRef}>

        {/* STEP 1 – Mode */}
        {setupStep === 'mode' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-500">Langkah 1 dari 4</p>
              <h2 className="text-xl font-extrabold text-slate-900">Pilih Mode AI Anda</h2>
              <p className="text-xs text-slate-500">Pilih pendekatan yang paling sesuai dengan kebutuhan sesi Anda</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  value: 'COACH' as const,
                  icon: '🧭',
                  title: 'AI Coach',
                  sub: 'GROW Framework',
                  desc: 'AI membantu Anda menemukan jawaban sendiri melalui pertanyaan reflektif terstruktur (Goal → Reality → Options → Way Forward).',
                },
                {
                  value: 'MENTOR' as const,
                  icon: '🏛️',
                  title: 'AI Mentor',
                  sub: 'Advisory Mode',
                  desc: 'AI berbagi framework, best practice, insight industri, dan rekomendasi langsung berdasarkan situasi dan pengalaman Anda.',
                },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setMode(opt.value); setSetupStep('language'); }}
                  className="p-6 rounded-2xl border-2 border-slate-200 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50 hover:shadow-md text-left transition-all cursor-pointer group"
                >
                  <div className="text-3xl mb-3">{opt.icon}</div>
                  <div className="font-extrabold text-slate-900 text-base">{opt.title}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 mb-2">{opt.sub}</div>
                  <p className="text-xs text-slate-600 leading-relaxed">{opt.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-indigo-600 text-xs font-bold group-hover:gap-2 transition-all">
                    <span>Pilih Mode Ini</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 – Language */}
        {setupStep === 'language' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <button onClick={() => setSetupStep('mode')} className="text-slate-400 hover:text-slate-700 cursor-pointer transition">
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-500">Langkah 2 dari 4</p>
                <h2 className="text-xl font-extrabold text-slate-900">Pilih Bahasa Sesi</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { value: 'id' as const, flag: '🇮🇩', label: 'Bahasa Indonesia', sub: 'Sesi penuh dalam Bahasa Indonesia' },
                { value: 'en' as const, flag: '🇬🇧', label: 'English',           sub: 'Full session in English' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setLanguage(opt.value); setSetupStep('topic'); }}
                  className="p-6 rounded-2xl border-2 border-slate-200 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50 hover:shadow-md text-left transition-all cursor-pointer group"
                >
                  <div className="text-3xl mb-3">{opt.flag}</div>
                  <div className="font-extrabold text-slate-900">{opt.label}</div>
                  <p className="text-xs text-slate-500 mt-1">{opt.sub}</p>
                  <div className="mt-4 flex items-center gap-1 text-indigo-600 text-xs font-bold group-hover:gap-2 transition-all">
                    <span>Pilih / Select</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3 – Topic */}
        {setupStep === 'topic' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <button onClick={() => setSetupStep('language')} className="text-slate-400 hover:text-slate-700 cursor-pointer transition">
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-500">
                  {language === 'id' ? 'Langkah 3 dari 4' : 'Step 3 of 4'}
                </p>
                <h2 className="text-xl font-extrabold text-slate-900">
                  {language === 'id' ? 'Pilih Topik Pembahasan' : 'Select Discussion Topic'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === 'id'
                    ? `AI sudah membaca profil Anda sebagai ${currentUser.position}. Pilih topik yang paling relevan:`
                    : `AI has read your profile as ${currentUser.position}. Select the most relevant topic:`}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {topicSuggestions.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTopic(t.id)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    selectedTopic === t.id
                      ? 'border-indigo-600 bg-indigo-50 shadow-sm'
                      : 'border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/60'
                  }`}
                >
                  <div className="text-2xl mb-2">{t.icon}</div>
                  <div className="text-xs font-bold text-slate-800 leading-tight">{t.label}</div>
                  {selectedTopic === t.id && (
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 mt-2" />
                  )}
                </button>
              ))}
            </div>
            {selectedTopic === 'other' && (
              <input
                type="text"
                placeholder={language === 'id' ? 'Tulis topik spesifik Anda...' : 'Write your specific topic...'}
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              />
            )}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  if (selectedTopic && (selectedTopic !== 'other' || customTopic.trim())) {
                    setSetupStep('context');
                  }
                }}
                disabled={!selectedTopic || (selectedTopic === 'other' && !customTopic.trim())}
                className="px-6 py-2.5 rounded-2xl bg-indigo-900 hover:bg-indigo-800 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer"
              >
                {language === 'id' ? 'Lanjut' : 'Continue'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 – Context & Goal */}
        {setupStep === 'context' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <button onClick={() => setSetupStep('topic')} className="text-slate-400 hover:text-slate-700 cursor-pointer transition">
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-500">
                  {language === 'id' ? 'Langkah 4 dari 4' : 'Step 4 of 4'}
                </p>
                <h2 className="text-xl font-extrabold text-slate-900">
                  {language === 'id' ? 'Jelaskan Konteks & Tujuan Anda' : 'Describe Your Context & Goal'}
                </h2>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-800 flex flex-wrap gap-x-6 gap-y-1">
              <span><strong>{language === 'id' ? 'Topik:' : 'Topic:'}</strong> {effectiveTopic}</span>
              <span><strong>Mode:</strong> {mode === 'COACH' ? 'AI Coach (GROW)' : 'AI Mentor (Advisory)'}</span>
              <span><strong>{language === 'id' ? 'Bahasa:' : 'Language:'}</strong> {language === 'id' ? '🇮🇩 Bahasa Indonesia' : '🇬🇧 English'}</span>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">
                {language === 'id'
                  ? 'Ceritakan situasi/konteks Anda dan apa yang ingin dicapai dari sesi ini:'
                  : 'Describe your situation/context and what you want to achieve from this session:'}
              </label>
              <textarea
                rows={5}
                placeholder={language === 'id'
                  ? 'Contoh: "Saya menghadapi tantangan dalam memimpin tim lintas fungsi untuk proyek digital transformation. Tujuan saya adalah mendapatkan strategi konkret untuk meningkatkan alignment dan eksekusi tim dalam 30 hari ke depan."'
                  : 'Example: "I am facing challenges leading a cross-functional team on a digital transformation project. My goal is to get concrete strategies to improve team alignment and execution over the next 30 days."'}
                value={contextGoal}
                onChange={(e) => setContextGoal(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition resize-none leading-relaxed"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => contextGoal.trim() && handleStartSession()}
                disabled={!contextGoal.trim()}
                className="px-6 py-3 rounded-2xl bg-indigo-900 hover:bg-indigo-800 disabled:opacity-40 text-white text-sm font-bold flex items-center gap-2 transition cursor-pointer shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                {language === 'id' ? 'Mulai Sesi' : 'Start Session'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5 – Chat */}
        {setupStep === 'chatting' && (
          <div className="space-y-4">
            {mode === 'COACH' && (
              <div className="bg-white rounded-2xl border border-slate-200 px-4 py-3 flex items-center justify-between text-xs shadow-xs">
                <span className="font-bold text-slate-700">GROW Stage:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(['G', 'R', 'O', 'W'] as const).map((s) => (
                    <span
                      key={s}
                      className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
                        currentGrowStage === s ? 'bg-indigo-900 text-white shadow-xs' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {s} – {growLabels[s]}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Chat panel */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col h-[580px] overflow-hidden">
                {/* Chat header */}
                <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-indigo-900 flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {mode === 'COACH' ? 'MDJ AI Coach' : 'MDJ AI Mentor'}
                        <span className="ml-2 text-[10px] font-normal text-indigo-500 truncate max-w-[120px] inline-block align-bottom">{effectiveTopic}</span>
                      </div>
                      <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                        {language === 'id' ? 'Sesi Aktif' : 'Session Active'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleEndSession}
                    className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-bold border border-red-200 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                    {language === 'id' ? 'Akhiri Sesi' : 'End Session'}
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
                  {messages.map((msg) => {
                    const isUser = msg.sender === 'user';
                    return (
                      <div key={msg.id} className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-2xl shrink-0 overflow-hidden flex items-center justify-center ${isUser ? '' : 'bg-indigo-900'}`}>
                          {isUser
                            ? currentUser.avatar
                              ? <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                              : <div className="w-full h-full bg-indigo-700 flex items-center justify-center text-white text-xs font-bold">{currentUser.name.charAt(0)}</div>
                            : <Sparkles className="w-4 h-4 text-amber-300" />
                          }
                        </div>
                        <div className={`max-w-[82%] p-3.5 rounded-3xl text-xs leading-relaxed ${
                          isUser
                            ? 'bg-indigo-900 text-white rounded-tr-xs'
                            : 'bg-slate-100/90 text-slate-900 border border-slate-200 rounded-tl-xs'
                        }`}>
                          <div className="flex items-center justify-between gap-2 text-[10px] opacity-70 font-semibold mb-1.5">
                            <span>{isUser ? currentUser.name : (mode === 'COACH' ? 'MDJ AI Coach' : 'MDJ AI Mentor')}</span>
                            <span>{msg.timestamp}</span>
                          </div>
                          <div className="whitespace-pre-line">{msg.content}</div>
                        </div>
                      </div>
                    );
                  })}
                  {isLoading && (
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-2xl bg-indigo-900 flex items-center justify-center shrink-0">
                        <RefreshCw className="w-4 h-4 text-amber-300 animate-spin" />
                      </div>
                      <div className="p-3 rounded-3xl rounded-tl-xs bg-slate-100 text-slate-600 text-xs border border-slate-200">
                        {language === 'id' ? 'Sedang memformulasikan respons...' : 'Formulating response...'}
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input area */}
                <div className="p-3 bg-white border-t border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      title={isRecording
                        ? (language === 'id' ? 'Stop rekam' : 'Stop recording')
                        : (language === 'id' ? 'Rekam suara' : 'Record voice')}
                      className={`p-2.5 rounded-xl border shrink-0 transition cursor-pointer ${
                        isRecording
                          ? 'bg-red-600 border-red-700 text-white animate-pulse'
                          : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                    <input
                      type="text"
                      placeholder={language === 'id' ? 'Ketik pesan atau gunakan rekam suara...' : 'Type a message or use voice recording...'}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1 px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={isLoading || !inputMessage.trim()}
                      className="px-3.5 py-2.5 rounded-2xl bg-indigo-900 hover:bg-indigo-800 disabled:opacity-40 text-white flex items-center gap-1.5 transition cursor-pointer shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  {isRecording && (
                    <p className="text-[10px] text-red-600 font-bold ml-1 animate-pulse">
                      ⏺ {language === 'id' ? 'Sedang merekam... klik tombol merah untuk berhenti' : 'Recording... click the red button to stop'}
                    </p>
                  )}
                </div>
              </div>

              {/* Context sidebar */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 flex flex-col gap-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-xs mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    {language === 'id' ? 'Konteks Sesi' : 'Session Context'}
                  </h3>
                  <div className="space-y-2 text-[11px]">
                    <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100">
                      <span className="font-bold text-indigo-700">{language === 'id' ? 'Topik:' : 'Topic:'}</span>
                      <p className="text-indigo-900 mt-0.5">{effectiveTopic}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="font-bold text-slate-600">{language === 'id' ? 'Konteks & Tujuan:' : 'Context & Goal:'}</span>
                      <p className="text-slate-800 mt-0.5 leading-relaxed line-clamp-4">{contextGoal}</p>
                    </div>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1.5">
                  <div className="flex justify-between">
                    <span>Mode:</span>
                    <span className="font-bold text-slate-700">{mode === 'COACH' ? '🧭 AI Coach' : '🏛️ AI Mentor'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'id' ? 'Bahasa:' : 'Language:'}</span>
                    <span className="font-bold text-slate-700">{language === 'id' ? '🇮🇩 Indonesia' : '🇬🇧 English'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'id' ? 'Pesan:' : 'Messages:'}</span>
                    <span className="font-bold text-slate-700">{messages.length}</span>
                  </div>
                </div>
                <button
                  onClick={handleEndSession}
                  className="w-full mt-auto py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  {language === 'id' ? 'Akhiri & Buat Summary' : 'End & Create Summary'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6 – End session summary */}
        {setupStep === 'end-session' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">
                  {language === 'id' ? 'Ringkasan Sesi' : 'Session Summary'}
                </p>
                <h2 className="text-xl font-extrabold text-slate-900">
                  {language === 'id' ? 'Edit & Simpan Hasil Sesi' : 'Edit & Save Session Results'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {language === 'id' ? 'Tinjau dan edit ringkasan sebelum menyimpan ke riwayat.' : 'Review and edit the summary before saving to history.'}
                </p>
              </div>
              <div className="text-right text-xs text-slate-400 shrink-0">
                <div className="font-bold text-slate-700">{messages.length} {language === 'id' ? 'pesan' : 'messages'}</div>
                <div className="truncate max-w-[140px]">{effectiveTopic}</div>
              </div>
            </div>

            <div className="space-y-5">
              {/* Session output */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  {language === 'id' ? 'Output & Insight Sesi' : 'Session Output & Insights'}
                </label>
                <textarea
                  rows={4}
                  value={sessionOutput}
                  onChange={(e) => setSessionOutput(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition resize-none leading-relaxed"
                  placeholder={language === 'id' ? 'Tulis ringkasan output dan insight utama dari sesi ini...' : 'Write the key outputs and insights from this session...'}
                />
              </div>

              {/* Action commitments */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {language === 'id' ? 'Komitmen Aksi (Way Forward)' : 'Action Commitments (Way Forward)'}
                </label>
                <div className="space-y-2">
                  {commitments.map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <input
                        type="text"
                        value={c}
                        onChange={(e) => {
                          const updated = [...commitments];
                          updated[i] = e.target.value;
                          setCommitments(updated);
                        }}
                        placeholder={language === 'id' ? `Komitmen aksi ${i + 1}...` : `Action commitment ${i + 1}...`}
                        className="flex-1 px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition"
                      />
                      {commitments.length > 1 && (
                        <button
                          onClick={() => setCommitments(commitments.filter((_, j) => j !== i))}
                          className="text-slate-400 hover:text-red-500 cursor-pointer transition"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => setCommitments([...commitments, ''])}
                    className="flex items-center gap-1.5 text-[11px] text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {language === 'id' ? 'Tambah Komitmen' : 'Add Commitment'}
                  </button>
                </div>
              </div>

              {/* Exposure activity */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  {language === 'id' ? 'Usulan Aktivitas Eksposur (20%)' : 'Proposed Exposure Activity (20%)'}
                </label>
                <input
                  type="text"
                  value={exposureActivity}
                  onChange={(e) => setExposureActivity(e.target.value)}
                  placeholder={language === 'id'
                    ? 'Contoh: Memimpin sesi town hall lintas divisi selama Q3 2026...'
                    : 'E.g.: Lead cross-division town hall sessions during Q3 2026...'}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:ring-2 focus:ring-amber-400 focus:outline-none transition"
                />
                {exposureActivity.trim() && (
                  <p className="text-[10px] text-amber-700 font-medium ml-1">
                    {language === 'id' ? '✓ Akan otomatis ditambahkan ke IDP aktif Anda' : '✓ Will automatically be added to your active IDP'}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setSetupStep('chatting')}
                className="px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer transition flex items-center gap-2"
              >
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                {language === 'id' ? 'Kembali ke Chat' : 'Back to Chat'}
              </button>
              <button
                onClick={handleSaveSession}
                className="px-6 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-sm"
              >
                <Trophy className="w-4 h-4" />
                {language === 'id' ? 'Simpan Rekaman Sesi' : 'Save Session Record'}
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ── Session History Table ── */}
      {sessionHistory.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100">
              <History className="w-4 h-4 text-indigo-700" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                {language === 'id' ? 'Riwayat Sesi AI Coach / Mentor' : 'AI Coach / Mentor Session History'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {sessionHistory.length} {language === 'id' ? 'sesi tersimpan' : 'saved sessions'}
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {[
                    language === 'id' ? 'Tanggal' : 'Date',
                    'Mode',
                    language === 'id' ? 'Topik' : 'Topic',
                    language === 'id' ? 'Pesan' : 'Msgs',
                    language === 'id' ? 'Komitmen Aksi' : 'Action Commitments',
                    'Progress',
                    language === 'id' ? 'Aksi' : 'Actions',
                  ].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-bold text-slate-600 text-[11px] uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sessionHistory.map((rec) => (
                  <React.Fragment key={rec.id}>
                    <tr className="border-b border-slate-100 hover:bg-slate-50/60 transition">
                      <td className="px-4 py-3 font-medium text-slate-700 whitespace-nowrap">{rec.date}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold ${
                          rec.mode === 'COACH' ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {rec.mode === 'COACH' ? '🧭 Coach' : '🏛️ Mentor'}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800 max-w-[160px]">
                        <span className="block truncate">{rec.topic}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-center">{rec.messageCount}</td>
                      <td className="px-4 py-3">
                        <div className="space-y-1 max-w-[200px]">
                          {rec.actionCommitments.slice(0, 2).map((c, i) => (
                            <div key={i} className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg truncate">• {c}</div>
                          ))}
                          {rec.actionCommitments.length > 2 && (
                            <div className="text-[10px] text-slate-400">+{rec.actionCommitments.length - 2} more</div>
                          )}
                          {rec.actionCommitments.length === 0 && (
                            <span className="text-slate-400 italic text-[11px]">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {rec.progress
                          ? <span className="text-emerald-700 font-medium text-[11px]">{rec.progress}</span>
                          : <span className="text-slate-400 italic text-[11px]">{language === 'id' ? 'Belum diupdate' : 'Not updated'}</span>
                        }
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setExpandedSession(expandedSession === rec.id ? null : rec.id)}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold cursor-pointer transition flex items-center gap-1"
                          >
                            <Edit3 className="w-3 h-3" />
                            {language === 'id' ? 'Detail' : 'Detail'}
                          </button>
                          <button
                            onClick={() => handleContinueSession(rec)}
                            className="px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold cursor-pointer transition flex items-center gap-1"
                          >
                            <RefreshCw className="w-3 h-3" />
                            {language === 'id' ? 'Lanjut' : 'Continue'}
                          </button>
                          <button
                            onClick={() => {
                              setSetupStep('mode');
                              setSelectedTopic('');
                              setCustomTopic('');
                              setContextGoal('');
                              setMessages([]);
                              setCurrentGrowStage('G');
                              setTimeout(() => wizardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200);
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold cursor-pointer transition flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            {language === 'id' ? 'Baru' : 'New'}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedSession === rec.id && (
                      <tr>
                        <td colSpan={7} className="px-4 pb-4">
                          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 mt-1">
                            <div>
                              <p className="text-[11px] font-bold text-slate-600 mb-1">
                                {language === 'id' ? 'Konteks & Tujuan Sesi:' : 'Session Context & Goal:'}
                              </p>
                              <p className="text-xs text-slate-700 leading-relaxed">{rec.contextGoal}</p>
                            </div>
                            <div>
                              <p className="text-[11px] font-bold text-indigo-600 mb-1">
                                {language === 'id' ? 'Output Sesi:' : 'Session Output:'}
                              </p>
                              <p className="text-xs text-slate-600 leading-relaxed">{rec.sessionOutput}</p>
                            </div>
                            {rec.exposureActivity && (
                              <div>
                                <p className="text-[11px] font-bold text-amber-700 mb-1">
                                  {language === 'id' ? 'Aktivitas Eksposur:' : 'Exposure Activity:'}
                                </p>
                                <p className="text-xs text-amber-800">{rec.exposureActivity}</p>
                              </div>
                            )}
                            <div className="flex items-center gap-3 pt-1">
                              <label className="text-[11px] font-bold text-slate-700 shrink-0">
                                {language === 'id' ? 'Update Progress:' : 'Progress Update:'}
                              </label>
                              <input
                                type="text"
                                defaultValue={rec.progress}
                                onBlur={(e) => {
                                  setSessionHistory(prev =>
                                    prev.map(r => r.id === rec.id ? { ...r, progress: e.target.value } : r)
                                  );
                                }}
                                placeholder={language === 'id' ? 'Tulis progress terkini...' : 'Write current progress...'}
                                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-1 focus:ring-indigo-500 focus:outline-none bg-white"
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
