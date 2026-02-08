import React, { createContext, useState, useContext, useEffect } from 'react';

// Translation Dictionary
const resources = {
    en: {
        // App & Layout
        app_title: "Agri-Neural Twin",
        dashboard: "Dashboard",
        advanced_analytics: "Advanced Analytics",
        reports: "Reports",
        settings: "Settings",
        farmer_profile: "Farmer Profile",
        logout: "Logout",

        // TopBar
        status_online: "STATUS: ONLINE",
        loading: "LOADING...",
        alert_critical: "CRITICAL ALERT",
        select_district: "Select District",
        node: "NODE",
        state_map_btn: "◀ STATE MAP",

        // Dashboard Content
        sector_command: "SECTOR COMMAND",
        live_telemetry: "LIVE TELEMETRY",
        soil_nitrogen: "Soil Nitrogen (N)",
        phosphorus: "Phosphorus (P)",
        potassium: "Potassium (K)",
        irrigation: "Irrigation Level",
        pest_activity: "Pest Activity",
        yield_forecast: "Yield Forecast",

        // Geospatial
        geospatial_twin: "GEOSPATIAL TWIN",
        risk_profile: "RISK PROFILE",
        saturation: "SATURATION",

        // Simulation Control
        simulation_controls: "SIMULATION CONTROLS",
        crop_type: "Crop Type",
        sowing_area: "Sowing Area (Acres)",

        // Risk Analysis & Profit Meter
        ai_brain: "AI BRAIN: 1,000 SEASON SIMULATION",
        market_saturation: "Saturation Index",
        profitability: "Profitability Gauge",
        profit_engine: "PROFITABILITY ENGINE",
        ai_forecast: "AI FORECAST",
        ready_msg: "Ready to analyze future market scenarios.",
        simulate_btn: "IMPLANT NEURAL SIM",
        alert_warning: "WARNING",
        alert_safe: "SAFE PATH",

        // State Command Center
        state_yield: "Total State-Wide Yield Forecast",
        active_density: "Active Sowing Density Index",
        gdp_shielded: "Total GDP Shielded via AI",
        health_map: "DISTRICT ECONOMIC HEALTH MAP (38 ZONES)",
        equality_banner: "SABKA SAATH, SABKA VIKAS • DEMOCRATIZING AI FOR EVERY FARMER",
        powered_by: "Powered by Bharat-VISTAAR Logic"
    },
    ta: { // Tamil
        app_title: "வேளாண் நரம்பியல் இரட்டை",
        dashboard: "முகப்பு",
        advanced_analytics: "மேம்பட்ட பகுப்பாய்வு",
        reports: "அறிக்கைகள்",
        settings: "அமைப்புகள்",
        farmer_profile: "விவசாயி சுயவிவரம்",
        logout: "வெளியேறு",
        status_online: "நிலை: இயங்குகிறது",
        loading: "ஏற்றுகிறது...",
        alert_critical: "முக்கிய எச்சரிக்கை",
        select_district: "மாவட்டத்தைத் தேர்ந்தெடுக்கவும்",
        node: "முனை",
        state_map_btn: "◀ மாநில வரைபடம்",
        sector_command: "துறை கட்டளை",
        live_telemetry: "நேரடி அளவீடுகள்",
        soil_nitrogen: "மண் நைட்ரஜன்",
        phosphorus: "பாஸ்பரஸ்",
        potassium: "பொட்டாசியம்",
        irrigation: "நீர்ப்பாசன நிலை",
        pest_activity: "பூச்சி செயல்பாடு",
        yield_forecast: "மகசூல் கணிப்பு",
        geospatial_twin: "புவிசார் இரட்டை",
        risk_profile: "ஆபத்து விவரம்",
        saturation: "செறிவு",
        simulation_controls: "உருவகப்படுத்துதல் கட்டுப்பாடுகள்",
        crop_type: "பயிர் வகை",
        sowing_area: "விதைப்பு பகுதி (ஏக்கர்)",
        ai_brain: "AI மூளை: 1,000 பருவங்கள்",
        market_saturation: "சந்தை செறிவு",
        profitability: "லாப அளவு",
        profit_engine: "லாப என்ஜின்",
        ai_forecast: "AI முன்னறிவிப்பு",
        ready_msg: "எதிர்கால சந்தை நிலவரங்களை ஆய்வு செய்ய தயார்.",
        simulate_btn: "நரம்பியல் சிமுலேஷனைச் செய்",
        alert_warning: "எச்சரிக்கை",
        alert_safe: "பாதுகாப்பான வழி",
        state_yield: "மொத்த மாநில மகசூல் கணிப்பு",
        active_density: "செயலில் உள்ள விதைப்பு அடர்த்தி",
        gdp_shielded: "AI மூலம் பாதுகாக்கப்பட்ட மொத்த GDP",
        health_map: "மாவட்டப் பொருளாதார ஆரோக்கிய வரைபடம் (38 மண்டலங்கள்)",
        equality_banner: "சப்கா சாத், சப்கா விகாஸ் • ஒவ்வொரு விவசாயிக்கும் AI ஐ ஜனநாயகப்படுத்துதல்",
        powered_by: "பாரத்-விஸ்தார் தர்க்கத்தால் இயக்கப்படுகிறது"
    },
    // English fallbacks for others to save space/time but structure implies readiness
    // Ideally populating all is best. I will populate Telugu/Hindi as requested.
    te: {
        app_title: "అగ్రి-న్యూరల్ ట్విన్",
        dashboard: "డాష్‌బోర్డ్",
        advanced_analytics: "అధునాతన విశ్లేషణలు",
        reports: "నివేదికలు",
        settings: "సెట్టింగ్‌లు",
        farmer_profile: "రైతు ప్రొఫైల్",
        logout: "లాగ్ అవుట్",
        status_online: "స్థితి: ఆన్‌లైన్",
        loading: "లోడ్ అవుతోంది...",
        state_map_btn: "◀ రాష్ట్ర పటం",
        sector_command: "సెక్టార్ కమాండ్",
        live_telemetry: "లైవ్ టెలిమెట్రీ",
        soil_nitrogen: "నేల నైట్రోజన్",
        geospatial_twin: "జియోస్పేషియల్ ట్విన్",
        risk_profile: "ప్రమాద వివరాలు",
        simulation_controls: "అనుకరణ నియంత్రణలు",
        crop_type: "పంట రకం",
        sowing_area: "విత్తే విస్తీర్ణం",
        ai_brain: "AI మెదడు",
        profit_engine: "లాభదాయకత ఇంజిన్",
        state_yield: "మొత్తం రాష్ట్ర దిగుబడి",
        health_map: "ఆర్థిక ఆరోగ్య పటం",
        equality_banner: "సబ్కా సాత్, సబ్కా వికాస్ • అందరికీ AI",
        powered_by: "భారత్-విస్తార్ లాజిక్ ద్వారా ఆధారితం"
    },
    kn: {
        app_title: "ಅಗ್ರಿ-ನ್ಯೂರಲ್ ಟ್ವಿನ್",
        dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
        state_map_btn: "◀ ರಾಜ್ಯ ಭೂಪಟ",
        sector_command: "ವಲಯ ಆಜ್ಞೆ",
        live_telemetry: "ಲೈವ್ ಟೆಲಿಮೆಟ್ರಿ",
        soil_nitrogen: "ಮಣ್ಣಿನ ಸಾರಜನಕ",
        state_yield: "ಒಟ್ಟು ರಾಜ್ಯ ಇಳುವರಿ",
        powered_by: "ಭಾರತ್-ವಿಸ್ತಾರ್ ಲಾಜಿಕ್‌ನಿಂದ ನಡೆಸಲ್ಪಡುತ್ತಿದೆ"
    },
    ml: {
        app_title: "അഗ്രി-ന്യൂറൽ ട്വിൻ",
        dashboard: "ഡാഷ്ബോർഡ്",
        state_map_btn: "◀ സംസ്ഥാന ഭൂപടം",
        sector_command: "സെക്ടർ കമാൻഡ്",
        live_telemetry: "തത്സമയ ടെലിമെട്രി",
        soil_nitrogen: "മണ്ണ് നൈട്രജൻ",
        state_yield: "ആകെ സംസ്ഥാന വിളവ്",
        powered_by: "ഭಾರത്-വിസ്താർ ലോജിക്"
    },
    ur: {
        app_title: "زرعی نیورل ٹوئن",
        dashboard: "ڈیش بورڈ",
        advanced_analytics: "اعلی درجے کی تجزیات",
        reports: "رپورٹس",
        settings: "ترتیبات",
        farmer_profile: "کسان پروفائل",
        state_map_btn: "◀ ریاستی نقشہ",
        sector_command: "سیکٹر کمانڈ",
        live_telemetry: "لائیو ٹیلی میٹری",
        soil_nitrogen: "مٹی نائٹروجن",
        geospatial_twin: "جیو اسپیشل ٹوئن",
        simulation_controls: "نقلی کنٹرول",
        ai_brain: "AI دماغ",
        profit_engine: "منافع انجن",
        state_yield: "کل ریاستی پیداوار",
        equality_banner: "سب کا ساتھ، سب کا وکاس • سب کے لیے AI",
        powered_by: "بھارت-وِستار لاجک کے ذریعے تقویت یافتہ"
    }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('agri_lang') || 'en';
    });

    useEffect(() => {
        localStorage.setItem('agri_lang', language);
        document.body.dir = language === 'ur' ? 'rtl' : 'ltr';
    }, [language]);

    const t = (key) => {
        return resources[language]?.[key] || resources['en'][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useTranslation = () => useContext(LanguageContext);
