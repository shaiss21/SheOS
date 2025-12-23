
import React, { useState, useRef, useEffect } from 'react';
import { Wallet, TrendingUp, Lock, Search, AlertTriangle, ChevronRight, FileText, Sparkles, CheckCircle, ArrowRight, Calendar, UserPlus, X, Shield, DollarSign, Camera, Upload } from '../components/Icons';
import { detectFinancialAbuse, generateFinancialForecast } from '../services/geminiService';
import { FinanceInsightResponse, FinanceProfile, FinanceForecast } from '../types';

interface FinanceViewProps {
  language?: string;
}

const FinanceView: React.FC<FinanceViewProps> = ({ language = 'English' }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PREDICTOR'>('OVERVIEW');

  // --- Overview State ---
  const [insight, setInsight] = useState<FinanceInsightResponse | null>(null);
  const [isFrozen, setIsFrozen] = useState(false);
  
  // --- Predictor State ---
  const [loadingForecast, setLoadingForecast] = useState(false);
  const [forecast, setForecast] = useState<FinanceForecast | null>(null);
  const [profile, setProfile] = useState<FinanceProfile>({
    monthlyIncome: 0,
    savings: 0,
    careerStage: 'Mid-Level',
    lifeStatus: 'Single',
    financialGoal: '',
    recentMood: 'Neutral'
  });

  // Modal States
  const [showWalletHistory, setShowWalletHistory] = useState(false);
  const [showInvestments, setShowInvestments] = useState(false);
  const [showVault, setShowVault] = useState(false);
  
  // Vault Auth State
  const [vaultStatus, setVaultStatus] = useState<'LOCKED' | 'SCANNING' | 'PIN_INPUT' | 'UNLOCKED'>('LOCKED');
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const mockTransactions = "Uber late night $45, Transfer to Partner $500, Groceries $120, Credit Card Pay $200";

  // Translations
  const translations: any = {
    'English': {
      title: "SheFinance",
      subtitle: "Financial Independence & Safety.",
      tabDash: "DASHBOARD",
      tabPredictor: "AI LIFE PREDICTOR",
      balance: "Total Balance",
      history: "History",
      panicFreeze: "Panic Freeze",
      unfreeze: "Unfreeze",
      frozenMsg: "ACCOUNTS FROZEN",
      frozenDesc: "Tap Panic button to unlock",
      safetyAudit: "Safety Audit",
      runScan: "RUN SCAN",
      auditDesc: "AI is scanning your recent transactions for patterns of financial coercion.",
      riskProb: "Risk Probability",
      investments: "Investments",
      womenFunds: "Women-first funds",
      safeVault: "Safe Vault",
      encryptedDocs: "Encrypted Docs",
      predictTitle: "AI Life Predictor",
      predictDesc: "Forecasting your financial future.",
      monthlyInc: "Monthly Income",
      careerStage: "Career Stage",
      status: "Status",
      topGoal: "Top Goal",
      recentMood: "Recent Mood",
      runForecast: "Run Forecast",
      predicting: "Predicting Future...",
      stabilityForecast: "Stability Forecast",
      risksDetected: "Risks Detected",
      spendingCheck: "Emotional Spending Check",
      timeline: "Financial Timeline",
      careerGrowth: "Career & Income Growth",
      smartInvest: "Women-Smart Investments",
      newPred: "Start New Prediction",
      recommendation: "Recommendation"
    },
    'Hindi': {
      title: "शी-फाइनांस",
      subtitle: "वित्तीय स्वतंत्रता और सुरक्षा।",
      tabDash: "डैशबोर्ड",
      tabPredictor: "एआई जीवन भविष्यवक्ता",
      balance: "कुल शेष",
      history: "इतिहास",
      panicFreeze: "पैनिक फ्रीज",
      unfreeze: "अनफ्रीज",
      frozenMsg: "खाते फ्रीज",
      frozenDesc: "अनलॉक करने के लिए पैनिक बटन दबाएं",
      safetyAudit: "सुरक्षा ऑडिट",
      runScan: "स्कैन करें",
      auditDesc: "AI वित्तीय दबाव के पैटर्न के लिए आपके लेनदेन को स्कैन कर रहा है।",
      riskProb: "जोखिम संभावना",
      investments: "निवेश",
      womenFunds: "महिला-प्रथम फंड",
      safeVault: "सुरक्षित तिजोरी",
      encryptedDocs: "एन्क्रिप्टेड दस्तावेज़",
      predictTitle: "एआई जीवन भविष्यवक्ता",
      predictDesc: "आपके वित्तीय भविष्य का पूर्वानुमान।",
      monthlyInc: "मासिक आय",
      careerStage: "करियर चरण",
      status: "स्थिति",
      topGoal: "मुख्य लक्ष्य",
      recentMood: "हाल का मूड",
      runForecast: "पूर्वानुमान चलाएं",
      predicting: "भविष्य बता रहा है...",
      stabilityForecast: "स्थिरता पूर्वानुमान",
      risksDetected: "जोखिमों का पता चला",
      spendingCheck: "भावनात्मक खर्च जांच",
      timeline: "वित्तीय समयरेखा",
      careerGrowth: "करियर और आय वृद्धि",
      smartInvest: "महिला-स्मार्ट निवेश",
      newPred: "नया पूर्वानुमान शुरू करें",
      recommendation: "सुझाव"
    },
    'Telugu': {
      title: "షి-ఫైనాన్స్",
      subtitle: "ఆర్థిక స్వేచ్ఛ & భద్రత.",
      tabDash: "డ్యాష్‌బోర్డ్",
      tabPredictor: "AI లైఫ్ ప్రిడిక్టర్",
      balance: "మొత్తం నిల్వ",
      history: "చరిత్ర",
      panicFreeze: "పానిక్ ఫ్రీజ్",
      unfreeze: "అన్‌ఫ్రీజ్",
      frozenMsg: "ఖాతాలు స్తంభింపజేయబడ్డాయి",
      frozenDesc: "అన్‌లాక్ చేయడానికి పానిక్ బటన్ నొక్కండి",
      safetyAudit: "భద్రతా ఆడిట్",
      runScan: "స్కాన్ చేయండి",
      auditDesc: "AI మీ లావాదేవీలను స్కాన్ చేస్తోంది.",
      riskProb: "ప్రమాద సంభావ్యత",
      investments: "పెట్టుబడులు",
      womenFunds: "మహిళా నిధులు",
      safeVault: "సురక్షిత వాల్ట్",
      encryptedDocs: "ఎన్క్రిప్టెడ్ పత్రాలు",
      predictTitle: "AI లైఫ్ ప్రిడిక్టర్",
      predictDesc: "మీ ఆర్థిక భవిష్యత్తును అంచనా వేస్తోంది.",
      monthlyInc: "నెలవారీ ఆదాయం",
      careerStage: "కెరీర్ దశ",
      status: "స్థితి",
      topGoal: "ముఖ్య లక్ష్యం",
      recentMood: "ఇటీవలి మూడ్",
      runForecast: "ఫోర్కాస్ట్ రన్ చేయండి",
      predicting: "అంచనా వేస్తోంది...",
      stabilityForecast: "స్థిరత్వం అంచనా",
      risksDetected: "గుర్తించిన ప్రమాదాలు",
      spendingCheck: "ఎమోషనల్ ఖర్చు తనిఖీ",
      timeline: "ఆర్థిక కాలక్రమం",
      careerGrowth: "కెరీర్ & ఆదాయ వృద్ధి",
      smartInvest: "మహిళా స్మార్ట్ పెట్టుబడులు",
      newPred: "కొత్త అంచనా",
      recommendation: "సిఫార్సు"
    }
  };

  const t = translations[language] || translations['English'];

  const handleAudit = async () => {
    const result = await detectFinancialAbuse(mockTransactions, language);
    setInsight(result);
  };

  const toggleFreeze = () => {
    setIsFrozen(!isFrozen);
  };

  const generateForecast = async () => {
    if (profile.monthlyIncome === 0) return;
    setLoadingForecast(true);
    const result = await generateFinancialForecast(profile, language);
    setForecast(result);
    setLoadingForecast(false);
  };

  const getScoreColor = (score: number) => {
    if (score > 75) return 'text-green-500 border-green-500';
    if (score > 50) return 'text-yellow-500 border-yellow-500';
    return 'text-red-500 border-red-500';
  };

  const handleInvestAction = (fundName: string) => {
    alert(`Success! You have started an investment in ${fundName}.`);
    setShowInvestments(false);
  };

  // --- CAMERA LOGIC FOR VAULT ---
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    if (!showVault) {
      stopCamera();
      setVaultStatus('LOCKED');
      setPin('');
      setPinError(false);
    }
  }, [showVault]);

  const handleUnlockVault = async () => {
    setVaultStatus('SCANNING');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      streamRef.current = stream;
      
      // Delay to ensure video element is rendered
      setTimeout(() => {
         if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(e => console.log("Play error", e));
         }
      }, 100);

      // Simulate authentication duration
      setTimeout(() => {
        stopCamera();
        setVaultStatus('UNLOCKED');
      }, 3000);
    } catch (err) {
      console.error("Camera denied:", err);
      alert("Camera access required for FaceID. Using PIN fallback.");
      stopCamera();
      setVaultStatus('PIN_INPUT');
    }
  };

  const handlePinSubmit = () => {
    if (pin === "1234") {
       setVaultStatus('UNLOCKED');
    } else {
       setPinError(true);
       setPin('');
    }
  };

  return (
    <div className="pb-24 animate-fade-in">
       
       {/* WALLET HISTORY MODAL */}
       {showWalletHistory && (
          <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in" onClick={() => setShowWalletHistory(false)}>
            <div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-6 relative z-10 shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-black">Wallet Activity</h3>
                  <button onClick={() => setShowWalletHistory(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100"><X size={20} /></button>
               </div>
               <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                     <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg text-green-600 shadow-sm"><DollarSign size={16}/></div>
                        <div><p className="text-sm font-bold text-black">Salary Credit</p><p className="text-[10px] text-gray-500">Today, 9:00 AM</p></div>
                     </div>
                     <span className="text-sm font-bold text-green-600">+$3,200</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                     <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg text-red-500 shadow-sm"><Search size={16}/></div>
                        <div><p className="text-sm font-bold text-black">Grocery Store</p><p className="text-[10px] text-gray-500">Yesterday</p></div>
                     </div>
                     <span className="text-sm font-bold text-black">-$120.50</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                     <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg text-red-500 shadow-sm"><Search size={16}/></div>
                        <div><p className="text-sm font-bold text-black">Uber Ride</p><p className="text-[10px] text-gray-500">2 Days ago</p></div>
                     </div>
                     <span className="text-sm font-bold text-black">-$45.00</span>
                  </div>
               </div>
            </div>
          </div>
       )}

       {/* INVESTMENTS MODAL */}
       {showInvestments && (
          <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in" onClick={() => setShowInvestments(false)}>
            <div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-6 relative z-10 shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-black">Women-First Funds</h3>
                  <button onClick={() => setShowInvestments(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100"><X size={20} /></button>
               </div>
               <div className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 rounded-2xl text-white shadow-lg">
                      <h4 className="font-bold">SheGrowth ETF</h4>
                      <p className="text-xs text-purple-100 mb-2">Top 50 women-led companies</p>
                      <div className="flex justify-between items-end">
                         <span className="text-2xl font-black">+12.4%</span>
                         <button onClick={() => handleInvestAction('SheGrowth ETF')} className="bg-white text-purple-600 px-3 py-1 rounded-lg text-xs font-bold active:scale-95 transition-transform hover:bg-gray-100">Invest</button>
                      </div>
                  </div>
                  <div className="p-4 rounded-2xl border border-gray-100 shadow-sm">
                      <h4 className="font-bold text-black">Gold SIP</h4>
                      <p className="text-xs text-gray-500 mb-2">Secure & Liquid assets</p>
                      <div className="flex justify-between items-end">
                         <span className="text-lg font-bold text-green-600">Safe Haven</span>
                         <button onClick={() => handleInvestAction('Gold SIP')} className="bg-black text-white px-3 py-1 rounded-lg text-xs font-bold active:scale-95 transition-transform hover:bg-gray-800">Start</button>
                      </div>
                  </div>
               </div>
            </div>
          </div>
       )}

       {/* VAULT MODAL (UPDATED WITH FACEID & PIN) */}
       {showVault && (
          <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in" onClick={() => setShowVault(false)}>
            <div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-6 relative z-10 shadow-2xl animate-slide-up overflow-hidden" onClick={e => e.stopPropagation()}>
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-black flex items-center gap-2"><Lock size={20} className="text-[var(--primary-color)]"/> {t.safeVault}</h3>
                  <button onClick={() => setShowVault(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100"><X size={20} /></button>
               </div>
               
               {vaultStatus === 'LOCKED' && (
                  <div className="text-center py-8">
                     <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock size={32} className="text-gray-400" />
                     </div>
                     <h4 className="font-bold text-black">Biometric Lock Active</h4>
                     <p className="text-xs text-gray-500 mt-2 px-8">Your documents are encrypted. Authenticate to access legal papers, incident proofs, and IDs.</p>
                     
                     <div className="flex flex-col gap-3 mt-6">
                        <button 
                            onClick={handleUnlockVault}
                            className="bg-black text-white w-full py-3 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
                        >
                            <Camera size={18} /> Unlock with FaceID
                        </button>
                        <button 
                            onClick={() => setVaultStatus('PIN_INPUT')}
                            className="bg-white border border-gray-200 text-black w-full py-3 rounded-xl font-bold text-sm hover:bg-gray-50 active:scale-95 transition-transform"
                        >
                            Use PIN Code
                        </button>
                     </div>
                  </div>
               )}

               {vaultStatus === 'PIN_INPUT' && (
                   <div className="text-center py-8">
                       <h4 className="font-bold text-black mb-1">Enter PIN</h4>
                       <p className="text-xs text-gray-500 mb-6">Enter your 4-digit security PIN (1234)</p>
                       
                       <div className="flex justify-center mb-6">
                           <input 
                               type="password" 
                               maxLength={4}
                               value={pin}
                               onChange={(e) => { setPin(e.target.value); setPinError(false); }}
                               className={`w-32 text-center text-3xl font-bold tracking-[0.5em] border-b-2 bg-transparent focus:outline-none ${pinError ? 'border-red-500 text-red-500' : 'border-gray-300 text-black focus:border-black'}`}
                               autoFocus
                           />
                       </div>
                       
                       {pinError && <p className="text-xs text-red-500 font-bold mb-4">Incorrect PIN. Try again.</p>}

                       <div className="flex gap-3">
                           <button onClick={() => setVaultStatus('LOCKED')} className="flex-1 py-3 text-sm font-bold text-gray-500">Cancel</button>
                           <button 
                               onClick={handlePinSubmit}
                               disabled={pin.length !== 4}
                               className="flex-1 bg-black text-white py-3 rounded-xl font-bold text-sm disabled:opacity-50"
                           >
                               Unlock
                           </button>
                       </div>
                   </div>
               )}

               {vaultStatus === 'SCANNING' && (
                  <div className="flex flex-col items-center justify-center py-8">
                     <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-[var(--primary-color)] shadow-[0_0_20px_rgba(var(--primary-color),0.3)] bg-gray-900">
                        <video ref={videoRef} className="w-full h-full object-cover transform scale-x-[-1]" playsInline muted />
                        {/* Scanning Overlay */}
                        <div className="absolute inset-0 bg-[var(--primary-color)]/10 animate-pulse"></div>
                        <div className="absolute top-1/2 w-full h-0.5 bg-[var(--primary-color)] shadow-[0_0_15px_var(--primary-color)] animate-ping"></div>
                     </div>
                     <p className="mt-6 text-sm font-bold text-black animate-pulse">Verifying Identity...</p>
                     <p className="text-xs text-gray-500">Please look at the camera</p>
                  </div>
               )}

               {vaultStatus === 'UNLOCKED' && (
                  <div className="animate-fade-in">
                     <div className="flex items-center gap-2 mb-4 bg-green-50 p-3 rounded-xl border border-green-100">
                        <CheckCircle size={16} className="text-green-600" />
                        <span className="text-xs font-bold text-green-700">Access Granted. Vault Unlocked.</span>
                     </div>
                     
                     <h4 className="font-bold text-sm text-black mb-3">Encrypted Documents</h4>
                     <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                        {['Passport_Copy.pdf', 'Legal_Agreement.pdf', 'Emergency_Plan.docx'].map((doc, i) => (
                           <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-black/20 transition-colors">
                              <div className="flex items-center gap-3">
                                 <div className="bg-white p-2 rounded-lg text-[var(--primary-color)] shadow-sm border border-[var(--primary-light)]"><FileText size={16}/></div>
                                 <div><p className="text-sm font-bold text-black">{doc}</p><p className="text-[10px] text-gray-500">Encrypted • 2MB</p></div>
                              </div>
                              <button className="text-gray-400 hover:text-black"><ChevronRight size={16} /></button>
                           </div>
                        ))}
                     </div>
                     
                     <button className="w-full mt-6 bg-gray-100 text-black py-3 rounded-xl font-bold text-sm hover:bg-gray-200 active:scale-95 transition-transform flex items-center justify-center gap-2">
                        <Upload size={16} /> Upload New Document
                     </button>
                  </div>
               )}
            </div>
          </div>
       )}

       <header className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-black">{t.title}</h2>
          <p className="text-gray-500 font-medium">{t.subtitle}</p>
        </div>
        <button 
           onClick={() => setShowWalletHistory(true)}
           className="bg-black p-2 rounded-full text-white active:scale-95 transition-transform shadow-md"
        >
            <Wallet size={24} />
        </button>
      </header>

      {/* Tabs */}
      <div className="bg-gray-100 p-1 rounded-xl flex mb-6 mx-1">
         <button 
           onClick={() => setActiveTab('OVERVIEW')}
           className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all active:bg-[var(--primary-color)] active:text-white ${activeTab === 'OVERVIEW' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'}`}
         >
           {t.tabDash}
         </button>
         <button 
           onClick={() => setActiveTab('PREDICTOR')}
           className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 active:bg-[var(--primary-color)] active:text-white ${activeTab === 'PREDICTOR' ? 'bg-black text-white shadow-sm' : 'text-gray-500 hover:text-black'}`}
         >
           <Sparkles size={12} className={activeTab === 'PREDICTOR' ? "text-[var(--primary-color)]" : ""} /> {t.tabPredictor}
         </button>
      </div>

      {activeTab === 'OVERVIEW' ? (
        <>
          {/* Main Balance Card with Panic Freeze */}
          <div className={`rounded-3xl p-6 text-white shadow-2xl mb-8 relative overflow-hidden transition-all duration-500 ${isFrozen ? 'bg-red-900' : 'bg-black'}`}>
            
            {isFrozen && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="text-center">
                        <Lock size={48} className="mx-auto text-red-500 mb-2" />
                        <h2 className="font-bold text-xl text-red-100">{t.frozenMsg}</h2>
                        <p className="text-xs text-gray-400">{t.frozenDesc}</p>
                    </div>
                </div>
            )}

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-wide">{t.balance}</p>
                        <h1 className="text-4xl font-black mt-1 tracking-tight text-white">$4,250.00</h1>
                    </div>
                    <div className="bg-white/10 p-2 rounded-lg backdrop-blur-md">
                        <Wallet size={20} className="text-[var(--primary-color)]" />
                    </div>
                </div>
                
                <div className="flex gap-3 mt-4">
                    <button onClick={() => setShowWalletHistory(true)} className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-3 rounded-xl text-sm font-bold transition-all border border-white/10 active:bg-[var(--primary-color)] active:border-[var(--primary-color)]">
                        {t.history}
                    </button>
                    <button 
                        onClick={toggleFreeze}
                        className={`flex-1 px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:bg-white active:text-[var(--primary-color)] ${isFrozen ? 'bg-red-500 text-white' : 'bg-[var(--primary-color)] text-white'}`}
                    >
                        <Lock size={16} /> {isFrozen ? t.unfreeze : t.panicFreeze}
                    </button>
                </div>
            </div>
            
            {/* Decorative Background */}
            <div className="absolute -right-6 -bottom-10 opacity-20 rotate-12 text-[var(--primary-color)]">
                <Wallet size={200} />
            </div>
          </div>

          {/* AI Financial Abuse Detector */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--primary-light)] mb-6 group hover:border-black/20 transition-colors">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-black rounded-lg text-white">
                        <Search size={20}/>
                    </div>
                    <h3 className="font-bold text-black">{t.safetyAudit}</h3>
                </div>
                <button onClick={handleAudit} className="text-xs bg-[var(--primary-light)] text-[var(--primary-color)] px-3 py-1 rounded-full font-bold hover:bg-pink-200 active:bg-[var(--primary-color)] active:text-white transition-colors">{t.runScan}</button>
            </div>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed font-medium">
                {t.auditDesc}
            </p>
            
            {insight ? (
                <div className={`p-4 rounded-xl border ${insight.financialAbuseRisk > 50 ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-black flex items-center gap-2">
                            {insight.financialAbuseRisk > 50 ? <AlertTriangle size={16} className="text-red-500"/> : <TrendingUp size={16} className="text-green-500"/>}
                            {t.riskProb}
                        </span>
                        <span className={`font-extrabold text-lg ${insight.financialAbuseRisk > 50 ? 'text-red-600' : 'text-green-600'}`}>
                            {insight.financialAbuseRisk}%
                        </span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mb-3">
                        <div 
                            className={`h-full rounded-full ${insight.financialAbuseRisk > 50 ? 'bg-red-500' : 'bg-green-500'}`} 
                            style={{ width: `${insight.financialAbuseRisk}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-700 font-bold">{insight.spendingStatus}</p>
                    <div className="mt-2 bg-white p-2 rounded-lg border border-gray-100">
                        <p className="text-xs font-bold text-black">{t.recommendation}: {insight.savingsTip}</p>
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-wide">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div> System Ready
                </div>
            )}
          </div>

          {/* Financial Tools Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div onClick={() => setShowInvestments(true)} className="bg-white p-5 rounded-2xl shadow-sm border border-[var(--primary-light)] hover:shadow-md transition-all cursor-pointer hover:border-black/20 group active:border-[var(--primary-color)]">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-black mb-3 group-hover:bg-black group-hover:text-white group-active:bg-[var(--primary-color)] group-active:text-white transition-colors">
                    <TrendingUp size={20} />
                </div>
                <h4 className="font-bold text-black">{t.investments}</h4>
                <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500 font-medium">{t.womenFunds}</p>
                    <ChevronRight size={14} className="text-black"/>
                </div>
            </div>
            <div onClick={() => setShowVault(true)} className="bg-white p-5 rounded-2xl shadow-sm border border-[var(--primary-light)] hover:shadow-md transition-all cursor-pointer hover:border-black/20 group active:border-[var(--primary-color)]">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-black mb-3 group-hover:bg-black group-hover:text-white group-active:bg-[var(--primary-color)] group-active:text-white transition-colors">
                    <FileText size={20} />
                </div>
                <h4 className="font-bold text-black">{t.safeVault}</h4>
                <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500 font-medium">{t.encryptedDocs}</p>
                    <Lock size={12} className="text-black"/>
                </div>
            </div>
          </div>
        </>
      ) : (
        // --- NEW PREDICTOR VIEW ---
        <div className="animate-fade-in">
           {!forecast ? (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-[var(--primary-light)]">
                 <div className="mb-6 text-center">
                    <div className="w-16 h-16 bg-[var(--primary-light)] rounded-full flex items-center justify-center mx-auto mb-3 text-[var(--primary-color)] shadow-inner">
                       <Sparkles size={32} />
                    </div>
                    <h3 className="text-xl font-black text-black">{t.predictTitle}</h3>
                    <p className="text-sm text-gray-500 font-medium mt-1">{t.predictDesc}</p>
                 </div>

                 <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase mb-2 block">{t.monthlyInc}</label>
                      <input 
                        type="number"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black text-black"
                        placeholder="Amount"
                        value={profile.monthlyIncome || ''}
                        onChange={(e) => setProfile({...profile, monthlyIncome: parseInt(e.target.value)})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-gray-700 uppercase mb-2 block">{t.careerStage}</label>
                          <select 
                             className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2 py-3 text-sm focus:outline-none focus:border-black text-black"
                             value={profile.careerStage}
                             onChange={(e) => setProfile({...profile, careerStage: e.target.value as any})}
                          >
                             {['Entry', 'Mid-Level', 'Senior', 'Career Break', 'Student'].map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-700 uppercase mb-2 block">{t.status}</label>
                          <select 
                             className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2 py-3 text-sm focus:outline-none focus:border-black text-black"
                             value={profile.lifeStatus}
                             onChange={(e) => setProfile({...profile, lifeStatus: e.target.value as any})}
                          >
                             {['Single', 'Married', 'Mother', 'Single Mother'].map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase mb-2 block">{t.topGoal}</label>
                      <input 
                        type="text"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black text-black"
                        placeholder="e.g. Buy a Home, Start Business"
                        value={profile.financialGoal}
                        onChange={(e) => setProfile({...profile, financialGoal: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase mb-2 block">{t.recentMood}</label>
                      <div className="flex gap-2">
                        {['Happy', 'Stressed', 'Anxious', 'Neutral'].map(m => (
                            <button
                               key={m}
                               onClick={() => setProfile({...profile, recentMood: m as any})}
                               className={`px-3 py-2 rounded-lg text-xs font-bold border active:bg-[var(--primary-color)] active:text-white ${profile.recentMood === m ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-200'}`}
                            >
                                {m}
                            </button>
                        ))}
                      </div>
                    </div>

                    <button 
                       onClick={generateForecast}
                       disabled={loadingForecast || !profile.monthlyIncome}
                       className="w-full bg-[var(--primary-color)] text-white py-4 rounded-xl font-bold text-sm shadow-lg hover:opacity-90 active:opacity-80 transition-opacity mt-2 flex items-center justify-center gap-2"
                    >
                       <Sparkles size={18} className={loadingForecast ? 'animate-spin' : ''} />
                       {loadingForecast ? t.predicting : t.runForecast}
                    </button>
                 </div>
              </div>
           ) : (
             // --- FORECAST DASHBOARD ---
             <div className="space-y-6">
                
                {/* Stability Score Card */}
                <div className="bg-black text-white p-6 rounded-3xl relative overflow-hidden shadow-xl">
                   <div className="flex justify-between items-start mb-6 relative z-10">
                      <div>
                         <h3 className="font-bold text-lg text-pink-200">{t.stabilityForecast}</h3>
                         <p className="text-xs text-gray-400">Projected Health Score</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold border ${forecast.stabilityStatus === 'Critical' ? 'bg-red-500 border-red-500 text-white' : 'bg-white/10 border-white/20 text-white'}`}>
                         {forecast.stabilityStatus.toUpperCase()}
                      </div>
                   </div>

                   {/* Gauge */}
                   <div className="flex items-center gap-6 relative z-10">
                      <div className={`w-24 h-24 rounded-full border-[6px] flex items-center justify-center ${getScoreColor(forecast.stabilityScore)} bg-white/5`}>
                          <span className="text-2xl font-black text-white">{forecast.stabilityScore}</span>
                      </div>
                      <div className="flex-1">
                          <p className="text-xs font-bold text-gray-400 uppercase mb-2">{t.risksDetected}</p>
                          <ul className="space-y-1">
                             {forecast.predictedRisks.map((risk, i) => (
                                <li key={i} className="flex items-center gap-2 text-xs font-medium text-white">
                                   <AlertTriangle size={10} className="text-red-400" /> {risk}
                                </li>
                             ))}
                          </ul>
                      </div>
                   </div>
                </div>

                {/* Emotional Spending Analysis */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-[var(--primary-light)]">
                    <h3 className="font-bold text-black mb-2 flex items-center gap-2">
                        <Wallet size={18} className="text-[var(--primary-color)]" /> {t.spendingCheck}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed font-medium bg-[var(--primary-light)]/50 p-3 rounded-xl border border-[var(--primary-light)]">
                        "{forecast.emotionalSpendingAnalysis}"
                    </p>
                </div>

                {/* Future Timeline */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-[var(--primary-light)]">
                   <h3 className="font-bold text-black mb-4 flex items-center gap-2">
                      <Calendar size={18} className="text-[var(--primary-color)]" /> {t.timeline}
                   </h3>
                   <div className="relative pl-4 space-y-6 before:absolute before:left-[23px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                      {forecast.futureTimeline.map((item, i) => (
                         <div key={i} className="relative flex items-center gap-4">
                            <div className="w-4 h-4 rounded-full bg-black border-2 border-white shadow-sm z-10 shrink-0"></div>
                            <div className="flex-1 bg-gray-50 p-3 rounded-xl border border-gray-100">
                               <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs font-black text-black">{item.year}</span>
                                  <span className="text-[10px] bg-white px-2 py-0.5 rounded-md text-red-500 font-bold border border-red-50">Est. {item.expenseProjection}</span>
                               </div>
                               <span className="text-xs text-gray-600 font-medium">{item.event}</span>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>

                {/* Career Growth */}
                <div className="bg-gradient-to-br from-gray-900 to-black p-5 rounded-2xl text-white shadow-lg">
                   <div className="flex items-center gap-2 mb-3">
                      <TrendingUp size={18} className="text-[var(--primary-color)]" />
                      <h3 className="font-bold text-sm">{t.careerGrowth}</h3>
                   </div>
                   <p className="text-xl font-black mb-1">{forecast.careerGrowthPrediction}</p>
                   <div className="flex items-center gap-2 mt-4 bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                      <UserPlus size={16} className="text-green-400" />
                      <div>
                         <p className="text-[10px] text-gray-400 uppercase font-bold">Recommended Skill</p>
                         <p className="text-xs font-bold text-white">{forecast.recommendedSkill}</p>
                      </div>
                      <ChevronRight size={14} className="ml-auto text-gray-400" />
                   </div>
                </div>

                {/* Investment Strategy */}
                <div>
                   <h3 className="font-bold text-black mb-3 px-1">{t.smartInvest}</h3>
                   <div className="space-y-3">
                      {forecast.investmentStrategy.map((inv, i) => (
                         <div key={i} className="bg-white p-4 rounded-2xl border border-[var(--primary-light)] shadow-sm flex items-start gap-3 hover:border-black/20 transition-all">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${inv.type === 'Gold' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                               <CheckCircle size={18} />
                            </div>
                            <div>
                               <h4 className="font-bold text-black text-sm">{inv.title}</h4>
                               <p className="text-xs text-gray-500 mt-1">{inv.description}</p>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>

                <button onClick={() => setForecast(null)} className="w-full py-4 text-xs font-bold text-gray-400 hover:text-black">
                   {t.newPred}
                </button>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default FinanceView;
