import React, { useState, useEffect } from 'react';
import GeospatialAnalysis from './GeospatialAnalysis';
import WhatIfSimulator from './WhatIfSimulator';
import { dataService } from '../services/dataService';
import { useTranslation } from '../i18n';
import '../styles/Dashboard.css';

import { motion } from 'framer-motion';

export default function DashboardContent({ districtId }) {
    const [selectedBlock, setSelectedBlock] = useState(null);
    const [metricsData, setMetricsData] = useState(null);
    const [loadingMetrics, setLoadingMetrics] = useState(true);
    const [weatherData, setWeatherData] = useState(null);
    const { t, language } = useTranslation();

    // Fetch Metrics when District Changes
    useEffect(() => {
        setLoadingMetrics(true);
        setSelectedBlock(null);

        if (!districtId) {
            console.warn("No District ID provided to DashboardContent");
            setLoadingMetrics(false);
            return;
        }

        console.log("Fetching metrics for:", districtId);

        Promise.all([
            dataService.getDistrictMetrics(districtId),
            dataService.getRealTimeWeather(districtId)
        ]).then(([metrics, weather]) => {
            console.log("Data fetched:", metrics, weather);
            if (metrics) {
                setMetricsData(metrics);
                setWeatherData(weather);
            } else {
                console.error("Metrics data is null");
            }
            setLoadingMetrics(false);
        }).catch(err => {
            console.error("Dashboard Fetch Error:", err);
            setLoadingMetrics(false);
        });
    }, [districtId]);

    if (loadingMetrics) {
        return (
            <main className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <div className="cyber-font" style={{ color: 'var(--color-primary-emerald)', fontSize: '1.5rem', animation: 'pulse 1s infinite' }}>
                    {t('loading')}
                </div>
            </main>
        );
    }

    if (!metricsData) {
        return (
            <main className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column' }}>
                <div style={{ color: '#EF4444', fontSize: '1.2rem', marginBottom: '1rem' }}>⚠️ UNABLE TO ESTABLISH NEURAL LINK</div>
                <div style={{ color: '#94a3b8' }}>District Data Unavailable for ID: {districtId}</div>
                <button
                    onClick={() => window.location.reload()}
                    className="cyber-btn"
                    style={{ marginTop: '1rem', background: '#334155' }}
                >
                    RETRY CONNECTION
                </button>
            </main>
        );
    }

    const metrics = [
        { title: t('soil_nitrogen'), value: metricsData.nitrogen, unit: "mg/kg", trend: "Recalibrating...", status: "optimal" },
        { title: t('phosphorus'), value: metricsData.phosphorus, unit: "mg/kg", trend: t('alert_warning'), status: metricsData.phosphorus < 10 ? "alert" : "optimal" },
        { title: t('potassium'), value: metricsData.potassium, unit: "mg/kg", trend: "Optimal", status: "optimal" },
        { title: t('irrigation'), value: metricsData.irrigation, unit: "%", trend: "Surplus", status: metricsData.irrigation > 80 ? "optimal" : "alert" },
        { title: t('pest_activity'), value: metricsData.pests, unit: "Index", trend: "Safe", status: metricsData.pests > 2 ? "alert" : "safe" },
        { title: t('yield_forecast'), value: metricsData.yield, unit: "", trend: "Improving", status: "optimal" },
    ];

    return (
        <motion.main
            key={language}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="main-content"
        >
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="cyber-font" style={{ margin: 0, color: 'var(--color-primary-emerald)', fontSize: '1.5rem', textTransform: 'uppercase' }}>
                    {t(metricsData.name.toLowerCase())} {t('sector_command')}
                </h2>
                <span className="cyber-font" style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    {t('node')}: {districtId.toUpperCase()} | {t('status_online')}
                </span>
            </div>

            <div className="command-center-grid animate-fade-in">

                {/* Left: Real-time Sensors */}
                <div className="sensor-panel">
                    <div className="card-title cyber-font" style={{ marginBottom: '0.5rem' }}>{t('live_telemetry')}</div>
                    {metrics.map((metric, idx) => (
                        <div key={idx} className={`sensor-card ${metric.status === 'alert' ? 'alert' : ''}`}>
                            <div className="sensor-label">{metric.title}</div>
                            <div className="sensor-value">
                                {metric.value} <span style={{ fontSize: '1rem', color: '#64748B' }}>{metric.unit}</span>
                            </div>
                            <div style={{ fontSize: '0.7rem', color: metric.status === 'alert' ? '#FDA4AF' : '#64748B', marginTop: '0.2rem' }}>
                                {metric.trend}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Center: Geospatial Twin */}
                <div className="geo-panel">
                    <GeospatialAnalysis districtId={districtId} selectedBlock={selectedBlock} onSelect={setSelectedBlock} />
                </div>

                {/* Right: Simulation Controls */}
                <div className="control-panel" id="what-if-analysis">
                    <WhatIfSimulator
                        districtName={metricsData.name}
                        initialWeather={weatherData}
                        onSimulate={(data) => console.log("Simulation Update:", data)}
                    />
                </div>
            </div>
        </motion.main>
    );
}
