import React, { useState, useEffect } from 'react';
import '../styles/Auth.css';
import { useTranslation } from '../i18n';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

import LanguageSwitcher from './LanguageSwitcher';

export default function Login({ onLogin }) {
    const { t } = useTranslation();
    const [userType, setUserType] = useState('farmer');
    const [credentials, setCredentials] = useState({ id: '', mobile: '', password: '', aadhaar: '', otp: '' });
    const [demoMode, setDemoMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Auth States
    const [authMethod, setAuthMethod] = useState('standard'); // 'standard', 'aadhaar'
    const [aadhaarVerified, setAadhaarVerified] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [timer, setTimer] = useState(0);

    const DEMO_FARMER = { id: 'TN-VEL-001', mobile: '9876543210', password: 'password123' };
    const DEMO_OFFICER = { id: 'EDII-TN-ADMIN', mobile: '9988776655', password: 'adminpass' };

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => setTimer(t => t - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    useEffect(() => {
        if (!demoMode) setCredentials({ id: '', mobile: '', password: '', aadhaar: '', otp: '' });
    }, [demoMode]);

    const handleInput = (e) => {
        let value = e.target.value;
        if (e.target.name === 'aadhaar') {
            // Auto-format Aadhaar (XXXX XXXX XXXX)
            value = value.replace(/\D/g, '').substring(0, 12);
            if (value.length > 4) value = value.substring(0, 4) + ' ' + value.substring(4);
            if (value.length > 9) value = value.substring(0, 9) + ' ' + value.substring(9);
        }
        setCredentials({ ...credentials, [e.target.name]: value });
        setError('');
    };

    const sendOtp = () => {
        const rawAadhaar = credentials.aadhaar.replace(/\s/g, '');
        if (rawAadhaar.length !== 12) {
            setError("Enter valid 12-digit Aadhaar Number");
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setOtpSent(true);
            setTimer(60);
            toast.success("OTP sent to registered mobile linked with Aadhaar", { icon: '📲' });
        }, 1500);
    };

    const verifyAadhaarLogin = () => {
        if (credentials.otp !== '123456' && credentials.aadhaar.slice(-4) !== '2026') {
            // Mock Check: If last 4 digits are 2026, we allow any OTP for demo ease, else require specific OTP
            if (credentials.otp.length !== 6) {
                setError("Invalid OTP");
                return;
            }
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setAadhaarVerified(true);
            toast.success("Aadhaar Verified Successfully", { icon: '✅' });
            // Pre-fill dummy data for profile setup transition
            setTimeout(() => onLogin('farmer', false, { verified: true, name: 'Thiru. Selvam', aadhaar: credentials.aadhaar }), 1000);
        }, 1500);
    };

    const validate = () => {
        if (!credentials.id || !credentials.mobile || !credentials.password) return "All fields are required.";
        if (credentials.mobile.length !== 10) return "Enter valid 10-digit mobile.";
        return null;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const err = validate();
        if (err) { setError(err); toast.error(err); return; }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            if (credentials.password.length < 5) {
                setError("Invalid Password");
                return;
            }
            onLogin(userType, false);
        }, 1500);
    };

    const handleDemoSelect = (role) => {
        const creds = role === 'farmer' ? DEMO_FARMER : DEMO_OFFICER;
        setCredentials({ ...credentials, ...creds });
        setUserType(role);

        toast.loading(`Initializing Demo Environment: ${role.toUpperCase()}...`, { duration: 1000 });

        setTimeout(() => {
            onLogin(role, true);
        }, 1200);
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0F172A', color: 'white', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>

            {/* LEFT: Branding & Info */}
            <div style={{ flex: 1, padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
                <div className="auth-overlay" style={{ opacity: 0.3 }}></div>

                <div style={{ zIndex: 2 }}>
                    <h1 className="cyber-font" style={{ fontSize: '3.5rem', color: '#10B981', marginBottom: '0.5rem', textShadow: '0 0 20px rgba(16, 185, 129, 0.4)' }}>Agri-Neural Twin</h1>
                    <h2 style={{ fontSize: '1.5rem', color: '#cbd5e1', marginBottom: '3rem', fontFamily: 'Share Tech Mono', letterSpacing: '1px' }}>THE GOOGLE MAPS FOR FARMERS</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', maxWidth: '600px' }}>
                        <div className="feature-item" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <div style={{ fontSize: '2rem', background: 'rgba(59, 130, 246, 0.1)', padding: '10px', borderRadius: '12px' }}>🌐</div>
                            <div>
                                <strong style={{ color: '#3B82F6', fontSize: '1.1rem' }}>The Digital Twin</strong>
                                <p style={{ color: '#94a3b8', margin: '4px 0 0 0' }}>Virtual farm simulation of the entire district.</p>
                            </div>
                        </div>
                        <div className="feature-item" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <div style={{ fontSize: '2rem', background: 'rgba(245, 158, 11, 0.1)', padding: '10px', borderRadius: '12px' }}>🧠</div>
                            <div>
                                <strong style={{ color: '#F59E0B', fontSize: '1.1rem' }}>The What-If Machine</strong>
                                <p style={{ color: '#94a3b8', margin: '4px 0 0 0' }}>Runs 1,000 practice seasons to find risks.</p>
                            </div>
                        </div>
                        <div className="feature-item" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <div style={{ fontSize: '2rem', background: 'rgba(16, 185, 129, 0.1)', padding: '10px', borderRadius: '12px' }}>📈</div>
                            <div>
                                <strong style={{ color: '#10B981', fontSize: '1.1rem' }}>The Profit Path</strong>
                                <p style={{ color: '#94a3b8', margin: '4px 0 0 0' }}>Direct advice to avoid market gluts.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Official Links Footer */}
                <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '2rem', fontSize: '0.8rem', color: '#64748B' }}>
                    <a href="https://tnhorticulture.tn.gov.in" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none' }}>tnhorticulture.tn.gov.in</a>
                    <a href="https://tnagrisnet.tn.gov.in" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none' }}>tnagrisnet.tn.gov.in</a>
                    <a href="https://uzhavan.tn.gov.in" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none' }}>uzhavan.tn.gov.in</a>
                </div>
            </div>

            {/* RIGHT: Login Form Container */}
            <div style={{ flex: '0 0 45%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(10px)', borderLeft: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 10 }}>

                <div style={{ position: 'absolute', top: '2rem', right: '2rem', zIndex: 20 }}>
                    <LanguageSwitcher />
                </div>

                <div
                    className="glass-card"
                    style={{ width: '100%', maxWidth: '450px', padding: '2.5rem', margin: '2rem' }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div className="cyber-font" style={{ fontSize: '1.5rem', color: '#fff', letterSpacing: '1px' }}>SECURE ACCESS</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748B' }}>AUTHENTICATION REQUIRED</div>
                    </div>

                    {/* Standard Form */}
                    {!demoMode && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>

                            {/* Auth Method Tabs */}
                            <div style={{ display: 'flex', marginBottom: '1.5rem', background: '#0f172a', padding: '4px', borderRadius: '8px' }}>
                                <button
                                    onClick={() => setAuthMethod('standard')}
                                    style={{ flex: 1, padding: '8px', border: 'none', background: authMethod === 'standard' ? '#334155' : 'transparent', color: authMethod === 'standard' ? 'white' : '#64748B', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' }}
                                >
                                    Standard ID
                                </button>
                                <button
                                    onClick={() => setAuthMethod('aadhaar')}
                                    style={{ flex: 1, padding: '8px', border: 'none', background: authMethod === 'aadhaar' ? '#334155' : 'transparent', color: authMethod === 'aadhaar' ? 'white' : '#64748B', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' }}
                                >
                                    Login with Aadhaar
                                </button>
                            </div>

                            {authMethod === 'standard' ? (
                                <form onSubmit={handleSubmit}>
                                    <div className="user-type-toggle" style={{ marginBottom: '1.5rem' }}>
                                        <button type="button" className={`toggle-btn ${userType === 'farmer' ? 'active' : ''}`} onClick={() => setUserType('farmer')}>👨‍🌾 Farmer</button>
                                        <button type="button" className={`toggle-btn officer ${userType === 'officer' ? 'active' : ''}`} onClick={() => setUserType('officer')}>👔 Officer</button>
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">{userType === 'farmer' ? 'FARMER ID' : 'OFFICER ID'}</label>
                                        <input name="id" className="auth-input" value={credentials.id} onChange={handleInput} placeholder={userType === 'farmer' ? 'TN-FARM-XXXX' : 'TN-OFF-XXXX'} />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">MOBILE</label>
                                        <input name="mobile" className="auth-input" value={credentials.mobile} onChange={handleInput} maxLength={10} />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">PASSWORD</label>
                                        <input type="password" name="password" className="auth-input" value={credentials.password} onChange={handleInput} />
                                    </div>

                                    {error && <div className="error-msg">⚠️ {error}</div>}

                                    <button type="submit" disabled={loading} className="cyber-btn" style={{ width: '100%', padding: '1rem', background: userType === 'farmer' ? '#10B981' : '#3B82F6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' }}>
                                        {loading ? 'VERIFYING...' : 'SECURE LOGIN'}
                                    </button>
                                </form>
                            ) : (
                                <div>
                                    <div className="input-group">
                                        <label className="input-label">AADHAAR NUMBER</label>
                                        <input
                                            name="aadhaar"
                                            className="auth-input"
                                            value={credentials.aadhaar}
                                            onChange={handleInput}
                                            placeholder="XXXX XXXX XXXX"
                                            maxLength={14}
                                        />
                                    </div>

                                    {otpSent && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                            <div className="input-group">
                                                <label className="input-label">ENTER OTP</label>
                                                <input
                                                    name="otp"
                                                    className="auth-input"
                                                    value={credentials.otp}
                                                    onChange={handleInput}
                                                    placeholder="• • • • • •"
                                                    maxLength={6}
                                                    style={{ letterSpacing: '8px', textAlign: 'center', fontSize: '1.2rem' }}
                                                />
                                            </div>
                                            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: timer > 0 ? '#10B981' : '#EF4444', marginBottom: '1rem' }}>
                                                {timer > 0 ? `Resend in ${timer}s` : <span onClick={sendOtp} style={{ cursor: 'pointer', textDecoration: 'underline' }}>Resend OTP</span>}
                                            </div>
                                        </motion.div>
                                    )}

                                    {error && <div className="error-msg">⚠️ {error}</div>}

                                    {!otpSent ? (
                                        <button onClick={sendOtp} disabled={loading} className="cyber-btn" style={{ width: '100%', padding: '1rem', background: '#334155', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' }}>
                                            {loading ? 'SENDING OTP...' : 'VERIFY VIA OTP'}
                                        </button>
                                    ) : (
                                        <button onClick={verifyAadhaarLogin} disabled={loading} className="cyber-btn" style={{ width: '100%', padding: '1rem', background: '#10B981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' }}>
                                            {loading ? 'VERIFYING IDENTITY...' : 'CONFIRM & LOGIN'}
                                        </button>
                                    )}

                                    <div style={{ textAlign: 'center', margin: '1.5rem 0', color: '#64748B', fontSize: '0.8rem' }}>— OR —</div>

                                    <button
                                        className="hover-bright"
                                        style={{
                                            width: '100%', padding: '0.8rem',
                                            background: 'linear-gradient(90deg, #b91c1c 0%, #f59e0b 100%)',
                                            color: '#fff', border: 'none', borderRadius: '8px',
                                            fontWeight: 'bold', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                        }}
                                    >
                                        🏛️ LOGIN WITH TN e-SEVAI / AGRI-STACK
                                    </button>
                                </div>
                            )}

                        </motion.div>
                    )}

                    {/* Demo Role Selection */}
                    {demoMode && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="demo-selection"
                        >
                            <div className="cyber-font" style={{ color: '#F59E0B', textAlign: 'center', marginBottom: '1.5rem' }}>SELECT SIMULATION ROLE</div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div
                                    onClick={() => handleDemoSelect('farmer')}
                                    style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10B981', padding: '1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}
                                >
                                    <div style={{ fontSize: '2rem' }}>👨‍🌾</div>
                                    <div>
                                        <div style={{ fontWeight: 'bold', color: '#fff' }}>Demo Farmer</div>
                                        <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>Vellore | 5 Acres</div>
                                    </div>
                                    <div style={{ marginLeft: 'auto', color: '#10B981' }}>→</div>
                                </div>

                                <div
                                    onClick={() => handleDemoSelect('officer')}
                                    style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3B82F6', padding: '1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}
                                >
                                    <div style={{ fontSize: '2rem' }}>👔</div>
                                    <div>
                                        <div style={{ fontWeight: 'bold', color: '#fff' }}>Govt Admin (Officer)</div>
                                        <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>State Coordinator</div>
                                    </div>
                                    <div style={{ marginLeft: 'auto', color: '#3B82F6' }}>→</div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Demo Mode Toggle Switch */}
                    <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                        <span style={{ fontSize: '0.8rem', color: demoMode ? '#F59E0B' : '#64748B', fontWeight: 'bold' }}>DEMO SIMULATION MODE</span>
                        <div
                            onClick={() => setDemoMode(!demoMode)}
                            style={{
                                width: '40px', height: '22px',
                                background: demoMode ? '#F59E0B' : '#334155',
                                borderRadius: '20px',
                                position: 'relative',
                                cursor: 'pointer',
                                padding: '2px',
                                transition: 'background 0.3s'
                            }}
                        >
                            <motion.div
                                layout
                                transition={{ type: "spring", stiffness: 700, damping: 30 }}
                                style={{
                                    width: '18px', height: '18px',
                                    background: '#fff',
                                    borderRadius: '50%',
                                    marginLeft: demoMode ? '18px' : '0'
                                }}
                            />
                        </div>
                    </div>

                </div>
            </div>

            <div style={{ position: 'absolute', bottom: '2rem', left: '4rem', color: '#475569', fontSize: '0.8rem' }}>
                Powered by iTNT Hub & EDII-TN
            </div>
        </div>
    );
}
