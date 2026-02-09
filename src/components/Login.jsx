import React, { useState, useEffect } from 'react';
import '../styles/Auth.css';
import { useTranslation } from '../i18n';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function Login({ onLogin }) {
    const { t } = useTranslation();
    const [userType, setUserType] = useState('farmer');
    const [credentials, setCredentials] = useState({ id: '', mobile: '', password: '' });
    const [demoMode, setDemoMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const DEMO_FARMER = { id: 'TN-VEL-001', mobile: '9876543210', password: 'password123' };
    const DEMO_OFFICER = { id: 'EDII-TN-ADMIN', mobile: '9988776655', password: 'adminpass' };

    useEffect(() => {
        if (!demoMode) setCredentials({ id: '', mobile: '', password: '' });
    }, [demoMode]);

    const handleInput = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
        setError('');
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
        setCredentials(creds);
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

                <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }} style={{ zIndex: 2 }}>
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
                </motion.div>
            </div>

            {/* RIGHT: Login Form Container */}
            <div style={{ flex: '0 0 45%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(10px)', borderLeft: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 10 }}>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
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
                            <div className="user-type-toggle" style={{ marginBottom: '1.5rem' }}>
                                <button className={`toggle-btn ${userType === 'farmer' ? 'active' : ''}`} onClick={() => setUserType('farmer')}>👨‍🌾 Farmer</button>
                                <button className={`toggle-btn officer ${userType === 'officer' ? 'active' : ''}`} onClick={() => setUserType('officer')}>👔 Officer</button>
                            </div>

                            <form onSubmit={handleSubmit}>
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

                </motion.div>
            </div>

            <div style={{ position: 'absolute', bottom: '2rem', left: '4rem', color: '#475569', fontSize: '0.8rem' }}>
                Powered by iTNT Hub & EDII-TN
            </div>
        </div>
    );
}
