import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n';
import toast, { Toaster } from 'react-hot-toast';
import '../styles/Dashboard.css';

export default function Settings({ onLogout }) {
    const { t, language, setLanguage } = useTranslation();
    const [highContrast, setHighContrast] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [aiSensitivity, setAiSensitivity] = useState(75);

    const toggleHighContrast = () => {
        const newState = !highContrast;
        setHighContrast(newState);
        if (newState) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
        toast.success(newState ? 'High Contrast: ENABLED' : 'High Contrast: DISABLED');
    };

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
        toast.success(`Language changed to ${e.target.options[e.target.selectedIndex].text}`);
    };

    const clearCache = () => {
        localStorage.clear();
        toast.success("Local Cache Cleared. Session Reset.");
        setTimeout(() => {
            if (onLogout) onLogout();
            else window.location.reload();
        }, 1500);
    };

    return (
        <div style={{ padding: '2rem', color: '#fff', maxWidth: '800px', margin: '0 auto' }}>
            <Toaster position="top-right" />
            <h2 className="cyber-font" style={{ color: '#3B82F6', borderBottom: '1px solid #334155', paddingBottom: '1rem' }}>
                {t('settings')} // SYSTEM CONFIG
            </h2>

            <div style={{ display: 'grid', gap: '2rem', marginTop: '2rem' }}>

                {/* Appearance */}
                <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '8px', border: '1px solid #334155' }}>
                    <h3 className="cyber-font" style={{ fontSize: '1rem', color: '#e2e8f0', marginBottom: '1rem' }}>INTERFACE PREFERENCES</h3>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span>High Contrast Mode (Accessibility)</span>
                        <button
                            onClick={toggleHighContrast}
                            style={{
                                background: highContrast ? '#10B981' : '#334155',
                                color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer'
                            }}
                        >
                            {highContrast ? 'ON' : 'OFF'}
                        </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Language Preference (Bharat-VISTAAR)</span>
                        <select
                            value={language}
                            onChange={handleLanguageChange}
                            style={{ background: '#0f172a', color: '#fff', border: '1px solid #334155', padding: '0.5rem', borderRadius: '4px' }}
                        >
                            <option value="en">English</option>
                            <option value="ta">தமிழ் (Tamil)</option>
                            <option value="te">తెలుగు (Telugu)</option>
                            <option value="kn">ಕನ್ನಡ (Kannada)</option>
                            <option value="ml">മലയാളം (Malayalam)</option>
                            <option value="ur">اردو (Urdu)</option>
                        </select>
                    </div>
                </div>

                {/* AI Configuration */}
                <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '8px', border: '1px solid #334155' }}>
                    <h3 className="cyber-font" style={{ fontSize: '1rem', color: '#e2e8f0', marginBottom: '1rem' }}>AI NEURAL ENGINE</h3>

                    <div style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>Risk Sensitivity Threshold</span>
                            <span style={{ color: '#10B981' }}>{aiSensitivity}%</span>
                        </div>
                        <input
                            type="range" min="0" max="100" value={aiSensitivity}
                            onChange={(e) => setAiSensitivity(e.target.value)}
                            style={{ width: '100%', accentColor: '#10B981' }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Real-time Risk Notifications</span>
                        <button
                            onClick={() => { setNotifications(!notifications); toast(notifications ? 'Notifications Muted' : 'Notifications Active'); }}
                            style={{
                                background: notifications ? '#10B981' : '#334155',
                                color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer'
                            }}
                        >
                            {notifications ? 'ACTIVE' : 'MUTED'}
                        </button>
                    </div>
                </div>

                {/* Session Management */}
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1.5rem', borderRadius: '8px', border: '1px solid #EF4444' }}>
                    <h3 className="cyber-font" style={{ fontSize: '1rem', color: '#EF4444', marginBottom: '1rem' }}>DANGER ZONE</h3>

                    <button
                        onClick={clearCache}
                        style={{
                            background: '#EF4444',
                            color: '#fff', border: 'none', padding: '1rem', borderRadius: '4px', cursor: 'pointer', width: '100%', fontWeight: 'bold'
                        }}
                    >
                        LOGOUT & CLEAR SESSION DATA
                    </button>
                </div>

            </div>
        </div>
    );
}
