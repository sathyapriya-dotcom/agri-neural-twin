import React, { useState, useEffect } from 'react';
import '../styles/Auth.css';
import { AgriStackService } from '../services/AgriStack';
import { dataService } from '../services/dataService';
import { useTranslation } from '../i18n';
import toast from 'react-hot-toast';

export default function ProfileSetup({ userType, onComplete }) {
    const { t } = useTranslation();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [districts, setDistricts] = useState([]);

    // Form State
    const [formData, setFormData] = useState({
        userType: userType || 'farmer',
        name: '',
        age: '',
        gender: 'Male',
        community: 'General',
        // Farmer Specific
        aadhar: '',
        surveyNo: '',
        soilType: 'Red Loam',
        waterSource: 'Borewell',
        // Officer Specific
        deptName: 'Department of Agriculture',
        jurisdiction: 'Vellore',
        employeeId: ''
    });

    useEffect(() => {
        dataService.getDistrictsList().then(list => setDistricts(list));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic Client Validation
        if (!formData.name || !formData.age) {
            toast.error("Please fill in all personal details.");
            return;
        }

        setLoading(true);
        const toastId = toast.loading("Verifying with TN AgriStack Registry...");

        try {
            // Verify with AgriStack Service (with simulated delay)
            await AgriStackService.verifyProfile(formData);

            toast.success("Identity Verified: Record Found in State Registry", { id: toastId });
            setTimeout(() => {
                onComplete(formData); // Finish Setup
            }, 1500);
        } catch (err) {
            toast.error(err.message || "Verification Failed", { id: toastId });
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-overlay"></div>

            <div className="glass-card" style={{ maxWidth: '600px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div className="cyber-font" style={{ fontSize: '1.5rem', color: '#10B981' }}>PROFILE COMPLETION</div>
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>TN STATE GOVERNMENT • {userType === 'officer' ? 'OFFICER REGISTRY' : 'FARMER REGISTRY'}</div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

                    {/* Personal Details (Common) */}
                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
                        <label className="input-label">FULL NAME (As per Aadhaar)</label>
                        <input name="name" className="auth-input" value={formData.name} onChange={handleChange} placeholder="e.g. Thiru. M. Karunanidhi" />
                    </div>

                    <div className="input-group">
                        <label className="input-label">AGE</label>
                        <input name="age" type="number" className="auth-input" value={formData.age} onChange={handleChange} placeholder="Age" />
                    </div>

                    <div className="input-group">
                        <label className="input-label">GENDER</label>
                        <select name="gender" className="auth-input" value={formData.gender} onChange={handleChange}>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </select>
                    </div>

                    {/* Conditional Fields */}
                    {userType === 'farmer' ? (
                        <>
                            <div className="input-group" style={{ gridColumn: 'span 2', borderTop: '1px solid #334155', paddingTop: '1rem', marginTop: '0.5rem' }}>
                                <label className="input-label" style={{ color: '#10B981' }}>AGRI-STACK DEEP DATA</label>
                            </div>

                            <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                <label className="input-label">AADHAAR NUMBER (12-Digit)</label>
                                <input name="aadhar" className="auth-input" value={formData.aadhar} onChange={handleChange} placeholder="XXXX XXXX XXXX" maxLength={12} />
                            </div>

                            <div className="input-group">
                                <label className="input-label">LAND SURVEY NO.</label>
                                <input name="surveyNo" className="auth-input" value={formData.surveyNo} onChange={handleChange} placeholder="e.g. 123/4B" />
                            </div>

                            <div className="input-group">
                                <label className="input-label">SOIL TYPE</label>
                                <select name="soilType" className="auth-input" value={formData.soilType} onChange={handleChange}>
                                    <option>Red Loam</option>
                                    <option>Black Cotton</option>
                                    <option>Alluvial</option>
                                    <option>Clayey</option>
                                    <option>Sandy</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <label className="input-label">WATER SOURCE</label>
                                <select name="waterSource" className="auth-input" value={formData.waterSource} onChange={handleChange}>
                                    <option>Borewell</option>
                                    <option>Canal Irrigation</option>
                                    <option>Rain-fed (Monsoon)</option>
                                    <option>River Pump</option>
                                </select>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="input-group" style={{ gridColumn: 'span 2', borderTop: '1px solid #334155', paddingTop: '1rem', marginTop: '0.5rem' }}>
                                <label className="input-label" style={{ color: '#3B82F6' }}>GOVT. CREDENTIALS</label>
                            </div>

                            <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                <label className="input-label">DEPARTMENT NAME</label>
                                <input name="deptName" className="auth-input" value={formData.deptName} onChange={handleChange} />
                            </div>

                            <div className="input-group">
                                <label className="input-label">JURISDICTION (District)</label>
                                <select name="jurisdiction" className="auth-input" value={formData.jurisdiction} onChange={handleChange}>
                                    {districts.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-group">
                                <label className="input-label">EMPLOYEE ID</label>
                                <input name="employeeId" className="auth-input" value={formData.employeeId} onChange={handleChange} placeholder="TN-GOV-XXXX" />
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="cyber-btn"
                        style={{
                            gridColumn: 'span 2',
                            background: loading ? '#334155' : '#10B981',
                            color: '#fff',
                            padding: '1rem',
                            borderRadius: '8px',
                            border: 'none',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            marginTop: '1rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                        }}
                    >
                        {loading ? 'VALIDATING WITH STATE REGISTRY...' : 'COMPLETE REGISTRATION'}
                        {!loading && <span style={{ fontSize: '1.2rem' }}>→</span>}
                    </button>

                </form>
            </div>
        </div>
    );
}
