import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useTranslation } from '../i18n';
import LanguageSelector from './LanguageSelector';
import { StateBrain } from '../services/StateBrain';

export default function TopBar({ selectedDistrict, onDistrictChange, districts, loading, viewMode, setViewMode, onLogout }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [criticalAlert, setCriticalAlert] = useState(null);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [isAlertHovered, setIsAlertHovered] = useState(false);

    useEffect(() => {
        if (!selectedDistrict) return;

        // Dynamic Alert Logic: Check StateBrain for high saturation risks
        // For simulation purposes, we check 'tomato' for Vellore to trigger the demo scenario
        const cropToCheck = selectedDistrict.toLowerCase() === 'vellore' ? 'tomato' : null;

        let alertData = null;
        if (cropToCheck) {
            const risk = StateBrain.analyzeCrossDistrictRisk(selectedDistrict, cropToCheck);
            if (risk && risk.alertType === 'saturation_warning') {
                alertData = {
                    title: t('alert_critical'),
                    message: `⚠️ CRITICAL: ${cropToCheck.toUpperCase()} OVER-SUPPLY DETECTED IN ${selectedDistrict.toUpperCase()}!`,
                    details: risk.message
                };
            }
        }
        setCriticalAlert(alertData);

    }, [selectedDistrict, t]);

    const handleAlertClick = () => {
        const section = document.getElementById('what-if-analysis');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
            // Visual feedback
            section.style.border = '2px solid #EF4444';
            section.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.4)';
            setTimeout(() => {
                section.style.border = 'none';
                section.style.boxShadow = 'none';
            }, 2000);
        }
    };

    return (
        <header className="topbar" style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem', background: '#1e293b', borderBottom: '1px solid #334155', alignItems: 'center' }}>

            {/* **LEFT ALIGNED: LOGOUT & SYSTEM STATUS** */}
            <div className="system-status" style={{ gap: '1.5rem', alignItems: 'center', display: 'flex' }}>

                {/* 1. Functional Logout */}
                <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="cyber-font"
                    style={{
                        background: '#334155',
                        border: '1px solid #475569',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '4px',
                        color: '#EF4444',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        transition: 'background 0.3s'
                    }}
                    title={t('logout')}
                >
                    🛑 EXIT
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="status-indicator" style={{ background: '#10B981', width: '8px', height: '8px', borderRadius: '50%', boxShadow: '0 0 5px #10B981' }}></span>
                    <span className="cyber-font" style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{t('status_online')}</span>
                </div>

                {/* State Map Button */}
                {viewMode === 'district' && setViewMode && (
                    <button
                        onClick={() => setViewMode('state')}
                        className="cyber-font"
                        style={{
                            background: 'var(--color-secondary-teal)',
                            border: 'none',
                            padding: '0.3rem 0.8rem',
                            borderRadius: '4px',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                        }}
                    >
                        ◀ STATE MAP
                    </button>
                )}

                {/* Branding */}
                <div className="cyber-font" style={{ fontSize: '0.7rem', border: '1px solid var(--color-border)', padding: '2px 8px', color: '#64748B', borderRadius: '4px' }}>
                    iTNT HUB
                </div>
            </div>

            {/* **RIGHT ALIGNED: CONTROLS & ALERT** */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>

                {/* District Selector */}
                <div style={{ position: 'relative' }}>
                    {loading ? (
                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }} className="cyber-font">{t('loading')}</div>
                    ) : (
                        <select
                            value={selectedDistrict}
                            onChange={(e) => {
                                onDistrictChange(e.target.value);
                                if (setViewMode) setViewMode('district');
                            }}
                            className="cyber-font"
                            style={{
                                background: 'var(--color-bg-panel)',
                                border: '1px solid var(--color-secondary-teal)',
                                padding: '0.4rem 2rem 0.4rem 0.8rem',
                                borderRadius: '4px',
                                color: 'var(--color-text-main)',
                                cursor: 'pointer',
                                fontWeight: '500',
                                appearance: 'none',
                                minWidth: '180px',
                                textTransform: 'uppercase',
                                fontSize: '0.9rem'
                            }}
                        >
                            {districts && districts.map(d => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
                    )}
                    {!loading && <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-primary-emerald)' }}>▼</span>}
                </div>

                {/* Language Selector */}
                <LanguageSelector />

                {/* 2. CRITICAL ALERT (Connected to Simulation) */}
                {criticalAlert && (
                    <div
                        style={{ position: 'relative' }}
                        onMouseEnter={() => setIsAlertHovered(true)}
                        onMouseLeave={() => setIsAlertHovered(false)}
                    >
                        <button
                            onClick={handleAlertClick}
                            className="cyber-font"
                            style={{
                                background: 'var(--color-alert-red)',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '4px',
                                color: 'white',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                animation: 'pulse 1.5s infinite',
                                boxShadow: '0 0 15px rgba(239, 68, 68, 0.5)',
                                display: 'flex', alignItems: 'center', gap: '0.5rem'
                            }}
                        >
                            ⚠️ {criticalAlert.title}
                        </button>

                        {/* Custom Hover Tooltip */}
                        {isAlertHovered && (
                            <div style={{
                                position: 'absolute', top: '120%', right: 0,
                                background: 'rgba(30, 41, 59, 0.95)', padding: '12px',
                                border: '1px solid #EF4444', borderRadius: '4px',
                                width: '280px', zIndex: 100, fontSize: '0.8rem',
                                color: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                                backdropFilter: 'blur(4px)'
                            }}>
                                <strong style={{ color: '#EF4444', display: 'block', marginBottom: '4px' }}>SATURATION WARNING</strong>
                                {criticalAlert.message}
                                <div style={{ marginTop: '8px', fontSize: '0.7rem', color: '#94a3b8' }}>
                                    Action: Click to simulate impact.
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                    <div className="glass-card" style={{ maxWidth: '400px', padding: '2rem', textAlign: 'center', background: 'rgba(30, 41, 59, 0.95)', border: '1px solid #EF4444', borderRadius: '12px', boxShadow: '0 0 50px rgba(239, 68, 68, 0.2)' }}>

                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                        <h3 className="cyber-font" style={{ color: '#EF4444', fontSize: '1.5rem', marginBottom: '0.5rem' }}>TERMINATE SESSION?</h3>

                        <p style={{ color: '#cbd5e1', margin: '1rem 0', fontFamily: 'Share Tech Mono', fontSize: '0.9rem' }}>
                            Secure Protocol: This will clear all local cache and reset user access tokens.
                        </p>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="cyber-font"
                                style={{ background: '#334155', color: '#fff', border: '1px solid #475569', padding: '0.8rem 1.5rem', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                CANCEL
                            </button>
                            <button
                                onClick={() => {
                                    // 1. UI Feedback
                                    const toastId = toast.loading('Logging out...');

                                    setTimeout(() => {
                                        // 2. Cleanup & Redirect
                                        toast.dismiss(toastId);
                                        setShowLogoutConfirm(false); // Close modal while mounted
                                        navigate('/'); // Ensure navigation intent

                                        // 3. Clear Session & State (triggers unmount)
                                        console.log("Calling onLogout...");
                                        onLogout();
                                    }, 1000);
                                }}
                                className="cyber-font"
                                style={{ background: '#EF4444', color: '#fff', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 0 15px rgba(239, 68, 68, 0.4)' }}
                            >
                                CONFIRM
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
