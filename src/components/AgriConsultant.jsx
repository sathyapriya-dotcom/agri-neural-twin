import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GeminiService } from '../services/GeminiService';
import { useTranslation } from '../i18n';
import '../styles/Dashboard.css'; // Reusing dashboard styles for consistency

export default function AgriConsultant({ context }) {
    const { t, language } = useTranslation();
    const [advice, setAdvice] = useState('');
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Auto-generate advice when opened or context changes purely
    useEffect(() => {
        if (isOpen && !advice) {
            handleConsult();
        }
    }, [isOpen]);

    const handleConsult = async () => {
        setLoading(true);
        setAdvice(''); // Clear old

        try {
            const aiResponse = await GeminiService.generateAdvisory({ ...context, language });
            // Simulate typewriter effect by setting it fully, but CSS/Motion will handle display
            setAdvice(aiResponse);
        } catch (e) {
            setAdvice("Network Error: Unable to reach AI Brain.");
        } finally {
            setLoading(false);
        }
    };

    // Typewriter effect logic
    const [displayedText, setDisplayedText] = useState('');
    useEffect(() => {
        if (advice) {
            let i = 0;
            setDisplayedText('');
            const interval = setInterval(() => {
                setDisplayedText(prev => prev + advice.charAt(i));
                i++;
                if (i >= advice.length) clearInterval(interval);
            }, 30); // Speed of typing
            return () => clearInterval(interval);
        }
    }, [advice]);

    return (
        <div className="agri-consultant-widget">

            {/* Collapsed State / Trigger Button */}
            {!isOpen && (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(true)}
                    className="cyber-btn"
                    style={{
                        background: 'linear-gradient(135deg, #2563EB, #9333EA)', // AI Purple/Blue theme
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                        boxShadow: '0 0 15px rgba(147, 51, 234, 0.5)'
                    }}
                >
                    <span style={{ fontSize: '1.2rem' }}>✨</span> AI CONSULTANT
                </motion.button>
            )}

            {/* Expanded Interface */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ overflow: 'hidden', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid #9333EA', borderRadius: '8px', padding: '1rem', marginTop: '1rem' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 className="cyber-font" style={{ margin: 0, color: '#A855F7', fontSize: '1.1rem' }}>GEMINI AGRI-BRAIN</h3>
                            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer' }}>✖</button>
                        </div>

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '1rem', color: '#94a3b8' }}>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                    style={{ display: 'inline-block', fontSize: '1.5rem', marginBottom: '0.5rem' }}
                                >
                                    ❄️
                                </motion.div>
                                <div>Analyzing Satellite & Market Data...</div>
                            </div>
                        ) : (
                            <div style={{
                                fontFamily: 'Share Tech Mono',
                                whiteSpace: 'pre-line',
                                lineHeight: '1.6',
                                color: '#E2E8F0',
                                minHeight: '100px'
                            }}>
                                {displayedText}
                                <motion.span
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ repeat: Infinity, duration: 0.8 }}
                                >|</motion.span>
                            </div>
                        )}

                        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button
                                onClick={handleConsult}
                                style={{ background: 'rgba(147, 51, 234, 0.1)', border: '1px solid #9333EA', color: '#A855F7', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                            >
                                ⟳ REGENERATE
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
