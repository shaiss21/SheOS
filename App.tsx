
import React, { useState, useEffect } from 'react';
import { Shield, Heart, Wallet, GraduationCap, Users, Menu, Home, User, X, MapPin, Phone, Edit, Settings, LogOut, HelpCircle, Save, ChevronRight, ArrowLeft, MessageSquare, Search, FileText, Lock, Bell, Globe, EyeOff, Trash2, Palette } from './components/Icons';
import { AppModule } from './types';
import SafetyView from './views/SafetyView';
import HealthView from './views/HealthView';
import FinanceView from './views/FinanceView';
import EducationView from './views/EducationView';
import CommunityView from './views/CommunityView';
import ModuleCard from './components/ModuleCard';
import SOSButton from './components/SOSButton';
import AIAssistantButton from './components/AIAssistantButton';
import AIChatOverlay from './components/AIChatOverlay';
import AuthView from './views/AuthView';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentModule, setCurrentModule] = useState<AppModule>(AppModule.HOME);
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  
  // Profile State
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "Sarah Jenkins",
    email: "sarah@sheos.app",
    phone: "+1 (555) 880-4321",
    gender: "Female",
    address: "42 Safety Lane, Apt 9B, New York, NY 10012",
    role: "Professional",
    avatar: "" as string | undefined
  });

  // Settings State
  const [settings, setSettings] = useState({
    notifications: true,
    incognito: false,
    language: 'English',
    theme: 'Classic' // Classic, Ocean, Nature
  });

  // Apply Theme
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'Classic') {
      root.style.setProperty('--primary-color', '#FF0F9A');
      root.style.setProperty('--primary-light', '#FFF5F9');
    } else if (settings.theme === 'Ocean') {
      root.style.setProperty('--primary-color', '#007AFF');
      root.style.setProperty('--primary-light', '#F0F9FF');
    } else if (settings.theme === 'Nature') {
      root.style.setProperty('--primary-color', '#10B981');
      root.style.setProperty('--primary-light', '#ECFDF5');
    }
  }, [settings.theme]);

  // Translations
  const translations = {
    'English': {
      welcome: "WELCOME",
      safetyTitle: "Safety & SOS",
      safetyDesc: "Live tracking, Threat detection",
      healthTitle: "Health & Cycle",
      healthDesc: "Period tracker, Symptom analysis",
      financeTitle: "Finance & Growth",
      financeDesc: "Budgeting, Abuse detection",
      learnTitle: "Learn",
      learnDesc: "Upskill",
      jobsTitle: "Jobs",
      jobsDesc: "Community",
      dailyScore: "Your daily safety score is",
      menu: "Menu",
      settings: "Settings",
      privacy: "Privacy Center",
      emergency: "Emergency Contacts",
      help: "Help & Support",
      logout: "Log Out",
      navSafety: "Safety",
      navHealth: "Health",
      navLearn: "Learn",
      navFinance: "Finance",
      navCommunity: "Community",
      selectLang: "Select Language"
    },
    'Hindi': {
      welcome: "स्वागत है",
      safetyTitle: "सुरक्षा और SOS",
      safetyDesc: "लाइव ट्रैकिंग, खतरा पहचान",
      healthTitle: "स्वास्थ्य और चक्र",
      healthDesc: "मासिक धर्म ट्रैकर, लक्षण विश्लेषण",
      financeTitle: "वित्त और विकास",
      financeDesc: "बजट, दुरुपयोग का पता लगाना",
      learnTitle: "सीखें",
      learnDesc: "कौशल बढ़ाएं",
      jobsTitle: "नौकरियां",
      jobsDesc: "समुदाय",
      dailyScore: "आपका दैनिक सुरक्षा स्कोर है",
      menu: "मेन्यू",
      settings: "सेटिंग्स",
      privacy: "गोपनीयता केंद्र",
      emergency: "आपातकालीन संपर्क",
      help: "सहायता और समर्थन",
      logout: "लॉग आउट",
      navSafety: "सुरक्षा",
      navHealth: "स्वास्थ्य",
      navLearn: "सीखें",
      navFinance: "वित्त",
      navCommunity: "समुदाय",
      selectLang: "भाषा चुने"
    },
    'Telugu': {
      welcome: "స్వాగతం",
      safetyTitle: "రక్షణ & SOS",
      safetyDesc: "లైవ్ ట్రాకింగ్, ముప్పు గుర్తింపు",
      healthTitle: "ఆరోగ్యం & చక్రం",
      healthDesc: "పీరియడ్ ట్రాకర్, లక్షణ విశ్లేషణ",
      financeTitle: "ఆర్థిక & వృద్ధి",
      financeDesc: "బడ్జెటింగ్, దుర్వినియోగ గుర్తింపు",
      learnTitle: "నేర్చుకోండి",
      learnDesc: "నైపుణ్యాలను పెంచుకోండి",
      jobsTitle: "ఉద్యోగాలు",
      jobsDesc: "సంఘం",
      dailyScore: "మీ రోజువారీ రక్షణ స్కోర్",
      menu: "మెనూ",
      settings: "సెట్టింగులు",
      privacy: "గోప్యతా కేంద్రం",
      emergency: "అత్యవసర పరిచయాలు",
      help: "సహాయం & మద్దతు",
      logout: "లాగ్ అవుట్",
      navSafety: "రక్షణ",
      navHealth: "ఆరోగ్యం",
      navLearn: "నేర్చుకోండి",
      navFinance: "ఆర్థిక",
      navCommunity: "సంఘం",
      selectLang: "భాషను ఎంచుకోండి"
    }
  };

  const t = (key: keyof typeof translations['English']) => {
    const lang = settings.language as keyof typeof translations;
    return translations[lang]?.[key] || translations['English'][key];
  };

  // Persistent Trusted Contacts State
  const [trustedContacts, setTrustedContacts] = useState([
    { id: 1, name: "Dad", relation: "Parent", phone: "+1 (555) 123-4567", status: "Idle", time: "--", color: "bg-blue-500" },
    { id: 2, name: "Mom", relation: "Parent", phone: "+1 (555) 234-5678", status: "Idle", time: "--", color: "bg-pink-500" },
    { id: 3, name: "Sarah", relation: "Sister", phone: "+1 (555) 345-6789", status: "Idle", time: "--", color: "bg-purple-500" },
    { id: 4, name: "Cyber Cell", relation: "Official", phone: "112", status: "Idle", time: "--", color: "bg-gray-800" }
  ]);

  // Menu & Modal States
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Cross-Module Actions
  const [safetyViewAction, setSafetyViewAction] = useState<string | null>(null);

  // Auth Handler
  const handleLoginSuccess = (profileData: any) => {
    setUserProfile(prev => ({ ...prev, ...profileData }));
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    if(window.confirm("Are you sure you want to log out?")) {
        setIsAuthenticated(false);
        setIsMenuOpen(false);
        setCurrentModule(AppModule.HOME);
    }
  };

  const handleSOSTrigger = () => {
    setIsSOSActive(true);
    setTimeout(() => alert("SOS ACTIVATED: Live Location Shared with Trusted Contacts & Police Notified."), 100);
    setCurrentModule(AppModule.SAFETY);
  };

  const handleEmergencyContactsMenu = () => {
    setIsMenuOpen(false);
    setCurrentModule(AppModule.SAFETY);
    setSafetyViewAction('MANAGE_CONTACTS');
  };

  const handleAddTrustedContact = (newContact: any) => {
    setTrustedContacts(prev => [...prev, newContact]);
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleClearHistory = () => {
    if(window.confirm("Are you sure? This will delete all local chat and location history.")) {
        alert("History cleared securely.");
        setIsPrivacyOpen(false);
    }
  };

  const handleContactSupport = () => {
    alert("Support ticket #8821 created. A team member will contact you via secure chat shortly.");
    setIsHelpOpen(false);
  };

  const renderContent = () => {
    switch (currentModule) {
      case AppModule.SAFETY: 
        return (
          <SafetyView 
            initialAction={safetyViewAction} 
            onActionHandled={() => setSafetyViewAction(null)} 
            contacts={trustedContacts}
            onAddContact={handleAddTrustedContact}
            language={settings.language}
          />
        );
      case AppModule.HEALTH: return <HealthView language={settings.language} />;
      case AppModule.FINANCE: return <FinanceView language={settings.language} />;
      case AppModule.EDUCATION: return <EducationView language={settings.language} />;
      case AppModule.COMMUNITY: return <CommunityView language={settings.language} />;
      default: return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div className="animate-fade-in pb-24">
       <div className="mb-8 mt-2">
         <h2 className="text-4xl font-bold text-black tracking-wide font-['Oswald'] uppercase">
           {t('welcome')}, {userProfile.name.split(' ')[0]}
         </h2>
         <p className="text-gray-600 text-sm mt-1 font-medium">{t('dailyScore')} <span className="text-[var(--primary-color)] font-extrabold">98/100</span></p>
       </div>

       <ModuleCard 
         title={t('safetyTitle')}
         subtitle={t('safetyDesc')}
         icon={<Shield size={24} />}
         onClick={() => setCurrentModule(AppModule.SAFETY)} 
       />
       <ModuleCard 
         title={t('healthTitle')}
         subtitle={t('healthDesc')}
         icon={<Heart size={24} />}
         onClick={() => setCurrentModule(AppModule.HEALTH)} 
       />
       <ModuleCard 
         title={t('financeTitle')} 
         subtitle={t('financeDesc')}
         icon={<Wallet size={24} />}
         onClick={() => setCurrentModule(AppModule.FINANCE)} 
       />
       <div className="grid grid-cols-2 gap-4">
         <div 
            onClick={() => setCurrentModule(AppModule.EDUCATION)}
            className="bg-white p-5 rounded-2xl shadow-sm border border-[var(--primary-light)] cursor-pointer hover:shadow-md transition-all group hover:border-black/20 active:border-[var(--primary-color)]"
         >
            <div className="p-3 bg-black/5 w-fit rounded-full text-black mb-3 group-hover:scale-110 transition-transform"><GraduationCap size={24} /></div>
            <h4 className="font-bold text-black text-lg">{t('learnTitle')}</h4>
            <p className="text-xs text-gray-500 mt-1 font-medium">{t('learnDesc')}</p>
         </div>
         <div 
            onClick={() => setCurrentModule(AppModule.COMMUNITY)}
            className="bg-white p-5 rounded-2xl shadow-sm border border-[var(--primary-light)] cursor-pointer hover:shadow-md transition-all group hover:border-black/20 active:border-[var(--primary-color)]"
         >
            <div className="p-3 bg-black/5 w-fit rounded-full text-black mb-3 group-hover:scale-110 transition-transform"><Users size={24} /></div>
            <h4 className="font-bold text-black text-lg">{t('jobsTitle')}</h4>
            <p className="text-xs text-gray-500 mt-1 font-medium">{t('jobsDesc')}</p>
         </div>
       </div>
    </div>
  );

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const faqs = [
    { q: "How does the SOS button work?", a: "Pressing the SOS button instantly shares your live location with your trusted contacts and local authorities. It also activates audio recording." },
    { q: "Is my health data private?", a: "Yes. All your health and cycle data is encrypted locally on your device and is never shared without your explicit permission." },
    { q: "How do I add an emergency contact?", a: "Go to Menu > Emergency Contacts to add friends or family members who will be notified during alerts." },
    { q: "Can I use the app offline?", a: "Yes! Key features like the SOS siren and basic safety guides work without internet. Location sharing requires data." }
  ];

  if (!isAuthenticated) {
    return <AuthView onLoginSuccess={handleLoginSuccess} initialLanguage={settings.language} onLanguageChange={(l) => setSettings({...settings, language: l})} />;
  }

  // Determine Background Color
  const isHome = currentModule === AppModule.HOME;
  const bgColor = isHome ? 'bg-[var(--primary-light)]' : 'bg-white';

  return (
    <div className={`min-h-screen flex justify-center font-sans text-black ${bgColor}`}>
      <div className={`w-full max-w-md min-h-screen shadow-2xl relative overflow-hidden flex flex-col ${bgColor}`}>
        
        {/* Top Header */}
        <div className={`${isHome ? 'bg-[var(--primary-light)]/80' : 'bg-white/90'} backdrop-blur-md px-6 py-4 flex justify-between items-center sticky top-0 z-40 border-b ${isHome ? 'border-[var(--primary-light)]' : 'border-gray-100'}`}>
           <div className="flex items-center gap-3">
             {currentModule !== AppModule.HOME ? (
                <button 
                  onClick={() => setCurrentModule(AppModule.HOME)}
                  className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-black transition-colors active:bg-[var(--primary-color)] active:text-white"
                  aria-label="Back to Home"
                >
                  <ArrowLeft size={24} />
                </button>
             ) : (
                <div 
                 className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white font-bold text-sm shadow-md cursor-pointer"
                 onClick={() => setCurrentModule(AppModule.HOME)}
                >
                  S
                </div>
             )}
             
             <h1 
                className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-black via-[var(--primary-color)] to-black tracking-tighter cursor-pointer drop-shadow-sm hover:opacity-80 transition-opacity"
                onClick={() => setCurrentModule(AppModule.HOME)}
             >
               SheOS
             </h1>
           </div>
           
           <div className="flex items-center gap-2">
             <button 
               onClick={() => setIsLangModalOpen(true)}
               className="p-2 rounded-full text-black hover:bg-black hover:text-white transition-colors border border-transparent hover:border-black/10"
             >
                <Globe size={18} />
             </button>
             <button 
               onClick={() => setIsMenuOpen(true)}
               className={`p-2 rounded-full text-black hover:bg-black hover:text-white active:bg-[var(--primary-color)] transition-colors ${isHome ? 'bg-white border border-[var(--primary-light)]' : 'bg-gray-100 border border-transparent'}`}
             >
                <Menu size={18} />
             </button>
           </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar">
          {renderContent()}
        </main>

        {/* Floating Buttons */}
        <AIAssistantButton onClick={() => setIsAIChatOpen(true)} />
        <SOSButton onTrigger={handleSOSTrigger} />

        {/* Overlays */}
        <AIChatOverlay isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} language={settings.language} />
        
        {/* Language Modal */}
        {isLangModalOpen && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsLangModalOpen(false)}></div>
              <div className="bg-white w-full max-w-sm rounded-3xl p-6 relative z-10 shadow-2xl animate-fade-in border border-[var(--primary-light)]">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-black text-black">{t('selectLang')}</h3>
                      <button onClick={() => setIsLangModalOpen(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100">
                          <X size={20} />
                      </button>
                  </div>
                  <div className="space-y-3">
                      {['English', 'Hindi', 'Telugu'].map(lang => (
                          <button 
                              key={lang}
                              onClick={() => { setSettings({...settings, language: lang}); setIsLangModalOpen(false); }}
                              className={`w-full p-4 rounded-xl text-left font-bold border transition-all ${settings.language === lang ? 'bg-black text-white border-black' : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100'}`}
                          >
                              {lang === 'English' && 'English'}
                              {lang === 'Hindi' && 'Hindi (हिंदी)'}
                              {lang === 'Telugu' && 'Telugu (తెలుగు)'}
                          </button>
                      ))}
                  </div>
              </div>
           </div>
        )}

        {/* Menu Modal */}
        {isMenuOpen && (
           <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
              <div className="bg-white w-full max-w-sm rounded-3xl p-6 relative z-10 shadow-2xl animate-fade-in border border-[var(--primary-light)] flex flex-col">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-black">{t('menu')}</h2>
                    <button onClick={() => setIsMenuOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full active:bg-[var(--primary-color)] active:text-white transition-colors">
                        <X size={24} />
                    </button>
                 </div>
                 
                 <div className="space-y-3">
                    <button onClick={() => { setIsMenuOpen(false); setIsSettingsOpen(true); }} className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-2xl text-left hover:bg-[var(--primary-light)] transition-colors group active:bg-[var(--primary-color)] active:text-white border border-transparent active:border-[var(--primary-color)]">
                         <div className="text-gray-500 group-active:text-white"><Settings size={20} /></div>
                         <span className="font-bold text-black text-sm group-active:text-white">{t('settings')}</span>
                         <ChevronRight size={16} className="ml-auto text-gray-300 group-active:text-white" />
                    </button>
                    <button onClick={() => { setIsMenuOpen(false); setIsPrivacyOpen(true); }} className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-2xl text-left hover:bg-[var(--primary-light)] transition-colors group active:bg-[var(--primary-color)] active:text-white border border-transparent active:border-[var(--primary-color)]">
                         <div className="text-gray-500 group-active:text-white"><Shield size={20} /></div>
                         <span className="font-bold text-black text-sm group-active:text-white">{t('privacy')}</span>
                         <ChevronRight size={16} className="ml-auto text-gray-300 group-active:text-white" />
                    </button>
                    <button onClick={handleEmergencyContactsMenu} className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-2xl text-left hover:bg-[var(--primary-light)] transition-colors group active:bg-[var(--primary-color)] active:text-white border border-transparent active:border-[var(--primary-color)]">
                         <div className="text-gray-500 group-active:text-white"><Users size={20} /></div>
                         <span className="font-bold text-black text-sm group-active:text-white">{t('emergency')}</span>
                         <ChevronRight size={16} className="ml-auto text-gray-300 group-active:text-white" />
                    </button>
                    <button onClick={() => { setIsMenuOpen(false); setIsHelpOpen(true); }} className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-2xl text-left hover:bg-[var(--primary-light)] transition-colors group active:bg-[var(--primary-color)] active:text-white border border-transparent active:border-[var(--primary-color)]">
                         <div className="text-gray-500 group-active:text-white"><HelpCircle size={20} /></div>
                         <span className="font-bold text-black text-sm group-active:text-white">{t('help')}</span>
                         <ChevronRight size={16} className="ml-auto text-gray-300 group-active:text-white" />
                    </button>
                 </div>

                 <button 
                   onClick={handleLogout}
                   className="w-full flex items-center gap-4 p-4 mt-6 border border-gray-200 rounded-2xl text-left hover:bg-black hover:text-white transition-colors group active:bg-[var(--primary-color)] active:border-[var(--primary-color)]"
                 >
                     <LogOut size={20} className="text-gray-400 group-hover:text-white" />
                     <span className="font-bold text-gray-600 group-hover:text-white text-sm">{t('logout')}</span>
                 </button>
              </div>
           </div>
        )}

        {/* Settings Modal */}
        {isSettingsOpen && (
           <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsSettingsOpen(false)}></div>
              <div className="bg-white w-full max-w-sm rounded-3xl p-6 relative z-10 shadow-2xl animate-fade-in border border-[var(--primary-light)]">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-black">{t('settings')}</h2>
                    <button onClick={() => setIsSettingsOpen(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100">
                        <X size={20} />
                    </button>
                 </div>
                 
                 <div className="space-y-4">
                    {/* Theme Selector */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                           <Palette size={20} className="text-[var(--primary-color)]" />
                           <span className="font-bold text-sm text-black">App Theme</span>
                        </div>
                        <div className="flex gap-2">
                           {['Classic', 'Ocean', 'Nature'].map(theme => (
                              <button
                                 key={theme}
                                 onClick={() => setSettings({...settings, theme})}
                                 className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${settings.theme === theme ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200'}`}
                              >
                                 <div className={`w-3 h-3 rounded-full mb-1 mx-auto ${theme === 'Classic' ? 'bg-[#FF0F9A]' : theme === 'Ocean' ? 'bg-[#007AFF]' : 'bg-[#10B981]'}`}></div>
                                 {theme}
                              </button>
                           ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-3">
                           <Bell size={20} className="text-gray-600" />
                           <span className="font-bold text-sm text-black">Notifications</span>
                        </div>
                        <div 
                           onClick={() => toggleSetting('notifications')}
                           className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${settings.notifications ? 'bg-[var(--primary-color)]' : 'bg-gray-300'}`}
                        >
                           <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.notifications ? 'right-1' : 'left-1'}`}></div>
                        </div>
                    </div>
                    
                    <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                           <Lock size={20} className="text-gray-600" />
                           <span className="font-bold text-sm text-black">Account Security</span>
                        </div>
                        <ChevronRight size={16} className="text-gray-400" />
                    </button>
                 </div>
                 <div className="mt-6 text-center text-xs text-gray-400 font-medium">
                    Version 1.1.0 • SheOS
                 </div>
              </div>
           </div>
        )}

        {/* Privacy Center Modal */}
        {isPrivacyOpen && (
           <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsPrivacyOpen(false)}></div>
              <div className="bg-white w-full max-w-sm rounded-3xl p-6 relative z-10 shadow-2xl animate-fade-in border border-[var(--primary-light)]">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-black">{t('privacy')}</h2>
                    <button onClick={() => setIsPrivacyOpen(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100">
                        <X size={20} />
                    </button>
                 </div>
                 
                 <div className="bg-green-50 border border-green-100 p-4 rounded-2xl mb-6 flex items-start gap-3">
                     <Lock size={20} className="text-green-600 mt-0.5 shrink-0" />
                     <div>
                        <h4 className="font-bold text-sm text-green-800">End-to-End Encrypted</h4>
                        <p className="text-xs text-green-700 mt-1">Your location and health data are private and secure.</p>
                     </div>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-3">
                           <EyeOff size={20} className="text-gray-600" />
                           <span className="font-bold text-sm text-black">Incognito Mode</span>
                        </div>
                        <div 
                           onClick={() => toggleSetting('incognito')}
                           className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${settings.incognito ? 'bg-black' : 'bg-gray-300'}`}
                        >
                           <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.incognito ? 'right-1' : 'left-1'}`}></div>
                        </div>
                    </div>
                    <button 
                        onClick={handleClearHistory}
                        className="w-full flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-red-600 hover:bg-red-50 transition-colors active:bg-red-100"
                    >
                        <Trash2 size={20} />
                        <span className="font-bold text-sm">Clear History</span>
                    </button>
                 </div>
              </div>
           </div>
        )}

        {/* Help Modal */}
        {isHelpOpen && (
           <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center pointer-events-none">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" onClick={() => setIsHelpOpen(false)}></div>
              <div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-0 relative z-10 shadow-2xl animate-slide-up flex flex-col max-h-[90vh] pointer-events-auto">
                 
                 {/* Help Header */}
                 <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-3xl sticky top-0 z-20">
                    <div>
                       <h2 className="text-2xl font-black text-black">{t('help')}</h2>
                       <p className="text-xs text-gray-500 font-medium">Guides, FAQs, and Support</p>
                    </div>
                    <button onClick={() => setIsHelpOpen(false)} className="p-2 bg-gray-50 text-black hover:bg-gray-100 rounded-full active:bg-[var(--primary-color)] active:text-white transition-colors">
                        <X size={24} />
                    </button>
                 </div>

                 <div className="p-6 overflow-y-auto">
                    {/* Search Mock */}
                    <div className="relative mb-6">
                       <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                       <input type="text" placeholder="Search for help..." className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:border-black text-sm" />
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                       <button onClick={() => { setIsHelpOpen(false); setIsAIChatOpen(true); }} className="p-4 rounded-2xl bg-[var(--primary-light)] border border-[var(--primary-light)] flex flex-col items-center text-center active:bg-[var(--primary-color)] group transition-colors">
                          <MessageSquare size={24} className="text-[var(--primary-color)] mb-2 group-active:text-white" />
                          <span className="font-bold text-black text-sm group-active:text-white">Ask AI Assistant</span>
                       </button>
                       <button className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex flex-col items-center text-center active:bg-blue-600 group transition-colors">
                          <FileText size={24} className="text-blue-500 mb-2 group-active:text-white" />
                          <span className="font-bold text-black text-sm group-active:text-white">User Guide</span>
                       </button>
                    </div>

                    {/* FAQ Accordion */}
                    <h3 className="font-bold text-black mb-3">Frequently Asked Questions</h3>
                    <div className="space-y-2">
                       {faqs.map((faq, idx) => (
                          <div key={idx} className="border border-gray-100 rounded-xl overflow-hidden">
                             <button 
                                onClick={() => toggleFaq(idx)}
                                className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors text-left"
                             >
                                <span className="font-bold text-sm text-gray-800 pr-4">{faq.q}</span>
                                <ChevronRight size={16} className={`text-gray-400 transition-transform duration-200 ${expandedFaq === idx ? 'rotate-90' : ''}`} />
                             </button>
                             {expandedFaq === idx && (
                                <div className="p-4 pt-0 text-xs text-gray-500 leading-relaxed bg-gray-50 border-t border-gray-100">
                                   {faq.a}
                                </div>
                             )}
                          </div>
                       ))}
                    </div>

                    {/* Contact Support */}
                    <div className="mt-8 p-4 bg-gray-900 rounded-2xl text-white text-center">
                       <h4 className="font-bold mb-1">Still need help?</h4>
                       <p className="text-xs text-gray-400 mb-3">Our support team is available 24/7.</p>
                       <button 
                           onClick={handleContactSupport}
                           className="bg-[var(--primary-color)] px-6 py-2 rounded-full font-bold text-sm hover:bg-white hover:text-[var(--primary-color)] transition-colors"
                       >
                          Contact Support
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* Bottom Navigation */}
        <nav className={`fixed bottom-0 w-full max-w-md ${isHome ? 'bg-white/90' : 'bg-white'} backdrop-blur-lg border-t ${isHome ? 'border-[var(--primary-light)]' : 'border-gray-100'} px-4 py-3 flex justify-between items-center z-40 text-xs font-bold pb-6 shadow-[0_-5px_20px_rgba(0,0,0,0.02)]`}>
          <button 
             onClick={() => setCurrentModule(AppModule.SAFETY)}
             className={`flex flex-col items-center gap-1 transition-all active:scale-95 active:text-[var(--primary-color)] ${currentModule === AppModule.SAFETY ? 'text-[var(--primary-color)] scale-105' : 'text-black opacity-100'}`}
          >
             <Shield size={20} className={currentModule === AppModule.SAFETY ? 'fill-current' : ''} />
             <span className="text-[10px]">{t('navSafety')}</span>
          </button>
          <button 
             onClick={() => setCurrentModule(AppModule.HEALTH)}
             className={`flex flex-col items-center gap-1 transition-all active:scale-95 active:text-[var(--primary-color)] ${currentModule === AppModule.HEALTH ? 'text-[var(--primary-color)] scale-105' : 'text-black opacity-100'}`}
          >
             <Heart size={20} className={currentModule === AppModule.HEALTH ? 'fill-current' : ''} />
             <span className="text-[10px]">{t('navHealth')}</span>
          </button>
          <button 
             onClick={() => setCurrentModule(AppModule.EDUCATION)}
             className={`flex flex-col items-center gap-1 transition-all active:scale-95 active:text-[var(--primary-color)] ${currentModule === AppModule.EDUCATION ? 'text-[var(--primary-color)] scale-105' : 'text-black opacity-100'}`}
          >
             <GraduationCap size={20} className={currentModule === AppModule.EDUCATION ? 'fill-current' : ''} />
             <span className="text-[10px]">{t('navLearn')}</span>
          </button>
          <button 
             onClick={() => setCurrentModule(AppModule.FINANCE)}
             className={`flex flex-col items-center gap-1 transition-all active:scale-95 active:text-[var(--primary-color)] ${currentModule === AppModule.FINANCE ? 'text-[var(--primary-color)] scale-105' : 'text-black opacity-100'}`}
          >
             <Wallet size={20} className={currentModule === AppModule.FINANCE ? 'fill-current' : ''} />
             <span className="text-[10px]">{t('navFinance')}</span>
          </button>
          <button 
             onClick={() => setCurrentModule(AppModule.COMMUNITY)}
             className={`flex flex-col items-center gap-1 transition-all active:scale-95 active:text-[var(--primary-color)] ${currentModule === AppModule.COMMUNITY ? 'text-[var(--primary-color)] scale-105' : 'text-black opacity-100'}`}
          >
             <Users size={20} className={currentModule === AppModule.COMMUNITY ? 'fill-current' : ''} />
             <span className="text-[10px]">{t('navCommunity')}</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default App;
