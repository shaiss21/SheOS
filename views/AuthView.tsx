
import React, { useState } from 'react';
import { 
  Mail, Lock, Eye, EyeOff, ArrowLeft, 
  Globe, Smartphone, CheckCircle, ArrowRight
} from '../components/Icons';
import { UserProfile } from '../types';

interface AuthViewProps {
  onLoginSuccess: (profile: Partial<UserProfile>) => void;
  initialLanguage?: string;
  onLanguageChange?: (lang: string) => void;
}

type AuthMode = 'SPLASH' | 'LOGIN' | 'SIGNUP';

const AuthView: React.FC<AuthViewProps> = ({ onLoginSuccess, initialLanguage = 'English', onLanguageChange }) => {
  const [mode, setMode] = useState<AuthMode>('SPLASH');
  const [signUpStep, setSignUpStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Student',
    city: '',
    age: '',
    interests: [] as string[],
    consent: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Password Logic
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const passwordScore = getPasswordStrength(formData.password);

  // Handlers
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => {
      const interests = prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests };
    });
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email address";
    if (passwordScore < 3) newErrors.password = "Password is too weak";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (signUpStep === 1 && validateStep1()) {
      setSignUpStep(2);
    } else if (signUpStep === 2) {
      if (!formData.city) {
        setErrors({ city: "City is required" });
        return;
      }
      setSignUpStep(3);
    }
  };

  const handleFinalSignUp = async () => {
    if (!formData.consent) {
        setErrors({ consent: "You must agree to the terms" });
        return;
    }
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
        onLoginSuccess({
            name: formData.fullName,
            email: formData.email,
            role: formData.role,
            city: formData.city,
            interests: formData.interests,
            safetyScore: 100,
            healthStatus: 'Good'
        });
        setIsLoading(false);
    }, 1500);
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
        setErrors({ login: "Please enter email and password" });
        return;
    }
    setIsLoading(true);
    setTimeout(() => {
        // Mock login
        onLoginSuccess({
            name: "Sarah Jenkins",
            email: formData.email,
            safetyScore: 98,
            healthStatus: 'Good'
        });
        setIsLoading(false);
    }, 1500);
  };

  // --- SOCIAL LOGIN HANDLER ---
  const handleSocialLogin = (provider: 'Google' | 'Apple') => {
    setIsLoading(true);
    // Simulate OAuth Delay
    setTimeout(() => {
        onLoginSuccess({
            name: "Sarah Jenkins",
            email: `sarah.jenkins@${provider.toLowerCase()}.com`,
            role: "Professional",
            city: "New York",
            interests: ["Safety", "Tech"],
            safetyScore: 98,
            healthStatus: 'Good'
        });
        setIsLoading(false);
    }, 1500);
  };

  const handleLangSelect = (lang: string) => {
    if (onLanguageChange) onLanguageChange(lang);
    setShowLangMenu(false);
  }

  // --- RENDERERS ---

  if (mode === 'SPLASH') {
    return (
      <div className="min-h-screen bg-[var(--primary-light)] flex flex-col items-center justify-center p-6 text-center animate-fade-in relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-[var(--primary-color)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700"></div>

        <div className="absolute top-6 right-6 z-20">
            <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="p-2 bg-white/50 backdrop-blur-sm rounded-full shadow-sm"
            >
                <Globe size={20} className="text-[var(--primary-color)]" />
            </button>
            {showLangMenu && (
                <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-xl p-2 w-32 animate-fade-in border border-[var(--primary-light)]">
                    {['English', 'Hindi', 'Telugu'].map(l => (
                        <button 
                            key={l}
                            onClick={() => handleLangSelect(l)}
                            className={`block w-full text-left px-3 py-2 rounded-lg text-xs font-bold ${initialLanguage === l ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                        >
                            {l}
                        </button>
                    ))}
                </div>
            )}
        </div>

        <div className="relative z-10">
          <div className="w-24 h-24 bg-black rounded-2xl flex items-center justify-center text-white text-4xl font-extrabold shadow-xl mx-auto mb-6 transform rotate-3">
             S
          </div>
          <h1 className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br from-black via-[var(--primary-color)] to-black tracking-tighter mb-2 drop-shadow-md brightness-110">SheOS</h1>
          <p className="text-[#4A042A] text-lg font-medium mb-8 max-w-xs mx-auto">
             Safety • Health • Finance • Education • Community
          </p>
          
          <div className="space-y-4 w-full max-w-xs mx-auto">
            <button 
              onClick={() => setMode('SIGNUP')}
              className="w-full bg-[var(--primary-color)] text-white py-4 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl active:scale-95 transition-all"
            >
              Get Started
            </button>
            <button 
              onClick={() => setMode('LOGIN')}
              className="w-full bg-white text-black border border-[var(--primary-light)] py-4 rounded-xl font-bold text-sm hover:bg-[var(--primary-light)] active:scale-95 transition-all"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'LOGIN') {
    return (
      <div className="min-h-screen bg-white p-6 flex flex-col justify-center animate-slide-up relative">
         <button 
           onClick={() => setMode('SPLASH')} 
           className="fixed top-6 left-6 z-50 p-2 rounded-full hover:bg-gray-100 bg-white/50 backdrop-blur-sm transition-colors"
         >
            <ArrowLeft className="text-black" />
         </button>

         <div className="w-full max-w-sm mx-auto mt-8">
            <h2 className="text-3xl font-black text-black mb-2">Welcome Back</h2>
            <p className="text-gray-500 mb-8 font-medium">Enter your details to continue.</p>

            <div className="space-y-4 mb-6">
               <div>
                 <label className="block text-xs font-bold text-[#4A042A] uppercase mb-1">Email</label>
                 <div className="relative">
                   <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18}/>
                   <input 
                     type="email" 
                     className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--primary-light)] bg-white focus:outline-none focus:border-[var(--primary-color)] text-black"
                     placeholder="you@example.com"
                     value={formData.email}
                     onChange={(e) => handleInputChange('email', e.target.value)}
                   />
                 </div>
               </div>
               
               <div>
                 <label className="block text-xs font-bold text-[#4A042A] uppercase mb-1">Password</label>
                 <div className="relative">
                   <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18}/>
                   <input 
                     type={showPassword ? "text" : "password"} 
                     className="w-full pl-10 pr-10 py-3 rounded-xl border border-[var(--primary-light)] bg-white focus:outline-none focus:border-[var(--primary-color)] text-black"
                     placeholder="••••••••"
                     value={formData.password}
                     onChange={(e) => handleInputChange('password', e.target.value)}
                   />
                   <button 
                     onClick={() => setShowPassword(!showPassword)}
                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                   >
                     {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                   </button>
                 </div>
               </div>
               
               {errors.login && <p className="text-red-500 text-xs font-bold text-center">{errors.login}</p>}
               
               <div className="flex justify-between items-center text-xs font-medium">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-[var(--primary-color)]" />
                    <span className="text-gray-600">Remember me</span>
                  </label>
                  <button className="text-[var(--primary-color)] font-bold">Forgot password?</button>
               </div>
            </div>

            <button 
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-[var(--primary-color)] text-white py-4 rounded-xl font-bold shadow-lg active:bg-[var(--primary-color)] transition-colors flex justify-center items-center gap-2"
            >
              {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/> : 'Log In'}
            </button>

            <div className="mt-8">
               <div className="relative flex py-5 items-center">
                  <div className="flex-grow border-t border-[var(--primary-light)]"></div>
                  <span className="flex-shrink mx-4 text-gray-400 text-xs font-bold uppercase">Or continue with</span>
                  <div className="flex-grow border-t border-[var(--primary-light)]"></div>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => handleSocialLogin('Google')}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl border border-[var(--primary-light)] bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  >
                     <Globe size={18} className="text-blue-500" /> <span className="text-sm font-bold text-gray-700">Google</span>
                  </button>
                  <button 
                    onClick={() => handleSocialLogin('Apple')}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl border border-[var(--primary-light)] bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  >
                     <Smartphone size={18} className="text-black" /> <span className="text-sm font-bold text-gray-700">Apple</span>
                  </button>
               </div>
            </div>

            <p className="text-center mt-8 text-sm text-gray-600 font-medium">
               Don't have an account? <button onClick={() => setMode('SIGNUP')} className="text-[var(--primary-color)] font-bold hover:underline">Sign up</button>
            </p>
         </div>
      </div>
    );
  }

  // SIGN UP FLOW
  return (
    <div className="min-h-screen bg-white p-6 flex flex-col justify-center animate-slide-up relative">
      <div className="w-full max-w-sm mx-auto">
        <button 
           onClick={() => signUpStep === 1 ? setMode('SPLASH') : setSignUpStep(signUpStep - 1)} 
           className="fixed top-6 left-6 z-50 p-2 rounded-full hover:bg-gray-100 bg-white/50 backdrop-blur-sm transition-colors"
        >
            <ArrowLeft className="text-black" />
         </button>

         {/* Progress Bar */}
         <div className="flex gap-2 mb-8 mt-12">
            <div className={`h-1 flex-1 rounded-full ${signUpStep >= 1 ? 'bg-[var(--primary-color)]' : 'bg-[var(--primary-light)]'}`}></div>
            <div className={`h-1 flex-1 rounded-full ${signUpStep >= 2 ? 'bg-[var(--primary-color)]' : 'bg-[var(--primary-light)]'}`}></div>
            <div className={`h-1 flex-1 rounded-full ${signUpStep >= 3 ? 'bg-[var(--primary-color)]' : 'bg-[var(--primary-light)]'}`}></div>
         </div>

         <h2 className="text-3xl font-black text-black mb-6">
            {signUpStep === 1 ? "Create Account" : signUpStep === 2 ? "About You" : "Almost Done"}
         </h2>

         {/* STEP 1: CREDENTIALS */}
         {signUpStep === 1 && (
            <div className="space-y-4">
               <input 
                 type="text" 
                 className={`w-full p-4 rounded-xl border bg-white focus:outline-none focus:border-[var(--primary-color)] text-black ${errors.fullName ? 'border-red-500' : 'border-[var(--primary-light)]'}`}
                 placeholder="Full Name"
                 value={formData.fullName}
                 onChange={(e) => handleInputChange('fullName', e.target.value)}
               />
               
               <input 
                 type="email" 
                 className={`w-full p-4 rounded-xl border bg-white focus:outline-none focus:border-[var(--primary-color)] text-black ${errors.email ? 'border-red-500' : 'border-[var(--primary-light)]'}`}
                 placeholder="Email Address"
                 value={formData.email}
                 onChange={(e) => handleInputChange('email', e.target.value)}
               />
               
               <div className="relative">
                 <input 
                   type="password" 
                   className={`w-full p-4 rounded-xl border bg-white focus:outline-none focus:border-[var(--primary-color)] text-black ${errors.password ? 'border-red-500' : 'border-[var(--primary-light)]'}`}
                   placeholder="Password (Min 8 chars)"
                   value={formData.password}
                   onChange={(e) => handleInputChange('password', e.target.value)}
                 />
                 {/* Password Strength Meter */}
                 <div className="flex gap-1 mt-2 px-1 h-1">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className={`flex-1 rounded-full transition-colors ${i <= passwordScore ? (passwordScore < 3 ? 'bg-red-400' : 'bg-green-400') : 'bg-gray-200'}`}></div>
                    ))}
                 </div>
               </div>

               <input 
                 type="password" 
                 className={`w-full p-4 rounded-xl border bg-white focus:outline-none focus:border-[var(--primary-color)] text-black ${errors.confirmPassword ? 'border-red-500' : 'border-[var(--primary-light)]'}`}
                 placeholder="Confirm Password"
                 value={formData.confirmPassword}
                 onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
               />
               
               {Object.values(errors).map((err, i) => (
                  <p key={i} className="text-red-500 text-xs font-bold">{err}</p>
               ))}
               
               <button onClick={handleNextStep} className="w-full bg-[var(--primary-color)] text-white py-4 rounded-xl font-bold shadow-lg mt-4 flex justify-center items-center gap-2 active:bg-[var(--primary-color)]">
                  Continue <ArrowRight size={18} />
               </button>

               {/* Social Signup Options */}
               <div className="mt-8">
                   <div className="relative flex py-5 items-center">
                      <div className="flex-grow border-t border-[var(--primary-light)]"></div>
                      <span className="flex-shrink mx-4 text-gray-400 text-xs font-bold uppercase">Or sign up with</span>
                      <div className="flex-grow border-t border-[var(--primary-light)]"></div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => handleSocialLogin('Google')}
                        disabled={isLoading}
                        className="flex items-center justify-center gap-2 py-3 rounded-xl border border-[var(--primary-light)] bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors"
                      >
                         <Globe size={18} className="text-blue-500" /> <span className="text-sm font-bold text-gray-700">Google</span>
                      </button>
                      <button 
                        onClick={() => handleSocialLogin('Apple')}
                        disabled={isLoading}
                        className="flex items-center justify-center gap-2 py-3 rounded-xl border border-[var(--primary-light)] bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors"
                      >
                         <Smartphone size={18} className="text-black" /> <span className="text-sm font-bold text-gray-700">Apple</span>
                      </button>
                   </div>
               </div>
            </div>
         )}

         {/* STEP 2: DEMOGRAPHICS */}
         {signUpStep === 2 && (
            <div className="space-y-4 animate-fade-in">
               <div>
                  <label className="block text-xs font-bold text-[#4A042A] uppercase mb-1">I am a...</label>
                  <select 
                     className="w-full p-4 rounded-xl border border-[var(--primary-light)] bg-white focus:outline-none focus:border-[var(--primary-color)] text-black"
                     value={formData.role}
                     onChange={(e) => handleInputChange('role', e.target.value)}
                  >
                     <option value="Student">Student</option>
                     <option value="Professional">Professional</option>
                     <option value="Entrepreneur">Entrepreneur</option>
                     <option value="Homemaker">Homemaker</option>
                  </select>
               </div>

               <input 
                 type="text" 
                 className={`w-full p-4 rounded-xl border bg-white focus:outline-none focus:border-[var(--primary-color)] text-black ${errors.city ? 'border-red-500' : 'border-[var(--primary-light)]'}`}
                 placeholder="City"
                 value={formData.city}
                 onChange={(e) => handleInputChange('city', e.target.value)}
               />
               
               <div>
                  <label className="block text-xs font-bold text-[#4A042A] uppercase mb-2">My Interests (Select 2+)</label>
                  <div className="flex flex-wrap gap-2">
                     {['Safety', 'Health', 'Finance', 'Education', 'Community', 'Career'].map((int) => (
                        <button
                           key={int}
                           onClick={() => toggleInterest(int)}
                           className={`px-3 py-2 rounded-full text-xs font-bold border transition-colors ${formData.interests.includes(int) ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-[var(--primary-light)]'}`}
                        >
                           {int}
                        </button>
                     ))}
                  </div>
               </div>

               <button onClick={handleNextStep} className="w-full bg-[var(--primary-color)] text-white py-4 rounded-xl font-bold shadow-lg mt-4 flex justify-center items-center gap-2 active:bg-[var(--primary-color)]">
                  Next Step <ArrowRight size={18} />
               </button>
            </div>
         )}

         {/* STEP 3: CONSENT & FINISH */}
         {signUpStep === 3 && (
            <div className="space-y-6 animate-fade-in">
                {/* Upload Section Removed as per request */}

                <div className="space-y-4 mt-8">
                   <label className="flex items-start gap-3 p-4 border border-[var(--primary-light)] rounded-xl bg-white cursor-pointer select-none">
                      <div className={`w-5 h-5 rounded border border-gray-300 flex items-center justify-center mt-0.5 ${formData.consent ? 'bg-[var(--primary-color)] border-[var(--primary-color)]' : 'bg-white'}`} onClick={() => handleInputChange('consent', !formData.consent)}>
                         {formData.consent && <CheckCircle size={14} className="text-white" />}
                      </div>
                      <div className="flex-1 text-sm text-gray-600">
                         I agree to the <span className="text-[var(--primary-color)] font-bold">Terms of Service</span> and <span className="text-[var(--primary-color)] font-bold">Privacy Policy</span>. I understand my data is encrypted and safe.
                      </div>
                   </label>
                   {errors.consent && <p className="text-red-500 text-xs font-bold text-center">{errors.consent}</p>}
                </div>

                <button 
                   onClick={handleFinalSignUp} 
                   disabled={isLoading}
                   className="w-full bg-[var(--primary-color)] text-white py-4 rounded-xl font-bold shadow-lg active:bg-[var(--primary-color)] flex justify-center items-center gap-2"
                >
                   {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/> : 'Create Account'}
                </button>
            </div>
         )}
      </div>
    </div>
  );
};

export default AuthView;
