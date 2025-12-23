
import React, { useState, useEffect } from 'react';
import { Users, Briefcase, MessageSquare, Shield, AlertTriangle, MapPin, ChevronRight, UserPlus, Heart, Search, CheckCircle, Zap, Eye, EyeOff, Lock } from '../components/Icons';
import { findEmotionalMatches, getLocalCommunityAlerts } from '../services/geminiService';
import { EmotionalMatch, CommunityAlert, SafetyBuddy } from '../types';

interface CommunityViewProps {
  language?: string;
}

const CommunityView: React.FC<CommunityViewProps> = ({ language = 'English' }) => {
  const [activeTab, setActiveTab] = useState<'CONNECT' | 'BUDDY' | 'GROUPS' | 'ALERTS'>('CONNECT');
  const [mood, setMood] = useState('Stressed');
  const [matches, setMatches] = useState<EmotionalMatch[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [alerts, setAlerts] = useState<CommunityAlert[]>([]);
  
  // Simulated Safety Buddies
  const buddies: SafetyBuddy[] = [
    { id: 'b1', name: "Priya M.", distance: "0.2 km", rating: 4.9, isOnline: true, batteryLevel: 85 },
    { id: 'b2', name: "Sophie L.", distance: "0.8 km", rating: 4.8, isOnline: true, batteryLevel: 60 },
    { id: 'b3', name: "Ananya S.", distance: "1.5 km", rating: 5.0, isOnline: true, batteryLevel: 92 },
  ];

  // Translations
  const translations: any = {
    'English': {
      title: "SafeConnect™",
      subtitle: "Verified Support Ecosystem.",
      tabConnect: "Support & Matches",
      tabBuddy: "Safety Buddy",
      tabGroups: "Micro-Communities",
      tabAlerts: "Local Alerts",
      emotionalMatch: "Emotional Matching",
      howFeeling: "How are you feeling right now?",
      findSupport: "Find Supportive Women",
      scanning: "Scanning SafeConnect...",
      skillMatch: "Skill Collaboration",
      walkingAlone: "Walking Alone?",
      requestBuddy: "Request a verified Safety Buddy to watch over you.",
      virtualWatch: "Virtual Watch",
      meetNearby: "Meet Nearby",
      verifiedNearby: "Verified Nearby",
      microComm: "Micro-Communities",
      anonMode: "Anon Mode",
      verifiedAlerts: "Verified Alerts",
      reportIncident: "Report an Incident"
    },
    'Hindi': {
      title: "सेफ-कनेक्ट™",
      subtitle: "सत्यापित समर्थन पारिस्थितिकी तंत्र।",
      tabConnect: "समर्थन और मेल",
      tabBuddy: "सुरक्षा बडी",
      tabGroups: "सूक्ष्म समुदाय",
      tabAlerts: "स्थानीय अलर्ट",
      emotionalMatch: "भावनात्मक मिलान",
      howFeeling: "आप अभी कैसा महसूस कर रहे हैं?",
      findSupport: "सहयोगी महिलाएं खोजें",
      scanning: "स्कैनिंग सेफ-कनेक्ट...",
      skillMatch: "कौशल सहयोग",
      walkingAlone: "अकेले चल रहे हैं?",
      requestBuddy: "अपनी निगरानी के लिए सत्यापित सुरक्षा बडी का अनुरोध करें।",
      virtualWatch: "वर्चुअल वॉच",
      meetNearby: "पास में मिलें",
      verifiedNearby: "पास में सत्यापित",
      microComm: "सूक्ष्म समुदाय",
      anonMode: "गुमनाम मोड",
      verifiedAlerts: "सत्यापित अलर्ट",
      reportIncident: "घटना की रिपोर्ट करें"
    },
    'Telugu': {
      title: "సేఫ్-కనెక్ట్™",
      subtitle: "ధృవీకరించబడిన మద్దతు వ్యవస్థ.",
      tabConnect: "మద్దతు & మ్యాచ్‌లు",
      tabBuddy: "సేఫ్టీ బడ్డీ",
      tabGroups: "చిన్న సంఘాలు",
      tabAlerts: "స్థానిక హెచ్చరికలు",
      emotionalMatch: "భావోద్వేగ సరిపోలిక",
      howFeeling: "మీకు ఇప్పుడు ఎలా అనిపిస్తుంది?",
      findSupport: "మద్దతు ఇచ్చే మహిళలను కనుగొనండి",
      scanning: "స్కాన్ చేస్తోంది...",
      skillMatch: "నైపుణ్య సహకారం",
      walkingAlone: "ఒంటరిగా నడుస్తున్నారా?",
      requestBuddy: "మిమ్మల్ని చూసుకోవడానికి సేఫ్టీ బడ్డీని అభ్యర్థించండి.",
      virtualWatch: "వర్చువల్ వాచ్",
      meetNearby: "దగ్గరలో కలవండి",
      verifiedNearby: "ధృవీకరించబడిన దగ్గరి వ్యక్తులు",
      microComm: "చిన్న సంఘాలు",
      anonMode: "అజ్ఞాత మోడ్",
      verifiedAlerts: "ధృవీకరించబడిన హెచ్చరికలు",
      reportIncident: "సంఘటనను నివేదించండి"
    }
  };

  const t = translations[language] || translations['English'];

  useEffect(() => {
    // Initial load
    fetchMatches();
    fetchAlerts();
  }, []);

  const fetchMatches = async () => {
    setLoadingMatches(true);
    const result = await findEmotionalMatches(mood, "Find balance and support", language);
    setMatches(result);
    setLoadingMatches(false);
  };

  const fetchAlerts = async () => {
    const result = await getLocalCommunityAlerts("My City");
    setAlerts(result);
  };

  return (
    <div className="pb-24 animate-fade-in">
       <header className="mb-4">
        <h2 className="text-3xl font-extrabold text-black">{t.title}</h2>
        <p className="text-gray-500 font-medium">{t.subtitle}</p>
      </header>

      {/* Navigation Pills */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
         {['CONNECT', 'BUDDY', 'GROUPS', 'ALERTS'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all active:bg-[#FF0F9A] active:text-white ${activeTab === tab ? 'bg-black text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200'}`}
            >
              {tab === 'CONNECT' && t.tabConnect}
              {tab === 'BUDDY' && t.tabBuddy}
              {tab === 'GROUPS' && t.tabGroups}
              {tab === 'ALERTS' && t.tabAlerts}
            </button>
         ))}
      </div>
      
      {/* --- TAB CONTENT --- */}
      
      {activeTab === 'CONNECT' && (
        <div className="animate-fade-in">
           {/* Emotional Matching */}
           <div className="bg-white p-6 rounded-3xl shadow-sm border border-pink-100 mb-6">
              <div className="flex items-center gap-2 mb-4">
                 <div className="bg-pink-100 p-2 rounded-full text-[#FF0F9A]">
                    <Heart size={20} />
                 </div>
                 <h3 className="font-bold text-black text-lg">{t.emotionalMatch}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4 font-medium">{t.howFeeling}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                 {['Stressed', 'Lonely', 'Anxious', 'Motivated', 'Overwhelmed'].map((m) => (
                    <button 
                       key={m}
                       onClick={() => setMood(m)}
                       className={`px-3 py-2 rounded-xl text-xs font-bold border active:bg-[#FF0F9A] active:text-white active:border-[#FF0F9A] ${mood === m ? 'bg-[#FF0F9A] text-white border-[#FF0F9A]' : 'bg-gray-50 text-gray-400 border-gray-100'}`}
                    >
                       {m}
                    </button>
                 ))}
              </div>

              <button 
                 onClick={fetchMatches}
                 disabled={loadingMatches}
                 className="w-full bg-black text-white py-3 rounded-xl font-bold text-sm shadow-md hover:bg-gray-900 active:bg-[#FF0F9A] transition-colors flex items-center justify-center gap-2"
              >
                 {loadingMatches ? t.scanning : t.findSupport}
              </button>

              <div className="mt-6 space-y-3">
                 {matches.map((match, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-pink-50/50 rounded-2xl border border-pink-100">
                       <div className={`w-10 h-10 rounded-full ${match.avatarColor} flex items-center justify-center text-gray-700 font-bold shrink-0`}>
                          {match.name.charAt(0)}
                       </div>
                       <div className="flex-1">
                          <div className="flex justify-between items-start">
                             <h4 className="font-bold text-black text-sm flex items-center gap-1">
                                {match.name} {match.isVerified && <CheckCircle size={12} className="text-blue-500" />}
                             </h4>
                             <button className="text-[10px] bg-white border border-gray-200 px-2 py-1 rounded-full font-bold hover:bg-black hover:text-white active:bg-[#FF0F9A] transition-colors">Chat</button>
                          </div>
                          <p className="text-[10px] text-gray-500 font-medium mb-1">{match.role}</p>
                          <p className="text-xs text-[#FF0F9A] font-medium leading-tight">"{match.matchReason}"</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* Skill Matching Banner */}
           <div className="bg-gradient-to-r from-gray-900 to-black rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                 <h4 className="font-bold text-sm flex items-center gap-2"><Briefcase size={16} /> {t.skillMatch}</h4>
                 <span className="bg-white/10 px-2 py-1 rounded-md text-[10px] font-bold">BETA</span>
              </div>
              <p className="text-xs text-gray-300 mb-4">Find partners for study, business, or projects.</p>
              <div className="flex gap-2">
                 <div className="bg-white/10 p-2 rounded-lg flex-1 text-center border border-white/10">
                    <span className="block text-lg font-bold">12</span>
                    <span className="text-[10px] text-gray-400 uppercase">Mentors</span>
                 </div>
                 <div className="bg-white/10 p-2 rounded-lg flex-1 text-center border border-white/10">
                    <span className="block text-lg font-bold">5</span>
                    <span className="text-[10px] text-gray-400 uppercase">Project Fits</span>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'BUDDY' && (
        <div className="animate-fade-in space-y-4">
           {/* Request Card */}
           <div className="bg-[#FF0F9A] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
               <div className="relative z-10">
                  <h3 className="font-black text-2xl mb-1">{t.walkingAlone}</h3>
                  <p className="text-sm text-pink-100 font-medium mb-6">{t.requestBuddy}</p>
                  
                  <div className="flex gap-2 mb-4">
                     <button className="flex-1 bg-white text-[#FF0F9A] py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-pink-50 active:bg-pink-100">
                        {t.virtualWatch}
                     </button>
                     <button className="flex-1 bg-black/20 text-white border border-white/20 py-3 rounded-xl font-bold text-sm hover:bg-black/30 active:bg-black/40">
                        {t.meetNearby}
                     </button>
                  </div>
               </div>
               <Shield size={120} className="absolute -right-6 -bottom-6 text-pink-600 opacity-20" />
           </div>

           <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm">
              <h4 className="font-bold text-black mb-4 flex items-center gap-2">
                 <MapPin size={18} className="text-green-500" /> {t.verifiedNearby} ({buddies.length})
              </h4>
              <div className="space-y-3">
                 {buddies.map((buddy) => (
                    <div key={buddy.id} className="flex items-center gap-3 border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                       <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                             {buddy.name.charAt(0)}
                          </div>
                          {buddy.isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
                       </div>
                       <div className="flex-1">
                          <div className="flex justify-between items-center">
                             <h5 className="font-bold text-sm text-black">{buddy.name}</h5>
                             <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-bold">{buddy.distance}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                             <span className="text-xs text-yellow-500 font-bold">★ {buddy.rating}</span>
                             <span className="text-[10px] text-gray-400">• Battery {buddy.batteryLevel}%</span>
                          </div>
                       </div>
                       <button className="p-2 bg-gray-50 rounded-full text-black hover:bg-black hover:text-white active:bg-[#FF0F9A] transition-colors">
                          <MessageSquare size={16} />
                       </button>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {activeTab === 'GROUPS' && (
         <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-black text-lg">{t.microComm}</h3>
               <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">{t.anonMode}</span>
                  <button className="w-10 h-6 bg-gray-200 rounded-full relative">
                     <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
               <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 flex flex-col items-center text-center active:border-[#FF0F9A]">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-purple-600 mb-2 shadow-sm"><Users size={20} /></div>
                  <h4 className="font-bold text-sm text-black">New Moms</h4>
                  <p className="text-[10px] text-gray-500">Postpartum support</p>
               </div>
               <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex flex-col items-center text-center active:border-[#FF0F9A]">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 mb-2 shadow-sm"><Briefcase size={20} /></div>
                  <h4 className="font-bold text-sm text-black">Tech Career</h4>
                  <p className="text-[10px] text-gray-500">Breaking into IT</p>
               </div>
               <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex flex-col items-center text-center active:border-[#FF0F9A]">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-orange-600 mb-2 shadow-sm"><Heart size={20} /></div>
                  <h4 className="font-bold text-sm text-black">PCOS Warriors</h4>
                  <p className="text-[10px] text-gray-500">Health & Diet</p>
               </div>
               <div className="bg-gray-100 p-4 rounded-2xl border border-gray-200 flex flex-col items-center text-center active:border-[#FF0F9A]">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 mb-2 shadow-sm"><EyeOff size={20} /></div>
                  <h4 className="font-bold text-sm text-black">Anonymous</h4>
                  <p className="text-[10px] text-gray-500">Private venting</p>
               </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm">
               <h4 className="font-bold text-black mb-3 text-sm">Trending Discussions</h4>
               <div className="space-y-3">
                  <div className="flex gap-3 items-start border-b border-gray-50 pb-3">
                     <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0"></div>
                     <div>
                        <p className="text-xs font-bold text-gray-900 line-clamp-2">"How do you manage salary negotiations? I feel stuck..."</p>
                        <p className="text-[10px] text-gray-400 mt-1">in Tech Career • 12m ago</p>
                     </div>
                  </div>
                  <div className="flex gap-3 items-start">
                     <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0"></div>
                     <div>
                        <p className="text-xs font-bold text-gray-900 line-clamp-2">"My doctor dismissed my pain again. Need recommendations."</p>
                        <p className="text-[10px] text-gray-400 mt-1">in PCOS Warriors • 1h ago</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      )}

      {activeTab === 'ALERTS' && (
         <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-black text-lg">{t.verifiedAlerts}</h3>
               <span className="text-xs font-bold text-[#FF0F9A] bg-pink-50 px-2 py-1 rounded-md">{alerts.length} Active</span>
            </div>

            <div className="space-y-3">
               {alerts.map((alert) => (
                  <div key={alert.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-3">
                     <div className={`shrink-0 mt-1 ${alert.type === 'DANGER' ? 'text-red-500' : alert.type === 'SAFE' ? 'text-green-500' : 'text-blue-500'}`}>
                        {alert.type === 'DANGER' ? <AlertTriangle size={20} /> : alert.type === 'SAFE' ? <CheckCircle size={20} /> : <Zap size={20} />}
                     </div>
                     <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                           <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${alert.type === 'DANGER' ? 'bg-red-50 text-red-600' : alert.type === 'SAFE' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                              {alert.type}
                           </span>
                           <span className="text-[10px] text-gray-400">{alert.time}</span>
                        </div>
                        <p className="text-sm font-bold text-black leading-tight mb-1">{alert.message}</p>
                        <div className="flex items-center gap-3 mt-2">
                           <span className="text-[10px] font-medium text-gray-500 flex items-center gap-1"><MapPin size={10} /> {alert.location}</span>
                           <span className="text-[10px] font-medium text-gray-500 flex items-center gap-1"><CheckCircle size={10} className="text-blue-400" /> {alert.verifiedCount} Verified</span>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
            
            <button className="w-full mt-4 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold text-xs hover:bg-gray-200 active:bg-[#FF0F9A] active:text-white transition-colors">
               {t.reportIncident}
            </button>
         </div>
      )}

    </div>
  );
};

export default CommunityView;
