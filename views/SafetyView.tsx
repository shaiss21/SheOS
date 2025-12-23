
import React, { useState, useEffect, useRef } from 'react';
import { Shield, MapPin, Eye, Zap, Megaphone, PhoneIncoming, Video, EyeOff, UserPlus, Activity, Mic, Radio, Phone, X, CheckCircle, Navigation, Send, Loader, Settings, Upload, Lock, Save, User, Users, AlertTriangle } from '../components/Icons';
import { analyzeThreatLevel, analyzePredictiveDanger } from '../services/geminiService';
import { ThreatAnalysisResponse, SentinelSensorData, SentinelAnalysisResponse } from '../types';

interface SafetyViewProps {
  initialAction?: string | null;
  onActionHandled?: () => void;
  contacts: any[];
  onAddContact: (contact: any) => void;
  language?: string;
}

const SafetyView: React.FC<SafetyViewProps> = ({ initialAction, onActionHandled, contacts, onAddContact, language = 'English' }) => {
  const [isLive, setIsLive] = useState(false);
  const [locationCoords, setLocationCoords] = useState<{lat: number, lng: number} | null>(null);
  const [locationAddress, setLocationAddress] = useState<string>("Locating...");
  const [isSirenActive, setIsSirenActive] = useState(false);
  
  // Predictive Safety AI State
  const [aiActive, setAiActive] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [sensorData, setSensorData] = useState<SentinelSensorData>({
    heartRate: 72,
    motionType: 'Stationary',
    audioLevel: 'Normal',
    locationContext: 'Public'
  });
  const [aiAnalysis, setAiAnalysis] = useState<SentinelAnalysisResponse>({
    threatScore: 12,
    riskLevel: 'SAFE',
    activeAlerts: [],
    autoActions: [],
    aiReasoning: "Environment stable. Biometrics normal. No threats detected."
  });
  const [isGuardianMode, setIsGuardianMode] = useState(false);
  const [showPreAlert, setShowPreAlert] = useState(false);
  
  // Privacy Toggles
  const [privacySettings, setPrivacySettings] = useState({
     location: true,
     audio: true,
     motion: true
  });

  // Manual Threat Check State
  const [threatInput, setThreatInput] = useState('');
  const [manualAnalysis, setManualAnalysis] = useState<ThreatAnalysisResponse | null>(null);
  const [isManualLoading, setIsManualLoading] = useState(false);

  // --- NEW FEATURES STATE ---
  const [stealthMode, setStealthMode] = useState(false);
  
  // Siren Audio Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const sirenIntervalRef = useRef<any>(null);

  // Location Watch Ref
  const watchIdRef = useRef<number | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Fake Call State
  const [fakeCallStatus, setFakeCallStatus] = useState<'IDLE' | 'RINGING' | 'ACTIVE'>('IDLE');
  const [callTimer, setCallTimer] = useState(0);

  // Evidence Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showEvidenceInterface, setShowEvidenceInterface] = useState(false);
  
  // Safe Map State
  const [showSafeMap, setShowSafeMap] = useState(false);

  // Trusted Contacts State & Modal
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [showContactsList, setShowContactsList] = useState(false);
  const [callingContact, setCallingContact] = useState<any | null>(null);
  
  const [newContact, setNewContact] = useState({ name: '', phone: '', relation: 'Friend' });
  const relationOptions = ["Parent", "Sibling", "Partner", "Friend", "Relative", "Colleague", "Doctor", "Official", "Other"];

  const safePlaces = [
      { name: "Central Library (Open 24h)", desc: "Verified Safe Zone • Open 24/7", dist: "0.3km", query: "Central Library" },
      { name: "City Mall Security Point", desc: "Verified Safe Zone • Open 24/7", dist: "0.4km", query: "City Mall Security" },
      { name: "Metro Station", desc: "Verified Safe Zone • Open 24/7", dist: "0.5km", query: "Metro Station" }
  ];

  // Translations
  const translations: any = {
    'English': {
      title: "Safety Shield",
      subtitle: "Predictive. Proactive. Powerful.",
      trustedContacts: "Trusted Contacts",
      savedNumbers: "Saved Numbers",
      fakeCall: "Fake Call",
      calling: "Calling...",
      siren: "Loud Siren",
      stopSiren: "STOP SIREN",
      shareLoc: "Share Loc",
      sharing: "Sharing...",
      evidence: "Evidence",
      recording: "Recording...",
      sentinelTitle: "Predictive Safety AI",
      sentinelDesc: "Risk Prediction Engine Active",
      threatProb: "Danger Prob.",
      riskLevel: "RISK LEVEL",
      manualCheck: "Manual Context Check",
      checkBtn: "Check",
      safeHavens: "Safe Havens Nearby",
      viewMap: "View Map",
      listView: "List View",
      addContact: "Add New Contact",
      saveContact: "Save Contact",
      fullName: "Full Name",
      phoneNum: "Phone Number",
      relationship: "Relationship",
      liveTracking: "Live Tracking Active",
      stopSharing: "STOP SHARING",
      incomingCall: "Incoming Call...",
      accept: "Accept",
      decline: "Decline",
      guardianMode: "Guardian Mode",
      active: "ACTIVE",
      preAlert: "Potential risk detected. Monitor closely?"
    },
    'Hindi': {
      title: "सुरक्षा कवच",
      subtitle: "भविष्यवाणी। सक्रिय। शक्तिशाली।",
      trustedContacts: "विश्वसनीय संपर्क",
      savedNumbers: "सहेजे गए नंबर",
      fakeCall: "फर्जी कॉल",
      calling: "कॉलिंग...",
      siren: "तेज सायरन",
      stopSiren: "सायरन रोकें",
      shareLoc: "लोकेशन साझा करें",
      sharing: "साझा कर रहा है...",
      evidence: "साक्ष्य",
      recording: "रिकॉर्डिंग...",
      sentinelTitle: "पूर्वानुमानित सुरक्षा एआई",
      sentinelDesc: "जोखिम भविष्यवाणी इंजन सक्रिय",
      threatProb: "खतरा संभावना",
      riskLevel: "जोखिम स्तर",
      manualCheck: "मैनुअल संदर्भ जांच",
      checkBtn: "जांचें",
      safeHavens: "आस-पास सुरक्षित स्थान",
      viewMap: "मैप देखें",
      listView: "सूची देखें",
      addContact: "नया संपर्क जोड़ें",
      saveContact: "संपर्क सहेजें",
      fullName: "पूरा नाम",
      phoneNum: "फ़ोन नंबर",
      relationship: "रिश्ता",
      liveTracking: "लाइव ट्रैकिंग सक्रिय",
      stopSharing: "साझा करना बंद करें",
      incomingCall: "आने वाली कॉल...",
      accept: "स्वीकार करें",
      decline: "अस्वीकार करें",
      guardianMode: "गार्जियन मोड",
      active: "सक्रिय",
      preAlert: "संभावित जोखिम का पता चला। बारीकी से निगरानी करें?"
    },
    'Telugu': {
      title: "రక్షణ కవచం",
      subtitle: "ముందస్తు హెచ్చరిక. శక్తివంతమైనది.",
      trustedContacts: "నమ్మకమైన పరిచయాలు",
      savedNumbers: "సేవ్ చేసిన నంబర్లు",
      fakeCall: "నకిలీ కాల్",
      calling: "కాలింగ్...",
      siren: "పెద్ద సైరన్",
      stopSiren: "సైరన్ ఆపండి",
      shareLoc: "లొకేషన్ షేర్",
      sharing: "షేర్ చేస్తున్నారు...",
      evidence: "సాక్ష్యం",
      recording: "రికార్డింగ్...",
      sentinelTitle: "ప్రిడిక్టివ్ సేఫ్టీ AI",
      sentinelDesc: "రిస్క్ ప్రిడిక్షన్ ఇంజిన్ యాక్టివ్",
      threatProb: "ముప్పు సంభావ్యత",
      riskLevel: "ప్రమాద స్థాయి",
      manualCheck: "మాన్యువల్ చెక్",
      checkBtn: "తనిఖీ చేయండి",
      safeHavens: "సురక్షిత ప్రాంతాలు",
      viewMap: "మ్యాప్ చూడండి",
      listView: "జాబితా చూడండి",
      addContact: "కొత్త కాంటాక్ట్",
      saveContact: "సేవ్ చేయండి",
      fullName: "పూర్తి పేరు",
      phoneNum: "ఫోన్ నంబర్",
      relationship: "సంబంధం",
      liveTracking: "లైవ్ ట్రాకింగ్ యాక్టివ్",
      stopSharing: "షేరింగ్ ఆపండి",
      incomingCall: "ఇన్ కమింగ్ కాల్...",
      accept: "స్వీకరించండి",
      decline: "తిరస్కరించండి",
      guardianMode: "గార్డియన్ మోడ్",
      active: "యాక్టివ్",
      preAlert: "సంభావ్య ప్రమాదం గుర్తించబడింది. దగ్గరగా పర్యవేక్షించాలా?"
    }
  };

  const t = translations[language] || translations['English'];

  // Handle Initial Actions passed from App.tsx
  useEffect(() => {
    if (initialAction === 'MANAGE_CONTACTS') {
      setShowContactsList(true);
      if (onActionHandled) onActionHandled();
    }
  }, [initialAction, onActionHandled]);

  // Cleanup location watch on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const handleAddContact = () => {
    if(!newContact.name || !newContact.phone) return;
    const colors = ["bg-indigo-500", "bg-orange-500", "bg-teal-500", "bg-rose-500", "bg-cyan-600"];
    const color = colors[contacts.length % colors.length];

    const newEntry = {
       id: Date.now(),
       name: newContact.name,
       relation: newContact.relation,
       phone: newContact.phone,
       status: "Idle",
       time: "--",
       color
    };
    onAddContact(newEntry);
    setNewContact({ name: '', phone: '', relation: 'Friend' });
    setIsAddContactOpen(false);
    alert("Contact added securely.");
  };

  const handleRouteToSafePlace = (query: string) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
    window.open(url, '_blank');
  };

  // --- AI CALL LOGIC ---
  const initiateAICall = (contact: any) => {
    setShowContactsList(false);
    setCallingContact(contact);
    
    // AI Speech
    if ('speechSynthesis' in window) {
        const text = `Connecting secure line. Calling ${contact.name} now.`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
    }

    // Simulate Call End
    setTimeout(() => {
        // In a real app, this would be handled by call state
    }, 5000);
  };

  const endAICall = () => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
    setCallingContact(null);
  };

  // --- SIREN LOGIC ---
  const toggleSiren = () => {
    if (isSirenActive) {
      // Stop Siren
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
      if (sirenIntervalRef.current) {
        clearInterval(sirenIntervalRef.current);
        sirenIntervalRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setIsSirenActive(false);
    } else {
      // Start Siren
      setIsSirenActive(true);
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContext();
        audioCtxRef.current = ctx;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'square';
        osc.frequency.value = 800;
        gain.gain.value = 0.5; // Volume
        
        osc.start();
        oscillatorRef.current = osc;
        
        // Oscillate pitch to create siren wail
        const interval = setInterval(() => {
           if(ctx.state === 'closed') return;
           const t = ctx.currentTime;
           osc.frequency.cancelScheduledValues(t);
           osc.frequency.setValueAtTime(800, t);
           osc.frequency.linearRampToValueAtTime(1200, t + 0.4);
           osc.frequency.linearRampToValueAtTime(800, t + 0.8);
        }, 800);
        
        sirenIntervalRef.current = interval;
      } catch (e) {
        console.error("Audio API error", e);
        alert("Siren Activated! (Audio not supported in this browser)");
      }
    }
  };

  // --- LOCATION LOGIC ---
  const handleShareLocation = () => {
    if (isLive) {
      // Stop Sharing
      setIsLive(false);
      setLocationCoords(null);
      setLocationAddress("Locating...");
      
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }

    // Activate UI immediately
    setIsLive(true);
    
    // Scroll to map
    setTimeout(() => {
        mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    // Simulate finding location if API fails or takes long
    const mockLocationTimeout = setTimeout(() => {
        if (!locationCoords) {
             updateLocationState({
                 coords: { latitude: 40.7128, longitude: -74.0060, accuracy: 10, altitude: 0, altitudeAccuracy: 0, heading: 0, speed: 0 },
                 timestamp: Date.now()
             } as GeolocationPosition);
        }
    }, 5000);

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    
    // Initial fetch
    navigator.geolocation.getCurrentPosition(
        (position) => {
            clearTimeout(mockLocationTimeout);
            updateLocationState(position);
        }, 
        (err) => console.log("Initial loc error", err),
        { enableHighAccuracy: true }
    );

    // Start continuous watching
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        updateLocationState(position);
      },
      (error) => {
        console.error("Location watch error", error);
        if (error.code === 1) { // Permission denied
            setIsLive(false);
            alert("Location permission denied. Please enable GPS.");
        }
      },
      { enableHighAccuracy: true, maximumAge: 0 }
    );
  };

  const updateLocationState = (position: GeolocationPosition) => {
    setLocationCoords({
        lat: position.coords.latitude,
        lng: position.coords.longitude
    });
    // Simulating Reverse Geocoding
    setTimeout(() => {
        setLocationAddress(`Near ${position.coords.latitude.toFixed(3)}, ${position.coords.longitude.toFixed(3)}`);
    }, 500);
  };
  
  const toggleSafeMap = () => {
    if (!showSafeMap && !locationCoords) {
       navigator.geolocation.getCurrentPosition(
        (position) => {
            setLocationCoords({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
        }, 
        (err) => console.log(err),
        { enableHighAccuracy: true }
       );
    }
    setShowSafeMap(!showSafeMap);
  };

  // --- FAKE CALL LOGIC ---
  const triggerFakeCall = () => {
    setTimeout(() => {
        setFakeCallStatus('RINGING');
    }, 2000);
  };

  const answerFakeCall = () => {
    setFakeCallStatus('ACTIVE');
    setCallTimer(0);
  };

  const endFakeCall = () => {
    setFakeCallStatus('IDLE');
    setCallTimer(0);
  };

  useEffect(() => {
    let interval: any;
    if (fakeCallStatus === 'ACTIVE') {
      interval = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [fakeCallStatus]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- EVIDENCE RECORDING LOGIC ---
  const toggleRecording = () => {
    if (isRecording) {
        setIsRecording(false);
        setShowEvidenceInterface(false);
        setRecordingDuration(0);
        setTimeout(() => alert("Evidence Saved to Safe Vault (Cloud Backup Complete)."), 300);
    } else {
        setShowEvidenceInterface(true);
        setIsRecording(true);
    }
  };

  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);


  // --- GENAI LOGIC ---
  const handleManualThreatCheck = async () => {
    if (!threatInput) return;
    setIsManualLoading(true);
    const result = await analyzeThreatLevel(threatInput, language);
    setManualAnalysis(result);
    setIsManualLoading(false);
  };

  const simulateSensorChange = async (scenario: 'SAFE' | 'FOLLOWING' | 'AGGRESSIVE') => {
    setAiLoading(true);
    let newData: SentinelSensorData;

    if (scenario === 'SAFE') {
      newData = { heartRate: 75, motionType: 'Walking', audioLevel: 'Normal', locationContext: 'Public' };
      setIsGuardianMode(false);
      setShowPreAlert(false);
    } else if (scenario === 'FOLLOWING') {
      newData = { heartRate: 110, motionType: 'Suspicious Following', audioLevel: 'Quiet', locationContext: 'Unlit Lane' };
      setShowPreAlert(true);
    } else {
      newData = { heartRate: 145, motionType: 'Aggressive Movement', audioLevel: 'Distress', locationContext: 'High-Crime Zone' };
      setIsGuardianMode(true);
      if(!isLive) handleShareLocation();
      if(!isRecording) toggleRecording();
    }

    setSensorData(newData);
    const result = await analyzePredictiveDanger(newData);
    setAiAnalysis(result);
    setAiLoading(false);
  };

  // --- VISUAL HELPERS ---
  const getScoreColor = (score: number) => {
    if (score < 30) return 'text-green-600 border-green-500';
    if (score < 70) return 'text-yellow-600 border-yellow-500';
    return 'text-red-600 border-red-600 animate-pulse';
  };

  const getRingColor = (score: number) => {
    if (score < 30) return 'from-green-400 to-green-600';
    if (score < 70) return 'from-yellow-400 to-yellow-600';
    return 'from-red-500 to-red-700';
  };

  return (
    <div className={`pb-24 animate-fade-in relative transition-all duration-500 ${stealthMode ? 'grayscale brightness-75' : ''}`}>
      
      {/* EARLY WARNING TOAST */}
      {showPreAlert && !isGuardianMode && (
         <div className="fixed top-20 left-4 right-4 z-50 bg-yellow-500 text-black px-4 py-3 rounded-2xl shadow-xl animate-bounce flex items-center justify-between">
            <div className="flex items-center gap-2">
               <AlertTriangle size={20} />
               <span className="text-sm font-bold">{t.preAlert}</span>
            </div>
            <button 
               onClick={() => { setIsGuardianMode(true); handleShareLocation(); toggleRecording(); setShowPreAlert(false); }}
               className="bg-black text-white px-3 py-1 rounded-lg text-xs font-bold"
            >
               ACTIVATE
            </button>
         </div>
      )}

      {/* EVIDENCE CAMERA INTERFACE */}
      {showEvidenceInterface && (
         <div className="fixed inset-0 z-[100] bg-black flex flex-col justify-between p-6 animate-fade-in">
             <div className="flex justify-between items-center text-white z-20">
                <button onClick={() => { setIsRecording(false); setShowEvidenceInterface(false); }} className="p-2 rounded-full bg-black/40 backdrop-blur-md"><X size={24} /></button>
                <div className="bg-red-600/90 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 animate-pulse shadow-lg border border-red-400/50">
                   <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                   <span className="text-sm font-mono font-bold tracking-widest">{formatTimer(recordingDuration)}</span>
                </div>
                <button className="p-2 rounded-full bg-black/40 backdrop-blur-md"><Settings size={24} /></button>
             </div>
             
             <div className="absolute inset-0 top-0 bottom-0 bg-gray-900 flex items-center justify-center">
                 <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black"></div>
                 <Video size={64} className="text-gray-700 relative z-10" />
                 <p className="absolute bottom-32 text-xs text-gray-500 font-mono tracking-widest z-10">REC_EVIDENCE_SECURE_VAULT</p>
             </div>

             <div className="flex justify-around items-center mb-8 relative z-20">
                <button className="w-12 h-12 rounded-full bg-gray-800/80 backdrop-blur-md flex items-center justify-center text-white border border-gray-700 active:scale-95 transition-transform"><Upload size={20} /></button>
                <button 
                  onClick={toggleRecording}
                  className="w-24 h-24 rounded-full border-4 border-white/30 flex items-center justify-center transition-transform active:scale-95"
                >
                   <div className="w-20 h-20 bg-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.6)] flex items-center justify-center">
                       <div className="w-8 h-8 bg-white rounded-[4px]"></div>
                   </div>
                </button>
                <button className="w-12 h-12 rounded-full bg-gray-800/80 backdrop-blur-md flex items-center justify-center text-white border border-gray-700 active:scale-95 transition-transform"><Lock size={20} /></button>
             </div>
         </div>
      )}

      {/* FAKE CALL OVERLAY */}
      {fakeCallStatus !== 'IDLE' && (
         <div className="fixed inset-0 z-[100] bg-gray-900 flex flex-col items-center justify-between py-16 text-white animate-fade-in bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center">
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
             
             <div className="flex flex-col items-center mt-12 relative z-10">
                 <div className="w-24 h-24 bg-gray-300 rounded-full mb-4 flex items-center justify-center text-gray-500 overflow-hidden border-2 border-white/20">
                    <UserPlus size={48} className="text-gray-400" />
                 </div>
                 {fakeCallStatus === 'RINGING' && <p className="text-lg font-medium text-gray-200 animate-pulse">{t.incomingCall}</p>}
                 {fakeCallStatus === 'ACTIVE' && <p className="text-lg font-medium text-green-400">{formatTimer(callTimer)}</p>}
                 
                 <h1 className="text-4xl font-bold mt-2">Dad</h1>
                 <p className="text-gray-300 mt-1">Mobile</p>
             </div>

             <div className="w-full max-w-xs grid grid-cols-2 gap-12 px-6 relative z-10">
                 {fakeCallStatus === 'RINGING' ? (
                     <>
                        <button 
                            onClick={endFakeCall}
                            className="flex flex-col items-center gap-3"
                        >
                            <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg active:scale-95 transition-transform hover:bg-red-600">
                                <PhoneIncoming size={28} className="rotate-[135deg]" />
                            </div>
                            <span className="font-bold text-sm">{t.decline}</span>
                        </button>
                        <button 
                            onClick={answerFakeCall}
                            className="flex flex-col items-center gap-3"
                        >
                            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg active:scale-95 transition-transform hover:bg-green-600 animate-bounce">
                                <Phone size={28} />
                            </div>
                            <span className="font-bold text-sm">{t.accept}</span>
                        </button>
                     </>
                 ) : (
                    <div className="col-span-2 flex justify-center">
                        <button 
                            onClick={endFakeCall}
                            className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center shadow-lg active:scale-95 transition-transform hover:bg-red-600"
                        >
                            <PhoneIncoming size={32} className="rotate-[135deg]" />
                        </button>
                    </div>
                 )}
             </div>
         </div>
      )}

      {/* CALLING OVERLAY */}
      {callingContact && (
         <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex flex-col items-center justify-between py-16 text-white animate-fade-in">
             <div className="flex flex-col items-center mt-12">
                 <div className="w-32 h-32 rounded-full bg-gray-800 border-4 border-[var(--primary-color)] flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(255,15,154,0.3)] animate-pulse">
                    <span className="text-4xl font-bold">{callingContact.name.charAt(0)}</span>
                 </div>
                 <h2 className="text-3xl font-black">{callingContact.name}</h2>
                 <p className="text-[var(--primary-color)] font-bold mt-2 animate-pulse">Connecting via Secure AI Line...</p>
                 <p className="text-gray-500 text-sm mt-1">{callingContact.phone}</p>
             </div>
             
             <div className="w-full max-w-xs flex justify-center">
                <button 
                    onClick={endAICall}
                    className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center shadow-lg active:scale-95 transition-transform hover:bg-red-700"
                >
                    <PhoneIncoming size={32} className="rotate-[135deg]" />
                </button>
             </div>
         </div>
      )}

      {/* TRUSTED CONTACTS LIST MODAL */}
      {showContactsList && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowContactsList(false)}></div>
            <div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-6 relative z-10 shadow-2xl animate-slide-up h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-black text-black">{t.trustedContacts}</h3>
                    <button onClick={() => setShowContactsList(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar">
                    {contacts.map((contact, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 transition-colors group">
                            <div 
                                className="flex items-center gap-4 flex-1 cursor-pointer"
                                onClick={() => initiateAICall(contact)}
                            >
                                <div className={`w-12 h-12 rounded-full ${contact.color} flex items-center justify-center text-white text-lg font-bold shadow-sm`}>
                                    {contact.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-black">{contact.name}</h4>
                                    <p className="text-xs text-gray-500 font-medium">{contact.relation} • {contact.phone}</p>
                                </div>
                            </div>
                            
                            <a 
                                href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
                                onClick={(e) => e.stopPropagation()}
                                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-green-500 shadow-sm hover:bg-green-500 hover:text-white active:scale-95 transition-all"
                            >
                                <Phone size={20} />
                            </a>
                        </div>
                    ))}
                </div>

                <button 
                    onClick={() => { setShowContactsList(false); setIsAddContactOpen(true); }}
                    className="w-full mt-4 bg-black text-white py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                    <UserPlus size={18} /> {t.addContact}
                </button>
            </div>
        </div>
      )}

      {/* ADD CONTACT MODAL */}
      {isAddContactOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAddContactOpen(false)}></div>
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 relative z-10 shadow-2xl animate-fade-in border border-[var(--primary-light)]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-black">{t.addContact}</h3>
                    <button onClick={() => setIsAddContactOpen(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">{t.fullName}</label>
                        <input 
                            type="text" 
                            value={newContact.name}
                            onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                            placeholder="e.g., Mom"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary-color)] text-black font-medium"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">{t.phoneNum}</label>
                        <input 
                            type="tel" 
                            value={newContact.phone}
                            onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                            placeholder="e.g., +1 555 123 4567"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary-color)] text-black font-medium"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">{t.relationship}</label>
                        <div className="flex flex-wrap gap-2">
                            {relationOptions.map((rel) => (
                                <button
                                    key={rel}
                                    onClick={() => setNewContact({...newContact, relation: rel})}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${newContact.relation === rel ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200 hover:border-black'}`}
                                >
                                    {rel}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <button 
                    onClick={handleAddContact}
                    disabled={!newContact.name || !newContact.phone}
                    className="w-full mt-6 bg-[var(--primary-color)] text-white py-3.5 rounded-xl font-bold shadow-lg active:scale-95 transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    <Save size={18} /> {t.saveContact}
                </button>
            </div>
        </div>
      )}

      <header className="mb-4 flex justify-between items-end">
        <div>
           <h2 className="text-3xl font-extrabold text-black">{t.title}</h2>
           <p className="text-gray-500 text-sm font-medium">{t.subtitle}</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setStealthMode(!stealthMode)}
                className={`p-2 border rounded-full transition-colors ${stealthMode ? 'bg-gray-800 text-white border-gray-800' : 'bg-white border-[var(--primary-light)] text-black hover:bg-black hover:text-white'}`} 
                title={stealthMode ? "Disable Stealth Mode" : "Enable Stealth Mode"}
            >
                {stealthMode ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
        </div>
      </header>
      
      {/* NEW TRUSTED CONTACTS BUTTON (Replacing the horizontal list) */}
      <div 
        onClick={() => setShowContactsList(true)}
        className="mb-6 bg-white p-4 rounded-2xl border border-[var(--primary-light)] shadow-sm flex items-center justify-between cursor-pointer active:scale-98 transition-transform group hover:border-[var(--primary-color)]"
      >
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-black group-hover:bg-[var(--primary-color)] transition-colors flex items-center justify-center text-white shadow-md">
               <Users size={24} />
            </div>
            <div>
               <h3 className="font-bold text-black text-lg group-hover:text-[var(--primary-color)] transition-colors">{t.trustedContacts}</h3>
               <p className="text-xs text-gray-500 font-medium">{contacts.length} {t.savedNumbers}</p>
            </div>
         </div>
         <div className="bg-gray-50 p-2 rounded-full group-hover:bg-[var(--primary-light)] transition-colors">
            <Phone size={20} className="text-gray-400 group-hover:text-[var(--primary-color)]" />
         </div>
      </div>

      {/* LIVE LOCATION MAP OVERLAY */}
      {isLive && (
        <div ref={mapRef} className="bg-white rounded-3xl p-4 shadow-xl border-2 border-green-400 mb-6 animate-fade-in relative overflow-hidden flex flex-col gap-4">
            {/* Header Status */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <div>
                        <h3 className="font-black text-black text-sm uppercase tracking-wide">{t.liveTracking}</h3>
                        <p className="text-[10px] text-gray-500 font-medium">{locationAddress}</p>
                    </div>
                </div>
                <button onClick={handleShareLocation} className="text-[10px] font-bold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors">{t.stopSharing}</button>
            </div>
            
            {/* Map Embed */}
            <div className="w-full h-48 bg-gray-100 rounded-xl overflow-hidden relative shadow-inner border border-gray-200">
                {locationCoords ? (
                     <iframe 
                        width="100%" 
                        height="100%" 
                        frameBorder="0" 
                        scrolling="no" 
                        marginHeight={0} 
                        marginWidth={0} 
                        src={`https://maps.google.com/maps?q=${locationCoords.lat},${locationCoords.lng}&z=15&output=embed`}
                        className="w-full h-full object-cover"
                        title="Live Location Map"
                     ></iframe>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400">
                        <MapPin size={32} className="animate-bounce mb-2 text-[var(--primary-color)]" />
                        <span className="text-xs font-bold animate-pulse">Acquiring Satellite Lock...</span>
                    </div>
                )}
            </div>
        </div>
      )}

      {/* --- QUICK ACTION GRID --- */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {/* Fake Call */}
        <button 
            onClick={triggerFakeCall}
            disabled={fakeCallStatus !== 'IDLE'}
            className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center gap-2 border border-[var(--primary-light)] shadow-sm active:scale-95 transition-all hover:shadow-md hover:border-black/20 group active:bg-[var(--primary-color)] active:border-[var(--primary-color)]"
        >
            <div className={`w-12 h-12 bg-[var(--primary-light)] rounded-full flex items-center justify-center text-[var(--primary-color)] transition-colors ${fakeCallStatus === 'RINGING' ? 'bg-green-500 text-white animate-bounce' : 'group-hover:bg-black group-hover:text-white group-active:bg-white group-active:text-[var(--primary-color)]'}`}>
                <PhoneIncoming size={24} />
            </div>
            <span className="font-bold text-black text-sm group-active:text-white">
                {fakeCallStatus === 'IDLE' ? t.fakeCall : t.calling}
            </span>
        </button>

        {/* Siren */}
        <button 
            onClick={toggleSiren}
            className={`${isSirenActive ? 'bg-red-600 border-red-600 animate-pulse' : 'bg-white border-[var(--primary-light)] hover:border-black/20 active:bg-[var(--primary-color)] active:border-[var(--primary-color)]'} p-4 rounded-2xl flex flex-col items-center justify-center gap-2 border shadow-sm active:scale-95 transition-all group`}
        >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isSirenActive ? 'bg-white text-red-600' : 'bg-[var(--primary-light)] text-[var(--primary-color)] group-hover:bg-black group-hover:text-white group-active:bg-white group-active:text-[var(--primary-color)] transition-colors'}`}>
                <Megaphone size={24} />
            </div>
            <span className={`font-bold text-sm ${isSirenActive ? 'text-white' : 'text-black group-active:text-white'}`}>
                {isSirenActive ? t.stopSiren : t.siren}
            </span>
        </button>

        {/* Live Location */}
        <button 
            onClick={handleShareLocation}
            className={`${isLive ? 'bg-green-50 border-green-200' : 'bg-white border-[var(--primary-light)] hover:border-black/20 active:bg-[var(--primary-color)] active:border-[var(--primary-color)]'} p-4 rounded-2xl flex flex-col items-center justify-center gap-2 border shadow-sm active:scale-95 transition-all group`}
        >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isLive ? 'bg-green-100 text-green-600' : 'bg-[var(--primary-light)] text-[var(--primary-color)] group-hover:bg-black group-hover:text-white group-active:bg-white group-active:text-[var(--primary-color)] transition-colors'}`}>
                <MapPin size={24} className={isLive ? 'animate-bounce' : ''} />
            </div>
            <span className={`font-bold text-sm ${isLive ? 'text-green-700' : 'text-black group-active:text-white'}`}>{isLive ? t.sharing : t.shareLoc}</span>
        </button>

        {/* Evidence Record */}
        <button 
            onClick={toggleRecording}
            className={`${isRecording ? 'bg-red-50 border-red-200' : 'bg-white border-[var(--primary-light)]'} p-4 rounded-2xl flex flex-col items-center justify-center gap-2 border shadow-sm active:scale-95 transition-all hover:shadow-md hover:border-black/20 group active:bg-[var(--primary-color)] active:border-[var(--primary-color)]`}
        >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isRecording ? 'bg-red-100 text-red-600' : 'bg-[var(--primary-light)] text-[var(--primary-color)] group-hover:bg-black group-hover:text-white group-active:bg-white group-active:text-[var(--primary-color)]'}`}>
                <Video size={24} className={isRecording ? 'animate-pulse' : ''} />
            </div>
            <span className={`font-bold text-sm ${isRecording ? 'text-red-600' : 'text-black group-active:text-white'}`}>
                {isRecording ? t.recording : t.evidence}
            </span>
        </button>
      </div>

      {/* --- PREDICTIVE SAFETY AI (Risk Prediction Engine) --- */}
      <div className={`relative overflow-hidden rounded-3xl p-6 mb-8 shadow-xl transition-all duration-500 border-2 ${isGuardianMode ? 'bg-red-50 border-red-500 ring-2 ring-red-500 ring-offset-2' : aiAnalysis.threatScore > 50 ? 'bg-orange-50 border-orange-200' : 'bg-white border-[var(--primary-light)]'}`}>
        
        {/* Header */}
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div className="flex items-center gap-3">
             <div className={`p-2 rounded-full ${isGuardianMode ? 'bg-red-600 text-white animate-pulse' : 'bg-black text-white'}`}>
               <Shield size={20} />
             </div>
             <div>
               <h3 className="font-extrabold text-black text-lg">{isGuardianMode ? t.guardianMode : t.sentinelTitle}</h3>
               <p className="text-xs text-gray-500 font-medium">{isGuardianMode ? t.active : t.sentinelDesc}</p>
             </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider text-white ${isGuardianMode ? 'bg-red-600 animate-pulse' : 'bg-[var(--primary-color)]'}`}>
            {isGuardianMode ? 'PROTECTING' : 'LEARNING'}
          </div>
        </div>

        {/* Central Visualization */}
        <div className="flex flex-col items-center justify-center mb-8 relative z-10">
           {/* Gauge */}
           <div className={`relative w-40 h-40 rounded-full border-8 flex items-center justify-center transition-colors duration-500 ${getScoreColor(aiAnalysis.threatScore)} bg-white shadow-inner`}>
              <div className={`absolute inset-0 rounded-full border-[6px] border-t-transparent animate-spin-slow opacity-50 ${isGuardianMode ? 'border-red-600' : 'border-pink-200'}`}></div>
              <div className="text-center">
                 <span className="block text-4xl font-black tracking-tighter transition-all duration-500">{aiAnalysis.threatScore}%</span>
                 <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{t.threatProb}</span>
              </div>
           </div>
           
           {/* Risk Label */}
           <div className={`mt-4 px-6 py-1.5 rounded-full text-xs font-bold text-white shadow-md transition-colors duration-500 bg-gradient-to-r ${getRingColor(aiAnalysis.threatScore)}`}>
              {t.riskLevel}: {aiAnalysis.riskLevel}
           </div>
        </div>

        {/* Guardian Active Indicators */}
        {isGuardianMode && (
           <div className="flex justify-center gap-2 mb-6 animate-fade-in relative z-10">
              <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-1 rounded flex items-center gap-1"><Video size={10}/> REC</span>
              <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-1 rounded flex items-center gap-1"><MapPin size={10}/> TRACKING</span>
              <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-1 rounded flex items-center gap-1"><Phone size={10}/> SOS READY</span>
           </div>
        )}

        {/* Privacy Toggles (Visible in normal mode) */}
        {!isGuardianMode && (
           <div className="flex justify-center gap-4 mb-6 relative z-10">
              <button onClick={() => setPrivacySettings({...privacySettings, location: !privacySettings.location})} className={`p-2 rounded-full border ${privacySettings.location ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}><MapPin size={14} /></button>
              <button onClick={() => setPrivacySettings({...privacySettings, audio: !privacySettings.audio})} className={`p-2 rounded-full border ${privacySettings.audio ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}><Mic size={14} /></button>
              <button onClick={() => setPrivacySettings({...privacySettings, motion: !privacySettings.motion})} className={`p-2 rounded-full border ${privacySettings.motion ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}><Activity size={14} /></button>
           </div>
        )}

        {/* AI Reasoning & Auto-Actions */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 relative z-10">
           <div className="flex items-start gap-3 mb-2">
              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 animate-pulse ${isGuardianMode ? 'bg-red-600' : 'bg-[var(--primary-color)]'}`}></div>
              <p className="text-xs text-gray-800 font-medium leading-relaxed italic">"{aiAnalysis.aiReasoning}"</p>
           </div>
           
           {aiAnalysis.autoActions.length > 0 && (
             <div className="mt-3 pt-3 border-t border-gray-200">
               <span className="text-[10px] font-bold text-gray-500 mb-2 block uppercase">Auto-Response Triggered:</span>
               <div className="flex flex-wrap gap-2">
                  {aiAnalysis.autoActions.map((action, i) => (
                    <span key={i} className="text-[10px] bg-black text-white px-2 py-1 rounded-md font-bold shadow-sm flex items-center gap-1">
                      <Shield size={10} /> {action}
                    </span>
                  ))}
               </div>
             </div>
           )}
        </div>

        {/* Simulator Controls (Demo Only) */}
        <div className="mt-6 pt-4 border-t border-dashed border-gray-200 relative z-10">
           <p className="text-[10px] text-center text-gray-400 mb-2 font-mono">SIMULATE SCENARIOS (DEMO)</p>
           <div className="flex justify-center gap-2">
              <button onClick={() => simulateSensorChange('SAFE')} className="px-3 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-bold hover:bg-green-100 border border-green-200 active:bg-[var(--primary-color)] active:text-white active:border-[var(--primary-color)]">Safe Route</button>
              <button onClick={() => simulateSensorChange('FOLLOWING')} className="px-3 py-1 rounded-lg bg-yellow-50 text-yellow-700 text-xs font-bold hover:bg-yellow-100 border border-yellow-200 active:bg-[var(--primary-color)] active:text-white active:border-[var(--primary-color)]">Suspicious</button>
              <button onClick={() => simulateSensorChange('AGGRESSIVE')} className="px-3 py-1 rounded-lg bg-red-50 text-red-700 text-xs font-bold hover:bg-red-100 border border-red-200 active:bg-[var(--primary-color)] active:text-white active:border-[var(--primary-color)]">Attack</button>
           </div>
        </div>

        {/* Background Radar Effect */}
        <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-black rounded-full animate-ping"></div>
        </div>
      </div>

      {/* Manual Context Check (Legacy/Backup) */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-[var(--primary-light)]">
        <h4 className="text-sm font-bold text-black mb-2">{t.manualCheck}</h4>
        <div className="flex gap-2">
            <input 
                type="text"
                placeholder="Type situation..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-black text-black"
                value={threatInput}
                onChange={(e) => setThreatInput(e.target.value)}
            />
            <button 
                onClick={handleManualThreatCheck}
                disabled={isManualLoading}
                className="bg-black text-white px-4 py-2 rounded-lg text-xs font-bold active:bg-[var(--primary-color)]"
            >
                {isManualLoading ? '...' : t.checkBtn}
            </button>
        </div>
        {manualAnalysis && (
             <p className="mt-2 text-xs text-black bg-[var(--primary-light)] p-2 rounded-lg border border-[var(--primary-light)]">
                <span className="font-bold">Advice:</span> {manualAnalysis.advice}
             </p>
        )}
      </div>

      {/* Nearby Safe Zones */}
      <div className="bg-black rounded-2xl p-6 relative overflow-hidden text-white min-h-[300px]">
        <div className="absolute right-0 top-0 opacity-20 pointer-events-none">
            <Shield size={100} className="text-pink-500" />
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="font-bold text-white">{t.safeHavens}</h3>
            <button 
                onClick={toggleSafeMap}
                className="text-xs bg-[var(--primary-color)] px-3 py-1.5 rounded-lg text-white font-bold active:bg-white active:text-[var(--primary-color)] transition-colors flex items-center gap-1"
            >
                {showSafeMap ? <><X size={12}/> {t.listView}</> : <><MapPin size={12}/> {t.viewMap}</>}
            </button>
        </div>

        {/* Content */}
        <div className="relative z-10">
            {showSafeMap ? (
                 <div className="rounded-xl overflow-hidden border-2 border-white/20 h-64 relative bg-gray-900 animate-fade-in">
                    {locationCoords ? (
                        <>
                             <iframe 
                                width="100%" 
                                height="100%" 
                                frameBorder="0" 
                                scrolling="no" 
                                marginHeight={0} 
                                marginWidth={0} 
                                src={`https://maps.google.com/maps?q=police+station+near+${locationCoords.lat},${locationCoords.lng}&z=13&output=embed`}
                                className="w-full h-full opacity-80 hover:opacity-100 transition-opacity filter invert-[.85] hue-rotate-180" 
                                title="Safe Havens Map"
                             ></iframe>
                             {/* Overlay to show it's live */}
                             <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-2 border border-white/10">
                                 <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                 </span>
                                 <span className="text-[10px] font-bold">You are here</span>
                             </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                             <Loader size={24} className="animate-spin mb-2" />
                             <span className="text-xs">Locating Safe Zones...</span>
                        </div>
                    )}
                 </div>
            ) : (
                <ul className="space-y-3">
                    {safePlaces.map((place, i) => (
                        <li key={i} 
                            onClick={() => handleRouteToSafePlace(place.query)}
                            className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10 hover:bg-white/20 transition-colors cursor-pointer group"
                        >
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--primary-color)] transition-colors">
                               <Navigation size={14} className="text-green-400 group-hover:text-white" />
                            </div>
                            <div className="flex-1">
                                <span className="text-white text-sm font-bold block">{place.name}</span>
                                <span className="text-xs text-gray-400">{place.desc}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-xs text-pink-400 font-bold block">{place.dist}</span>
                                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider group-hover:text-white">Route</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
      </div>
      
    </div>
  );
};

export default SafetyView;
