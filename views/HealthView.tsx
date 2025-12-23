
import React, { useState, useEffect } from 'react';
import { Calendar, Activity, Heart, Moon, Thermometer, ChevronRight, Sparkles, UserPlus, Zap, AlertTriangle, X, Video, Camera } from '../components/Icons';
import { getHealthInsight, generateHealthTwinAnalysis } from '../services/geminiService';
import { HealthInsightResponse, HealthTwinAnalysis } from '../types';

interface HealthViewProps {
  language?: string;
}

const HealthView: React.FC<HealthViewProps> = ({ language = 'English' }) => {
  const [activeTab, setActiveTab] = useState<'CYCLE' | 'TWIN'>('CYCLE');
  const [whisperMode, setWhisperMode] = useState(false);
  
  // Cycle State
  const [cycleDay] = useState(14);
  const [symptoms, setSymptoms] = useState('');
  const [insight, setInsight] = useState<HealthInsightResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // Health Twin State
  const [twinLoading, setTwinLoading] = useState(false);
  const [twinData, setTwinData] = useState<HealthTwinAnalysis | null>(null);

  // Overlays
  const [showPcosScan, setShowPcosScan] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  // Translations
  const translations: any = {
    'English': {
      title: "Wellness",
      tabCycle: "CYCLE & SYMPTOMS",
      tabTwin: "AI HEALTH TWIN",
      cycleDay: "Cycle Day",
      highFertility: "High Fertility",
      logPeriod: "Log Period",
      symptoms: "Symptoms",
      pcosScan: "PCOS Scan",
      aiInsight: "AI Health Insight",
      howFeel: "How do you feel today?",
      analyze: "Analyze",
      bodySyncScore: "Body Sync Score",
      good: "Good",
      predictedRisks: "Predicted Risks (Next 30 Days)",
      actionPlan: "Preventive Action Plan",
      syncing: "Syncing with Digital Twin...",
      saveLog: "Save Log",
      flowIntensity: "Flow Intensity"
    },
    'Hindi': {
      title: "कल्याण",
      tabCycle: "चक्र और लक्षण",
      tabTwin: "एआई स्वास्थ्य ट्विन",
      cycleDay: "चक्र दिवस",
      highFertility: "उच्च उर्वरता",
      logPeriod: "अवधि लॉग करें",
      symptoms: "लक्षण",
      pcosScan: "पीसीओएस स्कैन",
      aiInsight: "एआई स्वास्थ्य अंतर्दृष्टि",
      howFeel: "आज आप कैसा महसूस कर रहे हैं?",
      analyze: "विश्लेषण करें",
      bodySyncScore: "शारीरिक सिंक स्कोर",
      good: "अच्छा",
      predictedRisks: "अनुमानित जोखिम (अगले 30 दिन)",
      actionPlan: "निवारक कार्य योजना",
      syncing: "डिजिटल ट्विन के साथ सिंक हो रहा है...",
      saveLog: "लॉग सहेजें",
      flowIntensity: "प्रवाह तीव्रता"
    },
    'Telugu': {
      title: "ఆరోగ్యం",
      tabCycle: "చక్రం & లక్షణాలు",
      tabTwin: "AI హెల్త్ ట్విన్",
      cycleDay: "సైకిల్ రోజు",
      highFertility: "అధిక సంతానోత్పత్తి",
      logPeriod: "పీరియడ్ లాగ్",
      symptoms: "లక్షణాలు",
      pcosScan: "PCOS స్కాన్",
      aiInsight: "AI ఆరోగ్య అంతర్దృష్టి",
      howFeel: "ఈ రోజు మీకు ఎలా అనిపిస్తుంది?",
      analyze: "విశ్లేషించు",
      bodySyncScore: "బాడీ సింక్ స్కోర్",
      good: "మంచిది",
      predictedRisks: "అంచనా వేయబడిన ప్రమాదాలు",
      actionPlan: "నివారణ ప్రణాళిక",
      syncing: "డిజిటల్ ట్విన్‌తో సింక్ అవుతోంది...",
      saveLog: "లాగ్ సేవ్ చేయండి",
      flowIntensity: "ప్రవాహ తీవ్రత"
    }
  };

  const t = translations[language] || translations['English'];

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await getHealthInsight(symptoms, cycleDay, language);
    setInsight(result);
    setLoading(false);
  };

  const runTwinSimulation = async () => {
    setTwinLoading(true);
    // Simulating gathering data from sensors/history
    const result = await generateHealthTwinAnalysis({
      cyclePhase: 'Ovulation',
      sleepAvg: 6.5,
      stressLevel: 'Moderate',
      activityLevel: 'Active',
      recentSymptoms: ['Bloating', 'Energy Dip']
    }, language);
    setTwinData(result);
    setTwinLoading(false);
  };

  // Auto-run twin on mount for demo
  useEffect(() => {
    if (activeTab === 'TWIN' && !twinData) {
      runTwinSimulation();
    }
  }, [activeTab]);

  return (
    <div className={`pb-24 animate-fade-in transition-colors duration-500 min-h-screen ${whisperMode ? 'bg-black text-white' : ''}`}>
      
      {/* PCOS SCAN OVERLAY */}
      {showPcosScan && (
         <div className="fixed inset-0 z-[100] bg-black flex flex-col justify-between p-6 animate-fade-in">
             <div className="flex justify-between items-center text-white z-20">
                <button onClick={() => setShowPcosScan(false)} className="p-2 rounded-full bg-black/40 backdrop-blur-md"><X size={24} /></button>
                <div className="bg-purple-600/90 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg border border-purple-400/50">
                   <span className="text-sm font-bold tracking-widest">AI SCANNING...</span>
                </div>
                <div className="w-10"></div>
             </div>
             
             <div className="absolute inset-0 top-0 bottom-0 bg-gray-900 flex items-center justify-center overflow-hidden">
                 <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-700 via-gray-900 to-black"></div>
                 
                 {/* Face Mesh Simulation */}
                 <div className="relative w-64 h-80 border-2 border-purple-500/50 rounded-[40%] flex items-center justify-center">
                    <div className="absolute inset-0 border-t-2 border-purple-500 animate-scan-down"></div>
                    <div className="grid grid-cols-4 gap-8 opacity-50">
                        <div className="w-1 h-1 bg-purple-400 rounded-full"></div><div className="w-1 h-1 bg-purple-400 rounded-full"></div><div className="w-1 h-1 bg-purple-400 rounded-full"></div><div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                        <div className="w-1 h-1 bg-purple-400 rounded-full"></div><div className="w-1 h-1 bg-purple-400 rounded-full"></div><div className="w-1 h-1 bg-purple-400 rounded-full"></div><div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                    </div>
                 </div>

                 <p className="absolute bottom-32 text-xs text-purple-300 font-mono tracking-widest z-10 text-center">
                    ANALYZING HORMONAL ACNE MARKERS<br/>CHECKING HIRSUTISM PATTERNS
                 </p>
             </div>

             <div className="relative z-20 text-center mb-8">
                 <p className="text-gray-400 text-xs mb-4">Position your face in the frame with good lighting</p>
                 <button className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center mx-auto active:scale-95 transition-transform">
                    <div className="w-14 h-14 bg-white rounded-full"></div>
                 </button>
             </div>
         </div>
      )}

      {/* CALENDAR OVERLAY */}
      {showCalendar && (
         <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in" onClick={() => setShowCalendar(false)}>
            <div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-6 relative z-10 shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-black">{t.logPeriod}</h3>
                    <button onClick={() => setShowCalendar(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100"><X size={20} /></button>
                </div>
                
                <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                    <div className="grid grid-cols-7 gap-2 text-center mb-2">
                        {['S','M','T','W','T','F','S'].map(d => <span key={d} className="text-xs font-bold text-gray-400">{d}</span>)}
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-center">
                        {Array.from({length: 30}, (_, i) => i + 1).map(day => (
                            <div 
                                key={day} 
                                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer ${day === 14 ? 'bg-[var(--primary-color)] text-white shadow-md' : 'text-black hover:bg-[var(--primary-light)]'}`}
                            >
                                {day}
                            </div>
                        ))}
                    </div>
                </div>
                
                <h4 className="font-bold text-sm text-black mb-3">{t.flowIntensity}</h4>
                <div className="flex justify-between gap-2 mb-6">
                    {['Spotting', 'Light', 'Medium', 'Heavy'].map(flow => (
                        <button key={flow} className="flex-1 py-2 rounded-xl border border-[var(--primary-light)] text-xs font-bold text-gray-600 hover:bg-[var(--primary-light)] focus:bg-pink-500 focus:text-white transition-colors">{flow}</button>
                    ))}
                </div>

                <button 
                    onClick={() => { setShowCalendar(false); alert("Cycle logged successfully!"); }}
                    className="w-full bg-black text-white py-3.5 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-transform"
                >
                    {t.saveLog}
                </button>
            </div>
         </div>
      )}

      {/* Header */}
      <header className="mb-6 flex justify-between items-center">
        <div>
            <h2 className={`text-3xl font-extrabold ${whisperMode ? 'text-white' : 'text-black'}`}>{t.title}</h2>
            <p className={whisperMode ? 'text-gray-400' : 'text-gray-600 font-medium'}>
               {activeTab === 'CYCLE' ? `Ovulation Phase • ${t.cycleDay} ${cycleDay}` : t.tabTwin}
            </p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setWhisperMode(!whisperMode)}
                className={`p-2 rounded-full ${whisperMode ? 'bg-white/10 text-pink-400' : 'bg-white border border-[var(--primary-light)] text-black hover:bg-black hover:text-white active:bg-[var(--primary-color)] transition-colors'}`}
            >
                <Moon size={20} />
            </button>
        </div>
      </header>

      {/* Toggle Tabs */}
      <div className="bg-gray-100 p-1 rounded-xl flex mb-6 mx-1">
         <button 
           onClick={() => setActiveTab('CYCLE')}
           className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all active:bg-[var(--primary-color)] active:text-white ${activeTab === 'CYCLE' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'}`}
         >
           {t.tabCycle}
         </button>
         <button 
           onClick={() => setActiveTab('TWIN')}
           className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 active:bg-[var(--primary-color)] active:text-white ${activeTab === 'TWIN' ? 'bg-black text-white shadow-sm' : 'text-gray-500 hover:text-black'}`}
         >
           <Sparkles size={12} className={activeTab === 'TWIN' ? "text-[var(--primary-color)]" : ""} /> {t.tabTwin}
         </button>
      </div>

      {activeTab === 'CYCLE' ? (
        <>
            {/* Cycle Circle */}
            <div className="flex justify-center mb-8 relative">
                <div className="w-64 h-64 rounded-full border-[12px] border-[var(--primary-light)] flex items-center justify-center relative">
                    <div className="absolute top-0 w-4 h-4 bg-[var(--primary-color)] rounded-full -mt-2"></div>
                    <div className="text-center">
                        <span className="text-gray-400 text-xs font-bold uppercase">{t.cycleDay}</span>
                        <span className="block text-6xl font-black text-black my-1">{cycleDay}</span>
                        <span className="text-[var(--primary-color)] text-sm font-bold">{t.highFertility}</span>
                    </div>
                </div>
            </div>

            {/* Quick Logging */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <button onClick={() => setShowCalendar(true)} className="flex flex-col items-center p-3 bg-white border border-[var(--primary-light)] rounded-xl shadow-sm hover:border-black/20 active:scale-95 transition-all">
                    <Calendar className="text-[var(--primary-color)] mb-2" size={20} />
                    <span className="text-xs font-bold text-black">{t.logPeriod}</span>
                </button>
                <button onClick={() => setShowCalendar(true)} className="flex flex-col items-center p-3 bg-white border border-[var(--primary-light)] rounded-xl shadow-sm hover:border-black/20 active:scale-95 transition-all">
                    <Thermometer className="text-orange-500 mb-2" size={20} />
                    <span className="text-xs font-bold text-black">{t.symptoms}</span>
                </button>
                <button onClick={() => setShowPcosScan(true)} className="flex flex-col items-center p-3 bg-white border border-[var(--primary-light)] rounded-xl shadow-sm hover:border-black/20 active:scale-95 transition-all">
                    <Activity className="text-purple-500 mb-2" size={20} />
                    <span className="text-xs font-bold text-black">{t.pcosScan}</span>
                </button>
            </div>

            {/* AI Insight Card */}
            <div className="bg-white p-5 rounded-2xl border border-[var(--primary-light)] shadow-sm mb-6">
                <h3 className="font-bold text-black mb-3 flex items-center gap-2">
                    <Sparkles size={18} className="text-[var(--primary-color)]" /> {t.aiInsight}
                </h3>
                
                <div className="flex gap-2 mb-3">
                    <input 
                        type="text" 
                        placeholder={t.howFeel}
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black text-black"
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                    />
                    <button 
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="bg-black text-white px-4 rounded-lg font-bold text-xs"
                    >
                        {loading ? '...' : t.analyze}
                    </button>
                </div>

                {insight && (
                    <div className="bg-[var(--primary-light)] p-3 rounded-xl border border-[var(--primary-light)]">
                        <p className="text-sm font-bold text-black mb-1">{insight.prediction}</p>
                        <p className="text-xs text-gray-600 mb-2">{insight.recommendation}</p>
                        {insight.hormoneAlert && (
                            <div className="flex items-center gap-1 text-[10px] text-red-500 font-bold bg-white px-2 py-1 rounded-md w-fit">
                                <AlertTriangle size={10} /> {insight.hormoneAlert}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
      ) : (
        // --- HEALTH TWIN VIEW ---
        <div className="animate-fade-in">
           {twinLoading || !twinData ? (
               <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-3xl border border-gray-100">
                   <div className="w-16 h-16 border-4 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin mb-4"></div>
                   <p className="text-sm font-bold text-gray-500">{t.syncing}</p>
               </div>
           ) : (
               <div className="space-y-6">
                   {/* Body Sync Score */}
                   <div className="bg-black text-white p-6 rounded-3xl relative overflow-hidden shadow-xl">
                       <div className="absolute right-0 top-0 p-4 opacity-10">
                           <Activity size={100} />
                       </div>
                       <div className="relative z-10 flex justify-between items-end">
                           <div>
                               <p className="text-gray-400 text-xs font-bold uppercase mb-1">{t.bodySyncScore}</p>
                               <h1 className="text-5xl font-black text-white">{twinData.bodySyncScore}</h1>
                           </div>
                           <div className="text-right">
                               <div className="bg-white/10 px-3 py-1 rounded-lg backdrop-blur-md mb-1 inline-block">
                                  <span className="text-xs font-bold text-green-400">{t.good}</span>
                               </div>
                               <p className="text-[10px] text-gray-500">Updated 1m ago</p>
                           </div>
                       </div>
                       
                       <div className="mt-6 bg-white/5 rounded-xl p-3 border border-white/10">
                           <p className="text-xs text-gray-300 font-medium">"{twinData.hormonalTrend}"</p>
                       </div>
                   </div>

                   {/* Future Risks */}
                   <div className="bg-white p-5 rounded-2xl shadow-sm border border-[var(--primary-light)]">
                       <h3 className="font-bold text-black mb-3">{t.predictedRisks}</h3>
                       <div className="space-y-3">
                           {twinData.predictedRisks.map((risk, i) => (
                               <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                   <div>
                                       <p className="text-sm font-bold text-black">{risk.condition}</p>
                                       <p className="text-xs text-gray-500">{risk.timeline}</p>
                                   </div>
                                   <div className="flex items-center gap-2">
                                       <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                           <div 
                                             className={`h-full ${risk.probability > 50 ? 'bg-orange-500' : 'bg-green-500'}`} 
                                             style={{ width: `${risk.probability}%` }}
                                           ></div>
                                       </div>
                                       <span className="text-xs font-bold text-gray-600">{risk.probability}%</span>
                                   </div>
                               </div>
                           ))}
                       </div>
                   </div>

                   {/* Action Plan */}
                   <div>
                       <h3 className="font-bold text-black mb-3 px-1">{t.actionPlan}</h3>
                       <div className="grid grid-cols-2 gap-3">
                           {twinData.actionPlan.map((action, i) => (
                               <div key={i} className="bg-white p-4 rounded-2xl border border-[var(--primary-light)] shadow-sm flex flex-col justify-between">
                                   <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${action.type === 'Nutrition' ? 'bg-green-100 text-green-600' : action.type === 'Fitness' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                                       {action.type === 'Nutrition' ? <Zap size={14}/> : action.type === 'Fitness' ? <Activity size={14}/> : <Moon size={14}/>}
                                   </div>
                                   <p className="text-xs font-bold text-black line-clamp-2">{action.action}</p>
                                   <span className="text-[10px] text-gray-400 mt-2 uppercase font-bold">{action.type}</span>
                               </div>
                           ))}
                       </div>
                   </div>
               </div>
           )}
        </div>
      )}
    </div>
  );
};

export default HealthView;
