
export enum AppModule {
  HOME = 'HOME',
  SAFETY = 'SAFETY',
  HEALTH = 'HEALTH',
  FINANCE = 'FINANCE',
  EDUCATION = 'EDUCATION',
  COMMUNITY = 'COMMUNITY'
}

export interface UserProfile {
  name: string;
  email?: string;
  phone?: string;
  gender?: string;
  address?: string;
  role?: string;
  city?: string;
  interests?: string[];
  avatar?: string;
  safetyScore: number;
  healthStatus: string;
}

export interface ThreatAnalysisResponse {
  dangerLevel: number;
  advice: string;
  isEmergency: boolean;
  contactsToNotify: boolean;
}

export interface HealthInsightResponse {
  prediction: string;
  recommendation: string;
  hormoneAlert?: string;
}

export interface FinanceInsightResponse {
  spendingStatus: string;
  financialAbuseRisk: number; // 0-100
  savingsTip: string;
}

// --- New Predictive AI Types ---
export interface SentinelSensorData {
  heartRate: number; // bpm
  motionType: 'Stationary' | 'Walking' | 'Running' | 'Impact/Fall' | 'Suspicious Following' | 'Aggressive Movement';
  audioLevel: 'Quiet' | 'Normal' | 'Loud' | 'Distress';
  locationContext: 'Home' | 'Public' | 'Unknown/Risk' | 'Unlit Lane' | 'High-Crime Zone';
}

export interface SentinelAnalysisResponse {
  threatScore: number; // 0-100
  riskLevel: 'SAFE' | 'CAUTION' | 'DANGER' | 'CRITICAL';
  activeAlerts: string[];
  autoActions: string[]; // e.g., "Silent Record", "Share Location"
  aiReasoning: string;
}

// --- AI Health Twin Types ---
export interface HealthTwinProfile {
  cyclePhase: string;
  sleepAvg: number;
  stressLevel: 'Low' | 'Moderate' | 'High';
  activityLevel: 'Sedentary' | 'Active' | 'Athletic';
  recentSymptoms: string[];
}

export interface HealthTwinAnalysis {
  bodySyncScore: number; // 0-100
  predictedRisks: {
    condition: string; // e.g. "PCOS Flare-up", "Iron Deficiency"
    probability: number; // 0-100
    timeline: string; // e.g. "In 2 weeks"
  }[];
  hormonalTrend: string; // e.g. "Cortisol rising, Estrogen dropping"
  actionPlan: {
    type: 'Nutrition' | 'Fitness' | 'Mind';
    action: string;
  }[];
}

// --- AI Life-Journey Education Planner Types ---
export interface EducationProfile {
  role: 'Student' | 'Professional' | 'Homemaker' | 'Mother' | 'Entrepreneur';
  goal: string;
  hoursPerDay: number;
  currentMood: 'Motivated' | 'Overwhelmed' | 'Curious' | 'Tired';
}

export interface EducationRoadmap {
  journeyTitle: string;
  careerMatch: string;
  emotionalTip: string;
  timeline: {
    phase: string;
    duration: string;
    focus: string;
    milestone: string;
  }[];
  weeklySchedule: {
    day: string;
    slots: string[]; // e.g., "6AM: Quiet Reading", "2PM: Nap time Study"
    energyPrediction: 'High' | 'Medium' | 'Low';
  }[];
}

// --- AI Financial Life Predictor Types ---
export interface FinanceProfile {
  monthlyIncome: number;
  savings: number;
  careerStage: 'Entry' | 'Mid-Level' | 'Senior' | 'Career Break' | 'Student';
  lifeStatus: 'Single' | 'Married' | 'Mother' | 'Single Mother';
  financialGoal: string;
  recentMood: 'Stressed' | 'Happy' | 'Anxious' | 'Neutral';
}

export interface FinanceForecast {
  stabilityScore: number; // 0-100
  stabilityStatus: 'Secure' | 'Stable' | 'At Risk' | 'Critical';
  predictedRisks: string[]; // e.g. "Impulse spending due to stress", "Lack of maternity fund"
  emotionalSpendingAnalysis: string;
  careerGrowthPrediction: string; // e.g. "+20% income in 2 years with Upskilling"
  investmentStrategy: {
    title: string;
    type: 'Gold' | 'SIP' | 'Govt Scheme' | 'Low Risk';
    description: string;
  }[];
  futureTimeline: {
    year: string;
    event: string;
    expenseProjection: string;
  }[];
  recommendedSkill: string; // Links to Education
}

// --- SafeConnect Community Types ---
export interface EmotionalMatch {
  id: string;
  name: string;
  role: string;
  matchReason: string;
  isVerified: boolean;
  avatarColor: string;
}

export interface SafetyBuddy {
  id: string;
  name: string;
  distance: string;
  rating: number; // 0-5
  isOnline: boolean;
  batteryLevel?: number;
}

export interface CommunityAlert {
  id: string;
  type: 'SAFE' | 'DANGER' | 'INFO';
  message: string;
  location: string;
  time: string;
  verifiedCount: number;
}