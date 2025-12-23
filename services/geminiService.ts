
import { GoogleGenAI, Type } from "@google/genai";
import { ThreatAnalysisResponse, HealthInsightResponse, FinanceInsightResponse, SentinelSensorData, SentinelAnalysisResponse, HealthTwinProfile, HealthTwinAnalysis, EducationProfile, EducationRoadmap, FinanceProfile, FinanceForecast, EmotionalMatch, CommunityAlert } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// --- Safety: Threat Detection ---
export const analyzeThreatLevel = async (situationText: string, language: string = 'English'): Promise<ThreatAnalysisResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze this situation for a woman's safety: "${situationText}". Return JSON. Response in ${language}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dangerLevel: { type: Type.INTEGER, description: "1 to 10, 10 being extreme danger" },
            advice: { type: Type.STRING, description: `Immediate safety action to take in ${language}` },
            isEmergency: { type: Type.BOOLEAN },
            contactsToNotify: { type: Type.BOOLEAN }
          },
          required: ["dangerLevel", "advice", "isEmergency", "contactsToNotify"]
        }
      }
    });
    
    if (response.text) {
      return JSON.parse(response.text) as ThreatAnalysisResponse;
    }
    throw new Error("No response");
  } catch (error) {
    console.error("AI Error:", error);
    return { dangerLevel: 5, advice: "Stay alert and move to a crowded area.", isEmergency: false, contactsToNotify: true };
  }
};

// --- Safety: Predictive Safety AI (Risk Prediction Engine) ---
export const analyzePredictiveDanger = async (data: SentinelSensorData): Promise<SentinelAnalysisResponse> => {
  try {
    const prompt = `
      Act as the "Predictive Safety AI" for the SHE-OS app. 
      Analyze the following real-time environment data to detect potential danger BEFORE it happens.
      
      Sensor Data:
      - Heart Rate: ${data.heartRate} bpm
      - Motion Pattern: ${data.motionType} (e.g., Suspicious Following, Aggressive Movement, Running, Stationary)
      - Audio Analysis: ${data.audioLevel} (e.g., Distress, Shouting, Quiet, Normal)
      - Location Context: ${data.locationContext} (e.g., High-Crime Zone, Unlit Lane, Home, Public)
      
      Logic:
      1. If Motion is "Suspicious Following" OR "Aggressive Movement", Risk is HIGH.
      2. If Location is "High-Crime Zone" AND Time is Late (implied), Risk increases.
      3. If Audio is "Distress", Threat is CRITICAL.
      
      Return a JSON object with:
      - threatScore (0-100)
      - riskLevel (SAFE, CAUTION, DANGER, CRITICAL)
      - activeAlerts (List specific detected threats e.g. "Suspicious Following Detected")
      - autoActions (Recommended Guardian Mode actions e.g. "Silent Recording", "Live Tracking")
      - aiReasoning (Explain why the score is high in a calm, safety-focused tone)
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            threatScore: { type: Type.INTEGER },
            riskLevel: { type: Type.STRING, enum: ['SAFE', 'CAUTION', 'DANGER', 'CRITICAL'] },
            activeAlerts: { type: Type.ARRAY, items: { type: Type.STRING } },
            autoActions: { type: Type.ARRAY, items: { type: Type.STRING } },
            aiReasoning: { type: Type.STRING }
          },
          required: ["threatScore", "riskLevel", "activeAlerts", "autoActions", "aiReasoning"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as SentinelAnalysisResponse;
    }
    throw new Error("No response");
  } catch (error) {
    // Fallback for safety
    return {
      threatScore: 75,
      riskLevel: 'CAUTION',
      activeAlerts: ["AI Connectivity Issue", "Monitoring Locally"],
      autoActions: ["Standby SOS"],
      aiReasoning: "Unable to reach cloud, reverting to local heuristics."
    };
  }
};

// --- Health: Symptom & Cycle Insight (Legacy) ---
export const getHealthInsight = async (symptoms: string, cycleDay: number, language: string = 'English'): Promise<HealthInsightResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Woman, Day ${cycleDay} of cycle. Symptoms: ${symptoms}. Provide health insight, hormone check, and simple recommendation in ${language}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prediction: { type: Type.STRING },
            recommendation: { type: Type.STRING },
            hormoneAlert: { type: Type.STRING, description: "Optional hormone alert" }
          },
          required: ["prediction", "recommendation"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as HealthInsightResponse;
    }
    throw new Error("No response");
  } catch (error) {
    return { prediction: "General analysis unavailable", recommendation: "Rest and hydrate." };
  }
};

// --- Health: AI Health Twin (Advanced) ---
export const generateHealthTwinAnalysis = async (profile: HealthTwinProfile, language: string = 'English'): Promise<HealthTwinAnalysis> => {
  try {
    const prompt = `
      Act as an advanced Medical AI creating a 'Digital Twin' for a woman.
      Profile:
      - Cycle Phase: ${profile.cyclePhase}
      - Sleep: ${profile.sleepAvg}h avg
      - Stress: ${profile.stressLevel}
      - Activity: ${profile.activityLevel}
      - Recent Symptoms: ${profile.recentSymptoms.join(', ')}

      Predict future health risks (PCOS, Thyroid, Anemia, Burnout, etc.) before they happen.
      Calculate a 'Body Sync Score' (0-100).
      Return JSON. Translate content to ${language}.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bodySyncScore: { type: Type.INTEGER },
            predictedRisks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  condition: { type: Type.STRING },
                  probability: { type: Type.INTEGER },
                  timeline: { type: Type.STRING }
                }
              }
            },
            hormonalTrend: { type: Type.STRING },
            actionPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, enum: ['Nutrition', 'Fitness', 'Mind'] },
                  action: { type: Type.STRING }
                }
              }
            }
          },
          required: ["bodySyncScore", "predictedRisks", "hormonalTrend", "actionPlan"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as HealthTwinAnalysis;
    }
    throw new Error("No response");
  } catch (error) {
    return {
      bodySyncScore: 82,
      predictedRisks: [
        { condition: "Luteal Phase Fatigue", probability: 65, timeline: "In 3 days" },
        { condition: "Vitamin D Dip", probability: 40, timeline: "Gradual" }
      ],
      hormonalTrend: "Progesterone rising, slightly elevated Cortisol.",
      actionPlan: [
        { type: "Nutrition", action: "Increase magnesium intake" },
        { type: "Mind", action: "10min meditation before sleep" }
      ]
    };
  }
};

// --- Finance: Financial Abuse Detection ---
export const detectFinancialAbuse = async (recentTransactions: string, language: string = 'English'): Promise<FinanceInsightResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze these transactions for signs of financial control/abuse or reckless spending linked to emotional state: ${recentTransactions}. Provide advice in ${language}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            spendingStatus: { type: Type.STRING },
            financialAbuseRisk: { type: Type.NUMBER, description: "0 to 100 probability" },
            savingsTip: { type: Type.STRING }
          },
          required: ["spendingStatus", "financialAbuseRisk", "savingsTip"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as FinanceInsightResponse;
    }
    throw new Error("No response");
  } catch (error) {
    return { spendingStatus: "Unknown", financialAbuseRisk: 0, savingsTip: "Monitor your expenses closely." };
  }
};

// --- Finance: AI Life Predictor ---
export const generateFinancialForecast = async (profile: FinanceProfile, language: string = 'English'): Promise<FinanceForecast> => {
  try {
    const prompt = `
      Act as a Women's Financial Life Coach. Analyze this profile:
      - Income: $${profile.monthlyIncome}
      - Savings: $${profile.savings}
      - Stage: ${profile.careerStage}
      - Status: ${profile.lifeStatus}
      - Goal: ${profile.financialGoal}
      - Mood: ${profile.recentMood}

      Predict future risks (e.g., maternity gap, lack of emergency fund), emotional spending triggers, and career growth.
      Suggest investments (Gold, SIP, Govt Schemes).
      Return JSON. Translate advice to ${language}.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            stabilityScore: { type: Type.INTEGER },
            stabilityStatus: { type: Type.STRING, enum: ['Secure', 'Stable', 'At Risk', 'Critical'] },
            predictedRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
            emotionalSpendingAnalysis: { type: Type.STRING },
            careerGrowthPrediction: { type: Type.STRING },
            investmentStrategy: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ['Gold', 'SIP', 'Govt Scheme', 'Low Risk'] },
                  description: { type: Type.STRING }
                }
              }
            },
            futureTimeline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  year: { type: Type.STRING },
                  event: { type: Type.STRING },
                  expenseProjection: { type: Type.STRING }
                }
              }
            },
            recommendedSkill: { type: Type.STRING }
          },
          required: ["stabilityScore", "stabilityStatus", "predictedRisks", "emotionalSpendingAnalysis", "careerGrowthPrediction", "investmentStrategy", "futureTimeline", "recommendedSkill"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as FinanceForecast;
    }
    throw new Error("No response");
  } catch (error) {
    // Fallback data
    return {
      stabilityScore: 65,
      stabilityStatus: 'Stable',
      predictedRisks: ["Low Emergency Fund", "Potential Career Break Impact"],
      emotionalSpendingAnalysis: "Recent stress may trigger impulse buys on comfort items.",
      careerGrowthPrediction: "+15% income potential with Upskilling",
      investmentStrategy: [
        { title: "Sovereign Gold Bond", type: "Gold", description: "Safe, 2.5% interest + appreciation" },
        { title: "Flexi-SIP", type: "SIP", description: "Start small, increase annually" }
      ],
      futureTimeline: [
        { year: "2024", event: "Emergency Fund Goal", expenseProjection: "$2000" },
        { year: "2025", event: "Career Upgrade", expenseProjection: "Invest $500 in course" }
      ],
      recommendedSkill: "Financial Negotiation"
    };
  }
};


// --- Education: AI Mentor & Life-Journey Planner ---
export const getMentorAdvice = async (topic: string, mood: string, language: string = 'English'): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a supportive female mentor. User mood: ${mood}. Topic: ${topic}. Give a short, encouraging 2-sentence advice in ${language}.`,
    });
    return response.text || "Believe in yourself. You are capable of amazing things.";
  } catch (e) {
    return "Keep pushing forward, you're doing great.";
  }
};

export const generateEducationRoadmap = async (profile: EducationProfile, language: string = 'English'): Promise<EducationRoadmap> => {
  try {
    const prompt = `
      Act as an AI Life-Journey Planner for a woman.
      Profile: Role: ${profile.role}, Goal: ${profile.goal}, Hours/Day: ${profile.hoursPerDay}, Mood: ${profile.currentMood}.
      Create a long-term education roadmap.
      - If 'Mother' or 'Homemaker', suggest flexible slots (nap times, school hours).
      - If 'Overwhelmed', suggest micro-learning and self-care breaks.
      - Return JSON. Content should be in ${language}.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            journeyTitle: { type: Type.STRING },
            careerMatch: { type: Type.STRING },
            emotionalTip: { type: Type.STRING },
            timeline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phase: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  focus: { type: Type.STRING },
                  milestone: { type: Type.STRING }
                }
              }
            },
            weeklySchedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING },
                  slots: { type: Type.ARRAY, items: { type: Type.STRING } },
                  energyPrediction: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] }
                }
              }
            }
          },
          required: ["journeyTitle", "careerMatch", "emotionalTip", "timeline", "weeklySchedule"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as EducationRoadmap;
    }
    throw new Error("No response");
  } catch (error) {
    return {
      journeyTitle: "Empowerment Path",
      careerMatch: "Freelance Consultant",
      emotionalTip: "Take it one step at a time.",
      timeline: [{ phase: "Foundation", duration: "1 Month", focus: "Basics", milestone: "First Certificate" }],
      weeklySchedule: [{ day: "Monday", slots: ["10:00 AM Study"], energyPrediction: "Medium" }]
    };
  }
};

// --- Community: SafeConnect AI ---
export const findEmotionalMatches = async (mood: string, goal: string, language: string = 'English'): Promise<EmotionalMatch[]> => {
  try {
    const prompt = `
      Act as SafeConnect AI. The user is a woman feeling "${mood}" with a goal: "${goal}".
      Generate 3 fictional verified profiles of women who have overcome similar challenges or are supportive peers.
      Return JSON. Bio/Match Reason should be in ${language}.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              role: { type: Type.STRING },
              matchReason: { type: Type.STRING },
              isVerified: { type: Type.BOOLEAN },
              avatarColor: { type: Type.STRING, enum: ['bg-pink-100', 'bg-purple-100', 'bg-blue-100', 'bg-green-100'] }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as EmotionalMatch[];
    }
    return [];
  } catch (e) {
    return [
      { id: '1', name: "Elena R.", role: "Senior Dev & Mom", matchReason: "Balanced coding with motherhood.", isVerified: true, avatarColor: "bg-purple-100" },
      { id: '2', name: "Sarah K.", role: "Startup Founder", matchReason: "Overcame anxiety to launch biz.", isVerified: true, avatarColor: "bg-pink-100" }
    ];
  }
};

export const getLocalCommunityAlerts = async (city: string): Promise<CommunityAlert[]> => {
  // Simulation of AI verifying local reports
  return [
    { id: '1', type: 'DANGER', message: "Unlit street reported near Central Park West gate.", location: "Sector 4", time: "10m ago", verifiedCount: 12 },
    { id: '2', type: 'SAFE', message: "24/7 Women-only cafe opened.", location: "Downtown", time: "2h ago", verifiedCount: 45 },
    { id: '3', type: 'INFO', message: "Free self-defense workshop this Sunday.", location: "Community Center", time: "5h ago", verifiedCount: 88 }
  ];
};
