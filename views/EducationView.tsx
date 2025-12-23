
import React, { useState, useEffect } from 'react';
import { BookOpen, GraduationCap, Mic, PlayCircle, Sparkles, Moon, Calendar, TrendingUp, CheckCircle, Clock, X, Pause, Play, Video, MessageSquare, Send, Users, User } from '../components/Icons';
import { getMentorAdvice, generateEducationRoadmap } from '../services/geminiService';
import { EducationProfile, EducationRoadmap } from '../types';

interface EducationViewProps {
  language?: string;
}

const EducationView: React.FC<EducationViewProps> = ({ language = 'English' }) => {
  const [activeTab, setActiveTab] = useState<'COURSES' | 'PLANNER'>('COURSES');
  
  // Mentor State
  const [advice, setAdvice] = useState('');
  const [loadingMentor, setLoadingMentor] = useState(false);

  // Planner State
  const [profile, setProfile] = useState<EducationProfile>({
    role: 'Student',
    goal: '',
    hoursPerDay: 2,
    currentMood: 'Motivated'
  });
  const [roadmap, setRoadmap] = useState<EducationRoadmap | null>(null);
  const [loadingPlanner, setLoadingPlanner] = useState(false);

  // --- NEW FEATURE STATES ---
  const [showNightStudy, setShowNightStudy] = useState(false);
  const [nightTimer, setNightTimer] = useState(25 * 60); // 25 minutes
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const [showLiveClass, setShowLiveClass] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { user: 'Mentor', text: 'Welcome everyone! Today we cover Financial Basics.' },
    { user: 'Alice', text: 'Hi! Ready to learn.' },
  ]);

  const courses = [
    { title: "Financial Independence", progress: 65, color: "bg-blue-100 text-blue-700" },
    { title: "Coding for Women", progress: 30, color: "bg-purple-100 text-purple-700" },
    { title: "Self Defense Tactics", progress: 90, color: "bg-orange-100 text-orange-700" }
  ];

  // Translations
  const translations: any = {
    'English': {
      title: "Learn & Grow",
      subtitle: "Upskill. Empower. Lead.",
      tabCourses: "COURSES & MENTOR",
      tabPlanner: "LIFE PLANNER",
      aiMentor: "AI Mentor",
      mentorQuote: "Based on your cycle phase (Luteal), take it easy today.",
      thinking: "Thinking...",
      startCoaching: "Start Coaching Session",
      nightStudy: "Night Study",
      liveClass: "Live Class",
      learningPath: "My Learning Path",
      designJourney: "Design Your Journey",
      designDesc: "AI-powered education path tailored to your life.",
      iam: "I am a...",
      goal: "My Goal",
      timeAvail: "Time Availability",
      mood: "Current Mood",
      generatePlan: "Generate My Life Plan",
      crafting: "Crafting Your Path...",
      regenerate: "Regenerate Plan",
      smartSchedule: "Smart Schedule",
      milestones: "Milestones",
      liveChat: "Live Chat",
      focusSession: "Focus Session"
    },
    'Hindi': {
      title: "सीखें और बढ़ें",
      subtitle: "कौशल बढ़ाएं। सशक्त बनें। नेतृत्व करें।",
      tabCourses: "पाठ्यक्रम और मेंटर",
      tabPlanner: "जीवन योजनाकार",
      aiMentor: "एआई मेंटर",
      mentorQuote: "आपके चक्र चरण (ल्यूटियल) के आधार पर, आज आराम करें।",
      thinking: "सोच रहा है...",
      startCoaching: "कोचिंग सत्र शुरू करें",
      nightStudy: "रात्रि अध्ययन",
      liveClass: "लाइव क्लास",
      learningPath: "मेरा सीखने का रास्ता",
      designJourney: "अपनी यात्रा डिजाइन करें",
      designDesc: "आपके जीवन के लिए तैयार एआई-संचालित शिक्षा पथ।",
      iam: "मैं एक...",
      goal: "मेरा लक्ष्य",
      timeAvail: "समय उपलब्धता",
      mood: "वर्तमान मूड",
      generatePlan: "मेरी जीवन योजना बनाएं",
      crafting: "आपका रास्ता बना रहा है...",
      regenerate: "योजना फिर से बनाएं",
      smartSchedule: "स्मार्ट अनुसूची",
      milestones: "मील के पत्थर",
      liveChat: "लाइव चैट",
      focusSession: "फोकस सत्र"
    },
    'Telugu': {
      title: "నేర్చుకోండి & ఎదగండి",
      subtitle: "నైపుణ్యాలను పెంచుకోండి. సాధికారత పొందండి.",
      tabCourses: "కోర్సులు & మెంటర్",
      tabPlanner: "లైఫ్ ప్లానర్",
      aiMentor: "AI మెంటర్",
      mentorQuote: "మీ సైకిల్ దశ ఆధారంగా, ఈ రోజు విశ్రాంతి తీసుకోండి.",
      thinking: "ఆలోచిస్తోంది...",
      startCoaching: "కోచింగ్ సెషన్ ప్రారంభించండి",
      nightStudy: "రాత్రి అధ్యయనం",
      liveClass: "లైవ్ క్లాస్",
      learningPath: "నా అభ్యాస మార్గం",
      designJourney: "మీ ప్రయాణాన్ని డిజైన్ చేయండి",
      designDesc: "మీ జీవితానికి అనుగుణంగా AI విద్యా మార్గం.",
      iam: "నేను ఒక...",
      goal: "నా లక్ష్యం",
      timeAvail: "సమయ లభ్యత",
      mood: "ప్రస్తుత మూడ్",
      generatePlan: "నా లైఫ్ ప్లాన్ రూపొందించండి",
      crafting: "మీ మార్గాన్ని రూపొందిస్తోంది...",
      regenerate: "ప్లాన్ మళ్లీ రూపొందించండి",
      smartSchedule: "స్మార్ట్ షెడ్యూల్",
      milestones: "మైలురాళ్ళు",
      liveChat: "లైవ్ చాట్",
      focusSession: "ఫోకస్ సెషన్"
    }
  };

  const t = translations[language] || translations['English'];

  // --- MENTOR LOGIC ---
  const handleMentorAsk = async () => {
    setLoadingMentor(true);
    const result = await getMentorAdvice("General motivation", "Stressed", language);
    setAdvice(result);
    setLoadingMentor(false);
  };

  // --- PLANNER LOGIC ---
  const generatePlan = async () => {
    setLoadingPlanner(true);
    const effectiveProfile = {
      ...profile,
      goal: profile.goal || "Self Improvement and Career Growth"
    };
    const result = await generateEducationRoadmap(effectiveProfile, language);
    setRoadmap(result);
    setLoadingPlanner(false);
  };

  // --- NIGHT STUDY TIMER LOGIC ---
  useEffect(() => {
    let interval: any;
    if (isTimerRunning && nightTimer > 0) {
      interval = setInterval(() => {
        setNightTimer((prev) => prev - 1);
      }, 1000);
    } else if (nightTimer === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, nightTimer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // --- LIVE CLASS LOGIC ---
  const handleSendChat = () => {
    if(!chatMessage.trim()) return;
    setChatHistory([...chatHistory, { user: 'You', text: chatMessage }]);
    setChatMessage('');
  };

  return (
    <div className="pb-24 animate-fade-in">
      
      {/* --- NIGHT STUDY OVERLAY --- */}
      {showNightStudy && (
        <div className="fixed inset-0 z-[100] bg-gray-900 flex flex-col items-center justify-center p-6 animate-fade-in text-amber-50">
           {/* Background Ambiance */}
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800 to-black pointer-events-none"></div>
           
           <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
              <div className="flex justify-between items-center w-full mb-12">
                 <div className="flex items-center gap-2">
                    <Moon size={24} className="text-amber-400" />
                    <span className="font-bold text-lg tracking-widest text-amber-100/80">NIGHT FOCUS</span>
                 </div>
                 <button onClick={() => setShowNightStudy(false)} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white">
                    <X size={24} />
                 </button>
              </div>

              {/* Timer Circle */}
              <div className="w-64 h-64 rounded-full border-4 border-amber-900/50 flex items-center justify-center relative mb-12 bg-black/40 shadow-2xl">
                 <div className="text-center">
                    <span className="text-7xl font-thin font-mono text-amber-400 tabular-nums tracking-tighter block">{formatTime(nightTimer)}</span>
                    <span className="text-xs font-bold text-amber-700 tracking-[0.2em] uppercase mt-2 block">{t.focusSession}</span>
                 </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-6 mb-12">
                 <button 
                    onClick={() => { setNightTimer(25*60); setIsTimerRunning(false); }}
                    className="p-4 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700"
                 >
                    <Clock size={20} />
                 </button>
                 <button 
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="w-20 h-20 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:scale-105 transition-transform active:scale-95"
                 >
                    {isTimerRunning ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                 </button>
                 <button className="p-4 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700">
                    <Sparkles size={20} />
                 </button>
              </div>

              <div className="bg-gray-800/50 px-6 py-3 rounded-full border border-white/5">
                 <p className="text-xs text-amber-200/60 font-medium">"Discipline is choosing what you want most over what you want now."</p>
              </div>
           </div>
        </div>
      )}

      {/* --- LIVE CLASS OVERLAY --- */}
      {showLiveClass && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-fade-in">
           {/* Video Player Area */}
           <div className="h-[40vh] bg-gray-900 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center opacity-50">
                     <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-2 animate-pulse">
                        <Users size={32} className="text-gray-600" />
                     </div>
                     <p className="text-xs text-gray-500 font-mono">LIVE STREAM SIGNAL...</p>
                  </div>
                  {/* Simulated Presenter */}
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop" 
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                    alt="Live Class"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>
              </div>

              {/* Player UI Overlay */}
              <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start">
                  <button onClick={() => setShowLiveClass(false)} className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white"><X size={20} /></button>
                  <div className="bg-red-600 px-3 py-1 rounded-md flex items-center gap-2 animate-pulse">
                     <span className="w-2 h-2 bg-white rounded-full"></span>
                     <span className="text-[10px] font-bold text-white uppercase">Live</span>
                  </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-lg">Financial Freedom Workshop</h3>
                  <p className="text-gray-300 text-xs">Host: Dr. Sarah Bennett • 1.2k Watching</p>
              </div>
           </div>

           {/* Chat & Interaction Area */}
           <div className="flex-1 bg-white rounded-t-3xl -mt-6 relative z-10 flex flex-col overflow-hidden">
               <div className="p-4 border-b border-gray-100">
                  <h4 className="font-bold text-black text-sm flex items-center gap-2">
                     <MessageSquare size={16} className="text-[#FF0F9A]" /> {t.liveChat}
                  </h4>
               </div>
               
               <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                  {chatHistory.map((msg, i) => (
                     <div key={i} className={`flex gap-2 ${msg.user === 'You' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${msg.user === 'Mentor' ? 'bg-[#FF0F9A] text-white' : msg.user === 'You' ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'}`}>
                           {msg.user.charAt(0)}
                        </div>
                        <div className={`p-2 rounded-xl text-xs max-w-[80%] ${msg.user === 'You' ? 'bg-black text-white rounded-tr-none' : 'bg-white border border-gray-100 rounded-tl-none text-gray-800'}`}>
                           {msg.text}
                        </div>
                     </div>
                  ))}
               </div>
               
               <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
                  <input 
                    type="text" 
                    value={chatMessage} 
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Ask a question..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-xs focus:outline-none focus:border-black text-black"
                  />
                  <button onClick={handleSendChat} className="p-2 bg-black text-white rounded-full hover:bg-gray-800">
                     <Send size={16} />
                  </button>
               </div>
           </div>
        </div>
      )}

      <header className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-black">{t.title}</h2>
          <p className="text-gray-500 font-medium">{t.subtitle}</p>
        </div>
        <div className="flex gap-2">
           <button 
              onClick={() => setShowNightStudy(true)}
              className="p-2 bg-black text-white rounded-full hover:bg-gray-800"
              title={t.nightStudy}
           >
              <Moon size={20} />
           </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-gray-100 p-1 rounded-xl flex mb-6 mx-1">
         <button 
           onClick={() => setActiveTab('COURSES')}
           className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all active:bg-[#FF0F9A] active:text-white ${activeTab === 'COURSES' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'}`}
         >
           {t.tabCourses}
         </button>
         <button 
           onClick={() => setActiveTab('PLANNER')}
           className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 active:bg-[#FF0F9A] active:text-white ${activeTab === 'PLANNER' ? 'bg-black text-white shadow-sm' : 'text-gray-500 hover:text-black'}`}
         >
           <Sparkles size={12} className={activeTab === 'PLANNER' ? "text-[#FF0F9A]" : ""} /> {t.tabPlanner}
         </button>
      </div>

      {activeTab === 'COURSES' ? (
        <div className="space-y-6">
           {/* AI Mentor Card */}
           <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm">
              <div className="flex items-start gap-4">
                 <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-[#FF0F9A]">
                    <Sparkles size={24} />
                 </div>
                 <div className="flex-1">
                    <h3 className="font-bold text-black text-lg">{t.aiMentor}</h3>
                    <p className="text-xs text-gray-500 mb-3 italic">"{t.mentorQuote}"</p>
                    {advice && (
                       <div className="bg-gray-50 p-3 rounded-xl mb-3 border border-gray-100">
                          <p className="text-xs font-medium text-gray-700">{advice}</p>
                       </div>
                    )}
                    <button 
                       onClick={handleMentorAsk}
                       disabled={loadingMentor}
                       className="text-xs font-bold bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                    >
                       {loadingMentor ? t.thinking : t.startCoaching}
                    </button>
                 </div>
              </div>
           </div>

           {/* Live Class Banner */}
           <div 
              onClick={() => setShowLiveClass(true)}
              className="bg-red-500 rounded-2xl p-5 text-white shadow-lg cursor-pointer hover:bg-red-600 transition-colors relative overflow-hidden group"
           >
              <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:scale-110 transition-transform">
                 <Video size={80} />
              </div>
              <div className="relative z-10">
                 <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-wider">Live Now</span>
                 </div>
                 <h3 className="font-black text-xl mb-1">Financial Freedom Workshop</h3>
                 <p className="text-xs text-red-100 mb-3">Join 1.2k women learning about investing.</p>
                 <span className="bg-white text-red-600 px-3 py-1 rounded-md text-xs font-bold">Join Class</span>
              </div>
           </div>

           {/* My Learning Path */}
           <div>
              <h3 className="font-bold text-black mb-3">{t.learningPath}</h3>
              <div className="space-y-3">
                 {courses.map((course, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
                       <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${course.color}`}>
                          <BookOpen size={20} />
                       </div>
                       <div className="flex-1">
                          <div className="flex justify-between mb-1">
                             <h4 className="font-bold text-black text-sm">{course.title}</h4>
                             <span className="text-xs font-bold text-gray-500">{course.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5">
                             <div className="bg-black h-1.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
                          </div>
                       </div>
                       <button className="p-2 hover:bg-gray-50 rounded-full text-black">
                          <PlayCircle size={20} />
                       </button>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      ) : (
        <div className="space-y-6">
           {/* Design Journey */}
           {!roadmap ? (
              <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm">
                 <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-black">
                       <TrendingUp size={32} />
                    </div>
                    <h3 className="font-black text-xl text-black">{t.designJourney}</h3>
                    <p className="text-sm text-gray-500">{t.designDesc}</p>
                 </div>
                 
                 <div className="space-y-4">
                    <div>
                       <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">{t.iam}</label>
                       <select 
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-black text-black"
                          value={profile.role}
                          onChange={(e) => setProfile({...profile, role: e.target.value as any})}
                       >
                          {['Student', 'Professional', 'Homemaker', 'Mother', 'Entrepreneur'].map(r => <option key={r} value={r}>{r}</option>)}
                       </select>
                    </div>
                    
                    <div>
                       <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">{t.goal}</label>
                       <input 
                          type="text" 
                          placeholder="e.g. Learn Coding, Start Business"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black text-black"
                          value={profile.goal}
                          onChange={(e) => setProfile({...profile, goal: e.target.value})}
                       />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                       <div>
                          <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">{t.timeAvail}</label>
                          <select 
                             className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-black text-black"
                             value={profile.hoursPerDay}
                             onChange={(e) => setProfile({...profile, hoursPerDay: parseInt(e.target.value)})}
                          >
                             {[1, 2, 3, 4, 5, 6].map(h => <option key={h} value={h}>{h} Hours/Day</option>)}
                          </select>
                       </div>
                       <div>
                          <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">{t.mood}</label>
                          <select 
                             className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-black text-black"
                             value={profile.currentMood}
                             onChange={(e) => setProfile({...profile, currentMood: e.target.value as any})}
                          >
                             {['Motivated', 'Overwhelmed', 'Curious', 'Tired'].map(m => <option key={m} value={m}>{m}</option>)}
                          </select>
                       </div>
                    </div>

                    <button 
                       onClick={generatePlan}
                       disabled={loadingPlanner}
                       className="w-full bg-black text-white py-4 rounded-xl font-bold shadow-lg mt-2 flex items-center justify-center gap-2"
                    >
                       {loadingPlanner ? t.crafting : t.generatePlan}
                    </button>
                 </div>
              </div>
           ) : (
              <div className="space-y-6">
                 <div className="bg-black text-white p-6 rounded-3xl shadow-xl">
                    <h3 className="font-bold text-lg mb-1">{roadmap.journeyTitle}</h3>
                    <p className="text-sm text-gray-400 mb-4">{t.learningPath}</p>
                    
                    <div className="flex gap-2">
                       <div className="bg-gray-800 px-3 py-1 rounded-lg text-xs font-bold text-amber-400">
                          {roadmap.careerMatch}
                       </div>
                       <div className="bg-gray-800 px-3 py-1 rounded-lg text-xs font-bold text-pink-400">
                          Tip: {roadmap.emotionalTip}
                       </div>
                    </div>
                 </div>

                 <div className="bg-white p-5 rounded-2xl border border-gray-100">
                    <h4 className="font-bold text-black mb-4 flex items-center gap-2">
                       <Clock size={18} /> {t.smartSchedule}
                    </h4>
                    <div className="space-y-3">
                       {roadmap.weeklySchedule.map((day, i) => (
                          <div key={i} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                             <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center font-bold text-xs shadow-sm border border-gray-100 text-black">
                                {day.day.substring(0,3)}
                             </div>
                             <div className="flex-1">
                                {day.slots.map((slot, k) => (
                                   <p key={k} className="text-xs font-medium text-gray-700">{slot}</p>
                                ))}
                             </div>
                             <div className={`text-[10px] font-bold px-2 py-1 rounded-full ${day.energyPrediction === 'High' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {day.energyPrediction} Energy
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="bg-white p-5 rounded-2xl border border-gray-100">
                    <h4 className="font-bold text-black mb-4 flex items-center gap-2">
                       <CheckCircle size={18} /> {t.milestones}
                    </h4>
                    <div className="space-y-4 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                       {roadmap.timeline.map((item, i) => (
                          <div key={i} className="relative flex items-start gap-4">
                             <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold z-10 shrink-0 border-4 border-white">
                                {i+1}
                             </div>
                             <div className="flex-1 pt-1">
                                <h5 className="font-bold text-sm text-black">{item.milestone}</h5>
                                <p className="text-xs text-gray-500">{item.phase} • {item.duration}</p>
                                <p className="text-xs text-black bg-gray-50 p-2 rounded-lg mt-2 inline-block">Focus: {item.focus}</p>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>

                 <button onClick={() => setRoadmap(null)} className="w-full py-4 text-xs font-bold text-gray-400 hover:text-black">
                    {t.regenerate}
                 </button>
              </div>
           )}
        </div>
      )}
    </div>
  );
};

export default EducationView;
