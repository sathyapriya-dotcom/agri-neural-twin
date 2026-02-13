import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateMarketRisk } from '../services/simulationEngine';
import AgriConsultant from './AgriConsultant';
import '../styles/WhatIfSimulator.css';

export default function WhatIfSimulator({ onSimulate, districtName = 'Vellore', initialWeather }) {
    const [density, setDensity] = useState(1.0);
    // Use initial weather risk modifier if available (0.1 to 1.0)
    const [weather, setWeather] = useState(initialWeather ? initialWeather.riskMod : 1.0);
    const [result, setResult] = useState(null);

    // Run simulation on every slider change
    useEffect(() => {
        const simResult = calculateMarketRisk({
            sowingDensity: density,
            historicalAvgPrice: 20, // Baseline for demo
            weatherFactor: weather,
            cropName: 'Tomato'
        });
        setResult(simResult);

        // Send data back to parent
        if (onSimulate) {
            onSimulate(simResult);
        }
    }, [density, weather, onSimulate]);

    if (!result) return null;

    const getRiskColor = () => result.statusColor;

    return (
        <div className="simulator-panel glass-card">
            <div className="panel-header">
                <h2 className="cyber-font">WHAT-IF SIMULATOR</h2>
                <div className="status-indicator">
                    <span
                        className="indicator-dot"
                        style={{ background: getRiskColor(), boxShadow: `0 0 10px ${getRiskColor()}` }}
                    />
                    LIVE
                </div>
            </div>

            <div className="controls-grid">
                {/* Sowing Density Slider */}
                <div className="control-group">
                    <div className="label-row">
                        <label>SOWING DENSITY</label>
                        <span className="value-readout" style={{ color: density > 1.2 ? '#F59E0B' : '#10B981' }}>
                            x{density.toFixed(1)}
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0.5"
                        max="2.5"
                        step="0.1"
                        value={density}
                        onChange={(e) => setDensity(parseFloat(e.target.value))}
                        className="cyber-slider"
                    />
                    <div className="slider-scale">
                        <span>Scarcity</span>
                        <span>Glut</span>
                    </div>
                </div>

                {/* Weather Factor Slider */}
                <div className="control-group">
                    <div className="label-row">
                        <label>WEATHER FACTOR {initialWeather && `(${initialWeather.condition})`}</label>
                        <span className="value-readout" style={{ color: weather < 0.6 ? '#EF4444' : '#3B82F6' }}>
                            {(weather * 100).toFixed(0)}%
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.1"
                        value={weather}
                        onChange={(e) => setWeather(parseFloat(e.target.value))}
                        className="cyber-slider weather-slider"
                    />
                    <div className="slider-scale">
                        <span>Drought</span>
                        <span>Ideal</span>
                    </div>
                </div>
            </div>

            {/* Results Display */}
            <div className="results-container">
                <div className="metric-box">
                    <div className="metric-label">PREDICTED PRICE</div>
                    <motion.div
                        key={result.predictedPrice}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="metric-value cyber-font"
                    >
                        ₹{result.predictedPrice}
                    </motion.div>
                </div>

                <div className="metric-box">
                    <div className="metric-label">RISK LEVEL</div>
                    <motion.div
                        key={result.riskLevel}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="risk-badge"
                        style={{
                            color: result.statusColor,
                            borderColor: result.statusColor,
                            background: `${result.statusColor}20`
                        }}
                    >
                        {result.riskLevel.toUpperCase()}
                    </motion.div>
                </div>
            </div>

            {/* Recommendation Engine */}
            <AnimatePresence mode='wait'>
                <motion.div
                    key={result.recommendation}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ai-recommendation"
                    style={{ borderLeft: `4px solid ${result.statusColor}` }}
                >
                    <div className="ai-label">SYSTEM STATUS:</div>
                    <p>{result.recommendation}</p>
                </motion.div>
            </AnimatePresence>

            {/* Deep AI Consultant Integration */}
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                <AgriConsultant
                    context={{
                        crop: 'Tomato',
                        district: districtName,
                        acreage: 5, // Mock for now, ideally passed from parent
                        riskLevel: result.riskLevel,
                        weather: initialWeather || { condition: weather < 0.6 ? 'Heavy Rain' : 'Clear Sky' }
                    }}
                />
            </div>
        </div>
    );
}
