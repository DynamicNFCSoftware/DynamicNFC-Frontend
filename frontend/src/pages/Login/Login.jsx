import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import { useAuth } from '../../contexts/AuthContext';
import { auth } from '../../firebase';
import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';

/* ═══════════════════════════════════════════
   TRANSLATIONS (EN + AR)
   ═══════════════════════════════════════════ */
const TR = {
  en: {
    loginTitle: 'Welcome Back',
    loginSub: 'Sign in to manage your NFC cards, view analytics, and access your dashboard.',
    signupTitle: 'Create Your Account',
    signupSub: 'Get started with DynamicNFC — create and manage smart NFC cards for your business.',
    lblEmail: 'Email Address',
    lblPassword: 'Password',
    lblConfirmPassword: 'Confirm Password',
    btnLogin: 'Sign In',
    btnSignup: 'Create Account',
    btnLoading: 'Please wait...',
    switchToSignup: 'Don\'t have an account?',
    switchToLogin: 'Already have an account?',
    switchBtnSignup: 'Create one',
    switchBtnLogin: 'Sign in',
    or: 'or',
    forgotPassword: 'Forgot password?',
    terms: 'By creating an account, you agree to our',
    termsLink: 'Terms of Service',
    privacyLink: 'Privacy Policy',
    and: 'and',
    feature1Title: 'Smart Identity',
    feature1Desc: 'Premium NFC cards that create instant digital connections',
    feature2Title: 'Real-Time Analytics',
    feature2Desc: 'Track every tap, view, and interaction in your dashboard',
    feature3Title: 'VIP Experiences',
    feature3Desc: 'Personalized portals that turn prospects into clients',
    tagline: 'Smart Identity. Premium Presence.',
    orContinueWith: 'or continue with',
    btnGoogle: 'Continue with Google',
    networkError: 'Network error. Please try again.',
    resetSent: 'Password reset email sent. Check your inbox.',
    resetError: 'Enter your email address first.',
  },
  ar: {
    loginTitle: 'مرحباً بعودتك',
    loginSub: 'سجل الدخول لإدارة بطاقات NFC الخاصة بك وعرض التحليلات والوصول إلى لوحة التحكم.',
    signupTitle: 'أنشئ حسابك',
    signupSub: 'ابدأ مع DynamicNFC — أنشئ وأدر بطاقات NFC الذكية لعملك.',
    lblEmail: 'البريد الإلكتروني',
    lblPassword: 'كلمة المرور',
    lblConfirmPassword: 'تأكيد كلمة المرور',
    btnLogin: 'تسجيل الدخول',
    btnSignup: 'إنشاء حساب',
    btnLoading: 'يرجى الانتظار...',
    switchToSignup: 'ليس لديك حساب؟',
    switchToLogin: 'لديك حساب بالفعل؟',
    switchBtnSignup: 'أنشئ واحداً',
    switchBtnLogin: 'سجل الدخول',
    or: 'أو',
    forgotPassword: 'نسيت كلمة المرور؟',
    terms: 'بإنشاء حساب، فإنك توافق على',
    termsLink: 'شروط الخدمة',
    privacyLink: 'سياسة الخصوصية',
    and: 'و',
    feature1Title: 'هوية ذكية',
    feature1Desc: 'بطاقات NFC فاخرة تنشئ اتصالات رقمية فورية',
    feature2Title: 'تحليلات لحظية',
    feature2Desc: 'تتبع كل لمسة وعرض وتفاعل في لوحة التحكم',
    feature3Title: 'تجارب VIP',
    feature3Desc: 'بوابات مخصصة تحوّل العملاء المحتملين إلى عملاء فعليين',
    tagline: 'هوية ذكية. حضور فاخر.',
    orContinueWith: 'أو المتابعة عبر',
    btnGoogle: 'المتابعة مع Google',
    networkError: 'خطأ في الشبكة. يرجى المحاولة مرة أخرى.',
    resetSent: 'تم إرسال بريد إعادة تعيين كلمة المرور. تحقق من صندوق الوارد.',
    resetError: 'أدخل بريدك الإلكتروني أولاً.',
  },
};

/* ═══════════════════════════════════════════
   ICONS
   ═══════════════════════════════════════════ */
const FeatureIcon1 = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="3" width="20" height="18" rx="3" />
    <path d="M12 8v4m0 0v4m0-4h4m-4 0H8" />
  </svg>
);

const FeatureIcon2 = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const FeatureIcon3 = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */
const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState('en');
  const navigate = useNavigate();
  const { login } = useAuth();

  const isRTL = lang === 'ar';
  const t = (k) => TR[lang]?.[k] || TR.en[k] || k;

  /* Particles */
  const [particles] = useState(() =>
    Array.from({ length: 15 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 20}s`,
      animationDuration: `${15 + Math.random() * 10}s`,
    }))
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
    if (info) setInfo('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setInfo('');

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError(lang === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        /* ── FIREBASE LOGIN ── */
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;
        
        login({ sessionId: user.uid, email: user.email, accountId: user.uid });
        navigate('/dashboard');
      } else {
        /* ── FIREBASE REGISTER ── */
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;
        
        login({ sessionId: user.uid, email: user.email, accountId: user.uid });
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Auth Error:", err);
      if (err.code === 'auth/email-already-in-use') {
         setError(lang === 'ar' ? 'البريد الإلكتروني مستخدم بالفعل' : 'Email is already in use.');
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
         setError(lang === 'ar' ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Invalid email or password.');
      } else if (err.code === 'auth/weak-password') {
         setError(lang === 'ar' ? 'كلمة المرور ضعيفة جداً' : 'Password is too weak. Use at least 6 characters.');
      } else {
         setError(t('networkError'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      login({ sessionId: user.uid, email: user.email, accountId: user.uid });
      navigate('/dashboard');
      
    } catch (err) {
      console.error("Google Auth Error:", err);
      setError(lang === 'ar' ? 'فشل تسجيل الدخول عبر Google' : 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError(t('resetError'));
      return;
    }
    setLoading(true);
    setError('');
    try {
      await sendPasswordResetEmail(auth, formData.email);
      setInfo(t('resetSent'));
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError(lang === 'ar' ? 'لم يتم العثور على حساب بهذا البريد' : 'No account found with this email.');
      } else {
        setError(t('networkError'));
      }
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setInfo('');
    setFormData({ email: '', password: '', confirmPassword: '' });
  };

  return (
    <div className="auth-page" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Particles */}
      <div className="auth-particles">
        {particles.map((p, i) => (
          <div key={i} className="auth-particle" style={p} />
        ))}
      </div>

      {/* Language toggle */}
      <div className="auth-lang-toggle">
        <button className={`auth-lang-btn${lang === 'en' ? ' active' : ''}`} onClick={() => setLang('en')}>EN</button>
        <button className={`auth-lang-btn${lang === 'ar' ? ' active' : ''}`} onClick={() => setLang('ar')}>ع</button>
      </div>

      <div className="auth-container">
        {/* LEFT — BRAND PANEL */}
        <div className="auth-brand">
          <Link to="/" className="auth-brand-logo">
            <img src="/assets/images/logo.png" alt="DynamicNFC" className="auth-logo-img" />
          </Link>

          <div className="auth-brand-content">
            <h2>{t('tagline')}</h2>
            <div className="auth-features">
              {[
                { Icon: FeatureIcon1, title: t('feature1Title'), desc: t('feature1Desc') },
                { Icon: FeatureIcon2, title: t('feature2Title'), desc: t('feature2Desc') },
                { Icon: FeatureIcon3, title: t('feature3Title'), desc: t('feature3Desc') },
              ].map(({ Icon, title, desc }, i) => (
                <div className="auth-feature" key={i}>
                  <div className="auth-feature-icon"><Icon /></div>
                  <div>
                    <div className="auth-feature-title">{title}</div>
                    <div className="auth-feature-desc">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="auth-brand-footer">
            <a href="https://dynamicnfc.ca" target="_blank" rel="noopener noreferrer">dynamicnfc.ca</a>
          </div>
        </div>

        {/* RIGHT — FORM */}
        <div className="auth-form-panel">
          <div className="auth-form-inner">
            <div className="auth-form-header">
              <h1>{isLogin ? t('loginTitle') : t('signupTitle')}</h1>
              <p>{isLogin ? t('loginSub') : t('signupSub')}</p>
            </div>

            {error && (
              <div className="auth-error">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {info && (
              <div className="auth-info">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>{info}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-field">
                <label htmlFor="auth-email">{t('lblEmail')}</label>
                <input
                  id="auth-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="auth-field">
                <label htmlFor="auth-password">
                  {t('lblPassword')}
                  {isLogin && (
                    <button type="button" className="auth-forgot" onClick={handleForgotPassword}>{t('forgotPassword')}</button>
                  )}
                </label>
                <input
                  id="auth-password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                />
              </div>

              {!isLogin && (
                <div className="auth-field">
                  <label htmlFor="auth-confirm">{t('lblConfirmPassword')}</label>
                  <input
                    id="auth-confirm"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                  />
                </div>
              )}

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? (
                  <span className="auth-spinner" />
                ) : null}
                {loading ? t('btnLoading') : isLogin ? t('btnLogin') : t('btnSignup')}
              </button>

              {!isLogin && (
                <p className="auth-terms">
                  {t('terms')}{' '}
                  <a href="#">{t('termsLink')}</a>{' '}
                  {t('and')}{' '}
                  <a href="#">{t('privacyLink')}</a>
                </p>
              )}
            </form>

            {/* Social Login Divider */}
            <div className="auth-divider">
              <div className="auth-divider-line" />
              <span>{t('orContinueWith')}</span>
              <div className="auth-divider-line" />
            </div>

            {/* Social Buttons */}
            <div className="auth-social-buttons">
              <button type="button" className="auth-social-btn" onClick={handleGoogleLogin}>
                <svg viewBox="0 0 24 24" className="auth-social-icon">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>{t('btnGoogle')}</span>
              </button>
            </div>

            <div className="auth-switch">
              <div className="auth-switch-line" />
              <span>{isLogin ? t('switchToSignup') : t('switchToLogin')}</span>
              <div className="auth-switch-line" />
            </div>
            <button type="button" className="auth-switch-btn" onClick={switchMode}>
              {isLogin ? t('switchBtnSignup') : t('switchBtnLogin')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;